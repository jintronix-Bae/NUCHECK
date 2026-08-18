package nucheck.domain.analysis;

import nucheck.domain.analysis.dto.AnalysisResponse;
import nucheck.domain.analysis.service.AnalysisService;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.mymedicine.dto.MyMedicineRequest;
import nucheck.domain.mymedicine.service.MyMedicineService;
import nucheck.domain.targetproduct.dto.TargetProductRequest;
import nucheck.domain.targetproduct.service.TargetProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AnalysisServiceTest {

    @Autowired
    private MyMedicineService myMedicineService;

    @Autowired
    private TargetProductService targetProductService;

    @Autowired
    private AnalysisService analysisService;

    @Test
    @DisplayName("복용 중인 약과 구매 예정 약의 중복 성분을 정상 분석한다")
    void testAnalysis() {
        String testUserId = "user-test-123";

        // 1. 현재 복용 중인 약 등록
        myMedicineService.addCurrentMedicine(testUserId, MyMedicineRequest.builder()
                .name("기존 종합비타민")
                .ingredients(List.of(
                        IngredientDto.builder().name("비타민 C").amount(1000.0).unit("mg").build(),
                        IngredientDto.builder().name("아연").amount(20.0).unit("mg").build()
                ))
                .build());

        // 2. 구매 예정 약 등록
        targetProductService.saveTargetProduct(testUserId, TargetProductRequest.builder()
                .name("새로 살 비타민 C 1500")
                .ingredients(List.of(
                        IngredientDto.builder().name("비타민 C").amount(1500.0).unit("mg").build(),
                        IngredientDto.builder().name("오메가3").amount(1000.0).unit("mg").build()
                ))
                .build());

        // 3. 분석 수행
        AnalysisResponse analysis = analysisService.analyze(testUserId);

        assertThat(analysis).isNotNull();
        assertThat(analysis.verdict()).isEqualTo("avoid"); // 1000 + 1500 = 2500mg > 2000mg 상한
        assertThat(analysis.overlaps()).hasSize(1);
        assertThat(analysis.overlaps().get(0).ingredient()).isEqualTo("비타민 C");
        assertThat(analysis.overlaps().get(0).combinedAmount()).isEqualTo(2500.0);
        assertThat(analysis.overlaps().get(0).risk()).isEqualTo("high");
    }
}
