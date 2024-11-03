package com.fatto.fattobackend.controllers;

import com.fatto.fattobackend.entities.Task;
import com.fatto.fattobackend.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(value = "/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.saveTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks =  taskService.findAllTasks();
        return ResponseEntity.ok().body(tasks);
    }

    @DeleteMapping(value = "{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        try{
            taskService.deleteTaskById(id);
            return ResponseEntity.noContent().build();
        }catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Integer id, @RequestBody Task task) {
        try {
            Task updatedTask = taskService.updateTask(id, task);
            return ResponseEntity.ok(updatedTask);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Retorna 400 se o nome já existir
        }
    }

    @PatchMapping(value = "{id}/mover-cima")
    public ResponseEntity<Task> moveTaskUp(@PathVariable Integer id) {
        try{
            Task updatedTask = taskService.moveTaskUp(id);
            return ResponseEntity.ok(updatedTask);
        }catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PatchMapping(value = "{id}/mover-baixo")
    public ResponseEntity<Task> moveTaskDown(@PathVariable Integer id) {
        try{
            Task updatedTask = taskService.moveTaskDown(id);
            return ResponseEntity.ok(updatedTask);
        }
        catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}