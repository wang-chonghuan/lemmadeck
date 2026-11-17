import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const workspace = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const ticketTmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const artifacts = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const modern = `${artifacts}/editions/modern-us-neutral/lessons/geo910-c1-s2-n19`
const formalRun = `${ticketTmp}/n18-n19-production/n19-formal-answers`
const archiveRelative = `${artifacts}/evidence/batch008-n19-formal-answers`
const archive = path.join(workspace, archiveRelative)
const helperRelative = `${ticketTmp}/retain-n19-formal-answer-evidence-once.mjs`
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const exclusiveFlags = fs.constants.O_WRONLY | fs.constants.O_CREAT |
  fs.constants.O_EXCL | fs.constants.O_NOFOLLOW

assert.equal(process.argv.length, 2, 'This bounded helper accepts no arguments')
assert.equal(fs.realpathSync(process.cwd()), workspace)
assert.equal(fileURLToPath(import.meta.url), path.join(workspace, helperRelative))
assert.equal(fs.realpathSync(path.join(workspace, ticketTmp)), path.join(workspace, ticketTmp))
assert(!fs.existsSync(archive), 'Archive already exists; do not retry or overwrite it')

function checkPath(absolute) {
  assert(absolute === workspace || absolute.startsWith(`${workspace}/`))
  let current = workspace
  assert(fs.lstatSync(current).isDirectory())
  assert(!fs.lstatSync(current).isSymbolicLink())
  for (const part of path.relative(workspace, absolute).split(path.sep).filter(Boolean)) {
    current = path.join(current, part)
    assert(!fs.lstatSync(current).isSymbolicLink(), `Symlink is forbidden: ${current}`)
  }
}

function rejectUnapprovedMaterial(relative, bytes) {
  const parts = relative.split('/')
  assert(!parts.some(part =>
    /^\.env(?:\.|$)/i.test(part) ||
    /^(?:node_modules|\.venv|venv|site-packages|credentials?|secrets?)$/i.test(part) ||
    /^(?:node|python(?:\d+(?:\.\d+)*)?|bash|zsh|sh)(?:\.exe)?$/i.test(part) ||
    /\.(?:pem|key|p12|pfx)$/i.test(part)), `Forbidden archive path: ${relative}`)
  const text = bytes.toString('utf8')
  const credentialPatterns = [
    /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/,
    /\b(?:postgres(?:ql)?|mysql|rediss?|mongodb(?:\+srv)?):\/\/[^\s/]*:[^@\s/]+@/i,
    /\bsk-[A-Za-z0-9_-]{20,}\b/,
    /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
  ]
  assert(!credentialPatterns.some(pattern => pattern.test(text)),
    `Recognizable credential material is forbidden: ${relative}`)
}

function readRegular(relative) {
  assert(!path.isAbsolute(relative) && !relative.split('/').includes('..'))
  const absolute = path.join(workspace, relative)
  checkPath(absolute)
  const fd = fs.openSync(absolute, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW)
  try {
    const before = fs.fstatSync(fd)
    assert(before.isFile(), `Only regular files are allowed: ${relative}`)
    const bytes = fs.readFileSync(fd)
    const after = fs.fstatSync(fd)
    assert.equal(after.size, before.size, `Source changed during capture: ${relative}`)
    assert.equal(after.mtimeMs, before.mtimeMs, `Source changed during capture: ${relative}`)
    assert.equal(bytes.length, before.size)
    rejectUnapprovedMaterial(relative, bytes)
    return { relative, absolute, bytes, sha256: digest(bytes), size: bytes.length }
  } finally {
    fs.closeSync(fd)
  }
}

function regularFiles(relative) {
  checkPath(path.join(workspace, relative))
  const entries = fs.readdirSync(path.join(workspace, relative)).sort()
  return entries.flatMap(name => {
    const child = `${relative}/${name}`
    const stat = fs.lstatSync(path.join(workspace, child))
    assert(!stat.isSymbolicLink(), `Symlink is forbidden: ${child}`)
    if (stat.isDirectory()) return regularFiles(child)
    assert(stat.isFile(), `Non-regular archive input: ${child}`)
    return [child]
  })
}

