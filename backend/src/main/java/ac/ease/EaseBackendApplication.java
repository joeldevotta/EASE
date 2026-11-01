package ac.ease;

import ac.ease.lostfound.LostFoundImageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(LostFoundImageProperties.class)
public class EaseBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(EaseBackendApplication.class, args);
    }
}
