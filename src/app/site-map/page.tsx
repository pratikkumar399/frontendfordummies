import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { INITIAL_TEMPLATES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Sitemap | Frontend Dummies',
  description: 'Sitemap for Frontend Dummies website.',
};

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-300 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-dark-border pb-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sitemap</h1>
          <p className="text-gray-400">Overview of the available content on Frontend Dummies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary-400 border-b border-dark-border pb-2">Main Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary-300 transition-colors block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-primary-300 transition-colors block py-1">
                  Explore Challenges
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-primary-300 transition-colors block py-1">
                  JS Playground
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary-300 transition-colors block py-1">
                  Submit Challenge
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-300 transition-colors block py-1">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary-400 border-b border-dark-border pb-2">Challenges</h2>
            <ul className="space-y-2">
              {INITIAL_TEMPLATES.map((template) => (
                <li key={template.id}>
                  <Link 
                    href={`/design/${template.slug}`} 
                    className="hover:text-primary-300 transition-colors block py-1"
                  >
                    {template.name}
                  </Link>
                  {template.starterCode && (
                    <Link 
                        href={`/practice/${template.slug}`}
                        className="text-xs text-gray-500 hover:text-primary-300 ml-4 block py-0.5"
                    >
                        ↳ Practice Interface
                    </Link>
                  )}
                  {template.snippets && template.snippets.length > 0 && (
                    <Link 
                        href={`/snippet-practice/${template.slug}`}
                        className="text-xs text-gray-500 hover:text-primary-300 ml-4 block py-0.5"
                    >
                        ↳ Snippet Quiz
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}

