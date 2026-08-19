package nucheck.domain.mymedicine.service;

import lombok.RequiredArgsConstructor;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.mymedicine.dto.MyMedicineListResponse;
import nucheck.domain.mymedicine.dto.MyMedicineRequest;
import nucheck.domain.mymedicine.dto.MyMedicineResponse;
import nucheck.domain.mymedicine.entity.CurrentProduct;
import nucheck.domain.mymedicine.repository.CurrentProductRepository;
import nucheck.domain.user.entity.User;
import nucheck.domain.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyMedicineService {

    private final CurrentProductRepository currentProductRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public MyMedicineListResponse getCurrentMedicines(String userId) {
        List<CurrentProduct> list = currentProductRepository.findAllByUserUserIdOrderByCreatedAtAsc(userId);
        List<MyMedicineResponse> dtos = list.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return MyMedicineListResponse.builder()
                .products(dtos)
                .build();
    }

    @Transactional(readOnly = true)
    public List<CurrentProduct> getCurrentProductsEntity(String userId) {
        return currentProductRepository.findAllByUserUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional
    public MyMedicineResponse addCurrentMedicine(String userId, MyMedicineRequest request) {
        User user = userService.getOrCreateUser(userId);

        CurrentProduct product;
        if (request.id() != null && !request.id().isBlank()) {
            Optional<CurrentProduct> optionalProduct = currentProductRepository.findByIdAndUserUserId(request.id(), userId);
            if (optionalProduct.isPresent()) {
                product = optionalProduct.get();
                product.updateCurrentProduct(request);
            } else {
                product = CurrentProduct.createCurrentProduct(request, user);
            }
        } else {
            product = CurrentProduct.createCurrentProduct(request, user);
        }

        CurrentProduct saved = currentProductRepository.save(product);
        return toResponse(saved);
    }

    @Transactional
    public boolean deleteCurrentMedicine(String userId, String productId) {
        Optional<CurrentProduct> optional = currentProductRepository.findByIdAndUserUserId(productId, userId);
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
