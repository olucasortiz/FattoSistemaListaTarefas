package com.fatto.fattobackend.services;

import com.fatto.fattobackend.entities.Task;
import com.fatto.fattobackend.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }

    public Task findTaskById(int id) {
        return taskRepository.findById(id).orElseThrow();
    }

    public Task saveTask(Task task) {
        if(taskRepository.existsByNome(task     .getNome())) {
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

    public Task moveTaskUp(Integer id) {
        Task task = taskRepository.findById(id).orElseThrow();

        if(task.getOrdem() == 1){
            throw new IllegalArgumentException("Tarefa ja na primeira posição");
        }
        else{
            Task taskAnterior = taskRepository.findByOrdem(task.getOrdem()-1);
            if(taskAnterior != null ){
                int pos = task.getOrdem();
                task.setOrdem(taskAnterior.getOrdem());
                taskAnterior.setOrdem(pos);

                taskRepository.save(taskAnterior);
                return taskRepository.save(task);
            }
            else{
                throw new IllegalArgumentException("Erro ao mover a tarefa para cima");
            }
        }
    }

    public Task moveTaskDown(Integer id) {
        Task task = taskRepository.findById(id).orElseThrow();
        int maxOrdem = taskRepository.findAllByOrderByOrdemAsc().size();
        if(task.getOrdem() == maxOrdem){
            throw new IllegalArgumentException("Já está na ultima posição");
        }
        else{
            Task taskAnterior = taskRepository.findByOrdem(task.getOrdem()+1);
            if(taskAnterior != null ){
                int pos = task.getOrdem();
                task.setOrdem(taskAnterior.getOrdem());
                taskAnterior.setOrdem(pos);

                taskRepository.save(taskAnterior);
                return taskRepository.save(task);
            }
            else{
                throw new IllegalArgumentException("Erro ao mover a tarefa para baixo");
            }
        }
    }

}
