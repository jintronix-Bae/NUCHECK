/**
 * 이 파일은 프론트엔드 <-> 백엔드 사이의 데이터 계약(contract)을 문서화합니다.
 * 백엔드 개발자는 아래 형태에 맞춰 응답을 내려주면 프론트엔드 수정 없이 바로 붙습니다.
 * (TypeScript가 아니라도 형태를 맞추기 위해 JSDoc으로 남겨둡니다.)
 */

/**
 * 제품에 들어있는 개별 성분
 * @typedef {Object} Ingredient
 * @property {string} name        성분명 (예: "비타민D3")
 * @property {number} amount      1회 섭취(복용)량 수치
 * @property {string} unit        단위 (예: "mg", "mcg", "IU")
 */

/**
 * 사용자가 등록하는 제품(현재 복용 중 / 새로 구매하려는 제품 공통 형태)
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name          제품명
 * @property {string} brand         제조사/브랜드 (선택)
 * @property {"supplement"|"otc"|"prescription"} category  영양제 / 일반의약품 / 전문(처방)의약품
 * @property {string} form          제형 (예: "정제", "캡슐", "액상")
 * @property {number} dosagePerDay  하루 섭취(복용) 횟수 또는 개수
 * @property {Ingredient[]} ingredients
 * @property {string} purpose       섭취 목적/처방 이유 (선택)
 * @property {string} notes         기타 메모 (선택)
 */

/**
 * 성분 중복/상호작용 한 줄
 * @typedef {Object} OverlapRow
 * @property {string} ingredient
 * @property {number} currentAmount   기존 제품들 합산 섭취량 (없으면 0)
 * @property {number} newAmount       새 제품의 섭취량
 * @property {number} combinedAmount  두 값을 합친 총량
 * @property {string} unit
 * @property {string} [upperLimit]    상한 섭취량 참고치 (문자열, 있는 경우만)
 * @property {"low"|"medium"|"high"} risk  중복/과다 위험도
 * @property {string} note            해당 성분에 대한 짧은 설명
 */

/**
 * 백엔드가 최종적으로 내려줘야 하는 분석 결과
 * @typedef {Object} AnalysisResult
 * @property {"recommend"|"caution"|"avoid"} verdict  추천 / 주의 / 비추천
 * @property {string} summary               결과 한 줄 요약
 * @property {OverlapRow[]} overlaps         중복 성분 대조표
 * @property {string[]} pros                 새 제품 구매 시 장점
 * @property {string[]} cons                 새 제품 구매 시 단점/우려
 * @property {{with: string, description: string, severity: "low"|"medium"|"high"}[]} interactions
 * @property {string} recommendation         종합 권장 문구
 */

/**
 * POST /api/analyze 요청 바디
 * @typedef {Object} AnalyzeRequest
 * @property {Product[]} currentProducts
 * @property {Product} newProduct
 */

export {};
