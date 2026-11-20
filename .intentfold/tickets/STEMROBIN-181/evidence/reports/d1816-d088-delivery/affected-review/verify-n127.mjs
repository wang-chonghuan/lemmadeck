import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d085-n126-affected-review');
const absolute = file => path.resolve(root, file);
const load = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(absolute(file));
  return {path: absolute(file), sha256: sha(bytes), bytes: bytes.length};
};
const verified = new Map();
function refs(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
    const current = bind(value.path);
    assert.equal(current.sha256, value.sha256, current.path);
    verified.set(current.path, current);
  }
  Object.values(value).forEach(refs);
}
function diff(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object' &&
      Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
      diff(a[key], b[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`));
  }
  return [{pointer, before: a ?? null, after: b ?? null}];
}
const noSpace = text => text.replace(/\s/g, '');
const maths = doc => doc.prose.flatMap(block =>
  [...block.text.matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*?\$/g)].map(match => match[0]));
const frozen = bind('.intentfold/tickets/STEMROBIN-181/tmp/d1816-d080-n127-augmentation-author/layout-display-author-freeze.json');
assert.equal(frozen.sha256, '44b403c6b26879f10a1a55bd3c42162fa254366323866c696e895fefd63f46c6');
verified.set(frozen.path, frozen);
const freeze = load(frozen.path);
refs(freeze);
const oldReview = load(freeze.originalEnglishAndBindingReview.path);
const oldReviewFreeze = load(freeze.originalReviewFreeze.path);
assert.equal(oldReview.verdicts.firstEnglishSCI, 'PASS');
assert.equal(oldReview.verdicts.firstEnglishLanguage, 'PASS');
assert.equal(oldReview.verdicts.ChineseBindingOnlyMigration, 'PASS');
assert.equal(freeze.originalReviewEnglishPathOverride.sha256, oldReview.EnglishReview.sha256);
const oldENRow = oldReviewFreeze.inspectedInputsAndOwnedOutputs.find(row =>
  row.path === oldReview.EnglishReview.template);
assert.ok(oldENRow);
assert.equal(oldENRow.sha256, freeze.originalReviewEnglishPathOverride.sha256);
const native = load(freeze.nativeFinalized.path);
refs(native);
const dom = load(freeze.offlineDOM.path);
refs(dom);
assert.equal(dom.status, 'pass');
assert.equal(dom.records.length, 4);
assert.equal(dom.offline, true);
assert.equal(dom.headless, true);
assert.equal(dom.requests.length, 0);
const results = [];
for (const row of freeze.records) {
  const before = load(row.before.path), current = load(row.current.path);
  assert.deepEqual(diff(before, current), row.exactDiff);
  const expected = ['/prose/1/text', '/section_breaks/0/before'];
  if (row.locale === 'zh') expected.unshift('/printed_title');
  assert.deepEqual(row.exactDiff.map(change => change.pointer), expected);
  before.prose.forEach((block, index) =>
    assert.equal(noSpace(block.text), noSpace(current.prose[index].text)));
  assert.deepEqual(maths(before), maths(current));
  assert.equal(maths(current).length, 5);
  assert.equal(current.exercise_count, 0);
  assert.deepEqual(current.figures, []);
  assert.equal(current.section_breaks.length, 1);
  assert.equal(current.section_breaks[0].after, before.section_breaks[0].after);
  assert.ok(current.section_breaks[0].before.endsWith(before.section_breaks[0].before));
  assert.equal(current.section_breaks[0].before, current.prose[1].text.split('\n\n')[1]);
  const finalizedRow = row.finalized.files.find(file => file.path.endsWith('/lesson.json'));
  const finalized = load(finalizedRow.path);
  const finalizedDiff = diff(current, finalized);
  if (row.locale === 'en') {
    assert.deepEqual(finalizedDiff, [{pointer: '/status', before: 'draft', after: 'ready'}]);
    assert.equal(row.before.path, freeze.originalReviewEnglishPathOverride.path);
  } else {
    assert.deepEqual(finalizedDiff, []);
    assert.equal(current.printed_title, `**${before.printed_title}**`);
    assert.equal(oldReview.bindingReview.ChineseCandidate.sha256, row.before.sha256);
  }
  const audit = load(row.finalized.files.find(file => file.path.endsWith('/adaptation.audit.json')).path);
  assert.equal(audit.status, 'pass');
  const exercises = load(row.finalized.files.find(file => file.path.endsWith('/exercises.json')).path);
  const figures = load(row.finalized.files.find(file => file.path.endsWith('/figures.json')).path);
  assert.equal(exercises.count, 0);
  assert.deepEqual(figures.figures, []);
  const screenshots = [];
  for (const shot of row.screenshots) {
    const record = dom.records.find(item => absolute(item.screenshot.path) === absolute(shot.path));
    assert.ok(record);
    assert.equal(record.status, 'pass');
    assert.equal(record.locale, row.locale);
    assert.equal(record.edition, row.edition);
    assert.equal(record.lesson.sha256, finalizedRow.sha256);
    assert.equal(record.screenshot.sha256, shot.sha256);
    assert.equal(record.sourceBlocks, 4);
    assert.equal(record.paragraphs, 5);
    assert.deepEqual(record.figureChecks, []);
    assert.equal(record.emptyExercisesChecked, true);
    assert.ok(record.geometry.indents.every(value => value === '0px'));
    assert.ok(record.geometry.minFontRatio >= 1.099);
    assert.ok(record.geometry.fontFamilies.every(value => value.includes('KaTeX_Main')));
    assert.ok(record.geometry.boxes.every(box => box.x >= 0 && box.right <= record.viewport.width));
    const png = fs.readFileSync(absolute(shot.path));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
    assert.equal(width, record.viewport.width);
    assert.ok(height >= record.viewport.height);
    assert.ok(record.geometry.boxes.every(box => box.bottom <= height));
    const html = fs.readFileSync(absolute(record.html.path), 'utf8');
    const separators = [...html.matchAll(/<p class="para section">/g)];
    assert.equal(separators.length, 1);
    assert.ok(html.includes('p.para.section{border-top:1px solid var(--rule)'));
    const paragraphStarts = [...html.matchAll(/<p class="para(?: section)?">/g)];
    assert.equal(paragraphStarts.length, 5);
    assert.equal(paragraphStarts[3].index, separators[0].index);
    screenshots.push({
      screenshot: bind(shot.path), html: bind(record.html.path),
      viewport: record.viewport, screenshotWidth: width, screenshotHeight: height,
      fullPageScreenshot: true, paragraphs: 5, separatorCount: 1,
      nativeDOMReusedNotVisualApproval: true,
    });
  }
  results.push({
    locale: row.locale, edition: row.edition, before: bind(row.before.path),
    template: bind(row.current.path), finalizedLesson: bind(finalizedRow.path),
    exactAffectedDiff: row.exactDiff, finalizerOnlyStatusChange: finalizedDiff,
    proseWordsPunctuationMathEmphasisUnchanged: true,
    sourceSnapshotsAndRefsUnchanged: true, mathTokens: 5,
    equivalentWeberToTeslaBoundary: true, screenshots,
  });
}
const result = {
  status: 'PASS', scope: 'n127 exact layout diff, frozen offline/native binding checks only',
  authorFreeze: frozen, verifiedUniqueFiles: verified.size,
  immutableOriginalENOverride: bind(freeze.originalReviewEnglishPathOverride.path),
  records: results, nativeReruns: 0, DOMReruns: 0, sourceSCIReviewRepeats: 0,
};
if (process.argv.includes('--seal')) {
  const report = load(path.join(owned, 'n127-layout-display-report.json'));
  const ledger = load(path.join(owned, 'image-ledger.json'));
  assert.equal(report.status, 'PASS');
  assert.equal(ledger.n127.imageOpens, 4);
  assert.equal(ledger.totalImageOpens, 7);
  const output = {
    schema: 'STEMROBIN-181/existing-course-layout-display-independent-review-freeze@1',
    ticket: 'STEMROBIN-181', batch: 'D085', authorBatch: 'D080',
    role: 'SOLE_INDEPENDENT_SCOPED_LAYOUT_DISPLAY_REVIEWER',
    lesson: freeze.lesson, workdir: root, frozenAt: new Date().toISOString(),
    status: 'PASS', authorFreeze: frozen,
    originalSemanticBindingReview: bind(freeze.originalEnglishAndBindingReview.path),
    originalReviewFreeze: bind(freeze.originalReviewFreeze.path),
    immutableOriginalEnglishOverride: bind(freeze.originalReviewEnglishPathOverride.path),
    verdicts: report.verdicts, findings: report.findings, unresolvedHold: null,
    independentChecks: result, currentHashVerifiedInputs: [...verified.values()],
    ownedEvidence: ['n127-layout-display-report.json', 'image-ledger.json', 'grill.md', 'verify-n127.mjs']
      .map(name => bind(path.join(owned, name))),
    n127ImageOpens: 4, combinedImageOpens: 7, reopens: 0, crops: 0,
    originalSemanticAndBindingPassReused: true, newSCIApproval: false,
    newSourceApproval: false, offlineVisualApproval: true,
    productAcceptance: false, newWholeCourseApproval: false,
    completeCoursesAdded: 0, sourcePagesAdded: 0,
    nativeReruns: 0, DOMReruns: 0, productOrCandidateWrites: 0,
    backendFreshnessOrPaidCalls: 0, promotions: 0, commits: 0,
    parentConsumptionAndPromotionPending: true,
  };
  const file = path.join(owned, 'n127-layout-display-review-freeze.json');
  fs.writeFileSync(file, JSON.stringify(output, null, 2) + '\n', {flag: 'wx'});
  console.log(JSON.stringify({status: 'PASS', output: bind(file), verifiedUniqueFiles: verified.size}, null, 2));
} else console.log(JSON.stringify(result, null, 2));
