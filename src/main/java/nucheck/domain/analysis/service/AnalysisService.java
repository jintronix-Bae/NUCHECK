package nucheck.domain.analysis.service;

import java.util.List;

import nucheck.domain.analysis.entity.AnalysisResult;
import nucheck.domain.analysis.repository.AnalysisResultRepository;
import nucheck.domain.user.entity.User;
import nucheck.domain.user.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import nucheck.domain.analysis.dto.AnalysisResponse;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {

    private final MyMedicineRepository myMedicineRepository;
    private final TargetProductRepository targetProductRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;
    private final ChatClient.Builder chatClientBuilder;
    private final ObjectMapper objectMapper;

    @Transactional
    public AnalysisResponse analyze(String userId) {
        // 0. 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("존재하지 않는 사용자입니다."));

        // 1. 유저의 현재 복용 중인 제품 모두 조회
        List<MyMedicine> currentMedicines = myMedicineRepository.findAllByUserUserId(userId);
        if (currentMedicines.isEmpty()) {
            throw new IllegalStateException("등록된 복용 중인 제품이 없습니다.");
        }

        // 2. 유저의 분석 대상 제품 1개 조회
        TargetProduct targetProduct = targetProductRepository.findTopByUserUserIdOrderByIdDesc(userId)
                .orElseThrow(() -> new IllegalStateException("분석 대상 제품이 등록되지 않았습니다."));

        // 3. 프롬프트 구성
        String prompt = buildPrompt(currentMedicines, targetProduct);

        // 4. OpenAI 호출 (application.yaml 파일에서 등록된 API키를 호출 때 같이 넣어서 보냄)
        ChatClient chatClient = chatClientBuilder.build();
        String aiResponse = chatClient.prompt()
                // #역할 지정 프롬프트
                .system("""
                        너는 영양제·의약품 성분 분석 전문가야.
                        사용자가 현재 복용 중인 제품 목록과 새로 추가하려는 제품 정보를 줄 거야.
                        성분 중복, 상한 섭취량 초과 위험, 상호작용을 분석해서 정확히 아래 JSON 형식으로만 응답해.
                        JSON 외의 텍스트는 절대 포함하지 마.
                        """)
                // #실제 데이터 (유저 프롬프트)
                .user(prompt)
                // #api 호출
                .call()
                // #응답 텍스트 추출
                .content();

        // 5. JSON 파싱
        AnalysisResponse response = parseResponse(aiResponse);

        // 6. 분석 결과 DB 저장
        saveResult(user, response, targetProduct.getName());

        return response;
    }

    private String buildPrompt(List<MyMedicine> currentMedicines, TargetProduct targetProduct) {
        StringBuilder sb = new StringBuilder();

        sb.append("=== 현재 복용 중인 제품 목록 ===\n");
        for (MyMedicine med : currentMedicines) {
            sb.append(String.format("- 제품명: %s, 브랜드: %s, 카테고리: %s, 형태: %s, 1일 복용량: %d\n",
                    med.getName(), med.getBrand(), med.getCategory(), med.getForm(), med.getDosagePerDay()));
            sb.append(String.format("  성분: %s\n", med.getIngredients()));
            sb.append(String.format("  복용목적: %s\n", med.getPurpose()));
        }

        sb.append("\n=== 새로 추가하려는 제품 ===\n");
        sb.append(String.format("- 제품명: %s, 브랜드: %s, 카테고리: %s, 형태: %s, 1일 복용량: %d\n",
                targetProduct.getName(), targetProduct.getBrand(), targetProduct.getCategory(),
                targetProduct.getForm(), targetProduct.getDosagePerDay()));
        sb.append(String.format("  성분: %s\n", targetProduct.getIngredients()));
        sb.append(String.format("  복용목적: %s\n", targetProduct.getPurpose()));

        sb.append("""
                
                위 정보를 바탕으로 분석 결과를 아래 JSON 형식으로 응답해줘:
                {
                  "verdict": "recommend | caution | avoid",
                  "summary": "한 줄 요약",
                  "overlaps": [
                    {
                      "ingredient": "성분명",
                      "currentAmount": 숫자,
                      "newAmount": 숫자,
                      "combinedAmount": 숫자,
                      "unit": "단위",
                      "upperLimit": "상한량 문자열",
                      "risk": "low | medium | high",
                      "note": "설명"
                    }
                  ],
                  "pros": ["장점1", "장점2"],
                  "cons": ["단점1", "단점2"],
                  "interactions": [
                    { "with": "기존 제품명", "description": "설명", "severity": "low | medium | high" }
                  ],
                  "recommendation": "종합 권장 문구"
                }
                """);

        return sb.toString();
    }

    private AnalysisResponse parseResponse(String aiResponse) {
        // AI 응답에서 JSON 부분만 추출 (마크다운 코드블럭 처리)
        String json = aiResponse.trim();
        if (json.startsWith("```")) {
            json = json.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "");
        }

        try {
            return objectMapper.readValue(json, AnalysisResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("AI 응답을 파싱하는데 실패했습니다: " + e.getMessage(), e);
        }
    }

    private void saveResult(User user, AnalysisResponse response, String targetProductName) {
        try {
            // #List 객체를 JSON 문자열로 변환해서 TEXT로 넣는 작업
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
            throw new RuntimeException("분석 결과 저장 중 직렬화 실패: " + e.getMessage(), e);
        }
    }
}
