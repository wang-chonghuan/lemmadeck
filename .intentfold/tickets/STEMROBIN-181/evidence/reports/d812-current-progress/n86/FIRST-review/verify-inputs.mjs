import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp");
const out = path.join(tmp, "d805-n86-first-independent-text-review");
const author = path.join(tmp, "d798-n86-first-bilingual-text-author");
const source = path.join(tmp, "d793-reviews-consume-source230");
if (process.cwd() !== root) throw new Error("Wrong working directory");
const hashes = new Map();
const read = (file) => {
  if (!file.startsWith(root + "/")) throw new Error("Input outside sole root");
  const bytes = fs.readFileSync(file);
  hashes.set(file, crypto.createHash("sha256").update(bytes).digest("hex"));
  return bytes.toString("utf8");
};
const json = (file) => JSON.parse(read(file));
const expected = [
  [path.join(author, "author-freeze.json"), "fe0aa7ca135a8b7e337b95a1e84cb7c698c437552906ad61f04d9942e85d8ea9"],
  [path.join(author, "candidate/zh/lesson.template.json"), "8d190538364913dfe5fbfc0b9b371348671b083baa7b775089182e13f4c6783c"],
  [path.join(author, "candidate/en/lesson.template.json"), "89c77614b82469069f504fb57179f24fbb1c33ead8987e44df5396cafb91b49f"],
];
const freeze = json(expected[0][0]);
const preparation = json(path.join(source, "n86-preparation.json"));
const requirements = json(path.join(source, "n86-preauthor-source-requirements.json"));
const raw = json(path.join(root, preparation.rawLesson.path));
const exercises = json(path.join(root, preparation.rawExercises.path));
const n85 = json(path.join(source, "root/10p/lessons/phy10-c2-s3-n85/lesson.json"));
const page228 = json(path.join(source, "root/10p/pages/0228/page.json"));
read(path.join(source, "root/10p/pages/0228/page.md"));
const checks = [];
const check = (label, passed) => {
  checks.push({ label, passed: Boolean(passed) });
};
for (const binding of [preparation.frozenRequirements, preparation.rawLesson, preparation.rawExercises]) {
  read(path.join(root, binding.path));
  check("preparation binding: " + binding.path, hashes.get(path.join(root, binding.path)) === binding.sha256);
}
for (const binding of [
  ...freeze.candidates, ...freeze.firstCandidates, ...freeze.nativeReceipts,
  ...freeze.flowReceipts, freeze.actualCalls, freeze.inputManifest,
  freeze.unchangedInputManifest, freeze.sourceMapping,
]) {
  read(binding.path);
  check("author freeze binding: " + binding.path, hashes.get(binding.path) === binding.sha256);
}
for (const file of [
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
  ".intentfold/charter/product.md",
]) read(path.join(root, file));
const priorReviews = [
  ["229", "d778-source229-first-independent-review"],
  ["230", "d787-source230-first-independent-review"],
].map(([page, folder]) => {
  const file = path.join(tmp, folder, "review-report.json");
  const review = json(file);
  return { page, path: file, sha256: hashes.get(file), status: review.status };
});
const mathTokens = (text) => text.match(/\$[^$]*\$/g) || [];
const numbers = (text) => (text.replace(/\$[^$]*\$/g, "").match(/\d+(?:\.\d+)?/g) || []);
const locales = {};
for (const locale of ["zh", "en"]) {
  const file = path.join(author, "candidate", locale, "lesson.template.json");
  const candidate = json(file);
  const native = json(path.join(author, "native", locale + ".json"));
  const normalizedFile = path.join(author, "normalized", locale, "lesson.before-section-breaks.json");
  const normalized = json(normalizedFile);
  const firstFile = path.join(author, "first", locale, "lesson.template.json");
  check(locale + " native before hash", hashes.get(firstFile) === native.beforeSha256);
  check(locale + " native after hash", hashes.get(normalizedFile) === native.afterSha256);
  check(locale + " normalized prose unchanged in frozen candidate", isDeepStrictEqual(normalized.prose, candidate.prose));
  check(locale + " complete immutable raw snapshot", isDeepStrictEqual(candidate.source.data, raw));
  check(locale + " raw SHA binding", candidate.source.sha256 === preparation.rawLesson.sha256);
  check(locale + " raw prose count/order preserved", candidate.prose.length === raw.prose.length);
  check(locale + " saved native pass", native.status === "PASS-TEXT-CONSERVATION-ONLY" && native.errors.length === 0);
  const rows = candidate.prose.map((block, index) => {
    const original = raw.prose[index];
    const conserved = {
      identity: block.kind === original.kind && block.id === original.id &&
        block.label === original.label && block.printed_page === original.printed_page &&
        isDeepStrictEqual(block.source_refs, original.source_refs),
      sourceText: block.source_text === original.text,
      exactMathTokens: isDeepStrictEqual(mathTokens(block.text), mathTokens(original.text)),
      nonMathNumbersInOrder: isDeepStrictEqual(numbers(block.text), numbers(original.text)),
    };
    check(locale + " /prose/" + index + " conservation", Object.values(conserved).every(Boolean));
    return { index, pointer: "/prose/" + index, sourceRefs: block.source_refs, conserved,
      mathTokens: mathTokens(block.text), nonMathNumbers: numbers(block.text) };
  });
  const flowReceipts = ["adjacent-anchors", "resolved"].map((stage) => {
    const receiptFile = path.join(author, "flow", locale + "-" + stage + ".receipt.json");
    const receipt = json(receiptFile);
    check(locale + " saved flow exit: " + stage, receipt.exitCode === 0 && receipt.stderr === "");
    check(locale + " saved flow input: " + stage, stage === "resolved"
      ? hashes.get(receipt.before.path) === receipt.before.sha256
      : hashes.get(normalizedFile) === receipt.before.sha256);
    return { stage, path: receiptFile, sha256: hashes.get(receiptFile), exitCode: receipt.exitCode };
  });
  const flow = JSON.parse(json(path.join(author, "flow", locale + "-resolved.receipt.json")).stdout);
  check(locale + " section anchors equal saved native flow boundaries",
    isDeepStrictEqual(candidate.section_breaks, flow.boundaries.map(({ before, after }) => ({ before, after }))));
  check(locale + " flow paragraph text comes from frozen prose", flow.paragraphs.every((paragraph) =>
    candidate.prose[paragraph.blockIndex].text.includes(paragraph.text)));
  const adaptedExercises = json(path.join(author, "candidate", locale, "exercises.template.json"));
  check(locale + " zero source exercises", adaptedExercises.count === 0 &&
    adaptedExercises.exercises.length === 0 && isDeepStrictEqual(adaptedExercises.source.data, exercises));
  locales[locale] = { candidate: file, sha256: hashes.get(file), rows,
    savedNative: { status: native.status, normalizeCalls: native.normalizeCalls,
      validateTextCalls: native.validateTextCalls, receiptReplayed: false },
    flowReceipts, resolvedBreaks: flow.resolvedBreaks, paragraphs: flow.paragraphs.length };
}
for (const [file, sha256] of expected) check("human supplied SHA: " + file, hashes.get(file) === sha256);
const footnoteOwners = [n85, raw].flatMap((lesson) => lesson.prose.flatMap((block, index) =>
  block.source_refs.includes("p0228#10") ? [{ card: lesson.id, pointer: "/prose/" + index,
    label: block.label, sourceRefs: block.source_refs }] : []));
