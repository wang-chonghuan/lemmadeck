import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-181'
const id = 'phy9-c2-s2-t7'
const source = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${id}`
const adapt = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${id}`
const before = `${ticket}/tmp/9p-t7-before`
const helper = `${ticket}/tmp/build-d018-t7-prose.mjs`
const checkPath = `${ticket}/tmp/9p-t7-author-check.json`
const freezePath = `${ticket}/tmp/9p-t7-prose-freeze.json`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  assert.equal(fs.existsSync(file), false, `Preserve existing evidence: ${file}`)
  const bytes = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
  fs.writeFileSync(file, bytes, { flag: 'wx' })
}
const names = ['lesson', 'exercises', 'figures']

function snapshot() {
  const initial = { lesson: id, source: {}, templates: {}, helper: bind(helper) }
  for (const name of names) {
    const active = `${adapt}/${name}.template.json`
    const saved = `${before}/${name}.template.json`
    writeNew(saved, fs.readFileSync(active, 'utf8'))
    assert.equal(bind(saved).sha256, bind(active).sha256)
    initial.templates[name] = { ...bind(saved), metadata: { original: active } }
  }
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    initial.source[name] = bind(`${source}/${name}`)
  }
  assert.equal(read(`${source}/lesson.json`).exercise_count, 11)
  assert.deepEqual(read(`${source}/lesson.json`).prose, [])
  assert.deepEqual(read(`${source}/lesson.json`).figures, [])
  writeNew(`${before}/bindings.json`, initial)
  console.log(JSON.stringify(bind(`${before}/bindings.json`)))
}

function unchangedSources() {
  const initial = read(`${before}/bindings.json`)
  for (const item of Object.values(initial.source)) {
    assert.equal(bind(item.path).sha256, item.sha256, `Source changed: ${item.path}`)
  }
  for (const name of ['lesson', 'figures']) {
    assert.equal(bind(`${adapt}/${name}.template.json`).sha256, initial.templates[name].sha256)
  }
  const draft = read(`${adapt}/exercises.template.json`)
  const previous = read(`${before}/exercises.template.json`)
  assert.deepEqual(draft.source, previous.source)
  assert.equal(draft.count, 11)
  assert.equal(draft.exercises.length, 11)
  for (let index = 0; index < 11; index++) {
    const current = { ...draft.exercises[index] }
    const original = { ...previous.exercises[index] }
    for (const field of ['text', 'lines', 'changes']) {
      delete current[field]
      delete original[field]
    }
    assert.deepEqual(current, original, `Unexpected field change: task${index + 1}`)
  }
  return initial
}

