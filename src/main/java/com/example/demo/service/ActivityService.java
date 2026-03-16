package com.example.demo.service;

import com.example.demo.model.ActivityLog;
import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Log task creation activity
     */
    public ActivityLog logTaskCreated(Long taskId, Long userId, String taskTitle) {
        ActivityLog log = new ActivityLog();
        log.setAction("TASK_CREATED");
        log.setDescription("Created task: " + taskTitle);
        log.setTimestamp(LocalDateTime.now());
        log.setAdditionalInfo("{\"taskId\": " + taskId + ", \"taskTitle\": \"" + taskTitle + "\"}");
        
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            log.setTask(task.get());
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            log.setUser(user.get());
        }

        return activityRepository.save(log);
    }

    /**
     * Log task status change activity
     */
    public ActivityLog logTaskStatusChanged(Long taskId, Long userId, String oldStatus, String newStatus) {
        ActivityLog log = new ActivityLog();
        log.setAction("TASK_STATUS_CHANGED");
        log.setDescription("Changed task status from " + oldStatus + " to " + newStatus);
        log.setTimestamp(LocalDateTime.now());
        log.setAdditionalInfo("{\"oldStatus\": \"" + oldStatus + "\", \"newStatus\": \"" + newStatus + "\"}");
        
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            log.setTask(task.get());
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            log.setUser(user.get());
        }

        return activityRepository.save(log);
    }

    /**
     * Log task update activity
     */
    public ActivityLog logTaskUpdated(Long taskId, Long userId, String fieldChanged, String oldValue, String newValue) {
        ActivityLog log = new ActivityLog();
        log.setAction("TASK_UPDATED");
        log.setDescription("Updated task " + fieldChanged + " from " + oldValue + " to " + newValue);
        log.setTimestamp(LocalDateTime.now());
        log.setAdditionalInfo("{\"field\": \"" + fieldChanged + "\", \"oldValue\": \"" + oldValue + "\", \"newValue\": \"" + newValue + "\"}");
        
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            log.setTask(task.get());
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            log.setUser(user.get());
        }

        return activityRepository.save(log);
    }

    /**
     * Log task deletion activity
     */
    public ActivityLog logTaskDeleted(Long taskId, Long userId, String taskTitle) {
        ActivityLog log = new ActivityLog();
        log.setAction("TASK_DELETED");
        log.setDescription("Deleted task: " + taskTitle);
        log.setTimestamp(LocalDateTime.now());
        log.setAdditionalInfo("{\"taskId\": " + taskId + ", \"taskTitle\": \"" + taskTitle + "\"}");

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            log.setUser(user.get());
        }

        return activityRepository.save(log);
    }

    /**
     * Get all activity logs
     */
    public List<ActivityLog> getAllActivities() {
        return activityRepository.findAllByOrderByTimestampDesc();
    }

    /**
     * Get activity logs for a specific task
     */
    public List<ActivityLog> getTaskActivities(Long taskId) {
        return activityRepository.findByTaskIdOrderByTimestampDesc(taskId);
    }

    /**
     * Get activity logs for a specific user
     */
    public List<ActivityLog> getUserActivities(Long userId) {
        return activityRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    /**
     * Get activity logs for a specific action type
     */
    public List<ActivityLog> getActivitiesByAction(String action) {
        return activityRepository.findByActionOrderByTimestampDesc(action);
    }

    /**
     * Get recent activities (limit to last N records)
     */
    public List<ActivityLog> getRecentActivities(int limit) {
        List<ActivityLog> allActivities = getAllActivities();
        return allActivities.size() > limit ? allActivities.subList(0, limit) : allActivities;
    }
}
