package nucheck.domain.analysis.dto;

import lombok.Builder;

@Builder
public record OverlapRowResponse(
        String ingredient,
        Double currentAmount,
        Double newAmount,
        Double combinedAmount,
        String unit,
        String upperLimit,
        String risk, // "low" | "medium" | "high"
        String note
) {
}
