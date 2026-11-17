import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const own = path.dirname(fileURLToPath(import.meta.url));
const context = ".intentfold/tickets/STEMROBIN-184/tmp/n18-n19-production/context-root/9-10g/editions/modern-us-neutral/lessons";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sources = [
  ["fig-74", "389850630f1bb3235a7b6b3706edb3a96f221dd2efb9f15e536424b2aed3ee3c"],
  ["fig-75", "6ea7e7639f4a1f7a0a6853382b3547be6967cf9d2eb5c214c4fcabf1dd88df10"],
  ["fig-76", "5e9725824b6fb73536d5650509fac2bdb2027f0f471bd19c9f27117f68ac3b8c"]
];
const texts = [
  ["geo910-c1-s2-n18", "lesson", "06f5a9e5c1471ef20d9c056f004213856ca118dd853df30dd282b4f8d7c097ec"],
  ["geo910-c1-s2-n18", "exercises", "ac5146aebad5b8f957d0376287253036aa9e00419ceab272fed4add72b66d89b"],
  ["geo910-c1-s2-n19", "lesson", "9793aea8ff74f5c3729212b3fd6c7f156f96a38f1174198dba48a222e6134287"],
  ["geo910-c1-s2-n19", "exercises", "964aa686a1e629507bacd00f3ea4986da24191b49a930c1fbaf6a7bf8ac16594"]
];
const inputRecords = [];
for (const [id, expected] of sources) {
  const sourcePath = path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/${id}.png`);
  const bytes = await readFile(sourcePath);
  assert.equal(hash(bytes), expected, `Changed source bytes: ${id}`);
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  inputRecords.push({
    type: "original-png",
    id,
    path: sourcePath,
    sha256: expected,
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    hashOnlyReadDoesNotOpenImage: true
  });
}
await mkdir(path.join(own, "text-snapshots"), { recursive: true });
const normalized = (text) => (text ?? "").replace(/\s+/gu, "");
for (const [lessonId, kind, expected] of texts) {
  const sourcePath = path.join(root, context, lessonId, `${kind}.json`);
  const bytes = await readFile(sourcePath);
  assert.equal(hash(bytes), expected, `Changed draft bytes: ${lessonId}/${kind}`);
  const doc = JSON.parse(bytes);
  assert.equal(doc.status, "draft");
  assert.equal(doc.edition, "modern-us-neutral");
  let payload;
  if (kind === "lesson") {
    payload = {
      id: doc.id,
      title: normalized(doc.title),
      prose: doc.prose.map((block) => ({
        kind: block.kind,
        id: block.id,
        label: normalized(block.label),
        text: normalized(block.text)
      }))
    };
  } else {
    assert.equal(doc.exercises.length, doc.count);
    assert.equal(doc.count, lessonId.endsWith("n18") ? 7 : 6);
    assert.ok(doc.exercises.every((exercise) =>
      exercise.figure_refs.length === 0 && exercise.figures.length === 0));
    payload = {
      lesson: doc.lesson,
      count: doc.count,
      exercises: doc.exercises.map((exercise) => ({
        number: exercise.number,
        text: normalized(exercise.text),
        linesJoined: normalized(exercise.lines.join("")),
        figure_refs: exercise.figure_refs,
        figures: exercise.figures
      }))
    };
  }
  const snapshot = path.join(own, "text-snapshots", `${lessonId}.${kind}.json`);
  await writeFile(snapshot, bytes, { flag: "wx" });
  inputRecords.push({
    type: "complete-draft-json",
    path: sourcePath,
    sha256: expected,
    snapshot,
    snapshotSha256: hash(await readFile(snapshot)),
    editionTextWhitespaceNormalizedSha256: hash(JSON.stringify(payload)),
    blockCount: kind === "lesson" ? doc.prose.length : doc.exercises.length
  });
}
const artifactRecords = [];
for (const name of ["fullsource-first.md", "source-first.records.json", "imageledger.json", "freeze_inputs.mjs"]) {
  const artifactPath = path.join(own, name);
  artifactRecords.push({ path: artifactPath, sha256: hash(await readFile(artifactPath)) });
}
const inventory = artifactRecords.find((record) => record.path.endsWith("/fullsource-first.md"));
await writeFile(path.join(own, "fullsource-first.sha256"),
  `${inventory.sha256}  fullsource-first.md\n`, { flag: "wx" });
const freeze = {
  schema: "independent-source-first/freeze@1",
  ticket: "STEMROBIN-184",
  frozenAtUtc: new Date().toISOString(),
  phase: "A",
  status: "SOURCE_FIRST_FROZEN",
  authorArtifactReads: 0,
  officialReview: false,
  sourceImageOpens: 3,
  imageOpenLimit: 8,
  inputs: inputRecords,
  artifacts: artifactRecords,
  pending: "Explicit parent disclosure of current final outputs before any Phase B inspection"
};
await writeFile(path.join(own, "freeze.json"), `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  status: freeze.status,
  frozenAtUtc: freeze.frozenAtUtc,
  sourceFirst: inventory,
  freeze: { path: path.join(own, "freeze.json"), sha256: hash(await readFile(path.join(own, "freeze.json"))) },
  imageLedger: artifactRecords.find((record) => record.path.endsWith("/imageledger.json")),
  inputChecks: inputRecords.length,
  draftTextSnapshots: texts.length,
  sourceImageOpens: 3,
  phaseB: "HOLD"
}, null, 2));
