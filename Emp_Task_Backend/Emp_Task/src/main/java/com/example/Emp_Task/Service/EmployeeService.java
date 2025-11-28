package com.example.Emp_Task.Service;

import com.example.Emp_Task.Entity.Employee;
import com.example.Emp_Task.Repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }


    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee Not Found"));
    }

    public Employee updateEmployee(Integer id, Employee updated) {
        Employee emp = getEmployeeById(id);

        emp.setName(updated.getName());
        emp.setEmail(updated.getEmail());


        return employeeRepository.save(emp);
    }

    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }
}
