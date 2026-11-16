import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const workspace = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const sourceRoot = 'ssot-resources/soviet10year-textbooks'
const book = `${sourceRoot}/artifacts/10c`
const lesson = `${book}/lessons/ana10-c6-s3-n85`
const root = `${book}/evidence/batch007-n85-math-checkpoint`
const absoluteRoot = path.join(workspace, root)
const helper = `${ticket}/retain-n85-math-once.mjs`
const copied = []
let rootCreated = false
let activeSource = null

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const bindings = [
  [`${ticket}/ana10-n85-math-independent-source-first.md`, 'f2f9b21fa48be41caf41e27a7a8dc1e714a25f7f8d8cfb4a3ce574af0012f658'],
  [`${ticket}/ana10-n85-math-author.md`, '4341975b08612c1691c365a0c302a6085097c1f1f6971e53a6056450d98f8f9a'],
  [`${ticket}/ana10-n85-math-author.manifest.json`, '09b0afd4d785216786e0f6ccb3552423dd1be5495ade53cba3539aea85770a2c'],
  [`${ticket}/ana10-n85-math-independent-review.md`, '9d83390df0f593d8b5f088b298a7f4cba876ade6ed6bb6a533ee8bc37965b0a8'],
  [`${lesson}/lesson.json`, '72d959ff173df0af16d52018483553fe86c0b8302e1ca8af3186d248dc8bb25d'],
  [`${lesson}/lesson.md`, '01885da125560270d447fbb98415822693cd48a02ad4a886d0fe3e3748f80d8f'],
  [`${lesson}/exercises.json`, '48d001eed7586b09b522a6d882d5014e8ecd831c664cfc44425b93c21e71e9bb'],
  [`${book}/figures/tbl-p0043-01.png`, '502daf2525eae862f68d5f750e5e95d37e754f84538da7ce94767cd38e99e589'],
  [`${book}/figures/fig-24.png`, '39d1906beba349067a337f6a164e5608ced000e01b5b35fa33dc0ca521664644'],
  [`${book}/figures/fig-25.png`, '39089fd532ea6b6892d06bf38638bf13a64726fbba4b44c947fcfefbb9823d74'],
  [`${book}/figures/fig-26.png`, '47adf3220b439fe7a24d9495986174a9ef4c094a95ba34747f452b540b3b9a52'],
  [`${book}/figures/fig-27.png`, '90383a12ea5f11571494ead792efb20820ecd75a16e849c88f16b0089fa210b4'],
  [`${book}/figures/fig-28.png`, 'c8f7749b95bc91e1a22b2cf2aac1aeee9b9346540bd032fb5c69fb4d4d85b809'],
  [`${ticket}/source-10c-p43-p46-independent-source-first.md`, '590af4e65e605ae3aab1ba39c3fe95573109802584827a932363ac358055b544'],
  [`${ticket}/source-10c-p43-p46-independent-review.md`, '711c6ade6097c9315deb9020882044a041e72bbdafad0bcfa3903af29b069151'],
  [`${book}/pages/0044/page.md`, 'e240563722e991eb470e377cb7f2a1fc3b4d66ec5c973bb4b55c6f04e3c76350'],
  [`${book}/pages/0044/page.json`, '5b48fb7e21ef53d99bc2650230e9c03afcb7c8166be0df4745dfa47463449fb8'],
  [helper, null],
]

function checkedAbsolute(relative) {
  if (path.isAbsolute(relative) || path.normalize(relative) !== relative) {
    throw new Error(`Refusing non-workspace-relative path: ${relative}`)
  }
  const absolute = path.resolve(workspace, relative)
  if (!absolute.startsWith(`${workspace}${path.sep}`)) {
    throw new Error(`Refusing path outside workspace: ${relative}`)
  }
  return absolute
}

function rejectSymlinkComponents(absolute) {
  const relative = path.relative(workspace, absolute)
  let current = workspace
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part)
    if (fs.lstatSync(current).isSymbolicLink()) {
      throw new Error(`Preserving symlink without following or replacing it: ${current}`)
    }
  }
}

function definitionBindings(manifest) {
  const found = new Map()
  function visit(value) {
    if (!value || typeof value !== 'object') return
    if (typeof value.path === 'string' && value.path.endsWith('/lesson.md')) {
      const relative = value.path.startsWith('artifacts/')
        ? `${sourceRoot}/${value.path}`
        : path.isAbsolute(value.path)
          ? path.relative(workspace, value.path)
          : value.path
      checkedAbsolute(relative)
      if (relative !== `${lesson}/lesson.md`) {
        if (!relative.startsWith(`${sourceRoot}/artifacts/`)) {
          throw new Error(`Definition reference outside original artifacts: ${relative}`)
        }
        found.set(relative, value.sha256 ?? null)
      }
    }
    for (const child of Object.values(value)) visit(child)
  }
  visit(manifest)
  return [...found]
}

