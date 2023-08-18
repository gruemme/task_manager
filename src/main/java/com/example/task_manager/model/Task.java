package com.example.task_manager.model;

import jakarta.persistence.*;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

@Entity
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  private boolean done = false;

  @CreationTimestamp
  @Column(updatable = false)
  private Instant created;

  @Enumerated(EnumType.STRING)
  private Priority priority;

  public Task() {}

  public Task(String name, Priority priority) {
    this.name = name;
    this.priority = priority;
  }

  public Long getId() {
    return id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public boolean isDone() {
    return done;
  }

  public void setDone(boolean done) {
    this.done = done;
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
