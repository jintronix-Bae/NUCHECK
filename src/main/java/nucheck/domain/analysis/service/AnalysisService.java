package nucheck.domain.analysis.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nucheck.domain.analysis.dto.AnalysisResponse;
import nucheck.domain.analysis.dto.AnalysisResponse.Interaction;
import nucheck.domain.analysis.dto.AnalysisResponse.OverlapRow;
import nucheck.domain.analysis.entity.AnalysisResult;
import nucheck.domain.analysis.repository.AnalysisResultRepository;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.mymedicine.dto.MyMedicineListResponse;
import nucheck.domain.mymedicine.dto.MyMedicineResponse;
import nucheck.domain.mymedicine.service.MyMedicineService;
import nucheck.domain.targetproduct.dto.TargetProductResponse;
import nucheck.domain.targetproduct.service.TargetProductService;
import nucheck.domain.user.entity.User;
import nucheck.domain.user.service.UserService;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final MyMedicineService myMedicineService;
    private final TargetProductService targetProductService;
    private final UserService userService;
    private final AnalysisResultRepository analysisResultRepository;
    private final ObjectMapper objectMapper;
    private final ChatModel chatModel;

    // #1. mymedicine과 targetproduct 데이터 비교해여 AI 분석 기능
    @Transactional
    public AnalysisResponse analyze(String userId) {
        User user = userService.getOrCreateUser(userId);

        // ##1. 현재 복용 중인 제품 조회
        MyMedicineListResponse currentMedicineList = myMedicineService.getCurrentMedicines(userId);
        List<MyMedicineResponse> currentProducts = currentMedicineList.products();
        if (currentProducts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "등록된 복용 중인 제품이 없습니다.");
        }

        // ##2. 분석 대상 제품 조회
        TargetProductResponse newProduct = targetProductService.getTargetProduct(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "분석할 새 제품이 등록되어 있지 않습니다. 먼저 PUT /api/products/new 를 호출해주세요."
                ));

        // ##3. AI 분석 시도
        AnalysisResponse response = null;
        if (chatModel != null) {
            try {
                response = analyzeWithAi(currentProducts, newProduct);
            } catch (Exception e) {
                log.warn("AI 분석 호출 중 오류 발생, 룰 기반 분석으로 대체합니다: {}", e.getMessage());
            }
        }

        // ##4. Fallback: 룰 기반 분석
        if (response == null || response.verdict() == null) {
            response = buildRuleBasedAnalysis(currentProducts, newProduct);
        }

        // ##5. 결과 저장
        saveResult(user, response, newProduct.name());

        return response;
    }

    // #2. 과거 이력 조회 기능(사용자 전체 분석 결과를 최신순으로 DTO 변환 후 반환)
    @Transactional(readOnly = true)
    public List<AnalysisResponse> getHistory(String userId) {
        List<AnalysisResult> results = analysisResultRepository.findAllByUserUserIdOrderByCreatedAtDesc(userId);

        return results.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // #3. AI 분석 실행(성분 중복 등을 비교 분석 수행)
    private AnalysisResponse analyzeWithAi(List<MyMedicineResponse> currentProducts, TargetProductResponse newProduct) {
        String promptText = buildAiPrompt(currentProducts, newProduct);
        Prompt prompt = new Prompt(promptText);
        String responseContent = chatModel.call(prompt).getResult().getOutput().getText();

        if (responseContent == null || responseContent.isBlank()) {
            return null;
        }

        String jsonString = extractJson(responseContent);

        try {
            return objectMapper.readValue(jsonString, AnalysisResponse.class);
        } catch (Exception e) {
            log.error("AI 응답 JSON 파싱 실패: {}", jsonString, e);
            return null;
        }
    }

    // #4. 복용 제품과 구매 제품 정보에 대한 AI 분석용 프롬프트 생성 기능
    private String buildAiPrompt(List<MyMedicineResponse> currentProducts, TargetProductResponse newProduct) {
        StringBuilder sb = new StringBuilder();
        sb.append("당신은 전문 약사 및 영양학 전문가 AI입니다.\n");
        sb.append("사용자가 현재 복용 중인 약/영양제 목록과 새로 구매하려는 제품 정보를 제공합니다.\n");
        sb.append("두 제품군 사이의 성분 중복 여부, 1일 상한 섭취량 초과 위험, 약물/영양소 상호작용 위험을 심층 분석해주세요.\n\n");

        sb.append("[현재 복용 중인 약/영양제 목록]:\n");
        for (MyMedicineResponse med : currentProducts) {
            sb.append("- 제품명: ").append(med.name())
                    .append(", 분류: ").append(med.category())
                    .append(", 복용량: 하루 ").append(med.dosagePerDay()).append("회\n");
            if (med.ingredients() != null && !med.ingredients().isEmpty()) {
                String ingStr = med.ingredients().stream()
                        .map(i -> i.name() + " (" + i.amount() + i.unit() + ")")
                        .collect(Collectors.joining(", "));
                sb.append("  성분: ").append(ingStr).append("\n");
            }
        }

        sb.append("\n[새로 구매 예정인 제품]:\n");
        sb.append("- 제품명: ").append(newProduct.name())
                .append(", 분류: ").append(newProduct.category())
                .append(", 목적: ").append(newProduct.purpose()).append("\n");
        if (newProduct.ingredients() != null && !newProduct.ingredients().isEmpty()) {
            String ingStr = newProduct.ingredients().stream()
                    .map(i -> i.name() + " (" + i.amount() + i.unit() + ")")
                    .collect(Collectors.joining(", "));
            sb.append("  성분: ").append(ingStr).append("\n");
        }

        sb.append("\n반드시 아래 JSON 형식으로만 응답해주세요 (추가적인 설명 문장 없이 순수 JSON만 출력):\n");
        sb.append("""
                {
                  "verdict": "recommend | caution | avoid",
                  "summary": "한 줄 요약",
                  "overlaps": [
                    {
                      "ingredient": "성분명",
                      "currentAmount": 1000.0,
                      "newAmount": 1500.0,
                      "combinedAmount": 2500.0,
                      "unit": "mg",
                      "upperLimit": "2000mg",
                      "risk": "low | medium | high",
                      "note": "상세 설명"
                    }
                  ],
                  "pros": ["장점1", "장점2"],
                  "cons": ["단점1", "단점2"],
                  "interactions": [
                    { "withProduct": "기존 제품명", "description": "상호작용 설명", "severity": "low | medium | high" }
                  ],
                  "recommendation": "종합 권장 문구"
                }
                """);

        return sb.toString();
    }

    // #5. Fallback 분석(AI분석 실패 시 성분 중복/상한량 기준으로 자체 분석기능)
    private AnalysisResponse buildRuleBasedAnalysis(List<MyMedicineResponse> currentProducts, TargetProductResponse newProduct) {
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

        List<OverlapRow> overlaps = new ArrayList<>();

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

            if (limit != null && limit.unit.equalsIgnoreCase(unit)) {
                upperLimitStr = (limit.value == (long) limit.value
                        ? String.format("%d", (long) limit.value)
                        : String.format("%.1f", limit.value)) + limit.unit;
                double ratio = combinedAmount / limit.value;
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

            overlaps.add(OverlapRow.builder()
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

        // pros
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

        // cons
        List<String> cons = new ArrayList<>();
        for (OverlapRow o : overlaps) {
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

        // interactions
        List<Interaction> interactions = new ArrayList<>();
        for (OverlapRow o : overlaps) {
            if (!"low".equals(o.risk())) {
                String withProductName = currentProducts.stream()
                        .filter(p -> p.ingredients() != null && p.ingredients().stream()
                                .anyMatch(i -> i.name() != null && i.name().trim().equals(o.ingredient())))
                        .map(MyMedicineResponse::name)
                        .findFirst()
                        .orElse("기존 제품");

                interactions.add(Interaction.builder()
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

    // #6. 분석 결과 저장(AnalysisResponse를 JSON 직렬화하여 AnalysisResult 엔티티로 저장)
    private void saveResult(User user, AnalysisResponse response, String targetProductName) {
        try {
            String overlapsJson = objectMapper.writeValueAsString(response.overlaps());
            String prosJson = objectMapper.writeValueAsString(response.pros());
            String consJson = objectMapper.writeValueAsString(response.cons());
            String interactionsJson = objectMapper.writeValueAsString(response.interactions());

            AnalysisResult result = new AnalysisResult(
                    user,
                    response.verdict(),
                    response.summary(),
                    overlapsJson,
                    prosJson,
                    consJson,
                    interactionsJson,
                    response.recommendation(),
                    targetProductName
            );

            analysisResultRepository.save(result);
        } catch (JsonProcessingException e) {
            log.error("분석 결과 저장 중 직렬화 실패: {}", e.getMessage(), e);
        }
    }

    // #7. Entity -> DTO 변환 기능(DB에 저장된 AnalysisResult를 AnalysisResponse로 역직렬화 변환)
    private AnalysisResponse toResponse(AnalysisResult entity) {
        try {
            List<OverlapRow> overlaps = entity.getOverlaps() != null
                    ? objectMapper.readValue(entity.getOverlaps(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, OverlapRow.class))
                    : List.of();

            List<String> pros = entity.getPros() != null
                    ? objectMapper.readValue(entity.getPros(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class))
                    : List.of();

            List<String> cons = entity.getCons() != null
                    ? objectMapper.readValue(entity.getCons(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class))
                    : List.of();

            List<Interaction> interactions = entity.getInteractions() != null
                    ? objectMapper.readValue(entity.getInteractions(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Interaction.class))
                    : List.of();

            return AnalysisResponse.builder()
                    .verdict(entity.getVerdict())
                    .summary(entity.getSummary())
                    .overlaps(overlaps)
                    .pros(pros)
                    .cons(cons)
                    .interactions(interactions)
                    .recommendation(entity.getRecommendation())
                    .build();
        } catch (JsonProcessingException e) {
            log.error("분석 이력 역직렬화 실패 (id={}): {}", entity.getId(), e.getMessage());
            return AnalysisResponse.builder()
                    .verdict(entity.getVerdict())
                    .summary(entity.getSummary())
                    .recommendation(entity.getRecommendation())
                    .build();
        }
    }

    // #8. JSON 추출 기능(AI 응답에서 마크다운 코드블록을 제거하고 순수 JSON 문자열 추출)
    private String extractJson(String raw) {
        String json = raw.trim();
        if (json.startsWith("```json")) {
            json = json.substring(7);
        } else if (json.startsWith("```")) {
            json = json.substring(3);
        }
        if (json.endsWith("```")) {
            json = json.substring(0, json.length() - 3);
        }
        return json.trim();
    }

    // #9. 현재 복용 제품들에서 특정 성분의 총 섭취량 합산
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

    // #10. 대상 제품에서 특정 성분의 총 섭취량 합산
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

    // ===================== 상한 섭취량 기준 =====================

    private record UpperLimit(double value, String unit) {}

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
}
