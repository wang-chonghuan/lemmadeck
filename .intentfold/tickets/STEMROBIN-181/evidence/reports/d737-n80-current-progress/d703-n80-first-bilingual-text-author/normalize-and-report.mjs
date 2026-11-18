#!/usr/bin/env node

import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const input = path.join(ticket, 'tmp/d701-source217-consume-prepare80')
const owned = path.join(ticket, 'tmp/d703-n80-first-bilingual-text-author')
const reports = path.join(owned, 'reports')
const candidates = path.join(owned, 'candidates')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const card = 'phy10-c2-s2-n80'
const rawDir = path.join(input, 'root/10p/lessons', card)
const templateDir = path.join(input, 'work/adapt/10p/modern-us-neutral/lessons', card)
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const record = (filename) => {
  const stat = fs.statSync(filename)
  return {
    path: filename, sha256: sha(fs.readFileSync(filename)), bytes: stat.size,
    mode: (stat.mode & 0o777).toString(8),
  }
}
const write = (filename, document) => {
  assert.ok(filename.startsWith(`${owned}/`), 'Write outside author ownership')
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, `${JSON.stringify(document, null, 2)}\n`, { mode: 0o644 })
}
const preparation = read(path.join(input, 'preparation.json'))
const requirements = read(path.join(input, 'preauthor-source-requirements.json'))
const rawLesson = read(path.join(rawDir, 'lesson.json'))
const rawExercises = read(path.join(rawDir, 'exercises.json'))
const originals = Object.fromEntries(names.map((name) => [name, read(path.join(templateDir, name))]))
const authorPath = path.join(candidates, 'author-content.json')
const author = read(authorPath)

assert.equal(preparation.card, card)
assert.equal(requirements.status, 'SOURCE-CLOSED-PREAUTHOR-FROZEN')
assert.equal(requirements.boundary.first, 'p0212#6')
assert.equal(requirements.boundary.last, 'p0216#5')
assert.ok(requirements.boundary.nextHeadings.every((ref) => ref.startsWith('p0217#')))
assert.equal(record(path.join(input, 'preauthor-source-requirements.json')).sha256,
  preparation.frozenRequirements.sha256)
assert.equal(record(path.join(rawDir, 'lesson.json')).sha256, preparation.rawLesson.sha256)
assert.equal(record(path.join(rawDir, 'exercises.json')).sha256, preparation.rawExercises.sha256)
assert.deepEqual(originals[names[0]].source.data, rawLesson)
assert.deepEqual(originals[names[1]].source.data, rawExercises)
assert.equal(rawExercises.count, 12)
assert.equal(rawLesson.exercise_count, 12)
assert.deepEqual(author.exercises.map((item) => item.number),
  rawExercises.exercises.map((item) => item.number))
assert.deepEqual(author.prose.map((item) => item.key),
  rawLesson.prose.filter((item) => item.kind === 'p').map((item) => item.source_refs[0]))

const protectedPaths = [
  path.join(input, 'preparation.json'),
  path.join(input, 'preauthor-source-requirements.json'),
  path.join(rawDir, 'lesson.json'),
  path.join(rawDir, 'exercises.json'),
  ...names.map((name) => path.join(templateDir, name)),
  ...['edition.py', 'htmlfrag.js', 'prose_flow.mjs'].map((name) => path.join(tools, name)),
]
const protectedBefore = protectedPaths.map(record)
const inputBindingPath = path.join(reports, 'input-bindings.json')
if (!fs.existsSync(inputBindingPath)) write(inputBindingPath, {
  ticket: author.ticket, card, checkout: repo,
  closedSourceBoundary: requirements.boundary,
  acceptedSourceReusedWithoutReview: true,
  protectedBefore,
  imagesOpenedReadOrCreated: 0,
})
else assert.deepEqual(read(inputBindingPath).protectedBefore, protectedBefore,
  'Do not silently change frozen inputs when resuming')

const require = createRequire(import.meta.url)
const { proseOutline, proseFlow } = require(path.join(tools, 'htmlfrag.js'))
const calls = []
const outputs = {}
const candidateManifest = []

