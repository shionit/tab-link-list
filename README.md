# TabLinkList

A Chrome extension that lists all open tabs in the current window, lets you select specific tabs, and copies their titles and URLs to the clipboard in your preferred format.

## Features

- **Tab Listing** — Displays all open tabs in the current window with favicons and titles.
- **Flexible Selection** — Select individual tabs or use "Select All" to pick them all at once. Selected tabs are visually highlighted.
- **Multiple Copy Formats** — Choose how the copied data is formatted:
  - **Text** — `Title` + `URL` (default)
  - **Markdown** — `[Title](URL)`
  - **HTML** — `<a href="URL">Title</a>`
- **Clipboard Copy** — One-click copy with visual "Copied!" feedback.

## Installation

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
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `dist` folder

## Development

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) with [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin/)
- CSS Modules
- Chrome Extension Manifest V3

## Project Structure

```
src/
├── components/         # React components
│   ├── Header.tsx          # Title bar + Select All
│   ├── TabList.tsx          # Scrollable tab list
│   ├── TabItem.tsx          # Individual tab row
│   ├── FormatSelector.tsx   # Text / Markdown / HTML picker
│   └── ActionButton.tsx     # Copy button
├── hooks/              # Custom React hooks
│   ├── useTabs.ts           # Fetches tabs from Chrome API
│   └── useSelection.ts     # Manages selected tab state
├── utils/              # Helper functions
│   ├── format.ts            # Tab formatting logic
│   └── clipboard.ts        # Clipboard API wrapper
└── popup/              # Extension popup entry point
    ├── index.html
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    └── index.css
```

## License

[MIT](LICENSE)
