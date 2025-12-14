import React from 'react';
import { Button } from '@repo/ui';
import { ButtonVariant } from '@/types/types';
import { Home, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-500/10 p-4">
            <AlertCircle size={48} className="text-yellow-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-zinc-300">Page Not Found</h2>
          <p className="text-zinc-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button
              variant={ButtonVariant.PRIMARY}
              icon={<Home size={16} />}
              className='p-2'
            >
              Go Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              variant={ButtonVariant.OUTLINE}
              icon={<Search size={16} />}
              className='p-2'
            >
              Explore Challenges
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

