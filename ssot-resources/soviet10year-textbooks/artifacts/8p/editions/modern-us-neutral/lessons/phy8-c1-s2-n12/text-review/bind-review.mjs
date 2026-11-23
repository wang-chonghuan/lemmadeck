import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'

const workspace = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180'
assert.equal(process.cwd(), workspace, 'Wrong review workspace')
assert.ok(['--check', '--retain'].includes(process.argv[2]), 'Use --check or --retain')
const root = path.join(workspace, 'ssot-resources/soviet10year-textbooks/artifacts/8p')
const rawDir = path.join(root, 'lessons/phy8-c1-s2-n12')
const templateDir = path.join(workspace, '.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s2-n12')
const evidenceDir = path.join(root, 'editions/modern-us-neutral/lessons/phy8-c1-s2-n12/text-review')
const reportPath = path.join(workspace, '.intentfold/tickets/STEMROBIN-180/modern-text-review-8p-n12.md')
const require = createRequire(import.meta.url)
const { proseOutline, sectionBreakIndices } = require(path.join(workspace, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const identity = (filename) => {
  const bytes = fs.readFileSync(filename)
  return { path: filename, bytes: bytes.length, sha256: digest(bytes) }
}
const load = (filename, expected) => {
  const bytes = fs.readFileSync(filename)
  assert.equal(digest(bytes), expected, `Input changed: ${filename}`)
  return { bytes, file: identity(filename), data: JSON.parse(bytes) }
}
const rawLesson = load(path.join(rawDir, 'lesson.json'), '47574075fb85cb3836e5d1aa3467fe61fdbb033748ab1127a329fe2766ef28ee')
const rawExercises = load(path.join(rawDir, 'exercises.json'), '4534655da4c3dce4c6509d26ac85d01c849dc9093fc27152a52f2a52402324ba')
const templates = {
  lesson: load(path.join(templateDir, 'lesson.template.json'), '6ee35250cb574b2f66f27e4af0a2c0c117950214291140a65ca8e0025d85e784'),
  exercises: load(path.join(templateDir, 'exercises.template.json'), 'e0badba167e406aa999bcc2df9337415b4c0b7e77584e59aeac4d3b67971b30d'),
  figures: load(path.join(templateDir, 'figures.template.json'), '78474bccc5a58762829f89f0bee41fd990e13c482bf08a4ed2d0cdde0558e00c'),
}
const lesson = templates.lesson.data
const exercises = templates.exercises.data
const compact = (text) => text.replace(/\s+/gu, '')
const formulas = (text) => text.match(/\$[^$]+\$/gu) ?? []
const numbers = (text) => text.match(/\d+(?:\.\d+)?/gu) ?? []
const objectSha = (value) => digest(Buffer.from(JSON.stringify(value)))
const inheritedPaths = [
  '.intentfold/tickets/STEMROBIN-180/source-review-8p-n12-recovery.md',
  '.intentfold/tickets/STEMROBIN-180/source-review-8p-n12-native62-typography.md',
  '.intentfold/tickets/STEMROBIN-180/source-review-8p-6364.md',
  '.intentfold/tickets/STEMROBIN-180/source-8p6364-promoted.md',
  'ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-n12/source-review/bindings.json',
  'ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-n12/source-review/finalized-bindings.json',
  'ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-n12/source-review/native62-typography/bindings.json',
]
const inherited = inheritedPaths.map((filename) => identity(path.join(workspace, filename)))
assert.equal(inherited[0].sha256, '1734e547c2500ce97762616a3b55273150d8d0f400757444154bc53d5dd6714e')
assert.equal(inherited[1].sha256, '154eb74fbd34b257575bec74ef55f15b0110bc05bb2ccde345029680fff12a63')
const nativeBinding = JSON.parse(fs.readFileSync(inherited.at(-1).path))
const page61 = nativeBinding.pages.find((page) => page.page === 61)
assert.equal(nativeBinding.imageLedger.cumulative, 11)
assert.equal(page61.matchesPriorBodyAndFormulas, true)
assert.equal(lesson.prose.length, 39)
assert.equal(rawLesson.data.prose.length, 39)
assert.equal(exercises.count, 8)
assert.equal(exercises.exercises.length, 8)
assert.equal(rawExercises.data.exercises.length, 8)
for (const [template, raw, relative] of [
  [lesson, rawLesson, 'lessons/phy8-c1-s2-n12/lesson.json'],
  [exercises, rawExercises, 'lessons/phy8-c1-s2-n12/exercises.json'],
]) {
  assert.equal(template.source.path, relative)
  assert.equal(template.source.sha256, raw.file.sha256)
  assert.deepEqual(template.source.data, raw.data)
}
for (const [key, value] of Object.entries(rawLesson.data)) {
  if (key !== 'prose') assert.deepEqual(lesson[key], value, `Lesson metadata: ${key}`)
}
assert.equal(lesson.errata.length, 1)
const erratum = lesson.errata[0]
assert.equal(erratum.id, 'p0061-projection-norm-1')
assert.equal(erratum.target, 'lesson.prose[20]')
assert.equal(erratum.source.page, 61)
assert.equal(erratum.source.printed_page, 49)
assert.equal(erratum.source.block, page61.erratum.block)
assert.equal(erratum.source.sha256, page61.json.sha256)
assert.equal(erratum.original, page61.erratum.original)
assert.equal(erratum.reason, page61.erratum.reason)
assert.equal(erratum.source.pdf_sha256, '4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46')
assert.equal(erratum.corrected, '\u5b83\u4eec\u6295\u5f71\u7684\u7edd\u5bf9\u503c\u5206\u522b\u7b49\u4e8e\u5404\u4e2a\u77e2\u91cf\u81ea\u8eab\u7684\u5927\u5c0f\uff08\u539f\u4e66\u6b64\u5904\u628a\u5355\u4e2a\u77e2\u91cf\u8bef\u5199\u4e3a\u77e2\u91cf\u548c\uff09')
const strongJoinIndices = [3, 6, 13, 21]
const proseChecks = lesson.prose.map((modern, index) => {
  const raw = rawLesson.data.prose[index]
  assert.equal(modern.source_text, raw.text)
  for (const [key, value] of Object.entries(raw)) {
    if (key !== 'text') assert.deepEqual(modern[key], value, `Prose ${index}: ${key}`)
  }
  assert.deepEqual(modern.numeric_changes, [])
  assert.deepEqual(modern.historical_entities, [])
  let expected = raw.text
  if (strongJoinIndices.includes(index)) {
    assert.equal(expected.split('****').length, 2, `Strong join ${index}`)
    expected = expected.replace('****', '')
  }
  if (index === 20) {
    assert.equal(expected.split(erratum.original).length, 2)
    expected = expected.replace(erratum.original, erratum.corrected)
    assert.deepEqual(modern.changes, ['math-correction'])
  } else {
    assert.deepEqual(modern.changes, modern.text === raw.text ? [] : ['layout'])
  }
  assert.equal(compact(modern.text), compact(expected), `Substantive prose change ${index}`)
  assert.deepEqual(formulas(modern.text), formulas(raw.text), `Formula change ${index}`)
  assert.deepEqual(numbers(modern.text), numbers(raw.text), `Number change ${index}`)
  return {
    index, source_refs: modern.source_refs, verdict: 'PASS',
    sourceTextSha256: objectSha(raw.text), approvedTextSha256: objectSha(modern.text),
    formulasSha256: objectSha(formulas(raw.text)), numbersSha256: objectSha(numbers(raw.text)),
    changes: modern.changes, strongJoin: strongJoinIndices.includes(index),
  }
})
assert.deepEqual(lesson.prose[14].source_refs, ['p0060#9', 'p0061#1'])
assert.equal(lesson.prose[15].label, 'source-footnote-p0060-1')
assert.deepEqual(lesson.prose[15].source_refs, ['p0060#10'])
const exerciseChecks = exercises.exercises.map((modern, index) => {
  const raw = rawExercises.data.exercises[index]
  for (const [key, value] of Object.entries(raw)) {
    if (key !== 'lines') assert.deepEqual(modern[key], value, `Question ${index + 1}: ${key}`)
  }
  assert.equal(modern.number, String(index + 1))
  assert.equal(modern.source_text, raw.text)
  assert.deepEqual(modern.lines, [raw.text])
  assert.deepEqual(modern.changes, [])
  assert.deepEqual(modern.numeric_changes, [])
  assert.deepEqual(modern.historical_entities, [])
  return {
    number: modern.number, group_id: modern.group_id, pages: modern.pages,
    verdict: 'PASS_COMPLETE_QUESTION_TEXT_ONLY',
    textSha256: objectSha(raw.text), formulasSha256: objectSha(formulas(raw.text)),
    numbersSha256: objectSha(numbers(raw.text)), sourceTextExact: true,
  }
})
assert.deepEqual(exercises.exercises[7].pages, ['p0065#1'])
assert.deepEqual(lesson.figures, [])
assert.deepEqual(templates.figures.data.figures, [])
for (const item of Object.values(templates)) {
  assert.equal(item.data.status, 'draft')
  assert.equal(item.data.edition, 'modern-us-neutral')
}
const paragraphs = proseOutline(lesson.prose)
const resolvedBreaks = sectionBreakIndices(lesson.prose, lesson.section_breaks)
assert.equal(paragraphs.length, 48)
assert.deepEqual(resolvedBreaks, [2, 10, 16, 21, 26, 31, 40])
const boundaries = resolvedBreaks.map((index) => ({
  index, before: paragraphs[index - 1].text, after: paragraphs[index].text,
}))
assert.deepEqual(lesson.section_breaks, boundaries.map(({ before, after }) => ({ before, after })))
const flow = { paragraphs, resolvedBreaks, boundaries }
const inputFiles = [rawLesson.file, rawExercises.file, ...Object.values(templates).map((item) => item.file)]
for (const file of [...inputFiles, ...inherited]) assert.deepEqual(identity(file.path), file, 'Concurrent input drift')
const summary = {
  verdict: 'PASS', proseObjects: 39, wholeWrittenQuestions: 8, figures: 0,
  finalTextParagraphs: 48, exactAdjacentBoundaries: 7,
  firstParagraphAfterSeparatorZeroBased: resolvedBreaks,
  sourceSnapshotsExact: true, allSourceTextsExact: true, formulasAndNumbersExact: true,
  strongJoinIndices, substantiveChangeTargets: [erratum.target],
  newImages: 0, cumulativeImages: 11, imageLimit: 24,
}
if (process.argv[2] === '--retain') {
  const outputs = []
  for (const [name, item] of Object.entries(templates)) {
    const filename = path.join(evidenceDir, `approved-${name}.snapshot.json`)
    fs.writeFileSync(filename, item.bytes, { flag: 'wx', mode: 0o444 })
    fs.chmodSync(filename, 0o444)
    assert.equal(identity(filename).sha256, item.file.sha256)
    outputs.push({ source: item.file, snapshot: identity(filename), mode: '0444', evidenceOnly: true })
  }
  const flowPath = path.join(evidenceDir, 'prose-flow.json')
  fs.writeFileSync(flowPath, `${JSON.stringify(flow, null, 2)}\n`, { flag: 'wx' })
  const binding = {
    schema: 'ld-s10y-lesson/modern-text-review-evidence@1',
    workspace, exportedAt: new Date().toISOString(), summary,
    report: identity(reportPath), script: identity(path.join(evidenceDir, 'bind-review.mjs')),
    rawInputs: [rawLesson.file, rawExercises.file], approvedTemplates: outputs,
    proseChecks, exerciseChecks, flow: identity(flowPath), reusedSourceEvidence: inherited,
    erratum: { ...erratum, verdict: 'PASS_SOURCE_BOUND_MODERN_CORRECTION', sourceBodyIdentityInherited: true, pdfIdentityInheritedNotRehashed: true },
    scope: 'Modern lesson text and complete written-question text only; no solving, display, finalization or publication approval.',
    imageLedger: { prior: 11, new: 0, cumulative: 11, limit: 24, reopens: 0, payloadsReturned: 0 },
    historicalFailureCountReset: false, historicalCostReset: false,
    historicalCost: nativeBinding.historicalCostReset === false ? 'Unchanged; unknown remains unknown.' : null,
    paidRequests: 0, sourceOrTemplateEdits: 0, pipelineWriteCalls: 0,
    discoveryHistory: [
      { event: 'Earlier scoped modern lesson directory listing before creation', exitCode: 2, contentFailure: false },
      { event: 'Two image-batch heading searches with no matches; resolved by direct skill read', exitCode: 1, occurrences: 2, contentFailure: false },
    ],
  }
  const bindingPath = path.join(evidenceDir, 'bindings.json')
  fs.writeFileSync(bindingPath, `${JSON.stringify(binding, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify({ ...summary, report: binding.report, bindings: identity(bindingPath), snapshots: outputs.map((item) => item.snapshot) }, null, 2))
} else {
  console.log(JSON.stringify(summary, null, 2))
}
