import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d330';
const O = `${T}/tmp/d1816-d330-n149-first-preparation`;
const id = 'phy10-c3-s4-n149';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
const verify = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? ''))
    assert.equal(bind(value.path).sha256, value.sha256, value.path);
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(verify);
    else if (child && typeof child === 'object') verify(child);
  }
};
assert(!fs.existsSync(B));
assert(!fs.existsSync(O));
const collected = {};
for (const [stage, directory, reportHash, freezeHash] of [
  ['D320', 'd1816-d320-raw277-first-review',
    '1a547d626cb016933628a25e98cd3b41b9edb281945e3c389341b1883eb9bdd9',
    '2b8221ac48318bac90d7f7e7cbe3731c5cbfdfe617ce2fea0c33839214a87baf'],
  ['D326', 'd1816-d326-source383-385-affected-review',
    'd6d6ea15a4038ff773ede8dc0906f98b6a6a6e2a435b1536bbf78b9ba2c56de8',
    '431e9d50d4821bbbafde621ea8080a46852d81ec682dbef1d9775218cd73f2bb'],
]) {
  const dir = `${T}/tmp/${directory}`;
  const report = bind(`${dir}/report.json`);
  const freeze = bind(`${dir}/review-freeze.json`);
  assert.equal(report.sha256, reportHash);
  assert.equal(freeze.sha256, freezeHash);
  verify(read(freeze.path));
  collected[stage] = save(`${dir}/parent-collected.json`, {
    stage, report, reviewFreeze: freeze, reviewerClosed: true,
    actualImageOpens: stage === 'D320' ? 3 : 0,
    verdict: stage === 'D320' ? 'CROP_AND_SVG_PASS_SOURCE_FINE_HOLDS'
      : 'SEVEN_FIXES_PASS_STRICT_AUDIT_EQUALITY_FAIL_RETAINED',
    sourceApproval: false, completeCoursesAdded: 0,
  });
}
const classification = save(`${O}/audit-metadata-classification.json`, {
  stage: 'D330', priorReview: bind(`${T}/tmp/d1816-d326-source383-385-affected-review/report.json`),
  originalStrictEqualityFailurePreserved: true,
  metadataDifferences: [
    {
      page: 384, field: 'figures[0].from',
      before: [415, 240, 640, 540], after: [424, 252, 621, 526],
      classification: 'Current finalize input was the already-normalized exact box; not a new crop.',
      unchanged: ['figures[0].box', 'components', 'page.md geometry', 'PNG bytes', 'SVG bytes'],
    },
    {
      page: 385, field: 'normalizations',
      before: [{ kind: 'p', rules: ['collapse_single_brace'] }], after: [],
      classification: 'Per-invocation event log: normalized input requires no new normalization.',
      unchanged: ['All formulas', 'All non-affected words', 'Page source pixels'],
    },
  ],
  basis: 'D326 independent comparisons and existing D316/D325 receipts; no new producer or source observation.',
  strictEqualityPassClaimed: false, additionalContentRepair: false,
  approval: 'No broader source/figure/course approval; assembly may proceed with explicit inherited holds.',
});
const copies = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
  assert.equal(bind(from).sha256, bind(to).sha256);
  copies.push({ from: bind(from), to: bind(to) });
};
for (let page = 376; page <= 385; page++) {
  const stage = page <= 379 ? 321 : page === 380 ? 328 : page <= 382 ? 323 : 325;
  const dir = String(page).padStart(4, '0');
  for (const name of ['page.md', 'page.json', 'audit.json'])
    copy(`.tmp/STEMROBIN-181/d1816-d${stage}/root/10p/pages/${dir}/${name}`,
      `${B}/root/10p/pages/${dir}/${name}`);
  const source = `.tmp/STEMROBIN-181/d1816-d${stage}/source-work/10p/pages/${dir}/figures`;
  if (fs.existsSync(source)) for (const name of fs.readdirSync(source))
    if (/\.(png|svg)$/.test(name)) copy(`${source}/${name}`, `${B}/source-work/10p/pages/${dir}/figures/${name}`);
}
const input = save(`${O}/input-freeze.json`, {
  stage: 'D330', lesson: id, copies, collected, auditClassification: classification,
  sourcePages: [376, 377, 378, 379, 380, 381, 382, 383, 384, 385],
  targetPages: [381, 382, 383, 384, 385],
  sourceContentAndGlyphHoldsPreserved: true,
  raw147148PhotographsNotApproved: true, n150Incomplete: true,
  next: 'First isolated raw assembly then N149-only bilingual adapt-prepare.',
  parentImageOpens: 0, sourcePagesAdded: 0, completeCoursesAdded: 0, paidCalls: 0,
});
const native = (name, action, extra = []) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name,
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  action, '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`, ...extra,
], { cwd: repo, stdio: 'inherit' });
native('d330-n149-first-isolated-raw-assembly', 'assemble',
  ['--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']);
const source = read(`${B}/root/10p/lessons/${id}/lesson.json`);
assert.equal(source.id, id);
assert.equal(source.exercise_count, 0);
assert.deepEqual(source.figures.map(row => row.id), ['fig-277']);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
  native(`d330-n149-${edition === 'modern-us-neutral' ? 'zh' : 'en'}-first-adapt-prepare`,
    'adapt-prepare', ['--edition', edition, '--lesson', id]);
const prepared = save(`${O}/prepared.json`, {
  stage: 'D330', status: 'FIRST_ASSEMBLY_AND_N149_BILINGUAL_PREPARE_PASS_NOT_CONTENT_APPROVAL',
  input, root: `${B}/root`, work: `${B}/source-work`, id,
  source: bind(`${B}/root/10p/lessons/${id}/lesson.json`),
  exercises: bind(`${B}/root/10p/lessons/${id}/exercises.json`),
  proseEntries: source.prose.length, figures: source.figures,
  originalTasks: 0, neighboringRawCandidatesNotDelivered: true,
  sourcePagesAdded: 0, completeCoursesAdded: 0, newPaidCalls: 0, databaseWrites: false,
});
const file = `${T}/production-meter.json`;
const meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
for (const stage of ['D320', 'D326']) {
  const record = read(collected[stage].path);
  Object.assign(meter.currentResume1816[stage], {
    status: record.verdict + '_COLLECTED_CLOSED', report: record.report,
    reviewFreeze: record.reviewFreeze, parentCollected: collected[stage],
    reviewerClosed: true, actualImageOpens: record.actualImageOpens,
  });
}
meter.currentResume1816.D330 = { status: 'FIRST_ASSEMBLY_ADAPT_PREPARE_PASS',
  prepared, root: `${B}/root`, work: `${B}/source-work`,
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
Object.assign(meter.currentResume1816.D329, {
  status: 'SOLE_SOURCE380_ZERO_IMAGE_AFFECTED_REVIEW_ACTIVE',
  reviewer: '01a1fadd-d9d7-7771-bef2-2d8a8e28e351',
});
meter.currentResume1816.currentContinuation = '142 complete offline courses pushed. D320 RAW277 crop/SVG PASS collected; D326 seven corrections PASS and audit metadata equality failure retained/classified without replay. D329 SOURCE380 and D327 SOURCE386-388 reviews active. D330 first isolated SOURCE376-385 assembly and N149-only bilingual preparation PASS; modern author/figure/native/display pending. Parent image opens23/24. No source/course counts added, paid calls, DB, publisher, deploy, merge, closure or full checks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ prepared, collected }));
