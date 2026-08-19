package nucheck.domain.targetproduct.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.targetproduct.dto.TargetProductRequest;
import nucheck.domain.targetproduct.dto.TargetProductResponse;
import nucheck.domain.targetproduct.entity.TargetProduct;
import nucheck.domain.targetproduct.repository.TargetProductRepository;
import nucheck.domain.user.entity.User;
import nucheck.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
public class TargetProductService {

    private final TargetProductRepository targetProductRepository;
    private final UserService userService;

    // #1. 대상 제품 저장/수정 - 기존 대상 제품이 있으면 업데이트, 없으면 새로 생성
    @Transactional
    public TargetProductResponse saveTargetProduct(String userId, TargetProductRequest request) {
        User user = userService.getOrCreateUser(userId);

        Optional<TargetProduct> existing = targetProductRepository.findByUserUserId(userId);
        TargetProduct product;
        if (existing.isPresent()) {
            product = existing.get();
            product.updateTargetProduct(request);
        } else {
            product = TargetProduct.createTargetProduct(request, user);
        }

        TargetProduct saved = targetProductRepository.save(product);
        return toResponse(saved);
    }

    // #2. 대상 제품 DTO 조회 - 사용자의 대상 제품을 DTO로 변환하여 Optional 반환
    @Transactional(readOnly = true)
    public Optional<TargetProductResponse> getTargetProduct(String userId) {
        return targetProductRepository.findByUserUserId(userId).map(this::toResponse);
    }

    // #3. 대상 제품 엔티티 조회 - 서비스 간 호출용 엔티티 Optional 반환
    @Transactional(readOnly = true)
    public Optional<TargetProduct> getTargetProductEntity(String userId) {
        return targetProductRepository.findByUserUserId(userId);
    }

    // #4. 엔티티→DTO 변환 - TargetProduct 엔티티를 TargetProductResponse DTO로 변환
    public TargetProductResponse toResponse(TargetProduct product) {
        List<IngredientDto> ingredientDtos = product.getIngredients().stream()
                .map(i -> IngredientDto.builder()
                        .name(i.getName())
                        .amount(i.getAmount())
                        .unit(i.getUnit())
                        .build())
                .collect(Collectors.toList());

        return TargetProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .category(product.getCategory())
                .form(product.getForm())
                .dosagePerDay(product.getDosagePerDay())
                .purpose(product.getPurpose())
                .notes(product.getNotes())
                .ingredients(ingredientDtos)
                .build();
    }
}
