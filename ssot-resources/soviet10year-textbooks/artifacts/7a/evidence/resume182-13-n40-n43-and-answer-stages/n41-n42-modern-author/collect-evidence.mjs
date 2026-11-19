import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), repo, 'Use the explicitly authorized checkout')
const branch = spawnSync('git', ['branch', '--show-current'], { cwd: repo, encoding: 'utf8' })
assert.equal(branch.status, 0)
assert.equal(branch.stdout.trim(), 'codex/STEMROBIN-182-textbooks')
const batch = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const author = path.join(batch, 'n41-n42-modern-author')
const rawRoot = path.join(batch, 'n41-n43-source-stage/artifacts/7a')
const workRoot = path.join(batch, 'n41-n43-adapt-work/adapt/7a/modern-us-neutral')
const ids = ['alg7-c4-s2-n41', 'alg7-c4-s3-n42']
const names = ['lesson.template.json', 'exercises.template.json']
const targets = ids.flatMap((id) => names.map((name) => path.join(workRoot, 'lessons', id, name)))
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const fingerprint = (file) => ({ path: file, sha256: hash(file) })
const writeNew = (file, value) => {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(file, 0o444)
}
const snapshot = (label) => {
  const root = path.join(author, label)
  fs.mkdirSync(root)
  return targets.map((source) => {
    const id = path.basename(path.dirname(source))
    const destination = path.join(root, id, path.basename(source))
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(destination, 0o444)
    return { ...fingerprint(destination), template: source, templateSha256: hash(source) }
  })
}
const formulas = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((match) => match[1])
const numbers = (text) => text.match(/-?\d+(?:\.\d+)?/g) ?? []
const normalized = (text) => text
  .replace(/[а-бвгдеёжзик]\)/gu, ')')
  .replace(/(^|\n)[a-z]\)/g, '$1)')
  .replace(/[\s,，;；:：.。?？]/g, '')

