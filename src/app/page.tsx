'use client';

import { TemplateCard } from '@/components/TemplateCard';
import { Sparkles, ArrowRight, Code2, Globe, Cpu, Github } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { ButtonSize, ButtonVariant } from '@/types/types';

export default function Home() {
  const { templates } = useApp();

  const featuredTemplates = templates.slice(0, 4);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Frontend For Dummies",
    "description": "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects.",
    "url": "https://www.frontenddummies.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.frontenddummies.com/explore?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Frontend For Dummies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.frontenddummies.com/og-image.png"
      }
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Frontend For Dummies",
    "url": "https://www.frontenddummies.com/",
    "logo": "https://www.frontenddummies.com/og-image.png",
    "sameAs": [
      "https://github.com/pratikkumar399/frontendfordummies"
    ],
    "description": "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <div className="min-h-screen bg-dark-bg selection:bg-primary-500/30 relative">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,98,57,0.15),rgba(255,255,255,0))]"></div>
         
         <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/20 blur-[120px] rounded-[100%] opacity-40"></div>
      </div>

      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary-300 text-sm font-medium mb-8 animate-fadeIn hover:bg-white/10 transition-colors cursor-default shadow-lg shadow-black/20">
            <Sparkles size={14} className="text-primary-400" />
            <span>The ultimate frontend skills platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Master Frontend <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-emerald-400 to-teal-500">Development Skills</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Build real-world projects and master core concepts with our curated collection of coding challenges, system design architectures, and practice tasks.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-28">
            <LinkButton 
              href="/explore"
              size={ButtonSize.LG} 
              className="h-14 px-8 text-lg font-semibold shadow-[0_0_50px_rgba(34,197,94,0.25)] hover:shadow-[0_0_80px_rgba(34,197,94,0.4)] border border-primary-500/50 hover:scale-105 transition-transform duration-300"
            >
                Start Learning
                <ArrowRight size={20} className="ml-2" />
            </LinkButton>
            {/* <LinkButton 
              href="https://github.com/pratikkumar399/frontendfordummies"
              variant={ButtonVariant.SECONDARY} 
              size={ButtonSize.LG} 
              className="h-14 px-8 text-lg bg-zinc-900/50 backdrop-blur-sm border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 hover:scale-105 transition-all duration-300"
              icon={<Github size={20} />}
            >
                Star on GitHub <ArrowRight size={20} className="ml-2" />
            </LinkButton> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left">
             <div className="group relative p-8 rounded-3xl bg-[#18181b]/60 border border-white/5 backdrop-blur-md overflow-hidden hover:bg-[#18181b]/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full group-hover:bg-primary-500/20 transition-all duration-500 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-emerald-500/20 flex items-center justify-center text-primary-400 mb-6 border border-primary-500/20 shadow-lg shadow-primary-500/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <Code2 size={28} />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">Coding Challenges</h3>
                   <p className="text-zinc-400 leading-relaxed font-light">
                      Interactive editor with real-world problems. Master DOM manipulation, algorithms, and React patterns.
                   </p>
                </div>
             </div>

             <div className="group relative p-8 rounded-3xl bg-[#18181b]/60 border border-white/5 backdrop-blur-md overflow-hidden hover:bg-[#18181b]/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <Globe size={28} />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">System Design</h3>
                   <p className="text-zinc-400 leading-relaxed font-light">
                      Deep dive into frontend architecture. Learn to build scalable News Feeds, Chat Apps, and E-commerce platforms.
                   </p>
                </div>
             </div>

             <div className="group relative p-8 rounded-3xl bg-[#18181b]/60 border border-white/5 backdrop-blur-md overflow-hidden hover:bg-[#18181b]/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-all duration-500 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20 shadow-lg shadow-purple-500/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <Cpu size={28} />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Project Portfolio</h3>
                   <p className="text-zinc-400 leading-relaxed font-light">
                      End-to-end project briefs. Build complete applications with realistic requirements to boost your portfolio.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0f0f10] border-t border-dark-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Featured Challenges</h2>
                    <p className="text-zinc-500">Popular skills mastered by the community</p>
                </div>
                <LinkButton 
                  href="/explore"
                  variant={ButtonVariant.GHOST} 
                  className="text-primary-400 hover:text-primary-300 hover:bg-primary-900/10"
                >
                        View All Challenges <ArrowRight size={16} className="ml-2" />
                </LinkButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                ))}
            </div>
        </div>
      </section>
    </div>
    </>
  );
}
