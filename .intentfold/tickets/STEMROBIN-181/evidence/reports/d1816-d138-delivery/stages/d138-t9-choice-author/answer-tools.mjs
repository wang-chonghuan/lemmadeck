import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== cwd) throw new Error('Exact authorized cwd required');
const own = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-choice-author';
const base = '.tmp/STEMROBIN-181/d1816-d138';
const lesson = 'phy9-c1-s3-t9';
const editions = { zh: 'modern-us-neutral', en: 'modern-us-neutral-en' };
const abs = p => path.resolve(cwd, p);
const read = p => JSON.parse(fs.readFileSync(abs(p), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = p => {
  const bytes = fs.readFileSync(abs(p));
  return { path: abs(p), bytes: bytes.length, sha256: sha(bytes) };
};
const write = (name, data) => {
  const target = abs(`${own}/${name}`);
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
  return bind(target);
};
const choiceFreeze = read(`${own}/author-freeze.json`);
for (const entry of [...choiceFreeze.inputs, ...choiceFreeze.artifacts])
  if (bind(entry.path).sha256 !== entry.sha256)
    throw new Error(`Frozen choice input/output changed: ${entry.path}`);
const answerPath = language =>
  `${base}/root/9p/editions/${editions[language]}/lessons/${lesson}/answer-keys.json`;
const templatePath = language =>
  `${base}/answer-work/9p/${editions[language]}/lessons/${lesson}/answer-keys.template.json`;
const stage = process.argv[2];
if (stage === 'book-copy') {
  const source = 'ssot-resources/soviet10year-textbooks/artifacts/9p/answers.json';
  const destination = `${base}/root/9p/answers.json`;
  fs.copyFileSync(abs(source), abs(destination), fs.constants.COPYFILE_EXCL);
  if (bind(source).sha256 !== bind(destination).sha256) throw new Error('Book copy differs');
  const canonicalBook = read(source);
  const result = write('bookRaw-evidence.json', {
    schema: 'd138-t9-post-choice-freeze-bookRaw-evidence-v1',
    choice_freeze: bind(`${own}/author-freeze.json`),
    source: bind(source), unchanged_copy: bind(destination),
    access_order: 'ONLY_AFTER_CHOICE_AUTHOR_FREEZE',
    lesson,
    selected_answers: canonicalBook.answers.filter(answer => answer.lesson === lesson),
    note: 'Only this lesson was exposed as answer evidence. The complete canonical book file was copied unchanged for the native tool.'
  });
  console.log(JSON.stringify(result, null, 2));
} else if (stage === 'prepare' || stage === 'finalize') {
  const language = process.argv[3];
  if (!editions[language]) throw new Error('Language required');
  const copied = read(`${own}/bookRaw-evidence.json`);
  if (bind(copied.source.path).sha256 !== copied.source.sha256 ||
      bind(copied.unchanged_copy.path).sha256 !== copied.source.sha256)
    throw new Error('Canonical book evidence changed');
  if (stage === 'finalize') {
    if (read(`${own}/answer-prepare.${language}.receipt.json`).exit_code !== 0)
      throw new Error('Failed prepare blocks finalize');
    const authored = read(answerPath(language));
    if (authored.answers.length !== 6 || authored.answers.some(answer =>
      answer.grading !== 'ungraded' || answer.parts.length !== 0 || !answer.displayAnswer.trim()))
      throw new Error('Author-only ungraded six-answer boundary violated');
    const template = read(templatePath(language));
    for (let index = 0; index < 6; index++) {
      if (authored.answers[index].exercise !== template.answers[index].exercise ||
          authored.answers[index].bookRaw !== template.answers[index].bookRaw)
        throw new Error('BookRaw or native exercise identity changed');
    }
    write(`answer-authored.${language}.snapshot.json`, authored);
  }
  const command = ['python3', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', stage,
    '--root', `${base}/root`, '--work', `${base}/answer-work`, '--book', '9p',
    '--edition', editions[language], '--lesson', lesson];
  const run = spawnSync(command[0], command.slice(1), {
    cwd, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
  });
  const prefix = `answer-${stage}.${language}`;
  fs.writeFileSync(abs(`${own}/${prefix}.stdout.txt`), run.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(abs(`${own}/${prefix}.stderr.txt`), run.stderr ?? '', { flag: 'wx' });
  const result = write(`${prefix}.receipt.json`, {
    schema: 'd138-offline-native-answer-command-receipt-v1', command, cwd,
    choice_freeze: bind(`${own}/author-freeze.json`),
    exit_code: run.status, signal: run.signal, error: run.error?.message ?? null,
    stdout: bind(`${own}/${prefix}.stdout.txt`), stderr: bind(`${own}/${prefix}.stderr.txt`),
    status: run.status === 0 ? 'pass' : 'failed',
    output: run.status === 0
      ? [bind(stage === 'prepare' ? templatePath(language) : answerPath(language)),
        ...(stage === 'finalize' ? [bind(answerPath(language).replace('.json', '.audit.json'))] : [])]
      : [],
    independent_approval: false, interactions: 0, auto_keys: 0,
    note: 'Native finalize is structural/ungraded readiness, not an independent semantic review. Empty parts entail no numeric/expression/exact grading cases and no MathLive browser launch.'
  });
  console.log(JSON.stringify({ receipt: result, stdout: run.stdout, stderr: run.stderr }, null, 2));
  process.exitCode = run.status ?? 1;
} else if (stage === 'answers-freeze') {
  const records = [];
  const figureEvidence = read(`${own}/answer-figure-spec-evidence.json`);
  const figureBindings = [];
  for (const figure of figureEvidence.specs_read) {
    for (const specPath of [figure.zh_path, figure.en_path]) {
      const spec = bind(specPath);
      const svg = bind(specPath.replace('.spec.json', '.svg'));
      if (spec.sha256 !== figure.both_spec_sha256 || svg.sha256 !== figure.both_svg_sha256)
        throw new Error('Native answer figure evidence changed');
      figureBindings.push(spec, svg);
    }
  }
  for (const language of ['zh', 'en']) {
    const receipt = read(`${own}/answer-finalize.${language}.receipt.json`);
    if (receipt.exit_code !== 0) throw new Error('Failed finalize blocks answers freeze');
    const document = read(answerPath(language));
    const auditPath = answerPath(language).replace('.json', '.audit.json');
    const audit = read(auditPath);
    if (document.status !== 'ready' || document.count !== 6 || audit.status !== 'pass' ||
        audit.auto !== 0 || audit.ungraded !== 6)
      throw new Error('Native ready/audit boundary violated');
    fs.chmodSync(abs(answerPath(language)), 0o444);
    fs.chmodSync(abs(auditPath), 0o444);
    records.push({
      language, edition: editions[language],
      answer_keys: bind(answerPath(language)), native_audit: bind(auditPath),
      prepare_receipt: bind(`${own}/answer-prepare.${language}.receipt.json`),
      finalize_receipt: bind(`${own}/answer-finalize.${language}.receipt.json`),
      authored_snapshot: bind(`${own}/answer-authored.${language}.snapshot.json`),
      status: 'ready', auto: 0, ungraded: 6
    });
  }
  const result = write('answers-author-freeze.json', {
    schema: 'd138-t9-bilingual-answers-author-freeze-v1', cwd, lesson,
    choice_freeze: bind(`${own}/author-freeze.json`),
    bookRaw_evidence: bind(`${own}/bookRaw-evidence.json`),
    canonical_book: bind('ssot-resources/soviet10year-textbooks/artifacts/9p/answers.json'),
    unchanged_isolated_book: bind(`${base}/root/9p/answers.json`),
    original_source_solutions: bind(`${own}/source-solutions-complete.json`),
    figure_evidence: bind(`${own}/answer-figure-spec-evidence.json`),
    actual_figure_bindings: figureBindings,
    gate2_author_checks: bind(`${own}/gate2-author-checks.json`),
    answer_tool: bind('.claude/skills/ld-s10y-answer/tools/lesson_answers.py'),
    instruction_bindings: [
      '.claude/skills/ld-s10y-answer/SKILL.md',
      '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md'
    ].map(bind),
    helper: bind(`${own}/answer-tools.mjs`), editions: records,
    all_answers_read_only: true, all_parts_empty: true,
    source_task_count: 6, authored_answers: 12, new_image_opens: 0,
    total_author_image_opens: 4, independent_review: 'pending, parent only',
    publication: 'not authorized and not performed', interactions: 0,
    production_meter_owner: 'parent', production_completion_claimed: false
  });
  const ownedSnapshots = [
    'answers-author-freeze.json', 'bookRaw-evidence.json',
    'answer-figure-spec-evidence.json', 'gate2-author-checks.json',
    'answer-authored.zh.snapshot.json', 'answer-authored.en.snapshot.json', 'answer-tools.mjs',
    ...['zh', 'en'].flatMap(language => ['prepare', 'finalize'].flatMap(phase =>
      ['stdout.txt', 'stderr.txt', 'receipt.json'].map(suffix => `answer-${phase}.${language}.${suffix}`)))
  ];
  for (const name of ownedSnapshots) fs.chmodSync(abs(`${own}/${name}`), 0o444);
  console.log(JSON.stringify(result, null, 2));
} else {
  throw new Error('Unknown stage');
}
