import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/ui/Button';
import { ArrowLeft, Github, MonitorPlay, ExternalLink } from 'lucide-react';
import { InfiniteScrollDemo } from '@/components/demos/InfiniteScrollDemo';
import { getChallengeBySlug } from '@/lib/challenges';
import { NestedCommentsSystem } from '@/components/demos/NestedCommentsSystem';

// Registry maps slugs to React Components
const DEMO_REGISTRY: Record<string, React.FC> = {
  'infinite-scroll-component': InfiniteScrollDemo,
  'nested-comments-system': NestedCommentsSystem, // Placeholder mapping
  // Add other demos here as you build them
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getChallengeBySlug(slug);

  if (!template) {
    return notFound();
  }

  const DemoComponent = slug && DEMO_REGISTRY[slug] ? DEMO_REGISTRY[slug] : null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      
      {/* Demo Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href={`/design/${slug}`} 
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
            title="Back to Details"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-foreground flex items-center gap-2">
              <MonitorPlay size={18} className="text-primary" />
              {template.name}
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                Live Demo
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <a href={template.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" icon={<Github size={16} />}>
                <span className="hidden sm:inline">View Source</span>
              </Button>
           </a>
        </div>
      </header>

      {/* Demo Viewport */}
      <main className="flex-1 overflow-y-auto relative">
        {DemoComponent ? (
          <div className="w-full h-full p-4 sm:p-8">
            <DemoComponent />
          </div>
        ) : (
          /* Fallback for templates without internal demos yet */
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4">
               <MonitorPlay size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Internal Demo Not Available</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              We haven't built an internal interactive demo for this challenge yet. You can visit the external hosted demo if available.
            </p>
            {template.demoUrl && template.demoUrl !== '#' ? (
               <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                 <Button variant="primary">
                   Open External Demo <ExternalLink size={16} className="ml-2" />
                 </Button>
               </a>
            ) : (
              <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">No External Demo</Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
