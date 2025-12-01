'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Category } from '@/types/types';
import { ArrowLeft, ExternalLink, Github, Calendar, User, Code2, BrainCircuit, PlayCircle, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { templates } = useApp();
  const router = useRouter();

  const template = templates.find(t => t.slug === slug);

  if (!template) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Challenge not found</h2>
        <Button onClick={() => router.push('/explore')} variant="outline">
          Back to Challenges
        </Button>
      </div>
    );
  }

  const isIDESupported = (template.category === Category.JAVASCRIPT || template.category === Category.ALGORITHMS) && template.starterCode;
  const isSnippetSupported = template.category === Category.SNIPPET_PRACTICE && template.snippets && template.snippets.length > 0;


  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 relative overflow-hidden">
        {/* Background blobs */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-blob bg-primary-600/5 w-[800px] h-[800px] top-[0] right-[-200px] blur-[120px]"></div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Link
            href="/explore"
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md bg-dark-card border border-dark-border hover:bg-dark-accent"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Challenges
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image & Quick Links */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl overflow-hidden border border-dark-border shadow-2xl bg-dark-card aspect-video relative group">
              <Image
                src={template.imageUrl} 
                alt={template.name}
                width={1000}
                height={1000}
                className="w-full h-full object-cover opacity-90"
                priority
              />
            </div>
            
             <div className="flex flex-col sm:flex-row gap-4">
               {isIDESupported && (
                <div className="flex-1">
                   <Button 
                      onClick={() => router.push(`/practice/${template.slug}`)}
                      variant="primary" 
                      size="lg" 
                      className="w-full shadow-lg shadow-primary-500/20 dark:shadow-[0_0_20px_rgba(74,222,128,0.3)] border-primary-500/50" 
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
                      variant="primary" 
                      size="lg" 
                      className="w-full shadow-lg shadow-primary-500/20 dark:shadow-[0_0_20px_rgba(74,222,128,0.3)] border-primary-500/50" 
                      icon={<PlayCircle size={18} fill="currentColor" className="text-white/20" />}
                    >
                      Start Snippet Practice
                    </Button>
                </div>
               )}

              <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" className={(isIDESupported || isSnippetSupported) ? "flex-1" : "flex-1"}>
                <Button variant={(isIDESupported || isSnippetSupported) ? "secondary" : "primary"} size="lg" className="w-full" icon={<ExternalLink size={18} />}>
                  View Solution Demo
                </Button>
              </a>
              <a href={template.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full border-dark-border text-zinc-300 hover:border-primary-400 hover:text-primary-400 bg-dark-card" icon={<Github size={18} />}>
                  View Source Code
                </Button>
              </a>
            </div>

            <div className="bg-dark-card rounded-xl p-8 border border-dark-border">
               <h2 className="text-2xl font-bold text-white mb-6">Challenge Description</h2>
               <div className="markdown-content">
                  <ReactMarkdown>{template.fullDescription}</ReactMarkdown>
               </div>
               <div className="mt-8 p-4 bg-primary-900/10 border border-primary-600/20 rounded-lg">
                  <p className="text-primary-300 m-0 text-sm">
                  <strong>Goal:</strong> Implement this within 45-60 minutes. Focus on clean code, edge case handling, and performance optimization.
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column: Meta Info Card */}
          <div className="space-y-6">
            <div className="bg-[#1e1e20] rounded-2xl p-6 lg:p-8 border border-white/5 shadow-2xl sticky top-24 ring-1 ring-white/5 relative overflow-hidden">
                
                {/* Subtle top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 opacity-50" />

                <div className="mb-8">
                     <div className="flex items-start justify-between gap-4 mb-6">
                         <Badge variant="green" className="shadow-[0_0_15px_rgba(74,222,128,0.15)] px-3 py-1 text-xs tracking-wider font-bold">
                            {template.category}
                         </Badge>
                         <div className="text-xs text-zinc-500 font-mono pt-1">ID: {template.id.padStart(4, '0')}</div>
                     </div>
                     
                     <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                         {template.name}
                     </h1>
                     
                     <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-700 pl-4 italic">
                         {template.shortDescription}
                     </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors group">
                         <div className="flex items-center text-zinc-500 text-[10px] uppercase tracking-wider font-bold mb-1">
                            <User size={12} className="mr-1.5 group-hover:text-white transition-colors" />
                            Source
                         </div>
                         <div className="text-zinc-200 text-sm font-semibold truncate" title={template.author}>{template.author}</div>
                    </div>
                     <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors group">
                         <div className="flex items-center text-zinc-500 text-[10px] uppercase tracking-wider font-bold mb-1">
                            <Calendar size={12} className="mr-1.5 group-hover:text-white transition-colors" />
                            Added
                         </div>
                         <div className="text-zinc-200 text-sm font-semibold">{template.createdAt}</div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Skills */}
                    <div>
                         <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                                <BrainCircuit size={14} />
                            </div>
                            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Required Skills</h3>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {template.techStack.map(tech => (
                                <span key={tech} className="px-2.5 py-1 bg-[#121212] text-zinc-300 rounded-md text-xs font-medium border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all shadow-sm">
                                    {tech}
                                </span>
                            ))}
                         </div>
                    </div>

                    {/* Tags */}
                    <div>
                         <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 rounded bg-purple-500/10 text-purple-400">
                                <Code2 size={14} />
                            </div>
                            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Topic Tags</h3>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {template.tags.filter(tag => !['Easy', 'Medium', 'Hard'].includes(tag)).map(tag => (
                                <span key={tag} className="text-xs text-zinc-500 hover:text-primary-400 transition-colors cursor-pointer select-none">
                                    #{tag}
                                </span>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Pro Tip Card */}
                 <div className="mt-8 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                    <div className="relative bg-gradient-to-br from-amber-950/30 to-black border border-amber-900/50 rounded-xl p-5 shadow-lg">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                                <Zap size={16} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="text-amber-200 font-bold text-sm mb-1">Pro Tip</h4>
                                <p className="text-xs text-amber-100/60 leading-relaxed">
                                    Try solving this without looking at the solution code first. Focus on building production-quality code.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};