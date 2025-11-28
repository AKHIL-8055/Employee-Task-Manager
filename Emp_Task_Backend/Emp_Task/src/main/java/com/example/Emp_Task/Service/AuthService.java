package com.example.Emp_Task.Service;

import com.example.Emp_Task.Entity.Employee;
import com.example.Emp_Task.Repository.EmployeeRepository;
import com.example.Emp_Task.Security.JWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private JWT jwtUtil;


    public String register(Employee emp) {
        Employee check = employeeRepo.findByEmail(emp.getEmail());
        if (check != null) {
            return "User already exists!";
        }

        employeeRepo.save(emp);
        return "Employee registered successfully!";
    }


    public String login(String email, String password) {
        Employee emp = employeeRepo.findByEmail(email);


        if (emp == null) {
            return "User not found!";
        }

        if (!emp.getPassword().equals(password)) {
            return "Wrong password!";
        }

        // Create JWT token
        return jwtUtil.generateToken(
                emp.getId(),
                emp.getName(),
                emp.getEmail()

        );
    }
}
