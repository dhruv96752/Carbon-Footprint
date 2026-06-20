import { describe, it, expect } from 'vitest';
import { todayISO, shortDate, longDate, fmt, fmtTonnes, pluralise, dailyIndex } from '../format';

describe('todayISO', () => {
  it('returns a YYYY-MM-DD string', () => {
    const result = todayISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('shortDate', () => {
  it('formats ISO date to short form', () => {
    const result = shortDate('2026-06-20');
    expect(result).toBe('Jun 20');
  });

  it('returns empty for null/undefined', () => {
    expect(shortDate(null)).toBe('');
    expect(shortDate(undefined)).toBe('');
  });

  it('returns empty for empty string', () => {
    expect(shortDate('')).toBe('');
  });
});

describe('longDate', () => {
  it('formats ISO date to long form', () => {
    const result = longDate('2026-06-20');
    expect(result).toBe('June 20, 2026');
  });

  it('returns empty for null', () => {
    expect(longDate(null)).toBe('');
  });
});

describe('fmt', () => {
  it('formats with commas and no decimals', () => {
    expect(fmt(1234)).toBe('1,234');
  });

  it('formats with specified decimals', () => {
    expect(fmt(3.14159, 2)).toBe('3.14');
  });

  it('returns dash for null', () => {
    expect(fmt(null)).toBe('—');
  });

  it('returns dash for NaN', () => {
    expect(fmt(NaN)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(fmt(undefined)).toBe('—');
  });

  it('handles zero', () => {
    expect(fmt(0)).toBe('0');
  });
});

describe('fmtTonnes', () => {
  it('formats >=10 with 1 decimal', () => {
    expect(fmtTonnes(15.67)).toBe('15.7');
  });

  it('formats 1-10 with 2 decimals', () => {
    expect(fmtTonnes(3.4)).toBe('3.40');
  });

  it('formats <1 in kg', () => {
    expect(fmtTonnes(0.5)).toBe('500 kg');
  });
});

describe('pluralise', () => {
  it('returns singular for 1', () => {
    expect(pluralise(1, 'day')).toBe('day');
  });

  it('returns default plural for >1', () => {
    expect(pluralise(5, 'day')).toBe('days');
  });

  it('returns custom plural when provided', () => {
    expect(pluralise(2, 'child', 'children')).toBe('children');
  });
});

describe('dailyIndex', () => {
  it('returns a number in range [0, count)', () => {
    for (let i = 0; i < 100; i++) {
      const idx = dailyIndex(10);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(10);
    }
  });

  it('returns 0 when count is 1', () => {
    expect(dailyIndex(1)).toBe(0);
  });

  it('is deterministic (same day)', () => {
    const a = dailyIndex(100);
    const b = dailyIndex(100);
    expect(a).toBe(b);
  });
});
