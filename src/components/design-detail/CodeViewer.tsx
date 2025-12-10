'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileCode, 
  FileJson, 
  FileType, 
  File, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft,
  Folder,
  FolderOpen,
  Copy,
  Check,
  Menu,
  X
} from 'lucide-react';
import { FileNode } from '@/lib/code-loader';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CodeViewerProps {
  files: FileNode[];
  title: string;
  slug: string;
}

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) return <FileCode size={16} className="text-primary-400" />;
  if (fileName.endsWith('.css')) return <FileType size={16} className="text-blue-300" />;
  if (fileName.endsWith('.json')) return <FileJson size={16} className="text-yellow-400" />;
  return <File size={16} className="text-muted-foreground" />;
};

const FileTreeItem = ({ 
  node, 
  depth = 0, 
  activeFile, 
  onFileClick 
}: { 
  node: FileNode; 
  depth?: number; 
  activeFile: FileNode | null; 
  onFileClick: (file: FileNode) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'directory') {
    return (
      <div>
        <div
          className="flex items-center gap-1.5 py-1 px-2 hover:bg-accent cursor-pointer text-foreground select-none transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {isOpen ? <FolderOpen size={16} className="text-primary-300" /> : <Folder size={16} className="text-primary-300" />}
          <span className="text-sm truncate">{node.name}</span>
        </div>
        {isOpen && (
          <div>
            {node.children?.map((child) => (
              <FileTreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onFileClick={onFileClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1 px-2 cursor-pointer select-none transition-colors",
        activeFile?.path === node.path
          ? "bg-accent text-white"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
      onClick={() => onFileClick(node)}
    >
      {getFileIcon(node.name)}
      <span className="text-sm truncate">{node.name}</span>
    </div>
  );
};

export function CodeViewer({ files, title, slug }: CodeViewerProps) {
  // Flatten files to find the first file to display
  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const [activeFile, setActiveFile] = useState<FileNode | null>(findFirstFile(files));
  const [copied, setCopied] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= 160 && newWidth <= 600) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const handleCopy = async () => {
    if (activeFile?.content) {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!files.length) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground bg-[#1e1e1e]">
        No code files found for this demo.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border h-12 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={18} />
          </button>
           <Link 
            href={`/design/${slug}/demo`} 
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Back to Demo"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="text-sm font-medium text-foreground">
            {title} - Source Code
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative" onMouseUp={stopResizing}>
        {/* Mobile Overlay Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - File Explorer */}
        <aside 
          ref={sidebarRef}
          className={cn(
            "bg-card border-r border-border flex flex-col shrink-0 select-none",
            "fixed inset-y-0 left-0 z-50 h-full transition-transform duration-300 shadow-2xl md:shadow-none",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:relative md:translate-x-0 md:transition-none md:z-0",
            "!w-[85vw] sm:!w-64 md:!w-auto" // Override inline width style on mobile
          )}
          style={{ width: sidebarWidth }}
        >
          <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Explorer</span>
            <button 
              className="md:hidden p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
             <div className="mb-2 px-2 text-xs font-bold text-primary-400 uppercase tracking-wider">
                {title.length > 20 ? title.substring(0, 20) + '...' : title}
             </div>
             {files.map((node) => (
               <FileTreeItem
                 key={node.path}
                 node={node}
                 activeFile={activeFile}
                 onFileClick={(file) => {
                   setActiveFile(file);
                   setIsSidebarOpen(false); // Close sidebar on file selection on mobile
                 }}
               />
             ))}
          </div>
          
          {/* Resize Handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary-500/50 transition-colors z-10 hidden md:block"
            onMouseDown={startResizing}
          />
        </aside>

        {/* Main Content - Editor */}
        <main className="flex-1 flex flex-col bg-background overflow-hidden relative">
          {/* Tabs */}
          <div className="flex bg-card border-b border-border h-9 justify-between items-center pr-2">
            {activeFile ? (
              <>
                <div className="flex items-center gap-2 px-3 bg-background text-foreground text-sm border-t border-primary-500 min-w-[120px] max-w-[200px] border-r border-border h-full">
                  {getFileIcon(activeFile.name)}
                  <span className="truncate">{activeFile.name}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 mr-2 rounded text-xs font-medium transition-all duration-200",
                    copied 
                      ? "bg-primary-500/10 text-primary-400 border border-primary-500/20" 
                      : "bg-accent hover:bg-card text-muted-foreground border border-transparent"
                  )}
                  title="Copy Code"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </>
            ) : <div />}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            {activeFile ? (
              <Editor
                height="100%"
                path={activeFile.path}
                language={activeFile.language}
                value={activeFile.content}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  padding: { top: 16 },
                  automaticLayout: true,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a file to view code
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
