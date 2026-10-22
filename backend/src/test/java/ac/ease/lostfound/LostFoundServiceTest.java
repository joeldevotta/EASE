package ac.ease.lostfound;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

class LostFoundServiceTest {

    @Test
    void onlyPendingReportsCanBeReviewed() {
        LostFoundRepository repository = mock(LostFoundRepository.class);
        LostFoundItem item = new LostFoundItem();
        item.setId("lf-1");
        item.setPublicationStatus("Approved");
        when(repository.findById("lf-1")).thenReturn(Optional.of(item));

        LostFoundService service = new LostFoundService(repository, mock(LostFoundImageStorageService.class));
        assertThrows(ResponseStatusException.class,
            () -> service.changeStatus("lf-1", new LostFoundStatusRequest("Rejected", "Duplicate report")));
        verify(repository, never()).save(any());
    }

    @Test
    void rejectionRequiresReason() {
        LostFoundRepository repository = mock(LostFoundRepository.class);
        LostFoundItem item = new LostFoundItem();
        item.setId("lf-2");
        item.setPublicationStatus("Pending");
        item.setCreatedAt(Instant.now());
        when(repository.findById("lf-2")).thenReturn(Optional.of(item));

        LostFoundService service = new LostFoundService(repository, mock(LostFoundImageStorageService.class));
        assertThrows(ResponseStatusException.class,
            () -> service.changeStatus("lf-2", new LostFoundStatusRequest("Rejected", "  ")));
        verify(repository, never()).save(any());
    }

    @Test
    void submitSetsPendingStatus() {
        LostFoundRepository repository = mock(LostFoundRepository.class);
        when(repository.save(any(LostFoundItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LostFoundImageStorageService storage = mock(LostFoundImageStorageService.class);
        when(storage.storeOptional(nullable(MultipartFile.class))).thenReturn(Optional.empty());
        LostFoundService service = new LostFoundService(repository, storage);
        LostFoundSubmission submission = new LostFoundSubmission(
            "Scientific Calculator",
            "Found under desk 4 in ECE Analog Lab 2",
            "FOUND",
            "ECE Analog Lab 2",
            "Lab Assistant Murugan",
            "murugan@easwari.ac.in"
        );

        LostFoundItem saved = service.submit(submission);
        assertNotNull(saved.getId());
        assertEquals("Pending", saved.getPublicationStatus());
        assertEquals("Scientific Calculator", saved.getItemName());
        assertEquals("FOUND", saved.getReportType());
        assertNotNull(saved.getCreatedAt());
        assertFalse(saved.hasImage());
        verify(repository, times(1)).save(any(LostFoundItem.class));
    }

    @Test
    void submitStoresValidatedImageMetadata() {
        LostFoundRepository repository = mock(LostFoundRepository.class);
        LostFoundImageStorageService storage = mock(LostFoundImageStorageService.class);
        when(repository.save(any(LostFoundItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(storage.storeOptional(any())).thenReturn(java.util.Optional.of(
            new StoredLostFoundImage("11111111-1111-1111-1111-111111111111.jpg", "watch.jpg", "image/jpeg", 2048)
        ));

        LostFoundService service = new LostFoundService(repository, storage);
        MockMultipartFile image = new MockMultipartFile(
            "image",
            "watch.jpg",
            "application/octet-stream",
            new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00}
        );
        LostFoundItem saved = service.submit(new LostFoundSubmission(
            "Titan Watch",
            "Silver mesh strap watch",
            "FOUND",
            "Mech Block",
            "Suresh K",
            "suresh@easwari.ac.in"
        ), image);

        assertTrue(saved.hasImage());
        assertEquals("watch.jpg", saved.getImageOriginalName());
        assertEquals("image/jpeg", saved.getImageContentType());
        assertEquals("11111111-1111-1111-1111-111111111111.jpg", saved.getImageStoredName());
        verify(storage, times(1)).storeOptional(image);
    }

    @Test
    void publicImageHidesPendingAndMissingFiles() {
        LostFoundRepository repository = mock(LostFoundRepository.class);
        LostFoundImageStorageService storage = mock(LostFoundImageStorageService.class);
        LostFoundItem pending = new LostFoundItem();
        pending.setId("pending-1");
        pending.setPublicationStatus("Pending");
        pending.setImageStoredName("11111111-1111-1111-1111-111111111111.jpg");
        when(repository.findById("pending-1")).thenReturn(Optional.of(pending));

        LostFoundService service = new LostFoundService(repository, storage);
        ResponseStatusException hidden = assertThrows(
            ResponseStatusException.class,
            () -> service.publicImage("pending-1")
        );
        assertEquals(HttpStatus.NOT_FOUND, hidden.getStatusCode());
        verify(storage, never()).load(any());
    }

    @Test
    void publicReportsOnlyReturnsApproved() {
        LostFoundRepository repository = mock(LostFoundRepository.class);
        LostFoundItem approvedItem = new LostFoundItem();
        approvedItem.setId("approved-1");
        approvedItem.setPublicationStatus("Approved");
        when(repository.findByPublicationStatusOrderByCreatedAtDesc("Approved"))
            .thenReturn(List.of(approvedItem));

        LostFoundService service = new LostFoundService(repository, mock(LostFoundImageStorageService.class));
        List<LostFoundItem> publicList = service.publicReports();

        assertEquals(1, publicList.size());
        assertEquals("approved-1", publicList.get(0).getId());
        verify(repository, times(1)).findByPublicationStatusOrderByCreatedAtDesc("Approved");
    }
}
