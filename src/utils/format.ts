import type { Tab } from '../hooks/useTabs';

export type CopyFormat = 'text' | 'markdown' | 'html';

export function formatTabs(tabs: Tab[], format: CopyFormat = 'text'): string {
    if (tabs.length === 0) return '';

    switch (format) {
        case 'markdown':
            return tabs.map((tab) => `[${tab.title}](${tab.url})`).join('\n\n');
        case 'html':
            return tabs.map((tab) => `<a href="${tab.url}">${tab.title}</a>`).join('\n<br>\n');
        case 'text':
        default:
            return tabs.map((tab) => `${tab.title}\n${tab.url}`).join('\n\n');
    }
}
