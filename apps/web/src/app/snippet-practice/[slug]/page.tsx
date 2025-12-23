/* eslint-disable react-hooks/immutability */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Play, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Button } from '@repo/ui';
import { Snippet, Template, ButtonSize, ButtonVariant } from '@/types/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import PageLoader from '@/components/PageLoader';
import { BackButton } from '@/components/design-detail/BackButton';
import { validateCode, sanitizeError } from '@/lib/code-execution';
import { checkRateLimit } from '@/lib/rate-limiter';
import { showToast } from '@/lib/toast';

export default function SnippetPracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const { templates } = useApp();
  const router = useRouter();
  const template = templates.find(t => t.slug === slug) as Template;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [output, setOutput] = useState<Record<string, string>>({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  const totalQuestions = template?.snippets?.length ?? 0;
  const attemptedCount = Object.keys(answers).length;

  const computeScore = () => {
    if (!template?.snippets) {
      return {
        correct: 0,
        total: 0,
        percent: 0,
        bandTitle: '',
        bandMessage: '',
      };
    }

    const total = template.snippets.length;
    const correct = template.snippets.reduce((acc, snippet) => {
      return acc + (answers[snippet.id] === snippet.correctAnswer ? 1 : 0);
    }, 0);

    const percent = total ? Math.round((correct / total) * 100) : 0;

    let bandTitle = '';
    let bandMessage = '';

    if (percent === 100) {
      bandTitle = 'Perfect score! 🧠';
      bandMessage =
        'You nailed every single question. Your understanding of these JavaScript patterns is rock solid.';
    } else if (percent >= 80) {
      bandTitle = 'Great job! 🚀';
      bandMessage =
        'You have a strong grasp of the concepts. Revisit the missed questions to make your understanding bulletproof.';
    } else if (percent >= 50) {
      bandTitle = 'Good progress 💡';
      bandMessage =
        'You’re getting there. Spend a bit more time with the explanations and try the tricky ones again.';
    } else {
      bandTitle = 'Nice start 👶';
      bandMessage =
        'Everyone starts somewhere. Use the explanations as a mini-lesson and re-attempt the questions after a short break.';
    }

    return { correct, total, percent, bandTitle, bandMessage };
  };

  useEffect(() => {
    if (!template?.snippets?.length) return;

    const total = template.snippets.length;
    const attempted = Object.keys(answers).length;

    if (total > 0 && attempted === total && !hasCompletedQuiz) {
      setHasCompletedQuiz(true);
      setShowResultModal(true);
    }
  }, [answers, template, hasCompletedQuiz]);

  if (!templates.length) {
    return (
      <PageLoader
        title="Loading snippets"
        subtitle="Fetching the snippet practice set..."
      />
    );
  }

  if (!template || !template.snippets) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-white">
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
    "url": `https://frontenddummies.com/snippet-practice/${template.slug}`,
    "inLanguage": "en-US",
    "interactivityType": "active"
  };

  const handleRunSnippet = (id: string, code: string) => {
    // Check rate limit
    const rateLimit = checkRateLimit('snippet-practice');
    if (!rateLimit.allowed) {
      const errorMsg = `Rate limit exceeded. Please wait ${rateLimit.retryAfter} seconds before running code again.`;
      queueMicrotask(() => {
        setTimeout(() => {
          setOutput(prev => ({
            ...prev,
            [id]: errorMsg
          }));
        }, 150);
      });
      showToast.error(errorMsg);
      return;
    }

    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;

    // Validate code before execution
    const validation = validateCode(code);
    if (!validation.isValid) {
      const errorMsg = validation.error || 'Code validation failed';
      queueMicrotask(() => {
        setTimeout(() => {
          setOutput(prev => ({ ...prev, [id]: `Error: ${errorMsg}` }));
        }, 150);
      });
      showToast.error(errorMsg);
      return;
    }

    const customLog = (...args: unknown[]) => logs.push(args.map(a => String(a)).join(' '));
    const customError = (...args: unknown[]) => logs.push(`Error: ${args.map(a => String(a)).join(' ')}`);

    console.log = customLog;
    console.error = customError;

    try {
      const fn = new Function(code);
      fn();
    } catch (e: unknown) {
      const errorMsg = sanitizeError(e);
      logs.push(errorMsg);
      showToast.error(`Runtime error: ${errorMsg}`);
    }

    queueMicrotask(() => {
      setTimeout(() => {
        console.log = originalLog;
        console.error = originalError;

        const output = logs.join('\n') || 'No output';
        setOutput(prev => ({ ...prev, [id]: output }));

        // Show success toast if no errors
        if (!logs.some(log => log.includes('Error:'))) {
          showToast.success('Snippet executed successfully');
        }
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
        <nav className="sticky w-full sm:w-[80%] mx-auto top-0 z-30 h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-bg/95 to-dark-bg/80 backdrop-blur-lg border-b border-dark-border/60">
          <div className="flex-shrink-0">
            <BackButton href={`/design/${slug}`} />
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm md:text-base lg:text-lg font-bold truncate text-white max-w-[calc(100%-140px)] sm:max-w-[50%] text-center px-2">
            {template.name}
          </h1>
          {/* Empty div to balance the layout */}
          <div className="flex-shrink-0 w-[60px] sm:w-[70px]" />
        </nav>

        {/* Fixed Circular Question Counter - bottom right */}
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
          <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#020617]/95 border border-primary-500/50 shadow-[0_0_25px_rgba(34,197,94,0.35)]">
            <div className="absolute -inset-px rounded-full bg-gradient-to-tr from-primary-500/40 via-emerald-400/25 to-teal-500/40 opacity-40 blur-md pointer-events-none" />
            <div className="relative flex flex-col items-center justify-center leading-tight">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-50 tabular-nums">
                {attemptedCount}
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-500 tabular-nums">
                / {totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

          {template.snippets?.map((snippet: Snippet, index: number) => {
            const userAns = answers[snippet.id];
            const isAnswered = userAns !== undefined;
            const isCorrect = userAns === snippet.correctAnswer;
            const currentOutput = output[snippet.id];

            return (
              <div key={snippet.id} className="bg-[#262626] rounded-xl border border-[#333] shadow-lg overflow-hidden animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="bg-[#333]/30 px-6 py-4 border-b border-[#3e3e3e] flex justify-between items-center">
                  <h3 className="font-bold text-lg text-white">
                    <span className="text-primary-400 mr-2">#{index + 1}</span>
                    {snippet.title}
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  <div className="relative group">
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size={ButtonSize.SM}
                        variant={ButtonVariant.SECONDARY}
                        onClick={() => handleRunSnippet(snippet.id, snippet.code)}
                        className="bg-[#333] shadow-sm text-xs h-8"
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

                  {currentOutput !== undefined && (
                    <div className="bg-black/90 rounded-lg p-4 font-mono text-xs text-green-400 border-l-4 border-green-500 shadow-inner">
                      <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Console Output</div>
                      <pre className="whitespace-pre-wrap">{currentOutput}</pre>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[#9ca3af]">What will be the output?</p>
                    <div className="grid grid-cols-1 gap-3">
                      {snippet.options?.map((option, optIdx) => {
                        let stateClass = "border-[#3e3e3e] hover:border-primary-400 bg-[#262626] text-white";

                        if (isAnswered) {
                          if (optIdx === snippet.correctAnswer) {
                            stateClass = "border-green-500 bg-green-900/20 text-green-300 ring-1 ring-green-500";
                          } else if (optIdx === userAns) {
                            stateClass = "border-red-500 bg-red-900/20 text-red-300 ring-1 ring-red-500";
                          } else {
                            stateClass = "opacity-50 border-[#3e3e3e] text-white";
                          }
                        }

                        return (
                          <Button
                            key={optIdx}
                            onClick={() => !isAnswered && handleSelectOption(snippet.id, optIdx)}
                            disabled={isAnswered}
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.MD}
                            className={`relative w-full px-4 py-3 rounded-lg text-left text-sm font-medium border transition-all duration-200 items-start whitespace-normal h-auto min-h-10 ${stateClass}`}
                          >
                            <div className="flex items-start justify-between w-full gap-3">
                              <span className="break-words whitespace-normal leading-snug text-sm">
                                {option}
                              </span>
                              {isAnswered && optIdx === snippet.correctAnswer && (
                                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                              )}
                              {isAnswered && optIdx === userAns && optIdx !== snippet.correctAnswer && (
                                <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {isAnswered && (
                    <div className="animate-fadeIn pt-2">
                      <div className={`rounded-lg p-4 border ${isCorrect ? 'bg-green-900/10 border-green-900/30' : 'bg-amber-900/10 border-amber-900/30'}`}>
                        <div className="flex items-start gap-3">
                          <Info size={18} className={`mt-0.5 shrink-0 ${isCorrect ? 'text-green-400' : 'text-amber-400'}`} />
                          <div>
                            <h4 className={`text-sm font-bold mb-1 ${isCorrect ? 'text-green-300' : 'text-amber-300'}`}>
                              {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h4>
                            <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-200' : 'text-amber-200'}`}>
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
            <Button size={ButtonSize.LG} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to Top
            </Button>
          </div>

        </div>

        {showResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl">
              {(() => {
                const { correct, total, percent, bandTitle, bandMessage } = computeScore();
                return (
                  <>
                    <h2 className="text-xl font-bold text-white mb-2">Your Score</h2>
                    <p className="text-sm text-zinc-400 mb-4">{bandTitle}</p>

                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-4xl font-extrabold text-primary-400">
                        {percent}
                        <span className="text-2xl align-top ml-1">%</span>
                      </span>
                      <span className="text-sm text-zinc-400">
                        {correct} of {total} questions correct
                      </span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                      {bandMessage}
                    </p>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant={ButtonVariant.SECONDARY}
                        size={ButtonSize.SM}
                        onClick={() => {
                          setShowResultModal(false);
                          setAnswers({});
                          setOutput({});
                          setHasCompletedQuiz(false);
                          if (typeof window !== 'undefined') {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                      >
                        Close & Reset
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
