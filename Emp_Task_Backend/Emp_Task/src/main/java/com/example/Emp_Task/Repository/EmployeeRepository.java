package com.example.Emp_Task.Repository;


import com.example.Emp_Task.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Employee findByEmail(String email);
}
