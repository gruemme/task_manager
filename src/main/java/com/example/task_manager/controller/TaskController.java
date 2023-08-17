package com.example.task_manager.controller;

import com.example.task_manager.model.Task;
import com.example.task_manager.model.input.TaskCreationInput;
import com.example.task_manager.repository.TaskRepository;
import java.util.Objects;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class TaskController {
  private final TaskRepository taskRepository;

  public TaskController(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  @GetMapping(path = "/tasks/{id}")
  public Task getTaskById(@PathVariable Long id) {
    Optional<Task> taskOptional = taskRepository.findById(id);
    if (taskOptional.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    return taskOptional.get();
  }

  @PostMapping(path = "/tasks")
  @ResponseStatus(HttpStatus.CREATED)
  public Task createTask(@RequestBody TaskCreationInput taskInput) {
    if (Objects.isNull(taskInput.name())) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY);
    }
    Task newTask = new Task(taskInput.name(), taskInput.priority());

    return taskRepository.save(newTask);
  }

  @DeleteMapping(path = "/tasks/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteTaskById(@PathVariable Long id) {
    if (!taskRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    taskRepository.deleteById(id);
  }
}
