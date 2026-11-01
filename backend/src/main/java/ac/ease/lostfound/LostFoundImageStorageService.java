package ac.ease.lostfound;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LostFoundImageStorageService {

    private static final Pattern SAFE_STORED_NAME =
        Pattern.compile("^[0-9a-fA-F-]{36}\\.(jpg|png|webp)$");
    private static final Set<String> BLOCKED_EXTENSIONS = Set.of(
        ".exe", ".bat", ".cmd", ".com", ".msi", ".js", ".mjs", ".html", ".htm",
        ".svg", ".xml", ".php", ".sh", ".ps1", ".dll", ".jar", ".war"
    );

    private final LostFoundImageProperties properties;

    public LostFoundImageStorageService(LostFoundImageProperties properties) {
        this.properties = properties;
    }

    public Optional<StoredLostFoundImage> storeOptional(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(store(file));
    }

    public StoredLostFoundImage store(MultipartFile file) {
        if (file.getSize() > properties.getMaxFileSizeBytes()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Image must be 5 MB or smaller."
            );
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Could not read the uploaded image."
            );
        }

        if (bytes.length > properties.getMaxFileSizeBytes()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Image must be 5 MB or smaller."
            );
        }

        DetectedImage type = detectType(bytes);
        if (type == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only JPEG, PNG, and WebP images are accepted."
            );
        }

        String originalName = sanitizeOriginalName(file.getOriginalFilename());
        rejectDangerousExtension(originalName);

        String storedName = UUID.randomUUID() + type.extension;
        Path directory = resolvedUploadDir();
        Path destination = directory.resolve(storedName).normalize();
        if (!destination.startsWith(directory)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid image storage path."
            );
        }

        try {
            Files.createDirectories(directory);
            Files.write(destination, bytes);
        } catch (IOException ex) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not store the uploaded image."
            );
        }

        return new StoredLostFoundImage(
            storedName,
            originalName,
            type.contentType,
            bytes.length
        );
    }

    public Resource load(String storedName) {
        String safeName = requireSafeStoredName(storedName);
        Path directory = resolvedUploadDir();
        Path file = directory.resolve(safeName).normalize();
        if (!file.startsWith(directory) || !Files.isRegularFile(file)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
        }
        try {
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
            }
            return resource;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
        }
    }

    public void deleteQuietly(String storedName) {
        if (storedName == null || storedName.isBlank()) {
            return;
        }
        try {
            String safeName = requireSafeStoredName(storedName);
            Path directory = resolvedUploadDir();
            Path file = directory.resolve(safeName).normalize();
            if (file.startsWith(directory)) {
                Files.deleteIfExists(file);
            }
        } catch (RuntimeException | IOException ignored) {
            // Cleanup must not mask the original submit/review error.
        }
    }

    static DetectedImage detectType(byte[] bytes) {
        if (bytes == null || bytes.length < 12) {
            return null;
        }
        if (bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xD8 && bytes[2] == (byte) 0xFF) {
            return DetectedImage.JPEG;
        }
        if (bytes[0] == (byte) 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47
                && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A) {
            return DetectedImage.PNG;
        }
        String header = new String(bytes, 0, 4, StandardCharsets.US_ASCII);
        String webp = new String(bytes, 8, 4, StandardCharsets.US_ASCII);
        if ("RIFF".equals(header) && "WEBP".equals(webp)) {
            return DetectedImage.WEBP;
        }
        return null;
    }

    private Path resolvedUploadDir() {
        Path configured = Paths.get(properties.getUploadDir()).toAbsolutePath().normalize();
        return configured;
    }

    private static String requireSafeStoredName(String storedName) {
        if (storedName == null || !SAFE_STORED_NAME.matcher(storedName).matches()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
        }
        return storedName;
    }

    private static String sanitizeOriginalName(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "upload";
        }
        String name = Paths.get(originalFilename.replace('\\', '/')).getFileName().toString();
        name = name.replaceAll("[\\p{Cntrl}<>:\"|?*]", "_").trim();
        if (name.isBlank() || ".".equals(name) || "..".equals(name)) {
            return "upload";
        }
        return name.length() > 180 ? name.substring(0, 180) : name;
    }

    private static void rejectDangerousExtension(String originalName) {
        String lower = originalName.toLowerCase(Locale.ROOT);
        int dot = lower.lastIndexOf('.');
        if (dot < 0) {
            return;
        }
        String extension = lower.substring(dot);
        if (BLOCKED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only JPEG, PNG, and WebP images are accepted."
            );
        }
    }

    enum DetectedImage {
        JPEG(".jpg", "image/jpeg"),
        PNG(".png", "image/png"),
        WEBP(".webp", "image/webp");

        final String extension;
        final String contentType;

        DetectedImage(String extension, String contentType) {
            this.extension = extension;
            this.contentType = contentType;
        }
    }
}
