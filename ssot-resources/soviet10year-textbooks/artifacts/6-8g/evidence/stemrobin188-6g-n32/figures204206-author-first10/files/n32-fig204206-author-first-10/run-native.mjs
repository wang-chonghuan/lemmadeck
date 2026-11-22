import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = process.cwd();
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const revision = process.argv.includes('--revision=1') ? 1 : 0;
const figures = process.argv.slice(2).filter(arg => arg !== '--revision=1');
if (!figures.length || figures.some(id => !['fig-204', 'fig-205', 'fig-206'].includes(id))) throw new Error('Exact figure ids required');
function call(id, stage, executable, args, outputs) {
  const directory = path.join(root, id);
  const receipt = path.join(directory, `${stage}.call.json`);
  if (fs.existsSync(receipt)) throw new Error(`Cannot repeat completed call: ${receipt}`);
  const startedAt = new Date().toISOString();
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 120000 });
  const stdout = path.join(directory, `${stage}.stdout.txt`);
  const stderr = path.join(directory, `${stage}.stderr.txt`);
  fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' });
  fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' });
  const evidence = {
    schema: 'native-figure-call@1', stage, figure: id,
    argv: [executable, ...args], cwd, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    status: result.status === 0 ? 'completed' : 'failed',
    inputs: [bind(path.join(directory, 'FIRST.json')), bind(path.join(directory, revision ? 'spec.r1.json' : 'spec.json'))],
    streams: { stdout: bind(stdout), stderr: bind(stderr) },
    outputs: outputs.filter(file => fs.existsSync(file)).map(bind),
    contentRevision: revision, technicalRecoveries: 0, independentReview: false,
  };
  write(receipt, evidence);
  if (result.status !== 0) write(path.join(directory, revision ? 'failure.r1.json' : 'firstfailure.json'), { kind: 'native-execution-or-content-failure', call: bind(receipt), evidence });
  console.log(`${id} ${stage} exit=${result.status} ${result.stdout?.trim() || result.stderr?.slice(-180)}`);
  return result.status === 0;
}
for (const id of figures) {
  const directory = path.join(root, id);
  const suffix = revision ? '.r1' : '';
  const spec = path.join(directory, `spec${suffix}.json`);
  const validator = path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py');
  if (!call(id, `validate${suffix}`, 'python3', [validator, spec, '--stage', 'draft'], [])) continue;
  const svg = path.join(directory, `${id}${suffix}.svg`);
  const report = path.join(directory, `${id}${suffix}.render.json`);
  const png = path.join(directory, `${id}${suffix}.native.png`);
  const renderer = path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs');
  call(id, `render${suffix}`, 'node', [renderer, '--spec', spec, '--svg', svg, '--report', report, '--png', png], [svg, report, png]);
}
