import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-source-through55'
const assembly = `${ticket}/assembly-9g-p8-p55`
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const helper = `${ticket}/retain-source-9g-through55.mjs`
const pathManifest = `${ticket}/retain-source-9g-through55.paths.txt`
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const hash = file => sha256(fs.readFileSync(file))
const entries = []
const groups = []

const safeFile = file => {
  assert(!path.isAbsolute(file), `Expected repository-relative path: ${file}`)
  const parts = file.split(path.sep)
  assert(!parts.includes('..'), file)
  for (const part of parts) {
    assert(!/^(?:\.env(?:\..*)?|\.venv|environment|environments|secrets?|node_modules)$/i.test(part),
      `Excluded environment or secret path: ${file}`)
  }
  let prefix = ''
  for (const part of parts) {
    prefix = path.join(prefix, part)
    assert(!fs.lstatSync(prefix).isSymbolicLink(), `Symlink not retained: ${prefix}`)
  }
}

const add = (from, to, category) => {
  safeFile(from)
  const stat = fs.lstatSync(from)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) {
      add(path.join(from, name), path.join(to, name), category)
    }
    return
  }
  assert(stat.isFile(), `Only regular files retained: ${from}`)
  assert(['.json', '.md', '.mjs', '.py', '.txt', '.png', '.svg'].includes(path.extname(from)),
    `Unexpected evidence file type: ${from}`)
  entries.push({ sourcePath: from, path: to, sha256: hash(from), bytes: stat.size, category })
}

const retain = (from, to, category) => {
  const first = entries.length
  add(from, to, category)
  groups.push({ sourcePath: from, path: to, category, files: entries.length - first })
}

// Explicit inputs keep older page archives and parallel modern work out of this bundle.
for (const name of [
  'source-9g-p50-p53-author.md',
  'source-9g-p50-p53-author-manifest.json',
  'source-9g-p50-p53-author-evidence',
  'source-9g-p54-p55-author.md',
  'source-9g-p54-p55-author-manifest.json',
  'source-9g-p54-p55-author-evidence',
]) retain(`${ticket}/${name}`, `ticket/${name}`, 'original-author')

for (const name of [
  'source-9g-p50-p53-independent-source-first.md',
  'source-9g-p54-p55-independent-source-first.md',
  'source-9g-p50-p55-independent-review.md',
  'source-9g-p50-p55-targeted-repair-independent-review.md',
]) retain(`${ticket}/${name}`, `ticket/${name}`, 'existing-independent-source-evidence')

retain(`${ticket}/source-9g-p50-p55-targeted-repair-evidence`,
  'ticket/source-9g-p50-p55-targeted-repair-evidence', 'targeted-repair')
retain(`${ticket}/repair-9g-p50-p55-evidence.mjs`,
  'ticket/repair-9g-p50-p55-evidence.mjs', 'used-repair-script')

for (const name of [
  'before-book.json', 'inputs.json', 'assemble-wrapper-before-copy-repair.mjs',
  'first-wrapper-failure.md', 'operations',
]) retain(`${assembly}/${name}`, `ticket/assembly-9g-p8-p55/${name}`, 'original-assembly-evidence')
retain(`${ticket}/assemble-9g-through55-once.mjs`,
  'ticket/assemble-9g-through55-once.mjs', 'current-wrapper')
retain(`${assembly}/9-10g/book.json`,
  'ticket/assembly-9g-p8-p55/9-10g/book.json', 'source-output')

for (const lesson of ['geo910-c1-s1-t14', 'geo910-c1-s2-n14']) {
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    retain(`${assembly}/9-10g/lessons/${lesson}/${name}`,
      `ticket/assembly-9g-p8-p55/9-10g/lessons/${lesson}/${name}`, 'source-output')
  }
}
for (let page = 50; page <= 55; page++) {
  const id = String(page).padStart(4, '0')
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    retain(`${assembly}/9-10g/pages/${id}/${name}`,
      `ticket/assembly-9g-p8-p55/9-10g/pages/${id}/${name}`, 'new-assembly-input')
  }
  retain(`.tmp/ld-s10y-lesson/9-10g/pages/${id}`, `source-pixels/${id}`, 'new-prepared-page')
}

