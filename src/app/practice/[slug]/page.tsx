'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  ChevronLeft, 
  Code2, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

// Simple types for console output
interface LogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: string;
}

export default function PracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const { templates, isDarkMode } = useApp();
  const router = useRouter();
  const template = templates.find(t => t.slug === slug);

  // Editor State
  const [code, setCode] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'editorial'>('description');
  
  // Resizable Layout State
  const [leftWidth, setLeftWidth] = useState(50); // Percentage
  const [consoleHeight, setConsoleHeight] = useState(35); // Percentage
  const [isDraggingH, setIsDraggingH] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  
  // Console Capture Refs
  const originalConsoleRef = useRef({ log: console.log, error: console.error });
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Code
  useEffect(() => {
    if (template?.starterCode) {
      setCode(template.starterCode);
    }
  }, [template]);

  // Cleanup console override on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      console.log = originalConsoleRef.current.log;
      // eslint-disable-next-line react-hooks/exhaustive-deps
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


  if (!template) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-slate-900 dark:text-white transition-colors duration-300">
             <h2 className="text-xl mb-4">Template not found</h2>
             <button onClick={() => router.push('/')} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Go Home</button>
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
    "url": `https://frontenddummies.vercel.app/practice/${template.slug}`
  };

  const handleRunCode = async () => {
    // If we are already running or just finished, clear any pending restoration timer
    if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
    }
    
    setIsRunning(true);
    setLogs([]);

    // Proxy function to capture logs
    const proxyLog = (type: 'log' | 'error', args: any[]) => {
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
      
      // Update state immediately so async logs appear as they happen
      setLogs(prev => [...prev, newEntry]);
      
      // Pass through to actual console for debugging
      originalConsoleRef.current[type](...args);
    };

    // Override console
    console.log = (...args) => proxyLog('log', args);
    console.error = (...args) => proxyLog('error', args);

    try {
      // Small delay to allow React to render loading state
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Execute the code
      // eslint-disable-next-line no-new-func
      const func = new Function(code);
      func();
      
    } catch (err: any) {
      setLogs(prev => [...prev, {
        type: 'error',
        content: err.toString(),
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRunning(false);
      if (consoleHeight < 20) setConsoleHeight(35);
      
      // Wait 5 seconds before restoring console to catch async logs (setTimeout, Promises)
      cleanupTimerRef.current = setTimeout(() => {
          console.log = originalConsoleRef.current.log;
          console.error = originalConsoleRef.current.error;
      }, 5000);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-[#eff1f6] font-sans transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <nav className="h-12 bg-white dark:bg-[#262626] border-b border-slate-200 dark:border-[#333] flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex items-center gap-4">
            <button onClick={() => {
              if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
                router.back();
              } else {
                router.push(`/design/${slug}`);
              }
            }} className="text-slate-500 dark:text-[#9ca3af] hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                <ChevronLeft size={16} />
                Back
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-[#444]"></div>
            <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-slate-800 dark:text-white">{template.name}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setCode(template.starterCode || '')}
                className="p-1.5 text-slate-500 dark:text-[#9ca3af] hover:bg-slate-100 dark:hover:bg-[#3e3e3e] rounded-md transition-colors"
                title="Reset Code"
             >
                <RotateCcw size={15} />
             </button>
             
             <button 
                onClick={handleRunCode} 
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isRunning ? 'bg-slate-200 dark:bg-[#3e3e3e] text-slate-500 dark:text-[#9ca3af] cursor-not-allowed' : 'bg-green-600/90 hover:bg-green-600 text-white shadow-lg shadow-green-900/20'
                }`}
             >
                {isRunning ? (
                    <span className="animate-pulse">Running...</span>
                ) : (
                    <>
                        <Play size={14} fill="currentColor" />
                        Run
                    </>
                )}
             </button>
        </div>
      </nav>

      {/* Workspace Split Layout */}
      <div 
        ref={containerRef}
        className="flex-1 flex min-h-0 p-2 overflow-hidden bg-slate-100 dark:bg-[#1a1a1a]"
      >
        
        {/* LEFT PANEL: Description */}
        <div 
            className="flex flex-col bg-white dark:bg-[#262626] rounded-lg overflow-hidden border border-slate-200 dark:border-[#333] min-w-[200px]"
            style={{ width: `${leftWidth}%` }}
        >
            {/* Tabs */}
            <div className="h-10 bg-slate-50 dark:bg-[#333]/30 border-b border-slate-200 dark:border-[#3e3e3e] flex items-center gap-1 px-2 shrink-0">
                <button 
                    onClick={() => setActiveTab('description')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
                        activeTab === 'description' 
                        ? 'bg-white dark:bg-[#262626] text-slate-900 dark:text-white border-t border-x border-slate-200 dark:border-[#3e3e3e] relative -bottom-[1px]' 
                        : 'text-slate-500 dark:text-[#9ca3af] hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <FileText size={13} className="text-blue-500" />
                    Description
                </button>
                <button 
                    onClick={() => setActiveTab('editorial')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
                        activeTab === 'editorial' 
                        ? 'bg-white dark:bg-[#262626] text-slate-900 dark:text-white border-t border-x border-slate-200 dark:border-[#3e3e3e] relative -bottom-[1px]' 
                        : 'text-slate-500 dark:text-[#9ca3af] hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Code2 size={13} className="text-orange-500" />
                    Editorial
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                {activeTab === 'description' ? (
                    <div className="animate-fadeIn">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{template.name}</h1>
                        <div className="flex gap-2 mb-6">
                            {template.tags.filter(tag => !['Easy', 'Medium', 'Hard'].includes(tag)).map(tag => (
                                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#3e3e3e] text-xs font-medium text-slate-600 dark:text-[#9ca3af] border border-slate-200 dark:border-[#4a4a4a]">{tag}</span>
                            ))}
                        </div>
                        
                        <div className="markdown-content">
                             {/* Manually styled simple content or could re-use ReactMarkdown if imported */}
                             <div className="prose prose-sm max-w-none text-slate-700 dark:text-[#eff1f6] leading-relaxed whitespace-pre-wrap font-sans">
                                {template.fullDescription}
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-[#9ca3af] p-8 text-center">
                        <div className="bg-slate-100 dark:bg-[#333] p-4 rounded-full mb-4">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-medium mb-2">Editorial Locked</h3>
                        <p className="text-sm">Solve the problem to unlock the official editorial and optimization tips.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Vertical Resizer */}
        <div 
            className={`resizer-v flex items-center justify-center hover:bg-primary-500/50 ${isDraggingH ? 'active bg-primary-600' : ''}`}
            onMouseDown={handleMouseDownH}
        >
            <div className="w-[2px] h-8 bg-slate-300 dark:bg-zinc-600 rounded-full"></div>
        </div>

        {/* RIGHT PANEL: Editor & Console */}
        <div 
            ref={rightPanelRef}
            className="flex flex-col min-w-[200px]"
            style={{ width: `calc(${100 - leftWidth}% - 4px)` }}
        >
            
            {/* Editor Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#262626] rounded-t-lg overflow-hidden border border-slate-200 dark:border-[#333]">
                {/* Editor Tabs */}
                <div className="h-10 bg-slate-50 dark:bg-[#333]/30 border-b border-slate-200 dark:border-[#3e3e3e] flex items-center justify-between px-2 shrink-0">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-[#1e1e1e] text-slate-900 dark:text-white border-t border-x border-slate-200 dark:border-[#3e3e3e] rounded-t-md relative -bottom-[1px]">
                            <span className="text-green-600 dark:text-green-500 text-[10px]">{`</>`}</span>
                            JavaScript
                        </div>
                    </div>
                </div>

                {/* Code Editor Container */}
                <div className="flex-1 relative bg-white dark:bg-[#1e1e1e] overflow-hidden">
                    <Editor
                        height="100%"
                        theme={isDarkMode ? "vs-dark" : "light"}
                        defaultLanguage="javascript"
                        language="javascript"
                        value={code}
                        onChange={(value) => setCode(value || '')}
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

            {/* Horizontal Resizer */}
            <div 
                className={`resizer-h w-full flex items-center justify-center hover:bg-primary-500/50 ${isDraggingV ? 'active bg-primary-600' : ''}`}
                onMouseDown={handleMouseDownV}
            >
                <div className="h-[2px] w-8 bg-slate-300 dark:bg-zinc-600 rounded-full"></div>
            </div>

            {/* Console Area */}
            <div 
                className="flex flex-col bg-white dark:bg-[#262626] rounded-b-lg overflow-hidden border border-slate-200 dark:border-[#333]"
                style={{ height: `${consoleHeight}%` }}
            >
                <div className="h-9 bg-slate-50 dark:bg-[#333]/30 border-b border-slate-200 dark:border-[#3e3e3e] flex items-center px-4 justify-between shrink-0">
                     <div className="flex items-center gap-2 text-slate-500 dark:text-[#9ca3af] text-xs font-medium">
                        <Terminal size={14} />
                        Test Result
                     </div>
                     {logs.length > 0 && (
                        <button onClick={() => setLogs([])} className="text-xs text-slate-500 hover:text-slate-900 dark:text-[#9ca3af] dark:hover:text-white transition-colors">
                            Clear
                        </button>
                     )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-white dark:bg-[#262626]">
                    {logs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-[#555]">
                            <div className="mb-2 opacity-50">Run code to see output</div>
                        </div>
                    ) : (
                        <div className="space-y-2 pb-4">
                            {(() => {
                                // Find if any error logs exist
                                const hasError = logs.some(log => log.type === 'error');
                                // Find the first error index, if any
                                const firstErrorIdx = logs.findIndex(log => log.type === 'error');
                                // Determine heading properties
                                const heading = hasError ? 'Runtime Error' : 'Standard Output';
                                const icon = hasError ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />;
                                const textColor = hasError ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-[#9ca3af]';
                                // Use earliest error timestamp, otherwise last log timestamp
                                const timestamp =
                                    hasError
                                        ? logs[firstErrorIdx].timestamp
                                        : logs.length > 0
                                            ? logs[logs.length - 1].timestamp
                                            : '';

                                // Choose box styles
                                const boxClasses = hasError
                                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-300'
                                    : 'bg-slate-100 dark:bg-[#333]/50 border-slate-200 dark:border-[#3e3e3e] text-slate-800 dark:text-[#eff1f6]';

                                // Join log outputs with newlines
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