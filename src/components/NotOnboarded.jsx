import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import PageTransition from '../components/PageTransition';

/**
 * Shared empty-state shown when a user lands on a page that needs survey
 * data before it has any. Replaces the duplicated pre-onboard blocks that
 * previously existed in Breakdown, Reduce, and Challenges.
 *
 * @param {object} props
 * @param {string} props.title - Heading text.
 * @param {string} props.desc - Supporting paragraph.
 */
export default function NotOnboarded({ title, desc }) {
  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Leaf className="mx-auto h-16 w-16 text-leaf-400 mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-extrabold text-earth-950 dark:text-white mb-3">
            {title}
          </h1>
          <p className="text-earth-500 dark:text-earth-400 mb-8 max-w-md mx-auto">
            {desc}
          </p>
          <Link to="/onboard" className="btn-primary">
            Start Survey <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
