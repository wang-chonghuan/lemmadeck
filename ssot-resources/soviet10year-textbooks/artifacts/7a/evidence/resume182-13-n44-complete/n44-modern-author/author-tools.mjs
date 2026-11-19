import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const report = path.dirname(fileURLToPath(import.meta.url))
const working = path.join(base, 'n44-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s3-n44')
const sourceBook = path.join(base, 'n44-source-stage/artifacts/7a')
const source = path.join(sourceBook, 'lessons/alg7-c4-s3-n44')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const bindings = (directory) => names.map((name) => ({
  path: path.relative(repo, path.join(directory, name)),
  sha256: hash(path.join(directory, name)),
}))
const require = createRequire(path.join(tools, 'htmlfrag.js'))
const { proseFlow, proseOutline } = require('./htmlfrag.js')
const katex = require('katex')

function run(stage, command, args, input) {
  const before = new Date().toISOString()
  const result = spawnSync(command, args, {
    cwd: repo,
    input,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = {
    command: [command, ...args],
    cwd: repo,
    startedAt: before,
    finishedAt: new Date().toISOString(),
    exit: result.status,
    error: result.error?.message ?? null,
  }
  fs.writeFileSync(path.join(report, `${stage}.stdout`), result.stdout ?? '', { flag: 'wx' })
  fs.writeFileSync(path.join(report, `${stage}.stderr`), result.stderr ?? '', { flag: 'wx' })
  write(path.join(report, `${stage}.receipt.json`), receipt)
  assert.equal(result.status, 0, result.stderr || result.error?.message)
  return result.stdout
}

function normalize() {
  const lesson = read(path.join(working, names[0]))
  const exercises = read(path.join(working, names[1]))
  const initialLesson = read(path.join(report, 'prepared-FIRST', names[0]))
  const initialExercises = read(path.join(report, 'prepared-FIRST', names[1]))
  const latin = 'abcdefghijklmnopqrstuvwxyz'
  const cyrillic = 'абвгдежзиклмнопрстуфхцчшщэюя'
  for (const exercise of exercises.exercises) {
    exercise.text = exercise.text.replace(/^([а-я])\) /gm, (_, label) => {
      const index = cyrillic.indexOf(label)
      assert.ok(index >= 0, `unknown label ${label}`)
      return `${latin[index]}) `
    })
    exercise.lines = exercise.text.split('\n')
  }
  lesson.prose.forEach((block, index) => {
    const first = initialLesson.prose[index]
    block.changes = [...first.changes]
    if (block.text !== first.text && !block.changes.includes('wording')) {
      block.changes.push('wording')
    }
    if (index === 53) block.changes.push('math-correction')
  })
  exercises.exercises.forEach((item, index) => {
    const first = initialExercises.exercises[index]
    item.changes = [...first.changes]
    const labelOnly = first.text.replace(/^([а-я])\) /gm, (_, label) => `${latin[cyrillic.indexOf(label)]}) `)
    if (item.text !== labelOnly) item.changes.push('wording')
    if (item.text !== first.text && !item.changes.includes('layout')) item.changes.push('layout')
  })
  const normalized = JSON.parse(run('normalize-FIRST', python, ['-B', '-c', `
import json, sys
sys.path.insert(0, ${JSON.stringify(tools)})
import edition
payload = json.load(sys.stdin)
edition.normalize_lesson_layout(payload["lesson"])
edition.normalize_exercise_layout(payload["exercises"])
print(json.dumps(payload, ensure_ascii=False))
`], JSON.stringify({ lesson, exercises })))
  fs.writeFileSync(path.join(working, names[0]), `${JSON.stringify(normalized.lesson, null, 2)}\n`)
  fs.writeFileSync(path.join(working, names[1]), `${JSON.stringify(normalized.exercises, null, 2)}\n`)
  write(path.join(report, 'normalized-binding.json'), bindings(working))
  console.log(JSON.stringify({ status: 'normalized', bindings: bindings(working) }, null, 2))
}

