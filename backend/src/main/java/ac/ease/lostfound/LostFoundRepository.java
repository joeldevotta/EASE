package ac.ease.lostfound;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LostFoundRepository
        extends JpaRepository<LostFoundItem, String> {

    List<LostFoundItem>
        findByPublicationStatusOrderByCreatedAtDesc(
            String publicationStatus
        );

    List<LostFoundItem> findAllByOrderByCreatedAtDesc();
}
