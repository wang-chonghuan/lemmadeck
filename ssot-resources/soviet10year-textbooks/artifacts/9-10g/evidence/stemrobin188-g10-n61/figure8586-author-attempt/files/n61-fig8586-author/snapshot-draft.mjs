import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(path.resolve('.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const [number, draft] = process.argv.slice(2)
if (!['85', '86'].includes(number) || !['initial', 'repair1'].includes(draft)) throw new Error('Only assigned drafts may be snapshotted')
const root = path.resolve('.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author')
const stem = `fig-g10-${number}.${draft}`
const svg = fs.readFileSync(path.join(root, `${stem}.svg`), 'utf8')
const spec = JSON.parse(fs.readFileSync(path.join(root, `${stem}.spec.json`), 'utf8'))
const output = path.join(root, `${stem}.widths480-300.png`)
if (fs.existsSync(output)) throw new Error('Snapshot already exists; do not repeat an actual draft')
const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() })
try {
  const page = await browser.newPage({ viewport: { width: 820, height: spec.canvas.height + 24 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort('blockedbyclient'))
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;background:white}
    body{display:flex;align-items:flex-start;gap:20px;padding:12px 0}
    .large{width:480px;flex:none}.small{width:300px;flex:none}
    svg{display:block;width:100%;height:auto}
  </style><div class="large">${svg}</div><div class="small">${svg}</div>`)
  const geometry = await page.evaluate(() => [...document.querySelectorAll('body>div')].map(host => ({
    width: host.getBoundingClientRect().width,
    svgHeight: host.querySelector('svg').getBoundingClientRect().height,
    labels: [...host.querySelectorAll('text')].map(text => ({
      id: text.getAttribute('data-label-id'), text: text.textContent,
      textPx: Number(text.getAttribute('font-size')) * Math.hypot(text.getScreenCTM().a, text.getScreenCTM().b),
      rect: { x: text.getBoundingClientRect().x, y: text.getBoundingClientRect().y, width: text.getBoundingClientRect().width, height: text.getBoundingClientRect().height },
    })),
  })))
  await page.screenshot({ path: output, animations: 'disabled' })
  fs.writeFileSync(path.join(root, `${stem}.snapshot-observations.json`), JSON.stringify({
    role: 'author technical snapshot observations; not independent review or product acceptance',
    headless: true, externalRequestsBlocked: true, desktopWindowOpened: false,
    source: `${stem}.svg`, image: path.basename(output), geometry,
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({ image: path.basename(output), geometry }))
} finally {
  await browser.close()
}
