import { Snippet } from "@/types/types";

export const PROMISE_OUTPUT_CHALLENGES_SNIPPETS: Snippet[] = [
    {
        id: 's1',
        title: 'Promise Executor Order',
        code: `console.log('Start');

const promise = new Promise((resolve, reject) => {
  console.log('Promise executor');
  resolve('Resolved');
});

promise.then((value) => {
  console.log(value);
});

console.log('End');`,
        options: [
            "Start, Promise executor, Resolved, End",
            "Start, Promise executor, End, Resolved",
            "Promise executor, Start, End, Resolved",
            "Start, End, Promise executor, Resolved"
        ],
        correctAnswer: 1,
        explanation: `Understanding this question requires grasping the fundamental concept of how JavaScript's event loop works with synchronous and asynchronous code. When you create a new Promise, the executor function (the function you pass to the Promise constructor) runs immediately and synchronously. This is a crucial detail that many developers miss. The executor is not deferred or queued - it executes right away as part of the Promise construction.
So the code first prints "Start", then immediately constructs the Promise which causes "Promise executor" to print. The resolve function is called, which schedules the then callback to run later in the microtask queue. The code then continues synchronously to print "End". Only after all synchronous code completes does the JavaScript engine process the microtask queue, which is when "Resolved" finally prints.
The key insight here is that Promise executors run synchronously, but Promise callbacks (then, catch, finally) always run asynchronously, even if the Promise is already resolved.`
    }
];