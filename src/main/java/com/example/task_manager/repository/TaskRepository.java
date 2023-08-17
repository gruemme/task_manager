package com.example.task_manager.repository;

import com.example.task_manager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface TaskRepository
    extends JpaRepository<Task, Long>, PagingAndSortingRepository<Task, Long> {
  boolean existsByName(String name);
}
