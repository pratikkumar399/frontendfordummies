import React from 'react';
import Link from 'next/link';
import { PlusCircle, Code2 } from 'lucide-react';
import { Button } from '@/ui/Button';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-900/20">
                <Code2 size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white font-sans group-hover:text-primary-400 transition-colors">
              Frontend<span className="text-primary-400">Dummies</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {/* <div className="hidden md:flex items-center gap-1 bg-dark-card px-1 py-1 rounded-lg border border-dark-border">
            <Link 
              href="/" 
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isActive('/') ? 'bg-dark-accent text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Skills
            </Link>
            <Link 
              href="/admin" 
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isActive('/admin') ? 'bg-dark-accent text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Contribute
            </Link>
          </div> */}

          {/* Right Actions */}
          {/* <div className="flex items-center gap-4">
            <Link href="/admin">
                <Button variant="outline" size="sm" icon={<PlusCircle size={16}/>} className="hidden sm:inline-flex border-dark-border hover:border-primary-400 hover:bg-primary-600/10 hover:text-primary-400">
                    Submit
                </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
};