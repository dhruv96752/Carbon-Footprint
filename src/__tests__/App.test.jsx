import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import App from '../App';

function renderApp(path = '/') {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ToastProvider>
  );
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Home page at /', () => {
    renderApp('/');
    expect(screen.getAllByText('Verdant').length).toBeGreaterThan(0);
    expect(screen.getByText('Start Your Journey')).toBeInTheDocument();
  });

  it('renders Onboard page at /onboard', () => {
    renderApp('/onboard');
    expect(screen.getByText(/how do you usually get around/i)).toBeInTheDocument();
  });

  it('renders Chat page at /chat', () => {
    renderApp('/chat');
    expect(screen.getByPlaceholderText(/ask/i)).toBeInTheDocument();
  });

  it('renders Privacy page at /privacy', () => {
    renderApp('/privacy');
    expect(screen.getByText('Privacy & Security Center')).toBeInTheDocument();
  });

  it('renders Footer on every page', () => {
    renderApp('/');
    expect(screen.getByText('Your carbon companion')).toBeInTheDocument();
  });

  it('renders Navbar on every page', () => {
    renderApp('/');
    expect(screen.getByText('Grow lighter')).toBeInTheDocument();
  });
});
