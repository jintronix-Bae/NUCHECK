package nucheck.domain.analysis.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.util.List;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AnalysisResponse(
        String verdict,       // "recommend" | "caution" | "avoid"
        String summary,
        List<OverlapRow> overlaps,
        List<String> pros,
        List<String> cons,
        List<Interaction> interactions,
        String recommendation
) {

    @Builder
    public record OverlapRow(
            String ingredient,
            Double currentAmount,
            Double newAmount,
            Double combinedAmount,
            String unit,
            String upperLimit,
            String risk,   // "low" | "medium" | "high"
            String note
    ) {}

    @Builder
    public record Interaction(
            String withProduct,
            String description,
            String severity // "low" | "medium" | "high"
    ) {}
}
