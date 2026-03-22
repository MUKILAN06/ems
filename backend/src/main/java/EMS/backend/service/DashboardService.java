package EMS.backend.service;

import EMS.backend.dto.DashboardDTO;

public interface DashboardService {
    DashboardDTO getAdminStats();
    DashboardDTO getHRStats();
    DashboardDTO getManagerStats(Long userId);
    DashboardDTO getEmployeeStats();
}
