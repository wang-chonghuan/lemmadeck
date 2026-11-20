import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d217-10p-source74-76-author');
const root = path.join(repo, '.tmp/STEMROBIN-181/d1816-d217/root');
const work = path.join(repo, '.tmp/STEMROBIN-181/d1816-d217/source-work');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const p2c = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const launcher = path.join(author, 'native-launcher.py');
const freezePath = path.join(author, 'input-freeze.json');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const bind = file => {
  const data = fs.readFileSync(file);
  return { path: file, bytes: data.length, sha256: sha(data) };
};
const write = (file, data) => {
  if (fs.existsSync(file)) throw new Error(`Refusing evidence overwrite: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};
const copy = (file, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
  return bind(destination);
};
if (process.cwd() !== repo) throw new Error('Every command must use exact D217 cwd');
if (bind(freezePath).sha256 !== '642d0248b46bca396acd729b6604d53cfc363c1fdb2d3844a9c0219dfc9204c1') {
  throw new Error('Input freeze SHA256 mismatch');
}
const input = JSON.parse(fs.readFileSync(freezePath, 'utf8'));
const observations = JSON.parse(fs.readFileSync(path.join(author, 'source-observations.json'), 'utf8'));
const provided = [];
const collect = object => {
  if (!object || typeof object !== 'object') return;
  if (object.path && object.sha256 && Number.isInteger(object.bytes)) {
    const actual = bind(object.path);
    if (actual.sha256 !== object.sha256 || actual.bytes !== object.bytes) {
      throw new Error(`Frozen provided input mismatch: ${object.path}`);
    }
    provided.push(actual);
    return;
  }
  for (const value of Object.values(object)) collect(value);
};
collect(input);
provided.push(bind(freezePath), bind(path.join(author, 'dispatch-record.json')));
for (const page of input.pages) {
  const directory = path.dirname(page.source.path);
  for (const name of fs.readdirSync(directory)) {
    const file = path.join(directory, name);
    if (fs.statSync(file).isFile() && !provided.some(item => item.path === file)) provided.push(bind(file));
  }
  if (fs.existsSync(path.join(directory, 'figures'))) {
    throw new Error('Only genuinely new first-native figure outputs are authorized');
  }
}
const contracts = [
  'AGENTS.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/vectorize.py',
  '.claude/skills/ld-s10y-lesson/tools/blocks.py',
  '.claude/skills/ld-s10y-lesson/tools/normalize.py',
  'ssot-resources/soviet10year-textbooks/sources/manifest.json',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d196-10p-source65-67-review/report.json',
].map(file => bind(path.join(repo, file)));
write(path.join(author, 'input-verification-before.json'), {
  cwd: repo, provided, contracts, inputFreezeMatches: true,
  preparationReplay: false, profileEdited: false,
});
const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: author };
const prefinalize = [];
for (const page of input.pages) {
  const number = String(page.page).padStart(4, '0');
  const directory = path.join(root, '10p/pages', number);
  const md = path.join(directory, 'page.md');
  const savedMd = copy(md, path.join(author, 'frozen/prefinalize', number, 'page.md'));
  const command = [
    '-c',
    'import sys,json;sys.path.insert(0,sys.argv[1]);import blocks as B;from pathlib import Path;m,b=B.load(Path(sys.argv[2]));print(json.dumps({"meta":m,"blocks":b,"author_printed_lines":B.printed_lines(b)},ensure_ascii=False,indent=2))',
    path.dirname(p2c), md,
  ];
  const startedAt = new Date().toISOString();
  const result = spawnSync(python, command, { cwd: repo, env, encoding: 'utf8', maxBuffer: 8e6 });
  const receipts = path.join(author, 'native', `parse-${number}`);
  fs.mkdirSync(receipts, { recursive: true });
  fs.writeFileSync(path.join(receipts, 'stdout.txt'), result.stdout || '');
  fs.writeFileSync(path.join(receipts, 'stderr.txt'), result.stderr || '');
  write(path.join(receipts, 'receipt.json'), {
    command: [python, ...command], cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, error: result.error?.message || null, stage: 'AUTHOR_STRUCTURE_ONLY',
    input: savedMd,
  });
  if (result.status !== 0 || result.error) throw new Error(`Author parser failed for ${number}`);
  const parsed = JSON.parse(result.stdout);
  if (parsed.author_printed_lines !== observations.actualPrintedTextRows[page.page]) {
    throw new Error(`Visual author row transcription mismatch for ${number}`);
  }
  const jsonFile = path.join(directory, 'page.json');
  fs.writeFileSync(jsonFile, `${JSON.stringify(parsed, null, 2)}\n`);
  prefinalize.push({
    page: page.page,
    draftMd: savedMd,
    draftJson: copy(jsonFile, path.join(author, 'frozen/prefinalize', number, 'page.json')),
    actualAuthorPrintedRows: parsed.author_printed_lines,
  });
}
write(path.join(author, 'prefinalize-freeze.json'), {
  schema: 'd217/prefinalize-freeze@1',
  status: 'AUTHOR_ONLY_IMMUTABLE_HISTORICAL_DRAFTS',
  historicalHashesBindOnlyFrozenSnapshotPaths: true,
  pages: prefinalize,
});
const stages = [];
let firstFailure = null;
for (const page of input.pages) {
  for (const stage of ['finalize', 'vectorize']) {
    const label = `${stage}-${String(page.page).padStart(4, '0')}-first`;
    if (firstFailure) {
      stages.push({ page: page.page, stage, attempted: false, reason: 'STOP_AFTER_FIRST_NATIVE_FAILURE' });
      continue;
    }
    const directory = path.join(author, 'native', label);
    if (fs.existsSync(directory)) throw new Error(`Refusing native stage replay: ${label}`);
    fs.mkdirSync(directory, { recursive: true });
    const args = [launcher, p2c, stage, '--book', '10p', '--page', String(page.page),
      '--root', root, '--work', work];
    const startedAt = new Date().toISOString();
    const result = spawnSync(python, args, {
      cwd: repo, env: { ...env, D217_RECEIPT_DIR: directory }, encoding: 'utf8', maxBuffer: 8e6,
    });
    fs.writeFileSync(path.join(directory, 'stdout.txt'), result.stdout || '');
    fs.writeFileSync(path.join(directory, 'stderr.txt'), result.stderr || '');
    const receipt = {
      page: page.page, stage, attempted: true, attempt: 1, command: [python, ...args],
      cwd: repo, startedAt, finishedAt: new Date().toISOString(),
      exitCode: result.status, error: result.error?.message || null,
      nativeTool: bind(p2c), executionWrapper: bind(launcher),
      wrapperScope: 'CWD_ONLY_AND_RETAIN_SUBPROCESS_EVIDENCE_AND_NATIVE_TEMP_OUTPUTS',
    };
    if (stage === 'finalize') receipt.historicalInput = prefinalize.find(item => item.page === page.page);
    const snapshotDirectory = path.join(directory, 'outputs');
    const outputs = [];
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const file = path.join(root, '10p/pages', String(page.page).padStart(4, '0'), name);
      if (fs.existsSync(file)) outputs.push({ current: bind(file), frozen: copy(file, path.join(snapshotDirectory, name)) });
    }
    const figureDirectory = path.join(work, '10p/pages', String(page.page).padStart(4, '0'), 'figures');
    if (fs.existsSync(figureDirectory)) {
      for (const name of fs.readdirSync(figureDirectory)) {
        const file = path.join(figureDirectory, name);
        if (fs.statSync(file).isFile()) outputs.push({ current: bind(file), frozen: copy(file, path.join(snapshotDirectory, 'figures', name)) });
      }
    }
    receipt.outputsAtStageCompletion = outputs;
    const receiptPath = path.join(directory, 'receipt.json');
    write(receiptPath, receipt);
    stages.push({ page: page.page, stage, attempted: true, attempt: 1,
      exitCode: result.status, receipt: bind(receiptPath) });
    if (result.status !== 0 || result.error) firstFailure = stages.at(-1);
  }
}
const after = provided.map(expected => {
  const actual = bind(expected.path);
  return { ...actual, unchanged: actual.sha256 === expected.sha256 && actual.bytes === expected.bytes };
});
const contractAfter = contracts.map(expected => {
  const actual = bind(expected.path);
  return { ...actual, unchanged: actual.sha256 === expected.sha256 && actual.bytes === expected.bytes };
});
write(path.join(author, 'input-verification-after.json'), {
  provided: after, contracts: contractAfter,
  allProvidedInputsUnchanged: after.every(item => item.unchanged),
  sharedContractsUnchanged: contractAfter.every(item => item.unchanged),
});
write(path.join(author, 'native-summary.json'), {
  batch: 'D217', sourceApproval: false, canonicalConsumedPageCount: 0, courseApproval: 0,
  fullTextPagesAuthored: 3, stages, firstFailure, laterDependentStagesStopped: !!firstFailure,
  finalizeAttempts: stages.filter(item => item.stage === 'finalize' && item.attempted).length,
  vectorizeAttempts: stages.filter(item => item.stage === 'vectorize' && item.attempted).length,
  preparationReplays: 0, nativeStageReplays: 0, figureContentRepairs: 0,
  actualImageOpensSoFar: 6, parentImageOpens: 0, paidCalls: 0,
});
console.log(JSON.stringify({ stages, firstFailure, allProvidedInputsUnchanged: after.every(item => item.unchanged) }, null, 2));
