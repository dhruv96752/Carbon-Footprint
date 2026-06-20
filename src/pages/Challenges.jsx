import { motion } from 'framer-motion';
import {
  Bike,
  ChefHat,
  Droplets,
  Flame,
  Footprints,
  Leaf,
  Lightbulb,
  PlugZap,
  Recycle,
  ShoppingBag,
  Trophy,
} from 'lucide-react';
import { useChallenges, useProfile } from '../lib/store';
import { useToast } from '../components/ui/Toast';
import { triggerConfetti } from '../components/ui/Confetti';
import PageTransition from '../components/PageTransition';
import Reveal, { Stagger, staggerItem } from '../components/ui/Reveal';

const ICON_MAP = {
  Leaf, Bike, Droplets, Recycle, PlugZap, ChefHat, Footprints, Lightbulb, ShoppingBag, Flame,
};

export default function Challenges() {
  const { activeChallenges, increment, getProgress, isCompleted } = useChallenges();
  const { xp, level, streak, addXP } = useProfile();
  const toast = useToast();

  const handleIncrement = (ch) => {
    const wasCompleted = isCompleted(ch.id);
    increment(ch.id);

    if (!wasCompleted && getProgress(ch.id) >= ch.metric.goal) {
      addXP(ch.xp);
      toast.success(`Challenge complete! +${ch.xp} XP 🎉`);
      triggerConfetti();
    }
  };

  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 pill bg-amber2-100 text-amber2-700 dark:bg-amber2-950 dark:text-amber2-300 mb-4">
              <Flame className="h-3.5 w-3.5" /> {streak} day streak
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-earth-950 dark:text-white mb-3">
              Weekly Challenges
            </h1>
            <p className="text-earth-500 dark:text-earth-400 max-w-lg mx-auto">
              Complete challenges to earn XP and level up. These rotate every week — come back for more!
            </p>
          </div>
        </Reveal>

        {/* Stats bar */}
        <Reveal>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-2xl font-extrabold text-leaf-600">{xp}</p>
              <p className="text-xs text-earth-500">Total XP</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-extrabold text-amber2-500">{level.icon}</p>
              <p className="text-xs text-earth-500">{level.name}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-extrabold text-earth-950 dark:text-white">
                {activeChallenges.filter((c) => isCompleted(c.id)).length}/{activeChallenges.length}
              </p>
              <p className="text-xs text-earth-500">Completed</p>
            </div>
          </div>
        </Reveal>

        {/* Challenge cards */}
        <Stagger className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
          {activeChallenges.map((ch) => {
            const Icon = ICON_MAP[ch.icon] || Flame;
            const progress = getProgress(ch.id);
            const done = isCompleted(ch.id);
            const pct = Math.min(100, (progress / ch.metric.goal) * 100);

            return (
              <motion.div
                key={ch.id}
                variants={staggerItem}
                className={`card p-6 flex flex-col transition-all ${
                  done ? 'border-amber2-300 dark:border-amber2-800 ring-1 ring-amber2-500/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${
                    done
                      ? 'bg-amber2-100 dark:bg-amber2-950'
                      : 'bg-leaf-100 dark:bg-leaf-950'
                  }`}>
                    <Icon className={`h-6 w-6 ${done ? 'text-amber2-600' : 'text-leaf-600'}`} />
                  </div>
                  {done && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      <Trophy className="h-6 w-6 text-amber2-500" />
                    </motion.span>
                  )}
                </div>

                <h3 className="font-bold text-earth-950 dark:text-white mb-1">{ch.title}</h3>
                <p className="text-sm text-earth-500 dark:text-earth-400 flex-1 mb-4">{ch.desc}</p>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="h-2 rounded-full bg-earth-100 dark:bg-earth-800 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${done ? 'bg-amber2-500' : 'bg-leaf-500'}`}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-earth-500 text-center">
                    {progress} / {ch.metric.goal} {ch.metric.unit}
                  </p>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleIncrement(ch)}
                  disabled={done}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    done
                      ? 'bg-amber2-100 text-amber2-600 cursor-default'
                      : 'bg-leaf-600 text-white hover:bg-leaf-500 active:translate-y-0'
                  }`}
                >
                  {done ? 'Completed!' : `Log +1 ${ch.metric.unit}`}
                </button>

                <p className="mt-2 text-center text-xs font-semibold text-amber2-600 dark:text-amber2-400">
                  +{ch.xp} XP
                </p>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </PageTransition>
  );
}
