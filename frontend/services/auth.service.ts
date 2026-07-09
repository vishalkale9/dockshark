import { fetchWithAuth } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(data: any): Promise<AuthResponse> {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return {
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        isApproved: response.isApproved
      },
      token: response.token
    };
  },

  async signup(data: any): Promise<AuthResponse> {
    const response = await fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        isApproved: response.isApproved
      },
      token: response.token
    };
  },

  async googleLogin(token: string): Promise<AuthResponse> {
    const response = await fetchWithAuth('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return {
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        isApproved: response.isApproved
      },
      token: response.token
    };
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  // Helper to decode or fetch current user based on token (if we had a /me endpoint)
  // For now, we will rely on localStorage logic in the Context.
};
