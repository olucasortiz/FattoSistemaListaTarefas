package com.fatto.fattobackend.services;

import com.fatto.fattobackend.entities.Task;
import com.fatto.fattobackend.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }

    public Task findTaskById(int id) {
        return taskRepository.findById(id).get();
    }

    public Task saveTask(Task task) {
        if(taskRepository.existsByNome(task.getNome())) {
            throw new IllegalArgumentException("Nome da tarefa ja existe");
        }
        //taskRepository.setOrdem()
        return taskRepository.save(task);
    }

    public void deleteTaskById(Integer id) {
        if(taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
        }
    }

    public Task updateTask(Integer id, Task updatedTask) {
        Task op = taskRepository.findById(id).orElseThrow();
        if(!updatedTask.getNome().equals(op.getNome()) && taskRepository.existsByNome(updatedTask.getNome())) {
            throw new IllegalArgumentException("Nome da tarefa já existe");
        }
        op.setNome(updatedTask.getNome());
        op.setCusto(updatedTask.getCusto());
        op.setDataLimite(updatedTask.getDataLimite());
        return taskRepository.save(op);
    }
}