function check() {
  unchangedSources()
  assert.equal(fs.existsSync(checkPath), false, 'Author check already recorded; do not rerun')
  const program = `
import json,sys
from pathlib import Path
sys.path.insert(0, '.claude/skills/ld-s10y-lesson/tools')
import edition
book=Path('ssot-resources/soviet10year-textbooks/artifacts/9p')
target=Path('${adapt}')
paths=tuple(target/(name+'.template.json') for name in ('lesson','exercises','figures'))
inputs=[edition.load(p) for p in paths]
profile=edition.load(Path('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
lesson,exercises,figures,errors=edition.validate_lesson(
    book,book/'editions/modern-us-neutral','${id}',profile,candidate_paths=paths)
raw=edition.load(book/'lessons/${id}/exercises.json')
details=[]
for original,current in zip(raw['exercises'],exercises['exercises']):
    before_tokens=[match.group(0) for match in edition.MATH.finditer(original['text'])]
    after_tokens=[match.group(0) for match in edition.MATH.finditer(current['text'])]
    numeric_before=edition.number_signature(original['text'])
    numeric_after=edition.number_signature(current['text'])
    details.append({
        'number':current['number'],'sourceRefs':current['pages'],
        'sourceMathAtoms':before_tokens,'currentMathAtoms':after_tokens,
        'exactMathAtomsUnchanged':before_tokens==after_tokens,
        'sourceNumberSignature':numeric_before,'currentNumberSignature':numeric_after,
        'numbersUnchanged':numeric_before==numeric_after,
        'linesMatchText':current['lines']==current['text'].splitlines(),
        'nativeSubpartLayoutErrors':edition.validate_numbered_subpart_layout(current['text']),
        'figureRefs':current['figure_refs'],'figures':current['figures']
    })
    if before_tokens!=after_tokens: errors.append('Exact math atom drift in task'+current['number'])
    if numeric_before!=numeric_after: errors.append('Exact nonmath number drift in task'+current['number'])
    if current['lines']!=current['text'].splitlines(): errors.append('Lines/text mismatch in task'+current['number'])
if [lesson,exercises,figures]!=inputs: errors.append('Native normalization would still change candidate templates')
result={
    'role':'author-structural-layout-check-not-science-review',
    'status':'pass' if not errors else 'blocked','errors':errors,
    'proseCount':len(lesson['prose']),'taskCount':len(exercises['exercises']),
    'figureCount':len(figures['figures']),
    'exerciseOrder':[item['number'] for item in exercises['exercises']],
    'nativeSectionBreaks':lesson['section_breaks'],
    'boundaryDerivation':'validate_lesson invokes native prose_flow_contract on the empty prose; no paragraph boundaries exist.',
    'grouping':'One source task remains one written task. No numbered or lettered source subparts exist to reorder.',
    'tasks':details,'candidateFilesWritten':False,'independentScienceApproval':False
}
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(0 if not errors else 2)
`
  const result = spawnSync(python, ['-B', '-c', program], {
    encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 8 * 1024 * 1024,
  })
  const record = {
    lesson: id, helper: bind(helper),
    command: `${python} -B -c <native author check embedded in ${helper}>`,
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    result: result.stdout.trim() ? JSON.parse(result.stdout) : null,
    templates: Object.fromEntries(names.map(name => [name, bind(`${adapt}/${name}.template.json`)])),
  }
  writeNew(checkPath, record)
  console.log(JSON.stringify({ path: checkPath, exitCode: result.status, result: record.result }))
  process.exitCode = result.status ?? 2
}

