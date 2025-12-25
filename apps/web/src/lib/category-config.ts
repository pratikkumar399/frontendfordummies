import { Category, Subcategory } from '@/types/types';

/**
 * Configuration for category subcategories
 * This makes it easy to add new categories with subcategories in the future
 */
export interface SubcategoryConfig {
  value: Subcategory;
  displayName: string;
}

export interface CategorySubcategoryConfig {
  category: Category;
  subcategories: SubcategoryConfig[];
}

/**
 * Main configuration mapping categories to their subcategories
 * 
 * HOW TO ADD A NEW CATEGORY WITH SUBCATEGORIES:
 * 
 * 1. Add subcategory enum values to types.ts:
 *    export enum NewCategorySubcategory {
 *      SUB_CAT_1 = 'sub-cat-1',
 *      SUB_CAT_2 = 'sub-cat-2',
 *    }
 * 
 * 2. Update the Subcategory type union in types.ts:
 *    export type Subcategory = JavaScriptSubcategory | ReactSubcategory | NewCategorySubcategory;
 * 
 * 3. Add the category configuration here:
 *    {
 *      category: Category.NEW_CATEGORY,
 *      subcategories: [
 *        {
 *          value: 'sub-cat-1' as Subcategory,
 *          displayName: 'Sub Category 1',
 *        },
 *        {
 *          value: 'sub-cat-2' as Subcategory,
 *          displayName: 'Sub Category 2',
 *        },
 *      ],
 *    },
 * 
 * That's it! The explore page will automatically support the new category and subcategories.
 */
export const CATEGORY_SUBCATEGORY_CONFIG: CategorySubcategoryConfig[] = [
  {
    category: Category.JAVASCRIPT,
    subcategories: [
      {
        value: 'snippet-practice' as Subcategory,
        displayName: 'Snippet Practice',
      },
      {
        value: 'js-practice' as Subcategory,
        displayName: 'JS Practice',
      },
      {
        value: 'js-blogs/technical-deep-dives' as Subcategory,
        displayName: 'Technical Deep Dives',
      },
    ],
  },
  {
    category: Category.REACT,
    subcategories: [
      {
        value: 'machine-coding-questions' as Subcategory,
        displayName: 'Machine Coding Questions',
      },
      {
        value: 'technical-deep-dive/blogs' as Subcategory,
        displayName: 'Technical Deep Dive / Blogs',
      },
    ],
  },
];

/**
 * Get all subcategories for a given category
 */
export function getSubcategoriesForCategory(category: Category): Subcategory[] {
  const config = CATEGORY_SUBCATEGORY_CONFIG.find(c => c.category === category);
  return config?.subcategories.map(s => s.value) || [];
}

/**
 * Get the category that a subcategory belongs to
 */
export function getCategoryForSubcategory(subcategory: Subcategory): Category | null {
  for (const config of CATEGORY_SUBCATEGORY_CONFIG) {
    if (config.subcategories.some(s => s.value === subcategory)) {
      return config.category;
    }
  }
  return null;
}

/**
 * Get display name for a subcategory
 */
export function getSubcategoryDisplayName(subcategory: Subcategory): string {
  for (const config of CATEGORY_SUBCATEGORY_CONFIG) {
    const subcategoryConfig = config.subcategories.find(s => s.value === subcategory);
    if (subcategoryConfig) {
      return subcategoryConfig.displayName;
    }
  }
  return subcategory;
}

/**
 * Get all subcategories across all categories
 */
export function getAllSubcategories(): Subcategory[] {
  return CATEGORY_SUBCATEGORY_CONFIG.flatMap(config => 
    config.subcategories.map(s => s.value)
  );
}

/**
 * Check if a category has subcategories
 */
export function hasSubcategories(category: Category): boolean {
  return CATEGORY_SUBCATEGORY_CONFIG.some(c => c.category === category);
}

/**
 * Get all categories that have subcategories
 */
export function getCategoriesWithSubcategories(): Category[] {
  return CATEGORY_SUBCATEGORY_CONFIG.map(c => c.category);
}

