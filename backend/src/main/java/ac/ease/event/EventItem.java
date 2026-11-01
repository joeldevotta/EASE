package ac.ease.event;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_event_publication_status", columnList = "publication_status"),
    @Index(name = "idx_event_start_date", columnList = "start_date")
})
public class EventItem {
    @Id
    @Column(length = 36, nullable = false, updatable = false)
    private String id;
    @Column(length = 180, nullable = false) private String title;
    @Column(columnDefinition = "TEXT", nullable = false) private String description;
    @Column(length = 60, nullable = false) private String category;
    @Column(name = "start_date", length = 30, nullable = false) private String startDate;
    @Column(length = 30, nullable = false) private String startTime;
    @Column(name = "end_date", length = 30, nullable = false) private String endDate;
    @Column(length = 30, nullable = false) private String endTime;
    @Column(length = 180, nullable = false) private String venue;
    @Column(length = 160, nullable = false) private String department;
    @Column(name = "organizing_club", length = 160, nullable = false) private String organizingClub;
    @Column(name = "faculty_coordinator", length = 160, nullable = false) private String facultyCoordinator;
    @Column(name = "faculty_coordinator_emp_id", length = 80) private String facultyCoordinatorEmpId;
    @Column(name = "coordinator_contact", length = 100) private String coordinatorContact;
    @Column(columnDefinition = "TEXT", nullable = false) private String eligibility;
    @Column(name = "registration_deadline", length = 40, nullable = false) private String registrationDeadline;
    @Column(name = "registration_url", length = 2048) private String registrationUrl;
    @Column(name = "registration_status", length = 40, nullable = false) private String registrationStatus;
    @Column(name = "poster_image", length = 2048) private String posterImage;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    @Column(name = "publication_status", length = 20, nullable = false) private String publicationStatus;
    @Column(name = "is_hero") private Boolean isHero;
    @Column(name = "col_span") private Integer colSpan;
    private Double rotation;
    @Column(name = "pin_type", length = 30) private String pinType;
    @Column(name = "has_tape") private Boolean hasTape;
    @Column(name = "has_clip") private Boolean hasClip;
    @Column(name = "is_circular_letterhead") private Boolean isCircularLetterhead;
    @Column(columnDefinition = "TEXT") private String prizes;
    @Column(name = "team_size", length = 100) private String teamSize;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "json") private List<String> tags;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "post_it", columnDefinition = "json") private Map<String, Object> postIt;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "json") private Map<String, Object> speaker;
    @Column(name = "rejection_reason", columnDefinition = "TEXT") private String rejectionReason;
    @Column(length = 220, unique = true) private String slug;

    protected EventItem() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String v) { title = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { description = v; }
    public String getCategory() { return category; }
    public void setCategory(String v) { category = v; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String v) { startDate = v; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String v) { startTime = v; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String v) { endDate = v; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String v) { endTime = v; }
    public String getVenue() { return venue; }
    public void setVenue(String v) { venue = v; }
    public String getDepartment() { return department; }
    public void setDepartment(String v) { department = v; }
    public String getOrganizingClub() { return organizingClub; }
    public void setOrganizingClub(String v) { organizingClub = v; }
    public String getFacultyCoordinator() { return facultyCoordinator; }
    public void setFacultyCoordinator(String v) { facultyCoordinator = v; }
    public String getFacultyCoordinatorEmpId() { return facultyCoordinatorEmpId; }
    public void setFacultyCoordinatorEmpId(String v) { facultyCoordinatorEmpId = v; }
    public String getCoordinatorContact() { return coordinatorContact; }
    public void setCoordinatorContact(String v) { coordinatorContact = v; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String v) { eligibility = v; }
    public String getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(String v) { registrationDeadline = v; }
    public String getRegistrationUrl() { return registrationUrl; }
    public void setRegistrationUrl(String v) { registrationUrl = v; }
    public String getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(String v) { registrationStatus = v; }
    public String getPosterImage() { return posterImage; }
    public void setPosterImage(String v) { posterImage = v; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant v) { createdAt = v; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant v) { updatedAt = v; }
    public String getPublicationStatus() { return publicationStatus; }
    public void setPublicationStatus(String v) { publicationStatus = v; }
    public Boolean getIsHero() { return isHero; }
    public void setIsHero(Boolean v) { isHero = v; }
    public Integer getColSpan() { return colSpan; }
    public void setColSpan(Integer v) { colSpan = v; }
    public Double getRotation() { return rotation; }
    public void setRotation(Double v) { rotation = v; }
    public String getPinType() { return pinType; }
    public void setPinType(String v) { pinType = v; }
    public Boolean getHasTape() { return hasTape; }
    public void setHasTape(Boolean v) { hasTape = v; }
    public Boolean getHasClip() { return hasClip; }
    public void setHasClip(Boolean v) { hasClip = v; }
    public Boolean getIsCircularLetterhead() { return isCircularLetterhead; }
    public void setIsCircularLetterhead(Boolean v) { isCircularLetterhead = v; }
    public String getPrizes() { return prizes; }
    public void setPrizes(String v) { prizes = v; }
    public String getTeamSize() { return teamSize; }
    public void setTeamSize(String v) { teamSize = v; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> v) { tags = v; }
    public Map<String, Object> getPostIt() { return postIt; }
    public void setPostIt(Map<String, Object> v) { postIt = v; }
    public Map<String, Object> getSpeaker() { return speaker; }
    public void setSpeaker(Map<String, Object> v) { speaker = v; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String v) { rejectionReason = v; }
    public String getSlug() { return slug; }
    public void setSlug(String v) { slug = v; }
}
