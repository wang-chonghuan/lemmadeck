import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const root = path.dirname(fileURLToPath(import.meta.url))
if (process.cwd() !== W) throw new Error('Wrong cwd')
const { chromium } = await import(path.join(W, '.agents/skills/node_modules/playwright-core/index.mjs'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const out = path.join(root, 'draft-check')
if (fs.existsSync(out)) throw new Error('Refusing to overwrite draft-check evidence')
fs.mkdirSync(out, { recursive: true })
const report = { status: 'running', scope: 'Standalone actual SVG draft, not running product or independent content approval', checks: [], requests: [], errors: [] }
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(fs.existsSync)
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const bindings = JSON.parse(fs.readFileSync(path.join(root, 'input-bindings.json'), 'utf8'))
  for (const b of [bindings.lesson, ...bindings.sources, bindings.context, bindings.pixelInventory, bindings.authorScript]) {
    assert.equal(hash(b.path), b.sha256, `Input hash drift ${b.path}`)
  }
  for (const id of ['fig-192', 'fig-193']) {
    const dir = path.join(root, id)
    const specPath = path.join(dir, 'spec.json')
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
    const render = JSON.parse(fs.readFileSync(path.join(dir, 'render.json'), 'utf8'))
    assert.equal(render.status, 'pass', 'Renderer must succeed before dependent draft check')
    assert.equal(hash(specPath), render.spec.sha256)
    const svgPath = path.join(dir, `${id}.svg`)
    assert.equal(hash(svgPath), render.output.svg.sha256)
    assert.equal(hash(spec.source.image.path), spec.source.image.sha256)
    const svg = fs.readFileSync(svgPath, 'utf8')
    const pointIDs = new Set(spec.objects.filter(o => o.type === 'point').map(o => o.id))
    const mappings = []
    for (const g of spec.source.inventory) {
      const groupPoints = g.objects.filter(o => pointIDs.has(o))
      const coverage = new Set()
      for (const a of spec.assertions.filter(a => g.assertions.includes(a.id))) {
        const refs = Object.values(a).filter(v => typeof v === 'string' && pointIDs.has(v))
        if (new Set(refs).size >= 2 && refs.every(v => groupPoints.includes(v))) refs.forEach(v => coverage.add(v))
      }
      assert.ok(groupPoints.every(p => coverage.has(p)), `Uncovered inside-group point: ${g.id}`)
      mappings.push({ group: g.id, points: groupPoints, covered: [...coverage] })
    }
    for (const width of spec.display.widths) {
      const page = await browser.newPage({ viewport: { width: width + 32, height: 1000 }, deviceScaleFactor: 1 })
      page.on('pageerror', e => report.errors.push(e.message))
      await page.route(/^https?:/, route => {
        report.requests.push(route.request().url())
        return route.abort()
      })
      const html = `<!doctype html><meta charset="utf-8"><style>
        :root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;--ld-figure-accent:#15201f;--ld-figure-accent-soft:#8a9795;--ld-figure-grid:#e3eae9;--ld-figure-paper:#fff}
        *{box-sizing:border-box}body{margin:0;padding:16px;background:#fff}
        main{width:100%;max-width:${spec.display.maxWidthPx}px;margin:auto}
        svg{display:block;width:100%;height:auto}
      </style><main>${svg}</main>`
      await page.setContent(html)
      const actual = await page.evaluate(() => {
        const svg = document.querySelector('main > svg')
        const r = svg.getBoundingClientRect()
        const texts = [...svg.querySelectorAll('text')].map(n => {
          const m = n.getScreenCTM(), r = n.getBoundingClientRect()
          return { id: n.dataset.labelId, text: n.textContent, px: Number(n.getAttribute('font-size')) * Math.hypot(m.a, m.b), rect: { x: r.x, y: r.y, width: r.width, height: r.height } }
        })
        const overlaps = []
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i].rect, b = texts[j].rect
          if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) overlaps.push([texts[i].id, texts[j].id])
        }
        return { mediaWidth: r.width, mediaHeight: r.height, texts, overlaps, overflow: document.documentElement.scrollWidth > innerWidth,
          clippedText: texts.filter(t => t.rect.x < r.x || t.rect.x + t.rect.width > r.right + 0.1 || t.rect.y < r.y || t.rect.y + t.rect.height > r.bottom + 0.1).map(t => t.id),
          geometryNodes: svg.querySelectorAll('path,line,circle,ellipse,polygon,polyline').length,
          semanticColors: svg.outerHTML.includes('--ld-figure-ink') }
      })
      const check = { figure: id, width, svg: { path: svgPath, sha256: hash(svgPath) }, spec: { path: specPath, sha256: hash(specPath) }, actual, mappings }
      report.checks.push(check)
      assert.equal(actual.mediaWidth, width)
      assert.equal(actual.texts.length, render.labels)
      assert.ok(actual.texts.every(t => t.px >= 16 - 0.01))
      assert.deepEqual(actual.overlaps, [])
      assert.deepEqual(actual.clippedText, [])
      assert.equal(actual.overflow, false)
      assert.ok(actual.geometryNodes > 0 && actual.semanticColors)
      if (width === 358 || width === 716) {
        const p = path.join(out, `${id}-${width}.png`)
        await page.screenshot({ path: p, fullPage: true, animations: 'disabled' })
        check.screenshot = { path: p, sha256: hash(p) }
        const htmlPath = path.join(out, `${id}-${width}.html`)
        fs.writeFileSync(htmlPath, html)
      }
      await page.close()
    }
  }
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.requests, [])
  report.status = 'pass'
} catch (e) {
  report.status = 'fail'
  report.errors.push(e.message)
  process.exitCode = 1
} finally {
  await browser.close()
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify({ status: report.status, checks: report.checks.map(c => ({ figure: c.figure, width: c.width, minTextPx: Math.min(...c.actual.texts.map(t => t.px)), labels: c.actual.texts.length })), errors: report.errors }, null, 2))
}
