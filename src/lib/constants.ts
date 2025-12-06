import { Template, Category } from '@/types/types';
import { JS_OUTPUT_CHALLENGES_SNIPPETS } from '@/data/snippets/js-output-challenges';
import { DEBOUNCE_THROTTLE_STARTER_CODE } from '@/data/starter-code/debounce-throttle';
import { NESTED_COMMENTS_MD } from '@/data/markdown/nested-comments';
import commentsImage from '@/data/assets/comments.png';
import { SMART_JS_MD } from '@/data/markdown/smartjs';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'JS Output Challenges',
    slug: 'js-output-challenges',
    shortDescription: 'Predict the output of tricky JavaScript snippets involving hoisting, closures, and the event loop.',
    fullDescription: 'This collection tests your deep understanding of the JavaScript runtime. You will be presented with snippets of code and asked to predict the console output. These cover topics like Hoisting, Closures, `this` binding, Asynchronous operations, and the Event Loop.',
    imageUrl: 'https://picsum.photos/seed/jspractice/800/600',
    demoUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/snippets/js-output-challenges.ts',
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
    name: 'Debounce & Throttle',
    slug: 'debounce-throttle',
    shortDescription: 'Implement custom debounce and throttle utility functions from scratch.',
    fullDescription: 'A classic JavaScript challenge. Write your own implementation of debounce and throttle functions. \n\nDebounce: Ensures that a function is not called until a certain amount of time has passed since it was last called.\nThrottle: Ensures that a function is called at most once in a specified time period.',
    imageUrl: 'https://picsum.photos/seed/debounce/800/600',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/starter-code/debounce-throttle',
    tags: ['Easy', 'Utilities', 'Logic'],
    category: Category.JAVASCRIPT,
    techStack: ['JavaScript', 'Closures', 'Async'],
    author: 'JSHero',
    createdAt: '2025-11-25',
    starterCode: DEBOUNCE_THROTTLE_STARTER_CODE,
    goal: 'Implement debounce and throttle functions within 30 minutes. Focus on understanding closures and timing mechanisms.'
  },
  {
    id: '3',
    name: "Get smart in javascript",
    slug: 'get-smart-in-javascript',
    shortDescription: 'A collection of JavaScript tricks to test your understanding of the language. This will help you to get smart in javascript.',
    fullDescription: SMART_JS_MD,
    imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/17/41/javascript-736401_1280.png',
    demoUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/markdown/smartjs.ts',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/markdown/smartjs.ts',
    tags: ['Tricky', 'Event Loop', 'Closures', 'JavaScript'],
    category: Category.JAVASCRIPT,
    techStack: ['JavaScript', 'ES6'],
    author: 'modernDev',
    createdAt: '2025-12-02',
    goal: 'Learn and memorize these JavaScript tips and tricks. Practice using them in your daily coding.'
  },
  {
    id: '10',
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
  }
];
