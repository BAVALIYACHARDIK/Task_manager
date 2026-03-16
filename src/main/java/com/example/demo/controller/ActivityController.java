package com.example.demo.controller;

import com.example.demo.model.ActivityLog;
import com.example.demo.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    /**
     * Get all activity logs
     */
    @GetMapping
    public ResponseEntity<?> getAllActivities() {
        try {
            List<ActivityLog> activities = activityService.getAllActivities();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", activities);
            response.put("message", "Activities retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching activities: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get recent activities with limit
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentActivities(@RequestParam(defaultValue = "20") int limit) {
        try {
            List<ActivityLog> activities = activityService.getRecentActivities(limit);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", activities);
            response.put("message", "Recent activities retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching recent activities: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get activity logs for a specific task
     */
    @GetMapping("/task/{taskId}")
    public ResponseEntity<?> getTaskActivities(@PathVariable Long taskId) {
        try {
            List<ActivityLog> activities = activityService.getTaskActivities(taskId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", activities);
            response.put("message", "Task activities retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching task activities: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get activity logs for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserActivities(@PathVariable Long userId) {
        try {
            List<ActivityLog> activities = activityService.getUserActivities(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", activities);
            response.put("message", "User activities retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching user activities: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get activities by action type
     */
    @GetMapping("/action/{action}")
    public ResponseEntity<?> getActivitiesByAction(@PathVariable String action) {
        try {
            List<ActivityLog> activities = activityService.getActivitiesByAction(action);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("data", activities);
            response.put("message", "Activities retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "Error fetching activities: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
