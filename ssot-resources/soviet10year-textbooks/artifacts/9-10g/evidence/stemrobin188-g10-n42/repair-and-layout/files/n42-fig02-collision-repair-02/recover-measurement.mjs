import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const out = path.dirname(new URL(import.meta.url).pathname)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const file = path.join(out, 'fig-g10-02.candidate.svg')
const priorFile = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-image-author/fig-g10-02.label-repair.svg')
const priorMeasurement = JSON.parse(fs.readFileSync(path.join(out, 'display-measurements.json')))
const failedCommand = JSON.parse(fs.readFileSync(path.join(out, 'display.command.json')))
assert.equal(failedCommand.exitCode, 1)
const calls = []
function xpath(expression, target = file) {
  const args = ['--xpath', expression, target]
  const result = spawnSync('xmllint', args, { cwd: root, encoding: 'utf8' })
  calls.push({ command: 'xmllint', args, cwd: root, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout.trim()
}
const prefix = 'ld-fig-g10-02_ld-'
const edgeSelector = `//*[@id='${prefix}box-xy-x']`
const markSelector = `//*[@id='${prefix}vector-mark-box-k-label']`
const headSelector = `//*[@data-arrowhead-for='${prefix}vector-mark-box-k-label']`
const attr = (selector, name) => xpath(`string(${selector}/@${name})`)
const transform = attr(headSelector, 'transform')
const arrowheadPath = xpath(`string(${headSelector}/*[local-name()='path']/@d)`)
assert.equal(arrowheadPath, 'M 0,0 L 10,5 L 0,10 z')
const match = transform.match(/^translate\(([-\d.e]+) ([-\d.e]+)\) rotate\(([-\d.e]+)\) scale\(([-\d.e]+)\) translate\(([-\d.e]+) ([-\d.e]+)\)$/)
assert.ok(match)
const [tx, ty, rotation, scale, dx, dy] = match.slice(1).map(Number)
assert.equal(rotation, 0)
const triangle = [[0, 0], [10, 5], [0, 10]].map(([x, y]) => [tx + scale * (x + dx), ty + scale * (y + dy)])
const edge = Object.fromEntries(['x1', 'y1', 'x2', 'y2'].map(name => [name, Number(attr(edgeSelector, name))]))
edge.strokeWidth = parseFloat(attr(edgeSelector, 'stroke-width'))
edge.dashArray = attr(edgeSelector, 'stroke-dasharray')
edge.cap = attr(edgeSelector, 'stroke-linecap')
const shaft = Object.fromEntries(['x1', 'y1', 'x2', 'y2'].map(name => [name, Number(attr(markSelector, name))]))
shaft.strokeWidth = parseFloat(attr(markSelector, 'stroke-width'))
assert.deepEqual(edge, { x1: 165, y1: 217, x2: 405, y2: 217, strokeWidth: 2.5, dashArray: '5,5', cap: 'butt' })
assert.equal(shaft.strokeWidth, 1.2)
assert.equal(shaft.y1, 237)
assert.equal(shaft.y2, 237)
const arrowTop = Math.min(...triangle.map(p => p[1]), shaft.y1 - shaft.strokeWidth / 2)
const edgeBottom = edge.y1 + edge.strokeWidth / 2
const clearance = arrowTop - edgeBottom
assert.ok(Number.isFinite(clearance) && clearance > 15)
const helpers = ['ld-fig-g10-02_jxgBoard1P36', 'ld-fig-g10-02_jxgBoard1P37'].map((id, i) => {
  const selector = `//*[@id='${id}']`
  const current = { x: Number(attr(selector, 'cx')), y: Number(attr(selector, 'cy')), display: attr(selector, 'display') }
  const before = { x: Number(xpath(`string(${selector}/@cx)`, priorFile)), y: Number(xpath(`string(${selector}/@cy)`, priorFile)) }
  assert.equal(current.x, i === 0 ? 319 : 337)
  assert.equal(current.x, before.x)
  assert.equal(current.y - before.y, 16)
  assert.equal(current.display, 'none')
  return { id, before, after: current, purpose: 'Renderer-created hidden literal endpoint of the k notation arrow, not a source vertex.' }
})
assert.deepEqual(priorMeasurement.measurements.unchangedGeometryAndOtherLabelCheck.changed.sort(), [
  `id:${prefix}vector-mark-box-k-label`,
  `head:${prefix}vector-mark-box-k-label`,
  ...helpers.map(item => `id:${item.id}`),
  'label:box-k-label-label',
].sort())
const collision = {
  method: 'Structured XML parsing of actual exported SVG; exact filled-head transform plus shaft envelope clears the entire continuous hidden-edge stroke envelope. Disjoint envelopes prove zero dash/filled-head intersection.',
  arrowheadPath, arrowheadTransform: transform, arrowheadTriangleCanvas: triangle,
  notationShaft: shaft, hiddenEdge: edge,
  arrowFootprintTopCanvas: arrowTop, hiddenEdgeStrokeBottomCanvas: edgeBottom,
  clearanceCanvasPx: clearance, clearanceAt300Px: clearance * 300 / 480,
  positiveFilledIntersection: false, observationStatus: 'author-check-clear-not-independent-review',
}
const stdout = JSON.stringify({ status: 'technical-measurement-recovered', collision, hiddenAnnotationHelpers: helpers })
fs.writeFileSync(path.join(out, 'measurement-recovery.stdout.txt'), `${stdout}\n`, { flag: 'wx' })
fs.writeFileSync(path.join(out, 'measurement-recovery.stderr.txt'), '', { flag: 'wx' })
write('measurement-recovery.command.json', {
  cwd: root, command: process.execPath, args: [new URL(import.meta.url).pathname],
  exitCode: 0, stdout: path.join(out, 'measurement-recovery.stdout.txt'), stderr: path.join(out, 'measurement-recovery.stderr.txt'),
  subprocesses: calls,
  technicalCause: 'Number("2.5px") and Number("1.2px") produced NaN; failed first measurement receipt retained. Also account for the two renderer-owned hidden notation endpoints and exact data-label-id suffix.',
  correction: 'parseFloat for CSS-unit stroke widths and exact XML affine transform; validate existing screenshot/labels and changed-node list without rerender or screenshot.',
  rendererCalls: 0, newScreenshots: 0, contentRevisions: 0,
})
write('display-measurements.recovered.json', {
  ...priorMeasurement,
  originalFailedMeasurement: {
    path: path.join(out, 'display-measurements.json'), sha256: hash(path.join(out, 'display-measurements.json')),
    warning: 'Original collision numeric fields are null due to the parser error and are not valid clearance evidence. Original screenshot, labels and changed-node list remain valid.',
  },
  measurements: {
    ...priorMeasurement.measurements, collision,
    hiddenAnnotationHelpers: helpers,
    unchangedGeometryAndOtherLabelCheck: { ...priorMeasurement.measurements.unchangedGeometryAndOtherLabelCheck, status: 'pass-only-k-annotation-and-its-hidden-endpoints-changed' },
  },
  technicalRecoveryOnly: true, rendererCalls: 0, newScreenshots: 0,
})
console.log(stdout)
