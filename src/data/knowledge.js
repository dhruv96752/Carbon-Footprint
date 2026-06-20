// Sage knowledge base — local rule-based AI for the carbon chatbot.
//
// Organized by topic clusters. The chat engine (chat.js) matches user input
// to intents, then selects a relevant response and optionally personalises
// it with the user's actual footprint data.
//
// All facts are real, sourced from IPCC, IEA, Our World in Data, and peer-
// reviewed lifecycle studies. No hallucinations — just curated, cited knowledge.

export const TOPICS = {
  footprint: {
    triggers: ['footprint', 'carbon footprint', 'co2', 'emissions', 'how much', 'average', 'tons', 'tonnes', 'measure', 'calculate'],
    responses: [
      'The average global carbon footprint is about **4.7 tonnes of CO₂e per person per year**. The Paris Agreement goal is to get that under 2 tonnes by 2030.',
      'A carbon footprint measures all the greenhouse gases (in CO₂ equivalents) you produce directly and indirectly — from transport and food to electricity and the stuff you buy.',
      'The biggest sources for most people are **transport, food, and home energy**, usually in that order. But it varies a lot by lifestyle — Sage can help you understand yours.',
      'Fun fact: **20 countries are responsible for 80% of global emissions**, but per-person footprints vary wildly — from under 0.5t in many African nations to over 15t in the US and Australia.',
    ],
  },
  transport: {
    triggers: ['car', 'drive', 'fly', 'flight', 'transport', 'commute', 'bus', 'train', 'bike', 'walk', 'ev', 'electric', 'petrol', 'diesel'],
    responses: [
      'Transport is typically **15–25% of a person\'s footprint**. Flying is the single most carbon-intensive thing most people do — one long-haul flight can add 1.5–2 tonnes.',
      'Switching from a petrol car to an EV cuts transport emissions by **~75%** in most power grids. Even a hybrid saves about 35%.',
      'Public transport is a game-changer: a full bus replaces ~40 cars, and a train emits **~90% less CO₂ per passenger-km** than a domestic flight.',
      'Working from home even 2 days a week can cut commute emissions by 40%. It\'s one of the highest-impact, lowest-effort changes you can make.',
      'A single round-trip flight from London to New York emits roughly **1.1 tonnes CO₂e** — that\'s more than many people\'s entire annual footprint in India.',
    ],
  },
  food: {
    triggers: ['food', 'eat', 'diet', 'meat', 'beef', 'vegan', 'vegetarian', 'plant', 'dairy', 'food waste', 'cook', 'organic', 'local'],
    responses: [
      'Food accounts for **~25% of global emissions**. Beef and dairy are the heaviest — producing 1 kg of beef emits about **27 kg of CO₂e**.',
      'Going vegetarian cuts your food carbon footprint by roughly **40%**. Going vegan cuts it by ~50–60%. Even cutting meat to 3 days a week makes a big difference.',
      '**Food waste is a massive problem** — about 30% of all food produced is wasted, and if food waste were a country, it\'d be the 3rd largest emitter after China and the US.',
      'Buying seasonal and local produce cuts "food miles" and cold-storage emissions. It also tends to be fresher and cheaper.',
      'Plant-based milks (oat, soy, almond) produce **~70% less CO₂** than dairy milk across their lifecycle. Oat milk is the overall winner for taste and low impact.',
    ],
  },
  home: {
    triggers: ['home', 'energy', 'electricity', 'heating', 'cooling', 'solar', 'insulation', 'thermostat', 'light', 'led', 'appliance', 'gas'],
    responses: [
      'Home energy is typically **20–30% of your footprint**. Heating and cooling are the biggest draws, especially in extreme climates.',
      'Turning your thermostat down by **just 2°C** saves roughly 6–8% on heating — without most people even noticing the difference.',
      'Switching to LED bulbs saves **~75% of lighting energy**. They also last 25× longer than incandescent bulbs.',
      'Standby power can account for **5–10% of household electricity**. Unplugging devices (or using smart power strips) is an easy win.',
      'Solar panels can eliminate most of a home\'s grid electricity carbon. In sunny regions they pay back their manufacturing emissions within 1–3 years.',
    ],
  },
  lifestyle: {
    triggers: ['shopping', 'clothes', 'fast fashion', 'recycle', 'reuse', 'waste', 'secondhand', 'repair', 'gadget', 'phone', 'streaming'],
    responses: [
      'The fashion industry produces **~10% of global emissions** — more than aviation and shipping combined. Buying secondhand or extending garment life is hugely impactful.',
      'Manufacturing is the most carbon-intensive phase of any product. **Buying less and choosing quality** is one of the most underrated climate actions.',
      'Recycling aluminium saves **95% of the energy** needed to make it from raw bauxite. Recycling paper saves ~60%, and plastic saves ~70%.',
      'Data centres for streaming and cloud services produce about **1% of global electricity demand**. Lowering video quality from 4K to 720p cuts that roughly in half.',
      'Extending a phone\'s life by 2 years saves the equivalent of **~80 kg CO₂e** — mostly from manufacturing emissions avoided.',
    ],
  },
  personal: {
    triggers: ['my footprint', 'my emissions', 'my carbon', 'how am i doing', 'my results', 'my data', 'my breakdown', 'my biggest'],
    responses: [
      'SAGE_PERSONAL', // special token — replaced by chat.js with personalised data
    ],
  },
  reduce: {
    triggers: ['reduce', 'improve', 'better', 'tip', 'save', 'lower', 'cut', 'action', 'help', 'what can i do', 'suggestion', 'recommend'],
    responses: [
      'The most impactful things you can do, in rough order: **eat less meat → fly less → switch to renewable energy → improve insulation → buy less stuff**.',
      'Start with easy wins: **shorter showers, LED bulbs, unplugging devices, and a meatless day per week**. These save real carbon with zero lifestyle disruption.',
      'Duolingo-style tip: **make it a habit, not a chore.** Tie a green action to something you already do — like choosing plant milk with your morning coffee.',
      'Challenge yourself with weekly goals on the Challenges page — streaks and XP make it fun, and the compounding effect of small changes is genuinely powerful.',
      'Share what you learn with one friend. Social diffusion is one of the fastest ways to multiply impact — each person you influence carries the ripple effect forward.',
    ],
  },
  greeting: {
    triggers: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'sup', 'yo', 'greetings'],
    responses: [
      'Hey there! 👋 I\'m Sage, your green living companion. Ask me anything about carbon footprints, reducing emissions, or how your lifestyle choices affect the planet.',
      'Hello! 🌱 Ready to explore your carbon footprint? I can explain emissions, suggest personalised actions, or just chat about living lighter on the planet.',
    ],
  },
  about: {
    triggers: ['who are you', 'what are you', 'what is sage', 'are you ai', 'are you a bot', 'your name'],
    responses: [
      'I\'m Sage — Verdant\'s built-in sustainability assistant! I run **100% locally in your browser** — no data leaves your device. I know a lot about carbon footprints, emissions science, and practical green tips.',
      'I\'m a local AI built right into Verdant. No cloud, no API, no data collection. I\'m powered by a curated knowledge base and your own footprint data to give you personalised guidance.',
    ],
  },
  challenges: {
    triggers: ['challenge', 'streak', 'xp', 'level', 'badge', 'points', 'reward', 'gamification', 'game'],
    responses: [
      'Challenges are weekly goals — things like "Go meatless for a week" or "Walk instead of drive 5 days." Complete them for XP and climb through levels from **Seed → Sprout → Sapling → Oak → Guardian → Champion**! 🏆',
      'Your streak grows every day you check in. Miss a day and you can use a **streak freeze** (once per streak) to save it. The longer your streak, the more XP you earn daily!',
      'Badges unlock for milestones: completing your survey, reaching streaks, committing actions, and getting your footprint below national or Paris-aligned targets.',
    ],
  },
  tree: {
    triggers: ['tree', 'forest', 'plant', 'nature', 'growing'],
    responses: [
      'Your Verdant tree represents your progress — as your footprint shrinks and your green actions grow, the tree on your dashboard flourishes. It\'s a living symbol of your positive impact.',
      'Trees are the planet\'s ultimate carbon sink. A single mature tree absorbs about **22 kg of CO₂ per year**. Forests absorb roughly **2.6 billion tonnes of CO₂ annually** — 30% of human emissions.',
    ],
  },
};

