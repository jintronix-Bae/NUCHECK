import { buildMockAnalysis } from "../data/mockAnalysis.js";

/**
 * 백엔드 API 베이스 URL.
 * 배포 시 .env 파일에 VITE_API_BASE_URL 을 설정하면 자동으로 반영됩니다.
 * (예: VITE_API_BASE_URL=https://api.yourservice.com)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * 개발 중에는 목(mock) 데이터를 반환하고,
 * 백엔드가 준비되면 USE_MOCK 을 false 로 바꾸거나
 * 아래 fetch 코드의 주석을 해제해서 실제 API를 호출하세요.
 */
const USE_MOCK = true;

/**
 * 현재 복용 중인 제품들과 새 제품을 비교 분석합니다.
 * @param {{ currentProducts: import("../utils/types.js").Product[], newProduct: import("../utils/types.js").Product }} payload
 * @returns {Promise<import("../utils/types.js").AnalysisResult>}
 */
export async function analyzeProducts(payload) {
  if (USE_MOCK) {
    // 실제 분석처럼 느껴지도록 약간의 지연을 흉내냅니다.
    await new Promise((resolve) => setTimeout(resolve, 2200));
    return buildMockAnalysis(payload);
  }

  // ---- 백엔드 연동 시 아래 코드를 사용하세요 -----------------------------
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "분석 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }

  return response.json();
  // -------------------------------------------------------------------
}
