---
name: verify-tablinklist
description: Launch the built TabLinkList Chrome extension in an isolated Playwright Chromium, open the real toolbar popup over a window of fixture tabs, drive it (select, filter, format, copy) and capture screenshots, ARIA snapshots, popup state and the copied clipboard text. Use to prove a popup change works in the real extension, not just in vitest or the mock-data dev server.
---

# Verify TabLinkList

The user-facing surface is the extension's **toolbar popup** (`src/popup/index.html`). The `npm run dev` server only shows mock tabs and has no `chrome.tabs`, so it is not proof. This harness loads `dist/` into Playwright's bundled Chromium (branded Google Chrome ignores `--load-extension`). It opens three fixture tabs and then opens the real popup with `chrome.action.openPopup()`. The popup's `currentWindow` therefore contains only the fixture tabs, and its active tab is the one you choose.

Helper: `.claude/skills/verify-tablinklist/scripts/tll.mjs` (below, `$TLL`). Every command takes a run dir. Each run gets its own Chromium profile, CDP port and fixture-server port, so parallel runs don't collide. Never point it at the user's own Chrome.

```bash
TLL=.claude/skills/verify-tablinklist/scripts/tll.mjs
RUN=/tmp/tll-verify/$(date +%Y%m%d-%H%M%S)   # evidence lands in $RUN/evidence
```

## Setup (once per machine)

Playwright is installed outside the repo, in `~/.cache/tablinklist-verify`. Override this with `TLL_TOOLS_DIR`.

```bash
mkdir -p ~/.cache/tablinklist-verify && cd ~/.cache/tablinklist-verify \
  && (test -f package.json || npm init -y >/dev/null) \
  && npm i playwright && npx playwright install chromium && cd -
```

## Launch

```bash
npm run build                                   # always rebuild; the harness loads dist/ as-is
mkdir -p "$RUN" && node $TLL launch "$RUN" > "$RUN/launch.log" 2>&1 &
until grep -q READY "$RUN/launch.log"; do sleep 0.5; done; cat "$RUN/launch.log"
```

Ready means the log shows `READY cdp=<port> fixtures=http://127.0.0.1:<port> ext=<id>`. `launch` keeps running in the background and holds the browser and fixture server open. Fixture tabs, in order: `Alpha Docs` (`/alpha`), `Beta Board` (`/beta`), `Gamma Notes` (`/gamma`). A separate window holds a control tab titled `TabLinkList`, which the harness uses to open the popup. It is not part of the popup's tab list.

Set `TLL_HEADED=1` to watch the run. Headed mode uses the **real macOS clipboard** and overwrites the user's clipboard. Headless mode, the default, has its own clipboard.

## Doctor

```bash
node $TLL doctor "$RUN"
```

This check is read-only. It confirms the launch process is alive, that `dist/manifest.json` and `manifest.json` have the same version, that the fixture server responds, and that the loaded extension's version matches `dist/`. It also lists every tab as `windowId:*active title`. It must print `DOCTOR OK`. If anything looks wrong, run it first. If the version check fails, rebuild and relaunch.

## Drive

Open the popup with a chosen active tab, then send steps to it. Each `open-popup` closes any existing popup and opens a fresh one, which resets popup state (format resets to Text and the selection is only the active tab).

```bash
node $TLL open-popup "$RUN" "Beta Board"        # prints POPUP OPEN active="Beta Board"
node $TLL drive "$RUN" <step> [<step> ...]
```

Steps (accessible names come from the popup's ARIA tree; they are exact matches):

| Step | Does |
| --- | --- |
| `click:<role>:<name>` | Click by role and name, e.g. `click:button:Markdown`, `"click:button:Copy (2)"`, `"click:checkbox:Select All"` |
| `row:<tab title>` | Click a tab row (`role=checkbox`, name is the tab title) |
| `fill:<text>` | Set the filter box (`Filter by title or URL...`). `fill:` clears it |
| `press:<key>` | Keyboard on the focused element, e.g. `press:Tab`, `press:Space`, `press:Control+Enter` |
| `wait:<text>` | Wait for exact visible text, e.g. `wait:Copied!` |
| `state:<name>` | Write `<name>.state.json` and print header, filter, Select All, rows with checked state, active format, copy button label and focused element |
| `shot:<name>` | Write `<name>.png` and `<name>.aria.txt` (popup screenshot and ARIA snapshot) |
| `clipboard:<name>` | Read the browser clipboard and write `<name>.clipboard.txt` |

Example (Markdown copy of the active tab):

```bash
node $TLL drive "$RUN" state:before click:button:Markdown "click:button:Copy (1)" wait:Copied! clipboard:md state:after shot:after
```

The per-feature recipes are in [features/README.md](features/README.md). Read the index before driving.

## Evidence

Everything goes to `$RUN/evidence/`, and `stop` leaves that folder in place. A proof needs:

- The `state:` from before the action and from after it. A final screenshot alone is not enough.
- For copy: `wait:Copied!` and then `clipboard:`. The clipboard text is the side effect users care about, so assert its exact content. Fixture URLs include the run's random port (`http://127.0.0.1:<fixturePort>/beta`). Read that port from `$RUN/state.json` or `launch.log`.
- `shot:` for the visible end state, with the `TabLinkList (N)` header in frame.
- Drive only through the popup UI (clicks, typing, keys). Don't call `chrome.*` or React setters to reach a state. The fixture tabs are the only stand-in, and they are real tabs served over real HTTP.

## Cleanup

```bash
node $TLL stop "$RUN"     # SIGTERMs the launch pid from state.json, deletes profile/ and state.json
ls "$RUN/evidence"        # proof survives
```

`stop` kills only the pid this run recorded. Never `pkill` Chromium or node by name. Run `stop` after failed attempts too. If `launch` died before writing `state.json`, kill its background job (`kill %1`) and remove `$RUN/profile`.

## Gotchas

- Rebuild before launching. A stale `dist/` loads old code silently, and doctor only catches a version mismatch.
- `wait:Copied!` before `clipboard:`. The clipboard keeps the previous copy, so reading too early returns stale text. The button reverts to `Copy (N)` after 2 s, so take `shot:` of the success state in the same `drive` call.
- `clipboard:` reads from a fixture tab because extension origins can't be granted `clipboard-read`. The popup stays open.
- The filter box has autofocus, so `press:` keys go to it until focus moves. In DOM order, `Select All` comes *before* the filter, so `press:Tab` from the filter goes to the first row.
