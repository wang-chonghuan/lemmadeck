import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck";
const scope = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-n118-text-review");
const read = (file) => JSON.parse(fs.readFileSync(path.join(scope, file), "utf8"));
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const manifest = read("snapshot-manifest.json");
const checks = [];
const check = (name, fn) => {
  fn();
  checks.push({ name, status: "PASS" });
};
check("Frozen snapshot bytes match their manifest", () => {
  for (const entry of manifest.entries) {
    assert.equal(sha256(fs.readFileSync(path.join(scope, entry.snapshot))), entry.sha256);
    assert.equal(fs.statSync(path.join(scope, entry.snapshot)).mode & 0o777, 0o444);
  }
});
const sourceLesson = read("snapshots/source/lesson.json");
const sourceExercises = read("snapshots/source/exercises.json");
for (const locale of ["zh", "en"]) {
  const lesson = read(`snapshots/${locale}/lesson.template.json`);
  const exercises = read(`snapshots/${locale}/exercises.template.json`);
  check(`${locale}: source lesson snapshot and digest are exact`, () => {
    assert.deepEqual(lesson.source.data, sourceLesson);
    assert.equal(lesson.source.sha256, manifest.entries.find((entry) => entry.snapshot === "snapshots/source/lesson.json").sha256);
  });
  check(`${locale}: all ten prose/figure/caption slots and source bindings are preserved`, () => {
    assert.equal(lesson.prose.length, 10);
    assert.equal(lesson.prose.filter((item) => item.kind === "p").length, 6);
    lesson.prose.forEach((item, i) => {
      for (const field of ["kind", "id", "printed_page", "source_refs"]) assert.deepEqual(item[field], sourceLesson.prose[i][field]);
      assert.equal(item.source_text, sourceLesson.prose[i].text);
    });
  });
  check(`${locale}: exact source exercise snapshot, five ordered question identities and bindings`, () => {
    assert.deepEqual(exercises.source.data, sourceExercises);
    assert.equal(exercises.source.sha256, manifest.entries.find((entry) => entry.snapshot === "snapshots/source/exercises.json").sha256);
    assert.equal(exercises.count, 5);
    assert.equal(exercises.exercises.length, 5);
    exercises.exercises.forEach((item, i) => {
      assert.equal(item.number, String(i + 1));
      for (const field of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) assert.deepEqual(item[field], sourceExercises.exercises[i][field]);
      assert.equal(item.source_text, sourceExercises.exercises[i].text);
      assert.deepEqual(item.lines, item.text.split("\n"));
    });
  });
  check(`${locale}: requested scientific qualifiers are present in the question text`, () => {
    const items = exercises.exercises;
    for (const expression of locale === "zh" ? [/通常/, /单光子/, /最大动能/, /饱和光电流/] : [/usual/, /single-photon/, /maximum kinetic energy/, /saturation photocurrent/]) assert.match(items[1].text, expression);
    assert.match(items[2].text, locale === "zh" ? /数值和单位/ : /value and unit/);
    assert.match(items[3].text, /\\nu/);
    assert.match(items[3].text, locale === "zh" ? /静质量/ : /rest mass/);
    assert.match(items[3].text, locale === "zh" ? /能量等效质量/ : /energy-equivalent mass/);
    for (const expression of locale === "zh" ? [/相同强度/, /垂直照射/, /理想镜面/, /完全吸收/] : [/same intensity/, /normal incidence/, /ideal mirror/, /perfectly absorbing/]) assert.match(items[4].text, expression);
    assert.match(lesson.prose[0].text, locale === "zh" ? /原书.*写作时约40年前/ : /source.*40 years before it was written/);
  });
  check(`${locale}: no answer/choice/key fields appear in the reviewed template objects`, () => {
    const prohibited = new Set(["answer", "answerKey", "answer_key", "correct_index", "correctIndex", "accept", "choices", "choiceSet", "choice_set", "options"]);
    const visit = (value) => {
      if (!value || typeof value !== "object") return;
      for (const [key, child] of Object.entries(value)) {
        assert.equal(prohibited.has(key), false, `Excluded key present: ${key}`);
        visit(child);
      }
    };
    visit(lesson);
    visit(exercises);
  });
}
check("Source gate's text and raw-report SHA bindings resolve without reading images", () => {
  const gate = read("snapshots/source/source-raw-pass.json");
  assert.equal(gate.text.sha256, sha256(fs.readFileSync(path.join(scope, "snapshots/source/source-bindings.json"))));
  assert.equal(gate.raw.sha256, sha256(fs.readFileSync(path.join(root, gate.raw.path))));
  assert.equal(gate.source, "PASS-complete-object");
});
const currentInputStatus = manifest.entries.map((entry) => ({
  source: entry.source,
  reviewedSha256: entry.sha256,
  currentSha256: sha256(fs.readFileSync(path.join(root, entry.source))),
}));
for (const entry of currentInputStatus) entry.unchanged = entry.reviewedSha256 === entry.currentSha256;
const science = read("science-receipt-manifest.json");
check("Retained science receipts match their hashes; all fetched pages are text-only successful receipts", () => {
  for (const row of science.rows) {
    if (row.type === "reused") {
      assert.equal(sha256(fs.readFileSync(path.join(scope, row.retained))), row.sha256);
    } else {
      assert.equal(row.exitCode, 0);
      assert.equal(sha256(fs.readFileSync(path.join(scope, "receipts", row.name, "stdout.txt"))), row.stdoutSha256);
      assert.match(fs.readFileSync(path.join(scope, "receipts", row.name, "stdout.txt"), "utf8"), /^Status: 200$/m);
    }
  }
  const playback = read("receipts/primary-playback-patent/receipt.json");
  assert.equal(playback.exitCode, 0);
  assert.equal(sha256(fs.readFileSync(path.join(scope, "receipts/primary-playback-patent/stdout.txt"))), playback.stdoutSha256);
  assert.match(fs.readFileSync(path.join(scope, "receipts/primary-playback-patent/stdout.txt"), "utf8"), /^Status: 200$/m);
});
const report = read("report.json");
check("Report records independent snapshot-only verdicts and no image approval", () => {
  assert.equal(report.verdicts.SCI.verdict, "PASS");
  assert.equal(report.verdicts.ZHEN.verdict, "PASS");
  assert.equal(report.verdicts.ZHEN.nonblockingFindingCount, 1);
  assert.equal(report.scope.imageOpens, 0);
  assert.equal(report.scope.figureApproval, false);
  assert.equal(report.reviewedSnapshotManifest, "snapshot-manifest.json");
});
const reports = ["report.json", "report.md"].map((file) => {
  const absolute = path.join(scope, file);
  fs.chmodSync(absolute, 0o444);
  assert.equal(fs.statSync(absolute).mode & 0o777, 0o444);
  return { file, sha256: sha256(fs.readFileSync(absolute)), mode: "0444" };
});
const boundary = {
  verifiedAt: new Date().toISOString(),
  reviewSnapshotCapturedAt: manifest.started,
  checks,
  currentInputStatus,
  allReviewedInputsStillCurrent: currentInputStatus.every((entry) => entry.unchanged),
  reports,
  imageOpens: 0,
  screenshots: 0,
  canonicalEdits: false,
  figureApproval: false,
  verdictTransferToChangedBytes: false,
};
fs.writeFileSync(path.join(scope, "final-boundary.json"), JSON.stringify(boundary, null, 2) + "\n", { flag: "wx", mode: 0o444 });
fs.chmodSync(path.join(scope, "final-boundary.json"), 0o444);
console.log(JSON.stringify(boundary, null, 2));
