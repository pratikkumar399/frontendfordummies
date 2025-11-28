'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <AppProvider>{children}</AppProvider>;
}

