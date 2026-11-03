package ac.ease.admin;

import java.time.Instant;

public record AdminAccountResponse(Long id, String username, String email, Instant createdAt) {
    public static AdminAccountResponse from(AdminAccount account) {
        return new AdminAccountResponse(
            account.getId(), account.getUsername(), account.getEmail(), account.getCreatedAt()
        );
    }
}