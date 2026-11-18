import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(fileURLToPath(import.meta.url))
assert.equal(own, `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d708-n80-fig190191192-first-author`)
const [id, attempt = 'first'] = process.argv.slice(2)
assert.ok(['fig-190', 'fig-191', 'fig-192'].includes(id))
assert.ok(['first', 'repair1'].includes(attempt))
const folder = `${own}/${id}/${attempt}`
const specPath = `${folder}/spec.json`
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, value) => {
  const target = path.resolve(folder, name)
  assert.ok(target.startsWith(`${folder}/`))
  assert.ok(!fs.existsSync(target), `Preserve first receipt: ${target}`)
  fs.writeFileSync(target, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`)
}
const run = (stage, executable, args) => {
  const started = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: repo, encoding: 'utf8', timeout: 180000,
  })
  write(`${stage}.stdout.txt`, result.stdout || '')
  write(`${stage}.stderr.txt`, result.stderr || '')
  const receipt = {
    stage, executable, arguments: args, cwd: repo,
    started, completed: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    spec: { path: specPath, sha256: hash(specPath) },
    stdout: { path: `${folder}/${stage}.stdout.txt`, sha256: hash(`${folder}/${stage}.stdout.txt`) },
    stderr: { path: `${folder}/${stage}.stderr.txt`, sha256: hash(`${folder}/${stage}.stderr.txt`) },
  }
  write(`${stage}.receipt.json`, receipt)
  return receipt
}
const validator = run('validate', 'python3', [
  `${repo}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`, specPath, '--stage', 'draft', '--json',
])
if (validator.exitCode !== 0) {
  write('outcome.json', { id, attempt, status: 'FAIL', failedStage: 'native-validation', receipt: `${folder}/validate.receipt.json` })
  console.log(JSON.stringify({ id, attempt, status: 'FAIL', stage: 'native-validation', folder }, null, 2))
  process.exit(2)
}
const render = run('render', process.execPath, [
  `${repo}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
  '--spec', specPath, '--svg', `${folder}/figure.svg`, '--report', `${folder}/render.json`,
])
if (render.exitCode !== 0) {
  write('outcome.json', {
    id, attempt, status: 'FAIL', failedStage: 'native-render',
    receipt: `${folder}/render.receipt.json`,
    retainedOutputs: ['figure.svg', 'render.json'].filter(name => fs.existsSync(`${folder}/${name}`)),
  })
  console.log(JSON.stringify({ id, attempt, status: 'FAIL', stage: 'native-render', folder }, null, 2))
  process.exit(2)
}
const renderReport = JSON.parse(fs.readFileSync(`${folder}/render.json`, 'utf8'))
assert.equal(renderReport.status, 'pass')
const require = createRequire(`${repo}/app/package.json`)
const { chromium } = require('playwright')
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(candidate => fs.existsSync(candidate))
assert.ok(executablePath)
const browser = await chromium.launch({ executablePath, headless: true })
const started = new Date().toISOString()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } })
  const svg = fs.readFileSync(`${folder}/figure.svg`, 'utf8')
  await page.setContent(`<!doctype html><meta charset="utf-8">
    <style>
      :root {
        --ld-figure-ink: #15201f; --ld-figure-muted: #4c5a58;
        --ld-figure-accent: #15201f; --ld-figure-accent-soft: #8a9795;
        --ld-figure-grid: #e3eae9; --ld-figure-paper: #ffffff;
      }
      html, body { margin: 0; background: #fff; }
      .surface { width: min(680px, calc(100vw - 32px)); margin: 16px auto; }
      .scroll { width: 100%; overflow-x: auto; }
      .media { width: 640px; min-width: 640px; }
      .media > svg { display: block; width: 640px; height: auto; max-width: none; }
    </style>
    <main class="surface"><div class="scroll"><div class="media">${svg}</div></div></main>`)
  const evidence = []
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    const measurement = await page.evaluate(() => {
      const svg = document.querySelector('.media > svg')
      const scroller = document.querySelector('.scroll')
      scroller.scrollLeft = 0
      const text = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const bbox = node.getBBox()
        const pixelSize = Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b)
        return { id: node.getAttribute('data-label-id'), text: node.textContent, pixelSize, bbox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height } }
      })
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
      scroller.scrollLeft = scroller.scrollWidth
      const actualScrollLeft = scroller.scrollLeft
      return {
        mediaWidthPx: svg.getBoundingClientRect().width,
        clientWidth: scroller.clientWidth, scrollWidth: scroller.scrollWidth,
        maxScrollLeft, actualScrollLeft,
        reachedEnd: Math.abs(actualScrollLeft - maxScrollLeft) <= 1,
        minimumTextPx: Math.min(...text.map(item => item.pixelSize)),
        text,
      }
    })
    assert.equal(measurement.mediaWidthPx, 640)
    assert.ok(measurement.text.length)
    assert.ok(measurement.text.every(item => item.pixelSize >= 16 - 0.01))
    assert.equal(measurement.text.length, renderReport.labels)
    assert.ok(measurement.reachedEnd)
    if (viewport.width === 390) assert.ok(measurement.maxScrollLeft > 0)
    evidence.push({ viewport, ...measurement, status: 'pass' })
  }
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.evaluate(() => { document.querySelector('.scroll').scrollLeft = 0 })
  const svgElement = page.locator('.media > svg')
  await svgElement.screenshot({ path: `${folder}/native-640.png`, animations: 'disabled' })
  const styleEvidence = await page.evaluate(({ id, rayIds }) => {
    const element = objectId => document.getElementById(`ld-${id}_${`ld-${objectId}`}`) ||
      [...document.querySelectorAll('svg [id]')].find(node => node.id.endsWith(`_ld-${objectId}`))
    const geometry = [...document.querySelectorAll('.media > svg line, .media > svg path')]
      .map(node => ({ id: node.id, dash: node.getAttribute('stroke-dasharray'), stroke: node.getAttribute('stroke') }))
    return {
      geometry,
      actualRayStrokes: rayIds.map(objectId => {
        const node = element(objectId)
        return { objectId, found: Boolean(node), dash: node?.getAttribute('stroke-dasharray') || null }
      }),
    }
  }, { id, rayIds: spec.objects.filter(item => /^ray[12]-stage/.test(item.id)).map(item => item.id) })
  const receipt = {
    status: 'pass', stage: 'native-svg-media-640', scope: 'figure-only; no whole-card acceptance',
    started, completed: new Date().toISOString(), cwd: repo,
    browser: { executablePath, headless: true },
    inputs: ['spec.json', 'figure.svg', 'render.json'].map(name => ({ path: `${folder}/${name}`, sha256: hash(`${folder}/${name}`) })),
    image: { path: `${folder}/native-640.png`, sha256: hash(`${folder}/native-640.png`), generated: 1, openedInContext: 0 },
    evidence, styleEvidence,
  }
  write('media-640.receipt.json', receipt)
  write('outcome.json', {
    id, attempt, status: 'NATIVE-PASS-AUTHOR-VISUAL-PENDING',
    validation: `${folder}/validate.receipt.json`, render: `${folder}/render.json`,
    nativeMedia: `${folder}/media-640.receipt.json`, independentReview: false,
    modernTextD703: 'pending', promotion: false, wholeCardApproved: false,
  })
  console.log(JSON.stringify({
    id, attempt, status: 'NATIVE-PASS-AUTHOR-VISUAL-PENDING',
    minimumTextPx: evidence[0].minimumTextPx,
    screenshot: `${folder}/native-640.png`,
  }, null, 2))
} catch (error) {
  write('media-failure.receipt.json', {
    status: 'FAIL', stage: 'native-svg-media-640', cwd: repo,
    started, completed: new Date().toISOString(), error: error.stack,
  })
  process.exitCode = 2
  console.error(error.stack)
} finally {
  await browser.close()
}
