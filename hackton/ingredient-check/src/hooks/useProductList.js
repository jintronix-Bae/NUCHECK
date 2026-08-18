import { useCallback, useEffect, useState } from "react";
import {
  fetchCurrentProducts as apiFetch,
  addCurrentProduct as apiAdd,
  removeCurrentProduct as apiRemove,
} from "../api/client.js";

/**
 * "현재 복용 중인 제품" 목록을 관리하는 훅.
 *
 * - 마운트 시 서버(DB)에서 기존 목록을 불러옵니다.
 * - 추가/삭제 시 로컬 상태와 서버를 동시에 갱신합니다.
 * - Mock 모드에서는 서버 호출이 no-op이므로 기존과 동일하게 동작합니다.
 */
export function useProductList(initialProducts = []) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // 마운트 시 서버에서 목록 조회
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    apiFetch()
      .then((serverProducts) => {
        if (!cancelled && serverProducts.length > 0) {
          setProducts(serverProducts);
        }
      })
      .catch(() => {
        // 서버 조회 실패 시 로컬 상태만 사용 (Mock 모드에서는 빈 배열)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [...prev, product]);
    // 서버에도 저장 (실패해도 로컬 상태는 유지)
    apiAdd(product).catch(() => {});
  }, []);

  const removeProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // 서버에서도 삭제
    apiRemove(id).catch(() => {});
  }, []);

  const clear = useCallback(() => {
    setProducts([]);
  }, []);

  return { products, isLoading, addProduct, removeProduct, clear };
}
