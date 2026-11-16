import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const firstPath = `${work}/source-review-9p-0180-0183-correction-1.json`;
const secondPath = `${work}/source-review-9p-0184-0187.json`;
const tracePath = `${work}/source-review-9p-0180-0186-finalization-trace.json`;
const interruptedPath = `${work}/d019-source180-native-interruption.json`;
assert.ok(!await exists(tracePath), 'Approved-page finalization already consumed');
if (!await exists(interruptedPath)) {
  const folder = `${book}/pages/0180`;
  assert.ok(await exists(`${folder}/audit.json`));
  await immutableWrite(interruptedPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'script-field-shape-failure-after-native-page180-pass',
    error: 'TypeError reading report.figures; effective correction report uses inheritedFigures.',
    nativePage180ConsumedOnce: true,
    pageMarkdown: await bind(`${folder}/page.md`),
    pageJson: await bind(`${folder}/page.json`), audit: await bind(`${folder}/audit.json`),
    printedRows: 15, normalizationCount: 0,
    nextAction: 'Reuse page180 native outputs; check inherited figure bindings, then vectorize180 and continue181-186.',
  }, null, 2)}\n`);
}
const interrupted = await read(interruptedPath);
const reports = [await read(firstPath), await read(secondPath)];
assert.equal(reports[0].status, 'pass');
assert.equal(reports[1].status, 'pass-approved-prefix-only');
const checkedDependencies = new Map();
async function verifyBindings(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    if (!checkedDependencies.has(`${value.path}:${value.sha256}`)) {
      await verify(value.path, value.sha256);
      checkedDependencies.set(`${value.path}:${value.sha256}`, { path: value.path, sha256: value.sha256 });
    }
    return;
  }
  for (const child of Object.values(value)) await verifyBindings(child);
}
for (const report of reports) await verifyBindings(report);
const freeze180Path = `${work}/9p-next-source-0180-0183/author-freeze.json`;
const freeze184Path = `${work}/9p-next-source-0184-0187/author-freeze.json`;
const freezes = [await read(freeze180Path), await read(freeze184Path)];
for (const freeze of freezes) await verifyBindings(freeze);
const initial180 = await read(`${work}/source-review-9p-0180-0183.json`);
const priorIndex = await bind(`${book}/book.json`);
const priorSnapshot = `${work}/d019-source-before180/book-${priorIndex.sha256.slice(0, 12)}.json`;
await immutableWrite(priorSnapshot, await bytes(priorIndex.path));
const protectedFiles = [];
for (const card of (await read(priorIndex.path)).lessons) {
  if (card.id === 'phy9-c2-s2-n72') continue;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    protectedFiles.push(await bind(`${book}/lessons/${card.id}/${name}`));
  }
}
const run = args => {
  const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args], {
      encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
  process.stdout.write(output);
  return { command: args, output };
};
const pages = [];
for (let pdfPage = 180; pdfPage <= 186; pdfPage++) {
  const report = reports[pdfPage <= 183 ? 0 : 1];
  const original = freezes[pdfPage <= 183 ? 0 : 1].pages.find(page => page.pdf_page === pdfPage);
  const checked = report.pages.find(page => (page.pdfPage ?? page.pdf_page) === pdfPage);
  assert.equal(checked.status, 'pass', `Not approved: ${pdfPage}`);
  const draft = checked.draft ?? checked.bindings.draft;
  const rows = pdfPage <= 183
    ? initial180.pages.find(page => page.pdf_page === pdfPage).independent_rows
    : checked.independentPrintedRows;
  assert.ok(Number.isInteger(rows) && rows > 0, `Missing independently counted rows: ${pdfPage}`);
  const id = String(pdfPage).padStart(4, '0');
  const folder = `${book}/pages/${id}`;
  await verify(draft.path, draft.sha256);
  let finalization;
  if (pdfPage === 180) {
    for (const binding of [interrupted.pageMarkdown, interrupted.pageJson, interrupted.audit]) {
      await verify(binding.path, binding.sha256);
    }
    const parsedDraft = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
      '-B', '-c',
      'import json,sys;sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools");import blocks;meta,items=blocks.parse(sys.stdin.read());print(json.dumps({"meta":meta,"blocks":items}))',
    ], { input: await bytes(draft.path), encoding: 'utf8' }));
    const finalized = await read(`${folder}/page.json`);
    const content = value => value.blocks.filter(block => block.kind !== 'fig').map(block =>
      Object.fromEntries(['kind', 'label', 'open', 'cont', 'samerow', 'lines'].map(key => [key, block[key]])));
    assert.deepEqual(content(finalized), content(parsedDraft));
    assert.deepEqual(finalized.meta.counting, parsedDraft.meta.counting);
    finalization = { reused: true, originalInterruptedRun: await bind(interruptedPath), nativeCallsThisContinuation: 0 };
  } else {
    assert.ok(!await exists(folder), `Preserve existing page: ${id}`);
    await immutableWrite(`${folder}/page.md`, await bytes(draft.path));
    finalization = run(['finalize', '--book', '9p', '--page', String(pdfPage)]);
  }
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, rows);
  assert.equal(audit.lines_printed, rows);
  const figures = original.figures ?? [];
  for (const figure of figures) {
    assert.equal((report.figures ?? report.inheritedFigures).find(item => item.id === figure.id).status, 'pass');
    await verify(`.tmp/ld-s10y-lesson/9p/pages/${id}/figures/${figure.id}.png`, figure.candidate.sha256);
  }
  const vectorization = figures.length
    ? run(['vectorize', '--book', '9p', '--page', String(pdfPage)]) : null;
  pages.push({ pdfPage, draft, finalization, vectorization,
    audit: await bind(`${folder}/audit.json`), pageJson: await bind(`${folder}/page.json`) });
}
const assembly = run(['assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
assert.ok(!await exists(`${book}/pages/0167/page.json`));
assert.ok(!await exists(`${book}/pages/0187/page.json`));
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass-approved-pages-only',
  sourceReviews: await Promise.all([firstPath, secondPath].map(bind)),
  authorFreezes: await Promise.all([freeze180Path, freeze184Path].map(bind)),
  priorIndex: { ...priorIndex, snapshot: await bind(priorSnapshot) },
  pages, assembly, protectedFiles,
  closedSources: ['phy9-c2-s2-n72', 'phy9-c2-s2-n73', 'phy9-c2-s2-n74'],
  provisionalSource: 'phy9-c2-s2-n75', missing167AndUnresolved187Excluded: true,
  limits: 'Native finalize/vectorize for7 approved new pages and one assembly. Existing closed lesson bytes preserved. No repeated source/figure gate, browser, DB or full-project tests.',
}, null, 2)}\n`);
