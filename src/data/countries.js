// Per-capita annual CO2e emissions (tonnes/person/year) for comparison context.
// Approximate, rounded values from recent World Bank / Global Carbon Atlas data.
// Used purely to contextualise a user's footprint — not stored or sent anywhere.

export const WORLD_AVERAGE = 4.7;

export const COUNTRY_AVERAGES = [
  { code: 'IN', name: 'India', value: 1.9, flag: '🇮🇳' },
  { code: 'EU', name: 'EU average', value: 6.7, flag: '🇪🇺' },
  { code: 'CN', name: 'China', value: 7.4, flag: '🇨🇳' },
  { code: 'UK', name: 'United Kingdom', value: 4.6, flag: '🇬🇧' },
  { code: 'JP', name: 'Japan', value: 8.5, flag: '🇯🇵' },
  { code: 'US', name: 'United States', value: 14.4, flag: '🇺🇸' },
  { code: 'AU', name: 'Australia', value: 13.8, flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', value: 2.2, flag: '🇧🇷' },
  { code: 'NG', name: 'Nigeria', value: 0.6, flag: '🇳🇬' },
  { code: 'WO', name: 'World average', value: WORLD_AVERAGE, flag: '🌍' },
];

// The Paris Agreement aligned target for an individual by 2030 (~2 tCO2e/yr).
export const PARIS_TARGET = 2.0;
