/**
 * Activity Log Service
 * Handles all activity-related API calls and business logic
 */

import { get, post, ApiResponse } from './apiService';

export type ActivityLog = {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  user?: {
    id: number;
    email: string;
    fullName: string;
  };
  task?: {
    id: number;
    title: string;
  };
  additionalInfo?: string;
};

/**
 * Fetch all activity logs
 */
export const getAllActivities = async (): Promise<ApiResponse<ActivityLog[]>> => {
  const response = await get<any>('/api/activities');
  
  if (response.success && response.data) {
    const activitiesArray = response.data.data || response.data;
    return {
      success: response.success,
      data: Array.isArray(activitiesArray) ? activitiesArray : [],
      error: response.error,
    };
  }

  return {
    success: false,
    data: [],
    error: response.error || 'Failed to fetch activities',
  };
};

/**
 * Fetch recent activities
 */
export const getRecentActivities = async (limit: number = 20): Promise<ApiResponse<ActivityLog[]>> => {
  const response = await get<any>(`/api/activities/recent?limit=${limit}`);
  
  if (response.success && response.data) {
    const activitiesArray = response.data.data || response.data;
    return {
      success: response.success,
      data: Array.isArray(activitiesArray) ? activitiesArray : [],
      error: response.error,
    };
  }

  return {
    success: false,
    data: [],
    error: response.error || 'Failed to fetch recent activities',
  };
};

/**
 * Fetch activities for a specific task
 */
export const getTaskActivities = async (taskId: number | string): Promise<ApiResponse<ActivityLog[]>> => {
  const response = await get<any>(`/api/activities/task/${taskId}`);
  
  if (response.success && response.data) {
    const activitiesArray = response.data.data || response.data;
    return {
      success: response.success,
      data: Array.isArray(activitiesArray) ? activitiesArray : [],
      error: response.error,
    };
  }

  return {
    success: false,
    data: [],
    error: response.error || 'Failed to fetch task activities',
  };
};

/**
 * Fetch activities for a specific user
 */
export const getUserActivities = async (userId: number | string): Promise<ApiResponse<ActivityLog[]>> => {
  const response = await get<any>(`/api/activities/user/${userId}`);
  
  if (response.success && response.data) {
    const activitiesArray = response.data.data || response.data;
    return {
      success: response.success,
      data: Array.isArray(activitiesArray) ? activitiesArray : [],
      error: response.error,
    };
  }

  return {
    success: false,
    data: [],
    error: response.error || 'Failed to fetch user activities',
  };
};

/**
 * Fetch activities by action type
 */
export const getActivitiesByAction = async (action: string): Promise<ApiResponse<ActivityLog[]>> => {
  const response = await get<any>(`/api/activities/action/${action}`);
  
  if (response.success && response.data) {
    const activitiesArray = response.data.data || response.data;
    return {
      success: response.success,
      data: Array.isArray(activitiesArray) ? activitiesArray : [],
      error: response.error,
    };
  }

  return {
    success: false,
    data: [],
    error: response.error || 'Failed to fetch activities',
  };
};

/**
 * Format activity log for display
 */
export const formatActivityLog = (activity: ActivityLog): string => {
  return activity.description;
};

/**
 * Get action badge color for activity type
 */
export const getActionColor = (action: string): string => {
  switch (action) {
    case 'TASK_CREATED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'TASK_STATUS_CHANGED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'TASK_UPDATED':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'TASK_DELETED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

/**
 * Format timestamp for display
 */
export const formatActivityTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};
