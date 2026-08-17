import { useCallback, useRef, useState } from "react";
import { analyzeProducts } from "../api/client.js";

/**
 * 분석 API 호출과 그 상태(idle/loading/success/error)를 관리하는 훅.
 * 화면에서는 status 값에 따라 로딩 UI / 결과 UI / 에러 UI만 갈아끼우면 됩니다.
 */
export function useAnalysis() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const runAnalysis = useCallback(async ({ currentProducts, newProduct }) => {
    const thisRequestId = ++requestId.current;
    setStatus("loading");
    setError(null);

    try {
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
