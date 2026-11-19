import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const own = path.dirname(new URL(import.meta.url).pathname)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, data) => {
  assert(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const input = read(path.join(own, 'author-input.json'))
const calls = []
const bind = file => ({ path: file, sha256: sha(file) })
const files = []
const call = (name, args) => {
  const target = path.join(own, `flow/${name}.receipt.json`)
  assert(!fs.existsSync(target), 'Do not repeat an existing flow call.')
  const before = bind(args.at(-1))
  const result = spawnSync('node', args, { cwd: R, encoding: 'utf8' })
  const receipt = {
    command: ['node', ...args], cwd: R, before, exitCode: result.status,
    signal: result.signal, stdout: result.stdout, stderr: result.stderr,
  }
  save(target, receipt)
  calls.push(bind(target))
  assert.equal(result.status, 0, `Saved first failure at ${target}`)
  const output = path.join(own, `flow/${name}.txt`)
  fs.writeFileSync(output, result.stdout, { flag: 'wx' })
  return output
}
for (const locale of ['zh', 'en']) {
  const native = read(path.join(own, `native/${locale}.json`))
  assert.equal(native.status, 'PASS-TEXT-CONSERVATION-ONLY')
  const candidate = path.join(own, `candidate/${locale}/lesson.template.json`)
  assert.equal(sha(candidate), native.afterSha256)
  const firstOutput = call(`${locale}-adjacent-anchors`, [
    path.join(R, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), candidate,
  ])
  // Read only the saved native output's adjacent-paragraph boundary objects.
  const boundaries = fs.readFileSync(firstOutput, 'utf8').split('\n')
    .filter(line => line.startsWith('    break: '))
    .map(line => JSON.parse(line.slice('    break: '.length)))
  const selected = input.sectionConceptOpenings[locale].map(opening => {
    const matches = boundaries.filter(boundary => boundary.after.startsWith(opening))
    assert.equal(matches.length, 1, `Unique emitted adjacent boundary needed for ${opening}`)
    return matches[0]
  })
  const document = read(candidate)
  save(path.join(own, `normalized/${locale}/lesson.before-section-breaks.json`), document)
  document.section_breaks = selected
  fs.writeFileSync(candidate, `${JSON.stringify(document, null, 2)}\n`)
  save(path.join(own, `flow/${locale}-section-breaks.json`), {
    method: 'Copy exact adjacent before/after objects from saved native prose_flow.mjs readable output, choosing actual concept-opening paragraphs. No block count or manually counted paragraph positions.',
    savedNativeOutput: bind(firstOutput), selected,
  })
  const resolvedOutput = call(`${locale}-resolved`, [
    path.join(R, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', candidate,
  ])
  const resolved = JSON.parse(fs.readFileSync(resolvedOutput, 'utf8'))
  assert.deepEqual(resolved.boundaries.map(({ before, after }) => ({ before, after })), selected)
  files.push(bind(candidate), bind(path.join(own, `candidate/${locale}/exercises.template.json`)))
}
const inputsBefore = read(path.join(own, 'inputs-before.json'))
for (const binding of inputsBefore) assert.equal(sha(binding.path), binding.sha256, `Input changed: ${binding.path}`)
save(path.join(own, 'inputs-after.json'), inputsBefore.map(binding => bind(binding.path)))
const natives = ['zh', 'en'].map(locale => read(path.join(own, `native/${locale}.json`)))
save(path.join(own, 'actual-calls.json'), {
  cwd: R,
  authorBuild: { command: ['node', path.join(own, 'build-candidates.mjs')], executions: 1, exitCode: 0 },
  native: natives.map(report => ({
    locale: report.locale, command: report.command,
    executions: 1, normalizeProseLayoutCalls: report.normalizeCalls,
    validateTextCalls: report.validateTextCalls, receipt: bind(path.join(own, `native/${report.locale}.json`)),
  })),
  flowCalls: calls,
  flowAndFreeze: { command: ['node', path.join(own, 'flow-and-freeze.mjs')], executions: 1 },
  nativeFailures: 0, nativeRepairCalls: 0, contentRevisions: 0,
  explorationFailures: bind(path.join(own, 'exploration-failures.json')),
  imagesOpened: 0, imagesCreated: 0, paidCalls: 0, sourceQuestions: 0,
  adaptFinalize: 0, fullChecks: 0, independentReviews: 0,
  canonicalWrites: 0, gitCalls: 0, databaseCalls: 0, publisherCalls: 0,
  deployCalls: 0, chatMessages: 0, newWorktrees: 0, extraAgents: 0,
})
save(path.join(own, 'author-freeze.json'), {
  schema: 'STEMROBIN-181/d798-author-freeze@1', ticket: 'STEMROBIN-181/181-3',
  card: 'phy10-c2-s3-n86', status: 'AUTHOR-FROZEN-PENDING-INDEPENDENT-SCI-ZHEN',
  frozenAt: new Date().toISOString(), cwd: R, node: process.version,
  candidates: files,
  firstCandidates: ['zh', 'en'].map(locale => bind(path.join(own, `first/${locale}/lesson.template.json`))),
  nativeReceipts: ['zh', 'en'].map(locale => bind(path.join(own, `native/${locale}.json`))),
  flowReceipts: calls, actualCalls: bind(path.join(own, 'actual-calls.json')),
  inputManifest: bind(path.join(own, 'inputs-before.json')),
  unchangedInputManifest: bind(path.join(own, 'inputs-after.json')),
  sourceMapping: bind(path.join(own, 'source-mapping.json')),
  sourceQuestions: 0, images: 0, paid: 0,
  pending: [
    'Parent independent SCI and ZHEN review of these exact text hashes.',
    'External source-pixel/Roman-ownership/spectral-color binding for literal 彩图 V; no invented plate image or figure id.',
    'Existing fig-200 is retained as source metadata only; no image work or acceptance occurred.',
    'Frozen-source footnote is absent from assembled raw/template objects; immutable bindings were preserved and meaning mapped without new math tokens. Parent owns any source-layer decision.',
  ],
  acceptance: 'Native math/numeric/source conservation passed, not full adaptation acceptance.',
})
console.log(JSON.stringify({
  freeze: bind(path.join(own, 'author-freeze.json')), candidates: files,
  normalizationCalls: natives.map(report => ({ locale: report.locale, calls: report.normalizeCalls })),
  validateTextCalls: natives.map(report => ({ locale: report.locale, calls: report.validateTextCalls })),
  flowCalls: calls.length, nativeFailures: 0, nativeRepairs: 0,
  explorationFailures: 3, images: 0, paid: 0, sourceQuestions: 0,
}, null, 2))
