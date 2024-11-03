package com.fatto.fattobackend.repositories;

import com.fatto.fattobackend.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findAllOrderByOrdemASC();
    boolean existsByNome(String name);
}