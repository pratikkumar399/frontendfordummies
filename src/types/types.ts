
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
    goal?: string; // Optional goal description for the challenge
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

export enum SortOption {
    NEWEST = 'newest',
    POPULAR = 'popular',
    ALPHABETICAL = 'alphabetical'
}

// UI Component Types
export enum ButtonVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    OUTLINE = 'outline',
    GHOST = 'ghost'
}

export enum ButtonSize {
    SM = 'sm',
    MD = 'md',
    LG = 'lg'
}

export enum BadgeVariant {
    BLUE = 'blue',
    GRAY = 'gray',
    GREEN = 'green',
    PURPLE = 'purple'
}

// Practice Page Types
export enum LogType {
    LOG = 'log',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info'
}

export enum PracticeTab {
    DESCRIPTION = 'description',
    EDITORIAL = 'editorial'
}

export interface LogEntry {
    type: LogType;
    content: string;
    timestamp: string;
}
