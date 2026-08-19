package nucheck.domain.mymedicine.repository;

import nucheck.domain.mymedicine.entity.CurrentProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurrentProductRepository extends JpaRepository<CurrentProduct, String> {
    List<CurrentProduct> findAllByUserUserIdOrderByCreatedAtAsc(String userId);
    Optional<CurrentProduct> findByIdAndUserUserId(String id, String userId);
    void deleteByIdAndUserUserId(String id, String userId);
}
