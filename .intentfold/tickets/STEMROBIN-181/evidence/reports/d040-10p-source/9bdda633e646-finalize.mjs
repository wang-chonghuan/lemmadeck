import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
const pages = [100, 101, 102, 103];
const mode = process.argv[2];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async file => {
  const bytes = await fs.readFile(file);
  return { path: path.resolve(file), sha256: sha(bytes), bytes: bytes.length };
};
const exists = file => fs.access(file).then(() => true, () => false);
const save = async (name, value) => fs.writeFile(path.join(folder, name),
  `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const read = async name => JSON.parse(await fs.readFile(path.join(folder, name), 'utf8'));
const verify = async bindings => {
  for (const binding of bindings) {
    assert.equal((await bind(binding.path)).sha256, binding.sha256, binding.path);
  }
};
const walk = async directory => {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    assert.equal(entry.isSymbolicLink(), false);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files.sort();
};

if (mode === 'finalize') {
  assert.equal(await exists(path.join(folder, 'input-freeze.json')), false,
    'First native attempt is already started; do not rerun');
  const observations = await read('source-observations.json');
  const bindings = await Promise.all([
    'AGENTS.md', '.intentfold/readme.md', '.intentfold/project.json',
    '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
    '.intentfold/charter/operations.md',
    '.claude/skills/ld-s10y-lesson/SKILL.md', '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    '.claude/skills/ld-s10y-lesson/tools/blocks.py',
    '.claude/skills/ld-s10y-lesson/tools/layout.py',
    '.claude/skills/ld-s10y-lesson/tools/normalize.py',
    '.claude/skills/ld-s10y-lesson/tools/mathcheck.py',
    '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
    'ssot-resources/soviet10year-textbooks/sources/manifest.json',
    'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
    'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf',
    '.intentfold/tickets/STEMROBIN-181/tmp/d038-10p-source96-99-author/candidates/0099.page.md',
    '.intentfold/tickets/STEMROBIN-181/tmp/d038-10p-source96-99-author/source-observations.json',
    '.intentfold/tickets/STEMROBIN-181/tmp/d038-10p-source96-99-author/author-freeze.json',
  ].map(bind));
  const inputs = [];
  for (const page of pages) {
    const stem = String(page).padStart(4, '0');
    const prepared = `.tmp/ld-s10y-lesson/10p/pages/${stem}`;
    const candidate = path.join(folder, `candidates/${stem}.page.md`);
    const destination = path.join(folder, `root/10p/pages/${stem}`);
    const work = path.join(folder, `work/10p/pages/${stem}`);
    assert.equal(await exists(destination), false);
    assert.equal(await exists(work), false);
    await fs.mkdir(destination, { recursive: true });
    await fs.mkdir(work, { recursive: true });
    await fs.copyFile(candidate, path.join(destination, 'page.md'), fs.constants.COPYFILE_EXCL);
    const records = [];
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      await fs.copyFile(`${prepared}/${name}`, path.join(work, name), fs.constants.COPYFILE_EXCL);
      records.push({ ...await bind(`${prepared}/${name}`), snapshot: await bind(path.join(work, name)) });
    }
    inputs.push({ page, printedPage: page - 10, candidate: await bind(candidate), prepared: records });
  }
  const commands = await Promise.all(['prepare.mjs', 'finalize.mjs', 'inspect-crops.py']
    .map(name => bind(path.join(folder, name))));
  const prepareResults = await Promise.all(pages.map(async page => ({
    record: await bind(path.join(folder, `prepare-${page}.json`)),
    outcome: await read(`prepare-${page}.json`),
  })));
  const crops = await Promise.all(['0100-corona-text-crop.png', '0103-ex7-name-crop.png']
    .map(name => bind(path.join(folder, name))));
  await save('input-freeze.json', {
    schema: 'ld-s10y-source-author-input-freeze@1',
    book: '10p', pages: inputs, commands, prepareResults, bindings, crops,
    observations: await bind(path.join(folder, 'source-observations.json')),
    sourceApproval: false, sourceCandidateEditsFrozenBeforeFinalize: true,
    imageOpens: observations.imageOpensBeforeNative,
    opened: observations.openedBeforeNative,
    authority: 'Existing p2c finalize once per page in isolated root/work; all initial FAIL retained. No source selfapproval.',
  });
  const results = [];
  const outputs = [];
  for (const page of pages) {
    const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
      '--book', '10p', '--page', String(page), '--root', path.join(folder, 'root'),
      '--work', path.join(folder, 'work')];
    await save(`finalize-${page}.started.json`, {
      page, startedAt: new Date().toISOString(), cwd: process.cwd(), args,
      inputFreeze: await bind(path.join(folder, 'input-freeze.json')),
      nativeFinalizeInvocationsForPage: 1,
    });
    const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
      { timeout: 180000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
    await fs.writeFile(path.join(folder, `finalize-${page}.stdout.txt`),
      result.stdout ?? Buffer.alloc(0), { flag: 'wx' });
    await fs.writeFile(path.join(folder, `finalize-${page}.stderr.txt`),
      result.stderr ?? Buffer.alloc(0), { flag: 'wx' });
    const record = {
      page, args, exitCode: result.status, signal: result.signal,
      stdout: (result.stdout ?? Buffer.alloc(0)).toString('utf8'),
      stderr: (result.stderr ?? Buffer.alloc(0)).toString('utf8'),
      error: result.error?.message ?? null, nativeFinalizeInvocationsForPage: 1,
      stdoutBinding: await bind(path.join(folder, `finalize-${page}.stdout.txt`)),
      stderrBinding: await bind(path.join(folder, `finalize-${page}.stderr.txt`)),
    };
    await save(`finalize-${page}.json`, record);
    results.push(record);
    const stem = String(page).padStart(4, '0');
    const auditFile = path.join(folder, `root/10p/pages/${stem}/audit.json`);
    const audit = await exists(auditFile) ? JSON.parse(await fs.readFile(auditFile, 'utf8')) : null;
    const files = [];
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const file = path.join(folder, `root/10p/pages/${stem}/${name}`);
      if (await exists(file)) files.push(await bind(file));
    }
    const figures = [];
    for (const figure of audit?.figures ?? []) {
      const file = path.join(folder, `work/10p/pages/${stem}/figures/${figure.id}.png`);
      figures.push({ ...figure, crop: await exists(file) ? await bind(file) : null,
        independentSourceReview: 'pending' });
    }
    outputs.push({ page, files, figures, linesPrinted: audit?.lines_printed ?? null,
      linesMd: audit?.lines_md ?? null, errors: audit?.errors ?? [],
      nativeStatus: record.exitCode === 0 ? 'PASS' : 'FAIL',
      commandRecord: await bind(path.join(folder, `finalize-${page}.json`)) });
    console.log(JSON.stringify({ page, exitCode: record.exitCode, stdout: record.stdout,
      stderr: record.stderr, error: record.error }));
  }
  await verify(bindings);
  await verify(commands);
  await verify(inputs.flatMap(input => [input.candidate, ...input.prepared]));
  await save('native-results.json', {
    book: '10p', pages: inputs, commands, prepareResults, results, outputs,
    inputFreeze: await bind(path.join(folder, 'input-freeze.json')),
    sourceApproval: false, nativeFinalizeInvocations: 4, retries: 0,
    firstFailuresRetained: true, readOnlyInputHashesUnchanged: true,
  });
} else if (mode === 'freeze') {
  assert.equal(await exists(path.join(folder, 'author-freeze.json')), false,
    'Author bundle is already frozen; do not overwrite');
  const native = await read('native-results.json');
  const input = await read('input-freeze.json');
  const observations = await read('source-observations.json');
  const cropCheck = await read('crop-visual-check.json');
  await verify(input.bindings);
  await verify(input.commands);
  await verify([input.observations, ...input.crops,
    ...input.pages.flatMap(page => [page.candidate, ...page.prepared])]);
  await verify(native.outputs.flatMap(output =>
    [...output.files, output.commandRecord, ...output.figures.map(figure => figure.crop)].filter(Boolean)));
  assert.equal(cropCheck.totalContextImageOpens, 7);
  const images = [
    ...await Promise.all(pages.map(page =>
      bind(`.tmp/ld-s10y-lesson/10p/pages/${String(page).padStart(4, '0')}/page.grid.png`))),
    ...input.crops, ...cropCheck.entries.map(entry => entry.image),
  ];
  await verify(images);
  const files = await Promise.all((await walk(folder)).map(bind));
  await save('author-freeze.json', {
    schema: 'ld-s10y-source-author-freeze@1', ticket: 'STEMROBIN-181',
    frozenAt: new Date().toISOString(), cwd: process.cwd(),
    status: 'AUTHOR-FROZEN-NOT-SOURCE-PASS',
    sourceApproval: false, independentSourceReviewRequired: true,
    book: '10p', physicalPages: pages, printedPages: pages.map(page => page - 10),
    inputFreeze: native.inputFreeze,
    nativeResults: await bind(path.join(folder, 'native-results.json')),
    observations: input.observations,
    cropVisualCheck: await bind(path.join(folder, 'crop-visual-check.json')),
    files, imageOpens: 7, imageBindings: images, imagePayloadsReturnedToParent: false,
    nativePrepareInvocations: native.prepareResults.filter(record =>
      !record.outcome.reusedExistingPreparation).length,
    nativeFinalizeInvocations: 4, retries: 0, firstFailuresRetained: true,
    readOnlyInputHashesUnchanged: true,
    outputs: native.outputs,
    cardBoundaries: observations.cardBoundaries,
    openContinuations: observations.openContinuations,
    outgoingText: observations.outgoingText,
    remaining: [
      'Independent SOURCE semantic and figure review remains pending; native PASS is not source approval.',
      ...native.outputs.flatMap(output => output.errors.map(error => `PDF${output.page}: ${error}`)),
      'All first native FAIL and source candidates remain frozen; no blind rerun or tool/skill rewrite.',
      'PDF104+ pixels and next chapter heading were not observed.',
    ],
    scope: {
      allowedAuthorDirectory: folder,
      newPreparationDirectories: pages.map(page =>
        path.resolve(`.tmp/ld-s10y-lesson/10p/pages/${String(page).padStart(4, '0')}`)),
      canonicalWrites: 0, assembly: false, vectorize: false, modernText: false,
      databaseAccess: false, gitCommands: false, browserWindows: false,
      agents: false, supervisorMessages: false, existingToolEdits: false,
    },
  });
  console.log(JSON.stringify(await bind(path.join(folder, 'author-freeze.json'))));
} else {
  throw new Error('Use finalize once, then freeze once after the bounded crop observation');
}
