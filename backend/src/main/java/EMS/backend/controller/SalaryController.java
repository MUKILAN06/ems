package EMS.backend.controller;

import EMS.backend.dto.MessageResponse;
import EMS.backend.dto.SalaryRequest;
import EMS.backend.entity.Employee;
import EMS.backend.entity.Salary;
import EMS.backend.entity.User;
import EMS.backend.repository.EmployeeRepository;
import EMS.backend.repository.SalaryRepository;
import EMS.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/salaries")
public class SalaryController {
    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/put")
    @PreAuthorize("hasAuthority('HR')")
    public ResponseEntity<?> putSalary(@RequestBody SalaryRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Error: Employee not found."));

        Optional<Salary> existingSalary = salaryRepository.findByEmployee(employee);
        Salary salary;
        if (existingSalary.isPresent()) {
            salary = existingSalary.get();
            salary.setAmount(request.getAmount());
            salary.setNotes(request.getNotes());
        } else {
            salary = Salary.builder()
                    .employee(employee)
                    .amount(request.getAmount())
                    .notes(request.getNotes())
                    .build();
        }

        salaryRepository.save(salary);
        return ResponseEntity.ok(new MessageResponse("Salary updated successfully!"));
    }

    @GetMapping("/my-salary")
    @PreAuthorize("hasAuthority('EMPLOYEE')")
    public ResponseEntity<?> getMySalary(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Error: User record not found."));
        
        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Error: Employee record not found."));
        
        return ResponseEntity.ok(salaryRepository.findByEmployee(employee)
                .orElseThrow(() -> new RuntimeException("Error: Salary not found for employee.")));
    }

    @GetMapping("/employee/{id}")
    @PreAuthorize("hasAuthority('HR')")
    public ResponseEntity<?> getEmployeeSalary(@PathVariable Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Employee not found."));
        return ResponseEntity.ok(salaryRepository.findByEmployee(employee).orElse(null));
    }
}
