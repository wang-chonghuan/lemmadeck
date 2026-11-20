import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong authorized checkout');
const [number] = process.argv.slice(2);
if (!['86', '87'].includes(number)) throw new Error('Only affected figures allowed');
const require = createRequire(path.join(repo, '.agents/skills/package.json'));
const { chromium } = require('playwright-core');
const stem = `fig-g10-${number}.repair2`;
const spec = JSON.parse(fs.readFileSync(path.join(root, `${stem}.spec.json`), 'utf8'));
const svg = fs.readFileSync(path.join(root, `${stem}.svg`), 'utf8');
const image = path.join(root, `${stem}.widths-480-300.png`);
if (fs.existsSync(image)) throw new Error('Already snapshotted; never repeat this candidate');
const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
try {
  const page = await browser.newPage({ viewport: { width: 804, height: spec.canvas.height }, deviceScaleFactor: 1 });
  await page.route('**/*', route => route.abort('blockedbyclient'));
  await page.setContent(`<meta charset="utf-8"><style>html,body{margin:0;background:white;overflow:hidden}body{display:flex;gap:24px;align-items:flex-start}section{flex:none}svg{display:block;width:100%;height:auto}</style><section data-width="480" style="width:480px">${svg}</section><section data-width="300" style="width:300px">${svg}</section>`);
  const geometry = await page.evaluate(() => [...document.querySelectorAll('section')].map(host => {
    const rect = host.getBoundingClientRect();
    const vector = host.querySelector('svg');
    return {
      width: rect.width,
      svgHeight: vector.getBoundingClientRect().height,
      labels: [...vector.querySelectorAll('text')].map(text => {
        const box = text.getBoundingClientRect();
        return {
          id: text.getAttribute('data-label-id'), text: text.textContent,
          textPx: Number(text.getAttribute('font-size')) * Math.hypot(text.getScreenCTM().a, text.getScreenCTM().b),
          rect: { x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height },
        };
      }),
    };
  }));
  await page.screenshot({ path: image, animations: 'disabled' });
  fs.writeFileSync(path.join(root, `${stem}.snapshot.json`), JSON.stringify({
    role: 'author isolated technical snapshot, not independent review or headed product acceptance',
    headless: true, externalRequestsBlocked: true, desktopWindowOpened: false,
    source: path.relative(repo, path.join(root, `${stem}.svg`)),
    image: path.relative(repo, image), imageUnitsWhenInspected: 2, geometry,
  }, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ image: path.relative(repo, image), geometry }));
} finally {
  await browser.close();
}
