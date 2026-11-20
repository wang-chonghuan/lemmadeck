import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const B = '.tmp/STEMROBIN-181/d1816-d118/fig-26';
const svgFile = `${B}/fig-26.svg`;
const output = `${B}/fig-26.preview.png`;
assert(!fs.existsSync(output));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before = hash(svgFile);
const native = JSON.parse(fs.readFileSync(`${B}/fig-26.render.json`));
assert.equal(native.status, 'pass');
assert.equal(native.output.svg.sha256, before);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 970 } });
  await page.route('**/*', route => route.abort());
  await page.setContent(`<!doctype html><style>
    :root {
      --ld-figure-ink: #15201f; --ld-figure-muted: #4c5a58;
      --ld-figure-accent: #15201f; --ld-figure-accent-soft: #8a9795;
      --ld-figure-grid: #e3eae9; --ld-figure-paper: #ffffff;
    }
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
    body { background: #ffffff; } svg { display: block; }
  </style>${fs.readFileSync(svgFile, 'utf8')}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: output, type: 'png', animations: 'disabled' });
} finally {
  await browser.close();
}
assert.equal(hash(svgFile), before);
console.log(JSON.stringify({
  preview: { path: output, sha256: hash(output) }, sourceSvgSha256: before,
  existingSvgRasterOnly: true, nativeGeometryRerendered: false, imageOpens: 0,
  missingPreviewCause: 'Successful native call requested SVG/report without --png; first freeze stopped on absent PNG.',
}));
