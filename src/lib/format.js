// Date + number formatting utilities.

/** Today's date as YYYY-MM-DD in local time. */
export function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60 * 1000).toISOString().slice(0, 10);
}

/** ISO date → "Jun 20" style. */
export function shortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** ISO date → "June 20, 2026". */
export function longDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** Number with commas. */
export function fmt(n, decimals = 0) {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Tonnes display — smart decimals. */
export function fmtTonnes(tonnes) {
  if (tonnes >= 10) return tonnes.toFixed(1);
  if (tonnes >= 1) return tonnes.toFixed(2);
  return (tonnes * 1000).toFixed(0) + ' kg';
}

/** Pluralise a word. */
export function pluralise(n, one, many) {
  return n === 1 ? one : (many || one + 's');
}

/** Generate a pseudo-random daily index (deterministic per day). */
export function dailyIndex(count) {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return seed % Math.max(1, count);
}
