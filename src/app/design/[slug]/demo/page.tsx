import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, LinkButton } from '@/components/ui/Button';
import { ArrowLeft, Github, MonitorPlay, ExternalLink, Code } from 'lucide-react';
import { InfiniteScrollDemo } from '@/components/demos/InfiniteScrollDemo';
import { CommentsList } from '@/components/demos/NestedCommentsSystem';
import { getChallengeBySlug } from '@/lib/challenges';
import { ButtonVariant, ButtonSize } from '@/types/types';

const DEMO_REGISTRY: Record<string, React.FC> = {
  'infinite-scroll-component': InfiniteScrollDemo,
  'nested-comments-system': CommentsList,
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
          <LinkButton 
            href={`/design/${slug}/code`}
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.SM}
            icon={<Code size={16} />}
          >
            <span className="hidden sm:inline">Code</span>
          </LinkButton>
          {/* <LinkButton 
            href={template.githubUrl} 
            variant={ButtonVariant.SECONDARY} 
            size={ButtonSize.SM} 
            icon={<Github size={16} />}
          >
            <span className="hidden sm:inline">View Source</span>
          </LinkButton> */}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative">
        {DemoComponent ? (
          <div className="w-full h-full p-4 sm:p-8">
            <DemoComponent />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4">
               <MonitorPlay size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Internal Demo Not Available</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              We haven&apos;t built an internal interactive demo for this challenge yet. You can visit the external hosted demo if available.
            </p>
            {template.demoUrl && template.demoUrl !== '#' ? (
              <LinkButton href={template.demoUrl} variant={ButtonVariant.PRIMARY}>
                Open External Demo <ExternalLink size={16} className="ml-2" />
              </LinkButton>
            ) : (
              <Button variant={ButtonVariant.OUTLINE} disabled className="opacity-50 cursor-not-allowed">No External Demo</Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
