/**
 * Authentication API Controller
 * Handles all API calls to the backend authentication endpoints
 */

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
};

const API_BASE = 'http://localhost:8080';

/**
 * Make API call to login endpoint
 */
async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Login failed');
  }

  return response.json();
}

/**
 * Make API call to logout endpoint
 */
async function logout(): Promise<void> {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Logout failed');
  }
}

/**
 * Verify token with backend
 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Export controller methods
 */
export const authController = {
  login,
  logout,
  verifyToken,
};
