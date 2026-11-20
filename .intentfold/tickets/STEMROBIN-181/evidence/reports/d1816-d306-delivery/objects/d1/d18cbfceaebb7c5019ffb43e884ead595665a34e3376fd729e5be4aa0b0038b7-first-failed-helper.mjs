import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp`;
const root = '.tmp/STEMROBIN-181/d1816-d276/root/10p';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const out = `${scratch}/d1816-d284-source48-51-consumed`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const reports = {
  sourceFirst: `${scratch}/d1816-d269-source48-51-review/report.json`,
  sourceAffected: `${scratch}/d1816-d269-source48-51-review/affected-report.json`,
  raw24_25: `${scratch}/d1816-d271-raw-source49-review/report.json`,
  raw26_28First: `${scratch}/d1816-d272-raw-source50-review/report.json`,
  raw29: `${scratch}/d1816-d273-raw-source51-review/report.json`,
  raw28Affected: `${scratch}/d1816-d277-raw28-affected-review/report.json`,
  native: `${scratch}/d1816-d276-source48-51-affected-author/result.json`,
};
assert.equal(read(reports.sourceAffected).threeTextFixesApproved, true);
assert.equal(read(reports.raw24_25).status, 'pass-with-notes');
assert.deepEqual(read(reports.raw26_28First).figures.slice(0, 2)
  .map(figure => [figure.png.verdict, figure.svg.verdict]), [['pass', 'pass'], ['pass', 'pass']]);
assert.equal(read(reports.raw29).status, 'pass');
assert.equal(read(reports.raw28Affected).status, 'pass');
assert.equal(read(reports.native).failure, null);
fs.mkdirSync(out, { recursive: true });
assert(!fs.existsSync(`${out}/result.json`));
const retained = [];
const copyNew = relative => {
  const from = `${root}/${relative}`;
  const to = `${canonical}/${relative}`;
  const source = bind(from);
  if (fs.existsSync(to)) {
    assert.equal(bind(to).sha256, source.sha256, `Existing artifact differs: ${relative}`);
    retained.push({ source, canonical: bind(to), action: 'byte-identical-existing-reused' });
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
  assert.equal(bind(to).sha256, source.sha256);
  retained.push({ source, canonical: bind(to), action: 'new-source-promoted' });
};
for (const page of [48, 49, 50, 51])
  for (const name of ['page.md', 'page.json', 'audit.json'])
    copyNew(`pages/${String(page).padStart(4, '0')}/${name}`);
for (const number of [24, 25, 26, 27, 28, 29])
  for (const extension of ['png', 'svg']) copyNew(`figures/fig-${number}.${extension}`);
for (const id of ['phy10-c1-s3-n17', 'phy10-c1-s3-n18', 'phy10-c1-s3-n19'])
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) copyNew(`lessons/${id}/${name}`);
const previousIndex = bind(`${canonical}/book.json`);
fs.copyFileSync(`${canonical}/book.json`, `${out}/book-before.json`, fs.constants.COPYFILE_EXCL);
execFileSync(process.execPath, [
  `${scratch}/d1816-recovery/run-native.mjs`, 'd284-new-source-retained-reindex',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
], { cwd: repo, stdio: 'inherit' });
const report = {
  batch: 'D284', status: 'source48-51-and-raw24-29-composed-pass-retained',
  reviews: Object.fromEntries(Object.entries(reports).map(([key, file]) => [key, bind(file)])),
  retained, previousIndex, currentIndex: bind(`${canonical}/book.json`),
  caption25SinglePixelNoteRetained: true, sourceRows: [21, 20, 21, 17],
  sourcePagesAdded: retained.filter(item => item.action === 'new-source-promoted'
    && item.canonical.path.endsWith('/page.json')).length,
  sourceApproval: true, modernApproval: false, completeCoursesAdded: 0,
  databaseWrites: false, paidCalls: 0, parentContinuationImageOpens: 15,
};
fs.writeFileSync(`${out}/result.json`, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${ticket}/production-meter.json`;
const meter = read(meterFile);
const current = meter.currentResume1816;
current.D269 = { ...current.D269, status: 'SOURCE_TEXT_COMPOSED_FIRST_AND_AFFECTED_PASS_REVIEWER_CLOSED',
  reviewerClosed: true, report: bind(reports.sourceFirst), affected: bind(reports.sourceAffected),
  actualImageOpens: 8, affectedNewImageOpens: 0 };