for (const name of ['rebind-book-trace.py', 'rebind-choice-provenance-once.py']) {
  retain(`${ticket}/${name}`, `ticket/${name}`, 'used-trace-helper')
}
for (const lesson of ['geo910-c1-s1-n3', 'geo910-c1-s1-n4', 'geo910-c1-s1-n7', 'geo910-c1-s1-n10']) {
  retain(`${ticket}/provenance-before-current/9-10g/${lesson}/64cef3281fdf`,
    `ticket/provenance-before-current/9-10g/${lesson}/64cef3281fdf`, 'immediate-prior-trace')
  for (const name of ['seed.json', 'draft.json', 'review.json']) {
    retain(`${source}/editions/modern-us-neutral/lessons/${lesson}/choice-set/${name}`,
      `current-choice-trace/${lesson}/${name}`, 'current-trace-snapshot')
  }
}
retain(helper, 'ticket/retain-source-9g-through55.mjs', 'retention-helper')

const pinned = {
  'ticket/source-9g-p50-p53-author.md':
    '4348338d43ba3be1ccfecc30321eba052ccdabe5acea83db8d23c2d8ca3cfae5',
  'ticket/source-9g-p50-p53-author-manifest.json':
    '10959956c44768e5ae31e77425ca44ae99e3324463a172f28ba1ef71107f070f',
  'ticket/source-9g-p54-p55-author.md':
    '8b92599b8b2c5b28c80643ffbabcd5427d7db5bbe34641fcba51f3fc6ab2347b',
  'ticket/source-9g-p54-p55-author-manifest.json':
    '50068df0c688749ed66da437f905f26375468d96692503fc574ee6f6a8cfeee3',
  'ticket/source-9g-p50-p53-independent-source-first.md':
    '902d3b839e84068a2dafdeab64d141e46a7de78a6ea3129ca58354f5eca89e5e',
  'ticket/source-9g-p54-p55-independent-source-first.md':
    '4aff2b04b38374aeddffa9d49f0c0f9d0dbcc8ae4ef5d36ee6ccae40cf3e66b3',
  'ticket/source-9g-p50-p55-independent-review.md':
    '583ba665c09e308df62cdc8bcfb2d935980087525b8bc861ffb7e9d6142efe03',
  'ticket/source-9g-p50-p55-targeted-repair-independent-review.md':
    '41d2904b22abe4cbb7404de1390bd21c86c5ac03f05ce83dfa1d431897468784',
  'ticket/assembly-9g-p8-p55/before-book.json':
    '64cef3281fdfe97c724fea1e9cbac38aef44ef4cd674855ae7ffa763e6651eed',
  'ticket/assembly-9g-p8-p55/9-10g/book.json':
    '09b7503438ca530df95ef569c48d762e1f8fb8e8fc8ceb384995074008065e24',
}
for (const [file, expected] of Object.entries(pinned)) {
  assert.equal(entries.find(entry => entry.path === file)?.sha256, expected,
    `Historical byte identity changed: ${file}`)
}

assert(!fs.existsSync(root), 'Never overwrite or rerun a retention bundle')
assert(!fs.existsSync(pathManifest), 'Never overwrite the staging path manifest')
const destinations = entries.map(entry => `${root}/${entry.path}`)
destinations.push(`${root}/retained-files.txt`, `${root}/retention.json`)
assert.equal(new Set(destinations).size, destinations.length, 'Duplicate retention destination')
const stagingBytes = Buffer.from(destinations.sort().join('\n') + '\n')
fs.writeFileSync(pathManifest, stagingBytes, { flag: 'wx' })
retain(pathManifest, 'retained-files.txt', 'exact-staging-path-manifest')
entries.sort((a, b) => a.path.localeCompare(b.path))