function flow(stage) {
  run(stage, process.execPath, [
    path.join(tools, 'prose_flow.mjs'), path.join(working, names[0]),
  ])
  const lesson = read(path.join(working, names[0]))
  const paragraphs = proseOutline(lesson.prose)
  const candidates = fs.readFileSync(path.join(report, `${stage}.stdout`), 'utf8')
    .split('\n')
    .filter((line) => line.startsWith('    break: '))
    .map((line) => JSON.parse(line.slice('    break: '.length)))
  if (stage === 'prose-flow-FIRST') {
    const semanticStarts = [
      ['p0259#8', 'Negative discriminant'],
      ['p0259#9', 'Zero discriminant'],
      ['p0260#1', 'Positive discriminant'],
      ['p0260#14', 'Discriminant definition and root-count summary'],
      ['p0261#6', 'Worked examples'],
      ['p0262#1', 'Example with one root'],
      ['p0262#5', 'Example with no roots'],
      ['p0262#8', 'Incomplete quadratics'],
      ['p0263#6', 'Alternative root formula'],
      ['p0263#13', 'Example using the alternative formula'],
    ]
    const selected = semanticStarts.map(([ref, reason]) => {
      const blockIndex = lesson.prose.findIndex((block) => block.source_refs.includes(ref))
      assert.ok(blockIndex >= 0)
      const after = paragraphs.find((paragraph) => paragraph.blockIndex === blockIndex).text
      const matching = candidates.filter((boundary) => boundary.after === after)
      assert.equal(matching.length, 1, ref)
      return { source_ref: ref, reason, boundary: matching[0] }
    })
    write(path.join(report, 'section-boundaries-from-tool.json'), selected)
    console.log(JSON.stringify(selected, null, 2))
  } else {
    const flowItems = proseFlow(lesson.prose, lesson.section_breaks)
    const compared = lesson.section_breaks.map((boundary) => {
      const index = flowItems.findIndex((item) => item.sectionBreak && item.text === boundary.after)
      assert.ok(index > 0)
      assert.equal(flowItems[index - 1].text, boundary.before)
      assert.equal(flowItems[index].text, boundary.after)
      assert.equal(
        candidates.filter((item) => item.before === boundary.before && item.after === boundary.after).length,
        1,
      )
      return { index, before: flowItems[index - 1].text, after: flowItems[index].text, matched: true }
    })
    write(path.join(report, 'section-boundary-comparison.json'), {
      paragraphCount: flowItems.length,
      breakCount: compared.length,
      boundaries: compared,
    })
    console.log(JSON.stringify({ paragraphs: flowItems.length, boundaries: compared }, null, 2))
  }
}

