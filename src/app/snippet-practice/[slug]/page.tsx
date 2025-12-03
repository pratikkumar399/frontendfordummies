/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';    
import { useApp } from '@/context/AppContext';
import { ChevronLeft, Play, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Snippet, Template } from '@/types/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function SnippetPracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const { templates } = useApp();
  const router = useRouter();
  const template = templates.find(t => t.slug === slug) as Template;

  // State
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [output, setOutput] = useState<Record<string, string>>({});

  if (!template || !template.snippets) {
     return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-slate-900 dark:text-white">
             <h2 className="text-xl mb-4">Snippet Collection not found</h2>
             <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
    );
  }

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": template.name,
    "description": template.shortDescription,
    "educationalLevel": template.tags.find(t => ['Easy', 'Medium', 'Hard'].includes(t)) || 'Intermediate',
    "teaches": template.techStack,
    "author": {
      "@type": "Person",
      "name": template.author
    },
    "datePublished": template.createdAt,
    "numberOfQuestions": template.snippets?.length || 0,
    "url": `https://frontendfordummies-tonv.vercel.app//snippet-practice/${template.slug}`,
    "inLanguage": "en-US",
    "interactivityType": "active"
  };

  const handleRunSnippet = (id: string, code: string) => {
    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;

    const customLog = (...args: unknown[]) => logs.push(args.map(a => String(a)).join(' '));
    const customError = (...args: unknown[]) => logs.push(`Error: ${args.map(a => String(a)).join(' ')}`);

    console.log = customLog;
    console.error = customError;

    try {
        // Try to create the function first (catches SyntaxErrors)
        const fn = new Function(code);
        fn();
    } catch (e: unknown) {
        if (e instanceof SyntaxError) {
            logs.push(`SyntaxError: ${e.message}`);
        } else if (e instanceof ReferenceError) {
            logs.push(`ReferenceError: ${e.message}`);
        } else if (e instanceof TypeError) {
            logs.push(`TypeError: ${e.message}`);
        } else {
            logs.push(`Runtime Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    }

    // Wait for microtasks (Promises) and macrotasks (setTimeout with 0-100ms delay)
    // Use queueMicrotask to ensure Promise.then() callbacks are captured
    queueMicrotask(() => {
        // Small delay to also capture short setTimeout callbacks
        setTimeout(() => {
            // Restore console
            console.log = originalLog;
            console.error = originalError;
            
            setOutput(prev => ({ ...prev, [id]: logs.join('\n') || 'No output' }));
        }, 150);
    });
  };

  const handleSelectOption = (snippetId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [snippetId]: optionIndex }));
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-dark-bg pt-16">
      
      {/* Header */}
      <nav className="sticky w-[80%] mx-auto top-0 z-40  h-16 flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <button onClick={() => {
          if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
            router.back();
          } else {
            router.push(`/design/${slug}`);
          }
        }} className="flex items-center gap-2 text-slate-500 dark:text-[#9ca3af] hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span className="font-medium">Back</span>
        </button>
        <div className="h-6 w-[1px] bg-slate-200 dark:bg-[#444] mx-4"></div>
        <h1 className="text-lg font-bold truncate">{template.name}</h1>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {template.snippets?.map((snippet : Snippet, index : number) => {
            const userAns = answers[snippet.id];
            const isAnswered = userAns !== undefined;
            const isCorrect = userAns === snippet.correctAnswer;
            const currentOutput = output[snippet.id];

            return (
                <div key={snippet.id} className="bg-white dark:bg-[#262626] rounded-xl border border-slate-200 dark:border-[#333] shadow-lg overflow-hidden animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    {/* Snippet Header */}
                    <div className="bg-slate-50 dark:bg-[#333]/30 px-6 py-4 border-b border-slate-200 dark:border-[#3e3e3e] flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                            <span className="text-primary-600 dark:text-primary-400 mr-2">#{index + 1}</span> 
                            {snippet.title}
                        </h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Code Block */}
                        <div className="relative group">
                            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    size="sm" 
                                    variant="secondary"
                                    onClick={() => handleRunSnippet(snippet.id, snippet.code)}
                                    className="bg-white dark:bg-[#333] shadow-sm text-xs h-8"
                                >
                                    <Play size={12} className="mr-1.5 text-green-600" fill="currentColor" />
                                    Run Code
                                </Button>
                            </div>
                            <SyntaxHighlighter
                                language="javascript"
                                style={oneDark}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    padding: '1rem',
                                    border: '1px solid #333',
                                }}
                            >
                                {snippet.code}
                            </SyntaxHighlighter>
                        </div>

                        {/* Output Area (Conditional) */}
                        {currentOutput !== undefined && (
                            <div className="bg-black/90 rounded-lg p-4 font-mono text-xs text-green-400 border-l-4 border-green-500 shadow-inner">
                                <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Console Output</div>
                                <pre className="whitespace-pre-wrap">{currentOutput}</pre>
                            </div>
                        )}

                        {/* Options */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-500 dark:text-[#9ca3af]">What will be the output?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {snippet.options?.map((option, optIdx) => {
                                    let stateClass = "border-slate-200 dark:border-[#3e3e3e] hover:border-primary-500 dark:hover:border-primary-400 bg-white dark:bg-[#262626]";
                                    
                                    if (isAnswered) {
                                        if (optIdx === snippet.correctAnswer) {
                                            stateClass = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-1 ring-green-500";
                                        } else if (optIdx === userAns) {
                                            stateClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 ring-1 ring-red-500";
                                        } else {
                                            stateClass = "opacity-50 border-slate-200 dark:border-[#3e3e3e]";
                                        }
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => !isAnswered && handleSelectOption(snippet.id, optIdx)}
                                            disabled={isAnswered}
                                            className={`relative px-4 py-3 rounded-lg text-left text-sm font-medium border transition-all duration-200 ${stateClass}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {isAnswered && optIdx === snippet.correctAnswer && <CheckCircle2 size={16} className="text-green-500" />}
                                                {isAnswered && optIdx === userAns && optIdx !== snippet.correctAnswer && <XCircle size={16} className="text-red-500" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Explanation Area */}
                        {isAnswered && (
                            <div className="animate-fadeIn pt-2">
                                <div className={`rounded-lg p-4 border ${isCorrect ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'}`}>
                                    <div className="flex items-start gap-3">
                                        <Info size={18} className={`mt-0.5 shrink-0 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`} />
                                        <div>
                                            <h4 className={`text-sm font-bold mb-1 ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>
                                                {isCorrect ? 'Correct!' : 'Incorrect'}
                                            </h4>
                                            <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-700 dark:text-green-200' : 'text-amber-700 dark:text-amber-200'}`}>
                                                {snippet.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        })}

        <div className="flex justify-center pt-8">
            <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
                Back to Top
            </Button>
        </div>

      </div>
    </div>
    </>
  );
};