fs.mkdirSync(root, { recursive: true })
for (const entry of entries) {
  const original = fs.readFileSync(entry.sourcePath)
  assert.equal(sha256(original), entry.sha256, `Concurrent input change: ${entry.sourcePath}`)
  const destination = `${root}/${entry.path}`
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, original, { flag: 'wx' })
  const retained = fs.readFileSync(destination)
  assert(original.equals(retained), `Copy byte mismatch: ${destination}`)
  assert.equal(hash(entry.sourcePath), entry.sha256, `Concurrent input change: ${entry.sourcePath}`)
  assert.equal(sha256(retained), entry.sha256)
}

const recordedCommand = name => {
  const prefix = `ticket/assembly-9g-p8-p55/operations/${name}`
  const command = JSON.parse(fs.readFileSync(`${root}/${prefix}.command.json`, 'utf8'))
  return {
    name, commandPath: `${prefix}.command.json`,
    stdoutPath: `${prefix}.stdout.txt`, stderrPath: `${prefix}.stderr.txt`,
    exitCode: command.exitCode,
    evidence: 'Previously stored command record copied unchanged; command not executed by retention.',
  }
}
const traceLogPath = 'ticket/assembly-9g-p8-p55/operations/prior-choice-trace.stdout.txt'
const traceRecords = fs.readFileSync(`${root}/${traceLogPath}`, 'utf8').trim().split('\n')
  .map(line => JSON.parse(line))