function verify(stage) {
  const documents = names.map((name) => read(path.join(working, name)))
  const first = names.map((name) => read(path.join(report, 'prepared-FIRST', name)))
  const [lesson, exercises, figures] = documents
  const [rawLesson, rawExercises] = [
    read(path.join(source, 'lesson.json')),
    read(path.join(source, 'exercises.json')),
  ]
  const checks = []
  const check = (name, passed) => {
    checks.push({ name, passed })
    assert.ok(passed, name)
  }
  check('prepared lesson source snapshot is exact raw JSON', assert.deepEqual(first[0].source.data, rawLesson) === undefined)
  check('prepared exercises source snapshot is exact raw JSON', assert.deepEqual(first[1].source.data, rawExercises) === undefined)
  check('source SHA-256 matches prepared and working bindings',
    first[0].source.sha256 === hash(path.join(source, 'lesson.json'))
    && first[1].source.sha256 === hash(path.join(source, 'exercises.json')))
  check('source objects remain identical to prepared-FIRST',
    assert.deepEqual(lesson.source, first[0].source) === undefined
    && assert.deepEqual(exercises.source, first[1].source) === undefined)
  check('78 prose blocks retained', lesson.prose.length === 78 && rawLesson.prose.length === 78)
  check('15 exercises retained', exercises.count === 15 && exercises.exercises.length === 15
    && lesson.exercise_count === 15 && rawExercises.count === 15)
  check('858-872 exactly once and in order',
    assert.deepEqual(exercises.exercises.map((item) => item.number),
      Array.from({ length: 15 }, (_, i) => String(i + 858))) === undefined)
  check('figure template byte-identical to prepared-FIRST',
    hash(path.join(working, names[2])) === hash(path.join(report, 'prepared-FIRST', names[2])))
  check('zero lesson/exercise figures and references',
    figures.figures.length === 0 && lesson.figures.length === 0
    && exercises.exercises.every((item) => !item.figures.length && !item.figure_refs.length))
  const mutableProse = new Set(['text', 'changes'])
  lesson.prose.forEach((block, index) => {
    for (const key of Object.keys(first[0].prose[index])) {
      if (!mutableProse.has(key)) assert.deepEqual(block[key], first[0].prose[index][key], `prose[${index}].${key}`)
    }
  })
  const mutableExercise = new Set(['text', 'lines', 'changes'])
  exercises.exercises.forEach((item, index) => {
    for (const key of Object.keys(first[1].exercises[index])) {
      if (!mutableExercise.has(key)) assert.deepEqual(item[key], first[1].exercises[index][key], `exercises[${index}].${key}`)
    }
    assert.deepEqual(item.lines, item.text.split('\n'), `exercise ${item.number} text/lines`)
  })
  for (const key of Object.keys(first[0])) {
    if (!['prose', 'section_breaks', 'errata'].includes(key)) assert.deepEqual(lesson[key], first[0][key], `lesson.${key}`)
  }
  for (const key of Object.keys(first[1])) {
    if (key !== 'exercises') assert.deepEqual(exercises[key], first[1][key], `exercises.${key}`)
  }
  const erratum = { ...lesson.errata[0], corrected: first[0].errata[0].corrected }
  assert.deepEqual([erratum], first[0].errata, 'only errata.corrected is mutable')
  check('only registered c sign correction', lesson.errata.length === 1
    && lesson.errata[0].id === 'p0262-math-1'
    && lesson.errata[0].corrected === '$c=-1.21$'
    && lesson.prose[53].changes.includes('math-correction')
    && lesson.prose[53].text.includes('$c=-1.21$')
    && !lesson.prose[53].text.includes('$c=1.21$'))
  check('no context-number changes', [...lesson.prose, ...exercises.exercises]
    .every((item) => !item.numeric_changes.length && !item.changes.includes('context-number')))

  const result = JSON.parse(run(`${stage}-contracts`, python, ['-B', '-c', `
import json, sys
from pathlib import Path
sys.path.insert(0, ${JSON.stringify(tools)})
import edition
p = json.load(sys.stdin)
book = Path(p["book"])
raw_lesson, raw_exercises = p["rawLesson"], p["rawExercises"]
lesson, exercises = p["lesson"], p["exercises"]
corrections, errors = edition.validate_errata(book, raw_lesson, raw_exercises, lesson, exercises)
profile = p["profile"]
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
signatures = []
for index, (source_block, modern) in enumerate(zip(raw_lesson["prose"], lesson["prose"])):
    target = f"lesson.prose[{index}]"
    bound = corrections.get(target, [])
    errors += edition.validate_text(source_block["text"], modern["text"], modern["changes"],
        modern["numeric_changes"], target, forbidden, modern["historical_entities"], bound)
    expected = source_block["text"]
    for correction in bound:
        expected = expected.replace(correction["original"], correction["corrected"], 1)
    signatures.append({"target": target, "source_refs": source_block["source_refs"],
        "expectedMath": edition.math_signature(expected), "modernMath": edition.math_signature(modern["text"]),
        "sourceNumbers": edition.number_signature(expected), "modernNumbers": edition.number_signature(modern["text"])})
for index, (source_item, modern) in enumerate(zip(raw_exercises["exercises"], exercises["exercises"])):
    target = f"exercises[{index}]"
    errors += edition.validate_text(source_item["text"], modern["text"], modern["changes"],
        modern["numeric_changes"], target, forbidden, modern["historical_entities"],
        source_lines=source_item["lines"])
    errors += edition.validate_numbered_subpart_layout(modern["text"])
    canonical = edition.normalize_numbered_subparts(source_item["text"])
    signatures.append({"target": target, "number": modern["number"], "source_refs": source_item["pages"],
        "expectedMath": edition.math_signature(canonical), "modernMath": edition.math_signature(modern["text"]),
        "sourceNumbers": edition.number_signature(canonical), "modernNumbers": edition.number_signature(modern["text"])})
print(json.dumps({"errors": errors, "corrections": corrections, "signatures": signatures}, ensure_ascii=False))
`], JSON.stringify({
    book: sourceBook,
    rawLesson, rawExercises, lesson, exercises,
    profile: read(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')),
  })))
  write(path.join(report, `${stage}-signatures.json`), result)
  check('existing source-bound errata/text/layout contracts', result.errors.length === 0)
  for (const item of result.signatures) {
    assert.deepEqual(item.expectedMath, item.modernMath, `${item.target} math`)
    assert.deepEqual(item.sourceNumbers, item.modernNumbers, `${item.target} outside-math numbers`)
  }

  const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((match) => match[1] ?? match[2])
  const partRows = []
  for (let index = 0; index < exercises.exercises.length; index += 1) {
    const item = exercises.exercises[index]
    const initial = first[1].exercises[index]
    const oldParts = initial.lines.filter((line) => /^[а-я]\) /.test(line))
    const newParts = item.lines.filter((line) => /^[a-z]\) /.test(line))
    assert.equal(newParts.length, oldParts.length, `${item.number} subpart count`)
    newParts.forEach((line, part) => {
      assert.ok(line.startsWith(`${'abcdefghijklmnopqrstuvwxyz'[part]}) `), `${item.number} label order`)
      assert.deepEqual(math(line), math(oldParts[part]), `${item.number} part ${part} formula bytes`)
      partRows.push({ number: item.number, latin: line.slice(0, 2), source: oldParts[part].slice(0, 2), formulas: math(line) })
    })
    if (newParts.length) {
      assert.equal(item.lines.length, newParts.length + 1, `${item.number} one stem and one line per part`)
    }
  }
  check('63 subparts retained with exact formula bytes and natural labels', partRows.length === 63)
  const publishedTexts = [...lesson.prose, ...exercises.exercises].map((item) => item.text)
  check('no Cyrillic or Chinese punctuation inside modern math',
    publishedTexts.every((text) => !/[\u0400-\u04ff]/.test(text)
      && math(text).every((tex) => !/[、，；。？！：]/.test(tex))))
  let formulaCount = 0
  for (const text of publishedTexts) {
    for (const tex of math(text)) {
      katex.renderToString(tex, { throwOnError: true, strict: 'error' })
      formulaCount += 1
    }
  }
  const exercise = (number) => exercises.exercises.find((item) => item.number === number).text
  check('870 mixed primes and all mapping questions retained',
    exercise('870').includes('$E(7)$') && !exercise('870').includes("$E'(7)$")
    && exercise('870').includes("$F'(0)$")
    && (exercise('870').match(/每一点/g) ?? []).length === 3
    && (exercise('870').match(/证明/g) ?? []).length === 2
    && (exercise('870').match(/？/g) ?? []).length
      === (rawExercises.exercises.find((item) => item.number === '870').text.match(/？/g) ?? []).length)
  check('862 table lookup and accuracy retained', /查表/.test(exercise('862')) && /0\.01/.test(exercise('862')))
  check('865 both prescribed methods retained', /分别用求根公式和把方程左边分解因式这两种方法/.test(exercise('865')))
  check('866-868 exact root counts and complete parameter sets retained',
    /没有根的所有/.test(exercise('866')) && /有两个根的所有/.test(exercise('867'))
    && /哪些值.*只有一个根/s.test(exercise('868')))
  check('869 both universal claims and inclusive lower bound retained',
    (exercise('869').match(/无论变量取什么值/g) ?? []).length === 2
    && /都为正/.test(exercise('869')) && /不小于 4\./.test(exercise('869')))
  check('872 nonzero quantifier and strict bound retained',
    /只要 \$a\\neq0\$/.test(exercise('872')) && /一定大于 2\./.test(exercise('872')))
  check('working templates writable', names.every((name) => (fs.statSync(path.join(working, name)).mode & 0o200) !== 0))
  write(path.join(report, `${stage}-subparts.json`), partRows)
  write(path.join(report, `${stage}.json`), {
    status: 'author-check-pass',
    independentModernReview: 'pending',
    finalization: 'not run',
    counts: { sourceBlocks: 78, exercises: 15, subparts: 63, figures: 0, formulas: formulaCount,
      proseFlowParagraphs: proseFlow(lesson.prose, lesson.section_breaks).length,
      sectionBreaks: lesson.section_breaks.length },
    checks,
    bindings: bindings(working),
  })
  console.log(JSON.stringify({ checks: checks.length, formulas: formulaCount, errors: result.errors,
    subparts: partRows.length, bindings: bindings(working) }, null, 2))
}

