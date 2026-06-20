import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfile, useCommittedActions, useChallenges, useChatHistory, XP_REWARDS } from '../store';

const sampleAnswers = {
  car: 'car_petrol',
  carKm: 'mid',
  flights: 'short1',
  diet: 'meat_avg',
  localFood: 'sometimes',
  waste: 'some',
  home: 'grid',
  heating: 'moderate',
  appliances: 'mixed',
  shopping: 'regular',
  recycle: 'recycle',
  streaming: 'avg',
  water: 'average',
  household: 'one',
};

describe('XP_REWARDS constant', () => {
  it('exports XP reward values', () => {
    expect(XP_REWARDS).toHaveProperty('SURVEY_COMPLETE');
    expect(XP_REWARDS).toHaveProperty('CHECK_IN_BASE');
    expect(XP_REWARDS).toHaveProperty('STREAK_BONUS_CAP');
    expect(XP_REWARDS).toHaveProperty('ACTION_COMMIT');
  });

  it('all reward values are positive integers', () => {
    for (const key of Object.keys(XP_REWARDS)) {
      expect(Number.isInteger(XP_REWARDS[key])).toBe(true);
      expect(XP_REWARDS[key]).toBeGreaterThan(0);
    }
  });
});

describe('useProfile', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default state with no data', () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.hasCompleted).toBe(false);
    expect(result.current.footprint).toBeNull();
    expect(result.current.streak).toBe(0);
    expect(result.current.xp).toBe(0);
  });

  it('detects completed survey', () => {
    localStorage.setItem('verdant:answers', JSON.stringify(sampleAnswers));
    const { result } = renderHook(() => useProfile());
    expect(result.current.hasCompleted).toBe(true);
  });

  it('computes footprint from answers', () => {
    localStorage.setItem('verdant:answers', JSON.stringify(sampleAnswers));
    const { result } = renderHook(() => useProfile());
    expect(result.current.footprint).not.toBeNull();
    expect(result.current.footprint).toHaveProperty('totalTonnes');
    expect(result.current.footprint).toHaveProperty('totalKg');
    expect(result.current.footprint).toHaveProperty('categories');
  });

  it('completeSurvey sets answers and awards XP', () => {
    const { result } = renderHook(() => useProfile());
    act(() => {
      result.current.completeSurvey(sampleAnswers);
    });
    expect(result.current.hasCompleted).toBe(true);
    expect(result.current.xp).toBe(XP_REWARDS.SURVEY_COMPLETE);
  });

  it('addXP increments XP', () => {
    const { result } = renderHook(() => useProfile());
    act(() => {
      result.current.addXP(50);
    });
    expect(result.current.xp).toBe(50);
  });

  it('computes level from XP', () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.level).toHaveProperty('name');
    expect(result.current.level).toHaveProperty('icon');
  });

  it('computes levelProgress and nextXP', () => {
    const { result } = renderHook(() => useProfile());
    expect(typeof result.current.progress).toBe('number');
    expect(typeof result.current.nextXP).toBe('number');
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(1);
  });

  it('returns badges array', () => {
    const { result } = renderHook(() => useProfile());
    expect(Array.isArray(result.current.badges)).toBe(true);
  });

  it('checkIn returns false when already checked in today', () => {
    // Set lastCheckIn to today's date BEFORE rendering so useState initializer picks it up
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('verdant:lastCheckIn', JSON.stringify(today));
    localStorage.setItem('verdant:streak', JSON.stringify(5));

    const { result } = renderHook(() => useProfile());
    let didCheckIn;
    act(() => {
      didCheckIn = result.current.checkIn();
    });
    expect(didCheckIn).toBe(false);
  });

  it('checkIn increments streak on consecutive day', () => {
    // Set lastCheckIn to yesterday
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const off = yesterday.getTimezoneOffset();
    const yesterdayISO = new Date(yesterday.getTime() - off * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    localStorage.setItem('verdant:lastCheckIn', JSON.stringify(yesterdayISO));
    localStorage.setItem('verdant:streak', JSON.stringify(3));
    localStorage.setItem('verdant:xp', JSON.stringify(50));

    const { result } = renderHook(() => useProfile());
    let didCheckIn;
    act(() => {
      didCheckIn = result.current.checkIn();
    });
    expect(didCheckIn).toBe(true);
    expect(result.current.streak).toBe(4);
  });

  it('resetFreezeUsed resets freeze state', () => {
    localStorage.setItem('verdant:freezeUsed', JSON.stringify(true));
    const { result } = renderHook(() => useProfile());
    expect(result.current.freezeUsed).toBe(true);
    act(() => {
      result.current.resetFreezeUsed();
    });
    expect(result.current.freezeUsed).toBe(false);
  });
});

