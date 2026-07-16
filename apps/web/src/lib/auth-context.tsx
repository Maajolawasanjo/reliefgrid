'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { env } from './config';

interface User {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('reliefgrid_token');
    if (savedToken) {
      setToken(savedToken);
      fetch(`${env.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUser({
              id: data.id,
              email: data.email,
              fullName: data.full_name || data.email?.split('@')[0],
              organizationId: data.organization_id || 'org-default',
              roles: data.roles || ['COORDINATOR'],
            });
          } else {
            localStorage.removeItem('reliefgrid_token');
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          // Graceful handling if network/backend is unreachable
          localStorage.removeItem('reliefgrid_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${env.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        throw new Error(err.detail || err.message || 'Authentication failed');
      }

      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem('reliefgrid_token', data.access_token);

      setUser({
        id: data.user_id,
        email: data.email,
        fullName: data.email?.split('@')[0] || 'Operator',
        organizationId: 'org-default',
        roles: data.roles || ['COORDINATOR'],
      });
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        throw new Error('Backend server unreachable at http://localhost:8000. Please verify API status.');
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('reliefgrid_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
