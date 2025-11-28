package com.example.Emp_Task.Controller;

import com.example.Emp_Task.Entity.Task;

import com.example.Emp_Task.Service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    //add task
    @PostMapping("/add/{empId}")
    public Task addTask(@PathVariable Integer empId, @RequestBody Task task) {
        return taskService.addTask(empId, task);
    }

    //get all tasks
    @GetMapping("/employee/{empId}")
    public List<Task> getTasks(@PathVariable Integer empId) {
        return taskService.getTasksByEmployee(empId);
    }

    // update a task
    @PutMapping("/update/{taskId}")
    public Task updateTask(@PathVariable Integer taskId, @RequestBody Task task) {
        return taskService.updateTask(taskId, task);
    }


    //delete a task
    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Integer taskId) {
        taskService.deleteTask(taskId);
    }


    // pending tasks
    @GetMapping("/pending/{empId}")
    public List<Task> pendingTasks(@PathVariable Integer empId) {
        return taskService.getPendingTasks(empId);
    }

    // completed tasks
    @GetMapping("/completed/{empId}")
    public List<Task> completedTasks(@PathVariable Integer empId) {
        return taskService.getCompletedTasks(empId);
    }

    // tasks by start date
    @GetMapping("/startdate/{date}/{empId}")
    public List<Task> tasksByStartDate(@PathVariable String date,
                                       @PathVariable Integer empId) {

        return taskService.getTasksByStartDate(empId, date);
    }

}
