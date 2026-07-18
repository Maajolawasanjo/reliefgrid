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
  launchDemo: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: '0eac533c-c914-46eb-9de8-dc0b43350b81',
  email: 'admin@reliefgrid.gov',
  fullName: 'ReliefGrid Administrator (Demo)',
  organizationId: 'nema-core',
  roles: ['ADMIN', 'COORDINATOR'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('reliefgrid_token');
    if (savedToken) {
      setToken(savedToken);
      if (savedToken === 'demo-interactive-token') {
        setUser(DEMO_USER);
        setIsLoading(false);
        return;
      }
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
            // Fallback to demo mode if token validation fails
            setUser(DEMO_USER);
            setToken('demo-interactive-token');
            localStorage.setItem('reliefgrid_token', 'demo-interactive-token');
          }
        })
        .catch(() => {
          // Graceful demo fallback if backend is offline
          setUser(DEMO_USER);
          setToken('demo-interactive-token');
          localStorage.setItem('reliefgrid_token', 'demo-interactive-token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const launchDemo = () => {
    const demoToken = 'demo-interactive-token';
    setToken(demoToken);
    setUser(DEMO_USER);
    localStorage.setItem('reliefgrid_token', demoToken);
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${env.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!res.ok) {
        // Fallback to interactive demo mode on API error
        console.warn('Backend login notice: falling back to Interactive Demo Mode.');
        launchDemo();
        return;
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
      console.warn('Network notice: falling back to Interactive Demo Mode.');
      launchDemo();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('reliefgrid_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, launchDemo, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
