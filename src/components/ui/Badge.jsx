import { motion } from 'framer-motion';

/** Single badge display with icon, name, and earned state. */
export default function Badge({ icon, name, desc, earned = true, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-10 w-10 text-lg',
    md: 'h-14 w-14 text-2xl',
    lg: 'h-20 w-20 text-3xl',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center gap-2 ${className}`}
    >
      <div
        className={`grid place-items-center rounded-2xl transition-all ${
          earned
            ? 'bg-gradient-to-br from-amber2-400 to-amber2-600 shadow-amber'
            : 'bg-earth-100 dark:bg-earth-800 opacity-40 grayscale'
        } ${sizes[size]}`}
      >
        <span role="img" aria-label={name}>
          {icon}
        </span>
      </div>
      <div className="text-center">
        <p className={`font-semibold ${earned ? 'text-earth-950 dark:text-white' : 'text-earth-400'}`}>
          {name}
        </p>
        {size !== 'sm' && (
          <p className="mt-0.5 text-xs text-earth-500 dark:text-earth-400 max-w-[100px]">{desc}</p>
        )}
      </div>
    </motion.div>
  );
}

/** Badge grid — show earned vs locked badges. */
export function BadgeGrid({ badges, allBadges }) {
  const earnedIds = new Set(badges.map((b) => b.id));
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
      {allBadges.map((b) => (
        <Badge
          key={b.id}
          icon={b.icon}
          name={b.name}
          desc={b.desc}
          earned={earnedIds.has(b.id)}
        />
      ))}
    </div>
  );
}
