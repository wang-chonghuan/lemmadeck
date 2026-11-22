import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck'
const owner = path.join(repo, '.tmp/stemrobin-184-six/n88-figure-reviewed-records')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const tool = path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py')
const observer = path.join(owner, 'observe-record-io.py')
const evidence = JSON.parse(fs.readFileSync(path.join(owner, 'evidence-provenance.json')))
const candidateBytes = fs.readFileSync(evidence.candidate_manifest.path)
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: sha(fs.readFileSync(file)) })
assert.equal(sha(candidateBytes), evidence.candidate_manifest.sha256)
const candidate = JSON.parse(candidateBytes)
const manifestPath = path.join(owner, 'hash-manifest.json')
assert.ok(!fs.existsSync(manifestPath), 'Do not repeat a completed recording batch')
const limits = evidence.retained_limits.join(' ')
const e = evidence
const evidenceNotes = [
  `Independent Halley PhaseB ${e.phaseB.report.path} SHA-256 ${e.phaseB.report.sha256}; manifest ${e.phaseB.manifest.path} SHA-256 ${e.phaseB.manifest.sha256}.`,
  `Independent display resolution ${e.display_resolution.report.path} SHA-256 ${e.display_resolution.report.sha256}; manifest ${e.display_resolution.manifest.path} SHA-256 ${e.display_resolution.manifest.sha256}; parent bound6125ab/retained5e1f5c.`,
  `Existing independent Mendel desktop final-ledger ${e.desktop_reference_from_verified_trusted_text_not_reopened.root}/final-ledger.json SHA-256 ${e.desktop_reference_from_verified_trusted_text_not_reopened.final_ledger_sha256}; actual media width 640px, minimum text 24/17/24/24px for figures38/39/40/41; six captures/six views already spent, no replay.`,
  `Existing independent Sartre mobile recovery ${e.mobile_reference_from_trusted_text_not_reopened.root}; report SHA-256 ${e.mobile_reference_from_trusted_text_not_reopened.report_sha256}; manifest SHA-256 ${e.mobile_reference_from_trusted_text_not_reopened.manifest_sha256}; actual media 640px for each, native scroll 0->297=end, eight captures/eight views already spent, no replay. Reused through trusted display-resolution text; mobile/desktop files not reopened here.`,
].join(' ')
const descriptions = {
  'fig-38': 'PhaseB scoped PASS retains one unframed cotangent branch, two axes, right dashed guide and five labels; open principal branch (0,pi), zero pi/2 and no invented endpoint dots. Formula, finite window and coordinate labels are explicitly modern/text-derived.',
  'fig-39': 'PhaseB source-structure/math/culture/leakage PASS retains one shared frame, five descending branches, five dashed pole guides, the solid zero-pole axis and all thirteen labels, including five half-period labels. Historical sole B39-DISPLAY-640 HOLD is resolved by the hash-matched independent normal-640 desktop observation in the display addendum; SVG SHA-256 666694a6bb441673f3cc4d755407251e361ff539a2e771fcd3900ca218ef6ded is unchanged. All branches/guides/labels were independently distinct, legible and uncut at actual640px with minimum17px; mobile released scroll-end evidence also PASS. The historical HOLD is preserved, not overwritten.',
  'fig-40': 'PhaseB scoped PASS retains one principal inverse curve with all-real input domain and strictly open output range (0,pi), the upper dashed pi guide and five labels. No inverse of the full periodic graph, extra branch, y=x line, endpoint circles or admitted range endpoints are added.',
  'fig-41': 'PhaseB scoped PASS retains the single shared cotangent frame, two distinct horizontal level guides, separate a>0/a<0 sign labels, both dashed projections, right pole guide and both visible axis-foot dots. Unlabelled +1.5/-1.2 levels and their formula-derived coordinates are explicit modern illustration choices, not recovered source values or displayed keyed answers; no new curve/guide junction markers.',
}
const results = []
const failures = []
for (const entry of candidate.entries) {
  const figure = entry.figure
  const output = path.join(owner, `${figure}.review.json`)
  const receiptPath = path.join(owner, `${figure}.execution.json`)
  const countsPath = path.join(owner, `${figure}.opaque-io.json`)
  for (const file of [output, receiptPath, countsPath]) {
    assert.ok(!fs.existsSync(file), `Refuse repeated recording or overwrite: ${file}`)
  }
  const notes = [
    'Preliminary hash-bound candidate figure review recording under SAME STEMROBIN-184/184-6, offline finish=review. No new self source/math/visual review is performed; the unchanged author and first render are reused.',
    descriptions[figure], evidenceNotes,
    `Candidate manifest SHA-256 ${e.candidate_manifest.sha256}; modern lesson SHA-256 ${candidate.release.lesson.sha256}, exercises SHA-256 ${candidate.release.exercises.sha256}.`,
    `Unresolved limits: ${limits}`,
    'This pass is scoped candidate figure review recording only: not original-page/crop approval, durable promotion, canonical/edition manifest mutation, modern finalization, publication, whole defence, product-wide acceptance or a completed lesson. Complete remains0; charges74, paid0, feesUNKNOWN. Author original model views4/4 and parent24/24 remain permanently spent, with no reset or new payload.',
  ].join(' ')
  const officialArgv = [
    tool, '--spec', entry.spec.path, '--render', entry.render.report.path,
    '--output', output, '--status', 'pass', '--notes', notes,
  ]
  const argv = [
    '-B', observer, '--figure', figure, '--counts', countsPath,
    '--', ...officialArgv,
  ]
  const startedAt = new Date().toISOString()
  const call = spawnSync(python, argv, {
    cwd: repo,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 120000,
  })
  const stdoutPath = path.join(owner, `${figure}.stdout.txt`)
  const stderrPath = path.join(owner, `${figure}.stderr.txt`)
  fs.writeFileSync(stdoutPath, call.stdout || '')
  fs.writeFileSync(stderrPath, call.stderr || '')
  const expected = {
    source: { path: entry.source.source_path, sha256: entry.source.source_sha256_observed },
    spec: entry.spec, render: entry.render.report, svg: entry.render.svg,
  }
  const io = fs.existsSync(countsPath) ? JSON.parse(fs.readFileSync(countsPath)) : null
  let bindingError = null
  let recorded = null
  if (call.status === 0 && fs.existsSync(output)) {
    try {
      recorded = JSON.parse(fs.readFileSync(output))
      assert.equal(recorded.schema, 'ld-s10y-image/review@1')
      assert.equal(recorded.figure, figure)
      assert.equal(recorded.status, 'pass')
      assert.deepEqual(recorded.source, expected.source)
      for (const [key, reference] of [['spec', expected.spec], ['render', expected.render]]) {
        assert.equal(path.resolve(repo, recorded[key].path), reference.path)
        assert.equal(recorded[key].sha256, reference.sha256)
      }
      assert.equal(path.resolve(repo, recorded.outputs.svg.path), expected.svg.path)
      assert.equal(recorded.outputs.svg.sha256, expected.svg.sha256)
      assert.equal(recorded.notes, notes)
      assert.equal(io.actualOriginalPngOpaqueHashCalls, 1)
      assert.equal(io.actualOriginalPngByteOpens, 1)
      assert.equal(io.requiredRenderedValidationCalls.length, 1)
      assert.equal(io.requiredRenderedValidationCalls[0].stage, 'rendered')
      assert.equal(io.sha256CallCounts.spec_text_sha256, 2)
      assert.equal(io.sha256CallCounts.render_report_text_sha256, 1)
      assert.equal(io.sha256CallCounts.svg_opaque_sha256, 1)
    } catch (error) {
      bindingError = error.message
    }
  }
  const receipt = {
    schema: 'n88-official-review-record-execution@1',
    figure, command: python, argv, officialTool: tool, officialArgv,
    cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    exitCode: call.status, signal: call.signal,
    error: call.error ? { code: call.error.code, message: call.error.message } : null,
    environmentOverrides: { PYTHONDONTWRITEBYTECODE: '1' },
    expectedUnchangedBindings: expected,
    provenance: bind(path.join(owner, 'evidence-provenance.json')),
    executedScript: bind(tool), observationalWrapper: bind(observer),
    streams: { stdout: bind(stdoutPath), stderr: bind(stderrPath) },
    outputs: [output, countsPath].filter(file => fs.existsSync(file)).map(bind),
    opaqueIo: io,
    bindingError,
    reviewScope: 'Preliminary unchanged candidate figure review only; no promotion or whole-source/lesson approval.',
  }
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`)
  const result = {
    figure,
    status: call.status === 0 && recorded && !bindingError ? 'pass' : 'failure-retained',
    expectedUnchangedBindings: expected,
    review: fs.existsSync(output) ? bind(output) : null,
    execution: bind(receiptPath),
    opaqueIo: fs.existsSync(countsPath) ? bind(countsPath) : null,
    actualOpaqueSourceSha256Reads: io?.actualOriginalPngOpaqueHashCalls ?? null,
  }
  results.push(result)
  console.log(JSON.stringify(result))
  if (call.stdout) process.stdout.write(call.stdout)
  if (call.stderr) process.stderr.write(call.stderr)
  if (result.status !== 'pass') {
    failures.push({
      figure, exitCode: call.status, signal: call.signal, bindingError,
      dependentFurtherRecordsStopped: true, validOrPartialOutputRetained: true,
    })
    break
  }
}
const allIo = results.map(result => {
  const receipt = JSON.parse(fs.readFileSync(result.execution.path))
  return receipt.opaqueIo
}).filter(Boolean)
const sum = field => allIo.reduce((total, item) => total + (item[field] || 0), 0)
const hashCounts = {}
for (const io of allIo) {
  for (const [kind, count] of Object.entries(io.sha256CallCounts)) {
    hashCounts[kind] = (hashCounts[kind] || 0) + count
  }
}
const ledger = {
  schema: 'n88-preliminary-review-recording-usage@1',
  ticket: 'STEMROBIN-184/184-6', offline: true, finish: 'review',
  officialRecordReviewInvocations: results.length,
  officialReviewRecordsPass: results.filter(result => result.status === 'pass').length,
  actualOpaqueSourceSha256Reads: sum('actualOriginalPngOpaqueHashCalls'),
  actualOpaqueOriginalPngByteOpens: sum('actualOriginalPngByteOpens'),
  actualInstalledSha256CallCounts: hashCounts,
  requiredRenderedValidationCallsInsideRecorderOnly: allIo.reduce((total, io) => total + io.requiredRenderedValidationCalls.length, 0),
  separateValidatorInvocations: 0,
  sourceHashReadsOutsideOfficialRecorder: 0,
  newModelViews: 0, newImagePayloads: 0, nativeHeaders: 0,
  diagnosticDecodes: 0, originalOrPreviewModelReopens: 0, roiOrCropCreations: 0,
  rendererInvocations: 0, newImages: 0, browserOrDisplayActions: 0,
  authorOriginalModelViewsCarried: 4, authorOriginalModelViewsLimit: 4,
  parentModelViewsCarried: 24, parentModelViewsLimit: 24, parentNativeHeaders: 0,
  budgetReset: false,
  independentPriorUsageReusedNotChargedAgain: e.prior_observation_budgets_not_reset,
  chargesSuppliedCarried: 74, paidCalls: 0, fees: 'UNKNOWN', complete: 0,
  durablePromotions: 0, modernFinalizations: 0, publications: 0,
  canonicalOrEditionManifestMutations: 0, completedLessons: 0,
  sourceCropWholeLessonApproval: false,
  networkDbGitInstallsBackendChatManagedWorkspaceNewAgentOrServiceOperations: 0,
  fullMathOrVisualReviewReplays: 0, wholeDefenceInvocations: 0,
  executionSessionsActive: 0, failures,
}
const ledgerPath = path.join(owner, 'usage-ledger.json')
fs.writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`)
const lines = [
  '# N88 Preliminary Candidate Figure Review Records',
  '',
  'SAME STEMROBIN-184/184-6; OFFLINE finish=review. Affected handoff recording only.',
  `Owned output root: \`${owner}\``,
  '',
  '## Results',
  '',
  '| Figure | Official review | Source opaque hash reads | New image views | Native headers |',
  '| --- | --- | --- | --- | --- |',
  ...results.map(result => `| ${result.figure} | ${result.status} | ${result.actualOpaqueSourceSha256Reads ?? 'UNKNOWN'} | 0 | 0 |`),
  '',
  'Official ld-s10y-image/review@1 records were emitted solely by installed record_review.py, once per attempted figure. No review contract was manually authored.',
  'The required rendered-stage validation ran inside that tool only. An observational profile/audit hook counted its actual sha256 calls and original byte opens without replacing functions, decoding pixels, or adding validators.',
  '',
  '## Independent Provenance Reused',
  '',
  evidenceNotes,
  '',
  'Trusted PhaseB and display-resolution reports were read once on entry. Existing desktop/mobile observations, source comparisons, mathematical review, culture and leakage checks were not repeated.',
  'No candidate, original, preview, prior evidence seal or retention was mutated. Originals were read solely as opaque bytes by the official required hash validation; SVGs were opaque-hashed by that tool, not re-viewed or mathematically re-audited.',
  '',
  '## Exact Unchanged Input and New Record Bindings',
  '',
]
for (const result of results) {
  lines.push(`### ${result.figure}`, '')
  for (const [kind, reference] of Object.entries(result.expectedUnchangedBindings)) {
    lines.push(`- ${kind}: \`${reference.path}\`; SHA-256 \`${reference.sha256}\``)
  }
  if (result.review) lines.push(`- official review: \`${result.review.path}\`; SHA-256 \`${result.review.sha256}\``)
  lines.push(`- execution receipt: \`${result.execution.path}\`; SHA-256 \`${result.execution.sha256}\``)
  lines.push('')
}
lines.push(
  '## Limits and Accounting', '',
  ...e.retained_limits.map(limit => `- ${limit}`),
  '',
  `Actual source opaque hash calls/byte opens: ${ledger.actualOpaqueSourceSha256Reads}/${ledger.actualOpaqueOriginalPngByteOpens}; source hash reads outside the official tool: 0.`,
  `Official hash-call totals: ${JSON.stringify(hashCounts)}. These are byte/text hash work, not image views or header reads.`,
  'New image model views, native headers, diagnostic decodes, ROI/crops, render/browser/service calls: 0.',
  'Author model views remain4/4 originals only; parent24/24 permanently exhausted; no budget reset.',
  'Charges74, paid0, feesUNKNOWN, complete0. All child/exec sessions exited.',
  `Failures: ${JSON.stringify(failures)}.`,
  'STOP: preliminary hash-bound candidate review recording only. No durable promotion, source-page approval, adapt-finalize, edition/canonical-resource update, modern finalization, publication or completed lesson.',
  '',
)
const reportPath = path.join(owner, 'report.md')
fs.writeFileSync(reportPath, lines.join('\n'))
const artifactFiles = fs.readdirSync(owner).filter(name => name !== 'hash-manifest.json').sort()
const manifest = {
  schema: 'n88-preliminary-figure-review-records-manifest@1',
  ticket: 'STEMROBIN-184/184-6', offline: true, finish: 'review',
  root: owner, recordingOnly: true, durablePromotion: false,
  candidateManifest: e.candidate_manifest,
  independentEvidenceProvenance: e,
  results, ledger: bind(ledgerPath), report: bind(reportPath),
  artifacts: artifactFiles.map(name => bind(path.join(owner, name))),
  executedOfficialTool: bind(tool),
  candidateAndPriorSealsMutation: false,
  actualOpaqueSourceSha256Reads: ledger.actualOpaqueSourceSha256Reads,
  imageModelViews: 0, nativeHeaders: 0, diagnostics: 0,
  failures,
  noncircularBinding: 'This manifest excludes itself; its SHA-256 is returned in the TEXT handoff.',
  stop: 'No dependent promotion/finalization/publication or completed-lesson operation authorized.',
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify({
  status: failures.length ? 'failure-retained' : 'four-official-preliminary-review-records-pass',
  manifest: bind(manifestPath), report: bind(reportPath), ledger: bind(ledgerPath),
  actualOpaqueSourceSha256Reads: ledger.actualOpaqueSourceSha256Reads,
  imageModelViews: 0, nativeHeaders: 0, complete: 0, failures,
}))
process.exitCode = failures.length ? 1 : 0
