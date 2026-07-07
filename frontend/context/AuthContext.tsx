'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g. check local storage token)
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app with a /me endpoint, we would fetch the user profile here.
      // For now, if there is a token, we assume they are logged in.
      // Alternatively, we could decode the JWT token to get basic user info.
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId || '1', name: payload.name || 'User', email: payload.email || '' });
      } catch (e) {
        // invalid token
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: any) => {
    const response = await authService.login(data);
    setUser(response.user);
  };

  const signup = async (data: any) => {
    const response = await authService.signup(data);
    setUser(response.user);
  };

  const googleLogin = async (token: string) => {
    const response = await authService.googleLogin(token);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
