// Baseline utilities for the dogfood sandbox.
// Work items add to this module (issue → branch → PR → review → merge).

/** Add two numbers. */
export function sum(a, b) {
  return a + b;
}

/** Convert text to a URL-friendly slug. */
export function slugify(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Truncate text to maxLength characters, appending suffix (which counts toward the limit). */
export function truncate(text, maxLength, suffix = '…') {
  const str = String(text ?? '');
  const max = Math.floor(maxLength);
  if (max <= 0) return '';
  if (str.length <= max) return str;
  const available = max - suffix.length;
  if (available < 0) return '';
  return str.slice(0, available) + suffix;
}
