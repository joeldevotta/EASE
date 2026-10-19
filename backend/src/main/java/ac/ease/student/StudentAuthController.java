package ac.ease.student;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/student")
public class StudentAuthController {
    private final StudentAccountRepository accounts;
    private final PasswordEncoder passwords;
    private final StudentTokenService tokens;

    public StudentAuthController(StudentAccountRepository accounts, PasswordEncoder passwords, StudentTokenService tokens) {
        this.accounts = accounts;
        this.passwords = passwords;
        this.tokens = tokens;
    }

    public record RegisterRequest(
        @NotBlank @Size(max = 40) @Pattern(regexp = "^[A-Za-z0-9/-]{5,40}$", message = "Enter a valid college register number.")
        String registerNumber,
        @NotBlank @Size(min = 10, max = 72) String password
    ) {}

    public record LoginRequest(
        @NotBlank @Size(max = 40) String registerNumber,
        @NotBlank @Size(max = 72) String password
    ) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String registerNumber = request.registerNumber().trim().toUpperCase();
        if (accounts.existsByRegisterNumber(registerNumber)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "An account already exists for this register number. Contact student support if this is your account."));
        }
        accounts.save(new StudentAccount(registerNumber, passwords.encode(request.password())));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "status", "PENDING",
            "message", "Registration received. Your account must be approved before you can sign in."
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String registerNumber = request.registerNumber().trim().toUpperCase();
        var account = accounts.findByRegisterNumber(registerNumber).orElse(null);
        if (account == null || !passwords.matches(request.password(), account.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid register number or password."));
        }
        if (account.getStatus() != StudentAccount.AccountStatus.APPROVED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "message", account.getStatus() == StudentAccount.AccountStatus.PENDING
                    ? "Your registration is awaiting approval."
                    : "This registration was not approved. Please contact student support."
            ));
        }
        return ResponseEntity.ok(Map.of(
            "token", tokens.create(registerNumber),
            "user", Map.of("identifier", registerNumber, "name", "Student " + registerNumber, "role", "student", "department", "", "email", "")
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof String registerNumber)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authentication required."));
        }
        return accounts.findByRegisterNumber(registerNumber)
            .filter(a -> a.getStatus() == StudentAccount.AccountStatus.APPROVED)
            .<ResponseEntity<?>>map(a -> ResponseEntity.ok(Map.of(
                "identifier", a.getRegisterNumber(), "name", "Student " + a.getRegisterNumber(),
                "role", "student", "department", "", "email", ""
            )))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Student account is no longer active.")));
    }
}
