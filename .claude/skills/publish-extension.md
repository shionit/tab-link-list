---
name: publish-extension
description: Build and publish the TabLinkList extension to the Chrome Web Store. Use this skill when the user asks to release, publish, deploy, or ship the extension, or when they mention bumping the version or uploading to the Chrome Web Store.
---

## Prerequisites

Ensure these environment variables are set before starting:
- `CHROME_EXTENSION_ID` — extension ID from the Chrome Web Store Developer Dashboard
- `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN` — OAuth credentials for the Chrome Web Store API
  *(See [chrome-webstore-upload](https://github.com/nicedoc/chrome-webstore-upload-cli#getting-an-access-token) for setup)*

## Steps

### 1. Update version numbers

Update `package.json` and `manifest.json` to the new release version:

```bash
npm version <new-version> --no-git-tag-version
```

Then update `"version"` in `manifest.json` to match.

### 2. Build the production bundle

```bash
npm run build
```

### 3. Package `dist/` into a ZIP

```bash
VERSION=$(node -p "require('./package.json').version")
cd dist && zip -r "../tab-link-list-v${VERSION}.zip" . -x ".*" && cd ..
echo "Created tab-link-list-v${VERSION}.zip"
```

### 4. Upload to the Chrome Web Store

**Option A — Manual (Browser)**
1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Select **TabLinkList**
3. Click **Upload new package** and upload the ZIP
4. Update store listing if needed (description, screenshots)
5. Click **Submit for review**

**Option B — CLI (Automated)**
```bash
npx chrome-webstore-upload-cli@latest upload \
  --source "tab-link-list-v$(node -p "require('./package.json').version").zip" \
  --extension-id "$CHROME_EXTENSION_ID" \
  --client-id "$CHROME_CLIENT_ID" \
  --client-secret "$CHROME_CLIENT_SECRET" \
  --refresh-token "$CHROME_REFRESH_TOKEN" \
  --auto-publish
```

### 5. Commit and tag the release

```bash
VERSION=$(node -p "require('./package.json').version")
git add package.json manifest.json
git commit -m "chore: release v${VERSION}"
git tag "v${VERSION}"
git push origin main --tags
```
