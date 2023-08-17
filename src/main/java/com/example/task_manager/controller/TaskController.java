package com.example.task_manager.controller;

import com.example.task_manager.model.Task;
import com.example.task_manager.model.input.ModifyInput;
import com.example.task_manager.model.input.Nameable;
import com.example.task_manager.model.input.TaskCreationInput;
import com.example.task_manager.repository.TaskRepository;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Task with %d not found".formatted(id));
    }

    return taskOptional.get();
  }

  @GetMapping(path = "/tasks")
  public Page<Task> getAllTasksPaged(
      @ParameterObject
          @PageableDefault(
              sort = {"created", "id"},
              direction = Sort.Direction.ASC,
              value = 10)
          Pageable pageable) {
    return taskRepository.findAll(pageable);
  }

  @PostMapping(path = "/tasks")
  @ResponseStatus(HttpStatus.CREATED)
  public Task createTask(@RequestBody TaskCreationInput taskInput) {
    verifyInputName(taskInput);
    Task newTask = new Task(taskInput.name(), taskInput.priority());

    return taskRepository.save(newTask);
  }

  @PatchMapping(path = "/tasks/{id}")
  @ResponseStatus(HttpStatus.CREATED)
  public Task modifyTask(@PathVariable Long id, @RequestBody ModifyInput taskInput) {
    Task taskToModify = getTaskById(id);
    if (taskInput.done() != null) {
      taskToModify.setDone(taskInput.done());
    }
    if (!Objects.isNull(taskInput.name())) {
      verifyInputName(taskInput);
      taskToModify.setName(taskInput.name());
    }

    return taskRepository.save(taskToModify);
  }

  @DeleteMapping(path = "/tasks/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteTaskById(@PathVariable Long id) {
    if (!taskRepository.existsById(id)) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Task with %d not found".formatted(id));
    }
    taskRepository.deleteById(id);
  }

  private void verifyInputName(Nameable nameableTask) {
    if (Objects.isNull(nameableTask.name()) || nameableTask.name().isBlank()) {
      throw new ResponseStatusException(
          HttpStatus.UNPROCESSABLE_ENTITY, "Please give a valid name");
    }
    if (taskRepository.existsByName(nameableTask.name())) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Task \"%s\" already exists".formatted(nameableTask.name()));
    }
  }
}
