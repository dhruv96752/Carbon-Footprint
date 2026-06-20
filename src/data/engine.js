// Carbon engine — turns survey answers into an annual footprint estimate.
//
// All values are in KG CO2e per year. divide by 1000 for tonnes (tCO2e).
// The HOME and LIFESTYLE categories are shared, so we split them across the
// household size reported by the user.
//
// Sources (approximate, public): UK BEIS conversion factors, IPCC AR6 per-capita
// data, EPA household emissions, and common lifecycle studies for food. Numbers
// are rounded for clarity — this is an awareness tool, not an audit.

import { STEPS, CATEGORIES, HOUSEHOLD_STEP_ID } from './survey';
import { COUNTRY_AVERAGES, WORLD_AVERAGE, PARIS_TARGET } from './countries';

const KG_PER_TONNE = 1000;

/** Look up the option a user selected for a step. */
function optionOf(stepId, answerId) {
  const step = STEPS.find((s) => s.id === stepId);
  if (!step) return null;
  return step.options.find((o) => o.id === answerId) || null;
}

/**
 * Compute the full footprint breakdown from a map of { stepId: answerId }.
 * Returns categories (kg/year), total tonnes, household, and comparisons.
 */
export function calculateFootprint(answers = {}) {
  const household = Math.max(
    1,
    optionOf(HOUSEHOLD_STEP_ID, answers[HOUSEHOLD_STEP_ID])?.value || 1
  );

  // Aggregate raw kg per category.
  const byCategory = { transport: 0, diet: 0, home: 0, lifestyle: 0 };

  for (const step of STEPS) {
    if (step.id === HOUSEHOLD_STEP_ID) continue;
    const opt = optionOf(step.id, answers[step.id]);
    if (!opt) continue;
    // Shared categories split across household; transport & diet are personal.
    const shared = step.cat === 'home' || step.cat === 'lifestyle';
    byCategory[step.cat] += shared ? opt.value / household : opt.value;
  }

  // Round categories to whole kg.
  const categories = Object.entries(byCategory).map(([id, kg]) => {
    const meta = CATEGORIES[id];
    const rounded = Math.round(kg);
    return {
      ...meta,
      kg: rounded,
      tonnes: rounded / KG_PER_TONNE,
    };
  });

  const totalKg = categories.reduce((s, c) => s + c.kg, 0);
  const totalTonnes = totalKg / KG_PER_TONNE;

  return {
    categories,
    totalKg,
    totalTonnes,
    household,
    // Comparisons
    vsWorld: totalTonnes - WORLD_AVERAGE,
    vsTarget: totalTonnes - PARIS_TARGET, // Paris-aligned ~2 tCO2e per person by 2030
  };
}

/** Largest category id, for "biggest source" messaging. */
export function biggestCategory(categories) {
  return [...categories].sort((a, b) => b.kg - a.kg)[0];
}

/** What an X% reduction would save, in kg/year. */
export function savingsFor(totalKg, percent) {
  return Math.round((totalKg * percent) / 100);
}

/** Pretty format tonnes with a sensible number of decimals. */
export function formatTonnes(tonnes) {
  if (tonnes >= 10) return tonnes.toFixed(1);
  if (tonnes >= 1) return tonnes.toFixed(2);
  // Below 1 tonne, switch to kg for clarity (matches lib/format.js fmtTonnes).
  return `${(tonnes * KG_PER_TONNE).toFixed(0)} kg`;
}

export { COUNTRY_AVERAGES, WORLD_AVERAGE, KG_PER_TONNE, PARIS_TARGET };
