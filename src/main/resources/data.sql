-- Insert sample users
INSERT INTO users (email, password, first_name, last_name, role, active) VALUES
('john.doe@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'John', 'Doe', 'ADMIN', true),
('jane.smith@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'Jane', 'Smith', 'USER', true),
('mike.johnson@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'Mike', 'Johnson', 'USER', true),
('sarah.wilson@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'Sarah', 'Wilson', 'USER', true),
('david.brown@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'David', 'Brown', 'USER', true),
('emily.davis@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'Emily', 'Davis', 'USER', true),
('robert.miller@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'Robert', 'Miller', 'USER', true),
('lisa.anderson@example.com', '$2a$10$wA8/X.U0z/X5.mQ9D2L/Je7h0EZ0gJ1YB0K0K5Z0KL1M0N0O0K0O0', 'Lisa', 'Anderson', 'USER', true);

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at, created_by, user_id) VALUES
('Design Database Schema', 'Create the database schema for the task management system', 'COMPLETED', 'HIGH', '2026-03-20', NOW(), NOW(), 1, NULL),
('Implement Authentication', 'Add JWT based authentication to the system', 'IN_PROGRESS', 'HIGH', '2026-03-18', NOW(), NOW(), 1, NULL),
('Create REST API Endpoints', 'Develop REST API endpoints for task CRUD operations', 'IN_PROGRESS', 'HIGH', '2026-03-19', NOW(), NOW(), 1, NULL),
('Build Frontend Components', 'Create React components for the task management UI', 'IN_PROGRESS', 'MEDIUM', '2026-03-22', NOW(), NOW(), 1, NULL),
('Setup Kanban Board', 'Implement drag and drop Kanban board with dnd-kit', 'IN_PROGRESS', 'MEDIUM', '2026-03-21', NOW(), NOW(), 1, NULL),
('Write Unit Tests', 'Write comprehensive unit tests for backend services', 'TODO', 'MEDIUM', '2026-03-25', NOW(), NOW(), 1, NULL),
('Documentation', 'Create API documentation and setup guide', 'TODO', 'LOW', '2026-03-28', NOW(), NOW(), 1, NULL),
('Deploy to Production', 'Deploy the application to production server', 'TODO', 'URGENT', '2026-03-30', NOW(), NOW(), 1, NULL),
('Fix Login Issues', 'Resolve CORS and authentication issues in login flow', 'COMPLETED', 'HIGH', '2026-03-15', NOW(), NOW(), 1, NULL),
('Optimize Database Queries', 'Add indexes and optimize slow database queries', 'TODO', 'MEDIUM', '2026-03-27', NOW(), NOW(), 1, NULL),
('Add Email Notifications', 'Implement email notification system for task updates', 'TODO', 'LOW', '2026-03-26', NOW(), NOW(), 1, NULL),
('Create Admin Dashboard', 'Build admin panel for user and task management', 'TODO', 'MEDIUM', '2026-04-01', NOW(), NOW(), 1, NULL),
('Mobile App Planning', 'Plan mobile application architecture and design', 'TODO', 'LOW', '2026-04-05', NOW(), NOW(), 1, NULL),
('User Role Implementation', 'Implement different user roles and permissions', 'IN_PROGRESS', 'HIGH', '2026-03-23', NOW(), NOW(), 1, NULL),
('Implement Search', 'Add search and filter functionality to task list', 'TODO', 'MEDIUM', '2026-03-24', NOW(), NOW(), 1, NULL);
