import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inspected = load('inspection.json');
const notes = load('review-notes.json');
const command = load('commands/inspect/command.json');
if (command.status !== 0 || inspected.mechanical_comparison_failures.length) {
  throw new Error('Cannot freeze a clean text review over failed captured input comparison');
}
if (notes.per_prose.length !== inspected.comparisons.length
  || notes.per_prose.some((entry, index) => entry.index !== inspected.comparisons[index].index)) {
  throw new Error('Each inspected prose block must have its own independent judgment');
}
for (const entry of inspected.inputs.filter(entry => entry.frozen_path)) {
  const bytes = fs.readFileSync(entry.frozen_path);
  if (bytes.length !== entry.bytes || sha(bytes) !== entry.sha256) {
    throw new Error(`Snapshot drift: ${entry.frozen_path}`);
  }
}
const review = {
  ...notes,
  source_root: '/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c114-heading-fixed/10c',
  modern_author_root: '/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c114/author',
  owned_output_root: root,
  inputs: inspected.inputs,
  per_prose: inspected.comparisons.map((entry, index) => ({
    ...entry, independent_text_judgment: notes.per_prose[index],
  })),
  immutable_lesson_fields: inspected.identity,
  exercise_identity: inspected.exerciseIdentity,
  source_exercises: inspected.sourceExercises,
  modern_exercises: inspected.modernExercises,
  modern_figures: inspected.modernFigures,
  boundaries: inspected.boundaries.map((entry, index) => ({
    ...entry, independent_meaning_judgment: notes.boundary_judgments[index],
  })),
  registered_erratum_binding: inspected.erratum,
  scope_unknowns_preserved: inspected.unknowns_preserved,
  verification_scope: 'Snapshot byte-integrity freeze only; no second text, source, math, flow, structural, finalizer or acceptance pass.',
};
function write(name, contents) {
  const bytes = Buffer.from(contents);
  const absolute = path.join(root, name);
  fs.writeFileSync(absolute, bytes, { flag: 'wx' });
  return { path: absolute, bytes: bytes.length, sha256: sha(bytes) };
}
const reviewReceipt = write('review.json', `${JSON.stringify(review, null, 2)}\n`);
const markdown = [
  '# Independent Modern Text Review',
  '',
  `Status: ${notes.status}`,
  `Lesson: ${notes.lesson_id}; reviewer: ${notes.reviewer}; date: ${notes.review_date}`,
  '',
  '## Scope',
  '',
  notes.method,
  '',
  notes.global_judgment,
  '',
  notes.identity_judgment,
  '',
  'New text failures: none. Exact repairs: none. Author templates and canonical files: unchanged.',
  '',
  '## Section Breaks',
  '',
  ...review.boundaries.flatMap(entry => [
    `### Boundary ${entry.index}`,
    '',
    entry.independent_meaning_judgment.meaning,
    entry.independent_meaning_judgment.evidence,
    '',
    '```json',
    JSON.stringify(entry.boundary, null, 2),
    '```',
    '',
  ]),
  '## Registered Erratum',
  '',
  notes.erratum_judgment,
  '',
  `Original: \`${inspected.erratum.original}\``,
  `Modern: \`${inspected.erratum.corrected}\``,
  '',
  '## Full Per-Prose Review',
  '',
  ...review.per_prose.flatMap(entry => [
    `### prose[${entry.index}]`,
    '',
    `Source refs: ${entry.source_refs.join(', ')}; printed page ${entry.source.printed_page}.`,
    `Source UTF-8: ${entry.source_text_utf8.bytes} bytes; SHA-256 ${entry.source_text_utf8.sha256}`,
    `Modern UTF-8: ${entry.modern_text_utf8.bytes} bytes; SHA-256 ${entry.modern_text_utf8.sha256}`,
    '',
    'Source:',
    '',
    entry.source.text,
    '',
    'Modern:',
    '',
    entry.modern.text,
    '',
    `Judgment: ${entry.independent_text_judgment.judgment}`,
    '',
    entry.independent_text_judgment.meaning,
    '',
    entry.independent_text_judgment.clarity_format,
    '',
  ]),
  '## Preserved Unknowns',
  '',
  notes.inherited_not_new_failures,
  '',
  '## Evidence And Stop',
  '',
  'Full byte snapshots, per-prose fields and exact math-token comparisons are in review.json and inputs/.',
  'Actual evidence program argv, cwd, exit status, program hash and raw stdout/stderr are in commands/.',
  'The original first-flow command and raw streams are frozen inputs, not commands run by this reviewer.',
  'The PDF was read as bytes for SHA-256 only; no pixels were decoded, rendered, cropped or shown.',
  'Manifest hashes cover all output files other than the self-referential manifest itself.',
  '',
  'Model image ledger: 0 added; human-supplied lifetime 0/24 unchanged.',
  '',
  notes.stop,
  '',
].join('\n');
const markdownReceipt = write('review.md', markdown);
const ledgerReceipt = write('ledger.json', `${JSON.stringify(notes.ledger, null, 2)}\n`);
console.log(JSON.stringify({
  status: notes.status, findings: notes.findings, exact_repairs: notes.exact_repairs,
  review: reviewReceipt, readable_review: markdownReceipt, ledger: ledgerReceipt,
  model_images: '0/24', stop: notes.stop,
}, null, 2));
