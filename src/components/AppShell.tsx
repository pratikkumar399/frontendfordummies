'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith('/practice/') || pathname?.endsWith('/code');

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      {!hideChrome && <Navbar />}
      <main >{children}</main>
      {!hideChrome && <Footer />}
    </div>
  );
};

