package ac.ease.lostfound;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LostFoundService {

    private final LostFoundRepository repository;

    public LostFoundService(LostFoundRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<LostFoundItem> publicReports() {
        return repository
            .findByPublicationStatusOrderByCreatedAtDesc("Approved");
    }

    @Transactional(readOnly = true)
    public List<LostFoundItem> adminReports(String status) {
        if (status == null || status.isBlank()
                || "all".equalsIgnoreCase(status)) {
            return repository.findAllByOrderByCreatedAtDesc();
        }

        if (!List.of("Pending", "Approved", "Rejected")
                .contains(status)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Unsupported publication status"
            );
        }

        return repository
            .findByPublicationStatusOrderByCreatedAtDesc(status);
    }

    @Transactional
    public LostFoundItem submit(LostFoundSubmission request) {
        LostFoundItem report = new LostFoundItem();

        report.setId(UUID.randomUUID().toString());
        report.setItemName(request.itemName().trim());
        report.setDescription(request.description().trim());
        report.setReportType(request.reportType());
        report.setLocation(request.location().trim());
        report.setContactName(request.contactName().trim());
        report.setContactEmail(request.contactEmail().trim());
        report.setPublicationStatus("Pending");
        report.setRejectionReason(null);

        Instant now = Instant.now();
        report.setCreatedAt(now);
        report.setUpdatedAt(now);

        return repository.save(report);
    }

    @Transactional
    public LostFoundItem changeStatus(
            String id,
            LostFoundStatusRequest request) {

        LostFoundItem report = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Lost & Found report not found"
            ));

        if (!"Pending".equals(report.getPublicationStatus())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Only pending reports can be reviewed"
            );
        }

        if ("Rejected".equals(request.status())
                && (request.rejectionReason() == null
                || request.rejectionReason().isBlank())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A rejection reason is required"
            );
        }

        report.setPublicationStatus(request.status());
        report.setRejectionReason(
            "Rejected".equals(request.status())
                ? request.rejectionReason().trim()
                : null
        );
        report.setUpdatedAt(Instant.now());

        return repository.save(report);
    }
}
