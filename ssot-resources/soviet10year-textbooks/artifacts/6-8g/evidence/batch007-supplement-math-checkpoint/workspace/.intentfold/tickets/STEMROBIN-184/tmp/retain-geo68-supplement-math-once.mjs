import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const workspace = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const root = path.join(workspace, book, 'evidence/batch007-supplement-math-checkpoint')
const helper = `${ticket}/retain-geo68-supplement-math-once.mjs`
const command = `node ${helper}`
const archiveRoot = path.join(workspace, book, 'evidence/batch007-source-through68')
const archiveCatalogPath = path.join(archiveRoot, 'retention.json')
const authorManifestPath = `${ticket}/geo68-supplement-math-author.manifest.json`
const originalReviewSha256 = '227684bfadd6628e0ce1b5dab0e74f0614160a4af5a091d9332932e1bfe08241'
const frozen = [
  [`${ticket}/geo68-supplement-math-independent-source-first.md`, 'c3130d9668c0bf0d00bafd5da0ebc2426291ce6f1aee0eaf2ddefb8aaeab1e88', 'independent-StageA'],
  [`${ticket}/geo68-supplement-math-author.md`, '11882d2a24977a1ae5dc329a8ea0b20a1062ba367d455f281a2dc1267b58b956', 'author'],
  [authorManifestPath, 'd9cfcd143fe3fb26a432655e983737da81a48ab4792d796925b7c080c3764545', 'author-manifest'],
  [`${ticket}/geo68-supplement-math-independent-review.md`, originalReviewSha256, 'sole-independent-StageB'],
]
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const snapshots = new Map()
const specs = new Map()
const copied = []
const referenced = []
let phase = 'preflight'
let currentPath = workspace
let rootCreated = false

function safeFile(file) {
  currentPath = path.resolve(workspace, file)
  const relative = path.relative(workspace, currentPath)
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `Outside workspace: ${file}`)
  const parts = relative.split(path.sep)
  assert(!parts.some(part => part === '.tmp' || part === 'node_modules' || /^\.env(?:\.|$)/.test(part)), `Forbidden dependency: ${file}`)
  let cursor = workspace
  assert(fs.lstatSync(cursor).isDirectory() && !fs.lstatSync(cursor).isSymbolicLink(), workspace)
  for (const [index, part] of parts.entries()) {
    cursor = path.join(cursor, part)
    const stat = fs.lstatSync(cursor)
    assert(!stat.isSymbolicLink(), `Symlink rejected: ${cursor}`)
    assert(index === parts.length - 1 ? stat.isFile() : stat.isDirectory(), cursor)
  }
  return currentPath
}

function snapshot(file, expected) {
  const absolute = safeFile(file)
  if (!snapshots.has(absolute)) {
    const bytes = fs.readFileSync(absolute)
    snapshots.set(absolute, { bytes, sha256: digest(bytes) })
  }
  const saved = snapshots.get(absolute)
  if (expected !== undefined) assert.equal(saved.sha256, expected, `Binding mismatch: ${absolute}`)
  return saved
}

function add(file, expected, category) {
  const absolute = path.resolve(workspace, file)
  const prior = specs.get(absolute)
  if (prior) {
    assert.equal(prior.expected, expected, `Conflicting binding: ${absolute}`)
    return
  }
  specs.set(absolute, { expected, category })
}

function newDirectories(directory) {
  const relative = path.relative(root, directory)
  assert(!relative.startsWith('..') && !path.isAbsolute(relative), directory)
  let cursor = root
  for (const part of relative.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part)
    if (!fs.existsSync(cursor)) fs.mkdirSync(cursor)
    const stat = fs.lstatSync(cursor)
    assert(stat.isDirectory() && !stat.isSymbolicLink(), `Unsafe output directory: ${cursor}`)
  }
}

