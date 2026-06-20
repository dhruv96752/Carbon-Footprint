import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Ambient floating-leaf particle background. Purely decorative, GPU-friendly,
 * pointer-events disabled so it never blocks interaction. Respects the user's
 * reduced-motion preference by rendering nothing.
 */
const LEAF_PATH =
  'M12 2C7 4 4 8 4 13a8 8 0 0 0 16 0c0-5-3-9-8-11zm0 4c3 1.6 5 4.4 5 7a5 5 0 0 1-10 0c0-2.6 2-5.4 5-7z';

export default function LeafBackground() {
  // Honor OS-level reduced motion.
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        left: (i * 11 + 6) % 100,
        size: 14 + ((i * 7) % 22),
        delay: (i * 1.7) % 8,
        duration: 14 + ((i * 3) % 12),
        drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 12),
        hue: i % 3, // 0 leaf-400, 1 leaf-500, 2 amber2-400
        opacity: 0.12 + (i % 3) * 0.04,
      })),
    []
  );

  if (reduced) return null;

  const color = (hue) =>
    hue === 2 ? 'rgb(255 163 31)' : hue === 1 ? 'rgb(47 160 57)' : 'rgb(88 189 97)';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {leaves.map((l) => (
        <motion.svg
          key={l.id}
          width={l.size}
          height={l.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color(l.hue)}
          strokeWidth={1.4}
          style={{
            position: 'absolute',
            left: `${l.left}%`,
            bottom: '-40px',
            opacity: l.opacity,
          }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: ['-10vh', '-115vh'],
            x: [0, l.drift, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <path d={LEAF_PATH} fill={color(l.hue)} fillOpacity={0.5} />
        </motion.svg>
      ))}
    </div>
  );
}
