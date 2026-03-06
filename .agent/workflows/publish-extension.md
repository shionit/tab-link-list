---
description: Build and publish the extension to the Chrome Web Store
---

## Prerequisites

- `CHROME_EXTENSION_ID` — Your extension's ID from the Chrome Web Store Developer Dashboard
- `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN` — OAuth credentials for the Chrome Web Store API  
  *(See [chrome-webstore-upload](https://github.com/nicedoc/chrome-webstore-upload-cli#getting-an-access-token) for setup instructions)*

## Steps

// turbo
1. **Update version numbers** in both `package.json` and `manifest.json` to the new release version, e.g.:
   ```bash
   # Example: bump to 1.1.0
   npm version 1.1.0 --no-git-tag-version
   # Then manually update "version" in manifest.json to match
   ```

// turbo
2. **Build the production bundle:**
   ```bash
   npm run build
   ```

// turbo
3. **Package the `dist/` folder into a ZIP file:**
   ```bash
   VERSION=$(node -p "require('./package.json').version")
   cd dist && zip -r "../tab-link-list-v${VERSION}.zip" . -x ".*" && cd ..
   echo "Created tab-link-list-v${VERSION}.zip"
   ```

4. **Upload to the Chrome Web Store** — choose one of:

   **Option A — Manual (Browser)**
   1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
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

// turbo
5. **Commit and tag the release:**
   ```bash
   VERSION=$(node -p "require('./package.json').version")
   git add package.json manifest.json
   git commit -m "chore: release v${VERSION}"
   git tag "v${VERSION}"
   git push origin main --tags
   ```
