import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = process.cwd()
if (repo !== '/Users/yong/.codex/worktrees/00b1/lemmadeck') throw new Error('Wrong sole cwd')
const owned = path.resolve('.intentfold/tickets/STEMROBIN-181/tmp/d1202-n97-first-bilingual-text-author')
const base = path.resolve('.intentfold/tickets/STEMROBIN-181/tmp/d1201-n97n99-first-preparation')
const card = 'phy10-c2-s4-n97'
const tools = path.resolve('.claude/skills/ld-s10y-lesson/tools')
const python = path.resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python')
const originalTemplates = path.join(base, 'work/adapt/10p/modern-us-neutral/lessons', card)
const work = path.join(owned, 'work/adapt/10p/modern-us-neutral/lessons', card)
const raw = path.join(owned, 'root/10p/lessons', card)
const native = path.join(owned, 'native')
const freezePath = path.join(owned, 'FIRST-candidate-freeze.json')
const sourceFreeze = path.join(owned, 'source-freeze')
const pairs = ['zh', 'en'].flatMap((locale) => ['lesson', 'exercises'].map((kind) => ({
  locale, kind, file: path.join(work, locale, `${kind}.template.json`),
})))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const guard = (file) => {
  if (!path.resolve(file).startsWith(`${owned}/`)) throw new Error('Write outside ownership root')
  if (fs.existsSync(file) && fs.lstatSync(file).isSymbolicLink()) throw new Error('No symlink writes')
  fs.mkdirSync(path.dirname(file), { recursive: true })
}
const write = (file, value, replace = false) => {
  guard(file)
  if (replace && fs.existsSync(freezePath)) throw new Error('Candidates frozen')
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: replace ? 'w' : 'wx' })
}
const copy = (from, to) => {
  guard(to)
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(to, 0o644)
  if (hash(from) !== hash(to)) throw new Error('Copy mismatch')
}
function record(name, argv, input, origin) {
  const started = {
    cwd: repo, argv, startedAt: new Date().toISOString(), origin,
    candidates: pairs.map(({ locale, kind, file }) => ({ locale, kind, ...bind(file) })),
    freeze: fs.existsSync(freezePath) ? bind(freezePath) : null,
  }
  write(path.join(native, `${name}.started.json`), started)
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', input, maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const stdout = path.join(native, `${name}.stdout.txt`)
  const stderr = path.join(native, `${name}.stderr.txt`)
  for (const [file, text] of [[stdout, result.stdout], [stderr, result.stderr]]) {
    guard(file)
    fs.writeFileSync(file, text ?? '', { flag: 'wx' })
  }
  const receipt = {
    ...started, finishedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, executionError: result.error?.message ?? null,
    stdout: bind(stdout), stderr: bind(stderr),
  }
  write(path.join(native, `${name}.receipt.json`), receipt)
  if (result.status !== 0) {
    process.stdout.write(result.stdout ?? '')
    process.stderr.write(result.stderr ?? '')
    throw new Error(`Command failed; preserved ${name} receipt`)
  }
  return { receipt, stdout: result.stdout }
}

