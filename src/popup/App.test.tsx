import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

// Stable reference — critical to avoid infinite render loop in App's useMemo/useEffect chain
vi.mock('../hooks/useTabs', () => {
  const tabs = [
    { id: 1, title: 'Google', url: 'https://google.com' },
    { id: 2, title: 'GitHub', url: 'https://github.com' },
  ];
  return {
    useTabs: () => ({ tabs, activeTabId: 1, loading: false, error: null }),
  };
});

const mockCopy = vi.fn().mockResolvedValue(undefined);
vi.mock('../utils/clipboard', () => ({
  copyToClipboard: (...args: unknown[]) => mockCopy(...args),
}));

describe('App keyboard accessibility', () => {
  beforeEach(() => {
    mockCopy.mockClear();
  });

  it('filter input is focused on mount', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Filter by title or URL...')).toHaveFocus();
  });

  it('Ctrl+Enter triggers copy when a tab is selected', async () => {
    render(<App />);

    // Tab 1 is pre-selected (activeTabId=1)
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Enter', ctrlKey: true });
    });

    expect(mockCopy).toHaveBeenCalled();
  });

  it('Cmd+Enter (macOS) triggers copy when a tab is selected', async () => {
    render(<App />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Enter', metaKey: true });
    });

    expect(mockCopy).toHaveBeenCalled();
  });

  it('Ctrl+Enter does not copy when no tabs are selected', () => {
    render(<App />);

    // Deselect the active tab row
    fireEvent.click(screen.getByRole('checkbox', { name: /google/i }));

    fireEvent.keyDown(document, { key: 'Enter', ctrlKey: true });

    expect(mockCopy).not.toHaveBeenCalled();
  });
});
