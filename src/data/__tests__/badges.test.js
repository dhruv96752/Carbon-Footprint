import { describe, it, expect } from 'vitest';
import { LEVELS, getLevel, xpToNext, levelProgress, BADGES, evaluateBadges } from '../badges';

describe('LEVELS', () => {
  it('has 6 levels in ascending XP order', () => {
    expect(LEVELS).toHaveLength(6);
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].minXP).toBeGreaterThan(LEVELS[i - 1].minXP);
    }
  });

  it('starts at XP 0', () => {
    expect(LEVELS[0].minXP).toBe(0);
  });

  it('each level has required fields', () => {
    for (const l of LEVELS) {
      expect(l).toHaveProperty('id');
      expect(l).toHaveProperty('name');
      expect(l).toHaveProperty('minXP');
      expect(l).toHaveProperty('icon');
      expect(l).toHaveProperty('color');
    }
  });
});

describe('getLevel', () => {
  it('returns Seed for 0 XP', () => {
    const { current, next } = getLevel(0);
    expect(current.name).toBe('Seed');
    expect(next.name).toBe('Sprout');
  });

  it('returns correct level for 150 XP', () => {
    const { current } = getLevel(150);
    expect(current.name).toBe('Sprout');
  });

  it('returns correct level for 500 XP', () => {
    const { current } = getLevel(500);
    expect(current.name).toBe('Sapling');
  });

  it('returns correct level for 1000 XP', () => {
    const { current } = getLevel(1000);
    expect(current.name).toBe('Oak');
  });

  it('returns Champion for very high XP', () => {
    const { current, next } = getLevel(5000);
    expect(current.name).toBe('Champion');
    expect(next).toBeNull();
  });
});

describe('xpToNext', () => {
  it('calculates XP needed for next level', () => {
    expect(xpToNext(0)).toBe(100);
    expect(xpToNext(100)).toBe(200);
  });

  it('returns 0 at max level', () => {
    expect(xpToNext(5000)).toBe(0);
  });
});

describe('levelProgress', () => {
  it('returns 0 at start of level', () => {
    expect(levelProgress(0)).toBe(0);
  });

  it('returns 1 at max level', () => {
    expect(levelProgress(5000)).toBe(1);
  });

  it('returns correct mid-progress', () => {
    const progress = levelProgress(200);
    expect(progress).toBe(0.5);
  });

  it('clamps to max 1', () => {
    expect(levelProgress(299)).toBeLessThanOrEqual(1);
  });
});

describe('BADGES', () => {
  it('has 10 badges', () => {
    expect(BADGES).toHaveLength(10);
  });

  it('each badge has required fields', () => {
    for (const b of BADGES) {
      expect(b).toHaveProperty('id');
      expect(b).toHaveProperty('name');
      expect(b).toHaveProperty('desc');
      expect(b).toHaveProperty('icon');
      expect(b).toHaveProperty('condition');
      expect(typeof b.condition).toBe('function');
    }
  });

  it('has unique IDs', () => {
    const ids = BADGES.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('evaluateBadges', () => {
  it('returns no badges for empty profile', () => {
    const earned = evaluateBadges({});
    expect(earned).toHaveLength(0);
  });

  it('awards first_survey badge when completedAt exists', () => {
    const earned = evaluateBadges({ completedAt: '2026-01-01' });
    expect(earned.map(b => b.id)).toContain('first_survey');
  });

  it('awards streak badges for streak milestones', () => {
    const earned3 = evaluateBadges({ streak: 3 });
    expect(earned3.map(b => b.id)).toContain('streak_3');
    expect(earned3.map(b => b.id)).not.toContain('streak_7');

    const earned7 = evaluateBadges({ streak: 7 });
    expect(earned7.map(b => b.id)).toContain('streak_3');
    expect(earned7.map(b => b.id)).toContain('streak_7');

    const earned30 = evaluateBadges({ streak: 30 });
    expect(earned30.map(b => b.id)).toContain('streak_30');
  });

  it('awards action badges for committed actions', () => {
    const earned = evaluateBadges({ committedActions: ['carpool', 'cycle_commute', 'pub_transit'] });
    expect(earned.map(b => b.id)).toContain('actions_3');
    expect(earned.map(b => b.id)).not.toContain('actions_7');
  });

  it('awards challenge badge', () => {
    const earned = evaluateBadges({ challengesCompleted: ['meatless_week'] });
    expect(earned.map(b => b.id)).toContain('challenge_first');
  });

  it('awards chat badge', () => {
    const earned = evaluateBadges({ chatCount: 1 });
    expect(earned.map(b => b.id)).toContain('chat_first');
  });

  it('awards below_avg badge', () => {
    const earned = evaluateBadges({ totalTonnes: 3.0, countryAvg: 4.7 });
    expect(earned.map(b => b.id)).toContain('below_avg');
  });

  it('does not award below_avg if above average', () => {
    const earned = evaluateBadges({ totalTonnes: 10.0, countryAvg: 4.7 });
    expect(earned.map(b => b.id)).not.toContain('below_avg');
  });

  it('awards paris badge for footprint at or below 2t', () => {
    const earned = evaluateBadges({ totalTonnes: 1.5 });
    expect(earned.map(b => b.id)).toContain('paris');
  });

  it('does not award paris badge for footprint above 2t', () => {
    const earned = evaluateBadges({ totalTonnes: 5.0 });
    expect(earned.map(b => b.id)).not.toContain('paris');
  });
});
