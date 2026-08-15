package nucheck.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class User {

    // UUID
    @Id
    @Column(nullable = false, updatable = false)
    private String userId;

    // 사용자 최초 접속 일시
    @Column(nullable = false, updatable = false)
    private LocalDateTime createTime;

    public User(String userId){
        this.userId = userId;
        this.createTime = LocalDateTime.now();
    }

    // 이후 analysis 및 다른 패키지 기능 구현하면서 @ManyToOne 등의 기능을 추가할 예정
    //-----------------------------------------------------------------------
}
