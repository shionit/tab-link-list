import { describe, it, expect } from 'vitest';
import { filterTabs } from './filter';
import type { Tab } from '../hooks/useTabs';

const tabs: Tab[] = [
  { id: 1, title: 'GitHub Home', url: 'https://github.com' },
  { id: 2, title: 'TypeScript Docs', url: 'https://typescriptlang.org/docs' },
  { id: 3, title: 'React Tutorial', url: 'https://react.dev/learn' },
  { id: 4, title: 'Google Search', url: 'https://google.com/search?q=vitest' },
];

describe('filterTabs', () => {
  it('returns all tabs when query is empty', () => {
    expect(filterTabs(tabs, '')).toEqual(tabs);
  });

  it('matches by title (case-insensitive)', () => {
    const result = filterTabs(tabs, 'typescript');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('matches by URL (case-insensitive)', () => {
    const result = filterTabs(tabs, 'REACT.DEV');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it('matches partial substrings', () => {
    const result = filterTabs(tabs, 'git');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('returns empty array when no tabs match', () => {
    expect(filterTabs(tabs, 'xyznotfound')).toHaveLength(0);
  });

  it('returns multiple results when several tabs match', () => {
    // '.com' appears in github.com (id:1) and google.com (id:4)
    const result = filterTabs(tabs, '.com');
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.map((t) => t.id)).toContain(1);
    expect(result.map((t) => t.id)).toContain(4);
  });
});
