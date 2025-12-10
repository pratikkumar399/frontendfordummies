import React from 'react';
import Link from 'next/link';
import { Template, Category } from '../types/types';
import { Github, ArrowRight, Layers } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
}

// Helper function to determine the challenge URL
const getChallengeUrl = (template: Template): string => {
  // If directToPractice is explicitly set, use it
  if (template.directToPractice) {
    // Determine the practice route based on category
    if (template.category === Category.SNIPPET_PRACTICE && template.snippets?.length) {
      return `/snippet-practice/${template.slug}`;
    }
    if (template.starterCode) {
      return `/practice/${template.slug}`;
    }
  }
  // Default: go to design page
  return `/design/${template.slug}`;
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const challengeUrl = getChallengeUrl(template);

  return (
    <div className="group relative flex flex-col h-full bg-[#18181b] rounded-2xl border border-white/5 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/10 hover:-translate-y-1 overflow-hidden">
      
      {/* Image Area */}
      <div className="relative h-48 overflow-hidden bg-[#202022]">
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-transparent z-10 opacity-80" />
        
        <img 
          src={template.imageUrl} 
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 shadow-sm">
                <Layers size={10} className="text-primary-400" />
                {template.category}
            </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-5 pt-2">
        
        {/* Title & Desc */}
        <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
            {template.name}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
            {template.shortDescription}
            </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {template.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="px-2 py-1 text-[10px] font-medium text-zinc-400 bg-white/5 border border-white/5 rounded-[4px] group-hover:border-white/10 transition-colors">
                    {tech}
                </span>
            ))}
            {template.techStack.length > 3 && (
                <span className="px-2 py-1 text-[10px] font-medium text-zinc-500 bg-transparent border border-transparent rounded-[4px]">
                    +{template.techStack.length - 3}
                </span>
            )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-auto border-t border-white/5 flex items-center gap-3">
            <Link 
            href={challengeUrl}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-primary-600 hover:text-white text-zinc-300 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 group/btn border border-white/5 hover:border-primary-500/50 shadow-sm hover:shadow-primary-500/20"
            >
            <span>Start Challenge</span>
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
            
            {/* <a 
                href={template.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5 transition-colors group/icon"
                title="View Source on GitHub"
            >
                <Github size={18} className="transition-transform group-hover/icon:scale-110" />
            </a> */}
        </div>
      </div>
    </div>
  );
};