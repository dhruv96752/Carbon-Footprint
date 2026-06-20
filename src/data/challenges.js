// Weekly challenges — gamification hooks that keep users coming back.
// Each challenge tracks a goal, unit, and XP reward. The challenges rotate
// weekly based on the current week number of the year.

const challenges = [
  {
    id: 'meatless_week',
    title: 'Meatless Week',
    desc: 'Go entirely meat-free for 7 days. Your tastebuds (and the planet) will thank you.',
    icon: 'Leaf',
    xp: 80,
    category: 'diet',
    metric: { goal: 7, unit: 'meatless days', type: 'counter' },
  },
  {
    id: 'no_car_week',
    title: 'Car-Free Commute',
    desc: 'Walk, cycle or take public transit every day this week.',
    icon: 'Bike',
    xp: 100,
    category: 'transport',
    metric: { goal: 5, unit: 'car-free days', type: 'counter' },
  },
  {
    id: 'cold_shower',
    title: 'Cool Showers',
    desc: 'Turn the temperature down and take shorter showers all week.',
    icon: 'Droplets',
    xp: 60,
    category: 'lifestyle',
    metric: { goal: 7, unit: 'cool showers', type: 'counter' },
  },
  {
    id: 'zero_waste_day',
    title: 'Zero Waste Day',
    desc: 'Produce zero landfill waste for one full day. Compost and recycle are allowed.',
    icon: 'Recycle',
    xp: 90,
    category: 'lifestyle',
    metric: { goal: 1, unit: 'zero-waste day', type: 'counter' },
  },
  {
    id: 'unplug_week',
    title: 'Unplug Everything',
    desc: 'Unplug all chargers and standby devices every night this week.',
    icon: 'PlugZap',
    xp: 50,
    category: 'home',
    metric: { goal: 7, unit: 'nights unplugged', type: 'counter' },
  },
  {
    id: 'local_meals',
    title: 'Local Food Week',
    desc: 'Cook meals using only locally sourced ingredients for 5 days.',
    icon: 'ChefHat',
    xp: 70,
    category: 'diet',
    metric: { goal: 5, unit: 'local meals', type: 'counter' },
  },
  {
    id: 'walk_30',
    title: '30-Minute Walks',
    desc: 'Replace one car trip per day with a 30+ minute walk.',
    icon: 'Footprints',
    xp: 60,
    category: 'transport',
    metric: { goal: 7, unit: 'walk days', type: 'counter' },
  },
  {
    id: 'led_swap',
    title: 'LED Blitz',
    desc: 'Replace at least 5 old bulbs or fixtures with LEDs this week.',
    icon: 'Lightbulb',
    xp: 75,
    category: 'home',
    metric: { goal: 5, unit: 'bulbs swapped', type: 'counter' },
  },
  {
    id: 'secondhand',
    title: 'Thrift Challenge',
    desc: 'Buy or acquire everything secondhand this week — no new purchases.',
    icon: 'ShoppingBag',
    xp: 85,
    category: 'lifestyle',
    metric: { goal: 7, unit: 'secondhand days', type: 'counter' },
  },
  {
    id: 'plant_based_cook',
    title: 'Plant-Based Chef',
    desc: 'Cook 3 entirely plant-based meals from scratch.',
    icon: 'Flame',
    xp: 65,
    category: 'diet',
    metric: { goal: 3, unit: 'plant meals cooked', type: 'counter' },
  },
];

/** Get the current set of 3 rotating challenges based on the week of the year. */
export function getActiveChallenges() {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const picked = [];
  const used = new Set();
  // Pick 3 unique challenges, cycling through the pool.
  for (let i = 0; i < 3; i++) {
    const idx = (weekNum + i * 3) % challenges.length;
    const c = challenges[idx];
    if (!used.has(c.id)) {
      picked.push(c);
      used.add(c.id);
    }
  }
  // Fallback if we somehow got fewer (shouldn't happen with 10 challenges)
  while (picked.length < 3) {
    const c = challenges.find((ch) => !used.has(ch.id));
    if (c) { picked.push(c); used.add(c.id); }
    else break;
  }
  return picked;
}

export default challenges;
