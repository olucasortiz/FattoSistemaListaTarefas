package com.fatto.fattobackend.repositories;

import com.fatto.fattobackend.entities.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findAllByOrderByOrdemAsc();
    Task findByOrdem(Integer id);
    boolean existsByNome(String name);
    List<Task> findAllByOrdem(Integer ordem);

}
