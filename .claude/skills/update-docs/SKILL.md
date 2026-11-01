---
name: update-docs
description: Update README.md and requirements.md to reflect the current feature set. Use this skill whenever a feature is added, removed, or changed, or when the user asks to update, sync, or refresh the documentation or README.
---

Run this skill whenever a feature is added, removed, or changed.

## Steps

### 1. Review the current codebase

Read these files to understand what changed:
- `src/popup/App.tsx` — overall feature orchestration
- `src/hooks/useTabs.ts` — tab-fetching behavior
- `src/hooks/useSelection.ts` — selection behavior
- `src/components/` — UI-level features
- `src/utils/format.ts` — supported copy formats

### 2. Update `docs/requirements.md`

Reflect the current feature set:
- Keep every functional requirement accurate and up to date
- Add new requirements under the appropriate section
- Remove or modify any requirements that no longer apply
- Do NOT change technical requirements or UI/UX goals unless they actually changed

### 3. Update `README.md`

Match the new feature set:
- Keep the **Features** section in sync with `requirements.md`
- Keep the **Usage** section accurate (step-by-step for end users)
- Keep the **Project Structure** section accurate if files were added or removed
- Preserve existing links (Chrome Web Store URL, GitHub URL, badge URLs)
- Do NOT change the Tech Stack or Contributing sections unless the stack changed
