package ac.ease.lostfound;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/lost-found/{id}/image")
    public ResponseEntity<Resource> publicImage(@PathVariable String id) {
        return service.publicImage(id);
    }

    @PostMapping(value = "/lost-found", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public LostFoundPublicResponse submitJson(
            @Valid @RequestBody LostFoundSubmission submission) {
        return LostFoundPublicResponse.from(service.submit(submission));
    }

    @PostMapping(value = "/lost-found", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public LostFoundPublicResponse submitMultipart(
            @Valid @ModelAttribute LostFoundSubmission submission,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return LostFoundPublicResponse.from(service.submit(submission, image));
    }

    @GetMapping("/admin/lost-found")
    public List<LostFoundItem> adminReports(
            @RequestParam(required = false) String status) {
        return service.adminReports(status);
    }

    @GetMapping("/admin/lost-found/{id}/image")
    public ResponseEntity<Resource> adminImage(@PathVariable String id) {
        return service.adminImage(id);
    }

    @PatchMapping("/admin/lost-found/{id}/status")
    public LostFoundItem review(
            @PathVariable String id,
            @Valid @RequestBody LostFoundStatusRequest request) {
        return service.changeStatus(id, request);
    }
}
