export const PROMISE_ALL_STARTER_CODE = `const promiseAll = (promises) => {
  // Your implementation here

};

// Test cases -> comment and test one by one
const promises1 = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

promiseAll(promises1)
  .then(val => console.log('Test 1 - All resolved:', val)) // Expected: [1, 2, 3]
  .catch(err => console.error('Test 1 - Error:', err));

const promises2 = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.reject('Error occurred')
];

promiseAll(promises2)
  .then(val => console.log('Test 2 - All resolved:', val))
  .catch(err => console.error('Test 2 - Rejected:', err)); // Expected: Error occurred

const promises3 = [
  Promise.resolve(1),
  42, // Non-Promise value
  Promise.resolve(3)
];

promiseAll(promises3)
  .then(val => console.log('Test 3 - Mixed values:', val)) // Expected: [1, 42, 3]
  .catch(err => console.error('Test 3 - Error:', err));

promiseAll([])
  .then(val => console.log('Test 4 - Empty array:', val)) // Expected: []
  .catch(err => console.error('Test 4 - Error:', err));
`;

