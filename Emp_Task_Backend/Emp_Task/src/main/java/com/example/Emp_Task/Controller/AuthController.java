package com.example.Emp_Task.Controller;

import com.example.Emp_Task.Entity.Employee;
import com.example.Emp_Task.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/signup")
    public String SignUp(@RequestBody Employee emp) {
        return authService.register(emp);
    }


    @PostMapping("/signin")
    public String Signin(@RequestBody Employee emp) {
        return authService.login(emp.getEmail(), emp.getPassword());
    }
}
