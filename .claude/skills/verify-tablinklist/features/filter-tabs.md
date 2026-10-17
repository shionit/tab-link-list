# Filter tabs

Typing in `Filter by title or URL...` narrows the list to tabs whose title or URL contains the text, ignoring case. Tabs hidden by the filter are deselected, so a copy never includes tabs the user can't see.

## Sub-features

- `filter-title` a partial, case-insensitive match on the title narrows the list and the header count.
- `filter-url` a match on the URL alone (e.g. the path `/gamma`) also keeps the tab.
- `filter-deselect` a selected tab that the filter hides is unchecked and stays unchecked after the filter is cleared.
- `filter-select-all` `Select All` applies only to the visible rows.
- `filter-clear` an empty filter restores the full list.

## How to get to it (user POV)

- Type in the filter box at the top of the popup. It has focus when the popup opens.

## Driving it with tll.mjs

Preconditions:

- Baseline from [README.md](./README.md).

- **Fresh popup.** Run `node $TLL open-popup "$RUN" "Alpha Docs"`.
- **Title match + deselect.** Run `node $TLL drive "$RUN" fill:BETA state:filter-title`. `header` is `TabLinkList (1)`, the only row is `Beta Board` (unchecked), and `copyButton` is `Copy (0)` because hidden `Alpha Docs` was deselected.
- **Select All within filter.** Run `node $TLL drive "$RUN" "click:checkbox:Select All" state:filter-select-all`. `Beta Board` is checked and `copyButton` is `Copy (1)`.
- **Clear.** Run `node $TLL drive "$RUN" fill: state:filter-clear shot:filter-clear`. Three rows are back, only `Beta Board` is checked, and `Alpha Docs` stays unchecked.
- **URL-only match.** Run `node $TLL drive "$RUN" fill:/gamma state:filter-url`. The only row is `Gamma Notes`. The title doesn't contain `/gamma`, so the URL matched.
- **No match.** Run `node $TLL drive "$RUN" fill:zzz state:filter-empty`. `header` is `TabLinkList (0)` with no rows and `selectAll` is `false`.

## Gotchas

- `fill:127.0.0.1` matches every fixture tab because they share a host. Use paths or title words to filter.
- `copyButton` counts every selected tab, but hidden tabs are always deselected, so the count matches the visible checked rows.
