import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { cwd, root, directory, namedInputs, bind, write, preservation } from './evidence.mjs';

const spec = path.join(directory, 'spec.r2.json');
const context = path.join(directory, 'context.r2.json');
const svg = path.join(directory, 'fig-206.r2.svg');
const report = path.join(directory, 'fig-206.r2.render.json');
const png = path.join(directory, 'fig-206.r2.native.png');
const startedAt = new Date().toISOString();
const inputBindings = [...namedInputs, bind(spec, 'revision2-spec'), bind(context, 'revision2-context')];
write(path.join(root, 'change-scope.r2.json'), {
  schema: 'scoped-author-change-record@1', ticket: 'STEMROBIN-188', run: 'SAME188-6',
  role: 'AUTHOR_ONLY_NOT_INDEPENDENT_REVIEW', figure: 'fig-206',
  contentRevisions: { cumulativeInput: 1, addedHere: 1, cumulativeOutput: 2 },
  inputs: inputBindings, preservation: preservation(),
  changedPaths: [
    '/description', '/canvas/height', '/canvas/boundingBox/3',
    '/source/inventory/1', '/source/inventory/2',
    '/objects/9', '/objects/10', '/objects/11', '/objects/12', '/assertions/9',
  ],
  independentReviewOfRevision2: 'NOT_PERFORMED', promotion: false,
  oldFailuresRetained: true, authoritativeLessonProseEdited: false, answerKeysRead: false,
});

const receipts = [];
function call(stage, executable, args, outputs) {
  const receipt = path.join(directory, `${stage}.r2.call.json`);
  if (fs.existsSync(receipt) || outputs.some(file => fs.existsSync(file))) {
    throw new Error('Affected stage already attempted; preserve it and recover only its failed stage');
  }
  const startedAt = new Date().toISOString();
  write(path.join(directory, `${stage}.r2.started.json`), {
    stage, argv: [executable, ...args], cwd, startedAt, inputs: inputBindings,
  });
  const result = spawnSync(executable, args, {
    cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024,
  });
  const stdout = path.join(directory, `${stage}.r2.stdout.txt`);
  const stderr = path.join(directory, `${stage}.r2.stderr.txt`);
  fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' });
  fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' });
  const record = {
    schema: 'scoped-native-call@1', role: 'AUTHOR_ONLY_NOT_INDEPENDENT_REVIEW',
    stage, figure: 'fig-206', contentRevision: 2,
    argv: [executable, ...args], cwd, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    status: result.status === 0 ? 'completed' : 'failed', inputs: inputBindings,
    tool: bind(args[0]), streams: { stdout: bind(stdout), stderr: bind(stderr) },
    outputs: outputs.filter(file => fs.existsSync(file)).map(file => bind(file)),
    rendererEmbeddedValidationInvocations: stage === 'render' ? 1 : 0,
    nativeRasterInvocations: stage === 'render' ? 1 : 0,
    independentApproval: false, activeExecSessions: [],
  };
  write(receipt, record);
  receipts.push(bind(receipt));
  console.log(`${stage} exit=${result.status}: ${(result.stdout || result.stderr || '').trim()}`);
  if (result.status !== 0) {
    write(path.join(directory, `${stage}.r2.failure.json`), {
      receipt: bind(receipt), outputs: record.outputs, dependentStagesStopped: true,
      inputRevisionNotReset: true, retryPerformed: false,
    });
  }
  return result.status === 0;
}

let completed = false;
const validator = path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py');
const renderer = path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs');
if (!call('validate', 'python3', [validator, spec, '--stage', 'draft', '--json'], [])) process.exitCode = 2;
else if (!call('render', process.execPath, [renderer, '--spec', spec, '--svg', svg, '--report', report, '--png', png], [svg, report, png])) process.exitCode = 2;
else completed = true;
write(path.join(root, 'native-wrapper.receipt.json'), {
  schema: 'scoped-author-wrapper-receipt@1', argv: process.argv, cwd,
  startedAt, finishedAt: new Date().toISOString(), exitCode: process.exitCode || 0,
  status: completed ? 'completed' : 'failed', tool: bind(path.join(root, 'run-native.mjs')),
  receipts, standaloneValidatorInvocations: 1,
  rendererInvocations: receipts.length === 2 ? 1 : 0,
  rendererInternalValidatorInvocations: receipts.length === 2 ? 1 : 0,
  nativeRasterInvocations: receipts.length === 2 ? 1 : 0,
  historicalStagesRerun: false, independentApproval: false, activeExecSessions: [],
});
