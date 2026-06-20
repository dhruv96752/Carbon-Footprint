import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Chat from '../../pages/Chat';

function renderChat() {
  return render(
    <BrowserRouter>
      <Chat />
    </BrowserRouter>
  );
}

describe('Chat', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Sage chat interface', () => {
    renderChat();
    expect(screen.getByText(/sage/i)).toBeTruthy();
  });

  it('has an input field', () => {
    renderChat();
    const input = screen.getByPlaceholderText(/ask/i);
    expect(input).toBeInTheDocument();
  });

  it('has a send button', () => {
    renderChat();
    const sendBtn = screen.getByRole('button', { name: /send/i });
    expect(sendBtn).toBeInTheDocument();
  });

  it('shows suggestion chips', () => {
    renderChat();
    // Should have at least one suggestion
    const buttons = screen.getAllByRole('button');
    const hasSuggestions = buttons.some(btn =>
      btn.textContent.match(/carbon|reduce|food|transport|home/i)
    );
    expect(hasSuggestions).toBe(true);
  });
});
