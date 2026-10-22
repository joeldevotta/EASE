package ac.ease.lostfound;

public record StoredLostFoundImage(
    String storedName,
    String originalName,
    String contentType,
    long sizeBytes
) {}
