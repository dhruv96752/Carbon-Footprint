import { Link } from 'react-router-dom';
import { Heart, Leaf, Lock } from 'lucide-react';
import { todayISO } from '../lib/format';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-earth-200/60 dark:border-earth-800/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-leaf-400 to-leaf-700 text-white">
              <Leaf className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-earth-950 dark:text-white">Verdant</p>
              <p className="text-xs text-earth-500">Your carbon companion</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-earth-500">
            <Link to="/breakdown" className="transition hover:text-leaf-600">
              Footprint
            </Link>
            <Link to="/reduce" className="transition hover:text-leaf-600">
              Reduce
            </Link>
            <Link to="/chat" className="transition hover:text-leaf-600">
              Ask Sage
            </Link>
            <Link to="/challenges" className="transition hover:text-leaf-600">
              Challenges
            </Link>
            <Link to="/privacy" className="transition hover:text-leaf-600">
              Privacy
            </Link>
          </nav>

          <div className="flex items-center gap-2 rounded-full border border-earth-200 dark:border-earth-700 bg-white/60 dark:bg-earth-900/40 px-3 py-1.5 text-xs font-semibold text-earth-600 dark:text-earth-300">
            <Lock className="h-3.5 w-3.5 text-leaf-500" />
            100% local · no tracking
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-earth-200/60 dark:border-earth-800/60 pt-6 text-center text-xs text-earth-400">
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-amber2-500" fill="currentColor" /> for a
            lighter planet. Emission estimates are approximate, for awareness.
          </p>
          <p>© {new Date().getFullYear()} Verdant · Session {todayISO()}</p>
        </div>
      </div>
    </footer>
  );
}
