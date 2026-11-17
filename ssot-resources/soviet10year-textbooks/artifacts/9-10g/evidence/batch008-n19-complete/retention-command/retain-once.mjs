import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const T = '.intentfold/tickets/STEMROBIN-184/tmp';
const A = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g';
const LESSON = 'geo910-c1-s2-n19';
const MODERN = `${A}/editions/modern-us-neutral/lessons/${LESSON}`;
const ARCHIVE = `${A}/evidence/batch008-n19-complete`;
const OWN = `${T}/n19-retain-approved-once`;
const SELF = fileURLToPath(import.meta.url);
const C = fs.constants;
const exclusiveFlags = C.O_WRONLY | C.O_CREAT | C.O_EXCL | C.O_NOFOLLOW;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const jsonBytes = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const absolute = relative => path.resolve(ROOT, relative);
const stamp = () => new Date().toISOString();

const directories = [
  'geo910-n19-choice-author',
  'geo910-n19-choice-independent-source-first-evidence',
  'geo910-n19-choice-independent-phase2',
  'geo910-n19-choice-independent-stage3',
  'geo910-n19-choice-current-trace',
  'n19-current-first-review-validation',
  'n19-first-offline-display',
  'n19-caption-layout-repair',
  'n19-caption-layout-affected-observation',
  'n19-first-choice-display',
  'n19-first-choice-display-observation',
  'offline/geo910-c1-s2-n19',
].map(name => `${T}/${name}`);
const singleFiles = [
  'geo910-n19-choice-seed.json',
  'geo910-n19-choice-draft.json',
  'geo910-n19-choice-author-report.md',
  'geo910-n19-choice-independent-source-first.md',
  'n19-trace-only-snapshot-once.py',
  'n19-current-first-review-validation.mjs',
  'repair-n19-caption-offline-once.mjs',
  'n19-first-choice-display-once.mjs',
].map(name => `${T}/${name}`);
singleFiles.push(
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.test.cjs',
  ...['text', 'exercises', 'choices'].map(
    view => `.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${LESSON}/${view}.html`,
  ),
);
const approved = [
  {
    source: `${T}/geo910-n19-choice-current-trace/seed.json`,
    target: `${MODERN}/choice-set/seed.json`,
    expected: '75407854ceca1d1058c0dac057f840707951dc09911e0ea8208839eb864d3c5b',
  },
  {
    source: `${T}/geo910-n19-choice-current-trace/draft.json`,
    target: `${MODERN}/choice-set/draft.json`,
    expected: 'ca93970e0d8d7517828dfd2c9584925b266f088fcebb2cebf9fe261de7427305',
  },
  {
    source: `${T}/geo910-n19-choice-independent-stage3/review.json`,
    target: `${MODERN}/choice-set/review.json`,
    expected: '74e03c3489016915dfd7447c8f7719edfc9cdd410fc30bffe5533dc73a912f9a',
  },
];
const references = [
  `${A}/evidence/batch008-n19-formal-answers/manifest.json`,
  `${A}/evidence/batch008-n19-independent-figures-source76/retention.json`,
];

function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

function noSymlinkAncestors(file) {
  const resolved = path.resolve(file);
  let current = path.parse(resolved).root;
  for (const component of resolved.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    const st = fs.lstatSync(current);
    requireThat(!st.isSymbolicLink(), `Symlink is not an archive input or destination: ${current}`);
  }
}

