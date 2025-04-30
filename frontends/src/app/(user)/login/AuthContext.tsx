"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('adminToken');
    const storedUsername = localStorage.getItem('adminUsername');
    
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      
      // Also set the token as a cookie for middleware
      document.cookie = `adminToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    }
  }, []);

  const login = (token: string, username: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUsername', username);
    
    // Set cookie for middleware authentication
    document.cookie = `adminToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    
    // Remove the authentication cookie
    document.cookie = 'adminToken=; path=/; max-age=0';
    
    setIsAuthenticated(false);
    setUsername(null);
    router.push('/login');
  };

  const value = {
    isAuthenticated,
    username,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}