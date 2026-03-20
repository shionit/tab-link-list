---
description: Update README.md and requirements.md to reflect the current feature set
---

Run this workflow whenever a feature is added, removed, or changed.

## Steps

1. **Review the current codebase** to understand what changed:
   - Read `src/popup/App.tsx` for overall feature orchestration
   - Read `src/hooks/useTabs.ts` for tab-fetching behavior
   - Read `src/hooks/useSelection.ts` for selection behavior
   - Read `src/components/` for UI-level features
   - Read `src/utils/format.ts` for supported copy formats

2. **Update `docs/requirements.md`** to reflect the current feature set:
   - Keep every functional requirement accurate and up to date
   - Add new requirements under the appropriate section
   - Remove or modify any requirements that no longer apply
   - Do NOT change technical requirements or UI/UX goals unless they actually changed

3. **Update `README.md`** to match the new feature set:
   - Keep the Features section in sync with `requirements.md`
   - Keep the Usage section accurate (step-by-step for end users)
   - Keep the Project Structure section accurate if files were added or removed
   - Preserve existing links (Chrome Web Store URL, GitHub URL, badge URLs)
   - Do NOT change the Tech Stack or Contributing sections unless the stack changed
