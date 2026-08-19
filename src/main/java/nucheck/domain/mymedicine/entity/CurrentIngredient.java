package nucheck.domain.mymedicine.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nucheck.domain.mymedicine.dto.IngredientDto;

@Entity
@Table(name = "current_ingredients")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CurrentIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private CurrentProduct currentProduct;

    private String name;
    private Double amount;
    private String unit;

    public static CurrentIngredient createCurrentIngredient(IngredientDto dto, CurrentProduct currentProduct) {
        CurrentIngredient ingredient = new CurrentIngredient();
        ingredient.currentProduct = currentProduct;
        ingredient.name = dto.name() != null ? dto.name() : "";
        ingredient.amount = dto.amount() != null ? dto.amount() : 0.0;
        ingredient.unit = dto.unit() != null ? dto.unit() : "";
        return ingredient;
    }
}
