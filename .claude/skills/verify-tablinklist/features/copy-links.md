# Copy links

The bottom bar picks an output format (`Text`, `Markdown`, `HTML`). `Copy (N)` writes the selected tabs to the clipboard in tab-strip order, and the button shows `Copied!` for about 2 seconds. Ctrl+Enter copies from anywhere in the popup.

## Sub-features

- `copy-text` writes `Title\nURL` blocks separated by a blank line.
- `copy-markdown` writes `[Title](URL)` lines separated by a blank line.
- `copy-html` writes `<a href="URL">Title</a>` joined by `\n<br>\n`.
- `copy-shortcut` Ctrl+Enter copies with the current format and selection.
- `copy-disabled` with nothing selected, `Copy (0)` is disabled and nothing is copied.

## How to get to it (user POV)

- Click a format pill, then click `Copy (N)`.
- Press Ctrl+Enter anywhere in the popup.

## Driving it with tll.mjs

Preconditions:

- Baseline from [README.md](./README.md). Read `<port>` from `$RUN/state.json` (`fixturePort`).

- **Markdown, one tab.** Run `node $TLL open-popup "$RUN" "Beta Board"` and then `node $TLL drive "$RUN" state:copy-markdown-before click:button:Markdown "click:button:Copy (1)" wait:Copied! clipboard:copy-markdown state:copy-markdown-after shot:copy-markdown`. The clipboard is exactly `[Beta Board](http://127.0.0.1:<port>/beta)`. After the copy, `format` is `Markdown` and `copyButton` is `Copied!`.
- **Text, two tabs, button.** Run `node $TLL open-popup "$RUN" "Alpha Docs"` and then `node $TLL drive "$RUN" "row:Gamma Notes" "click:button:Copy (2)" wait:Copied! clipboard:copy-text`. The clipboard is `Alpha Docs\nhttp://127.0.0.1:<port>/alpha\n\nGamma Notes\nhttp://127.0.0.1:<port>/gamma`.
- **HTML, all tabs, shortcut.** Run `node $TLL open-popup "$RUN" "Alpha Docs"` and then `node $TLL drive "$RUN" "click:checkbox:Select All" click:button:HTML press:Control+Enter wait:Copied! clipboard:copy-html`. The clipboard has three `<a href="http://127.0.0.1:<port>/{alpha,beta,gamma}">…</a>` entries in that order, joined by `\n<br>\n`.
- **Disabled.** Run `node $TLL open-popup "$RUN" "Alpha Docs"` and then `node $TLL drive "$RUN" "row:Alpha Docs" state:copy-disabled shot:copy-disabled`. `copyButton` is `Copy (0)` and the ARIA snapshot shows `button "Copy (0)" [disabled]`.

## Gotchas

- The clipboard keeps the previous copy. Always `wait:Copied!` before `clipboard:`, and change the format or selection between copies so stale text can't pass as fresh.
- Ctrl+Enter is Control, not Cmd, on macOS too.
- `Copied!` reverts after 2 s. Run `shot:` of the success state in the same `drive` call as the copy.
- Titles and URLs are not escaped in HTML/Markdown output. That is current behavior, not a harness artifact.
