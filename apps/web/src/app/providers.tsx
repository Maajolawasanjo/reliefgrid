'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { LocationProvider } from '@/lib/location-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        {children}
      </LocationProvider>
    </AuthProvider>
  );
}
