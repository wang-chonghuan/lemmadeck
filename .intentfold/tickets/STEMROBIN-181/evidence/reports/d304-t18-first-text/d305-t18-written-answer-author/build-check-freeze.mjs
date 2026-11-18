import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const startedUtc = new Date().toISOString()
const repo = process.cwd()
const root = path.dirname(fileURLToPath(import.meta.url))
const expectedRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d305-t18-written-answer-author')
assert.equal(root, expectedRoot)
const selectedIds = ['2', '3', '11', '12']
const templateRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d032-t18-text-repair/frozen')
const candidatePath = path.join(root, 'written-answers.candidate.json')
const owned = [candidatePath, fileURLToPath(import.meta.url)]
const sha = value => crypto.createHash('sha256').update(value).digest('hex')
const bind = filename => {
  const bytes = fs.readFileSync(filename)
  return { path: filename, sha256: sha(bytes), bytes: bytes.length }
}
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'))
const write = (name, value, raw = false) => {
  const filename = path.join(root, name)
  assert(filename.startsWith(`${root}/`))
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, raw ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  owned.push(filename)
  return bind(filename)
}

const humanInputs = [
  ['zh-lesson-template', path.join(templateRoot, 'lesson.template.json'), '5ec317b53627f947129d0f56d9cd46ee4089df5ec139e263e2b377c6dcf2b6fd'],
  ['zh-exercises-template', path.join(templateRoot, 'exercises.template.json'), 'fb4ca6d2d5d7d060c51e2ae8d0e3c8310cc4c67aa72b3d9cbe1e2ac494f392f0'],
  ['en-lesson-template', path.join(templateRoot, 'english.lesson.template.json'), 'd1b3cf80796c12c94915d59a5da01c09661cfc4379aa209dda41168450f29f86'],
  ['en-exercises-template', path.join(templateRoot, 'english.exercises.template.json'), 'fbc806dcc4c5108bfe3bd9bec17931d5bd65df6dd21b745c7474e980b1219f02'],
  ['prior-text-status-selected-four-only', path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d032-t18-science-effective-review.json'), '20a9faf60ed130ff34d1d0c10b32dab5f981f8ade18c062193df030c0d48f6b9'],
]
const contractInputs = [
  ['modern-written-answer-contract', '.claude/skills/ld-s10y-answer/SKILL.md'],
  ['gate2-contract-not-full-gate-execution', '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md'],
  ['existing-pure-text-delimiter-module', '.claude/skills/ld-s10y-lesson/tools/mathcheck.py'],
  ['existing-katex-syntax-parser', '.claude/skills/ld-s10y-lesson/tools/katex_check.js'],
]
const inputs = humanInputs.map(([role, filename, expected]) => {
  const b = bind(filename)
  assert.equal(b.sha256, expected, filename)
  return { role, ...b, observedMode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0'), humanHashMatched: true }
}).concat(contractInputs.map(([role, relative]) => {
  const filename = path.join(repo, relative)
  return { role, ...bind(filename), observedMode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0') }
}))
const candidate = read(candidatePath)
const zh = read(humanInputs[1][1])
const en = read(humanInputs[3][1])
const prior = read(humanInputs[4][1])
const priorStatuses = prior.exercises
  .filter(item => selectedIds.includes(String(item.number)))
  .map(({ number, status }) => ({ number: String(number), status }))
assert.deepEqual(priorStatuses.map(item => item.number), selectedIds)
assert(priorStatuses.every(item => item.status === 'PASS'))
const select = (document, id) => {
  const items = document.exercises.filter(item => String(item.number) === id)
  assert.equal(items.length, 1)
  return items[0]
}
const selected = selectedIds.map(id => ({
  id: `t18-ex${id}`,
  original: select(zh.source.data, id),
  modernZH: select(zh, id),
  modernEN: select(en, id),
  priorTextSCI: 'PASS-REUSED-NOT-NEW-ANSWER-APPROVAL',
}))
const inputBinding = write('input-bindings.json', {
  schema: 'stemrobin/bounded-written-answer-author-inputs@1',
  ticket: 'STEMROBIN-181',
  inputs,
  selectedExerciseIds: selectedIds,
  priorSelectedTextStatuses: priorStatuses,
  authorityModesObservedTruthfully: true,
  sourcePolicy: 'Full embedded source snapshots remain in the hash-bound original templates. Only the four selected source records and their exact pages are copied into selected-inputs.json. No source pages or images are reopened.',
  oldD032SolutionsOrAnswersRead: false,
  d302D303QuestionsKeysOrAnswersRead: false,
})
const selectedInput = write('selected-inputs.json', {
  schema: 'stemrobin/four-written-answer-selected-source-evidence@1',
  ticket: 'STEMROBIN-181',
  authorityBindings: inputs.slice(0, 4),
  declaredEmbeddedOriginalSource: { path: zh.source.path, sha256: zh.source.sha256, verifiedAsExternalFile: false },
  selected,
  originalSourceTextAndPagesNotRewritten: true,
})

const nativeCandidates = ['zh', 'en'].map(language => write(`${language}/answer-keys.candidate.json`, {
  schema: 'ld-s10y-answer/lesson-answers@1',
  book: '9p',
  lesson: 'phy9-c2-s4-t18',
  edition: 'modern-us-neutral',
  language,
  status: 'draft',
  answers: candidate.answers.map(item => ({
    exercise: item.exercise,
    grading: item.grading,
    source: item.source,
    displayAnswer: item.displayAnswer[language],
    parts: [],
    historical_entities: [],
  })),
}))

const structureStarted = new Date().toISOString()
let structureErrors = []
try {
  assert.equal(candidate.status, 'draft')
  assert.equal(candidate.book, '9p')
  assert.equal(candidate.lesson, 'phy9-c2-s4-t18')
  assert.equal(candidate.edition, 'modern-us-neutral')
  assert.equal(zh.count, 16)
  assert.equal(en.count, 16)
  assert.deepEqual(candidate.answers.map(item => item.exercise), selectedIds)
  assert.equal(candidate.answers.length, 4)
  for (let index = 0; index < selected.length; index++) {
    const evidence = selected[index]
    const answer = candidate.answers[index]
    assert.equal(evidence.original.text, evidence.modernZH.source_text)
    assert.equal(evidence.original.text, evidence.modernEN.source_text)
    assert.deepEqual(evidence.original.pages, evidence.modernZH.pages)
    assert.deepEqual(evidence.original.pages, evidence.modernEN.pages)
    assert.deepEqual(evidence.modernEN.chinese_text, evidence.modernZH.text)
    assert.deepEqual(evidence.original, select(en.source.data, answer.exercise))
    assert.equal(answer.source_number, evidence.original.source_number)
    assert.equal(answer.group_id, evidence.original.group_id)
    assert.deepEqual(answer.source_refs, evidence.original.pages)
    assert.equal(answer.source, 'derived')
    assert.equal(answer.grading, 'ungraded')
    assert.deepEqual(answer.parts, [])
    assert.deepEqual(answer.historical_entities, [])
    assert.deepEqual(evidence.modernZH.figure_refs, [])
    assert.deepEqual(evidence.modernEN.figure_refs, [])
    assert.deepEqual(Object.keys(answer.displayAnswer), ['zh', 'en'])
    assert(Object.values(answer.displayAnswer).every(text => typeof text === 'string' && text.trim().length > 0))
  }
  const forbidden = new Set(['expected', 'accept', 'input', 'judge', 'interaction', 'inputType'])
  const scan = value => {
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) {
      assert(!forbidden.has(key), `Forbidden candidate field: ${key}`)
      scan(child)
    }
  }
  scan(candidate)
} catch (error) {
  structureErrors = [String(error.stack ?? error)]
}
const structureResult = write('local-structure-check.json', {
  status: structureErrors.length ? 'FAIL' : 'PASS',
  scope: 'Four selected identities/source snapshots/pages, eight nonempty displayAnswer strings, derived/ungraded empty-parts shape only; no scientific or bilingual correctness approval.',
  taskCount: 4,
  languageDisplayAnswerCount: 8,
  sourceLessonTaskCount: 16,
  errors: structureErrors,
  automaticGradingKeys: 0,
  unselectedTextReviewed: false,
})
const structureReceipt = write('local-structure.receipt.json', {
  checker: bind(fileURLToPath(import.meta.url)),
  phase: 'local-selected-candidate-structure',
  startedUtc: structureStarted,
  finishedUtc: new Date().toISOString(),
  exitCode: structureErrors.length ? 1 : 0,
  input: bind(candidatePath),
  result: structureResult,
  nativeFinalize: false,
})
const texts = candidate.answers.flatMap(item => ['zh', 'en'].map(language => ({
  id: item.id, field: `displayAnswer.${language}`, text: item.displayAnswer[language],
})))
const textInput = write('local-text.input.json', texts)
const runLocal = (name, command, packet, input) => {
  const began = new Date().toISOString()
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo,
    input: JSON.stringify(packet),
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 4 * 1024 * 1024,
  })
  const stdout = write(`${name}.stdout.json`, result.stdout ?? '', true)
  const stderr = write(`${name}.stderr.txt`, result.stderr ?? '', true)
  const receipt = write(`${name}.receipt.json`, {
    command, cwd: repo, startedUtc: began, finishedUtc: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    input, stdout, stderr, invocationCount: 1,
    scope: 'Existing pure-text parser only; no browser, product renderer, image, native finalize or publication.',
    pythonBytecodeWritesDisabled: true,
  })
  let parsed = null
  try { parsed = JSON.parse(result.stdout ?? '') } catch {}
  return { parsed, exitCode: result.status, receipt, stdout, stderr }
}
const python = [
  'import json, sys',
  `sys.path.insert(0, ${JSON.stringify(path.join(repo, '.claude/skills/ld-s10y-lesson/tools'))})`,
  'from mathcheck import check_delimiters, find_math_spans',
  'rows=json.load(sys.stdin)',
  'errors=[]; fragments=[]',
  'for row in rows:',
  '    errors.extend({"id":row["id"],"field":row["field"],"error":e} for e in check_delimiters(row["text"]))',
  '    fragments.extend({"id":row["id"],"field":row["field"],"tex":tex,"display":display} for tex,display in find_math_spans(row["text"]))',
  'print(json.dumps({"textsChecked":len(rows),"errors":errors,"fragments":fragments},ensure_ascii=False))',
  'sys.exit(1 if errors else 0)',
].join('\n')
const delimiters = runLocal('local-delimiter', ['python3', '-B', '-c', python], texts, textInput)
const fragments = delimiters.parsed?.fragments ?? []
const katexInput = write('local-katex.input.json', fragments)
const katex = runLocal('local-katex', [process.execPath, path.join(repo, '.claude/skills/ld-s10y-lesson/tools/katex_check.js')], fragments, katexInput)
const katexRows = Array.isArray(katex.parsed) ? katex.parsed : []
const katexErrors = katexRows.filter(item => item.fatal || !item.ok)
const warnings = katexRows.flatMap(item => (item.warnings ?? []).map(warning => ({ id: item.id, field: item.field, warning })))
const textChecksPassed = delimiters.exitCode === 0
  && delimiters.parsed?.textsChecked === 8
  && katex.exitCode === 0
  && katexRows.length === fragments.length
  && katexErrors.length === 0
