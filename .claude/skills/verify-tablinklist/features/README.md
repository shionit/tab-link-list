# TabLinkList verification map

This directory is the maintained source for verifying TabLinkList's user-facing behavior. Read this index before driving the popup, then use the matching feature file as the recipe.

## Baseline preconditions

- Run `npm run build`, then `node $TLL launch "$RUN"` per [../SKILL.md](../SKILL.md). The log shows `READY`.
- `node $TLL doctor "$RUN"` prints `DOCTOR OK` and lists the fixture tabs `Alpha Docs`, `Beta Board`, `Gamma Notes` in one window.
- Never drive an instance this run did not launch.

## Driving conventions

- Start each recipe with `open-popup`, which gives a fresh popup. State does not carry over between popups.
- Address elements by ARIA role and accessible name (`click:button:Markdown`, `row:Beta Board`), never by CSS class. The popup uses hashed CSS Module classes.
- Treat commands as literal. Quote steps that contain spaces or parentheses.
- `<port>` in expected output means the `fixturePort` from `$RUN/state.json`.

## Proof and skip reporting

- Capture `state:` before and after each action that changes state.
- UI proof is `shot:`, which gives a PNG and an ARIA snapshot with the `TabLinkList (N)` header visible.
- Copy proof is `wait:Copied!` and then `clipboard:` with an exact text match.
- Name evidence files after the feature ID (e.g. `copy-markdown.clipboard.txt`).
- If a path can't be reached, report the command you ran and the precondition that wasn't met. Don't count it as verified through a different path.

## Feature entry contract

Each feature file has an H1, a one-paragraph description, and then exactly these H2s in order: `Sub-features`, `How to get to it (user POV)`, `Driving it with tll.mjs` (starting with `Preconditions:`), `Gotchas`.

## Features

- [Open popup](./open-popup.md): popup lists the current window's tabs and pre-selects the active one.
- [Select tabs](./select-tabs.md): toggle rows by mouse or keyboard, and Select All / deselect all.
- [Filter tabs](./filter-tabs.md): partial, case-insensitive title or URL filter that deselects hidden tabs.
- [Copy links](./copy-links.md): Text, Markdown and HTML output, copied with the button or Ctrl+Enter.
