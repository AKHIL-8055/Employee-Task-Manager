package com.example.Emp_Task.Service;

import com.example.Emp_Task.Entity.Employee;
import com.example.Emp_Task.Entity.Task;
import com.example.Emp_Task.Repository.EmployeeRepository;
import com.example.Emp_Task.Repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public TaskService(TaskRepository taskRepository, EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    // CREATE Task for employee
    public Task addTask(Integer empId, Task task) {
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee Not Found"));

        task.setEmployee(employee);
        task.setStatus("PENDING");

        return taskRepository.save(task);
    }

    // GET tasks for one employee
    public List<Task> getTasksByEmployee(Integer empId) {
        return taskRepository.findByEmployeeId(empId);
    }

    // GET all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // DELETE task
    public void deleteTask(Integer taskId) {
        taskRepository.deleteById(taskId);
    }

    // get pending tasks
    public List<Task> getPendingTasks(Integer empId) {
        return taskRepository.findByEmployeeIdAndStatus(empId, "PENDING");
    }



    // get completed tasks
    public List<Task> getCompletedTasks(Integer empId) {
        return taskRepository.findByEmployeeIdAndStatus(empId, "COMPLETED");
    }

    // get tasks by start date (yyyy-MM-dd)
    public List<Task> getTasksByStartDate(Integer empId, String date) {

        LocalDate localDate = LocalDate.parse(date); // convert String → LocalDate

        return taskRepository.findByEmployeeIdAndStartDateTimeBetween(
                empId,
                localDate.atStartOfDay(),
                localDate.atTime(23, 59, 59)
        );
    }



    public Task updateTask(Integer taskId, Task updatedTask) {

        Task oldTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task Not Found"));

        oldTask.setDescription(updatedTask.getDescription());
        oldTask.setStatus(updatedTask.getStatus());
        oldTask.setStartDateTime(updatedTask.getStartDateTime());
        oldTask.setEndDateTime(updatedTask.getEndDateTime());

        return taskRepository.save(oldTask);
    }


}