function native(name, command, args, stdin) {
  const receiptPath = path.join(reports, `${name}.receipt.json`)
  const stdoutPath = path.join(reports, `${name}.stdout.json`)
  const stderrPath = path.join(reports, `${name}.stderr.txt`)
  const invocation = {
    command, args, stdinSha256: stdin === undefined ? null : sha(stdin),
    helperHashes: protectedBefore.filter((item) => item.path.startsWith(`${tools}/`)),
    authorInput: record(authorPath),
    wrapper: record(path.join(owned, 'normalize-text.py')),
  }
  const requestSha256 = sha(JSON.stringify(invocation))
  if (fs.existsSync(receiptPath)) {
    const receipt = read(receiptPath)
    assert.equal(receipt.requestSha256, requestSha256, 'Changed completed call cannot be replayed')
    assert.equal(receipt.exitCode, 0, 'Keep first failure and recover only its diagnosed technical stage')
    assert.equal(record(stdoutPath).sha256, receipt.stdout.sha256)
    calls.push({ ...receipt, receiptPath, completedOutputReusedWithoutReplay: true })
    return read(stdoutPath)
  }
  const startedAt = new Date().toISOString()
  const result = spawnSync(command, args, {
    cwd: repo, input: stdin, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  fs.writeFileSync(stdoutPath, result.stdout ?? '', { mode: 0o644 })
  fs.writeFileSync(stderrPath, result.stderr ?? '', { mode: 0o644 })
  const receipt = {
    name, ...invocation, requestSha256, cwd: repo,
    startedAt, finishedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdout: record(stdoutPath), stderr: record(stderrPath),
  }
  write(receiptPath, receipt)
  calls.push({ ...receipt, receiptPath, completedOutputReusedWithoutReplay: false })
  assert.equal(result.status, 0, `${name} failed; original receipt retained at ${receiptPath}`)
  return read(stdoutPath)
}

const caption = (value) => value.replace(/^图\s*(\d+)$/, 'Figure $1')
const stripProse = ({ text, changes, ...identity }) => identity
const stripExercise = ({ text, lines, changes, group, figures, ...identity }) => ({
  ...identity, figures: figures.map(({ label, ...binding }) => binding),
})

for (const locale of ['zh', 'en']) {
  const directory = path.join(candidates, locale, card)
  const lesson = structuredClone(originals[names[0]])
  const exercises = structuredClone(originals[names[1]])
  const figures = structuredClone(originals[names[2]])
  const request = JSON.stringify({
    prose: author.prose.map((item) => ({
      key: item.key, sentences: item[locale],
      source_text: lesson.prose.find((block) => block.source_refs[0] === item.key).source_text,
    })),
    exercises: author.exercises.map((item) => ({
      number: item.number, text: item[locale],
      changes: locale === 'en' ? ['translation', 'layout'] : ['modernized', 'layout'],
      source_text: exercises.exercises.find((block) => block.number === item.number).source_text,
    })),
  })
  const normalized = native(`normalize-${locale}`,
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    [path.join(owned, 'normalize-text.py')], request)
  lesson.locale = locale
  lesson.title = author.titles[locale]
  for (const block of lesson.prose) {
    if (block.kind === 'p') {
      block.text = normalized.prose.find((item) => item.key === block.source_refs[0]).text
      block.changes = ['modernized', 'clarification', 'layout',
        ...(locale === 'en' ? ['translation'] : [])]
    } else if (block.kind === 'cap' && locale === 'en') {
      block.text = caption(block.text)
      block.changes = ['translation']
    }
  }
  exercises.locale = locale
  for (const item of exercises.exercises) {
    const modern = normalized.exercises.find((block) => block.number === item.number)
    item.text = modern.text
    item.lines = modern.lines
    item.changes = modern.changes
    if (locale === 'en') {
      item.group = 'Exercises 9'
      item.figures = item.figures.map((figure) => ({ ...figure, label: caption(figure.label) }))
    }
  }
  if (locale === 'en') {
    lesson.figures = lesson.figures.map((figure) => ({ ...figure, label: caption(figure.label) }))
    for (const figure of figures.figures) {
      figure.label = caption(figure.label)
      if (!figure.changes.includes('translation')) figure.changes.push('translation')
    }
  }

  const outline = proseOutline(lesson.prose)
  lesson.section_breaks = author.sectionStartRefs.map((ref) => {
    const first = outline.find((item) => lesson.prose[item.blockIndex].source_refs[0] === ref)
    assert.ok(first && first.index > 0, `Missing concept start ${ref}`)
    return { before: outline[first.index - 1].text, after: first.text }
  })
  assert.deepEqual(lesson.source, originals[names[0]].source)
  assert.deepEqual(exercises.source, originals[names[1]].source)
  assert.equal(lesson.printed_title, originals[names[0]].printed_title)
  assert.deepEqual(lesson.prose.map(stripProse), originals[names[0]].prose.map(stripProse),
    'Prose source text, identity, reference order and source marker labels stay untouched')
  assert.deepEqual(exercises.exercises.map(stripExercise),
    originals[names[1]].exercises.map(stripExercise),
    'Task snapshots, numbers, pages, group IDs and figure bindings stay untouched')
  for (const field of ['id', 'card_id', 'chapter', 'section', 'number', 'start_page',
    'start_printed', 'exercise_count', 'schema', 'edition', 'status', 'errata']) {
    assert.deepEqual(lesson[field], originals[names[0]][field])
  }
  assert.equal(exercises.count, 12)
  for (const item of exercises.exercises) {
    assert.equal(item.group_id, 'g1')
    assert.ok(!('answerKey' in item) && !('interaction' in item) && !('choices' in item))
  }
  assert.deepEqual(figures.figures.map((figure) => figure.source),
    originals[names[2]].figures.map((figure) => figure.source))
  assert.deepEqual(figures.figures.map((figure) => figure.id),
    originals[names[2]].figures.map((figure) => figure.id))
  assert.ok(!figures.figures.some((figure) => figure.id === 'fig-185'),
    'Shared Figure 185 is not silently approved or imported')
  assert.deepEqual(exercises.exercises[7].text.match(/^[12]\).+$/gm)?.length, 2)
  for (const [index, document] of [lesson, exercises, figures].entries()) {
    const destination = path.join(directory, names[index])
    fs.mkdirSync(directory, { recursive: true })
    if (fs.existsSync(destination)) assert.deepEqual(read(destination), document,
      'Do not overwrite someone else\'s changed candidate')
    else {
      fs.copyFileSync(path.join(templateDir, names[index]), destination, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(destination, 0o644)
      write(destination, document)
    }
    assert.equal(record(destination).mode, '644')
    candidateManifest.push({ locale, role: names[index], ...record(destination) })
  }
  const lessonPath = path.join(directory, names[0])
  const flow = native(`prose-flow-${locale}`, process.execPath,
    [path.join(tools, 'prose_flow.mjs'), '--json', lessonPath])
  assert.deepEqual(flow.paragraphs, outline)
  assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })),
    lesson.section_breaks)
  const actualFlow = proseFlow(lesson.prose, lesson.section_breaks)
  assert.deepEqual(actualFlow.filter((block) => block.kind === 'fig').map((block) => block.id),
    rawLesson.prose.filter((block) => block.kind === 'fig').map((block) => block.id))
  outputs[locale] = { lesson, exercises, figures, normalized, flow }
}

