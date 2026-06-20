import { describe, it, expect, beforeEach } from 'vitest';
import { calculateFootprint, biggestCategory, savingsFor, formatTonnes } from '../engine';
import { HOUSEHOLD_STEP_ID } from '../survey';

describe('calculateFootprint', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns zero footprint for empty answers', () => {
    const result = calculateFootprint({});
    expect(result.totalKg).toBe(0);
    expect(result.totalTonnes).toBe(0);
    expect(result.categories).toHaveLength(4);
    expect(result.household).toBe(1);
  });

  it('returns zero footprint for undefined answers', () => {
    const result = calculateFootprint(undefined);
    expect(result.totalKg).toBe(0);
  });

  it('handles default household of 1', () => {
    const answers = { [HOUSEHOLD_STEP_ID]: 'one' };
    const result = calculateFootprint(answers);
    expect(result.household).toBe(1);
  });

  it('handles household of 4 and splits shared categories', () => {
    const answers = { [HOUSEHOLD_STEP_ID]: 'four_plus' };
    const result = calculateFootprint(answers);
    expect(result.household).toBe(4);
  });

  it('calculates full footprint with all answers (1 person)', () => {
    const answers = {
      car: 'car_petrol',       // 2200
      carKm: 'mid',             // 700
      flights: 'short3',       // 900
      diet: 'meat_avg',        // 1700
      localFood: 'sometimes',  // 140
      waste: 'some',           // 180
      home: 'grid',            // 1600
      heating: 'moderate',      // 500
      appliances: 'mixed',      // 240
      shopping: 'regular',      // 400
      recycle: 'recycle',       // 120
      streaming: 'avg',         // 140
      water: 'average',         // 120
      household: 'one',         // 1 (no splitting)
    };
    const result = calculateFootprint(answers);

    // Transport: 2200 + 700 + 900 = 3800 (personal, no split)
    const transportCat = result.categories.find(c => c.id === 'transport');
    expect(transportCat.kg).toBe(3800);

    // Home: 1600 + 500 + 240 = 2340 (shared, split by 1)
    const homeCat = result.categories.find(c => c.id === 'home');
    expect(homeCat.kg).toBe(2340);

    // Diet: 1700 + 140 + 180 = 2020 (personal, no split)
    const dietCat = result.categories.find(c => c.id === 'diet');
    expect(dietCat.kg).toBe(2020);

    // Lifestyle: 400 + 120 + 140 + 120 = 780 (shared, split by 1)
    const lifestyleCat = result.categories.find(c => c.id === 'lifestyle');
    expect(lifestyleCat.kg).toBe(780);

    // Total
    expect(result.totalKg).toBe(3800 + 2340 + 2020 + 780);
    expect(result.totalTonnes).toBe(result.totalKg / 1000);
  });

  it('splits home and lifestyle by household size', () => {
    const answers = {
      home: 'grid',       // 1600
      heating: 'moderate', // 500
      appliances: 'mixed', // 240
      shopping: 'regular', // 400
      recycle: 'recycle',  // 120
      streaming: 'avg',    // 140
      water: 'average',    // 120
      household: 'four_plus', // 4
    };
    const result = calculateFootprint(answers);

    const homeCat = result.categories.find(c => c.id === 'home');
    // (1600 + 500 + 240) / 4 = 585
    expect(homeCat.kg).toBe(585);

    const lifestyleCat = result.categories.find(c => c.id === 'lifestyle');
    // (400 + 120 + 140 + 120) / 4 = 195
    expect(lifestyleCat.kg).toBe(195);

    // Transport and diet should be 0
    const transportCat = result.categories.find(c => c.id === 'transport');
    expect(transportCat.kg).toBe(0);
    const dietCat = result.categories.find(c => c.id === 'diet');
    expect(dietCat.kg).toBe(0);
  });

  it('computes vsWorld correctly', () => {
    const answers = { car: 'bike', diet: 'vegan', household: 'one' };
    const result = calculateFootprint(answers);
    expect(result.vsWorld).toBeCloseTo(result.totalTonnes - 4.7);
  });

  it('computes vsTarget correctly (Paris 2t)', () => {
    const answers = { car: 'bike', diet: 'vegan', household: 'one' };
    const result = calculateFootprint(answers);
    expect(result.vsTarget).toBeCloseTo(result.totalTonnes - 2.0);
  });

  it('categories have correct shape', () => {
    const result = calculateFootprint({});
    for (const cat of result.categories) {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('label');
      expect(cat).toHaveProperty('kg');
      expect(cat).toHaveProperty('tonnes');
      expect(typeof cat.kg).toBe('number');
      expect(typeof cat.tonnes).toBe('number');
    }
  });
});

describe('biggestCategory', () => {
  it('returns category with highest kg', () => {
    const categories = [
      { id: 'diet', kg: 100 },
      { id: 'transport', kg: 500 },
      { id: 'home', kg: 200 },
    ];
    const biggest = biggestCategory(categories);
    expect(biggest.id).toBe('transport');
  });

  it('returns first if tied', () => {
    const categories = [
      { id: 'diet', kg: 100 },
      { id: 'transport', kg: 100 },
    ];
    const biggest = biggestCategory(categories);
    expect(biggest.id).toBe('diet');
  });
});

describe('savingsFor', () => {
  it('calculates percentage savings', () => {
    expect(savingsFor(1000, 10)).toBe(100);
    expect(savingsFor(1000, 50)).toBe(500);
  });

  it('handles zero', () => {
    expect(savingsFor(0, 50)).toBe(0);
  });
});

describe('formatTonnes', () => {
  it('formats large values with 1 decimal', () => {
    expect(formatTonnes(15.678)).toBe('15.7');
    expect(formatTonnes(10)).toBe('10.0');
  });

  it('formats medium values with 2 decimals', () => {
    expect(formatTonnes(3.456)).toBe('3.46');
    expect(formatTonnes(1)).toBe('1.00');
  });
});
