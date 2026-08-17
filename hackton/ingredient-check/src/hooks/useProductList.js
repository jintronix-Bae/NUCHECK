import { useCallback, useState } from "react";

/**
 * "현재 복용 중인 제품" 목록을 관리하는 훅.
 * 화면에서는 products 배열을 렌더링만 하고, 추가/삭제는 이 훅의 함수를 호출하면 됩니다.
 */
export function useProductList(initialProducts = []) {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const removeProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => {
    setProducts([]);
  }, []);

  return { products, addProduct, removeProduct, clear };
}
