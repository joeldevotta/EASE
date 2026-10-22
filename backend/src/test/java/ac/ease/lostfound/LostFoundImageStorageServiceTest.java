package ac.ease.lostfound;

import static org.junit.jupiter.api.Assertions.*;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

class LostFoundImageStorageServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void storesJpegBasedOnMagicBytesNotDeclaredMime() throws Exception {
        LostFoundImageStorageService storage = storage();
        MockMultipartFile file = new MockMultipartFile(
            "image",
            "photo.jpg",
            "application/octet-stream",
            jpegBytes()
        );

        StoredLostFoundImage stored = storage.store(file);
        assertTrue(stored.storedName().endsWith(".jpg"));
        assertEquals("image/jpeg", stored.contentType());
        assertEquals("photo.jpg", stored.originalName());
    }

    @Test
    void rejectsExecutableExtensionEvenWithImageMagic() {
        LostFoundImageStorageService storage = storage();
        MockMultipartFile file = new MockMultipartFile(
            "image",
            "photo.exe",
            "image/jpeg",
            jpegBytes()
        );

        ResponseStatusException blocked = assertThrows(
            ResponseStatusException.class,
            () -> storage.store(file)
        );
        assertEquals(HttpStatus.BAD_REQUEST, blocked.getStatusCode());
    }

    @Test
    void storesValidPngAndRejectsHtmlSpoof() throws Exception {
        LostFoundImageStorageService storage = storage();
        MockMultipartFile png = new MockMultipartFile(
            "image",
            "item.png",
            "image/gif",
            pngBytes()
        );
        StoredLostFoundImage stored = storage.store(png);
        assertTrue(stored.storedName().endsWith(".png"));
        assertEquals("image/png", stored.contentType());
        assertTrue(Files.exists(tempDir.resolve(stored.storedName())));

        MockMultipartFile html = new MockMultipartFile(
            "image",
            "item.png",
            "image/png",
            "<html><script>alert(1)</script></html>".getBytes(StandardCharsets.UTF_8)
        );
        ResponseStatusException rejected = assertThrows(
            ResponseStatusException.class,
            () -> storage.store(html)
        );
        assertEquals(HttpStatus.BAD_REQUEST, rejected.getStatusCode());
    }

    @Test
    void rejectsOversizedUpload() {
        LostFoundImageProperties properties = new LostFoundImageProperties();
        properties.setUploadDir(tempDir.toString());
        properties.setMaxFileSizeBytes(32);
        LostFoundImageStorageService storage = new LostFoundImageStorageService(properties);

        MockMultipartFile file = new MockMultipartFile(
            "image",
            "item.jpg",
            "image/jpeg",
            jpegBytes()
        );
        ResponseStatusException rejected = assertThrows(
            ResponseStatusException.class,
            () -> storage.store(file)
        );
        assertEquals(HttpStatus.BAD_REQUEST, rejected.getStatusCode());
    }

    @Test
    void emptyFileIsSkipped() {
        LostFoundImageStorageService storage = storage();
        MockMultipartFile empty = new MockMultipartFile("image", new byte[0]);
        assertTrue(storage.storeOptional(empty).isEmpty());
        assertTrue(storage.storeOptional(null).isEmpty());
    }

    @Test
    void rejectsPathTraversalStoredNames() {
        LostFoundImageStorageService storage = storage();
        ResponseStatusException missing = assertThrows(
            ResponseStatusException.class,
            () -> storage.load("../secret.jpg")
        );
        assertEquals(HttpStatus.NOT_FOUND, missing.getStatusCode());
    }

    private LostFoundImageStorageService storage() {
        LostFoundImageProperties properties = new LostFoundImageProperties();
        properties.setUploadDir(tempDir.toString());
        properties.setMaxFileSizeBytes(5_242_880L);
        return new LostFoundImageStorageService(properties);
    }

    private static byte[] jpegBytes() {
        byte[] bytes = new byte[32];
        bytes[0] = (byte) 0xFF;
        bytes[1] = (byte) 0xD8;
        bytes[2] = (byte) 0xFF;
        bytes[3] = (byte) 0xE0;
        return bytes;
    }

    private static byte[] pngBytes() {
        return new byte[] {
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0, 0, 0, 0, 0, 0, 0, 0
        };
    }
}
