import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Reusable animated modal overlay.
 */
export default function Modal({ open, onClose, title, children, className = '' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-earth-950/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className={`relative w-full max-w-lg rounded-2xl bg-white dark:bg-earth-900 border border-earth-100 dark:border-earth-800 shadow-lift p-6 ${className}`}
          >
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-earth-950 dark:text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-lg text-earth-500 hover:bg-earth-100 dark:hover:bg-earth-800 transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
