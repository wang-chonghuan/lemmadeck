import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const A = path.dirname(fileURLToPath(import.meta.url))
const F = `${A}/fig-301/repair-1`
const require = createRequire(`${W}/app/package.json`)
const { chromium } = require('playwright')
const { withVectorGlyphFont } = require(`${W}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
const write = (file, value) => {
  assert(file.startsWith(`${A}/`) && !fs.existsSync(file))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const spec = read(`${F}/fig-301.spec.json`)
const render = read(`${F}/fig-301.render.json`)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, sha(`${F}/fig-301.spec.json`))
assert.equal(render.output.svg.sha256, sha(`${F}/fig-301.svg`))
const action = process.argv[2]

if (action === 'verify') {
  const originalSvg = fs.readFileSync(`${F}/fig-301.svg`, 'utf8')
  const vector = withVectorGlyphFont(originalSvg)
  assert.equal(vector, originalSvg, 'Source has no vector accent; do not invent one.')
  const html = `${F}/native-width-fixture.html`
  assert(!fs.existsSync(html))
  fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
html,body{margin:0;background:white}
:root{--sr-ink:#1b1b1b;--sr-ink-soft:#6b6b6b;--sr-ink-dim:#6b6b6b;--sr-line:#e3e3e3;--sr-white:white}
figure{margin:0;max-width:100%}
.sr-figure-media{--ld-figure-ink:var(--sr-ink);--ld-figure-muted:var(--sr-ink-soft);
--ld-figure-accent:var(--sr-ink);--ld-figure-accent-soft:var(--sr-ink-dim);
--ld-figure-grid:var(--sr-line);--ld-figure-paper:var(--sr-white);display:block;margin:0;
width:640px;max-width:100%;font-size:16px}
.sr-figure-media svg{display:block;width:100%;max-width:100%;height:auto}
</style></head><body><figure class="sr-read-fig" data-figure-layout="inline"
data-figure-purpose="instructional"><div class="sr-figure-media"
data-figure-theme="neutral">${vector}</div></figure></body></html>`, 'utf8')
  const observations = []
  const failures = []
  const browser = await chromium.launch({
    headless: false, env: { ...process.env, TMPDIR: `${A}/browser-tmp/` },
  })
  try {
    for (const width of [316, 640]) {
      const page = await browser.newPage({
        viewport: width === 316 ? { width: 390, height: 844 } : { width: 1440, height: 960 },
        deviceScaleFactor: 1,
      })
      try {
        await page.goto(pathToFileURL(html).href)
        await page.locator('.sr-figure-media').evaluate((media, requested) => {
          media.style.width = `${requested}px`
        }, width)
        await page.evaluate(() => document.fonts.ready)
        const observed = await page.locator('.sr-figure-media').evaluate(async media => {
          const svg = media.querySelector('svg')
          const bounds = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
            const ctm = node.getScreenCTM()
            const rect = node.getBoundingClientRect()
            const style = getComputedStyle(node)
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent,
              fontFamily: style.fontFamily, fontSize: parseFloat(style.fontSize),
              fontPxAtMediaWidth: parseFloat(style.fontSize) * Math.hypot(ctm.a, ctm.b),
              clipped: rect.left < bounds.left || rect.right > bounds.right
                || rect.top < bounds.top || rect.bottom > bounds.bottom,
              rectangle: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            }
          })
          const overlapping = []
          for (let i = 0; i < labels.length; i += 1) {
            for (let j = i + 1; j < labels.length; j += 1) {
              const a = labels[i].rectangle
              const b = labels[j].rectangle
              if (a.x < b.x + b.width && b.x < a.x + a.width
                && a.y < b.y + b.height && b.y < a.y + a.height) {
                overlapping.push([labels[i].id, labels[j].id])
              }
            }
          }
          const curve = svg.querySelector('g[id$="-raw-path-layer"] path')
          const length = curve.getTotalLength()
          const samples = Array.from({ length: 201 }, (_, index) => {
            const p = curve.getPointAtLength(length * index / 200)
            return [p.x, p.y]
          })
          const monotonic = samples.slice(1).every((p, index) =>
            p[0] > samples[index][0] && p[1] < samples[index][1])
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(bounds.width)
          canvas.height = Math.round(bounds.height)
          const context = canvas.getContext('2d')
          context.fillStyle = 'white'
          context.fillRect(0, 0, canvas.width, canvas.height)
          const image = new Image()
          const blob = new Blob([new XMLSerializer().serializeToString(svg)],
            { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          try {
            image.src = url
            await image.decode()
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
          } finally {
            URL.revokeObjectURL(url)
          }
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
          let ink = 0
          for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] < 150 && pixels[i + 1] < 150 && pixels[i + 2] < 150) ink += 1
          }
          return {
            mediaWidth: bounds.width, mediaHeight: bounds.height, labels, overlapping,
            pageOverflow: document.documentElement.scrollWidth > innerWidth,
            curve: { length, start: samples[0], end: samples.at(-1), monotonic,
              pathCount: svg.querySelectorAll('g[id$="-raw-path-layer"] path').length },
            raster: { inkPixels: ink, pixels: canvas.width * canvas.height,
              nonblankAndNotBlack: ink > 250 && ink < canvas.width * canvas.height * 0.2 },
          }
        })
        const cdp = await page.context().newCDPSession(page)
        await cdp.send('DOM.enable')
        await cdp.send('CSS.enable')
        const { root } = await cdp.send('DOM.getDocument')
        for (const label of observed.labels) {
          const { nodeId } = await cdp.send('DOM.querySelector', {
            nodeId: root.nodeId, selector: `text[data-label-id="${label.id}"]`,
          })
          label.platformFonts = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts
          assert(label.platformFonts.reduce((sum, font) => sum + font.glyphCount, 0)
            >= [...label.text].length, `Missing native glyph: ${label.text}`)
        }
        await cdp.detach()
        assert.equal(observed.mediaWidth, width)
        assert.equal(observed.labels.length, 3)
        assert.deepEqual(observed.labels.map(label => label.text).sort(), ['0', 'B\u2080', 'I'])
        assert(observed.labels.every(label => label.fontPxAtMediaWidth >= 16 && !label.clipped))
        assert.equal(observed.overlapping.length, 0)
        assert(!observed.pageOverflow)
        assert(observed.curve.monotonic && observed.curve.pathCount === 1)
        assert(Math.abs(observed.curve.start[0] - 90) < 0.01
          && Math.abs(observed.curve.start[1] - 442) < 0.01)
        assert(Math.abs(observed.curve.end[0] - 450) < 0.01
          && Math.abs(observed.curve.end[1] - 150) < 0.01)
        assert(observed.raster.nonblankAndNotBlack)
        if (width === 316) {
          const png = `${F}/fig-301.w316.png`
          assert(!fs.existsSync(png))
          await page.locator('.sr-figure-media').screenshot({ path: png })
          observed.screenshot = bind(png)
        } else {
          observed.screenshot = bind(`${F}/fig-301.native.png`)
          observed.screenshotSurface = 'Immutable renderer 640 px output inspected separately.'
        }
        observations.push({ status: 'PASS', requestedWidth: width, ...observed })
      } catch (error) {
        failures.push({ requestedWidth: width, status: 'FAIL', message: error.message })
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
    assert.equal(sha(`${F}/fig-301.svg`), render.output.svg.sha256)
    write(`${F}/native-width-check.json`, {
      status: failures.length ? 'FAIL' : 'PASS', headed: true,
      scope: 'Isolated native SVG media fixture at supplied actual widths, not app or whole-card acceptance.',
      vectorGlyphHelper: bind(`${W}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`),
      sourceHasNoVectorAccent: true, unicodeSubscriptCluster: 'B\u2080',
      glyphPolicy: 'Native supported Unicode, no unsupported backslash text; no invented vector accent.',
      spec: bind(`${F}/fig-301.spec.json`), svg: bind(`${F}/fig-301.svg`),
      fixture: bind(html), observations, failures, independentApproval: false,
    })
  }
  assert.equal(failures.length, 0, JSON.stringify(failures))
  console.log(JSON.stringify({ status: 'PASS', widths: [316, 640],
    minimumLabelFontPx: Math.min(...observations.flatMap(item =>
      item.labels.map(label => label.fontPxAtMediaWidth))) }))
} else if (action === 'freeze') {
  const widthCheck = read(`${F}/native-width-check.json`)
  const visual = read(`${F}/author-visual-observation.json`)
  assert.equal(widthCheck.status, 'PASS')
  assert.equal(visual.status, 'PASS')
  const bindings = read(`${A}/input-bindings.json`)
  for (const item of bindings.inputs) {
    assert.equal(sha(item.input.path), item.input.sha256)
    assert.equal(sha(item.frozen.path), item.frozen.sha256)
  }
  const current = bindings.currentAuthority
  assert.equal(sha(current.path), current.sha256)
  for (const language of ['zh', 'en']) {
    const actual = spec.source.authoritativeText.filter(item => item.language === language)
    const expected = read(`${A}/inputs/${language}/prose.json`).prose.map(item => ({
      lesson: 'phy9-c2-s7-n134', language, text: item.text, sourceRefs: item.source_refs,
    }))
    assert.deepEqual(actual, expected)
  }
  const initial = `${A}/fig-301/initial`
  const artifacts = []
  const collect = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name !== 'browser-tmp') collect(file)
      } else if (entry.name !== 'author-freeze.json') artifacts.push(bind(file))
    }
  }
  collect(A)
  const freeze = {
    schema: 'ld-s10y-image/bounded-figure-author-freeze@1',
    ticket: 'STEMROBIN-181', card: 'phy9-c2-s7-n134',
    frozenAt: new Date().toISOString(),
    status: 'AUTHOR-CANDIDATE-PASS-CURRENT-TEXT-BOUND-INDEPENDENT-REVIEW-PENDING',
    ownedOutputRoot: A, authoredFigures: ['fig-301'], authoredFigureCount: 1,
    currentBilingualTextAuthority: current, originalTextAuthority: bindings.originalAuthority,
    textBindingStatus: 'Current repaired bilingual text, not provisional original text. Independent text approval remains pending.',
    currentTextIncludedVerbatimInSourceAuthoritativeText: true,
    metadataRebindAfterRendering: false,
    metadataRebindReason: 'Repaired freeze arrived before the first render; both immutable attempts already use it.',
    sourceObservations: bind(`${A}/source-observations.json`),
    figure303: { status: 'OBSERVATION-ONLY-OWNERSHIP-TRANSFERRED',
      owner: 'Lagrange', specCreated: false, renderPerformed: false,
      observationRetained: true, sourceOpens: 1 },
    attempts: [
      {
        attempt: 'initial', status: 'FAIL', validationStatus: 'PASS', renderStatus: 'PASS',
        authorVisualStatus: 'FAIL', spec: bind(`${initial}/fig-301.spec.json`),
        svg: bind(`${initial}/fig-301.svg`), render: bind(`${initial}/fig-301.render.json`),
        png: bind(`${initial}/fig-301.native.png`),
        visual: bind(`${initial}/author-visual-observation.json`),
        draftReceipt: bind(`${initial}/draft-validation.json`),
        renderReceipt: bind(`${initial}/render-command.json`),
        renderedReceipt: bind(`${initial}/rendered-validation.json`),
        reason: 'Fine segment-join artifacts at desktop width.',
      },
      {
        attempt: 'repair-1', status: 'PASS', validationStatus: 'PASS', renderStatus: 'PASS',
        authorVisualStatus: 'PASS', spec: bind(`${F}/fig-301.spec.json`),
        svg: bind(`${F}/fig-301.svg`), render: bind(`${F}/fig-301.render.json`),
        png: bind(`${F}/fig-301.native.png`),
        mobile: bind(`${F}/fig-301.w316.png`),
        visual: bind(`${F}/author-visual-observation.json`),
        draftReceipt: bind(`${F}/draft-validation.json`),
        renderReceipt: bind(`${F}/render-command.json`),
        renderedReceipt: bind(`${F}/rendered-validation.json`),
        repairProof: bind(`${F}/repair-proof.json`),
        nativeWidthCheck: bind(`${F}/native-width-check.json`),
      },
    ],
    finalCandidate: { spec: bind(`${F}/fig-301.spec.json`), svg: bind(`${F}/fig-301.svg`),
      render: bind(`${F}/fig-301.render.json`), display: spec.display },
    rendererInvocations: 2, targetedSpecRepairsUsed: 1, targetedSpecRepairsAllowed: 1,
    imagesOpened: 5, maximumImageOpens: 8,
    imageOpenLog: [
      { sequence: 1, path: read(`${A}/source-observations.json`).sourceOpens[0].path, purpose: 'Original 301' },
      { sequence: 2, path: read(`${A}/source-observations.json`).sourceOpens[1].path, purpose: 'Original 303, observation only' },
      { sequence: 3, path: `${initial}/fig-301.native.png`, purpose: 'Initial desktop render, FAIL' },
      { sequence: 4, path: `${F}/fig-301.native.png`, purpose: 'Sole repair desktop render, PASS' },
      { sequence: 5, path: `${F}/fig-301.w316.png`, purpose: 'Sole repair actual mobile width, PASS' },
    ],
    reviewRecorderInvocations: 0, independentApproval: false, promotionPerformed: false,
    canonicalOutputsWritten: false, appAcceptancePerformed: false, databaseOperations: 0,
    backendOperations: 0, gitWrites: 0, dependencyWrites: 0, charterWrites: 0,
    allAuthorArtifactWritesConfinedToOwnedRoot: true,
    nextGate: 'Independent source/text/figure review and parent-owned promotion only.',
    artifacts,
  }
  write(`${A}/author-freeze.json`, freeze)
  console.log(JSON.stringify({ status: freeze.status, freeze: bind(`${A}/author-freeze.json`),
    finalCandidate: freeze.finalCandidate, imagesOpened: freeze.imagesOpened }))
} else {
  throw new Error('Use verify or freeze')
}
