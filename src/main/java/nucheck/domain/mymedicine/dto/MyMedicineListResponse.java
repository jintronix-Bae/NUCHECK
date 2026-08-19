package nucheck.domain.mymedicine.dto;

import lombok.Builder;
import java.util.List;

@Builder
public record MyMedicineListResponse(
        List<MyMedicineResponse> products
) {
}
