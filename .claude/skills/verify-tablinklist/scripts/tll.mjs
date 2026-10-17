#!/usr/bin/env node
// Verification harness for the TabLinkList popup. See ../SKILL.md for usage.
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const TOOLS_DIR = process.env.TLL_TOOLS_DIR || path.join(os.homedir(), '.cache', 'tablinklist-verify');
const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../..');
const DIST = path.join(REPO_ROOT, 'dist');
const FIXTURES = [
  { slug: 'alpha', title: 'Alpha Docs' },
  { slug: 'beta', title: 'Beta Board' },
  { slug: 'gamma', title: 'Gamma Notes' },
];

function loadPlaywright() {
  try {
    return createRequire(path.join(TOOLS_DIR, 'noop.js'))('playwright');
  } catch {
    die(`playwright not found in ${TOOLS_DIR}. Run the Setup step in SKILL.md.`);
  }
}

function die(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

// Unpacked extension IDs are derived from the absolute path of the extension dir.
function extensionId(dir) {
  const hex = crypto.createHash('sha256').update(fs.realpathSync(dir)).digest('hex').slice(0, 32);
  return [...hex].map((c) => String.fromCharCode(97 + parseInt(c, 16))).join('');
}

function readState(runDir) {
  const file = path.join(runDir, 'state.json');
  if (!fs.existsSync(file)) die(`no state.json in ${runDir}; was launch run with this dir?`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function connect(state) {
  const { chromium } = loadPlaywright();
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${state.cdpPort}`);
  const pages = browser.contexts().flatMap((c) => c.pages());
  return { browser, pages };
}

// The toolbar popup is the extension page that is not hosted in a tab.
async function findPopup(pages, extId) {
  for (const p of pages) {
    if (!p.url().startsWith(`chrome-extension://${extId}/src/popup/index.html`)) continue;
    const inTab = await p.evaluate(async () => Boolean(await chrome.tabs.getCurrent()));
    if (!inTab) return p;
  }
  return null;
}

function findControl(pages, extId) {
  return pages.find((p) => p.url() === `chrome-extension://${extId}/src/popup/index.html?control`);
}

async function launch(runDir) {
  if (!fs.existsSync(path.join(DIST, 'manifest.json'))) die('dist/ missing; run `npm run build` first.');
  fs.mkdirSync(path.join(runDir, 'evidence'), { recursive: true });
  const profile = path.join(runDir, 'profile');

  const server = http.createServer((req, res) => {
    const fx = FIXTURES.find((f) => req.url === `/${f.slug}`);
    if (!fx) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`<!doctype html><title>${fx.title}</title><h1>${fx.title}</h1>`);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const fixturePort = server.address().port;

  const { chromium } = loadPlaywright();
  const ctx = await chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    headless: process.env.TLL_HEADED !== '1',
    args: [`--disable-extensions-except=${DIST}`, `--load-extension=${DIST}`, '--remote-debugging-port=0'],
  });
  const cdpPort = Number(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]);
  const extId = extensionId(DIST);

  const first = ctx.pages()[0] ?? (await ctx.newPage());
  await first.goto(`http://127.0.0.1:${fixturePort}/${FIXTURES[0].slug}`);
  for (const fx of FIXTURES.slice(1)) {
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${fixturePort}/${fx.slug}`);
  }
  // Control page: an extension page in its own window, used to open the real popup.
  const control = await ctx.newPage();
  await control.goto(`chrome-extension://${extId}/src/popup/index.html?control`);
  await control.evaluate(async () => {
    const me = await chrome.tabs.getCurrent();
    await chrome.windows.create({ tabId: me.id });
  });

  const state = { pid: process.pid, cdpPort, fixturePort, extId, profile, dist: DIST, startedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(runDir, 'state.json'), JSON.stringify(state, null, 2));
  console.log(`READY cdp=${cdpPort} fixtures=http://127.0.0.1:${fixturePort} ext=${extId}`);

  const shutdown = async () => {
    await ctx.close().catch(() => {});
    server.close();
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

async function doctor(runDir) {
  const state = readState(runDir);
  const problems = [];
  if (!pidAlive(state.pid)) problems.push(`launch process ${state.pid} is not running`);
  const builtVersion = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.json'), 'utf8')).version;
  const srcVersion = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'manifest.json'), 'utf8')).version;
  if (builtVersion !== srcVersion) problems.push(`dist version ${builtVersion} != manifest.json ${srcVersion}; rebuild`);
  try {
    const res = await fetch(`http://127.0.0.1:${state.fixturePort}/alpha`);
    if (!(await res.text()).includes('Alpha Docs')) problems.push('fixture server returned unexpected body');
  } catch (e) {
    problems.push(`fixture server unreachable: ${e.message}`);
  }
  if (problems.length === 0) {
    const { browser, pages } = await connect(state);
    const control = findControl(pages, state.extId);
    if (!control) {
      problems.push('control page missing (extension not loaded?)');
    } else {
      const info = await control.evaluate(async () => ({
        version: chrome.runtime.getManifest().version,
        tabs: (await chrome.tabs.query({})).map((t) => `${t.windowId}:${t.active ? '*' : ' '}${t.title}`),
      }));
      if (info.version !== builtVersion) problems.push(`loaded extension ${info.version} != dist ${builtVersion}`);
      console.log(`extension ${state.extId} v${info.version}`);
      console.log(`tabs (window:*active title):\n  ${info.tabs.join('\n  ')}`);
    }
    await browser.close();
  }
  if (problems.length) {
    console.log(`DOCTOR FAIL\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log('DOCTOR OK');
}

async function openPopup(runDir, activeTitle) {
  const state = readState(runDir);
  const { browser, pages } = await connect(state);
  const old = await findPopup(pages, state.extId);
  if (old) await old.close();
  const control = findControl(pages, state.extId);
  if (!control) die('control page missing; run doctor');
  const err = await control.evaluate(async (title) => {
    const tabs = await chrome.tabs.query({});
    const target = tabs.find((t) => t.title === title);
    if (!target) return `no tab titled ${title}; have: ${tabs.map((t) => t.title).join(', ')}`;
    await chrome.tabs.update(target.id, { active: true });
    await chrome.windows.update(target.windowId, { focused: true });
    await chrome.action.openPopup({ windowId: target.windowId });
    return null;
  }, activeTitle);
  if (err) die(err);
  await browser.close();
  // Re-connect so Playwright attaches to the newly created popup target.
  const again = await connect(state);
  let popup = null;
  for (let i = 0; i < 20 && !popup; i++) {
    popup = await findPopup(again.pages, state.extId);
    if (!popup) {
      await new Promise((r) => setTimeout(r, 250));
      again.pages = (await connect(state)).pages;
    }
  }
  if (!popup) die('popup did not open');
  await popup.getByRole('button', { name: /^Copy \(\d+\)$/ }).waitFor();
  console.log(`POPUP OPEN active="${activeTitle}"`);
  await again.browser.close();
}

async function popupState(popup) {
  return popup.evaluate(() => ({
    header: [...document.querySelectorAll('div')].find((d) => /^TabLinkList \(\d+\)$/.test(d.textContent ?? ''))?.textContent ?? null,
    filter: document.querySelector('input[type="text"]')?.value ?? null,
    selectAll: document.querySelector('label input[type="checkbox"]')?.checked ?? null,
    rows: [...document.querySelectorAll('[role="checkbox"]')].map((r) => ({
      title: r.textContent,
      checked: r.getAttribute('aria-checked') === 'true',
    })),
    format: [...document.querySelectorAll('button')].find((b) => b.className.includes('_active_'))?.textContent ?? null,
    copyButton: [...document.querySelectorAll('button')].at(-1)?.textContent ?? null,
    focused: document.activeElement?.outerHTML.slice(0, 80) ?? null,
  }));
}

async function runStep(popup, step, evidenceDir, run) {
  const [verb, ...rest] = step.split(':');
  const arg = rest.join(':');
  switch (verb) {
    case 'click': {
      // click:<role>:<accessible name>
      const [role, ...name] = arg.split(':');
      await popup.getByRole(role, { name: name.join(':'), exact: true }).click();
      break;
    }
    case 'row': // row:<tab title> — click the tab row
      await popup.getByRole('checkbox', { name: arg, exact: true }).click();
      break;
    case 'fill': // fill:<value> — type into the filter box
      await popup.getByPlaceholder('Filter by title or URL...').fill(arg);
      break;
    case 'press': // press:<key> — keyboard on the focused element
      await popup.keyboard.press(arg);
      break;
    case 'wait': // wait:<text> — wait until text is visible
      await popup.getByText(arg, { exact: true }).waitFor();
      break;
    case 'state': {
      const s = await popupState(popup);
      fs.writeFileSync(path.join(evidenceDir, `${arg}.state.json`), JSON.stringify(s, null, 2));
      console.log(`STATE ${arg} ${JSON.stringify(s)}`);
      break;
    }
    case 'shot':
      await popup.screenshot({ path: path.join(evidenceDir, `${arg}.png`) });
      fs.writeFileSync(path.join(evidenceDir, `${arg}.aria.txt`), await popup.locator('body').ariaSnapshot());
      console.log(`SHOT ${path.join(evidenceDir, arg)}.{png,aria.txt}`);
      break;
    case 'clipboard': {
      // Extension origins can't be granted clipboard-read, so read the shared
      // browser clipboard from a fixture page instead.
      const reader = run.pages.find((p) => p.url().startsWith(`http://127.0.0.1:${run.state.fixturePort}/`));
      await reader.context().grantPermissions(['clipboard-read'], { origin: new URL(reader.url()).origin });
      const text = await reader.evaluate(() => navigator.clipboard.readText());
      fs.writeFileSync(path.join(evidenceDir, `${arg}.clipboard.txt`), text);
      console.log(`CLIPBOARD ${arg} ${JSON.stringify(text)}`);
      break;
    }
    default:
      die(`unknown step "${step}"`);
  }
}

