import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const owned = path.dirname(fileURLToPath(import.meta.url))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({
  path: path.isAbsolute(file) ? file : path.resolve(file),
  sha256: hash(file), bytes: fs.statSync(file).size,
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
})
const manifestFile = path.join(owned, 'manifest.json')
assert.ok(!fs.existsSync(manifestFile), 'never overwrite an existing seal')
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
const inputRoot = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const textRoot = '.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38'
const inputs = [
  [`${inputRoot}/figures/fig-234.png`, '591754f84242a6e0ba18eef352a6acfd6bc9f2f29cc2b8d0c6526338e40788b3'],
  [`${inputRoot}/figures/fig-235.png`, 'a25712949bf83f2da5a035f26370ca99455bb8918914cc9dc62e89c4e6f97154'],
  [`${textRoot}/lesson.template.json`, '9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b'],
  [`${textRoot}/exercises.template.json`, 'ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60'],
]
for (const [file, expected] of inputs) assert.equal(hash(file), expected, `input drift ${file}`)
const display = JSON.parse(fs.readFileSync(path.join(owned, 'display-check.json')))
assert.equal(display.status, 'pass')
const reports = ['fig-234', 'fig-235'].map((id) => {
  const report = JSON.parse(fs.readFileSync(path.join(owned, `${id}.render.json`)))
  assert.equal(report.status, 'pass')
  assert.equal(report.spec.sha256, hash(path.join(owned, `${id}.spec.json`)))
  assert.equal(report.output.svg.sha256, hash(path.join(owned, `${id}.svg`)))
  assert.ok(report.spec.path.startsWith(`${inputRoot}/editions/modern-us-neutral/figures/`))
  assert.ok(report.output.svg.path.startsWith(`${inputRoot}/editions/modern-us-neutral/figures/`))
  return { id, status: 'AUTHOR_ONLY', approval: 'DEFERRED',
    spec: bind(path.join(owned, `${id}.spec.json`)),
    svg: bind(path.join(owned, `${id}.svg`)),
    render: bind(path.join(owned, `${id}.render.json`)),
    eventualSource: `${inputRoot}/figures/${id}.png`,
    eventualSpec: report.spec.path,
    eventualSvg: report.output.svg.path,
    eventualRender: `${inputRoot}/editions/modern-us-neutral/figures/${id}.render.json`,
    nativeStatus: report.status, displayChecks: report.displayChecks,
  }
})
const attempts = walk(owned).filter((file) => file.endsWith('/execution.json')).map((file) => {
  const execution = JSON.parse(fs.readFileSync(file))
  return { path: file, commands: Array.isArray(execution) ? execution : execution.commands,
    reusedEvidence: Array.isArray(execution) ? [] : execution.reusedEvidence }
})
for (const attempt of attempts) {
  for (const command of attempt.commands) {
    assert.equal(command.cwd, cwd)
    for (const stream of [command.stdout, command.stderr]) assert.equal(hash(stream.path), stream.sha256)
  }
}
const imageFiles = [
  [`${inputRoot}/figures/fig-234.png`, 'original', 'one complete source load'],
  [`${inputRoot}/figures/fig-235.png`, 'original', 'one complete source load'],
  [path.join(owned, 'fig-235/attempt-2/fig-235.native.png'), 'failed-native', 'complete O-collision diagnostic; consumed one reserve'],
  [path.join(owned, 'fig-234.native.png'), 'final-native', 'complete 640x400 author inspection'],
  [path.join(owned, 'fig-235.native.png'), 'final-native', 'complete 640x600 author inspection'],
  [path.join(owned, 'fig-234.w294.png'), 'final-normal', 'complete 294x184 author inspection'],
  [path.join(owned, 'fig-235.w294.png'), 'final-normal', 'complete 294x276 author inspection'],
]
assert.equal(imageFiles.length, 7)
for (const file of walk(owned)) {
  if (file.includes('/attempt-')) fs.chmodSync(file, 0o444)
}
for (const name of ['SOURCE-INVENTORY.md', 'AUTHOR-RECORD.md']) {
  fs.chmodSync(path.join(owned, name), 0o444)
}
const direct = [
  { command: 'pwd', argv: [], exitCode: 0 },
  { command: 'chmod', argv: ['0444', path.join(owned, 'SOURCE-INVENTORY.md')], exitCode: 0 },
  { command: 'node', argv: [path.join(owned, 'build-specs.mjs')], exitCode: 0 },
  { command: 'node', argv: [path.join(owned, 'native-run.mjs'), 'fig-234', 'attempt-1'], exitCode: 1 },
  { command: 'node', argv: [path.join(owned, 'native-run.mjs'), 'fig-235', 'attempt-1'], exitCode: 1 },
  { command: 'node', argv: [path.join(owned, 'build-specs.mjs'), '--rebuild-preserved-revision'], exitCode: 0 },
  { command: 'node', argv: [path.join(owned, 'native-run.mjs'), 'fig-234', 'attempt-2'], exitCode: 0 },
  { command: 'node', argv: [path.join(owned, 'native-run.mjs'), 'fig-235', 'attempt-2'], exitCode: 1 },
  { command: 'node', argv: [path.join(owned, 'build-specs.mjs'), '--rebuild-preserved-revision', 'fig-235'], exitCode: 0 },
  { command: 'node', argv: [path.join(owned, 'native-run.mjs'), 'fig-235', 'attempt-3'], exitCode: 0 },
  { command: 'node', argv: [path.join(owned, 'check-previews.mjs')], exitCode: 0 },
].map((item) => ({ cwd, ...item, observation: 'actual exec tool result, not inferred from file presence' }))
const scripts = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js',
  '.agents/skills/node_modules/playwright-core/package.json',
]
const manifest = {
  schema: 'ld-s10y-image/author-manifest@1',
  ticket: 'STEMROBIN-188', status: 'AUTHOR_ONLY', approval: 'DEFERRED',
  finish: 'review', offline: true, cwd, ownedRoot: owned,
  sealedAt: new Date().toISOString(),
  note: 'No independent PASS review; unknown old glyph code and fine-mark/bar roles remain unresolved. No promotion.',
  inputs: inputs.map(([file]) => bind(file)),
  installedReadOnlyContractsAndTools: scripts.map(bind),
  figures: reports,
  actualRevisions: { 'fig-234': 1, 'fig-235': 2 },
  attempts, directAuthorCommands: direct,
  sealCommand: {
    command: 'node', argv: [path.join(owned, 'seal.mjs')], cwd,
    exitCode: null, note: 'Self-seal exit cannot be recorded before process completion; final tool stdout/exit is authoritative.',
  },
  imageUsage: {
    batches: 1, batchMaximum: 8, contextMaximum: 24, actualContextLoads: 7,
    contextResetOrCompactionClaimed: false, sourceReopens: 0, crops: 0, previewReopens: 0,
    paidCalls: 0, paidCost: 0, completeScreenshotsProduced: 14, acceptedNativeCopies: 2,
    finalFilesNotLoaded: 'Other width PNGs generated and machine-measured only.',
    reserveLoadsPlanned: 2, reserveLoadsUsed: 1, reserveLoadsUnused: 1,
    orderedLoads: imageFiles.map(([file, kind, observation], i) => ({
      index: i + 1, batch: 1, ...bind(file), kind, observation, tool: 'functions.view_image',
    })),
  },
  files: walk(owned).sort().map(bind),
}
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o444 })
assert.equal(fs.statSync(manifestFile).mode & 0o777, 0o444)
assert.equal(fs.statSync(path.join(owned, 'AUTHOR-RECORD.md')).mode & 0o777, 0o444)
console.log(JSON.stringify({
  status: 'AUTHOR_ONLY', independentApproval: 'DEFERRED', promoted: false,
  manifest: bind(manifestFile), authorRecord: bind(path.join(owned, 'AUTHOR-RECORD.md')),
  sourceInventory: bind(path.join(owned, 'SOURCE-INVENTORY.md')),
  actualContextImageLoads: 7, nativeRenderStatus: reports.map((item) => [item.id, item.nativeStatus]),
}, null, 2))
