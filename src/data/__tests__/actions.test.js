import { describe, it, expect } from 'vitest';
import actions, { rankActions, DIFFICULTY_LABEL } from '../actions';

describe('actions data', () => {
  it('has actions with required fields', () => {
    for (const a of actions) {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('cat');
      expect(a).toHaveProperty('title');
      expect(a).toHaveProperty('desc');
      expect(a).toHaveProperty('savings');
      expect(a).toHaveProperty('difficulty');
      expect(['transport', 'diet', 'home', 'lifestyle']).toContain(a.cat);
      expect([1, 2, 3]).toContain(a.difficulty);
      expect(typeof a.savings).toBe('number');
      expect(a.savings).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = actions.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has at least 20 actions', () => {
    expect(actions.length).toBeGreaterThanOrEqual(20);
  });

  it('has actions in all 4 categories', () => {
    const cats = new Set(actions.map(a => a.cat));
    expect(cats).toContain('transport');
    expect(cats).toContain('diet');
    expect(cats).toContain('home');
    expect(cats).toContain('lifestyle');
  });
});

describe('DIFFICULTY_LABEL', () => {
  it('has labels for all 3 levels', () => {
    expect(DIFFICULTY_LABEL[1]).toBe('Easy');
    expect(DIFFICULTY_LABEL[2]).toBe('Medium');
    expect(DIFFICULTY_LABEL[3]).toBe('Ambitious');
  });
});

describe('rankActions', () => {
  it('returns all actions sorted by score', () => {
    const categories = [{ id: 'transport', kg: 5000 }];
    const ranked = rankActions(categories, []);
    expect(ranked).toHaveLength(actions.length);
    for (const a of ranked) {
      expect(a).toHaveProperty('score');
      expect(a).toHaveProperty('committed');
    }
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].score).toBeLessThanOrEqual(ranked[i - 1].score);
    }
  });

  it('boosts actions in the biggest category', () => {
    const categories = [{ id: 'transport', kg: 5000 }];
    const ranked = rankActions(categories, []);
    const transportActions = ranked.filter(a => a.cat === 'transport');
    const otherActions = ranked.filter(a => a.cat !== 'transport');
    for (const a of transportActions) {
      expect(a.score).toBe(a.savings * 1.5);
    }
    for (const a of otherActions) {
      expect(a.score).toBe(a.savings);
    }
  });

  it('handles empty categories', () => {
    const ranked = rankActions([], []);
    expect(ranked).toHaveLength(actions.length);
  });

  it('marks committed actions', () => {
    const categories = [{ id: 'diet', kg: 500 }];
    const ranked = rankActions(categories, ['meat_free_day']);
    const meatFree = ranked.find(a => a.id === 'meat_free_day');
    expect(meatFree.committed).toBe(true);
    const evPlan = ranked.find(a => a.id === 'ev_plan');
    expect(evPlan.committed).toBe(false);
  });
});
