package EMS.backend.controller;

import EMS.backend.dto.IssueDTO;
import EMS.backend.entity.Issue;
import EMS.backend.service.IssueService;
import EMS.backend.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping("/create")
    public ResponseEntity<Issue> create(@RequestBody IssueDTO dto, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(issueService.createIssue(dto, userDetails.getId()));
    }

    @GetMapping("/my-reported")
    public ResponseEntity<List<Issue>> getMyReported(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(issueService.getIssuesReportedBy(userDetails.getId()));
    }

    @GetMapping("/assigned-to-me")
    public ResponseEntity<List<Issue>> getAssignedToMe(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(issueService.getIssuesAssignedTo(userDetails.getId()));
    }

    @PostMapping("/resolve/{id}")
    public ResponseEntity<Issue> resolve(@PathVariable Long id, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(issueService.resolveIssue(id, userDetails.getId()));
    }
}
