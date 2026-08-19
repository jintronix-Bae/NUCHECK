package nucheck.domain.analysis.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

public record AnalysisResponse(
        String verdict,
        String summary,
        List<OverlapRow> overlaps,
        List<String> pros,
        List<String> cons,
        List<Interaction> interactions,
        String recommendation
){
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record OverlapRow(
            String ingredient,
            Double currentAmout,
            Double newAmount,
            Double combinedAmount,
            String unit,
            String upperLimit,
            String risk,
            String note
    ) {}

    public record Interaction(
            String with,
            String description,
            String severity
    ) {}
}