const inputs = [
  {
    relative: `${ticketTmp}/geo910-n19-independent-answer-gate2-report.md`,
    role: 'complete-single-n19-gate2-report',
    expected: 'ae4b4e61f50a95578005c4bedc4a7b10078ed122896dc9709e3e251935dc9b71',
  },
  {
    relative: `${ticketTmp}/geo910-n19-independent-answer-gate2-bindings.json`,
    role: 'complete-single-n19-gate2-bindings',
    expected: '04d67cc455276900158e2814d2b223e185f925a317579099deec3a70f9c7a570',
  },
  {
    relative: `${ticketTmp}/geo910-n18-n19-independent-answer-source-freeze.md`,
    role: 'unchanged-source-first-independent-freeze',
    expected: '64afbddd258f58356bde4c3fee520a26d46a27e5b41cb97355e05d9d0160a5ff',
  },
  {
    relative: `${ticketTmp}/geo910-n18-n19-standard-answer-prose.json`,
    role: 'complete-frozen-candidate-container-only-n19-selector-approved',
    expected: 'c82f236a7e10b29784a50575a5317ff90a8c3cda3c7be2292866975b39f86abd',
  },
  {
    relative: `${modern}/lesson.json`,
    role: 'exact-gate2-modern-lesson-hash-snapshot',
    expected: 'eaa8d90a2955e5e9d3fef5eaca3e18cb7fcd764d5a2193a8ab61b3c898011771',
  },
  {
    relative: `${modern}/exercises.json`,
    role: 'exact-gate2-modern-exercises-hash-snapshot',
    expected: 'bec17cf252503bc992d97686c25f8540e7cc78dd60659346418272221576eae7',
  },
  {
    relative: `${modern}/figures.json`,
    role: 'exact-gate2-modern-figures-hash-snapshot-not-new-image-review',
    expected: 'a645039c4b8e1ab800c03cd9f0f5bbe3d52cfebf311afa125f35775fd3879bef',
  },
  {
    relative: `${modern}/answer-keys.json`,
    role: 'parent-first-finalized-n19-formal-answer-exact-bytes',
    expected: 'b2c157601558fca22535e77a70baf1c017cd548f7fb19f630f70a215bd6fd182',
  },
  {
    relative: `${ticketTmp}/bind-finalize-n18-n19-answers-once.mjs`,
    role: 'exact-parent-bind-finalize-helper-source-provenance',
    expected: '2b421b022718f426d5d5595f1d20a907624e92d27e541e28cfdcdf64faf03a5e',
  },
  {
    relative: helperRelative,
    role: 'retention-only-sidecar-source-not-an-interpreter-or-process-capture',
  },
]

const runFiles = regularFiles(formalRun)
const requiredRunNames = [
  'binding.json', 'completion.json', 'prepare.command.json',
  'prepare.stdout.txt', 'prepare.stderr.txt', 'finalize.command.json',
  'finalize.stdout.txt', 'finalize.stderr.txt',
]
for (const name of requiredRunNames) {
  assert(runFiles.includes(`${formalRun}/${name}`), `Missing formal run evidence: ${name}`)
}
inputs.push(...runFiles.map(relative => ({
  relative, role: 'complete-first-n19-formal-run-evidence',
})))
assert.equal(new Set(inputs.map(input => input.relative)).size, inputs.length)

// Capture byte snapshots before creating any output; never execute the parent helper.
const snapshots = inputs.map(input => {
  const snapshot = readRegular(input.relative)
  if (input.expected) assert.equal(snapshot.sha256, input.expected, input.relative)
  return { ...snapshot, role: input.role, expected: input.expected || null }
})
const byPath = new Map(snapshots.map(snapshot => [snapshot.relative, snapshot]))
const bindings = JSON.parse(byPath.get(`${ticketTmp}/geo910-n19-independent-answer-gate2-bindings.json`).bytes)
for (const name of ['lesson', 'exercises', 'figures']) {
  const snapshot = byPath.get(`${modern}/${name}.json`)
  assert.equal(snapshot.sha256, bindings.bindings[`modern_${name}`].sha256)
}
const parentSource = byPath.get(`${ticketTmp}/bind-finalize-n18-n19-answers-once.mjs`)
const sourceText = parentSource.bytes.toString('utf8')
assert(sourceText.includes("spawnSync('python3', ["))
assert(sourceText.includes("'.claude/skills/ld-s10y-answer/tools/lesson_answers.py', name"))
assert(sourceText.includes("'--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id"))
assert(sourceText.includes("argv: child.spawnargs"))
assert(sourceText.includes("run('prepare')") && sourceText.includes("run('finalize')"))

