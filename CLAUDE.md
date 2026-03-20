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
3. `App.tsx` orchestrates state: auto-selects the active tab on load, computes "all selected" state, formats and copies on demand
4. `formatTabs` in `src/utils/format.ts` handles the three output formats: `text`, `markdown`, `html`

**Key files:**
- `manifest.json` — extension manifest (permissions: `tabs` only)
- `src/popup/App.tsx` — root component, wires all hooks and components
- `src/hooks/useTabs.ts` — Chrome API integration + mock fallback; defines the `Tab` type used throughout
- `src/utils/format.ts` — pure formatting logic; only file with tests

**Styling:** CSS Modules (`.module.css`) per component; global styles in `src/popup/App.css` and `src/popup/index.css`.

Tests are in `src/**/*.test.ts` and run in a Node environment (no DOM).
