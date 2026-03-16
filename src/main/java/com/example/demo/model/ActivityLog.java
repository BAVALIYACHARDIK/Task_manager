package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action; // "TASK_CREATED", "TASK_UPDATED", "TASK_STATUS_CHANGED", "TASK_DELETED"

    @Column(nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "additional_info", columnDefinition = "LONGTEXT")
    private String additionalInfo; // JSON data for extra context

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
