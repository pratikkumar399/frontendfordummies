import React from 'react';
import { notFound } from 'next/navigation';
import { Button, LinkButton } from '@repo/ui';
import { MonitorPlay, Code, Github } from 'lucide-react';
import { CommentsList } from '@/components/demos/NestedCommentsSystem';
import { getChallengeBySlug } from '@/lib/challenges';
import { ButtonVariant, ButtonSize } from '@/types/types';
import ModalDemo from '@/components/demos/ModalDemo';
import { getDemoFiles } from '@/lib/code-loader';
import { CodeViewer } from '@/components/design-detail/CodeViewer';
import { BackButton } from '@/components/design-detail/BackButton';
import ImageCarouselHome from '@/components/demos/ImageCarousel';
import DynamicTicTacToe from '@/components/demos/DynamicTicTacToe';
import DiceRoller from '@/components/demos/DiceRoller';
import WhackAMole from '@/components/demos/WhackAMole';
import MemoryGame from '@/components/demos/MemoryGame';

const DEMO_REGISTRY: Record<string, React.FC> = {
  'nested-comments-system': CommentsList,
  'modal-component': ModalDemo,
  'image-carousel': ImageCarouselHome,
  'dynamic-tic-tac-toe': DynamicTicTacToe,
  'dice-roller': DiceRoller,
  'whack-a-mole': WhackAMole,
  'memory-game': MemoryGame
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string }>;
};

export default async function DemoPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { view } = await searchParams;
  const template = getChallengeBySlug(slug);

  if (!template) {
    return notFound();
  }

  const DemoComponent = slug && DEMO_REGISTRY[slug] ? DEMO_REGISTRY[slug] : null;
  const files = await getDemoFiles(slug);
  const isCodeView = view === 'code';

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 pb-4">
        <header className="flex flex-col gap-4">
          <div className="w-fit">
            <BackButton href={`/design/${slug}`} />
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                <span className="text-primary-400">Design Challenge</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-muted-foreground">Live Demo</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-2">
                <MonitorPlay size={20} className="text-primary-400" />
                {template.name}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                {template.shortDescription}
              </p>
            </div>
            {template.githubUrl && template.githubUrl !== '#' && (
              <LinkButton
                href={template.githubUrl}
                target="_blank"
                rel="noreferrer"
                variant={ButtonVariant.GHOST}
                size={ButtonSize.SM}
                className="mt-2 md:mt-0 self-start md:self-auto shrink-0"
                icon={<Github size={16} />}
              >
                Edit on GitHub
              </LinkButton>
            )}
          </div>
        </header>

        <div className="flex-1 rounded-2xl border border-border bg-card/80 flex flex-col">
          <section className="flex-1 flex flex-col bg-background rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 h-11 bg-card/90 ">
              <div className="inline-flex items-center gap-1  p-0.5 ">
                <LinkButton
                  href={`/design/${slug}/demo`}
                  variant={isCodeView ? ButtonVariant.SECONDARY : ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-md font-medium"
                >
                  Preview
                </LinkButton>
                <LinkButton
                  href={`/design/${slug}/demo?view=code`}
                  variant={isCodeView ? ButtonVariant.PRIMARY : ButtonVariant.SECONDARY}
                  size={ButtonSize.SM}
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-md font-medium flex items-center gap-1.5"
                  icon={<Code size={14} />}
                >
                  Code
                </LinkButton>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 bg-background">
              {isCodeView ? (
                <CodeViewer files={files} title={template.name} slug={slug} />
              ) : DemoComponent ? (
                <div className="w-full h-full p-4 sm:p-6">
                  <div className="w-full h-full rounded-2xl  p-4 overflow-auto">
                    <DemoComponent />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4">
                    <MonitorPlay size={32} className="text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Internal Demo Not Available
                  </h2>
                  <p className="text-muted-foreground max-w-md mb-8">
                    We haven&apos;t built an internal interactive demo for this challenge yet. You
                    can visit the external hosted demo if available.
                  </p>
                  {template.demoUrl && template.demoUrl !== '#' ? (
                    <LinkButton href={template.demoUrl} variant={ButtonVariant.PRIMARY} icon={<Github size={16} />}>
                      Open External Demo
                    </LinkButton>
                  ) : (
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      disabled
                      className="opacity-50 cursor-not-allowed"
                    >
                      No External Demo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
