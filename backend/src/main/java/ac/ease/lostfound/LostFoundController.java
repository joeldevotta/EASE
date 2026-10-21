package ac.ease.lostfound;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LostFoundController {

    private final LostFoundService service;

    public LostFoundController(LostFoundService service) {
        this.service = service;
    }

    @GetMapping("/lost-found")
    public List<LostFoundPublicResponse> publicReports() {
        return service.publicReports().stream()
            .map(LostFoundPublicResponse::from)
            .toList();
    }

    @PostMapping("/lost-found")
    @ResponseStatus(HttpStatus.CREATED)
    public LostFoundPublicResponse submit(
            @Valid @RequestBody LostFoundSubmission submission) {
        return LostFoundPublicResponse.from(service.submit(submission));
    }

    @GetMapping("/admin/lost-found")
    public List<LostFoundItem> adminReports(
            @RequestParam(required = false) String status) {
        return service.adminReports(status);
    }

    @PatchMapping("/admin/lost-found/{id}/status")
    public LostFoundItem review(
            @PathVariable String id,
            @Valid @RequestBody LostFoundStatusRequest request) {
        return service.changeStatus(id, request);
    }
}
