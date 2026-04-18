import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabItem } from './TabItem';
import type { Tab } from '../hooks/useTabs';

const mockTab: Tab = {
  id: 1,
  title: 'Example Tab',
  url: 'https://example.com',
  favIconUrl: '',
};

describe('TabItem keyboard accessibility', () => {
  it('toggles selection when Space is pressed on the row', async () => {
    const onToggle = vi.fn();
    render(<TabItem tab={mockTab} selected={false} onToggle={onToggle} />);

    const row = screen.getByRole('checkbox');
    row.focus();
    await userEvent.keyboard(' ');

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('row is the only tab stop (native checkbox is aria-hidden)', () => {
    const { container } = render(<TabItem tab={mockTab} selected={false} onToggle={vi.fn()} />);

    const row = screen.getByRole('checkbox');
    expect(row.tagName).toBe('DIV');
    expect(row).toHaveAttribute('tabindex', '0');

    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveAttribute('tabindex', '-1');
    expect(input).toHaveAttribute('aria-hidden', 'true');
  });

  it('reflects selected state via aria-checked', () => {
    render(<TabItem tab={mockTab} selected={true} onToggle={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects unselected state via aria-checked', () => {
    render(<TabItem tab={mockTab} selected={false} onToggle={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });
});
