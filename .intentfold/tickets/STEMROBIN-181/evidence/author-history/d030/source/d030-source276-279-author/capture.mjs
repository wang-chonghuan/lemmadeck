import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const out = path.dirname(import.meta.filename);
const pages = [276, 277, 278, 279];
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const tools = '.claude/skills/ld-s10y-lesson/tools';
const helper = '.intentfold/tickets/STEMROBIN-181/tmp/d025-source240-count.py';
const incoming = '.intentfold/tickets/STEMROBIN-181/tmp/d029-source272-275-author/0275.page.md';
const source = 'ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf';
const relative = file => path.relative(root, path.resolve(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: relative(file), sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const write = (file, bytes) => {
  assert(path.resolve(file).startsWith(`${out}${path.sep}`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: 'wx' });
};
const json = (file, value) => write(file, `${JSON.stringify(value, null, 2)}\n`);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const snapshot = (file, name) => {
  const target = path.join(out, 'snapshots', name);
  write(target, fs.readFileSync(file));
  fs.chmodSync(target, 0o444);
  return { ...bind(file), snapshot: bind(target), readOnlySnapshot: true };
};
const check = inputs => {
  for (const input of inputs) assert.equal(bind(input.path).sha256, input.sha256, input.path);
};
const run = (command, stdin) => spawnSync(command[0], command.slice(1), {
  cwd: root, input: stdin, timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
const rawOutputs = (prefix, result) => {
  write(`${prefix}.stdout.txt`, result.stdout ?? Buffer.alloc(0));
  write(`${prefix}.stderr.txt`, result.stderr ?? Buffer.alloc(0));
  return {
    stdout: bind(`${prefix}.stdout.txt`), stderr: bind(`${prefix}.stderr.txt`),
    exitCode: result.status, signal: result.signal ?? null,
    error: result.error?.message ?? null, processesFinished: true,
  };
};
const bindingFile = path.join(out, 'input-bindings.json');
const [mode, number] = process.argv.slice(2);

if (mode === 'prepare') {
  const page = Number(number);
  assert(pages.includes(page));
  if (!fs.existsSync(bindingFile)) {
    assert.equal(page, pages[0]);
    const tracked = [
      source, 'ssot-resources/soviet10year-textbooks/sources/manifest.json',
      '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
      ...['p2c.py', 'layout.py', 'blocks.py', 'normalize.py', 'mathcheck.py'].map(name => `${tools}/${name}`),
      '.claude/skills/ld-s10y-lesson/SKILL.md', '.agents/skills/ld-s10y-image/SKILL.md',
    ];
    json(bindingFile, {
      ticket: 'STEMROBIN-181', cwd: root, pages, inputs: tracked.map(bind),
      savedNativeHelper: bind(helper), capture: bind(import.meta.filename),
      incomingTextOnly: snapshot(incoming, 'incoming/0275.page.md'),
      liveTicket: { id: '7ebae0e0-c024-481d-8360-5b3d3bfdda79', sequence: 181, stateGroup: 'started', readOnly: true },
      sourcePdfBytesDuplicated: false, historicalSkillBundleDuplicated: false,
      gitCommands: 0, allowedWriteRoots: [relative(out), ...pages.map(p =>
        `.tmp/ld-s10y-lesson/9p/pages/${String(p).padStart(4, '0')}`)],
    });
  }
  const bindings = read(bindingFile);
  check([...bindings.inputs, bindings.savedNativeHelper, bindings.capture]);
  const stem = String(page).padStart(4, '0');
  const work = `.tmp/ld-s10y-lesson/9p/pages/${stem}`;
  assert(!fs.existsSync(work), 'Do not replay or overwrite native preparation');
  const prefix = path.join(out, `prepare-${page}`);
  const command = [python, '-B', `${tools}/p2c.py`, 'prepare', '--book', '9p', '--page', String(page)];
  json(`${prefix}.started.json`, { startedAt: new Date().toISOString(), cwd: root, command, inputBindings: bind(bindingFile), nativePrepareInvocations: 1 });
  const result = run(command);
  const outputs = ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']
    .filter(name => fs.existsSync(`${work}/${name}`))
    .map(name => snapshot(`${work}/${name}`, `pages/${stem}/${name}`));
  json(`${prefix}.command.json`, {
    page, cwd: root, command, started: bind(`${prefix}.started.json`),
    ...rawOutputs(prefix, result), outputs, nativePrepareInvocations: 1,
    durableWrites: 0, printedOutputPathIsAdvisoryOnly: true,
  });
  check([...bindings.inputs, bindings.savedNativeHelper, bindings.capture]);
  console.log(result.stdout?.toString('utf8') ?? '');
  assert.equal(result.status, 0);
  assert.equal(outputs.length, 4);
} else if (mode === 'account') {
  const template = read(path.join(out, 'image-opens.template.json'));
  assert(template.entries.length <= 8);
  const entries = template.entries.map(entry => ({
    ...entry, ...bind(entry.path),
    ...(entry.cropOf ? { sourceSha256: bind(entry.cropOf).sha256 } : {}),
  }));
  assert.equal(entries.filter(entry => !entry.cropOf).length, 4);
  json(path.join(out, 'image-opens.json'), {
    batch: 'd030-source276-279-author', freshContext: true,
    maximumPerBatch: 8, maximumInContext: 24,
    sourceOpens: 4, cropOpens: entries.filter(entry => entry.cropOf).length,
    reopens: 0, priorPageImageOpens: 0, otherImageOpens: 0, entries,
  });
  console.log(`Recorded ${entries.length} context image loads.`);
} else if (mode === 'count') {
  const bindings = read(bindingFile);
  check([...bindings.inputs, bindings.savedNativeHelper, bindings.capture]);
  const payload = { pages: pages.map(page => ({
    page, candidate: relative(path.join(out, `${String(page).padStart(4, '0')}.page.md`)),
    source: `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, '0')}/page.png`,
  })) };
  const candidates = payload.pages.map(item => snapshot(item.candidate, `candidates/${path.basename(item.candidate)}`));
  const stdin = path.join(out, 'native', 'stdin.json');
  json(stdin, payload);
  const prefix = path.join(out, 'native', 'count');
  const command = [python, '-B', helper];
  const inputs = [stdin, helper, import.meta.filename,
    ...payload.pages.flatMap(item => [item.candidate, item.source]),
    ...bindings.inputs.map(item => item.path)].map(bind);
  json(`${prefix}.started.json`, {
    startedAt: new Date().toISOString(), cwd: root, command, stdin: bind(stdin), inputs,
    frozenCandidates: candidates, nativeCountInvocations: 1, sourceCandidateEditsFrozenBeforeCount: true,
  });
  const result = run(command, fs.readFileSync(stdin));
  json(`${prefix}.command.json`, {
    cwd: root, command, stdin: bind(stdin), started: bind(`${prefix}.started.json`),
    ...rawOutputs(prefix, result), nativeCountInvocations: 1, cropWrites: 0,
    durableWrites: 0, independentSourceApproval: false,
  });
  check(inputs);
  console.log(result.stdout?.toString('utf8') ?? '');
  assert.equal(result.status, 0);
} else if (mode === 'freeze') {
  const bindings = read(bindingFile);
  check([...bindings.inputs, bindings.savedNativeHelper, bindings.capture]);
  const counts = read(path.join(out, 'native', 'count.stdout.txt'));
  const observations = read(path.join(out, 'source-observations.json'));
  const opens = read(path.join(out, 'image-opens.json'));
  check(read(path.join(out, 'native', 'count.started.json')).inputs);
  assert.equal(opens.sourceOpens, 4);
  assert(opens.entries.length <= 8);
  check(opens.entries);
  const frozenPages = counts.pages.map(item => {
    const candidate = bind(item.candidate);
    const frozen = bind(path.join(out, 'snapshots', 'candidates', path.basename(item.candidate)));
    assert.equal(candidate.sha256, frozen.sha256);
    fs.chmodSync(path.resolve(item.candidate), 0o444);
    return {
      page: item.pdf_page, candidate, frozenCandidate: frozen, sourcePng: bind(item.source_png),
      originalSnapshots: read(path.join(out, `prepare-${item.pdf_page}.command.json`)).outputs,
      candidateRows: item.candidate_rows, nativeMaskedRows: item.native_masked_rows,
      difference: item.native_minus_candidate, countMatches: item.native_count_matches_candidate,
      counting: item.counting, nativeBands: item.native_masked_bands,
      physicalRowsPerBlockBeforeSamerow: item.physical_rows_per_block_before_samerow,
      blocks: item.blocks, figures: item.figures,
      authorObservations: observations.pages.find(p => p.page === item.pdf_page),
    };
  });
  const freezePath = path.join(out, 'author-freeze.json');
  json(freezePath, {
    schema: 'ld-s10y-source-author-freeze@1', ticket: 'STEMROBIN-181',
    frozenAt: new Date().toISOString(), status: 'AUTHOR-FROZEN-NOT-SOURCE-PASS',
    independentReviewRequired: true, sourceApproval: false, cwd: root,
    inputBindings: bind(bindingFile), images: bind(path.join(out, 'image-opens.json')),
    observations: bind(path.join(out, 'source-observations.json')),
    prepareCommands: pages.map(page => bind(path.join(out, `prepare-${page}.command.json`))),
    nativeCommand: bind(path.join(out, 'native', 'count.command.json')),
    nativeStdout: bind(path.join(out, 'native', 'count.stdout.txt')),
    nativeStderr: bind(path.join(out, 'native', 'count.stderr.txt')),
    nativePrepareInvocations: 4, nativeCountInvocations: 1,
    sourceImageOpens: opens.sourceOpens, cropImageOpens: opens.cropOpens,
    totalContextImageOpens: opens.entries.length,
    pages: frozenPages, incomingText: observations.incomingText, outgoingText: observations.outgoingText,
    uncertainties: observations.uncertainties, immutableOriginalSnapshots: true,
    durableWrites: 0, sourceBookAssembly: false, finalize: false, vectorize: false,
    modernGeneration: false, indexOrMeterWrites: false, databaseAccess: false,
    gitCommands: 0, gitStateWrites: false, existingToolEdits: false, testsOrBuilds: false,
  });
  fs.chmodSync(freezePath, 0o444);
  console.log(JSON.stringify(bind(freezePath), null, 2));
} else {
  throw new Error('Only prepare <page>, account, count, or freeze are supported');
}
