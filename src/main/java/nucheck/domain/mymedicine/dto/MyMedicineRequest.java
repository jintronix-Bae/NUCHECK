package nucheck.domain.mymedicine.dto;

import lombok.Builder;
import java.util.List;

@Builder
public record MyMedicineRequest(
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
