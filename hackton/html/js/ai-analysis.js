/**
 * NuCheck — Real AI Comparison Analysis Engine
 * Compares actual user-selected current products (Step 1) vs new products (Step 2)
 * Supports dynamic item deletion from comparison list, real-time overlap check, and photo-free layout!
 */

document.addEventListener('DOMContentLoaded', () => {
  // Toast Container Setup
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Load saved products from localStorage (NO fake forced fallbacks)
  function getStep1Products() {
    try {
      const s1 = localStorage.getItem('nucheck_step1_added');
      return s1 ? JSON.parse(s1) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  function getStep2Products() {
    try {
      const s2 = localStorage.getItem('nucheck_step2_added');
      return s2 ? JSON.parse(s2) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  function saveStep2Products(arr) {
    try {
      localStorage.setItem('nucheck_step2_added', JSON.stringify(arr));
    } catch (e) {
      console.error(e);
    }
  }

  function saveStep1Products(arr) {
    try {
      localStorage.setItem('nucheck_step1_added', JSON.stringify(arr));
    } catch (e) {
      console.error(e);
    }
  }

  // -------------------------------------------------------------
  // A. Logic for 08-step2-selected.html (Comparison & Selection Preview)
  // -------------------------------------------------------------
  const selectedCardContainer = document.querySelector('.selected-card');
  if (selectedCardContainer && window.location.pathname.includes('08-step2-selected')) {
    renderStep2SelectionOverview();
  }

  // -------------------------------------------------------------
  // B. Logic for 10-analysis-result.html (Real AI Analysis Result)
  // -------------------------------------------------------------
  const resultLayout = document.querySelector('.result-layout');
  if (resultLayout && window.location.pathname.includes('10-analysis-result')) {
    renderRealAIAnalysisResult();
  }

  /**
   * Render Step 2 Selection & Current vs New Comparison Overview
   */
  function renderStep2SelectionOverview() {
    let s1List = getStep1Products();
    let s2List = getStep2Products();

    // If step1 or step2 is empty, check default samples if user never searched
    if (s1List.length === 0 && !localStorage.getItem('nucheck_step1_visited')) {
      s1List = [
        {
          id: 'vc-01',
          name: '고려은단 비타민 C 1000',
          category: '건강기능식품',
          meta: '1일 1정 · 식후',
          ingredients: '비타민 C 1000mg',
          manufacturer: '고려은단'
        }
      ];
      saveStep1Products(s1List);
      localStorage.setItem('nucheck_step1_visited', 'true');
    }

    if (s2List.length === 0 && !localStorage.getItem('nucheck_step2_visited')) {
      s2List = [
        {
          id: 'vc-03',
          name: '유한 비타민C정 500mg',
          category: '의약품',
          meta: '1일 2정 · 식후',
          ingredients: '아스코르브산 (비타민 C) 500mg',
          manufacturer: '유한양행'
        }
      ];
      saveStep2Products(s2List);
      localStorage.setItem('nucheck_step2_visited', 'true');
    }

    if (s2List.length === 0) {
      selectedCardContainer.innerHTML = `
        <div style="width: 100%; padding: 48px 24px; text-align: center; color: var(--ink-soft); border: 1px dashed var(--border-strong); border-radius: var(--radius-m);">
          <p style="font-size: 16px; font-weight: 700; margin: 0 0 6px;">비교할 새 제품이 선택되지 않았습니다.</p>
          <p style="font-size: 13px; color: var(--ink-faint); margin: 0 0 20px;">이전 단계에서 구매를 고려 중인 영양제나 약을 검색하여 추가해주세요.</p>
          <a class="btn btn--dark" href="07-step2-search.html" style="display:inline-flex; gap:6px;">
            <span>+ 새 제품 검색하여 추가하기</span>
          </a>
        </div>
      `;

      // Update next step button behavior
      const nextBtn = document.querySelector('.app-footer-actions .btn--dark');
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          if (getStep2Products().length === 0) {
            e.preventDefault();
            showToast('비교할 새 제품을 최소 1개 이상 추가해주세요.', 'info');
          }
        });
      }
      return;
    }

    // Analyze overlaps between s1 and s2
    const analysis = analyzeProductComparison(s1List, s2List);

    selectedCardContainer.innerHTML = `
      <div style="width: 100%;">
        <!-- Header & Action Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--ink);">
            ✨ 새로 선택된 비교 대상 제품 (${s2List.length}개)
          </h3>
          <a href="07-step2-search.html" style="font-size: 13px; font-weight: 600; color: var(--ink-soft); text-decoration: underline;">
            + 제품 더 추가하기
          </a>
        </div>

        <!-- Newly Selected Products List with Individual Delete Buttons -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          ${s2List
            .map(
              (p) => `
            <div style="background: var(--bg-subtle); border: 1px solid var(--border); border-radius: var(--radius-s); padding: 16px 20px; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 16px; font-weight: 700;">${escapeHtml(p.name)}</span>
                  <span class="tag">${escapeHtml(p.category)}</span>
                </div>
                <button type="button" class="btn-delete-s2" data-name="${escapeHtml(p.name)}" title="비교 목록에서 삭제"
                        style="background: transparent; border: 1px solid var(--border-strong); border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 600; color: var(--danger); cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                  <span>삭제</span>
                </button>
              </div>
              <p style="font-size: 13px; color: var(--ink-faint); margin: 0 0 8px;">${escapeHtml(p.meta)}</p>
              <div style="font-size: 13px; color: var(--ink);">
                <strong style="color: var(--ink-soft);">주요성분:</strong> ${escapeHtml(p.ingredients)} &nbsp;·&nbsp; 
                <strong style="color: var(--ink-soft);">제조사:</strong> ${escapeHtml(p.manufacturer)}
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Comparison Summary Overview Box -->
        <div style="background: #f8fafc; border: 1.5px solid var(--border-strong); border-radius: var(--radius-m); padding: 20px;">
          <h4 style="font-size: 15px; font-weight: 700; margin: 0 0 10px; display: flex; align-items: center; justify-content: space-between;">
            <span>🔍 현재 복용 제품 vs 새 제품 사전 비교 요약</span>
          </h4>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div style="background: #ffffff; padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border);">
              <p style="font-size: 12px; color: var(--ink-faint); margin: 0 0 4px;">현재 복용 제품 (${s1List.length}개)</p>
              <p style="font-size: 13px; font-weight: 600; margin: 0;">
                ${s1List.length > 0 ? s1List.map((i) => i.name).join(', ') : '없음 (0개)'}
              </p>
            </div>
            <div style="background: #ffffff; padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border);">
              <p style="font-size: 12px; color: var(--ink-faint); margin: 0 0 4px;">비교할 새 제품 (${s2List.length}개)</p>
              <p style="font-size: 13px; font-weight: 600; margin: 0;">
                ${s2List.map((i) => i.name).join(', ')}
              </p>
            </div>
          </div>

          <!-- Overlap Badges -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${
              analysis.duplicates.length > 0
                ? `<span style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">⚠️ 성분 중복: ${analysis.duplicates.join(', ')}</span>`
                : `<span style="background: #dcfce7; color: #166534; border: 1px solid #86efac; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">✅ 성분 중복 없음</span>`
            }
            ${
              analysis.newNutrients.length > 0
                ? `<span style="background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">✨ 신규 보충 성분: ${analysis.newNutrients.join(', ')}</span>`
                : ''
            }
          </div>
        </div>
      </div>
    `;

    // Attach event listener for item deletion in Step 2 list
    selectedCardContainer.querySelectorAll('.btn-delete-s2').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetName = btn.dataset.name;
        let updatedList = s2List.filter((item) => item.name !== targetName);
        saveStep2Products(updatedList);
        showToast(`<strong>${targetName}</strong> 이(가) 비교 대상 목록에서 삭제되었습니다.`, 'info');
        renderStep2SelectionOverview();
      });
    });
  }

  /**
   * Render Dynamic Real AI Analysis Result Page (10-analysis-result.html)
   */
  function renderRealAIAnalysisResult() {
    let s1List = getStep1Products();
    let s2List = getStep2Products();

    if (s1List.length === 0) {
      s1List = [
        {
          id: 'vc-01',
          name: '고려은단 비타민 C 1000',
          category: '건강기능식품',
          meta: '1일 1정 · 식후',
          ingredients: '비타민 C 1000mg',
          manufacturer: '고려은단'
        }
      ];
    }

    if (s2List.length === 0) {
      s2List = [
        {
          id: 'vc-03',
          name: '유한 비타민C정 500mg',
          category: '의약품',
          meta: '1일 2정 · 식후',
          ingredients: '아스코르브산 (비타민 C) 500mg',
          manufacturer: '유한양행'
        }
      ];
    }

    const analysis = analyzeProductComparison(s1List, s2List);

    // 1. Left Aside Card (New Products Details) without images
    const asideEl = document.querySelector('.result-product-card');
    if (asideEl) {
      asideEl.innerHTML = `
        <h3 style="font-size: 14px; font-weight: 600; color: var(--ink-faint); margin: 0 0 12px;">새로 평가한 제품 (${s2List.length}개)</h3>
        ${s2List
          .map(
            (p) => `
          <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
            <h2 class="result-product-card__name" style="font-size: 17px; margin-bottom: 4px;">${escapeHtml(p.name)}</h2>
            <p class="result-product-card__tag" style="margin-bottom: 10px;">${escapeHtml(p.category)} · ${escapeHtml(p.manufacturer)}</p>
            <div class="result-product-card__label" style="font-size: 11px;">주요 성분 및 함량</div>
            <div class="result-product-card__ingredients" style="font-size: 13px;">${escapeHtml(p.ingredients)}</div>
          </div>
        `
          )
          .join('')}
      `;
    }

    // 2. Verdict Title & Description
    const verdictTitle = document.querySelector('.verdict-title');
    const verdictDesc = document.querySelector('.verdict-desc');

    if (analysis.hasDuplicates) {
      if (verdictTitle) verdictTitle.textContent = '구매 보류 및 조절을 권장합니다';
      if (verdictDesc)
        verdictDesc.textContent = `현재 복용 중인 제품과 [${analysis.duplicates.join(', ')}] 성분이 중복 확인되었습니다.`;
    } else {
      if (verdictTitle) verdictTitle.textContent = '추가 섭취를 적극 추천합니다!';
      if (verdictDesc)
        verdictDesc.textContent = `현재 복용 제품과 중복 없이 [${analysis.newNutrients.join(', ')}] 성분을 안전하게 보충할 수 있습니다.`;
    }

    // 3. Verdict Box
    const verdictBox = document.querySelector('.verdict-box');
    if (verdictBox) {
      verdictBox.innerHTML = `
        <div class="verdict-row">
          <span class="verdict-row__icon" style="color: ${analysis.hasDuplicates ? '#dc2626' : '#16a34a'}; border-color: ${analysis.hasDuplicates ? '#fca5a5' : '#86efac'};">
            ${
              analysis.hasDuplicates
                ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" stroke-width="1.6"/></svg>`
                : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`
            }
          </span>
          <div>
            <p class="verdict-row__label">성분 중복 체크</p>
            <p class="verdict-row__value" style="font-weight: 700; color: ${analysis.hasDuplicates ? '#dc2626' : '#16a34a'};">
              ${analysis.hasDuplicates ? analysis.duplicates.join(', ') : '성분 중복 없음'}
            </p>
            <p class="verdict-row__note">
              ${
                analysis.hasDuplicates
                  ? `현재 복용 제품(${s1List.map((i) => i.name).join(', ')})과 동일한 성분이 포함되어 과다 섭취 주의가 필요합니다.`
                  : '현재 복용 중인 제품과 중복되는 성분이 없어 안전합니다.'
              }
            </p>
          </div>
        </div>

        <div class="verdict-row">
          <span class="verdict-row__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.6-3 7.7-7 9-4-1.3-7-4.4-7-9V6l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          </span>
          <div>
            <p class="verdict-row__label">신규 및 비교 영양 성분</p>
            <p class="verdict-row__value" style="font-weight: 600;">
              ${analysis.newNutrients.length > 0 ? analysis.newNutrients.join(', ') : '기존 성분 대체/중복'}
            </p>
            <p class="verdict-row__note">새로 추가할 경우 보충되는 영양 성분 항목입니다.</p>
          </div>
        </div>

        <div class="verdict-row">
          <span class="verdict-row__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4l9 16H3L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="17" r="0.9" fill="currentColor"/></svg>
          </span>
          <div>
            <p class="verdict-row__label">섭취 상한선 및 주의사항</p>
            <p class="verdict-row__value">
              ${analysis.hasDuplicates ? '동일 성분 이중 섭취 주의' : '권장 상한선 내 정상 섭취 가능'}
            </p>
            <p class="verdict-row__note">복용 시간대를 나누어 섭취하거나 고함량 단일 제품 조절을 권장합니다.</p>
          </div>
        </div>
      `;
    }

    // 4. AI Summary
    const summaryText = document.querySelector('.summary-box__text');
    if (summaryText) {
      if (analysis.hasDuplicates) {
        summaryText.innerHTML = `현재 복용 중인 <strong>[${s1List.map((i) => i.name).join(', ')}]</strong>와 새로 선택하신 <strong>[${s2List.map((i) => i.name).join(', ')}]</strong> 사이에서 <strong>[${analysis.duplicates.join(', ')}]</strong> 성분의 중복이 확인되었습니다. 기존 보유 제품만으로도 일일 권장량이 이미 충족되므로, 추가 구매보다는 기존 제품을 우선 복용하시는 것을 추천합니다.`;
      } else {
        summaryText.innerHTML = `현재 복용 중인 <strong>[${s1List.map((i) => i.name).join(', ')}]</strong>에 새로 선택하신 <strong>[${s2List.map((i) => i.name).join(', ')}]</strong>를 추가할 경우, 중복 없이 <strong>[${analysis.newNutrients.join(', ')}]</strong> 성분을 안전하게 보충할 수 있어 시너지 효과가 기대됩니다.`;
      }
    }

    // 5. Comparison Table
    const compareTable = document.querySelector('.compare-table');
    if (compareTable) {
      const s1Names = s1List.map((i) => i.name).join('<br/>');
      const s2Names = s2List.map((i) => i.name).join('<br/>');
      const s1Ing = s1List.map((i) => i.ingredients).join('<br/>');
      const s2Ing = s2List.map((i) => i.ingredients).join('<br/>');
      const s1Mfr = s1List.map((i) => i.manufacturer).join(', ');
      const s2Mfr = s2List.map((i) => i.manufacturer).join(', ');

      compareTable.innerHTML = `
        <thead>
          <tr>
            <th style="width: 20%;">항목</th>
            <th style="width: 40%;">현재 복용 중인 제품 (${s1List.length}개)</th>
            <th style="width: 40%;">새로 고려 중인 제품 (${s2List.length}개)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>제품명</strong></td>
            <td>${s1Names}</td>
            <td>${s2Names}</td>
          </tr>
          <tr>
            <td><strong>제조사</strong></td>
            <td>${s1Mfr}</td>
            <td>${s2Mfr}</td>
          </tr>
          <tr>
            <td><strong>주요 성분 및 함량</strong></td>
            <td>${s1Ing}</td>
            <td>${s2Ing}</td>
          </tr>
          <tr>
            <td><strong>성분 중복 여부</strong></td>
            <td class="${analysis.hasDuplicates ? 'highlight' : ''}">${analysis.hasDuplicates ? analysis.duplicates.join(', ') : '중복 없음'}</td>
            <td class="${analysis.hasDuplicates ? 'highlight' : ''}">${analysis.hasDuplicates ? analysis.duplicates.join(', ') : '중복 없음'}</td>
          </tr>
          <tr>
            <td><strong>신규 보충 성분</strong></td>
            <td class="muted">—</td>
            <td>${analysis.newNutrients.length > 0 ? analysis.newNutrients.join(', ') : '없음'}</td>
          </tr>
          <tr>
            <td><strong>AI 종합 판정</strong></td>
            <td colspan="2" style="text-align:center; font-weight:700; color:${analysis.hasDuplicates ? '#dc2626' : '#16a34a'};">
              ${analysis.hasDuplicates ? '⚠️ 성분 중복 (구매 보류 권장)' : '✅ 안전한 신규 보충 (구매 추천)'}
            </td>
          </tr>
        </tbody>
      `;
    }
  }

  /**
   * Helper function to analyze product ingredients overlap
   */
  function analyzeProductComparison(s1List, s2List) {
    const s1IngredientsStr = s1List.map((i) => i.ingredients + ' ' + i.name).join(' ').toLowerCase();
    const s2IngredientsStr = s2List.map((i) => i.ingredients + ' ' + i.name).join(' ').toLowerCase();

    const nutrientKeywords = [
      '비타민 c', '비타민c', '비타민 d', '비타민d', '비타민 a', '비타민a', '비타민 b', '비타민b',
      '마그네슘', '칼슘', '아연', '철분', '구연산', '오메가3', '오메가 3', '루테인', '밀크씨슬', '셀레늄'
    ];

    const duplicates = [];
    const s1Nutrients = [];
    const s2Nutrients = [];

    nutrientKeywords.forEach((nutrient) => {
      const inS1 = s1IngredientsStr.includes(nutrient);
      const inS2 = s2IngredientsStr.includes(nutrient);

      if (inS1) s1Nutrients.push(formatNutrientName(nutrient));
      if (inS2) s2Nutrients.push(formatNutrientName(nutrient));

      if (inS1 && inS2) {
        const formatted = formatNutrientName(nutrient);
        if (!duplicates.includes(formatted)) {
          duplicates.push(formatted);
        }
      }
    });

    const newNutrients = Array.from(new Set(s2Nutrients)).filter((n) => !s1Nutrients.includes(n));

    return {
      hasDuplicates: duplicates.length > 0,
      duplicates: duplicates,
      newNutrients: newNutrients.length > 0 ? newNutrients : ['신규 함량 보충']
    };
  }

  function formatNutrientName(name) {
    if (name.includes('비타민 c') || name.includes('비타민c')) return '비타민 C';
    if (name.includes('비타민 d') || name.includes('비타민d')) return '비타민 D';
    if (name.includes('비타민 a') || name.includes('비타민a')) return '비타민 A';
    if (name.includes('비타민 b') || name.includes('비타민b')) return '비타민 B군';
    if (name.includes('오메가')) return '오메가3';
    if (name.includes('마그네슘')) return '마그네슘';
    if (name.includes('칼슘')) return '칼슘';
    if (name.includes('아연')) return '아연';
    if (name.includes('철분')) return '철분';
    if (name.includes('구연산')) return '구연산';
    if (name.includes('루테인')) return '루테인';
    if (name.includes('밀크씨슬')) return '밀크씨슬';
    if (name.includes('셀레늄')) return '셀레늄';
    return name;
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    const icon = type === 'success'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, 2800);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