for (const [id, key, images, status] of [
  ['D271', 'raw24_25', 6, 'RAW24_25_PASS_WITH_SINGLE_CAPTION_PIXEL_NOTE_REVIEWER_CLOSED'],
  ['D272', 'raw26_28First', 8, 'RAW26_27_PASS_RAW28_ORIGINAL_CAPTION_FAILURE_PRESERVED_REVIEWER_CLOSED'],
  ['D273', 'raw29', 4, 'RAW29_SIX_LC_TWO_SPRINGS_PASS_REVIEWER_CLOSED'],
]) current[id] = { ...current[id], status, reviewerClosed: true,
  report: bind(reports[key]), actualImageOpens: images, completeCoursesAdded: 0 };
current.D274 = { status: 'N17_N18_FOUR_MODERN_TEXT_DRAFTS_AUTHORED_REVIEWER_PENDING_AUTHOR_CLOSED',
  freeze: bind(`${scratch}/d1816-d274-n17-n18-text-author/freeze.json`), authorClosed: true,
  modernTextBlocks: 58, originalTasks: 0, actualImageOpens: 0, completeCoursesAdded: 0 };
current.D275 = { status: 'FIG27_SOURCE_INVENTORY_AND_GEOMETRY_DRAFT_REUSED_IN_D283',
  sourceInventory: bind(`${scratch}/d1816-d275-fig27-author/source-inventory.json`),
  draft: bind(`${scratch}/d1816-d275-fig27-author/geometry-draft.json`),
  actualParentImageOpens: 1, completeCoursesAdded: 0 };
current.D276 = { status: 'THREE_SOURCE_TEXT_FIXES_AND_RAW28_CAPTION_REPAIR_COMPOSED_PASS',
  native: bind(reports.native), sourceRepairRounds: 1, raw28RepairRounds: 1,
  source49NotReplayed: true, unchangedRawFiguresNotReplayed: [24, 25, 26, 27, 29],
  completeCoursesAdded: 0, databaseWrites: false };
current.D277 = { status: 'RAW28_AFFECTED_PASS_REVIEWER_CLOSED',
  report: bind(reports.raw28Affected), reviewerClosed: true,
  actualImageOpens: 3, removedCaptionPixels: 24, changedPixelsOutsideExclusion: 0 };
current.D278 = { status: 'FRESH_SOURCE_BOUND_FOUR_TEXT_TEMPLATES_TRANSPLANTED_REVIEW_PENDING',
  result: bind(`${scratch}/d1816-d278-text-transplant/result.json`), completeCoursesAdded: 0 };
current.D279 = { status: 'N17_N18_FIRST_INDEPENDENT_MODERN_BILINGUAL_SCIENCE_REVIEW_ACTIVE',
  reviewer: '01a1fa8d-13e9-70c3-a055-f025c3543397', actualImageOpens: 0, completeCoursesAdded: 0 };
for (const [id, author, figures] of [
  ['D280', '01a1fa8d-b774-7ba2-8405-6da90ce3ec6c', [24, 25]],
  ['D281', '01a1fa8e-4198-7dd2-9d3f-452dd5132255', [28, 29]],
  ['D282', '01a1fa8e-9a66-7ce3-9d75-616c1809d022', [26]],
]) current[id] = { status: 'FIRST_MODERN_FIGURE_AUTHOR_ACTIVE', author, figures,
  imagesAuthorized: 8, completeCoursesAdded: 0, paidCallsAuthorized: 0 };
current.D283 = { status: 'FIG27_NATIVE_PASS_RESvg_BLANK_PREVIEW_RECOVERY',
  result: bind(`${scratch}/d1816-d283-fig27-author/result.json`),
  actualParentNewImageOpens: 1, completeCoursesAdded: 0 };
current.D284 = { status: report.status, result: bind(`${out}/result.json`),
  sourcePagesAdded: report.sourcePagesAdded, completeCoursesAdded: 0 };
current.currentContinuation = '139 complete offline courses pushed, unchanged. D284 composes SOURCE48-51 first plus affected text passes and RAW24-29 first/RAW28 affected passes; four source pages and six raw figures retained. D274 modern N17/N18 drafts transplanted into fresh D276 source bindings; independent bilingual/science review active. Modern figures24-29 in first author/native stages, no modern/course approval yet. Original caption-count and RAW28 failures preserved; only failed stages repaired. Parent continuation image opens15 including blank fig27 Resvg preview; usage not reset. N19 retained Chinese SCI context exists but its old operative template is missing and must be recovered without redoing passed prose. No DB/publisher/deploy/merge/closure, paid calls or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ result: bind(`${out}/result.json`), sourcePagesAdded: report.sourcePagesAdded }));
