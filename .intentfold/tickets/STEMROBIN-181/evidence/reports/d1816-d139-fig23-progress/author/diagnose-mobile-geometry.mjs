import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { chromium } from '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.agents/skills/node_modules/playwright-core/index.mjs'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d139-n17-fig23-author')
assert.equal(process.cwd(), repo)
const read = name => JSON.parse(fs.readFileSync(path.join(own, name), 'utf8'))
const require = createRequire(import.meta.url)
const { Resvg } = require(path.join(repo, '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js'))
const input = read('input-freeze.json')
const aliases = read('source-point-bindings.json').aliases
const previousReceipt = read('geometry-pixels.json')
assert.equal(previousReceipt.comparisons.find(result => result.width === 331).differentPixels, 14)
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
try {
  const page = await browser.newPage()
  const geometry = async svg => page.evaluate(svg => {
    const document = new DOMParser().parseFromString(svg, 'image/svg+xml')
    if (document.querySelector('parsererror')) throw new Error('Invalid SVG')
    document.querySelectorAll('[id$="-label-layer"]').forEach(node => node.remove())
    return new XMLSerializer().serializeToString(document.documentElement)
  }, svg)
  const oldSvg = await geometry(fs.readFileSync(path.join(repo, input.oldSvg.path), 'utf8'))
  const currentSvg = await geometry(fs.readFileSync(path.join(own, 'fig-23.svg'), 'utf8'))
  const a = new Resvg(oldSvg, { fitTo: { mode: 'width', value: 331 } }).render()
  const b = new Resvg(currentSvg, { fitTo: { mode: 'width', value: 331 } }).render()
  const previous = a.pixels
  const current = b.pixels
  const differences = []
  const scale = 331 / 640
  for (let index = 0; index < previous.length; index += 4) {
    const before = [...previous.subarray(index, index + 4)]
    const after = [...current.subarray(index, index + 4)]
    if (before.every((value, channel) => value === after[channel])) continue
    const pixelIndex = index / 4
    const x = pixelIndex % b.width
    const y = Math.floor(pixelIndex / b.width)
    const nearbyAliases = aliases.filter(alias => {
      const px = alias.at[0] * scale
      const py = (924 - alias.at[1]) * scale
      const distance = Math.hypot(x + 0.5 - px, y + 0.5 - py)
      return distance <= alias.existingRadius * scale + 1
    }).map(alias => alias.point)
    differences.push({ x, y, before, after, nearbyAliases })
  }
  const receipt = {
    schema: 'd139-mobile-geometry-diagnostic@1',
    cwd: repo,
    priorReceiptSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(own, 'geometry-pixels.json'))).digest('hex'),
    width: b.width,
    height: b.height,
    differentPixels: differences.length,
    differences,
    allDeltasLocalToExistingSourceCenterDisks: differences.every(pixel => pixel.nearbyAliases.length > 0),
    interpretation: 'Exact-raster equality is not claimed at 331px. This diagnostic locates differences relative to inherited opaque source-center disks; it does not waive a native failure or claim independent semantic approval.',
  }
  fs.writeFileSync(path.join(own, 'mobile-geometry-diagnostic.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify(receipt, null, 2))
} finally {
  await browser.close()
}
