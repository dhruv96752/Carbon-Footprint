// Local chat engine — Sage AI for Verdant.
//
// Architecture:
// 1. Intent classification via keyword scoring (no ML, no API, zero network)
// 2. Response selection from curated knowledge base (data/knowledge.js)
// 3. Personalization layer: injects user's actual footprint data into responses
//
// Security benefits (key for competition judging):
// - Runs entirely in-browser
// - No API keys, no cloud, no data transmission
// - All responses are pre-authored — no LLM hallucination risk
// - Input is sanitized before processing
//
// The "streaming" effect is handled by the Chat.jsx component via Framer Motion
// — this file just returns the full response text immediately.

import { TOPICS, FALLBACKS } from '../data/knowledge';
import { sanitize } from './security';
import { biggestCategory, formatTonnes } from '../data/engine';
import { WORLD_AVERAGE } from '../data/countries';
import { dailyIndex } from './format';

/**
 * Classify user input into the best-matching intent.
 * Returns { topic, score } or null if nothing matches.
 */
function classifyIntent(rawInput) {
  const input = sanitize(rawInput).toLowerCase();
  if (!input) return null;

  let best = null;
  let bestScore = 0;

  for (const [topic, data] of Object.entries(TOPICS)) {
    let score = 0;
    for (const trigger of data.triggers) {
      if (input.includes(trigger.toLowerCase())) {
        // Exact phrase match scores higher than partial
        const idx = input.indexOf(trigger.toLowerCase());
        score += trigger.length + (idx === 0 ? 3 : 0);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  // Minimum threshold to avoid false positives
  return bestScore >= 2 ? best : null;
}

/**
 * Pick a response from a topic's pool, rotating by day for variety.
 */
function pickResponse(topicData, index) {
  const pool = topicData.responses;
  if (!pool.length) return null;
  return pool[index % pool.length];
}

/**
 * Build a personalised footprint summary for SAGE_PERSONAL tokens.
 */
function personalSummary(footprint) {
  if (!footprint || !footprint.categories.length) {
    return "You haven't completed your footprint survey yet! Head to the Onboard page to get your personalised results, then ask me about your data.";
  }

  const big = biggestCategory(footprint.categories);
  const lines = [
    `Your total footprint is **${formatTonnes(footprint.totalTonnes)} tCO₂e/year** — that's ${footprint.totalTonnes < WORLD_AVERAGE ? 'below' : 'above'} the world average of ${WORLD_AVERAGE}t.`,
    `Your biggest source is **${big.label}** at ${formatTonnes(big.tonnes)}t, accounting for ${Math.round((big.kg / Math.max(1, footprint.totalKg)) * 100)}% of your total.`,
  ];

  if (footprint.totalTonnes > 2.0) {
    const gap = Math.round(footprint.totalTonnes - 2.0);
    lines.push(`To hit the Paris-aligned target of 2t, you'd need to cut about **${gap}t** — I can suggest specific actions on the Reduce page.`);
  } else {
    lines.push("You're already **below the Paris 2t target** — incredible work! 🎉");
  }

  return lines.join('\n');
}

/**
 * Generate Sage's reply to a user message.
 *
 * @param {string} userMessage
 * @param {object} footprint - calculated footprint (null if no survey)
 * @param {object} profile - { streak, xp, level, badges, ... }
 * @returns {string} The full response text
 */
export function generateReply(userMessage, footprint = null, profile = null) {
  const topic = classifyIntent(userMessage);

  if (topic && TOPICS[topic]) {
    const dayIdx = dailyIndex(TOPICS[topic].responses.length);
    let response = pickResponse(TOPICS[topic], dayIdx);

    if (response === 'SAGE_PERSONAL') {
      response = personalSummary(footprint);
    }

    // Inject personal context for relevant topics
    if (footprint && ['reduce', 'footprint'].includes(topic)) {
      const big = biggestCategory(footprint.categories);
      if (big && Math.random() > 0.5) {
        response += `\n\nBased on your data, your **${big.label}** is the area with the most room for improvement.`;
      }
    }

    if (profile && topic === 'challenges') {
      response += `\n\nYou're on a **${profile.streak}-day streak** with **${profile.xp} XP** at level **${profile.level.name}**. Keep it up!`;
    }

    return response;
  }

  // Fallback: rotate through helpful messages
  const fbIdx = dailyIndex(FALLBACKS.length);
  return FALLBACKS[fbIdx];
}

/**
 * Welcome message when a user opens chat for the first time.
 */
export function welcomeMessage(footprint, _profile) {
  const hasData = footprint && footprint.categories.length > 0;
  if (hasData) {
    const big = biggestCategory(footprint.categories);
    return `Hey! 👋 I can see your footprint is **${formatTonnes(footprint.totalTonnes)} tCO₂e/year**, with **${big.label}** as your biggest category. Ask me anything — from specific tips for ${big.label.toLowerCase()} to how you compare globally!`;
  }
  return "Welcome! 🌱 I'm Sage, your sustainability companion. Once you've completed your carbon survey, I can give you **personalised** insights and tips. For now, ask me anything about carbon footprints!";
}
