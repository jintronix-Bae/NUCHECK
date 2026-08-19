package nucheck.domain.analysis.controller;

import lombok.RequiredArgsConstructor;
import nucheck.domain.analysis.dto.AnalysisResponse;
import nucheck.domain.analysis.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestHeader("X-User-UUID") String userId) {

        AnalysisResponse result = analysisService.analyze(userId);
        return ResponseEntity.ok(result);
    }
}
