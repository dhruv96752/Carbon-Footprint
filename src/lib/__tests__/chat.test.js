import { describe, it, expect } from 'vitest';
import { generateReply, welcomeMessage } from '../chat';
import { calculateFootprint } from '../../data/engine';

// Sample footprint for tests
const sampleAnswers = {
  car: 'car_petrol',
  carKm: 'mid',
  flights: 'short1',
  diet: 'meat_avg',
  localFood: 'sometimes',
  waste: 'some',
  home: 'grid',
  heating: 'moderate',
  appliances: 'mixed',
  shopping: 'regular',
  recycle: 'recycle',
  streaming: 'avg',
  water: 'average',
  household: 'one',
};
const sampleFootprint = calculateFootprint(sampleAnswers);
const sampleProfile = { streak: 5, xp: 250, level: { name: 'Sprout' } };

describe('generateReply', () => {
  it('returns a greeting for hello', () => {
    const reply = generateReply('hello');
    expect(reply).toBeTruthy();
    expect(reply.length).toBeGreaterThan(10);
  });

  it('returns a footprint response for carbon questions', () => {
    const reply = generateReply('what is a carbon footprint');
    expect(reply).toBeTruthy();
    expect(reply.toLowerCase()).toContain('carbon');
  });

  it('returns transport response for car questions', () => {
    const reply = generateReply('how much does driving contribute');
    expect(reply).toBeTruthy();
    expect(reply.length).toBeGreaterThan(20);
  });

  it('returns food response for diet questions', () => {
    const reply = generateReply('tell me about food emissions');
    expect(reply).toBeTruthy();
  });

  it('returns home energy response', () => {
    const reply = generateReply('how can I reduce home energy');
    expect(reply).toBeTruthy();
  });

  it('returns lifestyle response', () => {
    const reply = generateReply('tell me about recycling');
    expect(reply).toBeTruthy();
  });

  it('returns personalized response for "my footprint"', () => {
    const reply = generateReply('my footprint', sampleFootprint);
    expect(reply).toBeTruthy();
    expect(reply).toContain('tCO₂e');
  });

  it('returns personalized data when available', () => {
    const reply = generateReply('my emissions', sampleFootprint);
    expect(reply).toContain(sampleFootprint.totalTonnes.toString().split('.')[0]);
  });

  it('returns reduce tips', () => {
    const reply = generateReply('how can I reduce my footprint');
    expect(reply).toBeTruthy();
  });

  it('returns about sage response', () => {
    const reply = generateReply('what is sage');
    expect(reply).toBeTruthy();
    expect(reply.toLowerCase()).toContain('sage');
  });

  it('returns challenge info with profile context', () => {
    const reply = generateReply('tell me about challenges', null, sampleProfile);
    expect(reply).toBeTruthy();
    expect(reply).toContain('Sprout');
  });

  it('returns fallback for unrecognized input', () => {
    const reply = generateReply('xyzabc 12345 nonsense');
    expect(reply).toBeTruthy();
    expect(reply.length).toBeGreaterThan(10);
  });

  it('handles empty string', () => {
    const reply = generateReply('');
    expect(reply).toBeTruthy();
  });

  it('sanitizes XSS in input', () => {
    const reply = generateReply('<script>alert(1)</script>hello');
    expect(reply).not.toContain('<script>');
    expect(reply).toBeTruthy();
  });
});

describe('welcomeMessage', () => {
  it('returns personalized welcome with footprint data', () => {
    const msg = welcomeMessage(sampleFootprint);
    expect(msg).toBeTruthy();
    expect(msg).toContain('tCO₂e');
    expect(msg).toContain(sampleFootprint.totalTonnes.toString().split('.')[0]);
  });

  it('returns generic welcome without footprint', () => {
    const msg = welcomeMessage(null);
    expect(msg).toBeTruthy();
    expect(msg).toContain('Sage');
    expect(msg).toContain('sustainability');
  });

  it('returns generic welcome with empty footprint', () => {
    const msg = welcomeMessage(null, null);
    expect(msg).toBeTruthy();
  });
});
