import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== cwd) throw new Error('Exact authorized cwd required');
const own = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-choice-author';
const d138 = '.tmp/STEMROBIN-181/d1816-d138';
const baselineDir = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d136-t9-source-derivations';
const seedPath = `${d138}/choice-repo/.tmp/d138/seed.json`;
const abs = p => path.resolve(cwd, p);
const read = p => JSON.parse(fs.readFileSync(abs(p), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = p => {
  const bytes = fs.readFileSync(abs(p));
  return { path: abs(p), bytes: bytes.length, sha256: sha(bytes) };
};
const write = (name, data) => {
  const destination = abs(`${own}/${name}`);
  fs.writeFileSync(destination, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
  return bind(destination);
};
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object')
    return `{${Object.keys(value).sort().map(k => `${canonical(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
};
const freezeFiles = names => names.forEach(name => fs.chmodSync(abs(`${own}/${name}`), 0o444));
const inputBindings = () => {
  const input = read(`${own}/input-freeze.json`);
  const expected = [input.seed, input.definitions, ...input.originalPngs,
    ...input.copied.flatMap(entry => [entry.source, entry.mirror])];
  for (const entry of expected) {
    const actual = bind(entry.path);
    if (actual.sha256 !== entry.sha256 || actual.bytes !== entry.bytes)
      throw new Error(`Prepared input changed: ${entry.path}`);
  }
  const baselineFreeze = read(`${baselineDir}/author-freeze.json`);
  for (const entry of baselineFreeze.frozen_report_baseline)
    if (bind(entry.path).sha256 !== entry.sha256) throw new Error(`Baseline changed: ${entry.path}`);
  const ledger = read(`${own}/image-ledger.json`);
  for (const image of ledger.opens) {
    if (bind(image.path).sha256 !== image.sha256) throw new Error(`Opened image changed: ${image.path}`);
    if (image.preview_receipt) {
      const receipt = read(image.preview_receipt);
      if (bind(receipt.nativeSvg.path).sha256 !== image.bound_svg_sha256 ||
          bind(receipt.preview.path).sha256 !== image.sha256)
        throw new Error('Preview binding changed');
      const figure = input.copied.find(entry => entry.source.path.endsWith(`/figures/${image.figure_id}.svg`));
      if (!figure || bind(figure.source.path).sha256 !== image.bound_svg_sha256)
        throw new Error('Installed SVG differs from opened complete preview');
    }
  }
  const definitions = read(`${own}/graph-source-derivation.json`).original_definition_evidence;
  for (const definition of definitions) {
    const raw = read(definition.original_path ?? definition.path);
    const pointer = definition.json_pointer.split('/').slice(1);
    const actual = pointer.reduce((value, key) => value[key], raw);
    if (actual.text !== definition.text) throw new Error('Original definition projection changed');
  }
  const lessonInputs = ['modern-us-neutral', 'modern-us-neutral-en'].flatMap(edition =>
    ['lesson.json', 'exercises.json', 'figures.json'].map(name =>
      `${d138}/root/9p/editions/${edition}/lessons/phy9-c1-s3-t9/${name}`));
  const extras = [
    `${own}/input-freeze.json`, `${own}/source-definition-context.json`,
    `${baselineDir}/author-freeze.json`, ...baselineFreeze.frozen_report_baseline.map(e => e.path),
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d135-t9-figures-author/report.json',
    ...ledger.opens.flatMap(e => e.preview_receipt ? [e.path, e.preview_receipt, read(e.preview_receipt).nativeSvg.path] : [e.path]),
    ...definitions.flatMap(e => [e.path, ...(e.original_path ? [e.original_path] : [])]),
    '.agents/skills/ld-s10y-choice/SKILL.md',
    '.agents/skills/ld-s10y-choice/references/authoring.md',
    '.agents/skills/ld-s10y-choice/references/contract.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md'
  ];
  return [...new Set([...expected.map(e => e.path), ...lessonInputs, ...extras])].map(bind);
};

const stage = process.argv[2];
if (stage === 'source-freeze') {
  const inputs = inputBindings();
  const baseline = read(`${baselineDir}/pre-option-source-solutions.json`);
  const graph = read(`${own}/graph-source-derivation.json`);
  const result = write('source-solutions-complete.json', {
    schema: 'd138-t9-source-solutions-complete-v1',
    stage: 'PRE_OPTION_PRE_BOOK_ANSWER_FROZEN_AUTHOR_BASELINE',
    lesson: 'phy9-c1-s3-t9',
    source_numbers: baseline.tasks.map(task => task.source_number),
    author_only: true,
    independent_approval: false,
    book_answers_consulted: false,
    baseline: bind(`${baselineDir}/pre-option-source-solutions.json`),
    original_baseline_freeze: bind(`${baselineDir}/author-freeze.json`),
    input_bindings: inputs,
    image_ledger: bind(`${own}/image-ledger.json`),
    first_actual_graph_derivation: bind(`${own}/graph-source-derivation.json`),
    tasks: baseline.tasks.map(task => task.source_number === '2'
      ? { ...graph, source_text: task.source_text } : task),
    limitations: 'Numerical/source-model assumptions remain as declared in each source solution. Q4 is mean squared speed, not RMS. Q6 has a conditional work-on-gas interpretation, not universal signed work.',
  });
  freezeFiles(['image-ledger.json', 'graph-source-derivation.json', 'source-solutions-complete.json']);
  console.log(JSON.stringify(result, null, 2));
} else if (stage === 'order-options') {
  const orders = {
    'molecular-motion': ['C', 'D', 'A', 'B'],
    'graph-internal-energy': ['B', 'A', 'D', 'C'],
    'air-water-molecule-count': ['B', 'C', 'D', 'A'],
    'mean-squared-speed-heating': ['B', 'D', 'A', 'C'],
    'vacuum-molecule-count': ['A', 'C', 'D', 'B'],
    'adiabatic-compression-rise': ['D', 'B', 'A', 'C']
  };
  const output = [];
  for (const language of ['zh', 'en']) {
    const draftPath = `${own}/draft.${language}.json`;
    const before = bind(draftPath);
    const draft = read(draftPath);
    for (const question of draft.questions) {
      const order = orders[question.id];
      const options = new Map(question.view.options.map(option => [option.id, option]));
      const rationales = new Map(question.key.rationales.map(row => [row.option_id, row]));
      const rename = new Map(order.map((id, index) => [id, 'ABCD'[index]]));
      question.view.options = order.map(id => ({ ...options.get(id), id: rename.get(id) }));
      question.key.correct = question.key.correct.map(id => rename.get(id)).sort();
      question.key.rationales = order.map(id => ({
        ...rationales.get(id), option_id: rename.get(id),
        derivation: rationales.get(id).derivation.replace(/(table|表述|表)([A-D])/g,
          (_, prefix, originalId) => `${prefix}${rename.get(originalId)}`)
      }));
    }
    fs.writeFileSync(abs(draftPath), `${JSON.stringify(draft, null, 2)}\n`);
    output.push({ language, before, after: bind(draftPath) });
  }
  console.log(JSON.stringify(write('option-order.receipt.json', {
    role: 'MECHANICAL_BILINGUAL_OPTION_REORDER_ONLY', orders, output
  }), null, 2));
} else if (stage === 'check') {
  const language = process.argv[3];
  if (!['zh', 'en'].includes(language)) throw new Error('Language required');
  const command = ['python3', '.agents/skills/ld-s10y-choice/scripts/validate.py',
    '--repo', abs(`${d138}/choice-repo`), '--seed', abs(seedPath),
    '--draft', abs(`${own}/draft.${language}.json`)];
  const run = spawnSync(command[0], command.slice(1), {
    cwd, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
  });
  fs.writeFileSync(abs(`${own}/choice-check.${language}.stdout.txt`), run.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(abs(`${own}/choice-check.${language}.stderr.txt`), run.stderr ?? '', { flag: 'wx' });
  const receipt = write(`choice-check.${language}.receipt.json`, {
    schema: 'd138-offline-native-command-receipt-v1', command, cwd,
    exit_code: run.status, signal: run.signal, error: run.error?.message ?? null,
    stdout: bind(`${own}/choice-check.${language}.stdout.txt`),
    stderr: bind(`${own}/choice-check.${language}.stderr.txt`),
    draft: bind(`${own}/draft.${language}.json`), seed: bind(seedPath),
    structural_status: run.status === 0 ? 'pass' : 'failed',
    semantic_review: 'not performed; parent owns sole independent review'
  });
  console.log(JSON.stringify({ receipt, stdout: run.stdout, stderr: run.stderr }));
  process.exitCode = run.status ?? 1;
} else if (stage === 'choice-freeze') {
  const inputs = inputBindings();
  for (const language of ['zh', 'en'])
    if (read(`${own}/choice-check.${language}.receipt.json`).exit_code !== 0)
      throw new Error('Failed structural checker blocks choice freeze and answers');
  const artifacts = ['draft.zh.json', 'draft.en.json', 'source-solutions-complete.json',
    'graph-source-derivation.json', 'image-ledger.json',
    'choice-check.zh.receipt.json', 'choice-check.en.receipt.json',
    'choice-check.zh.stdout.txt', 'choice-check.zh.stderr.txt',
    'choice-check.en.stdout.txt', 'choice-check.en.stderr.txt', 'option-order.receipt.json', 'author-tools.mjs'];
  const result = write('author-freeze.json', {
    schema: 'd138-t9-choice-author-freeze-v1', date: '2026-11-20',
    stage: 'CHOICE_AUTHOR_FROZEN_BEFORE_BOOK_ANSWER_ACCESS',
    cwd, lesson: 'phy9-c1-s3-t9', seed_sha256: sha(canonical(read(seedPath))),
    status: 'STRUCTURAL_PASS_SEMANTIC_REVIEW_PENDING',
    inputs, artifacts: artifacts.map(name => bind(`${own}/${name}`)),
    source_coverage: ['1', '2', '3', '4', '5', '6'],
    image_opens: 4, new_figures: 0, book_answers_consulted: false,
    independent_approval: false, automatic_keys: 0, interactions: 0,
    promotion_authorized: false, production_meter_owner: 'parent',
    freeze_policy: 'Raw SHA-256 binds actual bytes. Read-only author snapshots are preservation, not semantic approval.'
  });
  freezeFiles([...artifacts, 'author-freeze.json']);
  console.log(JSON.stringify(result, null, 2));
} else {
  throw new Error('Unknown stage');
}
