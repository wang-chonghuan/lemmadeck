import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

if (process.env.PWDEBUG || process.env.PLAYWRIGHT_HTML_OPEN !== 'never') {
  throw new Error('Run with env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never')
}
const root = process.cwd()
const base = path.join(root, '.tmp/s10y-image/batch007/10c')
const ids = ['tbl-p0036-01', 'tbl-p0038-01']
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const themes = {
  neutral: {
    ink: '#15201f', muted: '#4c5a58', accent: '#15201f',
    'accent-soft': '#8a9795', grid: '#e3eae9', paper: '#ffffff',
  },
  print: {
    ink: '#000000', muted: '#333333', accent: '#000000',
    'accent-soft': '#777777', grid: '#666666', paper: '#ffffff',
  },
}
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
if (!executablePath) throw new Error('No existing browser executable')
const browser = await chromium.launch({ executablePath, headless: true })
try {
  for (const id of ids) {
    const dir = path.join(base, id)
    const probeDir = path.join(dir, 'previews')
    if (fs.existsSync(probeDir)) throw new Error(`${id}: previews already exist; stop`)
    const spec = JSON.parse(fs.readFileSync(path.join(dir, 'spec.json'), 'utf8'))
    const svgFile = path.join(dir, 'table.svg')
    const reportFile = path.join(dir, 'table.render.json')
    const render = JSON.parse(fs.readFileSync(reportFile, 'utf8'))
    const before = Object.fromEntries(['spec.json', 'table.svg', 'table.png', 'table.render.json']
      .map(name => [name, hash(path.join(dir, name))]))
    if (render.status !== 'pass' || render.spec.sha256 !== before['spec.json'] ||
        render.output.svg.sha256 !== before['table.svg']) {
      throw new Error(`${id}: current passing render binding changed`)
    }
    const svg = fs.readFileSync(svgFile, 'utf8')
    fs.mkdirSync(probeDir)
    const records = []
    for (const [theme, viewportWidth] of [
      ['neutral', 640], ['print', 640], ['neutral', 240], ['print', 346],
    ]) {
      const context = await browser.newContext({
        viewport: { width: viewportWidth, height: spec.canvas.height },
        deviceScaleFactor: 1,
      })
      try {
        const page = await context.newPage()
        const deniedRequests = []
        await page.route('**/*', route => {
          deniedRequests.push(route.request().url())
          return route.abort()
        })
        const variables = Object.entries(themes[theme])
          .map(([role, value]) => `--ld-figure-${role}:${value};`).join('')
        await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
          <style>
            html,body{margin:0;padding:0;width:${viewportWidth}px;background:#fff;}
            #scroll{width:${viewportWidth}px;height:${spec.canvas.height}px;overflow-x:auto;overflow-y:hidden;}
            #media{${variables}width:640px;min-width:640px;height:${spec.canvas.height}px;}
            #media>svg{display:block;width:640px;min-width:640px;max-width:none;height:auto;}
          </style></head><body><div id="scroll"><div id="media">${svg}</div></div></body></html>`)
        await page.evaluate(() => document.fonts.ready)
        const positions = viewportWidth === 640 ? ['full'] : ['start', 'middle', 'end']
        for (const position of positions) {
          await page.evaluate(position => {
            const scroll = document.getElementById('scroll')
            const maximum = scroll.scrollWidth - scroll.clientWidth
            scroll.scrollLeft = position === 'end' ? maximum :
              position === 'middle' ? maximum / 2 : 0
          }, position)
          const metrics = await page.evaluate(() => {
            const scroll = document.getElementById('scroll')
            const svg = document.querySelector('#media > svg')
            const rect = svg.getBoundingClientRect()
            const text = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
              const matrix = node.getScreenCTM()
              const scale = Math.hypot(matrix.a, matrix.b)
              return {
                id: node.getAttribute('data-label-id'),
                text: node.textContent,
                effectiveFontPx: Number.parseFloat(getComputedStyle(node).fontSize) * scale,
                fill: getComputedStyle(node).fill,
              }
            })
            return {
              viewportWidth: window.innerWidth,
              containerWidth: scroll.clientWidth,
              mediaWidth: rect.width,
              mediaHeight: rect.height,
              scrollWidth: scroll.scrollWidth,
              scrollLeft: scroll.scrollLeft,
              maximumScroll: scroll.scrollWidth - scroll.clientWidth,
              pageScrollWidth: document.documentElement.scrollWidth,
              minimumEffectiveTextPx: Math.min(...text.map(item => item.effectiveFontPx)),
              labels: text.length,
              text,
            }
          })
          const name = `${theme}-${viewportWidth}-${position}.png`
          await page.screenshot({ path: path.join(probeDir, name), fullPage: false })
          records.push({ theme, position, screenshot: name, sha256: hash(path.join(probeDir, name)), ...metrics })
        }
        if (deniedRequests.length) throw new Error('Unexpected resource request: ' + deniedRequests.join(', '))
      } finally {
        await context.close()
      }
    }
    const after = Object.fromEntries(Object.keys(before).map(name => [name, hash(path.join(dir, name))]))
    if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Canonical output changed during probes')
    const metricsMatch = records.every(record =>
      record.mediaWidth === 640 && record.minimumEffectiveTextPx >= 16 &&
      record.labels === render.labels && record.containerWidth === record.viewportWidth &&
      record.pageScrollWidth === record.viewportWidth,
    )
    const evidence = {
      schema: 'n83/author-display-probes@1',
      figure: id,
      scope: 'Existing SVG in an isolated local fixed-640 scroll-media harness; not a product finalization or independent figure review.',
      command: { executable: process.execPath, argv: process.argv.slice(1), cwd: root },
      launch: { executablePath, headless: true, isolatedContexts: true, networkRequests: 0 },
      environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' },
      before,
      after,
      canonicalBytesUnchanged: true,
      metricsMatch,
      records,
    }
    fs.writeFileSync(path.join(probeDir, 'metrics.json'), `${JSON.stringify(evidence, null, 2)}\n`)
    console.log(`${id}: ${records.length} snapshots; fixed media640; min text${Math.min(...records.map(record => record.minimumEffectiveTextPx))}px; metricsMatch=${metricsMatch}`)
    if (!metricsMatch) process.exitCode = 2
  }
} finally {
  await browser.close()
}
