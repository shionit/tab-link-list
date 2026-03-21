# TabLinkList

> A Chrome extension that lists all open tabs, lets you select them, and copies their titles and URLs to the clipboard.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-TabLinkList-blue?logo=google-chrome)](https://chromewebstore.google.com/detail/tablinklist/lnpckkmjilppmjkdjocffmmlhhepkocg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Features

- 📋 **List all open tabs** — Displays every tab in the current window with its favicon and title.
- ✅ **Smart default selection** — The current (active) tab is automatically pre-selected when the popup opens.
- ☑️ **Flexible selection** — Toggle individual tabs or use "Select All" to pick them all at once.
- 🔍 **Filter tabs** — Type in the filter box to narrow the list by title or URL. Hidden tabs are automatically deselected.
- 📝 **Multiple copy formats** — Choose how copied data is formatted:
  | Format | Output |
  |--------|--------|
  | **Text** | `Title` + newline + `URL` |
  | **Markdown** | `[Title](URL)` |
  | **HTML** | `<a href="URL">Title</a>` |
- 📋 **One-click copy** — Copies selected tabs to the clipboard with a "Copied!" confirmation.

---

## Installation

### From the Chrome Web Store

Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/tablinklist/lnpckkmjilppmjkdjocffmmlhhepkocg) — no build step required.

### From Source (Developer Mode)

1. Clone the repository:
   ```bash
   git clone https://github.com/shionit/TabLinkList.git
   cd TabLinkList
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load into Chrome:
   - Navigate to `chrome://extensions`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked** and select the `dist/` folder

---

## Usage

1. Open the popup by clicking the **TabLinkList** icon in the Chrome toolbar.
2. The current tab is pre-selected. Check or uncheck tabs as needed.
3. Optionally type in the **filter box** to narrow the list by title or URL.
4. Pick a copy format (**Text**, **Markdown**, or **HTML**) in the bottom bar.
5. Click **Copy** — the selected tabs' titles and URLs are copied to your clipboard.

---

## Development

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite](https://vite.dev/) + [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin/) |
| Styling | Vanilla CSS Modules |
| Platform | Chrome Extension Manifest V3 |

---

## Project Structure

```
src/
├── components/       # React UI components
│   ├── Header.tsx        # Title bar + Select All checkbox + filter input
│   ├── TabList.tsx        # Scrollable list of tabs
│   ├── TabItem.tsx        # Individual tab row
│   └── BottomBar.tsx      # Format selector + Copy button (unified bar)
├── hooks/            # Custom React hooks
│   ├── useTabs.ts         # Fetches tabs from Chrome API
│   └── useSelection.ts    # Manages selected tab state
├── utils/            # Pure helper functions
│   ├── format.ts          # Tab-to-string formatting
│   ├── filter.ts          # Tab filtering by title / URL
│   └── clipboard.ts       # Clipboard API wrapper
└── popup/            # Extension popup entry point
    ├── index.html
    ├── main.tsx
    ├── App.tsx
    └── App.css
```

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss any significant changes.

## License

[MIT](LICENSE)
