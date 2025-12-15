'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TemplateCard } from '@/components/TemplateCard';
import { Category } from '@/types/types';
import { Search, Zap } from 'lucide-react';

export default function BlogPage() {
  const { templates } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only blogs
  const blogTemplates = useMemo(() => {
    return templates.filter(t => t.category === Category.BLOGS);
  }, [templates]);

  const filteredBlogs = useMemo(() => {
    return blogTemplates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [blogTemplates, searchQuery]);

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Frontend Dummies Blog",
    "description": "Learn frontend development through comprehensive guides, tutorials, and best practices.",
    "url": "https://frontenddummies.com/blog",
    "blogPost": filteredBlogs.map((blog) => ({
      "@type": "BlogPosting",
      "headline": blog.name,
      "description": blog.shortDescription,
      "url": `https://frontenddummies.com/blog/${blog.slug}`,
      "datePublished": blog.createdAt,
      "author": {
        "@type": "Person",
        "name": blog.author
      },
      "image": blog.imageUrl
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-dark-bg pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Blogs</h1>
            <p className="text-zinc-400 text-lg">
              Learn frontend development through comprehensive guides, tutorials, and best practices.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative group max-w-md">
              <div className="absolute -inset-0.5 bg-primary-600 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative flex items-center bg-dark-input rounded-lg border border-dark-border">
                <div className="pl-3 text-zinc-500">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="block w-full px-3 py-2.5 bg-transparent text-white placeholder-zinc-600 focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-dark-border bg-dark-card/50">
                <Zap size={48} className="mx-auto text-zinc-700 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No blogs found</h3>
                <p className="text-zinc-500 mb-6 text-sm max-w-xs mx-auto">
                  We couldn&apos;t find any blogs matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

