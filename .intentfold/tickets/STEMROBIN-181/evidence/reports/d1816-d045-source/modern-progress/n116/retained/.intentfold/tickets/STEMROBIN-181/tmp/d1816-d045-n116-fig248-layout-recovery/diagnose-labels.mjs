import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), W)
const output = '.tmp/STEMROBIN-181/d1816-d045/n116-fig248-layout-recovery'
const evidence = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-fig248-layout-recovery'
const require = createRequire(path.resolve('.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/render_spec.mjs'))
const { chromium } = require('playwright-core')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 600 } })
  await page.setContent(fs.readFileSync(`${output}/fig-248.svg`, 'utf8'))
  const labels = await page.locator('[data-label-id]').evaluateAll(nodes => nodes.map(node => {
    const box = node.getBBox()
    return { id: node.dataset.labelId, box: { x: box.x, y: box.y, width: box.width, height: box.height } }
  }))
  const spec = JSON.parse(fs.readFileSync(`${output}/spec.json`, 'utf8'))
  const points = spec.objects.filter(object => object.type === 'point' && object.at[0] < 250 && object.at[1] < 310 && object.at[1] > 180)
    .map(object => ({ id: object.id, screen: [object.at[0], 600 - object.at[1]], size: object.size }))
  const receipt = {
    schema: 'STEMROBIN-181/figure-label-clearance-diagnostic@1',
    workdir: W,
    role: 'Author DOM measurement only; not independent review',
    actualImagesOpened: 0,
    screenshots: 0,
    geometryChanged: false,
    labels,
    points,
    previousDiagnostic: {
      command: 'Inline local browser read of existing SVG getBBox using JSON.stringify',
      result: 'Empty serialized SVGRect objects; nearby point coordinates still available',
      nativeValidatorOrRendererAttempt: false,
      imageOpens: 0,
      serializationRecovery: 'Read SVGRect x/y/width/height explicitly in this script',
    },
  }
  fs.writeFileSync(`${evidence}/label-clearance-diagnostic.json`, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify(receipt, null, 2))
} finally {
  await browser.close()
}
