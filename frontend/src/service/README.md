# Frontend Service Layer Architecture

## Overview

The frontend has been restructured with a clear separation of concerns:

- **Service Layer** (`src/service/`) - Contains all business logic, validations, and state management
- **Controller Layer** (`src/controller/`) - Contains only API calls to the backend
- **Pages/Components** (`src/pages/`, `src/components/`) - UI components that use services

## Service Files

### 1. `authService.ts`
**Purpose**: Authentication and authorization business logic

**Key Functions**:
- `login(credentials)` - Validates credentials and calls API
- `logout()` - Clears authentication data
- `validateEmail(email)` - Email format validation
- `validatePassword(password)` - Password validation
- `validateCredentials(credentials)` - Full credential validation
- `storeAuthToken(token)` - Store token in localStorage
- `getAuthToken()` - Retrieve stored token
- `isAuthenticated()` - Check if user is logged in
- `getAuthHeader()` - Get Authorization header for API requests
- `isTokenExpired()` - Check if JWT token has expired

**Example Usage**:
```typescript
import { login, isAuthenticated, logout } from '../service/authService';

// Login
const result = await login({ email: 'user@example.com', password: 'password' });
if (result.success) {
  // Handle successful login
}

// Check authentication
if (isAuthenticated()) {
  // User is logged in
}

// Logout
logout();
```

### 2. `apiService.ts`
**Purpose**: Generic HTTP request handling with authentication

**Key Functions**:
- `get<T>(endpoint)` - GET request
- `post<T>(endpoint, body)` - POST request
- `put<T>(endpoint, body)` - PUT request
- `patch<T>(endpoint, body)` - PATCH request
- `deleteRequest<T>(endpoint)` - DELETE request
- `apiRequest<T>(endpoint, options)` - Generic request method

**Features**:
- Automatic authentication header injection
- Token expiration checking
- Error handling and standardized responses
- Type-safe responses with TypeScript generics

**Example Usage**:
```typescript
import { get, post, apiRequest } from '../service/apiService';

// Simple GET request
const response = await get<User>('/api/users/profile');

// POST request with body
const newTask = await post<Task>('/api/tasks', { title: 'New Task' });

// Custom request
const response = await apiRequest<Data>('/api/endpoint', {
  method: 'POST',
  body: { key: 'value' }
});
```

### 3. `taskService.ts`
**Purpose**: Task management business logic

**Key Types**:
- `Task` - Task object
- `TaskStatus` - 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
- `TaskPriority` - 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
- `CreateTaskRequest` - Request payload for creating tasks
- `UpdateTaskRequest` - Request payload for updating tasks

**Key Functions**:
- `getAllTasks()` - Fetch all tasks
- `getTaskById(taskId)` - Fetch a single task
- `createTask(taskData)` - Create a new task with validation
- `updateTask(taskId, taskData)` - Update task
- `updateTaskStatus(taskId, status)` - Update task status
- `deleteTask(taskId)` - Delete a task
- `getTasksByStatus(status)` - Filter tasks by status
- `getTasksByPriority(priority)` - Filter tasks by priority
- `filterTasks(filters)` - Advanced filtering
- `searchTasks(keyword)` - Search tasks by keyword
- `sortTasksByPriority(tasks)` - Sort tasks by priority
- `sortTasksByDueDate(tasks)` - Sort tasks by due date
- `getStatusColor(status)` - Get display color for status
- `getPriorityColor(priority)` - Get display color for priority

**Example Usage**:
```typescript
import { 
  getAllTasks, 
  createTask, 
  updateTaskStatus, 
  deleteTask,
  sortTasksByPriority
} from '../service/taskService';

// Fetch all tasks
const response = await getAllTasks();
if (response.success) {
  const tasks = response.data;
  // Sort by priority
  const sorted = sortTasksByPriority(tasks);
}

// Create a new task
const result = await createTask({
  title: 'Complete project',
  description: 'Finish the migration',
  priority: 'HIGH',
  dueDate: '2026-03-20'
});

// Update task status
await updateTaskStatus(taskId, 'COMPLETED');

// Delete a task
await deleteTask(taskId);
```

