package nucheck.domain.mymedicine.controller;

import nucheck.domain.mymedicine.dto.MyMedicineListResponse;
import nucheck.domain.mymedicine.dto.MyMedicineRequest;
import nucheck.domain.mymedicine.dto.MyMedicineResponse;
import nucheck.domain.mymedicine.service.MyMedicineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/products/current")
public class MyMedicineController {

    private final MyMedicineService myMedicineService;

    public MyMedicineController(MyMedicineService myMedicineService) {
        this.myMedicineService = myMedicineService;
    }

    @GetMapping
    public ResponseEntity<MyMedicineListResponse> getCurrentMedicines(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        validateUserId(userId);
        MyMedicineListResponse response = myMedicineService.getCurrentMedicines(userId.trim());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<MyMedicineResponse> addCurrentMedicine(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestBody MyMedicineRequest request
    ) {
        validateUserId(userId);
        if (request == null || request.name() == null || request.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제품명(name)이 필요합니다.");
        }
        MyMedicineResponse saved = myMedicineService.addCurrentMedicine(userId.trim(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteCurrentMedicine(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String productId
    ) {
        validateUserId(userId);
        boolean deleted = myMedicineService.deleteCurrentMedicine(userId.trim(), productId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.noContent().build();
    }

    private void validateUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Id 헤더가 필요합니다.");
        }
    }
}
