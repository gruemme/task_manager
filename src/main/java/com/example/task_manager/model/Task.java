package com.example.task_manager.model;

import jakarta.persistence.*;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

@Entity
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  private boolean done = false;

  @CreationTimestamp
  @Column(updatable = false)
  private Instant created;

  @Enumerated(EnumType.STRING)
  private Priority priority;

  public Task(String name, Priority priority) {
    this.name = name;
    this.priority = priority;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public boolean isDone() {
    return done;
  }

  public Instant getCreated() {
    return created;
  }

  public Priority getPriority() {
    return priority;
  }

  @Override
  public String toString() {
    return "Task{" + "id=" + id + ", name='" + name + '\'' + '}';
  }
}
