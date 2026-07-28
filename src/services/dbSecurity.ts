import DOMPurify from 'dompurify';

/**
 * dbSecurity.ts - Helper functions for sanitizing and validating user input
 * before persisting to Firestore or process server-side.
 * Protects against XSS, script injection, and invalid payload formats.
 */

/**
 * Advanced DOMPurify sanitization for rich-text, descriptions, and user comments.
 * Safely strips malicious tags/attributes while allowing safe formatting if needed.
 */
export function purgeHtml(input: unknown, allowBasicFormatting = false): string {
  if (typeof input !== 'string') return '';

  // In Node/Server environment without window, fall back to strict regex stripping if DOMPurify requires window
  if (typeof window === 'undefined' && typeof DOMPurify?.sanitize !== 'function') {
    return sanitizeInputString(input);
  }

  try {
    if (allowBasicFormatting) {
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'span'],
        ALLOWED_ATTR: ['class'],
      });
    } else {
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // Strip all HTML tags completely
        ALLOWED_ATTR: [],
      });
    }
  } catch (err) {
    // Fallback if DOMPurify initialization fails in specific headless environments
    return sanitizeInputString(input);
  }
}

/**
 * Sanitizes user comments and feedback using DOMPurify to guarantee XSS safety.
 */
export function sanitizeUserComment(comment: unknown): string {
  return purgeHtml(comment, false);
}

/**
 * Sanitizes rich product descriptions or HTML content safely.
 */
export function sanitizeRichDescription(description: unknown): string {
  return purgeHtml(description, true);
}

/**
 * Sanitizes a string input by removing HTML tags, script blocks,
 * event handlers, and javascript: protocols.
 */
export function sanitizeInputString(input: unknown): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '') // Strip script tags
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip inline javascript URLs
    .replace(/on\w+="[^"]*"/gi, '') // Strip HTML event attributes
    .replace(/on\w+='[^']*'/gi, '')
    .trim();
}

/**
 * Encodes special characters to HTML entities to safely display in UI.
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates and standardizes Iranian phone numbers (e.g., 09123456789).
 */
export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  const digits = phone.replace(/[^\d]/g, '');
  if (/^09\d{9}$/.test(digits)) {
    return digits;
  }
  return sanitizeInputString(phone);
}

/**
 * Sanitizes email address inputs.
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) ? trimmed : '';
}

/**
 * Recursively sanitizes all string properties in a Firestore document object using DOMPurify.
 */
export function sanitizeDocData<T extends Record<string, any>>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const result: Record<string, any> = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const cleanKey = purgeHtml(key, false);

    if (typeof value === 'string') {
      result[cleanKey] = purgeHtml(value, false);
    } else if (Array.isArray(value)) {
      result[cleanKey] = value.map((item) =>
        typeof item === 'string'
          ? purgeHtml(item, false)
          : typeof item === 'object' && item !== null
          ? sanitizeDocData(item)
          : item
      );
    } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      result[cleanKey] = sanitizeDocData(value);
    } else {
      result[cleanKey] = value;
    }
  }

  return result as T;
}

