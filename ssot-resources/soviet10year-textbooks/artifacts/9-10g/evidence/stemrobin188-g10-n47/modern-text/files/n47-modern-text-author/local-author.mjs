import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-modern-text-author');
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g';
const work = '.intentfold/tickets/STEMROBIN-188/tmp/g10-n47';
const template = `${work}/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s2-n47`;
const lesson = `${raw}/lessons/geo910-c2-s2-n47`;
const skill = '.claude/skills/ld-s10y-lesson';

if (process.cwd() !== repo) throw new Error('Unexpected cwd');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = bytes => JSON.parse(bytes.toString('utf8'));
const writeNew = (relative, bytes, mode = 0o644) => {
  const destination = path.resolve(own, relative);
  if (!destination.startsWith(`${own}/`)) throw new Error('Write outside author root');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes, { flag: 'wx', mode });
};
const writeJson = (relative, value, mode) =>
  writeNew(relative, `${JSON.stringify(value, null, 2)}\n`, mode);

function snapshot() {
  const inputs = [
    ['raw-lesson', `${lesson}/lesson.json`, 'before/raw/lesson.json'],
    ['raw-exercises', `${lesson}/exercises.json`, 'before/raw/exercises.json'],
    ['template-lesson', `${template}/lesson.template.json`, 'before/templates/lesson.template.json'],
    ['template-exercises', `${template}/exercises.template.json`, 'before/templates/exercises.template.json'],
    ['template-figures', `${template}/figures.template.json`, 'before/templates/figures.template.json'],
    ['durable-source-bindings', `${raw}/evidence/stemrobin188-g10-n47/source/bindings.json`],
    ['source-admission', `${work}/source-admission.json`],
    ['source-bindings', `${work}/source-bindings.json`],
    ['native-prepare-command', `${work}/adapt-prepare-isolated-01/command.json`],
    ['native-prepare-stdout', `${work}/adapt-prepare-isolated-01/stdout.txt`],
    ['native-prepare-stderr', `${work}/adapt-prepare-isolated-01/stderr.txt`],
    ['skill-contract', `${skill}/SKILL.md`],
    ['text-contract', `${skill}/references/edition-text-contract.md`],
    ['production-resume-contract', `${skill}/references/production-resume.md`],
    ['edition-functions', `${skill}/tools/edition.py`],
    ['math-functions', `${skill}/tools/mathcheck.py`],
    ['modern-profile', `${skill}/profiles/modern-us-neutral.json`],
  ];
  const bytesByRole = new Map();
  const bindings = inputs.map(([role, relative, copy]) => {
    const input = path.join(repo, relative);
    const bytes = fs.readFileSync(input);
    bytesByRole.set(role, bytes);
    if (copy) writeNew(copy, bytes, 0o444);
    return {
      role, path: input, sha256: digest(bytes), bytes: bytes.length,
      snapshot: copy ? path.join(own, copy) : null,
      snapshotMode: copy ? '0444' : null,
    };
  });
  const rawLesson = json(bytesByRole.get('raw-lesson'));
  const rawExercises = json(bytesByRole.get('raw-exercises'));
  const lessonTemplate = json(bytesByRole.get('template-lesson'));
  const exercisesTemplate = json(bytesByRole.get('template-exercises'));
  const source = json(bytesByRole.get('durable-source-bindings'));
  const rawBindings = bindings.filter(item => item.role.startsWith('raw-'));
  const prereqs = {
    proseCount27: rawLesson.prose.length === 27,
    exerciseCount6: rawExercises.exercises.length === 6,
    lessonSnapshotEqualsRaw: JSON.stringify(lessonTemplate.source.data) === JSON.stringify(rawLesson),
    exerciseSnapshotEqualsRaw: JSON.stringify(exercisesTemplate.source.data) === JSON.stringify(rawExercises),
    lessonTemplateShaEqualsRaw: lessonTemplate.source.sha256 === rawBindings[0].sha256,
    exercisesTemplateShaEqualsRaw: exercisesTemplate.source.sha256 === rawBindings[1].sha256,
    admittedReadableN47Only: source.status === 'complete-reviewed-readable-n47-source-only',
    strictStart: source.startIncluded === 'p0169#1',
    strictEndExcluded: source.rightBoundaryExcluded === 'p0172#12',
    durableRawHashesMatch: rawBindings.every(item =>
      source.bindings.some(binding =>
        path.join(repo, raw, binding.retained) === item.path && binding.sha256 === item.sha256)),
    nativePrepareSucceededOnce: json(bytesByRole.get('native-prepare-command')).exitCode === 0,
  };
  writeJson('bindings-before.json', {
    schema: 'stemrobin188-n47-author-input-bindings@1',
    cwd: repo, capturedAt: new Date().toISOString(), bindings, prereqs,
    inheritedSourceStatus: {
      status: source.status,
      originalSourceReviewReviseAndFIRSTPreserved: source.originalSourceReviewReviseAndFIRSTPreserved,
      sourceBodyRepairs: source.sourceBodyRepairs,
      localHoldsPreserved: source.localHoldsPreserved,
      exact49GlyphUnknownPreserved: source.exact49GlyphUnknownPreserved,
      lexical170HoldSettledByIndependentPixelsOnly: source.lexical170HoldSettledByIndependentPixelsOnly,
      wholePagesAllInkApproved: source.wholePagesAllInkApproved,
    },
    inheritedSourcePageBindings: source.bindings.filter(item =>
      /^pages\/017[0-2]\/(?:page\.(?:json|md)|audit\.json)$/.test(item.retained) ||
      /^pages\/0169\/(?:page\.(?:json|md)|audit\.json)$/.test(item.retained)),
    pageBindingsRehashedHere: false,
    imageFilesOpened: 0,
  }, 0o444);
  if (Object.values(prereqs).some(value => value !== true)) {
    throw new Error(`Input prerequisite mismatch: ${JSON.stringify(prereqs)}`);
  }
  // Seeds are byte copies; wording is authored in the candidate files with apply_patch.
  writeNew('candidate/lesson.json', bytesByRole.get('template-lesson'));
  writeNew('candidate/exercises.json', bytesByRole.get('template-exercises'));
  console.log(JSON.stringify({
    action: 'snapshot-and-seed-only', inputBindings: bindings.length,
    immutableFullObjectFiles: 5, rawSha256: rawBindings, prereqs,
    candidateFilesSeeded: 2, images: 0, nativePrepareInvocationsHere: 0,
  }, null, 2));
}

