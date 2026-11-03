package ac.ease.admin;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAccountService {
    private final AdminAccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminAccountService(AdminAccountRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AdminAccountResponse> list() {
        return repository.findAll().stream().map(AdminAccountResponse::from).toList();
    }

    @Transactional
    public AdminAccountResponse create(CreateAdminRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (repository.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already in use");
        }
        if (repository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already in use");
        }

        AdminAccount saved = repository.save(new AdminAccount(
            username, email, passwordEncoder.encode(request.password())
        ));
        return AdminAccountResponse.from(saved);
    }
}