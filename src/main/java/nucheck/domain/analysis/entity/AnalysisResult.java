package nucheck.domain.analysis.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nucheck.domain.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_result")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String verdict;

    @Column(nullable = false)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String overlaps;

    @Column(columnDefinition = "TEXT")
    private String pros;

    @Column(columnDefinition = "TEXT")
    private String cons;

    @Column(columnDefinition = "TEXT")
    private String interactions;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    private String targetProductName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // #1. 분석 결과 엔티티 생성(사용자, 판정, 요약, 세부 분석 내용, 대상 제품명)
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
