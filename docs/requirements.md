# TabLinkList Requirements

## Overview
TabLinkList is a Chrome extension that lists all open tabs in the current window, lets users select specific tabs, and copies their titles and URLs to the clipboard in various formats. Built with React, TypeScript, and Vite.

## Functional Requirements

### 1. Popup Interface

- **Tab Listing**:
    - When the popup opens, fetch all tabs in the *current window*.
    - Display tabs in a vertical list.
    - Each item shows:
        - Checkbox for selection.
        - Favicon (if available).
        - Tab Title.
    - **Visual Feedback**: Selected tabs are visually highlighted (e.g., background color change).
    - Clicking the item (label) toggles the checkbox.

- **Default Selection**:
    - When the popup opens, the **current (active) tab is pre-selected** automatically.
    - All other tabs start unselected.

- **Filter**:
    - A text input in the header allows filtering tabs by partial match on title or URL (case-insensitive).
    - Only matching tabs are shown in the list.
    - Tabs hidden by the filter are automatically deselected.
    - The filter input is auto-focused when the popup opens.

- **Selection Controls**:
    - "Select All" checkbox in the header toggles selection for all currently visible (filtered) tabs.
    - Individual checkboxes for per-tab selection.

- **Format Selection & Copy** (unified bottom bar):
    - Users can choose the copy format and copy in a single bottom bar.
    - **Supported Formats**:
        - **Text**: `Title\nURL` (Default)
        - **Markdown**: `[Title](URL)`
        - **HTML**: `<a href="URL">Title</a>`
    - "Copy" button displays the number of selected tabs (e.g., "Copy (3)").
    - Copies selected tabs to the clipboard in the chosen format.
    - Visual feedback on success (button changes to "Copied!").

### 2. Keyboard Operation

- All operations can be completed using only the keyboard after opening the popup.
- **Focus management**: Filter input receives focus automatically when the popup opens.
- **Tab sequence**: Select All checkbox → filter input → tab items → format buttons → Copy button
- **Key bindings**:

    | Action | Key |
    |--------|-----|
    | Toggle tab selection | `Space` (when tab item is focused) |
    | Navigate between elements | `Tab` / `Shift+Tab` |
    | Toggle Select All | `Tab` to focus, then `Space` |
    | Trigger copy (global) | `Ctrl+Enter` |
    | Trigger copy (via button) | `Tab` to focus Copy button, then `Enter` |

## Technical Requirements

### 1. Technology Stack
- **Framework**: React 19+
- **Language**: TypeScript
- **Build Tool**: Vite (with `@crxjs/vite-plugin`)
- **Styling**: Vanilla CSS Modules (`*.module.css`)
- **Testing**: Vitest + Testing Library

### 2. Chrome Extension Architecture
- **Manifest Version**: V3
- **Permissions**: `tabs`
- **Icons**: 16, 48, and 128px icons in both `icons` and `action.default_icon`

### 3. Code Quality
- Well-structured component hierarchy
- Separation of concerns (Logic vs UI)
- Strict TypeScript (no `any` types)

## UI/UX Goals
- Modern color palette (Blue/White theme)
- Custom scrollbar
- Entry animations for list items
- Clear distinction between selected and unselected states
- `:focus-visible` outlines on all interactive elements for keyboard navigation
