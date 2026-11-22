import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const card = process.argv[2];
const config = {
  'phy9-c1-s1-n1': { task: 'D1304', prepare: 'd1816-d1274-n1-first-missing-en',
    author: 'd1816-d1300-n1-two-findings', review: 'd1816-d1276-n1-independent-review/n1-affected-text-review.json',
    paragraphs: 19, pointers: [4, 6], failure: 'd1277-n1-en-adapt-finalize-first' },
  'phy9-c1-s1-n2': { task: 'D1305', prepare: 'd1816-d1281-n2-first-missing-en',
    author: 'd1816-d1301-n2-four-findings', review: 'd1816-d1283-n2-independent-review/n2-affected-text-review.json',
    paragraphs: 29, pointers: [6] },
}[card];
assert(config);
const originalPath = `${ticket}/tmp/${config.author}/authored.json`;
const original = read(originalPath), draft = read(original.englishDraft.path);
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const prepared = read(`${ticket}/tmp/${config.prepare}/prepared.json`);
const raw = read(prepared.source.path);
const labels = {};
for (const index of config.pointers) {
  assert.equal(draft.prose[index].kind, 'fig');
  assert.equal(draft.prose[index].id, raw.prose[index].id);
  labels[draft.prose[index].id] = draft.prose[index].label;
  draft.prose[index].label = raw.prose[index].label;
}
const compare = structuredClone(draft), before = read(original.englishDraft.path);
for (const index of config.pointers) compare.prose[index].label = before.prose[index].label;
assert.deepEqual(compare, before);
const tag = config.task.toLowerCase(), out = `${ticket}/tmp/d1816-${tag}-${card.split('-').at(-1)}-source-figure-labels`;
save(`${out}/en.lesson.draft.json`, draft);
const receipt = run(`${tag}-${card.split('-').at(-1)}-source-label-only-native`, [
  'node', '--input-type=module', '-e',
  `import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(${JSON.stringify(`${repo}/app/package.json`)});
const fs=require('node:fs'),{proseFlow}=require(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`)});
const draft=JSON.parse(fs.readFileSync(${JSON.stringify(`${out}/en.lesson.draft.json`)}));
const raw=JSON.parse(fs.readFileSync(${JSON.stringify(prepared.source.path)}));
for(const index of ${JSON.stringify(config.pointers)})assert.equal(draft.prose[index].label,raw.prose[index].label);
assert.equal(proseFlow(draft.prose,draft.section_breaks).filter(block=>block.kind==='p').length,${config.paragraphs});
console.log(JSON.stringify({status:'PASS',paragraphs:${config.paragraphs},sourceIdentityLabelsRestored:true}));`,
]);
save(`${out}/authored.json`, {
  ...original, task: config.task, status: 'AFFECTED_ONLY_UNNUMBERED_SOURCE_LABELS_NATIVE_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft,
  englishDraft: bind(`${out}/en.lesson.draft.json`), localizedFigureLabels: labels,
  nativeReceipt: receipt, changedPointers: config.pointers.map(index => `/prose/${index}/label`),
  ...(card.endsWith('n2') ? { initialHelperPointerFailure: {
    command: ['node', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/repair-d1304-unnumbered-source-labels.mjs', card],
    cwd: repo, chunk: '52b548', exitCode: 1,
    error: "Expected kind fig at prose[5]; actual kind p. No output or native call.",
    originalPointer: 5, correctedPointer: 6, contentApproval: false,
  } } : {}),
  allProseMathSourceAndFlowUnchanged: true, reusedAffectedTextReview: bind(`${ticket}/tmp/${config.review}`),
  ...(config.failure ? { originalFinalizeFailure: bind(`${ticket}/tmp/d1816-recovery/native/${config.failure}/receipt.json`) }
    : { preventedSameKnownNativeIdentityFailureWithoutExecutingN2Finalize: true }),
  independentAffectedMetadataReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`), draft: bind(`${out}/en.lesson.draft.json`),
  localizedFigureLabels: labels, changedPointers: config.pointers.map(index => `/prose/${index}/label`) }));
