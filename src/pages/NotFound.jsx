import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Leaf } from 'lucide-react';
import PageTransition from '../components/PageTransition';

/**
 * 404 page — rendered for any unmatched route. Light, on-brand, and offers
 * a clear path back to the dashboard.
 */
export default function NotFound() {
  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-32 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-8xl font-extrabold text-gradient mb-4">404</p>
          <div className="mb-6">
            <Leaf className="mx-auto h-12 w-12 text-leaf-400 animate-sway" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-earth-950 dark:text-white mb-2">
            Page not found
          </h1>
          <p className="text-earth-500 dark:text-earth-400 mb-8 max-w-sm mx-auto">
            Looks like this page went carbon-neutral — it's completely gone.
            Let's get you back to greener pastures.
          </p>
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" aria-hidden="true" /> Return Home
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
