import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const author = path.join(batch, 'n43-modern-author')
const templates = path.join(batch, 'n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s3-n43')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const writeNew = (file, value) => fs.writeFileSync(
  path.join(author, file), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 },
)
const lesson = read(path.join(templates, 'lesson.template.json'))
const exercises = read(path.join(templates, 'exercises.template.json'))
const first = read(path.join(author, 'authored-FIRST/lesson.template.json'))
const baseline = read(path.join(author, 'input-hashes-FIRST.json'))
const failure = read(path.join(author, 'check-command-FIRST.json'))
assert.equal(failure.exit, 1)
assert.equal(hash(path.join(author, 'collect-evidence-FIRST.mjs')), failure.checkerSha256)
for (const entry of baseline.inputs) {
  if (entry.path === path.join(templates, 'lesson.template.json') ||
      entry.path === path.join(templates, 'exercises.template.json')) continue
  assert.equal(hash(entry.path), entry.sha256, `Observed read-only input changed: ${entry.path}`)
}
for (const entry of [...baseline.snapshots, ...read(path.join(author, 'authored-snapshots-FIRST.json')).snapshots]) {
  assert.equal(hash(entry.path), entry.sha256, 'FIRST snapshot changed')
  assert.equal(fs.statSync(entry.path).mode & 0o222, 0)
}
const expectedIndices = read(path.join(author, 'layout-diagnosis-FIRST.json')).mismatches.map((item) => item.index)
const changedIndices = lesson.prose.flatMap((item, i) =>
  JSON.stringify(item) !== JSON.stringify(first.prose[i]) ? [i] : [])
assert.deepEqual(changedIndices, expectedIndices)
assert.deepEqual({ ...lesson, prose: [] }, { ...first, prose: [] })
assert.equal(hash(path.join(templates, 'exercises.template.json')),
  hash(path.join(author, 'authored-FIRST/exercises.template.json')))
const diagnoses = read(path.join(author, 'layout-diagnosis-FIRST.json')).mismatches
for (const item of diagnoses) {
  assert.deepEqual(lesson.prose[item.index], { ...first.prose[item.index], text: item.normalized })
}

const startedAt = new Date().toISOString()
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const code = [
  'import json, sys',
  'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
  'import edition',
  'data = json.load(sys.stdin)',
  'result = {',
  '  "prose": [{"index": i, "matches": edition.normalize_prose_layout(item["text"]) == item["text"]} for i, item in enumerate(data["prose"])],',
  '  "exercises": [{"number": item["number"], "matches": edition.normalize_numbered_subparts(item["text"]) == item["text"], "errors": edition.validate_numbered_subpart_layout(item["text"])} for item in data["exercises"]]',
  '}',
  'print(json.dumps(result))',
].join('\n')
const layoutResult = spawnSync(python, ['-B', '-c', code], {
  cwd: repo, encoding: 'utf8', input: JSON.stringify({ prose: lesson.prose, exercises: exercises.exercises }),
})
writeNew('layout-command-affected1.json', {
  cwd: repo, command: [python, '-B', '-c', code], startedAt, finishedAt: new Date().toISOString(),
  exit: layoutResult.status, stdout: layoutResult.stdout, stderr: layoutResult.stderr,
})
assert.equal(layoutResult.status, 0, layoutResult.stderr)
const layout = JSON.parse(layoutResult.stdout)
assert.equal(layout.prose.every((item) => item.matches), true)
assert.equal(layout.exercises.every((item) => item.matches && item.errors.length === 0), true)

const flowCommand = [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json',
  path.join(templates, 'lesson.template.json')]
const flowResult = spawnSync(process.execPath, flowCommand, { cwd: repo, encoding: 'utf8' })
assert.equal(flowResult.status, 0, flowResult.stderr)
const flow = JSON.parse(flowResult.stdout)
writeNew('prose-flow-affected1.json', {
  command: [process.execPath, ...flowCommand], cwd: repo, exit: flowResult.status,
  templateSha256: hash(flowCommand[2]), ...flow,
})
const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const { proseFlow } = require(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
assert.deepEqual(proseFlow(lesson.prose, lesson.section_breaks).map((item) => item.text),
  flow.paragraphs.map((item) => item.text))
assert.equal(flow.boundaries.length, 3)
const candidates = read(path.join(author, 'prose-flow-before-anchors-FIRST.json')).adjacentBoundaryCandidates
for (const boundary of lesson.section_breaks) {
  assert.equal(candidates.some((item) => item.before === boundary.before && item.after === boundary.after), true)
}
const raw = path.join(batch, 'n41-n43-source-stage/artifacts/7a/lessons/alg7-c4-s3-n43')
const rawLesson = read(path.join(raw, 'lesson.json'))
const rawExercises = read(path.join(raw, 'exercises.json'))
assert.deepEqual(lesson.source.data, rawLesson)
assert.deepEqual(exercises.source.data, rawExercises)
assert.equal(lesson.source.sha256, hash(path.join(raw, 'lesson.json')))
assert.equal(exercises.source.sha256, hash(path.join(raw, 'exercises.json')))
assert.equal(lesson.prose.length, 37)
assert.equal(exercises.exercises.length, 3)
const formulas = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((match) => match[1])
const numbers = (text) => text.match(/-?\d+(?:\.\d+)?/g) ?? []
const normalize = (text) => text
  .replace(/([а-бвгдеёжзик])\)/gu, ')')
  .replace(/(^|\n)([a-z])\)/g, '$1)')
  .replace(/[\s,，;；:：.。?？!！]/g, '')
