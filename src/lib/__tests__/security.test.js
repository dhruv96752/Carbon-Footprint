import { describe, it, expect, beforeEach } from 'vitest';
import { sanitize, dataInventory, wipeAll } from '../security';

describe('sanitize', () => {
  it('strips script tags', () => {
    expect(sanitize('<script>alert("xss")</script>Hello')).toBe('Hello');
  });

  it('strips HTML tags', () => {
    expect(sanitize('<b>bold</b> <a href="evil">link</a>')).toBe('bold link');
  });

  it('strips HTML entities', () => {
    expect(sanitize('test &amp; &lt; &gt;')).toBe('test');
  });

  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });

  it('returns empty for non-string input', () => {
    expect(sanitize(null)).toBe('');
    expect(sanitize(undefined)).toBe('');
    expect(sanitize(123)).toBe('');
    expect(sanitize({})).toBe('');
  });

  it('handles empty string', () => {
    expect(sanitize('')).toBe('');
  });

  it('handles normal text without modification', () => {
    expect(sanitize('Hello world!')).toBe('Hello world!');
  });

  it('strips complex XSS patterns', () => {
    expect(sanitize('<img src=x onerror=alert(1)>test')).toBe('test');
    expect(sanitize('<svg onload=alert(1)>test')).toBe('test');
  });

  it('handles multiline input', () => {
    expect(sanitize('line1\nline2')).toBe('line1\nline2');
  });
});

describe('dataInventory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no verdant data', () => {
    const inv = dataInventory();
    expect(inv).toHaveLength(0);
  });

  it('lists verdant keys with metadata', () => {
    localStorage.setItem('verdant:answers', JSON.stringify({ car: 'bike' }));
    localStorage.setItem('verdant:xp', JSON.stringify(100));
    const inv = dataInventory();
    expect(inv).toHaveLength(2);
    expect(inv.map(i => i.key)).toContain('answers');
    expect(inv.map(i => i.key)).toContain('xp');
    for (const item of inv) {
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('size');
    }
  });

  it('ignores non-verdant keys', () => {
    localStorage.setItem('other_key', 'value');
    const inv = dataInventory();
    expect(inv).toHaveLength(0);
  });
});

describe('wipeAll', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes all verdant keys', () => {
    localStorage.setItem('verdant:answers', '{}');
    localStorage.setItem('verdant:xp', '100');
    localStorage.setItem('other_key', 'keep');
    const count = wipeAll();
    expect(count).toBe(2);
    expect(localStorage.getItem('verdant:answers')).toBeNull();
    expect(localStorage.getItem('verdant:xp')).toBeNull();
    expect(localStorage.getItem('other_key')).toBe('keep');
  });

  it('returns 0 when nothing to wipe', () => {
    const count = wipeAll();
    expect(count).toBe(0);
  });
});
