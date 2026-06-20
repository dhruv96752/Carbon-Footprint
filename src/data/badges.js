// Achievement badges — earned through streaks, actions committed,
// footprint reduction milestones, and challenge completion.

import { WORLD_AVERAGE, PARIS_TARGET } from './countries';

export const LEVELS = [
  { id: 0, name: 'Seed',   minXP: 0,    icon: '🌱', color: '#bdb6a0' },
  { id: 1, name: 'Sprout', minXP: 100,  icon: '🌿', color: '#8fd993' },
  { id: 2, name: 'Sapling', minXP: 300, icon: '🌳', color: '#58bd61' },
  { id: 3, name: 'Oak',    minXP: 700,  icon: '🏔️', color: '#2fa039' },
  { id: 4, name: 'Guardian', minXP: 1500, icon: '🛡️', color: '#1c6623' },
  { id: 5, name: 'Champion', minXP: 3000, icon: '🏆', color: '#f97a07' },
];

/** Given total XP, return the current level object and the next one. */
export function getLevel(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  return { current, next };
}

/** XP required to reach the next level. */
export function xpToNext(xp) {
  const { next } = getLevel(xp);
  return next ? next.minXP - xp : 0;
}

/** Progress toward next level, 0–1. */
export function levelProgress(xp) {
  const { current, next } = getLevel(xp);
  if (!next) return 1;
  return Math.min(1, (xp - current.minXP) / (next.minXP - current.minXP));
}

// Badge definitions — individual achievements beyond the level system.
export const BADGES = [
  {
    id: 'first_survey',
    name: 'First Step',
    desc: 'Complete your carbon footprint survey',
    icon: '👣',
    condition: ({ completedAt }) => !!completedAt,
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    desc: 'Check in 3 days in a row',
    icon: '🔥',
    condition: ({ streak }) => streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    desc: 'Check in 7 days in a row',
    icon: '⚡',
    condition: ({ streak }) => streak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    desc: '30-day streak — you\'re unstoppable',
    icon: '💎',
    condition: ({ streak }) => streak >= 30,
  },
  {
    id: 'actions_3',
    name: 'Action Taker',
    desc: 'Commit to 3 reduction actions',
    icon: '🎯',
    condition: ({ committedActions }) => (committedActions || []).length >= 3,
  },
  {
    id: 'actions_7',
    name: 'Green Warrior',
    desc: 'Commit to 7 reduction actions',
    icon: '🛡️',
    condition: ({ committedActions }) => (committedActions || []).length >= 7,
  },
  {
    id: 'challenge_first',
    name: 'Challenge Accepted',
    desc: 'Complete your first weekly challenge',
    icon: '🥇',
    condition: ({ challengesCompleted }) => (challengesCompleted || []).length >= 1,
  },
  {
    id: 'chat_first',
    name: 'Curious Mind',
    desc: 'Have your first conversation with Sage',
    icon: '💬',
    condition: ({ chatCount }) => (chatCount || 0) >= 1,
  },
  {
    id: 'below_avg',
    name: 'Below Average',
    desc: 'Get your footprint below your country average',
    icon: '🌍',
    condition: ({ totalTonnes, countryAvg }) =>
      totalTonnes > 0 && totalTonnes < (countryAvg || WORLD_AVERAGE),
  },
  {
    id: 'paris',
    name: 'Paris Aligned',
    desc: 'Reach the 2 tCO2e Paris target',
    icon: '🇫🇷',
    condition: ({ totalTonnes }) => totalTonnes > 0 && totalTonnes <= PARIS_TARGET,
  },
];

/** Evaluate which badges a user has earned. */
export function evaluateBadges(profile) {
  return BADGES.filter((b) => b.condition(profile)).map((b) => ({
    id: b.id,
    name: b.name,
    desc: b.desc,
    icon: b.icon,
  }));
}
