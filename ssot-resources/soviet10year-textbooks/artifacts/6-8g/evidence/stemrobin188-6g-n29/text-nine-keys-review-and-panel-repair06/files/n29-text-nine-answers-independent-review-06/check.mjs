import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const R = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owner = path.dirname(new URL(import.meta.url).pathname)
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex')
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const objectHash = (value) => hash(JSON.stringify(value))
const fileFacts = (filename) => {
  const bytes = fs.readFileSync(filename)
  const stat = fs.statSync(filename)
  return {
    path: filename,
    sha256: hash(bytes),
    bytes: bytes.length,
    mode: `0${(stat.mode & 0o777).toString(8)}`,
  }
}
const firstPath = path.join(owner, 'FIRST.json')
const firstFacts = fileFacts(firstPath)
assert.equal(firstFacts.mode, '0444')
assert.equal(firstFacts.sha256, '23443f14194fdd0bcfedd98f5225f4c316e2b40b680db2ab4f1f5f7fbdfe26ef')
const first = read(firstPath)
const sourceManifestPath = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n29-text-answer-independent-FIRST-inputs-06/source-only/originals.json')
const postManifestPath = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n29-text-answer-independent-FIRST-inputs-06/post-FIRST/candidates.json')
const source = read(sourceManifestPath)
const post = read(postManifestPath)
const rawLesson = read(source.sourceLesson.path)
const rawExercises = read(source.sourceExercises.path)
const lesson = read(post.candidates.lesson.path)
const exercises = read(post.candidates.exercises.path)
const keys = read(post.candidates.answerKeys.path)
assert.deepEqual(lesson.source.data, rawLesson)
assert.deepEqual(exercises.source.data, rawExercises)
assert.equal(lesson.source.sha256, source.sourceLesson.sha256)
assert.equal(exercises.source.sha256, source.sourceExercises.sha256)
assert.equal(lesson.source.path, 'lessons/geo68-c2-s4-n29/lesson.json')
assert.equal(exercises.source.path, 'lessons/geo68-c2-s4-n29/exercises.json')
for (const [field, value] of Object.entries(rawLesson)) {
  if (field !== 'prose') assert.deepEqual(lesson[field], value, `lesson.${field}`)
}
assert.equal(lesson.prose.length, 23)
assert.equal(exercises.exercises.length, 9)
assert.equal(exercises.count, 9)
assert.equal(exercises.lesson, rawExercises.lesson)
assert.equal(keys.answers.length, 9)
assert.equal(keys.lesson, lesson.id)
assert.equal(keys.book, '6-8g')
assert.equal(keys.edition, 'modern-us-neutral')
assert.deepEqual(keys.answers.map((key) => key.exercise), first.solutions.map((item) => item.exercise))

const lessonRequire = createRequire(path.join(R, '.claude/skills/ld-s10y-lesson/package.json'))
const appRequire = createRequire(path.join(R, 'app/package.json'))
const katex = lessonRequire('katex')
const frag = lessonRequire('./tools/htmlfrag.js')
const { ComputeEngine } = appRequire('@cortex-js/compute-engine')
const engine = new ComputeEngine()
const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((m) => m[1] ?? m[2])
const normalizedMath = (text) => math(text).map((tex) => tex.replace(/\s+/g, ''))
const outsideMath = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, '')
const numbers = (text) => outsideMath(text).match(/[0-9]+(?:\.[0-9]+)*/g) ?? []
const cyrillic = (text) => [...text.matchAll(/\p{Script=Cyrillic}/gu)].map((m) => ({
  value: m[0], codepoint: `U+${m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`, offset: m.index,
}))
const syntax = (text, prose = false) => {
  assert(!outsideMath(text).includes('$'), 'unbalanced math delimiter')
  const spans = math(text)
  for (const tex of spans) {
    assert(!/[、，；。？！：]/u.test(tex), 'Chinese punctuation in math')
    katex.renderToString(tex, { throwOnError: true, strict: 'error' })
  }
  const html = prose ? frag.proseInline(text) : frag.inline(text)
  assert(!/katex-error|sr-tex-err/.test(html))
  assert(!/<(?:img|svg|canvas|video|audio)\b/i.test(html))
  return { mathSpans: spans, mathSpanCount: spans.length, renderedHtmlBytes: Buffer.byteLength(html), error: null }
}

