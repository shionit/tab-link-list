# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server with HMR (uses mock tab data — Chrome API unavailable in browser)
npm run dev

# Build for production (tsc + vite build → dist/)
npm run build

# Lint
npm run lint

# Run tests
npm run test

# Run a single test file
npx vitest run src/utils/format.test.ts
```

To load the built extension: go to `chrome://extensions`, enable Developer mode, click "Load unpacked", and select `dist/`.

## Architecture

This is a Chrome Extension Manifest V3 popup built with React 19 + TypeScript + Vite. The `@crxjs/vite-plugin` handles Chrome extension packaging — `manifest.json` at the root is the extension manifest and is read directly by `vite.config.ts`.

**Data flow:**
1. `useTabs` hook queries `chrome.tabs` API for all tabs in the current window; falls back to mock data when Chrome API is absent (dev server)
2. `useSelection` hook manages a `Set<number>` of selected tab IDs
3. `App.tsx` orchestrates state: auto-selects the active tab on load, filters tabs by `filterText`, deselects hidden tabs, computes "all selected" state against filtered tabs, formats and copies on demand
4. `filterTabs` in `src/utils/filter.ts` filters tabs by partial title/URL match (case-insensitive)
5. `formatTabs` in `src/utils/format.ts` handles the three output formats: `text`, `markdown`, `html`

**Key files:**
- `manifest.json` — extension manifest (permissions: `tabs` only)
- `src/popup/App.tsx` — root component, wires all hooks and components
- `src/hooks/useTabs.ts` — Chrome API integration + mock fallback; defines the `Tab` type used throughout
- `src/utils/filter.ts` — pure filter logic; tested in `filter.test.ts`
- `src/utils/format.ts` — pure formatting logic; tested in `format.test.ts`
- `src/components/BottomBar.tsx` — merged format selector + copy button in one row

**Styling:** CSS Modules (`.module.css`) per component; global styles in `src/popup/App.css` and `src/popup/index.css`.

Tests are in `src/**/*.test.ts` and run in a Node environment (no DOM).

## Common Gotchas

- **Chrome API unavailable in dev:** `chrome.tabs` doesn't exist in the browser dev server — `useTabs` automatically falls back to mock data. Test real tab behavior by building and loading the extension.
- **Must reload extension after build:** After `npm run build`, go to `chrome://extensions` and click the reload icon for TabLinkList — Chrome does not hot-reload unpacked extensions.
- **`main` branch is push-protected:** Never push directly to `main`. Always use a feature or release branch and open a PR.
- **Version must be bumped in two places:** `package.json` and `manifest.json` must be updated together on release — they are not linked automatically.
- **Releasing to Chrome Web Store:** Manual upload via the dashboard is preferred; automated credentials (`CHROME_CLIENT_ID` etc.) are not configured. See `.claude/skills/publish-extension.md` for the full release flow.
