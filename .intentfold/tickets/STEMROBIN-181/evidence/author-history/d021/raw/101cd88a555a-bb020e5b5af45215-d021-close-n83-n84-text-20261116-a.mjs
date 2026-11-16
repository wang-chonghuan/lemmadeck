import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = process.cwd();
const T = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const work = path.join(T, 'd021-n83-n84-text-20261116-a');
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const require = createRequire(import.meta.url);
const { sectionBreakIndices } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const before = read(path.join(work, 'before.json'));
for (const item of [...before.sourceCards, before.sourceIndex,
  ...before.sourcePages.filter(item => !item.path.includes('/pages/0207/'))]) {
  assert.deepEqual(bind(item.path), item);
}
const oldPage = read(path.join(work, 'before/page207/page.json'));
const page = read(path.join(book, 'pages/0207/page.json'));
assert.deepEqual(page.blocks, oldPage.blocks);
assert.equal(page.meta.errata.length, 1);
const metadataWithoutErratum = structuredClone(page.meta);
metadataWithoutErratum.errata = [];
assert.deepEqual(metadataWithoutErratum, oldPage.meta);
const oldMd = fs.readFileSync(path.join(work, 'before/page207/page.md'), 'utf8');
const md = fs.readFileSync(path.join(book, 'pages/0207/page.md'), 'utf8');
assert.equal(md.slice(md.indexOf('\n---\n', 4)), oldMd.slice(oldMd.indexOf('\n---\n', 4)));
const oldAudit = read(path.join(work, 'before/page207/audit.json'));
const audit = read(path.join(book, 'pages/0207/audit.json'));
assert.equal(audit.errata, 1);
const auditWithoutErratum = structuredClone(audit);
auditWithoutErratum.errata = 0;
assert.deepEqual(auditWithoutErratum, oldAudit);
const cards = [83, 84].map(number => {
  const file = path.join(T, `9p-n${number}-prose-freeze.json`);
  const record = read(file);
  for (const pair of [...record.templates, ...record.sources, ...record.sourcePages,
    ...record.authoritativeStream, ...record.tools, record.sourceIndex]) {
    assert.deepEqual(bind(pair.active.path), pair.active);
    assert.deepEqual(bind(pair.snapshot.path), pair.snapshot);
  }
  for (const item of record.results) assert.deepEqual(bind(item.path), item);
  const lesson = read(record.templates[0].active.path);
  const resolved = sectionBreakIndices(lesson.prose, lesson.section_breaks);
  assert.deepEqual(resolved, record.proseFlow.resolvedBreaks);
  assert.equal(record.proseFlow.nativeRuns, 1);
  return { freeze: bind(file), counts: record.counts,
    templates: record.templates.map(item => item.active), actualResolvedSectionBreaks: resolved,
    nativeTextResult: record.results.find(item => item.path.endsWith('native-text-result.json')) };
});
assert.equal(cards[0].freeze.sha256, '1ccf532e129309a778267470bbbab5132a737bd8d8357f2d9c2fa2ffbd4840b0');
assert.equal(cards[1].freeze.sha256, 'b61d034f9b7e21c72418f65e5587c0ba86fdfad9c338db73ea387fb958a8cda8');
const history = [
  'native-helper-before-derived-id-fix.py',
  'n83-author-before-terminal-dot-preservation.mjs',
  'n83-attempt1-before-terminal-dot-preservation/authored-before-native-layout.json',
  'n83-attempt1-before-terminal-dot-preservation/native-text-result.json',
].map(file => bind(path.join(work, file)));
const result = {
  ticket: 'STEMROBIN-181', batch: 'D021', status: 'bounded-text-authoring-complete',
  cards,
  page207: ['page.md', 'page.json', 'audit.json'].map(file => bind(path.join(book, 'pages/0207', file))),
  sourcePage207BodyAndAllBlocksExactUnchanged: true,
  onlyPageMetadataChangedField: 'errata', onlyAuditChangedField: 'errata',
  page207Rows: { physical: audit.lines_printed, faithful: audit.lines_md, sourceBlocks: page.blocks.length },
  nativeMetadataAndTargetBindingResult: bind(path.join(work, 'metadata-native-assembly.json')),
  nativeReprepare84: bind(path.join(work, 'prepare84.json')),
  archive: bind(path.join(work, 'before.json')), history, recorder: bind(import.meta.filename),
  sourceCardFilesPreservedExactBytes: before.sourceCards.length,
  sourceIndexExactBytesUnchanged: true,
  existingAdaptBookTemplateExactBytesUnchanged: true,
  actualScope: {
    imageViews: 0, imageAuthoringOrPromotion: 0, sourcePixelEdits: 0,
    nativeAdaptPrepareFigureByteHashesOnly: true,
    sourceFinalizeGatesOrVectorize: 0, fullBookReassembleOrSourceLessonWrites: 0,
    adaptFinalize: 0, independentOrSelfSCI: 0, choices: 0, keysOrInteractions: 0,
    dbOrGitWrites: 0, fullTestsOrBuild: 0, browsersOrOtherChats: 0,
  },
  terminologyClarification: 'Freeze sourcePixelFilesNeverOpenedOrModified means no image viewing or pixel editing. The mandated native adapt-prepare reads existing figure bytes solely for its source SHA bindings; no claim of zero binary hash reads.',
  findings: [
    'Initial scratch metadata guard omitted native derived figure id; failed before writes, corrected only in scratch with blocks.fig_id. Native metadata/target binding succeeded; no shared-tool repair.',
    'Native math signature includes the printed terminal ASCII periods. Two n83 candidate formula periods were restored before authoring was accepted; failed candidate/script/results archived. No source formula was changed.',
    'n84 retains both original solved exercise objects and full solutions. Independent SCI must derive both; no practice manufactured from solutions.',
    'fig-158 future author requires complete n80 and n83 modern contexts. No shared-display or figure edits were performed here.',
  ],
};
const output = path.join(work, 'completion-bindings.json');
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ completion: bind(output), cards, page207: result.page207,
  sourceCardFilesPreserved: before.sourceCards.length }, null, 2));
