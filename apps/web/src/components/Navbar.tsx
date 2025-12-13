'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, Terminal, BookOpen } from 'lucide-react';
import { LinkButton } from '@repo/ui';
import { ButtonVariant, ButtonSize } from '@/types/types';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[12px] cursor-pointer">
                <img src="/favicon.ico" alt="Frontend Dummies" className="object-contain" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white font-sans group-hover:text-primary-400 transition-colors">
              <span className="hidden sm:inline">Frontend</span><span className="sm:hidden">F</span><span className="text-primary-400">Dummies</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LinkButton 
              href="/blog" 
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.SM}
              icon={<BookOpen size={16} />}
              className="px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Blogs</span>
            </LinkButton>
            <LinkButton 
              href="/playground" 
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.SM}
              icon={<Terminal size={16} />}
              className="px-2 sm:px-4"
            >
              <span className="hidden sm:inline">JS Playground</span>
            </LinkButton>
          </div>
        </div>
      </div>
    </nav>
  );
};