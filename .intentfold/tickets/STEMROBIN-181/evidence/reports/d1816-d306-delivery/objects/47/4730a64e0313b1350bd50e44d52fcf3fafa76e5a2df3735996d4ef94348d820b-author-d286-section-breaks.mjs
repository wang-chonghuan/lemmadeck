import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const out = `${ticket}/tmp/d1816-d286-section-breaks`;
const work = '.tmp/STEMROBIN-181/d1816-d276/source-work';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const reviewFile = `${ticket}/tmp/d1816-d279-n17n18-text-review/report.json`;
const review = read(reviewFile);
assert.equal(review.verdict, 'PASS_TEXT_ONLY');
fs.mkdirSync(out, { recursive: true });
assert(!fs.existsSync(`${out}/result.json`));
const changes = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  for (const number of [17, 18]) {
    const id = `phy10-c1-s3-n${number}`;
    const file = `${work}/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
    const before = bind(file);
    assert.equal(before.sha256, review.basis.candidate_sha256[`${edition}/${id}`]);
    const document = read(file);
    const original = structuredClone(document);
    const stdoutFile = `${ticket}/tmp/d1816-recovery/native/d286-n${number}-${locale}-first-prose-flow/stdout.txt`;
    const boundaries = fs.readFileSync(stdoutFile, 'utf8').split('\n')
      .filter(line => line.startsWith('    break: '))
      .map(line => JSON.parse(line.slice('    break: '.length)));
    const refs = number === 17
      ? ['p0048#4', 'p0049#1', 'p0049#7', 'p0049#8']
      : ['p0050#7', 'p0051#2', 'p0052#2', 'p0052#4'];
    const selected = refs.map(ref => {
      const block = document.prose.find(item => item.source_refs.includes(ref));
      assert(block);
      const firstLine = block.text.split('\n')[0];
      const matches = boundaries.filter(boundary => boundary.after.startsWith(firstLine));
      assert.equal(matches.length, 1, `Missing unique native boundary ${id}/${locale}/${ref}`);
      return matches[0];
    });
    document.section_breaks = selected;
    const withoutBreaks = structuredClone(document);
    withoutBreaks.section_breaks = original.section_breaks;
    assert.deepEqual(withoutBreaks, original);
    const backup = `${out}/reviewed-${locale}-n${number}.template.json`;
    fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
    fs.writeFileSync(file, JSON.stringify(document, null, 2) + '\n');
    changes.push({ id, locale, before, reviewedSnapshot: bind(backup),
      after: bind(file), nativeFlow: bind(stdoutFile), refs,
      boundaries: selected, onlySectionBreakMetadataChanged: true });
  }
}
fs.writeFileSync(`${out}/result.json`, JSON.stringify({
  batch: 'D286', status: 'four-native-concept-boundaries-per-language-added',
  textReview: bind(reviewFile), changes, textChanged: false,
  formulasChanged: false, sourceBindingsChanged: false,
  newImageOpens: 0, paidCalls: 0, completeCoursesAdded: 0,
  displayApproval: false, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${ticket}/production-meter.json`;
const meter = read(meterFile);
meter.currentResume1816.D279 = {
  ...meter.currentResume1816.D279, status: 'N17_N18_FIRST_MODERN_BILINGUAL_SCIENCE_TEXT_PASS_REVIEWER_CLOSED',
  report: bind(reviewFile), reviewerClosed: true, actualImageOpens: 0,
};
meter.currentResume1816.D283.previewRecovery = bind(`${ticket}/tmp/d1816-d283-fig27-author/preview-recovery.json`);
meter.currentResume1816.D285 = {
  status: 'FIG27_FIRST_INDEPENDENT_MODERN_REVIEW_ACTIVE',
  reviewer: '01a1fa92-01ea-7ae0-89a0-82b8a98bc736',
  imagesAuthorized: 3, completeCoursesAdded: 0,
};
meter.currentResume1816.D286 = {
  status: 'NATIVE_CONCEPT_BOUNDARY_METADATA_ADDED_TEXT_UNCHANGED',
  result: bind(`${out}/result.json`), completeCoursesAdded: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ result: bind(`${out}/result.json`), textChanged: false }));
