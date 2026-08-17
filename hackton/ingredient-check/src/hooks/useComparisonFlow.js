import { useCallback, useState } from "react";
import { useProductForm } from "./useProductForm.js";
import { useProductList } from "./useProductList.js";
import { useAnalysis } from "./useAnalysis.js";
import { createEmptyProduct } from "../utils/product.js";

export const STEPS = ["current", "new", "analyzing", "result"];

/**
 * 전체 비교 플로우(4단계)를 관장하는 훅.
 * 나중에 화면(디자인)이 들어오면, 컴포넌트에서 이 훅 하나만 호출해서
 * 필요한 상태와 함수를 꺼내 화면에 연결하면 됩니다.
 *
 * 사용 예시 (화면 쪽 컴포넌트에서):
 *
 *   const flow = useComparisonFlow();
 *
 *   // 1단계 화면
 *   flow.step === "current"
 *   flow.currentProducts.products
 *   flow.currentProducts.addProduct(product)
 *   flow.currentProducts.removeProduct(id)
 *   flow.goToNewProductStep()
 *
 *   // 2단계 화면
 *   flow.newProductForm.product / updateField / updateIngredient / ...
 *   flow.submitNewProduct()   // 유효성 검사 통과 시 자동으로 분석 시작 + 3단계로 이동
 *
 *   // 3단계 화면
 *   flow.analysis.status === "loading"
 *
 *   // 4단계 화면
 *   flow.analysis.result
 *   flow.restart()
 */
export function useComparisonFlow() {
  const [step, setStep] = useState("current");

  const currentProducts = useProductList([]);
  const newProductForm = useProductForm(createEmptyProduct());
  const analysis = useAnalysis();

  const goToCurrentProductsStep = useCallback(() => setStep("current"), []);
  const goToNewProductStep = useCallback(() => setStep("new"), []);

  /** 2단계 폼 제출: 유효성 검사 → 통과 시 분석 시작 + 3단계로 이동 */
  const submitNewProduct = useCallback(async () => {
    const { valid, product } = newProductForm.validateAndCollect();
    if (!valid) return { valid: false };

    setStep("analyzing");
    try {
      await analysis.runAnalysis({
        currentProducts: currentProducts.products,
        newProduct: product,
      });
      setStep("result");
      return { valid: true };
    } catch {
      // 실패 시 새 제품 등록 화면으로 되돌리고, 에러 메시지는 analysis.error 에서 꺼내 보여주면 됩니다.
      setStep("new");
      return { valid: true };
    }
  }, [analysis, currentProducts.products, newProductForm]);

  const restart = useCallback(() => {
    currentProducts.clear();
    newProductForm.reset(createEmptyProduct());
    analysis.reset();
    setStep("current");
  }, [analysis, currentProducts, newProductForm]);

  return {
    step,
    steps: STEPS,
    currentProducts, // { products, addProduct, removeProduct, clear }
    newProductForm, // { product, isValid, touched, updateField, updateIngredient, addIngredientRow, removeIngredientRow, validateAndCollect }
    analysis, // { status, result, error, runAnalysis, reset }
    goToCurrentProductsStep,
    goToNewProductStep,
    submitNewProduct,
    restart,
  };
}
