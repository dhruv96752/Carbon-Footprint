import { describe, it, expect } from 'vitest';
import challenges, { getActiveChallenges } from '../challenges';

describe('challenges data', () => {
  it('has challenges with required fields', () => {
    for (const c of challenges) {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('title');
      expect(c).toHaveProperty('desc');
      expect(c).toHaveProperty('icon');
      expect(c).toHaveProperty('xp');
      expect(c).toHaveProperty('category');
      expect(c).toHaveProperty('metric');
      expect(c).toHaveProperty('metric.goal');
      expect(c).toHaveProperty('metric.unit');
      expect(c).toHaveProperty('metric.type');
      expect(typeof c.xp).toBe('number');
      expect(c.xp).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = challenges.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers multiple categories', () => {
    const cats = new Set(challenges.map(c => c.category));
    expect(cats.size).toBeGreaterThanOrEqual(3);
  });
});

describe('getActiveChallenges', () => {
  it('returns exactly 3 challenges', () => {
    const active = getActiveChallenges();
    expect(active).toHaveLength(3);
  });

  it('returns challenges from the pool', () => {
    const active = getActiveChallenges();
    const ids = challenges.map(c => c.id);
    for (const a of active) {
      expect(ids).toContain(a.id);
    }
  });

  it('returns unique challenges (no duplicates)', () => {
    const active = getActiveChallenges();
    const ids = active.map(a => a.id);
    expect(new Set(ids).size).toBe(3);
  });
});
