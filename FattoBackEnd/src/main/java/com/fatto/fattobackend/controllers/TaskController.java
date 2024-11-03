package com.fatto.fattobackend.controllers;

import com.fatto.fattobackend.entities.Task;
import com.fatto.fattobackend.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(value = "/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping(value = "/create")
    public ResponseEntity createTask(@RequestBody Task task) {
        taskService.saveTask(task);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/getAll")
    public ResponseEntity getAllTasks() {
        List<Task> tasks =  taskService.findAllTasks();
        return ResponseEntity.ok().body(tasks);
    }
}
