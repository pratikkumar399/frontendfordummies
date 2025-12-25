import { Template, Category, JavaScriptSubcategory, ReactSubcategory } from '@/types/types';
import { JS_OUTPUT_CHALLENGES_SNIPPETS } from '@/data/snippets/js-output-challenges';
import { DEBOUNCE_STARTER_CODE } from '@/data/starter-code/debounce';
import { RETRY_PROMISE_STARTER_CODE } from '@/data/starter-code/retry-promise';
import { PROMISE_ALL_STARTER_CODE } from '@/data/starter-code/promise-all';
import { CALL_POLYFILL_STARTER_CODE } from '@/data/starter-code/call';
import commentsImage from '@/data/assets/comments.png';
import criticalRenderingPathImage from '@/data/assets/crp.png';
import clientSideRateLimiterImage from '@/data/assets/rate-limiter.png';
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
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.SNIPPET_PRACTICE,
    techStack: ['JavaScript', 'ES6'],
    author: 'modernDev',
    createdAt: '2025-12-02',
    snippets: JS_OUTPUT_CHALLENGES_SNIPPETS,
    goal: 'Test your JavaScript knowledge by predicting the correct output for each snippet. Aim for 100% accuracy!',
    directToSnippetPractice: true,
  },
  {
    id: '2',
    name: 'Debounce',
    slug: 'debounce',
    shortDescription: 'Debouncing lets you control how often a function executes, great for optimizing search bars and rapid-fire events.',
    fullDescription: `Debouncing is a performance optimization technique that limits how often a function can execute. It delays function execution until after a certain amount of time has passed since the function was last called. Imagine a user typing in a search box - instead of making an API call on every keystroke, debouncing waits until they pause typing.
    
The key insight with debouncing is that we reset the timer every time the function is called. Only when the user stops calling the function for the specified delay does the actual execution happen. This is perfect for events that fire rapidly but where you only care about the final state.
`,
    editorial: '',
    imageUrl: 'https://placehold.co/800x600/3b82f6/ffffff/png?text=Debounce+It!',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/starter-code/debounce-throttle',
    tags: ['Easy', 'Utilities', 'Logic'],
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.JS_PRACTICE,
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
    fullDescription: '',
    imageUrl: 'https://placehold.co/800x600/3b82f6/ffffff/png?text=Get+Smart+in+JavaScript',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Tricky', 'Event Loop', 'Closures', 'JavaScript'],
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.JS_BLOGS_TECHNICAL_DEEP_DIVES,
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
    fullDescription: '',
    imageUrl: commentsImage.src,
    demoUrl: '/design/nested-comments-system/demo',
    githubUrl: 'https://github.com/pratikkumar399/frontenddummies/tree/main/apps/web/src/components/demos/NestedCommentsSystem',
    tags: ['Medium', 'Recursion', 'Data Structures'],
    category: Category.REACT,
    subcategory: ReactSubcategory.MACHINE_CODING_QUESTIONS,
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
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.SNIPPET_PRACTICE,
    techStack: ['JavaScript', 'ES6'],
    author: 'modernDev',
    createdAt: '2025-12-02',
    snippets: PROMISE_OUTPUT_CHALLENGES_SNIPPETS,
    goal: 'Test your JavaScript knowledge by predicting the correct output for each snippet. Aim for 100% accuracy!',
    directToSnippetPractice: true,
  },
  {
    id: '6',
    name: 'Turborepo: Complete Guide to Monorepo Build System',
    slug: 'turborepo-complete-guide',
    shortDescription: 'Learn how to set up and migrate to Turborepo for faster builds, intelligent caching, and better monorepo management.',
    fullDescription: '',
    imageUrl: 'https://placehold.co/800x600/6366f1/ffffff/png?text=Turborepo+Guide',
    demoUrl: '#',
    githubUrl: 'https://github.com/vercel/turbo',
    tags: ['Monorepo', 'Build System', 'Performance', 'DevOps'],
    category: Category.BLOGS,
    techStack: ['Turborepo', 'Monorepo', 'JavaScript', 'TypeScript'],
    author: 'modernDev',
    createdAt: '2025-01-15',
    goal: 'Understand Turborepo and learn how to migrate your monorepo for faster builds and better developer experience.'
  },
  {
    id: '7',
    name: 'JavaScript Basics and Language Fundamentals',
    slug: 'javascript-fundamentals',
    shortDescription: 'Deep dive into how JavaScript really works: types, memory, hoisting, coercion, and references.',
    fullDescription: '',
    imageUrl: 'https://placehold.co/800x600/f97316/ffffff/png?text=JS+Fundamentals',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['JavaScript', 'Fundamentals', 'Types', 'Hoisting'],
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.JS_BLOGS_TECHNICAL_DEEP_DIVES,
    techStack: ['JavaScript'],
    author: 'modernDev',
    createdAt: '2025-12-16',
    goal: 'Build a rock-solid mental model of JavaScript core language fundamentals so the language stops surprising you.'
  },
  {
    id: '8',
    name: 'SEO guide for Frontend Developers',
    slug: 'seo-guide-for-frontend',
    shortDescription: 'A practical guide to crawling, indexing, meta tags, semantics, and Core Web Vitals so your pages rank and stay fast.',
    fullDescription: 'Learn how frontend choices influence SEO: make pages discoverable, indexable, and fast. Covers crawling, meta data, heading structure, alt text, canonical URLs, Core Web Vitals, and smart loading strategies with clear frontend examples.',
    imageUrl: 'https://placehold.co/800x600/0ea5e9/ffffff/png?text=SEO+Essentials',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['SEO', 'Core Web Vitals', 'Crawling', 'Performance'],
    category: Category.BLOGS,
    techStack: ['SEO', 'Web Performance', 'Frontend'],
    author: 'modernDev',
    createdAt: '2025-12-16',
    goal: 'Use this checklist to ship SEO-friendly pages with strong Core Web Vitals.'
  },
  {
    id: '9',
    name: 'Modal Component',
    slug: 'modal-component',
    shortDescription: 'A modal component that can be used to display a modal.',
    fullDescription: '',
    imageUrl: 'https://placehold.co/800x600/8b5cf6/ffffff/png?text=Modal+Component',
    demoUrl: '/design/modal-component/demo',
    githubUrl: 'https://github.com/pratikkumar399/frontenddummies/tree/main/apps/web/src/components/demos/ModalDemo',
    tags: ['React', 'Modal Component'],
    category: Category.REACT,
    subcategory: ReactSubcategory.MACHINE_CODING_QUESTIONS,
    techStack: ['React'],
    author: 'modernDev',
    createdAt: '2025-12-17',
    goal: 'Implement a modal component that can be used to display a modal.'
  },
  {
    id: '10',
    name: 'Understanding the Critical Rendering Path',
    slug: 'understanding-the-critical-rendering-path',
    shortDescription: 'A guide to the critical rendering path and how to optimize it.',
    fullDescription: '',
    imageUrl: criticalRenderingPathImage.src,
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Critical Rendering Path', 'Performance', 'Frontend'],
    category: Category.BLOGS,
    techStack: ['Critical Rendering Path', 'Performance', 'Frontend'],
    author: 'modernDev',
    createdAt: '2025-12-17',
    goal: 'Understand the critical rendering path and how to optimize it. This will help you to build faster and more responsive websites.'
  },
  {
    id: '11',
    name: 'Fetch And Retry',
    slug: 'fetch-retry',
    shortDescription: 'Implement a retry function that handles transient failures by retrying async operations with optional delays.',
    fullDescription: `Retry logic is essential for building resilient applications. Network requests, database connections, and API calls can fail temporarily due to server overload, rate limiting, or network issues.

In this challenge, you'll implement a retry function that automatically retries a failing async operation a specified number of times. Design and implement a function that fetches data from an API and retries the request when it fails.

Key concepts you'll practice:
- Promise chaining and error handling
- Async/await patterns
- Closures for state management
- Recursive vs iterative implementations
`,
    editorial: "",
    imageUrl: 'https://placehold.co/800x600/10b981/ffffff/png?text=Promise+Retry',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/starter-code/retry-promise.ts',
    tags: ['Medium', 'Promises', 'Async'],
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.JS_PRACTICE,
    techStack: ['JavaScript', 'Promises', 'Async/Await'],
    author: 'modernDev',
    createdAt: '2025-12-21',
    starterCode: RETRY_PROMISE_STARTER_CODE,
    goal: 'Implement a retry function that handles transient failures. Bonus: Add exponential backoff with jitter.',
    directToPractice: true
  },
  {
    id: '12',
    name: 'Promise.all Polyfill',
    slug: 'promise-all-polyfill',
    shortDescription: 'Implement your own Promise.all polyfill to understand how concurrent Promise handling works under the hood.',
    fullDescription: `Promise.all is one of the most powerful Promise utility methods in JavaScript. It allows you to execute multiple Promises concurrently and wait for all of them to complete. Understanding how it works internally is crucial for mastering asynchronous JavaScript.

In this challenge, you'll implement a polyfill for Promise.all from scratch. This will deepen your understanding of:
- How Promises work internally
- Concurrent vs sequential execution
- Error handling in Promise chains
- Maintaining order of results regardless of completion order
- Fail-fast behavior when any Promise rejects

Requirements:

Your implementation must:
1. Accept an array of Promises (or any values) as input
2. Return a Promise that resolves with an array of results
3. Maintain the order of results matching the input order (even if Promises resolve out of order)
4. Implement fail-fast behavior: if any Promise rejects, immediately reject with that error
5. Handle empty arrays by resolving with an empty array
6. Convert non-Promise values to resolved Promises (using Promise.resolve)

Key Concepts:
- Concurrent Execution: All Promises start executing immediately, not sequentially
- Order Preservation: Results must match input order, regardless of which Promise completes first
- Fail-Fast: The first rejection should immediately reject the entire operation
- Promise Resolution: Non-Promise values should be treated as already-resolved Promises

This challenge tests your ability to manage asynchronous state, handle edge cases, and understand the fundamental mechanics of Promise composition.`,
    editorial: "",
    imageUrl: 'https://placehold.co/800x600/8b5cf6/ffffff/png?text=Promise.all+Polyfill',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/src/data/starter-code/promise-all.ts',
    tags: ['Medium', 'Promises', 'Polyfill', 'Concurrency'],
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.JS_PRACTICE,
    techStack: ['JavaScript', 'Promises', 'Async/Await'],
    author: 'modernDev',
    createdAt: '2025-12-22',
    starterCode: PROMISE_ALL_STARTER_CODE,
    goal: 'Implement a Promise.all polyfill that handles concurrent Promises, maintains order, and implements fail-fast error handling.',
    directToPractice: true
  },
  {
    id: '13',
    name: 'Function.prototype.call Polyfill',
    slug: 'call-polyfill',
    shortDescription: 'Recreate Function.prototype.call to control this binding and argument forwarding safely.',
    fullDescription: `The native Function.prototype.call lets you invoke a function with an explicit "this" value and positional arguments. Rebuilding it from scratch forces you to reason about execution context, boxing primitives, and avoiding property collisions.

In this challenge, implement a polyfill that mirrors call's behavior:
- Validate that it is invoked on a function.
- Default null/undefined to the global object.
- Box primitive contexts so "this" is still an object.
- Avoid mutating user properties by using a collision-safe key.
- Clean up temporary state after invocation.
- Return the called function's result.
`,
    editorial: '',
    imageUrl: 'https://placehold.co/800x600/14b8a6/ffffff/png?text=call+polyfill',
    demoUrl: '#',
    githubUrl: 'https://github.com/pratikkumar399/frontendfordummies/tree/main/apps/web/src/data/starter-code/call.ts',
    tags: ['Medium', 'this binding', 'Polyfill', 'Functions'],
    category: Category.JAVASCRIPT,
    subcategory: JavaScriptSubcategory.JS_PRACTICE,
    techStack: ['JavaScript', 'Functions', 'this'],
    author: 'modernDev',
    createdAt: '2025-12-23',
    starterCode: CALL_POLYFILL_STARTER_CODE,
    goal: 'Implement Function.prototype.call with correct this handling, primitive boxing, and collision-free temporary storage.',
    directToPractice: true
  },
  {
    id: '14',
    name: 'Client-Side Rate Limiter',
    slug: 'client-side-rate-limiter',
    shortDescription: 'How I built a simple, client-only rate limiter to keep code execution fast, safe, and predictable without any backend dependency.',
    fullDescription: 'In this post, I\'ll walk through a simple, client-only rate limiter that keeps code execution fast, safe, and predictable—without any backend dependency.',
    imageUrl: clientSideRateLimiterImage.src,
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Medium', 'Rate Limiter', 'Client-Side'],
    category: Category.BLOGS,
    techStack: ['JavaScript', 'Rate Limiter', 'Client-Side', 'Frontend'],
    author: 'modernDev',
    createdAt: '2025-12-22',
    goal: 'Implement a client-side rate limiter to prevent abuse of the code execution.',
    directToPractice: true
  },
  {
    id: '15',
    name: 'Image Carousel',
    slug: 'image-carousel',
    shortDescription: '',
    fullDescription: '',
    imageUrl: 'https://placehold.co/800x600/14b8a6/ffffff/png?text=image+carousel',
    demoUrl: '/design/image-carousel/demo',
    githubUrl: '#',
    tags: ['Medium', 'Image Carousel', 'React'],
    category: Category.REACT,
    subcategory: ReactSubcategory.MACHINE_CODING_QUESTIONS,
    techStack: ['React'],
    author: 'modernDev',
    createdAt: '2025-12-22',
    goal: 'Implement a image carousel component that can be used to display a list of images.'
  }
];
