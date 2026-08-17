// 나중에 화면(UI) 코드에서는 이 파일 하나만 보고 필요한 걸 가져다 쓰면 됩니다.
// 예: import { useComparisonFlow } from "./src";

export { useComparisonFlow, STEPS } from "./hooks/useComparisonFlow.js";
export { useProductForm } from "./hooks/useProductForm.js";
export { useProductList } from "./hooks/useProductList.js";
export { useAnalysis } from "./hooks/useAnalysis.js";

export { analyzeProducts } from "./api/client.js";

export {
  CATEGORY_LABELS,
  createEmptyProduct,
  createEmptyIngredient,
  isProductValid,
} from "./utils/product.js";
