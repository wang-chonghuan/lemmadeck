import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

assert.equal(process.env.PWDEBUG, undefined)
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
const number = process.argv[2], attempt = process.argv[3]
assert.ok(['55', '56'].includes(number))
const figure = `fig-${number}`, root = process.cwd()
const dir = `.tmp/s10y-image/batch007/9-10g/${figure}`
const output = `${dir}/probe/attempt-${attempt}`
assert.equal(fs.existsSync(output), false, 'Never replace first probe evidence')
fs.mkdirSync(output, { recursive: true })
const { chromium } = createRequire(path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const spec = JSON.parse(fs.readFileSync(`${dir}/spec.json`, 'utf8'))
const render = JSON.parse(fs.readFileSync(`${dir}/figure.render.json`, 'utf8'))
const before = Object.fromEntries(['spec.json', 'figure.svg', 'figure.png', 'figure.render.json'].map(file => [file, hash(`${dir}/${file}`)]))
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, before['spec.json'])
assert.equal(render.output.svg.sha256, before['figure.svg'])
const svg = fs.readFileSync(`${dir}/figure.svg`, 'utf8')
const themes = {
  neutral: { ink: '#15201f', muted: '#4c5a58', accent: '#15201f', 'accent-soft': '#8a9795', grid: '#e3eae9', paper: '#ffffff' },
  print: { ink: '#000000', muted: '#333333', accent: '#000000', 'accent-soft': '#777777', grid: '#666666', paper: '#ffffff' },
}
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH,
  chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath)