function freeze() {
  const final = path.join(report, 'candidate-FINAL')
  fs.mkdirSync(final)
  for (const name of names) {
    fs.copyFileSync(path.join(working, name), path.join(final, name), fs.constants.COPYFILE_EXCL)
    fs.chmodSync(path.join(final, name), 0o444)
  }
  const inputPaths = [
    ...names.map((name) => path.join(report, 'prepared-FIRST', name)),
    ...['lesson.json', 'lesson.md', 'exercises.json'].map((name) => path.join(source, name)),
    path.join(base, 'source259-266-review/report.md'),
    path.join(base, 'n44-source-stage/candidate-binding.json'),
    path.join(base, 'n44-source-stage/metadata-erratum-binding.json'),
    path.join(base, 'stages/n44-adapt-prepare-FIRST.receipt.json'),
    ...['AGENTS.md', '.intentfold/readme.md', '.intentfold/project.json',
      '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
      '.intentfold/charter/operations.md',
      '.claude/skills/ld-s10y-lesson/SKILL.md',
      '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
      '.claude/skills/ld-s10y-lesson/references/production-resume.md',
      '.claude/skills/ld-s10y-lesson/tools/edition.py',
      '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
      '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
      '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
    ].map((name) => path.join(repo, name)),
    ...Array.from({ length: 9 }, (_, index) => index + 258).flatMap((page) =>
      ['page.md', 'page.json', 'audit.json'].map((name) =>
        path.join(sourceBook, 'pages', String(page).padStart(4, '0'), name))),
  ]
  const manifest = {
    ticket: 'STEMROBIN-182',
    lesson: 'alg7-c4-s3-n44',
    checkout: repo,
    branch: 'codex/STEMROBIN-182-textbooks',
    candidate: bindings(final),
    working: bindings(working),
    preparedFirst: bindings(path.join(report, 'prepared-FIRST')),
    inputs: inputPaths.map((file) => ({ path: path.relative(repo, file), sha256: hash(file) })),
    counts: read(path.join(report, 'verify-FINAL.json')).counts,
    independentModernReview: 'pending',
    finalization: 'not run',
    writableWorking: true,
  }
  write(path.join(report, 'hash-report.json'), manifest)
  const allFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((item) => item.isDirectory() ? allFiles(path.join(directory, item.name)) : [path.join(directory, item.name)])
    .sort()
  const files = allFiles(report)
  const evidencePaths = [...files, ...inputPaths].filter((file, index, paths) => paths.indexOf(file) === index)
  fs.writeFileSync(path.join(report, 'hashes.sha256'), evidencePaths
    .map((file) => `${hash(file)}  ${path.relative(repo, file)}`).join('\n') + '\n', { flag: 'wx' })
  for (const file of allFiles(report)) fs.chmodSync(file, 0o444)
  console.log(JSON.stringify({ status: 'author-candidate-frozen', ...manifest }, null, 2))
}

assert.equal(process.cwd(), repo, 'exact checkout required')
const action = process.argv[2]
if (action === 'normalize') normalize()
else if (action === 'flow-first') flow('prose-flow-FIRST')
else if (action === 'flow-final') flow('prose-flow-FINAL')
else if (action === 'verify') verify('verify-FINAL')
else if (action === 'freeze') freeze()
else throw new Error('expected normalize, flow-first, flow-final, verify, or freeze')
