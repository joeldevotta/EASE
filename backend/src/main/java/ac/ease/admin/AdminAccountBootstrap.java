package ac.ease.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminAccountBootstrap implements ApplicationRunner {
    private final AdminAccountRepository repository;
    private final PasswordEncoder encoder;
    private final String username;
    private final String email;
    private final String password;

    public AdminAccountBootstrap(
            AdminAccountRepository repository,
            PasswordEncoder encoder,
            @Value("${ease.admin.username}") String username,
            @Value("${ease.admin.email:}") String email,
            @Value("${ease.admin.password}") String password) {
        this.repository = repository;
        this.encoder = encoder;
        this.username = username.trim();
        this.email = (email == null || email.isBlank())
            ? username.trim() + "@bootstrap.invalid" : email.trim().toLowerCase();
        this.password = password;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!repository.existsByUsernameIgnoreCase(username)) {
            repository.save(new AdminAccount(username, email, encoder.encode(password)));
        }
    }
}