const proseChecks = lesson.prose.map((block, index) => {
  const raw = rawLesson.prose[index]
  for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
    assert.deepEqual(block[field], raw[field], `prose[${index}].${field}`)
  }
  assert.equal(block.source_text, raw.text)
  assert.deepEqual(normalizedMath(block.text), normalizedMath(raw.text))
  assert.deepEqual(numbers(block.text), numbers(raw.text))
  assert(Array.isArray(block.changes) && block.changes.every((v) => typeof v === 'string'))
  assert.deepEqual(block.numeric_changes, [])
  assert.deepEqual(block.historical_entities, [])
  return {
    pointer: `/prose/${index}`,
    sourceRefs: raw.source_refs,
    kind: block.kind,
    objectJsonStringifySha256: objectHash(block),
    sourceTextSha256: hash(raw.text),
    candidateTextSha256: hash(block.text),
    sourceSnapshotUnchanged: true,
    identitiesUnchanged: true,
    formulaOrderUnchanged: true,
    outsideMathNumberOrderUnchanged: true,
    changes: block.changes,
    cyrillicTokens: cyrillic(block.text),
    syntax: syntax(block.text, block.kind === 'p'),
  }
})
const promptChecks = exercises.exercises.map((item, index) => {
  const raw = rawExercises.exercises[index]
  for (const field of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']) {
    assert.deepEqual(item[field], raw[field], `exercises[${index}].${field}`)
  }
  assert.equal(item.source_text, raw.text)
  assert.deepEqual(item.lines, item.text.split('\n'))
  assert.deepEqual(normalizedMath(item.text), normalizedMath(raw.text))
  assert.deepEqual(numbers(item.text), numbers(raw.text))
  assert.deepEqual(item.figure_refs, [])
  assert.deepEqual(item.numeric_changes, [])
  const subparts = [...item.text.matchAll(/(?:^|\n)([1-9]\d*)\)/g)].map((m) => Number(m[1]))
  if (subparts.length) assert.deepEqual(subparts, Array.from({ length: subparts.length }, (_, i) => i + 1))
  return {
    exercise: item.number,
    pointer: `/exercises/${index}`,
    objectJsonStringifySha256: objectHash(item),
    candidatePromptTextSha256: hash(item.text),
    sourcePromptTextSha256: hash(raw.text),
    sourceRefs: raw.pages,
    sourceMathSpans: math(raw.text),
    candidateMathSpans: math(item.text),
    immutableFieldsAndSourceSnapshotUnchanged: true,
    subparts,
    naturalOrderAndSeparateLines: true,
    syntax: syntax(item.text),
    givensMeaningReview: 'Recorded separately in Report.json; not inferred from these mechanical assertions.',
  }
})
const answerChecks = keys.answers.map((answer, index) => {
  const prompt = promptChecks[index]
  assert.equal(answer.exercise, prompt.exercise)
  assert.equal(answer.source, 'derived')
  assert(!('bookRaw' in answer))
  assert(typeof answer.displayAnswer === 'string' && answer.displayAnswer.trim())
  const tests = []
  if (index === 0) {
    assert.equal(answer.grading, 'auto')
    assert.equal(answer.parts.length, 3)
    const baseline = ['0', '2', '1']
    const positive = [
      ['0', '\\frac{0}{1}', '2-2'],
      ['2', '\\frac{4}{2}', '1+1'],
      ['1', '\\frac{2}{2}', '3-2'],
    ]
    const negative = [['1', '2', '-1'], ['0', '1', '3'], ['0', '2', '-1']]
    answer.parts.forEach((part, p) => {
      assert.equal(part.judge, 'numeric')
      assert.deepEqual(part.expected, [baseline[p]])
      assert.equal(part.label, `${p + 1}) 交点个数`)
      const target = engine.parse(part.expected[0])
      assert(!target.has('Error'))
      const n = target.N()
      assert(Number.isFinite(n.re) && n.im === 0)
      assert.equal(target.isEqual(engine.parse(baseline[p])), true)
      for (const [submitted, wanted] of [...positive[p].map((v) => [v, true]), ...negative[p].map((v) => [v, false])]) {
        const actual = engine.parse(submitted).isEqual(target) === true
        assert.equal(actual, wanted)
        tests.push({ part: p + 1, judge: part.judge, expected: part.expected, submitted, wanted, actual })
      }
    })
  } else {
    assert.equal(answer.grading, 'ungraded')
    assert.deepEqual(answer.parts, [])
  }
  return {
    exercise: answer.exercise,
    pointer: `/answers/${index}`,
    objectJsonStringifySha256: objectHash(answer),
    displayAnswerSha256: hash(answer.displayAnswer),
    candidatePromptObjectSha256: prompt.objectJsonStringifySha256,
    candidatePromptTextSha256: prompt.candidatePromptTextSha256,
    sourcePromptTextSha256: prompt.sourcePromptTextSha256,
    sourceRefs: prompt.sourceRefs,
    promptFormulaBinding: prompt.candidateMathSpans,
    grading: answer.grading,
    source: answer.source,
    parts: answer.parts,
    syntax: syntax(answer.displayAnswer),
    numericTests: tests,
    judgeEvidenceScope: 'Installed ComputeEngine parse/isEqual path used by the numeric runtime; not browser, DB or server submission evidence.',
    independentProofReview: 'See FIRST.json and separate per-object verdicts in Report.json.',
  }
})

