import { describe, it, expect } from 'vitest'
import { formatTabs } from './format'
import type { Tab } from '../hooks/useTabs'

const sampleTabs: Tab[] = [
    { id: 1, title: 'GitHub', url: 'https://github.com' },
    { id: 2, title: 'Vitest Docs', url: 'https://vitest.dev' },
]

describe('formatTabs', () => {
    it('returns empty string for empty array', () => {
        expect(formatTabs([])).toBe('')
    })

    it('formats tabs as plain text by default', () => {
        const result = formatTabs(sampleTabs)
        expect(result).toBe('GitHub\nhttps://github.com\n\nVitest Docs\nhttps://vitest.dev')
    })

    it('formats tabs as markdown links', () => {
        const result = formatTabs(sampleTabs, 'markdown')
        expect(result).toBe('[GitHub](https://github.com)\n\n[Vitest Docs](https://vitest.dev)')
    })

    it('formats tabs as HTML anchor tags', () => {
        const result = formatTabs(sampleTabs, 'html')
        expect(result).toBe(
            '<a href="https://github.com">GitHub</a>\n<br>\n<a href="https://vitest.dev">Vitest Docs</a>',
        )
    })

    it('formats a single tab without extra separators', () => {
        const single: Tab[] = [{ id: 3, title: 'Example', url: 'https://example.com' }]
        expect(formatTabs(single, 'text')).toBe('Example\nhttps://example.com')
        expect(formatTabs(single, 'markdown')).toBe('[Example](https://example.com)')
        expect(formatTabs(single, 'html')).toBe('<a href="https://example.com">Example</a>')
    })
})
