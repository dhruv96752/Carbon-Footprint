import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Challenges from '../../pages/Challenges';

function renderChallenges() {
  return render(
    <BrowserRouter>
      <Challenges />
    </BrowserRouter>
  );
}

describe('Challenges', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the challenges page heading', () => {
    renderChallenges();
    expect(screen.getByText('Weekly Challenges')).toBeInTheDocument();
  });

  it('shows Total XP label', () => {
    renderChallenges();
    expect(screen.getByText('Total XP')).toBeInTheDocument();
  });

  it('shows Completed label', () => {
    renderChallenges();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows level name', () => {
    renderChallenges();
    // Default level is "Seed" at 0 XP
    expect(screen.getByText('Seed')).toBeInTheDocument();
  });
});
