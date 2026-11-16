import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const temporary = path.join(root, '.tmp')
const sourceBase = path.join(temporary, 's10y-image/batch007/9-10g')
const artifactBase = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const destination = path.join(artifactBase, 'evidence/batch007-t14-fig55-56-author-checkpoint')
const helper = fileURLToPath(import.meta.url)
const plans = []
const skipped = []
const sourceTrees = []

function rawHash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

function ensureRegular(file) {
  const stat = fs.lstatSync(file)
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new Error(`Not a regular, non-symlink source: ${file}`)
  }
  return stat
}

function exclusion(name) {
  if (name === 'node_modules') return 'node_modules'
  if (name === 'env' || name === '.envrc' || name === '.env' || name.startsWith('.env.')) return 'env'
  if (name.endsWith('.review.json') || /^(review|reviewer|independent)([-_.]|$)/i.test(name) || /verdict/i.test(name)) {
    return 'independent or future review verdict outside author checkpoint'
  }
  return null
}

function add(source, targetRelative, category, expectedSha256) {
  const stat = ensureRegular(source)
  const sha256 = rawHash(source)
  if (expectedSha256 && sha256 !== expectedSha256) {
    throw new Error(`Raw SHA-256 mismatch: ${source}`)
  }
  plans.push({
    source, targetRelative, category, sha256, bytes: stat.size,
    originalMode: stat.mode & 0o777, originalMtimeMs: stat.mtimeMs,
  })
}

function listTree(directory, relative = '') {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name)
    const childRelative = path.join(relative, entry.name)
    const stat = fs.lstatSync(file)
    const reason = stat.isSymbolicLink() ? 'symlink' : exclusion(entry.name)
    if (reason) {
      skipped.push({ source: file, reason })
    } else if (stat.isDirectory()) {
      files.push(...listTree(file, childRelative))
    } else if (stat.isFile()) {
      files.push({ source: file, relative: childRelative })
    } else {
      skipped.push({ source: file, reason: 'not a regular file or directory' })
    }
  }
  return files
}

if (process.cwd() !== root) throw new Error(`Required cwd: ${root}`)
if (fs.existsSync(destination)) throw new Error('Checkpoint already exists; no overwrite or second execution')
if (fs.lstatSync(path.dirname(destination)).isSymbolicLink()) throw new Error('Destination parent is a symlink')

for (const figure of ['fig-55', 'fig-56']) {
  const directory = path.join(sourceBase, figure)
  if (!fs.lstatSync(directory).isDirectory() || fs.lstatSync(directory).isSymbolicLink()) {
    throw new Error(`Not an owned regular source directory: ${directory}`)
  }
  const files = listTree(directory)
  sourceTrees.push({ directory, relativeFiles: files.map(item => item.relative) })
  for (const file of files) add(file.source, path.join('author-working-roots', figure, file.relative), figure)
}

add(
  path.join(root, 'tmp/geo910-t14-fig55-56-author.md'),
  'author-records/geo910-t14-fig55-56-author.md', 'author-records',
  'a37383571d30f2d0cf314986430d17334ce0989ed39d313a0f693747be38f58d',
)
add(
  path.join(root, 'tmp/geo910-t14-fig55-56-author.manifest.json'),
  'author-records/geo910-t14-fig55-56-author.manifest.json', 'author-records',
  'eaf24fa870693568ec10c898e32baba5403e62c7b2f1a5bfe1440de2c19143aa',
)
add(
  path.join(sourceBase, 'fig-55/evidence/inputs/05-geo910-t14-fig55-56-author.md'),
  'author-records/source-inventory-before-spec.md', 'author-records',
  'eefb6058636f65e87ad591ae4c19bde9ecb32b654f21ee7480f5cd9e5161ec83',
)

for (const [figure, sha256] of [
  ['fig-55', '6f203be966b1afd76d7937ac2784d2663361e831eac293503d3163265375ce2e'],
  ['fig-56', '18b6d23fc5f1cdcb5d6b233929a956854fa501315873dab8c056b70459821c93'],
]) {
  add(path.join(artifactBase, `figures/${figure}.png`), `inputs/original-source/${figure}.png`, 'original-source', sha256)
}
for (const [name, sha256] of [
  ['lesson.json', '1d3aba91bb9d4bc7afef929bc13c504deb280504b293dfb5b5457ff6d11c59ef'],
  ['exercises.json', '4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f'],
]) {
  add(
    path.join(artifactBase, `editions/modern-us-neutral/lessons/geo910-c1-s1-t14/${name}`),
    `inputs/approved-draft/${name}`, 'approved-draft', sha256,
  )
}
for (const name of ['validate_spec.py', 'render_spec.mjs', 'materialize_arrowheads.mjs']) {
  add(path.join(root, `.agents/skills/ld-s10y-image/scripts/${name}`), `official-tools/${name}`, 'official-tools')
}
add(
  path.join(root, '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json'),
  'official-tools/figure-spec.schema.json', 'official-tools',
)
add(helper, 'checkpoint-helper/retain-t14-figure-author-checkpoint-once.mjs', 'checkpoint-helper')

// Reviewer-only bytes are hashed and copied, never parsed or interpreted.
add(
  path.join(temporary, 'geo910-t14-fig55-56-independent-source-first.md'),
  'reviewer-only/geo910-t14-fig55-56-independent-source-first.md', 'reviewer-only',
  'bf514eee00b056fcb9f96e8d9f96bfbd6bece7715b685ddc5504bedc28481a04',
)