try {
  assert.equal(process.cwd(), workspace, 'Use the explicitly requested checkout')
  assert.equal(path.resolve(process.argv[1]), path.join(workspace, helper))
  try {
    fs.lstatSync(root)
    throw new Error(`Checkpoint already exists; never overwrite or rerun: ${root}`)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  for (const binding of frozen) add(...binding)
  const manifestBytes = snapshot(authorManifestPath, frozen[2][1])
  const manifest = JSON.parse(manifestBytes.bytes.toString('utf8'))
  assert.equal(manifest.book, '6-8g')
  assert.equal(manifest.lesson, 'geo68-c1-ex')
  assert.equal(path.resolve(manifest.definitionPathBase), path.join(workspace, book, 'lessons'))

  const targetRoot = path.join(workspace, book, 'lessons/geo68-c1-ex')
  const targetNames = new Set(['lesson.json', 'lesson.md', 'exercises.json'])
  assert.equal(manifest.sourceFiles.length, targetNames.size)
  for (const entry of manifest.sourceFiles) {
    assert.equal(path.dirname(entry.path), targetRoot)
    assert(targetNames.delete(path.basename(entry.path)), entry.path)
    add(entry.path, entry.sha256, 'original-target-lesson')
  }
  for (const entry of manifest.definitionBindings) {
    assert(/^geo68-c1-s\d+$/.test(entry.lesson), entry.lesson)
    assert.equal(entry.file, 'lesson.md')
    add(path.join(manifest.definitionPathBase, entry.lesson, entry.file), entry.sha256, 'original-definition-prose')
  }
  assert.equal(manifest.actualFigureInventory.length, 4)
  for (const entry of manifest.actualFigureInventory) {
    assert.equal(path.dirname(entry.path), path.join(workspace, book, 'figures'))
    assert.equal(path.basename(entry.path), `${entry.id}.png`)
    assert(/^fig-(76|77|78|79)$/.test(entry.id), entry.id)
    add(entry.path, entry.sha256, 'original-PNG-blind-byte-copy')
  }
  add(helper, undefined, 'one-shot-retention-helper')

  const sourceRefBindings = manifest.coverage.entries.map(entry => ({
    exercise: entry.exercise,
    sourceRefs: entry.sourceRefs,
  }))
  const pageRefs = new Map()
  for (const entry of sourceRefBindings) {
    for (const ref of entry.sourceRefs) {
      const match = /^p(\d{4})#\d+$/.exec(ref)
      assert(match, `Unusable source block reference: ${ref}`)
      if (!pageRefs.has(match[1])) pageRefs.set(match[1], new Set())
      pageRefs.get(match[1]).add(ref)
    }
  }
  assert(pageRefs.size > 0, 'No source page references')

  const catalogSnapshot = snapshot(archiveCatalogPath)
  const archiveCatalog = JSON.parse(catalogSnapshot.bytes.toString('utf8'))
  assert(Array.isArray(archiveCatalog.copied), 'Existing archive lacks its byte-copy ledger')
  const pageEvidence = []
  for (const [page, refs] of [...pageRefs].sort(([a], [b]) => a.localeCompare(b))) {
    const files = []
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const sourcePath = `${book}/pages/${page}/${name}`
      const source = snapshot(sourcePath)
      const candidate = archiveCatalog.copied.find(entry =>
        entry.sourcePath === sourcePath && entry.sha256 === source.sha256
      )
      if (candidate) {
        assert(!path.isAbsolute(candidate.path), candidate.path)
        const archivedPath = path.resolve(archiveRoot, candidate.path)
        assert(archivedPath.startsWith(`${archiveRoot}${path.sep}`), archivedPath)
        snapshot(archivedPath, source.sha256)
        const record = {
          sourcePath,
          durableArchivePath: path.relative(workspace, archivedPath),
          pathFromCheckpoint: path.relative(root, archivedPath),
          sha256: source.sha256,
          bytes: source.bytes.length,
          mode: 'reference-existing-byte-identical-durable-archive',
          catalogPath: path.relative(workspace, archiveCatalogPath),
          catalogSha256: catalogSnapshot.sha256,
        }
        referenced.push(record)
        files.push({ name, ...record })
      } else {
        add(sourcePath, source.sha256, 'original-source-page-MD-JSON-audit')
        files.push({
          name,
          sourcePath,
          retainedPath: path.join('workspace', sourcePath),
          sha256: source.sha256,
          mode: 'copy-current-original-bytes-not-redundant-in-archive-ledger',
        })
      }
    }
    pageEvidence.push({ page, sourceRefs: [...refs].sort(), files })
  }

  // Bind all inputs before creating the exclusively owned output directory.
  phase = 'preflight-byte-bindings'
  for (const [file, spec] of specs) snapshot(file, spec.expected)
  safeFile(path.join(workspace, book, 'evidence/batch007-source-through68/retention.json'))
  phase = 'create-new-checkpoint'
  currentPath = root
  fs.mkdirSync(root)
  rootCreated = true

  phase = 'blind-copy-and-single-equality-check'
  for (const [file, spec] of specs) {
    const saved = snapshots.get(file)
    const relativeSource = path.relative(workspace, file)
    const to = path.join(root, 'workspace', relativeSource)
    currentPath = to
    newDirectories(path.dirname(to))
    fs.writeFileSync(to, saved.bytes, { flag: 'wx' })
    const copiedSha256 = digest(fs.readFileSync(to))
    assert.equal(copiedSha256, saved.sha256, `Copy mismatch: ${to}`)
    copied.push({
      sourcePath: relativeSource,
      path: path.relative(root, to),
      sha256: copiedSha256,
      bytes: saved.bytes.length,
      category: spec.category,
    })
  }

  const record = {
    schema: 'stemrobin/mechanical-durable-math-retention@1',
    ticket: 'STEMROBIN-184',
    invocation: 'continuation-same-invocation',
    book: manifest.book,
    lesson: manifest.lesson,
    status: 'NOT_COMPLETE',
    wholeLessonStatus: 'NOT_COMPLETE',
    officialAnswers: 0,
    choices: 0,
    countScope: 'This source-math checkpoint produces no official answers or choices; no database or publication state was inspected.',
    mathAuthorVerdict: 'AUTHOR PASS',
    verdictProvenance: 'The already frozen sole StageB, acknowledged by the parent; no new review or decision.',
    officialAnswerKeyApproval: false,
    modernTextApproval: false,
    sourceOpticalApproval: false,
    sourceErrataCreated: false,
    originalReviewSha256,
    frozenBindings: frozen.map(([file, sha256, role]) => ({
      role,
      path: path.join('workspace', file),
      sha256,
    })),
    bookIdentity: manifest.bookIdentity,
    coverageFromFrozenAuthorManifest: manifest.coverage,
    originalAuthorLimitationsVerbatim: manifest.limitations,
    unresolved: [
      {
        exercise: '153',
        status: 'HOLD',
        scope: 'Intended paper/ground scale or unit interpretation',
        detail: 'Literal AB=2km with the same-distance constraints in cm is solved. A separate map metric has no supplied scale. No import from 152 and no km-to-cm source correction.',
      },
      {
        exercise: '166',
        status: 'LITERAL_FALSE_MINIMA_AND_UNRESOLVED_TERMINOLOGY',
        detail: 'Literal square (正方形) and edge wording (棱长) retained. Under an explicitly conditional side-a square reading, seven segments and 7a exist but are not minimal: three segments and 3a refute both minima. No cube substitution, intended solid, printer error or approved source erratum.',
      },
      {
        exercise: '175',
        part: '1',
        status: 'HOLD',
        scope: 'Exact inner/outer annular boundary membership',
        detail: 'All four open/closed/half-open boundary memberships remain distinguished. Hatching and solid contours do not select one; no annulus convention selected. Part 2 remains the unfilled union of externally tangent circumferences.',
      },
      {
        exercise: '181',
        status: 'LINKED_FAMILIES_RETAINED_BRANCH_NOT_SELECTED',
        distance12: '|r1-r2|',
        thirdCenterSameSide: { distance23: '|r2-r3|', distance13: '|r1-r3|', constraint: 'r3 differs from both r1,r2 to avoid coincidence' },
        thirdCenterOppositeSide: { distance23: 'r2+r3', distance13: 'r1+r3', constraint: 'equal radii allowed without coincidence' },
        detail: 'The remaining distance choices are linked, not independent. Mixed internal/external pairs at the shared M are impossible. Collinearity and both families retained; no third-side or radius-order preference.',
      },
      {
        exercises: ['154', '160', '164'],
        status: 'OPTICAL_UNKNOWN',
        details: [
          '154 cap/cup glyph: author-reported uncertainty, current transcription solved conditionally.',
          '160 distance bars: unbarred segment/length typing diagnosis and conditional |AD| theorem retained.',
          '164 object word: author-reported uncertainty; current closed-chain request solved conditionally.',
        ],
        provenance: 'Disclosed frozen author package, preserved by the sole StageB; not new independent pixel findings.',
        resolutionAttempted: false,
      },
      {
        exercises: ['152', '156'],
        status: 'LANGUAGE_AND_BOUNDARY_QUALIFICATIONS_RETAINED',
        details: [
          '152(2/3) simultaneous versus collective reception meanings remain distinct.',
          '156 is positive-radius closed-disk containment; a=0 may give equality, a=r is not a source circle, strict-interior containment is false.',
        ],
      },
    ],
    sourceRefBindings,
    sourcePageEvidence: pageEvidence,
    existingSourceArchive: {
      catalogPath: path.relative(workspace, archiveCatalogPath),
      catalogSha256: catalogSnapshot.sha256,
      referencedFileCount: referenced.length,
      oldCommandsReexecuted: false,
      approvalStatusInheritedByThisCheckpoint: false,
    },
    copied,
    referenced,
    counts: {
      copiedFiles: copied.length,
      referencedExistingDurableFiles: referenced.length,
      totalCheckpointFilesIncludingRetentionJson: copied.length + 1,
      definitionProseFiles: manifest.definitionBindings.length,
      originalPngFiles: manifest.actualFigureInventory.length,
      officialAnswers: 0,
      choices: 0,
    },
    mechanics: {
      status: 'MECHANICALLY_RETAINED_ONCE',
      command,
      commandExecutionCount: 1,
      commandExit: 0,
      firstFailure: null,
      copyPrimitive: 'Exclusive blind byte-buffer copy of preflight snapshots',
      copyEqualityVerificationRounds: 1,
      expectedFrozenAndManifestHashesEnforced: true,
      existingArchiveReferencesMatchedByPathAndHash: true,
      symlinksAndEnvironmentRejected: true,
      pngVisualOpenings: 0,
      pngDecodingOrRendering: false,
      mathRereviewOrResolution: false,
      validatorsOrTestsRun: false,
      commandReexecution: false,
      sourceModernAnswerChoiceEdits: false,
      gitDbAppBrowserChatActions: false,
      originalPathsAreProvenanceNotTmpRuntimeDependencies: true,
      helperRuntimeDependencies: ['node:assert/strict', 'node:fs', 'node:path', 'node:crypto'],
    },
    limits: 'Evidence retention only. Whole lesson NOT_COMPLETE. No new review, gate, source correction, modern text/spec/render/finalize, formal answer, choice, completed-lesson count or production action.',
    retentionSelfHashPolicy: 'Final retention.json SHA-256 returned by the one-shot command; no circular self-hash.',
  }
  phase = 'write-retention-index'
  currentPath = path.join(root, 'retention.json')
  const indexBytes = Buffer.from(`${JSON.stringify(record, null, 2)}\n`)
  fs.writeFileSync(currentPath, indexBytes, { flag: 'wx' })
  const retentionSha256 = digest(fs.readFileSync(currentPath))
  assert.equal(retentionSha256, digest(indexBytes), 'Retention index byte mismatch')
  console.log(JSON.stringify({
    command,
    exitCode: 0,
    firstFailure: null,
    originalReviewSha256,
    retentionDirectory: root,
    retentionPath: currentPath,
    retentionSha256,
    fileCount: copied.length + 1,
    copiedFiles: copied.length,
    referencedExistingDurableFiles: referenced.length,
    status: 'NOT_COMPLETE',
    officialAnswers: 0,
    choices: 0,
  }, null, 2))
} catch (error) {
  console.error(JSON.stringify({
    command,
    exitCode: 1,
    firstFailure: { phase, path: currentPath, message: error.message },
    rootCreated,
    copiedFilesBeforeFailure: copied.length,
    retentionDirectory: root,
    retryPerformed: false,
  }, null, 2))
  process.exitCode = 1
}
