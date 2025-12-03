import { Snippet } from '@/types/types';

export const JS_OUTPUT_CHALLENGES_SNIPPETS: Snippet[] = [
    {
        id: 's1',
        title: 'Promise Resolve & Reject',
        code: `const promise = new Promise((resolve , reject) => {
    resolve(10);
    reject(20);
    console.log("here");
})

promise.then((value) => {
    console.log(value);
})`,
        options: [
            'here, 10',
            '10, here',
            'here, 20',
            '10'
        ],
        correctAnswer: 0,
        explanation: 'The Promise executor runs synchronously, so "here" is logged first. Once a promise is resolved, it cannot be rejected, so `reject(20)` is ignored. The `.then()` callback runs as a microtask after the synchronous code, logging 10.'
    },
    {
        id: 's2',
        title: 'Promise Reject with Then Handlers',
        code: `const promise = new Promise((resolve , reject) => {
    reject(20);
    console.log("here");
})

promise.then(
  (value) => {
    console.log("ok");
  },
  (value) => {
    console.log(value);
  }
);`,
        options: [
            'here, ok',
            'here, 20',
            '20, here',
            'ok, 20'
        ],
        correctAnswer: 1,
        explanation: 'The Promise executor runs synchronously, logging "here" first. The promise is rejected with 20. The `.then()` method accepts two callbacks: `onFulfilled` and `onRejected`. Since the promise is rejected, the second callback runs, logging 20.'
    },
    {
        id: 's3',
        title: 'Array Equality Comparison',
        code: `let a = [];
let b = [];

console.log(a == b);
console.log(a === b);`,
        options: [
            'true, true',
            'true, false',
            'false, true',
            'false, false'
        ],
        correctAnswer: 3,
        explanation: 'In JavaScript, arrays are objects and are compared by reference, not by value. Even though both arrays are empty, `a` and `b` point to different objects in memory, so both `==` and `===` return `false`.'
    },
    {
        id: 's4',
        title: 'Temporal Dead Zone with Let',
        code: `let temp = 'outer value';
if (true) {
  console.log(temp);
  let temp = 'inner value'; 
  console.log(temp);
}
console.log(temp);`,
        options: [
            'outer value, inner value, outer value',
            'undefined, inner value, outer value',
            'ReferenceError: Cannot access \'temp\' before initialization',
            'outer value, inner value, inner value'
        ],
        correctAnswer: 2,
        explanation: 'The `let` declaration inside the block creates a new `temp` variable that is hoisted to the top of the block but remains in the Temporal Dead Zone (TDZ) until initialized. Accessing `temp` before its declaration throws a ReferenceError.'
    },
    {
        id: 's5',
        title: 'Let and Var Redeclaration',
        code: `let temp = 'outer value';
if (true) {
  console.log(temp);
  var temp = 'inner value';
  console.log(temp);
}
console.log(temp);`,
        options: [
            'outer value, inner value, inner value',
            'outer value, inner value, outer value',
            'SyntaxError: Identifier \'temp\' has already been declared',
            'undefined, inner value, inner value'
        ],
        correctAnswer: 2,
        explanation: 'You cannot redeclare a variable with `var` if it was already declared with `let` in the same scope. Since `var` is function-scoped (or global), it attempts to redeclare `temp` in the same scope as the outer `let temp`, causing a SyntaxError.'
    },
    {
        id: 's6',
        title: 'Var Hoisting in Block',
        code: `var temp = 'outer value';
if (true) {
  console.log(temp);
  var temp = 'inner value'; 
  console.log(temp);
}
console.log(temp);`,
        options: [
            'undefined, inner value, inner value',
            'outer value, inner value, outer value',
            'outer value, inner value, inner value',
            'ReferenceError'
        ],
        correctAnswer: 2,
        explanation: '`var` declarations are function-scoped, not block-scoped. The second `var temp` inside the `if` block does not create a new variable; it refers to the same `temp`. The first log shows "outer value", then `temp` is reassigned to "inner value", so both subsequent logs show "inner value".'
    }
];
