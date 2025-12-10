'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, LinkButton } from '@/components/ui/Button';
import { PlayCircle, ExternalLink, Github } from 'lucide-react';
import { Template, Category, ButtonVariant, ButtonSize } from '@/types/types';

interface ChallengeActionsProps {
  template: Template;
}

export const ChallengeActions: React.FC<ChallengeActionsProps> = ({ template }) => {
  const router = useRouter();

  const isIDESupported = (template.category === Category.JAVASCRIPT || template.category === Category.ALGORITHMS) && template.starterCode;
  const isSnippetSupported = template.category === Category.SNIPPET_PRACTICE && template.snippets && template.snippets.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {isIDESupported && (
        <div className="flex-1">
          <Button
            onClick={() => router.push(`/practice/${template.slug}`)}
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.LG}
            className="w-full shadow-[0_0_20px_rgba(74,222,128,0.3)] border-primary-500/50"
            icon={<PlayCircle size={18} fill="currentColor" className="text-white/20" />}
          >
            Open Code Editor
          </Button>
        </div>
      )}
      {isSnippetSupported && (
        <div className="flex-1">
          <Button
            onClick={() => router.push(`/snippet-practice/${template.slug}`)}
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.LG}
            className="w-full shadow-[0_0_20px_rgba(74,222,128,0.3)] border-primary-500/50"
            icon={<PlayCircle size={18} fill="currentColor" className="text-white/20" />}
          >
            Start Snippet Practice
          </Button>
        </div>
      )}

      {template.demoUrl && template.demoUrl !== '#' && (
        <div className="flex-1">
          <LinkButton
            href={template.demoUrl}
            variant={(isIDESupported || isSnippetSupported) ? ButtonVariant.SECONDARY : ButtonVariant.PRIMARY}
            size={ButtonSize.LG}
            className="w-full"
            icon={<ExternalLink size={18} />}
          >
            View Solution Demo
          </LinkButton>
        </div>
      )}
      {/* {template.githubUrl && template.githubUrl !== '#' && (
        <div className="flex-1">
          <LinkButton
            href={template.githubUrl}
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.LG}
            className="w-full border-dark-border text-zinc-300 hover:border-primary-400 hover:text-primary-400 bg-dark-card"
            icon={<Github size={18} />}
          >
            View Source Code
          </LinkButton>
        </div>
      )} */}
    </div>
  );
};
