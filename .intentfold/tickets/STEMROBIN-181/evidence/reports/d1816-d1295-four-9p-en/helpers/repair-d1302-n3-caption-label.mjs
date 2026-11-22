import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const originalPath = `${ticket}/tmp/d1816-d1299-n3-three-readability-findings/authored.json`;
const original = read(originalPath), draft = read(original.englishDraft.path);
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
assert.equal(draft.prose[3].id, 'fig-01');
assert.equal(draft.prose[3].label, 'Figure 1');
assert.equal(draft.prose[4].kind, 'cap');
assert.equal(draft.prose[4].text, 'Figure 1');
const out = `${ticket}/tmp/d1816-d1302-n3-caption-label`;
draft.prose[4].label = draft.prose[3].label;
const compare = structuredClone(draft);
compare.prose[4].label = read(original.englishDraft.path).prose[4].label;
assert.deepEqual(compare, read(original.englishDraft.path));
save(`${out}/en.lesson.draft.json`, draft);
const receipt = run('d1302-n3-caption-label-only-native', [
  'node', '--input-type=module', '-e',
  `import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(${JSON.stringify(`${repo}/app/package.json`)});
const fs=require('node:fs'),{proseFlow}=require(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`)});
const draft=JSON.parse(fs.readFileSync(${JSON.stringify(`${out}/en.lesson.draft.json`)}));
assert.equal(draft.prose[4].label,draft.prose[3].label);
const flow=proseFlow(draft.prose,draft.section_breaks);
assert.equal(flow.filter(block=>block.kind==='p').length,18);
const figureIndex=flow.findIndex(block=>block.kind==='fig'&&block.id==='fig-01');
assert.ok(figureIndex>=0);assert.equal(flow[figureIndex+1].kind,'cap');
assert.equal(flow[figureIndex+1].label,'Figure 1');
console.log(JSON.stringify({status:'PASS',changedPointer:'/prose/4/label',paragraphs:18,caption:'Figure 1'}));`,
]);
save(`${out}/authored.json`, {
  ...original, task: 'D1302', status: 'AFFECTED_ONLY_N3_CAPTION_LABEL_NATIVE_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft,
  englishDraft: bind(`${out}/en.lesson.draft.json`), nativeReceipt: receipt,
  changedPointers: ['/prose/4/label'], allProseMathSourceAndFlowUnchanged: true,
  initialFinalizePass: bind(`${ticket}/tmp/d1816-recovery/native/d1291-n3-en-adapt-finalize-first/receipt.json`),
  originalRenderFailure: bind(`${ticket}/tmp/d1816-recovery/native/d1291-n3-en-render-first/receipt.json`),
  initialNativeInputs: bind(`${ticket}/tmp/d1816-d1291-n3-first-en-native/inputs.freeze.json`),
  initialAffectedTextReview: bind(`${ticket}/tmp/d1816-d1290-n3-independent-review/n3-affected-text-review.json`),
  independentAffectedCaptionReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), changedPointer: '/prose/4/label' }));
