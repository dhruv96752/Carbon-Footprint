import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../../pages/NotFound';

function renderNotFound() {
  return render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>
  );
}

describe('NotFound', () => {
  it('renders 404 text', () => {
    renderNotFound();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders page not found heading', () => {
    renderNotFound();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders descriptive message', () => {
    renderNotFound();
    expect(screen.getByText(/carbon-neutral/)).toBeInTheDocument();
  });

  it('has a link back to home', () => {
    renderNotFound();
    const link = screen.getByText('Return Home').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('shows greener pastures message', () => {
    renderNotFound();
    expect(screen.getByText(/greener pastures/)).toBeInTheDocument();
  });
});
