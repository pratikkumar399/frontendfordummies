/**
 * Code execution validation and security utilities
 * Prevents execution of potentially malicious code
 */

export interface CodeValidationResult {
  isValid: boolean;
  error?: string;
}

const MAX_CODE_LENGTH = 50 * 1024; // 50KB

/**
 * Dangerous patterns that should be blocked
 * These patterns could be used for malicious purposes
 */
const DANGEROUS_PATTERNS = [
  // Direct eval usage
  /\beval\s*\(/gi,
  /\beval\s*\[/gi,
  
  // Function constructor with string (can be used to bypass restrictions)
  /new\s+Function\s*\(/gi,
  
  // Import/require statements (could load external code)
  /\bimport\s*\(/gi,
  /\brequire\s*\(/gi,
  /\bimport\s+.*\s+from/gi,
  
  // Network requests (could be used for data exfiltration or attacks)
  /\bfetch\s*\(/gi,
  /\bXMLHttpRequest/gi,
  /\baxios\s*\./gi,
  
  // Storage manipulation (could be used for persistence or data theft)
  /\blocalStorage\s*\./gi,
  /\bsessionStorage\s*\./gi,
  /\bindexedDB/gi,
  
  // Cookie manipulation
  /\bdocument\s*\.\s*cookie/gi,
  
  // DOM manipulation that could be used maliciously
  /\bdocument\s*\.\s*write/gi,
  /\bdocument\s*\.\s*writeln/gi,
  /\bwindow\s*\.\s*open/gi,
  /\bwindow\s*\.\s*location\s*\.\s*(href|assign|replace)/gi,
  
  // WebSocket (could be used for communication with external servers)
  /\bWebSocket/gi,
  
  // Worker creation (could be used to run code in background)
  /\bnew\s+Worker\s*\(/gi,
  /\bnew\s+SharedWorker\s*\(/gi,
  
  // Script injection
  /\bcreateElement\s*\(\s*['"]script['"]/gi,
  
  // Potentially dangerous global access
  /\bprocess\s*\./gi,
  /\bglobal\s*\./gi,
  /\bglobalThis\s*\./gi,
  
  // File system access (Node.js specific, but blocking just in case)
  /\bfs\s*\./gi,
  /\breadFile/gi,
  /\bwriteFile/gi,
  
  // Child process execution
  /\bchild_process/gi,
  /\bexec\s*\(/gi,
  /\bspawn\s*\(/gi,
];

/**
 * Validates code before execution
 * @param code - The code string to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateCode(code: string): CodeValidationResult {
  // Check code length
  if (code.length > MAX_CODE_LENGTH) {
    return {
      isValid: false,
      error: `Code is too long. Maximum allowed length is ${MAX_CODE_LENGTH / 1024}KB.`,
    };
  }

  // Check for empty code
  if (!code.trim()) {
    return {
      isValid: false,
      error: 'Code cannot be empty.',
    };
  }

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      const match = code.match(pattern);
      const matchedText = match ? match[0].trim() : 'restricted pattern';
      return {
        isValid: false,
        error: `Code contains restricted pattern: ${matchedText}. This pattern is not allowed for security reasons.`,
      };
    }
  }

  return {
    isValid: true,
  };
}

/**
 * Sanitizes error messages to prevent information leakage
 * @param error - The error object
 * @returns Sanitized error message
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // In production, don't expose stack traces
    if (process.env.NODE_ENV === 'production') {
      return error.message || 'An error occurred while executing the code.';
    }
    return error.toString();
  }
  return String(error);
}

