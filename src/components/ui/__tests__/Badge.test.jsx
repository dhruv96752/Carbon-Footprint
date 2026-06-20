import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Badge from '../Badge';
import { BADGES } from '../../../data/badges';

function Wrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('Badge', () => {
  it('renders badge with icon and name', () => {
    render(
      <Wrapper>
        <Badge icon="🌿" name="Test Badge" desc="A test" />
      </Wrapper>
    );
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
    expect(screen.getByText('A test')).toBeInTheDocument();
  });

  it('renders earned badge with gradient', () => {
    const { container } = render(
      <Wrapper>
        <Badge icon="🔥" name="Streak" desc="3 days" earned={true} />
      </Wrapper>
    );
    const el = container.querySelector('.bg-gradient-to-br');
    expect(el).toBeTruthy();
  });

  it('renders locked badge with reduced opacity', () => {
    const { container } = render(
      <Wrapper>
        <Badge icon="🔒" name="Locked" desc="Not earned" earned={false} />
      </Wrapper>
    );
    const el = container.querySelector('.opacity-40');
    expect(el).toBeTruthy();
  });

  it('hides description for small size', () => {
    render(
      <Wrapper>
        <Badge icon="🌱" name="Small" desc="Hidden" size="sm" />
      </Wrapper>
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});

describe('BadgeGrid', () => {
  it('renders all badges', async () => {
    const { BadgeGrid } = await import('../Badge');
    const earned = [BADGES[0]];
    render(
      <Wrapper>
        <BadgeGrid badges={earned} allBadges={BADGES} />
      </Wrapper>
    );
    for (const b of BADGES) {
      expect(screen.getByText(b.name)).toBeInTheDocument();
    }
  });
});
