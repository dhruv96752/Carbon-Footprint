import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Flame,
  Leaf,
  MessageCircle,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  Trophy,
} from 'lucide-react';
import { useProfile, useChallenges } from '../lib/store';
import { useToast } from '../components/ui/Toast';
import { dailyIndex } from '../lib/format';
import { INSIGHTS } from '../data/knowledge';
import { triggerConfetti } from '../components/ui/Confetti';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/ui/Reveal';
import Ring from '../components/ui/Ring';
import Badge from '../components/ui/Badge';

/**
 * Growing tree SVG — morphs based on the user's level.
 * From a small seedling to a full, leafy tree.
 */
function GrowingTree({ level = 0, className = '' }) {
  // Each level adds more visual complexity
  const stages = [
    // Level 0: Seed
    { trunkH: 0, crownR: 0, leaves: 0, color: '#bdb6a0' },
    // Level 1: Sprout
    { trunkH: 20, crownR: 8, leaves: 3, color: '#8fd993' },
    // Level 2: Sapling
    { trunkH: 35, crownR: 16, leaves: 6, color: '#58bd61' },
    // Level 3: Oak
    { trunkH: 50, crownR: 26, leaves: 10, color: '#2fa039' },
    // Level 4: Guardian
    { trunkH: 60, crownR: 34, leaves: 16, color: '#1c6623' },
    // Level 5: Champion
    { trunkH: 70, crownR: 42, leaves: 24, color: '#0d5f17' },
  ];

  const s = stages[Math.min(level, stages.length - 1)];
  const cx = 50;
  const ground = 85;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={`w-full max-w-[200px] ${className}`}
      initial={{ scale: 0.85, opacity: 0.4 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ground */}
      <ellipse cx={cx} cy={ground + 3} rx={30} ry={4} fill="#4a3f2f" opacity="0.15" />

      {/* Trunk */}
      {s.trunkH > 0 && (
        <motion.rect
          x={cx - 3}
          y={ground - s.trunkH}
          width={6 + level}
          height={s.trunkH}
          rx={2}
          fill="#6b4226"
          initial={{ height: 0, y: ground }}
          animate={{ height: s.trunkH, y: ground - s.trunkH }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* Crown / canopy */}
      {s.crownR > 0 && (
        <motion.circle
          cx={cx}
          cy={ground - s.trunkH - s.crownR * 0.5}
          r={s.crownR}
          fill={s.color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* Leaf particles */}
      {Array.from({ length: s.leaves }).map((_, i) => {
        const angle = (i / s.leaves) * Math.PI * 2;
        const r = s.crownR * (0.6 + (i % 3) * 0.2);
        const x = cx + Math.cos(angle) * r;
        const y = (ground - s.trunkH - s.crownR * 0.5) + Math.sin(angle) * r * 0.7;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={2 + (i % 2)}
            fill={i % 2 === 0 ? '#a3e635' : '#22c55e'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
          />
        );
      })}

      {/* Seed (no tree yet) */}
      {level === 0 && (
        <motion.ellipse
          cx={cx}
          cy={ground - 4}
          rx={5}
          ry={3.5}
          fill="#a68a64"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.svg>
  );
}

export default function Home() {
  const {
    hasCompleted,
    footprint,
    streak,
    checkIn,
    xp,
    level,
    progress,
    nextXP,
    badges,
  } = useProfile() || {};

  const { activeChallenges, isCompleted } = useChallenges();
  const toast = useToast();
  const [checkedToday, setCheckedToday] = useState(false);

  const todayInsight = useMemo(
    () => INSIGHTS[dailyIndex(INSIGHTS.length)],
    []
  );

  const handleCheckIn = useCallback(() => {
    const result = checkIn();
    if (result) {
      setCheckedToday(true);
      toast.success(`Day ${streak + 1}! +XP for your streak 🔥`);
      // Confetti on milestones
      if ((streak + 1) % 7 === 0) triggerConfetti();
    }
  }, [checkIn, streak, toast]);

  // If not onboarded, redirect
  if (!hasCompleted) {
    return (
      <PageTransition className="min-h-screen">
        {/* Hero — pre-onboard */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-glow">
                <Leaf className="h-10 w-10" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-earth-950 dark:text-white mb-4">
                Grow a{' '}
                <span className="text-gradient">Lighter</span>{' '}
                Footprint
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-earth-500 dark:text-earth-400 mb-8 leading-relaxed">
                Understand, track, and reduce your carbon emissions through simple actions,
                personalised insights, and an AI companion. 100% private — all data stays in your browser.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/onboard" className="btn-primary text-base px-8 py-4">
                  <Sparkles className="h-5 w-5" />
                  Start Your Journey
                </Link>
                <Link to="/privacy" className="btn-ghost text-base px-8 py-4">
                  <Shield className="h-5 w-5" />
                  How It's Private
                </Link>
              </div>
            </motion.div>

            {/* Feature highlights */}
            <div className="mt-20 grid gap-6 sm:grid-cols-3">
              {[
                { icon: BarChart3, title: 'Track', desc: 'Measure your carbon footprint with a quick lifestyle survey.' },
                { icon: Target, title: 'Reduce', desc: 'Get personalised actions ranked by impact for your life.' },
                { icon: MessageCircle, title: 'Learn', desc: 'Chat with Sage — a local AI that knows your data.' },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                  className="card p-6 text-left"
                >
                  <f.icon className="h-8 w-8 text-leaf-500 mb-3" />
                  <h3 className="font-bold text-earth-950 dark:text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-earth-500 dark:text-earth-400">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  // ── Dashboard for onboarded users ──

  const ringProgress = Math.min(1, footprint?.totalTonnes / 15); // 15t as max scale

  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Top hero strip */}
        <div className="flex flex-col lg:flex-row gap-8 items-center mb-10">
          {/* Growing tree */}
          <Reveal className="flex-shrink-0">
            <div className="card p-6 flex flex-col items-center">
              <GrowingTree level={level.id} className="h-48 w-48" />
              <p className="mt-2 text-sm font-semibold text-earth-500">
                {level.icon} {level.name}
              </p>
            </div>
          </Reveal>

          {/* Ring + stats */}
          <div className="flex-1 flex flex-col items-center lg:items-start gap-6">
            <Reveal>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Footprint ring */}
                <Ring progress={ringProgress} size={160} strokeWidth={14}>
                  <p className="text-3xl font-extrabold text-earth-950 dark:text-white">
                    {footprint?.totalTonnes.toFixed(1)}
                  </p>
                  <p className="text-xs text-earth-500">tCO₂e/yr</p>
                </Ring>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">Level Progress</p>
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-32 rounded-full bg-earth-200 dark:bg-earth-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-amber2-400"
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-earth-600 dark:text-earth-400">
                        {nextXP > 0 ? `${nextXP} XP` : 'MAX'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-earth-600 dark:text-earth-400">
                      <Flame className="h-4 w-4 text-amber2-500" />
                      {streak} day streak
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-earth-600 dark:text-earth-400">
                      <Sparkles className="h-4 w-4 text-leaf-500" />
                      {xp} XP
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Check-in button */}
            <Reveal>
              <motion.button
                onClick={handleCheckIn}
                disabled={checkedToday}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                  checkedToday
                    ? 'bg-leaf-100 text-leaf-600 dark:bg-leaf-950 dark:text-leaf-400 cursor-default'
                    : 'bg-gradient-to-r from-leaf-500 to-leaf-700 text-white shadow-glow hover:shadow-lift'
                }`}
              >
                {checkedToday ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Checked in today!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4" /> Daily Check-in
                  </span>
                )}
              </motion.button>
            </Reveal>
          </div>
        </div>

        {/* Insight of the day */}
        <Reveal>
          <div className="card p-5 mb-8 flex items-start gap-4">
            <span className="text-2xl">{todayInsight.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-earth-500 dark:text-earth-400 mb-1">
                Insight of the day
              </p>
              <p className="text-earth-800 dark:text-earth-200 leading-relaxed">
                {todayInsight.text}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Quick actions */}
        <Reveal>
          <h2 className="text-xl font-bold text-earth-950 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/breakdown', icon: BarChart3, label: 'View Breakdown', color: 'text-leaf-600' },
              { to: '/reduce', icon: TrendingDown, label: 'Reduce Emissions', color: 'text-amber2-600' },
              { to: '/chat', icon: MessageCircle, label: 'Ask Sage', color: 'text-leaf-600' },
              { to: '/challenges', icon: Trophy, label: 'Weekly Challenges', color: 'text-amber2-600' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="card p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-lift group"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-earth-100 dark:bg-earth-800 transition group-hover:bg-leaf-100 dark:group-hover:bg-leaf-950">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-earth-800 dark:text-earth-200">{item.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-earth-400 transition group-hover:text-leaf-500 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Badges row */}
        {badges.length > 0 && (
          <Reveal className="mt-8">
            <h2 className="text-xl font-bold text-earth-950 dark:text-white mb-4">Badges</h2>
            <div className="card p-5">
              <div className="flex flex-wrap gap-4">
                {badges.map((b) => (
                  <Badge key={b.id} icon={b.icon} name={b.name} desc="" earned size="sm" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Active challenges summary */}
        <Reveal className="mt-8">
          <h2 className="text-xl font-bold text-earth-950 dark:text-white mb-4">This Week's Challenges</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {activeChallenges.slice(0, 3).map((ch) => (
              <Link
                key={ch.id}
                to="/challenges"
                className="card p-4 flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${
                  isCompleted(ch.id) ? 'bg-amber2-100 dark:bg-amber2-950' : 'bg-leaf-100 dark:bg-leaf-950'
                }`}>
                  <Flame className={`h-5 w-5 ${isCompleted(ch.id) ? 'text-amber2-600' : 'text-leaf-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-earth-800 dark:text-earth-200 truncate">{ch.title}</p>
                  <p className="text-xs text-earth-500">+{ch.xp} XP</p>
                </div>
                {isCompleted(ch.id) && (
                  <CheckCircle2 className="h-5 w-5 text-amber2-500 shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