if (process.argv[2] === 'inputs') {
  const prepare = path.join(batch, 'stages/n41-n43-modern-prepare-FIRST.receipt.json')
  assert.equal(read(prepare).exit, 0, 'Reuse the successful prepare')
  const inputs = [
    ...ids.flatMap((id) => ['lesson.json', 'lesson.md', 'exercises.json'].map((name) =>
      path.join(rawRoot, 'lessons', id, name))),
    ...targets,
    ...ids.map((id) => path.join(workRoot, 'lessons', id, 'figures.template.json')),
    path.join(workRoot, 'book.template.json'),
    path.join(batch, 'n41-n43-source-stage/candidate-binding.json'),
    ...['receipt.json', 'stdout', 'stderr'].map((suffix) =>
      path.join(batch, `stages/n41-n43-modern-prepare-FIRST.${suffix}`)),
    path.join(batch, 'source243-250-review/review.md'),
    path.join(batch, 'source243-250-review/hashes.sha256'),
    path.join(batch, 'source251-258-review/review.md'),
    path.join(batch, 'source251-258-review/receipt.json'),
    ...['SKILL.md', 'references/edition-text-contract.md', 'references/production-resume.md',
      'tools/prose_flow.mjs', 'tools/htmlfrag.js', 'tools/edition.py',
      'profiles/modern-us-neutral.json'].map((name) =>
      path.join(repo, '.claude/skills/ld-s10y-lesson', name)),
    path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md'),
    ...['product.md', 'engineering.md', 'operations.md'].map((name) =>
      path.join(repo, '.intentfold/charter', name)),
  ]
  const bindings = ids.map((id) => {
    const lessonPath = path.join(rawRoot, 'lessons', id, 'lesson.json')
    const exercisePath = path.join(rawRoot, 'lessons', id, 'exercises.json')
    const lesson = read(path.join(workRoot, 'lessons', id, names[0]))
    const exercises = read(path.join(workRoot, 'lessons', id, names[1]))
    assert.deepEqual(lesson.source.data, read(lessonPath))
    assert.deepEqual(exercises.source.data, read(exercisePath))
    assert.equal(lesson.source.sha256, hash(lessonPath))
    assert.equal(exercises.source.sha256, hash(exercisePath))
    return {
      id,
      prose: lesson.prose.map((item, index) => ({ index, kind: item.kind, source_refs: item.source_refs })),
      exercises: exercises.exercises.map((item) => ({
        number: item.number, source_number: item.source_number, group: item.group,
        group_id: item.group_id, pages: item.pages, figure_refs: item.figure_refs,
      })),
    }
  })
  writeNew(path.join(author, 'input-bindings-FIRST.json'), {
    schema: 'stemrobin182/n41-n42-modern-inputs@1',
    capturedAt: new Date().toISOString(),
    cwd: repo,
    branch: branch.stdout.trim(),
    bindings,
    inputs: inputs.map(fingerprint),
    preparedSnapshots: snapshot('first-prepared'),
    authorization: {
      offline: true, imagesOpened: 0, adaptPrepareReused: true,
      answers: false, choices: false, finalize: false, promote: false,
      database: false, network: false, sourceWrites: false,
    },
  })
  console.log('Saved immutable prepared text snapshots and input bindings.')
} else if (process.argv[2] === 'outputs') {
  const baseline = read(path.join(author, 'input-bindings-FIRST.json'))
  const figureManifests = ids.map((id) => path.join(workRoot, 'lessons', id, 'figures.template.json'))
  const unchangedInputs = baseline.inputs.filter((entry) =>
    !targets.includes(entry.path) && !figureManifests.includes(entry.path))
  for (const input of unchangedInputs) {
    assert.equal(hash(input.path), input.sha256, `Read-only input changed: ${input.path}`)
  }
  for (const input of baseline.preparedSnapshots) {
    assert.equal(hash(input.path), input.sha256, 'Immutable prepared snapshot changed')
    assert.equal(fs.statSync(input.path).mode & 0o222, 0)
  }
  const profile = read(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
  const counts = []
  const checks = []
  for (const [position, id] of ids.entries()) {
    const folder = path.join(workRoot, 'lessons', id)
    const lesson = read(path.join(folder, names[0]))
    const exercises = read(path.join(folder, names[1]))
    const rawLesson = read(path.join(rawRoot, 'lessons', id, 'lesson.json'))
    const rawExercises = read(path.join(rawRoot, 'lessons', id, 'exercises.json'))
    const expectedProse = position === 0 ? 20 : 16
    const expectedCount = position === 0 ? 17 : 4
    const firstNumber = position === 0 ? 834 : 851
    assert.equal(lesson.prose.length, expectedProse)
    assert.equal(lesson.exercise_count, expectedCount)
    assert.equal(exercises.count, expectedCount)
    assert.equal(exercises.exercises.length, expectedCount)
    assert.deepEqual(exercises.exercises.map((item) => item.number),
      Array.from({ length: expectedCount }, (_, i) => String(firstNumber + i)))
    for (const [name, document, raw] of [
      [names[0], lesson, rawLesson], [names[1], exercises, rawExercises],
    ]) {
      const prepared = read(path.join(author, 'first-prepared', id, name))
      const strip = (value) => {
        const result = structuredClone(value)
        delete result.prose
        delete result.exercises
        delete result.section_breaks
        return result
      }
      assert.deepEqual(strip(document), strip(prepared), `${id}/${name}: metadata changed`)
      assert.deepEqual(document.source.data, raw)
      assert.equal(document.source.sha256, hash(path.join(rawRoot, 'lessons', id,
        name === names[0] ? 'lesson.json' : 'exercises.json')))
    }
    const items = [
      ...lesson.prose.map((item, i) => ({ item, source: rawLesson.prose[i], target: `prose:${i}` })),
      ...exercises.exercises.map((item, i) => ({
        item, source: rawExercises.exercises[i], target: `exercise:${item.number}`,
      })),
    ]
    for (const { item, source, target } of items) {
      assert.equal(item.source_text, source.text, `${id}/${target}: source text`)
      assert.deepEqual(formulas(item.text), formulas(source.text), `${id}/${target}: formula order/content`)
      assert.deepEqual(numbers(item.text), numbers(source.text), `${id}/${target}: numeric order/content`)
      assert.equal(normalized(item.text), normalized(source.text), `${id}/${target}: wording/domain`)
      assert.equal(/\p{Script=Cyrillic}/u.test(item.text), false)
      assert.equal(item.text.includes('\u3000'), false, 'Print-column spaces')
      assert.equal(item.text.includes('\u21b5'), false, 'Raw physical wrap in modern text')
      assert.deepEqual(item.changes, item.text === source.text ? [] : ['layout'])
      assert.deepEqual(item.numeric_changes, [])
      assert.deepEqual(item.historical_entities, [])
      for (const term of [...profile.forbidden_terms, ...profile.forbidden_person_names]) {
        assert.equal(item.text.includes(term), false, `${id}/${target}: forbidden term`)
      }
      const metadata = (value) => Object.fromEntries(Object.entries(value).filter(([key]) =>
        !['text', 'lines', 'source_text', 'changes', 'numeric_changes', 'historical_entities'].includes(key)))
      assert.deepEqual(metadata(item), metadata(source), `${id}/${target}: identity/group/figure/source bindings`)
      if (target.startsWith('exercise:')) {
        assert.deepEqual(item.lines, item.text.split('\n'))
        const labels = item.lines.map((line) => /^([a-z])\) /.exec(line)?.[1]).filter(Boolean)
        assert.deepEqual(labels, labels.map((_, i) => String.fromCharCode(97 + i)))
        assert.equal(item.lines.some((line) => (line.match(/[a-z]\) /g) ?? []).length > 1), false)
      }
      checks.push({
        lesson: id, target, formulas: formulas(item.text).length,
        exactOrderedFormulas: true, exactOrderedNumbers: true,
        wordingAndDomainsPreservedIgnoringLayoutAndLabels: true,
        identityGroupsAndFigureRefsPreserved: true,
      })
    }
    const command = [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
      '--json', path.join(folder, names[0])]
    const result = spawnSync(process.execPath, command, { cwd: repo, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    const flow = JSON.parse(result.stdout)
    assert.equal(flow.resolvedBreaks.length, lesson.section_breaks.length)
    assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks)
    writeNew(path.join(author, `${id}-prose-flow-FIRST.json`), {
      command: [process.execPath, ...command], cwd: repo, exit: result.status, ...flow,
    })
    counts.push({
      id, sourceBoundProseBlocks: lesson.prose.length,
      proseTextBlocks: lesson.prose.filter((item) => item.kind === 'p').length,
      finalParagraphs: flow.paragraphs.length, exercises: exercises.count,
      exerciseRange: [String(firstNumber), String(firstNumber + expectedCount - 1)],
      latinSubparts: exercises.exercises.reduce((sum, item) =>
        sum + item.lines.filter((line) => /^[a-z]\) /.test(line)).length, 0),
      sectionBreaks: lesson.section_breaks.length,
      figures: lesson.figures.map((item) => item.id),
    })
  }
  writeNew(path.join(author, 'preservation-check-FIRST.json'), {
    schema: 'stemrobin182/n41-n42-modern-preservation@1',
    capturedAt: new Date().toISOString(),
    cwd: repo,
    branch: branch.stdout.trim(),
    runtime: { executable: process.execPath, version: process.version },
    status: 'pass',
    meaning: 'Structured text preservation and paragraph-anchor resolution only; not mathematical, image, independent-content, or production approval.',
    counts,
    formulaOccurrences: checks.reduce((sum, item) => sum + item.formulas, 0),
    checks,
    immutableFirstAuthoredSnapshots: snapshot('first-authored'),
    readOnlyInputsUnchanged: unchangedInputs.map(fingerprint),
    figureManifestObservations: figureManifests.map((file) => ({
      ...fingerprint(file),
      initialSha256: baseline.inputs.find((entry) => entry.path === file).sha256,
      writtenByThisAuthor: false,
      meaning: 'Image-worker-owned; any concurrent changes are not reverted or approved.',
    })),
    imagesOpened: 0,
    mathematicalConcernsIdentified: [],
    errataAdded: 0,
    deferred: ['independent-text-review', 'all-figure-work-and-graph-semantics',
      'adapt-finalize', 'promotion', 'publication'],
  })
  console.log(JSON.stringify({ status: 'pass', counts,
    formulaOccurrences: checks.reduce((sum, item) => sum + item.formulas, 0) }, null, 2))
} else {
  throw new Error('Use inputs before edits; outputs once after edits and copied flow anchors.')
}
