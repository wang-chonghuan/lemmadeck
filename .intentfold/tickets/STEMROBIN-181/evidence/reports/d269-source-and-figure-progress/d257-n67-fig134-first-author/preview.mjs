import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'))
const { Resvg } = require('@resvg/resvg-js')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const svgPath = path.join(out, 'repair-1/fig-134.svg')
const renderPath = path.join(out, 'repair-1/fig-134.render.json')
const report = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
assert.equal(report.status, 'pass')
assert.equal(hash(svgPath), report.output.svg.sha256)
const theme = {
  ink: '#15201f', muted: '#4c5a58', accent: '#15201f',
  'accent-soft': '#8a9795', grid: '#e3eae9', paper: '#ffffff',
}
const input = fs.readFileSync(svgPath, 'utf8')
let replacements = 0
const presentation = input.replace(/var\(--ld-figure-([a-z-]+)(?:,\s*[^)]+)?\)/g, (_, role) => {
  assert(theme[role], `unknown semantic role: ${role}`)
  replacements++
  return theme[role]
})
assert(replacements > 0)
assert(!presentation.includes('var(--ld-figure-'))
const startedUtc = new Date().toISOString()
const outputs = []
for (const width of [342, 640]) {
  const image = new Resvg(presentation, { background: '#ffffff', fitTo: { mode: 'width', value: width } }).render()
  const target = path.join(out, `fig-134.author-${width}.png`)
  fs.writeFileSync(target, image.asPng(), { flag: 'wx' })
  const pixels = image.pixels
  let nonwhite = 0
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] < 245 || pixels[i + 1] < 245 || pixels[i + 2] < 245) nonwhite++
  }
  assert(nonwhite > 1000)
  outputs.push({
    path: target, sha256: hash(target), width: image.width, height: image.height,
    bytes: fs.statSync(target).size, nonwhitePixels: nonwhite,
    pixelCheckScope: 'Author-preview nonblank presentation only, not visual acceptance',
  })
}
const receipt = {
  schema: 'bounded-n67-fig134-author-preview-receipt@1',
  role: 'First-author preview, not independent review or product screenshot acceptance',
  startedUtc, finishedUtc: new Date().toISOString(), exitCode: 0,
  engine: 'Existing @resvg/resvg-js',
  engineVersion: require('@resvg/resvg-js/package.json').version,
  dependencyPath: require.resolve('@resvg/resvg-js'),
  inputSvg: { path: svgPath, sha256: hash(svgPath) },
  nativeRender: { path: renderPath, sha256: hash(renderPath) },
  presentationOnlySemanticCssResolution: theme, cssReplacements: replacements,
  originalSvgEdited: false, screenshotOrBrowserUsedForPreviews: false,
  previewsRasterizedOnceEachAtActualWidths: true, outputs,
}
fs.writeFileSync(path.join(out, 'preview-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(receipt, null, 2))
