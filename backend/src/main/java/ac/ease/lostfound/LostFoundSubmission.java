package ac.ease.lostfound;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LostFoundSubmission(

    @NotBlank
    @Size(max = 180)
    String itemName,

    @NotBlank
    @Size(max = 5000)
    String description,

    @NotBlank
    @Pattern(regexp = "LOST|FOUND")
    String reportType,

    @NotBlank
    @Size(max = 180)
    String location,

    @NotBlank
    @Size(max = 100)
    String contactName,

    @NotBlank
    @Email
    @Size(max = 180)
    String contactEmail

) {}
