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
    },
    {
        id: 's2',
        title: 'Promise Chain Return Values',
        code: `Promise.resolve(1)
  .then((value) => {
    console.log(value);
    return value + 1;
  })
  .then((value) => {
    console.log(value);
  })
  .then((value) => {
    console.log(value);
    return Promise.resolve(3);
  })
  .then((value) => {
    console.log(value);
  });`,
        options: [
            "1, 2, undefined, 3",
            "1, 2, 3, 4",
            "1, undefined, 2, 3",
            "1, 3, 2, undefined"
        ],
        correctAnswer: 0,
        explanation: `Promise chaining is a powerful feature, but it comes with specific rules about how values flow through the chain. When you return a value from a then callback, that value automatically becomes the resolved value for the next then in the chain. This is true whether you return a primitive value, an object, or even another Promise.
In the first then, we return value plus one, which is two. The second then receives this value and logs it. The second then doesn't have an explicit return statement, so it implicitly returns undefined. This is a common mistake in Promise chains - forgetting that JavaScript functions return undefined by default. The third then receives undefined and logs it, but then it explicitly returns a Promise that resolves to three. When you return a Promise from a then callback, the next then waits for that Promise to resolve and receives its resolved value, which is why the fourth then logs three.
The pattern to remember is that each then receives whatever the previous then returned, and if you don't return anything, the next then receives undefined.`
    },
    {
        id: 's3',
        title: 'Promise.resolve Unwrapping',
        code: `const promise1 = Promise.resolve(Promise.resolve(Promise.resolve(1)));

promise1.then((value) => {
  console.log(value);
});`,
        options: [
            "1",
            "Promise { Promise { 1 } }",
            "Promise { 1 }",
            "No output"
        ],
        correctAnswer: 0,
        explanation: `This question tests your understanding of how Promise.resolve handles values that are themselves Promises. When you pass a Promise to Promise.resolve, it doesn't wrap it in another Promise. Instead, it recognizes that the value is already a Promise and simply returns it. This is called Promise unwrapping or flattening.
So when we write Promise.resolve(Promise.resolve(Promise.resolve(1))), the innermost Promise.resolve(1) creates a Promise that resolves to one. The next Promise.resolve receives this Promise and returns it unchanged. The outermost Promise.resolve does the same thing. The result is equivalent to just writing Promise.resolve(1).
This behavior prevents the creation of deeply nested Promise chains that would be difficult to work with. It ensures that no matter how many times you wrap a Promise with Promise.resolve, you still get a Promise that resolves to the original value, not a Promise that resolves to a Promise that resolves to a Promise, and so on.`
    },
    {
        id: 's4',
        title: 'Microtasks vs Macrotasks',
        code: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');`,
        options: [
            "1, 4, 3, 2",
            "1, 3, 4, 2",
            "1, 4, 2, 3",
            "1, 2, 3, 4"
        ],
        correctAnswer: 0,
        explanation: `Synchronous logs run first: 1 then 4. Microtasks (Promise.then) run before macrotasks (setTimeout), so 3 logs before 2, giving 1, 4, 3, 2.`
    },
    {
        id: 's5',
        title: 'Error Handling in Chains',
        code: `Promise.resolve('Start')
  .then((value) => {
    console.log(value);
    throw new Error('Oops!');
  })
  .then((value) => {
    console.log('Hello');
  })
  .catch((error) => {
    console.log('Caught:', error.message);
    return 'Recovered';
  })
  .then((value) => {
    console.log(value);
  });`,
        options: [
            "Start, Caught: Oops!, Recovered",
            "Start, Hello, Caught: Oops!",
            "Start, Hello, Caught: Oops!, Recovered",
            "Syntax Error"
        ],
        correctAnswer: 0,
        explanation: `Understanding error propagation in Promise chains is essential for writing robust asynchronous code. When an error is thrown inside a then callback (or when a Promise is rejected), the error skips all subsequent then callbacks and jumps to the nearest catch callback down the chain. This is similar to how try-catch blocks work in synchronous code.
In this example, the first then prints "Start" and then throws an error. This error causes the Promise chain to enter a rejected state, which means the second then is completely skipped. The chain continues until it finds a catch callback that can handle the error. The catch logs the error message and then does something important - it returns a value.
When a catch callback returns a value (rather than throwing another error), it converts the Promise chain back to a resolved state. This is called error recovery. The returned value "Recovered" becomes the resolved value that flows to the next then callback, which logs it. This pattern allows you to handle errors gracefully and continue processing in a Promise chain, rather than having one error terminate the entire chain.`
    },
    {
        id: 's6',
        title: 'Promise Settles Once',
        code: `const promise = new Promise((resolve, reject) => {
  resolve('First');
  resolve('Second');
  reject('Third');
});

promise
  .then((value) => console.log(value))
  .catch((error) => console.log(error));`,
        options: [
            "First",
            "Second",
            "Third",
            "First, Second, Third"
        ],
        correctAnswer: 0,
        explanation: `A Promise settles only once. The first resolve fulfills with "First". Subsequent resolve/reject calls are ignored, so only "First" is logged.`
    },
    {
        id: 's7',
        title: 'Return Values and Rejections',
        code: `new Promise((resolve, reject) => {
  resolve(1);
})
  .then((value) => {
    console.log(value);
    return 2;
  })
  .then((value) => {
    console.log(value);
    // No return statement
  })
  .then((value) => {
    console.log(value);
    return Promise.reject('Error');
  })
  .catch((error) => {
    console.log(error);
  })
  .then(() => {
    console.log('Done');
  });`,
        options: [
            "1, 2, undefined, Error, Done",
            "1, 2, Error, undefined, Done",
            "1, 2, undefined, Done, Error",
            "1, undefined, 2, Error, Done"
        ],
        correctAnswer: 0,
        explanation: `This comprehensive example demonstrates several important concepts about how values and errors flow through Promise chains. The first then receives one, logs it, and explicitly returns two. This returned value becomes the resolved value for the next then callback.
The second then receives two and logs it, but notice it doesn't have a return statement. This is a common source of bugs in real applications. When a function in JavaScript doesn't explicitly return a value, it implicitly returns undefined. So the third then receives undefined and logs it.
The third then returns a rejected Promise, which immediately throws the chain into an error state. This is different from throwing an error - when you return Promise.reject, you're explicitly returning a Promise that's already in the rejected state. The error skips any then callbacks and goes straight to the catch.
The catch logs "Error" and implicitly returns undefined (no explicit return). But here's the crucial part - when a catch callback completes without throwing an error, it converts the Promise chain back to a fulfilled state. The chain recovers from the error, and subsequent then callbacks continue executing normally. That's why the final then callback runs and prints "Done".
This pattern of catch followed by then is powerful for error recovery - you can handle an error, log it or transform it, and then let the chain continue with normal processing.`
    },
    {
        id: 's8',
        title: 'Async/Await and Microtasks',
        code: `async function test() {
  console.log('1');
  
  await Promise.resolve();
  
  console.log('2');
}
console.log('3');
test();
console.log('4');`,
        options: [
            "3, 1, 4, 2",
            "1, 3, 4, 2",
            "3, 4, 1, 2",
            "1, 2, 3, 4"
        ],
        correctAnswer: 0,
        explanation: `This question combines async/await syntax with the event loop mechanics we've been exploring. Understanding this requires knowing that async functions and the await keyword are syntactic sugar over Promises, but they follow the same microtask queue rules.
The code starts by printing three, which is synchronous code before any function calls. Then we call test(), which is an async function. Inside test, the first thing that happens synchronously is printing one. This is important - everything before the first await in an async function runs synchronously, just like the Promise executor we saw earlier.
Then we hit await Promise.resolve(). The await keyword pauses the execution of the async function and schedules the rest of the function (everything after the await) to run as a microtask. Control returns to the caller, and the synchronous code continues by printing four.
Now all synchronous code is complete. The JavaScript engine processes the microtask queue, which contains the continuation of the test function. That continuation runs and prints two. The key insight is that await doesn't just pause execution - it converts the rest of the function into a microtask callback, similar to what happens with a then callback.
This is why async/await code follows the same timing rules as explicit Promise chains - they're fundamentally the same mechanism, just with different syntax.`
    },
    {
        id: 's9',
        title: 'Promise.all Fail Fast',
        code: `const promise1 = Promise.resolve(1);
const promise2 = Promise.reject('Error');
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log('Success:', values);
  })
  .catch((error) => {
    console.log('Failed:', error);
  });`,
        options: [
            "Failed: Error",
            "Success: 1,3",
            "Success: 1, Error, 3",
            "No output"
        ],
        correctAnswer: 0,
        explanation: `Promise.all rejects as soon as any input Promise rejects. promise2 rejects with "Error", so the catch runs and logs "Failed: Error".`
    },
    {
        id: 's10',
        title: 'Nested Promise Chains',
        code: `Promise.resolve(1)
  .then((value) => {
    console.log(value);
    
    Promise.resolve(2)
      .then((value) => {
        console.log(value);
      });
    
    return 3;
  })
  .then((value) => {
    console.log(value);
  });`,
        options: [
            "1, 3, 2",
            "1, 2, 3",
            "1, 2, 3, 2",
            "1, 3"
        ],
        correctAnswer: 0,
        explanation: `The key issue here is that we have a Promise chain nested inside another Promise chain, but they're not connected to each other.
When the outer then callback runs, it prints one, then creates a new Promise chain starting with Promise.resolve(2). However, this inner Promise chain is not returned from the callback - it's just created and left floating. The outer then callback explicitly returns three, which is what flows to the next outer then.
Since we return three immediately, the outer chain continues synchronously (as microtasks go) and prints three. Meanwhile, the inner Promise chain was scheduled as a separate microtask. After the outer chain completes its current step, the event loop processes other microtasks, which includes the inner chain's then callback, finally printing two.
The correct way to write this code, if you want the chains to work together, would be to return the inner Promise chain from the outer then callback. That would create a proper nested structure where the outer chain waits for the inner chain to complete. Without that return statement, you've created two independent Promise chains that just happen to be started from the same place in the code, leading to this confusing execution order.`
    },
    {
        id: 's11',
        title: 'Promise.race First Settler',
        code: `const promise1 = new Promise((resolve) => {
  setTimeout(() => resolve('Slow'), 1000);
});
const promise2 = new Promise((resolve) => {
  setTimeout(() => resolve('Fast'), 100);
});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => reject('Error'), 50);
});

Promise.race([promise1, promise2, promise3])
  .then((value) => {
    console.log('Winner:', value);
  })
  .catch((error) => {
    console.log('Failed:', error);
  });`,
        options: [
            "Failed: Error",
            "Winner: Fast",
            "Winner: Slow",
            "Failed: Slow"
        ],
        correctAnswer: 0,
        explanation: `Promise.race settles with the first settled Promise, whether fulfilled or rejected. promise3 rejects first after 50ms, so the catch logs "Failed: Error".`
    },
    {
        id: 's12',
        title: 'Multiple Catches',
        code: `Promise.reject('First error')
  .catch((error) => {
    console.log('Catch 1:', error);
    throw new Error('Second error');
  })
  .catch((error) => {
    console.log('Catch 2:', error.message);
    return 'Recovered';
  })
  .then((value) => {
    console.log('Then:', value);
    throw new Error('Third error');
  })
  .catch((error) => {
    console.log('Catch 3:', error.message);
  });`,
        options: [
            "Catch 1: First error, Catch 2: Second error, Then: Recovered, Catch 3: Third error",
            "Catch 1: First error, Then: Recovered, Catch 2: Second error, Catch 3: Third error",
            "Catch 1: First error, Catch 2: Second error, Catch 3: Third error",
            "Catch 1: First error, Then: Recovered, Catch 3: Third error"
        ],
        correctAnswer: 0,
        explanation: `Initial rejection hits first catch (logs First error) which throws a new error. Second catch handles it (logs Second error) and returns 'Recovered', restoring fulfillment. Then logs 'Then: Recovered' but throws, so final catch logs 'Third error'.`
    },
    {
        id: 's13',
        title: 'Async Function Return Values',
        code: `async function func1() {
  return 1;
}
async function func2() {
  return Promise.resolve(2);
}

func1().then(console.log);
func2().then(console.log);
console.log(3);`,
        options: [
            "3, 1, 2",
            "1, 2, 3",
            "3, 2, 1",
            "1, 3, 2"
        ],
        correctAnswer: 0,
        explanation: `Async functions always return Promises. console.log(3) is synchronous. The then callbacks run as microtasks afterward in order scheduled, logging 1 then 2.`
    },
    {
        id: 's14',
        title: 'Promise.finally Behavior',
        code: `Promise.resolve('Success')
  .finally(() => {
    console.log('Finally 1');
    return 'This will be ignored';
  })
  .then((value) => {
    console.log('Then 1:', value);
  })
  .finally(() => {
    console.log('Finally 2');
    throw new Error('Finally error');
  })
  .then((value) => {
    console.log('Then 2:', value);
  })
  .catch((error) => {
    console.log('Catch:', error.message);
  });`,
        options: [
            "Finally 1, Then 1: Success, Finally 2, Catch: Finally error",
            "Finally 1, Finally 2, Then 1: Success, Catch: Finally error",
            "Finally 1, Then 1: Success, Catch: Finally error, Finally 2",
            "Then 1: Success, Finally 1, Finally 2, Catch: Finally error"
        ],
        correctAnswer: 0,
        explanation: `finally ignores returned values but propagates throws. First finally logs, value remains 'Success' for then. Second finally throws, causing rejection; next then is skipped and catch logs "Finally error".`
    },
    {
        id: 's15',
        title: 'Complex Event Loop Ordering',
        code: `console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => console.log('Promise in Timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => console.log('Timeout in Promise'), 0);
  })
  .then(() => {
    console.log('Promise 2');
  });

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');`,
        options: [
            "Start, End, Promise 1, Promise 2, Timeout 1, Promise in Timeout, Timeout 2",
            "Start, Promise 1, Promise 2, End, Timeout 1, Timeout 2, Promise in Timeout",
            "Start, End, Timeout 1, Promise in Timeout, Promise 1, Promise 2, Timeout 2",
            "Start, End, Promise 1, Timeout 1, Promise 2, Promise in Timeout, Timeout 2"
        ],
        correctAnswer: 0,
        explanation: `Synchronous logs: Start, End. Microtasks from initial Promise: Promise 1 (schedules another timeout), then Promise 2. First macrotask: Timeout 1, which schedules a microtask that logs Promise in Timeout before moving to next macrotask Timeout 2.`
    },
    {
        id: 's16',
        title: 'Executor Sync, Resolve Async',
        code: `const promise = new Promise((resolve, reject) => {
  console.log('Executor start');
  
  setTimeout(() => {
    console.log('Timeout in executor');
    resolve('Done');
  }, 0);
  
  console.log('Executor end');
});
promise.then((value) => {
  console.log('Then:', value);
});
console.log('After promise creation');`,
        options: [
            "Executor start, Executor end, After promise creation, Timeout in executor, Then: Done",
            "Executor start, Timeout in executor, Executor end, Then: Done, After promise creation",
            "Executor start, Executor end, Timeout in executor, After promise creation, Then: Done",
            "Executor start, After promise creation, Executor end, Timeout in executor, Then: Done"
        ],
        correctAnswer: 0,
        explanation: `Promise executor runs immediately, logging start and end. setTimeout schedules resolve. After construction, synchronous code logs "After promise creation". Then the timeout fires, logs, resolves, and the queued then microtask logs "Then: Done".`
    }
];