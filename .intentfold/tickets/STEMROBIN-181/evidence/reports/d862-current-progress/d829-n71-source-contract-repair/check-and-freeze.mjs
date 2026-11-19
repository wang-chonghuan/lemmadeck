import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), R);
const O = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp/d829-n71-source-contract-repair");
const D = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp/d822-n71-first-bilingual-native");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => {
  assert.ok(fs.realpathSync(p).startsWith(`${R}/`));
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length, mode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, "0") };
};
const write = (name, value) => fs.writeFileSync(path.join(O, name),
  `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const baseline = read(path.join(O, "input-baseline.json"));
const sharedMetadataPaths = [
  path.join(R, ".intentfold/tickets/STEMROBIN-181/evidence/index.json"),
  path.join(R, ".intentfold/tickets/STEMROBIN-181/production-meter.json"),
];
const sharedMetadataObserved = baseline.protectedFiles.filter((b) => sharedMetadataPaths.includes(b.path))
  .map((b) => ({ before: b, observedAtFreeze: hash(b.path),
    byteUnchanged: hash(b.path).sha256 === b.sha256, writtenByThisPreparation: false }));
const protectedFiles = baseline.protectedFiles.filter((b) => !sharedMetadataPaths.includes(b.path)).map((b) => {
  const current = hash(b.path);
  assert.equal(current.sha256, b.sha256, `Protected input changed during preparation: ${b.path}`);
  return { ...current, unchanged: true };
});
function differences(before, after, pointer = "") {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (before && after && typeof before === "object" && typeof after === "object" &&
    Array.isArray(before) === Array.isArray(after)) {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap((key) =>
      differences(before[key], after[key],
        `${pointer}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`));
  }
  return [{ pointer, before, after }];
}
const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((m) => {
  const value = m[1] ?? m[2];
  assert.ok(!/\\text\{|\\mathrm\{|[、，；。？！：]/u.test(value),
    "n71 direct inventory must not silently approximate a math-signature alias");
  return value.trim();
});
const multiset = (tokens) => Object.fromEntries([...new Set(tokens)].sort()
  .map((t) => [t, tokens.filter((v) => v === t).length]));
const withoutMath = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, "");
const figureReferences = (text) => [...new Set([...withoutMath(text)
  .matchAll(/(?:图\s*\.?\s*|Figures?\s+)(\d+)(?!\d)/gi)].map((m) => m[1]))].sort();
const otherNumbers = (text) => withoutMath(text)
  .replace(/(?:图\s*\.?\s*|Figures?\s+)(\d+)(?!\d)/gi, "").match(/\d+/g) ?? [];
const proseIndices = [1, 4, 6, 12];
const fieldDiffs = [];
const inventories = [];
const candidateFiles = [];
for (const binding of baseline.writableCopies) {
  const before = read(binding.input.path);
  const candidate = read(binding.output);
  const raw = read(binding.source.path);
  const delta = differences(before, candidate);
  const expectedPointers = binding.kind === "lesson"
    ? proseIndices.map((i) => `/prose/${i}/text`)
    : [0, 1, 2].map((i) => `/exercises/${i}/group`);
  assert.deepEqual(delta.map((d) => d.pointer).sort(), expectedPointers.sort());
  assert.deepEqual(candidate.source, before.source);
  assert.deepEqual(candidate.source.data, raw);
  assert.equal(candidate.source.sha256, binding.source.sha256);
  if (binding.kind === "lesson") {
    assert.equal(candidate.prose.length, raw.prose.length);
    candidate.prose.forEach((block, index) => {
      assert.equal(block.source_text, raw.prose[index].text);
      const sourceMath = math(raw.prose[index].text);
      const candidateMath = math(block.text);
      assert.deepEqual(candidateMath, sourceMath, `${binding.locale} prose ${index}`);
      assert.deepEqual(multiset(candidateMath), multiset(sourceMath));
      assert.deepEqual(figureReferences(block.text), figureReferences(raw.prose[index].text));
      assert.deepEqual(otherNumbers(block.text), otherNumbers(raw.prose[index].text));
      inventories.push({ locale: binding.locale, kind: "prose", index,
        sourceMathTokens: sourceMath, inheritedMathTokens: math(before.prose[index].text),
        candidateMathTokens: candidateMath, sourceMathMultiset: multiset(sourceMath),
        candidateMathMultiset: multiset(candidateMath),
        sourceFigureReferences: figureReferences(raw.prose[index].text),
        inheritedFigureReferences: figureReferences(before.prose[index].text),
        candidateFigureReferences: figureReferences(block.text),
        orderedMathTokensEqual: true, mathMultisetsEqual: true,
        figureReferenceSetsEqual: true, nonReferenceNumbersEqual: true,
        sourceTextUnchanged: true, affected: proseIndices.includes(index) });
    });
  } else {
    assert.equal(candidate.exercises.length, raw.exercises.length);
    candidate.exercises.forEach((exercise, index) => {
      const identity = ["number", "source_number", "group", "group_id", "figure_refs", "figures"];
      for (const key of identity) assert.deepEqual(exercise[key], raw.exercises[index][key]);
      assert.equal(exercise.source_text, raw.exercises[index].text);
      assert.equal(exercise.text, before.exercises[index].text);
      assert.deepEqual(exercise.lines, before.exercises[index].lines);
      assert.deepEqual(exercise.pages, before.exercises[index].pages);
      inventories.push({ locale: binding.locale, kind: "exercise", index,
        sourceGroup: raw.exercises[index].group, inheritedGroup: before.exercises[index].group,
        candidateGroup: exercise.group, groupId: exercise.group_id,
        identityFieldsEqual: true, exerciseTextUnchanged: true, sourceTextUnchanged: true });
    });
  }
  for (const diff of delta) {
    fieldDiffs.push({ locale: binding.locale, kind: binding.kind, file: binding.output,
      inheritedFile: binding.input.path, ...diff,
      reason: binding.kind === "exercises" ? "Restore exact authoritative source group identity" :
        diff.pointer === "/prose/4/text" ? "Restore source figure reference 144" :
          diff.pointer === "/prose/6/text" ? "Remove redundant standalone center label while retaining curvature-center wording" :
            diff.pointer === "/prose/12/text" ? "Restore third source image-point token" :
              "Retain one incident-ray token and the named reflected path, replacing repeated labels with prose",
      review: "AFFECTED_SCI_ZHEN_REVIEW_PENDING; identity fields also need separate affected review" });
  }
  candidateFiles.push({ locale: binding.locale, kind: binding.kind, candidate: hash(binding.output),
    inherited: binding.input, approved: binding.approved, source: binding.source,
    sourceBindingUnchanged: true, sourceTextUnchanged: true,
    untouchedFieldsEqual: true, changedFields: delta.length });
}
assert.equal(fieldDiffs.length, 14);
const metadata = read(path.join(D, "metadata-only-candidate-changes.json"));
const candidateEnglish = read(path.join(O, "en/phy10-c2-s2-n71/lesson.template.json"));
for (const change of metadata.changes) {
  let value = candidateEnglish;
  for (const part of change.pointer.slice(1).split("/")) value = value[part];
  assert.deepEqual(value, change.after);
}
assert.equal(metadata.changes.length, 8);
const lookup = read(path.join(O, "choice-seed-lookup.json"));
assert.ok(lookup.targets.every((t) => t.status ===
  "MISSING_EXACT_REVIEWED_SEED_BYTES_AND_FROZEN_SEED_OBJECT"));
const currentIndex = read(sharedMetadataPaths[0]);
const seedBindingsAtFreeze = lookup.targets.map((target) => {
  const matching = currentIndex.reports.filter((b) => b.sha256 === target.expected.sha256);
  assert.equal(matching.length, 1);
  assert.equal(path.join(R, matching[0].originalPath), target.expected.path);
  assert.equal(path.join(R, matching[0].path), target.locationsChecked[1].path);
  for (const location of target.locationsChecked) assert.equal(fs.existsSync(location.path), false);
  return { locale: target.locale, package: target.package, indexEntry: matching[0],
    exactPathsRemainAbsent: true, exactSeedIndexBindingUnchanged: true };
});
write("candidate-field-diffs.json", {
  schema: "d829-candidate-field-diffs@1", status: "AFFECTED_REVIEW_PENDING",
  newFieldDiffs: fieldDiffs, inheritedMetadataChanges: metadata,
  newTranslationApproval: false, nativeOrSemanticGatePassed: false,
});
write("contract-inventory.json", {
  schema: "d829-n71-direct-contract-inventory@1",
  qualification: "Direct offline source-token/reference/identity inventory, not a production validator invocation, native pass or semantic review",
  inventories, candidateFiles, protectedFiles, sharedMetadataObserved, seedBindingsAtFreeze,
  assertions: {
    affectedFieldDiffCount: 14, proseTextDiffCount: 8, groupIdentityDiffCount: 6,
    exactOrderedSourceMathPreservedInAll28ProseBlocks: true,
    sourceMathMultisetsPreserved: true, reference144RestoredInBothLocales: true,
    allSixExerciseIdentitiesEqualSource: true, noOtherTemplateFieldDiffs: true,
    all102BoundTextualInputsByteUnchanged: true,
    concurrentSharedIndexMeterChangesPreservedWithoutOurWrites: true,
    inheritedEightMetadataCandidatesUnchanged: true,
  },
  nativeStagesRun: 0, imageLoads: 0, paidCalls: 0,
});
write("report.json", {
  schema: "d829-n71-source-contract-repair-preparation@1",
  ticket: "STEMROBIN-181/181-3", card: "phy10-c2-s2-n71",
  status: "FROZEN_PREPARATION_AFFECTED_REVIEW_PENDING_FOUR_EXACT_SEEDS_MISSING",
  root: R, writeRoot: O, candidateFiles,
  candidateFieldDiffs: path.join(O, "candidate-field-diffs.json"),
  codeContractFindings: path.join(O, "code-contract-findings.md"),
  contractInventory: path.join(O, "contract-inventory.json"),
  seedLookup: path.join(O, "choice-seed-lookup.json"),
  preparationCheckFailure: path.join(O, "first-preparation-check-failure.json"),
  concurrency: {
    boundTextualInputCount: protectedFiles.length, boundTextualInputsUnchanged: true,
    sharedMetadataObserved, seedBindingsAtFreeze,
    indexMeterUnchangedClaim: false, indexMeterWrittenByThisPreparation: false,
    qualification: "Shared index and meter changed concurrently. Their before/observed hashes are retained; no changes are reverted. The exact four seed bindings and all content/code/review bindings remain unchanged.",
  },
  seedStatus: lookup.targets.map((t) => ({
    locale: t.locale, package: t.package, status: t.status, expected: t.expected,
    durablePath: t.locationsChecked[1].path,
    approvedCanonicalDigest: t.approvedCanonicalDigest, foundPaths: [],
  })),
  contentRevisionAccounting: {
    unit: "One bilingual n71 ordinary source-contract text repair round after the frozen d432/d433 text baseline",
    newBilingualTextRepairRounds: 1, cumulativeInThisPreparation: 1,
    priorD822ApprovedProseExerciseTextEdits: 0, d433RequiredLiteralCorrections: 0,
    changedLocalizedProseFields: 8, changedGroupIdentityFields: 6,
    changedTemplateSnapshots: 4, inheritedMetadataFields: 8,
    affectedLocalizedFieldsSinceD432IncludingInheritedMetadata: 22,
    approvedNewRepairRounds: 0, cumulativeGlobalTicketContentRevisions: null,
    globalQualification: "No global historical revision total is inferred or written into the meter",
    inheritedN71FigureRepairRounds: 3, newFigureRepairs: 0,
    newSourceRevisions: 0, newAnswerRevisions: 0, newChoiceRevisions: 0,
  },
  reviewDisposition: {
    affected: {
      proseIndices, locales: ["zh", "en"], sourceGroupFields: [0, 1, 2],
      SCI: "SEPARATE_AFFECTED_REVIEW_PENDING", ZHEN: "SEPARATE_AFFECTED_REVIEW_PENDING",
      inheritedEnglishMetadata: "SEPARATE_AFFECTED_REVIEW_PENDING_UNCHANGED",
      selfCertifiedApproval: false,
    },
    inherited: read(path.join(D, "report.final.json")).inherited,
    qualification: "All inherited passes remain bound to their unchanged original snapshots; no inherited whole-snapshot pass is relabeled as approval of these revised candidates",
  },
  unresolved: [
    "Separate affected review of revised prose/group fields and inherited English metadata",
    "Missing exact zh/en q12/q3 reviewed seed bytes; no reconstruction or preparation",
    "Populated group display has no existing English mapper in the inspected path; stable source identity is retained",
    "Restored textual reference 144 does not attach/display/approve figure 144",
    "Native, adapt, render, answer and interaction stages and parent FIRST DISPLAY remain unrun",
  ],
  newUsage: {
    imageLoads: 0, imageCaptures: 0, paidCalls: 0, paidGenerationCostUsd: 0,
    nativeCalls: 0, adaptCalls: 0, renderCalls: 0, figureRenders: 0,
    semanticReviewCalls: 0, sourceEdits: 0, validatorEdits: 0,
    seedPreparations: 0, seedReconstructions: 0, seedsWritten: 0,
    canonicalWrites: 0, indexWrites: 0, meterWrites: 0, gitMutations: 0,
    databaseOperations: 0, publisherCalls: 0, deploys: 0,
    branchesCreated: 0, worktreesCreated: 0, otherCheckoutReads: 0,
    outgoingChatMessages: 0, fullTests: 0, builds: 0,
    offlinePreparationCheckFailures: 1, offlinePreparationCheckRecoveryCalls: 1,
    contentRepairReplays: 0,
    hostTokens: null, hostCostUsd: null,
    hostUsageQualification: "Host token/cost usage not exposed; unknown is not zero",
  },
  cumulativeUsage: baseline.inheritedD822Usage,
  boundContentCodeReviewInputsUnchanged: true,
  allObservedFilesByteUnchanged: false, completeCard: false, readyForFirstDisplay: false,
  freeze: "Hash-bound preparation packet; candidate copies remain mode 0644 for later explicitly authorized work. All non-candidate packet files are sealed 0444. No stage is dispatched.",
});
const packetFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.isFile()) {
      if (!p.endsWith(".template.json")) fs.chmodSync(p, 0o444);
      packetFiles.push(hash(p));
    } else throw new Error(`Unexpected nonregular packet entry: ${p}`);
  }
}
walk(O);
write("frozen-manifest.json", {
  schema: "d829-frozen-manifest@1", status: "FROZEN_AND_STOPPED",
  root: R, writeRoot: O, files: packetFiles.sort((a, b) => a.path.localeCompare(b.path)),
  report: hash(path.join(O, "report.json")), manifestExcludesSelf: true,
  candidateMode: "0644", nonCandidateMode: "0444", stagesAuthorizedOrScheduled: false,
  imageLoads: 0, paidCalls: 0,
});
fs.chmodSync(path.join(O, "frozen-manifest.json"), 0o444);
console.log(JSON.stringify({ status: "FROZEN_AND_STOPPED", candidateTemplates: 4,
  affectedFields: fieldDiffs.length, protectedInputsUnchanged: protectedFiles.length,
  orderedTokensAndReferenceInventory: "MATCH_SOURCE_NOT_A_NATIVE_PASS",
  missingExactSeeds: 4, contentRepairRounds: 1, imageLoads: 0, paidCalls: 0,
  report: hash(path.join(O, "report.json")),
  frozenManifest: hash(path.join(O, "frozen-manifest.json")) }));
