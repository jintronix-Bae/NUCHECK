package nucheck.domain.targetproduct.service;

import lombok.RequiredArgsConstructor;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.targetproduct.dto.TargetProductRequest;
import nucheck.domain.targetproduct.dto.TargetProductResponse;
import nucheck.domain.targetproduct.entity.TargetProduct;
import nucheck.domain.targetproduct.repository.TargetProductRepository;
import nucheck.domain.user.entity.User;
import nucheck.domain.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TargetProductService {

    private final TargetProductRepository targetProductRepository;
    private final UserService userService;

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

    @Transactional(readOnly = true)
    public Optional<TargetProductResponse> getTargetProduct(String userId) {
        return targetProductRepository.findByUserUserId(userId).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Optional<TargetProduct> getTargetProductEntity(String userId) {
        return targetProductRepository.findByUserUserId(userId);
    }

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
