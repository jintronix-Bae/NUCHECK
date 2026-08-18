package nucheck.domain.targetproduct.service;

import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.targetproduct.dto.TargetProductRequest;
import nucheck.domain.targetproduct.dto.TargetProductResponse;
import nucheck.domain.targetproduct.entity.TargetIngredient;
import nucheck.domain.targetproduct.entity.TargetProduct;
import nucheck.domain.targetproduct.repository.TargetProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TargetProductService {

    private final TargetProductRepository targetProductRepository;

    public TargetProductService(TargetProductRepository targetProductRepository) {
        this.targetProductRepository = targetProductRepository;
    }

    @Transactional
    public TargetProductResponse saveTargetProduct(String userId, TargetProductRequest request) {
        String productId = (request.id() != null && !request.id().isBlank()) ? request.id() : UUID.randomUUID().toString();

        TargetProduct product = targetProductRepository.findByUserId(userId)
                .orElseGet(() -> TargetProduct.builder()
                        .userId(userId)
                        .build());

        product.setId(productId);
        product.setName(request.name() != null ? request.name() : "");
        product.setBrand(request.brand() != null ? request.brand() : "");
        product.setCategory(request.category() != null ? request.category() : "supplement");
        product.setForm(request.form() != null ? request.form() : "");
        product.setDosagePerDay(request.dosagePerDay() != null ? request.dosagePerDay() : 1);
        product.setPurpose(request.purpose() != null ? request.purpose() : "");
        product.setNotes(request.notes() != null ? request.notes() : "");
        product.setUpdatedAt(LocalDateTime.now());

        product.getIngredients().clear();
        if (request.ingredients() != null) {
            for (IngredientDto ingDto : request.ingredients()) {
                TargetIngredient ingredient = TargetIngredient.builder()
                        .name(ingDto.name() != null ? ingDto.name() : "")
                        .amount(ingDto.amount() != null ? ingDto.amount() : 0.0)
                        .unit(ingDto.unit() != null ? ingDto.unit() : "")
                        .build();
                product.addIngredient(ingredient);
            }
        }

        TargetProduct saved = targetProductRepository.save(product);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Optional<TargetProductResponse> getTargetProduct(String userId) {
        return targetProductRepository.findByUserId(userId).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Optional<TargetProduct> getTargetProductEntity(String userId) {
        return targetProductRepository.findByUserId(userId);
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
