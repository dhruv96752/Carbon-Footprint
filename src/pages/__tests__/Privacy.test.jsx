import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Privacy from '../../pages/Privacy';

function renderPrivacy() {
  return render(
    <BrowserRouter>
      <Privacy />
    </BrowserRouter>
  );
}

describe('Privacy', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders privacy center heading', () => {
    renderPrivacy();
    expect(screen.getByText('Privacy & Security Center')).toBeInTheDocument();
  });

  it('shows security features', () => {
    renderPrivacy();
    expect(screen.getByText('Zero Network Calls')).toBeInTheDocument();
    expect(screen.getByText('100% Local Storage')).toBeInTheDocument();
    expect(screen.getByText('Content Security Policy')).toBeInTheDocument();
  });

  it('shows data inventory heading', () => {
    renderPrivacy();
    expect(screen.getByText('Your Data Inventory')).toBeInTheDocument();
  });

  it('has export data button', () => {
    renderPrivacy();
    expect(screen.getByText('Export All Data (JSON)')).toBeInTheDocument();
  });

  it('has erase data button', () => {
    renderPrivacy();
    expect(screen.getByText('Erase All Data')).toBeInTheDocument();
  });
});
