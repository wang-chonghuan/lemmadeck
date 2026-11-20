import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const output = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n41-modern-text-review')
const core = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const tmp = '.intentfold/tickets/STEMROBIN-188/tmp'
const work = `${tmp}/g10-n41`
const lessonId = 'geo910-c1-s3-n41'
const candidateDir = `${work}/work/adapt/9-10g/modern-us-neutral/lessons/${lessonId}`
const bindings = new Map()
const checks = []

function read(filename, role) {
  const absolute = path.resolve(root, filename)
  const bytes = fs.readFileSync(absolute)
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex')
  const existing = bindings.get(absolute)
  bindings.set(absolute, {
    path: absolute,
    sha256,
    bytes: bytes.length,
    roles: [...new Set([...(existing?.roles ?? []), role])],
  })
  return bytes
}

function json(filename, role) {
  return JSON.parse(read(filename, role).toString('utf8'))
}

function check(id, condition, detail = null) {
  checks.push({ id, status: condition ? 'pass' : 'fail', detail })
  return condition
}

function noNewlines(text) {
  return text.replace(/\r?\n/g, '')
}

function diff(before, after, pointer = '') {
  if (isDeepStrictEqual(before, after)) return []
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .flatMap((key) => diff(before[key], after[key], `${pointer}/${key}`))
  }
  return [{ pointer, before: before ?? null, after: after ?? null }]
}

const sourceFirst = `${tmp}/n41-modern-text-review/source-first.md`
read(sourceFirst, 'saved-before-candidate-and-author')
for (const filename of [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
]) read(filename, 'read-only-contract')

const rawLessonPath = `${core}/lessons/${lessonId}/lesson.json`
const rawExercisesPath = `${core}/lessons/${lessonId}/exercises.json`
const rawLesson = json(rawLessonPath, 'raw-lesson')
const rawExercises = json(rawExercisesPath, 'raw-exercises')
read(`${core}/lessons/${lessonId}/lesson.md`, 'raw-lesson-readable')
const lesson = json(`${candidateDir}/lesson.template.json`, 'modern-candidate')
const exercises = json(`${candidateDir}/exercises.template.json`, 'modern-candidate')
const baseline = json(`${work}/lesson.template.before-math-layout.json`, 'retained-pre-correction-candidate')
const preview = json(`${work}/prose-flow-after-math-01/normalized-preview.json`, 'existing-normalization-output')
const flow = json(`${work}/prose-flow-after-math-01/stdout.json`, 'existing-prose-flow-output')
for (const filename of ['stderr.txt', 'normalize.stderr.txt']) {
  const text = read(`${work}/prose-flow-after-math-01/${filename}`, 'existing-producer-stderr').toString('utf8')
  check(`existing-${filename}-empty`, text === '')
}

const affected = json(`${tmp}/source141147-affected-review/review.json`, 'reused-affected-source-review')
const first140 = json(`${tmp}/source140145147-review/review.json`, 'reused-first-source-review')
const first141 = json(`${tmp}/source141144-review/review.json`, 'reused-first-source-review')
check('affected-source-review-pass', affected.status === 'pass')
check('first-page140-pass', first140.pages.find((item) => item.page === 140)?.status === 'pass')
check('first-page143-pass', first141.pages.find((item) => item.page === 143)?.status === 'pass')
const sourceManifest = json(`${work}/source-bindings.json`, 'parent-source-import-manifest')
const relevantRoles = new Set([
  'affected-only-review', 'first141144', 'first140145147',
  'current141', 'current142', 'reuse140author', 'reuse143author',
])
let historicalAssertions = 0
for (const item of sourceManifest) {
  if (!relevantRoles.has(item.role) || !/\.(json|md)$/.test(item.from)) continue
  const actual = crypto.createHash('sha256').update(read(item.from, 'reused-hash-bound-evidence')).digest('hex')
  historicalAssertions += 1
  check(`retained-manifest:${path.relative(root, item.from)}`, actual === item.sha256)
}

const pages = new Map()
for (const number of [140, 141, 142, 143]) {
  const page = String(number).padStart(4, '0')
  const data = json(`${core}/pages/${page}/page.json`, 'retained-source-page')
  pages.set(number, data)
  for (const filename of ['page.md', 'page.json', 'audit.json']) {
    const durable = read(`${core}/pages/${page}/${filename}`, 'retained-source-page')
    const assembly = read(`${work}/artifacts/9-10g/pages/${page}/${filename}`, 'assembled-source-copy')
    check(`source-copy-${page}-${filename}`, durable.equals(assembly))
    const reviewedGroup = affected.bindings[
      number === 140 ? 'reuse140author' :
      number === 143 ? 'reuse143author' : `current${number}`
    ]
    check(`reviewed-source-${page}-${filename}`,
      crypto.createHash('sha256').update(durable).digest('hex') === reviewedGroup.files[filename])
  }
}
for (const filename of ['lesson.json', 'lesson.md', 'exercises.json']) {
  check(`raw-assembly-${filename}`,
    read(`${core}/lessons/${lessonId}/${filename}`, 'raw-lesson-assembly-binding')
      .equals(read(`${work}/artifacts/9-10g/lessons/${lessonId}/${filename}`, 'assembled-raw-lesson-copy')))
}
for (const id of ['fig-160', 'fig-161']) {
  const actual = crypto.createHash('sha256').update(read(`${core}/figures/${id}.png`, 'original-figure-opened-once')).digest('hex')
  const reviewed = affected.reused_first_results.figures.find((item) => item.id === id)
  check(`original-${id}-reuses-approved-bytes`, actual === reviewed.sha256)
}

