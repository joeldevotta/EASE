package ac.ease.event;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class EventServiceTest {
    @Test
    void onlyPendingEventsCanBeReviewed() {
        EventRepository repository = mock(EventRepository.class);
        EventItem event = new EventItem();
        event.setId("abc"); event.setPublicationStatus("Approved");
        when(repository.findById("abc")).thenReturn(Optional.of(event));
        EventService service = new EventService(repository);
        assertThrows(ResponseStatusException.class,
            () -> service.changeStatus("abc", new EventStatusRequest("Rejected", "duplicate")));
        verify(repository, never()).save(any());
    }

    @Test
    void rejectionRequiresReason() {
        EventRepository repository = mock(EventRepository.class);
        EventItem event = new EventItem();
        event.setId("abc"); event.setPublicationStatus("Pending");
        event.setCreatedAt(Instant.now());
        when(repository.findById("abc")).thenReturn(Optional.of(event));
        EventService service = new EventService(repository);
        assertThrows(ResponseStatusException.class,
            () -> service.changeStatus("abc", new EventStatusRequest("Rejected", " ")));
        verify(repository, never()).save(any());
    }
}
