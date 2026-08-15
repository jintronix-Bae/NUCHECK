package nucheck.domain.user.service;

import lombok.RequiredArgsConstructor;
import nucheck.domain.user.entity.User;
import nucheck.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    // #1 userRepository에서 사용자 UUID 존재 여부 판별
    public boolean existsByUserId(String userId) {
        return userRepository.existsById(userId);
    }


}
