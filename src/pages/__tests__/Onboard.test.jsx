import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Onboard from '../../pages/Onboard';

function renderOnboard() {
  return render(
    <BrowserRouter>
      <Onboard />
    </BrowserRouter>
  );
}

describe('Onboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the survey wizard first question', () => {
    renderOnboard();
    expect(screen.getByText(/how do you usually get around/i)).toBeInTheDocument();
  });

  it('shows question progress indicator', () => {
    renderOnboard();
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });

  it('shows option cards for first step', () => {
    renderOnboard();
    expect(screen.getByText(/petrol/i)).toBeInTheDocument();
    expect(screen.getByText(/walk/i)).toBeInTheDocument();
  });

  it('has next button', () => {
    renderOnboard();
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeInTheDocument();
  });
});
