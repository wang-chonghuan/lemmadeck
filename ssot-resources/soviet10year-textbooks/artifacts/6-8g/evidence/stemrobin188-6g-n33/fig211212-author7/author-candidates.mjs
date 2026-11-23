import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
if (process.cwd() !== root) throw new Error('Wrong working directory')
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-fig211212-author7')
const input = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-text-author7/lesson.template.json')
const sourceDir = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n33/preparation7/artifacts/6-8g/figures'
const lesson = JSON.parse(fs.readFileSync(input, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const relevantText = (ref) => lesson.prose
  .filter((entry) => entry.kind === 'p' && entry.source_refs?.includes(ref))
  .map((entry) => ({ lesson: lesson.id, text: entry.text }))
const source = (id, ref, inventory) => ({
  image: { path: `${sourceDir}/${id}.png`, sha256: hash(path.join(root, sourceDir, `${id}.png`)) },
  authoritativeText: relevantText(ref),
  inventory,
})
const display = { purpose: 'instructional', layout: 'inline', widths: [640, 358, 352], minTextPx: 16 }
const segment = (id, from, to, strokeWidth = 3.5) => ({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth })
const text = (id, at, label) => ({
  id, type: 'text', at, text: label, fontSize: 32, fontWeight: 600,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', offset: [0, 0] },
})
const onLine = (id, point, a, b) => ({ id, type: 'pointOnLine', point, a, b })
const onCircle = (id, point, center, radius) => ({ id, type: 'pointOnCircle', point, center, radius })
const perpendicular = (id, a, b, c, d) => ({ id, type: 'perpendicular', a, b, c, d })
const count = (id, objectType, number) => ({ id, type: 'objectCount', objectType, count: number })

// Coordinates regularize only the finite source sketch, not global geodesics.
const p = [320, 218]
const bStart = [24, 254]
const bEnd = [576, 218 - (576 - 320) * 36 / 296]
const cStart = [28, 184]
const cEnd = [608, 218 + (608 - 320) * 34 / 292]
const aStart = [48, 32]
const aEnd = [584, 32]
const spec211 = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-211', mode: 'deterministic',
  description: 'Conceptual non-Euclidean hypothesis: two distinct abstract geodesics b,c through P do not meet a. Preserve only the source-visible finite planar incidences: b and c cross at P above a. This finite sketch is not a Euclidean parallelism proof; no assertion extends its carriers to global Euclidean lines. Smooth finite segments and Latin glyphs are modern regularization. Exact source glyph/script and line-dash convention remain UNKNOWN.',
  source: source('fig-211', 'p0156#8', [
    { id: 'src211-finite-traces', description: 'One sketch has three finite plain-ended traces a,b,c, with a below the two crossing traces. No arrows, grid, values or equality marks. Modern addition: smoothed segments; horizontal a; no global Euclidean extension.', objects: ['src211-a-trace', 'src211-b-trace', 'src211-c-trace', 'src211-a-label', 'src211-b-label', 'src211-c-label'], assertions: ['src211-trace-count', 'src211-a-horizontal'] },
    { id: 'src211-named-crossing', description: 'Only named point P is a dark crossing of b and c above a. Their finite portions miss a. Exact printed script UNKNOWN; modern Latin P is provisional typography. No multiple-point source group exists: unnamed endpoints are literals.', objects: ['src211-P', 'src211-b-trace', 'src211-c-trace', 'src211-a-trace'], assertions: ['src211-P-on-b', 'src211-P-on-c', 'src211-named-point-count'] },
  ]),
  canvas: { width: 640, height: 320, boundingBox: [0, 320, 640, 0], background: 'paper' },
  display,
  objects: [
    segment('src211-a-trace', aStart, aEnd),
    segment('src211-b-trace', bStart, bEnd),
    segment('src211-c-trace', cStart, cEnd),
    { id: 'src211-P', type: 'point', at: p, label: 'P', size: 2.5, strokeWidth: 1, stroke: 'ink', fill: 'ink', fontSize: 32, labelPlacement: { position: 'NE', offset: [8, -10] } },
    text('src211-a-label', [60, 65], 'a'),
    text('src211-b-label', [34, 283], 'b'),
    text('src211-c-label', [34, 215], 'c'),
  ],
  assertions: [
    onLine('src211-P-on-b', 'src211-P', bStart, bEnd),
    onLine('src211-P-on-c', 'src211-P', cStart, cEnd),
    onLine('src211-a-horizontal', [320, 32], aStart, aEnd),
    count('src211-trace-count', 'segment', 3),
    count('src211-named-point-count', 'point', 1),
  ],
}

// The arcs are illustrative carriers, not a source-specified metric/model.
const baselineY = 1.5
const leftCenter = [12.8, baselineY]
const rightCenter = [-3.6, baselineY]
const leftRadius = 10
const rightRadius = 11
const leftFoot = [2.8, baselineY]
const rightFoot = [7.4, baselineY]
const kX = (leftCenter[0] ** 2 - rightCenter[0] ** 2 - leftRadius ** 2 + rightRadius ** 2) /
  (2 * (leftCenter[0] - rightCenter[0]))
const k = [kX, baselineY + Math.sqrt(leftRadius ** 2 - (kX - leftCenter[0]) ** 2)]
const leftX = (y) => leftCenter[0] - Math.sqrt(leftRadius ** 2 - (y - baselineY) ** 2)
const rightX = (y) => rightCenter[0] + Math.sqrt(rightRadius ** 2 - (y - baselineY) ** 2)
const leftTop = [6.1, baselineY + Math.sqrt(leftRadius ** 2 - (6.1 - leftCenter[0]) ** 2)]
const rightTop = [4.3, baselineY + Math.sqrt(rightRadius ** 2 - (4.3 - rightCenter[0]) ** 2)]
const leftBottom = [leftX(0.95), 0.95]
const rightBottom = [rightX(0.65), 0.65]
const baseStart = [0.8, baselineY]
const baseEnd = [10.1, baselineY]
const markerTopY = 2.05
const arc = (id, center, start, end) => ({ id, type: 'arc', center, start, end, stroke: 'ink', strokeWidth: 3.5 })
const spec212 = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-212', mode: 'deterministic',
  description: 'Conceptual non-Euclidean illustration: two curved geodesic traces perpendicular to a common baseline at distinct feet meet at K and continue past it. Preserve curved traces, upper continuations, unequal lower tails, an unlabelled baseline and both inward right-angle corners. Modern regularization uses smooth circular arcs with hidden construction centers and unequal radii; these are drawing parameters, not source givens, equalities, or geodesics of an asserted model/metric. The perpendicular assertions test display tangents at the feet, not straight Euclidean chords. Exact source K-like glyph/script and line-dash convention remain UNKNOWN; Latin K is provisional modern typography.',
  source: source('fig-212', 'p0157#4', [
    { id: 'src212-curved-crossing', description: 'Two inward-curving traces cross near a K-like glyph and continue into two upper tips. There is no separate established dot, no other named point, no foot label. Exact K glyph/script UNKNOWN; modern label K is provisional. Carrier-circle membership is modern executable regularization, not a source circle claim.', objects: ['src212-left-geodesic-trace', 'src212-right-geodesic-trace', 'src212-K'], assertions: ['src212-K-on-left-carrier', 'src212-K-on-right-carrier', 'src212-two-curved-traces', 'src212-named-point-count'] },
    { id: 'src212-baseline-and-feet', description: 'One plain-ended unlabelled baseline crosses the traces at two distinct unlabelled feet. Each trace continues below the baseline, the right tail farther. Circular-arc foot membership and vertical display tangents are modern regularization, not a source metric.', objects: ['src212-baseline', 'src212-left-geodesic-trace', 'src212-right-geodesic-trace'], assertions: ['src212-left-foot-on-baseline', 'src212-right-foot-on-baseline', 'src212-left-foot-on-carrier', 'src212-right-foot-on-carrier', 'src212-left-tangent-perpendicular', 'src212-right-tangent-perpendicular', 'src212-left-upper-end-on-carrier', 'src212-left-lower-end-on-carrier', 'src212-right-upper-end-on-carrier', 'src212-right-lower-end-on-carrier'] },
    { id: 'src212-two-rightangle-corners', description: 'One inward right-angle corner at each distinct foot: left frame opens right, right frame opens left. Modern cleaned corner sizes are not source measurements or equality statements. No extra glyphs, center dots, values or radii are shown.', objects: ['src212-left-rightangle-top', 'src212-left-rightangle-side', 'src212-right-rightangle-top', 'src212-right-rightangle-side'], assertions: ['src212-left-corner-perpendicular', 'src212-right-corner-perpendicular', 'src212-finite-segment-count'] },
  ]),
  canvas: { width: 640, height: 640, boundingBox: [0, 11, 11, 0], background: 'paper' },
  display,
  objects: [
    segment('src212-baseline', baseStart, baseEnd),
    arc('src212-left-geodesic-trace', leftCenter, leftTop, leftBottom),
    arc('src212-right-geodesic-trace', rightCenter, rightBottom, rightTop),
    segment('src212-left-rightangle-top', [leftX(markerTopY), markerTopY], [3.35, markerTopY], 2.5),
    segment('src212-left-rightangle-side', [3.35, baselineY], [3.35, markerTopY], 2.5),
    segment('src212-right-rightangle-top', [6.85, markerTopY], [rightX(markerTopY), markerTopY], 2.5),
    segment('src212-right-rightangle-side', [6.85, baselineY], [6.85, markerTopY], 2.5),
    { id: 'src212-K', type: 'point', at: k, visible: false, label: 'K', fontSize: 32, labelPlacement: { position: 'E', offset: [15, 0] } },
  ],
  assertions: [
    onCircle('src212-K-on-left-carrier', 'src212-K', leftCenter, leftRadius),
    onCircle('src212-K-on-right-carrier', 'src212-K', rightCenter, rightRadius),
    onLine('src212-left-foot-on-baseline', leftFoot, baseStart, baseEnd),
    onLine('src212-right-foot-on-baseline', rightFoot, baseStart, baseEnd),
    onCircle('src212-left-foot-on-carrier', leftFoot, leftCenter, leftRadius),
    onCircle('src212-right-foot-on-carrier', rightFoot, rightCenter, rightRadius),
    perpendicular('src212-left-tangent-perpendicular', leftFoot, [leftFoot[0], 2.5], baseStart, baseEnd),
    perpendicular('src212-right-tangent-perpendicular', rightFoot, [rightFoot[0], 2.5], baseStart, baseEnd),
    onCircle('src212-left-upper-end-on-carrier', leftTop, leftCenter, leftRadius),
    onCircle('src212-left-lower-end-on-carrier', leftBottom, leftCenter, leftRadius),
    onCircle('src212-right-upper-end-on-carrier', rightTop, rightCenter, rightRadius),
    onCircle('src212-right-lower-end-on-carrier', rightBottom, rightCenter, rightRadius),
    perpendicular('src212-left-corner-perpendicular', [leftX(markerTopY), markerTopY], [3.35, markerTopY], [3.35, baselineY], [3.35, markerTopY]),
    perpendicular('src212-right-corner-perpendicular', [6.85, markerTopY], [rightX(markerTopY), markerTopY], [6.85, baselineY], [6.85, markerTopY]),
    count('src212-two-curved-traces', 'arc', 2),
    count('src212-finite-segment-count', 'segment', 5),
    count('src212-named-point-count', 'point', 1),
  ],
}

