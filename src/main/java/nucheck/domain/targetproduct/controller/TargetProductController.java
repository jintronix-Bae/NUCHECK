package nucheck.domain.targetproduct.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import nucheck.domain.targetproduct.dto.TargetProductRequest;
import nucheck.domain.targetproduct.dto.TargetProductResponse;
import nucheck.domain.targetproduct.service.TargetProductService;

@RestController
@RequestMapping("/api/products/new")
@RequiredArgsConstructor
public class TargetProductController {

    private final TargetProductService targetProductService;

    // #1. 분석 대상 제품 조회 - 사용자가 등록한 대상 제품 반환 (없으면 204 No Content)
    @GetMapping
    public ResponseEntity<TargetProductResponse> getTargetProduct(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        validateUserId(userId);
        return targetProductService.getTargetProduct(userId.trim())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    // #2. 분석 대상 제품 등록/수정 - 새 제품 저장 또는 기존 대상 제품 업데이트
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

    // #3. 사용자 ID 유효성 검증 - X-User-Id 헤더가 비어있으면 400 에러 반환
    private void validateUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Id 헤더가 필요합니다.");
        }
    }
}
