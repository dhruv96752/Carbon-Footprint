import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Target, TrendingDown } from 'lucide-react';
import { useProfile } from '../lib/store';
import { fmtTonnes } from '../lib/format';
import { COUNTRY_AVERAGES, PARIS_TARGET } from '../data/countries';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/ui/Reveal';
import StatCounter from '../components/ui/StatCounter';

/** Animated bar chart — pure CSS + framer-motion. */
function CategoryBar({ label, kg, totalKg, color, delay = 0 }) {
  const pct = totalKg > 0 ? (kg / totalKg) * 100 : 0;
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-earth-800 dark:text-earth-200">{label}</span>
        <span className="font-mono text-earth-600 dark:text-earth-400">
          {fmtTonnes(kg / 1000)} · {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-3 rounded-full bg-earth-100 dark:bg-earth-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}

/** Horizontal comparison bar — user vs a reference value. */
function ComparisonBar({ label, userTonnes, refTonnes, flag, color, delay = 0 }) {
  const max = Math.max(userTonnes, refTonnes, 1);
  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="text-lg">{flag}</span>
        <span className="font-semibold text-earth-800 dark:text-earth-200">{label}</span>
        <span className="ml-auto font-mono text-earth-500 dark:text-earth-400">{fmtTonnes(refTonnes)}</span>
      </div>
      <div className="relative h-2 rounded-full bg-earth-100 dark:bg-earth-800 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-earth-300 dark:bg-earth-700"
          initial={{ width: 0 }}
          whileInView={{ width: `${(refTonnes / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + 0.1 }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${(userTonnes / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}

export default function Breakdown() {
  const profile = useProfile();
  const { footprint, hasCompleted } = profile;
  const totalKg = footprint?.totalKg;
  const totalTonnes = footprint?.totalTonnes;

  // useMemo must run before any early return (rules of hooks)
  const sortedCats = useMemo(
    () => [...(footprint?.categories || [])].sort((a, b) => b.kg - a.kg),
    [footprint?.categories]
  );

  if (!hasCompleted || !footprint) {
    return (
      <PageTransition className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Leaf className="mx-auto h-16 w-16 text-leaf-400 mb-4" />
            <h1 className="text-3xl font-extrabold text-earth-950 dark:text-white mb-3">
              No footprint data yet
            </h1>
            <p className="text-earth-500 dark:text-earth-400 mb-8 max-w-md mx-auto">
              Complete the quick onboarding survey to get your personalised carbon footprint breakdown.
            </p>
            <Link to="/onboard" className="btn-primary">
              Start Survey <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  const biggest = sortedCats[0];

  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-earth-950 dark:text-white mb-3">
              Your Carbon Footprint
            </h1>
            <p className="text-earth-500 dark:text-earth-400 max-w-lg mx-auto">
              A detailed breakdown of your annual greenhouse gas emissions, and how you compare globally.
            </p>
          </div>
        </Reveal>

        {/* Big number */}
        <Reveal>
          <div className="card p-8 text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-2">
              Annual Footprint
            </p>
            <p className="text-5xl sm:text-6xl font-extrabold text-gradient">
              <StatCounter to={totalTonnes} suffix=" tCO₂e" decimals={2} />
            </p>
            <p className="mt-2 text-earth-500 dark:text-earth-400">
              <StatCounter to={totalKg} suffix=" kg" /> of CO₂ equivalent per year
            </p>
          </div>
        </Reveal>

        {/* Category breakdown */}
        <Reveal>
          <div className="card p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-earth-950 dark:text-white mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-leaf-500" />
              Breakdown by Category
            </h2>
            <div className="space-y-5">
              {sortedCats.map((cat, i) => (
                <CategoryBar
                  key={cat.id}
                  label={cat.label}
                  kg={cat.kg}
                  totalKg={totalKg}
                  color={cat.color}
                  delay={i * 0.1}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-earth-400 dark:text-earth-500 text-center">
              Emissions are approximate estimates based on lifestyle factors. Sources: UK BEIS, IPCC AR6.
            </p>
          </div>
        </Reveal>

        {/* Biggest source callout */}
        {biggest && (
          <Reveal>
            <div className="card border-leaf-200 dark:border-leaf-900 bg-leaf-50/50 dark:bg-leaf-950/20 p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-leaf-500/15">
                  <TrendingDown className="h-6 w-6 text-leaf-600" />
                </div>
                <div>
                  <h3 className="font-bold text-leaf-800 dark:text-leaf-300">
                    Your biggest impact area: {biggest.label}
                  </h3>
                  <p className="mt-1 text-sm text-leaf-700 dark:text-leaf-400">
                    {biggest.label} accounts for {fmtTonnes(biggest.tonnes)} tonnes (
                    {Math.round((biggest.kg / Math.max(1, totalKg)) * 100)}%) of your footprint.
                    Small changes here will have the biggest effect.
                  </p>
                  <Link
                    to="/reduce"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-600 dark:text-leaf-400 hover:text-leaf-700 transition"
                  >
                    See personalised actions <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Country comparison */}
        <Reveal>
          <div className="card p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-earth-950 dark:text-white mb-2">
              How You Compare
            </h2>
            <p className="text-sm text-earth-500 mb-6">
              Your footprint vs country per-capita averages. The green bar is you.
            </p>
            <div className="space-y-4">
              {COUNTRY_AVERAGES.map((c, i) => (
                <ComparisonBar
                  key={c.code}
                  label={c.name}
                  userTonnes={totalTonnes}
                  refTonnes={c.value}
                  flag={c.flag}
                  color={totalTonnes <= c.value ? '#2fa039' : '#f97a07'}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Paris target */}
        <Reveal>
          <div className="card border-amber2-200 dark:border-amber2-900 bg-amber2-50/50 dark:bg-amber2-950/20 p-6 text-center">
            <p className="text-3xl mb-2">🇫🇷</p>
            <h3 className="text-lg font-bold text-earth-950 dark:text-white">
              Paris Agreement Target
            </h3>
            <p className="mt-1 text-sm text-earth-500">
              The IPCC recommends ~2 tCO₂e per person per year by 2030 to limit warming to 1.5°C.
            </p>
            <div className="mt-3 flex items-center justify-center gap-4">
              <div>
                <p className="text-2xl font-extrabold text-amber2-600">{PARIS_TARGET}t</p>
                <p className="text-xs text-earth-500">Target</p>
              </div>
              <span className="text-earth-300">vs</span>
              <div>
                <p className="text-2xl font-extrabold text-earth-950 dark:text-white">{totalTonnes.toFixed(1)}t</p>
                <p className="text-xs text-earth-500">You</p>
              </div>
            </div>
            {totalTonnes <= PARIS_TARGET ? (
              <p className="mt-3 text-sm font-semibold text-leaf-600">🎉 You're already Paris-aligned!</p>
            ) : (
              <p className="mt-3 text-sm font-semibold text-amber2-600">
                {totalTonnes.toFixed(1) - PARIS_TARGET}t to go — check Reduce for actions.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
