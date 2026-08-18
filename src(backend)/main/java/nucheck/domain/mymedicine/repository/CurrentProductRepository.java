package nucheck.domain.mymedicine.repository;

import nucheck.domain.mymedicine.entity.CurrentProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurrentProductRepository extends JpaRepository<CurrentProduct, String> {
    List<CurrentProduct> findAllByUserIdOrderByCreatedAtAsc(String userId);
    Optional<CurrentProduct> findByIdAndUserId(String id, String userId);
    void deleteByIdAndUserId(String id, String userId);
}
