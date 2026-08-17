import { useState, useCallback } from "react";
import { createEmptyProduct, createEmptyIngredient, isProductValid } from "../utils/product.js";

/**
 * 제품 1개를 등록/수정하는 상태와 로직을 담당하는 훅.
 * 화면(입력 폼 UI)은 이 훅이 반환하는 값과 함수를 가져다 쓰기만 하면 됩니다.
 *
 * @param {import("../utils/types.js").Product} [initialProduct]
 */
export function useProductForm(initialProduct) {
  const [product, setProduct] = useState(initialProduct || createEmptyProduct());
  const [touched, setTouched] = useState(false);

  const updateField = useCallback((field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateIngredient = useCallback((index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
  }, []);

  const addIngredientRow = useCallback(() => {
    setProduct((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, createEmptyIngredient()],
    }));
  }, []);

  const removeIngredientRow = useCallback((index) => {
    setProduct((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }, []);

  const reset = useCallback((next) => {
    setProduct(next || createEmptyProduct());
    setTouched(false);
  }, []);

  /** 제출 시 호출: 비어있는 성분 행은 제거하고, 유효하지 않으면 false를 반환합니다. */
  const validateAndCollect = useCallback(() => {
    setTouched(true);
    if (!isProductValid(product)) return { valid: false, product: null };
    return {
      valid: true,
      product: { ...product, ingredients: product.ingredients.filter((i) => i.name.trim()) },
    };
  }, [product]);

  return {
    product,
    isValid: isProductValid(product),
    touched,
    updateField,
    updateIngredient,
    addIngredientRow,
    removeIngredientRow,
    reset,
    validateAndCollect,
  };
}
