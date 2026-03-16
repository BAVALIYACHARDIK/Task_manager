/**
 * User Management Service
 * Contains all user-related API calls
 */

import { get, ApiResponse } from './apiService';

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

/**
 * Fetch all active members
 */
export const getAllMembers = async (): Promise<ApiResponse<Member[]>> => {
  const response = await get<Member[]>('/api/users/members');
  
  if (response.success && response.data) {
    // Handle both direct array response and nested response structure
    const membersArray = Array.isArray(response.data) ? response.data : (response.data as any).data;
    
    return {
      success: response.success,
      data: Array.isArray(membersArray) ? membersArray : [],
      error: response.error,
    };
  }

  return {
    success: false,
    data: [],
    error: response.error || 'Failed to fetch members',
  };
};
