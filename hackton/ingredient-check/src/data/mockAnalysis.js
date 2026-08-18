// 백엔드가 준비되기 전, 화면 동작을 보여주기 위한 임시 분석 로직입니다.
// 실제 서비스에서는 이 파일 대신 백엔드(AI)가 계산한 값을 그대로 사용하게 됩니다.

const KNOWN_UPPER_LIMITS = {
  "비타민D": { unit: "mcg", value: 100 },
  "비타민D3": { unit: "mcg", value: 100 },
  "비타민A": { unit: "mcg", value: 3000 },
  "아연": { unit: "mg", value: 40 },
  "마그네슘": { unit: "mg", value: 350 },
  "칼슘": { unit: "mg", value: 2500 },
  "철분": { unit: "mg", value: 45 },
  "카페인": { unit: "mg", value: 400 },
};

function sumIngredient(products, name) {
  return products.reduce((total, product) => {
    const match = product.ingredients.find(
      (ingredient) => ingredient.name.trim() === name.trim()
    );
    return total + (match ? Number(match.amount) || 0 : 0);
  }, 0);
}

export function buildMockAnalysis({ currentProducts, newProduct }) {
  const currentIngredientNames = new Set(
    currentProducts.flatMap((product) => product.ingredients.map((i) => i.name.trim()))
  );
  const newIngredientNames = newProduct.ingredients.map((i) => i.name.trim());

  const overlapNames = newIngredientNames.filter((name) => currentIngredientNames.has(name));

  const overlaps = overlapNames.map((name) => {
    const currentAmount = sumIngredient(currentProducts, name);
    const newAmount = sumIngredient([newProduct], name);
    const combinedAmount = currentAmount + newAmount;
    const unit = newProduct.ingredients.find((i) => i.name.trim() === name)?.unit || "";
    const limit = KNOWN_UPPER_LIMITS[name];

    let risk = "low";
    let note = `${name} 성분이 두 제품에 함께 들어있어 섭취량이 합산됩니다.`;
    if (limit && limit.unit === unit) {
      const ratio = combinedAmount / limit.value;
      if (ratio >= 1) {
        risk = "high";
        note = `${name} 합산 섭취량이 상한 섭취기준(${limit.value}${limit.unit})을 넘어설 수 있어요.`;
      } else if (ratio >= 0.7) {
        risk = "medium";
        note = `${name} 합산 섭취량이 상한 섭취기준(${limit.value}${limit.unit})의 ${Math.round(ratio * 100)}%에 해당해요.`;
      } else {
        note = `${name} 합산 섭취량은 상한 섭취기준 대비 여유가 있는 편이에요.`;
      }
    }

    return {
      ingredient: name,
      currentAmount,
      newAmount,
      combinedAmount,
      unit,
      upperLimit: limit ? `${limit.value}${limit.unit}` : undefined,
      risk,
      note,
    };
  });

  const highRiskCount = overlaps.filter((o) => o.risk === "high").length;
  const mediumRiskCount = overlaps.filter((o) => o.risk === "medium").length;

  let verdict = "recommend";
  if (highRiskCount > 0) verdict = "avoid";
  else if (mediumRiskCount > 0 || overlaps.length > 0) verdict = "caution";

  const uniqueNewIngredients = newIngredientNames.filter(
    (name) => !currentIngredientNames.has(name)
  );

  const pros = [];
  if (uniqueNewIngredients.length > 0) {
    pros.push(
      `기존 제품에 없던 ${uniqueNewIngredients.slice(0, 3).join(", ")} 등의 성분을 새로 보충할 수 있어요.`
    );
  }
  if (overlaps.length === 0) {
    pros.push("기존에 복용 중인 제품과 겹치는 성분이 없어 중복 섭취 우려가 적어요.");
  }
  if (newProduct.purpose) {
    pros.push(`"${newProduct.purpose}" 목적에 맞춰 제품을 선택하셨네요.`);
  }
  if (pros.length === 0) {
    pros.push("새 제품이 기존 루틴에 큰 변화 없이 더해질 수 있어요.");
  }

  const cons = [];
  overlaps.forEach((o) => {
    if (o.risk !== "low") cons.push(o.note);
  });
  if (overlaps.length > 0 && cons.length === 0) {
    cons.push("일부 성분이 중복되지만 합산량은 안전 범위 안에 있어요.");
  }
  if (cons.length === 0) {
    cons.push("현재 정보 기준으로는 특별한 단점이 확인되지 않았어요.");
  }

  const interactions = overlaps
    .filter((o) => o.risk !== "low")
    .map((o) => ({
      with: currentProducts.find((p) =>
        p.ingredients.some((i) => i.name.trim() === o.ingredient)
      )?.name || "기존 제품",
      description: o.note,
      severity: o.risk,
    }));

  const recommendationText = {
    recommend: "지금 등록하신 정보 기준으로는 함께 섭취해도 큰 무리가 없어 보여요. 다만 최종 판단은 반드시 약사·의사와 상담해 확정하세요.",
    caution: "일부 성분이 겹쳐 합산 섭취량이 늘어나요. 두 제품을 같은 날 함께 먹기보다는 시간을 나누거나, 둘 중 하나를 줄이는 걸 고려해보세요.",
    avoid: "성분 합산량이 권장 상한을 넘어설 수 있어 지금 형태로 함께 구매하는 것은 권장하지 않아요. 저함량 제품으로 바꾸거나 복용 시기를 나누는 걸 추천해요.",
  }[verdict];

  const summaryText = {
    recommend: "중복 성분 우려가 적어 구매를 권장해요.",
    caution: "일부 성분이 중복돼 주의가 필요해요.",
    avoid: "성분 과다 우려가 있어 구매를 권장하지 않아요.",
  }[verdict];

  return {
    verdict,
    summary: summaryText,
    overlaps,
    pros,
    cons,
    interactions,
    recommendation: recommendationText,
  };
}
