package nucheck.domain.analysis.dto;

import lombok.Builder;

@Builder
public record InteractionResponse(
        String withProduct,
        String description,
        String severity // "low" | "medium" | "high"
) {
}
