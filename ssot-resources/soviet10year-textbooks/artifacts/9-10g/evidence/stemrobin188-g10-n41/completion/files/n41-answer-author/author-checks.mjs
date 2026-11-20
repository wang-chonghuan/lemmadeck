import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {spawnSync} from 'node:child_process'
import {createRequire} from 'node:module'
import {pathToFileURL} from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n41-answer-author')
const template = path.join(own, 'work/9-10g/modern-us-neutral/lessons/geo910-c1-s3-n41/answer-keys.template.json')
const candidate = path.join(own, 'answer-keys.candidate.json')
if (process.cwd() !== repo) throw Error('Exact repository cwd required')
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
function bind(target) {
  const bytes = fs.readFileSync(target)
  return {path: target, sha256: sha(bytes), bytes: bytes.length}
}
function save(relative, bytes) {
  const target = path.resolve(own, relative)
  if (!target.startsWith(`${own}/`)) throw Error('Write outside author directory')
  fs.mkdirSync(path.dirname(target), {recursive: true})
  fs.writeFileSync(target, bytes, {flag: 'wx'})
  return bind(target)
}
const json = (relative, value) => save(relative, `${JSON.stringify(value, null, 2)}\n`)
const read = target => JSON.parse(fs.readFileSync(target, 'utf8'))

function captureCandidate() {
  const freeze = read(path.join(own, 'derivation-freeze-receipt.json'))
  if (bind(freeze.frozenSnapshot.path).sha256 !== freeze.frozenSnapshot.sha256) {
    throw Error('Frozen independent derivations changed')
  }
  const bytes = fs.readFileSync(template)
  const document = JSON.parse(bytes)
  if (document.status !== 'draft') throw Error('Candidate must remain draft')
  const captured = save('answer-keys.candidate.json', bytes)
  const snapshot = save('snapshots/answer-keys.first-candidate.json', bytes)
  const receipt = json('candidate-first-receipt.json', {
    schema: 'n41-answer-author/candidate-receipt@1', createdAt: new Date().toISOString(),
    status: 'draft-before-checks', editableTemplate: bind(template), candidate: captured,
    firstCandidateSnapshot: snapshot, derivationFreeze: bind(path.join(own, 'derivation-freeze-receipt.json')),
    derivedBeforeWritingCandidate: true, previousCandidateReads: 0, prepareInvocations: 1,
  })
  console.log(JSON.stringify(receipt))
}

