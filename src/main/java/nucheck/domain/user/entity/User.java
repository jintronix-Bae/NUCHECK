package nucheck.domain.user.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nucheck.domain.mymedicine.entity.CurrentProduct;
import nucheck.domain.targetproduct.entity.TargetProduct;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    // UUID
    @Id
    @Column(nullable = false, updatable = false)
    private String userId;

    // 사용자 최초 접속 일시
    @Column(nullable = false, updatable = false)
    private LocalDateTime createTime;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CurrentProduct> currentProducts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TargetProduct> targetProducts = new ArrayList<>();

    public User(String userId) {
        this.userId = userId;
        this.createTime = LocalDateTime.now();
    }
}
