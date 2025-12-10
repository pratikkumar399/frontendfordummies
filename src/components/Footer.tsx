'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white font-sans">Frontend<span className="text-primary-500">Dummies</span></h3>
            <p className="text-zinc-500 text-sm mt-1">
              Master frontend development skills with real-world coding challenges.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/site-map" className="hover:text-white transition-colors">Sitemap</Link>
            {/* <a href="https://github.com/pratikkumar399/frontendfordummies" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a> */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Frontend For Dummies. Open Source Learning.
        </div>
      </div>
    </footer>
  );
};