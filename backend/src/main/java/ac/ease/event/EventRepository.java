package ac.ease.event;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventItem, String> {
    List<EventItem> findByPublicationStatusOrderByStartDateAsc(String publicationStatus);
    List<EventItem> findAllByOrderByCreatedAtDesc();
}
