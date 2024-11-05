package com.fatto.fattobackend.services;

import com.fatto.fattobackend.entities.Task;
import com.fatto.fattobackend.repositories.TaskRepository;
import jakarta.transaction.Transactional;
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
        int totalTarefas = taskRepository.findAll().size();
        if(taskRepository.existsByNome(task.getNome())) {
            throw new IllegalArgumentException("Nome da tarefa ja existe");
        }
        task.setOrdem(totalTarefas+1);
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

    public void reorderTasks(List<Task> reorderedTasks) {
        for (Task task : reorderedTasks) {
            Task existingTask = taskRepository.findById(task.getId()).orElseThrow();
            existingTask.setOrdem(task.getOrdem());
            taskRepository.save(existingTask);
        }
    }

    @Transactional
    public Task moveTaskUp(Integer id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (task.getOrdem() == 1) {
            throw new IllegalArgumentException("Tarefa já está na primeira posição");
        }

        int posicaoAtual = task.getOrdem();
        List<Task> tasksAtSamePosition = taskRepository.findAllByOrdem(posicaoAtual - 1);

        if (tasksAtSamePosition.size() > 1) {
            throw new IllegalStateException("Conflito de posições: mais de uma tarefa com a mesma ordem");
        }

        Task taskAnterior = tasksAtSamePosition.isEmpty() ? null : tasksAtSamePosition.get(0);

        if (taskAnterior != null) {
            task.setOrdem(posicaoAtual - 1);
            taskAnterior.setOrdem(posicaoAtual);
            taskRepository.save(taskAnterior);
            return taskRepository.save(task);
        } else {
            throw new IllegalArgumentException("Erro ao mover a tarefa para cima");
        }
    }


    @Transactional
    public Task moveTaskDown(Integer id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        int maxOrdem = (int) taskRepository.count();

        if (task.getOrdem() == maxOrdem) {
            throw new IllegalArgumentException("Tarefa já está na última posição");
        }

        int posicaoAtual = task.getOrdem();
        List<Task> tasksAtSamePosition = taskRepository.findAllByOrdem(posicaoAtual + 1);

        if (tasksAtSamePosition.size() > 1) {
            throw new IllegalStateException("Conflito de posições: mais de uma tarefa com a mesma ordem");
        }

        Task taskPosterior = tasksAtSamePosition.isEmpty() ? null : tasksAtSamePosition.get(0);

        if (taskPosterior != null) {
            task.setOrdem(posicaoAtual + 1);
            taskPosterior.setOrdem(posicaoAtual);
            taskRepository.save(taskPosterior);
            return taskRepository.save(task);
        } else {
            throw new IllegalArgumentException("Erro ao mover a tarefa para baixo");
        }
    }

}
