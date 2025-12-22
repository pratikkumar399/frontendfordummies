export const DEBOUNCE_STARTER_CODE = `function debounce(func, wait) {
  // Your implementation here

}

// Test cases -> comment and test one by one
console.log('=== Test 1: Basic Debouncing ===');
const log = () => console.log('Fired!');
const debouncedLog = debounce(log, 1000);

debouncedLog();
debouncedLog();
debouncedLog(); // Should only fire once after 1s

console.log('=== Test 2: Arguments Preservation ===');
const greet = (name, greeting) => {
  console.log(\`\${greeting}, \${name}!\`);
};
const debouncedGreet = debounce(greet, 500);

debouncedGreet('Alice', 'Hello');
debouncedGreet('Bob', 'Hi');
setTimeout(() => debouncedGreet('Charlie', 'Hey'), 100);
// Should only log: "Hey, Charlie!" after 500ms

console.log('=== Test 3: Multiple Debounced Functions ===');
const func1 = () => console.log('Function 1');
const func2 = () => console.log('Function 2');

const debounced1 = debounce(func1, 300);
const debounced2 = debounce(func2, 300);

debounced1();
debounced2();
// Both should fire independently after 300ms

console.log('=== Test 4: Context Preservation ===');
const obj = {
  name: 'TestObject',
  method() {
    console.log(\`Called on \${this.name}\`);
  }
};

const debouncedMethod = debounce(obj.method.bind(obj), 400);
debouncedMethod();
// Should log: "Called on TestObject" after 400ms

console.log('=== Test 5: Rapid Calls ===');
let callCount = 0;
const countCalls = () => {
  callCount++;
  console.log(\`Call count: \${callCount}\`);
};

const debouncedCount = debounce(countCalls, 200);

// Rapid calls
for (let i = 0; i < 10; i++) {
  setTimeout(() => debouncedCount(), i * 50);
}
// Should only log once: "Call count: 1" after all rapid calls

console.log('=== Test 6: Wait Time of 0 ===');
const immediate = () => console.log('Immediate execution');
const debouncedImmediate = debounce(immediate, 0);

debouncedImmediate();
debouncedImmediate();
// Should still defer to next tick and only fire once
`;

