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

export type SignupRequest = {
  email: string;
  password: string;
  fullName: string;
};

export type SignupResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
};

const API_BASE = 'http://localhost:8080';

/**
 * Make API call to login endpoint
 */
async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    // Log response details for debugging
    console.log('Login Response Status:', response.status);
    console.log('Login Response Data:', data);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}: Login failed`);
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    console.error('Login Error:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Make API call to signup endpoint
 */
async function signup(request: SignupRequest): Promise<SignupResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    // Log response details for debugging
    console.log('Signup Response Status:', response.status);
    console.log('Signup Response Headers:', {
      contentType: response.headers.get('Content-Type'),
      status: response.status,
      statusText: response.statusText,
    });
    console.log('Signup Response Data:', data);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}: Signup failed`);
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Signup failed';
    console.error('Signup Error:', errorMessage);
    throw new Error(errorMessage);
  }
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
  signup,
  logout,
  verifyToken,
};
