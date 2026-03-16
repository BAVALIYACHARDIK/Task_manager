package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.service.TaskService;
import com.example.demo.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ActivityService activityService;

    // Get all tasks
    @GetMapping
    public ResponseEntity<?> getAllTasks() {
        try {
            List<Task> tasks = taskService.getAllTasks();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", tasks);
            response.put("message", "Tasks retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching tasks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        try {
            Optional<Task> task = taskService.getTaskById(id);
            Map<String, Object> response = new HashMap<>();
            if (task.isPresent()) {
                response.put("success", true);
                response.put("code", 200);
                response.put("data", task.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("code", 404);
                response.put("message", "Task not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching task: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Create new task
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            Task createdTask = taskService.createTask(task);
            
            // Log activity - using user ID 1 as default (in production, get from JWT token)
            activityService.logTaskCreated(createdTask.getId(), 1L, createdTask.getTitle());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 201);
            response.put("data", createdTask);
            response.put("message", "Task created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error creating task: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            Map<String, Object> response = new HashMap<>();
            if (updatedTask != null) {
                response.put("success", true);
                response.put("code", 200);
                response.put("data", updatedTask);
                response.put("message", "Task updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("code", 404);
                response.put("message", "Task not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error updating task: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update task status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        try {
            String status = statusMap.get("status");
            if (status == null || status.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("code", 400);
                response.put("message", "Status field is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Get old status for activity logging
            Optional<Task> existingTask = taskService.getTaskById(id);
            String oldStatus = existingTask.isPresent() ? existingTask.get().getStatus() : "UNKNOWN";

            Task updatedTask = taskService.updateTaskStatus(id, status);
            Map<String, Object> response = new HashMap<>();
            if (updatedTask != null) {
                // Log activity - using user ID 1 as default (in production, get from JWT token)
                activityService.logTaskStatusChanged(id, 1L, oldStatus, status);
                
                response.put("success", true);
                response.put("code", 200);
                response.put("data", updatedTask);
                response.put("message", "Task status updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("code", 404);
                response.put("message", "Task not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error updating task status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            boolean deleted = taskService.deleteTask(id);
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("code", 200);
                response.put("message", "Task deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("code", 404);
                response.put("message", "Task not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error deleting task: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get tasks by status
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getTasksByStatus(@PathVariable String status) {
        try {
            List<Task> tasks = taskService.getTasksByStatus(status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", tasks);
            response.put("message", "Tasks with status '" + status + "' retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching tasks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get tasks by priority
    @GetMapping("/priority/{priority}")
    public ResponseEntity<?> getTasksByPriority(@PathVariable String priority) {
        try {
            List<Task> tasks = taskService.getTasksByPriority(priority);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", tasks);
            response.put("message", "Tasks with priority '" + priority + "' retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching tasks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get tasks assigned to user
    @GetMapping("/assigned/{userId}")
    public ResponseEntity<?> getTasksByAssignedUser(@PathVariable Long userId) {
        try {
            List<Task> tasks = taskService.getTasksByAssignedUser(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", tasks);
            response.put("message", "Tasks assigned to user retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching tasks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
