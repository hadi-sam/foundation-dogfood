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

/**
 * Convert a byte count into a human-readable string (base 1024).
 *
 * Picks the largest unit where the value is >= 1, capping at TB
 * (no PB or larger). Returns "0 B" for an input of 0.
 *
 * @param {number} bytes    Non-negative, finite byte count.
 * @param {number} [decimals=2]  Decimal places to keep; clamped to >= 0.
 * @returns {string} e.g. "1.5 KB"
 * @throws {TypeError} If `bytes` is not a non-negative finite number.
 */
export function formatBytes(bytes, decimals = 2) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) {
    throw new TypeError(
      `formatBytes: bytes must be a non-negative finite number, received ${
        typeof bytes === 'number' ? bytes : typeof bytes
      }`,
    );
  }

  if (bytes === 0) {
    return '0 B';
  }

  const dm = Math.max(0, decimals);
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  let value = bytes;
  let i = 0;
  while (value >= k && i < units.length - 1) {
    value /= k;
    i += 1;
  }

  return `${Number.parseFloat(value.toFixed(dm))} ${units[i]}`;
}
