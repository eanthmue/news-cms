import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/utils';

describe('slugify', () => {
  it('should convert text to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('hello world!')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });
});
