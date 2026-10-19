package ac.ease.student;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "student_accounts", uniqueConstraints = @UniqueConstraint(name = "uk_student_register_number", columnNames = "register_number"))
public class StudentAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "register_number", nullable = false, length = 40)
    private String registerNumber;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private AccountStatus status = AccountStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    protected StudentAccount() {}

    public StudentAccount(String registerNumber, String passwordHash) {
        this.registerNumber = registerNumber;
        this.passwordHash = passwordHash;
        this.status = AccountStatus.PENDING;
    }

    @PreUpdate
    void touch() { updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getRegisterNumber() { return registerNumber; }
    public String getPasswordHash() { return passwordHash; }
    public AccountStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setStatus(AccountStatus status) { this.status = status; }

    public enum AccountStatus { PENDING, APPROVED, REJECTED }
}
