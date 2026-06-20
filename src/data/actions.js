// Personalised reduction actions — each tagged by category with a savings
// estimate (kg CO2e/year) and a difficulty rating (1-3). The Reduce page
// ranks these based on the user's biggest category and committed status.

const actions = [
  // ── Transport ──
  {
    id: 'carpool',
    cat: 'transport',
    title: 'Carpool or rideshare twice a week',
    desc: 'Sharing a ride halves your per-person emissions for that trip.',
    savings: 520,
    difficulty: 1,
  },
  {
    id: 'cycle_commute',
    cat: 'transport',
    title: 'Walk or cycle for short trips (< 3 km)',
    desc: 'Replace the car for nearby errands — it adds up fast.',
    savings: 380,
    difficulty: 1,
  },
  {
    id: 'pub_transit',
    cat: 'transport',
    title: 'Switch to public transport for commuting',
    desc: 'A single bus replaces 40+ cars. Trains are even cleaner.',
    savings: 700,
    difficulty: 2,
  },
  {
    id: 'fly_less',
    cat: 'transport',
    title: 'Replace one short flight with a train',
    desc: 'A 500 km train ride emits ~90% less CO2 than a flight.',
    savings: 280,
    difficulty: 2,
  },
  {
    id: 'work_remote',
    cat: 'transport',
    title: 'Work from home 2 days a week',
    desc: 'Fewer commutes = fewer emissions + more time.',
    savings: 480,
    difficulty: 2,
  },
  {
    id: 'ev_plan',
    cat: 'transport',
    title: 'Plan your next car to be electric or hybrid',
    desc: 'EVs produce ~75% less CO2 over their lifetime in most grids.',
    savings: 1200,
    difficulty: 3,
  },
  // ── Diet ──
  {
    id: 'meat_free_day',
    cat: 'diet',
    title: 'Go meatless 3 days a week',
    desc: 'If everyone did this, food emissions would drop by ~30%.',
    savings: 320,
    difficulty: 1,
  },
  {
    id: 'less_beef',
    cat: 'diet',
    title: 'Swap beef for chicken or plant protein',
    desc: 'Beef produces ~10× the emissions of poultry per kg.',
    savings: 480,
    difficulty: 1,
  },
  {
    id: 'seasonal_local',
    cat: 'diet',
    title: 'Buy seasonal and local produce',
    desc: 'Fewer food miles and cold-storage emissions.',
    savings: 180,
    difficulty: 1,
  },
  {
    id: 'less_dairy',
    cat: 'diet',
    title: 'Try plant-based milk alternatives',
    desc: 'Oat and soy milk produce ~70% less CO2 than dairy.',
    savings: 200,
    difficulty: 1,
  },
  {
    id: 'food_waste',
    cat: 'diet',
    title: 'Plan meals to cut food waste in half',
    desc: 'Food waste alone is ~8% of global emissions.',
    savings: 240,
    difficulty: 1,
  },
  {
    id: 'pescatarian',
    cat: 'diet',
    title: 'Go pescatarian',
    desc: 'Dropping red meat is the single biggest dietary win.',
    savings: 600,
    difficulty: 2,
  },
  {
    id: 'vegetarian',
    cat: 'diet',
    title: 'Go vegetarian',
    desc: 'Eliminates ~40% of a typical food carbon footprint.',
    savings: 900,
    difficulty: 3,
  },
  // ── Home ──
  {
    id: 'led_swap',
    cat: 'home',
    title: 'Switch all bulbs to LED',
    desc: 'LEDs use ~75% less energy than incandescent.',
    savings: 80,
    difficulty: 1,
  },
  {
    id: 'unplug',
    cat: 'home',
    title: 'Unplug devices on standby',
    desc: 'Standby power can be 5–10% of household electricity.',
    savings: 140,
    difficulty: 1,
  },
  {
    id: 'thermostat',
    cat: 'home',
    title: 'Lower thermostat by 2°C in winter',
    desc: 'Each degree saves roughly 6–8% on heating.',
    savings: 200,
    difficulty: 1,
  },
  {
    id: 'cold_wash',
    cat: 'home',
    title: 'Wash clothes in cold water',
    desc: '~90% of washing-machine energy heats the water.',
    savings: 100,
    difficulty: 1,
  },
  {
    id: 'solar',
    cat: 'home',
    title: 'Look into solar panels or green-energy tariff',
    desc: 'Cuts grid electricity carbon to near-zero for your home.',
    savings: 900,
    difficulty: 3,
  },
  {
    id: 'insulate',
    cat: 'home',
    title: 'Improve home insulation',
    desc: 'Up to 25% of heat escapes through uninsulated walls/roof.',
    savings: 400,
    difficulty: 2,
  },
  // ── Lifestyle ──
  {
    id: 'thrifting',
    cat: 'lifestyle',
    title: 'Buy secondhand when possible',
    desc: 'Extends a garment\'s life and avoids new production emissions.',
    savings: 180,
    difficulty: 1,
  },
  {
    id: 'repair',
    cat: 'lifestyle',
    title: 'Repair instead of replacing',
    desc: 'Manufacturing is the most carbon-intensive phase of any product.',
    savings: 120,
    difficulty: 1,
  },
  {
    id: 'recycle',
    cat: 'lifestyle',
    title: 'Start recycling and composting',
    desc: 'Diverts methane-producing organic waste from landfill.',
    savings: 160,
    difficulty: 1,
  },
  {
    id: 'streaming_reduce',
    cat: 'lifestyle',
    title: 'Lower video streaming quality to 720p',
    desc: 'Saves ~50% data-center energy without losing much quality.',
    savings: 100,
    difficulty: 1,
  },
  {
    id: 'shorter_showers',
    cat: 'lifestyle',
    title: 'Cut showers to 5 minutes',
    desc: 'Heating water is a surprising energy hog.',
    savings: 100,
    difficulty: 1,
  },
  {
    id: 'plant_tree',
    cat: 'lifestyle',
    title: 'Plant a tree (or support a planting program)',
    desc: 'A tree absorbs ~22 kg CO2/year. Forests are the ultimate carbon sink.',
    savings: 22,
    difficulty: 1,
  },
];

export default actions;

/** Difficulty labels for display. */
export const DIFFICULTY_LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Ambitious' };

/** Sort actions: biggest-savings first within the user's top category. */
export function rankActions(userCategories, committed = []) {
  const biggest = [...(userCategories || [])].sort((a, b) => b.kg - a.kg)[0]?.id;
  const committedSet = new Set(committed);

  return [...actions]
    .map((a) => ({
      ...a,
      committed: committedSet.has(a.id),
      // Boost score for actions in the user's biggest category.
      score: a.savings * (a.cat === biggest ? 1.5 : 1),
    }))
    .sort((a, b) => b.score - a.score);
}
