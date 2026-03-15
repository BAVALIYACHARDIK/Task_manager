/**
 * API Service Utility
 * Handles all HTTP requests with authentication and error handling
 */

import { getAuthToken, isTokenExpired } from './authService';

const API_BASE = 'http://localhost:8080';

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
};

/**
 * Get default headers including authentication
 */
const getHeaders = (customHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token && !isTokenExpired()) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Make a generic API request
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  try {
    const { method = 'GET', headers = {}, body } = options;

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: getHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: responseData?.message || `HTTP Error: ${response.status}`,
        status: response.status,
      };
    }

    return {
      success: true,
      data: responseData,
      status: response.status,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * GET request helper
 */
export const get = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'GET' });
};

/**
 * POST request helper
 */
export const post = <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'POST', body });
};

/**
 * PUT request helper
 */
export const put = <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'PUT', body });
};

/**
 * DELETE request helper
 */
export const deleteRequest = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};

/**
 * PATCH request helper
 */
export const patch = <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'PATCH', body });
};
