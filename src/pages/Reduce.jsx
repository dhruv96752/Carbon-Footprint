import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import actions, { rankActions, DIFFICULTY_LABEL } from '../data/actions';
import { useProfile, useCommittedActions, XP_REWARDS } from '../lib/store';
import { useToast } from '../components/ui/Toast';
import { fmt, fmtTonnes } from '../lib/format';
import { triggerConfetti } from '../components/ui/Confetti';
import PageTransition from '../components/PageTransition';
import NotOnboarded from '../components/NotOnboarded';
import Reveal, { Stagger, staggerItem } from '../components/ui/Reveal';

// High-impact action badge threshold (kg CO2e/year saved).
const HIGH_IMPACT_THRESHOLD = 500;

// Confetti fires once the user commits their 3rd action.
const CONFETTI_COMMIT_THRESHOLD = 2;

const CAT_COLORS = {
  transport: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-950 dark:text-leaf-300',
  diet: 'bg-amber2-100 text-amber2-700 dark:bg-amber2-950 dark:text-amber2-300',
  home: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  lifestyle: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
};

const DIFF_COLORS = {
  1: 'text-leaf-600',
  2: 'text-amber2-600',
  3: 'text-red-600',
};

/**
 * Reduce page — personalised, ranked reduction actions based on the user's
 * biggest emission categories. Users commit/uncommit actions to earn XP and
 * track potential yearly savings. Requires a completed survey.
 */
export default function Reduce() {
  const profile = useProfile();
  const { footprint, hasCompleted, addXP } = profile;
  const { toggle, isCommitted, committed } = useCommittedActions();
  const toast = useToast();

  // useMemo must run before any early return (rules of hooks)
  const ranked = useMemo(
    () => rankActions(footprint?.categories || [], committed),
    [footprint?.categories, committed]
  );

  if (!hasCompleted || !footprint) {
    return (
      <NotOnboarded
        title="Take the survey first"
        desc="We need your lifestyle data to recommend the most impactful actions for you."
      />
    );
  }

  const totalSavings = committed.reduce((sum, id) => {
    const a = actions.find((a) => a.id === id);
    return sum + (a ? a.savings : 0);
  }, 0);

  const handleToggle = (actionId) => {
    const wasCommitted = isCommitted(actionId);
    toggle(actionId);
    if (!wasCommitted) {
      addXP(XP_REWARDS.ACTION_COMMIT);
      toast.success(`+${XP_REWARDS.ACTION_COMMIT} XP — action committed!`);
    } else {
      toast.info('Action removed');
    }
    // Confetti on first 3 commits
    if (!wasCommitted && committed.length === CONFETTI_COMMIT_THRESHOLD) {
      triggerConfetti();
    }
  };

  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-earth-950 dark:text-white mb-3">
              Reduce Your Footprint
            </h1>
            <p className="text-earth-500 dark:text-earth-400 max-w-lg mx-auto">
              Personalised actions ranked by impact for your lifestyle. Commit to ones that fit and track your savings.
            </p>
          </div>
        </Reveal>

        {/* Savings summary */}
        {committed.length > 0 && (
          <Reveal>
            <div className="card border-leaf-200 dark:border-leaf-900 bg-leaf-50/50 dark:bg-leaf-950/20 p-6 mb-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-amber2-500 mb-2" aria-hidden="true" />
              <p className="text-sm font-semibold text-leaf-600 dark:text-leaf-400">
                {committed.length} action{committed.length !== 1 ? 's' : ''} committed
              </p>
              <p className="text-3xl font-extrabold text-earth-950 dark:text-white mt-1">
                {fmtTonnes(totalSavings / 1000)} <span className="text-lg text-earth-500">saved/yr</span>
              </p>
              <p className="mt-1 text-xs text-earth-500">
                {footprint.totalKg > 0 &&
                  `That's ${Math.round((totalSavings / footprint.totalKg) * 100)}% of your current footprint`}
              </p>
            </div>
          </Reveal>
        )}

        {/* Actions grid */}
        <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.05}>
          {ranked.map((action) => {
            const done = isCommitted(action.id);
            return (
              <motion.div
                key={action.id}
                variants={staggerItem}
                className={`card p-5 transition-all duration-200 ${
                  done ? 'border-leaf-300 dark:border-leaf-800 ring-1 ring-leaf-500/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`pill ${CAT_COLORS[action.cat]}`}>
                        {action.cat}
                      </span>
                      <span className={`pill bg-earth-100 dark:bg-earth-800 text-earth-600 dark:text-earth-400 ${DIFF_COLORS[action.difficulty]}`}>
                        {DIFFICULTY_LABEL[action.difficulty]}
                      </span>
                    </div>
                    <h3 className={`font-bold text-earth-950 dark:text-white leading-snug ${
                      done ? 'line-through opacity-70' : ''
                    }`}>
                      {action.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleToggle(action.id)}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 transition-all ${
                      done
                        ? 'border-leaf-500 bg-leaf-500 text-white'
                        : 'border-earth-300 dark:border-earth-600 hover:border-leaf-400'
                    }`}
                    aria-label={done ? `Uncommit ${action.title}` : `Commit ${action.title}`}
                    aria-pressed={done}
                  >
                    {done && <Check className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
                <p className="text-sm text-earth-500 dark:text-earth-400 mb-3">{action.desc}</p>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-leaf-600 dark:text-leaf-400">
                    Saves {fmt(action.savings)} kg CO₂/yr
                  </span>
                  {action.savings > HIGH_IMPACT_THRESHOLD && (
                    <span className="pill bg-amber2-100 text-amber2-700 dark:bg-amber2-950 dark:text-amber2-300 text-[10px]">
                      High impact
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </PageTransition>
  );
}
