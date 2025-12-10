'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, Terminal } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { ButtonVariant, ButtonSize } from '@/types/types';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center ">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-[12px]  cursor-pointer">
                <img src="/favicon.ico" alt="Frontend Dummies" className="object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white font-sans group-hover:text-primary-400 transition-colors">
              Frontend<span className="text-primary-400">Dummies</span>
            </span>
          </Link>

          <LinkButton 
            href="/playground" 
            variant={ButtonVariant.SECONDARY}
            size={ButtonSize.SM}
            icon={<Terminal size={16} />}
          >
            JS Playground
          </LinkButton>
        </div>
      </div>
    </nav>
  );
};