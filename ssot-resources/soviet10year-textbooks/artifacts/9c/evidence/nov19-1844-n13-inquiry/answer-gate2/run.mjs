import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const output = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(output, '../../..');
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
function binding(file) {
  const buffer = fs.readFileSync(file);
  return { path: file, bytes: buffer.length, sha256: hash(buffer) };
}
function write(name, value) {
  const file = path.join(output, name);
  fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value) ? value :
    `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return binding(file);
}
const script = path.join(output, 'compare.mjs');
const started = new Date().toISOString();
const child = spawnSync(process.execPath, [script], { cwd: root, maxBuffer: 1024 * 1024 });
const finished = new Date().toISOString();
const stdout = write('native.stdout.txt', child.stdout ?? Buffer.alloc(0));
const stderr = write('native.stderr.txt', child.stderr ?? Buffer.alloc(0));
const receipt = { command: [process.execPath, script], cwd: root, node: process.version,
  started_at: started, finished_at: finished, actual_exit: child.status, signal: child.signal,
  error: child.error ? String(child.error) : null, execution_count: 1,
  script: binding(script), stdout, stderr };
write('native.receipt.json', receipt);
let result;
try { result = JSON.parse(child.stdout.toString()); }
catch (error) { result = { status: 'BLOCKED', inputs: [], failed_checks: [{ name: 'native-json-output', error: String(error) }] }; }
const stability = result.inputs.map(input => {
  try {
    const current = binding(input.path);
    return { ...current, unchanged: current.bytes === input.bytes && current.sha256 === input.sha256 };
  } catch (error) { return { path: input.path, unchanged: false, error: String(error) }; }
});
const status = child.status === null || child.error || child.signal || stability.some(item => !item.unchanged) ?
  'BLOCKED' : child.status !== 0 && result.status === 'PASS' ? 'BLOCKED' : result.status;
const gateChecks = [
  ['PASS', 'Same exercise115, four ordered source-modern inputs, template prompt, figure-free identity.'],
  ['NA', 'No bookRaw matched; no whole-book omission inferred.'],
  ['PASS', 'Derived; completed approved FIRST full solve reused by reference without rerun.'],
  ['PASS', 'Ungraded full-explanation exception: four labeled displays/reasons, no requested units; parts=[] retained.'],
  ['NA', 'No expected/exact/numeric/expression transaction; MathLive attempts0; editor NOT exercised.'],
  ['PASS', 'All four decimal identities and remainder reasons match approved FIRST; corrected Chinese and integer-only bar.'],
  ['PASS', 'No auto declaration for the full explanatory response.'],
  ['PASS', 'Full explanations ungraded, parts=[]; no fabricated correct/incorrect grading.'],
  ['PASS', 'One lesson-local exercise, one key, all four requests; derived/book provenance not confused.'],
].map(([grade, basis], i) => ({ check: i + 1, parts: { a: grade, b: grade, c: grade, d: grade }, basis,
  applicability: 'manual conclusion for bound inputs; invalidated if overall comparison/stability is not PASS' }));
write('verdict.json', { ...result, status, review: binding(path.join(output, 'REVIEW.md')),
  gate_checks_1_through_9: gateChecks, native_execution: receipt, input_stability: stability,
  reused_source_bindings_not_rehashed: [
    { page: 55, bytes: 5274, sha256: 'dde98491e1c31c0e7cc56af1e09f85f693a25c78c839821d899264b141542e77' },
    { page: 56, bytes: 5709, sha256: '1aa23cce5149a69f3b3699bd0408c53134bbe7e5b3b1a1a73bd634133eddf00f' },
    { page: 57, bytes: 5044, sha256: '5a8e2c4dafa5f1560c7f2ebc4a7f602f5c7f16f978f10ef4a8e4c9bc71be5985' },
  ],
  receipt_candidate_binding_not_read: { path: '.tmp/stemrobin-184-resume/n13-answer-candidate.json',
    bytes: 1801, sha256: '45284ba67ad718c231392ce4f852d2b86593fa8798ed4cdf43fad6a4f886971e' },
  failure_retention: {
    preparatory_failures: [{ command: ['rg', '--files',
      'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-inquiry',
      '.tmp/stemrobin-184-resume/n13-answer-gate2', '.claude/skills/ld-s10y-answer'],
    actual_exit: 2, stderr: 'rg: .tmp/stemrobin-184-resume/n13-answer-gate2: No such file or directory (os error 2)\n',
    stdout_description: 'Filename inventory only; no content verdict inferred.',
    classification: 'new authorized directory absent before creation; not a mathematical defect' }],
    prior_failures_reused_by_reference: [
      { reference: 'FIRST-findings.md / Verification and Freeze Contract', retained: 'Initial rg exit2; pre-math heading-whitespace runner exit1; three deliberate negative controls exit1.' },
      { reference: 'n13-answer-bound.receipt.json / priorAuthorContentRevisions; current answer notes',
        retained: 'One prior author correction. Original correction/candidate files not read; initial erroneous wording/severity not reconstructed.' },
    ],
    new_comparison_failures: result.failed_checks,
    input_stability_failures: stability.filter(item => !item.unchanged),
    no_failures_deleted_or_replayed: true,
  },
  unknowns: ['Physical \u8c61/\u50cf glyph', 'Exact printed repetition counts',
    'Figure pixels and internal long-division chain', 'Figure mathematics/visual approval PENDING',
    'Rendered/editor/runtime behavior not inspected', 'Finalization/publication/DB/backend/ticket closure not certified',
    'Earlier author-correction original error not independently disclosed', 'Token usage', 'Monetary cost'],
  usage: { image_usage: 0, allocation: 'cap0', parent_images: 'permanent24/24',
    browsers: 0, paid_calls: 0, mathlive_attempts: 0, tokens: 'UNKNOWN', cost: 'UNKNOWN' },
  approvals: { answer_gate2: status === 'PASS', mathematical_replay: false, figure: false,
    whole_lesson: false, editor: false, finalization: false, publication: false },
  boundary: 'Only n13-answer-gate2 writes. Completed for parent intake BEFORE any answer finalizer.',
});
const files = fs.readdirSync(output).sort().map(name => binding(path.join(output, name)));
const manifest = write('freeze.json', { status, files, image_usage: 0 });
console.log(JSON.stringify({ status, native_exit: child.status, comparison_runs: 1,
  inputs_unchanged: stability.every(item => item.unchanged), freeze: manifest,
  files: files.length, image_usage: 0, stop: 'completed for parent intake BEFORE answer finalizer' }, null, 2));
process.exitCode = status === 'PASS' ? 0 : 1;
