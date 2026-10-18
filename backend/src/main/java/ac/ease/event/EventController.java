package ac.ease.event;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EventController {
    private final EventService service;
    public EventController(EventService service) { this.service = service; }

    @GetMapping("/events")
    public List<EventItem> events(
            @RequestParam(required = false) String category,
            @RequestParam(required = false, name = "dept") String department,
            @RequestParam(required = false, name = "status") String registrationStatus) {
        return service.publicEvents(category, department, registrationStatus);
    }

    @GetMapping("/events/{id}")
    public EventItem event(@PathVariable String id) { return service.publicEvent(id); }

    @PostMapping("/events")
    @ResponseStatus(HttpStatus.CREATED)
    public EventItem submit(@Valid @RequestBody EventSubmission submission) {
        return service.submit(submission);
    }

    @GetMapping("/admin/events/pending")
    public List<EventItem> pending() { return service.pendingEvents(); }

    @PatchMapping("/admin/events/{id}/status")
    public EventItem review(@PathVariable String id, @Valid @RequestBody EventStatusRequest request) {
        return service.changeStatus(id, request);
    }

    @GetMapping("/health")
    public HealthResponse health() { return new HealthResponse("ok", "E.A.S.E. Events API"); }

    public record HealthResponse(String status, String service) {}
}