const sourceBlock = (ref) => {
  const block = requirements.blocks.find((item) => item.ref === ref)
  assert.ok(block, `Missing frozen source block ${ref}`)
  return { ref, kind: block.kind, lines: block.lines }
}
const sourceMapping = {
  ticket: author.ticket, card, status: 'AUTHOR-MAPPING-NOT-INDEPENDENT-APPROVAL',
  sourceBoundary: requirements.boundary,
  prose: originals[names[0]].prose.map((block, index) => ({
    originalBlockIndex: index, kind: block.kind, id: block.id, label: block.label,
    source_text: block.source_text, sourceTextSha256: sha(block.source_text),
    source_refs: block.source_refs, closedSourceBlocks: block.source_refs.map(sourceBlock),
    concepts: author.prose.find((item) => item.key === block.source_refs[0])?.concepts
      ?? ['Preserved source figure identity and localized modern caption'],
    candidates: Object.fromEntries(['zh', 'en'].map((locale) => [locale, {
      path: path.join(candidates, locale, card, names[0]), jsonPointer: `/prose/${index}`,
      text: outputs[locale].lesson.prose[index].text,
      textSha256: sha(outputs[locale].lesson.prose[index].text),
      paragraphs: outputs[locale].flow.paragraphs.filter((item) => item.blockIndex === index),
      preservation: outputs[locale].normalized.prose.find((item) =>
        item.key === block.source_refs[0])?.preservation ?? null,
    }])),
  })),
  exercises: originals[names[1]].exercises.map((item, index) => ({
    number: item.number, source_number: item.source_number, group: item.group,
    group_id: item.group_id, pages: item.pages, figure_refs: item.figure_refs,
    source_text: item.source_text, sourceTextSha256: sha(item.source_text),
    closedSourceBlocks: item.pages.map(sourceBlock),
    concepts: author.exercises.find((entry) => entry.number === item.number).concepts,
    candidates: Object.fromEntries(['zh', 'en'].map((locale) => [locale, {
      path: path.join(candidates, locale, card, names[1]),
      jsonPointer: `/exercises/${index}`,
      text: outputs[locale].exercises.exercises[index].text,
      textSha256: sha(outputs[locale].exercises.exercises[index].text),
      preservation: outputs[locale].normalized.exercises[index].preservation,
    }])),
    answerOrChoiceSupplied: false,
  })),
}
write(path.join(reports, 'source-text-mapping.json'), sourceMapping)
write(path.join(reports, 'science-issues.json'), {
  ticket: author.ticket, card, status: 'ISSUES-FOR-INDEPENDENT-REVIEW-NOT-APPROVAL',
  authority: 'Newly closed source and explicit human authoring constraints only.',
  issues: author.scienceIssues,
  noErrataRegistered: true,
  noAnswersChoicesMedicalRecommendationsOrNewFormulas: true,
  imagesOpenedReadOrCreated: 0,
})

