package nucheck.domain.targetproduct.repository;

import nucheck.domain.targetproduct.entity.TargetProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TargetProductRepository extends JpaRepository<TargetProduct, String> {
    Optional<TargetProduct> findByUserId(String userId);
}
