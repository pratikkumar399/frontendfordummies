'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { TemplateCard } from '@/components/TemplateCard';
import { TemplateListItem } from '@/components/TemplateListItem';
import { Category, ButtonVariant, ButtonSize, Subcategory } from '@/types/types';
import { Button } from '@repo/ui';
import { Search, Layers, ChevronRight, Zap, Menu, X, Grid3x3, List } from 'lucide-react';
import { generateCollectionStructuredData } from '@/lib/seo';
import {
  getSubcategoriesForCategory,
  getCategoryForSubcategory,
  getSubcategoryDisplayName,
  getAllSubcategories,
  hasSubcategories,
} from '@/lib/category-config';

type ViewMode = 'card' | 'list';

export default function ExplorePage() {
  const { templates } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Initialize selected category, subcategory and view mode from URL query params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      // Check if it's a valid category or 'All'
      if (categoryFromUrl === 'All' || Object.values(Category).includes(categoryFromUrl as Category)) {
        const category = categoryFromUrl as Category;
        setSelectedCategory(categoryFromUrl as Category | 'All');
        // Expand category if it has subcategories
        if (hasSubcategories(category)) {
          setExpandedCategories(prev => new Set(prev).add(category));
        }
      }
    }

    const subcategoryFromUrl = searchParams.get('subcategory');
    if (subcategoryFromUrl) {
      // Check if it's a valid subcategory
      const allSubcategories = getAllSubcategories();
      if (allSubcategories.includes(subcategoryFromUrl as Subcategory)) {
        setSelectedSubcategory(subcategoryFromUrl as Subcategory);
      }
    }

    const viewFromUrl = searchParams.get('view');
    if (viewFromUrl && (viewFromUrl === 'card' || viewFromUrl === 'list')) {
      setViewMode(viewFromUrl as ViewMode);
    }
  }, [searchParams]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesSubcategory = !selectedSubcategory || t.subcategory === selectedSubcategory;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [templates, searchQuery, selectedCategory, selectedSubcategory]);

  const categoriesWithContent = useMemo(() => {
    const categorySet = new Set<Category>();
    templates.forEach(t => {
      if (t.category !== Category.BLOGS) {
        categorySet.add(t.category);
      }
    });
    return Array.from(categorySet);
  }, [templates]);

  const categories = ['All', ...categoriesWithContent];

  const handleCategorySelect = useCallback((cat: Category | 'All') => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    setIsSidebarOpen(false);

    // Handle category expansion - close all others, toggle current
    if (cat === 'All') {
      // Close all subcategories when selecting 'All'
      setExpandedCategories(new Set());
    } else if (hasSubcategories(cat)) {
      setExpandedCategories(prev => {
        const newSet = new Set<Category>();
        // If clicking the same category that's already expanded, close it
        // Otherwise, expand it and close all others
        if (!prev.has(cat)) {
          newSet.add(cat);
        }
        return newSet;
      });
    } else {
      // For other categories, close all subcategories
      setExpandedCategories(new Set());
    }

    // Update URL query params
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
      params.delete('subcategory');
    } else {
      params.set('category', cat);
      params.delete('subcategory');
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '/explore';
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  const handleSubcategorySelect = useCallback((subcat: Subcategory) => {
    setSelectedSubcategory(subcat);
    setIsSidebarOpen(false);

    // Update URL query params
    const params = new URLSearchParams(searchParams.toString());
    params.set('subcategory', subcat);

    // Always determine and update category from subcategory
    const newCategory = getCategoryForSubcategory(subcat);

    // Update category if it's different from current or if current is 'All'
    if (newCategory && (selectedCategory === 'All' || selectedCategory !== newCategory)) {
      params.set('category', newCategory);
      setSelectedCategory(newCategory);
    }

    // Close all other categories' subcategories and expand the current category
    if (newCategory) {
      setExpandedCategories(new Set([newCategory]));
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '/explore';
    router.push(newUrl, { scroll: false });
  }, [searchParams, router, selectedCategory]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);

    // Update URL query params
    const params = new URLSearchParams(searchParams.toString());
    if (mode === 'list') {
      params.delete('view'); // list is default, so remove from URL
    } else {
      params.set('view', mode);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '/explore';
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  // JSON-LD Structured Data
  const structuredData = generateCollectionStructuredData(
    'Explore Frontend Challenges',
    'Browse our complete collection of frontend coding challenges, system design problems, and interactive practice exercises.',
    templates.map((template) => ({
      name: template.name,
      description: template.shortDescription,
      url: `https://frontenddummies.com/design/${template.slug}`,
    })),
    '/explore'
  );

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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
              role="button"
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
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
                  icon={<X size={20} />}
                >
                  Close
                </Button>
              </div>

              <nav className="space-y-2">
                {categories.map((cat) => {
                  const category = cat as Category | 'All';
                  const subcategories = category !== 'All' ? getSubcategoriesForCategory(category) : [];
                  const isExpanded = category !== 'All' && expandedCategories.has(category);
                  const hasSubcategories = subcategories.length > 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <Button
                        onClick={() => handleCategorySelect(category)}
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.MD}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === cat && !selectedSubcategory
                          ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                          }`}
                      >
                        <span>{cat}</span>
                        <div className="flex items-center gap-2">
                          {hasSubcategories && (
                            <ChevronRight
                              size={14}
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          )}
                          {selectedCategory === cat && !selectedSubcategory && !hasSubcategories && (
                            <ChevronRight size={14} />
                          )}
                        </div>
                      </Button>
                      {hasSubcategories && isExpanded && (
                        <div className="ml-4 space-y-1 border-l border-dark-border pl-2">
                          {subcategories.map((subcat) => (
                            <Button
                              key={subcat}
                              onClick={() => handleSubcategorySelect(subcat)}
                              variant={ButtonVariant.GHOST}
                              size={ButtonSize.SM}
                              className={`w-full flex items-center justify-start px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${selectedSubcategory === subcat
                                ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20'
                                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent'
                                }`}
                            >
                              <span>{getSubcategoryDisplayName(subcat)}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-dark-bg w-full">

            {/* Header & Search */}
            <div className="mb-8 flex flex-col gap-6">
              {/* Title Row with Mobile Menu Trigger */}
              <div className="flex items-center gap-3 md:block">
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                  icon={<Menu size={24} />}
                >
                  Menu
                </Button>

                <div className="flex-1 md:flex md:items-end md:justify-between md:mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {selectedSubcategory
                        ? getSubcategoryDisplayName(selectedSubcategory)
                        : selectedCategory === 'All'
                          ? 'All Challenges'
                          : selectedCategory}
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

                <div className="flex items-center gap-3">
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

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-dark-card rounded-lg border border-dark-border">
                    <Button
                      onClick={() => handleViewModeChange('card')}
                      variant={ButtonVariant.GHOST}
                      size={ButtonSize.SM}
                      className={`p-2 ${viewMode === 'card' ? '!bg-primary-600/20 !text-primary-400' : '!text-zinc-400 hover:!text-white'}`}
                      icon={<Grid3x3 size={18} />}
                    >
                      <span className="sr-only">Card view</span>
                    </Button>
                    <Button
                      onClick={() => handleViewModeChange('list')}
                      variant={ButtonVariant.GHOST}
                      size={ButtonSize.SM}
                      className={`p-2 ${viewMode === 'list' ? '!bg-primary-600/20 !text-primary-400' : '!text-zinc-400 hover:!text-white'}`}
                      icon={<List size={18} />}
                    >
                      <span className="sr-only">List view</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid/List */}
            {filteredTemplates.length > 0 ? (
              <div
                key={viewMode}
                className="animate-fade-in"
                style={{
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, index) => (
                      <div
                        key={template.id}
                        style={{
                          animation: `slideUp 0.4s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <TemplateCard template={template} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {filteredTemplates.map((template, index) => (
                      <div
                        key={template.id}
                        style={{
                          animation: `slideUp 0.3s ease-out ${index * 0.03}s both`
                        }}
                      >
                        <TemplateListItem template={template} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-dark-border bg-dark-card/50">
                <Zap size={48} className="mx-auto text-zinc-700 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No challenges found</h3>
                <p className="text-zinc-500 mb-6 text-sm max-w-xs mx-auto">
                  We couldn&apos;t find any challenges matching your search filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedSubcategory(null);
                    setViewMode('list');
                    router.push('/explore', { scroll: false });
                  }}
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium text-sm border-b border-primary-400/30 hover:border-primary-300"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};