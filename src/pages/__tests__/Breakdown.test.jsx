import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breakdown from '../../pages/Breakdown';

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

function renderBreakdown() {
  return render(
    <BrowserRouter>
      <Breakdown />
    </BrowserRouter>
  );
}

describe('Breakdown (pre-onboard)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows empty state when no survey completed', () => {
    renderBreakdown();
    expect(screen.getByText('No footprint data yet')).toBeInTheDocument();
  });

  it('links to onboarding from empty state', () => {
    renderBreakdown();
    const link = screen.getByText('Start Survey').closest('a');
    expect(link).toHaveAttribute('href', '/onboard');
  });

  it('shows descriptive text in empty state', () => {
    renderBreakdown();
    expect(screen.getByText(/Complete the quick onboarding survey/)).toBeInTheDocument();
  });
});

describe('Breakdown (post-onboard)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('verdant:answers', JSON.stringify(sampleAnswers));
    localStorage.setItem('verdant:completedAt', JSON.stringify('2026-06-20'));
  });

  it('renders the main heading', () => {
    renderBreakdown();
    expect(screen.getByText('Your Carbon Footprint')).toBeInTheDocument();
  });

  it('shows annual footprint label', () => {
    renderBreakdown();
    expect(screen.getByText('Annual Footprint')).toBeInTheDocument();
  });

  it('displays annual footprint section with tCO2e unit', () => {
    renderBreakdown();
    // StatCounter animates the number in jsdom, so assert on the stable unit label
    expect(screen.getByText(/of CO\u2082 equivalent per year/)).toBeInTheDocument();
  });

  it('shows breakdown by category heading', () => {
    renderBreakdown();
    expect(screen.getByText('Breakdown by Category')).toBeInTheDocument();
  });

  it('shows biggest impact area callout', () => {
    renderBreakdown();
    expect(screen.getByText(/Your biggest impact area/)).toBeInTheDocument();
  });

  it('shows How You Compare section', () => {
    renderBreakdown();
    expect(screen.getByText('How You Compare')).toBeInTheDocument();
  });

  it('shows country comparison entries', () => {
    renderBreakdown();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('World average')).toBeInTheDocument();
  });

  it('shows Paris Agreement Target section', () => {
    renderBreakdown();
    expect(screen.getByText('Paris Agreement Target')).toBeInTheDocument();
  });

  it('shows link to Reduce page', () => {
    renderBreakdown();
    const link = screen.getByText(/personalised actions/i).closest('a');
    expect(link).toHaveAttribute('href', '/reduce');
  });

  it('has progressbar role on category bars', () => {
    renderBreakdown();
    const progressbars = screen.getAllByRole('progressbar');
    expect(progressbars.length).toBeGreaterThan(0);
  });

  it('progressbar has aria-valuenow attribute', () => {
    renderBreakdown();
    const progressbars = screen.getAllByRole('progressbar');
    const pb = progressbars[0];
    expect(pb).toHaveAttribute('aria-valuenow');
    expect(pb).toHaveAttribute('aria-valuemin', '0');
    expect(pb).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows emission source disclaimer', () => {
    renderBreakdown();
    expect(screen.getByText(/Emissions are approximate estimates/)).toBeInTheDocument();
  });
});

describe('Breakdown (Paris-aligned)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows Paris-aligned message when footprint is at or below target', () => {
    // Use answers that produce a low footprint (bike, vegan, minimal)
    const lowAnswers = {
      car: 'bike',
      carKm: 'none',
      flights: 'none',
      diet: 'vegan',
      localFood: 'mostly',
      waste: 'none',
      home: 'renewable',
      heating: 'passive',
      appliances: 'led',
      shopping: 'minimal',
      recycle: 'zero',
      streaming: 'minimal',
      water: 'minimal',
      household: 'four_plus',
    };
    localStorage.setItem('verdant:answers', JSON.stringify(lowAnswers));
    localStorage.setItem('verdant:completedAt', JSON.stringify('2026-06-20'));
    renderBreakdown();
    expect(screen.getByText(/Paris-aligned/)).toBeInTheDocument();
  });
});
