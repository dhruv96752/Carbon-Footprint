import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Reduce from '../../pages/Reduce';
import { ToastProvider } from '../../components/ui/Toast';

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

function renderReduce() {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <Reduce />
      </ToastProvider>
    </BrowserRouter>
  );
}

describe('Reduce (pre-onboard)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows empty state when no survey completed', () => {
    renderReduce();
    expect(screen.getByText('Take the survey first')).toBeInTheDocument();
  });

  it('links to onboarding from empty state', () => {
    renderReduce();
    const link = screen.getByText('Start Survey').closest('a');
    expect(link).toHaveAttribute('href', '/onboard');
  });

  it('shows descriptive text in empty state', () => {
    renderReduce();
    expect(screen.getByText(/We need your lifestyle data/)).toBeInTheDocument();
  });
});

describe('Reduce (post-onboard)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('verdant:answers', JSON.stringify(sampleAnswers));
    localStorage.setItem('verdant:completedAt', JSON.stringify('2026-06-20'));
  });

  it('renders the main heading', () => {
    renderReduce();
    expect(screen.getByText('Reduce Your Footprint')).toBeInTheDocument();
  });

  it('renders action cards with category pills', () => {
    renderReduce();
    // Check that at least one action card renders
    expect(screen.getAllByText(/kg CO₂\/yr/).length).toBeGreaterThan(0);
  });

  it('shows difficulty labels on actions', () => {
    renderReduce();
    // "Easy" difficulty label should appear
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0);
  });

  it('shows High impact badge for qualifying actions', () => {
    renderReduce();
    // Actions with savings > 500 kg should show "High impact"
    const highImpact = screen.queryAllByText('High impact');
    expect(highImpact.length).toBeGreaterThan(0);
  });

  it('shows commit/uncommit buttons with aria-pressed', () => {
    renderReduce();
    const commitButtons = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-pressed')
    );
    expect(commitButtons.length).toBeGreaterThan(0);
    // Initially uncommitted buttons should have aria-pressed="false"
    expect(commitButtons[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('commit button labels include action title', () => {
    renderReduce();
    const commitButtons = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-pressed')
    );
    // Should have aria-label starting with "Commit"
    expect(commitButtons[0].getAttribute('aria-label')).toMatch(/^Commit /);
  });

  it('toggles commitment state on click', () => {
    renderReduce();
    const commitButtons = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-pressed')
    );
    const firstBtn = commitButtons[0];
    expect(firstBtn).toHaveAttribute('aria-pressed', 'false');

    act(() => {
      fireEvent.click(firstBtn);
    });
    // After commit, aria-pressed should be "true"
    expect(firstBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows savings summary after committing actions', () => {
    renderReduce();
    const commitButtons = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-pressed')
    );

    // Commit an action
    act(() => {
      fireEvent.click(commitButtons[0]);
    });

    // Savings summary should appear ("1 action committed")
    expect(screen.getByText(/saved\/yr/)).toBeInTheDocument();
    expect(screen.getAllByText(/action committed/i).length).toBeGreaterThan(0);
  });

  it('shows savings percentage of current footprint', () => {
    renderReduce();
    const commitButtons = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-pressed')
    );

    act(() => {
      fireEvent.click(commitButtons[0]);
    });
    expect(screen.getByText(/% of your current footprint/)).toBeInTheDocument();
  });
});
