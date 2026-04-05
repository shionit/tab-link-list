import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header keyboard accessibility', () => {
  it('filter input receives focus on mount (autoFocus)', () => {
    render(
      <Header
        totalTabs={3}
        isChecked={false}
        onSelectAll={vi.fn()}
        filterText=""
        onFilterChange={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Filter by title or URL...');
    expect(input).toHaveFocus();
  });

  it('Select All checkbox is reachable and operable', async () => {
    const onSelectAll = vi.fn();
    render(
      <Header
        totalTabs={3}
        isChecked={false}
        onSelectAll={onSelectAll}
        filterText=""
        onFilterChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    checkbox.click();
    expect(onSelectAll).toHaveBeenCalled();
  });
});
