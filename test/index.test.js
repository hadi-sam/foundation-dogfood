import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sum, slugify, truncate } from '../src/index.js';

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

test('truncate shortens text and appends the default suffix', () => {
  assert.equal(truncate('Hello world', 8), 'Hello w…');
});

test('truncate leaves text untouched when shorter than maxLength', () => {
  assert.equal(truncate('Hi', 5), 'Hi');
});

test('truncate leaves text untouched at the exact boundary', () => {
  assert.equal(truncate('Hello', 5), 'Hello');
});

test('truncate honours a custom suffix that counts toward the limit', () => {
  assert.equal(truncate('Hello world', 9, '...'), 'Hello ...');
});

test('truncate returns empty string when the suffix is longer than maxLength', () => {
  assert.equal(truncate('Hello', 2, '...'), '');
});

test('truncate returns empty string when maxLength is zero', () => {
  assert.equal(truncate('Hello', 0), '');
});

test('truncate returns empty string for empty input', () => {
  assert.equal(truncate('', 5), '');
});

test('truncate returns empty string for null input', () => {
  assert.equal(truncate(null, 5), '');
});

test('truncate returns empty string for undefined input', () => {
  assert.equal(truncate(undefined, 5), '');
});

test('truncate coerces a non-string number that fits within maxLength', () => {
  assert.equal(truncate(2024, 4), '2024');
});

test('truncate coerces and truncates a non-string number that overflows', () => {
  assert.equal(truncate(2024, 3), '20…');
});

test('truncate yields just the suffix when available space is zero', () => {
  assert.equal(truncate('Hello', 1, '…'), '…');
});
