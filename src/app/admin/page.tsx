'use client';   

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Category, Template, ButtonVariant } from '@/types/types';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function AdminPage() {
  const { addTemplate } = useApp();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    category: Category.REACT,
    tags: '',
    techStack: '',
    author: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock slug generation
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: formData.name,
      slug,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      imageUrl: formData.imageUrl || `https://placehold.co/800x600/png?text=${slug}`,
      demoUrl: formData.demoUrl || '#',
      githubUrl: formData.githubUrl || '#',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
      category: formData.category,
      author: formData.author || 'Anonymous',
      createdAt: new Date().toISOString().split('T')[0]
    };

    addTemplate(newTemplate);
    router.push('/');
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-white">Submit New Challenge</h1>
           <p className="mt-2 text-zinc-400">Share a new coding problem or skill challenge with the community.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card shadow-xl rounded-xl border border-dark-border p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Challenge Title</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Implement Promise.all"
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
              <select
                name="category"
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.category}
                onChange={handleChange}
              >
                {Object.values(Category).filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                required
                maxLength={120}
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.shortDescription}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-zinc-500">Brief summary for the card view.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Full Problem Statement</label>
              <textarea
                name="fullDescription"
                rows={6}
                required
                placeholder="Describe the requirements, constraints, and expected output..."
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.fullDescription}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Author/Source</label>
              <input
                type="text"
                name="author"
                placeholder="e.g. Meta, Google, or your name"
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.author}
                onChange={handleChange}
              />
            </div>
             
             <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Image URL (Optional)</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://..."
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Solution Demo URL</label>
              <input
                type="url"
                name="demoUrl"
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.demoUrl}
                onChange={handleChange}
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Solution GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Required Skills (comma separated)</label>
              <input
                type="text"
                name="techStack"
                placeholder="Recursion, React, Arrays"
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.techStack}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Difficulty/Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="Easy, Medium, Hard, Logic"
                className="block w-full rounded-md border-dark-border bg-dark-input text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border transition-colors focus:ring-1 focus:outline-none"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-5 flex items-center justify-end gap-3 border-t border-dark-border">
            <Button type="button" variant={ButtonVariant.GHOST} onClick={() => router.push('/')}>
              Cancel
            </Button>
            <Button type="submit" variant={ButtonVariant.PRIMARY} icon={<Save size={16} />}>
              Save Challenge
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
