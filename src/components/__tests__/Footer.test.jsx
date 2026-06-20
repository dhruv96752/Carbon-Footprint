import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the Verdant brand', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText('Verdant')).toBeInTheDocument();
    expect(screen.getByText('Your carbon companion')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText('Footprint')).toBeInTheDocument();
    expect(screen.getByText('Reduce')).toBeInTheDocument();
    expect(screen.getByText('Ask Sage')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  it('shows privacy badge', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText('100% local · no tracking')).toBeInTheDocument();
  });

  it('shows copyright with current year', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
  });
});
