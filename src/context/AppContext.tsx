'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Template, Category } from '@/types/types';
import { INITIAL_TEMPLATES } from '@/lib/constants';

interface AppContextType {
  templates: Template[];
  addTemplate: (template: Template) => void;
  isDarkMode: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State - Always dark mode
  const isDarkMode = true;

  // Data State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Initialize Data
  useEffect(() => {
    // Load from local storage or fallback to constants
    setTemplates(INITIAL_TEMPLATES);
  }, []);

  // Ensure dark mode is always applied
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const addTemplate = (template: Template) => {
    setTemplates(prev => [template, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        templates,
        addTemplate,
        isDarkMode,
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
