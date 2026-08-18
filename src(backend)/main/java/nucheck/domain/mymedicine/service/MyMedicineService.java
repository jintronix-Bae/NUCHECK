package nucheck.domain.mymedicine.service;

import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.mymedicine.dto.MyMedicineListResponse;
import nucheck.domain.mymedicine.dto.MyMedicineRequest;
import nucheck.domain.mymedicine.dto.MyMedicineResponse;
import nucheck.domain.mymedicine.entity.CurrentIngredient;
import nucheck.domain.mymedicine.entity.CurrentProduct;
import nucheck.domain.mymedicine.repository.CurrentProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MyMedicineService {

    private final CurrentProductRepository currentProductRepository;

    public MyMedicineService(CurrentProductRepository currentProductRepository) {
        this.currentProductRepository = currentProductRepository;
    }

    @Transactional(readOnly = true)
    public MyMedicineListResponse getCurrentMedicines(String userId) {
        List<CurrentProduct> list = currentProductRepository.findAllByUserIdOrderByCreatedAtAsc(userId);
        List<MyMedicineResponse> dtos = list.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return MyMedicineListResponse.builder()
                .products(dtos)
                .build();
    }

    @Transactional(readOnly = true)
    public List<CurrentProduct> getCurrentProductsEntity(String userId) {
        return currentProductRepository.findAllByUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional
    public MyMedicineResponse addCurrentMedicine(String userId, MyMedicineRequest request) {
        String productId = (request.id() != null && !request.id().isBlank()) ? request.id() : UUID.randomUUID().toString();

        CurrentProduct product = currentProductRepository.findByIdAndUserId(productId, userId)
                .orElseGet(() -> CurrentProduct.builder()
                        .id(productId)
                        .userId(userId)
                        .createdAt(LocalDateTime.now())
                        .build());

        product.setName(request.name() != null ? request.name() : "");
        product.setBrand(request.brand() != null ? request.brand() : "");
        product.setCategory(request.category() != null ? request.category() : "supplement");
        product.setForm(request.form() != null ? request.form() : "");
        product.setDosagePerDay(request.dosagePerDay() != null ? request.dosagePerDay() : 1);
        product.setPurpose(request.purpose() != null ? request.purpose() : "");
        product.setNotes(request.notes() != null ? request.notes() : "");

        product.getIngredients().clear();
        if (request.ingredients() != null) {
            for (IngredientDto ingDto : request.ingredients()) {
                CurrentIngredient ingredient = CurrentIngredient.builder()
                        .name(ingDto.name() != null ? ingDto.name() : "")
                        .amount(ingDto.amount() != null ? ingDto.amount() : 0.0)
                        .unit(ingDto.unit() != null ? ingDto.unit() : "")
                        .build();
                product.addIngredient(ingredient);
            }
        }

        CurrentProduct saved = currentProductRepository.save(product);
        return toResponse(saved);
    }

    @Transactional
    public boolean deleteCurrentMedicine(String userId, String productId) {
        Optional<CurrentProduct> optional = currentProductRepository.findByIdAndUserId(productId, userId);
        if (optional.isEmpty()) {
            return false;
        }
        currentProductRepository.delete(optional.get());
        return true;
    }

    public MyMedicineResponse toResponse(CurrentProduct product) {
        List<IngredientDto> ingredientDtos = product.getIngredients().stream()
                .map(i -> IngredientDto.builder()
                        .name(i.getName())
                        .amount(i.getAmount())
                        .unit(i.getUnit())
                        .build())
                .collect(Collectors.toList());

        return MyMedicineResponse.builder()
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
