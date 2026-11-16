import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import '../../native-font-previews.mjs'

const dir = '.tmp/STEMROBIN-181/9p-d019-n70-figures/fig-127/repair-1'
const renderer = path.resolve('.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const { chromium } = createRequire(renderer)('playwright-core')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const svgPath = `${dir}/fig-127.svg`
const reportPath = `${dir}/render.json`
const svgHash = sha(svgPath)
const reportHash = sha(reportPath)
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
assert.equal(report.output.svg.sha256, svgHash)
assert.equal(report.status, 'fail')
assert(!fs.existsSync(`${dir}/fig-127.png`))
assert(!fs.existsSync(`${dir}/width-previews.json`))
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 560 } })
  await page.setContent(`<!doctype html><style>
    :root {
      --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
      --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
      --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff;
    }
    html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#ffffff}
    svg{display:block}
  </style>${fs.readFileSync(svgPath, 'utf8')}`)
  await page.screenshot({ path: path.resolve(`${dir}/fig-127.png`), type: 'png', animations: 'disabled' })
} finally {
  await browser.close()
}
assert.equal(sha(svgPath), svgHash)
assert.equal(sha(reportPath), reportHash)
const trace = `${dir}/capture-only-trace.json`
assert(!fs.existsSync(trace))
fs.writeFileSync(trace, `${JSON.stringify({
  role: 'capture-only-existing-native-svg-not-another-geometry-render',
  reason: 'The sole repair renderer command omitted the optional --png argument. Capture the exact serialized SVG using the inherited native font bridge, without executing JSXGraph, changing any geometry or reevaluating native validation.',
  nativeRepairRenderInvocations: 1, geometryRerenderInvocations: 0,
  captureOnlySessions: 1, nativeStatusUnchanged: 'fail',
  svg: { path: svgPath, sha256: svgHash },
  render: { path: reportPath, sha256: reportHash },
  inheritedFontBridge: {
    path: '.tmp/STEMROBIN-181/9p-d019-n70-figures/native-font-previews.mjs',
    sha256: sha('.tmp/STEMROBIN-181/9p-d019-n70-figures/native-font-previews.mjs'),
  },
  script: { path: `${dir}/capture-existing-svg.mjs`, sha256: sha(`${dir}/capture-existing-svg.mjs`) },
  previewManifest: { path: `${dir}/width-previews.json`, sha256: sha(`${dir}/width-previews.json`) },
  outputPNG: { path: `${dir}/fig-127.png`, sha256: sha(`${dir}/fig-127.png`) },
  networkRequestsBlocked: true, independentApproval: false, inFlightProcesses: [],
}, null, 2)}\n`)
console.log(JSON.stringify({ trace, nativeStatus: 'fail', svgUnchanged: true, reportUnchanged: true, widths: [640, 331, 342] }, null, 2))