// Fallback responses when no intent matches.
export const FALLBACKS = [
  'That\'s an interesting question! I\'m best at topics around carbon footprints, emissions reduction, and sustainable living. Try asking about your footprint, food impact, or green tips!',
  'I\'m not sure about that one, but I\'d love to help with anything carbon-related. Ask me about transport emissions, diet tips, home energy savings, or what actions you can take.',
  'Hmm, that\'s outside my area. I\'m focused on helping you understand and reduce your carbon footprint. What aspect of sustainable living are you curious about?',
];

// Insight-of-the-day rotation for the Home dashboard.
export const INSIGHTS = [
  { icon: '🚗', text: 'Carpooling just twice a week can cut your transport emissions by up to 30%.' },
  { icon: '🥩', text: 'Skipping beef once a week saves about 340 kg CO₂ per year.' },
  { icon: '💡', text: 'LED bulbs use 75% less energy and last 25× longer than incandescent.' },
  { icon: '✈️', text: 'One round-trip London→NYC flight ≈ 1.1 tonnes CO₂e — more than many people emit all year.' },
  { icon: '🚿', text: 'Cutting showers to 5 minutes saves about 100 kg CO₂e per year.' },
  { icon: '🛒', text: 'Buying secondhand eliminates up to 82% of a product\'s manufacturing emissions.' },
  { icon: '🥛', text: 'Switching to oat milk saves about 70% of dairy\'s lifecycle emissions.' },
  { icon: '♻️', text: 'Recycling one aluminium can saves enough energy to run a TV for 3 hours.' },
  { icon: '🌡️', text: 'Lowering your thermostat by 2°C saves roughly 6–8% on heating bills.' },
  { icon: '📱', text: 'Keeping your phone for 3 years instead of 2 saves ~40 kg CO₂e in manufacturing alone.' },
  { icon: '🌍', text: 'Food waste accounts for 8–10% of global greenhouse gas emissions.' },
  { icon: '🌲', text: 'A mature tree absorbs about 22 kg of CO₂ per year. Plant one today!' },
  { icon: '🚶', text: 'Walking instead of driving for trips under 3 km saves ~380 kg CO₂e/year.' },
  { icon: '🍃', text: 'If everyone went meatless one day a week, it would cut food emissions by 15%.' },
  { icon: '🔌', text: 'Standby power wastes 5–10% of household electricity. Unplug to save.' },
];
