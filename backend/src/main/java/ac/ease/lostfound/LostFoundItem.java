package ac.ease.lostfound;

import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "lost_found_reports")
public class LostFoundItem {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(nullable = false, length = 180)
    private String itemName;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(nullable = false, length = 20)
    private String reportType;

    @Column(nullable = false, length = 180)
    private String location;

    @Column(nullable = false, length = 100)
    private String contactName;

    @Column(nullable = false, length = 180)
    private String contactEmail;

    @Column(nullable = false, length = 20)
    private String publicationStatus;

    @Column(length = 2000)
    private String rejectionReason;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @JsonIgnore
    @Column(length = 80)
    private String imageStoredName;

    @Column(length = 180)
    private String imageOriginalName;

    @JsonIgnore
    @Column(length = 40)
    private String imageContentType;

    @JsonIgnore
    private Long imageSizeBytes;

    protected LostFoundItem() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getPublicationStatus() {
        return publicationStatus;
    }

    public void setPublicationStatus(String publicationStatus) {
        this.publicationStatus = publicationStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getImageStoredName() {
        return imageStoredName;
    }

    public void setImageStoredName(String imageStoredName) {
        this.imageStoredName = imageStoredName;
    }

    public String getImageOriginalName() {
        return imageOriginalName;
    }

    public void setImageOriginalName(String imageOriginalName) {
        this.imageOriginalName = imageOriginalName;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Long getImageSizeBytes() {
        return imageSizeBytes;
    }

    public void setImageSizeBytes(Long imageSizeBytes) {
        this.imageSizeBytes = imageSizeBytes;
    }

    @JsonProperty("hasImage")
    public boolean hasImage() {
        return imageStoredName != null && !imageStoredName.isBlank();
    }
}
