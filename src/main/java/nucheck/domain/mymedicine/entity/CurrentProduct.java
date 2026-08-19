package nucheck.domain.mymedicine.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nucheck.domain.mymedicine.dto.IngredientDto;
import nucheck.domain.mymedicine.dto.MyMedicineRequest;
import nucheck.domain.user.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "current_products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CurrentProduct {

    @Id
    private String id; // UUID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String category;
    private String form;
    private Integer dosagePerDay;
    private String purpose;
    private String notes;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "currentProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CurrentIngredient> ingredients = new ArrayList<>();

    // 정적 생성 메서드 (create)
    public static CurrentProduct createCurrentProduct(MyMedicineRequest request, User user) {
        CurrentProduct product = new CurrentProduct();
        product.id = (request.id() != null && !request.id().isBlank()) ? request.id() : UUID.randomUUID().toString();
        product.user = user;
        product.name = request.name() != null ? request.name() : "";
        product.brand = request.brand() != null ? request.brand() : "";
        product.category = request.category() != null ? request.category() : "supplement";
        product.form = request.form() != null ? request.form() : "";
        product.dosagePerDay = request.dosagePerDay() != null ? request.dosagePerDay() : 1;
        product.purpose = request.purpose() != null ? request.purpose() : "";
        product.notes = request.notes() != null ? request.notes() : "";
        product.createdAt = LocalDateTime.now();

        if (request.ingredients() != null) {
            for (IngredientDto ingDto : request.ingredients()) {
                product.addIngredient(CurrentIngredient.createCurrentIngredient(ingDto, product));
            }
        }
        return product;
    }

    // 수정 메서드 (update)
    public void updateCurrentProduct(MyMedicineRequest request) {
        this.name = request.name() != null ? request.name() : this.name;
        this.brand = request.brand() != null ? request.brand() : this.brand;
        this.category = request.category() != null ? request.category() : this.category;
        this.form = request.form() != null ? request.form() : this.form;
        this.dosagePerDay = request.dosagePerDay() != null ? request.dosagePerDay() : this.dosagePerDay;
        this.purpose = request.purpose() != null ? request.purpose() : this.purpose;
        this.notes = request.notes() != null ? request.notes() : this.notes;

        this.ingredients.clear();
        if (request.ingredients() != null) {
            for (IngredientDto ingDto : request.ingredients()) {
                this.addIngredient(CurrentIngredient.createCurrentIngredient(ingDto, this));
            }
        }
    }

    public void addIngredient(CurrentIngredient ingredient) {
        this.ingredients.add(ingredient);
    }
}
