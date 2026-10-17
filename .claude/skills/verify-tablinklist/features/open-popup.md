# Open popup

Clicking the TabLinkList toolbar icon opens a popup that lists every tab in the current window with its favicon and title. The header shows the count, and the tab that was active when the popup opened is pre-selected.

## Sub-features

- `popup-list` lists all tabs of the current window in tab-strip order, and no tabs from other windows.
- `popup-count` header reads `TabLinkList (N)` where N is the number of listed tabs.
- `popup-preselect` the active tab's row is checked and the copy button reads `Copy (1)`.
- `popup-focus` the filter box has focus on open.

## How to get to it (user POV)

- Click the TabLinkList icon in the Chrome toolbar.

## Driving it with tll.mjs

Preconditions:

- Baseline from [README.md](./README.md). `doctor` shows the three fixture tabs in one window and the control tab in another.

- **Open over Beta.** Run `node $TLL open-popup "$RUN" "Beta Board"`. Prints `POPUP OPEN active="Beta Board"`.
- **Inspect.** Run `node $TLL drive "$RUN" state:popup-open shot:popup-open`. State has `header` `TabLinkList (3)`, rows `Alpha Docs`, `Beta Board`, `Gamma Notes` in that order with only `Beta Board` checked, `format` `Text`, `copyButton` `Copy (1)`, and `focused` starting with `<input` and containing `Filter by title or URL...`.
- **Different active tab.** Run `node $TLL open-popup "$RUN" "Gamma Notes"` and then `node $TLL drive "$RUN" state:popup-gamma`. Only `Gamma Notes` is checked.
- **Proof.** `popup-open.png` and `popup-open.aria.txt` show `TabLinkList (3)` and `checkbox "Beta Board" [checked]`. The control tab `TabLinkList` from the other window is absent.

## Gotchas

- Favicons are absent: the fixture pages have none, so rows are title-only. Don't treat that as a regression.
- If the control tab appears in the list, the popup was opened over the wrong window. Re-run `doctor` and check that the control tab has its own windowId.