const execution = {
  role: 'author-only', cwd: root,
  input: { path: input, sha256: hash(input), authority: 'source-derived provisional geometry; text unchanged' },
  inventory: { path: path.join(owned, 'source-inventory.md'), sha256: hash(path.join(owned, 'source-inventory.md')) },
  figures: [],
}
for (const spec of [spec211, spec212]) {
  const candidate = path.join(owned, spec.id, 'candidate-1')
  fs.mkdirSync(candidate, { recursive: true })
  const specPath = path.join(candidate, 'spec.json')
  const svgPath = path.join(candidate, `${spec.id}.svg`)
  const reportPath = path.join(candidate, 'render.json')
  save(specPath, spec)
  const argv = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specPath, '--svg', svgPath, '--report', reportPath]
  const result = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8' })
  execution.figures.push({
    figure: spec.id, candidate: 1, executable: process.execPath, argv,
    exitCode: result.status, signal: result.signal, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null,
    files: [specPath, svgPath, reportPath].filter(fs.existsSync).map((file) => ({ path: file, sha256: hash(file) })),
  })
  console.log(`${spec.id}: render exit ${result.status}; ${result.stdout.trim() || result.stderr.trim()}`)
}
save(path.join(owned, 'author-run.json'), execution)
if (execution.figures.some((item) => item.exitCode !== 0)) process.exitCode = 1
