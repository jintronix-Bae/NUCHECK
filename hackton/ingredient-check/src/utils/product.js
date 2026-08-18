export const CATEGORY_LABELS = {
  supplement: "영양제/건강기능식품",
  otc: "일반의약품",
  prescription: "전문(처방)의약품",
};

export function createEmptyProduct() {
  return {
    id: crypto.randomUUID(),
    name: "",
    brand: "",
    category: "supplement",
    form: "",
    dosagePerDay: 1,
    ingredients: [{ name: "", amount: "", unit: "mg" }],
    purpose: "",
    notes: "",
  };
}

export function createEmptyIngredient() {
  return { name: "", amount: "", unit: "mg" };
}

export function isProductValid(product) {
  const hasName = product.name.trim().length > 0;
  const hasIngredient = product.ingredients.some(
    (i) => i.name.trim().length > 0 && i.amount !== "" && !Number.isNaN(Number(i.amount))
  );
  return hasName && hasIngredient;
}
