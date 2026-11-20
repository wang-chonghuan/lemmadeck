import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong checkout');
const [number, stage, draft = 'FIRST'] = process.argv.slice(2);
if (!['89', '90'].includes(number) || !['validate', 'mapping', 'render', 'snapshot'].includes(stage)) throw new Error('Unauthorized stage');
if (!['FIRST', 'REPAIR1'].includes(draft) || (draft === 'REPAIR1' && stage === 'mapping')) throw new Error('No passed geometry replay');
const id = `fig-g10-${number}`, stem = `${id}.${draft}`;
const prefix = path.relative(repo, root);
const receiptFile = path.join(root, `${stem}.${stage}.command.json`);
if (fs.existsSync(receiptFile)) throw new Error('Stage already executed; preserve passed/failing stage');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if (stage === 'render') {
  for (const prerequisite of ['validate', 'mapping']) {
    const prerequisiteStem = prerequisite === 'mapping' ? `${id}.FIRST` : stem;
    const receipt = JSON.parse(fs.readFileSync(path.join(root, `${prerequisiteStem}.${prerequisite}.command.json`)));
    if (receipt.exitCode !== 0) throw new Error(`Stop dependent stage: ${prerequisite}`);
  }
  if (draft === 'REPAIR1') {
    const repair = JSON.parse(fs.readFileSync(path.join(root, `${stem}.repair-receipt.json`)));
    if (!repair.geometryUnchangedByExecutableComparison || repair.contentRepairCounter !== 1) throw new Error('Repair gate');
  }
}
if (stage === 'snapshot') {
  const render = JSON.parse(fs.readFileSync(path.join(root, `${stem}.render.json`)));
  if (render.status !== 'pass') throw new Error('No normal dependent snapshot after native content failure');
}
const commands = {
  validate: ['python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${prefix}/${stem}.spec.json`, '--stage', 'draft', '--json']],
  mapping: ['node', [`${prefix}/check-mapping.mjs`, number]],
  render: ['node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', `${prefix}/${stem}.spec.json`, '--svg', `${prefix}/${stem}.svg`, '--report', `${prefix}/${stem}.render.json`]],
  snapshot: ['node', [`${prefix}/snapshot.mjs`, number, draft]]
};
const [executable, args] = commands[stage];
const inputSha256 = sha(path.join(root, `${stem}.spec.json`));
const startedAt = new Date().toISOString();
const result = spawnSync(executable, args, {cwd: repo, encoding: 'utf8', env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'}, maxBuffer: 16 * 1024 * 1024});
const stdoutFile = path.join(root, `${stem}.${stage}.stdout.txt`);
const stderrFile = path.join(root, `${stem}.${stage}.stderr.txt`);
fs.writeFileSync(stdoutFile, result.stdout || '', {flag: 'wx'});
fs.writeFileSync(stderrFile, result.stderr || '', {flag: 'wx'});
const receipt = {
  schema: 'author-native-stage-command@1', id, draft, stage,
  cwd: repo, command: [executable, ...args], startedAt, endedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.stack || null,
  spec: {path: `${prefix}/${stem}.spec.json`, sha256: inputSha256, bytes: fs.statSync(path.join(root, `${stem}.spec.json`)).size},
  stdout: {path: path.relative(repo, stdoutFile), sha256: sha(stdoutFile), bytes: fs.statSync(stdoutFile).size},
  stderr: {path: path.relative(repo, stderrFile), sha256: sha(stderrFile), bytes: fs.statSync(stderrFile).size},
  externalNativeInvocationCount: ['validate', 'render'].includes(stage) ? 1 : 0,
  rendererInternalValidation: stage === 'render' ? 'Native renderer performs its built-in draft validation; not a separate replay command.' : null,
  semanticApproval: false, contentRepairCounter: draft === 'FIRST' ? 0 : 1, paidCalls: 0, modelCalls: 0
};
fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
for (const file of [receiptFile, stdoutFile, stderrFile]) fs.chmodSync(file, 0o444);
console.log(result.stdout || '');
if (result.stderr) console.error(result.stderr);
console.log(JSON.stringify({id, stage, exitCode: result.status, receipt: path.relative(repo, receiptFile), sha256: sha(receiptFile)}));
process.exitCode = result.status ?? 1;
