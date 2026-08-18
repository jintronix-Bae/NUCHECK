package nucheck.domain.mymedicine.entity;

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
@Table(name = "current_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentProduct {

    @Id
    private String id; // UUID

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String category;
    private String form;
    private Integer dosagePerDay;
    private String purpose;
    private String notes;

    private LocalDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "currentProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CurrentIngredient> ingredients = new ArrayList<>();

    public void addIngredient(CurrentIngredient ingredient) {
        if (this.ingredients == null) {
            this.ingredients = new ArrayList<>();
        }
        this.ingredients.add(ingredient);
        ingredient.setCurrentProduct(this);
    }
}
