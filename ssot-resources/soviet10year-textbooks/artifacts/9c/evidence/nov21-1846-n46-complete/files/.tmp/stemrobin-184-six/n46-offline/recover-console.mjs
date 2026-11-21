import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n46-offline');
const requireApp = createRequire(path.join(ROOT, 'app/package.json'));
const { chromium } = requireApp('playwright');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const firstPath = path.join(OUT, 'evidence.json');
const first = JSON.parse(fs.readFileSync(firstPath));
assert.equal(first.assertionVerdict, 'FAIL');
assert.equal(first.failures.length, 6);
assert(first.failures.every(failure => failure.name.endsWith(': no console/page errors')));
assert(first.failures.every(failure => failure.actual.length === 1 && failure.actual[0].message.includes("'file:' URLs are treated as unique security origins.")));
const evidence = {
  schema: 'stemrobin184/n46-offline-console-recovery@1',
  scope: 'Affected-only technical recovery of six failed console/page-error assertions. No screenshots, image views, geometry, content, control or visual stage replay.',
  started: new Date().toISOString(),
  firstFailureEvidence: bind(firstPath),
  checker: bind(path.join(OUT, 'recover-console.mjs')),
  inputs: Object.fromEntries(first.views.map(view => [view.id, bind(view.file)])),
  preservedFirstFailures: first.failures,
  diagnosis: {},
  recovery: [],
  accounting: { screenshotCreationCount: 0, actualImageToolViews: 0, targetNavigations: 0, targetReloads: 0, browserLaunches: 0, browserContextsCreated: 0, browserContextsClosed: 0, browserClosed: 0, serversStarted: 0, serversClosed: 0, parentImagesOrDecodes: 0, hiddenRendererBrowserInternalImageLoads: 'UNKNOWN', hiddenRendererBrowserInternalImageDecodes: 'UNKNOWN', paidCalls: 0 },
  network: { remoteDependencies: 0, allowedRequests: [], blockedRequests: [], observedRequests: [], remoteResponses: [], offline: true, routePolicy: 'file/data/about only; abort all other schemes' },
  failures: [],
  cleanupErrors: [],
};
const browsers = new Set(), contexts = new Set();
async function open(fileAccess) {
  const runtime = path.join(OUT, 'console-recovery-runtime');
  fs.mkdirSync(runtime, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    downloadsPath: runtime,
    env: { ...process.env, TMPDIR: runtime },
    args: ['--disable-background-networking', '--disable-component-update', '--disable-domain-reliability', '--disable-sync', '--no-pings', ...(fileAccess ? ['--allow-file-access-from-files'] : [])],
  });
  browsers.add(browser);
  evidence.accounting.browserLaunches++;
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, offline: true, serviceWorkers: 'block' });
  contexts.add(context);
  evidence.accounting.browserContextsCreated++;
  await context.route('**/*', async route => {
    const request = route.request();
    const record = { fileAccess, url: request.url(), resourceType: request.resourceType() };
    if (/^(file|data|about):/u.test(record.url)) {
      evidence.network.allowedRequests.push(record);
      await route.continue();
    } else {
      evidence.network.blockedRequests.push(record);
      await route.abort('internetdisconnected');
    }
  });
  context.on('request', request => evidence.network.observedRequests.push({ fileAccess, url: request.url(), resourceType: request.resourceType() }));
  context.on('response', response => {
    if (!/^(file|data|about):/u.test(response.url())) evidence.network.remoteResponses.push({ fileAccess, url: response.url(), status: response.status() });
  });
  return { browser, context, page: await context.newPage() };
}
async function close(resource) {
  await resource.context.close();
  contexts.delete(resource.context);
  evidence.accounting.browserContextsClosed++;
  await resource.browser.close();
  browsers.delete(resource.browser);
  evidence.accounting.browserClosed++;
}
async function consoleOnly(resource, view) {
  const errors = [];
  let phase = 'navigation';
  const consoleListener = message => {
    if (message.type() === 'error') errors.push({ phase, kind: 'console', message: message.text() });
  };
  const errorListener = error => errors.push({ phase, kind: 'pageerror', message: error.message });
  resource.page.on('console', consoleListener);
  resource.page.on('pageerror', errorListener);
  let cdp;
  try {
    await resource.page.setViewportSize(view.viewport);
    evidence.accounting.targetNavigations++;
    await resource.page.goto(pathToFileURL(view.file).href, { waitUntil: 'load' });
    await resource.page.evaluate(async () => { await document.fonts.ready; });
    const beforeCDP = [...errors];
    cdp = await resource.context.newCDPSession(resource.page);
    phase = 'DOM.enable';
    await cdp.send('DOM.enable');
    phase = 'CSS.enable';
    await cdp.send('CSS.enable');
    phase = 'DOM.getDocument';
    await cdp.send('DOM.getDocument');
    await resource.page.evaluate(() => document.readyState);
    return { view: view.id, viewport: view.viewport, file: view.file, beforeCDP, allErrors: errors };
  } finally {
    if (cdp) await cdp.detach();
    resource.page.off('console', consoleListener);
    resource.page.off('pageerror', errorListener);
  }
}
try {
  const diagnosis = await open(false);
  evidence.diagnosis = await consoleOnly(diagnosis, first.views[0]);
  evidence.diagnosis.instrumentationOriginConfirmed = evidence.diagnosis.beforeCDP.length === 0
    && evidence.diagnosis.allErrors.length > 0
    && evidence.diagnosis.allErrors.every(error => error.phase === 'CSS.enable' && error.message.includes("'file:' URLs are treated as unique security origins."));
  await close(diagnosis);
  if (!evidence.diagnosis.instrumentationOriginConfirmed) evidence.failures.push({ name: 'diagnosis: console error origin not confirmed', actual: evidence.diagnosis });
  const recovered = await open(true);
  evidence.technicalChange = 'Only isolated Chromium --allow-file-access-from-files; local documents unchanged; remote network remains blocked; no app or retained-content edits.';
  for (const view of first.views) {
    const result = await consoleOnly(recovered, view);
    result.assertion = view.id + ': no console/page errors';
    result.verdict = result.allErrors.length === 0 ? 'PASS' : 'FAIL';
    evidence.recovery.push(result);
    if (result.verdict === 'FAIL') evidence.failures.push({ name: result.assertion, actual: result.allErrors });
    console.log(JSON.stringify(result));
  }
  await close(recovered);
  if (evidence.network.blockedRequests.length || evidence.network.remoteResponses.length || evidence.network.observedRequests.some(request => !/^(file|data|about):/u.test(request.url))) evidence.failures.push({ name: 'network: attempted remote request', actual: evidence.network });
  for (const [id, original] of Object.entries(evidence.inputs)) {
    if (bind(original.path).sha256 !== original.sha256) evidence.failures.push({ name: `${id}: input changed` });
  }
} catch (error) {
  evidence.failures.push({ name: 'console recovery execution', actual: { message: error.message, stack: error.stack } });
} finally {
  for (const context of contexts) {
    try { await context.close(); evidence.accounting.browserContextsClosed++; }
    catch (error) { evidence.cleanupErrors.push(error.message); }
  }
  for (const browser of browsers) {
    try { await browser.close(); evidence.accounting.browserClosed++; }
    catch (error) { evidence.cleanupErrors.push(error.message); }
  }
  if (evidence.cleanupErrors.length || evidence.accounting.browserClosed !== evidence.accounting.browserLaunches || evidence.accounting.browserContextsClosed !== evidence.accounting.browserContextsCreated) evidence.failures.push({ name: 'recovery cleanup', actual: evidence.cleanupErrors });
  evidence.network.allowedRequestCount = evidence.network.allowedRequests.length;
  evidence.network.blockedRequestCount = evidence.network.blockedRequests.length;
  evidence.network.observedRequestCount = evidence.network.observedRequests.length;
  evidence.network.remoteDependencies = evidence.network.remoteResponses.length;
  evidence.ended = new Date().toISOString();
  evidence.assertionVerdict = evidence.failures.length ? 'FAIL' : 'PASS';
  fs.writeFileSync(path.join(OUT, 'console-recovery-evidence.json'), JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ assertionVerdict: evidence.assertionVerdict, diagnosis: evidence.diagnosis, failures: evidence.failures.length, accounting: evidence.accounting, evidence: path.join(OUT, 'console-recovery-evidence.json') }));
  process.exitCode = evidence.failures.length ? 1 : 0;
}
