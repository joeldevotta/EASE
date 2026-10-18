package ac.ease.event;

import java.util.List;
import java.util.Map;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record EventSubmission(
    @NotBlank @Size(max = 180) String title,
    @NotBlank @Size(max = 10000) String description,
    @NotBlank @Size(max = 60) String category,
    @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}(T.*)?") String startDate,
    @NotBlank @Size(max = 30) String startTime,
    @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}(T.*)?") String endDate,
    @NotBlank @Size(max = 30) String endTime,
    @NotBlank @Size(max = 180) String venue,
    @NotBlank @Size(max = 160) String department,
    @NotBlank @Size(max = 160) String organizingClub,
    @NotBlank @Size(max = 160) String facultyCoordinator,
    @Size(max = 80) String facultyCoordinatorEmpId,
    @Size(max = 100) String coordinatorContact,
    @NotBlank @Size(max = 2000) String eligibility,
    @NotBlank @Size(max = 40) String registrationDeadline,
    @Size(max = 2048) String registrationUrl,
    @NotBlank @Size(max = 40) String registrationStatus,
    @Size(max = 2048) String posterImage,
    @Size(max = 2000) String prizes,
    @Size(max = 100) String teamSize,
    List<String> tags,
    Map<String, Object> postIt,
    Map<String, Object> speaker,
    Boolean isHero,
    Integer colSpan,
    Double rotation,
    String pinType,
    Boolean hasTape,
    Boolean hasClip,
    Boolean isCircularLetterhead,
    @Size(max = 220) String slug
) {}
