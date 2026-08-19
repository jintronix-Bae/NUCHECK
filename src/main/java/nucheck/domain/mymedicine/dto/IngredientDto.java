package nucheck.domain.mymedicine.dto;

import lombok.Builder;

@Builder
public record IngredientDto(
        String name,
        Double amount,
        String unit
) {
}
