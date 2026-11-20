import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scope = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(scope);
const root = path.resolve(tmp, '../../../..');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const manifest = read(path.join(tmp, 'n66-figure100101-review-inputs-01/manifest.json'));
const binding = read(path.join(scope, 'input-bindings.before.json'));
const assessment = read(path.join(scope, 'visual-assessment.json'));
const checks = read(path.join(scope, 'candidate-checks.json'));
if (assessment.candidateReviewStatus !== 'pass' || checks.status !== 'pass') {
  throw new Error('PASS not warranted; no native review invocation permitted');
}
const observed = [
  ...manifest.figures.map(f => ({ figure: f.id, kind: 'original', image: f.original })),
  ...manifest.screenshots.map(s => ({
    figure: s.figure, kind: 'screenshot', position: s.position, viewport: s.viewport,
    image: s.screenshot, scroll: s.scroll, geometry: s.geometry,
  })),
];
if (observed.length !== 8) throw new Error('Expected exactly two originals and six screenshots');
const ledger = {
  schema: 'same188-6/actual-image-ledger@1',
  actualCount: 8, plannedCount: 8, originals: 2, screenshots: 6,
  reopens: 0, crops: 0, diagnosticExtraImages: 0, maxBatch: 8, maxContext: 24,
  currentContextImageLoads: 8, parentActualImageLifetimeBefore: '15/24',
  parentImageLoads0: true, parentImageLoads: 0, noImagePayloadsToParent: true,
  images: observed.map((item, index) => {
    const prior = binding.inputs.find(r => r.path === item.image.path);
    if (!prior || hash(prior.path) !== prior.sha256) throw new Error('Stale image binding');
    const observation = assessment.assessments.find(a => a.figure === item.figure);
    return {
      sequence: index+1, tool: 'functions.view_image', opens: 1,
      ...item, sha256: prior.sha256, bytes: prior.bytes,
      note: item.kind === 'original'
        ? 'Observed actual source before manifest/candidates; independent FIRST subsequently chmod0444 and hash-sealed.'
        : item.position === 'full' ? observation.readability : observation.mobile,
    };
  }),
};
const ledgerPath = path.join(scope, 'image-ledger.json');
fs.writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, { flag: 'wx' });
for (const figure of manifest.figures) {
  const output = path.join(scope, `${figure.id}.review.json`);
  const receiptPath = path.join(scope, `${figure.id}.record-review.receipt.json`);
  if (fs.existsSync(output) || fs.existsSync(receiptPath)) throw new Error('Refusing a second native review');
  const seal = read(path.join(scope, `${figure.id}.FIRST.receipt.json`));
  const notes = [
    'Independent bounded offline mathematical/visual/cultural PASS for current candidate only.',
    `Current output ${path.basename(figure.svg.path)} SHA256 ${figure.svg.sha256}.`,
    `Original actual pixels inventoried before all candidate/manifest reads; FIRST ${seal.first.path} SHA256 ${seal.first.sha256} mode0444.`,
    `Two originals and exactly six bound screenshots inspected, no reopening. Image ledger ${ledgerPath} SHA256 ${hash(ledgerPath)}.`,
    `Independent SVG/geometry checks ${path.join(scope, 'candidate-checks.json')} SHA256 ${hash(path.join(scope, 'candidate-checks.json'))}.`,
    `Visual assessment ${path.join(scope, 'visual-assessment.json')} SHA256 ${hash(path.join(scope, 'visual-assessment.json'))}.`,
    'Labels >=22px at640; desktop1440 and mobile390 start/end; 282+358=640 endpoint reachable in supplied headless evidence.',
    'Original O/zero and exact source vector/font typography HOLDs remain. Strict FIRST production procedure NOT approved.',
    'Author figure100 renderer failure and one substantive repair remain in history; no producer changes or counters reset.',
    'Scratch-path evidence is not durable promotion approval. No real headed product, N66 text/whole lesson, database, publication, merge/deploy/closure approval.',
    'Reviewer checker attempt01 failure retained; one checker-only infrastructure repair for shortened arrow shafts, no extra image opens.',
    'parentImageLoads0=true; no image payloads returned to parent.',
  ].join(' ');
  const args = [
    path.join(root, '.agents/skills/ld-s10y-image/scripts/record_review.py'),
    '--spec', figure.spec.path, '--render', figure.render.path,
    '--output', output, '--status', 'pass', '--notes', notes,
  ];
  const startedAt = new Date().toISOString();
  const result = spawnSync('python3', args, {
    cwd: root, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, encoding: 'utf8',
  });
  const receipt = {
    schema: 'same188-6/native-review-command-receipt@1', figure: figure.id,
    invocationCount: 1, cwd: root, command: ['python3', ...args],
    nativeScript: { path: args[0], sha256: hash(args[0]), bytes: fs.statSync(args[0]).size },
    startedAt, completedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr,
    status: result.status === 0 ? 'pass' : 'fail',
    output: fs.existsSync(output) ? {
      path: output, sha256: hash(output), bytes: fs.statSync(output).size,
      mode: (fs.statSync(output).mode & 0o777).toString(8).padStart(4, '0'),
    } : null,
    noProducerChanges: true, pythonBytecodeWritesDisabled: true,
  };
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout || result.stderr);
  if (result.status !== 0) throw new Error(`Native review failure retained for ${figure.id}`);
}