const commandProvenance = ['prepare', 'finalize'].map(stage => {
  const snapshot = byPath.get(`${formalRun}/${stage}.command.json`)
  const observed = JSON.parse(snapshot.bytes)
  assert(!Object.hasOwn(observed, 'argv'), `${stage} unexpectedly records argv`)
  assert.deepEqual(Object.keys(observed).sort(),
    ['cwd', 'startedAtUtc', 'finishedAtUtc', 'exit', 'error'].sort())
  assert.equal(observed.cwd, workspace)
  assert.equal(observed.exit, 0)
  assert.equal(observed.error, null)
  return {
    stage,
    original_command_path: snapshot.absolute,
    original_command_sha256: snapshot.sha256,
    observed_saved_record: observed,
    observed_argv: null,
    argv_capture_present: false,
    reconstruction_only: true,
    reconstructed_argv: [
      'python3', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', stage,
      '--book', '9-10g', '--edition', 'modern-us-neutral',
      '--lesson', 'geo910-c1-s2-n19',
    ],
    reconstruction_basis: {
      helper_path: parentSource.absolute,
      helper_sha256: parentSource.sha256,
      source_lines: '50-54 for spawn arguments and ineffective argv field; 63/90 for stage calls',
      parent_invocation_description: 'The parent reported the n19 first prepare/finalize invocation for geo910-c1-s2-n19.',
      limitation: 'Saved command JSONs contain no argv. This list is reconstructed provenance, not observed process capture; original command bytes are unchanged and no process was rerun.',
    },
  }
})

const references = [
  {
    relative: `${artifacts}/evidence/batch008-n19-independent-figures-source76/retention.json`,
    expected: 'da8324b08b840614b6e315caf9e3403c178217b26297c2405fefd2d52a0299cd',
    role: 'already-retained-independent-source-and-figure-evidence',
  },
  {
    relative: `${artifacts}/evidence/batch008-late-text-source-counter-reviews/retention-completion.json`,
    expected: '14a79cce8330591374188203f20100bab9ca1f8c552c4665c14f8906b42c13bd',
    role: 'already-retained-late-source-text-counter-evidence',
  },
].map(reference => {
  const snapshot = readRegular(reference.relative)
  assert.equal(snapshot.sha256, reference.expected)
  return {
    original_path: snapshot.absolute,
    sha256: snapshot.sha256,
    bytes: snapshot.size,
    role: reference.role,
    copied: false,
    content_reviewed: false,
    method: 'Manifest byte hash only; no source, figure or late-review rerun.',
  }
})

function writeExclusive(absolute, bytes) {
  assert(absolute.startsWith(`${archive}/`))
  fs.mkdirSync(path.dirname(absolute), { recursive: true })
  checkPath(path.dirname(absolute))
  const fd = fs.openSync(absolute, exclusiveFlags, 0o600)
  try {
    fs.writeFileSync(fd, bytes)
  } finally {
    fs.closeSync(fd)
  }
}

fs.mkdirSync(archive)
for (const snapshot of snapshots) {
  writeExclusive(path.join(archive, 'files', snapshot.relative), snapshot.bytes)
}

// One archive verification pass compares each copy with its captured source bytes.
const entries = snapshots.map(snapshot => {
  const copyPath = path.join(archive, 'files', snapshot.relative)
  checkPath(copyPath)
  const fd = fs.openSync(copyPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW)
  let copied
  try {
    assert(fs.fstatSync(fd).isFile())
    copied = fs.readFileSync(fd)
  } finally {
    fs.closeSync(fd)
  }
  const copySha = digest(copied)
  assert.equal(copySha, snapshot.sha256)
  assert.equal(copied.length, snapshot.size)
  assert(copied.equals(snapshot.bytes))
  return {
    original_path: snapshot.absolute,
    copy_path: copyPath,
    copy_relative_path: `files/${snapshot.relative}`,
    role: snapshot.role,
    original_sha256: snapshot.sha256,
    copy_sha256: copySha,
    original_bytes: snapshot.size,
    copy_bytes: copied.length,
    expected_preexisting_sha256: snapshot.expected,
    byte_identical: true,
  }
})
assert.deepEqual(regularFiles(formalRun), runFiles,
  'Formal run directory membership changed during retention; leave evidence intact')

