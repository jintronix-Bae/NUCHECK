package nucheck.domain.analysis.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import nucheck.domain.analysis.dto.AnalysisResponse;
import nucheck.domain.analysis.dto.InteractionResponse;
import nucheck.domain.analysis.dto.OverlapRowResponse;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.mymedicine.dto.MyMedicineListResponse;
import nucheck.domain.mymedicine.dto.MyMedicineResponse;
import nucheck.domain.mymedicine.service.MyMedicineService;
import nucheck.domain.targetproduct.dto.TargetProductResponse;
import nucheck.domain.targetproduct.service.TargetProductService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AnalysisService {

    private final MyMedicineService myMedicineService;
    private final TargetProductService targetProductService;

    public AnalysisService(MyMedicineService myMedicineService, TargetProductService targetProductService) {
        this.myMedicineService = myMedicineService;
        this.targetProductService = targetProductService;
    }

    @Getter
    @AllArgsConstructor
    private static class UpperLimit {
        private final double value;
        private final String unit;
    }

    private static final Map<String, UpperLimit> KNOWN_UPPER_LIMITS = new HashMap<>();

    static {
        KNOWN_UPPER_LIMITS.put("비타민 C", new UpperLimit(2000, "mg"));
        KNOWN_UPPER_LIMITS.put("비타민C", new UpperLimit(2000, "mg"));
        KNOWN_UPPER_LIMITS.put("비타민 D", new UpperLimit(4000, "IU"));
        KNOWN_UPPER_LIMITS.put("비타민D", new UpperLimit(4000, "IU"));
        KNOWN_UPPER_LIMITS.put("아연", new UpperLimit(35, "mg"));
        KNOWN_UPPER_LIMITS.put("마그네슘", new UpperLimit(350, "mg"));
        KNOWN_UPPER_LIMITS.put("칼슘", new UpperLimit(2500, "mg"));
        KNOWN_UPPER_LIMITS.put("철분", new UpperLimit(45, "mg"));
        KNOWN_UPPER_LIMITS.put("오메가3", new UpperLimit(3000, "mg"));
        KNOWN_UPPER_LIMITS.put("오메가-3", new UpperLimit(3000, "mg"));
        KNOWN_UPPER_LIMITS.put("EPA 및 DHA 함유 유지", new UpperLimit(3000, "mg"));
        KNOWN_UPPER_LIMITS.put("밀크씨슬", new UpperLimit(130, "mg"));
        KNOWN_UPPER_LIMITS.put("실리마린", new UpperLimit(130, "mg"));
        KNOWN_UPPER_LIMITS.put("루테인", new UpperLimit(20, "mg"));
        KNOWN_UPPER_LIMITS.put("루테인지아잔틴", new UpperLimit(20, "mg"));
        KNOWN_UPPER_LIMITS.put("비타민 B6", new UpperLimit(100, "mg"));
        KNOWN_UPPER_LIMITS.put("비타민B6", new UpperLimit(100, "mg"));
        KNOWN_UPPER_LIMITS.put("비타민 A", new UpperLimit(3000, "mcg"));
        KNOWN_UPPER_LIMITS.put("비타민A", new UpperLimit(3000, "mcg"));
        KNOWN_UPPER_LIMITS.put("셀레늄", new UpperLimit(400, "mcg"));
        KNOWN_UPPER_LIMITS.put("엽산", new UpperLimit(1000, "mcg"));
    }

    @Transactional(readOnly = true)
    public AnalysisResponse analyze(String userId) {
        MyMedicineListResponse currentMedicineList = myMedicineService.getCurrentMedicines(userId);
        List<MyMedicineResponse> currentProducts = currentMedicineList.products();

        TargetProductResponse newProduct = targetProductService.getTargetProduct(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "분석할 새 제품이 등록되어 있지 않습니다. 먼저 PUT /api/products/new 를 호출해주세요."
                ));

        return buildAnalysis(currentProducts, newProduct);
    }

    public AnalysisResponse buildAnalysis(List<MyMedicineResponse> currentProducts, TargetProductResponse newProduct) {
        Set<String> currentIngredientNames = currentProducts.stream()
                .filter(p -> p.ingredients() != null)
                .flatMap(p -> p.ingredients().stream())
                .map(i -> i.name() != null ? i.name().trim() : "")
                .filter(name -> !name.isEmpty())
                .collect(Collectors.toSet());

        List<String> newIngredientNames = (newProduct.ingredients() != null ? newProduct.ingredients() : List.<IngredientDto>of()).stream()
                .map(i -> i.name() != null ? i.name().trim() : "")
                .filter(name -> !name.isEmpty())
                .collect(Collectors.toList());

        List<String> overlapNames = newIngredientNames.stream()
                .filter(currentIngredientNames::contains)
                .distinct()
                .collect(Collectors.toList());

        List<OverlapRowResponse> overlaps = new ArrayList<>();

        for (String name : overlapNames) {
            double currentAmount = sumIngredientInMedicines(currentProducts, name);
            double newAmount = sumIngredientInTarget(newProduct, name);
            double combinedAmount = currentAmount + newAmount;

            String unit = newProduct.ingredients().stream()
                    .filter(i -> i.name() != null && i.name().trim().equals(name))
                    .map(IngredientDto::unit)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse("");

            UpperLimit limit = KNOWN_UPPER_LIMITS.get(name);
            String risk = "low";
            String note = name + " 성분이 두 제품에 함께 들어있어 섭취량이 합산됩니다.";
            String upperLimitStr = null;

            if (limit != null && limit.getUnit().equalsIgnoreCase(unit)) {
                upperLimitStr = (limit.getValue() == (long) limit.getValue()
                        ? String.format("%d", (long) limit.getValue())
                        : String.format("%.1f", limit.getValue())) + limit.getUnit();
                double ratio = combinedAmount / limit.getValue();
                if (ratio >= 1.0) {
                    risk = "high";
                    note = name + " 합산 섭취량이 상한 섭취기준(" + upperLimitStr + ")을 넘어설 수 있어요.";
                } else if (ratio >= 0.7) {
                    risk = "medium";
                    note = name + " 합산 섭취량이 상한 섭취기준(" + upperLimitStr + ")의 " + Math.round(ratio * 100) + "%에 해당해요.";
                } else {
                    note = name + " 합산 섭취량은 상한 섭취기준 대비 여유가 있는 편이에요.";
                }
            }

            overlaps.add(OverlapRowResponse.builder()
                    .ingredient(name)
                    .currentAmount(currentAmount)
                    .newAmount(newAmount)
                    .combinedAmount(combinedAmount)
                    .unit(unit)
                    .upperLimit(upperLimitStr)
                    .risk(risk)
                    .note(note)
                    .build());
        }

        long highRiskCount = overlaps.stream().filter(o -> "high".equals(o.risk())).count();
        long mediumRiskCount = overlaps.stream().filter(o -> "medium".equals(o.risk())).count();

        String verdict = "recommend";
        if (highRiskCount > 0) {
            verdict = "avoid";
        } else if (mediumRiskCount > 0 || !overlaps.isEmpty()) {
            verdict = "caution";
        }

        List<String> uniqueNewIngredients = newIngredientNames.stream()
                .filter(name -> !currentIngredientNames.contains(name))
                .distinct()
                .collect(Collectors.toList());

        List<String> pros = new ArrayList<>();
        if (!uniqueNewIngredients.isEmpty()) {
            List<String> top3 = uniqueNewIngredients.stream().limit(3).collect(Collectors.toList());
            pros.add("기존 제품에 없던 " + String.join(", ", top3) + " 등의 성분을 새로 보충할 수 있어요.");
        }
        if (overlaps.isEmpty()) {
            pros.add("기존에 복용 중인 제품과 겹치는 성분이 없어 중복 섭취 우려가 적어요.");
        }
        if (newProduct.purpose() != null && !newProduct.purpose().isBlank()) {
            pros.add("\"" + newProduct.purpose() + "\" 목적에 맞춰 제품을 선택하셨네요.");
        }
        if (pros.isEmpty()) {
            pros.add("새 제품이 기존 루틴에 큰 변화 없이 더해질 수 있어요.");
        }

        List<String> cons = new ArrayList<>();
        for (OverlapRowResponse o : overlaps) {
            if (!"low".equals(o.risk())) {
                cons.add(o.note());
            }
        }
        if (!overlaps.isEmpty() && cons.isEmpty()) {
            cons.add("일부 성분이 중복되지만 합산량은 안전 범위 안에 있어요.");
        }
        if (cons.isEmpty()) {
            cons.add("현재 정보 기준으로는 특별한 단점이 확인되지 않았어요.");
        }

        List<InteractionResponse> interactions = new ArrayList<>();
        for (OverlapRowResponse o : overlaps) {
            if (!"low".equals(o.risk())) {
                String withProductName = currentProducts.stream()
                        .filter(p -> p.ingredients() != null && p.ingredients().stream()
                                .anyMatch(i -> i.name() != null && i.name().trim().equals(o.ingredient())))
                        .map(MyMedicineResponse::name)
                        .findFirst()
                        .orElse("기존 제품");

                interactions.add(InteractionResponse.builder()
                        .withProduct(withProductName)
                        .description(o.note())
                        .severity(o.risk())
                        .build());
            }
        }

        String summaryText = switch (verdict) {
            case "avoid" -> "성분 과다 우려가 있어 구매를 권장하지 않아요.";
            case "caution" -> "일부 성분이 중복돼 주의가 필요해요.";
            default -> "중복 성분 우려가 적어 구매를 권장해요.";
        };

        String recommendationText = switch (verdict) {
            case "avoid" -> "성분 합산량이 권장 상한을 넘어설 수 있어 지금 형태로 함께 구매하는 것은 권장하지 않아요. 저함량 제품으로 바꾸거나 복용 시기를 나누는 걸 추천해요.";
            case "caution" -> "일부 성분이 겹쳐 합산 섭취량이 늘어나요. 두 제품을 같은 날 함께 먹기보다는 시간을 나누거나, 둘 중 하나를 줄이는 걸 고려해보세요.";
            default -> "지금 등록하신 정보 기준으로는 함께 섭취해도 큰 무리가 없어 보여요. 다만 최종 판단은 반드시 약사·의사와 상담해 확정하세요.";
        };

        return AnalysisResponse.builder()
                .verdict(verdict)
                .summary(summaryText)
                .overlaps(overlaps)
                .pros(pros)
                .cons(cons)
                .interactions(interactions)
                .recommendation(recommendationText)
                .build();
    }

    private double sumIngredientInMedicines(List<MyMedicineResponse> products, String name) {
        double total = 0.0;
        for (MyMedicineResponse product : products) {
            if (product.ingredients() != null) {
                for (IngredientDto ingredient : product.ingredients()) {
                    if (ingredient.name() != null && ingredient.name().trim().equalsIgnoreCase(name.trim())) {
                        if (ingredient.amount() != null) {
                            total += ingredient.amount();
                        }
                    }
                }
            }
        }
        return total;
    }

    private double sumIngredientInTarget(TargetProductResponse product, String name) {
        double total = 0.0;
        if (product.ingredients() != null) {
            for (IngredientDto ingredient : product.ingredients()) {
                if (ingredient.name() != null && ingredient.name().trim().equalsIgnoreCase(name.trim())) {
                    if (ingredient.amount() != null) {
                        total += ingredient.amount();
                    }
                }
            }
        }
        return total;
    }
}
