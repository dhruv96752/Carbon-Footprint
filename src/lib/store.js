import { useLocalStorage, useInViewOnce } from './hooks';
import { calculateFootprint, biggestCategory } from '../data/engine';
import { getLevel, levelProgress, xpToNext, evaluateBadges } from '../data/badges';
import { getActiveChallenges } from '../data/challenges';
import { WORLD_AVERAGE } from '../data/countries';
import { todayISO } from './format';

const PREFIX = 'verdant:';

// ─── Profile store ────────────────────────────────────────────────────────
// Central profile: survey answers, streak, XP, badges, computed footprint.

export function useProfile() {
  const [answers, setAnswers] = useLocalStorage(PREFIX + 'answers', {});
  const [completedAt, setCompletedAt] = useLocalStorage(PREFIX + 'completedAt', null);
  const [streak, setStreak] = useLocalStorage(PREFIX + 'streak', 0);
  const [lastCheckIn, setLastCheckIn] = useLocalStorage(PREFIX + 'lastCheckIn', null);
  const [xp, setXp] = useLocalStorage(PREFIX + 'xp', 0);
  const [freezeUsed, setFreezeUsed] = useLocalStorage(PREFIX + 'freezeUsed', false);

  // Badge-relevant data: read the same localStorage keys directly. This avoids
  // calling the composite hooks (which return objects, not tuples) and keeps a
  // single source of truth. useLocalStorage keeps instances in sync via the
  // 'storage' event, so these stay current with useCommittedActions/useChallenges.
  const [committed] = useLocalStorage(PREFIX + 'committed', []);
  const [challengeState] = useLocalStorage(PREFIX + 'challenges', { completed: [], active: {} });
  const [chatMessages] = useLocalStorage(PREFIX + 'chat', []);

  const hasCompleted = Object.keys(answers).length > 0;
  const footprint = hasCompleted ? calculateFootprint(answers) : null;
  const biggest = footprint ? biggestCategory(footprint.categories) : null;

  const levelInfo = getLevel(xp);
  const progress = levelProgress(xp);
  const nextXP = xpToNext(xp);

  // Badge evaluation context
  const badgeContext = {
    completedAt,
    streak,
    xp,
    committedActions: committed,
    challengesCompleted: challengeState.completed || [],
    chatCount: (chatMessages || []).length,
    totalTonnes: footprint?.totalTonnes || 0,
    countryAvg: WORLD_AVERAGE,
  };
  const badges = evaluateBadges(badgeContext);

  // ── Actions ──
  const completeSurvey = (surveyAnswers) => {
    setAnswers(surveyAnswers);
    setCompletedAt(new Date().toISOString());
    addXP(20); // bonus XP for completing the survey
  };

  // ── Streak management ──
  const checkIn = () => {
    const today = todayISO();
    if (lastCheckIn === today) return false; // already checked in today
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().slice(0, 10);

    if (lastCheckIn === yesterdayISO) {
      // Consecutive day — extend streak
      setStreak((s) => s + 1);
    } else if (lastCheckIn && lastCheckIn !== todayISO() && freezeUsed === false) {
      // Missed a day but have freeze available — use it
      setFreezeUsed(true);
      setStreak((s) => s + 1);
    } else {
      // Streak broken, restart
      setStreak(1);
      setFreezeUsed(false);
    }
    setLastCheckIn(today);
    addXP(10 + Math.min(streak, 30)); // streak bonus XP
    return true;
  };

  const resetFreezeUsed = () => setFreezeUsed(false);

  const addXP = (amount) => {
    setXp((prev) => prev + amount);
  };

  return {
    answers,
    setAnswers,
    completedAt,
    hasCompleted,
    completeSurvey,
    footprint,
    biggest,
    streak,
    lastCheckIn,
    checkIn,
    freezeUsed,
    resetFreezeUsed,
    xp,
    addXP,
    level: levelInfo.current,
    levelInfo,
    progress,
    nextXP,
    badges,
  };
}

// ─── Committed actions store ─────────────────────────────────────────────

export function useCommittedActions() {
  const [committed, setCommitted] = useLocalStorage(PREFIX + 'committed', []);
  const toggle = (actionId) =>
    setCommitted((prev) =>
      prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId]
    );
  const isCommitted = (actionId) => committed.includes(actionId);
  return { committed, toggle, isCommitted };
}

// ─── Challenges progress store ────────────────────────────────────────────

export function useChallenges() {
  const [progress, setProgress] = useLocalStorage(PREFIX + 'challenges', { completed: [], active: {} });
  const activeChallenges = getActiveChallenges();

  const increment = (challengeId) => {
    setProgress((prev) => {
      const current = prev.active[challengeId] || 0;
      const challenge = activeChallenges.find((c) => c.id === challengeId);
      if (!challenge) return prev;
      const newCount = current + 1;

      const newCompleted = [...prev.completed];
      let newActive = { ...prev.active, [challengeId]: newCount };

      if (newCount >= challenge.metric.goal && !newCompleted.includes(challengeId)) {
        newCompleted.push(challengeId);
      }
      return { completed: newCompleted, active: newActive };
    });
  };

  const getProgress = (challengeId) => progress.active[challengeId] || 0;
  const isCompleted = (challengeId) => progress.completed.includes(challengeId);

  return { progress, activeChallenges, increment, getProgress, isCompleted };
}

// ─── Chat history store ───────────────────────────────────────────────────

export function useChatHistory() {
  const [messages, setMessages] = useLocalStorage(PREFIX + 'chat', []);
  const addMessage = (msg) => {
    const record = { id: 'msg_' + Date.now(), ts: new Date().toISOString(), ...msg };
    setMessages((prev) => [...prev, record]);
    return record;
  };
  const clearHistory = () => setMessages([]);
  return { messages, addMessage, clearHistory };
}

// Re-export hooks
export { useLocalStorage, useInViewOnce, todayISO };
