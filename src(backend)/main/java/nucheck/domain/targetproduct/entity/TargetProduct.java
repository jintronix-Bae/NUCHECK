package nucheck.domain.targetproduct.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "target_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TargetProduct {

    @Id
    private String userId; // User당 항상 1개의 구매 예정 제품

    @Column(nullable = false)
    private String id; // UUID

    @Column(nullable = false)
    private String name;

    private String brand;
    private String category;
    private String form;
    private Integer dosagePerDay;
    private String purpose;
    private String notes;

    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "targetProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TargetIngredient> ingredients = new ArrayList<>();

    public void addIngredient(TargetIngredient ingredient) {
        if (this.ingredients == null) {
            this.ingredients = new ArrayList<>();
        }
        this.ingredients.add(ingredient);
        ingredient.setTargetProduct(this);
    }
}
