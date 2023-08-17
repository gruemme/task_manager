package com.example.task_manager.model.input;

import com.example.task_manager.model.Priority;

public record TaskCreationInput(String name, Priority priority) {}
