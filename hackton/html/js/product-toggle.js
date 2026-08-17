/**
 * NuCheck — Complete Product Controller
 * - 300+ database search filtering (exact match for name, ingredients, manufacturer)
 * - 6 items per page pagination with dynamic page controls
 * - Persistent storage (Step 1 & Step 2 added items saved to localStorage)
 * - Dynamic list rendering on 05-step1-list.html and 08-step2-selected.html without photos!
 */

document.addEventListener('DOMContentLoaded', () => {
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let currentFilteredList = [];

  // Determine current page step
  const isStep1 = window.location.pathname.includes('04-step1') || window.location.pathname.includes('05-step1');
  const isStep2 = window.location.pathname.includes('07-step2') || window.location.pathname.includes('08-step2');
  const storageKey = isStep2 ? 'nucheck_step2_added' : 'nucheck_step1_added';

  // Load added products from localStorage
  let addedProductsMap = new Map();
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const arr = JSON.parse(saved);
      arr.forEach((p) => addedProductsMap.set(p.name, p));
    }
  } catch (e) {
    console.error('Failed to load storage:', e);
  }

  // Toast Notification Container Setup
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // -------------------------------------------------------------
  // A. Search Pages (04-step1-search.html & 07-step2-search.html)
  // -------------------------------------------------------------
  const resultListEl = document.querySelector('.result-list');
  const searchInput = document.querySelector('.search-bar input');
  const paginationNav = document.querySelector('.pagination');

  if (resultListEl && typeof PRODUCTS_DATABASE !== 'undefined') {
    const initialQuery = searchInput ? searchInput.value.trim() : '';
    currentFilteredList = filterProducts(initialQuery);
    renderPage(1);

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        currentFilteredList = filterProducts(query);
        currentPage = 1;
        renderPage(1);
      });

      const searchForm = searchInput.closest('form');
      if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const query = searchInput.value.trim();
          currentFilteredList = filterProducts(query);
          currentPage = 1;
          renderPage(1);
        });
      }
    }
  }

  /**
   * Filter database products by query (Exact Name & Ingredient matching)
   */
  function filterProducts(query) {
    if (!query) return PRODUCTS_DATABASE;
    
    // Normalize query
    const rawQuery = query.trim().toLowerCase();
    const cleanQuery = rawQuery.replace(/\s+/g, '');

    return PRODUCTS_DATABASE.filter((item) => {
      const nameClean = item.name.toLowerCase().replace(/\s+/g, '');
      const ingClean = item.ingredients.toLowerCase().replace(/\s+/g, '');
      const mfrClean = item.manufacturer.toLowerCase().replace(/\s+/g, '');
      const kwStr = item.keywords ? item.keywords.join(' ') : '';

      return (
        nameClean.includes(cleanQuery) ||
        ingClean.includes(cleanQuery) ||
        mfrClean.includes(cleanQuery) ||
        kwStr.includes(cleanQuery)
      );
    });
  }

  /**
   * Render a specific page of 6 items
   */
  function renderPage(page) {
    currentPage = page;
    const totalItems = currentFilteredList.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const pageItems = currentFilteredList.slice(startIdx, endIdx);

    renderProductList(pageItems);
    renderPagination(totalPages, currentPage);
    updateFooterCounter();
  }

  /**
   * Render product list DOM without images
   */
  function renderProductList(items) {
    if (!resultListEl) return;

    if (items.length === 0) {
      resultListEl.innerHTML = `
        <div class="result-empty-state" style="padding: 48px 24px; text-align: center; color: var(--ink-soft);">
          <p style="font-size: 16px; font-weight: 600; margin: 0 0 6px;">검색 결과가 없습니다.</p>
          <p style="font-size: 13px; color: var(--ink-faint); margin: 0;">제품명(비타민, 마그네슘, 칼슘, 구연산 등), 성분명, 제조사를 다시 확인해주세요.</p>
        </div>
      `;
      return;
    }

    resultListEl.innerHTML = items
      .map((item) => {
        const isAdded = addedProductsMap.has(item.name);
        const iconCheck = `<svg class="btn-icon icon-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        const iconPlus = `<svg class="btn-icon icon-plus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

        const buttonMarkup = isAdded
          ? `${iconCheck}<span class="btn-text">추가됨</span>`
          : `${iconPlus}<span class="btn-text">추가</span>`;

        return `
        <div class="result-row" data-id="${item.id}">
          <div class="result-row__main">
            <div class="result-row__name-line">
              <span class="result-row__name">${escapeHtml(item.name)}</span>
              <span class="tag">${escapeHtml(item.category)}</span>
            </div>
            <p class="result-row__meta">${escapeHtml(item.meta)}</p>
          </div>
          <div class="result-row__col">
            <p class="result-row__col-label">주요성분</p>
            <p class="result-row__col-value">${escapeHtml(item.ingredients)}</p>
          </div>
          <div class="result-row__col">
            <p class="result-row__col-label">제조사</p>
            <p class="result-row__col-value">${escapeHtml(item.manufacturer)}</p>
          </div>
          <button class="btn btn--add ${isAdded ? 'is-added' : ''}" type="button" data-product-id="${item.id}" data-product-name="${escapeHtml(item.name)}" aria-pressed="${isAdded}">
            ${buttonMarkup}
          </button>
        </div>
      `;
      })
      .join('');

    bindRowButtons();
  }

  /**
   * Render dynamic Pagination Bar (6 items per page)
   */
  function renderPagination(totalPages, page) {
    if (!paginationNav) return;

    if (totalPages <= 1) {
      paginationNav.style.display = 'none';
      return;
    }

    paginationNav.style.display = 'flex';
    let html = `<button type="button" class="btn-prev" aria-label="이전 페이지" ${page === 1 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>‹</button>`;

    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      html += `<button type="button" data-page="1">1</button>`;
      if (startPage > 2) html += `<span class="ellipsis">···</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `<button type="button" data-page="${i}" class="${i === page ? 'is-active' : ''}">${i}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += `<span class="ellipsis">···</span>`;
      html += `<button type="button" data-page="${totalPages}">${totalPages}</button>`;
    }

    html += `<button type="button" class="btn-next" aria-label="다음 페이지" ${page === totalPages ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>›</button>`;

    paginationNav.innerHTML = html;

    // Bind pagination events
    paginationNav.querySelectorAll('button[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        renderPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    const prevBtn = paginationNav.querySelector('.btn-prev');
    if (prevBtn && page > 1) {
      prevBtn.addEventListener('click', () => {
        renderPage(page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const nextBtn = paginationNav.querySelector('.btn-next');
    if (nextBtn && page < totalPages) {
      nextBtn.addEventListener('click', () => {
        renderPage(page + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /**
   * Bind row button click handlers
   */
  function bindRowButtons() {
    if (!resultListEl) return;
    const addButtons = resultListEl.querySelectorAll('.btn--add');

    addButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prodId = btn.dataset.productId;
        const prodName = btn.dataset.productName;
        const itemObj = PRODUCTS_DATABASE.find((p) => p.name === prodName || p.id === prodId);

        const isCurrentlyAdded = btn.classList.contains('is-added');
        const newState = !isCurrentlyAdded;

        if (newState && itemObj) {
          btn.classList.add('is-added');
          btn.setAttribute('aria-pressed', 'true');
          addedProductsMap.set(itemObj.name, itemObj);
        } else {
          btn.classList.remove('is-added');
          btn.setAttribute('aria-pressed', 'false');
          if (itemObj) addedProductsMap.delete(itemObj.name);
        }

        // Save to localStorage
        saveAddedToStorage();

        // Update button visual
        updateButtonVisual(btn, newState, true);

        // Toast notice
        if (newState) {
          showToast(`<strong>${prodName}</strong> 이(가) 등록 목록에 추가되었습니다.`, 'success');
        } else {
          showToast(`<strong>${prodName}</strong> 이(가) 등록 목록에서 제외되었습니다.`, 'info');
        }

        updateFooterCounter();
      });
    });
  }

  function saveAddedToStorage() {
    try {
      const arr = Array.from(addedProductsMap.values());
      localStorage.setItem(storageKey, JSON.stringify(arr));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  }

  function updateButtonVisual(btn, isAdded, animate = false) {
    const iconPlus = `<svg class="btn-icon icon-plus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    const iconCheck = `<svg class="btn-icon icon-check ${animate ? 'animate-check' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

    if (isAdded) {
      btn.innerHTML = `${iconCheck}<span class="btn-text">추가됨</span>`;
      btn.title = '클릭하면 등록이 취소됩니다';
    } else {
      btn.innerHTML = `${iconPlus}<span class="btn-text">추가</span>`;
      btn.title = '클릭하여 제품 등록';
    }
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

  function updateFooterCounter() {
    const count = addedProductsMap.size;
    const nextBtn = document.querySelector('.app-footer-actions .btn--dark');

    if (nextBtn) {
      let badge = nextBtn.querySelector('.badge-counter');
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'badge-counter';
          nextBtn.appendChild(badge);
        }
        badge.textContent = `${count}`;
        nextBtn.classList.add('has-selection');
      } else {
        if (badge) badge.remove();
        nextBtn.classList.remove('has-selection');
      }
    }
  }

  // -------------------------------------------------------------
  // B. Registered List Page (05-step1-list.html)
  // -------------------------------------------------------------
  const productGrid = document.querySelector('.product-grid');
  const sectionLabel = document.querySelector('.section-label');

  if (productGrid && window.location.pathname.includes('05-step1-list')) {
    renderRegisteredStep1List();
  }

  function renderRegisteredStep1List() {
    let step1Items = [];
    try {
      const saved = localStorage.getItem('nucheck_step1_added');
      if (saved) step1Items = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    if (sectionLabel) {
      sectionLabel.textContent = `등록 제품 (${step1Items.length})`;
    }

    if (step1Items.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; color: var(--ink-soft); border: 1px dashed var(--border-strong); border-radius: var(--radius-m);">
          <p style="font-size: 16px; font-weight: 600; margin: 0 0 6px;">등록된 제품이 없습니다.</p>
          <p style="font-size: 13px; color: var(--ink-faint); margin: 0 0 16px;">이전 단계에서 복용 중인 영양제나 약을 추가해주세요.</p>
          <a class="btn btn--outline" href="04-step1-search.html" style="display:inline-flex;">+ 제품 검색하여 추가하기</a>
        </div>
      `;
      return;
    }

    // Render cards WITHOUT images!
    productGrid.innerHTML = step1Items
      .map(
        (item) => `
        <div class="product-card" data-name="${escapeHtml(item.name)}">
          <div class="product-card__body">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 4px;">
              <p class="product-card__name" style="margin:0;">${escapeHtml(item.name)}</p>
              <span class="tag">${escapeHtml(item.category || '영양제')}</span>
            </div>
            <p class="product-card__meta" style="margin-bottom: 8px;">${escapeHtml(item.meta || '1일 1정 · 식후')}</p>
            <p style="font-size:12px; color: var(--ink-soft); margin: 0 0 4px;"><strong>주요성분:</strong> ${escapeHtml(item.ingredients || '-')}</p>
            <p style="font-size:12px; color: var(--ink-faint); margin: 0 0 12px;"><strong>제조사:</strong> ${escapeHtml(item.manufacturer || '-')}</p>
            <button class="product-card__delete" aria-label="삭제" type="button" data-name="${escapeHtml(item.name)}" style="margin-top:auto; align-self:flex-end;">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
      `
      )
      .join('');

    // Bind delete buttons
    productGrid.querySelectorAll('.product-card__delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nameToRemove = btn.dataset.name;
        step1Items = step1Items.filter((i) => i.name !== nameToRemove);
        localStorage.setItem('nucheck_step1_added', JSON.stringify(step1Items));
        showToast(`<strong>${nameToRemove}</strong> 이(가) 목록에서 삭제되었습니다.`, 'info');
        renderRegisteredStep1List();
      });
    });
  }

  // -------------------------------------------------------------
  // C. Step 2 Selected Page (08-step2-selected.html)
  // -------------------------------------------------------------
  const selectedCard = document.querySelector('.selected-card');

  if (selectedCard && window.location.pathname.includes('08-step2-selected')) {
    renderStep2SelectedCard();
  }

  function renderStep2SelectedCard() {
    let step2Items = [];
    try {
      const saved = localStorage.getItem('nucheck_step2_added');
      if (saved) step2Items = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    if (step2Items.length === 0) return;

    // Render selected card WITHOUT image
    const item = step2Items[0];
    selectedCard.innerHTML = `
      <div class="selected-card__body" style="width: 100%;">
        <div class="selected-card__head" style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px;">
          <h2 class="selected-card__name" style="margin:0; font-size:22px; font-weight:700;">${escapeHtml(item.name)}</h2>
          <span class="check-circle" style="background:#10b981; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
        <div class="kv-row" style="margin-bottom: 12px;">
          <p class="kv-row__label" style="font-size:12px; color:var(--ink-faint); margin:0 0 4px;">구분 / 복용법</p>
          <p class="kv-row__value" style="font-size:14px; font-weight:600;">${escapeHtml(item.category)} · ${escapeHtml(item.meta)}</p>
        </div>
        <div class="kv-row" style="margin-bottom: 12px;">
          <p class="kv-row__label" style="font-size:12px; color:var(--ink-faint); margin:0 0 4px;">주요 성분 (1일 섭취량 기준)</p>
          <div class="kv-row__value" style="font-size:14px; font-weight:500;">
            <span>${escapeHtml(item.ingredients)}</span>
          </div>
        </div>
        <div class="kv-row">
          <p class="kv-row__label" style="font-size:12px; color:var(--ink-faint); margin:0 0 4px;">제조사</p>
          <p class="kv-row__value" style="font-size:14px; font-weight:600;">${escapeHtml(item.manufacturer)}</p>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
