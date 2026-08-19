package nucheck.domain.analysis.repository;

import nucheck.domain.analysis.entity.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {

    List<AnalysisResult> findAllByUserUserIdOrderByCreatedAtDesc(String userId);
}
