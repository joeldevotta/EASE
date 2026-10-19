package ac.ease.student;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {
    private final StudentAccountRepository accounts;

    public AdminStudentController(StudentAccountRepository accounts) { this.accounts = accounts; }

    @GetMapping("/pending")
    public List<Map<String, Object>> pending() {
        return accounts.findByStatusOrderByCreatedAtAsc(StudentAccount.AccountStatus.PENDING).stream()
            .map(a -> Map.<String, Object>of(
                "id", a.getId(), "registerNumber", a.getRegisterNumber(),
                "status", a.getStatus().name(), "createdAt", a.getCreatedAt().toString()
            )).toList();
    }

    public record ReviewRequest(String status) {}

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> review(@PathVariable Long id, @RequestBody ReviewRequest request) {
        if (request.status() == null ||
                !(request.status().equals("APPROVED") || request.status().equals("REJECTED"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status must be APPROVED or REJECTED."));
        }
        var account = accounts.findById(id).orElse(null);
        if (account == null) return ResponseEntity.notFound().build();
        account.setStatus(StudentAccount.AccountStatus.valueOf(request.status()));
        accounts.save(account);
        return ResponseEntity.ok(Map.of("id", account.getId(), "registerNumber", account.getRegisterNumber(), "status", account.getStatus().name()));
    }
}
