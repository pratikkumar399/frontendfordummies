
export interface Template {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    imageUrl: string;
    demoUrl: string;
    githubUrl: string;
    tags: string[];
    category: Category;
    techStack: string[];
    author: string;
    createdAt: string;
    starterCode?: string; // Optional starter code for practice mode
}

export enum Category {
    ALL = 'All',
    REACT = 'React',
    JAVASCRIPT = 'JavaScript',
    CSS = 'CSS',
    SYSTEM_DESIGN = 'System Design',
    ALGORITHMS = 'Algorithms',
    TAKE_HOME = 'Take-Home Project'
}

export type SortOption = 'newest' | 'popular' | 'alphabetical';
