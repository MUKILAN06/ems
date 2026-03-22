package EMS.backend.controller;

import EMS.backend.service.DashboardService;
import EMS.backend.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }

    @GetMapping("/hr")
    @PreAuthorize("hasAuthority('HR')")
    public ResponseEntity<?> getHRStats() {
        return ResponseEntity.ok(dashboardService.getHRStats());
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<?> getManagerStats(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(dashboardService.getManagerStats(userDetails.getId()));
    }

    @GetMapping("/employee")
    public ResponseEntity<?> getEmployeeStats() {
        return ResponseEntity.ok(dashboardService.getEmployeeStats());
    }
}
