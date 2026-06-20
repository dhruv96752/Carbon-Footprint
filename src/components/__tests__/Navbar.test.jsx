import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

function renderNav() {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
}

describe('Navbar', () => {
  it('renders the Verdant brand', () => {
    renderNav();
    expect(screen.getByText('Verdant')).toBeInTheDocument();
    expect(screen.getByText('Grow lighter')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderNav();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Footprint')).toBeInTheDocument();
    expect(screen.getByText('Reduce')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Ask Sage')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  it('has theme toggle button', () => {
    renderNav();
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('has mobile menu button', () => {
    renderNav();
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('Home link points to /', () => {
    renderNav();
    const link = screen.getByText('Home').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('Footprint link points to /breakdown', () => {
    renderNav();
    const link = screen.getByText('Footprint').closest('a');
    expect(link).toHaveAttribute('href', '/breakdown');
  });
});
