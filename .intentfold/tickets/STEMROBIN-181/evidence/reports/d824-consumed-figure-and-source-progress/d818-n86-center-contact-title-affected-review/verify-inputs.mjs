import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(tmp, 'd818-n86-center-contact-title-affected-review')
const first = path.join(tmp, 'd805-n86-first-independent-text-review')
const author = path.join(tmp, 'd798-n86-first-bilingual-text-author')
const repair = path.join(tmp, 'd815-n86-center-contact-title-repair')
assert.equal(process.cwd(), root)
assert.equal(path.dirname(fileURLToPath(import.meta.url)), out)

const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const sha = file => digest(fs.readFileSync(file))
const bindings = new Map()
const checks = []
function bind(file, role, expected) {
  file = path.resolve(root, file)
  assert.ok(file.startsWith(root + path.sep))
  const actual = sha(file)
  bindings.set(file, { path: file, role, sha256: actual })
  if (expected) check(`${role}: exact SHA-256`, () => assert.equal(actual, expected))
  return { path: file, sha256: actual }
}
function read(file, role, expected) {
  bind(file, role, expected)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}
function check(label, fn) {
  try {
    fn()
    checks.push({ label, passed: true })
  } catch (error) {
    checks.push({ label, passed: false, error: error.message })
  }
}
function save(name, value) {
  const file = path.join(out, name)
  assert.equal(path.dirname(file), out)
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
function differences(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return []
  if (a && b && typeof a === 'object' && typeof b === 'object' &&
      Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
      differences(a[key], b[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`))
  }
  return [pointer]
}

// Final mode verifies immutability and report bindings, not science or native behavior.
if (process.argv[2] === '--final') {
  const integrity = JSON.parse(fs.readFileSync(path.join(out, 'input-integrity.json'), 'utf8'))
  const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'))
  const inputs = integrity.bindings.map(input => ({
    ...input,
    finalSha256: sha(input.path),
    unchanged: sha(input.path) === input.sha256,
  }))
  assert.ok(integrity.allChecksPassed)
  assert.ok(inputs.every(input => input.unchanged))
  assert.equal(report.status, 'PASS')
  assert.equal(report.completeCardApproved, false)
  assert.equal(report.actualUsage.nativePipelineCalls, 0)
  assert.equal(report.actualUsage.imagesOpened, 0)
  for (const binding of Object.values(report.bindings)) {
    assert.equal(sha(binding.path), binding.sha256)
  }
  const outputNames = fs.readdirSync(out).sort()
  assert.deepEqual(outputNames, ['input-integrity.json', 'report.json', 'summary.md', 'verify-inputs.mjs'])
  save('final-verification.json', {
    schema: 'STEMROBIN-181/d818-final-verification@1',
    root,
    writeRoot: out,
    status: 'PASS',
    allConsumedInputsUnchanged: true,
    inputFilesChecked: inputs.length,
    inputs,
    reportBindingsValid: true,
    scientificReviewRepeated: false,
    nativePipelineCalls: 0,
    images: 0,
    writeBoundary: 'Only this directory was written by this review; no global workspace claim about other workers.',
  })
  const names = fs.readdirSync(out).sort()
  const lines = names.map(name => `${sha(path.join(out, name))}  ${path.join(out, name)}`)
  fs.writeFileSync(path.join(out, 'hashes.sha256'), lines.join('\n') + '\n', { flag: 'wx' })
  console.log(JSON.stringify({ status: 'PASS', inputsUnchanged: inputs.length, outputs: [...names, 'hashes.sha256'] }))
  process.exit(0)
}
assert.equal(process.argv.length, 2)

for (const relative of [
  'AGENTS.md', '.intentfold/readme.md', '.intentfold/project.json',
  '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md', '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
]) bind(relative, 'routed instruction')

bind(path.join(first, 'hashes.sha256'), 'preserved first-review hash manifest')
for (const line of fs.readFileSync(path.join(first, 'hashes.sha256'), 'utf8').trim().split('\n')) {
  const separator = line.indexOf('  ')
  bind(line.slice(separator + 2), 'preserved first-review output', line.slice(0, separator))
}
const prior = read(path.join(first, 'report.json'), 'FIRST full review',
  '9c6482950d8b2113dcc8d22d9a7b57e03ee59dda22ef19261f5dcc490cfdc602')
const priorIntegrity = read(path.join(first, 'input-integrity.json'), 'reused first integrity')
const priorFinal = read(path.join(first, 'final-verification.json'), 'reused first final verification')
const freeze = read(path.join(author, 'author-freeze.json'), 'original author freeze',
  'fe0aa7ca135a8b7e337b95a1e84cb7c698c437552906ad61f04d9942e85d8ea9')
const repaired = read(path.join(repair, 'repair-report.json'), 'repair report',
  '2d5dd9e6768d016a60ccc7b4a73f7cf184c82db79c5cbca4113f25ed22106b8a')
bind(path.join(repair, 'freeze-once.mjs'), 'saved repair helper, read only, never executed')
const failure = read(path.join(root, repaired.firstExecutionFailure.path), 'preserved FIRST helper failure',
  repaired.firstExecutionFailure.sha256)
check('FIRST review scope and failures preserved', () => {
  assert.equal(prior.reviewRound, 'FIRST')
  assert.deepEqual([prior.perLocale.zh.SCI, prior.perLocale.zh.ZHEN,
    prior.perLocale.en.SCI, prior.perLocale.en.ZHEN], ['FAIL', 'PASS', 'FAIL', 'FAIL'])
  assert.ok(priorIntegrity.allChecksPassed)
  assert.equal(priorIntegrity.checks.length, 75)
  assert.ok(priorFinal.allInputsUnchanged)
})
check('reuse n85 footnote ownership, no new source block required', () => {
  const finding = prior.findings.find(item => item.id === 'SOURCE-N86-FOOTNOTE-OWNERSHIP')
  assert.equal(finding.status, 'RESOLVED-N85-OWNED-NOT-N86-OMISSION')
  assert.equal(finding.sourceRef, 'p0228#10')
})
check('one cumulative repair; four saved calls; helper failure is not content approval', () => {
  assert.equal(repaired.contentRepairsNew, 1)
  assert.equal(repaired.cumulativeContentRepairs, 1)
  assert.equal(repaired.nativeNewCalls, 4)
  assert.equal(repaired.completedChineseNormalizationReused, true)
  assert.equal(failure.actualNativeCallsBeforeFailure, 1)
  assert.equal(failure.exitCode, 1)
  assert.equal(failure.contentApproval, false)
  assert.ok(failure.failure.includes('zh/figures.template.json'))
  assert.equal(failure.images, 0)
  assert.equal(failure.paidCalls, 0)
})
bind(path.join(root, repaired.firstReview.path), 'repair binds FIRST review', repaired.firstReview.sha256)
const receiptNames = fs.readdirSync(path.join(repair, 'calls')).sort()
check('exactly four saved normalization/flow receipts', () => assert.deepEqual(receiptNames, [
  'en-affected-normalization.json', 'en-prose-flow.json',
  'zh-affected-normalization.json', 'zh-prose-flow.json',
]))

const locales = {}
for (const packet of repaired.packets) {
  const locale = packet.locale
  const old = read(path.join(root, packet.original.path), `${locale} original candidate`, packet.original.sha256)
  const authored = read(path.join(root, packet.authoredInput.path), `${locale} authored repair input`, packet.authoredInput.sha256)
  const candidate = read(path.join(root, packet.candidate.path), `${locale} frozen repaired candidate`, packet.candidate.sha256)
  const wanted = ['/prose/0/text', '/prose/4/text', '/prose/5/text']
  if (locale === 'en') wanted.unshift('/title')
  const changed = differences(old, candidate)
  check(`${locale}: exactly the authorized changed pointers, no metadata/source/break drift`, () => {
    assert.deepEqual(changed, wanted)
    assert.deepEqual(differences(old, authored), wanted)
    assert.deepEqual(old.source, candidate.source)
    assert.deepEqual(old.section_breaks, candidate.section_breaks)
    const binding = freeze.candidates.find(item => item.path === path.join(root, packet.original.path))
    assert.equal(binding.sha256, packet.original.sha256)
  })
  for (let i = 0; i < old.prose.length; i++) {
    check(`${locale} /prose/${i}: exact ordered formulas and Arabic numeral sequence unchanged`, () => {
      const formulas = text => [...text.matchAll(/\$[^$]*\$/g)].map(match => match[0])
      const numbers = text => text.match(/\d+(?:\.\d+)?/g) || []
      assert.deepEqual(formulas(candidate.prose[i].text), formulas(old.prose[i].text))
      assert.deepEqual(numbers(candidate.prose[i].text), numbers(old.prose[i].text))
    })
  }
  const originalExercises = path.join(author, 'candidate', locale, 'exercises.template.json')
  const exerciseBinding = freeze.candidates.find(item => item.path === originalExercises)
  bind(originalExercises, `${locale} original exercises`, exerciseBinding.sha256)
  bind(path.join(repair, locale, 'exercises.template.json'), `${locale} authored exercises`, exerciseBinding.sha256)
  bind(path.join(repair, 'frozen', locale, 'exercises.template.json'), `${locale} frozen exercises`, exerciseBinding.sha256)

  const normalization = read(path.join(repair, 'calls', `${locale}-affected-normalization.json`),
    `${locale} saved normalization receipt`)
  const flowReceipt = read(path.join(repair, 'calls', `${locale}-prose-flow.json`), `${locale} saved flow receipt`)
  const normalized = JSON.parse(normalization.stdout)
  const flow = JSON.parse(flowReceipt.stdout)
  check(`${locale}: successful saved normalization output equals frozen object`, () => {
    assert.equal(normalization.cwd, root)
    assert.equal(normalization.exitCode, 0)
    assert.equal(normalization.stderr, '')
    assert.ok(normalization.command[3].includes('for i in [0,4,5]'))
    assert.deepEqual(normalized, candidate)
    const restored = structuredClone(normalized)
    for (const i of [0, 4, 5]) restored.prose[i].text = authored.prose[i].text
    assert.deepEqual(restored, authored)
  })
  check(`${locale}: saved final flow covers exact current prose and adjacent break anchors`, () => {
    assert.equal(flowReceipt.cwd, root)
    assert.equal(flowReceipt.exitCode, 0)
    assert.equal(flowReceipt.stderr, '')
    assert.deepEqual(flowReceipt.command, [
      'node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', path.join(root, packet.candidate.path),
    ])
    for (const [i, block] of candidate.prose.entries()) {
      if (block.kind !== 'p') continue
      assert.equal(flow.paragraphs.filter(item => item.blockIndex === i).map(item => item.text).join('\n\n'), block.text)
    }
    assert.deepEqual(flow.boundaries, packet.flowBoundaries)
    assert.deepEqual(flow.resolvedBreaks, flow.boundaries.map(item => item.index))
    for (const anchor of candidate.section_breaks) {
      const boundary = flow.boundaries.find(item => item.before === anchor.before && item.after === anchor.after)
      assert.ok(boundary)
      assert.equal(flow.paragraphs[boundary.index - 1].text, anchor.before)
      assert.equal(flow.paragraphs[boundary.index].text, anchor.after)
    }
  })
  locales[locale] = {
    changedPointers: changed,
    original: packet.original,
    authoredInput: packet.authoredInput,
    frozenCandidate: packet.candidate,
    savedNormalizationOutputSha256: digest(normalization.stdout),
    savedFlowOutputSha256: digest(flowReceipt.stdout),
    savedFlowParagraphs: flow.paragraphs.length,
    savedResolvedBreaks: flow.resolvedBreaks,
    formulasAndNumberSequencesUnchanged: true,
    sourceSnapshotsAndSectionBreakAnchorsUnchanged: true,
    exercisesByteIdentical: true,
  }
}
const allChecksPassed = checks.every(item => item.passed)
save('input-integrity.json', {
  schema: 'STEMROBIN-181/d818-affected-integrity@1',
  root,
  writeRoot: out,
  status: allChecksPassed ? 'PASS' : 'FAIL',
  scope: 'Structured isolation and saved-receipt lineage only; no whole-text semantic review, native execution or source/image replay.',
  allChecksPassed,
  bindings: [...bindings.values()],
  checks,
  locales,
  actualNewNativeCalls: 0,
  actualNewFlowCalls: 0,
  images: 0,
  paidCalls: 0,
})
console.log(JSON.stringify({ status: allChecksPassed ? 'PASS' : 'FAIL', checks: checks.length,
  inputs: bindings.size, locales, failures: checks.filter(item => !item.passed) }, null, 2))
process.exitCode = allChecksPassed ? 0 : 1
