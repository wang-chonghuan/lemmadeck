import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {isDeepStrictEqual as equal} from "node:util";

const root = process.cwd();
const own = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d358-n151-first-text-review");
const base = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d351-n151-bilingual-author");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = x => crypto.createHash("sha256").update(x).digest("hex");
const bind = p => {
  const bytes = fs.readFileSync(p);
  return {path: path.resolve(p), bytes: bytes.length, sha256: hash(bytes)};
};
const pkgPath = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d357-n151-source-rebinding/input-freeze.json");
const pkg = read(pkgPath);
const priorFreeze = read(path.join(own, "input-freeze.json"));
const scienceFreeze = read(path.join(own, "primary-evidence.json"));
const raw = read(pkg.repairedSource.path);
const original = read(pkg.originalSource.path);
const exercise = read(pkg.exercises.path);
function differences(a, b, location = "") {
  if (equal(a, b)) return [];
  if (!a || !b || typeof a !== "object" || typeof b !== "object") {
    return [{path: location, before: a, after: b}];
  }
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
    differences(a[key], b[key], `${location}/${key}`));
}
const rawDifferences = differences(original, raw);
const expectedRaw = structuredClone(original);
expectedRaw.prose[3].text = original.prose[3].text.replace("绝对的固态：它们", "绝对的固态.它们");
expectedRaw.prose[12].text = original.prose[12].text.replace("要复杂；没有", "要复杂：没有");
const sourceBlockFacts = raw.prose.map((p, entry) => {
  const joined = p.source_refs.map(ref => {
    const [, page, block] = ref.match(/^p(\d+)#(\d+)$/);
    const pageData = read(`${pkg.root}/10p/pages/${page}/page.json`);
    return pageData.blocks[Number(block) - 1].lines.join("");
  }).join("");
  return {entry, refs: p.source_refs, textEqualsReferencedRowsIgnoringWhitespace: joined.replace(/\s/g, "") === p.text.replace(/\s/g, "")};
});
const authorFreeze = read(pkg.originalAuthorFreeze.path);
const authorReport = read(pkg.originalAuthorReport.path);
const locales = pkg.templates.map(item => {
  const author = read(item.author.path);
  const prepared = read(item.prepared.path);
  const rebound = read(item.rebound.path);
  const working = read(item.working.path);
  const expected = structuredClone(author);
  expected.source = structuredClone(prepared.source);
  expected.prose.forEach((p, entry) => { p.source_text = raw.prose[entry].text; });
  const flowPath = `${base}/layout/${item.edition}.prose-flow.receipt.json`;
  const flow = read(flowPath);
  const paragraphChecks = rebound.prose.map((p, entry) => {
    const paras = flow.paragraphs.filter(q => q.blockIndex === entry);
    return {entry, paragraphIndices: paras.map(q => q.index), retainedParagraphTextEqualsCurrent: paras.map(q => q.text).join("\n\n") === p.text};
  });
  const anchorChecks = rebound.section_breaks.map(anchor => {
    const matched = flow.boundaries.filter(b => b.before === anchor.before && b.after === anchor.after);
    return {anchor, matchingRetainedBoundaries: matched.map(b => b.index), uniqueAdjacentPair: matched.length === 1 && flow.paragraphs[matched[0].index - 1]?.text === anchor.before && flow.paragraphs[matched[0].index]?.text === anchor.after};
  });
  const perBlock = rebound.prose.map((p, entry) => {
    const source = raw.prose[entry];
    const formula = text => [...text.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
    const digits = text => [...text.replace(/\$[^$]+\$/g, "").matchAll(/\d+(?:\.\d+)?/g)].map(m => m[0]);
    return {
      entry,
      refs: p.source_refs,
      sourceTextMatchesRaw: p.source_text === source.text,
      sourceIdentityUnchanged: ["kind", "id", "label", "printed_page", "source_refs"].every(k => equal(p[k], source[k])),
      sourceFormulaSignature: formula(source.text),
      modernFormulaSignature: formula(p.text),
      formulasUnchanged: equal(formula(source.text), formula(p.text)),
      sourceDigitSignature: digits(source.text),
      modernDigitSignature: digits(p.text),
      digitsUnchanged: equal(digits(source.text), digits(p.text)),
      numericChanges: p.numeric_changes,
      historicalEntities: p.historical_entities.map(entity => ({
        ...entity,
        modernTermPresent: p.text.includes(entity.term),
        sourceTermPresent: source.text.includes(entity.source_term ?? entity.term),
        reasonNonempty: typeof entity.reason === "string" && entity.reason.trim().length > 0,
        reasonHasReferencedBlock: p.source_refs.some(ref => entity.reason.includes(ref)),
        englishAliasHasTranslationChange: item.locale !== "en" || p.changes.includes("translation")
      })),
      textSha256: hash(p.text),
      changes: p.changes
    };
  });
  const auxiliary = ["exercises.template.json", "figures.template.json"].map(filename => {
    const currentPath = path.join(path.dirname(item.working.path), filename);
    const oldPath = path.join(root, `.tmp/STEMROBIN-181/d1816-d350/source-work/adapt/10p/${item.edition}/lessons/phy10-c4-s1/${filename}`);
    const data = read(currentPath);
    return {
      current: bind(currentPath),
      originalAuthorWorking: bind(oldPath),
      bytesUnchanged: fs.readFileSync(currentPath).equals(fs.readFileSync(oldPath)),
      empty: filename.startsWith("figures") ? data.figures.length === 0 : data.count === 0 && data.exercises.length === 0,
      sourceSnapshotMatchesRawExercises: filename.startsWith("exercises") ? equal(data.source.data, exercise) && data.source.sha256 === bind(pkg.exercises.path).sha256 : null
    };
  });
  return {
    locale: item.locale,
    edition: item.edition,
    bindings: {author: bind(item.author.path), prepared: bind(item.prepared.path), rebound: bind(item.rebound.path), working: bind(item.working.path), flowReceipt: bind(flowPath)},
    fullReboundEqualsAuthorPlusOnlyPreparedSourceAndRawSourceText: equal(expected, rebound),
    workingBytesEqualRebound: fs.readFileSync(item.working.path).equals(fs.readFileSync(item.rebound.path)),
    sourceSnapshotEqualsRaw: equal(rebound.source.data, raw),
    sourceShaMatchesRawBytes: rebound.source.sha256 === bind(pkg.repairedSource.path).sha256,
    preparedSnapshotEqualsRaw: equal(prepared.source.data, raw),
    exactRebindDifferences: differences(author, rebound),
    changedSourceTextEntries: author.prose.flatMap((p, entry) => p.source_text === rebound.prose[entry].source_text ? [] : [entry]),
    metadata: Object.fromEntries(Object.entries(rebound).filter(([key]) => !["prose", "source", "section_breaks"].includes(key))),
    fixedIdentityMatchesRaw: ["id", "card_id", "section", "number", "start_page", "start_printed", "figures", "exercise_count"].every(k => equal(rebound[k], raw[k])),
    headingsConformToRequestedContract: item.locale === "zh" ? ["title", "chapter", "printed_title"].every(k => rebound[k] === raw[k]) : ["title", "chapter", "printed_title"].every(k => typeof rebound[k] === "string" && rebound[k].trim() && !/[\u3400-\u9fff\u0400-\u04ff]/u.test(rebound[k])) && equal(rebound.printed_title.match(/\d+(?:\.\d+)?/g), raw.printed_title.match(/\d+(?:\.\d+)?/g)),
    perBlock,
    finalFlow: {
      method: "Reuse successful D351 actual final prose_flow receipt; current modern prose and anchors are exactly unchanged. No new prose_flow or normalizer invocation.",
      exitCode: flow.exitCode,
      templateHashMatchesOriginalAuthorSnapshot: flow.template.sha256 === bind(item.author.path).sha256,
      paragraphCount: flow.paragraphs.length,
      resolvedBreaks: flow.resolvedBreaks,
      paragraphChecks,
      anchorChecks
    },
    auxiliary
  };
});
const retainedAuthorEvidence = [
  "author-freeze.json", "report.json", "technical-recovery.json",
  "text-contract.receipt.json", "text-contract.first-failure.receipt.json",
  "first-candidate/modern-us-neutral/lesson.template.json",
  "first-candidate/modern-us-neutral-en/lesson.template.json"
].map(p => bind(path.join(base, p)));
const retainedSourceReviews = [
  ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d346-source392-393-review/report.json",
  ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d349-source390391-affected-review/report.json",
  ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d356-source388390-affected-review/report.json"
].map(p => bind(path.join(root, p)));
const authorReceiptPaths = [
  ...authorFreeze.layoutReceipts,
  ...authorFreeze.firstCandidateSnapshots,
  authorFreeze.localContractReceipt,
  authorFreeze.usage.technicalRecovery,
  authorFreeze.gates.EnglishMetadataContractCompatibility.firstFailureReceipt
];
const boundAuthorEvidence = authorReceiptPaths.map(b => ({...bind(b.path), declaredSha256: b.sha256, matches: bind(b.path).sha256 === b.sha256}));
const freshBindings = priorFreeze.declaredBindings.map(b => ({...bind(b.path), frozenSha256: b.sha256, unchanged: bind(b.path).sha256 === b.sha256}));
const evidenceFresh = scienceFreeze.references.map(ref => ({
  id: ref.id,
  receiptUnchanged: bind(ref.receipt.path).sha256 === ref.receipt.sha256,
  stdoutUnchanged: ref.stdout ? bind(ref.stdout.path).sha256 === ref.stdout.sha256 : null
}));
const output = {
  schema: "stemrobin181/first-text-binding-observations@1",
  stage: "D358",
  observedAtUtc: new Date().toISOString(),
  rawDifferences,
  rawEqualsOriginalPlusExactlyTwoApprovedMarks: equal(raw, expectedRaw),
  exerciseUnchangedFromAuthorFreeze: bind(pkg.exercises.path).sha256 === authorFreeze.originalExercises.sha256,
  sourceBlockFacts,
  locales,
  retainedAuthorEvidence,
  boundAuthorEvidence,
  authorRevisionHistoryRetained: authorReport.usage,
  retainedSourceReviews,
  currentD361IdentityCode: bind(path.join(root, ".claude/skills/ld-s10y-lesson/tools/edition.py")),
  freshBindings,
  evidenceFresh,
  allPackageBindingsUnchangedSinceIndependentInputFreeze: freshBindings.every(b => b.unchanged),
  allRetainedAuthorEvidenceMatches: boundAuthorEvidence.every(b => b.matches),
  limitations: [
    "D351 EN chapter/printed_title validator failures remain retained history. D361 current code has been read, not executed or certified by this reviewer.",
    "Source page JSON reads are limited to lesson-bound blocks and hash evidence; no wholepage source rereview.",
    "Formula/digit comparison is read-only evidence for this equation-light card, not a second whole SCI pass or renderer check.",
    "This script writes only this review directory."
  ]
};
fs.writeFileSync(path.join(own, "comparison-observations.json"), JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({
  rawExactlyTwoApprovedMarks: output.rawEqualsOriginalPlusExactlyTwoApprovedMarks,
  sourceRowsAllMatch: sourceBlockFacts.every(b => b.textEqualsReferencedRowsIgnoringWhitespace),
  allPackageBindingsUnchanged: output.allPackageBindingsUnchangedSinceIndependentInputFreeze,
  allAuthorEvidenceMatches: output.allRetainedAuthorEvidenceMatches,
  locales: locales.map(l => ({
    locale: l.locale,
    exactRebind: l.fullReboundEqualsAuthorPlusOnlyPreparedSourceAndRawSourceText,
    changedSourceTextEntries: l.changedSourceTextEntries,
    sourceSnapshotMatches: l.sourceSnapshotEqualsRaw,
    allBlockIdentitiesFormulasDigitsMatch: l.perBlock.every(b => b.sourceTextMatchesRaw && b.sourceIdentityUnchanged && b.formulasUnchanged && b.digitsUnchanged),
    allParagraphsMatch: l.finalFlow.paragraphChecks.every(b => b.retainedParagraphTextEqualsCurrent),
    allAnchorsMatch: l.finalFlow.anchorChecks.every(b => b.uniqueAdjacentPair),
    paragraphCount: l.finalFlow.paragraphCount,
    auxiliaryUnchanged: l.auxiliary.every(a => a.bytesUnchanged && a.empty)
  })),
  output: bind(path.join(own, "comparison-observations.json"))
}, null, 2));
