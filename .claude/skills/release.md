---
name: release
description: Full release flow for TabLinkList. Runs in strict order: docs update → version bump PR → wait for merge → ZIP + tag. Use when the user asks to release, cut a release, or ship a new version.
---

# Release Flow

Run these steps **in order**. Do not skip ahead. Each step must complete before starting the next.

## Step 1: Update Documentation

Run the `update-docs` workflow:
- Read `src/popup/App.tsx`, `src/components/`, `src/utils/` to understand current feature set
- Update `docs/requirements.md` to reflect any changes since the last release
- Update `README.md` (Features, Usage, Keyboard Operation, Tech Stack, Project Structure)
- Fix any stale code comments (e.g. references to removed behavior)

Commit all doc changes on a branch `docs/update-vVERSION`, push, and open a PR against `main`.

**Wait for the user to confirm the docs PR is merged before continuing.**

---

## Step 2: Bump Version and Open Release PR

After docs PR is merged, pull `main`:
```bash
git checkout main && git pull origin main
```

Bump the version in both files:
```bash
npm version VERSION --no-git-tag-version
```
Then update `"version"` in `manifest.json` to match.

Build and verify:
```bash
npm run build
```

Commit on branch `chore/release-vVERSION`, push, and open a PR against `main`:
```
title: chore: release vVERSION
body:
  ## Summary
  - Bump version to VERSION in `package.json` and `manifest.json`

  ## Changes since vPREV
  <summarise merged PRs since previous tag>

  ## Release checklist
  - [x] Docs updated (PR #N merged)
  - [x] Version bumped in `package.json` and `manifest.json`
  - [x] Production build passes
```

**Wait for the user to confirm the release PR is merged before continuing.**

---

## Step 3: Package ZIP, Tag, and Update Tag

After release PR is merged, pull `main`:
```bash
git checkout main && git pull origin main
```

Create the ZIP:
```bash
VERSION=$(node -p "require('./package.json').version")
cd dist && zip -r "../tab-link-list-v${VERSION}.zip" . -x ".*" && cd ..
echo "Created tab-link-list-v${VERSION}.zip"
```

Tag the current HEAD as the release (move tag if it already exists):
```bash
VERSION=$(node -p "require('./package.json').version")
git tag -d "v${VERSION}" 2>/dev/null || true
git push origin --delete "v${VERSION}" 2>/dev/null || true
git tag "v${VERSION}"
git push origin "v${VERSION}"
```

Confirm to the user:
- ZIP file created: `tab-link-list-vVERSION.zip`
- Tag `vVERSION` points to the latest `main`
- Next step: upload ZIP to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
