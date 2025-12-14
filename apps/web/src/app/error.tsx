'use client';

import React from 'react';
import { Button } from '@repo/ui';
import { ButtonVariant } from '@/types/types';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <AlertCircle size={48} className="text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Something went wrong!</h1>
          <p className="text-zinc-400">
            We encountered an unexpected error. Please try again or return to the home page.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-4 text-left">
            <p className="text-xs font-semibold text-red-400 mb-2">Error Details (Development Only):</p>
            <p className="text-xs text-zinc-400 font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-zinc-500 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant={ButtonVariant.PRIMARY}
            className='p-2'
            onClick={reset}
            icon={<RefreshCw size={16} />}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant={ButtonVariant.OUTLINE}
              className='p-2'
              icon={<Home size={16} />}
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

