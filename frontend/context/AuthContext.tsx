'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, User as AuthUser } from '../services/auth.service';

export type User = AuthUser;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<User>;
  signup: (data: any) => Promise<User>;
  googleLogin: (token: string) => Promise<User>;
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
    
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          id: payload.id || '1', 
          name: payload.name || 'User', 
          email: payload.email || '',
          role: payload.role || 'user',
          isApproved: payload.isApproved || false
        });
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
    return response.user;
  };

  const signup = async (data: any) => {
    const response = await authService.signup(data);
    return response.user;
  };

  const googleLogin = async (token: string) => {
    const response = await authService.googleLogin(token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