const localChecks = {
  status: structureErrors.length === 0 && textChecksPassed ? 'PASS' : 'FAIL',
  scope: 'Author-local structure and math delimiters/KaTeX syntax only; not independent SCI/ZHEN, actual DISPLAY, MathLive interaction or full gate2.',
  displayAnswersChecked: 8,
  fragmentsParsed: fragments.length,
  structureReceipt,
  delimiterReceipt: delimiters.receipt,
  delimiterExitCode: delimiters.exitCode,
  delimiterErrors: delimiters.parsed?.errors ?? ['Delimiter output unavailable'],
  katexReceipt: katex.receipt,
  katexExitCode: katex.exitCode,
  katexErrors,
  katexWarnings: warnings,
  delimiterInvocations: 1,
  katexInvocations: 1,
  failuresRetainedWithoutOverwriteOrRetry: true,
}
const actualOpens = write('actual-opens.json', {
  schema: 'bounded-text-only-actual-opens@1',
  ticket: 'STEMROBIN-181',
  authorUnit: 'existing-Locke-d305',
  opens: [],
  budget: {
    contextImagesBeforeWork: 24, newImagesOpened: 0, actualOpenCalls: 0,
    reopens: 0, otherImagesOpened: 0, cumulativeContextImages: 24, contextReset: false,
  },
  imageBytesOpenedOrHashed: 0,
  browserScreenshotsProductRendererCalls: 0,
  newAgentsWorkersWorktreesBranches: 0,
})
for (const input of inputs) assert.equal(bind(input.path).sha256, input.sha256, input.path)
const unselectedIds = ['1', '4', '5', '6', '7', '8', '9', '10', '13', '14', '15', '16']
const report = write('report.json', {
  schema: 'stemrobin/four-t18-written-answer-author-report@1',
  ticket: 'STEMROBIN-181',
  date: '2026-11-18',
  authorUnit: 'existing-Locke-d305',
  status: localChecks.status === 'PASS' ? 'AUTHOR-CANDIDATE-LOCAL-CHECKS-PASS-INDEPENDENT-REVIEW-PENDING' : 'AUTHOR-CANDIDATE-LOCAL-CHECK-FAIL-HOLD',
  candidates: bind(candidatePath),
  nativeShapedCandidates: nativeCandidates,
  inputBindings: inputBinding,
  selectedSourceEvidence: selectedInput,
  sourceAndModernPromptPolicy: 'Only questions 2,3,11,12 were read and used to write new answers. Embedded raw source text/pages are preserved exactly. Four prior text PASS statuses were consumed without reading any old solution or answer.',
  authorityModes: 'Original template bytes match human hashes; observed modes are recorded, not assumed 0444 and not changed.',
  authorReasoning: [
    { exercise: '2', sourceRefs: ['p0278#8', 'p0279#1'], coverage: 'Same E, same t, zero initial speed; vacuum force/distance; metal momentum relaxation and drift; distinguish random path and short pre-scattering limit; no invented material/time value.', SCI: 'PENDING-INDEPENDENT', ZHEN: 'PENDING-INDEPENDENT' },
    { exercise: '3', sourceRefs: ['p0279#2'], coverage: 'Ionic carriers, reduced solvent resistance and increased mobility; concentration changes conditional, not universal; conductivity relation and temperature/composition limits.', SCI: 'PENDING-INDEPENDENT', ZHEN: 'PENDING-INDEPENDENT' },
    { exercise: '11', sourceRefs: ['p0279#10'], coverage: 'Fewer gas collisions, longer free path, beam/electrode control, unwanted gas discharge and cathode protection; emission source still supplies electrons; no invented pressure.', SCI: 'PENDING-INDEPENDENT', ZHEN: 'PENDING-INDEPENDENT' },
    { exercise: '12', sourceRefs: ['p0279#11'], coverage: 'Conduction electrons and valence holes, not moving positive lattice ions; thermal equilibrium pair generation, n=p and opposite drift; unexcited zero-temperature limit.', SCI: 'PENDING-INDEPENDENT', ZHEN: 'PENDING-INDEPENDENT' },
  ],
  coverage: {
    lesson: 'phy9-c2-s4-t18', sourceTaskCount: 16, authoredTaskCount: 4,
    authoredExerciseIds: selectedIds, authoredLanguageDisplayAnswers: 8,
    unselectedExerciseIds: unselectedIds,
    unselectedDisposition: 'NOT-AUTHORED-IN-D305; no assertion that all are HOLD, already complete, or have passed answers.',
    allSource: 'derived', allGrading: 'ungraded', allParts: [],
    automaticKeysOrExpectedAcceptInputFields: 0,
    completeAnswerKey: false, wholeCardReady: false, fullGate2PASS: false,
  },
  retainedHolds: [
    { exercise: '1', id: 'fig-189', status: 'HOLD-PRESERVED', scope: 'Existing figure dependency remains; no pixel inspection or repair. It does not block these four text-only tasks.' },
    { exercise: '9', status: 'HOLD-PRESERVED', scope: 'Existing discharge-type issue without authorized erratum remains; no source correction or classification review.' },
  ],
  localChecks,
  missingStages: [
    'Independent first SCI/ZHEN review of these eight new displayAnswer texts by another existing worker',
    'Twelve source tasks are outside this author batch',
    'Existing question1 figure189 and question9 discharge-type HOLD disposition',
    'Actual DISPLAY of these new written answers',
    'Complete lesson answer gate2, native finalize and publication',
  ],
  preservation: {
    inputHashesUnchanged: inputs.length,
    rawSourceTemplatesPagesUnitsOriginalFormulaOrOldFAILHOLDChanged: false,
    priorPassingWrittenAnswersRedone: false,
    d032IndependentSolutionsCopiedOrRead: false,
    d302D303QuestionsKeysAnswersRead: false,
    previousTextPASSUsedAsNewAnswerApproval: false,
  },
  actualOpens,
  activity: {
    inheritedImages: 24, newImages: 0, cumulativeImages: 24, reset: false,
    sourceAuditPrepareFinalizePublisherOrProductionDBCalls: 0,
    canonicalMeterIndexStableSkillGitAppChanges: false,
    newAgentsWorkersWorktreesBranches: 0,
    wholeProjectChecks: 0,
  },
  authorNotIndependentReviewer: true,
  independentSCIAndZHEN: 'PENDING',
  completeLessonOrGate2PASS: false,
})
write('author-run.receipt.json', {
  command: [process.execPath, fileURLToPath(import.meta.url)],
  startedUtc, finishedUtc: new Date().toISOString(),
  completedPhase: 'local-author-checks-and-report-generation',
  phaseExitCode: localChecks.status === 'PASS' ? 0 : 1,
  independentApproval: false,
  report,
})
const freeze = write('author-freeze.json', {
  schema: 'stemrobin/four-t18-written-answer-author-freeze@1',
  ticket: 'STEMROBIN-181',
  frozenUtc: new Date().toISOString(),
  authorUnit: 'existing-Locke-d305',
  status: 'FROZEN-DRAFT-4-OF-16-INDEPENDENT-SCI-ZHEN-PENDING',
  candidates: bind(candidatePath),
  nativeCandidates,
  report,
  inputBindings: inputBinding,
  selectedSourceEvidence: selectedInput,
  actualOpens,
  verifiedInputs: inputs,
  artifacts: owned.map(filename => ({ ...bind(filename), handoffMode: '0444' })),
  localCheckStatus: localChecks.status,
  coverage: { authoredTasks: 4, sourceTasks: 16, displayAnswers: 8, selectedExerciseIds: selectedIds, unselectedExerciseIds: unselectedIds },
  independentSCIAndZHEN: 'PENDING',
  completeAnswerKey: false,
  fullGate2PASS: false,
  wholeCardReady: false,
  images: { inherited: 24, new: 0, cumulative: 24, reset: false },
  oldFAILHOLDAndAllOtherAuthorsBytesPreserved: true,
  immutability: 'All owned artifacts plus this freeze are chmod 0444. New changes require a new scope; self-hash is returned externally.',
})
for (const filename of owned) fs.chmodSync(filename, 0o444)
for (const filename of owned) assert.equal(fs.statSync(filename).mode & 0o777, 0o444)
for (const input of inputs) assert.equal(bind(input.path).sha256, input.sha256, input.path)
for (const item of read(freeze.path).artifacts) assert.equal(bind(item.path).sha256, item.sha256, item.path)
console.log(JSON.stringify({
  status: localChecks.status,
  coverage: '4/16 source tasks; 8 bilingual displayAnswers',
  independentSCIAndZHEN: 'PENDING',
  inputHashesVerified: inputs.length,
  filesFrozen0444: owned.length,
  images: { new: 0, cumulative: 24 },
  authorFreeze: bind(freeze.path),
  candidates: bind(candidatePath),
  report: bind(report.path),
  nativeCandidates,
  actualOpens,
  localChecks: { status: localChecks.status, displayAnswers: 8, fragments: fragments.length, delimiterExit: delimiters.exitCode, katexExit: katex.exitCode, errors: katexErrors.length, warnings: warnings.length },
}, null, 2))
