import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const scratch = process.argv[2]
assert.ok(scratch, 'Pass a ticket scratch directory')
fs.mkdirSync(scratch, { recursive: true })
const root = fs.mkdtempSync(path.join(path.resolve(scratch), 'zero-width-'))
const cases = [
  { name: 'paper-zero-border', crossed: false, status: 'pass', exit: 0 },
  { name: 'ink-through-label', crossed: true, status: 'fail', exit: 2 },
]
for (const item of cases) {
  const objects = [
    { id: 'paper-clearance', type: 'polygon',
      points: [[5, 5.6], [11, 5.6], [11, 4.4], [5, 4.4]],
      stroke: 'paper', strokeWidth: 0, fill: 'paper', fillOpacity: 1 },
    { id: 'label', type: 'text', at: [8, 5], text: 'P', fontSize: 40,
      labelPlacement: { position: 'CENTER' } },
  ]
  if (item.crossed) objects.push({
    id: 'real-obstacle', type: 'segment', from: [6, 5], to: [10, 5],
    stroke: 'ink', strokeWidth: 3,
  })
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2',
    id: `fig-choice-${item.name}`,
    mode: 'deterministic',
    description: 'A label on a zero-border paper clearance; a real ink crossing must still fail.',
    source: {
      authoredBasis: 'Synthetic render-contract fixture. The paper rectangle has no border. The negative case places a 3px ink segment through P.',
      authoritativeText: [{ text: 'P is a visible label. Its paper background has zero-width borders.' }],
      inventory: [{ id: 'clearance-contract', description: 'Complete fixture objects.',
        objects: objects.map((object) => object.id), assertions: ['one-label'] }],
    },
    canvas: { width: 320, height: 320, boundingBox: [0, 10, 16, 0],
      background: 'paper' },
    display: { layout: 'inline', purpose: 'instructional', minTextPx: 16,
      widths: [320] },
    objects,
    assertions: [{ id: 'one-label', type: 'objectCount',
      objectType: 'text', count: 1 }],
  }
  const specPath = path.join(root, `${item.name}.spec.json`)
  const reportPath = path.join(root, `${item.name}.render.json`)
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2) + '\n')
  const result = spawnSync(process.execPath, [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', specPath, '--svg', path.join(root, `${item.name}.svg`),
    '--report', reportPath,
  ], { encoding: 'utf8', timeout: 120000 })
  assert.equal(result.error, undefined, result.error?.message)
  assert.equal(result.status, item.exit, result.stderr || result.stdout)
  const report = JSON.parse(fs.readFileSync(reportPath))
  assert.equal(report.status, item.status)
  if (item.crossed) {
    assert.equal(report.collisions.length, 1)
    assert.equal(report.collisions[0].text, 'P')
  } else {
    assert.deepEqual(report.collisions, [])
  }
}
console.log(`PASS: zero-width clearance and real-ink collision; evidence ${root}`)
