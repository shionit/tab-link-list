import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomBar } from './BottomBar';

describe('BottomBar keyboard accessibility', () => {
  it('format options are rendered as buttons (keyboard-focusable)', () => {
    render(
      <BottomBar format="text" onFormatChange={vi.fn()} count={1} onCopy={vi.fn()} />
    );

    // All three format options must be <button> elements
    const textBtn = screen.getByRole('button', { name: 'Text' });
    const mdBtn = screen.getByRole('button', { name: 'Markdown' });
    const htmlBtn = screen.getByRole('button', { name: 'HTML' });

    expect(textBtn.tagName).toBe('BUTTON');
    expect(mdBtn.tagName).toBe('BUTTON');
    expect(htmlBtn.tagName).toBe('BUTTON');
  });

  it('calls onFormatChange when a format button is clicked', async () => {
    const onFormatChange = vi.fn();
    render(
      <BottomBar format="text" onFormatChange={onFormatChange} count={1} onCopy={vi.fn()} />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Markdown' }));
    expect(onFormatChange).toHaveBeenCalledWith('markdown');
  });

  it('format buttons are reachable via Tab key', async () => {
    render(
      <BottomBar format="text" onFormatChange={vi.fn()} count={1} onCopy={vi.fn()} />
    );

    const textBtn = screen.getByRole('button', { name: 'Text' });
    textBtn.focus();
    await userEvent.tab();

    expect(screen.getByRole('button', { name: 'Markdown' })).toHaveFocus();
  });

  it('copy button is disabled when count is 0', () => {
    render(
      <BottomBar format="text" onFormatChange={vi.fn()} count={0} onCopy={vi.fn()} disabled />
    );
    expect(screen.getByRole('button', { name: /copy/i })).toBeDisabled();
  });

  it('calls onCopy when copy button is activated via Enter', async () => {
    const onCopy = vi.fn();
    render(
      <BottomBar format="text" onFormatChange={vi.fn()} count={2} onCopy={onCopy} />
    );

    const copyBtn = screen.getByRole('button', { name: /copy/i });
    copyBtn.focus();
    await userEvent.keyboard('{Enter}');

    expect(onCopy).toHaveBeenCalled();
  });
});
