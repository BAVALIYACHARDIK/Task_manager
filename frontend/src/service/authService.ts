/**
 * Authentication Service
 * Contains all authentication-related business logic
 */

import { authController } from '../controller/authController';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  token?: string;
  error?: string;
};

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password
 */
export const validatePassword = (password: string): boolean => {
  return password && password.length >= 6;
};

/**
 * Validate login credentials
 */
export const validateCredentials = (credentials: LoginCredentials): { valid: boolean; error?: string } => {
  const { email, password } = credentials;

  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' };
  }

  if (!validateEmail(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  if (!validatePassword(password)) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  return { valid: true };
};

/**
 * Store authentication token in local storage
 */
export const storeAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve authentication token from local storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store user data in local storage
 */
export const storeUserData = (userData: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Retrieve user data from local storage
 */
export const getUserData = (): any => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Validate credentials
    const validation = validateCredentials(credentials);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Call API through controller
    const response = await authController.login({
      email: credentials.email,
      password: credentials.password,
    });

    if (response && response.token) {
      // Store token and user data
      storeAuthToken(response.token);
      
      // Store additional user data if available
      if (response.user) {
        storeUserData(response.user);
      }

      return {
        success: true,
        token: response.token,
      };
    } else {
      return {
        success: false,
        error: response?.message || 'Login failed',
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during login';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  clearAuthData();
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

/**
 * Check if token is expired (simple check - can be enhanced)
 */
export const isTokenExpired = (): boolean => {
  const token = getAuthToken();
  if (!token) return true;

  try {
    // Decode JWT token (basic decoding without verification)
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    
    return Date.now() > expiryTime;
  } catch {
    return true;
  }
};
