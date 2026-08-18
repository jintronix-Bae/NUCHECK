package nucheck.domain.analysis.controller;

import nucheck.domain.analysis.dto.AnalysisResponse;
import nucheck.domain.analysis.service.AnalysisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/analyze")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Id 헤더가 필요합니다.");
        }
        AnalysisResponse result = analysisService.analyze(userId.trim());
        return ResponseEntity.ok(result);
    }
}
