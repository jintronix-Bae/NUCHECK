package nucheck.domain.analysis.dto;

import lombok.Builder;
import java.util.List;

@Builder
public record AnalysisResponse(
        String verdict, // "recommend" | "caution" | "avoid"
        String summary,
        List<OverlapRowResponse> overlaps,
        List<String> pros,
        List<String> cons,
        List<InteractionResponse> interactions,
        String recommendation
) {
}
