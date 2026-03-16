/**
 * Task Management Service
 * Contains all task-related business logic and API calls
 */

import { get, post, put, deleteRequest, patch, ApiResponse } from './apiService';

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  tags?: string[];
};

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type CreateTaskRequest = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
  tags?: string[];
};

export type UpdateTaskRequest = Partial<CreateTaskRequest> & {
  status?: TaskStatus;
};

/**
 * Fetch all tasks
 */
export const getAllTasks = async (): Promise<ApiResponse<Task[]>> => {
  const response = await get<any>('/api/tasks');
  
  if (response.success && response.data) {
    // Backend returns nested response: { success, code, data: [...], message }
    // Extract the actual tasks array from response.data.data
    const tasksArray = response.data.data || response.data;
    
    return {
      success: response.success,
      data: Array.isArray(tasksArray) ? tasksArray : [],
      error: response.error,
    };
  }

  return {
    success: false,
    data: [],
    error: response.error || 'Failed to fetch tasks',
  };
};

/**
 * Fetch a single task by ID
 */
export const getTaskById = async (taskId: string | number): Promise<ApiResponse<Task>> => {
  const response = await get<any>(`/api/tasks/${taskId}`);
  
  if (response.success && response.data) {
    const taskData = response.data.data || response.data;
    return {
      success: response.success,
      data: taskData,
      error: response.error,
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch task',
  };
};

/**
 * Create a new task
 */
export const createTask = async (taskData: CreateTaskRequest): Promise<ApiResponse<Task>> => {
  // Validate task data
  const validation = validateTaskData(taskData);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  const response = await post<any>('/api/tasks', taskData);
  
  if (response.success && response.data) {
    const taskData = response.data.data || response.data;
    return {
      success: response.success,
      data: taskData,
      error: response.error,
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to create task',
  };
};

/**
 * Update an existing task
 */
export const updateTask = async (
  taskId: string | number,
  taskData: UpdateTaskRequest
): Promise<ApiResponse<Task>> => {
  const response = await put<any>(`/api/tasks/${taskId}`, taskData);
  
  if (response.success && response.data) {
    const updatedTask = response.data.data || response.data;
    return {
      success: response.success,
      data: updatedTask,
      error: response.error,
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to update task',
  };
};

/**
 * Update task status
 */
export const updateTaskStatus = async (
  taskId: string | number,
  status: TaskStatus
): Promise<ApiResponse<Task>> => {
  const response = await patch<any>(`/api/tasks/${taskId}/status`, { status });
  
  if (response.success && response.data) {
    const taskData = response.data.data || response.data;
    return {
      success: response.success,
      data: taskData,
      error: response.error,
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to update task status',
  };
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string | number): Promise<ApiResponse<void>> => {
  return deleteRequest(`/api/tasks/${taskId}`);
};

/**
 * Get tasks by status
 */
export const getTasksByStatus = async (status: TaskStatus): Promise<ApiResponse<Task[]>> => {
  return get<Task[]>(`/api/tasks?status=${status}`);
};

/**
 * Get tasks by priority
 */
export const getTasksByPriority = async (priority: TaskPriority): Promise<ApiResponse<Task[]>> => {
  return get<Task[]>(`/api/tasks?priority=${priority}`);
};

/**
 * Filter tasks
 */
export const filterTasks = async (filters: {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
}): Promise<ApiResponse<Task[]>> => {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.priority) queryParams.append('priority', filters.priority);
  if (filters.assignedTo) queryParams.append('assignedTo', filters.assignedTo);

  return get<Task[]>(`/api/tasks?${queryParams.toString()}`);
};

/**
 * Search tasks by keyword
 */
export const searchTasks = async (keyword: string): Promise<ApiResponse<Task[]>> => {
  return get<Task[]>(`/api/tasks/search?q=${encodeURIComponent(keyword)}`);
};

/**
 * Validate task data before submission
 */
const validateTaskData = (
  taskData: CreateTaskRequest
): { valid: boolean; error?: string } => {
  if (!taskData.title || taskData.title.trim().length === 0) {
    return { valid: false, error: 'Task title is required' };
  }

  if (taskData.title.length > 255) {
    return { valid: false, error: 'Task title must be less than 255 characters' };
  }

  if (taskData.description && taskData.description.length > 2000) {
    return { valid: false, error: 'Task description must be less than 2000 characters' };
  }

  if (taskData.priority && !['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(taskData.priority)) {
    return { valid: false, error: 'Invalid priority value' };
  }

  if (taskData.dueDate) {
    const dueDate = new Date(taskData.dueDate);
    if (isNaN(dueDate.getTime())) {
      return { valid: false, error: 'Invalid due date format' };
    }
  }

  return { valid: true };
};

/**
 * Format task date for display
 */
export const formatTaskDate = (date: string | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get status color for display
 */
export const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get priority color for display
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

/**
 * Sort tasks by priority
 */
export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder: Record<TaskPriority, number> = {
    URGENT: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

/**
 * Sort tasks by due date
 */
export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};
