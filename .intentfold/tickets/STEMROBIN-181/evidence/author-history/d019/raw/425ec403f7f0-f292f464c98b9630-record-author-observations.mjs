import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const work = '.tmp/STEMROBIN-181/9p-d019-n68-figures'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const descriptions = {
  'fig-115': [
    'Central plus charge and all eight near/far outward vector pairs are visible; repaired far arrows have visible shafts. No calibrated values or field-line connections are introduced.',
    'At331 the plus sign, eight bearings and sixteen separated arrowheads remain visible; no edge clipping.',
    'At342 the plus sign and all separate shorter farther arrows remain distinguishable; native collision remains unresolved despite visible glyph.',
  ],
  'fig-116': [
    'One continuous curved line, two filled points and two rightward tangent vectors; E-vector overhead marks and subscripts1/2 render. The left arrow slopes down-right and right arrow slopes up-right.',
    'At331 both observation points, tangent-arrow directions and E1/E2 indices are readable and separated from the curve; full curve ends visible.',
    'At342 both vector marks/indices remain readable, with no construction-tip dots or crop loss.',
  ],
  'fig-117': [
    'Plus sphere and all twelve continuous radial rays are visible, with outward arrows on every ray; no extra labels or measurements.',
    'At331 twelve outward rays remain separate and the central plus is readable; all outer ends retain margins.',
    'At342 all twelve arrowheads and positive sign remain present; native symbol collision still blocks author readiness.',
  ],
  'fig-118': [
    'Positive left/negative right spheres; five connecting lines point left-to-right, including straight center line and two upper/two lower curves. All six exterior branches point away from plus or toward minus.',
    'At331 all five connecting curves and three branches at each exterior side remain separate; plus/minus signs visible; no source-frame cutoff.',
    'At342 five connections, six exterior branches and their signed directions remain visible; no visible construction anchors.',
  ],
  'fig-119': [
    'Two positive spheres and fifteen outward traces per source are present. Inner upper/lower fans deflect away from the central gap; no connecting line or null-point answer label is visible.',
    'At331 all upper/lower fans remain separate, both plus signs readable, and the gap contains no false connecting field line.',
    'At342 both fifteen-trace fans retain outward arrowheads and canvas margins; native sign collisions remain unresolved.',
  ],
  'fig-120': [
    'Parallel left-positive/right-negative plates; twelve straight central lines and two inner/two outer curved fringing lines are visible, all directed left-to-right. Two pairs of charge signs are present; no dimensions or solutions.',
    'At331 both plates, all twelve central arrows, upper/lower fringing curves and both sign pairs are visible. Outer curves retain margins and do not form directed closed field loops.',
    'At342 central spacing/parallelism, plate signs and four fringing arrowheads remain visible; no label overlap or missing component observed.',
  ],
}
const figures = Object.entries(descriptions).map(([id, descriptions]) => {
  const dir = `${work}/${id}/repair-1`
  const render = JSON.parse(fs.readFileSync(`${dir}/render.json`, 'utf8'))
  const paths = [`${dir}/${id}.png`, ...[640, 331, 342].map(width => `${dir}/width-${width}.png`)]
  return {
    id, repairsUsed: 1, maximumTargetedRepairs: 1,
    role: 'author-one-round-pixel-observations-not-independent-review',
    images: paths.map((file, i) => ({
      path: file, sha256: sha(file), actualOpened: true, detail: 'original',
      observation: descriptions[i < 2 ? 0 : i - 1],
    })),
    defects: render.status === 'pass' ? [] : render.collisions.map(collision => ({
      kind: 'native-unresolved-label-stroke-collision',
      location: collision.id, text: collision.text, score: collision.score,
      renderPath: `${dir}/render.json`, renderSHA256: sha(`${dir}/render.json`),
      status: 'blocked-repair-budget-exhausted',
      limit: 'Actual glyphs are visible; that observation does not override failed native collision checks. No further author repair or rerender.',
    })),
  }
})
const out = `${work}/author-observations.json`
assert(!fs.existsSync(out))
fs.writeFileSync(out, `${JSON.stringify({
  role: 'figure-author-only', originalPNGsOpened: 6, finalFullOutputsOpened: 6, finalWidthPreviewsOpened: 18,
  detail: 'original', figures, independentApproval: false, nativeStandardsRelaxed: false,
  initialPixelInspection: 'Only fig115 initial full PNG additionally opened to assess the first collision/short-arrow finding; all initial files retained.',
}, null, 2)}\n`)
console.log(JSON.stringify({ path: out, sha256: sha(out) }, null, 2))
