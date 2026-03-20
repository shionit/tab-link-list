---
name: update-screenshots
description: Regenerate the extension's promotional screenshots (public/screenshot.png and public/screenshot_640x400.jpg). Use this skill when the user asks to update, regenerate, or refresh the screenshots or store listing images.
---

## Steps

### 1. Generate a new promotional screenshot

Use the image generation tool with this prompt:

> A clean screenshot of a Chrome extension popup window (350px wide, 500px tall) with a white background. At the top is a header bar with the text "TabLinkList (8)" on the left and a "Select All" checkbox on the right. Below is a scrollable list of browser tabs, each row has a checkbox, a small 16px favicon, and a tab title. The following tabs are shown with checkboxes:
> - ✅ Google (with Google favicon) - highlighted with light blue background #e6f2ff
> - ✅ GitHub - Pull Requests (with GitHub favicon) - highlighted with light blue background
> - ☐ YouTube - Home (with YouTube favicon) - white background
> - ✅ Stack Overflow - Questions (with SO favicon) - highlighted with light blue background
> - ☐ Reddit - Front Page (with Reddit favicon) - white background
> - ☐ Twitter / X (with X favicon) - white background
> - ✅ MDN Web Docs (with MDN favicon) - highlighted with light blue background
> - ☐ ChatGPT (with OpenAI favicon) - white background
>
> Below the list is a format selector showing three pill buttons: "Text" (active, white with blue text), "Markdown" (gray), "HTML" (gray). At the bottom is a blue "Copy (4)" button spanning the full width. Modern, clean UI with system-ui font, subtle shadows, rounded corners. No browser chrome around it, just the popup content itself.

### 2. Copy the generated image to `public/screenshot.png`

```bash
cp <generated_image_path> public/screenshot.png
```

### 3. Scale and pad to 640×400 JPEG

```bash
sips -Z 400 public/screenshot.png --out /tmp/screenshot_scaled.png
sips --padToHeightWidth 400 640 --padColor FFFFFF /tmp/screenshot_scaled.png --out /tmp/screenshot_padded.png
sips -s format jpeg /tmp/screenshot_padded.png --out public/screenshot_640x400.jpg
```

### 4. Verify output dimensions

```bash
sips -g pixelWidth -g pixelHeight public/screenshot.png public/screenshot_640x400.jpg
```

Expected:
- `screenshot.png`: 640×640
- `screenshot_640x400.jpg`: 640×400
