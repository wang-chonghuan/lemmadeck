import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(),root);
const base='.intentfold/tickets/STEMROBIN-182/tmp/resume182-12';
const owned=`${base}/n39-fig55-review`;
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const file=p=>({path:path.resolve(p),sha256:digest(p)});
const checks=load(`${owned}/executed-checks.json`);
const review=load(`${owned}/fig-55.review.json`);
const inputs=load(`${owned}/input-hashes.json`);
assert.equal(checks.status,'pass');
assert.equal(review.status,'pass');
assert.equal(review.schema,'ld-s10y-image/review@1');
assert.ok(inputs.every(f=>digest(f.path)===f.sha256));
assert.equal(digest(review.source.path),review.source.sha256);
assert.equal(digest(review.spec.path),review.spec.sha256);
assert.equal(digest(review.render.path),review.render.sha256);
assert.equal(digest(review.outputs.svg.path),review.outputs.svg.sha256);
const named=['review.md','fig-55.review.json','independent-source-inventory.md','input-hashes.json',
  'check.mjs','finalize_result.mjs','executed-checks.json','spec-validation.json','path-checks.json',
  'browser-checks.json','source-ylabels-crop.png','fig-55-960.png','fig-55-640.png'];
const payload={
  schema:'ld-s10y-image/independent-cap4-result@1',ticket:'STEMROBIN-182',figure:'fig-55',status:'pass',
  scope:'Current fig55 candidate only; no whole-lesson, answer, choice, app, promotion, publish, deployment, closure approval.',
  cwd:root,ownedDirectory:path.resolve(owned),
  imageBudget:{maximumOpens:8,actualOpens:4,originals:1,crops:1,screenshotOpens:2,screenshotCaptures:2,
    reopens:0,conservativeCapturePlusOpenEvents:6,imagePayloadsReturnedToParent:0},
  executedChecks:{status:checks.status,total:checks.count,passed:checks.checks.filter(c=>c.status==='pass').length,
    evidence:file(`${owned}/executed-checks.json`)},
  bindings:{source:file(review.source.path),spec:file(review.spec.path),render:file(review.render.path),svg:file(review.outputs.svg.path)},
  findings:[
    'Exact 36x12 half-unit grid, one shared frame, finite solid curve domain [-6,8], plain endpoints, no answer markers.',
    'Independent source y labels are 2 and 3 only; no source x=1 or y=1 numeral. Actual rendered label count is 18.',
    'Actual cubic path has only two interior turns near (-2,2) and (2,-1); no spurious extrema.',
    'Approximate interpolation zeros -3.995588, 0.583872, 3.015714 fit independent source reading ranges; middle range [0.45,0.75], not exact 0.5.',
    '960/640 screenshot inspection passed; minimum transformed text is 17.333px at640; no overlap/clipping; right/up arrows are explicit vector groups.',
    'Only one FIRST-to-current edit: origin label (-0.2,-0.62) to (-0.45,-0.62); no geometry change; FIRST/source/author/template bytes preserved.',
  ],
  observations:[{id:'earlier-cap1-lesson-digest-not-current',blockingForFig55:false,
    currentLessonSha256:'dac34df757bb08a2e0275b9b0239ff88f4086caf6a5c2131482275311840fda9',
    earlierCap1LessonSha256:'7bb0d75094540710884273718cb9f18d27f81f6611511837b3fc9c8b240b6fb9',
    reason:'Current full lesson has no fig55 prose reference; specified exercise template and full819 text are unchanged. Earlier whole-lesson provenance claim is not adopted.'}],
  parentConditions:['Enforce unchanged complete819 after finalization.','Durable promotion references and lesson/app gates remain outside this review.'],
  prohibitedOperationsPerformed:[],producerRerun:false,candidateEdits:false,
  protectedInputs:inputs.map(f=>({...f,path:path.resolve(f.path)})),artifacts:named.map(name=>file(`${owned}/${name}`)),
};
fs.writeFileSync(`${owned}/result.json`,`${JSON.stringify(payload,null,2)}\n`);
console.log(JSON.stringify({status:payload.status,checks:payload.executedChecks,
  bindings:payload.bindings,mainFiles:['review.md','fig-55.review.json','result.json'].map(name=>file(`${owned}/${name}`))},null,2));
