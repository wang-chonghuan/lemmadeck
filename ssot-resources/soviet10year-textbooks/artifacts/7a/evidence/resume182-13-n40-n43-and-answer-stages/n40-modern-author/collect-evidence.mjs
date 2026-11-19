import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), repo, 'Run only from the authorized worktree')
const batch = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const author = path.join(batch, 'n40-modern-author')
const lessonId = 'alg7-c4-s2-n40'
const raw = path.join(batch, 'n40-source-stage/artifacts/7a/lessons', lessonId)
const templates = path.join(batch, 'n40-adapt-work/adapt/7a/modern-us-neutral/lessons', lessonId)
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const fingerprint = (file) => ({ path: file, sha256: hash(file) })
const writeNew = (file, document) => fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' })
const rawLesson = read(path.join(raw, 'lesson.json'))
const rawExercises = read(path.join(raw, 'exercises.json'))
const lesson = read(path.join(templates, names[0]))
const exercises = read(path.join(templates, names[1]))
const figures = read(path.join(templates, names[2]))
assert.equal(rawLesson.prose.length, 19)
assert.deepEqual(rawExercises.exercises.map((item) => item.number), Array.from({ length: 14 }, (_, i) => String(820 + i)))
assert.deepEqual(lesson.source.data, rawLesson)
assert.deepEqual(exercises.source.data, rawExercises)
assert.equal(lesson.source.sha256, hash(path.join(raw, 'lesson.json')))
assert.equal(exercises.source.sha256, hash(path.join(raw, 'exercises.json')))
assert.equal(figures.figures.length, 0)

