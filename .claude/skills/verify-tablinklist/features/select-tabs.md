# Select tabs

Users choose which tabs to copy by toggling rows with the mouse or keyboard, or by using the `Select All` checkbox, which toggles every visible row. The copy button count follows the selection.

## Sub-features

- `select-click` clicking a row toggles its checkbox and highlight.
- `select-keyboard` with a row focused, Space toggles it. Each row is a single tab stop.
- `select-all` `Select All` checks every visible row, and clicking it again unchecks them.
- `select-all-sync` unchecking any row clears `Select All`.

## How to get to it (user POV)

- Click a tab row in the popup.
- Tab to a row and press Space.
- Click the `Select All` checkbox in the header.

## Driving it with tll.mjs

Preconditions:

- Baseline from [README.md](./README.md).

- **Fresh popup.** Run `node $TLL open-popup "$RUN" "Alpha Docs"`. Only `Alpha Docs` is checked.
- **Click a row.** Run `node $TLL drive "$RUN" "row:Gamma Notes" state:select-click`. `Alpha Docs` and `Gamma Notes` are checked, and `copyButton` is `Copy (2)`.
- **Keyboard toggle.** Run `node $TLL open-popup "$RUN" "Gamma Notes"` and then `node $TLL drive "$RUN" press:Tab press:Tab press:Space state:select-keyboard`. Focus moves filter → `Alpha Docs` → `Beta Board`. `Beta Board` and `Gamma Notes` are checked, and `focused` is the `Beta Board` row (`role="checkbox"`).
- **Select All.** Run `node $TLL drive "$RUN" "click:checkbox:Select All" state:select-all`. All three rows are checked, `selectAll` is `true`, and `copyButton` is `Copy (3)`.
- **Uncheck one.** Run `node $TLL drive "$RUN" "row:Alpha Docs" state:select-all-sync`. `selectAll` is `false` and `copyButton` is `Copy (2)`.
- **Deselect all.** Run `node $TLL drive "$RUN" "click:checkbox:Select All" "click:checkbox:Select All" state:select-none shot:select-none`. The first click re-checks all rows and the second unchecks all of them. `copyButton` is `Copy (0)` and the button is disabled in the ARIA snapshot.

## Gotchas

- `Select All` comes before the filter in DOM order, so `press:Tab` from the autofocused filter goes to the first row. `press:Shift+Tab` reaches `Select All`.
- Enter on a row does nothing. Only Space toggles.
