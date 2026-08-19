package nucheck.domain.analysis.controller;

import lombok.RequiredArgsConstructor;
import nucheck.domain.analysis.dto.AnalysisResponse;
import nucheck.domain.analysis.service.AnalysisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    // #1. 분석 실행(현재 복용 제품 과 구매 제품 비교 분석 후 결과 저장 및 반환)
    @PostMapping
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        validateUserId(userId);
        AnalysisResponse result = analysisService.analyze(userId.trim());
        return ResponseEntity.ok(result);
    }

    // #2. 분석 이력 조회(사용자의 전체 분석 결과 목록을 최신순으로 반환)
    @GetMapping("/history")
    public ResponseEntity<List<AnalysisResponse>> getHistory(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        validateUserId(userId);
        List<AnalysisResponse> history = analysisService.getHistory(userId.trim());
        return ResponseEntity.ok(history);
    }

    // #3. 사용자 Id 유효성 검증(UUID가 비어있으면 400 에러 반환)
    private void validateUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Id 헤더가 필요합니다.");
        }
    }
}