const treatments = [
  {
    treatment: 'All original prose and twelve tasks are mapped bilingually, including the cross-page eighth task and both assignments; exact source token/number/figure interleaving is checked.',
    refs: author.prose.map((item) => item.key),
    tasks: author.exercises.map((item) => item.number),
    issueIds: [],
  },
  {
    treatment: 'Small angles, radians and equal length units are explained; the comparison distance stays conventional and relaxed viewing requires a suitable focusing state.',
    refs: ['p0212#8', 'p0213#1', 'p0213#2', 'p0213#7', 'p0214#3'],
    tasks: [], issueIds: ['SCI-SMALL-ANGLE', 'SCI-REFERENCE-DISTANCE', 'SCI-RELAXED-EYE'],
  },
  {
    treatment: 'The source standalone phi2 token and calculation are retained exactly, with the undefined symbol linkage stated in both languages; no replacement or erratum is authorized.',
    refs: ['p0214#2'], tasks: [], issueIds: ['SCI-PHI2-AMBIGUITY'],
  },
  {
    treatment: 'Both original task2 tokens and the question remain; the absent physical ruler/segment length is documented separately, without inferred scale length, unit change or answer.',
    refs: ['p0215#5'], tasks: ['2'], issueIds: ['SCI-TASK2-INSUFFICIENT-DATA'],
  },
  {
    treatment: 'The complete objective/intermediate-image/eyepiece/eye chain and A/A1/A2 order remain, with qualified simplified optics; Figure185 is referenced but not presumed modern-approved.',
    refs: ['p0212#8', 'p0214#4', 'p0214#5', 'p0214#8'],
    tasks: [], issueIds: ['SCI-MICROSCOPE-MODEL', 'FIG-SHARED185'],
  },
  {
    treatment: 'All tasks remain read-only/open content candidates, with no interaction, keyboard configuration, answer keys or choices authored.',
    refs: [], tasks: author.exercises.map((item) => item.number), issueIds: [],
  },
  {
    treatment: 'The existing helper groups only two or three complete authored prose sentences, and actual outline anchors resolve in one native prose_flow call per locale; all downstream reviews remain pending.',
    refs: author.sectionStartRefs, tasks: [],
    issueIds: ['DISPLAY-LOCALIZED-METADATA'],
  },
]
assert.equal(treatments.length, requirements.requirements.length)
write(path.join(reports, 'requirement-mapping.json'), {
  ticket: author.ticket, card,
  authoritativeRequirements: record(path.join(input, 'preauthor-source-requirements.json')),
  requirements: requirements.requirements.map((requirement, index) => ({
    index, requirement, ...treatments[index],
    mapping: path.join(reports, 'source-text-mapping.json'),
    scientificIssues: path.join(reports, 'science-issues.json'),
    status: 'AUTHOR-MAPPED-INDEPENDENT-REVIEW-PENDING',
  })),
})
const protectedAfter = protectedPaths.map(record)
assert.deepEqual(protectedAfter, read(inputBindingPath).protectedBefore)
write(path.join(reports, 'preservation.json'), {
  status: 'PASS-MECHANICAL-PRESERVATION-ONLY',
  protectedBefore, protectedAfter,
  sourceSnapshotsPrintedTitleRefsAndOrderUntouched: true,
  exactFormulaTokensNumbersFigureInterleavingRetained: true,
  sourceTaskNumbers: rawExercises.exercises.map((item) => item.number),
  originalTask8AssignmentsRetained: true,
  sourcePhi2RetainedWithoutErratum: true,
  task2LiteralDataRetainedWithoutInventedLength: true,
  localizedDisplayFieldsOnly: {
    lessonTitle: author.titles,
    englishLessonFigureLabels: true,
    englishExerciseGroupAndDisplayedFigureLabels: true,
    englishFigureTemplateLabels: true,
    proseMarkerIdentityLabelsUnchanged: true,
  },
  fullEditionValidatorNotRunOrClaimed: true,
  imagesOpenedReadOrCreated: 0,
})
const report = {
  ticket: author.ticket, card,
  status: 'FIRST-BILINGUAL-LESSON-AND-TWELVE-TASKS-AUTHORED-REVIEW-PENDING',
  checkout: repo, ownedDirectory: owned, sourceBoundary: requirements.boundary,
  sourceStatus: 'CLOSED-REUSED-NOT-REPREPARED-REASSEMBLED-OR-REVIEWED',
  sourceProseBlockCount: author.prose.length, sourceTaskCount: 12,
  sourceFigureReferences: requirements.figureIds,
  candidateManifest,
  locales: Object.fromEntries(['zh', 'en'].map((locale) => [locale, {
    title: outputs[locale].lesson.title,
    paragraphCount: outputs[locale].flow.paragraphs.length,
    completeProseSentenceCount: outputs[locale].normalized.prose.reduce(
      (sum, block) => sum + block.completeSentenceCount, 0),
    sectionBreakCount: outputs[locale].flow.boundaries.length,
    exerciseCount: outputs[locale].exercises.count,
    proseFlowCalls: 1,
    proseFlowReceipt: record(path.join(reports, `prose-flow-${locale}.receipt.json`)),
    normalizationReceipt: record(path.join(reports, `normalize-${locale}.receipt.json`)),
  }])),
  nativeCalls: calls,
  evidence: ['input-bindings.json', 'source-text-mapping.json', 'science-issues.json',
    'requirement-mapping.json', 'preservation.json'].map((name) => record(path.join(reports, name))),
  authorInputsAndScripts: [authorPath, path.join(owned, 'normalize-text.py'),
    path.join(owned, 'normalize-and-report.mjs')].map(record),
  imageCount: 0,
  modernFigureGenerationCount: 0,
  unresolved: author.scienceIssues.map(({ id, status }) => ({ id, status })),
  pending: {
    SCI: 'Independent scientific review, including literal phi2 and task2 mathematical sufficiency.',
    ZHEN: 'Independent bilingual completeness, sentence clarity and learner-level review.',
    FIG: 'First modern figures 188..192 and shared185, without presumed reuse or approval.',
    ANSWERS: 'No answers authored; open constructions and underdetermined/ambiguous prompts await adjudication.',
    CHOICES: 'No choices authored; any future set requires original math/figure work and independent review.',
    DISPLAY: 'No render performed; localized metadata integration and shared figure binding remain unresolved.',
  },
  wholeCardApproved: false,
  finalizeRenderFiguresAnswersOrChoicesRun: false,
  canonicalOrToolWrites: false,
  meterIndexGitBackendDatabaseOrPaidOperations: false,
  newAgentsWorktreesBranchesOrWholeProjectTests: false,
}
const reportPath = path.join(reports, 'author-report.json')
write(reportPath, report)
process.stdout.write(`${JSON.stringify({
  report: record(reportPath), status: report.status, candidateManifest,
  locales: report.locales, unresolved: report.unresolved, pending: report.pending,
  imageCount: 0,
}, null, 2)}\n`)