const flow = frag.proseFlow(lesson.prose, lesson.section_breaks)
const outline = frag.proseOutline(lesson.prose)
const indices = frag.sectionBreakIndices(lesson.prose, lesson.section_breaks)
assert.deepEqual(indices, [1, 5, 9, 12])
assert.equal(flow.filter((item) => item.kind === 'p').length, 17)
const marked = flow.filter((item) => item.kind === 'p' && item.sectionBreak).map((item) => item.text)
assert.deepEqual(marked, indices.map((index) => outline[index].text))
const facts = [
  fileFacts(sourceManifestPath), fileFacts(postManifestPath),
  fileFacts(source.sourceLesson.path), fileFacts(source.sourceExercises.path),
  ...Object.values(post.candidates).map((value) => fileFacts(value.path)),
]
for (const [key, value] of Object.entries(post.candidates)) {
  const actual = facts.find((fact) => fact.path === value.path)
  assert.equal(actual.sha256, value.sha256, `current candidate hash ${key}`)
  assert.equal(actual.bytes, value.bytes, `current candidate bytes ${key}`)
}
for (const value of [source.sourceLesson, source.sourceExercises]) {
  assert.equal(facts.find((fact) => fact.path === value.path).sha256, value.sha256)
}
const evidence = {
  schema: 'same188-6/n29-independent-text-only-comparison@1',
  createdAt: new Date().toISOString(),
  cwd: process.cwd(),
  scope: 'One N29 text/9-prompt/9-key comparison; no producer replay or full-package gate.',
  first: firstFacts,
  bindings: facts,
  sourceSnapshotsDeepEqual: true,
  proseChecks,
  promptChecks,
  answerChecks,
  proseFlowEvidence: {
    authoritativeModule: path.join(R, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
    function: 'proseFlow; proseOutline; sectionBreakIndices',
    previousDirectCliExecutionChunk: '57c9e2',
    previousDirectCliExitCode: 0,
    paragraphs: outline,
    resolvedBreaks: indices,
    boundaries: indices.map((index) => ({ index, before: outline[index - 1].text, after: outline[index].text })),
    actualFlowSectionBreakBeforeTexts: marked,
    actualFlowParagraphs: 17,
    pixelRenderingClaimed: false,
  },
  counters: {
    proseSlots: proseChecks.length,
    proseTextBlocks: proseChecks.filter((item) => item.kind === 'p').length,
    prompts: promptChecks.length,
    answerObjects: answerChecks.length,
    numericParts: 3,
    numericPositiveTests: 9,
    numericNegativeTests: 9,
    exactParts: 0,
    expectedEntriesChecked: 3,
    allTextMathSpansParsed: [...proseChecks, ...promptChecks, ...answerChecks].reduce((sum, item) => sum + item.syntax.mathSpanCount, 0),
    imagesOpened: 0,
    browserLoads: 0,
    screenshots: 0,
    networkCalls: 0,
    databaseCalls: 0,
    paidCalls: 0,
    producerReplays: 0,
    ownRunningSessions: 0,
  },
  documentationLimitation: {
    first364FormulaBindingAnnotation: 'FIRST.solutions[0].formulaBinding inadvertently omitted the repeated a in its illustrative list. FIRST.originalPrompt preserves the complete exact source. The independently extracted ordered source and candidate spans above both contain all seven spans, including repeated a and O. This annotation omission was found post-FIRST, not repaired by altering sealed FIRST.',
    historicalFailedExerciseSnapshot: 'Not returned; not reconstructed. A retained failure record is not a full failed-candidate snapshot.',
  },
}
const output = path.join(owner, 'ComparisonEvidence.json')
fs.writeFileSync(output, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  output: fileFacts(output),
  counters: evidence.counters,
  answerObjects: answerChecks.map((item) => ({ exercise: item.exercise, sha256: item.objectJsonStringifySha256 })),
  cyrillicProseSlots: proseChecks.filter((item) => item.cyrillicTokens.length).map((item) => item.pointer),
}, null, 2))
