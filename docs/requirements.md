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

- **Selection Controls**:
    - "Select All" checkbox in the header to toggle all tab selections at once.
    - Individual checkboxes for per-tab selection.

- **Format Selection**:
    - Users can choose the copy format before copying.
    - **Supported Formats**:
        - **Text**: `Title\nURL` (Default)
        - **Markdown**: `[Title](URL)`
        - **HTML**: `<a href="URL">Title</a>`

- **Actions**:
    - "Copy" button displays the number of selected tabs (e.g., "Copy (3)").
    - Copies selected tabs to the clipboard in the chosen format.
    - Visual feedback on success (button changes to "Copied!").

## Technical Requirements

### 1. Technology Stack
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite (with `@crxjs/vite-plugin`)
- **Styling**: Vanilla CSS Modules (`*.module.css`)

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
