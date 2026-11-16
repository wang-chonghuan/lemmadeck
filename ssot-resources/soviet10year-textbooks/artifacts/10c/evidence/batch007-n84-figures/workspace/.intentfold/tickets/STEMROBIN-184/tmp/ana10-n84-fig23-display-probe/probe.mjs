import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = process.cwd()
const output = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n84-fig23-display-probe')
const input = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n84-modern-figure-author-evidence/fig-23')
const expected = {
  'spec.attempt-01.json': '71b366dcab545af9f8e5d755166c25bf79f9c529d106dbbb2179c2d6e9215785',
  'fig-23.attempt-01.svg': '1f5257f9444524e240cda62d27315d26207e934c10d3b77e0432931400cab060',
  'fig-23.attempt-01.png': '0bbe2fa41af8611c908260e3441392e0817acff5a935fa3ded19a69008a96b27',
  'render.attempt-01.json': 'c6195519ac225de1540da6082ff8420a6e3e0b4e7c302a1dcc0fa690d1fcae69',
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const inputHashes = () => Object.fromEntries(Object.keys(expected).map(name => [name, hash(path.join(input, name))]))
const write = (name, value) => fs.writeFileSync(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`)
const near = (a, b) => Math.abs(a - b) <= 1e-6
const started = new Date().toISOString()
const records = []
const requests = []
let before = null
let browser = null
let failure = null
let launch = null
let summary = null

try {
  if (process.env.PWDEBUG !== undefined || process.env.PLAYWRIGHT_HTML_OPEN !== 'never') {
    throw new Error('Required environment: PWDEBUG unset; PLAYWRIGHT_HTML_OPEN=never')
  }
  if (fs.existsSync(path.join(output, 'metrics.json'))) {
    throw new Error('Existing first probe evidence: do not run again')
  }
  before = inputHashes()
  if (JSON.stringify(before) !== JSON.stringify(expected)) {
    throw new Error('Frozen input SHA256 mismatch; no browser started')
  }
  const snapshotDir = path.join(output, 'input-snapshot')
  fs.mkdirSync(snapshotDir)
  for (const name of Object.keys(expected)) {
    fs.copyFileSync(path.join(input, name), path.join(snapshotDir, name))
  }
  write('inputs.before.json', {
    inputDirectory: input,
    hashes: before,
    snapshots: Object.keys(expected).map(name => ({
      file: `input-snapshot/${name}`, sha256: hash(path.join(snapshotDir, name)),
    })),
  })
  const spec = JSON.parse(fs.readFileSync(path.join(input, 'spec.attempt-01.json'), 'utf8'))
  const render = JSON.parse(fs.readFileSync(path.join(input, 'render.attempt-01.json'), 'utf8'))
  const svg = fs.readFileSync(path.join(input, 'fig-23.attempt-01.svg'), 'utf8')
  if (spec.id !== 'fig-23' || spec.display.layout !== 'scroll' ||
      !spec.display.widths.includes(640) || spec.display.minTextPx < 16 ||
      spec.canvas.width !== 1280 || spec.canvas.height !== 640 ||
      render.spec.sha256 !== before['spec.attempt-01.json'] ||
      render.output.svg.sha256 !== before['fig-23.attempt-01.svg']) {
    throw new Error('Assigned display/input binding does not match the frozen scroll640 premise')
  }
  const expectedLabelIds = spec.objects.flatMap(object =>
    object.type === 'text' || (typeof object.label === 'string' && object.label.trim()) ?
      [`${object.id}-label`] : [],
  ).sort()
  const mediaWidth = 640
  const mediaHeight = spec.canvas.height * mediaWidth / spec.canvas.width
  const { chromium } = createRequire(
    path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  )('playwright-core')
  const executablePath = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean).find(file => fs.existsSync(file))
  if (!executablePath) throw new Error('No existing browser executable; no install or fallback')
  launch = { executablePath, headless: true, isolatedContexts: true, serviceWorkers: 'block' }
  browser = await chromium.launch({ executablePath, headless: true })
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
  for (const [theme, viewportWidth] of [
    ['neutral', 640], ['print', 640], ['neutral', 240], ['print', 346],
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewportWidth, height: mediaHeight },
      deviceScaleFactor: 1,
      serviceWorkers: 'block',
    })
    try {
      await context.route('**/*', route => {
        requests.push({ theme, viewportWidth, url: route.request().url() })
        return route.abort()
      })
      const page = await context.newPage()
      const variables = Object.entries(themes[theme])
        .map(([role, value]) => `--ld-figure-${role}:${value};`).join('')
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
        <style>
          html,body{margin:0;padding:0;background:#fff;}
          #scroll{width:${viewportWidth}px;height:${mediaHeight}px;overflow-x:auto;overflow-y:hidden;}
          #media{${variables}width:${mediaWidth}px;min-width:${mediaWidth}px;height:${mediaHeight}px;}
          #media>svg{display:block;width:${mediaWidth}px;min-width:${mediaWidth}px;max-width:none;height:auto;}
        </style></head><body><div id="scroll"><div id="media">${svg}</div></div></body></html>`)
      await page.evaluate(() => document.fonts.ready)
      const positions = viewportWidth === 640 ? ['full'] : ['start', 'middle', 'end']
      for (const position of positions) {
        await page.evaluate(position => {
          const scroll = document.getElementById('scroll')
          const maximum = scroll.scrollWidth - scroll.clientWidth
          scroll.scrollLeft = position === 'end' ? maximum : position === 'middle' ? maximum / 2 : 0
        }, position)
        const metrics = await page.evaluate(() => {
          const scroll = document.getElementById('scroll')
          const svg = document.querySelector('#media>svg')
          const media = svg.getBoundingClientRect()
          const rectValue = rect => ({
            x: rect.x, y: rect.y, width: rect.width, height: rect.height,
          })
          const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
            const matrix = node.getScreenCTM()
            const screen = node.getBoundingClientRect()
            const computed = getComputedStyle(node)
            const scaleX = Math.hypot(matrix.a, matrix.b)
            const scaleY = Math.hypot(matrix.c, matrix.d)
            const fontPx = Number.parseFloat(computed.fontSize)
            return {
              id: node.getAttribute('data-label-id'),
              text: node.textContent,
              nativeFontPx: fontPx,
              ctm: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f },
              scaleX,
              scaleY,
              effectiveFontPxX: fontPx * scaleX,
              effectiveFontPxY: fontPx * scaleY,
              userBBox: rectValue(node.getBBox()),
              viewportBounds: rectValue(screen),
              mediaBounds: { x: screen.x - media.x, y: screen.y - media.y, width: screen.width, height: screen.height },
              viewportVisible: screen.right > 0 && screen.left < window.innerWidth &&
                screen.bottom > 0 && screen.top < window.innerHeight,
              fill: computed.fill,
            }
          })
          const matrix = svg.getScreenCTM()
          return {
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            containerWidth: scroll.clientWidth,
            containerHeight: scroll.clientHeight,
            nativeCanvas: { width: svg.viewBox.baseVal.width, height: svg.viewBox.baseVal.height },
            media: rectValue(media),
            svgScreenCTM: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f },
            scrollWidth: scroll.scrollWidth,
            scrollLeft: scroll.scrollLeft,
            maximumScroll: scroll.scrollWidth - scroll.clientWidth,
            documentClientWidth: document.documentElement.clientWidth,
            documentScrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
            minimumEffectiveTextPx: Math.min(...labels.flatMap(label =>
              [label.effectiveFontPxX, label.effectiveFontPxY],
            )),
            labels,
          }
        })
        const checks = {
          media640: near(metrics.media.width, mediaWidth),
          media320: near(metrics.media.height, mediaHeight),
          native1280x640: metrics.nativeCanvas.width === 1280 && metrics.nativeCanvas.height === 640,
          svgScaleHalf: near(metrics.svgScreenCTM.a, 0.5) && near(metrics.svgScreenCTM.d, 0.5),
          everyLabelScaleHalf: metrics.labels.every(label => near(label.scaleX, 0.5) && near(label.scaleY, 0.5)),
          everyLabelAtLeast16: metrics.labels.length > 0 && metrics.labels.every(label =>
            label.effectiveFontPxX >= 16 - 1e-6 && label.effectiveFontPxY >= 16 - 1e-6,
          ),
          completeLabelMembership: JSON.stringify(metrics.labels.map(label => label.id).sort()) === JSON.stringify(expectedLabelIds) &&
            metrics.labels.length === render.labels,
          scrollWidth640: metrics.scrollWidth === mediaWidth,
          expectedMaximumScroll: metrics.maximumScroll === mediaWidth - viewportWidth,
          intendedScrollReached: near(metrics.scrollLeft, position === 'end' ? metrics.maximumScroll :
            position === 'middle' ? metrics.maximumScroll / 2 : 0),
          wholePageNoOverflow: metrics.documentClientWidth === viewportWidth &&
            metrics.documentScrollWidth === viewportWidth && metrics.bodyScrollWidth === viewportWidth,
          noNetworkRequests: requests.length === 0,
        }
        const screenshot = `${theme}-${viewportWidth}-${position}.png`
        await page.screenshot({ path: path.join(output, screenshot), fullPage: false })
        records.push({
          theme, position, screenshot, screenshotSha256: hash(path.join(output, screenshot)),
          checks, ...metrics,
        })
        write('records.partial.json', records)
        const failed = Object.entries(checks).filter(([, met]) => !met).map(([name]) => name)
        if (failed.length) {
          const error = new Error(`${screenshot}: mechanical display assertions failed: ${failed.join(', ')}`)
          error.mechanicalFailure = true
          throw error
        }
      }
    } finally {
      await context.close()
    }
  }
  summary = {
    snapshots: records.length,
    nativeCanvas: { width: 1280, height: 640 },
    actualMedia: { width: mediaWidth, height: mediaHeight },
    minimumEffectiveTextPx: Math.min(...records.map(record => record.minimumEffectiveTextPx)),
    labelCount: expectedLabelIds.length,
    scrollEndsReached: records.filter(record => record.position === 'end').map(record => ({
      viewportWidth: record.viewportWidth, scrollLeft: record.scrollLeft, maximumScroll: record.maximumScroll,
    })),
  }
} catch (error) {
  failure = {
    message: error.message,
    stack: error.stack,
    category: error.mechanicalFailure ? 'mechanical-display-assertion' : 'runtime-or-premise',
  }
  console.error(error.stack)
  process.exitCode = error.mechanicalFailure ? 2 : 1
} finally {
  if (browser) await browser.close()
  const after = inputHashes()
  const inputsUnchanged = before !== null && JSON.stringify(before) === JSON.stringify(after)
  if (!inputsUnchanged && !failure) {
    failure = { message: 'Frozen input bytes changed during the probe', category: 'input-integrity' }
    process.exitCode = 2
  }
  write('inputs.after.json', { hashes: after, inputsUnchanged })
  const evidence = {
    schema: 'n84/fig23-mechanical-display-probe@1',
    role: 'mechanical display evidence only; no figure review or semantic approval',
    authority: 'parent-agent delegation under existing human ticket authority',
    command: { executable: process.execPath, argv: process.argv.slice(1), cwd: root },
    environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' },
    started,
    finished: new Date().toISOString(),
    launch,
    taskOwnedBrowserClosed: true,
    inputDirectory: input,
    before,
    after,
    inputsUnchanged,
    requests,
    summary,
    records,
    failure,
    outcome: failure ? 'FAILED' : 'mechanical_checks_met',
    rerender: false,
    specOrGeometryChange: false,
    independentFigureApproval: null,
  }
  write('metrics.json', evidence)
  if (failure) write('FAILED.json', failure)
  else console.log(`Mechanical probe complete: ${records.length} screenshots, media640x320, minimum text${summary.minimumEffectiveTextPx}px,10 labels. Frozen inputs unchanged=${inputsUnchanged}. No figure approval.`)
}