async function checks() {
  const initial = read(path.join(own, 'first-input-receipt.json'))
  const receipts = {}
  const failures = []
  const candidateBinding = bind(candidate)
  async function stage(name, action) {
    let result
    try {
      result = await action()
    } catch (error) {
      result = {status: 'fail', error: error.message, stack: error.stack}
    }
    const receipt = json(`checks/${name}.first.json`, {
      schema: 'n41-answer-author/check-receipt@1', stage: name,
      checkedAt: new Date().toISOString(), cwd: repo, candidate: candidateBinding,
      attempt: 1, ...result,
    })
    receipts[name] = receipt
    if (result.status !== 'pass') {
      failures.push({stage: name, receipt})
      json('checks/first-failure.json', {status: 'fail', failures, completedReceipts: receipts})
      throw Error(`First failure at ${name}; preserve outputs and resume only affected stage`)
    }
    return result
  }
  await stage('structure-exact-arithmetic', () => {
    const args = ['-B', path.join(own, 'structural-check.py'), candidate]
    const result = spawnSync('python3', args, {cwd: repo, encoding: 'utf8',
      env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'}})
    const stdout = save('checks/structure.first.stdout.json', result.stdout || '')
    const stderr = save('checks/structure.first.stderr.txt', result.stderr || '')
    const report = result.status === 0 ? JSON.parse(result.stdout) : null
    return {status: result.status === 0 && report?.status === 'pass' ? 'pass' : 'fail',
      executable: 'python3', args, exitCode: result.status, stdout, stderr, report,
      validator: bind(path.join(repo, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py'))}
  })
  const document = read(candidate)
  const parts = document.answers.flatMap(answer => answer.parts)
  const appRequire = createRequire(path.join(repo, 'app/package.json'))
  const katex = appRequire('katex')
  await stage('katex', () => {
    const problems = []
    let displayMathCount = 0, expectedMathCount = 0
    for (const answer of document.answers) {
      const math = [...answer.displayAnswer.matchAll(/\$([^$]+)\$/g)]
      for (const [index, match] of math.entries()) {
        displayMathCount++
        try { katex.renderToString(match[1], {throwOnError: true, strict: 'ignore'}) }
        catch (error) { problems.push({exercise: answer.exercise, displayIndex: index, error: error.message}) }
      }
      for (const [partIndex, part] of answer.parts.entries()) {
        for (const value of part.expected) {
          expectedMathCount++
          try { katex.renderToString(value, {throwOnError: true, strict: 'ignore'}) }
          catch (error) { problems.push({exercise: answer.exercise, partIndex, expected: value, error: error.message}) }
        }
      }
    }
    return {status: problems.length ? 'fail' : 'pass', displayMathCount, expectedMathCount, problems,
      runtime: bind(appRequire.resolve('katex')), proofLimit: 'Syntax/renderability only; no screenshot or mathematical verdict.'}
  })
  const helperPath = path.join(repo, '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs')
  const {validateMathExpected} = await import(pathToFileURL(helperPath).href)
  await stage('compute-engine-current-helper', () => ({
    ...validateMathExpected(parts), helper: bind(helperPath),
    runtime: bind(appRequire.resolve('@cortex-js/compute-engine')),
    proofLimit: 'Existing numeric/expression parser and finite-real contract only; not a solution proof or runtime grading test.',
  }))
  const {ComputeEngine} = appRequire('@cortex-js/compute-engine')
  const engine = new ComputeEngine()
  await stage('numeric-values-and-expression-coefficient', () => {
    const evaluated = []
    const problems = []
    const degrees = 180 / Math.PI * Math.acos(1 / 3)
    for (const answer of document.answers) {
      for (const [partIndex, part] of answer.parts.entries()) {
        if (part.judge !== 'numeric') continue
        const parsed = engine.parse(part.expected[0])
        const value = parsed.N().re
        const independent = answer.exercise === '393' ? 90
          : answer.exercise === '396' ? 60
          : answer.exercise === '398' ? 45
          : partIndex % 2 === 0 ? 2 * degrees : degrees
        evaluated.push({exercise: answer.exercise, partIndex, label: part.label,
          expected: part.expected[0], parsed: parsed.json, value, independent})
        if (!Number.isFinite(value) || Math.abs(value-independent) > 1e-10) {
          problems.push({exercise: answer.exercise, partIndex, value, independent})
        }
      }
    }
    const radicals = document.answers.find(answer => answer.exercise === '397').parts[0].expected
    const coefficients = radicals.map(value => {
      const scalar = value.replace(/\ba\b/g, '1')
      return {expected: value, scalarCheck: scalar, value: engine.parse(scalar).N().re}
    })
    for (const coefficient of coefficients) {
      if (Math.abs(coefficient.value-Math.sqrt(2/3)) > 1e-12) problems.push(coefficient)
    }
    return {status: problems.length ? 'fail' : 'pass', evaluated, coefficients, problems,
      proofLimit: 'Independent numeric conversion and constant-coefficient checks supplement frozen algebra; they do not prove geometric claims.'}
  })
  const normalizePath = path.join(repo, 'app/src/lib/answer-normalize.ts')
  const {normalizeMathAnswer, exactMathAnswersMatch} = await import(pathToFileURL(normalizePath).href)
  await stage('exact-lexical-preflight-no-mathlive', () => {
    const exact = parts.filter(part => part.judge === 'exact').map(part => ({
      label: part.label, expected: part.expected,
      normalized: part.expected.map(value => normalizeMathAnswer(value)),
    }))
    const ranges = document.answers.find(answer => answer.exercise === '392').parts
    const negatives = [
      {part: ranges[0], submitted: '10^\\circ\\le\\alpha<150^\\circ'},
      {part: ranges[0], submitted: '\\alpha\\in\\left[10^\\circ,150^\\circ\\right]'},
      {part: ranges[1], submitted: '20^\\circ<\\alpha<220^\\circ'},
      {part: document.answers[0].parts[0], submitted: '\\text{能}'},
    ].map(({part, submitted}) => ({
      label: part.label, submitted, rejected: !exactMathAnswersMatch(part.expected, submitted),
    }))
    return {status: exact.some(part => part.normalized.some(value => !value)) || negatives.some(x => !x.rejected) ? 'fail' : 'pass',
      exact, negatives, normalizer: bind(normalizePath),
      MathLiveInvoked: false,
      proofLimit: 'Only lexical preflight and known wrong-answer rejection. No setter cache, keyboard editing, focus transaction or MathLive serialization is claimed.'}
  })
  const freshness = await stage('input-binding-freshness', () => {
    const changed = initial.bindings.filter(item =>
      item.exists && bind(item.path).sha256 !== item.sha256)
    const absentChanged = initial.bindings.filter(item =>
      !item.exists && fs.existsSync(item.path))
    const freeze = read(path.join(own, 'derivation-freeze-receipt.json'))
    const frozenIntact = bind(freeze.frozenSnapshot.path).sha256 === freeze.frozenSnapshot.sha256
    const first = read(path.join(own, 'candidate-first-receipt.json'))
    const candidateIntact = bind(candidate).sha256 === first.candidate.sha256
    return {status: changed.length || absentChanged.length || !frozenIntact || !candidateIntact ? 'fail' : 'pass',
      checkedInputCount: initial.bindings.length, changed, absentChanged, frozenIntact, candidateIntact}
  })
  const stats = {
    schema: document.schema, book: document.book, lesson: document.lesson, edition: document.edition,
    status: document.status, declaredCount: document.count, answerCount: document.answers.length,
    auto: document.answers.filter(answer => answer.grading === 'auto').length,
    ungraded: document.answers.filter(answer => answer.grading === 'ungraded').length,
    parts: parts.length, judges: {}, acceptedFormsByJudge: {},
    acceptedForms: parts.reduce((sum, part) => sum + part.expected.length, 0),
    bookRawCount: document.answers.filter(answer => 'bookRaw' in answer).length,
    derivedCount: document.answers.filter(answer => answer.source === 'derived').length,
  }
  for (const part of parts) {
    stats.judges[part.judge] = (stats.judges[part.judge] || 0) + 1
    stats.acceptedFormsByJudge[part.judge] = (stats.acceptedFormsByJudge[part.judge] || 0) + part.expected.length
  }
  const exactRows = document.answers.flatMap(answer => answer.parts.flatMap((part, index) =>
    part.judge === 'exact' ? [{exercise: answer.exercise, partIndex: index, label: part.label, expected: part.expected}] : []))
  const unresolved = [
    {exercise: '399', severity: 'semantic-review-required',
      issue: 'Ray distance versus supporting-line distance is not explicit; the unrestricted full loci differ.',
      resolutionInCandidate: 'Both complete constructive loci and proofs are displayed; ungraded.',
      essentialDataMissing: false},
    {exercise: '402', part: '1)', severity: 'semantic-HOLD-before-approval',
      issue: 'Prompt omits convex, while lesson total-angle theorem explicitly assumes convex.',
      resolutionInCandidate: 'Context-bound auto answer no; precise nonconvex yes construction also displayed. Parent must approve intended convex convention or revise this part before finalization.',
      essentialDataMissing: false},
    {exercise: '403', severity: 'stated-convention',
      issue: 'The displayed and keyed angles are interior angles of the ordinary convex cyclic four-face angle.',
      resolutionInCandidate: 'Assumption stated; four edges individually keyed, exact degree conversion, no reflex-angle substitution.',
      essentialDataMissing: false},
  ]
  const artifacts = [
    candidateBinding, bind(template), bind(path.join(own, 'candidate-first-receipt.json')),
    bind(path.join(own, 'snapshots/answer-keys.first-candidate.json')),
    bind(path.join(own, 'first-input-receipt.json')),
    bind(path.join(own, 'prepare-first-receipt.json')),
    bind(path.join(own, 'resvg-first-receipt.json')),
    bind(path.join(own, 'source-derivations.md')),
    bind(path.join(own, 'snapshots/source-derivations.frozen.md')),
    bind(path.join(own, 'derivation-freeze-receipt.json')),
    bind(path.join(own, 'image-ledger.bound.json')),
    ...Object.values(receipts),
  ]
  const report = {
    schema: 'n41-answer-author/report@1',
    status: 'draft-authored-mechanical-checks-pass-independent-review-required',
    generatedAt: new Date().toISOString(), repo, ticket: 'STEMROBIN-188',
    batch: 'SAME188-6 offline9-10g', authorOnly: true,
    stats, candidate: candidateBinding, editableTemplate: bind(template),
    derivationsFrozenBeforeCandidate: true, firstCandidatePreserved: true,
    inputBindings: initial.bindings, inputSnapshots: initial.snapshots,
    inputFreshness: freshness, originalIdentitiesOrderAndGroups: initial.identities,
    sourceBoundary: initial.excludedSourceBoundary, errata: initial.errata,
    sourcePdfDeclaredMetadata: read(path.join(own, 'derivation-freeze-receipt.json')).boundSourcePdfMetadata,
    sourcePdfVerification: 'Page metadata hash is source-bound by current page JSON; PDF itself was not rehashed or opened.',
    allExpectedAlternatives: document.answers.flatMap(answer => answer.parts.map((part, index) =>
      ({exercise: answer.exercise, partIndex: index, ...part}))),
    exactAcceptedForms: exactRows,
    imageLedger: read(path.join(own, 'image-ledger.bound.json')),
    checks: receipts, artifacts, uncertainties: unresolved,
    executionFailures: initial.initialExecutionFailures,
    successfulStageInvocations: {prepare: 1, resvg: 1, derivationFreeze: 1, candidateCapture: 1, checks: 1},
    skipped: [
      'Independent reviewer / gate-2 approval: not authorized; author-only',
      'Actual finalize: prohibited',
      'Real MathLive input/edit/serialization validation: prohibited, not run; all 14 exact forms still need it',
      'Publish / DB / .env / network / installation / paid generation / git / delegation / messages: prohibited, not performed',
      'Core artifact writes, edition promotion, interaction authoring and adjacent lessons: not performed',
    ],
    gate2: {
      status: 'author-evidence-only-not-approved',
      completeAnswers: 14, sourceAndFigureBindings: 'captured and author-inspected',
      structureAndMathSyntax: 'mechanical pass, not mathematical proof',
      exactInputContract: 'pending parent MathLive check after independent review',
      essentialSemanticHold: '402(1): intended convex convention must be independently confirmed',
    },
    finalLimitation: 'This is a draft candidate and frozen author derivations, not independently reviewed, finalized, published or learner-runtime verified content.',
  }
  const reportBinding = json('author-report.json', report)
  const text = [
    '# N41 Author-Only Report',
    '',
    `Status: ${report.status}. Candidate remains draft.`,
    `Schema: ${stats.schema}; book 9-10g; edition modern-us-neutral; lesson geo910-c1-s3-n41.`,
    `Counts: ${stats.answerCount} answers, ${stats.auto} auto, ${stats.ungraded} ungraded, ${stats.parts} parts.`,
    `Judges: ${JSON.stringify(stats.judges)}; accepted forms: ${stats.acceptedForms}; per judge: ${JSON.stringify(stats.acceptedFormsByJudge)}.`,
    `Identities: ${initial.identities.map(x => x.number).join(', ')}; original source_number identical; all g1 / 习题.`,
    'Prose blocks 17. Two prose-owned current figures. No exercise-owned figures. Boundary excludes p0143#9 and 405+.',
    `Candidate: ${candidateBinding.path}`,
    `Candidate SHA-256: ${candidateBinding.sha256}`,
    `Machine report: ${reportBinding.path}`,
    `Machine report SHA-256: ${reportBinding.sha256}`,
    '',
    '## Required Review Points',
    ...unresolved.map(item => `- ${item.exercise}${item.part ? `(${item.part})` : ''}: ${item.issue} ${item.resolutionInCandidate}`),
    '',
    '## Checks And Limits',
    'Current structural helper, exact Fraction arithmetic/examples, KaTeX, current ComputeEngine helper, degree-value checks, exact lexical negative checks and input freshness all ran once and passed.',
    'These checks do not prove the mathematics. Independent review, actual finalize, MathLive keyboard editing/serialization, publication and runtime grading were not run.',
    'No core writes, network, DB, .env, git, installation, paid calls, delegation or messages.',
    'Prepare ran once. Empty first template, frozen independent derivations, first candidate snapshot and all first receipts are retained.',
    'Original answers.json is absent at explicit core book root; prepare returned no bookRaw. All 14 sources are derived. No source answers were invented.',
    'The registered NSD-to-NSB modern erratum is bound and followed; raw source/page lines remain unchanged.',
    'Image ledger: fresh 4/8 batch images, 4/24 context images, no reopens/crops/prior author images; original 160, own current-resvg 160, original 161, own current-resvg 161.',
    '',
    '## Evidence Paths And Hashes',
    ...artifacts.map(item => `- ${item.path}\n  SHA-256: ${item.sha256}`),
    '',
    'Full input path/hash bindings, all 14 source identities and groups, all 25 accepted forms, and bound image observations are in author-report.json.',
    '',
  ].join('\n')
  const textBinding = save('author-report.md', text)
  const manifest = json('output-hashes.json', {
    schema: 'n41-answer-author/output-hashes@1', generatedAt: new Date().toISOString(),
    report: reportBinding, textReport: textBinding, artifacts,
    note: 'This manifest is not self-hashed. It hashes the report and first candidate/snapshots without altering them.',
  })
  console.log(JSON.stringify({report: reportBinding, textReport: textBinding, manifest, candidate: candidateBinding, stats}, null, 2))
}

if (process.argv[2] === 'capture') captureCandidate()
else if (process.argv[2] === 'checks') await checks()
else throw Error('Expected capture or checks')
