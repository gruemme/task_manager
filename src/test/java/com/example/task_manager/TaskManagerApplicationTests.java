package com.example.task_manager;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.task_manager.controller.TaskController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class TaskManagerApplicationTests {
  @Autowired private TaskController taskController;

  @Test
  void contextLoads() {
    assertThat(taskController).isNotNull();
  }
}
