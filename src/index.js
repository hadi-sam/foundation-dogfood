// Baseline utilities for the dogfood sandbox.
// Work items add to this module (issue → branch → PR → review → merge).

/** Add two numbers. */
export function sum(a, b) {
  return a + b;
}

/** Convert text to a URL-friendly slug. */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
