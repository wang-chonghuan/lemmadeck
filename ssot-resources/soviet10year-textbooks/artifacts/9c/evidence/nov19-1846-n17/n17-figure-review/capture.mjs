import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck'
const scope = path.join(root, '.tmp/stemrobin-184-six/n17-figure-review')
const author = path.join(root, '.tmp/stemrobin-184-six/n17-text-and-figure-author')
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright-core')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1008, height: 600 }, deviceScaleFactor: 1 })
  await context.route('**/*', (route) => route.abort())
  const page = await context.newPage()
  for (const id of ['fig-07', 'fig-08']) {
    const specPath = path.join(author, `${id}.spec.json`)
    const svgPath = path.join(author, `${id}.svg`)
    const render = JSON.parse(fs.readFileSync(path.join(author, `${id}.render.json`), 'utf8'))
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, hash(specPath))
    assert.equal(render.output.svg.sha256, hash(svgPath))
    const svg = fs.readFileSync(svgPath, 'utf8')
    const view = (width) => {
      const document = `<!doctype html><html><head><meta charset="utf-8"><style>
        html,body{margin:0;padding:0;background:#fff}
        .sr-figure-media{width:${width}px;max-width:100%;font-size:16px;
          --ld-figure-ink:#171717;--ld-figure-paper:#fff}
        svg{display:block;width:100%;max-width:100%;height:auto}
      </style></head><body><div class="sr-figure-media">${svg}</div></body></html>`
      return `<section><h2>${width}px</h2><iframe title="${id} ${width}px" width="${width}"
        height="${Math.ceil(width / 3)}" srcdoc="${escape(document)}"></iframe></section>`
    }
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${id} independent figure review</title>
      <style>body{margin:0;padding:24px;background:#fff;color:#171717;font-family:Arial,sans-serif}
      h1{font-size:18px;margin:0 0 12px}h2{font-size:14px;margin:0 0 8px;font-weight:400}
      iframe{display:block;border:0}section{margin:0 0 20px}
      .ordinary{display:flex;gap:40px;align-items:flex-start}</style></head>
      <body><h1>${id}</h1>${view(960)}<div class="ordinary">${view(252)}${view(340)}</div></body></html>`
    const htmlPath = path.join(scope, `${id}.widths.html`)
    const screenshotPath = path.join(scope, `${id}.widths.png`)
    assert.equal(fs.existsSync(htmlPath), false)
    assert.equal(fs.existsSync(screenshotPath), false)
    fs.writeFileSync(htmlPath, html, { flag: 'wx' })
    await page.setContent(html, { waitUntil: 'load' })
    for (const frame of page.frames().slice(1)) {
      await frame.evaluate(() => document.fonts.ready)
    }
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' })
    console.log(`${htmlPath} ${hash(htmlPath)}`)
    console.log(`${screenshotPath} ${hash(screenshotPath)}`)
  }
  await context.close()
} finally {
  await browser.close()
}
