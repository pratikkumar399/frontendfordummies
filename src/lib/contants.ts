import { Template, Category } from '@/types/types';
import { JS_OUTPUT_CHALLENGES_SNIPPETS } from '@/data/snippets/js-output-challenges';
import { DEBOUNCE_THROTTLE_STARTER_CODE } from '@/data/starter-code/debounce-throttle';
import { NESTED_COMMENTS_MD } from '@/data/markdown/nested-comments';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'JS Output Challenges',
    slug: 'js-output-challenges',
    shortDescription: 'Predict the output of tricky JavaScript snippets involving hoisting, closures, and the event loop.',
    fullDescription: 'This collection tests your deep understanding of the JavaScript runtime. You will be presented with snippets of code and asked to predict the console output. These cover topics like Hoisting, Closures, `this` binding, Asynchronous operations, and the Event Loop.',
    imageUrl: 'https://picsum.photos/seed/jspractice/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Tricky', 'Event Loop', 'Closures'],
    category: Category.SNIPPET_PRACTICE,
    techStack: ['JavaScript', 'ES6'],
    author: 'JSNinja',
    createdAt: '2023-12-10',
    snippets: JS_OUTPUT_CHALLENGES_SNIPPETS
  },
  {
    id: '2',
    name: 'Debounce & Throttle',
    slug: 'debounce-throttle',
    shortDescription: 'Implement custom debounce and throttle utility functions from scratch.',
    fullDescription: 'A classic JavaScript challenge. Write your own implementation of debounce and throttle functions. \n\nDebounce: Ensures that a function is not called until a certain amount of time has passed since it was last called.\nThrottle: Ensures that a function is called at most once in a specified time period.',
    imageUrl: 'https://picsum.photos/seed/debounce/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Easy', 'Utilities', 'Logic'],
    category: Category.JAVASCRIPT,
    techStack: ['JavaScript', 'Closures', 'Async'],
    author: 'JSHero',
    createdAt: '2023-11-02',
    starterCode: DEBOUNCE_THROTTLE_STARTER_CODE
  },
  {
    id: '10',
    name: 'Nested Comments System',
    slug: 'nested-comments-system',
    shortDescription: 'Recursive component to display threaded comments like Reddit.',
    fullDescription: NESTED_COMMENTS_MD,
    imageUrl: 'https://picsum.photos/seed/comments/800/600',
    demoUrl: '/design/nested-comments-system/demo',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/components/demos/NestedCommentsSystem',
    tags: ['Medium', 'Recursion', 'Data Structures'],
    category: Category.REACT,
    techStack: ['React', 'Recursion', 'JSON'],
    author: 'modernDev',
    createdAt: '2025-12-02',
  }
];
