import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const evidence = path.dirname(fileURLToPath(import.meta.url));
const skill = path.join(root, '.claude/skills/ld-s10y-lesson');
const pages = ['0054', '0055'];
const work = n => path.join(root, `.tmp/ld-s10y-lesson/10c/pages/${n}`);
const durable = n => path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${n}`);
const digest = b => crypto.createHash('sha256').update(b).digest('hex');
const json = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const checkedPage = n => {
  if (!pages.includes(n)) throw new Error('Outside authorized pages');
  return n;
};
function binding(file, copy) {
  let s;
  try { s = fs.lstatSync(file); } catch (error) {
    if (error.code === 'ENOENT') return { path: file, state: 'absent' };
    throw error;
  }
  const out = {
    path: file, state: 'present', mode: s.mode, uid: s.uid, gid: s.gid,
    size: s.size, dev: s.dev, ino: s.ino, nlink: s.nlink,
    atimeMs: s.atimeMs, mtimeMs: s.mtimeMs, ctimeMs: s.ctimeMs,
    birthtimeMs: s.birthtimeMs,
    type: s.isSymbolicLink() ? 'symlink' : s.isDirectory() ? 'directory' : 'file',
  };
  if (s.isSymbolicLink()) {
    out.linkTarget = fs.readlinkSync(file);
    out.realpath = fs.realpathSync(file);
    const bytes = fs.readFileSync(out.realpath);
    out.resolvedSha256 = digest(bytes);
    if (copy) {
      fs.mkdirSync(path.dirname(copy), { recursive: true });
      fs.writeFileSync(copy, bytes, { flag: 'wx' });
      out.resolvedBytecopy = copy;
    }
  } else if (s.isFile()) {
    const bytes = fs.readFileSync(file);
    out.sha256 = digest(bytes);
    if (copy) {
      fs.mkdirSync(path.dirname(copy), { recursive: true });
      fs.writeFileSync(copy, bytes, { flag: 'wx' });
      out.bytecopy = copy;
    }
  } else if (s.isDirectory()) {
    out.children = fs.readdirSync(file).sort().map(name =>
      binding(path.join(file, name), copy ? path.join(copy, name) : undefined));
  }
  return out;
}
const toolFiles = [
  ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py', 'katex_check.js']
    .map(n => path.join(skill, 'tools', n)),
  path.join(skill, 'profiles/soviet-cn.json'),
  path.join(skill, 'node_modules/katex/package.json'),
  path.join(skill, '.venv/bin/python'), process.execPath,
];
function toolBindings(copyRoot) {
  return toolFiles.map((file, i) => binding(file,
    copyRoot ? path.join(copyRoot, `${i}-${path.basename(file)}`) : undefined));
}
function snapshot(name) {
  const dest = path.join(evidence, name);
  fs.mkdirSync(dest, { recursive: false });
  const value = {
    capturedAt: new Date().toISOString(),
    targets: pages.map(n => ({
      page: n,
      durable: binding(durable(n), path.join(dest, 'durable', n)),
      work: binding(work(n), path.join(dest, 'work', n)),
      sourceMd: binding(path.join(durable(n), 'page.md'),
        path.join(dest, 'SOURCE-MD', `${n}.md`)),
    })),
    tools: toolBindings(path.join(dest, 'tools')),
  };
  json(path.join(dest, 'metadata.json'), value);
  return value;
}
function run(name, executable, args, extra = {}) {
  const dest = path.join(evidence, 'commands', name);
  fs.mkdirSync(dest, { recursive: false });
  const start = {
    startedAt: new Date().toISOString(), executable, args, cwd: root,
    shell: false, timeoutMs: 120000, ...extra,
    stdout: path.join(dest, 'stdout.bin'), stderr: path.join(dest, 'stderr.bin'),
  };
  json(path.join(dest, 'start.json'), start);
  json(path.join(dest, 'result-before-call.json'), { status: 'pending', exit: null, signal: null });
  const stdout = fs.openSync(start.stdout, 'wx');
  const stderr = fs.openSync(start.stderr, 'wx');
  const began = process.hrtime.bigint();
  let result;
  try {
    result = spawnSync(executable, args, {
      cwd: root, stdio: ['ignore', stdout, stderr], timeout: start.timeoutMs,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
  } finally {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
  }
  const end = {
    status: result.status === 0 && !result.error ? 'success' : 'failure',
    endedAt: new Date().toISOString(), elapsedMs: Number(process.hrtime.bigint() - began) / 1e6,
    exit: result.status, signal: result.signal, error: result.error ? String(result.error) : null,
    stdout: binding(start.stdout), stderr: binding(start.stderr),
  };
  json(path.join(dest, 'result.json'), end);
  return { start, end };
}
function show(result) {
  console.log(JSON.stringify(result, null, 2));
  console.log(fs.readFileSync(result.start.stdout, 'utf8'));
  console.error(fs.readFileSync(result.start.stderr, 'utf8'));
}
function filesUnder(dir) {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const file = path.join(dir, name);
    return fs.lstatSync(file).isDirectory() ? filesUnder(file) : [file];
  });
}
function observations() {
  const dir = path.join(evidence, 'observations');
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(n => n.endsWith('.json'))
    .map(n => JSON.parse(fs.readFileSync(path.join(dir, n), 'utf8'))) : [];
}
const mode = process.argv[2];
if (fs.existsSync(path.join(evidence, 'full-author-manifest.json'))) {
  throw new Error('Package frozen; no recorder writes allowed');
}
if (mode === 'initial') {
  if (fs.readdirSync(evidence).some(n => n !== 'record.mjs')) {
    throw new Error('Evidence directory not exclusive or already initialized');
  }
  fs.mkdirSync(path.join(evidence, 'commands'));
  const before = snapshot('targetbefore');
  const policyFiles = [
    '.intentfold/readme.md', '.intentfold/project.json',
    '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
    '.intentfold/charter/product.md', '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.intentfold/tickets/STEMROBIN-184/tmp/source-6g-p72-p73-author-evidence-capture.mjs',
  ];
  json(path.join(evidence, 'initial-bindings.json'), {
    recordedAt: new Date().toISOString(), cwd: process.cwd(), root, before,
    recorder: binding(fileURLToPath(import.meta.url), path.join(evidence, 'recorder-initial.mjs')),
    policyFiles: policyFiles.map((f, i) => binding(path.join(root, f),
      path.join(evidence, 'policy-bytecopies', `${i}-${path.basename(f)}`))),
    limits: { pages: [54, 55], imageBatchMax: 8, imageContextMax: 24,
      previousImagesInContext: 0, prepareCallsThisRun: 0,
      finalizeAttemptsPerPageMax: 1, reruns: 0, repairs: 0 },
    prepare: { userSupplied: '54/55 already prepared ONCE0; never repeat',
      independentlyObservedPrepareInvocation: false },
    priorContext: { unit: 'ana10-c6-s3-n86', state: 'OPEN', bodyOnly: true,
      finalLiteral: '$\\arccos 0=\\frac{\\pi}{2}$，因为$\\cos\\frac{\\pi}{2}=0$，',
      notSource54Content: true, priorPixelsRead: false },
    bootstrap: { commandsBeforeRecorderNotCapturedLive: true,
      instructionReadsRetainedAsExactBytecopies: true,
      probes: [
        { command: 'pwd', exit: 0, stdout: root + '\n', stderr: '' },
        { command: 'ls -la .tmp/ld-s10y-lesson/10c/pages/0054 .tmp/ld-s10y-lesson/10c/pages/0055 ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0054 ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0055',
          exit: 1, reason: 'Durable target directories absent; non-pipeline read-only probe' },
        { command: 'ls -ld .intentfold/tickets/STEMROBIN-184/tmp/source-10c-p54-p55-author-evidence',
          exit: 1, reason: 'New exclusive evidence directory absent before apply_patch; non-pipeline probe' },
      ] },
  });
  console.log(path.join(evidence, 'initial-bindings.json'));
} else if (mode === 'observe') {
  const [id, n, imageName] = process.argv.slice(3);
  checkedPage(n);
  if (!['page.png', 'page.grid.png'].includes(imageName) && !imageName.startsWith('crop:')) {
    throw new Error('Not an authorized source image');
  }
  if (observations().length >= 8) throw new Error('Image batch budget exhausted');
  const file = imageName.startsWith('crop:')
    ? path.join(evidence, 'crops', imageName.slice(5)) : path.join(work(n), imageName);
  json(path.join(evidence, 'observations', `${id}.json`), {
    recordedAt: new Date().toISOString(), page: n, image: binding(file),
    plannedTool: 'functions.view_image', detail: 'original',
    countsAsImageLoad: true, ordinal: observations().length + 1,
    conservativeReservation: true,
  });
  console.log(JSON.stringify(binding(file)));
} else if (mode === 'crop') {
  const [id, n, boxText] = process.argv.slice(3);
  checkedPage(n);
  const box = boxText.split(',').map(Number);
  if (box.length !== 4 || box.some(v => !Number.isInteger(v) || v < 0)) {
    throw new Error('Expected nonnegative left,top,right,bottom');
  }
  if (box[2] <= box[0] || box[3] <= box[1] || box[2] > 1695 || box[3] > 2580) {
    throw new Error('Crop outside original image');
  }
  const file = path.join(evidence, 'crops', `${id}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) throw new Error('Crop already exists');
  const source = path.join(work(n), 'page.png');
  const script = 'from PIL import Image; import sys; im=Image.open(sys.argv[1]); im.crop(tuple(map(int,sys.argv[3:]))).save(sys.argv[2])';
  const result = run(`crop-${id}`, path.join(skill, '.venv/bin/python'),
    ['-B', '-c', script, source, file, ...box.map(String)],
    { operation: 'source-only-crop', source: binding(source), boxLTRB: box });
  json(path.join(evidence, 'crops', `${id}.json`), {
    page: n, source: binding(source), boxLTRB: box, boxXYWH: [box[0], box[1], box[2] - box[0], box[3] - box[1]],
    command: result, output: binding(file), imageLoad: false,
  });
  show(result);
  process.exitCode = result.end.status === 'success' ? 0 : 1;
} else if (mode === 'finalize') {
  const n = checkedPage(process.argv[3]);
  if (fs.existsSync(path.join(evidence, 'firstfailure.json'))) {
    throw new Error('First failure retained; all further pipeline operations prohibited');
  }
  if (fs.existsSync(path.join(evidence, 'commands', `finalize-${n}-first`))) {
    throw new Error('First finalize already invoked; never repeat');
  }
  snapshot(`before-finalize-${n}`);
  const result = run(`finalize-${n}-first`, path.join(skill, '.venv/bin/python'),
    ['-B', path.join(skill, 'tools/p2c.py'), 'finalize', '--book', '10c', '--page', String(Number(n))],
    { operation: 'FIRST-finalize', attempt: 1,
      before: path.join(evidence, `before-finalize-${n}/metadata.json`),
      tools: toolBindings() });
  const after = snapshot(`after-finalize-${n}`);
  json(path.join(evidence, `finalize-${n}-complete.json`), { ...result, after });
  if (result.end.status === 'failure') {
    json(path.join(evidence, 'firstfailure.json'), { page: n, ...result,
      stoppedFurtherPipeline: true, after: path.join(evidence, `after-finalize-${n}/metadata.json`) });
  }
  show(result);
  process.exitCode = result.end.status === 'success' ? 0 : 1;
} else if (mode === 'read') {
  const [id, relative] = process.argv.slice(3);
  const file = path.resolve(root, relative);
  const allowed = file.startsWith(evidence + path.sep) ||
    pages.some(n => file.startsWith(work(n) + path.sep) || file.startsWith(durable(n) + path.sep));
  if (!allowed || !['.md', '.json', '.bin', '.mjs'].includes(path.extname(file))) {
    throw new Error('Read outside authorized textual records');
  }
  const result = run(`read-${id}`, '/bin/cat', [file], { operation: 'read-only-evidence' });
  show(result);
  process.exitCode = result.end.status === 'success' ? 0 : 1;
} else if (mode === 'toc') {
  const title = process.argv[3];
  const tocFile = path.join(root, 'ssot-resources/soviet10year-textbooks/toc/10c/zh.json');
  const toc = JSON.parse(fs.readFileSync(tocFile, 'utf8'));
  const matches = [];
  function walk(value, ancestors = []) {
    if (Array.isArray(value)) return value.forEach(v => walk(v, ancestors));
    if (!value || typeof value !== 'object') return;
    const own = Object.fromEntries(Object.entries(value).filter(([, v]) =>
      ['string', 'number'].includes(typeof v)));
    if (Object.values(own).some(v => typeof v === 'string' && v === title)) {
      matches.push({ identity: own, ancestors });
    }
    for (const v of Object.values(value)) {
      if (v && typeof v === 'object') walk(v, own.id ? [...ancestors, own] : ancestors);
    }
  }
  walk(toc);
  const value = { source: binding(tocFile), observedHeadingOnly: title,
    noSiblingOrLaterBoundaryDisclosure: true, matches };
  json(path.join(evidence, 'toc-observed-heading.json'), value);
  console.log(JSON.stringify(value, null, 2));
} else if (mode === 'end') {
  snapshot('targetafter');
  json(path.join(evidence, 'end-bindings.json'), {
    recordedAt: new Date().toISOString(), tools: toolBindings(),
    imageLoads: observations(), firstFailure: binding(path.join(evidence, 'firstfailure.json')),
    finalizeCalls: pages.map(n => ({ page: n,
      record: binding(path.join(evidence, `finalize-${n}-complete.json`)) })),
  });
  console.log(path.join(evidence, 'end-bindings.json'));
} else if (mode === 'seal') {
  if (!fs.existsSync(path.join(evidence, 'targetafter/metadata.json')) ||
      !fs.existsSync(path.join(evidence, 'full-author-report.md'))) {
    throw new Error('Final snapshot and full report required');
  }
  const entries = filesUnder(evidence).map(file => ({
    path: file, relativePath: path.relative(evidence, file),
    size: fs.statSync(file).size, sha256: digest(fs.readFileSync(file)),
  }));
  const author = JSON.parse(fs.readFileSync(path.join(evidence, 'author-inventory.json'), 'utf8'));
  json(path.join(evidence, 'full-author-manifest.json'), {
    schema: 'STEMROBIN-184/source-original-author-package@1',
    frozenAt: new Date().toISOString(), root, evidence, authorizedPages: [54, 55],
    status: fs.existsSync(path.join(evidence, 'firstfailure.json'))
      ? 'FIRST_FINALIZE_FAILURE_STOPPED_NO_RETRY' : 'SOURCE_AUTHORSHIP_ONLY_NO_GLOBAL_PASS',
    report: entries.find(e => e.relativePath === 'full-author-report.md'),
    recorder: entries.find(e => e.relativePath === 'record.mjs'),
    imageBudget: { batchUsed: observations().length, batchMax: 8,
      contextUsed: observations().length, contextMax: 24, priorImages: 0 },
    finalizeAttempts: pages.map(n => ({ page: Number(n),
      attempts: fs.existsSync(path.join(evidence, `finalize-${n}-complete.json`)) ? 1 : 0 })),
    authorInventory: author, entries,
    manifestSelfHash: 'External SHA256 returned after exclusive freeze; self-reference omitted',
    prohibitions: { prepare: 0, retry: 0, repair: 0, assemble: 0, vectorize: 0,
      adapt: 0, render: 0, validate: 0, gitWrites: 0, database: 0, production: 0,
      otherChats: 0, intentfoldUpdates: 0, planOrUsageUpdates: 0, independentReviewReads: 0 },
  });
  for (const name of ['full-author-report.md', 'full-author-manifest.json']) {
    const file = path.join(evidence, name);
    console.log(JSON.stringify({ path: file, sha256: digest(fs.readFileSync(file)) }));
  }
} else {
  throw new Error('Expected initial, observe, crop, finalize, read, toc, end, or seal');
}