## Controller File

### `authController.ts`
**Purpose**: Only API calls to authentication endpoints

**Functions**:
- `authController.login(credentials)` - Call login API
- `authController.logout()` - Call logout API
- `authController.verifyToken(token)` - Verify token with backend

> **Note**: Controllers should ONLY handle HTTP requests. All business logic should be in services.

## Architecture Flow

### Before (Mixed Concerns)
```
Component → Controller (validation + API call + state management)
```

### After (Separated Concerns)
```
Component → Service (validation + business logic) → Controller (API call only) → Backend
```

## Best Practices

### ✅ DO

1. **Use services in components**: Import and call service functions
   ```typescript
   import { login } from '../service/authService';
   const result = await login(credentials);
   ```

2. **Keep validation in services**: Validate data before API calls
   ```typescript
   const validation = validateCredentials(credentials);
   if (!validation.valid) return { error: validation.error };
   ```

3. **Handle errors in services**: Return standardized responses
   ```typescript
   return { success: false, error: 'Invalid data' };
   ```

4. **Use API service utilities**: For consistent HTTP requests
   ```typescript
   import { post, get } from '../service/apiService';
   ```

### ❌ DON'T

1. **Use controller directly in components**: Go through services instead
   ```typescript
   // ❌ Wrong
   import { authController } from '../controller/authController';
   
   // ✅ Correct
   import { login } from '../service/authService';
   ```

2. **Mix validation with API calls**: Keep validation in services
   ```typescript
   // ✅ Correct approach in service
   const validation = validateData(data);
   if (!validation.valid) return { error: validation.error };
   const response = await apiRequest('/endpoint', data);
   ```

3. **Store logic in components**: Move logic to services
   ```typescript
   // ❌ Wrong - in component
   const validateAndLogin = (credentials) => { ... };
   
   // ✅ Correct - in service
   export const login = (credentials) => { ... };
   ```

## Adding New Services

### Template for a New Service

```typescript
/**
 * [Feature] Service
 * Contains all [feature]-related business logic
 */

import { get, post, put, deleteRequest, ApiResponse } from './apiService';

export type [Entity] = {
  id: string;
  // fields...
};

export type Create[Entity]Request = {
  // request fields...
};

/**
 * Fetch all [entities]
 */
export const getAll[Entities] = async (): Promise<ApiResponse<[Entity][]>> => {
  return get<[Entity][]>('/api/[entities]');
};

/**
 * Validate [entity] data
 */
const validate[Entity]Data = (data: Create[Entity]Request): { valid: boolean; error?: string } => {
  // validation logic
  return { valid: true };
};

/**
 * Create a new [entity]
 */
export const create[Entity] = async (data: Create[Entity]Request): Promise<ApiResponse<[Entity]>> => {
  const validation = validate[Entity]Data(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  return post<[Entity]>('/api/[entities]', data);
};
```

## Connected to Backend

All services are connected to your Spring Boot backend at `http://localhost:8080`:

- **Auth Endpoints**:
  - `POST /api/auth/login` - Login
  - `POST /api/auth/logout` - Logout
  - `GET /api/auth/verify` - Verify token

- **Task Endpoints** (Ready to implement):
  - `GET /api/tasks` - Get all tasks
  - `GET /api/tasks/{id}` - Get task by ID
  - `POST /api/tasks` - Create task
  - `PUT /api/tasks/{id}` - Update task
  - `PATCH /api/tasks/{id}/status` - Update task status
  - `DELETE /api/tasks/{id}` - Delete task
  - `GET /api/tasks/search` - Search tasks

## Troubleshooting

### Token Not Sent in Requests
```typescript
// apiService.ts automatically includes token
// Ensure token is stored via authService.storeAuthToken()
```

### CORS Issues
```typescript
// Backend already has CORS configured
@CrossOrigin(origins = "http://localhost:5173")
```

### Need to Add New Endpoints
1. Create method in appropriate service
2. Use `apiRequest` or helper functions from `apiService.ts`
3. Add validation logic if needed
4. Return standardized `ApiResponse<T>` type

---

This architecture makes your code more maintainable, testable, and scalable!