check("footnote retained only by n85", footnoteOwners.length === 1 &&
  footnoteOwners[0].card === "phy10-c2-s3-n85" && footnoteOwners[0].label === "footnote");
const evidence = {
  schema: "STEMROBIN-181/d805-input-integrity@1",
  root, scope: "Read-only structured hash, identity and saved-receipt checks; no native imports or pipeline.",
  expectedInputs: expected.map(([file, sha256]) => ({ path: file, expectedSha256: sha256, actualSha256: hashes.get(file) })),
  bindings: [...hashes].map(([file, sha256]) => ({ path: file, sha256 })),
  checks, allChecksPassed: checks.every((entry) => entry.passed), locales, priorReviews,
  frozenRangeBlockCount: requirements.blocks.length,
  frozenRangeBlockRefs: requirements.blocks.map((block) => block.ref),
  page228StructuredBlockCount: page228.blocks.length,
  footnoteOwners,
  actualNewNativeCalls: 0, actualNewFlowCalls: 0, imagesOpened: 0, paidCalls: 0,
};
fs.writeFileSync(path.join(out, "input-integrity.json"), JSON.stringify(evidence, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ allChecksPassed: evidence.allChecksPassed, checks: checks.length,
  failedChecks: checks.filter((entry) => !entry.passed), footnoteOwners,
  paragraphs: Object.fromEntries(Object.entries(locales).map(([locale, entry]) => [locale, entry.paragraphs])) }, null, 2));
if (!evidence.allChecksPassed) process.exitCode = 1;
