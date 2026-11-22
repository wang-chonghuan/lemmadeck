import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = process.cwd();
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-204206-scoped-repair-author-14');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
const directory = path.join(root, 'fig-204');
const spec = path.join(directory, 'spec.r1.json');
const svg = path.join(directory, 'fig-204.r1.svg');
const report = path.join(directory, 'fig-204.r1.render.json');
const png = path.join(directory, 'fig-204.r1.native.png');
const inputs = [
  spec,
  path.join(directory, 'FIRST.json'),
  path.join(directory, 'source.inventory.json'),
];
function call(stage, executable, args, outputs) {
  const receipt = path.join(directory, `${stage}.r1.call.json`);
  if (fs.existsSync(receipt)) throw new Error('Candidate stage already attempted');
  const startedAt = new Date().toISOString();
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 });
  const stdout = path.join(directory, `${stage}.r1.stdout.txt`);
  const stderr = path.join(directory, `${stage}.r1.stderr.txt`);
  fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' });
  fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' });
  write(receipt, {
    schema: 'scoped-native-call@1', figure: 'fig-204', contentRevision: 1,
    argv: [executable, ...args], cwd, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    status: result.status === 0 ? 'completed' : 'failed',
    inputs: inputs.map(bind), tool: bind(args[0]),
    streams: { stdout: bind(stdout), stderr: bind(stderr) },
    outputs: outputs.filter(file => fs.existsSync(file)).map(bind),
    rendererEmbeddedValidationInvocations: stage === 'render' ? 1 : 0,
    independentApproval: false, activeExecSessions: [],
  });
  console.log(`${stage} exit=${result.status}: ${(result.stdout || result.stderr || '').trim()}`);
  if (result.status !== 0) {
    write(path.join(directory, `${stage}.r1.failure.json`), { receipt: bind(receipt), dependentStagesStopped: true });
  }
  return result.status === 0;
}
const validator = path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py');
const renderer = path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs');
if (!call('validate', 'python3', [validator, spec, '--stage', 'draft', '--json'], [])) process.exitCode = 2;
else if (!call('render', process.execPath, [renderer, '--spec', spec, '--svg', svg, '--report', report, '--png', png], [svg, report, png])) process.exitCode = 2;
