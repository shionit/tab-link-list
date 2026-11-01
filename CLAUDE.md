# CLAUDE.md

Chrome Extension (Manifest V3) popup: React 19 + TypeScript + Vite, packaged by `@crxjs/vite-plugin` from the root `manifest.json`.

## Commands

```bash
npm run dev                              # dev server with mock tabs (no chrome.tabs)
npm run build                            # tsc -b + vite build → dist/
npm run lint
npx tsc -b --noEmit                      # type-check
npm run test                             # vitest (jsdom)
npx vitest run src/utils/format.test.ts  # single test file
```

To confirm a popup change in the real extension (not just vitest or the mock dev server), use the `verify-tablinklist` skill.

## Conventions

- Styling: CSS Modules (`*.module.css`) per component; globals in `src/popup/App.css` and `src/popup/index.css`.
- Tests live next to the code as `*.test.ts` / `*.test.tsx`.

## Gotchas

- **Chrome API unavailable in dev:** `useTabs` falls back to mock data when `chrome.tabs` is absent. Test real tab behavior by building and loading `dist/` as an unpacked extension.
- **Must reload extension after build:** Chrome does not hot-reload unpacked extensions; click reload in `chrome://extensions`.
- **`main` branch is push-protected:** always use a feature or release branch and open a PR.
- **Version lives in two places:** `package.json` and `manifest.json` (enforced by `src/version.test.ts`).
- **Releasing:** run `/release`. Chrome Web Store upload is manual via the dashboard; no automated credentials are configured.
