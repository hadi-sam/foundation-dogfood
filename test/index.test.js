import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sum, slugify } from '../src/index.js';

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