describe('useCommittedActions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty committed array initially', () => {
    const { result } = renderHook(() => useCommittedActions());
    expect(result.current.committed).toEqual([]);
  });

  it('toggle adds action to committed list', () => {
    const { result } = renderHook(() => useCommittedActions());
    act(() => {
      result.current.toggle('carpool');
    });
    expect(result.current.committed).toContain('carpool');
  });

  it('toggle removes action if already committed', () => {
    const { result } = renderHook(() => useCommittedActions());
    act(() => {
      result.current.toggle('carpool');
      result.current.toggle('carpool');
    });
    expect(result.current.committed).toEqual([]);
  });

  it('isCommitted returns correct boolean', () => {
    const { result } = renderHook(() => useCommittedActions());
    act(() => {
      result.current.toggle('bike');
    });
    expect(result.current.isCommitted('bike')).toBe(true);
    expect(result.current.isCommitted('carpool')).toBe(false);
  });

  it('handles multiple committed actions', () => {
    const { result } = renderHook(() => useCommittedActions());
    act(() => {
      result.current.toggle('a');
      result.current.toggle('b');
      result.current.toggle('c');
    });
    expect(result.current.committed).toHaveLength(3);
    expect(result.current.isCommitted('b')).toBe(true);
  });
});

describe('useChallenges', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns active challenges', () => {
    const { result } = renderHook(() => useChallenges());
    expect(result.current.activeChallenges.length).toBeGreaterThan(0);
  });

  it('initial progress is zero', () => {
    const { result } = renderHook(() => useChallenges());
    const ch = result.current.activeChallenges[0];
    expect(result.current.getProgress(ch.id)).toBe(0);
    expect(result.current.isCompleted(ch.id)).toBe(false);
  });

  it('increment increases progress', () => {
    const { result } = renderHook(() => useChallenges());
    const ch = result.current.activeChallenges[0];
    act(() => {
      result.current.increment(ch.id);
    });
    expect(result.current.getProgress(ch.id)).toBe(1);
  });

  it('marks challenge as completed when goal reached', () => {
    const { result } = renderHook(() => useChallenges());
    const ch = result.current.activeChallenges[0];
    const goal = ch.metric.goal;

    // Increment enough to meet the goal
    act(() => {
      for (let i = 0; i < goal; i++) {
        result.current.increment(ch.id);
      }
    });
    expect(result.current.isCompleted(ch.id)).toBe(true);
    expect(result.current.getProgress(ch.id)).toBe(goal);
  });
});

describe('useChatHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty messages array', () => {
    const { result } = renderHook(() => useChatHistory());
    expect(result.current.messages).toEqual([]);
  });

  it('addMessage adds a message with id and ts', () => {
    const { result } = renderHook(() => useChatHistory());
    let record;
    act(() => {
      record = result.current.addMessage({ role: 'bot', text: 'Hello!' });
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('bot');
    expect(result.current.messages[0].text).toBe('Hello!');
    expect(result.current.messages[0]).toHaveProperty('id');
    expect(result.current.messages[0]).toHaveProperty('ts');
    expect(record.id).toBeDefined();
  });

  it('addMessage returns the created record', () => {
    const { result } = renderHook(() => useChatHistory());
    let record;
    act(() => {
      record = result.current.addMessage({ role: 'user', text: 'Hi' });
    });
    expect(record.text).toBe('Hi');
    expect(record.role).toBe('user');
  });

  it('clearHistory empties messages', () => {
    const { result } = renderHook(() => useChatHistory());
    act(() => {
      result.current.addMessage({ role: 'bot', text: 'Hello' });
      result.current.addMessage({ role: 'user', text: 'Hi' });
    });
    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.messages).toEqual([]);
  });

  it('persists messages across hook re-renders', () => {
    const { result, rerender } = renderHook(() => useChatHistory());
    act(() => {
      result.current.addMessage({ role: 'bot', text: 'Saved' });
    });
    // Unmount and remount
    rerender();
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toBe('Saved');
  });
});
