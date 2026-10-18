package ac.ease.event;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventService {
    private final EventRepository repository;
    public EventService(EventRepository repository) { this.repository = repository; }

    @Transactional(readOnly = true)
    public List<EventItem> publicEvents(String category, String department, String status) {
        return repository.findByPublicationStatusOrderByStartDateAsc("Approved").stream()
            .filter(e -> blankOrMatches(category, e.getCategory()))
            .filter(e -> blankOrMatches(department, e.getDepartment()))
            .filter(e -> blankOrMatches(status, e.getRegistrationStatus()))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<EventItem> pendingEvents() {
        return repository.findByPublicationStatusOrderByStartDateAsc("Pending");
    }

    @Transactional(readOnly = true)
    public EventItem publicEvent(String idOrSlug) {
        EventItem event = repository.findById(idOrSlug)
            .orElseGet(() -> repository.findAll().stream()
                .filter(e -> idOrSlug.equals(e.getSlug())).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found")));
        if (!"Approved".equals(event.getPublicationStatus())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        return event;
    }

    @Transactional
    public EventItem submit(EventSubmission request) {
        if (LocalDate.parse(request.endDate().substring(0, 10))
                .isBefore(LocalDate.parse(request.startDate().substring(0, 10)))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
        EventItem e = new EventItem();
        e.setId(UUID.randomUUID().toString());
        e.setTitle(request.title().trim()); e.setDescription(request.description().trim());
        e.setCategory(request.category()); e.setStartDate(request.startDate()); e.setStartTime(request.startTime());
        e.setEndDate(request.endDate()); e.setEndTime(request.endTime()); e.setVenue(request.venue());
        e.setDepartment(request.department()); e.setOrganizingClub(request.organizingClub());
        e.setFacultyCoordinator(request.facultyCoordinator()); e.setFacultyCoordinatorEmpId(request.facultyCoordinatorEmpId());
        e.setCoordinatorContact(request.coordinatorContact()); e.setEligibility(request.eligibility());
        e.setRegistrationDeadline(request.registrationDeadline()); e.setRegistrationUrl(safeUrl(request.registrationUrl()));
        e.setRegistrationStatus(request.registrationStatus()); e.setPosterImage(safeUrl(request.posterImage()));
        e.setPrizes(request.prizes()); e.setTeamSize(request.teamSize()); e.setTags(request.tags());
        e.setPostIt(request.postIt()); e.setSpeaker(request.speaker()); e.setIsHero(request.isHero());
        e.setColSpan(request.colSpan()); e.setRotation(request.rotation()); e.setPinType(request.pinType());
        e.setHasTape(request.hasTape()); e.setHasClip(request.hasClip());
        e.setIsCircularLetterhead(request.isCircularLetterhead());
        e.setSlug(request.slug() == null || request.slug().isBlank() ? null : request.slug().trim());
        Instant now = Instant.now(); e.setCreatedAt(now); e.setUpdatedAt(now);
        e.setPublicationStatus("Pending");
        return repository.save(e);
    }

    @Transactional
    public EventItem changeStatus(String id, EventStatusRequest request) {
        EventItem e = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        if (!"Pending".equals(e.getPublicationStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only pending events can be reviewed");
        }
        if ("Rejected".equals(request.status()) && (request.rejectionReason() == null || request.rejectionReason().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A rejection reason is required");
        }
        e.setPublicationStatus(request.status());
        e.setRejectionReason("Rejected".equals(request.status()) ? request.rejectionReason().trim() : null);
        e.setUpdatedAt(Instant.now());
        return repository.save(e);
    }

    private static boolean blankOrMatches(String filter, String value) {
        return filter == null || filter.isBlank() || filter.equalsIgnoreCase("all")
            || (value != null && value.toLowerCase(Locale.ROOT).contains(filter.toLowerCase(Locale.ROOT)));
    }
    private static String safeUrl(String value) {
        if (value == null || value.isBlank()) return null;
        String trimmed = value.trim();
        if (!(trimmed.startsWith("https://") || trimmed.startsWith("http://"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "URLs must use http:// or https://");
        }
        return trimmed;
    }
}