fs.mkdirSync(destination)
const retained = []
for (const plan of plans) {
  const target = path.join(destination, plan.targetRelative)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(plan.source, target, fs.constants.COPYFILE_EXCL)
  const copiedSha256 = rawHash(target)
  if (copiedSha256 !== plan.sha256 || rawHash(plan.source) !== plan.sha256) {
    throw new Error(`Copy or source changed during retention: ${plan.source}`)
  }
  fs.chmodSync(target, 0o444)
  retained.push({
    category: plan.category,
    retainedPath: target,
    retainedRelativePath: plan.targetRelative,
    sha256: copiedSha256,
    bytes: plan.bytes,
    historicalSource: {
      path: plan.source, sha256: plan.sha256, mode: plan.originalMode,
      mtimeMs: plan.originalMtimeMs, role: 'PROVENANCE_ONLY', runtimeDependency: false,
    },
  })
}
for (const tree of sourceTrees) {
  const current = listTree(tree.directory).map(item => item.relative)
  if (JSON.stringify(current) !== JSON.stringify(tree.relativeFiles)) {
    throw new Error(`Author tree changed during blind retention: ${tree.directory}`)
  }
}
for (const item of retained) {
  if (rawHash(item.retainedPath) !== item.sha256 || rawHash(item.historicalSource.path) !== item.sha256) {
    throw new Error(`Final raw-byte binding changed: ${item.retainedPath}`)
  }
}

const countByCategory = Object.fromEntries(
  [...new Set(retained.map(item => item.category))].map(category => [
    category, retained.filter(item => item.category === category).length,
  ]),
)
const counts = {
  copiedFiles: retained.length,
  copiedBytes: retained.reduce((sum, item) => sum + item.bytes, 0),
  byCategory: countByCategory,
  actualProbeScreenshots: retained.filter(item => item.category === 'fig-56' && item.retainedRelativePath.includes('/probe/') && item.retainedRelativePath.endsWith('.png')).length,
  copiedPngFiles: retained.filter(item => item.retainedRelativePath.endsWith('.png')).length,
  copiedFigureContexts: retained.filter(item => ['fig-55', 'fig-56'].includes(item.category) && item.retainedRelativePath.endsWith('/context.json')).length,
  reviewerOnlyRecords: retained.filter(item => item.category === 'reviewer-only').length,
  officialAnswers: 0,
  choices: 0,
  newImageLoads: 0,
}
const retention = {
  status: 'AUTHOR_CHECKPOINT_NOT_COMPLETE',
  ticket: 'STEMROBIN-184',
  scope: 'Mechanical immutable author checkpoint only; not a new review, complete figure gate, approval, certified PASS or promotion.',
  figures: {
    'fig-55': {
      status: 'HOLD', secondDefeat: true, collisions: 8,
      soleFixUsed: true, repairBudgetExhausted: true, remainingRepairs: 0,
      outputVisualGatePerformed: false, displayProbePerformed: false,
      certifiedPASS: false, promoted: false,
    },
    'fig-56': {
      status: 'AUTHOR_FROZEN_NO_REVIEW',
      uniqueIndependentReviewInProgress: true, futureIndependentVerdictIncluded: false,
      certifiedPASS: false, promoted: false,
    },
  },
  unknowns: { exercise151Separator: 'UNKNOWN', figure54PRho: 'UNKNOWN' },
  officialAnswersChoices: { officialAnswers: 0, choices: 0, accessed: 0, copied: 0, created: 0 },
  provenancePolicy: {
    historicalPaths: 'PROVENANCE_ONLY_NO_RUNTIME_TMP_DEPENDENCIES',
    runtimeDependencies: [],
    statement: 'Paths within copied historical records, specs, manifests and command outputs are archival provenance only. No retained artifact requires a .tmp or ROOT tmp path at runtime. RetainedRelativePath and SHA-256 are the checkpoint bindings; originals are preserved, not relocated or deleted.',
  },
  reviewerOnly: {
    path: 'reviewer-only/geo910-t14-fig55-56-independent-source-first.md',
    sha256: 'bf514eee00b056fcb9f96e8d9f96bfbd6bece7715b685ddc5504bedc28481a04',
    copiedAsRawBytesOnly: true, semanticContentsRead: false,
    independent56FutureVerdictIncluded: false,
  },
  imageBudget: {
    newLoads: 0, authorPriorLoads: 5, authorPlannedLoads: 8,
    authorHardEightGateComplete: false, reason: 'Figure 55 mandatory second-defeat stop.',
  },
  exclusions: ['env', 'node_modules', 'symlinks', 'non-regular files', 'future independent review verdict'],
  skipped: [...new Map(skipped.map(item => [item.source, item])).values()],
  execution: {
    helperPathProvenanceOnly: helper, helperSha256: rawHash(helper),
    executable: process.execPath, nodeVersion: process.version, argv: process.argv.slice(1),
    cwd: root, exclusiveCopy: true, invokedOnce: true,
    operation: 'regular-file blind copy and raw SHA-256 binding only',
    officialToolsExecuted: false, testsOrOtherGates: false, Git: false,
    database: false, app: false, browser: false, chat: false,
    dependenciesChanged: false, sourceOrTemplateTextEdited: false,
  },
  counts,
  files: retained,
}
const retentionFile = path.join(destination, 'retention.json')
fs.writeFileSync(retentionFile, `${JSON.stringify(retention, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({
  status: retention.status,
  counts,
  retentionPath: retentionFile,
  retentionSha256: rawHash(retentionFile),
  actualExitCode: 0,
}, null, 2))
