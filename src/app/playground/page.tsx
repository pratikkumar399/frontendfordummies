'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import Editor from '@monaco-editor/react';
import { LogType, LogEntry, ButtonVariant, ButtonSize } from '@/types/types';
import { Button, LinkButton } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
  Code2,
  Home
} from 'lucide-react';

const DEFAULT_CODE = `// Welcome to JS Playground!
// Write your JavaScript code here and click Run to execute.

console.log('Hello, World!');
console.error('This is an error message');
console.warn('This is a warning message');
`;

export default function PlaygroundPage() {
  const { isDarkMode } = useApp();
  
  // Editor State
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Resizable Layout State
  const [editorWidth, setEditorWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const originalConsoleRef = useRef({ log: console.log, error: console.error, warn: console.warn, info: console.info });
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup console override on unmount
  useEffect(() => {
    return () => {
      console.log = originalConsoleRef.current.log;
      console.error = originalConsoleRef.current.error;
      console.warn = originalConsoleRef.current.warn;
      console.info = originalConsoleRef.current.info;
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  // Horizontal Drag Handler
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setEditorWidth(Math.min(Math.max(newWidth, 30), 80));
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleRunCode = async () => {
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
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
          } catch {
            return String(arg);
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
      
      // Also log to original console
      switch (type) {
        case LogType.ERROR:
          originalConsoleRef.current?.error(...args);
          break;
        case LogType.WARN:
          originalConsoleRef.current.warn(...args);
          break;
        case LogType.INFO:
          originalConsoleRef.current.info(...args);
          break;
        default:
          originalConsoleRef.current.log(...args);
      }
    };

    // Override console methods
    console.log = (...args) => proxyLog(LogType.LOG, args);
    console.error = (...args) => proxyLog(LogType.ERROR, args);
    console.warn = (...args) => proxyLog(LogType.WARN, args);
    console.info = (...args) => proxyLog(LogType.INFO, args);

    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Wrap in async IIFE to support top-level await and guard closing braces from trailing single-line comments
      const asyncCode = `(async () => {\n${code}\n})()`;
      const func = new Function(asyncCode);
      await func();
      
    } catch (err: unknown) {
      setLogs(prev => [...prev, {
        type: LogType.ERROR,
        content: err instanceof Error ? err.toString() : String(err),
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRunning(false);
      
      cleanupTimerRef.current = setTimeout(() => {
        console.log = originalConsoleRef.current.log;
        console.error = originalConsoleRef.current.error;
        console.warn = originalConsoleRef.current.warn;
        console.info = originalConsoleRef.current.info;
      }, 5000);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setLogs([]);
  };

  const handleClearConsole = () => {
    setLogs([]);
  };

  const getLogIcon = (type: LogType) => {
    switch (type) {
      case LogType.ERROR:
        return <AlertCircle size={12} className="text-red-400" />;
      case LogType.WARN:
        return <AlertCircle size={12} className="text-yellow-400" />;
      case LogType.INFO:
        return <CheckCircle2 size={12} className="text-blue-400" />;
      default:
        return <CheckCircle2 size={12} className="text-[#9ca3af]" />;
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a] text-[#eff1f6] font-sans">
      
      <nav className="h-16 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 select-none">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-900/20">
              <Code2 size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white font-sans group-hover:text-primary-400 transition-colors">
              Frontend<span className="text-primary-400">Dummies</span>
            </span>
          </Link>
          
          <div className="hidden sm:flex items-center gap-2 text-[#9ca3af]">
            <span className="text-[#444]">/</span>
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-primary-400" />
              <span className="font-medium text-white">JS Playground</span>
            </div>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <LinkButton 
            href="/"
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            icon={<Home size={14} />}
          >
            Home
          </LinkButton>
          
          <Button 
            onClick={handleReset}
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            icon={<RotateCcw size={14} />}
            title="Reset to default code"
          >
            Reset
          </Button>
          
          <Button 
            onClick={handleRunCode} 
            disabled={isRunning}
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.SM}
            icon={!isRunning ? <Play size={14} fill="currentColor" /> : undefined}
            className="bg-green-600/90 hover:bg-green-600 shadow-lg shadow-green-900/20"
          >
            {isRunning ? (
              <span className="animate-pulse">Running...</span>
            ) : (
              'Run Code'
            )}
          </Button>
        </div>
      </nav>


      <div 
        ref={containerRef}
        className="flex-1 flex min-h-0 p-3 overflow-hidden bg-[#1a1a1a]"
      >
        
        {/* LEFT PANEL: Code Editor */}
        <div 
          className="flex flex-col bg-[#262626] rounded-2xl overflow-hidden border border-[#333] min-w-[300px]"
          style={{ width: `${editorWidth}%` }}
        >
          <div className="h-10 bg-[#333]/30 border-b border-[#3e3e3e] flex items-center justify-between px-4 shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <span className="text-green-500 text-[10px]">{`</>`}</span>
              JavaScript
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27ca40]"></div>
            </div>
          </div>

          <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
            <Editor
              height="100%"
              theme={isDarkMode ? "vs-dark" : "vs-dark"}
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
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Resizer */}
        <div 
          className={`resizer-v flex items-center justify-center hover:bg-primary-500/50 rounded-[6px] ${isDragging ? 'active bg-primary-600' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="w-[2px] h-8 bg-zinc-600 rounded-full"></div>
        </div>

        {/* RIGHT PANEL: Console */}
        <div 
          className="flex flex-col bg-[#262626] rounded-2xl overflow-hidden border border-[#333] min-w-[250px]"
          style={{ width: `calc(${100 - editorWidth}% - 4px)` }}
        >
          <div className="h-10 bg-[#333]/30 border-b border-[#3e3e3e] flex items-center px-4 justify-between shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-2 text-[#9ca3af] text-xs font-medium">
              <Terminal size={14} />
              Console
            </div>
            {logs.length > 0 && (
              <button 
                onClick={handleClearConsole} 
                className="flex cursor-pointer items-center gap-1 text-xs text-[#9ca3af] hover:text-white transition-colors"
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-[#262626]">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#555]">
                <Terminal size={32} className="mb-3 opacity-30" />
                <div className="text-sm opacity-70">Run code to see output</div>
                <div className="text-xs mt-1 opacity-50">Press Run Code or Ctrl+Enter</div>
              </div>
            ) : (
              <div className="bg-[#1e1e1e] rounded-[12px] border border-[#333] overflow-hidden">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2 px-4 py-2 text-sm ${
                      index !== logs.length - 1 ? 'border-b border-[#333]' : ''
                    } ${log.type === LogType.ERROR ? 'text-red-400 bg-red-900/5' : log.type === LogType.WARN ? 'text-yellow-400 bg-yellow-900/5' : 'text-[#eff1f6]'}`}
                  >
                    <div className="mt-0.5 shrink-0 opacity-60">
                      {getLogIcon(log.type)}
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs flex-1 overflow-x-auto">{log.content}</pre>
                    <span className="text-[10px] opacity-40 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

