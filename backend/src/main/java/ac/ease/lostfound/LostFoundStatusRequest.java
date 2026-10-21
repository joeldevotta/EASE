package ac.ease.lostfound;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LostFoundStatusRequest(

    @NotBlank
    @Pattern(regexp = "Approved|Rejected")
    String status,

    @Size(max = 2000)
    String rejectionReason

) {}
