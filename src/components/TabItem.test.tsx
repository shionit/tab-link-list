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

    const row = screen.getByRole('button');
    row.focus();
    await userEvent.keyboard(' ');

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('toggles selection when Enter is pressed on the row', async () => {
    const onToggle = vi.fn();
    render(<TabItem tab={mockTab} selected={false} onToggle={onToggle} />);

    const row = screen.getByRole('button');
    row.focus();
    await userEvent.keyboard('{Enter}');

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('row div is the only tab stop (checkbox has tabIndex -1)', () => {
    render(<TabItem tab={mockTab} selected={false} onToggle={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('tabindex', '-1');

    const row = screen.getByRole('button');
    expect(row).toHaveAttribute('tabindex', '0');
  });

  it('reflects selected state via checkbox checked', () => {
    render(<TabItem tab={mockTab} selected={true} onToggle={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
