package ac.ease.student;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StudentTokenService {
    private final SecretKey key;

    public StudentTokenService(@Value("${ease.student.token-secret}") String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("EASE_STUDENT_TOKEN_SECRET must contain at least 32 characters.");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String create(String registerNumber) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(registerNumber)
            .claim("role", "STUDENT")
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(60L * 60L * 8L)))
            .signWith(key)
            .compact();
    }

    public String validateAndGetRegisterNumber(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).getPayload();
        if (!"STUDENT".equals(claims.get("role", String.class))) {
            throw new IllegalArgumentException("Invalid student token role.");
        }
        return claims.getSubject();
    }
}
