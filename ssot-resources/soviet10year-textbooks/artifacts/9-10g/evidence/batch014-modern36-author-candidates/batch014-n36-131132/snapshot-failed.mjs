import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { chromium } from '../../../.agents/skills/node_modules/playwright-core/index.mjs'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.tmp/s10y-image/batch014-n36-131132')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() })
try {
  for (const id of ['fig-131', 'fig-132']) {
    const dir = path.join(root, id, 'initial')
    const spec = JSON.parse(fs.readFileSync(path.join(dir, 'spec.json')))
    const svg = path.join(dir, 'figure.svg')
    const output = path.join(dir, 'preview.png')
    assert.ok(!fs.existsSync(output))
    const startedAt = new Date().toISOString()
    const page = await browser.newPage({ viewport: { width: spec.canvas.width, height: spec.canvas.height }, deviceScaleFactor: 1 })
    await page.setContent(`<style>html,body{margin:0;background:white}svg{display:block}</style>${fs.readFileSync(svg, 'utf8')}`)
    const observation = await page.evaluate(() => ({
      width: document.querySelector('svg').getBoundingClientRect().width,
      height: document.querySelector('svg').getBoundingClientRect().height,
      labels: [...document.querySelectorAll('text')].map(n => ({ id: n.dataset.labelId, text: n.textContent, rect: n.getBoundingClientRect().toJSON() })),
      geometryCount: document.querySelectorAll('path,line,ellipse,circle').length,
    }))
    assert.equal(observation.width, 640)
    assert.ok(observation.geometryCount > 0)
    await page.screenshot({ path: output, animations: 'disabled' })
    fs.writeFileSync(path.join(dir, 'failed-preview.call.json'), `${JSON.stringify({
      cwd, command: process.execPath, args: process.argv.slice(1), startedAt,
      endedAt: new Date().toISOString(), status: 'pass',
      scope: 'Snapshot of already-failed initial SVG for author inspection; not a new JSXGraph render, not a repaired candidate, not a passed review.',
      input: { path: svg, sha256: hash(svg) }, output: { path: output, sha256: hash(output) },
      observation,
    }, null, 2)}\n`, { flag: 'wx' })
    console.log(`${id}: retained full 640px failed preview, no source reopened.`)
    await page.close()
  }
} finally { await browser.close() }
