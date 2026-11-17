import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const A = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d040-9p-fig300-author`
const E = `${A}/root/9p/editions/modern-us-neutral`
const F = `${E}/figures`
const R = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d040-9p-n133-text-repair`
const CARD = 'phy9-c2-s7-n133'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
const write = (file, value) => {
  assert(path.resolve(file).startsWith(`${A}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const copy = (from, to) => {
  assert(path.resolve(to).startsWith(`${A}/`))
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
}
const spec = read(`${F}/fig-300.spec.json`)
const render = read(`${F}/fig-300.render.json`)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, sha(`${F}/fig-300.spec.json`))
assert.equal(render.output.svg.sha256, sha(`${F}/fig-300.svg`))
assert.equal(spec.source.image.path, '../../figures/fig-300.png')
const expectedText = ['zh', 'en'].flatMap(language => {
  const lesson = read(`${R}/${language}/lesson.template.json`)
  return [{ lesson: CARD, text: lesson.printed_title },
    ...lesson.prose.filter(block => block.text?.trim()).map(block => ({ lesson: CARD, text: block.text }))]
})
assert.deepEqual(spec.source.authoritativeText, expectedText)

if (process.argv[2] === 'verify') {
  const definitions = new Map(spec.objects.map(object => [object.id, object]))
  const at = value => Array.isArray(value) ? value : definitions.get(value).at
  const key = value => at(value).join(',')
  const primary = spec.objects.filter(object => object.type === 'segment'
    && /^primary-/.test(object.id) && !/plate|label-leader/.test(object.id))
  const secondary = spec.objects.filter(object => object.type === 'segment'
    && /^secondary-(turn|upper-return|lower-return)/.test(object.id))
  const endpoints = edges => new Set(edges.flatMap(edge => [key(edge.from), key(edge.to)]))
  const primaryEndpoints = endpoints(primary)
  const secondaryEndpoints = endpoints(secondary)
  assert.equal([...primaryEndpoints].filter(value => secondaryEndpoints.has(value)).length, 0)
  const connectionIds = new Set(spec.assertions.filter(item => item.type === 'connects').map(item => item.arrow))
  const allSegments = spec.objects.filter(object => object.type === 'segment')
  assert(allSegments.every(object => connectionIds.has(object.id)))
  const connected = (edges, bridges) => {
    const graph = new Map()
    for (const [from, to] of [...edges.map(edge => [key(edge.from), key(edge.to)]), ...bridges]) {
      for (const [a, b] of [[from, to], [to, from]]) {
        if (!graph.has(a)) graph.set(a, new Set())
        graph.get(a).add(b)
      }
    }
    const seen = new Set()
    const visit = node => {
      if (seen.has(node)) return
      seen.add(node)
      graph.get(node)?.forEach(visit)
    }
    visit(graph.keys().next().value)
    return seen.size === graph.size
  }
  const cycleRank = (edges, bridges) => {
    const pairs = [...edges.map(edge => [key(edge.from), key(edge.to)]), ...bridges]
    const uniqueEdges = new Set(pairs.map(pair => pair.sort().join('|')))
    const vertices = new Set(pairs.flat())
    assert(connected(edges, bridges))
    return uniqueEdges.size - vertices.size + 1
  }
  assert.equal(cycleRank(primary, [['87,160', '113,160'], ['319,187', '335,160']]), 1)
  assert.equal(cycleRank(primary, [['87,160', '113,160']]), 0)
  assert(connected(secondary, [['470,270', '595,270']]))
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const intersects = (first, second) => {
    const [a, b, c, d] = [first.from, first.to, second.from, second.to].map(at)
    return cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0
  }
  const projectedCrossings = primary.flatMap(p => secondary.filter(s => intersects(p, s)).map(s => [p.id, s.id]))
  assert(projectedCrossings.every(([p, s]) => /primary-turn/.test(p) && /secondary-turn/.test(s)))
  write(`${A}/receipts/topology.json`, {
    status: 'pass', currentSpec: bind(`${F}/fig-300.spec.json`),
    allSemanticSegmentsHaveConnects: true, segmentCount: allSegments.length,
    primarySecondarySharedElectricalVertices: 0,
    primaryClosedSwitchCycleRank: 1,
    primaryOpenSwitchCycleRank: 0,
    primaryOpenBladeBreaksClosedCurrentLoop: true,
    secondarySeriesPathClosesOnlyThroughGalvanometer: true,
    externalCrossCircuitCrossings: 0,
    windingProjectionCrossings: projectedCrossings,
    windingCrossingInterpretation: 'Insulated coaxial over-winding projection only; no shared electrical vertices or junction markers. Not an electrical connection.',
    abstractDeviceEdges: 'Battery plates and the two galvanometer terminals are treated as device ports, never as extra drawn wire shortcuts. Closing the switch is a verification thought-state, not drawn geometry.',
    noNewApparatusFromTextRepair: true,
  })

  const require = createRequire(`${W}/.agents/skills/package.json`)
  const { chromium } = require('playwright-core')
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    .find(file => fs.existsSync(file))
  assert(executablePath)
  const browser = await chromium.launch({ executablePath, headless: false })
  const observations = []
  try {
    for (const language of ['en', 'zh']) {
      for (const [name, viewport, requestedWidth] of [
        ['mobile316', { width: 348, height: 1060 }, 316],
        ['desktop640', { width: 1440, height: 960 }, 640],
      ]) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
        const requests = []
        const errors = []
        page.on('request', request => {
          if (/^https?:/.test(request.url())) requests.push(request.url())
        })
        page.on('pageerror', error => errors.push(String(error)))
        const html = `${A}/offline/${language}/${CARD}/text.html`
        await page.goto(pathToFileURL(html).href)
        await page.evaluate(() => document.fonts.ready)
        const figure = page.locator('#fig-300')
        const observed = await figure.evaluate(node => {
          const svg = node.querySelector('svg')
          const media = node.querySelector('.figure-media')
          const rect = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text')].map(text => {
            const matrix = text.getScreenCTM()
            const font = Number.parseFloat(getComputedStyle(text).fontSize)
            const bbox = text.getBoundingClientRect()
            return { text: text.textContent, id: text.getAttribute('data-label-id'),
              px: font * Math.hypot(matrix.a, matrix.b),
              inside: bbox.left >= rect.left - 0.1 && bbox.right <= rect.right + 0.1
                && bbox.top >= rect.top - 0.1 && bbox.bottom <= rect.bottom + 0.1 }
          })
          return { layout: node.dataset.figureLayout, purpose: node.dataset.figurePurpose,
            mediaWidth: media.getBoundingClientRect().width, svgWidth: rect.width,
            height: rect.height, labels, horizontalOverflow: node.scrollWidth > node.clientWidth,
            minTextPx: Math.min(...labels.map(label => label.px)),
            errorsVisible: [...document.querySelectorAll('.err')].map(item => item.textContent),
            title: document.querySelector('h1')?.textContent,
            sourceTitle: document.querySelector('title')?.textContent }
        })
        assert.equal(observed.layout, 'inline')
        assert.equal(observed.purpose, 'instructional')
        assert(Math.abs(observed.mediaWidth - requestedWidth) < 0.1)
        assert(Math.abs(observed.svgWidth - requestedWidth) < 0.1)
        assert.equal(observed.labels.length, 14)
        assert(observed.labels.every(label => label.px >= 16 && label.inside
          && !/[\u0400-\u04ff\u4e00-\u9fff]/.test(label.text)))
        assert.equal(observed.horizontalOverflow, false)
        assert.equal(observed.errorsVisible.length, 0)
        assert.equal(requests.length, 0)
        assert.equal(errors.length, 0)
        if (language === 'en') {
          assert.equal(read(`${R}/en/lesson.template.json`).title, 'Measuring the Permeability of Iron')
          assert.equal(observed.title, read(`${R}/en/lesson.template.json`).printed_title)
        }
        const screenshot = `${A}/screenshots/${language}-${name}.png`
        fs.mkdirSync(path.dirname(screenshot), { recursive: true })
        await figure.screenshot({ path: screenshot, animations: 'disabled' })
        observations.push({ language, viewport, requestedWidth, offlineHtml: bind(html),
          screenshot: bind(screenshot), observed, networkRequests: requests, pageErrors: errors })
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
  const pixelResult = spawnSync(`${W}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, [
    '-c',
    'from PIL import Image; import sys,json; out=[]\nfor p in sys.argv[1:]:\n im=Image.open(p).convert("RGB"); n=sum(1 for r,g,b in im.getdata() if max(r,g,b)<220); out.append({"path":p,"width":im.width,"height":im.height,"darkPixels":n,"totalPixels":im.width*im.height})\nprint(json.dumps(out))',
    ...observations.map(item => item.screenshot.path),
  ], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
  assert.equal(pixelResult.status, 0, pixelResult.stderr)
  const pixels = JSON.parse(pixelResult.stdout)
  assert(pixels.every(image => image.darkPixels > image.totalPixels * 0.015 && image.darkPixels < image.totalPixels * 0.5))
  write(`${A}/receipts/offline-display.json`, {
    status: 'pass', browser: { headed: true, executablePath },
    authoritativeTextFreeze: bind(`${R}/repair-freeze.json`), spec: bind(`${F}/fig-300.spec.json`),
    mediaWidthContract: 'Mobile offline viewport 348 px minus 16 px side padding yields actual 316 px media. Desktop viewport 1440 px uses the declared inline maximum 640 px. These are measured media widths, not substituted viewport widths.',
    observations, pixels,
    englishTitleObservation: 'Repaired template.title is Measuring the Permeability of Iron. The installed offline renderer displays the preserved template.printed_title, 133. 铁的磁导率的测定. Author did not alter the parent text or renderer.',
  })
  console.log(JSON.stringify({ status: 'offline-width-and-topology-pass', screenshotFiles: observations.map(item => item.screenshot.path) }))
  process.exit(0)
}

assert.equal(process.argv[2], 'freeze')
assert.equal(read(`${A}/receipts/offline-display.json`).status, 'pass')
assert.equal(read(`${A}/visual-observations.json`).imageCount, 8)
const frozenE = `${A}/frozen/9p/editions/modern-us-neutral`
for (const name of ['fig-300.spec.json', 'fig-300.svg', 'fig-300.render.json']) {
  copy(`${F}/${name}`, `${frozenE}/figures/${name}`)
}
copy(`${A}/root/9p/figures/fig-300.png`, `${A}/frozen/9p/figures/fig-300.png`)
for (const name of ['context-en.json', 'context-zh.json', 'input-bindings.json', 'visual-observations.json']) {
  copy(`${A}/${name}`, `${A}/frozen/${name}`)
}
for (const language of ['zh', 'en']) {
  for (const name of ['lesson.template.json', 'prose.md']) {
    copy(`${R}/${language}/${name}`, `${A}/frozen/text/${language}/${name}`)
  }
}
write(`${A}/frozen/source-inventory.json`, spec.source.inventory)
const validator = `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`
const result = spawnSync('python3', [validator, `${frozenE}/figures/fig-300.spec.json`, '--stage', 'rendered', '--json'],
  { cwd: frozenE, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
assert.equal(result.status, 0, result.stdout + result.stderr)
write(`${A}/receipts/frozen-native-validation.json`, {
  command: 'python3', args: [validator, `${frozenE}/figures/fig-300.spec.json`, '--stage', 'rendered', '--json'],
  cwd: frozenE, exitCode: result.status, result: JSON.parse(result.stdout),
})
const repoValidation = spawnSync('python3', [validator, `${frozenE}/figures/fig-300.spec.json`, '--stage', 'rendered', '--json'],
  { cwd: W, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
write(`${A}/receipts/repo-cwd-path-probe.json`, {
  command: 'python3', args: [validator, `${frozenE}/figures/fig-300.spec.json`, '--stage', 'rendered', '--json'],
  cwd: W, exitCode: repoValidation.status, result: JSON.parse(repoValidation.stdout),
  observation: 'Native source.image paths are cwd-relative. The requested ../../figures path passes from the edition base, but edition.py currently launches this validator from repo root. Independent review must retain this integration caveat; no charter, canonical spec or validator changes were made.',
})
const receipts = fs.readdirSync(`${A}/receipts`).sort().map(name => bind(`${A}/receipts/${name}`))
const freeze = {
  schema: 'ld-s10y-image/bounded-author-freeze@1', ticket: 'STEMROBIN-181', figure: 'fig-300',
  status: 'AUTHOR-RENDER-PASS-INDEPENDENT-REVIEW-PENDING-EDITION-CWD-PATH-CAVEAT',
  owner: A, source: bind(`${A}/frozen/9p/figures/fig-300.png`),
  authoritativeTextFreeze: bind(`${R}/repair-freeze.json`),
  originalTextFreeze: read(`${A}/input-bindings.json`).originalInputFreeze,
  outputs: {
    spec: bind(`${frozenE}/figures/fig-300.spec.json`),
    svg: bind(`${frozenE}/figures/fig-300.svg`),
    render: bind(`${frozenE}/figures/fig-300.render.json`),
  },
  context: ['zh', 'en'].map(language => bind(`${A}/frozen/context-${language}.json`)),
  currentText: ['zh', 'en'].map(language => ({
    language, files: ['lesson.template.json', 'prose.md'].map(name => bind(`${A}/frozen/text/${language}/${name}`)),
  })),
  inventory: bind(`${A}/frozen/source-inventory.json`),
  inputBindings: bind(`${A}/frozen/input-bindings.json`),
  observations: bind(`${A}/frozen/visual-observations.json`),
  renderChecks: { status: render.status, collisions: render.collisions, labels: render.labels,
    display: spec.display, displayChecks: render.displayChecks },
  nativeValidation: 'pass from the declared edition working directory; source PNG hash current',
  integrationPathCaveat: 'source.image ../../figures/fig-300.png is relative to edition base, not spec parent. Native validator uses process cwd; the lesson edition validator currently starts it from repo root, where this relative path fails. See receipts/repo-cwd-path-probe.json. No additional rendering or path repair was performed after the sole repair.',
  receipts, authorScripts: ['author.mjs', 'repair-and-render.mjs', 'verify-and-freeze.mjs'].map(name => bind(`${A}/${name}`)),
  imageCount: 8, imageLimit: 8, sourceImageOpens: 2, outputImageOpens: 6,
  rendererInvocations: 2, targetedRepairsUsed: 1, targetedRepairsAllowed: 1,
  canonicalPromotion: false, recordReviewCalled: false, independentReview: 'pending',
  durableOutputContracts: {
    plannedLessonEntry: { id: 'fig-300', svg: 'figures/fig-300.svg', render: 'figures/fig-300.render.json',
      spec: 'figures/fig-300.spec.json', review: 'figures/fig-300.review.json' },
    reviewFileNotAuthored: true,
    reportPaths: 'Relative durable edition-output paths only; no preview or ticket-temporary path is embedded in render metadata.',
  },
}
write(`${A}/author-freeze.json`, freeze)
console.log(JSON.stringify({ freeze: bind(`${A}/author-freeze.json`), outputs: freeze.outputs,
  contexts: freeze.context, receipts: receipts.length, status: freeze.status, imageCount: 8 }, null, 2))
