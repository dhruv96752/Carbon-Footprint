/**
 * Simple skeleton placeholder — shows a shimmer animation while content loads.
 */
export default function Skeleton({ className = '', lines = 1 }) {
  if (lines === 1) {
    return <div className={`skeleton rounded-lg ${className}`} />;
  }
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton rounded-lg ${i === lines - 1 ? 'w-2/3' : 'w-full'} ${className}`}
        />
      ))}
    </div>
  );
}
