import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const font = fs.readFileSync('.claude/skills/ld-s10y-lesson/node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2').toString('base64')
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const out = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/vector-font-recovery')
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 240 } })
  await page.setContent(`<style>
    @font-face{font-family:AccentOnly;src:url(data:font/woff2;base64,${font});unicode-range:U+20D7}
    @font-face{font-family:FullMath;src:url(data:font/woff2;base64,${font})}
    body{margin:0}text{font-size:42px;dominant-baseline:middle}
    </style>
    <svg width="1000" height="240">
      <text id="old" x="80" y="100" font-family="Arial, AccentOnly" font-weight="500">i\u20d7</text>
      <text id="first-range" x="280" y="100" font-family="AccentOnly, Arial" font-weight="500">i\u20d7</text>
      <text id="full" x="480" y="100" font-family="FullMath, Arial" font-weight="500">i\u20d7</text>
      <text id="split" x="680" y="100" font-family="Arial" font-weight="500">i<tspan font-family="FullMath" font-weight="400">\u20d7</tspan></text>
    </svg>`)
  await page.evaluate(async () => {
    await document.fonts.load('42px FullMath', 'i\u20d7')
    await document.fonts.load('42px AccentOnly', '\u20d7')
    await document.fonts.ready
  })
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  const { root: document } = await cdp.send('DOM.getDocument')
  const result = []
  for (const id of ['old', 'first-range', 'full', 'split']) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: document.nodeId, selector: `#${id}` })
    const fontResult = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    const bbox = await page.locator(`#${id}`).evaluate(node => {
      const { x, y, width, height } = node.getBBox()
      return { x, y, width, height }
    })
    result.push({ id, bbox, fonts: fontResult.fonts })
  }
  fs.writeFileSync(path.join(out, 'font-selection.json'), JSON.stringify(result, null, 2))
  await page.screenshot({ path: path.join(out, 'font-selection.png') })
  console.log(JSON.stringify(result))
} finally {
  await browser.close()
}
