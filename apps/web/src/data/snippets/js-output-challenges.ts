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
    },
    {
        id: 's7',
        title: 'Method Invocation - this Keyword',
        code: `const obj = {
  name: 'Alice',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

const greetFunc = obj.greet;

obj.greet();
greetFunc();`,
        options: [
            'Hello, Alice, Hello, Alice',
            'Hello, Alice, Hello, undefined',
            'Hello, undefined, Hello, undefined',
            'ReferenceError'
        ],
        correctAnswer: 1,
        explanation: 'When `obj.greet()` is called, `this` refers to `obj`, so it logs "Hello, Alice". However, when we assign `obj.greet` to `greetFunc` and call it as a plain function, `this` defaults to the global object (or `undefined` in strict mode). Since the global object doesn\'t have a `name` property, `this.name` is `undefined`.'
    },
    {
        id: 's8',
        title: 'Arrow Functions and this',
        code: `const obj = {
  name: 'Bob',
  regularFunc: function() {
    console.log('Regular:', this.name);
  },
  arrowFunc: () => {
    console.log('Arrow:', this.name);
  },
  nestedExample: function() {
    const inner = () => {
      console.log('Nested arrow:', this.name);
    };
    inner();
  }
};

obj.regularFunc();
obj.arrowFunc();
obj.nestedExample();`,
        options: [
            'Regular: Bob, Arrow: Bob, Nested arrow: Bob',
            'Regular: Bob, Arrow: undefined, Nested arrow: Bob',
            'Regular: undefined, Arrow: undefined, Nested arrow: undefined',
            'TypeError'
        ],
        correctAnswer: 1,
        explanation: 'Regular functions used as methods have `this` bound to the object. Arrow functions don\'t have their own `this` binding - they capture `this` from their lexical scope. `obj.arrowFunc` captures `this` from the global scope (where there\'s no `name`), while the nested arrow function inside `nestedExample` captures `this` from `nestedExample`, which is bound to `obj`.'
    },
    {
        id: 's9',
        title: 'this in Callbacks',
        code: `const counter = {
  count: 0,
  increment: function() {
    setTimeout(function() {
      this.count++;
      console.log(this.count);
    }, 100);
  },
  incrementWithArrow: function() {
    setTimeout(() => {
      this.count++;
      console.log(this.count);
    }, 100);
  }
};

counter.increment();
counter.incrementWithArrow();`,
        options: [
            '1, 1',
            'NaN, 1',
            '0, 1',
            'ReferenceError'
        ],
        correctAnswer: 1,
        explanation: 'In `increment`, the regular function passed to `setTimeout` loses its `this` binding and `this` refers to the global object. Since the global object doesn\'t have a `count` property, `this.count` is `undefined`, and `undefined++` results in `NaN`. The arrow function in `incrementWithArrow` captures `this` from the surrounding method, so `this` correctly refers to `counter`.'
    },
    {
        id: 's10',
        title: 'Variable Hoisting with var',
        code: `console.log(a);
var a = 5;
console.log(a);

foo();

function foo() {
  console.log('Function foo');
}

bar();

var bar = function() {
  console.log('Function bar');
};`,
        options: [
            'undefined, 5, Function foo, TypeError: bar is not a function',
            '5, 5, Function foo, Function bar',
            'ReferenceError, 5, Function foo, Function bar',
            'undefined, 5, Function foo, Function bar'
        ],
        correctAnswer: 0,
        explanation: '`var` declarations are hoisted but initialized with `undefined`. Function declarations are fully hoisted (including their body), so `foo()` works. However, `var bar = function()` is a function expression - only `var bar` is hoisted (as `undefined`), not the function assignment, so calling `bar()` throws a TypeError.'
    },
    {
        id: 's11',
        title: 'Temporal Dead Zone with let and const',
        code: `console.log(x);
let x = 10;

function test() {
  console.log(y);
  let y = 20;
}

test();

const z = 5;
z = 10;`,
        options: [
            'undefined, undefined, 5',
            '10, 20, 10',
            'ReferenceError: Cannot access \'x\' before initialization',
            'TypeError: Assignment to constant variable'
        ],
        correctAnswer: 2,
        explanation: 'Unlike `var`, `let` and `const` declarations are hoisted but remain in the Temporal Dead Zone (TDZ) until initialized. Accessing `x` before its declaration throws a ReferenceError. The code stops execution at the first error, so subsequent code doesn\'t run. If execution continued, reassigning `const z` would throw a TypeError.'
    },
    {
        id: 's12',
        title: 'Function Hoisting in Block Scopes',
        code: `foo();

if (true) {
  function foo() {
    console.log('Inside if');
  }
}

foo();`,
        options: [
            'Inside if, Inside if',
            'ReferenceError, Inside if',
            'TypeError: foo is not a function, Inside if',
            'Depends on environment - inconsistent behavior'
        ],
        correctAnswer: 3,
        explanation: 'Function declarations inside blocks have inconsistent behavior across JavaScript engines. In modern strict mode, they\'re block-scoped (similar to `let`), so the first call would fail. In non-strict mode, behavior varies. This inconsistency is why many style guides recommend avoiding function declarations inside blocks and using function expressions instead.'
    },
    {
        id: 's13',
        title: 'The Equality Operators',
        code: `console.log(0 == false);
console.log(0 === false);
console.log('' == false);
console.log('' === false);
console.log(null == undefined);
console.log(null === undefined);
console.log('0' == 0);
console.log('0' === 0);`,
        options: [
            'true, false, true, false, true, false, true, false',
            'false, false, false, false, false, false, false, false',
            'true, true, true, true, true, true, true, true',
            'true, false, true, false, false, false, true, false'
        ],
        correctAnswer: 0,
        explanation: 'The `==` operator performs type coercion before comparison, while `===` does not. `0 == false` is `true` because both coerce to `0`. `null == undefined` is `true` (special case), but `null === undefined` is `false` (different types). `\'0\' == 0` is `true` (string coerces to number), but `\'0\' === 0` is `false` (no coercion).'
    },
    {
        id: 's14',
        title: 'Addition Operator Coercion',
        code: `console.log(1 + '2');
console.log('1' + 2);
console.log(1 + 2 + '3');
console.log('1' + 2 + 3);
console.log(1 + 2 + 3);
console.log(true + 1);
console.log(false + 1);
console.log(null + 1);
console.log(undefined + 1);`,
        options: [
            '12, 12, 33, 123, 6, 2, 1, 1, NaN',
            '3, 3, 6, 6, 6, 2, 1, 1, NaN',
            '12, 3, 33, 6, 6, 2, 1, 1, undefined',
            '12, 12, 33, 123, 6, 2, 1, 0, NaN'
        ],
        correctAnswer: 0,
        explanation: 'The `+` operator performs string concatenation if any operand is a string, otherwise numeric addition. Evaluation is left-to-right: `1 + 2 + \'3\'` becomes `3 + \'3\'` = `\'33\'`, while `\'1\' + 2 + 3` becomes `\'12\' + 3` = `\'123\'`. Booleans and `null` coerce to numbers (`true`=1, `false`=0, `null`=0), but `undefined` becomes `NaN`.'
    },
    {
        id: 's15',
        title: 'Comparison Operator Coercion',
        code: `console.log('10' > 9);
console.log('10' > '9');
console.log('2' > '12');
console.log([] == false);
console.log([] == 0);
console.log([1] == 1);
console.log([1, 2] == '1,2');`,
        options: [
            'true, false, true, true, true, true, true',
            'true, true, false, false, false, false, false',
            'true, true, false, true, true, true, true',
            'false, false, true, false, false, false, false'
        ],
        correctAnswer: 0,
        explanation: 'When comparing mixed types, JavaScript converts to numbers: `\'10\' > 9` becomes `10 > 9` = `true`. String-to-string comparisons are lexicographic: `\'10\' > \'9\'` compares first characters (`\'1\'` < `\'9\'`) = `false`. Arrays coerce to strings then numbers: `[]` → `\'\'` → `0`, so `[] == false` and `[] == 0` are both `true`. `[1]` → `\'1\'` → `1`, and `[1,2]` → `\'1,2\'`.'
    },
    {
        id: 's16',
        title: 'Closure with Var in Loops',
        code: `const functions = [];

for (var i = 0; i < 3; i++) {
  functions.push(function() {
    console.log(i);
  });
}

functions[0]();
functions[1]();
functions[2]();

const functionsFixed = [];

for (let j = 0; j < 3; j++) {
  functionsFixed.push(function() {
    console.log(j);
  });
}

functionsFixed[0]();
functionsFixed[1]();
functionsFixed[2]();`,
        options: [
            '0, 1, 2, 0, 1, 2',
            '3, 3, 3, 0, 1, 2',
            '0, 1, 2, 3, 3, 3',
            '3, 3, 3, 3, 3, 3'
        ],
        correctAnswer: 1,
        explanation: 'With `var`, there\'s only one `i` variable shared across all loop iterations. All functions close over this same `i`, which is `3` when the loop completes. With `let`, each iteration creates a new block-scoped `j` variable. Each function closes over its iteration\'s specific `j` value (0, 1, or 2). This is why `let` was designed to fix this common closure bug.'
    },
    {
        id: 's17',
        title: 'Nested Closures and Shadowing',
        code: `function outer(x) {
  function middle(y) {
    function inner(z) {
      console.log(x + y + z);
    }
    let x = 10;
    inner(3);
  }
  middle(2);
}

outer(1);`,
        options: [
            '6',
            '15',
            '5',
            'ReferenceError'
        ],
        correctAnswer: 1,
        explanation: 'When `inner` accesses `x`, JavaScript searches the scope chain. The `let x = 10` declaration in `middle` shadows (hides) the `x` parameter from `outer`. JavaScript finds `x` in `middle`\'s scope first and uses that value (10), never reaching `outer`\'s `x` (1). So `inner(3)` calculates `10 + 2 + 3 = 15`.'
    },
    {
        id: 's18',
        title: 'Prototype Chain Lookup',
        code: `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log('Hello, I am ' + this.name);
};

const alice = new Person('Alice');
const bob = new Person('Bob');

alice.greet();

delete Person.prototype.greet;

bob.greet();

Person.prototype.greet = function() {
  console.log('Hi, I am ' + this.name);
};

alice.greet();`,
        options: [
            'Hello, I am Alice, Hello, I am Bob, Hi, I am Alice',
            'Hello, I am Alice, TypeError: bob.greet is not a function, Hi, I am Alice',
            'Hello, I am Alice, ReferenceError, Hi, I am Alice',
            'Hello, I am Alice, Hello, I am Bob, Hello, I am Alice'
        ],
        correctAnswer: 1,
        explanation: 'When `alice.greet()` is called, JavaScript finds `greet` on `Person.prototype` via the prototype chain. After deleting `Person.prototype.greet`, `bob.greet()` looks up the chain but doesn\'t find `greet`, so `bob.greet` is `undefined`, and calling it throws a TypeError. When a new `greet` is added to the prototype, all instances immediately see it because they share the same prototype object.'
    },
    {
        id: 's19',
        title: 'Property Lookup and Modification',
        code: `const parent = {
  value: 10,
  increment: function() {
    this.value++;
  }
};

const child = Object.create(parent);

console.log(child.value);
child.increment();
console.log(child.value);
console.log(parent.value);

child.value = 20;
console.log(child.value);
console.log(parent.value);`,
        options: [
            '10, 11, 10, 20, 10',
            '10, 11, 11, 20, 20',
            '10, 11, 10, 20, 20',
            'undefined, 11, 10, 20, 10'
        ],
        correctAnswer: 0,
        explanation: 'Reading `child.value` searches the prototype chain and finds `parent.value` (10). When `child.increment()` is called, `this` refers to `child`. The `++` operator reads `this.value` (10 via prototype) but writes to `child` itself, creating `child.value = 11` without modifying `parent.value`. Assigning `child.value = 20` creates/updates a property on `child`, shadowing the prototype\'s `value`. `parent.value` remains unchanged at 10.'
    },
    {
        id: 's20',
        title: 'Mixed Async Operations',
        code: `console.log('1');

async function async1() {
  console.log('2');
  await async2();
  console.log('3');
}

async function async2() {
  console.log('4');
}

async1();

new Promise(resolve => {
  console.log('5');
  resolve();
}).then(() => {
  console.log('6');
});

setTimeout(() => {
  console.log('7');
}, 0);

console.log('8');`,
        options: [
            '1, 2, 4, 5, 8, 3, 6, 7',
            '1, 2, 4, 5, 8, 6, 3, 7',
            '1, 8, 2, 4, 5, 3, 6, 7',
            '1, 2, 3, 4, 5, 6, 7, 8'
        ],
        correctAnswer: 0,
        explanation: 'Synchronous code runs first: 1, 2, 4, 5, 8. The `await` in `async1` queues the continuation (logging 3) as a microtask. The Promise\'s `then` callback is also a microtask. Microtasks run before macrotasks: 3, 6. Finally, the `setTimeout` callback (macrotask) runs: 7. The key is that all synchronous code completes, then all microtasks, then macrotasks.'
    },
    {
        id: 's21',
        title: 'Microtask Queue Starvation',
        code: `console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    return Promise.resolve();
  })
  .then(() => {
    console.log('Promise 2');
  });

Promise.resolve()
  .then(() => {
    console.log('Promise 3');
  })
  .then(() => {
    console.log('Promise 4');
  });

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');`,
        options: [
            'Start, End, Promise 1, Promise 3, Promise 4, Promise 2, Timeout 1, Timeout 2',
            'Start, End, Promise 1, Promise 2, Promise 3, Promise 4, Timeout 1, Timeout 2',
            'Start, End, Timeout 1, Timeout 2, Promise 1, Promise 2, Promise 3, Promise 4',
            'Start, End, Promise 1, Promise 3, Promise 2, Promise 4, Timeout 1, Timeout 2'
        ],
        correctAnswer: 0,
        explanation: 'Synchronous code runs first: Start, End. Both Promise chains queue their first `then` callbacks as microtasks. When "Promise 1" runs, it returns `Promise.resolve()`, which requires an additional microtask cycle before the next `then` can execute. Meanwhile, "Promise 3" runs and immediately queues "Promise 4" (since it returns `undefined`). After all microtasks complete, macrotasks (setTimeout callbacks) run. Returning a Promise from a `then` callback delays the next `then` in that chain.'
    }
];
