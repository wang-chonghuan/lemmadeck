import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { owned, repo, sha, write } from './audit.mjs'

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const file = p => ({ path: p, sha256: sha(p) })
const scope = read(path.join(owned, 'scope.json'))
const ledger = fs.readFileSync(path.join(owned, 'actual-image-ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
assert.equal(ledger.length, 8)
for (const load of ledger) assert.equal(sha(load.path), load.sha256)
const commands = fs.readdirSync(path.join(owned, 'commands')).sort().map(name => ({
  receipt: file(path.join(owned, 'commands', name)),
  ...read(path.join(owned, 'commands', name))
}))
const sourceChecks = read(path.join(owned, 'repaired-source-checks.json'))
const media = read(path.join(owned, 'repaired-300-08-09.checks.json'))
const figures = ['08', '09'].map(number => {
  const id = `fig-g10-${number}`
  const base = path.join(owned, id)
  const snapshot = stage => {
    const folder = path.join(base, stage)
    const render = read(path.join(folder, 'render.json'))
    const spec = read(path.join(folder, 'spec.json'))
    assert.equal(render.spec.sha256, sha(path.join(folder, 'spec.json')))
    assert.equal(render.output.svg.sha256, sha(path.join(folder, 'figure.svg')))
    return {
      spec: file(path.join(folder, 'spec.json')),
      svg: file(path.join(folder, 'figure.svg')),
      png480: file(path.join(folder, 'figure480.png')),
      render: file(path.join(folder, 'render.json')),
      renderStatus: render.status, renderCollisions: render.collisions, displayChecks: render.displayChecks,
      source: spec.source.image
    }
  }
  const first = snapshot('first')
  const repaired = snapshot('repaired')
  const source = read(path.join(base, 'source-inventory.json'))
  const repair = read(path.join(base, 'repair.json'))
  const sourceCheck = sourceChecks.results.find(result => result.figure === id)
  const figureCommands = commands.filter(command => command.command.some(arg => arg.includes(`/${id}/`)))
  const validators = figureCommands.filter(command => command.command.includes('.agents/skills/ld-s10y-image/scripts/validate_spec.py'))
  const renders = figureCommands.filter(command => command.command.includes('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))
  const visual = {
    authorObservationOnly: true, independentlyReviewed: false,
    widthsInspected: [480, 300], status: 'pass',
    nonblank: true, sourceCompared: true,
    labelContact: false, clippedGeometry: false, numericalCoordinateAnnotations: false,
    observed: number === '08'
      ? 'O-A-B-M order, basis directions, symbolic x/y/z and OM head preserved. AB is visibly dashed; BM and OM interruptions remain. A label is now clear of the continuing x ray.'
      : 'OA and OB point outward from O; AB points from A toward B. Positive rays, dashed negative continuations and detached below-A fragment remain. No projection completion or numerical annotation added.',
    firstFailure: number === '08'
      ? 'First renderer failed A-label collision (score 10003.984375). Both first 300px figures showed dash pattern too short relative to source.'
      : 'First renderer passed. First 300px author inspection held the too-short dashed pattern, which read as dots.',
    final480ImageLoad: ledger.find(load => load.purpose === `repaired480-${number}`),
    final300ImageLoad: ledger.find(load => load.purpose === 'repaired300-composition')
  }
  const pass = repaired.renderStatus === 'pass' && sourceCheck.status === 'pass' &&
    validators.every(command => command.exit === 0) && media.status === 'pass' && visual.status === 'pass'
  assert.equal(repair.contentRepairsUsed, 1)
  return {
    figure: id, candidate: pass ? 'PASS' : 'HOLD',
    authorOnly: true, approval: 'NOT GRANTED; independent review and promotion excluded',
    source: file(source.source.path), sourceInventory: file(path.join(base, 'source-inventory.json')),
    inventory: source.inventory, modernAdditions: source.modernAdditions,
    context: file(path.join(base, 'context.json')),
    originalFirstSnapshot: first, repairedSnapshot: repaired, final: repaired,
    validatorCommands: validators, rendererCommands: renders,
    sourceExecutableAssertions: sourceCheck,
    sourceChecksEvidence: file(path.join(owned, 'repaired-source-checks.json')),
    visual, repairCounters: { contentUsed: 1, contentLimit: 1, contentRemaining: 0,
      technicalRendererRetries: number === '09' ? 1 : 0 },
    repairReceipt: file(path.join(base, 'repair.json')), repair,
    retainedFailureDiagnostics: {
      firstRender: first.render,
      firstSourceChecks: file(path.join(owned, 'first-source-checks.json')),
      first300Media: file(path.join(owned, 'first-300-08-09.png')),
      ...(number === '09' ? {
        rendererArgumentFailure: file(path.join(owned, 'commands/render09-first.json')),
        technicalDiagnosis: 'Accidental space in --svg argument; parser exited 1 before any validation or output write. Corrected path only; same first spec hash. This was not a content repair.'
      } : {})
    }
  }
})
const report = {
  schema: 'stemrobin188/n44-fig0809-author-report@1', generatedAt: new Date().toISOString(),
  ticket: scope.ticket, assignment: scope.assignment, role: scope.role,
  candidate: figures.every(figure => figure.candidate === 'PASS') ? 'PASS' : 'HOLD',
  boundaries: {
    cwdForAllExec: repo, outputRoot: owned, figuresOnly: scope.figures,
    independentReviewClaim: false, reviewAt1FilesWritten: false,
    promotion: false, lessonManifestEdits: false, coreEdits: false,
    backend: false, database: false, environmentReadOrEdit: false, installs: false,
    network: false, paidCalls: 0, git: false, publish: false, deploy: false,
    closure: false, setupOrFreshness: false, grill: false, supervisorOrAgentContact: false,
    otherAuthorsRead: false, oldKeysChoicesSourcePagesRead: false,
    productAcceptance: 'Not performed or claimed; author preview evidence only.'
  },
  prerequisiteAuthority: scope.prerequisites,
  inputSnapshots: read(path.join(owned, 'inputs.json')),
  renderer: {
    script: file(path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')),
    validator: file(path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')),
    katexVectorAccentFont: file(path.join(repo,
      '.claude/skills/ld-s10y-lesson/node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2')),
    unchangedByAuthor: true, deterministicExistingRendererOnly: true,
    note: 'Renderer internally invokes draft validation before each parsed render. Standalone validation was run once per first spec and once per affected repaired spec.'
  },
  imageUsage: {
    actualOpens: ledger.length, batchLimit: 8, contextLimit: 24,
    batches: 1, imageLoadFailures: ledger.filter(load => load.status !== 'loaded').length,
    remainingBatchOpens: 0, actualImageLedger: ledger,
    ledgerFile: file(path.join(owned, 'actual-image-ledger.jsonl')),
    includesFailedLoads: true
  },
  media300: {
    firstComposition: file(path.join(owned, 'first-300-08-09.png')),
    firstChecks: file(path.join(owned, 'first-300-08-09.checks.json')),
    repairedComposition: file(path.join(owned, 'repaired-300-08-09.png')),
    repairedChecks: file(path.join(owned, 'repaired-300-08-09.checks.json')),
    actualWidthPerFigure: 300, measuredMinimumLabelPx: 17.5
  },
  figures, allCommandReceipts: commands,
  nextState: 'Author-only stop. Candidates are not approved or promoted. Both content repair budgets are exhausted.'
}
write(path.join(owned, 'report.json'), report)
const lines = [
  '# N44 fig08/fig09 Author Report',
  '',
  `Candidate: **${report.candidate}**, author-only. No independent approval or promotion.`,
  '',
  'Only the owned author directory was written. No core/manifest edits, backend, DB, env, network, paid calls, Git, publication, deployment, closure or agent contact.',
  'Human-reported source/assembly/sourcevectorize PASS prerequisites were used as prerequisites only, not modern approval.',
  '',
  '## Evidence',
  'Both repaired validator calls and renderer calls exited 0. Source relationship/direction checks pass.',
  'Inline maxWidth 480px; inspected current 480px previews and actual 300px media. Minimum label size at 300px: 17.5px. No final collisions or clipping.',
  'Image loads: 8/8 batch, 8/24 context; 0 failed loads. Ledger includes each absolute path and SHA-256.',
  'Content repairs: exactly 1/1 per figure; no repair budget remains.',
  'Fig09 had one retained parser failure (bad --svg argument, exit 1) and a path-only technical retry (exit 0); no content budget reset.',
  'First fig08 renderer failure (A-label collision, exit 2), all first specs/SVGs/PNGs/render reports, first source-check failures and first 300px composition are retained.',
  ''
]
for (const figure of figures) {
  lines.push(`## ${figure.figure}`, `${figure.candidate}, author candidate only.`,
    figure.visual.observed, `Repair: ${figure.repair.changes.map(change => `${change.object}.${change.field}`).join(', ')}.`,
    `Original PNG: ${figure.source.path}`, `Source SHA-256: ${figure.source.sha256}`,
    `Inventory: ${figure.sourceInventory.path}`, `Inventory SHA-256: ${figure.sourceInventory.sha256}`,
    `First snapshot: ${path.join(owned, figure.figure, 'first')}`,
    `Repaired snapshot: ${path.join(owned, figure.figure, 'repaired')}`)
  for (const key of ['spec', 'svg', 'png480', 'render']) {
    lines.push(`${key}: ${figure.final[key].path}`, `SHA-256: ${figure.final[key].sha256}`)
  }
  lines.push('')
}
lines.push('## Reports',
  `Full source inventories, assertion results, snapshots, hashes, actual image ledger and exact validator/renderer commands with exits: ${path.join(owned, 'report.json')}`,
  `Image ledger: ${path.join(owned, 'actual-image-ledger.jsonl')}`,
  `Final 300px composition: ${report.media300.repairedComposition.path}`,
  `SHA-256: ${report.media300.repairedComposition.sha256}`,
  '',
  'STOP: author-only. No review@1 record written. Candidate files remain ticket-temp evidence, not promotable durable outputs.',
  '')
fs.writeFileSync(path.join(owned, 'report.md'), lines.join('\n'), { flag: 'wx' })
console.log(JSON.stringify({
  candidate: report.candidate, figures: figures.map(figure => ({ id: figure.figure,
    candidate: figure.candidate, final: figure.final, repairs: figure.repairCounters })),
  report: file(path.join(owned, 'report.json')), markdown: file(path.join(owned, 'report.md')),
  imageOpens: ledger.length
}, null, 2))
