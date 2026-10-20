package ac.ease.student;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class StudentJwtFilter extends OncePerRequestFilter {
    private final StudentTokenService tokens;
    private final StudentAccountRepository accounts;

    public StudentJwtFilter(StudentTokenService tokens, StudentAccountRepository accounts) {
        this.tokens = tokens;
        this.accounts = accounts;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();
            try {
                String registerNumber = tokens.validateAndGetRegisterNumber(token);
                boolean approved = accounts.findByRegisterNumber(registerNumber)
                    .map(account -> account.getStatus() == StudentAccount.AccountStatus.APPROVED)
                    .orElse(false);
                if (approved) {
                    var auth = new UsernamePasswordAuthenticationToken(
                        registerNumber, null, List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    SecurityContextHolder.clearContext();
                }
            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}
