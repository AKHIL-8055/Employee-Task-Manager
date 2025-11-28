package com.example.Emp_Task.Repository;

import com.example.Emp_Task.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findByEmployeeId(Integer employeeId);

    List<Task> findByStatus(String status);

    List<Task> findByEmployeeIdAndStatus(Integer empId, String status);

    List<Task> findByEmployeeIdAndStartDateTimeBetween(
            Integer empId,
            LocalDateTime start,
            LocalDateTime end
    );


}
