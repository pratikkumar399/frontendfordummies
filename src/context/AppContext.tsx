'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Template, Category } from '@/types/types';
import { INITIAL_TEMPLATES } from '@/lib/constants';

interface AppContextType {
  templates: Template[];
  addTemplate: (template: Template) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Data State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Initialize Data
  useEffect(() => {
    // Load from local storage or fallback to constants
    setTemplates(INITIAL_TEMPLATES);

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Update DOM when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist templates when changed
  // useEffect(() => {
  //   if (templates.length > 0) {
  //     localStorage.setItem('uihub_templates', JSON.stringify(templates));
  //   }
  // }, [templates]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const addTemplate = (template: Template) => {
    setTemplates(prev => [template, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        templates,
        addTemplate,
        isDarkMode,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