function freeze() {
  const initial = unchangedSources()
  const check = read(checkPath)
  for (const [name, item] of Object.entries(check.templates)) {
    assert.equal(bind(`${adapt}/${name}.template.json`).sha256, item.sha256)
  }
  const current = read(`${adapt}/exercises.template.json`)
  const changes = current.exercises.map(item => ({
    number: item.number, sourceRefs: item.pages, sourceText: item.source_text,
    modernText: item.text, changes: item.changes,
    mathAndNumbersPreserved: check.result.tasks.find(task => task.number === item.number),
  }))
  writeNew(freezePath, {
    ticket: 'STEMROBIN-181', batch: 'D018', lesson: id, title: '练习9',
    role: 'modern-written-exercise-author-only',
    status: check.exitCode === 0 ? 'authored-awaiting-independent-science' : 'author-frozen-with-blocker',
    bindings: {
      sourceLesson: bind(`${source}/lesson.json`), sourceMarkdown: bind(`${source}/lesson.md`),
      sourceExercises: bind(`${source}/exercises.json`),
      lessonTemplate: bind(`${adapt}/lesson.template.json`),
      exercisesTemplate: bind(`${adapt}/exercises.template.json`),
      figuresTemplate: bind(`${adapt}/figures.template.json`),
      helper: bind(helper), beforeBindings: bind(`${before}/bindings.json`),
      nativeAuthorCheck: bind(checkPath),
      lessonSkill: bind('.claude/skills/ld-s10y-lesson/SKILL.md'),
      editionContract: bind('.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
      choiceSkill: bind('.agents/skills/ld-s10y-choice/SKILL.md'),
      nativeEdition: bind('.claude/skills/ld-s10y-lesson/tools/edition.py'),
      nativeProseFlow: bind('.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
      nativeHtmlFragment: bind('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
      profile: bind('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
    },
    beforeTemplates: initial.templates,
    prepare: {
      calls: 1, repeated: false,
      command: `${python} -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson ${id}`,
      exitCode: 0, observed: '正文0块,题11道,图0张',
    },
    boundaries: {
      sourceStartPhysicalPage: 161, sourceStartPrintedPage: 152,
      sourceExerciseRefs: current.exercises.map(item => ({ number: item.number, refs: item.pages })),
      sourceEndRef: current.exercises.at(-1).pages.at(-1),
      sourceAllTasksClosed: true, sourceTaskCount: 11, modernTaskCount: 11,
      sourceProseCount: 0, modernProseCount: 0, figures: [],
      sectionBreaks: check.result.nativeSectionBreaks,
      grouping: check.result.grouping,
    },
    preservation: {
      sourceFilesUnchanged: true, embeddedSourceSnapshotsUnchanged: true,
      lessonAndFigureTemplateBytesUnchanged: true,
      exactOriginalMathAtomsUnchanged: check.result.tasks.every(task => task.exactMathAtomsUnchanged),
      exactOriginalNumbersUnchanged: check.result.tasks.every(task => task.numbersUnchanged),
      sourceIdentitiesRefsOrderAndFigureListsUnchanged: true,
      errataAdded: false, numericChanges: [], inventedTasks: false,
    },
    changeRationale: [
      '1 retains the open request for everyday electrification observations; it is not converted to a fixed example or invented experiment.',
      '2 retains a material-dependent experimental unknown, known glass/silk positive reference, positive/negative reference cross-check and polarization distinction; it does not preassign plastic charge.',
      '3 isolates absorbed-electron rest-mass accounting from fragments, water and other material exchange; it does not claim a universal real-friction weighing law.',
      '4 asks whether discharge means charge disappearance, without supplying the charge-conservation answer.',
      '5 retains the source comb comparison but limits it to the electrostatic case with a discharge path through a hand or ground; it does not assert a profession-wide habit or permanent metal neutrality.',
      '6 includes approach/contact/separation and internal chemical energy; lack of friction is not assumed to imply no work or energy change.',
      '7 retains the source distance and classical instantaneous Coulomb estimate without assigning an electron a definite classical orbit.',
      '8 retains source mass, fraction and distance under an explicitly extreme hypothetical isolated point-charge model, not a realistic droplet experiment.',
      '9 retains charges, distance and before/after force targets; specifies identical isolated metal spheres and homogeneous linear isotropic kerosene, with the unprovided permittivity kept symbolic.',
      '10 preserves the three charges, vacuum, midpoint geometry and resultant magnitude/direction task; keeps all three charges positive and point-like.',
      '11 preserves length, charge, separation and each tension target; declares same-height symmetric equilibrium with gravity/buoyancy background and symbolic kerosene permittivity, without inserting ball masses or example2.1.',
    ],
    sourceToModernMappings: changes,
    nativeAuthorCheck: { exitCode: check.exitCode, status: check.result.status, errors: check.result.errors },
    remaining: ['Main independent science gate', 'Main native adapt-finalize', 'Choice authorship from the finalized allowed written seed, followed by Carson independent gate'],
    answerOrLegacyChoiceInputsRead: false, choicesAuthored: false,
    scienceSelfApproved: false, finalized: false, promoted: false,
    sourceToolsAppDbGitEdited: false, browserUsed: false, inFlightProcesses: [],
  })
  console.log(JSON.stringify(bind(freezePath)))
}

const [action] = process.argv.slice(2)
if (action === 'snapshot') snapshot()
else if (action === 'check') check()
else if (action === 'freeze') freeze()
else throw new Error('Expected snapshot, check, or freeze')
