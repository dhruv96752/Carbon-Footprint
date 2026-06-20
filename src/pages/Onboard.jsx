import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { STEPS } from '../data/survey';
import { calculateFootprint } from '../data/engine';
import { useProfile } from '../lib/store';
import { useToast } from '../components/ui/Toast';
import PageTransition from '../components/PageTransition';

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

export default function Onboard() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [dir, setDir] = useState(1);
  const { completeSurvey } = useProfile();
  const toast = useToast();
  const navigate = useNavigate();

  const step = STEPS[idx];
  const total = STEPS.length;
  const progress = ((idx + 1) / total) * 100;

  const select = (optionId) => {
    setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
  };

  const canNext = answers[step.id] != null;
  const isLast = idx === total - 1;

  const goNext = () => {
    if (isLast) {
      // Calculate and save
      const fp = calculateFootprint(answers);
      completeSurvey(answers);
      toast.success(`Your footprint: ${fp.totalTonnes.toFixed(2)} tCO₂e/year`);
      navigate('/');
      return;
    }
    setDir(1);
    setIdx((i) => i + 1);
  };

  const goBack = () => {
    if (idx > 0) {
      setDir(-1);
      setIdx((i) => i - 1);
    }
  };

  // Compute live preview as they progress
  const liveFP = useMemo(() => {
    if (Object.keys(answers).length < 3) return null;
    return calculateFootprint(answers);
  }, [answers]);

  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-medium text-earth-500 mb-2">
            <span>Question {idx + 1} of {total}</span>
            {liveFP && (
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-leaf-600 dark:text-leaf-400 font-semibold"
              >
                Live estimate: {liveFP.totalTonnes.toFixed(1)} tCO₂e
              </motion.span>
            )}
          </div>
          <div className="h-2 rounded-full bg-earth-200 dark:bg-earth-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-leaf-600"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-2">
                <span className="pill bg-leaf-100 text-leaf-700 dark:bg-leaf-950 dark:text-leaf-300">
                  {step.cat}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white mt-4">
                {step.title}
              </h2>
              <p className="mt-2 text-earth-500 dark:text-earth-400 text-base">
                {step.subtitle}
              </p>

              {/* Options */}
              <div className="mt-6 space-y-3" role="radiogroup" aria-label={step.title}>
                {step.options.map((opt, i) => {
                  const selected = answers[step.id] === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => select(opt.id)}
                      role="radio"
                      aria-checked={selected}
                      className={`w-full text-left rounded-xl border-2 px-5 py-4 transition-all duration-200 ${
                        selected
                          ? 'border-leaf-500 bg-leaf-50 dark:bg-leaf-950/40 shadow-glow'
                          : 'border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-900 hover:border-leaf-300 dark:hover:border-leaf-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
                            selected
                              ? 'border-leaf-500 bg-leaf-500 text-white'
                              : 'border-earth-300 dark:border-earth-600'
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            selected ? 'text-leaf-700 dark:text-leaf-300' : 'text-earth-800 dark:text-earth-200'
                          }`}>
                            {opt.label}
                          </p>
                          {opt.desc && (
                            <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5">{opt.desc}</p>
                          )}
                        </div>
                        {selected && (
                          <motion.div
                            layoutId={`check-${step.id}`}
                            className="h-2 w-2 rounded-full bg-leaf-500"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={idx === 0}
            className="btn-ghost disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <button
            onClick={goNext}
            disabled={!canNext}
            className={isLast ? 'btn-amber' : 'btn-primary'}
          >
            {isLast ? (
              <>
                <Sparkles className="h-4 w-4" /> See My Footprint
              </>
            ) : (
              <>Next <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
