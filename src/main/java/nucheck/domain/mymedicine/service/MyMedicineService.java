package nucheck.domain.mymedicine.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.mymedicine.dto.MyMedicineListResponse;
import nucheck.domain.mymedicine.dto.MyMedicineRequest;
import nucheck.domain.mymedicine.dto.MyMedicineResponse;
import nucheck.domain.mymedicine.entity.CurrentProduct;
import nucheck.domain.mymedicine.repository.CurrentProductRepository;
import nucheck.domain.user.entity.User;
import nucheck.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
public class MyMedicineService {

    private final CurrentProductRepository currentProductRepository;
    private final UserService userService;

    // #1. 현재 복용 제품 목록 조회 - 사용자의 모든 복용 제품을 등록순으로 DTO 변환 후 반환
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

    // #2. 현재 복용 제품 엔티티 목록 조회 - 서비스 간 호출용 엔티티 리스트 반환
    @Transactional(readOnly = true)
    public List<CurrentProduct> getCurrentProductsEntity(String userId) {
        return currentProductRepository.findAllByUserUserIdOrderByCreatedAtAsc(userId);
    }

    // #3. 현재 복용 제품 등록/수정 - ID가 있으면 기존 제품 업데이트, 없으면 새로 생성
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

    // #4. 현재 복용 제품 삭제 - 사용자 소유의 특정 제품을 삭제하고 성공 여부 반환
    @Transactional
    public boolean deleteCurrentMedicine(String userId, String productId) {
        Optional<CurrentProduct> optional = currentProductRepository.findByIdAndUserUserId(productId, userId);
        if (optional.isEmpty()) {
            return false;
        }
        currentProductRepository.delete(optional.get());
        return true;
    }

    // #5. 엔티티→DTO 변환 - CurrentProduct 엔티티를 MyMedicineResponse DTO로 변환
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