function compare() {
  const command = path.join(repo, skill, '.venv/bin/python');
  const args = ['-B', path.join(own, 'compare-local.py')];
  const directory = 'commands/compare-01';
  const startedAt = new Date().toISOString();
  fs.mkdirSync(path.join(own, directory), { recursive: false });
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  });
  writeNew(`${directory}/stdout.txt`, result.stdout || '');
  writeNew(`${directory}/stderr.txt`, result.stderr || '');
  writeJson(`${directory}/command.json`, {
    cwd: repo, command, args, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    kind: 'local-author-full-object-math-number-comparison-only',
    nativeFinalize: false, nativeRender: false, independentReview: false,
  }, 0o444);
  console.log(result.stdout || '');
  if (result.stderr) console.error(result.stderr);
  process.exitCode = result.status ?? 1;
}

const action = process.argv[2];
if (action === 'snapshot') {
  const startedAt = new Date().toISOString();
  fs.mkdirSync(path.join(own, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(own, 'commands/snapshot-01'), { recursive: false });
  const output = [];
  const originalLog = console.log;
  console.log = (...parts) => {
    output.push(parts.join(' '));
    originalLog(...parts);
  };
  let error = null;
  try { snapshot(); } catch (cause) { error = cause; }
  writeNew('commands/snapshot-01/stdout.txt', `${output.join('\n')}\n`);
  writeNew('commands/snapshot-01/stderr.txt', error ? `${error.stack}\n` : '');
  writeJson('commands/snapshot-01/command.json', {
    cwd: repo, command: 'node', args: [path.join(own, 'local-author.mjs'), 'snapshot'],
    startedAt, finishedAt: new Date().toISOString(), exitCode: error ? 1 : 0,
    kind: 'immutable-input-snapshot-and-candidate-byte-copy',
    nativePrepare: false, images: 0,
  }, 0o444);
  if (error) { console.error(error); process.exitCode = 1; }
} else if (action === 'compare') {
  compare();
} else {
  throw new Error('Use snapshot or compare; no native pipeline stages are available');
}
