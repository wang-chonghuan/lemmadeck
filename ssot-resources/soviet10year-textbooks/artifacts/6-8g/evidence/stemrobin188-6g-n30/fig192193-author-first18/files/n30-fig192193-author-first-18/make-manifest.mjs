import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
if (process.cwd() !== W) throw new Error('Wrong cwd')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'), bytes: fs.statSync(p).size })
const observations = read(path.join(root, 'observations.json'))
const bindings = read(path.join(root, 'input-bindings.json'))
const receipts = fs.readdirSync(path.join(root, 'executions')).filter(n => n !== 'manifest-01').sort().map(n => {
  const p = path.join(root, 'executions', n, 'execution.json')
  const r = read(p)
  assert.equal(r.cwd, W)
  for (const stream of Object.values(r.streams)) assert.equal(bind(stream.path).sha256, stream.sha256)
  for (const s of r.snapshots) assert.equal(bind(s.path).sha256, s.sha256)
  return { name: n, ...bind(p), exitCode: r.exitCode, signal: r.signal, streams: r.streams, snapshots: r.snapshots,
    ...(fs.existsSync(path.join(path.dirname(p), 'spec-input.json')) ? { specSnapshot: bind(path.join(path.dirname(p), 'spec-input.json')) } : {}) }
})
assert.equal(receipts.filter(r => r.exitCode !== 0).length, observations.counters.contentGateFailedExecutions)
assert.equal(receipts.length, 15)
const figures = ['fig-192', 'fig-193'].map(id => {
  const d = path.join(root, id)
  const specPath = path.join(d, 'spec.json'), spec = read(specPath)
  const reportPath = path.join(d, 'render.json'), report = read(reportPath)
  assert.equal(report.status, 'pass')
  assert.equal(bind(specPath).sha256, report.spec.sha256)
  assert.equal(bind(path.join(d, `${id}.svg`)).sha256, report.output.svg.sha256)
  const png = fs.readFileSync(spec.source.image.path)
  return {
    id,
    status: 'DRAFT_RENDERED_AWAITING_INDEPENDENT_REVIEW',
    mode: spec.mode,
    source: { ...bind(spec.source.image.path), width: png.readUInt32BE(16), height: png.readUInt32BE(20) },
    spec: bind(specPath),
    svg: bind(path.join(d, `${id}.svg`)),
    render: bind(reportPath),
    preview: bind(path.join(d, 'preview.png')),
    display: spec.display,
    canvas: spec.canvas,
    inventoryGroups: spec.source.inventory.map(g => ({ id: g.id, objects: g.objects.length, assertions: g.assertions.length, requires: g.requires })),
    pointCount: spec.objects.filter(o => o.type === 'point').length,
    objects: spec.objects.length,
    assertions: spec.assertions.length,
    labels: report.labels,
    actualRenderStatus: report.status,
    displayChecks: report.displayChecks,
    independentReview: 'PENDING_NOT_AUTHORED',
    promotion: 'NOT_AUTHORIZED'
  }
})
const draftCheckPath = path.join(root, 'draft-check/report.json')
assert.equal(read(draftCheckPath).status, 'pass')
for (const b of [bindings.lesson, ...bindings.sources, bindings.context, bindings.pixelInventory, bindings.authorScript]) assert.equal(bind(b.path).sha256, b.sha256)
const manifest = {
  schema: 'same188/offline-image-author-batch@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6',
  status: 'AUTHOR_COMPLETE_AWAITING_INDEPENDENT_REVIEW',
  workdir: W,
  ownedRoot: root,
  scope: ['fig-192', 'fig-193'],
  inputBindings: bindings,
  figures,
  observations: bind(path.join(root, 'observations.json')),
  counters: observations.counters,
  unknowns: observations.unknowns,
  revisionEvents: observations.revisionEvents,
  technicalDiagnostic: bind(path.join(root, 'preflight-diagnostic.json')),
  executions: receipts,
  draftCheck: { ...bind(draftCheckPath), status: 'pass', scope: 'Standalone draft only; no running-product or edition acceptance', screenshots: read(draftCheckPath).checks.filter(c => c.screenshot).map(c => c.screenshot) },
  scripts: ['author.mjs', 'execute.mjs', 'check-draft.mjs', 'make-manifest.mjs'].map(n => bind(path.join(root, n))),
  installedPipeline: ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json'].map(n => bind(path.join(W, n))),
  reviewBoundary: 'Machine statuses are actual validator/render/check results, NOT source-fidelity approval. No record_review.py calls or review@1 files. UNKNOWN source facts require reviewer disposition.',
  excluded: 'C/c on fig-190/fig-191 untouched and not approved. No canonical promotion, DB, git, app, environment, dependency, Charter, paid/model/network operations or agents.',
  currentManifestExecutionReceipt: path.join(root, 'executions/manifest-01/execution.json')
}
const p = path.join(root, 'manifest.json')
fs.writeFileSync(p, JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify({ status: manifest.status, manifest: bind(p), svgHashes: figures.map(f => ({ id: f.id, sha256: f.svg.sha256 })), counters: manifest.counters }, null, 2))
