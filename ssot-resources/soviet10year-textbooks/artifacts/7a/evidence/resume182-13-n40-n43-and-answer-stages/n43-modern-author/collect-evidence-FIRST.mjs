import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), repo, 'Use the exact authorized cwd')
const git = (args) => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout.trim()
}
const branch = 'codex/STEMROBIN-182-textbooks'
assert.equal(git(['branch', '--show-current']), branch)
const batch = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const author = path.join(batch, 'n43-modern-author')
const lessonId = 'alg7-c4-s3-n43'
const raw = path.join(batch, 'n41-n43-source-stage/artifacts/7a/lessons', lessonId)
const templates = path.join(batch, 'n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons', lessonId)
const names = ['lesson.template.json', 'exercises.template.json']
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex')
const hash = (file) => sha(fs.readFileSync(file))
const fingerprint = (file) => ({ path: file, sha256: hash(file) })
const writeNew = (file, value) => {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
}
const freeze = (directory) => {
  const target = path.join(author, directory)
  fs.mkdirSync(target)
  return names.map((name) => {
    const source = path.join(templates, name)
    const destination = path.join(target, name)
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(destination, 0o444)
    return { ...fingerprint(destination), template: source, templateSha256: hash(source) }
  })
}
const rawLesson = read(path.join(raw, 'lesson.json'))
const rawExercises = read(path.join(raw, 'exercises.json'))
const lesson = read(path.join(templates, names[0]))
const exercises = read(path.join(templates, names[1]))
assert.equal(rawLesson.prose.length, 37)
assert.deepEqual(rawExercises.exercises.map((item) => item.number), ['855', '856', '857'])
assert.deepEqual(lesson.source.data, rawLesson)
assert.deepEqual(exercises.source.data, rawExercises)
assert.equal(lesson.source.sha256, hash(path.join(raw, 'lesson.json')))
assert.equal(exercises.source.sha256, hash(path.join(raw, 'exercises.json')))

