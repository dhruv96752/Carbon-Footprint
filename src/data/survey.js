// Onboarding survey — the lifestyle questions that drive Verdant's footprint model.
//
// Each option carries a numeric "value" representing an annual CO2e estimate in KG
// for that specific behavior, tagged with a category. The engine (engine.js) sums
// these per-category and converts to tonnes (tCO2e/year).
//
// Factors are conservative approximations derived from UK BEIS / IPCC-style
// public datasets and common per-capita emission models. They're intentionally
// round numbers — the goal is awareness and direction, not audit-grade precision.

export const CATEGORIES = {
  transport: { id: 'transport', label: 'Transport', icon: 'Car', color: '#2fa039' },
  diet: { id: 'diet', label: 'Diet', icon: 'Utensils', color: '#f97a07' },
  home: { id: 'home', label: 'Home Energy', icon: 'Home', color: '#1c6623' },
  lifestyle: { id: 'lifestyle', label: 'Lifestyle', icon: 'ShoppingBag', color: '#58bd61' },
};

export const STEPS = [
  {
    id: 'car',
    cat: 'transport',
    title: 'How do you usually get around?',
    subtitle: 'Daily commuting makes the biggest single difference.',
    type: 'single',
    options: [
      { id: 'car_petrol', label: 'Petrol / diesel car', desc: 'Daily driver', value: 2200 },
      { id: 'car_hybrid', label: 'Hybrid car', desc: 'Lower emissions', value: 1500 },
      { id: 'car_electric', label: 'Electric car', desc: 'Clean grid', value: 600 },
      { id: 'motorbike', label: 'Motorbike / scooter', desc: 'Two wheels', value: 1100 },
      { id: 'public', label: 'Public transport', desc: 'Bus, metro, train', value: 450 },
      { id: 'bike', label: 'Walk / cycle', desc: 'Human powered', value: 30 },
    ],
  },
  {
    id: 'carKm',
    cat: 'transport',
    title: 'How far do you drive each week?',
    subtitle: 'Roughly — include commutes and errands.',
    type: 'single',
    options: [
      { id: 'none', label: 'I don’t drive', value: 0 },
      { id: 'low', label: 'Under 50 km', value: 250 },
      { id: 'mid', label: '50–150 km', value: 700 },
      { id: 'high', label: '150–300 km', value: 1400 },
      { id: 'very', label: 'Over 300 km', value: 2400 },
    ],
  },
  {
    id: 'flights',
    cat: 'transport',
    title: 'How often do you fly?',
    subtitle: 'Flights add up fast — one long-haul is a big chunk.',
    type: 'single',
    options: [
      { id: 'none', label: 'Rarely or never', value: 0 },
      { id: 'short1', label: '1–2 short flights / yr', value: 300 },
      { id: 'short3', label: '3–5 short flights / yr', value: 900 },
      { id: 'long1', label: '1 long-haul flight / yr', value: 1700 },
      { id: 'frequent', label: 'Several long-haul / yr', value: 4500 },
    ],
  },
  {
    id: 'diet',
    cat: 'diet',
    title: 'What does your diet look like?',
    subtitle: 'Beef and dairy are the heaviest hitters.',
    type: 'single',
    options: [
      { id: 'meat_heavy', label: 'Meat at most meals', desc: 'Beef heavy', value: 2500 },
      { id: 'meat_avg', label: 'Meat most days', desc: 'Average omnivore', value: 1700 },
      { id: 'meat_low', label: 'Meat a few times a week', value: 1200 },
      { id: 'pesc', label: 'Pescatarian', desc: 'Fish, no meat', value: 1000 },
      { id: 'veg', label: 'Vegetarian', value: 700 },
      { id: 'vegan', label: 'Vegan', desc: 'Plant based', value: 450 },
    ],
  },
  {
    id: 'localFood',
    cat: 'diet',
    title: 'How much of your food is local & seasonal?',
    subtitle: 'Less transport and storage = less carbon.',
    type: 'single',
    options: [
      { id: 'rarely', label: 'Rarely', value: 280 },
      { id: 'sometimes', label: 'Sometimes', value: 140 },
      { id: 'often', label: 'Often', value: 50 },
      { id: 'mostly', label: 'Almost always', value: 0 },
    ],
  },
  {
    id: 'waste',
    cat: 'diet',
    title: 'How much food do you throw away?',
    subtitle: 'About a third of all food is wasted globally.',
    type: 'single',
    options: [
      { id: 'lots', label: 'A lot', value: 320 },
      { id: 'some', label: 'Some', value: 180 },
      { id: 'little', label: 'A little', value: 80 },
      { id: 'none', label: 'Almost none', value: 0 },
    ],
  },
  {
    id: 'home',
    cat: 'home',
    title: 'What powers your home?',
    subtitle: 'Grid electricity and gas are the main sources.',
    type: 'single',
    options: [
      { id: 'grid', label: 'Standard grid power', value: 1600 },
      { id: 'gas', label: 'Gas heating + grid', value: 2100 },
      { id: 'mixed', label: 'Partly renewable', value: 1100 },
      { id: 'renewable', label: 'Mostly renewable / solar', value: 400 },
      { id: 'shared', label: 'Shared / small space', value: 700 },
    ],
  },
  {
    id: 'heating',
    cat: 'home',
    title: 'How do you heat and cool your space?',
    subtitle: 'Heating and AC dominate household energy.',
    type: 'single',
    options: [
      { id: 'ac_lot', label: 'AC / heating on a lot', value: 900 },
      { id: 'moderate', label: 'Moderate use', value: 500 },
      { id: 'minimal', label: 'Minimal use', value: 200 },
      { id: 'passive', label: 'Hardly ever', value: 0 },
    ],
  },
  {
    id: 'appliances',
    cat: 'home',
    title: 'How energy-efficient is your stuff?',
    subtitle: 'Old frges, lights and standby power add up.',
    type: 'single',
    options: [
      { id: 'old', label: 'Older appliances', value: 420 },
      { id: 'mixed', label: 'A mix', value: 240 },
      { id: 'efficient', label: 'Mostly efficient', value: 120 },
      { id: 'led', label: 'Efficient + LED + off when idle', value: 0 },
    ],
  },
  {
    id: 'shopping',
    cat: 'lifestyle',
    title: 'How often do you buy new clothes & gadgets?',
    subtitle: 'Fast fashion and electronics carry hidden carbon.',
    type: 'single',
    options: [
      { id: 'frequent', label: 'Frequently', value: 700 },
      { id: 'regular', label: 'Regularly', value: 400 },
      { id: 'occasional', label: 'Occasionally', value: 200 },
      { id: 'minimal', label: 'Rarely — I reuse & repair', value: 60 },
    ],
  },
  {
    id: 'recycle',
    cat: 'lifestyle',
    title: 'Do you recycle and compost?',
    subtitle: 'Diverting waste from landfill saves methane.',
    type: 'single',
    options: [
      { id: 'no', label: 'Not really', value: 240 },
      { id: 'recycle', label: 'I recycle', value: 120 },
      { id: 'both', label: 'Recycle + compost', value: 40 },
      { id: 'zero', label: 'Trying for zero waste', value: 0 },
    ],
  },
  {
    id: 'streaming',
    cat: 'lifestyle',
    title: 'How much do you stream & scroll?',
    subtitle: 'Data centres use real energy behind the scenes.',
    type: 'single',
    options: [
      { id: 'heavy', label: 'Hours daily, 4K / heavy', value: 280 },
      { id: 'avg', label: 'Average use', value: 140 },
      { id: 'light', label: 'Light use', value: 60 },
      { id: 'minimal', label: 'Barely', value: 0 },
    ],
  },
  {
    id: 'water',
    cat: 'lifestyle',
    title: 'How mindful are you with water?',
    subtitle: 'Hot water especially takes energy to heat.',
    type: 'single',
    options: [
      { id: 'long_showers', label: 'Long showers, lots of laundry', value: 220 },
      { id: 'average', label: 'Average', value: 120 },
      { id: 'mindful', label: 'Mindful use', value: 60 },
      { id: 'minimal', label: 'Very conservative', value: 0 },
    ],
  },
  {
    id: 'household',
    cat: 'lifestyle',
    title: 'One last thing — how big is your household?',
    subtitle: 'We split shared emissions across the people you live with.',
    type: 'single',
    options: [
      { id: 'one', label: 'Just me', value: 1 },
      { id: 'two', label: '2 people', value: 2 },
      { id: 'three', label: '3 people', value: 3 },
      { id: 'four_plus', label: '4 or more', value: 4 },
    ],
  },
];

// IDs of household members → we divide home & lifestyle shared impact by this.
export const HOUSEHOLD_STEP_ID = 'household';
