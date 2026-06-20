import { motion } from 'framer-motion';

/**
 * Animated SVG progress ring. Draws from 0 to `progress` (0–1) with a
 * gradient stroke. Used for the footprint score, level progress, etc.
 */
export default function Ring({
  progress = 0,
  size = 180,
  strokeWidth = 12,
  trailColor = 'stroke-earth-200 dark:stroke-earth-800',
  children,
  className = '',
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Trail */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          className={trailColor}
        />
        {/* Progress arc with gradient */}
        <defs>
          <linearGradient id={`ring-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" className="text-leaf-400" />
            <stop offset="100%" stopColor="currentColor" className="text-amber2-400" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={`url(#ring-grad-${size})`}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
