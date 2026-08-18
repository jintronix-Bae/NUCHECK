import { buildMockAnalysis } from "../data/mockAnalysis.js";

/**
 * 백엔드 API 베이스 URL.
 * 배포 시 .env 파일에 VITE_API_BASE_URL 을 설정하면 자동으로 반영됩니다.
 * (예: VITE_API_BASE_URL=https://api.yourservice.com)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * 개발 중에는 목(mock) 데이터를 반환하고,
 * 백엔드가 준비되면 USE_MOCK 을 false 로 바꿔서 실제 API를 호출하세요.
 */
const USE_MOCK = true;

// ---------------------------------------------------------------------------
// UUID 관리 — 익명 사용자 식별
// ---------------------------------------------------------------------------
const USER_ID_KEY = "nucheck_user_id";

/**
 * localStorage에 저장된 UUID를 반환하거나, 없으면 새로 만들어 저장합니다.
 * @returns {string} UUID v4
 */
export function getOrCreateUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

/**
 * 모든 API 요청에 공통으로 붙는 헤더를 만들어 반환합니다.
 * @returns {Record<string, string>}
 */
function baseHeaders() {
  return {
    "Content-Type": "application/json",
    "X-User-Id": getOrCreateUserId(),
  };
}

// ---------------------------------------------------------------------------
// 현재 복용 중인 제품 CRUD
// ---------------------------------------------------------------------------

/**
 * 현재 복용 중인 제품 목록을 DB에서 조회합니다.
 * @returns {Promise<import("../utils/types.js").Product[]>}
 */
export async function fetchCurrentProducts() {
  if (USE_MOCK) return [];

  const response = await fetch(`${API_BASE_URL}/api/products/current`, {
    method: "GET",
    headers: baseHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "제품 목록을 불러오지 못했습니다.");
  }

  const data = await response.json();
  return data.products;
}

/**
 * 현재 복용 중인 제품을 DB에 추가합니다.
 * @param {import("../utils/types.js").Product} product
 * @returns {Promise<import("../utils/types.js").Product>} 서버가 id를 부여한 제품
 */
export async function addCurrentProduct(product) {
  if (USE_MOCK) return product;

  const response = await fetch(`${API_BASE_URL}/api/products/current`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "제품 추가에 실패했습니다.");
  }

  return response.json();
}

/**
 * 현재 복용 중인 제품을 DB에서 삭제합니다.
 * @param {string} productId
 * @returns {Promise<void>}
 */
export async function removeCurrentProduct(productId) {
  if (USE_MOCK) return;

  const response = await fetch(
    `${API_BASE_URL}/api/products/current/${productId}`,
    { method: "DELETE", headers: baseHeaders() }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "제품 삭제에 실패했습니다.");
  }
}

// ---------------------------------------------------------------------------
// 새 제품(구매 예정) 저장
// ---------------------------------------------------------------------------

/**
 * 분석할 새 제품을 DB에 저장합니다.
 * @param {import("../utils/types.js").Product} product
 * @returns {Promise<import("../utils/types.js").Product>} 서버가 id를 부여한 제품
 */
export async function saveNewProduct(product) {
  if (USE_MOCK) return product;

  const response = await fetch(`${API_BASE_URL}/api/products/new`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "새 제품 저장에 실패했습니다.");
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// 분석 요청
// ---------------------------------------------------------------------------

/**
 * 성분 비교 분석을 요청합니다.
 *
 * - Mock 모드: 기존처럼 currentProducts / newProduct 를 받아 로컬에서 결과 생성
 * - 실제 모드: Header에 X-User-Id 만 보내고, 백엔드가 DB에서 제품을 조회하여 분석
 *
 * @param {{ currentProducts: import("../utils/types.js").Product[], newProduct: import("../utils/types.js").Product }} payload
 *        Mock 모드에서만 사용됩니다. 실제 모드에서는 무시됩니다.
 * @returns {Promise<import("../utils/types.js").AnalysisResult>}
 */
export async function analyzeProducts(payload) {
  if (USE_MOCK) {
    // 실제 분석처럼 느껴지도록 약간의 지연을 흉내냅니다.
    await new Promise((resolve) => setTimeout(resolve, 2200));
    return buildMockAnalysis(payload);
  }

  // ---- 백엔드 연동: Header UUID만으로 요청 -----------------------------
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "분석 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }

  return response.json();
  // -------------------------------------------------------------------
}
