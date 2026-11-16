import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

assert.equal(process.env.PWDEBUG, undefined)
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
const root = process.cwd()
const base = '.tmp/s10y-image/batch007/10c'
const { chromium } = createRequire(path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const themes = {
  neutral: { ink: '#15201f', muted: '#4c5a58', accent: '#15201f', 'accent-soft': '#8a9795', grid: '#e3eae9', paper: '#ffffff' },
  print: { ink: '#000000', muted: '#333333', accent: '#000000', 'accent-soft': '#777777', grid: '#666666', paper: '#ffffff' },
}
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath, 'Existing Chromium required')
const browser = await chromium.launch({ executablePath, headless: true })
try {
  for (const number of [10, 11]) {
    const figure = `fig-${number}`
    const prefix = `f${number}`
    const dir = `${base}/${figure}`
    const output = `${dir}/probes`
    assert.equal(fs.existsSync(output), false, 'Probe already exists; preserve it')
    fs.mkdirSync(output)
    const spec = JSON.parse(fs.readFileSync(`${dir}/spec.json`, 'utf8'))
    const render = JSON.parse(fs.readFileSync(`${dir}/figure.render.json`, 'utf8'))
    const inputs = JSON.parse(fs.readFileSync(`${dir}/author-inputs.json`, 'utf8'))
    const before = Object.fromEntries(['spec.json', 'figure.svg', 'figure.png', 'figure.render.json']
      .map(file => [file, hash(`${dir}/${file}`)]))
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, before['spec.json'])
    assert.equal(render.output.svg.sha256, before['figure.svg'])
    const svg = fs.readFileSync(`${dir}/figure.svg`, 'utf8')
    const records = []
    const errors = []
    const evidence = {
      schema: 'n80/figure-author-display-probe@1', role: 'author-only', figure,
      scope: 'Offline fixed-640 scroll-media harness using the existing n83 probe pattern. Not headed product acceptance, independent review, approval or promotion.',
      launch: { executablePath, headless: true, isolatedContexts: true },
      environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' },
      command: { executable: process.execPath, argv: process.argv.slice(1), cwd: root },
      before, records, errors,
    }
    const persist = () => fs.writeFileSync(`${output}/metrics.json`, `${JSON.stringify(evidence, null, 2)}\n`)
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
          const page = await context.newPage()
          const deniedRequests = []
          const browserErrors = []
          await page.route('**/*', route => {
            deniedRequests.push(route.request().url())
            return route.abort()
          })
          page.on('pageerror', error => browserErrors.push(error.message))
          const variables = Object.entries(themes[theme])
            .map(([role, value]) => `--ld-figure-${role}:${value};`).join('')
          await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
            <style>
              html,body{margin:0;padding:0;width:100%;background:#fff;}
              #shell{margin:24px 22px;width:${width}px;}
              #scroll{width:${width}px;height:360px;overflow-x:auto;overflow-y:hidden;}
              #media{${variables}width:640px;min-width:640px;height:360px;}
              #media>svg{display:block;width:640px;min-width:640px;max-width:none;height:auto;}
            </style></head><body><main id="shell"><div id="scroll"><div id="media">${svg}</div></div></main></body></html>`)
          await page.evaluate(() => document.fonts.ready)
          for (const position of width === 640 ? ['full'] : ['start', 'middle', 'end']) {
            await page.evaluate(position => {
              const node = document.getElementById('scroll')
              const maximum = node.scrollWidth - node.clientWidth
              node.scrollLeft = position === 'end' ? maximum : position === 'middle' ? maximum / 2 : 0
            }, position)
            const metrics = await page.evaluate(({ spec, prefix, figure, joinChecks }) => {
              const scroll = document.getElementById('scroll')
              const svg = document.querySelector('#media > svg')
              const svgRect = svg.getBoundingClientRect()
              const localNode = suffix => document.getElementById(`ld-${figure}_ld-${prefix}-${suffix}`)
              const center = spec.objects.find(item => item.id === `${prefix}-ball`).center
              const toScreen = point => ({ x: point[0], y: 360 - point[1] })
              const endpoint = (node, end) => {
                const point = node.getPointAtLength(end ? node.getTotalLength() : 0)
                return { x: point.x, y: point.y }
              }
              const near = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 0.01
              const text = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
                const matrix = node.getScreenCTM()
                const scale = Math.hypot(matrix.a, matrix.b)
                const rect = node.getBoundingClientRect()
                return {
                  id: node.getAttribute('data-label-id'), text: node.textContent,
                  effectiveFontPx: Number.parseFloat(getComputedStyle(node).fontSize) * scale,
                  fill: getComputedStyle(node).fill,
                  rect: { x: rect.x - svgRect.x, y: rect.y - svgRect.y, width: rect.width, height: rect.height },
                  withinCanvas: rect.left >= svgRect.left && rect.top >= svgRect.top &&
                    rect.right <= svgRect.right && rect.bottom <= svgRect.bottom,
                }
              })
              const joins = joinChecks.map(check => {
                const definition = spec.objects.find(item => item.id === check.path)
                const coil = [...svg.querySelectorAll('path')].find(node => node.getAttribute('d') === definition.d)
                if (!coil) return { path: check.path, continuous: false, error: 'Missing coil' }
                const start = endpoint(coil, false)
                const end = endpoint(coil, true)
                const leadIds = [check.wallLead, check.ballLead]
                const leadEndpoints = leadIds.map(id => {
                  const node = document.getElementById(`ld-${figure}_ld-${id}`)
                  return { id, start: endpoint(node, false), end: endpoint(node, true) }
                })
                return {
                  path: check.path, start, end, leadEndpoints,
                  continuous: near(start, { x: check.startScreen[0], y: check.startScreen[1] }) &&
                    near(end, { x: check.endScreen[0], y: check.endScreen[1] }) &&
                    [start, end].every(point => leadEndpoints.some(lead => near(point, lead.start) || near(point, lead.end))),
                  unfilled: getComputedStyle(coil).fill === 'none',
                }
              })
              const markerSuffixes = figure === 'fig-10' ? ['equilibrium-marker'] : ['equilibrium-marker', 'displacement-marker']
              const markers = markerSuffixes.map(suffix => {
                const node = localNode(suffix)
                const start = endpoint(node, false)
                const end = endpoint(node, true)
                return {
                  id: `${prefix}-${suffix}`, start, end,
                  vertical: Math.abs(start.x - end.x) < 0.01,
                  unarrowed: !node.hasAttribute('marker-end') && !node.hasAttribute('marker-start') &&
                    ![...svg.querySelectorAll('[data-arrowhead-for]')].some(head => head.getAttribute('data-arrowhead-for') === node.id),
                }
              })
              const contacts = ['left', 'right'].flatMap(side => {
                const wallLead = localNode(`${side}-wall-lead`)
                const ballLead = localNode(`${side}-ball-lead`)
                const wall = endpoint(wallLead, side === 'right')
                const ball = endpoint(ballLead, side === 'left')
                return [
                  { side, kind: 'wall', endpoint: wall, attached: near(wall, toScreen([side === 'left' ? 44 : 596, 278])) },
                  { side, kind: 'ball', endpoint: ball, attached: near(ball, toScreen([center[0] + (side === 'left' ? -23 : 23), center[1]])) },
                ]
              })
              const axis = localNode('position-axis')
              const start = endpoint(axis, false)
              const end = endpoint(axis, true)
              const heads = [...svg.querySelectorAll('[data-arrowhead-for]')].map(node => node.getAttribute('data-arrowhead-for'))
              const supportFaces = ['left', 'right'].map(side => ({
                side, present: !!localNode(`${side}-support-face`),
                caps: ['top', 'bottom'].every(edge => !!localNode(`${side}-support-caps-${edge}`)),
                hatches: Array.from({ length: 6 }, (_, index) => !!localNode(`${side}-support-hatching-${index}`)).filter(Boolean).length,
              }))
              return {
                viewport: { width: innerWidth, height: innerHeight },
                containerWidth: scroll.clientWidth, mediaWidth: svgRect.width, mediaHeight: svgRect.height,
                scrollWidth: scroll.scrollWidth, scrollLeft: scroll.scrollLeft,
                maximumScroll: scroll.scrollWidth - scroll.clientWidth,
                pageScrollWidth: document.documentElement.scrollWidth,
                minimumEffectiveTextPx: Math.min(...text.map(item => item.effectiveFontPx)),
                labels: text.length, text, joins, contacts, markers, supportFaces,
                ballCount: [...svg.querySelectorAll('ellipse,circle')].filter(node => node.id === `ld-${figure}_ld-${prefix}-ball`).length,
                axis: { start, end, horizontalRightward: end.x > start.x && Math.abs(start.y - end.y) < 0.01, heads },
              }
            }, { spec, prefix, figure, joinChecks: inputs.springJoinChecks })
            const record = { theme, width, position, ...metrics }
            records.push(record)
            const expectedLabels = number === 10
              ? [`${prefix}-axis-x-label-label`, `${prefix}-equilibrium-label-label`]
              : [`${prefix}-axis-x-label-label`, `${prefix}-equilibrium-label-label`, `${prefix}-displacement-x-label-label`]
            assert.equal(metrics.mediaWidth, 640)
            assert.equal(metrics.mediaHeight, 360)
            assert.equal(metrics.containerWidth, width)
            assert.equal(metrics.pageScrollWidth, viewport.width)
            assert.ok(metrics.minimumEffectiveTextPx >= 16)
            assert.equal(metrics.labels, number === 10 ? 2 : 3)
            assert.deepEqual(metrics.text.map(item => item.id), expectedLabels)
            assert.ok(metrics.text.every(item => item.withinCanvas))
            assert.ok(metrics.joins.every(item => item.continuous && item.unfilled))
            assert.ok(metrics.contacts.every(item => item.attached))
            assert.ok(metrics.markers.every(item => item.vertical && item.unarrowed))
            assert.ok(metrics.supportFaces.every(item => item.present && item.caps && item.hatches === 6))
            assert.equal(metrics.ballCount, 1)
            assert.ok(metrics.axis.horizontalRightward)
            assert.deepEqual(metrics.axis.heads, [`ld-${figure}_ld-${prefix}-position-axis`])
            const requestedScroll = position === 'end' ? metrics.maximumScroll : position === 'middle' ? metrics.maximumScroll / 2 : 0
            assert.ok(Math.abs(metrics.scrollLeft - requestedScroll) <= 1)
            if ((theme === 'neutral' && width === 640) || (theme === 'print' && width === 346 && position === 'middle')) {
              const name = theme === 'neutral' ? 'desktop-neutral-640-full.png' : 'mobile-print-346-middle.png'
              await page.locator('#scroll').screenshot({ path: `${output}/${name}` })
              record.screenshot = { path: `${output}/${name}`, sha256: hash(`${output}/${name}`) }
            }
            persist()
          }
          assert.deepEqual(deniedRequests, [])
          assert.deepEqual(browserErrors, [])
        } finally {
          await context.close()
        }
      }
      evidence.after = Object.fromEntries(Object.keys(before).map(file => [file, hash(`${dir}/${file}`)]))
      assert.deepEqual(evidence.after, before)
      evidence.canonicalBytesUnchanged = true
      evidence.geometryChecksSatisfied = true
      evidence.networkRequests = 0
      console.log(`${figure}: ${records.length} recorded states, 2 screenshot files, fixed media640, min text26px, continuous contacts, bytes unchanged`)
    } catch (error) {
      errors.push({ name: error.name, message: error.message, stack: error.stack })
      throw error
    } finally {
      persist()
    }
  }
} finally {
  await browser.close()
}