const phase = process.argv[2]
if (phase === 'inputs') {
  const files = [
    ...['lesson.json', 'lesson.md', 'exercises.json'].map((name) => path.join(raw, name)),
    ...names.map((name) => path.join(templates, name)),
    path.join(templates, 'figures.template.json'),
    path.join(batch, 'n41-n43-adapt-work/adapt/7a/modern-us-neutral/book.template.json'),
    path.join(batch, 'n41-n43-source-stage/candidate-binding.json'),
    path.join(batch, 'source251-258-review/review.md'),
    path.join(batch, 'source251-258-review/bindings.json'),
    ...['receipt.json', 'stdout', 'stderr'].map((suffix) =>
      path.join(batch, `stages/n41-n43-modern-prepare-FIRST.${suffix}`)),
    ...['0255', '0256', '0257', '0258'].flatMap((page) =>
      ['page.md', 'page.json'].map((name) =>
        path.join(batch, 'n41-n43-source-stage/artifacts/7a/pages', page, name))),
    ...[
      '.intentfold/readme.md',
      '.intentfold/project.json',
      '.intentfold/tickets/STEMROBIN-182/ticket.json',
      ...['product', 'engineering', 'operations', 'ui'].map((name) => `.intentfold/charter/${name}.md`),
      '.claude/skills/ld-s10y-lesson/SKILL.md',
      '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
      '.claude/skills/ld-s10y-lesson/references/production-resume.md',
      '.agents/skills/ld-s10y-image/SKILL.md',
      '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
      '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
      '.claude/skills/ld-s10y-lesson/tools/edition.py',
      '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
    ].map((name) => path.join(repo, name)),
  ]
  writeNew(path.join(author, 'input-hashes-FIRST.json'), {
    schema: 'stemrobin182/n43-modern-author-inputs@1',
    capturedAt: new Date().toISOString(),
    cwd: repo,
    branch,
    gitHead: git(['rev-parse', 'HEAD']),
    gitStatusBefore: git(['status', '--short', '--branch']),
    offline: true,
    ticketRead: 'Existing local checkpoint only; backend prohibited by direct instruction.',
    counts: { proseBlocks: 37, exercises: 3, figures: 0 },
    inputs: files.map(fingerprint),
    snapshots: freeze('input-FIRST'),
  })
  console.log('Input bindings and immutable input-FIRST snapshots captured.')
} else if (phase === 'freeze') {
  writeNew(path.join(author, 'authored-snapshots-FIRST.json'), {
    capturedAt: new Date().toISOString(),
    cwd: repo,
    branch,
    snapshots: freeze('authored-FIRST'),
  })
  console.log('Immutable authored-FIRST snapshots captured before verification.')
} else if (phase === 'flow' || phase === 'outputs') {
  const baseline = read(path.join(author, 'input-hashes-FIRST.json'))
  const editable = names.map((name) => path.join(templates, name))
  for (const entry of baseline.inputs.filter((item) => !editable.includes(item.path))) {
    assert.equal(hash(entry.path), entry.sha256, `Observed read-only input changed: ${entry.path}`)
  }
  for (const entry of baseline.snapshots) {
    assert.equal(hash(entry.path), entry.sha256, `Immutable input snapshot changed: ${entry.path}`)
    assert.equal(fs.statSync(entry.path).mode & 0o222, 0)
  }
  const command = [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', editable[0]]
  const result = spawnSync(process.execPath, command, { cwd: repo, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const flow = JSON.parse(result.stdout)
  if (phase === 'flow') {
    assert.deepEqual(lesson.section_breaks, [])
    const textCommand = [command[0], editable[0]]
    const textResult = spawnSync(process.execPath, textCommand, { cwd: repo, encoding: 'utf8' })
    assert.equal(textResult.status, 0, textResult.stderr)
    writeNew(path.join(author, 'prose-flow-before-anchors-command-FIRST.json'), {
      command: [process.execPath, ...textCommand],
      cwd: repo,
      exit: textResult.status,
      stdout: textResult.stdout,
      stderr: textResult.stderr,
      templateSha256: hash(editable[0]),
    })
    writeNew(path.join(author, 'prose-flow-before-anchors-FIRST.json'), {
      command: [process.execPath, ...command],
      cwd: repo,
      templateSha256: hash(editable[0]),
      ...flow,
      adjacentBoundaryCandidates: flow.paragraphs.slice(1).map((item) => ({
        before: flow.paragraphs[item.index - 1].text,
        after: item.text,
      })),
    })
    console.log(JSON.stringify(flow, null, 2))
  } else {
    const snapshots = read(path.join(author, 'authored-snapshots-FIRST.json')).snapshots
    for (const entry of snapshots) {
      assert.equal(hash(entry.path), entry.sha256, 'FIRST authored snapshot changed')
      assert.equal(hash(entry.template), entry.templateSha256, 'Candidate no longer matches FIRST')
      assert.equal(entry.sha256, entry.templateSha256)
      assert.equal(fs.statSync(entry.path).mode & 0o222, 0)
    }
    const formulas = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((match) => match[1])
    const numbers = (text) => text.match(/-?\d+(?:\.\d+)?/g) ?? []
    const normalize = (text) => text
      .replace(/([а-бвгдеёжзик])\)/gu, ')')
      .replace(/(^|\n)([a-z])\)/g, '$1)')
      .replace(/[\s,，;；:：.。?？!！]/g, '')
    const profile = read(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
    assert.equal(lesson.prose.length, 37)
    assert.equal(lesson.exercise_count, 3)
    assert.equal(exercises.count, 3)
    assert.equal(exercises.exercises.length, 3)
    assert.equal(lesson.status, 'draft')
    assert.equal(exercises.status, 'draft')
    for (const key of ['id', 'card_id', 'chapter', 'section', 'number', 'title', 'printed_title', 'start_page', 'start_printed', 'figures']) {
      assert.deepEqual(lesson[key], rawLesson[key], `Lesson ${key} changed`)
    }
    const targets = [
      ...lesson.prose.map((item, i) => ({ item, source: rawLesson.prose[i], target: `prose:${i}` })),
      ...exercises.exercises.map((item, i) => ({ item, source: rawExercises.exercises[i], target: `exercise:${item.number}` })),
    ]
    const checks = targets.map(({ item, source, target }) => {
      assert.equal(item.source_text, source.text, `${target}: source_text`)
      assert.deepEqual(formulas(item.text), formulas(source.text), `${target}: formulas`)
      assert.deepEqual(numbers(item.text), numbers(source.text), `${target}: numbers`)
      assert.equal(normalize(item.text), normalize(source.text), `${target}: non-layout wording`)
      assert.deepEqual(item.numeric_changes, [])
      assert.deepEqual(item.historical_entities, [])
      assert.deepEqual(item.changes, item.text === source.text ? [] : ['layout'])
      assert.equal(/\p{Script=Cyrillic}/u.test(item.text), false)
      assert.equal(/[<>]/.test(item.text.replace(/\$[^$]*\$/g, '')), false)
      for (const formula of formulas(item.text)) assert.equal(/[，；。？！：、]/.test(formula), false)
      for (const term of [...profile.forbidden_terms, ...profile.forbidden_person_names]) {
        assert.equal(item.text.includes(term), false, `${target}: ${term}`)
      }
      if (target.startsWith('prose:')) {
        for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
          assert.deepEqual(item[key], source[key], `${target}: ${key}`)
        }
      } else {
        for (const key of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']) {
          assert.deepEqual(item[key], source[key], `${target}: ${key}`)
        }
        assert.deepEqual(item.lines, item.text.split('\n'))
        const labels = item.lines.flatMap((line) => /^([a-z])\) /.exec(line)?.[1] ?? [])
        assert.deepEqual(labels, labels.map((_, i) => String.fromCharCode(97 + i)))
        if (labels.length) assert.equal(item.lines.length, labels.length + 1)
      }
      return {
        target,
        sourceRefs: source.source_refs ?? source.pages,
        formulaCount: formulas(item.text).length,
        formulaSequenceExact: true,
        numericSequenceExact: true,
        wordingExactIgnoringLayoutAndSubpartLabels: true,
        sourceBindingExact: true,
      }
    })
    assert.deepEqual(lesson.errata, [])
    const suspect = lesson.prose.find((item) => item.source_refs.includes('p0256#5'))
    assert.equal(suspect.text.includes('第一项与第二项的和的两倍'), true)
    assert.equal(suspect.text.includes('第一项与第二项的积的两倍'), false)
    const anchors = read(path.join(author, 'prose-flow-before-anchors-FIRST.json'))
    for (const boundary of lesson.section_breaks) {
      assert.equal(anchors.adjacentBoundaryCandidates.some((item) =>
        item.before === boundary.before && item.after === boundary.after), true)
    }
    assert.equal(flow.boundaries.length, lesson.section_breaks.length)
    const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
    const { proseFlow } = require(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
    const publishedFlow = proseFlow(lesson.prose, lesson.section_breaks)
    assert.deepEqual(publishedFlow.map((item) => item.text), flow.paragraphs.map((item) => item.text))
    assert.equal(publishedFlow.filter((item) => item.sectionBreak).length, lesson.section_breaks.length)
    const katex = require('katex')
    for (const { item, target } of targets) {
      for (const tex of formulas(item.text)) {
        assert.doesNotThrow(() => katex.renderToString(tex, { throwOnError: true }), `${target}: KaTeX`)
      }
    }
    const layoutCommand = [
      '-B',
      '-c',
      [
        'import json, sys',
        'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
        'import edition',
        'data = json.load(sys.stdin)',
        'result = {',
        '  "prose": [{"index": i, "matches": edition.normalize_prose_layout(item["text"]) == item["text"], "normalized": edition.normalize_prose_layout(item["text"])} for i, item in enumerate(data["prose"])],',
        '  "exercises": [{"number": item["number"], "matches": edition.normalize_numbered_subparts(item["text"]) == item["text"], "errors": edition.validate_numbered_subpart_layout(item["text"])} for item in data["exercises"]]',
        '}',
        'print(json.dumps(result, ensure_ascii=False))',
      ].join('\n'),
    ]
    const layoutResult = spawnSync(path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), layoutCommand, {
      cwd: repo,
      encoding: 'utf8',
      input: JSON.stringify({ prose: lesson.prose, exercises: exercises.exercises }),
    })
    assert.equal(layoutResult.status, 0, layoutResult.stderr)
    const layout = JSON.parse(layoutResult.stdout)
    assert.equal(layout.prose.every((item) => item.matches), true, 'Prose normalization must be a fixed point')
    assert.equal(layout.exercises.every((item) => item.matches && item.errors.length === 0), true)
    const counts = {
      proseBlocks: 37,
      finalProseParagraphs: flow.paragraphs.length,
      exercises: 3,
      exerciseNumbers: exercises.exercises.map((item) => item.number),
      latinSubparts: exercises.exercises.reduce((sum, item) => sum + item.lines.filter((line) => /^[a-z]\) /.test(line)).length, 0),
      sectionBreaks: flow.boundaries.length,
      formulaOccurrences: checks.reduce((sum, item) => sum + item.formulaCount, 0),
      figures: 0,
      imagesOpened: 0,
      unresolvedMathematicalIssues: 1,
    }
    writeNew(path.join(author, 'prose-flow-FIRST.json'), {
      command: [process.execPath, ...command],
      templateSha256: hash(editable[0]),
      ...flow,
    })
    writeNew(path.join(author, 'preservation-checks-FIRST.json'), {
      schema: 'stemrobin182/n43-modern-author-checks@1',
      capturedAt: new Date().toISOString(),
      cwd: repo,
      branch,
      runtime: { executable: process.execPath, version: process.version },
      preservationStatus: 'pass',
      contentStatus: 'hold-pending-source-bound-erratum',
      independentReview: false,
      counts,
      checks,
      sharedProseFlowMatchesCLI: true,
      anchorsCopiedFromActualPreAnchorFlow: true,
      allFormulasKaTeXStrictPass: true,
      canonicalLayoutFixedPoint: true,
      canonicalLayoutChecks: layout,
      observedReadOnlyInputsUnchanged: true,
      rawAndSourceSnapshotsUnchanged: true,
      n44Excluded: true,
      noExerciseAnswerOrChoiceFields: exercises.exercises.every((item) =>
        Object.keys(item).every((key) => !/answer|choice|interaction|accept|correct|solution/i.test(key))),
      sourceDomainWordingPreserved: true,
      suspectWordingPreserved: true,
      sourceErrataStillEmpty: true,
      snapshots,
      stoppedBefore: ['independent modern review', 'adapt-finalize', 'promotion', 'render', 'publication'],
    })
    console.log(JSON.stringify({ preservationStatus: 'pass', contentStatus: 'hold-pending-source-bound-erratum', counts }, null, 2))
  }
} else {
  throw new Error('Use inputs, flow, freeze, or outputs.')
}