// Bind every preserved object to the already-reviewed page stream, without pixel rereview.
const stream = []
for (const [number, page] of pages) {
  page.blocks.forEach((block, index) => {
    const ordinal = index + 1
    if ((number === 140 && ordinal < 5) || (number === 143 && ordinal >= 9)) return
    stream.push({ ref: `p${String(number).padStart(4, '0')}#${ordinal}`, number, block })
  })
}
const getSourceText = (refs) => refs.map((ref) => {
  const entry = stream.find((item) => item.ref === ref)
  if (!entry) throw new Error(`Out-of-scope or missing source ref: ${ref}`)
  return entry.block.lines.join('').replace(/\u21b5/g, '')
}).join('')
const used = []
const proseRows = rawLesson.prose.map((raw, index) => {
  const modern = lesson.prose[index]
  used.push(...raw.source_refs)
  const expected = index === 3
    ? raw.text.replace('\\cos\\alpha<\\cos(\\widehat{NSD})', '\\cos\\alpha<\\cos(\\widehat{NSB})')
    : raw.text
  const results = {
    sourceTextExact: modern.source_text === raw.text,
    sourceRefsExact: isDeepStrictEqual(modern.source_refs, raw.source_refs),
    pageStreamTextExact: getSourceText(raw.source_refs) === raw.text,
    allContentPreservedExceptSupportedCorrection: noNewlines(modern.text) === expected,
    metadataExact: ['kind', 'id', 'label', 'printed_page'].every((key) => isDeepStrictEqual(modern[key], raw[key])),
    numericChangesEmpty: isDeepStrictEqual(modern.numeric_changes, []),
    historicalEntitiesEmpty: isDeepStrictEqual(modern.historical_entities, []),
    annotationsExact: isDeepStrictEqual(modern.changes, [
      ...(modern.text.includes('\n') ? ['layout'] : []),
      ...(index === 3 ? ['math-correction'] : []),
    ]),
  }
  for (const [key, value] of Object.entries(results)) check(`prose-${index}-${key}`, value)
  return { index, kind: raw.kind, source_refs: raw.source_refs, textChanges: modern.changes, results, status: Object.values(results).every(Boolean) ? 'pass' : 'fail' }
})
const exerciseRows = rawExercises.exercises.map((raw, index) => {
  const modern = exercises.exercises[index]
  used.push(...raw.pages)
  const results = {
    sourceTextExact: modern.source_text === raw.text,
    allTextPreserved: noNewlines(modern.text) === raw.text,
    sourcePagesExact: isDeepStrictEqual(modern.pages, raw.pages),
    pageStreamTextExact: getSourceText(raw.pages) === raw.text,
    identityGroupsAndFiguresExact: ['number', 'source_number', 'group', 'group_id', 'figure_refs', 'figures']
      .every((key) => isDeepStrictEqual(modern[key], raw[key])),
    linesExactlyDisplayText: isDeepStrictEqual(modern.lines, modern.text.split('\n')),
    numericChangesEmpty: isDeepStrictEqual(modern.numeric_changes, []),
    historicalEntitiesEmpty: isDeepStrictEqual(modern.historical_entities, []),
    annotationsExact: isDeepStrictEqual(modern.changes, modern.text.includes('\n') ? ['layout'] : []),
  }
  for (const [key, value] of Object.entries(results)) check(`exercise-${raw.number}-${key}`, value)
  return { number: raw.number, source_refs_field: 'pages', source_refs: raw.pages, textChanges: modern.changes, results, status: Object.values(results).every(Boolean) ? 'pass' : 'fail' }
})
const expectedUsed = stream.filter((item) => ['p', 'fig', 'cap', 'ex'].includes(item.block.kind)).map((item) => item.ref)
check('all-source-content-refs-exactly-once', isDeepStrictEqual(used, expectedUsed))
check('header-p0140#5', pages.get(140).blocks[4].kind === 'h3' &&
  pages.get(140).blocks[4].lines.join('') === rawLesson.printed_title)
check('exercise-heading-p0142#6', pages.get(142).blocks[5].kind === 'exhead' &&
  rawExercises.exercises.every((item) => item.group === pages.get(142).blocks[5].lines.join('')))
