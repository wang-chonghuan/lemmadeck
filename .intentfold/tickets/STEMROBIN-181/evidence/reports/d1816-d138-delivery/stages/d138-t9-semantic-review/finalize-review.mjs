import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const own = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-semantic-review");
const author = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-choice-author");
const root = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d138/root/9p");
const repo = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d138/choice-repo");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const binding = file => {
  const bytes = fs.readFileSync(file);
  return {path: file, bytes: bytes.length, sha256: hash(bytes)};
};
const sorted = value => Array.isArray(value) ? value.map(sorted) :
  value !== null && typeof value === "object" ?
    Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])])) : value;
const canonical = value => JSON.stringify(sorted(value))
  .replace(/[\u007f-\uffff]/g, char => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
const report = read(path.join(own, "report-content.json"));
const projection = read(path.join(own, "visible-only.json"));
const source = read(path.join(own, "source-first-solutions.json"));
const findings = read(path.join(own, "view-first-findings.json"));
const ledger = read(path.join(own, "image-ledger.json"));
const guards = [];
const guard = (file, expected, subject) => {
  const actual = binding(file);
  guards.push({subject, ...actual, expectedSha256: expected, unchanged: actual.sha256 === expected});
  return actual;
};
const sourceFirst = guard(path.join(own, "source-first-solutions.json"), findings.sourceFirstSha256, "Independent source-first record");
const visibleFirst = guard(path.join(own, "visible-only.json"), findings.visibleProjectionSha256, "Visible-only reviewed projection");
const seed = guard(projection.seed.path, projection.seed.sha256, "Source seed");
seed.canonicalSha256 = hash(canonical(read(seed.path)));
const definitions = [
  guard(path.join(cwd, source.definition_context.path), source.definition_context.sha256, "Original n32 two-definition context"),
  guard(path.join(cwd, source.graph_definition_context.path), source.graph_definition_context.sha256, "Original n17 graph-definition source file")
];
const freezes = projection.authorFreezes.map(row => guard(row.path, row.sha256, "Author frozen snapshot"));
const choiceFreeze = read(path.join(author, "author-freeze.json"));
const answersFreeze = read(path.join(author, "answers-author-freeze.json"));
function findDeclared(value, file) {
  if (Array.isArray(value)) {
    for (const row of value) {
      const match = findDeclared(row, file);
      if (match) return match;
    }
  } else if (value && typeof value === "object") {
    if (value.path === file && typeof value.sha256 === "string") return value;
    for (const row of Object.values(value)) {
      const match = findDeclared(row, file);
      if (match) return match;
    }
  }
  return null;
}
const drafts = {};
const reviews = {};
const checkers = {};
const answers = {};
for (const [locale, edition] of [["zh", "modern-us-neutral"], ["en", "modern-us-neutral-en"]]) {
  const row = projection.locales[locale].draftBinding;
  drafts[locale] = {...guard(row.path, row.sha256, `${locale} actual reviewed draft`), canonicalSha256: row.canonicalSha256};
  const declared = findDeclared(choiceFreeze, row.path);
  guards.push({subject: `${locale} draft author-freeze binding`, unchanged: declared?.sha256 === row.sha256});
  const checkerPath = path.join(own, `checker.${locale}.json`);
  const receipt = read(checkerPath);
  reviews[locale] = guard(path.join(own, `review.${locale}.json`), receipt.reviewSha256, `${locale} completed native review`);
  checkers[locale] = {...binding(checkerPath), exitCode: receipt.exitCode, status: receipt.status, calls: receipt.checkerCallsForCompletedReview, executable: receipt.executable, argv: receipt.argv, stdout: receipt.stdout, stderr: receipt.stderr};
  const answerPath = path.join(root, "editions", edition, "lessons/phy9-c1-s3-t9/answer-keys.json");
  const declaredAnswer = findDeclared(answersFreeze, answerPath);
  if (!declaredAnswer) throw new Error("Answer not bound by author freeze");
  answers[locale] = {...guard(answerPath, declaredAnswer.sha256, `${locale} final displayed answers`), count: 6, grading: "all ungraded", parts: "all []"};
}
const originalBook = path.join(cwd, "ssot-resources/soviet10year-textbooks/artifacts/9p/answers.json");
const isolatedBook = path.join(root, "answers.json");
const bookHash = "34147dc31a875a83772d4f4974c02c35b5a33dc45c88bdd9f8bc22390c516039";
const bookBindings = [
  guard(originalBook, bookHash, "Actual canonical bookRaw source"),
  guard(isolatedBook, bookHash, "Unchanged isolated bookRaw source")
];
const rawEntries = read(originalBook).answers.filter(row => row.lesson === "phy9-c1-s3-t9");
const rawBindings = {};
for (const [locale, row] of Object.entries(answers)) {
  const document = read(row.path);
  rawBindings[locale] = document.answers.map(answer => {
    const book = rawEntries.find(entry => String(entry.exercise) === answer.exercise);
    return {
      exercise: answer.exercise,
      bookEntryPresent: Boolean(book),
      actualBookRaw: book?.raw ?? null,
      answerBookRaw: answer.bookRaw ?? null,
      exactMatch: book ? answer.bookRaw === book.raw : answer.bookRaw === undefined,
      grading: answer.grading,
      partsCount: answer.parts.length,
      displayAnswerSha256: hash(answer.displayAnswer)
    };
  });
  guards.push({
    subject: `${locale} six ungraded answers and actual bookRaw bindings`,
    unchanged: document.count === 6 && document.answers.length === 6 &&
      new Set(document.answers.map(answer => answer.exercise)).size === 6 &&
      rawBindings[locale].every(row => row.exactMatch && row.grading === "ungraded" && row.partsCount === 0)
  });
}
const englishPath = path.join(root, "editions/modern-us-neutral-en/lessons/phy9-c1-s3-t9/exercises.json");
const englishExpected = findDeclared(choiceFreeze, englishPath);
const englishBinding = guard(englishPath, englishExpected.sha256, "Affected-only English original Q2 input");
const englishDocument = read(englishPath);
const englishQ2 = englishDocument.exercises.find(row => String(row.number) === "2");
guards.push({
  subject: "Affected English original Q2 still exactly inspected sentence and figure references",
  unchanged: englishQ2.text === report.englishQ2AffectedCheck.currentEnglish &&
    JSON.stringify(englishQ2.figure_refs) === JSON.stringify(["fig-24", "fig-30"])
});
const figureBindings = ledger.entries.map(row => guard(path.join(cwd, row.path), row.sha256, `Actual image open ${row.order}`));
for (const figure of read(seed.path).figures) {
  const entry = figure.assets[0];
  figureBindings.push(guard(path.join(repo, entry.path), entry.sha256, `Seed ${figure.id} actual SVG`));
  const openedPreview = ledger.entries.find(row => row.svgSha256 === entry.sha256);
  figureBindings.push(guard(path.join(cwd, openedPreview.svg), entry.sha256, `${figure.id} SVG bound to actually opened preview`));
  for (const edition of ["modern-us-neutral", "modern-us-neutral-en"]) {
    figureBindings.push(guard(path.join(root, "editions", edition, "figures", `${figure.id}.svg`), entry.sha256, `${edition} answer-referenced ${figure.id} SVG`));
  }
}
report.date = "2026-11-20";
report.cwd = cwd;
report.bindings = {
  seed, drafts, authorFreezes: freezes, originalDefinitions: definitions,
  independentSourceFirst: sourceFirst,
  independentViewFirst: binding(path.join(own, "view-first-findings.json")),
  visibleOnly: visibleFirst, nativeReviews: reviews,
  checkerReceipts: checkers, finalAnswers: answers,
  canonicalBookRawSources: bookBindings,
  affectedEnglishQ2: englishBinding,
  actualOpenedAndReferencedFigureAssets: figureBindings,
  imageLedger: binding(path.join(own, "image-ledger.json"))
};
report.actualBookRawBindings = rawBindings;
report.snapshotGuard = {status: guards.every(row => row.unchanged) ? "pass" : "blocked", checks: guards};
report.checkerStatus = {
  zh: {status: checkers.zh.status, exitCode: checkers.zh.exitCode, calls: checkers.zh.calls},
  en: {status: checkers.en.status, exitCode: checkers.en.exitCode, calls: checkers.en.calls}
};
if (guards.some(row => !row.unchanged)) {
  report.status = "blocked";
  report.answersVerdict = "blocked";
  report.findings.push({id: "snapshot-changed", blocking: true, evidence: guards.filter(row => !row.unchanged)});
}
if (Object.values(checkers).some(row => row.exitCode !== 0)) {
  report.status = Object.values(checkers).some(row => row.exitCode === 2 || row.exitCode === null) ? "blocked" : "revise";
  report.findings.push({id: "checker-failure-preserved", blocking: true, evidence: report.checkerStatus});
}
const reportPath = path.join(own, "report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", {flag: "wx"});
const ownFiles = [
  "source-first-solutions.json", "view-first-findings.json", "visible-only.json",
  "review.zh.json", "review.en.json", "report.json",
  "image-ledger.json", "checker.zh.json", "checker.en.json",
  "project-visible.mjs", "build-en-review.mjs", "run-checker.mjs",
  "report-content.json", "finalize-review.mjs"
].map(name => binding(path.join(own, name)));
const frozen = {
  schema: "d138-t9-independent-semantic-review-freeze-v1",
  date: "2026-11-20", cwd, reviewer: source.reviewer, reviewerIsAuthor: false,
  status: report.status,
  englishQ2AffectedVerdict: report.englishQ2AffectedVerdict,
  answersVerdict: report.answersVerdict,
  seed_sha256: seed.canonicalSha256,
  draft_sha256: {zh: drafts.zh.canonicalSha256, en: drafts.en.canonicalSha256},
  sourceFirstAndViewFirstImmutable: true,
  files: ownFiles,
  inspectedInputs: {
    seed, drafts, authorFreezes: freezes, answers,
    originalDefinitions: definitions, bookRawSources: bookBindings,
    affectedEnglishQ2: englishBinding, figures: figureBindings
  },
  imageOpens: {batch: 1, count: 4, batchLimit: 8, total: 4, totalLimit: 24, parent: 0},
  checkers: report.checkerStatus,
  findings: report.findings,
  concreteAuthorFailures: report.concreteAuthorFailures,
  approvalBoundary: report.scope,
  noReviewerOrAuthorReruns: true,
  parentCollectsAndCloses: true
};
const freezePath = path.join(own, "review-freeze.json");
fs.writeFileSync(freezePath, JSON.stringify(frozen, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({
  status: report.status, englishQ2AffectedVerdict: report.englishQ2AffectedVerdict,
  answersVerdict: report.answersVerdict,
  snapshotGuard: report.snapshotGuard.status,
  checkers: report.checkerStatus,
  imageOpens: frozen.imageOpens,
  files: ownFiles.filter(row => ["source-first-solutions.json", "view-first-findings.json", "review.zh.json", "review.en.json", "report.json"].some(name => row.path.endsWith("/" + name))).concat(binding(freezePath)),
  findings: report.findings
}, null, 2));