function snapshot(relative, expected) {
  activeSource = relative
  const source = checkedAbsolute(relative)
  rejectSymlinkComponents(source)
  const stat = fs.lstatSync(source)
  if (!stat.isFile()) throw new Error(`Not a regular source file: ${relative}`)

  // Hash once, then retain that same immutable byte buffer without a second read.
  const bytes = fs.readFileSync(source)
  const digest = sha256(bytes)
  if (expected && digest !== expected) {
    const error = new Error(`Frozen byte binding mismatch: ${relative}`)
    error.expectedSha256 = expected
    error.actualSha256 = digest
    throw error
  }
  const destination = path.join(absoluteRoot, 'workspace', relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, bytes, { flag: 'wx' })
  copied.push({
    source: relative,
    path: path.relative(absoluteRoot, destination),
    sha256: digest,
    expectedSha256: expected,
    bytes: bytes.length,
    sourceMode: stat.mode & 0o777,
    byteCopyMethod: 'One source buffer hashed once and written unchanged, exclusive create.',
  })
  return relative.endsWith('/ana10-n85-math-author.manifest.json')
    ? JSON.parse(bytes.toString('utf8'))
    : null
}

function runtime() {
  return {
    cwd: process.cwd(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    executable: process.execPath,
    argv: process.argv,
    environmentFilesOpened: false,
    environmentModified: false,
    symlinkRepairs: 0,
    retries: 0,
  }
}

try {
  if (process.cwd() !== workspace) {
    throw new Error(`Unexpected cwd; invocation not changed: ${process.cwd()}`)
  }
  rejectSymlinkComponents(path.dirname(absoluteRoot))
  fs.mkdirSync(absoluteRoot)
  rootCreated = true

  let manifest = null
  for (const [relative, expected] of bindings) {
    const parsed = snapshot(relative, expected)
    if (parsed) manifest = parsed
  }
  if (!manifest) throw new Error('Retained author manifest not available')
  const definitions = definitionBindings(manifest)
  for (const [relative, expected] of definitions) snapshot(relative, expected)

  const retention = {
    schema: 'source-math-checkpoint-retention@1',
    ticket: 'STEMROBIN-184',
    book: '10c',
    lesson: 'ana10-c6-s3-n85',
    status: 'NOT_COMPLETE',
    purpose: 'Mechanical durable retention of the already accepted sole StageA/StageB and author package; no new review or source correction.',
    modelCheckpoint: 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n13-math-checkpoint',
    copied,
    snapshotFileCount: copied.length,
    checkpointFileCount: copied.length + 1,
    fileCountScope: 'Byte-identical workspace snapshots plus this retention.json; the original scratch helper is also preserved as a snapshot.',
    inheritedVerdicts: {
      taskMath: 'PASS',
      taskCount: 28,
      authorBody: 'HOLD',
      authorManifest: 'PASS',
      sourceObjectsCompared: 65,
      sourceObjects: { PASS: 62, HOLD: 3, REVISE: 0 },
      originalInventories: { count: 6, PASS: 5, HOLD: 1, REVISE: 0 },
      noNewVerdicts: true,
    },
    unresolved: [
      {
        id: 'H-F6',
        sourceRef: 'p0046#3',
        figure: 'fig-28',
        bodyOrdinal: 33,
        status: 'OPTICAL_HOLD',
        frozenStageA: 'Last visible positive-crest label recorded as 5*pi/2.',
        author: 'Single-view final numerator resembles 3; printed 3 versus degraded 5 remains conditional.',
        inheritedMathematicalCoordinate: '5*pi/2',
        limit: 'Mathematical phase does not decide the printed numerator. Neither record is rewritten; no image reopen, erratum, or clean-label substitution.',
      },
      {
        id: 'O1',
        sourceRef: 'p0043#3',
        bodyOrdinal: 5,
        status: 'OPTICAL_HOLD',
        alternatives: ['T', 'tau'],
        storedEncoding: 'vector T',
        limit: 'Correct translation displacement does not resolve the original vector-name glyph.',
      },
      {
        id: 'O2',
        sourceRef: 'p0046#7',
        bodyOrdinal: 37,
        status: 'OPTICAL_HOLD',
        alternatives: ['a', 'q'],
        storedEncoding: 'final a in arcsin a',
        limit: 'Equation context does not resolve the final source token. Encoded-a mathematics remains conditional; no q-to-a replacement.',
      },
    ],
    sourceDiagnoses: [
      {
        frozenId: 'D01',
        authorId: 'D1',
        sourceRef: 'p0044#6',
        inheritedRepairBasis: 'PASS',
        basis: 'Prior independent original-p44 row12 directly observed negative sine argument and positive RHS; retained source StageB and current p44 notes[1]/literal MD confirm retention of that observation.',
        literal: 'sin(-pi/6)=+1/2',
        inheritedMathematicalRepair: 'Supporting RHS -1/2; inverse result -pi/6 unchanged.',
        implementedErratum: false,
        registeredErratum: false,
        repairCandidateDisclosedOrApproved: false,
        limit: 'Source-observed mathematical repair basis PASS is NOT an implemented or registered erratum. No provenance gate was rerun.',
      },
      {
        frozenId: 'D02',
        authorId: 'D2',
        sourceRef: 'p0049#10',
        inheritedDiagnosis: 'PASS',
        literalQualifier: 'x in Z',
        exactAutomaticRepair: 'HOLD',
        limit: 'Literal x is retained, not converted to n. Conditional integer-n reading and free-parameter defect remain distinct; no automatic source/modern qualifier repair.',
      },
      {
        frozenId: 'D03',
        authorId: 'D4',
        sourceRefs: ['p0045#1', 'p0045#7', 'p0049#3'],
        inheritedDiagnosis: 'PASS',
        subject: 'Approximation precision, not the author figure-label D3.',
        limit: 'Exact-input nearest four-place inverse 1.1344 differs from the close 1.1345 table estimate; source approximation signs and coarse 1.2 remain. Precision caveat is not automatic errata.',
        automaticErratum: false,
      },
      {
        frozenId: 'D04',
        authorId: 'D5',
        sourceRef: 'p0046#7',
        inheritedDiagnosis: 'PASS',
        subject: 'Period-window endpoint convention.',
        limit: 'Chosen closed intervals remain valid. General open-window caveat is not automatic errata or authority to alter brackets, prose, markers, counters, or assembler.',
        automaticErratum: false,
      },
    ],
    sourceBoundary: {
      warning: 'p0047#1 cont follows locally closed p0046#7.',
      disposition: 'Retained as separate original prose, unchanged; not itself a math failure.',
      proseObjects: 65,
      countsRecalculatedOrChanged: false,
      sourceMarkersChanged: false,
      sourceAssemblerRun: false,
    },
    definitionDependencies: {
      referencedPriorDefinitionMd: definitions.map(([relative]) => relative),
      copiedCount: definitions.length,
      basis: 'Original lesson.md paths structurally referenced by the existing author manifest; the n85 lesson.md is already retained. No invented prior definition dependency.',
    },
    outputCounts: {
      completion: 'NOT_COMPLETE',
      officialAnswers: 0,
      choices: 0,
      completedLessonsAdded: 0,
      scope: 'This checkpoint creates no official answers, choices, or completion increment; no DB inspection or publication.',
    },
    limits: {
      retentionExecutionAttempts: 1,
      byteCopiesPerInput: 1,
      hashesPerCopiedInput: 1,
      retentionJsonHashes: 1,
      imagesOpened: 0,
      imageCrops: 0,
      imageReopens: 0,
      newMathReviews: 0,
      newSourceReviews: 0,
      freshSolves: 0,
      gatesOrPreviousCommandsRerun: 0,
      errataRegistrations: 0,
      sourceOrModernEdits: 0,
      gitDbAppBrowserChatOperations: 0,
      invocationChanged: false,
      firstFailurePreserved: true,
      existingEditsReverted: false,
      cleanupOrOverwritePerformed: false,
    },
    command: {
      command: `node ${helper}`,
      cwd: workspace,
      attempt: 1,
      exitCode: 0,
      scope: 'This retention helper only; no inherited source/mathematics command is rerun.',
    },
    runtime: runtime(),
  }
  const bytes = Buffer.from(`${JSON.stringify(retention, null, 2)}\n`, 'utf8')
  const retentionSha256 = sha256(bytes)
  const retentionPath = path.join(absoluteRoot, 'retention.json')
  fs.writeFileSync(retentionPath, bytes, { flag: 'wx' })
  console.log(JSON.stringify({
    snapshotFileCount: copied.length,
    checkpointFileCount: copied.length + 1,
    retentionPath,
    retentionSha256,
    exitCode: 0,
    status: 'NOT_COMPLETE',
    officialAnswers: 0,
    choices: 0,
  }, null, 2))
} catch (error) {
  process.exitCode = 1
  const failure = {
    status: 'FIRST_RETENTION_FAILURE_PRESERVED_NO_RETRY',
    command: `node ${helper}`,
    exitCode: 1,
    activeSource,
    message: error.message,
    code: error.code ?? null,
    expectedSha256: error.expectedSha256 ?? null,
    actualSha256: error.actualSha256 ?? null,
    copied,
    runtime: runtime(),
    noCleanupNoOverwriteNoEnvironmentOrSymlinkRepair: true,
  }
  if (rootCreated) {
    try {
      fs.writeFileSync(path.join(absoluteRoot, 'first-failure.json'),
        `${JSON.stringify(failure, null, 2)}\n`, { flag: 'wx' })
    } catch (recordError) {
      failure.failureRecordError = recordError.message
    }
  }
  console.error(JSON.stringify(failure, null, 2))
}