check('exclusive-boundary-p0143#9', pages.get(143).blocks[8].kind === 'exhead')
check('prose-object-count17', rawLesson.prose.length === 17 && lesson.prose.length === 17)
check('exercise-count14', rawExercises.count === 14 && exercises.count === 14 &&
  exercises.exercises.length === 14 && lesson.exercise_count === 14)
check('exercise-identity391-404',
  isDeepStrictEqual(exercises.exercises.map((item) => item.number), Array.from({ length: 14 }, (_, i) => String(391 + i))))
for (const [kind, candidate, raw, filename] of [
  ['lesson', lesson, rawLesson, rawLessonPath],
  ['exercises', exercises, rawExercises, rawExercisesPath],
]) {
  check(`${kind}-source.data-exact`, isDeepStrictEqual(candidate.source.data, raw))
  check(`${kind}-source.path-exact`, candidate.source.path === `lessons/${lessonId}/${kind === 'lesson' ? 'lesson' : 'exercises'}.json`)
  check(`${kind}-source.sha256-exact`, candidate.source.sha256 === bindings.get(path.join(root, filename)).sha256)
  for (const key of Object.keys(raw).filter((key) => !['prose', 'exercises'].includes(key))) {
    check(`${kind}-top-level-${key}`, isDeepStrictEqual(candidate[key], raw[key]))
  }
}
check('exact-existing-normalized-output-reused', isDeepStrictEqual(preview, lesson))
check('all-existing-prose-flow-paragraphs-preserved',
  preview.prose.filter((block) => block.kind === 'p').every((block) => {
    const blockIndex = preview.prose.indexOf(block)
    return flow.paragraphs.filter((item) => item.blockIndex === blockIndex)
      .map((item) => item.text).join('\n\n') === block.text
  }) &&
  flow.paragraphs.every((item, index) => item.index === index && preview.prose[item.blockIndex]?.kind === 'p'))
check('paragraph-count15', flow.paragraphs.length === 15)
check('resolved-boundaries4-6-10-11', isDeepStrictEqual(flow.resolvedBreaks, [4, 6, 10, 11]))
check('boundary-objects-copied-from-existing-output', isDeepStrictEqual(
  lesson.section_breaks, flow.boundaries.map(({ before, after }) => ({ before, after }))))
for (const boundary of flow.boundaries) {
  check(`boundary-${boundary.index}-actual-adjacent-text`,
    flow.paragraphs[boundary.index - 1].text === boundary.before &&
    flow.paragraphs[boundary.index].text === boundary.after)
}
const candidateDiff = diff(baseline, lesson)
check('only-formula-annotation-four-boundaries-changed', isDeepStrictEqual(
  candidateDiff.map((item) => item.pointer),
  ['/prose/3/text', '/prose/3/changes/1', '/section_breaks/0', '/section_breaks/1', '/section_breaks/2', '/section_breaks/3']))
check('native-errata-not-yet-registered', isDeepStrictEqual(pages.get(141).meta.errata, []) &&
  isDeepStrictEqual(lesson.errata, []))

const result = {
  schema: 'ld-s10y-lesson/modern-preservation-mechanical-evidence@1',
  ticket: 'STEMROBIN-188',
  assignment: '188-6',
  lesson: lessonId,
  recorded_at: new Date().toISOString(),
  phase: 'modern-preservation-completed-before-author-report-read',
  status: checks.every((item) => item.status === 'pass') ? 'pass' : 'revise',
  commands_not_run: ['edition.normalize_lesson_layout', 'prose_flow.mjs', 'finalize', 'assemble', 'adapt-finalize', 'render', 'publish'],
  existing_exact_outputs_reused: true,
  historical_hash_assertions: historicalAssertions,
  source_window: { inclusive: 'p0140#5', exclusive: 'p0143#9', content_refs: expectedUsed, excluded_structural_refs: ['p0140#5', 'p0142#6'], footers_not_content: true },
  candidate_diff: candidateDiff,
  prose: proseRows,
  exercises: exerciseRows,
  prose_flow: flow,
  checks,
  failures: checks.filter((item) => item.status !== 'pass'),
}
const manifest = {
  schema: 'ld-s10y-lesson/independent-review-input-bindings@1',
  recorded_at: result.recorded_at,
  phase: result.phase,
  files: [...bindings.values()],
}
for (const [filename, data] of [['mechanical-evidence.json', result], ['pre-author-input-bindings.json', manifest]]) {
  fs.writeFileSync(path.join(output, filename), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
console.log(JSON.stringify({
  status: result.status,
  checks: checks.length,
  historical_hash_assertions: historicalAssertions,
  input_files: bindings.size,
  failures: result.failures,
  changed_paths: candidateDiff.map((item) => item.pointer),
  output: path.join(output, 'mechanical-evidence.json'),
}, null, 2))
if (result.status !== 'pass') process.exitCode = 1
