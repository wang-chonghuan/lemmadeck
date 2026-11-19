import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), cwd)
const B = path.join(cwd, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12')
const out = path.join(B, 'n38-n39-modern-review/reports')
const authorFile = path.join(B, 'n38-n39-modern-author/reports/return.json')
const authorHash = 'bac1d480693f4f98b2fce64bbb5ca1d28510faee1f2ed1a5c1a942085dbe5262'
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const sha = (p) => createHash('sha256').update(fs.readFileSync(p)).digest('hex')
assert.equal(sha(authorFile), authorHash)
const author = read(authorFile)
const failures = []
function check(condition, label) {
  if (!condition) failures.push(label)
  return condition
}
const inputBindings = new Map()
function bind(file, expected, role) {
  assert(file.startsWith(`${cwd}/`))
  assert(!/\.(?:png|jpg|jpeg|webp|svg|pdf)$/i.test(file))
  const actual = sha(file)
  check(!expected || actual === expected, `hash: ${file}`)
  const item = {
    path: file, sha256: actual, expectedSha256: expected ?? null,
    match: !expected || actual === expected,
    mode: (fs.statSync(file).mode & 0o777).toString(8), role,
  }
  inputBindings.set(file, item)
  return item
}
bind(authorFile, authorHash, 'caller-bound-author-return')
for (const item of author.rawFiles) bind(item.path, item.sha256, 'approved-raw-source')
for (const item of author.currentTemplates) bind(item.path, item.sha256, 'current-template')
for (const item of author.snapshots) {
  const bound = bind(item.path, item.sha256, 'immutable-author-snapshot')
  check(bound.mode === '444', `snapshot not read-only: ${item.path}`)
}
for (const item of author.n38.outputs.filter((x) => !x.path.endsWith('/book.json'))) {
  bind(item.path, item.sha256, 'current-n38-finalized-output')
  if (item.snapshot) check(sha(item.path) === sha(item.snapshot), `final snapshot: ${item.path}`)
}
for (const item of author.n38.receipts) {
  bind(item.path, item.sha256, 'retained-finalizer-receipt')
  const receipt = read(item.path)
  check(receipt.cwd === cwd && receipt.exit === item.exit, `receipt: ${item.label}`)
  for (const stream of item.streams) bind(stream.path, stream.sha256, 'retained-finalizer-stream')
  for (const stream of receipt.streams) {
    check(sha(path.resolve(cwd, stream.path)) === stream.sha256, `receipt stream: ${stream.path}`)
  }
}
const firstFailure = path.join(B, 'n38-n39-modern-author/reports/first-finalize-failure.json')
bind(firstFailure, author.reports.find((x) => x.path === firstFailure)?.sha256, 'first-failure-manifest')
for (const item of read(firstFailure).files) {
  check(sha(item.snapshot) === item.sha256, `first failure snapshot: ${item.snapshot}`)
}
const flowTool = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
bind(flowTool, null, 'existing-read-only-flow-command')
bind(path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'), null, 'authoritative-flow-parser')
bind(path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/edition.py'), null, 'read-only-period-contract-inspection')
const formulas = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((x) => x[1] ?? x[2])
// This scanner includes numbers followed by sentence periods, independently of the producer signature.
const numbers = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, '').match(/\d+(?:\.\d+)?/g) ?? []
const mathNumbers = (text) => formulas(text).flatMap((x) => x.match(/\d+(?:\.\d+)?/g) ?? [])
const visible = (item) => item.text
const metadataWithout = (item, keys) => Object.fromEntries(Object.entries(item).filter(([key]) => !keys.includes(key)))
function differences(a, b, pointer = '') {
  if (isDeepStrictEqual(a, b)) return []
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap((key) => differences(a[key], b[key], `${pointer}/${key}`))
  }
  return [{ pointer, first: a ?? null, current: b ?? null }]
}
const targets = {}
for (const n of [38, 39]) {
  const id = `alg7-c4-s2-n${n}`
  const rawDir = path.join(B, `n38-n39-source-stage/artifacts/7a/lessons/${id}`)
  const templateDir = path.join(B, `n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/${id}`)
  const preparedDir = path.join(B, `n38-n39-modern-author/snapshots/PREPARED/${id}`)
  const finalDir = path.join(B, `n38-n39-source-stage/artifacts/7a/editions/modern-us-neutral/lessons/${id}`)
  const modernDir = n === 38 ? finalDir : templateDir
  const rawLesson = read(path.join(rawDir, 'lesson.json'))
  const rawExercises = read(path.join(rawDir, 'exercises.json'))
  const lessonFile = path.join(modernDir, n === 38 ? 'lesson.json' : 'lesson.template.json')
  const exercisesFile = path.join(modernDir, n === 38 ? 'exercises.json' : 'exercises.template.json')
  const lesson = read(lessonFile)
  const exercises = read(exercisesFile)
  const preparedLesson = read(path.join(preparedDir, 'lesson.template.json'))
  const preparedExercises = read(path.join(preparedDir, 'exercises.template.json'))
  const rawKeys = Object.keys(rawLesson).filter((k) => k !== 'prose')
  for (const k of rawKeys) check(isDeepStrictEqual(rawLesson[k], lesson[k]), `${id} lesson identity ${k}`)
  check(lesson.prose.length === rawLesson.prose.length, `${id} prose count`)
  check(exercises.count === rawExercises.count && exercises.exercises.length === rawExercises.count, `${id} exercise count`)
  check(lesson.source.sha256 === sha(path.join(rawDir, 'lesson.json')), `${id} source lesson hash`)
  check(exercises.source.sha256 === sha(path.join(rawDir, 'exercises.json')), `${id} source exercises hash`)
  check(isDeepStrictEqual(lesson.source.data, rawLesson), `${id} source.data lesson`)
  check(isDeepStrictEqual(exercises.source.data, rawExercises), `${id} source.data exercises`)
  check(isDeepStrictEqual(lesson.source, preparedLesson.source), `${id} source snapshot lesson`)
  check(isDeepStrictEqual(exercises.source, preparedExercises.source), `${id} source snapshot exercises`)
  check(lesson.errata.length === 0, `${id} new errata`)
  const blockChecks = []
  const exerciseChecks = []
  for (const [collection, rawItems, modernItems, preparedItems, reports] of [
    ['prose', rawLesson.prose, lesson.prose, preparedLesson.prose, blockChecks],
    ['exercises', rawExercises.exercises, exercises.exercises, preparedExercises.exercises, exerciseChecks],
  ]) {
    for (let index = 0; index < rawItems.length; index++) {
      const r = rawItems[index], m = modernItems[index], p = preparedItems[index]
      const label = `${id} ${collection}[${index}]`
      const result = {
        index, number: r.number ?? null, sourceRefs: r.source_refs ?? r.pages,
        sourceTextExact: isDeepStrictEqual(m.source_text, r.text) && isDeepStrictEqual(m.source_text, p.source_text),
        preparedLinesExact: isDeepStrictEqual(m.lines, p.lines),
        rawLinesExact: isDeepStrictEqual(m.lines, r.lines),
        identityExact: isDeepStrictEqual(
          metadataWithout(r, ['text', 'lines']),
          metadataWithout(m, ['text', 'lines', 'source_text', 'changes', 'numeric_changes', 'historical_entities']),
        ),
        formulaArrayExact: isDeepStrictEqual(formulas(r.text), formulas(m.text)),
        nonFormulaNumeralsExact: isDeepStrictEqual(numbers(r.text), numbers(m.text)),
        formulaNumeralsExact: isDeepStrictEqual(mathNumbers(r.text), mathNumbers(m.text)),
        rawNonFormulaNumerals: numbers(r.text), modernNonFormulaNumerals: numbers(m.text),
        formulaCount: formulas(m.text).length,
        numericChangesEmpty: m.numeric_changes.length === 0,
        noMathCorrection: !m.changes.includes('math-correction'),
        visibleCyrillicAbsent: !/[\u0400-\u04ff]/.test(visible(m)),
        noManualMarkup: !/<\/?(?:span|div|p|img)\b/i.test(visible(m)),
        mathCjkPunctuationAbsent: formulas(m.text).every((x) => !/[、，；。？！：]/.test(x)),
      }
      for (const [key, value] of Object.entries(result)) {
        if (typeof value === 'boolean' && key !== 'rawLinesExact') check(value, `${label} ${key}`)
      }
      if (collection === 'exercises') {
        const rawLabels = [...r.text.matchAll(/(?:^|[\s：:；;。．.]|\$)([а-я]|[a-z])\)/g)].map((x) => x[1])
        const modernLabels = [...m.text.matchAll(/^([a-z])\)/gm)].map((x) => x[1])
        const methodLabels = [...m.text.matchAll(/^(\d)\)/gm)].map((x) => x[1])
        result.rawSubparts = rawLabels
        result.latinSubparts = modernLabels
        result.methodLabels = methodLabels
        const expected = Array.from({ length: rawLabels.length }, (_, i) => String.fromCharCode(97 + i))
        check(isDeepStrictEqual(modernLabels, expected), `${label} ordered Latin subparts`)
        if (r.number === '812') check(isDeepStrictEqual(methodLabels, ['1', '2']), `${label} retained methods 1/2`)
        check(!/[\u3000]/.test(m.text), `${label} fullwidth column separator`)
      }
      reports.push(result)
    }
  }
  const proc = spawnSync(process.execPath, [flowTool, '--json', lessonFile], {
    cwd, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' },
  })
  assert.equal(proc.status, 0, proc.stderr)
  const flow = JSON.parse(proc.stdout)
  check(flow.paragraphs.length === (n === 38 ? 22 : 28), `${id} authoritative paragraph count`)
  check(isDeepStrictEqual(flow.resolvedBreaks, n === 38 ? [2, 8, 12, 16] : [7, 10, 12, 27]), `${id} actual flow boundaries`)
  if (n === 38) {
    const audit = read(path.join(finalDir, 'adaptation.audit.json'))
    check(audit.status === 'pass' && audit.errors.length === 0, `${id} retained recovery audit`)
    check(isDeepStrictEqual(audit.resolvedSectionBreaks, flow.boundaries), `${id} audit boundary parity`)
    for (const f of ['lesson', 'exercises']) {
      const template = read(path.join(templateDir, `${f}.template.json`))
      const final = read(path.join(finalDir, `${f}.json`))
      check(isDeepStrictEqual(metadataWithout(template, ['status']), metadataWithout(final, ['status'])), `${id} template-final parity ${f}`)
    }
  } else check(!fs.existsSync(finalDir), `${id} expected unfinalized folder absence`)
  const figureFile = path.join(modernDir, n === 38 ? 'figures.json' : 'figures.template.json')
  const figures = read(figureFile)
  check(figures.figures.length === (n === 38 ? 0 : 1), `${id} figure metadata count only`)
  if (n === 39) {
    check(isDeepStrictEqual(figures, read(path.join(preparedDir, 'figures.template.json'))), `${id} figure placeholder untouched`)
    check(isDeepStrictEqual(exercises.exercises.at(-1).figure_refs, ['fig-55']), `${id} 819 figure reference`)
  }
  targets[id] = {
    sourceLesson: path.join(rawDir, 'lesson.json'), sourceExercises: path.join(rawDir, 'exercises.json'),
    modernLesson: lessonFile, modernExercises: exercisesFile, figureMetadata: figureFile,
    proseBlocks: lesson.prose.length, exerciseCount: exercises.exercises.length,
    exerciseNumbers: exercises.exercises.map((x) => x.number),
    blockChecks, exerciseChecks, flow,
  }
}
const recoveryDiffs = {}
for (const f of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
  recoveryDiffs[f] = differences(
    read(path.join(B, `n38-n39-modern-author/snapshots/FIRST-BOUNDARIES/alg7-c4-s2-n38/${f}`)),
    read(path.join(B, `n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n38/${f}`)),
  )
}
check(isDeepStrictEqual(recoveryDiffs['lesson.template.json'].map((x) => x.pointer),
  ['/prose/6/text', '/prose/9/text', '/section_breaks/1/before']), 'n38 recovery lesson scope')
