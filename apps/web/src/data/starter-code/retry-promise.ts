export const RETRY_PROMISE_STARTER_CODE = `// Mock API functions for testing
function createMockApi(shouldSucceed = false, delay = 100) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
      if (shouldSucceed) {
        resolve({ statusCode: 200, message: 'Success!' });
      } else {
        reject({
            statusCode: 500,
            message: "Internal Server Error on attempt",
        });
      }
    }, delay);
    });
}

function retry(asyncFn, retries = 3, delay = 0) {
  // Your implementation here
  // Requirements:
  // 1. Execute asyncFn and retry on failure
  // 2. Retry up to 'retries' times
  // 3. Wait 'delay' ms between retries
  // 4. Return the first successful result
  // 5. Reject with last error if all retries fail
}

// Test cases -> comment and test one by one
console.log('=== Test 1: Success on First Try ===');
retry(() => createMockApi(true, 50), 3, 100)
  .then(result => console.log('Test 1 - Success:', result))
  .catch(error => console.error('Test 1 - Error:', error));
// Expected: Success on first attempt

console.log('=== Test 2: Success After Retries ===');
let attemptCount = 0;
const succeedOnThirdTry = () => {
  attemptCount++;
  console.log(\`Attempt \${attemptCount}\`);
  return createMockApi(attemptCount === 3, 50);
};

retry(succeedOnThirdTry, 3, 200)
  .then(result => console.log('Test 2 - Success after retries:', result))
  .catch(error => console.error('Test 2 - Error:', error));
// Expected: Success on third attempt

console.log('=== Test 3: Failure After All Retries ===');
retry(() => createMockApi(false, 50), 3, 100)
  .then(result => console.log('Test 3 - Success:', result))
  .catch(error => console.log('Test 3 - Failed after all retries:', error));
// Expected: Rejection after 3 retries

console.log('=== Test 4: Zero Retries ===');
retry(() => createMockApi(false, 50), 0, 100)
  .then(result => console.log('Test 4 - Success:', result))
  .catch(error => console.log('Test 4 - Failed (zero retries):', error));
// Expected: Should try once and fail

console.log('=== Test 5: With Delay Between Retries ===');
let delayAttemptCount = 0;
const delayedRetry = () => {
  delayAttemptCount++;
  const timestamp = new Date().toISOString();
  console.log(\`Delayed attempt \${delayAttemptCount} at \${timestamp}\`);
  return createMockApi(delayAttemptCount === 2, 50);
};

retry(delayedRetry, 2, 500)
  .then(result => console.log('Test 5 - Success with delay:', result))
  .catch(error => console.log('Test 5 - Error:', error));
// Expected: Should show 500ms delay between attempts

console.log('=== Test 6: Immediate Success After Failures ===');
let mixedAttemptCount = 0;
const mixedResult = () => {
  mixedAttemptCount++;
  return createMockApi(mixedAttemptCount >= 2, 30);
};

retry(mixedResult, 5, 100)
  .then(result => console.log('Test 6 - Success:', result))
  .catch(error => console.log('Test 6 - Error:', error));
// Expected: Success on second attempt
`;

