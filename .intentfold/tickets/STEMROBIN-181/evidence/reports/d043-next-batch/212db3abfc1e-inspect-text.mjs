import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const complete = path.join(path.dirname(evidence), "d042-10p-n36-author/complete");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const compact = (text) => text.replace(/\s+/g, "");
const sourcePage = (n) => path.join(workspace, `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${String(n).padStart(4, "0")}/page.json`);
const pages = new Map([95, 101, 102, 103, 104].map((n) => [n, read(sourcePage(n))]));
const raw = read(path.join(complete, "frozen/raw/lesson.json"));
const exercises = read(path.join(complete, "frozen/raw/exercises.json"));
const texts = read(path.join(complete, "texts.json"));
const start = pages.get(101).blocks.findIndex((b) => b.kind === "h3" && b.lines.join("").startsWith("36."));
if (start < 0) throw new Error("Canonical n36 heading missing.");
const canonicalProse = [];
const canonicalQuestions = [];
let exerciseHeading;
for (const n of [101, 102]) {
  pages.get(n).blocks.forEach((b, i) => {
    if (n === 101 && i <= start) return;
    const ref = `p${String(n).padStart(4, "0")}#${i + 1}`;
    if (b.kind === "p") {
      const item = { refs: [ref], text: b.lines.join("\n"), kind: b.kind, open: b.open };
      if (b.cont) {
        const previous = canonicalProse.at(-1);
        if (!previous?.open) throw new Error(`Unbound continuation: ${ref}`);
        previous.refs.push(ref);
        previous.text += "\n" + item.text;
        previous.open = b.open;
      } else canonicalProse.push(item);
    }
    if (b.kind === "exhead") exerciseHeading = { ref, text: b.lines.join("\n") };
    if (b.kind === "ex") canonicalQuestions.push({ ref, number: b.label, text: b.lines.join("\n") });
  });
}
const checks = [];
function check(name, passed) {
  checks.push({ name, passed: !!passed });
}
check("eight-canonical-prose-objects-and-four-canonical-questions", canonicalProse.length === 8 && canonicalQuestions.length === 4);
check("raw-prose-count-equals-canonical", raw.prose.length === canonicalProse.length);
check("raw-question-count-equals-canonical", exercises.count === 4 && exercises.exercises.length === canonicalQuestions.length);
check("all-prose-closed-at-right-boundary", canonicalProse.every((b) => !b.open));
check("native-raw-title-matches-canonical-heading", raw.printed_title === pages.get(101).blocks[start].lines.join(""));
const proseCoverage = canonicalProse.map((b, i) => {
  const r = raw.prose[i];
  const reconstructs = compact(b.text) === compact(r.text);
  const refsEqual = isDeepStrictEqual(b.refs, r.source_refs);
  check(`raw-prose-${i}-canonical-text-and-refs`, reconstructs && refsEqual);
  return { blockIndex0: i, canonicalSourceRefs: b.refs, canonicalText: b.text, rawText: r.text, rawReconstructsIgnoringLayoutWhitespace: reconstructs, rawSourceRefsEqual: refsEqual };
});
const questionCoverage = canonicalQuestions.map((b, i) => {
  const r = exercises.exercises[i];
  const matches = r.text === b.text && r.source_number === b.number && isDeepStrictEqual(r.pages, [b.ref]);
  check(`raw-question-${i}-canonical-text-number-and-ref`, matches);
  return { exerciseIndex0: i, sourceRef: b.ref, canonicalText: b.text, raw: r, canonicalMatches: matches };
});
const forbidden = new Set(["answer", "answers", "accept", "choices", "options", "correct_index", "correctIndex", "choiceSet", "choice_set", "interaction", "interactions", "input", "inputs", "solution", "solutions"]);
function answerFields(value, pointer = "") {
  const result = [];
  if (!value || typeof value !== "object") return result;
  for (const [key, child] of Object.entries(value)) {
    const location = `${pointer}/${key}`;
    if (forbidden.has(key)) result.push(location);
    result.push(...answerFields(child, location));
  }
  return result;
}
const languageReviews = ["zh", "en"].map((language) => {
  const base = path.join(complete, `${language}/work/adapt/10p/modern-us-neutral/lessons/phy10-c1-s4-n36`);
  const lp = path.join(base, "lesson.template.json");
  const ep = path.join(base, "exercises.template.json");
  const fp = path.join(base, "figures.template.json");
  const lesson = read(lp), questions = read(ep), figures = read(fp);
  const flow = read(path.join(complete, `prose-flow-${language}.json`));
  const display = read(path.join(complete, `${language}/question-display.json`));
  const title = read(path.join(complete, `${language}/display-title.json`));
  check(`${language}-lesson-source-snapshot-and-sha`, isDeepStrictEqual(lesson.source.data, raw) && lesson.source.sha256 === hash(path.join(complete, "frozen/raw/lesson.json")));
  check(`${language}-exercise-source-snapshot-and-sha`, isDeepStrictEqual(questions.source.data, exercises) && questions.source.sha256 === hash(path.join(complete, "frozen/raw/exercises.json")));
  check(`${language}-eight-prose-and-four-questions`, lesson.prose.length === 8 && questions.count === 4 && questions.exercises.length === 4);
  check(`${language}-no-owned-or-imported-figures`, figures.figures.length === 0 && lesson.figures.length === 0 && questions.exercises.every((q) => q.figures.length === 0 && q.figure_refs.length === 0));
  lesson.prose.forEach((b, i) => {
    check(`${language}-prose-${i}-source-text-refs-identity`, b.source_text === raw.prose[i].text && isDeepStrictEqual(b.source_refs, raw.prose[i].source_refs) && b.kind === raw.prose[i].kind && b.printed_page === raw.prose[i].printed_page);
    check(`${language}-prose-${i}-author-stream-layout-only`, compact(b.text) === compact(texts.prose[i][language]));
    proseCoverage[i][language] = { templatePath: lp, pointer: `/prose/${i}/text`, text: b.text, sourceText: b.source_text, sourceRefs: b.source_refs };
  });
  questions.exercises.forEach((q, i) => {
    const r = exercises.exercises[i];
    check(`${language}-question-${i}-source-text-refs-identity`, q.source_text === r.text && ["number", "source_number", "group", "group_id", "pages"].every((k) => isDeepStrictEqual(q[k], r[k])));
    check(`${language}-question-${i}-sidecar-and-stream`, q.text === texts.questions[i][language] && q.text === display.questions[i].text && q.lines.join("\n") === q.text);
    questionCoverage[i][language] = { templatePath: ep, pointer: `/exercises/${i}/text`, text: q.text, changes: q.changes };
  });
  check(`${language}-unsolved-and-no-added-controls`, answerFields(questions).length === 0 && answerFields(display.questions).length === 0 && display.mode === "read-only" && display.legacyInputInteractions === false && display.independentAnswers === "pending" && display.choiceCreation === "pending");
  check(`${language}-display-sidecar-binding`, display.binding.path === ep && display.binding.sha256 === hash(ep) && title.validatedTemplate.path === lp && title.validatedTemplate.sha256 === hash(lp));
  check(`${language}-title-native-identity-and-localized-sidecar`, lesson.title === raw.title && lesson.printed_title === raw.printed_title && title.title === texts.displayTitle[language] && title.printed_title === `36. ${title.title}`);
  const derivedFlow = lesson.prose.flatMap((b, blockIndex) => b.text.split(/\n\s*\n/).map((text, paragraphInBlock) => ({ blockIndex, paragraphInBlock, text })));
  check(`${language}-frozen-flow-matches-template-paragraphs`, isDeepStrictEqual(derivedFlow, flow.paragraphs.map(({ blockIndex, paragraphInBlock, text }) => ({ blockIndex, paragraphInBlock, text }))));
  const boundaries = flow.resolvedBreaks.map((i) => ({ before: flow.paragraphs[i - 1].text, after: flow.paragraphs[i].text }));
  check(`${language}-section-breaks-bind-actual-adjacent-paragraphs`, isDeepStrictEqual(boundaries, lesson.section_breaks));
  const body = flow.paragraphs.map((p, i) => `${flow.resolvedBreaks.includes(i) ? "---\n\n" : ""}${p.text}`).join("\n\n");
  const md = `# ${title.printed_title}\n\n${body}\n\n## ${display.displayGroup}\n\n${display.questions.map((q) => q.text).join("\n\n")}\n`;
  check(`${language}-markdown-exact-flow-title-and-unsolved-questions`, md === fs.readFileSync(path.join(complete, `lesson-${language}.md`), "utf8"));
  return {
    language, lessonTemplate: { path: lp, sha256: hash(lp) }, exercisesTemplate: { path: ep, sha256: hash(ep) }, figuresTemplate: { path: fp, sha256: hash(fp) },
    paragraphCount: flow.paragraphs.length, resolvedBreaks: flow.resolvedBreaks,
    paragraphs: flow.paragraphs.map((p) => ({ ...p, endsInSemicolon: /[;；]$/.test(p.text), startsLowercase: /^[a-z]/.test(p.text) })),
    semicolonAtParagraphEndIndices0: flow.paragraphs.filter((p) => /[;；]$/.test(p.text)).map((p) => p.index),
    lowercaseParagraphStartIndices0: flow.paragraphs.filter((p) => /^[a-z]/.test(p.text)).map((p) => p.index),
    answerOrControlFields: answerFields(questions),
  };
});
const convention = pages.get(95).blocks[1];
check("original-transformer-convention-is-step-down-for-K-greater-than-one", convention.lines.join("").includes("$K>1$ 时变压器是降压的"));
const result = {
  schema: "ld-s10y-lesson/bounded-text-provenance-inspection@1",
  card: raw.card_id, textOnly: true, imagesOpened: 0,
  canonicalHeading: { sourceRef: `p0101#${start + 1}`, text: raw.printed_title },
  exerciseHeading,
  immediateRightBoundary: { sourceRef: "p0103#1", text: pages.get(103).blocks[0].lines.join("") },
  numberedRightBoundary: { sourceRef: "p0104#2", text: pages.get(104).blocks[1].lines.join("") },
  transformerConvention: { path: sourcePage(95), sourceRef: "p0095#2", text: convention.lines.join("\n"), reviewScope: "Convention context only; not an answer to n36 question 3 and not added to any learner-facing artifact." },
  proseCoverage, questionCoverage, languages: languageReviews, checks,
  failedChecks: checks.filter((c) => !c.passed),
  status: checks.every((c) => c.passed) ? "PASS-structural-provenance-only" : "FAIL-structural-provenance",
  semanticJudgment: "Independent manual review belongs in the sibling science-review.json; these checks do not infer scientific or language acceptance.",
};
fs.writeFileSync(path.join(evidence, "text-inspection.json"), JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ status: result.status, checkCount: checks.length, failedChecks: result.failedChecks, paragraphs: languageReviews.map((l) => ({ language: l.language, count: l.paragraphCount, semicolonEnds: l.semicolonAtParagraphEndIndices0, lowercaseStarts: l.lowercaseParagraphStartIndices0 })) }, null, 2));
if (result.failedChecks.length) process.exitCode = 1;