async function drive(runDir, steps) {
  const state = readState(runDir);
  const evidenceDir = path.join(runDir, 'evidence');
  const { browser, pages } = await connect(state);
  const popup = await findPopup(pages, state.extId);
  if (!popup) die('no popup open; run open-popup first');
  for (const step of steps) {
    console.log(`> ${step}`);
    await runStep(popup, step, evidenceDir, { state, pages });
  }
  await browser.close();
}

function stop(runDir) {
  const state = readState(runDir);
  if (pidAlive(state.pid)) process.kill(state.pid, 'SIGTERM');
  for (let i = 0; i < 40 && pidAlive(state.pid); i++) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
  if (pidAlive(state.pid)) process.kill(state.pid, 'SIGKILL');
  fs.rmSync(state.profile, { recursive: true, force: true });
  fs.rmSync(path.join(runDir, 'state.json'), { force: true });
  console.log(`STOPPED pid=${state.pid}; evidence kept in ${path.join(runDir, 'evidence')}`);
}

const [cmd, runDir, ...rest] = process.argv.slice(2);
if (!cmd || !runDir) {
  die('usage: tll.mjs <launch|doctor|open-popup|drive|stop> <runDir> [args]');
}
const dir = path.resolve(runDir);
switch (cmd) {
  case 'launch':
    await launch(dir);
    break;
  case 'doctor':
    await doctor(dir);
    break;
  case 'open-popup':
    await openPopup(dir, rest[0] ?? FIXTURES[0].title);
    break;
  case 'drive':
    await drive(dir, rest);
    break;
  case 'stop':
    stop(dir);
    break;
  default:
    die(`unknown command ${cmd}`);
}
