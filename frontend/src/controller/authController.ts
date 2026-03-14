export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  // add other fields your backend returns, e.g. user info
  // user?: { id: string; email: string };
};

const API_BASE = 'http://localhost:8080';

export async function login(request: LoginRequest): Promise<LoginResponse> {
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