const records = [], errors = []
const evidence = {
  role: 'author-only', figure, attempt,
  scope: 'Existing batch007 n83/fig-10 offline fixed-640 scroll-media probe pattern, targeted geometry checks only. Not product acceptance, independent review or approval.',
  launch: { executablePath, headless: true, isolatedContexts: true, CDP: false, persistentProfile: false },
  environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' },
  command: { executable: process.execPath, argv: process.argv.slice(1), cwd: root },
  before, records, errors,
}
const persist = () => fs.writeFileSync(`${output}/metrics.json`, `${JSON.stringify(evidence, null, 2)}\n`)
const browser = await chromium.launch({ executablePath, headless: true })
try {
  for (const [theme, width, viewport] of [
    ['neutral', 640, { width: 1440, height: 960 }],
    ['print', 640, { width: 1440, height: 960 }],
    ['neutral', 346, { width: 390, height: 844 }],
    ['print', 346, { width: 390, height: 844 }],
    ['neutral', 240, { width: 390, height: 844 }],
    ['print', 240, { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
    try {
      const page = await context.newPage(), denied = [], pageErrors = []
      await page.route('**/*', route => { denied.push(route.request().url()); return route.abort() })
      page.on('pageerror', error => pageErrors.push(error.message))
      const variables = Object.entries(themes[theme]).map(([role, value]) => `--ld-figure-${role}:${value};`).join('')
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        html,body{margin:0;padding:0;width:100%;background:#fff;}
        #shell{margin:24px 22px;width:${width}px;}
        #scroll{width:${width}px;height:${spec.canvas.height}px;overflow-x:auto;overflow-y:hidden;}
        #media{${variables}width:640px;min-width:640px;height:${spec.canvas.height}px;}
        #media>svg{display:block;width:640px;min-width:640px;max-width:none;height:auto;}
        </style></head><body><main id="shell"><div id="scroll"><div id="media">${svg}</div></div></main></body></html>`)
      await page.evaluate(() => document.fonts.ready)
      for (const position of width === 640 ? ['full'] : ['start', 'middle', 'end']) {
        await page.evaluate(position => {
          const scroll = document.getElementById('scroll'), max = scroll.scrollWidth - scroll.clientWidth
          scroll.scrollLeft = position === 'end' ? max : position === 'middle' ? max / 2 : 0
        }, position)
        const metrics = await page.evaluate(({ spec, figure }) => {
          const scroll = document.getElementById('scroll'), svg = document.querySelector('#media>svg'), svgRect = svg.getBoundingClientRect()
          const nodeFor = id => document.getElementById(`ld-${figure}_ld-${id}`)
          const text = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
            const matrix = node.getScreenCTM(), rect = node.getBoundingClientRect()
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent,
              effectiveFontPx: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
              fill: getComputedStyle(node).fill,
              rect: { x: rect.x - svgRect.x, y: rect.y - svgRect.y, width: rect.width, height: rect.height },
              withinCanvas: rect.left >= svgRect.left && rect.top >= svgRect.top && rect.right <= svgRect.right && rect.bottom <= svgRect.bottom,
            }
          })
          const pointObjects = spec.objects.filter(item => item.type === 'point')
          const resolve = ref => Array.isArray(ref) ? ref : pointObjects.find(item => item.id === ref).at
          const screenPoint = ref => { const at = resolve(ref); return { x: at[0], y: spec.canvas.height - at[1] } }
          const near = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 0.01
          const points = pointObjects.map(item => {
            const node = nodeFor(item.id)
            return { id: item.id, exists: !!node, visible: !!node && getComputedStyle(node).display !== 'none' && getComputedStyle(node).visibility !== 'hidden' }
          })
          const segments = spec.objects.filter(item => item.type === 'segment').map(item => {
            const node = nodeFor(item.id)
            if (!node) return { id: item.id, exists: false }
            const start = node.getPointAtLength(0), end = node.getPointAtLength(node.getTotalLength())
            const dash = getComputedStyle(node).strokeDasharray
            return {
              id: item.id, exists: true, start: { x: start.x, y: start.y }, end: { x: end.x, y: end.y },
              endpointMatch: near(start, screenPoint(item.from)) && near(end, screenPoint(item.to)),
              expectedDashed: !!item.dash, actualDashed: dash !== 'none' && dash !== '0px',
              dash, stroke: getComputedStyle(node).stroke,
              noArrow: !node.hasAttribute('marker-end') && !node.hasAttribute('marker-start'),
            }
          })
          const hatches = spec.objects.filter(item => item.type === 'svgPath').map(item => {
            const node = [...svg.querySelectorAll('path')].find(node => node.getAttribute('d') === item.d)
            return { id: item.id, exists: !!node, unfilled: !!node && getComputedStyle(node).fill === 'none', pathCommands: (item.d.match(/M /g) || []).length }
          })
          return {
            viewport: { width: innerWidth, height: innerHeight }, containerWidth: scroll.clientWidth,
            mediaWidth: svgRect.width, mediaHeight: svgRect.height, scrollWidth: scroll.scrollWidth,
            scrollLeft: scroll.scrollLeft, maximumScroll: scroll.scrollWidth - scroll.clientWidth,
            pageScrollWidth: document.documentElement.scrollWidth,
            minimumEffectiveTextPx: Math.min(...text.map(item => item.effectiveFontPx)),
            labels: text.length, text, points, segments, hatches,
            arrowheads: svg.querySelectorAll('[data-arrowhead-for],[marker-end],[marker-start]').length,
          }
        }, { spec, figure })
        const record = { theme, width, position, ...metrics }; records.push(record); persist()
        assert.equal(metrics.mediaWidth, 640); assert.equal(metrics.mediaHeight, spec.canvas.height)
        assert.equal(metrics.containerWidth, width); assert.equal(metrics.pageScrollWidth, viewport.width)
        assert.ok(metrics.minimumEffectiveTextPx >= 16)
        assert.equal(metrics.labels, number === '55' ? 44 : 14)
        assert.deepEqual(metrics.text.map(item => item.id).sort(), spec.objects.filter(item => item.label || item.type === 'text').map(item => `${item.id}-label`).sort())
        assert.ok(metrics.text.every(item => item.withinCanvas))
        assert.ok(metrics.points.every(item => item.exists && item.visible))
        assert.ok(metrics.segments.every(item => item.exists && item.endpointMatch && item.expectedDashed === item.actualDashed && item.noArrow))
        assert.ok(metrics.hatches.every(item => item.exists && item.unfilled && item.pathCommands > 0))
        assert.equal(metrics.arrowheads, 0)
        assert.ok(Math.abs(metrics.scrollLeft - (position === 'end' ? metrics.maximumScroll : position === 'middle' ? metrics.maximumScroll / 2 : 0)) <= 1)
        if (width === 640 || (theme === 'neutral' && width === 346 && position === 'end')) {
          const name = width === 640 ? `desktop-${theme}-640-full.png` : 'mobile-neutral-346-end.png'
          await page.locator('#scroll').screenshot({ path: `${output}/${name}` })
          record.screenshot = { path: path.resolve(`${output}/${name}`), sha256: hash(`${output}/${name}`) }
          persist()
        }
      }
      assert.deepEqual(denied, []); assert.deepEqual(pageErrors, [])
    } finally { await context.close() }
  }
  evidence.after = Object.fromEntries(Object.keys(before).map(file => [file, hash(`${dir}/${file}`)]))
  assert.deepEqual(evidence.after, before)
  evidence.canonicalBytesUnchanged = true
  evidence.geometryChecksSatisfied = true
  evidence.networkRequests = 0
  console.log(`${figure}: ${records.length} measured states, 3 screenshot files; media640; minimum text${Math.min(...records.map(item => item.minimumEffectiveTextPx))}px; actual mobile end reachable; bytes unchanged`)
} catch (error) {
  errors.push({ name: error.name, message: error.message, stack: error.stack })
  throw error
} finally {
  persist()
  await browser.close()
}
