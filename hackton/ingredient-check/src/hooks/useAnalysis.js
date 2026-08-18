import { useCallback, useRef, useState } from "react";
import { analyzeProducts, saveNewProduct } from "../api/client.js";

/**
 * 분석 API 호출과 그 상태(idle/loading/success/error)를 관리하는 훅.
 *
 * 변경된 흐름:
 * 1. 새 제품을 서버에 저장 (POST /api/products/new)
 * 2. 분석 요청 (POST /api/analyze — Header UUID만, 서버가 DB에서 제품 조회)
 * 3. Mock 모드에서는 기존처럼 payload를 로컬에서 분석
 */
export function useAnalysis() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  /**
   * @param {{ currentProducts: import("../utils/types.js").Product[], newProduct: import("../utils/types.js").Product }} params
   */
  const runAnalysis = useCallback(async ({ currentProducts, newProduct }) => {
    const thisRequestId = ++requestId.current;
    setStatus("loading");
    setError(null);

    try {
      // 1) 새 제품을 서버에 저장
      await saveNewProduct(newProduct);

      // 2) 분석 요청 (Mock 모드에서는 payload가 사용됨, 실제 모드에서는 무시)
      const analysisResult = await analyzeProducts({ currentProducts, newProduct });
      if (thisRequestId !== requestId.current) return; // 이후 요청으로 이미 대체된 경우 무시
      setResult(analysisResult);
      setStatus("success");
      return analysisResult;
    } catch (err) {
      if (thisRequestId !== requestId.current) return;
      const message = err?.message || "분석 중 오류가 발생했어요.";
      setError(message);
      setStatus("error");
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    requestId.current += 1; // 진행 중이던 요청 결과를 무효화
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, runAnalysis, reset };
}
