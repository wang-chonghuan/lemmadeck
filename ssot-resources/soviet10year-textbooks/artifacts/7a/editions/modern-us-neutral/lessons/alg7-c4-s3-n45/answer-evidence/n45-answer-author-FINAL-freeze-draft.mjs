import assert from "node:assert/strict";
import {
  chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync,
  readdirSync, statSync, writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const working=dirname(fileURLToPath(import.meta.url));
const owner=dirname(working);
const repo=resolve(owner,"../../../../../..");
assert.equal(repo,"/Users/yong/.codex/worktrees/d9b1/lemmadeck");
assert.equal(relative(repo,owner),".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-answer-author");
const json=(name)=>JSON.parse(readFileSync(join(working,name),"utf8"));
const sha=(path)=>createHash("sha256").update(readFileSync(path)).digest("hex");
const math=json("mathematical-checks.json");
const schema=json("schema-check.json");
const counts=json("task-count.json");
const images=json("image-ledger.json");
const inputs=json("input-hashes.json");
const gate=json("gate-2-review.json");
assert.equal(math.status,"pass");
assert.equal(math.letteredSubpartsVerified,44);
assert.equal(schema.status,"pass");
assert.deepEqual(schema.errors,[]);
assert.equal(counts.exerciseCount,19);
assert.equal(counts.letteredSubpartCount,44);
assert.equal(images.actualImagesViewed,4);
assert.equal(gate.independentParentComparisonPerformed,false);
assert.equal(inputs.prep.exit,0);
assert.equal(inputs.prep.rerun,false);
for (const input of inputs.inputs) {
  assert.equal(sha(resolve(repo,input.path)),input.sha256,`Input changed before freeze: ${input.path}`);
}

const final=join(owner,"FINAL");
assert.ok(!existsSync(final),"Refuse to replace frozen evidence.");
const names=[
  "answer-keys.json","source-solutions.json","task-count.json","mathematical-checks.json",
  "schema-check.json","input-hashes.json","image-ledger.json","gate-2-review.json",
  "report.md","technical-recovery.json","check-draft.mjs","schema-check.py","freeze-draft.mjs",
];
const draft=json("answer-keys.json");
assert.equal(draft.status,"draft");
assert.equal(draft.answers.length,19);
assert.ok(draft.answers.every((a)=>a.source==="derived" && a.grading==="ungraded" && a.parts.length===0));
mkdirSync(final);
for (const name of names) copyFileSync(join(working,name),join(final,name));
const manifest={
  schema:"stemrobin-182/answer-author-freeze@1",
  status:"source-only-draft-frozen-with-explicit-convention-notes",
  createdAt:new Date().toISOString(),
  book:"7a",edition:"modern-us-neutral",lesson:"alg7-c4-s3-n45",
  exerciseCount:19,explicitSubparts:44,unsplitExercises:3,ungraded:19,parts:0,actualImagesViewed:4,
  finalMode:"0444",workingMode:"0644",finalDirectoryMode:"0555",
  answerKeysSha256:sha(join(final,"answer-keys.json")),
  prepareReceiptSha256:inputs.prep.sha256,
  independentParentComparison:"Pending parent; do not compare before this source-only freeze.",
  finalizer:"Not invoked. Parent retains the existing finalizer responsibility.",
  sourceConventionNotes:["880 positive/signed/zero fraction representation conventions","890 whether natural numbers include zero"],
  verification:"Existing completed draft checks reused. Freeze checks only receipt status, input hash stability, copied output hashes and permissions; it does not rerun mathematical or image review.",
  reproduction:"Use scripts in WORKING, not immutable FINAL. freeze-draft.mjs refuses to overwrite FINAL.",
  files:names.map((name)=>({name,sha256:sha(join(final,name)),bytes:statSync(join(final,name)).size})),
};
writeFileSync(join(final,"manifest.json"),`${JSON.stringify(manifest,null,2)}\n`);
copyFileSync(join(final,"manifest.json"),join(working,"manifest.json"));
for (const name of readdirSync(final)) chmodSync(join(final,name),0o444);
for (const name of readdirSync(working)) {
  if (statSync(join(working,name)).isFile()) chmodSync(join(working,name),0o644);
}
chmodSync(final,0o555);
for (const file of manifest.files) {
  assert.equal(sha(join(final,file.name)),file.sha256);
  assert.equal(sha(join(working,file.name)),file.sha256);
  assert.equal(statSync(join(final,file.name)).mode&0o777,0o444);
  assert.equal(statSync(join(working,file.name)).mode&0o777,0o644);
}
assert.equal(statSync(final).mode&0o777,0o555);
assert.equal(statSync(join(final,"manifest.json")).mode&0o777,0o444);
assert.equal(statSync(join(working,"manifest.json")).mode&0o777,0o644);
console.log(JSON.stringify({
  status:"frozen",final:relative(repo,final),working:relative(repo,working),
  files:manifest.files.length+1,answerKeysSha256:manifest.answerKeysSha256,
  manifestSha256:sha(join(final,"manifest.json")),
  prepareReceiptSha256:manifest.prepareReceiptSha256,
  finalFilesMode:"0444",workingFilesMode:"0644",finalDirectoryMode:"0555",
  exerciseCount:19,explicitSubparts:44,unsplitExercises:3,actualImagesViewed:4,
  independentParentComparisonPerformed:false,finalizerInvoked:false,
},null,2));
