package ac.ease.lostfound;

import java.time.Instant;

public record LostFoundPublicResponse(
    String id,
    String itemName,
    String description,
    String reportType,
    String location,
    Instant createdAt
) {
    public static LostFoundPublicResponse from(LostFoundItem item) {
        return new LostFoundPublicResponse(
            item.getId(),
            item.getItemName(),
            item.getDescription(),
            item.getReportType(),
            item.getLocation(),
            item.getCreatedAt()
        );
    }
}
