import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sum, slugify, formatBytes } from '../src/index.js';

test('sum adds two numbers', () => {
  assert.equal(sum(2, 3), 5);
  assert.equal(sum(-1, 1), 0);
});

test('slugify converts title with spaces to slug', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('slugify replaces special characters with hyphens', () => {
  assert.equal(slugify('Hello! @World #2024'), 'hello-world-2024');
});

test('slugify collapses repeated spaces and hyphens', () => {
  assert.equal(slugify('foo   bar'), 'foo-bar');
  assert.equal(slugify('foo---bar'), 'foo-bar');
});

test('slugify trims leading and trailing hyphens', () => {
  assert.equal(slugify('  hello world  '), 'hello-world');
  assert.equal(slugify('!hello world!'), 'hello-world');
});

test('slugify preserves already-lowercase input', () => {
  assert.equal(slugify('hello world'), 'hello-world');
});

test('slugify lowercases mixed case input', () => {
  assert.equal(slugify('Hello WORLD'), 'hello-world');
});

test('slugify returns empty string for empty input', () => {
  assert.equal(slugify(''), '');
});

test('slugify returns empty string for null input', () => {
  assert.equal(slugify(null), '');
});

test('slugify returns empty string for undefined input', () => {
  assert.equal(slugify(undefined), '');
});

test('slugify returns empty string for all-special-character input', () => {
  assert.equal(slugify('!!!@@@###'), '');
});

test('slugify returns empty string for hyphen-only input', () => {
  assert.equal(slugify('---'), '');
});

// --- formatBytes ---------------------------------------------------------

test('formatBytes returns "0 B" for zero', () => {
  assert.equal(formatBytes(0), '0 B');
});

test('formatBytes formats sub-kilobyte values in bytes', () => {
  assert.equal(formatBytes(1), '1 B');
  assert.equal(formatBytes(1023), '1023 B');
});

test('formatBytes crosses the KB boundary at 1024', () => {
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1536), '1.5 KB');
});

test('formatBytes stays in KB just below 1 MB', () => {
  // 1048575 / 1024 = 1023.999..., rounds to 1024 KB at 2 decimals
  assert.equal(formatBytes(1048575), '1024 KB');
});

test('formatBytes crosses the MB boundary at 1048576', () => {
  assert.equal(formatBytes(1048576), '1 MB');
});

test('formatBytes formats GB values', () => {
  assert.equal(formatBytes(1024 ** 3), '1 GB');
});

test('formatBytes formats TB values', () => {
  assert.equal(formatBytes(1024 ** 4), '1 TB');
});

test('formatBytes caps at TB for very large values (no PB)', () => {
  assert.equal(formatBytes(5 * 1024 ** 4), '5 TB');
});

test('formatBytes honors decimals=0 (no decimal places)', () => {
  assert.equal(formatBytes(1024, 0), '1 KB');
  assert.equal(formatBytes(1536, 0), '2 KB');
});

test('formatBytes clamps negative decimals to 0', () => {
  assert.equal(formatBytes(1536, -2), formatBytes(1536, 0));
  assert.equal(formatBytes(1536, -2), '2 KB');
});

test('formatBytes rounds to the requested decimal places', () => {
  // 1500 / 1024 = 1.46484375 -> rounds down to 1.46
  assert.equal(formatBytes(1500), '1.46 KB');
  // 1556 / 1024 = 1.51953125 -> rounds up to 1.52
  assert.equal(formatBytes(1556), '1.52 KB');
});

test('formatBytes respects a custom decimals count', () => {
  assert.equal(formatBytes(1536, 1), '1.5 KB');
  assert.equal(formatBytes(1500, 3), '1.465 KB');
});

test('formatBytes throws TypeError on a negative byte count', () => {
  assert.throws(() => formatBytes(-1), TypeError);
});

test('formatBytes throws TypeError on NaN', () => {
  assert.throws(() => formatBytes(NaN), TypeError);
});

test('formatBytes throws TypeError on Infinity and -Infinity', () => {
  assert.throws(() => formatBytes(Infinity), TypeError);
  assert.throws(() => formatBytes(-Infinity), TypeError);
});

test('formatBytes throws TypeError on a numeric string', () => {
  assert.throws(() => formatBytes('100'), TypeError);
});

test('formatBytes throws TypeError on null and undefined', () => {
  assert.throws(() => formatBytes(null), TypeError);
  assert.throws(() => formatBytes(undefined), TypeError);
});

test('formatBytes throws TypeError on an object', () => {
  assert.throws(() => formatBytes({}), TypeError);
});

test('formatBytes clamps decimals=Infinity to 0 (no RangeError)', () => {
  assert.equal(formatBytes(1536, Infinity), '2 KB');
  assert.equal(formatBytes(1536, -Infinity), '2 KB');
});

test('formatBytes clamps decimals=NaN to 0', () => {
  assert.equal(formatBytes(1536, NaN), '2 KB');
});

test('formatBytes clamps decimals > 100 to 100', () => {
  assert.equal(formatBytes(1536, 101), '1.5 KB');
});

test('formatBytes truncates non-integer decimals', () => {
  assert.equal(formatBytes(1500, 1.7), '1.5 KB');
});
