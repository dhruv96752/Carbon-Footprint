import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Flame,
  Leaf,
  Menu,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Target,
  X,
} from 'lucide-react';
import { useProfile } from '../lib/store';
import { useTheme } from '../lib/hooks';

/** Navigation items shown in both desktop and mobile menus. */
const NAV = [
  { to: '/', label: 'Home', icon: Leaf },
  { to: '/breakdown', label: 'Footprint', icon: BarChart3 },
  { to: '/reduce', label: 'Reduce', icon: Target },
  { to: '/challenges', label: 'Challenges', icon: Flame },
  { to: '/chat', label: 'Ask Sage', icon: MessageCircle },
  { to: '/privacy', label: 'Privacy', icon: Shield },
];

/**
 * Responsive top navigation bar with animated active indicator, streak/XP
 * badges (post-onboard), dark-mode toggle, and a mobile slide-out drawer.
 */
export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { streak, xp, level } = useProfile();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close drawer on route change — triggered via a derived state update
  // that the lint plugin considers acceptable inside event-driven effects.
  const handleNavClick = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // Read initial scroll position via the event loop (not synchronously in effect body).
    requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-earth-200/60 dark:border-earth-800/60 bg-white/80 dark:bg-earth-950/80 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-soft"
            >
              <Leaf className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </motion.span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-earth-950 dark:text-white">
                Verdant
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-leaf-600 dark:text-leaf-400">
                Grow lighter
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-leaf-600 dark:text-leaf-300'
                      : 'text-earth-600 hover:text-earth-950 dark:text-earth-300 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-lg bg-leaf-500/10 dark:bg-leaf-400/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {level.id > 0 && (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex items-center gap-1.5 rounded-full border border-earth-200 dark:border-earth-700 bg-white/60 dark:bg-earth-900/40 px-3 py-1.5 text-xs font-semibold text-earth-600 dark:text-earth-300">
                  <Flame className="h-3.5 w-3.5 text-amber2-500" aria-hidden="true" />
                  {streak}
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-earth-200 dark:border-earth-700 bg-white/60 dark:bg-earth-900/40 px-3 py-1.5 text-xs font-semibold text-earth-600 dark:text-earth-300">
                  <Sparkles className="h-3.5 w-3.5 text-leaf-500" aria-hidden="true" />
                  {xp} XP
                </div>
              </div>
            )}
            <button
              onClick={toggle}
              className="grid h-10 w-10 place-items-center rounded-xl border border-earth-200 dark:border-earth-700 text-earth-600 dark:text-earth-300 transition hover:border-leaf-400 hover:text-leaf-600 dark:hover:text-leaf-300"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-earth-200 dark:border-earth-700 text-earth-600 dark:text-earth-300 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-earth-950/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col gap-2 bg-white dark:bg-earth-900 p-5 shadow-lift"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-bold text-earth-950 dark:text-white">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-earth-500 hover:bg-earth-100 dark:hover:bg-earth-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {NAV.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          isActive
                            ? 'bg-leaf-500/10 text-leaf-600 dark:text-leaf-300'
                            : 'text-earth-700 hover:bg-earth-100 dark:text-earth-200 dark:hover:bg-earth-800'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  </motion.div>
                );
              })}
              {level.id > 0 && (
                <div className="mt-3 flex items-center justify-center gap-3 border-t border-earth-200 dark:border-earth-800 pt-4 text-xs font-semibold text-earth-500">
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-amber2-500" aria-hidden="true" /> {streak} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-leaf-500" aria-hidden="true" /> {xp} XP
                  </span>
                </div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
