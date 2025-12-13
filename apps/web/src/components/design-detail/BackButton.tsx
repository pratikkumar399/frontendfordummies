'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
}

export const BackButton = ({ href = '/explore' }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(href);
      }}
      className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md bg-dark-card border border-dark-border hover:bg-dark-accent"
    >
      <ArrowLeft size={16} className="mr-2" />
      Back
    </button>
  );
};

