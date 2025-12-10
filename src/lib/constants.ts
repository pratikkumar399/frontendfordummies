import { Template, Category } from '@/types/types';
import { JS_OUTPUT_CHALLENGES_SNIPPETS } from '@/data/snippets/js-output-challenges';
import { DEBOUNCE_STARTER_CODE } from '@/data/starter-code/debounce';
import { NESTED_COMMENTS_MD } from '@/data/markdown/nested-comments';
import commentsImage from '@/data/assets/comments.png';
import { SMART_JS_MD } from '@/data/markdown/smartjs';
import { DEBOUNCE_EDITORIAL } from '@/data/editorial/debounce-editorial';
import { PROMISE_OUTPUT_CHALLENGES_SNIPPETS } from '@/data/snippets/promise-output-challenges';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'JS Output Challenges',
    slug: 'js-output-challenges',
    shortDescription: 'Predict the output of tricky JavaScript snippets involving hoisting, closures, and the event loop.',
    fullDescription: 'This collection tests your deep understanding of the JavaScript runtime. You will be presented with snippets of code and asked to predict the console output. These cover topics like Hoisting, Closures, `this` binding, Asynchronous operations, and the Event Loop.',
    imageUrl: 'https://placehold.co/800x600/f7df1e/000000/png?text=JS+Output+Challenges',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/snippets/js-output-challenges.ts',
    tags: ['Tricky', 'Event Loop', 'Closures'],
    category: Category.SNIPPET_PRACTICE,
    techStack: ['JavaScript', 'ES6'],
    author: 'modernDev',
    createdAt: '2025-12-02',
    snippets: JS_OUTPUT_CHALLENGES_SNIPPETS,
    goal: 'Test your JavaScript knowledge by predicting the correct output for each snippet. Aim for 100% accuracy!'
  },
  {
    id: '2',
    name: 'Debounce',
    slug: 'debounce',
    shortDescription: 'Debouncing lets you control how often a function executes, great for optimizing search bars and rapid-fire events.',
    fullDescription: `Debouncing is a performance optimization technique that limits how often a function can execute. It delays function execution until after a certain amount of time has passed since the function was last called. Imagine a user typing in a search box - instead of making an API call on every keystroke, debouncing waits until they pause typing.
    
The key insight with debouncing is that we reset the timer every time the function is called. Only when the user stops calling the function for the specified delay does the actual execution happen. This is perfect for events that fire rapidly but where you only care about the final state.
`,
    editorial: DEBOUNCE_EDITORIAL,
    imageUrl: 'https://placehold.co/800x600/3b82f6/ffffff/png?text=Debounce+It!',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/starter-code/debounce-throttle',
    tags: ['Easy', 'Utilities', 'Logic'],
    category: Category.JAVASCRIPT,
    techStack: ['JavaScript', 'Closures', 'Async'],
    author: 'JSHero',
    createdAt: '2025-11-25',
    starterCode: DEBOUNCE_STARTER_CODE,
    goal: 'Implement debounce and throttle functions within 30 minutes. Focus on understanding closures and timing mechanisms.',
    directToPractice: true
  },
  {
    id: '3',
    name: "Get smart in javascript",
    slug: 'get-smart-in-javascript',
    shortDescription: 'A collection of JavaScript tricks to test your understanding of the language. This will help you to get smart in javascript.',
    fullDescription: SMART_JS_MD,
    imageUrl: 'https://placehold.co/800x600/3b82f6/ffffff/png?text=Get+Smart+in+JavaScript',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Tricky', 'Event Loop', 'Closures', 'JavaScript'],
    category: Category.JAVASCRIPT,
    techStack: ['JavaScript', 'ES6'],
    author: 'modernDev',
    createdAt: '2025-12-02',
    goal: 'Learn and memorize these JavaScript tips and tricks. Practice using them in your daily coding.'
  },
  {
    id: '4',
    name: 'Nested Comments System',
    slug: 'nested-comments-system',
    shortDescription: 'Recursive component to display threaded comments like Reddit.',
    fullDescription: NESTED_COMMENTS_MD,
    imageUrl: commentsImage.src,
    demoUrl: '/design/nested-comments-system/demo',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/components/demos/NestedCommentsSystem',
    tags: ['Medium', 'Recursion', 'Data Structures'],
    category: Category.REACT,
    techStack: ['React'],
    author: 'modernDev',
    createdAt: '2025-12-02',
    goal: 'Implement a recursive nested comments system within 45-60 minutes. Focus on clean component structure and efficient state management.'
  },
  {
    id: '5',
    name: 'Promise Output Challenges',
    slug: 'promise-output-challenges',
    shortDescription: 'Predict the output of tricky JavaScript snippets involving promises.',
    fullDescription: 'This collection tests your deep understanding of the JavaScript runtime. You will be presented with snippets of code and asked to predict the console output. These cover topics like Promise executor order, resolve and reject, and the event loop.',
    imageUrl: 'https://placehold.co/800x600/8b5cf6/ffffff/png?text=Promise',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/snippets/promise-output-challenges.ts',
    tags: ['Tricky', 'Event Loop', 'Promises'],
    category: Category.SNIPPET_PRACTICE,
    techStack: ['JavaScript', 'ES6'],
    author: 'modernDev',
    createdAt: '2025-12-02',
    snippets: PROMISE_OUTPUT_CHALLENGES_SNIPPETS,
    goal: 'Test your JavaScript knowledge by predicting the correct output for each snippet. Aim for 100% accuracy!'
  }
];
