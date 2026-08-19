package nucheck.domain.analysis.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nucheck.domain.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // recommend | caution | avoid
    @Column(nullable = false)
    private String verdict;

    @Column(nullable = false)
    private String summary;

    // JSON 문자열로 overlaps 배열 저장
    @Column(columnDefinition = "TEXT")
    private String overlaps;

    // JSON 문자열로 pros 배열 저장
    @Column(columnDefinition = "TEXT")
    private String pros;

    // JSON 문자열로 cons 배열 저장
    @Column(columnDefinition = "TEXT")
    private String cons;

    // JSON 문자열로 interactions 배열 저장
    @Column(columnDefinition = "TEXT")
    private String interactions;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    // 분석 대상 제품명 (어떤 제품에 대한 분석인지 기록)
    private String targetProductName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AnalysisResult(User user, String verdict, String summary,
                          String overlaps, String pros, String cons,
                          String interactions, String recommendation,
                          String targetProductName) {
        this.user = user;
        this.verdict = verdict;
        this.summary = summary;
        this.overlaps = overlaps;
        this.pros = pros;
        this.cons = cons;
        this.interactions = interactions;
        this.recommendation = recommendation;
        this.targetProductName = targetProductName;
        this.createdAt = LocalDateTime.now();
    }
}
