package com.example.task_manager.controller;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.Matchers.isA;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/** Integration test, only works with a running and configured database. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TaskControllerTest {
  private static final String SIMPLE_ENTRY_REQUEST_BODY =
      """
            {
              "name": "My first todo%s",
              "priority": "LOW"
            }
            """;

  private static final String SET_TO_DONE_REQUEST_BODY =
      """
                  {
                    "done": true
                  }
                  """;

  private static final String NEW_NAME_REQUEST_BODY =
      """
                  {
                    "name": "My renamed todo"
                  }
                  """;

  @Autowired private MockMvc mockMvc;

  @Test
  public void postSimpleTaskAndExpectCorrectContent() throws Exception {
    String uuid = UUID.randomUUID().toString();
    this.mockMvc
        .perform(
            post("/tasks")
                .content(SIMPLE_ENTRY_REQUEST_BODY.formatted(uuid))
                .contentType(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id", isA(Integer.class)))
        .andExpect(jsonPath("$.name", is("My first todo%s".formatted(uuid))))
        .andExpect(jsonPath("$.done", is(false)))
        .andExpect(jsonPath("$.priority", is("LOW")))
        .andExpect(jsonPath("$.created", notNullValue()));
  }

  @Test
  public void postSimpleTaskSetItToDoneAndExpectDoneIsTrue() throws Exception {
    MvcResult mvcResult =
        this.mockMvc
            .perform(
                post("/tasks")
                    .content(SIMPLE_ENTRY_REQUEST_BODY.formatted(UUID.randomUUID().toString()))
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.done", is(false)))
            .andReturn();

    String response = mvcResult.getResponse().getContentAsString();
    Integer id = JsonPath.parse(response).read("$.id");

    this.mockMvc
        .perform(
            patch("/tasks/" + id.toString())
                .content(SET_TO_DONE_REQUEST_BODY)
                .contentType(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.done", is(true)));
  }

  @Test
  public void postSimpleTaskTwoTimesAndExpectConflictError() throws Exception {
    this.mockMvc
        .perform(
            post("/tasks")
                .content(SIMPLE_ENTRY_REQUEST_BODY.formatted(""))
                .contentType(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.done", is(false)));
    this.mockMvc
        .perform(
            post("/tasks")
                .content(SIMPLE_ENTRY_REQUEST_BODY.formatted(""))
                .contentType(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isConflict());
  }

  @Test
  public void postSimpleTaskAndRenameTaskAndExpectNewName() throws Exception {
    String uuid = UUID.randomUUID().toString();
    MvcResult mvcResult =
        this.mockMvc
            .perform(
                post("/tasks")
                    .content(SIMPLE_ENTRY_REQUEST_BODY.formatted(uuid))
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name", is("My first todo%s".formatted(uuid))))
            .andReturn();

    String response = mvcResult.getResponse().getContentAsString();
    Integer id = JsonPath.parse(response).read("$.id");

    this.mockMvc
        .perform(
            patch("/tasks/" + id.toString())
                .content(NEW_NAME_REQUEST_BODY)
                .contentType(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name", is("My renamed todo")));
  }

  @Test
  public void postSimpleTaskAndDeleteItAndExpectItIsGone() throws Exception {
    MvcResult mvcResult =
        this.mockMvc
            .perform(
                post("/tasks")
                    .content(SIMPLE_ENTRY_REQUEST_BODY.formatted(UUID.randomUUID().toString()))
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id", isA(Integer.class)))
            .andReturn();

    String response = mvcResult.getResponse().getContentAsString();
    Integer id = JsonPath.parse(response).read("$.id");

    this.mockMvc
        .perform(
            delete("/tasks/" + id.toString())
                .content(NEW_NAME_REQUEST_BODY)
                .contentType(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isNoContent());
    this.mockMvc
        .perform(get("/tasks/" + id.toString()))
        .andDo(print())
        .andExpect(status().isNotFound());
  }
}
