package ac.ease.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAdminRequest(
    @NotBlank @Size(min = 3, max = 80) String username,
    @NotBlank @Email @Size(max = 254) String email,
    @NotBlank @Size(min = 16, max = 128) String password
) {}