const manifest = {
  schema: 'ld-s10y-answer/formal-answer-byte-retention@1',
  ticket: 'STEMROBIN-184',
  created_at_utc: new Date().toISOString(),
  workspace_realpath: workspace,
  ticket_tmp_realpath: path.join(workspace, ticketTmp),
  archive_root: archive,
  status: 'BYTE_RETENTION_COMPLETE',
  scope: 'Exact-byte evidence retention only. No semantic review, Gate 2 rerun, source/image/choice review, prepare/finalize rerun, publication, Git, DB or app operation.',
  copy_method: 'Captured regular-file bytes; destination O_CREAT|O_EXCL|O_NOFOLLOW (FILE_EXCL). No source rewriting, symlink, environment snapshot, credential material or interpreter archive.',
  verification: {
    passes: 1,
    copied_file_count: entries.length,
    copied_bytes: entries.reduce((total, entry) => total + entry.copy_bytes, 0),
    formal_run_file_count: runFiles.length,
    byte_identical: true,
    original_inputs_not_modified: true,
  },
  approval_boundary: {
    lesson: 'geo910-c1-s2-n19',
    approved_candidate_pointer: '/lessons/geo910-c1-s2-n19',
    approved_selected_parsed_value_sha256: bindings.bindings.candidate_prose.selected_parsed_value_sha256,
    selected_value_hash_method: bindings.hash_serialization.parsed_values,
    n19_gate2_report_sha256: 'ae4b4e61f50a95578005c4bedc4a7b10078ed122896dc9709e3e251935dc9b71',
    n19_gate2_bindings_sha256: '04d67cc455276900158e2814d2b223e185f925a317579099deec3a70f9c7a570',
    candidate_container_sha256: 'c82f236a7e10b29784a50575a5317ff90a8c3cda3c7be2292866975b39f86abd',
    whole_candidate_container_approved: false,
    n18: 'HOLD; retained container includes n18 but no n18 approval, Gate 2 or formal binding is certified.',
  },
  parent_formal_result: {
    formal_answer_sha256: 'b2c157601558fca22535e77a70baf1c017cd548f7fb19f630f70a215bd6fd182',
    count: 6,
    source: 'derived',
    grading: 'ungraded',
    parts: [],
    basis: 'Parent-reported formal shape; existing completion record and exact answer bytes retained without a semantic/schema rerun.',
    prepare_exit_observed_in_saved_record: 0,
    finalize_exit_observed_in_saved_record: 0,
    whole_lesson_certified: false,
    publication_certified: false,
  },
  command_provenance: commandProvenance,
  already_retained_references_not_recopied: references,
  entries,
}
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
const manifestPath = path.join(archive, 'manifest.json')
writeExclusive(manifestPath, manifestBytes)
const manifestSha = digest(manifestBytes)
const reportText = [
  '# N19 Formal Answer Byte Retention',
  '',
  'Status: COMPLETE; evidence retention only, no semantic or process rerun.',
  `Copied files: ${entries.length}; copied bytes: ${manifest.verification.copied_bytes}.`,
  `Complete formal-run subtree: ${runFiles.length} files, including zero-byte raw logs.`,
  'One verification pass: every copy matches the original captured SHA-256 and bytes.',
  `Archive: ${archive}`,
  `Manifest: ${manifestPath}`,
  `Manifest SHA-256: ${manifestSha}`,
  `Manifest bytes: ${manifestBytes.length}`,
  '',
  'Includes the complete Gate 2 report/bindings, unchanged independent freeze,',
  'exact prose container, three bound modern input snapshots, complete formal run,',
  'current finalized answer, parent helper, and this retention-only helper source.',
  '',
  'Only /lessons/geo910-c1-s2-n19 is approved in the retained prose container.',
  'The included n18 content is unapproved; n18 remains HOLD.',
  '',
  'Both saved command JSONs omit argv. Original command/log bytes are unchanged.',
  'The manifest separately labels reconstructed argv from the hash-bound helper',
  'and parent n19 invocation; it is provenance only, not observed process capture.',
  ...commandProvenance.flatMap(command => [
    `${command.stage}: observed cwd=${command.observed_saved_record.cwd},`,
    `UTC ${command.observed_saved_record.startedAtUtc} to ${command.observed_saved_record.finishedAtUtc}, exit=${command.observed_saved_record.exit}.`,
    `Reconstructed argv only: ${command.reconstructed_argv.join(' ')}`,
  ]),
  '',
  'Existing da8324b0 and 14a79cce archives are hash-bound references, not recopied.',
  'No symlink, interpreter, environment snapshot or credential material retained.',
  'No source, image, choice, Gate 2, prepare/finalize, Git, DB or app operation run.',
  'All outputs are confined to the authorized real ticket TMP helper and archive.',
  '',
].join('\n')
const reportBytes = Buffer.from(reportText, 'utf8')
const reportPath = path.join(archive, 'retention-report.md')
writeExclusive(reportPath, reportBytes)

console.log(reportText)
console.log(JSON.stringify({
  status: manifest.status,
  archive,
  manifest_path: manifestPath,
  manifest_sha256: manifestSha,
  manifest_bytes: manifestBytes.length,
  report_path: reportPath,
  report_sha256: digest(reportBytes),
  copied_file_count: entries.length,
  copied_bytes: manifest.verification.copied_bytes,
  generated_file_count: 2,
  total_archive_file_count: entries.length + 2,
  total_archive_file_bytes: manifest.verification.copied_bytes + manifestBytes.length + reportBytes.length,
  verification_passes: 1,
  argv_reconstructed_only: true,
}, null, 2))
