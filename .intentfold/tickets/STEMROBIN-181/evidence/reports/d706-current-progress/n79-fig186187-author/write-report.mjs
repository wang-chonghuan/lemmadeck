import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d694-n79-fig186187-first-author')
if (process.cwd() !== root) throw new Error('Wrong workdir')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const file = (absolute) => ({ path: absolute, sha256: hash(absolute) })
const inventory = read(path.join(own, 'source-inventory.json'))
const bindings = read(path.join(own, 'input-bindings.json'))
const imageLedger = [
  { kind: 'original', path: path.join(root, inventory.figures['fig-186'].source), opens: 1 },
  { kind: 'original', path: path.join(root, inventory.figures['fig-187'].source), opens: 1 },
  { kind: 'native640', path: path.join(own, 'fig-186/repair-1/fig-186.native640.png'), opens: 1 },
  { kind: 'native640', path: path.join(own, 'fig-187/repair-1/fig-187.native640.png'), opens: 1 },
].map((entry) => ({ ...entry, sha256: hash(entry.path) }))
const figures = ['fig-186', 'fig-187'].map((id) => {
  const first = path.join(own, id, 'first')
  const repaired = path.join(own, id, 'repair-1')
  const render = read(path.join(repaired, `${id}.render.json`))
  const source = inventory.figures[id]
  return {
    id,
    status: 'FAIL-STOPPED-REPAIR-LIMIT',
    source: file(path.join(root, source.source)),
    sourceInventory: source.subfigures,
    sourceInventoryMappedIn: file(path.join(repaired, 'spec.json')),
    firstAttempt: {
      spec: file(path.join(first, 'spec.json')),
      receipt: file(path.join(first, 'attempt.receipt.json')),
      validation: file(path.join(first, 'validation.stdout.txt')),
      executionFailure: file(path.join(first, 'render.stderr.txt')),
      cause: 'Fractional 2.5 px lens-tip stroke creates an SVG marker aspect ratio rejected by materializeArrowheads. No first-attempt image or SVG was produced.',
      verdict: 'DRAFT-VALIDATION-PASS; RENDER-EXECUTION-FAIL',
    },
    soleRepair: {
      delta: file(path.join(repaired, 'repair.delta.json')),
      spec: file(path.join(repaired, 'spec.json')),
      receipt: file(path.join(repaired, 'attempt.receipt.json')),
      validation: file(path.join(repaired, 'validation.stdout.txt')),
      renderReport: file(path.join(repaired, `${id}.render.json`)),
      svg: file(path.join(repaired, `${id}.svg`)),
      native640: file(path.join(repaired, `${id}.native640.png`)),
      verdict: 'DRAFT-VALIDATION-PASS; MEDIA-PRODUCED; RENDER-COLLISION-FAIL',
      collisions: render.collisions,
      actual640TextCheck: render.displayChecks,
      repairsConsumed: 1,
      maximumRepairs: 1,
    },
    nativeVerdict: {
      status: 'FAIL',
      observerRole: 'FIRST-AUTHOR, NOT INDEPENDENT REVIEW',
      mediaWidthPx: 640,
      openedExactlyOnce: true,
      observed: id === 'fig-186'
        ? [
            'Both subfigures are visible and nonblank: three parallel incident rays cross before retina in (a); diverging correction rays and two dashed backward extensions to A converge on retina in (b).',
            'Diverging lens tips point inward as in the source.',
            'A label intersects the upper incident ray; thin strokes are outside the renderer collision sampler, so this visual defect is additional to machine findings.',
            'Retina/focus-note vertical clearance and the two bottom qualifier lines fail the collision gate.',
            'At 640 px all measured SVG text is at least 16 px. A wider canvas was not substituted for product media width.',
          ]
        : [
            'All three subfigures are visible and nonblank: (a) has a hypothetical focus beyond retina; (b) preconverges parallel rays; (c) preserves S1 left of S, less-divergent real rays, dashed backward extensions and d measured from S1 to eye front.',
            'Converging lens tips point outward as in the source; hypothetical posterior continuations remain solid/muted, while virtual backward extensions remain dashed.',
            'Retina/continuation-note vertical clearance and the two bottom qualifier lines fail the collision gate.',
            'At 640 px all measured SVG text is at least 16 px; conventional 25 cm and non-universal near-point qualifiers are visible.',
          ],
      approval: 'NONE',
    },
    furtherAction: 'STOP. Preserve both attempt specs, receipts and failed media. Separate-context independent review or further content revision needs later authorization; no promotion.',
  }
})
const report = {
  ticket: 'STEMROBIN-181',
  invocation: 'continuing181-3',
  card: 'phy10-c2-s2-n79',
  subjectCorrection: 'Human eye / vision optics, not n80 magnifier.',
  status: 'FIRST-AUTHOR-BATCH-RETURNED-FAIL',
  ownedDirectory: own,
  cwd: root,
  scope: ['10p fig-186', '10p fig-187'],
  sourceRequirements: file(path.join(root, bindings.sourceRequirements.path)),
  fullBilingualAuthoritativeCandidates: bindings.candidateText.map((item) => ({
    locale: item.locale,
    ...file(path.join(root, item.path)),
    scientificReview: 'PENDING',
    wholeCardApproval: 'NONE',
  })),
  sourceInventory: file(path.join(own, 'source-inventory.json')),
  inputBindings: file(path.join(own, 'input-bindings.json')),
  contracts: [
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  ].map((relative) => file(path.join(root, relative))),
  sourceInventoryBeforeDraft: true,
  modernAdditions: inventory.modernAdditions,
  actualOutputNote: 'No extra labelled focus dots were rendered; unlabelled convergence points are represented by ray intersections and hidden assertion anchors. Visible point markers are A, S and S1 only.',
  figures,
  imageTotals: {
    batchOpened: 4,
    contextOpened: 4,
    originals: 2,
    native640: 2,
    crops: 0,
    reopens: 0,
    batchMaximum: 8,
    contextMaximum: 24,
    firstAttemptGeneratedImages: 0,
    repairedAttemptGeneratedImages: 2,
    ledger: imageLedger,
  },
  restrictionsObserved: {
    paidCalls: 0,
    repairMaximumPerFigure: 1,
    passReruns: 0,
    duplicateValidationNote: 'Existing render_spec.mjs internally validates its input as part of the authoritative validate-then-render contract. No passed author or render stage was rerun unchanged.',
    canonicalWrites: 0,
    sharedToolEdits: 0,
    meterWrites: 0,
    indexWrites: 0,
    gitWrites: 0,
    backendWrites: 0,
    databaseAccess: 0,
    publisherCalls: 0,
    deployCalls: 0,
    newAgents: 0,
    newBranchesOrWorktrees: 0,
    wholeProjectTestsOrBuilds: 0,
    otherChatMessages: 0,
    recordReviewCalls: 0,
    independentApproval: 'NONE',
    promotion: 'NONE',
    temporaryRuntime: 'Existing JSXGraph renderer only; browser processes closed by renderer finally blocks. Temporary runtime confined to owned directory.',
  },
}
const output = path.join(own, 'report.json')
if (fs.existsSync(output)) throw new Error('Report already exists')
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({
  report: file(output),
  sourceInventory: report.sourceInventory,
  imageTotals: report.imageTotals,
  results: figures.map(({ id, status, soleRepair }) => ({
    id, status,
    spec: soleRepair.spec,
    svg: soleRepair.svg,
    native640: soleRepair.native640,
    renderReport: soleRepair.renderReport,
  })),
}, null, 2))
