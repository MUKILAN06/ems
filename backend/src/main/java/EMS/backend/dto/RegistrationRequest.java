package EMS.backend.dto;

import EMS.backend.entity.Role;
import lombok.Data;

@Data
public class RegistrationRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}
