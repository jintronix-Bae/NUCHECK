package nucheck.domain.targetproduct.dto;

import lombok.Builder;
import nucheck.domain.mymedicine.dto.IngredientDto;
import java.util.List;

@Builder
public record TargetProductRequest(
        String id,
        String name,
        String brand,
        String category,
        String form,
        Integer dosagePerDay,
        String purpose,
        String notes,
        List<IngredientDto> ingredients
) {
}