if (process.argv[2] === 'inputs') {
  const inputs = [
    ...['lesson.json', 'lesson.md', 'exercises.json'].map((name) => path.join(raw, name)),
    ...names.map((name) => path.join(templates, name)),
    path.join(batch, 'n40-adapt-work/adapt/7a/modern-us-neutral/book.template.json'),
    ...['n40-modern-prepare-FIRST.receipt.json', 'n40-modern-prepare-FIRST.stdout', 'n40-modern-prepare-FIRST.stderr', 'n40-assembly-FIRST.stdout'].map((name) => path.join(batch, 'stages', name)),
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  ]
  writeNew(path.join(author, 'input-hashes.json'), {
    schema: 'stemrobin182/n40-author-inputs@1',
    capturedAt: new Date().toISOString(),
    cwd: repo,
    branch: 'codex/STEMROBIN-182-textbooks',
    lesson: lessonId,
    counts: { proseBlocks: 19, exercises: 14, figures: 0 },
    inputs: inputs.map(fingerprint),
  })
  console.log('Captured n40 input hashes; source bindings match.')
} else if (process.argv[2] === 'outputs') {
  const baseline = read(path.join(author, 'input-hashes.json'))
  for (const entry of baseline.inputs.filter((item) => !names.some((name) => item.path === path.join(templates, name)))) {
    assert.equal(hash(entry.path), entry.sha256, `Read-only input changed: ${entry.path}`)
  }
  const formulas = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((match) => match[1])
  const numbers = (text) => text.match(/-?\d+(?:\.\d+)?/g) ?? []
  const normalize = (text) => text
    .replace(/(^|[\s:：;；.。?？])([а-бвгдеёжзик])\)/gu, '$1)')
    .replace(/(^|\n)([a-z])\)/g, '$1)')
    .replace(/[\s,，;；:：.。?？]/g, '')
  const allTargets = [
    ...lesson.prose.map((item, i) => ({ item, source: rawLesson.prose[i], target: `prose:${i}` })),
    ...exercises.exercises.map((item, i) => ({ item, source: rawExercises.exercises[i], target: `exercise:${item.number}` })),
  ]
  assert.equal(lesson.prose.length, 19)
  assert.equal(lesson.exercise_count, 14)
  assert.equal(exercises.count, 14)
  assert.equal(exercises.exercises.length, 14)
  const profile = read(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
  const checks = []
  for (const { item, source, target } of allTargets) {
    assert.equal(item.source_text, source.text, `${target}: source_text changed`)
    assert.deepEqual(formulas(item.text), formulas(source.text), `${target}: formula changed`)
    assert.deepEqual(numbers(item.text), numbers(source.text), `${target}: number changed`)
    assert.equal(normalize(item.text), normalize(source.text), `${target}: wording changed`)
    assert.equal(/\p{Script=Cyrillic}/u.test(item.text), false, `${target}: Cyrillic in modern text`)
    assert.deepEqual(item.numeric_changes, [])
    assert.deepEqual(item.historical_entities, [])
    assert.deepEqual(item.changes, ['layout'])
    for (const term of [...profile.forbidden_terms, ...profile.forbidden_person_names]) {
      assert.equal(item.text.includes(term), false, `${target}: forbidden term ${term}`)
    }
    if (target.startsWith('prose:')) {
      assert.deepEqual(item.source_refs, source.source_refs)
    } else {
      for (const key of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']) {
        assert.deepEqual(item[key], source[key], `${target}: ${key} changed`)
      }
      assert.deepEqual(item.lines, item.text.split('\n'))
      const labels = item.lines.map((line) => /^([a-z])\) /.exec(line)?.[1]).filter(Boolean)
      assert.deepEqual(labels, labels.map((_, i) => String.fromCharCode(97 + i)))
    }
    checks.push({ target, formulas: formulas(item.text).length, formulaEquality: true, numberEquality: true, wordingEqualityIgnoringLayoutAndLabels: true })
  }
  assert.deepEqual(lesson.errata, [])
  assert.deepEqual(lesson.figures, [])
  for (const key of ['id', 'card_id', 'chapter', 'section', 'number', 'title', 'printed_title', 'start_page', 'start_printed']) {
    assert.deepEqual(lesson[key], rawLesson[key], `lesson identity changed: ${key}`)
  }
  const flowCommand = [
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
    '--json',
    path.join(templates, names[0]),
  ]
  const flowResult = spawnSync(process.execPath, flowCommand, { cwd: repo, encoding: 'utf8' })
  assert.equal(flowResult.status, 0, flowResult.stderr)
  const flow = JSON.parse(flowResult.stdout)
  assert.equal(flow.resolvedBreaks.length, lesson.section_breaks.length)
  for (const boundary of flow.boundaries) {
    assert.equal(lesson.section_breaks.some((item) => item.before === boundary.before && item.after === boundary.after), true)
  }
  writeNew(path.join(author, 'prose-flow-FIRST.json'), flow)
  const snapshots = path.join(author, 'first-authored')
  fs.mkdirSync(snapshots)
  const snapshotHashes = []
  for (const name of names) {
    const source = path.join(templates, name)
    const destination = path.join(snapshots, name)
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(destination, 0o444)
    snapshotHashes.push({ ...fingerprint(destination), template: source, templateSha256: hash(source) })
  }
  writeNew(path.join(author, 'author-check-FIRST.json'), {
    schema: 'stemrobin182/n40-author-check@1',
    capturedAt: new Date().toISOString(),
    cwd: repo,
    runtime: { executable: process.execPath, version: process.version },
    status: 'pass',
    meaning: 'Authorship preservation and boundary checks only; not independent content approval or adapt-finalize.',
    counts: {
      proseBlocks: lesson.prose.length,
      finalProseParagraphs: flow.paragraphs.length,
      exercises: exercises.exercises.length,
      latinSubparts: exercises.exercises.reduce((sum, item) => sum + item.lines.filter((line) => /^[a-z]\) /.test(line)).length, 0),
      sectionBreaks: flow.resolvedBreaks.length,
      figures: figures.figures.length,
      imagesOpened: 0,
    },
    checks,
    flowCommand: [process.execPath, ...flowCommand],
    snapshots: snapshotHashes,
    deferred: ['adapt-finalize', 'promotion', 'independent-review'],
  })
  console.log(JSON.stringify({ status: 'pass', paragraphs: flow.paragraphs.length, sectionBreaks: flow.resolvedBreaks.length, snapshots: snapshotHashes }, null, 2))
} else {
  throw new Error('Use inputs before authoring, outputs after authoring.')
}
