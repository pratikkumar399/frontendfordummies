'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TemplateCard } from '@/components/TemplateCard';
import { Category } from '@/types/types';
import { Search, Layers, ChevronRight, Zap, Menu, X } from 'lucide-react';

export default function ExplorePage() {
  const { templates } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const categories = ['All', ...Object.values(Category).filter(c => c !== 'All')];

  const handleCategorySelect = (cat: Category | 'All') => {
    setSelectedCategory(cat);
    setIsSidebarOpen(false);
  };

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Explore Frontend Challenges",
    "description": "Browse our complete collection of frontend coding challenges, system design problems, and interactive practice exercises.",
    "url": "https://frontenddummies.vercel.app/explore",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": templates.length,
      "itemListElement": templates.slice(0, 10).map((template, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Course",
          "name": template.name,
          "description": template.shortDescription,
          "url": `https://frontenddummies.vercel.app/design/${template.slug}`
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://frontenddummies.vercel.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Explore",
          "item": "https://frontenddummies.vercel.app/explore"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-dark-bg pt-16">
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] relative">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 z-[70] w-72 bg-dark-card border-r border-dark-border transform transition-transform duration-300 ease-in-out
            md:translate-x-0 md:static md:block md:w-64 lg:w-72 md:h-[calc(100vh-64px)] md:sticky md:top-16
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers size={20} className="text-primary-500" />
                    Categories
                </h2>
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat as Category | 'All')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <ChevronRight size={14} />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-dark-bg w-full">
          
          {/* Header & Search */}
          <div className="mb-8 flex flex-col gap-6">
             {/* Title Row with Mobile Menu Trigger */}
            <div className="flex items-center gap-3 md:block">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                    <Menu size={24} />
                </button>
                
                <div className="flex-1 md:flex md:items-end md:justify-between md:mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                            {selectedCategory === 'All' ? 'All Challenges' : selectedCategory}
                        </h1>
                        <p className="text-zinc-400 text-sm hidden md:block">
                            Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? 'result' : 'results'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                 <p className="text-zinc-400 text-sm md:hidden">
                    Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? 'result' : 'results'}
                </p>

                <div className="relative group max-w-md w-full sm:w-80">
                    <div className="absolute -inset-0.5 bg-primary-600 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative flex items-center bg-dark-input rounded-lg border border-dark-border">
                        <div className="pl-3 text-zinc-500">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            className="block w-full px-3 py-2.5 bg-transparent text-white placeholder-zinc-600 focus:outline-none text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-dark-border bg-dark-card/50">
                <Zap size={48} className="mx-auto text-zinc-700 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No challenges found</h3>
                <p className="text-zinc-500 mb-6 text-sm max-w-xs mx-auto">
                  We couldn&apos;t find any challenges matching your search filters.
                </p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium text-sm border-b border-primary-400/30 hover:border-primary-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    </>
  );
};