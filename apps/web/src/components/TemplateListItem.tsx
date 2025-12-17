'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Template, Category } from '../types/types';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TemplateListItemProps {
  template: Template;
}


const getChallengeUrl = (template: Template): string => {

  if (template.category === Category.BLOGS) {
    return `/blog/${template.slug}`;
  }
  if (template.directToPractice) {
    if (template.category === Category.SNIPPET_PRACTICE && template.snippets?.length) {
      return `/snippet-practice/${template.slug}`;
    }
    if (template.starterCode) {
      return `/practice/${template.slug}`;
    }
  }
  if (template.directToSnippetPractice) {
      return `/snippet-practice/${template.slug}`;
  }
  return `/design/${template.slug}`;
};

export const TemplateListItem: React.FC<TemplateListItemProps> = ({ template }) => {
  const challengeUrl = getChallengeUrl(template);
  const router = useRouter();

  return (
    <div className="group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-[#18181b] rounded-[12px] border border-white/5 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/10 cursor-pointer"
    onClick={() => router.push(challengeUrl)}
    >
      <div className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-20 rounded-xl overflow-hidden bg-[#202022] relative" style={{ borderRadius: '0.75rem' }}>
        <Image 
          src={template.imageUrl} 
          alt={template.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, 128px"
          style={{ borderRadius: '0.75rem' }}
        />
      </div>


      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0 overflow-hidden sm:pr-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors truncate min-w-0">
              {template.name}
            </h3>
            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded text-primary-400 bg-primary-400/10 border border-primary-400/20">
              {template.category}
            </span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 sm:line-clamp-1 mb-2 truncate max-w-full">
            {template.shortDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {template.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2 py-0.5 text-[10px] font-medium text-zinc-400 bg-white/5 border border-white/5 rounded-[4px] truncate max-w-[100px]">
                {tech}
              </span>
            ))}
            {template.techStack.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                +{template.techStack.length - 4}
              </span>
            )}
          </div>
        </div>
        

        <Link 
          href={challengeUrl}
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 h-10 bg-white/5 hover:bg-primary-600 hover:text-white text-zinc-300 rounded-[6px] text-sm font-semibold transition-all duration-300 group/btn border border-transparent hover:border-primary-500/50 w-full sm:w-[180px]"
        >
          <span className="truncate">{template.category === Category.BLOGS ? 'Read Blog' : 'Start Challenge'}</span>
          <ArrowRight size={14} className="flex-shrink-0 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