const targets = [
  ...lesson.prose.map((item, i) => ({ item, source: rawLesson.prose[i], target: `prose:${i}` })),
  ...exercises.exercises.map((item, i) => ({ item, source: rawExercises.exercises[i], target: `exercise:${item.number}` })),
]
const profile = read(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
const katex = require('katex')
const checks = targets.map(({ item, source, target }) => {
  assert.equal(item.source_text, source.text)
  assert.deepEqual(formulas(item.text), formulas(source.text))
  assert.deepEqual(numbers(item.text), numbers(source.text))
  assert.equal(normalize(item.text), normalize(source.text))
  assert.deepEqual(item.numeric_changes, [])
  assert.deepEqual(item.historical_entities, [])
  assert.deepEqual(item.changes, item.text === source.text ? [] : ['layout'])
  assert.equal(/\p{Script=Cyrillic}/u.test(item.text), false)
  assert.equal(/[<>]/.test(item.text.replace(/\$[^$]*\$/g, '')), false)
  for (const term of [...profile.forbidden_terms, ...profile.forbidden_person_names]) {
    assert.equal(item.text.includes(term), false)
  }
  for (const tex of formulas(item.text)) {
    assert.equal(/[，；。？！：、]/.test(tex), false)
    assert.doesNotThrow(() => katex.renderToString(tex, { throwOnError: true }))
  }
  if (target.startsWith('prose:')) {
    for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) assert.deepEqual(item[key], source[key])
  } else {
    for (const key of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']) {
      assert.deepEqual(item[key], source[key])
    }
    assert.deepEqual(item.lines, item.text.split('\n'))
    const labels = item.lines.flatMap((line) => /^([a-z])\) /.exec(line)?.[1] ?? [])
    assert.deepEqual(labels, labels.map((_, i) => String.fromCharCode(97 + i)))
    if (labels.length) assert.equal(item.lines.length, labels.length + 1)
    assert.equal(Object.keys(item).some((key) => /answer|choice|interaction|accept|correct|solution/i.test(key)), false)
  }
  return {
    target, sourceRefs: source.source_refs ?? source.pages, formulaCount: formulas(item.text).length,
    formulaSequenceExact: true, numericSequenceExact: true,
    wordingExactIgnoringLayoutAndSubpartLabels: true, sourceBindingExact: true,
  }
})
for (const key of ['id', 'card_id', 'chapter', 'section', 'number', 'title', 'printed_title', 'start_page', 'start_printed', 'figures']) {
  assert.deepEqual(lesson[key], rawLesson[key])
}
assert.equal(lesson.exercise_count, 3)
assert.equal(exercises.count, 3)
assert.equal(lesson.status, 'draft')
assert.equal(exercises.status, 'draft')
assert.deepEqual(lesson.errata, [])
assert.equal(lesson.prose[15].text.includes('第一项与第二项的和的两倍'), true)
assert.equal(lesson.prose[15].text.includes('第一项与第二项的积的两倍'), false)
assert.equal(lesson.prose[19].text.includes('任何数'), true)
assert.equal(lesson.prose[12].text.includes('$a\\neq0$'), true)

const snapshotsDirectory = path.join(author, 'authored-affected1')
fs.mkdirSync(snapshotsDirectory)
const snapshots = ['lesson.template.json', 'exercises.template.json'].map((name) => {
  const source = path.join(templates, name)
  const snapshot = path.join(snapshotsDirectory, name)
  fs.copyFileSync(source, snapshot, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(snapshot, 0o444)
  return { path: snapshot, sha256: hash(snapshot), template: source, templateSha256: hash(source) }
})
const counts = {
  proseBlocks: 37, finalProseParagraphs: flow.paragraphs.length,
  exercises: 3, exerciseNumbers: exercises.exercises.map((item) => item.number),
  latinSubparts: exercises.exercises.reduce((sum, item) => sum + item.lines.filter((line) => /^[a-z]\) /.test(line)).length, 0),
  sectionBreaks: flow.boundaries.length, formulaOccurrences: checks.reduce((sum, item) => sum + item.formulaCount, 0),
  figures: 0, imagesOpened: 0, unresolvedMathematicalIssues: 1,
}
writeNew('preservation-checks-affected1.json', {
  schema: 'stemrobin182/n43-modern-author-checks@1',
  capturedAt: new Date().toISOString(), cwd: repo,
  branch: 'codex/STEMROBIN-182-textbooks',
  preservationStatus: 'pass', canonicalLayoutStatus: 'pass',
  contentStatus: 'hold-pending-source-bound-erratum',
  independentReview: false, counts, checks, canonicalLayoutChecks: layout,
  changedFromFIRST: changedIndices.map((i) => ({ index: i, sourceRefs: lesson.prose[i].source_refs, onlyTextWhitespaceChanged: true })),
  firstFailurePreserved: true, firstSnapshotsUnchanged: true,
  observedReadOnlyInputsUnchanged: true, rawAndSourceSnapshotsUnchanged: true,
  anchorsCopiedFromActualCLIFlow: true, sharedProseFlowMatchesCLI: true,
  allFormulasKaTeXStrictPass: true, sourceDomainWordingPreserved: true,
  suspectWordingPreserved: true, sourceErrataStillEmpty: true,
  n44Excluded: true, noExerciseAnswerOrChoiceFields: true,
  snapshots,
  stoppedBefore: ['independent modern review', 'adapt-finalize', 'promotion', 'render', 'publication'],
})
console.log(JSON.stringify({ preservationStatus: 'pass', contentStatus: 'hold-pending-source-bound-erratum', counts }, null, 2))