const mode = process.argv[2]
if (mode === 'seed') {
  if (pairs.some(({ file }) => fs.existsSync(file))) throw new Error('No reseeding')
  const reqPath = path.join(base, 'cards', card, 'source-requirements.json')
  const requirements = load(reqPath)
  if (hash(reqPath) !== '51055027234f838ee1b4272bd53d3091941c8a32ba4ae45ec32ca2c9b7c90303') {
    throw new Error('Approved requirements changed')
  }
  const sourceBindings = [
    [path.join(sourceFreeze, 'source-requirements.json'), hash(reqPath)],
    [path.join(sourceFreeze, 'lesson.json'), requirements.rawLesson.sha256],
    [path.join(sourceFreeze, 'exercises.json'), requirements.rawExercises.sha256],
    [path.join(sourceFreeze, 'meaning-inventory.json'), '0d00b1749141cbdeb8d187f9eb31dea59a95969d192de9df5df1bfe7372c616a'],
  ]
  for (const [file, expected] of sourceBindings) {
    if (hash(file) !== expected || (fs.statSync(file).mode & 0o222)) throw new Error('Source freeze mismatch')
  }
  const preparation = path.join(base, 'cards', card, 'preparation.json')
  const inputs = [reqPath, preparation, requirements.rawLesson.path, requirements.rawExercises.path]
  for (const item of requirements.sourcePages) {
    if (hash(item.path) !== item.sha256) throw new Error('Approved page binding changed')
    const page = String(load(item.path).meta.page).padStart(4, '0')
    const from = path.join(base, 'root/10p/pages', page, 'page.json')
    if (hash(from) !== item.sha256) throw new Error('Prepared page differs from approved page')
    copy(from, path.join(owned, 'root/10p/pages', page, 'page.json'))
    inputs.push(from)
  }
  copy(requirements.rawLesson.path, path.join(raw, 'lesson.json'))
  copy(requirements.rawExercises.path, path.join(raw, 'exercises.json'))
  copy(path.join(base, 'root/10p/book.json'), path.join(owned, 'root/10p/book.json'))
  inputs.push(path.join(base, 'root/10p/book.json'))
  const authored = load(path.join(owned, 'authoring.json'))
  for (const { locale, kind, file } of pairs) {
    const seedFile = path.join(originalTemplates, `${kind}.template.json`)
    const document = load(seedFile)
    document.locale = locale
    if (kind === 'lesson') {
      document.title = authored.title[locale]
      for (const item of authored.items) {
        const block = document.prose[item.index]
        block.text = item[locale]
        block.changes = block.text === block.source_text ? [] : [...item.changes]
        if (locale === 'en' && block.text !== block.source_text) block.changes.push('translation')
        block.historical_entities = item.historical_entities?.[locale] ?? []
      }
      const erratum = document.errata.find((item) => item.id === authored.erratum.id)
      if (!erratum || document.errata.length !== 1) throw new Error('Unexpected errata')
      erratum.corrected = authored.erratum.corrected
    }
    write(file, document)
    inputs.push(seedFile)
  }
  const inventoryFreeze = {
    schema: 'stemrobin/pre-draft-source-inventory@1', ticket: 'STEMROBIN-181', batch: 'D037', card,
    cwd: repo, recordedAt: new Date().toISOString(),
    chronology: 'Complete requirements and raw lesson/exercises were read, copied and chmod 444; meaning-inventory.json was written and chmod 444 before any skill, preparation or template reads. Tool-call sequence and frozen inventory filesystem timestamps preserve that order.',
    sourceSnapshotTimes: sourceBindings.map(([file]) => ({
      ...bind(file), modifiedAt: fs.statSync(file).mtime.toISOString(), mode: '0444',
    })),
    inputBindings: [...new Set(inputs)].map(bind),
    boundary: requirements.boundary,
    independentModernReview: false,
  }
  write(path.join(owned, 'source-inventory-freeze.json'), inventoryFreeze)
  fs.chmodSync(path.join(owned, 'source-inventory-freeze.json'), 0o444)
  console.log(JSON.stringify({ root: path.join(owned, 'root'), work, candidates: pairs.map(({ file }) => bind(file)) }, null, 2))
} else if (mode === 'copyedit') {
  if (fs.existsSync(freezePath)) throw new Error('Copyedit only before FIRST freeze')
  const file = path.join(work, 'en/lesson.template.json')
  const document = load(file)
  const authored = load(path.join(owned, 'authoring.json'))
  for (const index of [12, 14]) document.prose[index].text = authored.items.find((item) => item.index === index).en
  document.section_breaks = []
  write(file, document, true)
  console.log(JSON.stringify({ preFreezeCopyedit: [12, 14], locale: 'en', file }))
} else if (mode === 'layout') {
  if (fs.existsSync(freezePath)) throw new Error('Layout only before FIRST freeze')
  const suffix = process.argv[3] === 'copyedit' ? '-copyedit' : ''
  const files = pairs.filter((item) => item.kind === 'lesson' && (!suffix || item.locale === 'en')).map((item) => item.file)
  const source = [
    'import json, sys',
    'from pathlib import Path',
    `sys.path.insert(0, ${JSON.stringify(tools)})`,
    'import edition',
    `files = ${JSON.stringify(files)}`,
    'for filename in files:',
    '    file = Path(filename)',
    '    document = edition.load(file)',
    '    edition.normalize_lesson_layout(document)',
    '    edition.dump(file, document)',
    'print(json.dumps({"method":"native in-place draft layout, not finalization","files":files}))',
  ].join('\n')
  const result = record(`native-layout-authoring${suffix}`, [python, '-B', '-c', source], undefined, {
    method: 'edition.normalize_lesson_layout on owned draft copies only',
  })
  console.log(result.stdout)
} else if (mode === 'flow') {
  if (fs.existsSync(freezePath)) throw new Error('Derive boundaries before FIRST')
  const locales = process.argv[3] === 'en' ? ['en'] : ['zh', 'en']
  const suffix = process.argv[4] === 'copyedit' ? '-copyedit' : ''
  for (const locale of locales) {
    const file = path.join(work, locale, 'lesson.template.json')
    const derived = record(`${locale}-prose-flow-derive${suffix}`, ['node', path.join(tools, 'prose_flow.mjs'), file], undefined, {
      method: 'Native final paragraph output and adjacent before/after objects',
    })
    const paragraphs = new Map()
    const boundaries = new Map()
    let index
    for (const line of derived.stdout.split('\n')) {
      const paragraph = line.match(/^\[(\d+)\] (.*)$/)
      if (paragraph) {
        index = Number(paragraph[1])
        paragraphs.set(index, paragraph[2])
      } else if (line.startsWith('    break: ')) {
        boundaries.set(index, JSON.parse(line.slice('    break: '.length)))
      }
    }
    const document = load(file)
    document.section_breaks = load(path.join(owned, 'authoring.json')).sectionStarts.map((blockIndex) => {
      const firstLine = document.prose[blockIndex].text.split('\n')[0]
      const matches = [...paragraphs].filter(([, text]) => text.split('\n')[0] === firstLine)
      if (matches.length !== 1) throw new Error('Ambiguous native paragraph start')
      const anchor = boundaries.get(matches[0][0])
      if (!anchor) throw new Error('Missing native boundary')
      return anchor
    })
    write(file, document, true)
    const final = record(`${locale}-prose-flow-final${suffix}`, ['node', path.join(tools, 'prose_flow.mjs'), '--json', file], undefined, {
      method: 'Resolve copied native boundary objects against current authored prose',
    })
    const flow = JSON.parse(final.stdout)
    console.log(JSON.stringify({ locale, paragraphs: flow.paragraphs.length, boundaries: flow.boundaries }, null, 2))
  }
} else if (mode === 'freeze') {
  if (fs.existsSync(freezePath)) throw new Error('Never replace FIRST')
  const inventory = load(path.join(owned, 'source-inventory-freeze.json'))
  for (const binding of [...inventory.inputBindings, ...inventory.sourceSnapshotTimes]) {
    if (hash(binding.path) !== binding.sha256) throw new Error('Frozen source changed')
  }
  const rawLesson = load(path.join(raw, 'lesson.json'))
  const candidates = pairs.map(({ locale, kind, file }) => {
    const first = path.join(owned, 'FIRST', locale, `${kind}.template.json`)
    copy(file, first)
    fs.chmodSync(first, 0o444)
    fs.chmodSync(file, 0o444)
    return { locale, kind, current: bind(file), FIRST: bind(first) }
  })
  const copiedSources = [
    path.join(raw, 'lesson.json'), path.join(raw, 'exercises.json'), path.join(owned, 'root/10p/book.json'),
    ...fs.readdirSync(path.join(owned, 'root/10p/pages')).map((page) => path.join(owned, 'root/10p/pages', page, 'page.json')),
  ]
  const contractFiles = [
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
    '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
    ...['edition.py', 'assemble.py', 'normalize.py', 'prose_flow.mjs', 'htmlfrag.js', 'mathcheck.py', 'katex_check.js'].map((name) => path.join(tools, name)),
    '.intentfold/tickets/STEMROBIN-181/tmp/d1090-n94-first-bilingual-text-author/text-check.py',
    path.join(owned, 'authoring.json'), path.join(owned, 'author-tools.mjs'), path.join(owned, 'text-check.py'),
    path.join(owned, 'source-inventory-freeze.json'), ...inventory.sourceSnapshotTimes.map((item) => item.path),
  ]
  const freeze = {
    schema: 'stemrobin/text-first-freeze@1', ticket: 'STEMROBIN-181', batch: 'D037', card, book: '10p',
    edition: 'modern-us-neutral', cwd: repo, frozenAt: new Date().toISOString(),
    stage: 'FIRST and current templates immutable before scoped native text check',
    inputs: [...new Set([...inventory.inputBindings.map((item) => item.path), ...copiedSources, ...contractFiles])].map(bind),
    candidates, sourceInventoryFreeze: bind(path.join(owned, 'source-inventory-freeze.json')),
    sourceBoundary: inventory.boundary,
    sourceCounts: {
      requirementBlocks: load(path.join(sourceFreeze, 'source-requirements.json')).blocks.length,
      proseBlocks: rawLesson.prose.length, textBlocks: rawLesson.prose.filter((block) => block.kind === 'p').length,
      figures: rawLesson.figures.length, exercises: 0, errata: 1,
    },
    independentModernReview: false, completeCard: false,
  }
  write(freezePath, freeze)
  fs.chmodSync(freezePath, 0o444)
  console.log(JSON.stringify({ freeze: bind(freezePath), candidates }, null, 2))
} else if (mode === 'check') {
  const checked = record('text-contract-FIRST', [python, '-B', path.join(owned, 'text-check.py')], undefined, {
    reusableHelper: bind('.intentfold/tickets/STEMROBIN-181/tmp/d1090-n94-first-bilingual-text-author/text-check.py'),
    scopedHelper: bind(path.join(owned, 'text-check.py')),
    specialization: 'D037/n97 owner, root/work, source boundary, count0 and approved p0261-math-1 replacement before exact token comparison. Native APIs unchanged; no finalization or image checks.',
  })
  const result = JSON.parse(checked.stdout)
  console.log(JSON.stringify({
    status: result.status, errors: result.errors,
    locales: result.locales.map((item) => ({ locale: item.locale, status: item.status, proseBlocks: item.proseBlocks, mathTokenCount: item.mathTokenCount })),
    receipt: bind(path.join(native, 'text-contract-FIRST.receipt.json')),
  }, null, 2))
} else if (mode === 'report') {
  const freeze = load(freezePath)
  for (const binding of [...freeze.inputs, ...freeze.candidates.flatMap((item) => [item.current, item.FIRST])]) {
    if (hash(binding.path) !== binding.sha256) throw new Error('Frozen input or candidate changed')
  }
  const resultPath = path.join(native, 'text-contract-FIRST.stdout.txt')
  const result = load(resultPath)
  const receiptPath = path.join(native, 'text-contract-FIRST.receipt.json')
  const receipt = load(receiptPath)
  if (receipt.freeze.sha256 !== hash(freezePath) || result.freezeSHA256 !== hash(freezePath)) {
    throw new Error('Receipt not bound to FIRST')
  }
  const requirements = load(path.join(sourceFreeze, 'source-requirements.json'))
  const rawLesson = load(path.join(raw, 'lesson.json'))
  const authored = load(path.join(owned, 'authoring.json'))
  const inventory = load(path.join(sourceFreeze, 'meaning-inventory.json'))
  const coverage = inventory.items.map((item) => ({
    ...item,
    coveredBy: item.id === 'M01' ? ['lesson.title and retained number/printed_title']
      : item.id === 'M20' ? ['both exercises.template.json count=0, exercises=[]']
        : rawLesson.prose.flatMap((block, index) => item.sourceRefs.some((ref) => block.source_refs.includes(ref)) ? [
          { index, kind: block.kind, sourceRefs: block.source_refs, locales: ['zh', 'en'] },
        ] : []),
    authorAssessment: 'covered; independent bilingual semantic review pending',
  }))
  write(path.join(owned, 'source-coverage.json'), {
    schema: 'stemrobin/source-coverage@1', ticket: 'STEMROBIN-181', batch: 'D037', card,
    frozenBeforeTemplates: bind(path.join(sourceFreeze, 'meaning-inventory.json')),
    FIRSTFreeze: bind(freezePath), items: coverage, sourceQuestions: 0,
    sourceFigureIds: requirements.sourceFigureIds, independentPass: false,
  })
  const receipts = fs.readdirSync(native).filter((name) => name.endsWith('.receipt.json')).map((name) => ({
    binding: bind(path.join(native, name)), data: load(path.join(native, name)),
  }))
  const finishedAt = new Date().toISOString()
  const usage = {
    schema: 'stemrobin/text-author-usage@1', ticket: 'STEMROBIN-181', batch: 'D037', card,
    cwd: repo, ownershipRoot: owned, role: 'FIRST bilingual modern TEXT AUTHOR only', finishedAt,
    authoringRounds: 1, firstFrozenCandidates: 4, postFreezeContentRevisions: 0, semanticReviewRepairRounds: 0,
    preFreezeCopyeditingPasses: 1,
    preFreezeCopyediting: 'English blocks 12 and 14: replace semicolon-split clauses with complete sentences, preserve exact math and source bindings; rederive affected English anchors only.',
    nativeLayoutAuthoringInvocations: receipts.filter((item) => item.binding.path.includes('/native-layout-authoring')).length,
    proseFlowDerivationInvocations: receipts.filter((item) => item.data.argv.includes(path.join(tools, 'prose_flow.mjs'))).length,
    scopedNativeTextValidationInvocations: receipts.filter((item) => item.binding.path.endsWith('/text-contract-FIRST.receipt.json')).length,
    scopedNativeTextValidationFailures: result.status === 'pass' ? 0 : 1,
    images: 0, imageContext: 0, openedImages: 0, authoredOrPromotedFigures: 0,
    externalNetworkCalls: 0, externalModelCalls: 0, paidCalls: 0, paidCostUSD: 0,
    sourceTranscriptionCalls: 0, assembleReplays: 0, adaptPrepareReplays: 0, adaptFinalizeCalls: 0,
    fullNativeFinalizations: 0, lessonRenderCalls: 0, databaseCalls: 0, publishCalls: 0,
    gitCommands: 0, gitMutations: 0, newWorktrees: 0, newTasksOrChats: 0, activeExecSessions: 0,
    serversStarted: 0, appChecks: 0, dependencyInstalls: 0, wholeProjectChecks: 0,
    skillMutations: 0, globalMeterMutations: 0, parentStateMutations: 0,
    intentFoldSetupOrUpdateCalls: 0, modernCompletionCalls: 0, sourceApprovalCalls: 0,
    tokens: null, tokenAccounting: 'Actual chat token total unavailable; no invented total or global meter access.',
    FIRSTFreeze: bind(freezePath), nativeTextCheck: bind(receiptPath),
    completeCard: false, independentModernReview: false,
  }
  write(path.join(owned, 'usage.json'), usage)
  const report = {
    schema: 'stemrobin/first-bilingual-text-author-report@1', ticket: 'STEMROBIN-181', batch: 'D037',
    card, book: '10p', edition: 'modern-us-neutral', role: usage.role, cwd: repo, ownershipRoot: owned, finishedAt,
    status: result.status === 'pass'
      ? 'FIRST-TEXT-FROZEN-NATIVE-PASS-INDEPENDENT-TEXT-REVIEW-PENDING'
      : 'FIRST-TEXT-FROZEN-NATIVE-FAIL-INDEPENDENT-TEXT-REVIEW-PENDING',
    preparation: bind(path.join(base, 'cards', card, 'preparation.json')),
    sourceRequirements: bind(path.join(sourceFreeze, 'source-requirements.json')),
    sourceMeaningInventory: bind(path.join(sourceFreeze, 'meaning-inventory.json')),
    sourceInventoryFreeze: bind(path.join(owned, 'source-inventory-freeze.json')),
    sourceCoverageInventory: bind(path.join(owned, 'source-coverage.json')),
    sourceApproval: 'Inherited independently approved and consumed raw source; this author does not independently approve source or modern text.',
    sourceBoundary: requirements.boundary, sourceCounts: freeze.sourceCounts,
    sourceAndContractBindings: freeze.inputs, FIRSTFreeze: bind(freezePath), candidates: freeze.candidates,
    ownRoot: path.join(owned, 'root'), ownWork: path.join(owned, 'work'),
    counts: result.locales.map((item) => ({
      locale: item.locale, proseBlocks: item.proseBlocks, textBlocks: item.textBlocks,
      nativeParagraphs: item.flow.paragraphs.length, exactMathTokensAfterApprovedErratum: item.mathTokenCount,
      figureIds: item.figures, exercises: item.exercises,
      sectionBreaks: item.flow.boundaries.length, resolvedBreaks: item.flow.resolvedBreaks,
    })),
    errata: {
      id: authored.erratum.id, original: '$l=$ $v\\tau_2$', corrected: authored.erratum.corrected,
      target: 'lesson.prose[14]', sourceBlock: 'p0261#1',
      sourcePageSha256: '6b96b659547a6fbf232e461fdd51761975a823ca1e6415a719ab879cd3b21201',
      mechanism: 'Fill prepared corrected field; mark only bound block math-correction. Faithful source unchanged; no new correction.',
    },
    adaptationChanges: authored.items.map(({ index, reason, coverage: coverageIds }) => ({
      index, sourceRefs: rawLesson.prose[index].source_refs, reason, coverageIds,
      locales: ['zh', 'en'].map((locale) => ({
        locale, changes: load(path.join(work, locale, 'lesson.template.json')).prose[index].changes,
      })),
    })),
    proseAndTypography: {
      sectionBreakMethod: 'Exact adjacent before/after objects copied from native prose_flow.mjs output; never hand-counted boundaries.',
      zhDerivation: bind(path.join(native, 'zh-prose-flow-derive.stdout.txt')),
      enDerivation: bind(path.join(native, 'en-prose-flow-derive-copyedit.stdout.txt')),
      bodyMath: 'Automatic only, no manual spans or font flags.',
      digits: 'ASCII only in modern body text; quantities and printed formula references preserved.',
      chinesePunctuation: 'Outside math spans.',
    },
    preserved: [
      'All 22 raw prose identities, source_text snapshots, source_refs and order; 0 written exercises.',
      'All physics quantities and math-token order, except the sole approved source-bound erratum.',
      'Simultaneous endpoint measurement, proper length, longitudinal/transverse distinction.',
      'Both light paths, three rod positions, both leg times, full (8.4)/(8.5) derivation and recovery of (8.2).',
      'Symmetric observer interpretation and source-bound Eddington identity; no Gulliver/literary fiction in modern prose.',
      'Figure 223/224/225 references and original ownership; no image reads or image-stage actions.',
    ],
    nativeTextCheck: {
      status: result.status, exitCode: receipt.exitCode, receipt: bind(receiptPath), result: bind(resultPath),
      freezeSHA256: result.freezeSHA256, nativeAPIs: result.nativeAPIs,
      errors: result.errors, katexCheckedTokens: result.katex.length, katexWarnings: result.katexWarnings,
      fullNativeFinalization: false, independentPass: false,
    },
    actualScopedCommands: receipts.map((item) => ({ receipt: item.binding, ...item.data })),
    usage: bind(path.join(owned, 'usage.json')), images: 0,
    independentModernReview: false, semanticReview: 'pending', completeCard: false,
    pending: ['Independent substantive Chinese/English text review', 'Separately authorized modern figure stages'],
    notRun: ['adapt-finalize', 'render', 'figures', 'choices', 'publish', 'Git/status', 'DB', 'paid/network/chat/global-meter/skill edits'],
    scope: 'All writes under ownershipRoot; text-only author output is not an independent PASS.',
  }
  write(path.join(owned, 'report.json'), report)
  for (const file of ['report.json', 'usage.json', 'source-coverage.json']) fs.chmodSync(path.join(owned, file), 0o444)
  console.log(JSON.stringify({ report: bind(path.join(owned, 'report.json')), candidates: freeze.candidates, nativeTextCheck: report.nativeTextCheck.status }, null, 2))
} else {
  throw new Error('Use seed, copyedit, layout, flow, freeze, check or report')
}
