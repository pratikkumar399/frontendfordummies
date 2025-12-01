
export interface Snippet {
    id: string;
    title: string;
    code: string;
    options: string[];
    correctAnswer: number; // index of the correct option
    explanation: string;
}

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
    starterCode?: string; // Optional starter code for IDE practice mode
    snippets?: Snippet[]; // Optional list of snippets for prediction mode
}

export enum Category {
    ALL = 'All',
    REACT = 'React',
    JAVASCRIPT = 'JavaScript',
    CSS = 'CSS',
    SYSTEM_DESIGN = 'System Design',
    ALGORITHMS = 'Algorithms',
    TAKE_HOME = 'Take-Home Project',
    SNIPPET_PRACTICE = 'Snippet Practice'
}

export type SortOption = 'newest' | 'popular' | 'alphabetical';
