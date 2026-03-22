package EMS.backend.service.impl;

import EMS.backend.dto.DashboardDTO;
import EMS.backend.entity.LeaveStatus;
import EMS.backend.repository.*;
import EMS.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public DashboardDTO getAdminStats() {
        return buildStats();
    }

    @Override
    public DashboardDTO getHRStats() {
        return buildStats();
    }

    @Override
    public DashboardDTO getManagerStats(Long userId) {
        return buildStats();
    }

    @Override
    public DashboardDTO getEmployeeStats() {
        return buildStats();
    }

    private DashboardDTO buildStats() {
        long totalEmployees = employeeRepository.count();
        long totalDepartments = departmentRepository.count();
        long totalUsers = userRepository.count();
        long pendingLeaves = leaveRepository.findByStatus(LeaveStatus.PENDING_HR).size() +
                             leaveRepository.findByStatus(LeaveStatus.PENDING_MANAGER).size();
        long activeTasks = taskRepository.findAll().stream().filter(t -> !t.isCompleted()).count();
        long resolvedIssues = issueRepository.findAll().stream().filter(i -> i.isResolved()).count();

        Map<String, Long> roles = userRepository.findAll().stream()
                .collect(Collectors.groupingBy(u -> u.getRole().name(), Collectors.counting()));

        return DashboardDTO.builder()
                .totalEmployees(totalEmployees)
                .totalDepartments(totalDepartments)
                .totalUsers(totalUsers)
                .pendingLeaves(pendingLeaves)
                .activeTasks(activeTasks)
                .resolvedIssues(resolvedIssues)
                .roleDistribution(roles)
                .build();
    }
}