function absent(file) {
  try {
    fs.lstatSync(file);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  throw new Error(`Exclusive destination already exists: ${file}`);
}

function readRegular(file, allowResolvedRuntime = false) {
  const requested = path.resolve(file);
  const real = allowResolvedRuntime ? fs.realpathSync(requested) : requested;
  noSymlinkAncestors(real);
  const fd = fs.openSync(real, C.O_RDONLY | C.O_NOFOLLOW);
  try {
    const before = fs.fstatSync(fd);
    requireThat(before.isFile(), `Not a regular file: ${requested}`);
    const bytes = fs.readFileSync(fd);
    const after = fs.fstatSync(fd);
    requireThat(
      before.dev === after.dev && before.ino === after.ino &&
      before.size === after.size && before.mtimeMs === after.mtimeMs &&
      before.ctimeMs === after.ctimeMs && bytes.length === after.size,
      `Input changed while reading: ${requested}`,
    );
    return {
      path: requested,
      realpath: real,
      relative_path: requested.startsWith(`${ROOT}/`) ? path.relative(ROOT, requested) : null,
      bytes: bytes.length,
      sha256: sha(bytes),
      mode: (before.mode & 0o777).toString(8),
      mtime_utc: before.mtime.toISOString(),
      device: before.dev,
      inode: before.ino,
      buffer: bytes,
    };
  } finally {
    fs.closeSync(fd);
  }
}

function publicRecord(record) {
  const { buffer, ...rest } = record;
  return rest;
}

function inventory(relative) {
  const files = [];
  const dirs = [];
  function visit(rel) {
    const file = absolute(rel);
    noSymlinkAncestors(file);
    const st = fs.lstatSync(file);
    requireThat(st.isDirectory(), `Not an evidence directory: ${file}`);
    requireThat(!['node_modules', '.venv', 'venv', '.git'].includes(path.basename(file)),
      `Runtime directory cannot be archived: ${file}`);
    dirs.push(rel);
    for (const name of fs.readdirSync(file).sort()) {
      const childRel = `${rel}/${name}`;
      const child = absolute(childRel);
      const childStat = fs.lstatSync(child);
      requireThat(!childStat.isSymbolicLink(), `Symlink in evidence inventory: ${child}`);
      if (childStat.isDirectory()) visit(childRel);
      else {
        requireThat(childStat.isFile(), `Special file in evidence inventory: ${child}`);
        files.push(childRel);
      }
    }
  }
  visit(relative);
  return { source_directory: absolute(relative), relative, directories: dirs, files };
}

function ensureOwnedParents(file, ownedRoot) {
  const parent = path.dirname(file);
  requireThat(parent === ownedRoot || parent.startsWith(`${ownedRoot}/`),
    `Write outside owned destination: ${file}`);
  const pieces = path.relative(ownedRoot, parent).split(path.sep).filter(Boolean);
  let current = ownedRoot;
  noSymlinkAncestors(current);
  for (const piece of pieces) {
    current = path.join(current, piece);
    try {
      fs.mkdirSync(current, { mode: 0o755 });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    noSymlinkAncestors(current);
    requireThat(fs.lstatSync(current).isDirectory(), `Destination parent not a directory: ${current}`);
  }
}

function exclusiveWrite(file, bytes, ownedRoot, mode = 0o444) {
  ensureOwnedParents(file, ownedRoot);
  const fd = fs.openSync(file, exclusiveFlags, mode);
  try {
    fs.writeFileSync(fd, bytes);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  const retained = readRegular(file);
  requireThat(retained.buffer.equals(bytes), `Copied bytes differ: ${file}`);
  return publicRecord(retained);
}

function copyCaptured(record, target, ownedRoot, role, mode = 0o444) {
  const retained = exclusiveWrite(target, record.buffer, ownedRoot, mode);
  return {
    original: publicRecord(record),
    retained,
    original_path_rewritten: false,
    byte_identical: true,
    role,
    evidence_only: role !== 'approved-choice-set-first-installation',
    executable_permission_retained: false,
    runtime_dependency: false,
  };
}

function currentProvenance() {
  const paths = [
    `${A}/book.json`,
    `${A}/lessons/${LESSON}/lesson.json`,
    `${A}/lessons/${LESSON}/exercises.json`,
    ...['lesson.json', 'exercises.json', 'figures.json', 'answer-keys.json',
      'adaptation.audit.json', 'answer-keys.audit.json'].map(name => `${MODERN}/${name}`),
    ...['75', '76'].flatMap(id => [
      `${A}/figures/fig-${id}.png`,
      `${A}/figures/fig-${id}.svg`,
      ...['spec.json', 'render.json', 'review.json', 'svg'].map(
        suffix => `${A}/editions/modern-us-neutral/figures/fig-${id}.${suffix}`,
      ),
    ]),
    'app/package.json',
    'app/package-lock.json',
    '.claude/skills/ld-s10y-lesson/package.json',
    '.claude/skills/ld-s10y-lesson/package-lock.json',
    '.agents/skills/package.json',
    '.agents/skills/package-lock.json',
    '.claude/skills/ld-s10y-lesson/.venv/pyvenv.cfg',
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    'app/node_modules/@playwright/test/index.js',
    'app/node_modules/@playwright/test/package.json',
    `${T}/offline-check.mjs`,
    `${T}/render-choice-preview.mjs`,
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
    '.agents/skills/ld-s10y-choice/scripts/validate.py',
  ];
  const records = paths.map(rel => readRegular(absolute(rel), true));
  records.push(readRegular(process.execPath, true));
  return records;
}

function retainWorker() {
  requireThat(process.cwd() === ROOT && fs.realpathSync(ROOT) === ROOT, 'Exact cwd/realpath mismatch');
  requireThat(SELF === absolute(`${OWN}/retain-once.mjs`), 'Unexpected helper location');
  for (const target of [absolute(ARCHIVE), absolute(`${MODERN}/choice-set`)]) {
    noSymlinkAncestors(path.dirname(target));
    absent(target);
  }
  const inventories = directories.map(inventory);
  const paths = [...inventories.flatMap(item => item.files), ...singleFiles].sort();
  requireThat(new Set(paths).size === paths.length, 'Duplicate source in authorized scope');
  const captured = paths.map(rel => readRegular(absolute(rel)));
  const byPath = new Map(captured.map(record => [record.relative_path, record]));
  for (const item of approved) {
    requireThat(byPath.get(item.source)?.sha256 === item.expected,
      `Parent-approved raw hash mismatch: ${item.source}`);
  }
  const validatorPath = `${T}/n19-current-first-review-validation/command.json`;
  const validator = JSON.parse(byPath.get(validatorPath).buffer);
  requireThat(validator.exit === 0 && validator.invocationCount === 1 &&
    validator.args.includes('--review'), 'Saved current validator record is not the authorized first exit-0 run');
  for (const item of approved) {
    requireThat(validator.inputs.some(input => input.path === item.source && input.sha256 === item.expected),
      `Saved first validator binding mismatch: ${item.source}`);
  }
  const frozenReferences = references.map(rel => readRegular(absolute(rel)));
  requireThat(frozenReferences[1].sha256 ===
    'da8324b08b840614b6e315caf9e3403c178217b26297c2405fefd2d52a0299cd',
  'Frozen source/figure manifest hash mismatch');
  const provenance = currentProvenance();
  const answer = provenance.find(record => record.relative_path === `${MODERN}/answer-keys.json`);
  requireThat(answer.sha256 === 'b2c157601558fca22535e77a70baf1c017cd548f7fb19f630f70a215bd6fd182',
    'Parent-finalized answer raw hash mismatch');
  const finalHtml = [
    ['text', 'd98da1ec2367502f6185abaa6f9e30b5825f4dc4a10b26eacc9372a7dd434fcb'],
    ['exercises', 'f681c69ad420c2b7b67c5aa013278406536416e40fd16d8c32259c527dae8959'],
    ['choices', '7365b1bf83cd1a75425e2e034ae9b1817d58823956c4156527d3bc9bbcaa706c'],
  ];
  for (const [view, expected] of finalHtml) {
    const rel = `.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${LESSON}/${view}.html`;
    requireThat(byPath.get(rel)?.sha256 === expected, `Current saved render binding mismatch: ${rel}`);
  }
  fs.mkdirSync(absolute(ARCHIVE), { mode: 0o755 });
  fs.mkdirSync(absolute(`${MODERN}/choice-set`), { mode: 0o755 });
  const mappings = captured.map(record => copyCaptured(record,
    absolute(`${ARCHIVE}/files/${record.relative_path}`), absolute(ARCHIVE), 'authorized-full-file-retention'));
  for (const item of inventories) {
    for (const dir of item.directories) {
      ensureOwnedParents(absolute(`${ARCHIVE}/files/${dir}/.directory-placeholder`), absolute(ARCHIVE));
    }
  }
  const installations = approved.map(item => copyCaptured(byPath.get(item.source),
    absolute(item.target), absolute(`${MODERN}/choice-set`), 'approved-choice-set-first-installation', 0o644));
  // Recheck only byte stability and exhaustive directory membership, never lesson semantics.
  for (const before of [...captured, ...frozenReferences, ...provenance]) {
    const after = readRegular(before.path, before.realpath !== before.path);
    requireThat(after.sha256 === before.sha256 && after.bytes === before.bytes &&
      after.realpath === before.realpath, `Original/provenance input changed during retention: ${before.path}`);
  }
  for (const before of inventories) {
    const after = inventory(before.relative);
    requireThat(JSON.stringify(after) === JSON.stringify(before),
      `Source evidence inventory changed during retention: ${before.source_directory}`);
  }
  const formalManifest = JSON.parse(frozenReferences[0].buffer);
  const figureManifest = JSON.parse(frozenReferences[1].buffer);
  const payload = {
    status: 'EXACT_BYTE_RETENTION_WORKER_COMPLETE',
    completed_at_utc: stamp(),
    mappings,
    installations,
    directory_inventories: inventories.map(item => ({
      ...item,
      file_count: item.files.length,
      bytes: item.files.reduce((total, rel) => total + byPath.get(rel).bytes, 0),
    })),
    hash_only_provenance: provenance.map(record => ({
      ...publicRecord(record), copied: false, content_reviewed: false, media_decoded_or_opened: false,
      historical_expected_hash_drift_policy: 'Preserved in original archived ledgers; not a new source gate.',
    })),
    frozen_durable_references: frozenReferences.map((record, index) => ({
      ...publicRecord(record),
      copied: false,
      entire_archive_reverified: false,
      content_reviewed: false,
      existing_declared_file_count: index === 0 ? formalManifest.verification.copied_file_count : figureManifest.copies,
      existing_declared_bytes: index === 0 ? formalManifest.verification.copied_bytes : figureManifest.copiedBytes,
      role: index === 0 ? 'frozen-formal-answer-evidence' : 'frozen-independent-figure-source76-evidence',
    })),
    reused_current_validator: {
      command: publicRecord(byPath.get(validatorPath)),
      executable: validator.executable,
      args: validator.args,
      cwd: validator.cwd,
      started_at_utc: validator.startedAtUtc,
      finished_at_utc: validator.finishedAtUtc,
      exit: validator.exit,
      invocation_count_in_saved_record: validator.invocationCount,
      new_invocations: 0,
    },
    verification: {
      byte_identical: true,
      all_requested_regular_files_including_hidden_retained: true,
      original_input_bytes_unchanged: true,
      original_directory_membership_unchanged: true,
      exclusive_writes_only: true,
      archive_source_file_count: mappings.length,
      archive_source_bytes: mappings.reduce((total, item) => total + item.original.bytes, 0),
      installed_choice_set_file_count: installations.length,
      installed_choice_set_bytes: installations.reduce((total, item) => total + item.original.bytes, 0),
    },
    image_budget: { before: 7, after: 7, maximum: 8, new_opens: 0, reserved: 1 },
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function retainParent() {
  requireThat(process.cwd() === ROOT && SELF === absolute(`${OWN}/retain-once.mjs`),
    'Exact helper argv/cwd boundary mismatch');
  const ownRoot = absolute(OWN);
  noSymlinkAncestors(ownRoot);
  const lock = absolute(`${OWN}/invocation.lock.json`);
  const started = stamp();
  exclusiveWrite(lock, jsonBytes({ started_at_utc: started, invocation_count: 1, rerun_authorized: false }), ownRoot);
  const helper = readRegular(SELF);
  const executable = readRegular(process.execPath, true);
  const args = [SELF, '--retain-child'];
  const result = spawnSync(process.execPath, args, {
    cwd: ROOT, encoding: null, maxBuffer: 32 * 1024 * 1024,
  });
  const finished = stamp();
  const stdout = result.stdout ?? Buffer.alloc(0);
  const stderr = result.stderr ?? Buffer.alloc(0);
  const command = {
    schema: 'n19-retention-command@1',
    role: 'observed-one-shot-byte-retention-worker-only',
    executable: process.execPath,
    args,
    exact_argv: [process.execPath, ...args],
    launcher_argv: process.argv,
    cwd: ROOT,
    started_at_utc: started,
    finished_at_utc: finished,
    exit: result.status,
    signal: result.signal,
    error: result.error ? { code: result.error.code ?? null, message: result.error.message } : null,
    worker_invocations: 1,
    semantic_or_validator_invocations: 0,
    helper: publicRecord(helper),
    runtime_hash_only: publicRecord(executable),
    stdout: { path: absolute(`${OWN}/stdout.raw`), bytes: stdout.length, sha256: sha(stdout) },
    stderr: { path: absolute(`${OWN}/stderr.raw`), bytes: stderr.length, sha256: sha(stderr) },
    environment_dumped: false,
    archived_scripts_executed: false,
  };
  exclusiveWrite(absolute(`${OWN}/stdout.raw`), stdout, ownRoot);
  exclusiveWrite(absolute(`${OWN}/stderr.raw`), stderr, ownRoot);
  exclusiveWrite(absolute(`${OWN}/command.json`), jsonBytes(command), ownRoot);
  if (result.status !== 0 || result.error || result.signal) {
    exclusiveWrite(absolute(`${OWN}/first-failure.json`), jsonBytes({
      status: 'STOP_RETENTION_INCOMPLETE_NO_REPAIR_NO_RERUN',
      command: absolute(`${OWN}/command.json`),
      archive_may_be_partial: fs.existsSync(absolute(ARCHIVE)),
      complete_counts_claimed: false,
    }), ownRoot);
    process.stderr.write(stderr);
    process.exitCode = 1;
    return;
  }
  const payload = JSON.parse(stdout.toString('utf8'));
  requireThat(payload.status === 'EXACT_BYTE_RETENTION_WORKER_COMPLETE', 'Unexpected worker result');
  const archiveRoot = absolute(ARCHIVE);
  const commandMappings = ['retain-once.mjs', 'invocation.lock.json', 'command.json', 'stdout.raw', 'stderr.raw']
    .map(name => copyCaptured(readRegular(absolute(`${OWN}/${name}`)),
      absolute(`${ARCHIVE}/retention-command/${name}`), archiveRoot, 'new-retention-command-evidence-only'));
  const allMappings = [...payload.mappings, ...commandMappings];
  const generated = [];
  function document(name, bytes) {
    const record = exclusiveWrite(absolute(`${ARCHIVE}/${name}`), bytes, archiveRoot);
    generated.push(record);
    return record;
  }
  const mappingDoc = document('source-to-retained.json', jsonBytes({
    schema: 'n19-source-to-retained@1',
    mappings: allMappings,
    first_installations: payload.installations,
    path_policy: 'Original paths and historical record bytes are untouched. Archive paths are mapping targets only.',
  }));
  const provenanceDoc = document('hash-only-provenance.json', jsonBytes({
    schema: 'n19-hash-only-provenance@1',
    current: payload.hash_only_provenance,
    frozen_durable_references: payload.frozen_durable_references,
    policy: 'Byte hashing only, no content/image review; no runtime directories or extra source media copied.',
  }));
  const countsDoc = document('counts.json', jsonBytes({
    schema: 'n19-retention-dependent-complete-counts@1',
    status: 'COMPLETE_AFTER_EXACT_BYTE_RETENTION',
    lesson: LESSON,
    counts: { lessons: 1, formal_answers: 6, choice_questions: 6, options: 24 },
    basis: 'Parent-consumed approvals and frozen formal-answer/current-choice evidence, not a new semantic/schema gate.',
    installation: payload.installations.map(item => item.retained),
    formal_answer_raw_sha256: 'b2c157601558fca22535e77a70baf1c017cd548f7fb19f630f70a215bd6fd182',
    formal_answer_count_record: payload.frozen_durable_references[0].path,
    image_budget: payload.image_budget,
    whole_lesson_new_formal_approval: false,
    publication_certified: false,
  }));
  const inventoryDoc = document('requested-directory-inventory.json', jsonBytes(payload.directory_inventories));
  const manifest = {
    schema: 'n19-complete-exact-byte-retention@1',
    ticket: 'STEMROBIN-184',
    lesson: LESSON,
    status: 'EXACT_BYTE_RETENTION_COMPLETE_NO_NEW_REVIEW',
    created_at_utc: stamp(),
    workspace_realpath: ROOT,
    ticket_tmp_realpath: absolute(T),
    archive_root: archiveRoot,
    approved_choice_set_root: absolute(`${MODERN}/choice-set`),
    ...payload,
    status: 'EXACT_BYTE_RETENTION_COMPLETE_NO_NEW_REVIEW',
    command_evidence_mappings: commandMappings,
    generated_records: generated,
    full_mapping_document: mappingDoc,
    provenance_document: provenanceDoc,
    counts_document: countsDoc,
    requested_directory_inventory_document: inventoryDoc,
    preserved_history: [
      { event: 'historical-wrong-HTML-ENOENT', original_record:
        absolute(`${T}/geo910-n19-choice-independent-stage3/html-resolution.json`) },
      { event: 'phase2-seal-book-drift', original_record:
        absolute(`${T}/geo910-n19-choice-independent-phase2/freeze-attempt-1.json`) },
      { event: 'first-offline-display-STOP-immutable', original_record:
        absolute(`${T}/n19-first-offline-display/report.md`) },
      { event: 'one-caption-only-repair-no-second-repair', original_record:
        absolute(`${T}/n19-caption-layout-repair/completion.json`) },
      { event: 'accepted-affected-caption-observation', original_record:
        absolute(`${T}/n19-caption-layout-affected-observation/ledger.json`) },
      { event: 'accepted-first-choice-display-observation', original_record:
        absolute(`${T}/n19-first-choice-display-observation/ledger.json`) },
    ],
    inert_archive_policy: {
      all_retained_files_mode: '0444',
      executable_permissions_removed: true,
      original_script_bytes_and_paths_inside_records_unchanged: true,
      scripts_not_executed_imported_or_registered: true,
      archive_is_evidence_not_runtime: true,
      no_new_runtime_dependency_on_tmp: true,
    },
    boundaries: {
      semantic_review: false, source_gate: false, old_command_or_validator_rerun: false,
      browser: false, image_open: false, render: false, source_answer_choice_math_review: false,
      source_or_template_edits: false, database: false, network: false, application: false,
      dependency_installation: false, workflow: false, git: false,
    },
    manifest_self_and_later_report_hashes: 'Covered by hashes.json; that ledger excludes only its own hash.',
  };
  const manifestDoc = document('manifest.json', jsonBytes(manifest));
  const reportLines = [
    '# N19 Complete Retention',
    '',
    'Status: EXACT_BYTE_RETENTION_COMPLETE_NO_NEW_REVIEW.',
    '',
    `Lesson: ${LESSON}. Retention-dependent counts: 1 lesson / 6 formal answers / 6 choice questions / 24 options.`,
    'These counts reuse parent-consumed approvals; this task adds no semantic or whole-lesson formal approval.',
    '',
    '## Exact Installation',
    ...payload.installations.map(item =>
      `- ${item.original.path} -> ${item.retained.path}; ${item.retained.bytes} bytes; SHA-256 ${item.retained.sha256}.`),
    '',
    '## Retained Scope',
    `${payload.verification.archive_source_file_count} authorized original files, ${payload.verification.archive_source_bytes} bytes, copied in full including hidden files; no symlinks or runtime directories.`,
    `${payload.verification.installed_choice_set_file_count} exclusive first-installation files, ${payload.verification.installed_choice_set_bytes} bytes.`,
    'All archive copies and installations were compared byte-for-byte; original inputs and evidence-directory membership remained unchanged during the worker.',
    'Five new helper/lock/command/raw-output records are retained separately as inert command evidence.',
    '',
    '## Full Records',
    `Manifest: ${manifestDoc.path}; SHA-256 ${manifestDoc.sha256}.`,
    `Full source-to-retained mappings: ${mappingDoc.path}; SHA-256 ${mappingDoc.sha256}.`,
    `Requested directory inventories: ${inventoryDoc.path}; SHA-256 ${inventoryDoc.sha256}.`,
    `Hash-only source/final JSON/SVG/runtime/package/venv provenance: ${provenanceDoc.path}; SHA-256 ${provenanceDoc.sha256}.`,
    `Complete counts: ${countsDoc.path}; SHA-256 ${countsDoc.sha256}.`,
    `Observed retention command and exact raw stdout/stderr: ${archiveRoot}/retention-command/.`,
    `Full archive hash/file ledger, including this report and manifest: ${archiveRoot}/hashes.json (excludes only its own hash).`,
    '',
    '## Frozen References',
    ...payload.frozen_durable_references.map(item =>
      `- ${item.path}; SHA-256 ${item.sha256}; ${item.bytes} bytes. Existing declared retention ${item.existing_declared_file_count} files / ${item.existing_declared_bytes} bytes; not recopied or rereviewed.`),
    '',
    '## Reused Evidence',
    `Current with-review validator: saved invocation count 1, exit ${payload.reused_current_validator.exit}; ${payload.reused_current_validator.started_at_utc} to ${payload.reused_current_validator.finished_at_utc}; no new invocation.`,
    'Historical wrong-HTML ENOENT, phase2 book-seal drift, initial first-display STOP, single caption repair, accepted affected-caption observation, and accepted choice-display observation remain exact, separate records. No status or original path was rewritten.',
    'Current final HTML was copied, including the accepted caption-only text HTML; historical pre-repair HTML and screenshots remain separately retained.',
    '',
    '## Honest Scope',
    'Image ledger remains 7/8: zero additional image opens, one reserved. Binary media hashing/copying is not visual observation.',
    'No semantic/math/source/answer/choice review, old command or gate rerun, browser, render, app, DB, network, dependency operation, workflow, Git, staging, commit, or push.',
    'All archived files have non-executable mode 0444 and are evidence only. Scripts were not launched, imported, or registered; no new durable runtime dependency on .tmp was added. Paths inside historical bytes are provenance, not runnable dependencies.',
    'Original formal-answer and independent-figure/source archives were left frozen. Their manifest hashes and current final JSON/SVG hashes are references, not renewed approvals.',
    '',
  ];
  const reportDoc = document('report.md', Buffer.from(reportLines.join('\n')));
  const archiveFiles = inventory(ARCHIVE).files.map(rel => publicRecord(readRegular(absolute(rel))));
  const hashesDoc = document('hashes.json', jsonBytes({
    schema: 'n19-complete-archive-full-file-hashes@1',
    created_at_utc: stamp(),
    archive_root: archiveRoot,
    coverage: 'Every archive file existing after report creation, including every retained script, image, raw output, mapping, provenance, count, manifest and report. Only this hash ledger itself is excluded.',
    covered_file_count: archiveFiles.length,
    covered_bytes: archiveFiles.reduce((total, file) => total + file.bytes, 0),
    files: archiveFiles,
    installed_choice_set: payload.installations.map(item => item.retained),
    frozen_durable_references: payload.frozen_durable_references,
    self_hash_supplied_in_completion_and_parent_response: true,
  }));
  const completion = {
    status: 'EXACT_BYTE_RETENTION_COMPLETE_NO_NEW_REVIEW',
    completed_at_utc: stamp(),
    source_retention: payload.verification,
    archive_total_files_including_hash_ledger: archiveFiles.length + 1,
    archive_total_bytes_including_hash_ledger:
      archiveFiles.reduce((total, file) => total + file.bytes, 0) + hashesDoc.bytes,
    installed_choice_set: payload.installations.map(item => item.retained),
    durable_metadata: [manifestDoc, reportDoc, mappingDoc, provenanceDoc, countsDoc, inventoryDoc, hashesDoc],
    command: publicRecord(readRegular(absolute(`${ARCHIVE}/retention-command/command.json`))),
    counts: { lessons: 1, formal_answers: 6, choice_questions: 6, options: 24 },
    image_budget: payload.image_budget,
    no_stage_commit_push: true,
  };
  exclusiveWrite(absolute(`${OWN}/completion.json`), jsonBytes(completion), ownRoot);
  process.stdout.write(`${JSON.stringify(completion, null, 2)}\n`);
}

try {
  if (process.argv.length === 3 && process.argv[2] === '--retain-child') retainWorker();
  else {
    requireThat(process.argv.length === 2, 'Only the one-shot default invocation or its retention child is allowed');
    retainParent();
  }
} catch (error) {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
}
