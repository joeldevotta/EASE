package ac.ease.lostfound;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LostFoundService {

    private final LostFoundRepository repository;
    private final LostFoundImageStorageService imageStorage;

    public LostFoundService(
            LostFoundRepository repository,
            LostFoundImageStorageService imageStorage) {
        this.repository = repository;
        this.imageStorage = imageStorage;
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
        return submit(request, null);
    }

    @Transactional
    public LostFoundItem submit(
            LostFoundSubmission request,
            MultipartFile image) {
        StoredLostFoundImage storedImage = imageStorage.storeOptional(image)
            .orElse(null);

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

        if (storedImage != null) {
            report.setImageStoredName(storedImage.storedName());
            report.setImageOriginalName(storedImage.originalName());
            report.setImageContentType(storedImage.contentType());
            report.setImageSizeBytes(storedImage.sizeBytes());
        }

        Instant now = Instant.now();
        report.setCreatedAt(now);
        report.setUpdatedAt(now);

        try {
            return repository.save(report);
        } catch (RuntimeException ex) {
            if (storedImage != null) {
                imageStorage.deleteQuietly(storedImage.storedName());
            }
            throw ex;
        }
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

    @Transactional(readOnly = true)
    public ResponseEntity<Resource> publicImage(String id) {
        LostFoundItem report = repository.findById(id).orElse(null);
        if (report == null
                || !"Approved".equals(report.getPublicationStatus())
                || !report.hasImage()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
        }
        return imageResponse(report, false);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Resource> adminImage(String id) {
        LostFoundItem report = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Lost & Found report not found"
            ));
        if (!report.hasImage()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
        }
        return imageResponse(report, true);
    }

    private ResponseEntity<Resource> imageResponse(LostFoundItem report, boolean admin) {
        Resource resource = imageStorage.load(report.getImageStoredName());
        MediaType mediaType = MediaType.parseMediaType(
            report.getImageContentType() != null
                ? report.getImageContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE
        );
        String filename = report.getImageOriginalName() != null
            ? report.getImageOriginalName()
            : "lost-found-image";
        ContentDisposition disposition = ContentDisposition.inline()
            .filename(filename, StandardCharsets.UTF_8)
            .build();
        return ResponseEntity.ok()
            .contentType(mediaType)
            .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
            .header(
                HttpHeaders.CACHE_CONTROL,
                admin ? "private, no-store" : "public, max-age=300"
            )
            .body(resource);
    }
}
