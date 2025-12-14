'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button, ConfirmDialog } from '@repo/ui';
import { LogType, PracticeTab, LogEntry, ButtonVariant, ButtonSize } from '@/types/types';
import { 
  Play, 
  RotateCcw, 
  RotateCw,
  ChevronLeft, 
  Code2, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import { validateCode, sanitizeError } from '@/lib/code-execution';
import { checkRateLimit } from '@/lib/rate-limiter';
import { showToast } from '@/lib/toast';

export default function PracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const { templates, isDarkMode } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const template = templates.find(t => t.slug === slug);
  const searchParams = useSearchParams();

  // Editor State
  const [code, setCode] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Confirmation dialogs
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const [activeTab, setActiveTab] = useState<PracticeTab>(PracticeTab.DESCRIPTION);



  const updateTabQuery = (tab: PracticeTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`);
    setActiveTab(tab);
  };
  
  // Resizable Layout State
  const [leftWidth, setLeftWidth] = useState(50);
  const [consoleHeight, setConsoleHeight] = useState(35);
  const [isDraggingH, setIsDraggingH] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  
  const originalConsoleRef = useRef({ log: console.log, error: console.error });
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Initialize Code
  useEffect(() => {
    if (template?.starterCode) {
      setCode(template.starterCode);
    }
  }, [template]);

    // Initialize tab from query param and keep it in sync
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === PracticeTab.EDITORIAL) {
      setActiveTab(PracticeTab.EDITORIAL);
    } else {
      setActiveTab(PracticeTab.DESCRIPTION);
    }
  }, [searchParams]);

  // Cleanup console override on unmount
  useEffect(() => {
    return () => {
      console.log = originalConsoleRef.current.log;
      console.error = originalConsoleRef.current.error;
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  // Drag Handlers
  const handleMouseDownH = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingH(true);
  };

  const handleMouseDownV = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingV(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingH && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setLeftWidth(Math.min(Math.max(newLeftWidth, 20), 80));
    }
    
    if (isDraggingV && rightPanelRef.current) {
        const panelRect = rightPanelRef.current.getBoundingClientRect();
        const newHeight = ((panelRect.bottom - e.clientY) / panelRect.height) * 100;
        setConsoleHeight(Math.min(Math.max(newHeight, 10), 80));
    }
  }, [isDraggingH, isDraggingV]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingH(false);
    setIsDraggingV(false);
  }, []);

  useEffect(() => {
    if (isDraggingH || isDraggingV) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.classList.add('select-none');
    } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.classList.remove('select-none');
    }
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.classList.remove('select-none');
    };
  }, [isDraggingH, isDraggingV, handleMouseMove, handleMouseUp]);

  if (!templates.length) {
    return (
      <PageLoader
        title="Loading question..."
        subtitle="Fetching the template..."
      />
    );
  }


  if (!template) {
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-white">
             <h2 className="text-xl mb-4">Template not found</h2>
             <Button onClick={() => router.push('/')} variant={ButtonVariant.PRIMARY} size={ButtonSize.SM}>Go Home</Button>
        </div>
    );
  }

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${template.name} - Interactive Code Editor`,
    "description": template.shortDescription,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "250"
    },
    "author": {
      "@type": "Person",
      "name": template.author
    },
    "url": `https://frontenddummies.com/practice/${template.slug}`
  };

  const handleRunCode = async () => {
    if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
    }
    
    // Check rate limit
    const rateLimit = checkRateLimit('practice');
    if (!rateLimit.allowed) {
      const errorMsg = `Rate limit exceeded. Please wait ${rateLimit.retryAfter} seconds before running code again.`;
      setLogs([{
        type: LogType.ERROR,
        content: errorMsg,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setIsRunning(false);
      if (consoleHeight < 20) setConsoleHeight(35);
      showToast.error(errorMsg);
      return;
    }
    
    setIsRunning(true);
    setLogs([]);

    const proxyLog = (type: LogType, args: unknown[]) => {
       const content = args.map(arg => {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        if (typeof arg === 'object') {
            try {
                return JSON.stringify(arg, null, 2);
            } catch (e) {
                return String(arg); // Fallback for circular refs etc
            }
        }
        return String(arg);
      }).join(' ');

      const newEntry: LogEntry = {
        type,
        content,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setLogs(prev => [...prev, newEntry]);
      
      if (type === LogType.ERROR) {
        originalConsoleRef.current.error(...args);
      } else {
        originalConsoleRef.current.log(...args);
      }
    };

    // Validate code before execution
    const validation = validateCode(code);
    if (!validation.isValid) {
      const errorMsg = validation.error || 'Code validation failed';
      setLogs(prev => [...prev, {
        type: LogType.ERROR,
        content: errorMsg,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setIsRunning(false);
      if (consoleHeight < 20) setConsoleHeight(35);
      showToast.error(errorMsg);
      return;
    }

    // Override console
    console.log = (...args) => proxyLog(LogType.LOG, args);
    console.error = (...args) => proxyLog(LogType.ERROR, args);

    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const func = new Function(code);
      func();
      
      // Show success toast if execution completed without errors
      showToast.success('Code executed successfully');
    } catch (err: unknown) {
      const errorMsg = sanitizeError(err);
      setLogs(prev => [...prev, {
        type: LogType.ERROR,
        content: errorMsg,
        timestamp: new Date().toLocaleTimeString()
      }]);
      showToast.error(`Runtime error: ${errorMsg}`);
    } finally {
      setIsRunning(false);
      if (consoleHeight < 20) setConsoleHeight(35);
      
      cleanupTimerRef.current = setTimeout(() => {
          console.log = originalConsoleRef.current.log;
          console.error = originalConsoleRef.current.error;
      }, 5000);
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Update undo/redo state periodically
    const updateUndoRedoState = () => {
      if (editor && editor.getModel()) {
        // Monaco doesn't expose canUndo/canRedo directly, so we'll enable buttons
        // and let Monaco handle the actual undo/redo state internally
        // For better UX, we'll enable undo if there have been changes
        const model = editor.getModel();
        if (model) {
          // Simple heuristic: enable undo if model has content changes
          // Monaco will handle the actual undo/redo correctly
          setCanUndo(true); // Always enable - Monaco handles state
          setCanRedo(true); // Always enable - Monaco handles state
        }
      }
    };
    
    // Update on content change
    editor.onDidChangeModelContent(() => {
      updateUndoRedoState();
    });
    
    // Initial state
    updateUndoRedoState();
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo', {});
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'redo', {});
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a] text-[#eff1f6] font-sans">
      
      <nav className="h-12 bg-[#262626] border-b border-[#333] flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex items-center gap-4">
            <Button 
              onClick={() => {
                if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
                  router.back();
                } else {
                  router.push(`/design/${slug}`);
                }
              }}
              variant={ButtonVariant.GHOST}
              size={ButtonSize.SM}
              className="text-[#9ca3af] hover:text-white bg-transparent hover:bg-transparent flex items-center gap-2 text-sm font-medium"
              icon={<ChevronLeft size={16} />}
            >
              Back
            </Button> 
            <div className="h-4 w-[1px] bg-[#444]"></div>
            <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-white">{template.name}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
             <Button 
                onClick={() => setShowResetDialog(true)}
                variant={ButtonVariant.GHOST}
                size={ButtonSize.SM}
                className="p-1.5 text-[#9ca3af] hover:bg-[#3e3e3e]"
                title="Reset Code"
                icon={<RotateCcw size={15} />}
             >
                Reset Code
             </Button>
             
             <ConfirmDialog
               isOpen={showResetDialog}
               onClose={() => setShowResetDialog(false)}
               onConfirm={() => {
                 setCode(template.starterCode || '');
                 setShowResetDialog(false);
                 showToast.info('Code reset to starter code');
               }}
               title="Reset Code"
               message="Are you sure you want to reset the code to starter code? This will clear all your current changes."
               confirmText="Reset"
               cancelText="Cancel"
             />
             
             <Button 
                onClick={handleRunCode} 
                disabled={isRunning}
                variant={ButtonVariant.PRIMARY}
                size={ButtonSize.SM}
                icon={!isRunning ? <Play size={14} fill="currentColor" /> : undefined}
                className={isRunning ? 'bg-[#3e3e3e] text-[#9ca3af] cursor-not-allowed' : 'bg-green-600/90 hover:bg-green-600 shadow-lg shadow-green-900/20'}
             >
                {isRunning ? <span className="animate-pulse">Running...</span> : 'Run'}
             </Button>
        </div>
      </nav>

      <div 
        ref={containerRef}
        className="flex-1 flex min-h-0 p-2 overflow-hidden bg-[#1a1a1a]"
      >
        
        {/* LEFT PANEL: Description */}
        <div 
            className="flex flex-col bg-[#262626] rounded-[12px] overflow-hidden border border-[#333] min-w-[200px]"  
            style={{ width: `${leftWidth}%` }}
        >
            <div className="h-10 bg-[#333]/30 border-b border-[#3e3e3e] flex items-center gap-1 px-2 shrink-0">
                <Button 
                    onClick={() => updateTabQuery(PracticeTab.DESCRIPTION)}
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.SM}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
                        activeTab === PracticeTab.DESCRIPTION 
                        ? 'bg-[#262626] text-white border-t border-x border-[#3e3e3e] relative -bottom-[1px]' 
                        : 'text-[#9ca3af] hover:text-white'
                    }`}
                    icon={<FileText size={13} className="text-blue-500" />}
                >
                    Description
                </Button>
                <Button 
                    onClick={() => updateTabQuery(PracticeTab.EDITORIAL)}
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.SM}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
                        activeTab === PracticeTab.EDITORIAL 
                        ? 'bg-[#262626] text-white border-t border-x border-[#3e3e3e] relative -bottom-[1px]' 
                        : 'text-[#9ca3af] hover:text-white'
                    }`}
                    icon={<Code2 size={13} className="text-orange-500" />}
                >
                    Editorial
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                {activeTab === PracticeTab.DESCRIPTION ? (
                    <div className="animate-fadeIn">
                        <h1 className="text-xl font-bold text-white mb-4">{template.name}</h1>
                        <div className="flex gap-2 mb-6">
                            {template.tags.filter(tag => !['Easy', 'Medium', 'Hard'].includes(tag)).map(tag => (
                                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#3e3e3e] text-xs font-medium text-[#9ca3af] border border-[#4a4a4a]">{tag}</span>
                            ))}
                        </div>
                        
                        <div className="markdown-content">
                             <div className="prose prose-sm max-w-none text-[#eff1f6] leading-relaxed whitespace-pre-wrap font-sans">
                                {template.fullDescription}
                             </div>
                        </div>
                    </div>
                ) : template.editorial ? (
                    <div className="animate-fadeIn">
                        <h1 className="text-xl font-bold text-white mb-6">Editorial: {template.name}</h1>
                        <div className="markdown-content prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold text-primary-300 mt-8 mb-4 pb-2 border-b border-[#333]">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-6 mb-3">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-base font-semibold text-white mt-4 mb-2">{children}</h4>,
                                p: ({ children }) => <p className="text-[#abb2bf] leading-relaxed mb-4">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-[#abb2bf]">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-[#abb2bf]">{children}</ol>,
                                li: ({ children }) => <li className="text-[#abb2bf]">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                                em: ({ children }) => <em className="italic text-[#c8ccd4]">{children}</em>,
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-primary-500 pl-4 py-1 my-4 bg-[#2a2a2a] rounded-r-md">
                                    {children}
                                  </blockquote>
                                ),
                                hr: () => <hr className="my-6 border-[#333]" />,
                                a: ({ href, children }) => (
                                  <a href={href} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                  </a>
                                ),
                                code({ className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isInline = !match;
                                  const codeString = String(children).replace(/\n$/, '');
                                  
                                  return !isInline ? (
                                    <EditorialCodeBlock 
                                       language={match[1]} 
                                       value={codeString} 
                                    />
                                  ) : (
                                    <code className="bg-[#3e3e3e] px-1.5 py-0.5 rounded text-primary-300 text-sm font-mono" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {template.editorial}
                            </ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[#9ca3af] p-8 text-center">
                        <div className="bg-[#333] p-4 rounded-full mb-4">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-white font-medium mb-2">Editorial Coming Soon</h3>
                        <p className="text-sm">The editorial for this problem is not yet available. Check back later!</p>
                    </div>
                )}
            </div>
        </div>

        <div 
            className={`resizer-v flex items-center justify-center hover:bg-primary-500/50 ${isDraggingH ? 'active bg-primary-600' : ''}`}
            onMouseDown={handleMouseDownH}
        >
            <div className="w-[2px] h-8 bg-zinc-600 rounded-full"></div>
        </div>

        {/* RIGHT PANEL: Editor & Console */}
        <div 
            ref={rightPanelRef}
            className="flex flex-col min-w-[200px]"
            style={{ width: `calc(${100 - leftWidth}% - 4px)` }}
        >
            
            <div className="flex-1 flex flex-col bg-[#262626] rounded-[12px] overflow-hidden border border-[#333]">
                <div className="h-10 bg-[#333]/30 border-b border-[#3e3e3e] flex items-center justify-between px-2 shrink-0">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[#1e1e1e] text-white border-t border-x border-[#3e3e3e] rounded-t-md relative -bottom-[1px]">
                            <span className="text-green-500 text-[10px]">{`</>`}</span>
                            JavaScript
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                          onClick={handleUndo}
                          variant={ButtonVariant.GHOST}
                          size={ButtonSize.SM}
                          className="p-1.5 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#3e3e3e]"
                          title="Undo (Ctrl+Z)"
                          icon={<RotateCcw size={14} />}
                        >
                          <span className="sr-only">Undo</span>
                        </Button>
                        <Button
                          onClick={handleRedo}
                          variant={ButtonVariant.GHOST}
                          size={ButtonSize.SM}
                          className="p-1.5 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#3e3e3e]"
                          title="Redo (Ctrl+Y)"
                          icon={<RotateCw size={14} />}
                        >
                          <span className="sr-only">Redo</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        defaultLanguage="javascript"
                        language="javascript"
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        onMount={handleEditorMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            readOnly: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            fontFamily: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
                            cursorBlinking: 'smooth',
                            smoothScrolling: true,
                            contextmenu: true,
                        }}
                    />
                </div>
            </div>

            <div 
                className={`resizer-h w-full flex items-center justify-center hover:bg-primary-500/50 ${isDraggingV ? 'active bg-primary-600' : ''}`}
                onMouseDown={handleMouseDownV}
            >
                <div className="h-[2px] w-8 bg-zinc-600 rounded-full"></div>
            </div>

            <div 
                className="flex flex-col bg-[#262626] rounded-b-lg overflow-hidden border border-[#333]"
                style={{ height: `${consoleHeight}%` }}
            >
                <div className="h-9 bg-[#333]/30 border-b border-[#3e3e3e] flex items-center px-4 justify-between shrink-0">
                     <div className="flex items-center gap-2 text-[#9ca3af] text-xs font-medium">
                        <Terminal size={14} />
                        Test Result
                     </div>
                     {logs.length > 0 && (
                        <>
                          <Button 
                            onClick={() => setShowClearDialog(true)} 
                            variant={ButtonVariant.GHOST} 
                            size={ButtonSize.SM} 
                            className="text-xs text-[#9ca3af] hover:text-white bg-transparent hover:bg-transparent px-2 py-1"
                          >
                              Clear
                          </Button>
                          <ConfirmDialog
                            isOpen={showClearDialog}
                            onClose={() => setShowClearDialog(false)}
                            onConfirm={() => {
                              setLogs([]);
                              setShowClearDialog(false);
                              showToast.success('Console cleared');
                            }}
                            title="Clear Console"
                            message="Are you sure you want to clear all console output? This action cannot be undone."
                            confirmText="Clear"
                            cancelText="Cancel"
                          />
                        </>
                     )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-[#262626]">
                    {logs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#555]">
                            <div className="mb-2 opacity-50">Run code to see output</div>
                        </div>
                    ) : (
                        <div className="space-y-2 pb-4">
                            {(() => {
                                const hasError = logs.some(log => log.type === LogType.ERROR);
                                const firstErrorIdx = logs.findIndex(log => log.type === LogType.ERROR);
                                const heading = hasError ? 'Runtime Error' : 'Standard Output';
                                const icon = hasError ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />;
                                const textColor = hasError ? 'text-red-400' : 'text-[#9ca3af]';
                                const timestamp =
                                    hasError
                                        ? logs[firstErrorIdx].timestamp
                                        : logs.length > 0
                                            ? logs[logs.length - 1].timestamp
                                            : '';

                                const boxClasses = hasError
                                    ? 'bg-red-900/10 border-red-900/30 text-red-300'
                                    : 'bg-[#333]/50 border-[#3e3e3e] text-[#eff1f6]';

                                const output = logs.map(log => log.content).join('\n');

                                return (
                                    <div className="animate-fadeIn">
                                        <div className={`flex items-start gap-2 text-xs mb-1 ${textColor}`}>
                                            {icon}
                                            <span>{heading}</span>
                                            <span className="opacity-50 ml-auto">{timestamp}</span>
                                        </div>
                                        <div className={`p-3 rounded-md text-sm border ${boxClasses}`}>
                                            <pre className="whitespace-pre-wrap font-mono text-xs">{output}</pre>
                                        </div>
                                    </div>
                                )
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}

// Code block component for editorial with copy functionality
const EditorialCodeBlock = ({ language, value }: { language: string, value: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    showToast.success('Code copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <Button
        onClick={onCopy}
        variant={ButtonVariant.GHOST}
        size={ButtonSize.SM}
        className="absolute top-2 right-2 p-2 rounded-[6px] bg-zinc-700/50 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
        title="Copy code"
        icon={isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      >
        Copy
      </Button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          padding: '1rem',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};
