import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { calculateFootprint } from '../../data/engine';
import Home from '../../pages/Home';

// Pre-populate localStorage with a completed survey
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

function renderHome() {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
}

describe('Home (pre-onboard)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows hero CTA button when no survey completed', () => {
    renderHome();
    expect(screen.getByText('Start Your Journey')).toBeInTheDocument();
  });

  it('shows privacy link', () => {
    renderHome();
    expect(screen.getByText("How It's Private")).toBeInTheDocument();
  });

  it('links to onboard page', () => {
    renderHome();
    const onboardLink = screen.getByText('Start Your Journey').closest('a');
    expect(onboardLink.getAttribute('href')).toBe('/onboard');
  });

  it('shows feature highlights', () => {
    renderHome();
    expect(screen.getByText('Track')).toBeInTheDocument();
    expect(screen.getByText('Reduce')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
  });
});

describe('Home (post-onboard)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('verdant:answers', JSON.stringify(sampleAnswers));
    localStorage.setItem('verdant:completedAt', JSON.stringify('2026-06-20'));
  });

  it('shows tCO2e/yr label after survey completion', () => {
    renderHome();
    expect(screen.getByText('tCO₂e/yr')).toBeInTheDocument();
  });

  it('shows check-in button', () => {
    renderHome();
    expect(screen.getByText('Daily Check-in')).toBeInTheDocument();
  });

  it('shows day streak text', () => {
    renderHome();
    expect(screen.getByText(/day streak/i)).toBeInTheDocument();
  });

  it('shows footprint tonnes value', () => {
    renderHome();
    const fp = calculateFootprint(sampleAnswers);
    expect(screen.getByText(fp.totalTonnes.toFixed(1))).toBeInTheDocument();
  });
});