const retention = {
  ticket: 'STEMROBIN-184',
  status: 'Mechanical retention of approved source50-55/assembly-through55/traces only; NOT modern complete.',
  sourceBookSha256: pinned['ticket/assembly-9g-p8-p55/9-10g/book.json'],
  priorSourceBookSha256: pinned['ticket/assembly-9g-p8-p55/before-book.json'],
  scope: {
    newPhysicalPages: [50, 51, 52, 53, 54, 55],
    preparedPagesCopied: 6,
    actualSourceCropsAndSvg: ['0050/fig-54', '0051/fig-55', '0054/fig-56', '0055/fig-57'],
    oldAssemblyPagesCopied: 0,
    originals: 'Entire original author reports/manifests/evidence, both existing independent source-first freezes, original REVISE and affected-only PASS preserved.',
    outputTriples: ['geo910-c1-s1-t14', 'geo910-c1-s2-n14'],
    priorProvenance: 'Only immediate 64cef3281fdf backups for n3/n4/n7/n10, plus opaque current seed/draft/review byte snapshots.',
  },
  independentEvidence: {
    originalStageB: {
      path: 'ticket/source-9g-p50-p55-independent-review.md',
      sha256: pinned['ticket/source-9g-p50-p55-independent-review.md'],
      outcome: 'Original REVISE preserved, not overwritten or promoted to PASS.',
    },
    affectedOnly: {
      path: 'ticket/source-9g-p50-p55-targeted-repair-independent-review.md',
      sha256: pinned['ticket/source-9g-p50-p55-targeted-repair-independent-review.md'],
      outcome: 'Limited existing PASS for declared repairs on50/51/53/55 only; not a new six-page, mathematics, modern, assembly or publication gate.',
    },
    parentConsumption: 'Human reported parent already consumed the original StageB and affected-only PASS; retention does not reopen them.',
  },
  realFirstFailure: {
    phase: 'Initial wrapper input copy before strict assembly invocation',
    exitCode: 1,
    missingHistoricalScratchFile: '.tmp/ld-s10y-lesson/9-10g/pages/0009/figures/fig-01.svg',
    assertion: 'assemble-9g-through55-once.mjs:58:7',
    markdownPath: 'ticket/assembly-9g-p8-p55/first-wrapper-failure.md',
    initialWrapperPath: 'ticket/assembly-9g-p8-p55/assemble-wrapper-before-copy-repair.mjs',
    currentWrapperPath: 'ticket/assemble-9g-through55-once.mjs',
    correction: 'Input copy rule only: source PNG remains required; optional legacy scratch SVG may be absent. Explicit resume reused the four successful first vectors.',
    limits: 'No source/index promotion, assembly, adapt-prepare or trace rebind had occurred at this failure; no separate wrapper stderr/exit log was present. Failure markdown and initial wrapper are copied as original evidence.',
  },
  existingFirstCommandRecords: [
    ...['vectorize-0050', 'vectorize-0051', 'vectorize-0054', 'vectorize-0055'].map(recordedCommand),
    ...['assemble', 'prepare-t14', 'prior-choice-trace'].map(recordedCommand),
  ],
  assembly: {
    evidencePath: 'ticket/assembly-9g-p8-p55/operations/assemble.stdout.txt',
    firstStrictAssemblyExit: 0,
    sourcePages: 48,
    units: 15,
    tasks: 152,
    numberedFigures: 57,
    t14: 'Closed source review121-152:32 complete exercises,1 footnote prose object,3 source figures. Adapt-prepare once is a precursor, not modern completion.',
    nextN14: 'geo910-c1-s2-n14 open at p0055#9; source not complete.',
    priorN1ThroughN13: 'All source lesson.json/lesson.md/exercises.json triples unchanged according to the original successful wrapper and human handoff; no comparison or semantic validation rerun by retention.',
  },
  priorChoices: {
    evidencePath: traceLogPath,
    records: traceRecords,
    limits: 'Original output validation for n3/n4/n7/n10 each once exit0 is retained, not executed again. Only book-trace and derived serialized scalars changed; no new mathematical/display review.',
  },
  limits: [
    'All retained newly approved material is a source/assembly/prepare/trace precursor, NOT modern complete.',
    'Original optical/codepoint UNKNOWNs remain:151 tiny list separator;125 exact point-line macro;fig54 p/rho;fig57 l/script-l;chapter heading dot encoding;Cyrillic/Latin a-shaped pixel identity and original subfigure same-row boundary.',
    'Literal146 wording and150 cross-page fig56a boundary remain uncorrected by mathematical inference; n14 remains open after the final source character at p0055#9.',
    'Prior exhausted n11 figure failures, rejected n12 choice coverage and all other pre-existing limits remain; no new old-course approval.',
    'No images opened; no new source-first freeze, semantic gate, mathematics review, modern-candidate read, validators, vectorization, finalize, assembly, prepare or rebind executed.',
    'No old retention executed or overwritten; no complete old48-page archive or older provenance directories copied.',
    'No environment, .venv, secrets or symlinks copied. Historical workspace/.tmp/.venv strings inside exact archival bytes are evidence only, not publishing contracts or runtime dependencies.',
    'No source/book/drafts/tools/plan/usage/DB/app/other-chat changes, git staging/commit, publication, merge, closure, deployment or formal handoff.',
  ],
  mechanics: {
    purpose: 'Byte equality and SHA-256 establish copy fidelity only, not content quality or a new gate.',
    sourceMutation: false,
    copiedFiles: entries.length,
    retainedFilesIncludingThisManifest: entries.length + 1,
    copiedBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
    exactStagingPaths: 'retained-files.txt',
    manifestSelfHash: 'Not embedded recursively; printed by retention helper after writing.',
  },
  groups,
  copied: entries,
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify(retention, null, 2) + '\n', { flag: 'wx' })
console.log(`${entries.length} copied files byte-identical; ${entries.length + 1} durable files total`)
for (const file of [`${root}/retention.json`, `${root}/retained-files.txt`, helper, pathManifest]) {
  console.log(`${hash(file)}  ${path.resolve(file)}`)
}