check(isDeepStrictEqual(recoveryDiffs['exercises.template.json'].map((x) => x.pointer),
  ['/exercises/0/text', '/exercises/1/text', '/exercises/3/text']), 'n38 recovery exercise scope')
check(recoveryDiffs['figures.template.json'].length === 0, 'n38 recovery figure metadata unchanged')
const approximateCases = [
  ['n38:7.34 square', 7.34 ** 2, 53.88, 0.005, 'explicit rounding bound'],
  ['n38:2.34 square', 2.34 ** 2, 5.476, 0.0005, 'direct four-significant-digit value'],
  ['n38:2.342 square', 2.342 ** 2, 5.485, 0.0005, 'correction adds nine thousandths'],
  ['n38:8.437 square', 8.437 ** 2, 71.18, 0.005, 'rounded argument, then table'],
  ['n38:8.4372 square', 8.4372 ** 2, 71.18, null, 'input rounding adds error; text does not claim a half-unit bound for this input'],
  ['n38:0.357 square', 0.357 ** 2, 0.1274, 0.00005, 'square scaling by 10^-2'],
  ['n38:432.7 square', 432.7 ** 2, 18.72 * 10 ** 4, 50, 'square scaling by 10^4'],
  ['n39:sqrt5.6', Math.sqrt(5.6), 2.366, 0.0005, 'example 1'],
  ['n39:sqrt23.5', Math.sqrt(23.5), 4.848, 0.0005, 'example 2'],
  ['n39:sqrt45.3', Math.sqrt(45.3), 6.731, 0.0005, 'example 3 rounded base'],
  ['n39:sqrt45.34', Math.sqrt(45.34), 6.734, 0.0005, 'source-inherited corrected result contradicts universal half-unit claim'],
  ['n39:sqrt7.82', Math.sqrt(7.82), 2.796, 0.0005, 'explicit precision example'],
  ['n39:sqrt2.45', Math.sqrt(2.45), 1.565, 0.0005, 'already-correct approved source'],
  ['n39:sqrt245', Math.sqrt(245), 15.65, 0.005, 'even-exponent scaling'],
  ['n39:sqrt56.3', Math.sqrt(56.3), 7.503, 0.0005, 'example 5 rounded base'],
  ['n39:sqrt56.34', Math.sqrt(56.34), 7.506, 0.0005, 'correction adds three thousandths'],
  ['n39:sqrt5634', Math.sqrt(5634), 75.06, 0.005, 'even-exponent scaling'],
  ['n39:sqrt0.235', Math.sqrt(0.235), 0.4848, 0.00005, 'negative even-exponent scaling'],
].map(([label, exact, approximation, halfUnit, context]) => ({
  label, exact, approximation, absoluteError: Math.abs(exact - approximation), halfUnit,
  withinHalfUnit: halfUnit === null ? null : Math.abs(exact - approximation) <= halfUnit, context,
}))
// Positive-root comparison against the lower permitted endpoint uses exact integer arithmetic.
const lowerEndpointNumerator = 67335n
const scale = 10000n
const lowerEndpointSquaredNumerator = lowerEndpointNumerator ** 2n
const radicandAtSameScale = 4534n * (scale ** 2n / 100n)
assert(lowerEndpointSquaredNumerator > radicandAtSameScale)
assert(6.731 + 0.003 === 6.734)
const precisionCounterexample = {
  target: 'alg7-c4-s2-n39', affectedProseIndices: [9, 10, 16],
  sourceRefs: ['p0238#4', 'p0238#5', 'p0238#11'],
  claim: 'Absolute error does not exceed half a unit in the retained last digit.',
  approximation: '6.734', halfUnit: '0.0005', lowerPermittedEndpoint: '6.7335',
  exactLowerEndpointSquare: '45.34002225', radicand: '45.34',
  exactComparisonNumerators: {
    lowerEndpointSquared: lowerEndpointSquaredNumerator.toString(),
    radicand: radicandAtSameScale.toString(), denominator: (scale ** 2n).toString(),
  },
  conclusion: 'sqrt(45.34) < 6.7335, so 6.734 - sqrt(45.34) > 0.0005 exactly.',
  classification: 'inherited precision-claim inconsistency; not transcription drift or a new registered erratum',
  sourceChanged: false, erratumAdded: false,
}
for (const [file, item] of inputBindings) check(sha(file) === item.sha256, `concurrent input drift: ${file}`)
const evidence = {
  schema: 'n38-n39-modern-review/text-math-probe@1', recordedAt: new Date().toISOString(),
  cwd, ticket: 'STEMROBIN-182', invocation: 'same existing invocation', finish: 'review',
  imageOpens: 0, imageCount: 0, imageFilesRead: 0, figureApproval: false,
  producerOrSuiteReruns: 0, flowCommandOnly: true,
  inputBindings: [...inputBindings.values()], invariantFailures: failures,
  targets, recoveryDiffs, approximateCases, precisionCounterexample,
  firstPreservation: {
    firstExit: read(author.n38.receipts[0].path).exit,
    recoveryExit: read(author.n38.receipts[1].path).exit,
    originalFailureAudit: path.join(B, 'n38-n39-modern-author/snapshots/FIRST-FAILURE/n38-adaptation.audit.json'),
    failuresRetained: read(path.join(B, 'n38-n39-modern-author/snapshots/FIRST-FAILURE/n38-adaptation.audit.json')).errors,
    firstSnapshotsReadOnly: [...inputBindings.values()].filter((x) => /snapshots\/(AUTHORED-FIRST|FIRST-BOUNDARIES|FIRST-FAILURE)\//.test(x.path)).every((x) => x.mode === '444'),
  },
  noAnswerKeysOrChoicesRead: true, noSourceWrites: true,
  noNetworkDatabaseAppDependenciesPublishInteractionCap3EMergeDeployClosureGitWritesAgentsChats: true,
}
fs.mkdirSync(out, { recursive: true })
const evidenceFile = path.join(out, 'text-math-probe.json')
assert(!fs.existsSync(evidenceFile), 'Preserve existing reviewer output; do not overwrite.')
fs.writeFileSync(evidenceFile, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  report: evidenceFile, sha256: sha(evidenceFile), checkedBindings: inputBindings.size,
  invariantFailures: failures, imageCount: 0, firstExit: 2, recoveryExit: 0,
  arithmeticCounterexamples: approximateCases.filter((x) => x.withinHalfUnit === false),
}, null, 2))
if (failures.length) process.exitCode = 2
