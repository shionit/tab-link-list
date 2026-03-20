import type { Tab } from '../hooks/useTabs';

export function filterTabs(tabs: Tab[], query: string): Tab[] {
  if (!query) return tabs;
  const lower = query.toLowerCase();
  return tabs.filter(
    (t) => t.title.toLowerCase().includes(lower) || t.url.toLowerCase().includes(lower)
  );
}
