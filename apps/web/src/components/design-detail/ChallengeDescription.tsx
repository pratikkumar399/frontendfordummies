"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Template, ButtonVariant, ButtonSize } from '@/types/types';
import { Copy, Check } from 'lucide-react';
import { Button } from '@repo/ui';
import styles from './ChallengeDescription.module.css';

interface ChallengeDescriptionProps {
  template: Template;
}

const DEFAULT_GOAL = 'Implement this within 45-60 minutes. Focus on clean code, edge case handling, and performance optimization.';

export const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({ template }) => {
  return (
    <div>
      <div className={styles.markdownContent}>
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              const codeString = String(children).replace(/\n$/, '');
              
              return !isInline ? (
                <CodeBlock 
                   language={match[1]} 
                   value={codeString} 
                   style={oneDark}
                />
              ) : (
                <code className="bg-dark-border px-1.5 py-0.5 rounded text-primary-300 text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {template.fullDescription}
        </ReactMarkdown>
      </div>
      <div className="mt-8 p-4 bg-primary-900/10 border border-primary-600/20 rounded-lg">
        <p className="text-primary-300 m-0 text-sm">
          <strong>Goal:</strong> {template.goal || DEFAULT_GOAL}
        </p>
      </div>
    </div>
  );
};

const CodeBlock = ({ language, value, style }: { language: string, value: string, style: typeof oneDark }) => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative group my-4">
            <Button
                onClick={onCopy}
                variant={ButtonVariant.GHOST}
                size={ButtonSize.SM}
                className="absolute top-2 right-2 p-2 rounded-md bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Copy code"
                icon={isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            >
                <span className="sr-only">Copy code</span>
            </Button>
            <SyntaxHighlighter
                style={style}
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
