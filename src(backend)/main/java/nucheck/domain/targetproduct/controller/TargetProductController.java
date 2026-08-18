package nucheck.domain.targetproduct.controller;

import nucheck.domain.targetproduct.dto.TargetProductRequest;
import nucheck.domain.targetproduct.dto.TargetProductResponse;
import nucheck.domain.targetproduct.service.TargetProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/products/new")
public class TargetProductController {

    private final TargetProductService targetProductService;

    public TargetProductController(TargetProductService targetProductService) {
        this.targetProductService = targetProductService;
    }

    @GetMapping
    public ResponseEntity<TargetProductResponse> getTargetProduct(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        validateUserId(userId);
        return targetProductService.getTargetProduct(userId.trim())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping
    public ResponseEntity<TargetProductResponse> saveTargetProduct(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestBody TargetProductRequest request
    ) {
        validateUserId(userId);
        if (request == null || request.name() == null || request.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제품명(name)이 필요합니다.");
        }
        TargetProductResponse saved = targetProductService.saveTargetProduct(userId.trim(), request);
        return ResponseEntity.ok(saved);
    }

    private void validateUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Id 헤더가 필요합니다.");
        }
    }
}
