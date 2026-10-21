package ac.ease.student;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentAccountRepository extends JpaRepository<StudentAccount, Long> {
    Optional<StudentAccount> findByRegisterNumber(String registerNumber);
    boolean existsByRegisterNumber(String registerNumber);
    List<StudentAccount> findByStatusOrderByCreatedAtAsc(StudentAccount.AccountStatus status);
}
