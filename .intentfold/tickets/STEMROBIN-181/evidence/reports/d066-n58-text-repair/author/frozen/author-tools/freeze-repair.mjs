import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const own = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const parent = path.join(own, "../d063-n58-text-author");
const prior = path.join(parent, "author-freeze.json");
const review = path.join(own, "../d064-n58-text-review/report.json");
const priorHash = "b1250a4b3c5948f8e241b1f71bfa5eb4238fbcb707f095989c6c2cf23090b262";
const reviewHash = "e72c04c915faf8f2217589da5018516d2d9fcd46ae95e17a78a52bbcc15a76dd";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const record = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const writeNew = (file, value) => {
  assert(path.resolve(file).startsWith(`${own}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const copyNew = (file, relative) => {
  const target = path.join(own, relative);
  assert(target.startsWith(`${own}/`));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(file), hash(target));
  return { ...record(target), original: record(file), exactCopy: true };
};

assert.equal(hash(prior), priorHash);
assert.equal(hash(review), reviewHash);
const base = read(prior);
const independent = read(review);
assert.equal(independent.status, "HOLD");
assert.equal(independent.SCI, "HOLD");
assert.equal(independent.ZHEN, "HOLD");
assert.deepEqual(independent.findings.map((item) => item.id), ["N58-TEXT-01"]);

function snapshot() {
  const inputs = {
    previousAuthorFreeze: copyNew(prior, "before/author-freeze.json"),
    independentHOLD: copyNew(review, "before/independent-review.json"),
    templates: {},
    retainedSourceAndEvidence: {},
  };
  for (const locale of ["zh", "en"]) {
    inputs.templates[locale] = {};
    for (const kind of ["lesson", "exercises", "figures"]) {
      const binding = base.textCandidates[locale][kind];
      assert.equal(hash(binding.path), binding.sha256);
      const name = `${kind}.template.json`;
      inputs.templates[locale][kind] = {
        before: copyNew(binding.path, `before/${locale}/${name}`),
        work: copyNew(binding.path, `work/${locale}/${name}`),
      };
    }
  }
  const retained = {
    "raw-lesson.json": base.inputBindings.rawLesson,
    "raw-exercises.json": base.inputBindings.rawExercises,
    "source-consumed.json": base.inputBindings.consumption,
    "change-register.complete.json": base.evidence["change-register.complete.json"],
    "change-register.failed.json": base.evidence["change-register.json"],
    "display-overlay.en.json": base.evidence["display-overlay.en.json"],
    "author-register-attempt-1.failure.json": base.nativeReceipts["author-register-attempt-1.failure.json"],
  };
  for (const [name, binding] of Object.entries(retained)) {
    assert.equal(hash(binding.path), binding.sha256);
    inputs.retainedSourceAndEvidence[name] = copyNew(binding.path, `before/evidence/${name}`);
  }
  writeNew(path.join(own, "work/input-bindings.json"), inputs);
  console.log("Exact before/work copies created; no native preparation or image reads.");
}

function freeze() {
  assert(!fs.existsSync(path.join(own, "frozen")));
  const inputs = read(path.join(own, "work/input-bindings.json"));
  const checkFile = path.join(own, "work/affected-text-check.json");
  const check = read(checkFile);
  const diffFile = path.join(own, "work/json-pointer-diff.json");
  const diff = read(diffFile);
  assert.equal(check.status, "PASS-affected-text-structure-only");
  assert.equal(check.invocations, 1);
  const after = {};
  for (const locale of ["zh", "en"]) {
    after[locale] = {};
    for (const kind of ["lesson", "exercises", "figures"]) {
      const file = path.join(own, `work/${locale}/${kind}.template.json`);
      assert.equal(hash(file), check.afterBindings[locale][kind].sha256);
      after[locale][kind] = copyNew(file, `frozen/${locale}/${kind}.template.json`);
    }
  }
  const retained = {};
  for (const [name, binding] of Object.entries(inputs.retainedSourceAndEvidence)) {
    assert.equal(hash(binding.path), binding.sha256);
    assert.equal(hash(binding.original.path), binding.original.sha256);
    retained[name] = copyNew(binding.path, `frozen/retained/${name}`);
  }
  for (const locale of ["zh", "en"]) {
    for (const kind of ["lesson", "exercises", "figures"]) {
      const before = inputs.templates[locale][kind].before;
      assert.equal(hash(before.path), before.sha256);
      assert.equal(hash(before.original.path), before.original.sha256);
    }
  }
  const evidence = {};
  for (const name of [
    "input-bindings.json", "affected-text-check.json",
    "json-pointer-diff.json", "change-register-amendment.json",
  ]) {
    evidence[name] = copyNew(path.join(own, "work", name), `frozen/evidence/${name}`);
  }
  const tools = {};
  for (const name of ["freeze-repair.mjs", "check-affected.py"]) {
    tools[name] = copyNew(path.join(own, "work", name), `frozen/author-tools/${name}`);
  }
  const manifest = path.join(own, "author-freeze.json");
  writeNew(manifest, {
    schema: "d065/n58-targeted-text-repair-author-freeze@1",
    ticket: "STEMROBIN-181", lesson: "phy10-c1-s6-n58",
    createdAt: new Date().toISOString(),
    author: "Carson", role: "Original n58 text author; targeted correction only",
    status: "author-repair-frozen-independent-affected-SCI-ZHEN-pending",
    finding: "N58-TEXT-01",
    previousAuthorFreeze: inputs.previousAuthorFreeze,
    triggeringIndependentReview: inputs.independentHOLD,
    originalIndependentGates: { SCI: "HOLD", ZHEN: "HOLD", unchanged: true },
    before: Object.fromEntries(["zh", "en"].map((locale) => [
      locale,
      Object.fromEntries(["lesson", "exercises", "figures"].map((kind) => [
        kind, inputs.templates[locale][kind].before,
      ])),
    ])),
    textCandidates: after,
    exactJSONPointerDiff: evidence["json-pointer-diff.json"],
    inputBindingReceiptScope: "The input-bindings receipt records pre-edit working copies as historical initial states; authoritative before files are under before/, and current after hashes are under textCandidates.",
    changedPointersPerLocale: { zh: ["/prose/0/text"], en: ["/prose/0/text"] },
    correction: "Restore the explicitly source-specified triode identity in the voltage/anode-current sentence in both locales; no other theory or qualification change.",
    sourceRefs: ["p0154#2"],
    retainedSourceAndEvidence: retained,
    originalChangeRegister: retained["change-register.complete.json"],
    changeRegisterAmendment: evidence["change-register-amendment.json"],
    preservation: {
      otherSixProseBlocksExact: true, embeddedSourceSnapshotExact: true,
      identityExact: true, sectionBreaksExact: true, zeroOriginalTasks: true,
      ownedFig114ReferencesExact: true, FMTailExact: true,
      operatingRangeAndOtherPhysicalQualificationsExact: true,
      baseChangeRegisterExact: true, oldFAILHOLDBytesUntouched: true,
      previousFrozenAndWorkFilesUntouched: true,
    },
    textStructure: {
      status: check.status, invocations: 1,
      scope: "Only affected prose[0] native text/identity checks plus exact pointer-diff and unchanged-field assertions; not independent SCI/ZHEN.",
      receipt: evidence["affected-text-check.json"],
    },
    figureState: {
      id: "fig-114", status: "HOLD-modernfigure-imagebudget24",
      templateBytesUnchanged: true, modernFigureAuthored: false,
      modernFigureRendered: false, modernFigureOpened: false,
      modernFigureApproved: false, promotable: false,
    },
    nativeStages: {
      prepare: 0, finalize: 0, render: 0, display: 0,
      sourceReplay: 0, SCIReplay: 0, affectedTextStructureChecks: 1,
      normalizeOrProseFlowReruns: 0,
    },
    imageBudget: { imagesOpened: 0, cumulativeImageCount: 24, maximum: 24, remaining: 0 },
    pending: ["Original independent reviewer must consume this exact targeted repair; SCI/ZHEN HOLD is not self-approved.", "Modern fig114 and later full-native/display gates remain outside this repair."],
    notClaimed: { independentApproval: false, fullCardPASS: false, ready: false, finalized: false, complete: false },
    boundary: {
      writesOnlyUnder: own, imagesRead: false, browserUse: false,
      newAgentsWorktreesOrBranches: false, canonicalDBGitWrites: false,
      sharedToolEdits: false, priorStageReruns: false, rollbackOrCleanup: false,
    },
    evidence, authorTools: tools,
  });
  fs.writeFileSync(path.join(own, "author-freeze.sha256"), `${hash(manifest)}  author-freeze.json\n`, { flag: "wx" });
  console.log(JSON.stringify({ authorFreeze: record(manifest), zh: after.zh.lesson, en: after.en.lesson, status: "author-repair-only-review-pending", imagesOpened: 0, cumulativeImageCount: 24 }, null, 2));
}

const action = process.argv[2];
assert(["snapshot", "freeze"].includes(action));
({ snapshot, freeze })[action]();
