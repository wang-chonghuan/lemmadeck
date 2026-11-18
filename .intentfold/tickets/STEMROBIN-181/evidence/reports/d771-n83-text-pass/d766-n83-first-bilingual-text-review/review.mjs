import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(fs.realpathSync(process.cwd()), fs.realpathSync(repo));
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const own = path.join(tmp, "d766-n83-first-bilingual-text-review");
const prep = path.join(tmp, "d747-source225226-consume-prepare83");
const author = path.join(tmp, "d757-n83-first-bilingual-text-author");
const card = "phy10-c2-s3-n83";
const observations = new Map();
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
function read(file) {
  const bytes = fs.readFileSync(file);
  observations.set(file, hash(bytes));
  return bytes.toString("utf8");
}
const json = (file) => JSON.parse(read(file));
const binding = (file) => ({ path: file, sha256: observations.get(file) });
const math = (text) => [...text.matchAll(/\$[^$]+\$/gu)].map((m) => m[0]);
const numbers = (text) => [...text.matchAll(/[0-9]+/gu)].map((m) => m[0]);
const root = path.join(prep, "root/10p/lessons", card);
const frozenFile = path.join(prep, "preauthor-source-requirements.json");
const preparationFile = path.join(prep, "preparation.json");
const rawLessonFile = path.join(root, "lesson.json");
const rawExercisesFile = path.join(root, "exercises.json");
const frozen = json(frozenFile);
const preparation = json(preparationFile);
const rawLesson = json(rawLessonFile);
const rawExercises = json(rawExercisesFile);
assert.equal(observations.get(frozenFile), preparation.frozenRequirements.sha256);
assert.equal(observations.get(rawLessonFile), preparation.rawLesson.sha256);
assert.equal(observations.get(rawExercisesFile), preparation.rawExercises.sha256);
assert.deepEqual(frozen.boundary, {
  first: "p0222#5", last: "p0225#4", nextHeading: "p0225#5",
});
const authorReportFile = path.join(author, "reports/author-report.json");
const manifestFile = path.join(author, "reports/hashes.json");
const authorReport = json(authorReportFile);
const manifest = json(manifestFile);
assert.equal(observations.get(authorReportFile),
  "e9e86fc254045902e5b041aa6539620151760761015c174d653b97cce8f1ff64");
assert.equal(manifest.author_report.sha256, observations.get(authorReportFile));
assert.equal(manifest.revision, "d757-r1");

const semantics = [
  ["fixed-material-angle", ["p0222#6"],
    "Fixed material/state and uniform, direction-independent ordinary transparent material qualify the angle-independence claim."],
  ["newton-history", ["p0222#7"],
    "Telescope objective, coloured image edges, epitaph attribution and earlier lens/prism observations are retained without claiming a new historical source."],
  ["continuous-spectrum", ["p0223#1", "p0223#4"],
    "Small aperture, dark room, sunlight, glass prism, elongated wall image and Figure 196 remain. Seven historical names retain violet-to-red order, including orange-yellow; the text distinguishes names from a continuous visible band."],
  ["filter-and-recombination", ["p0223#5"],
    "Red/blue aperture observations remain historical observations. Separation is distinguished from dyeing. Complete recombination is conditional on suitable arrangement, not rotation alone. No plate geometry is approved."],
  ["finite-green-band", ["p0223#5"],
    "An effectively single-coloured component retains colour on refraction; a selected green band with nearby components may separate further. Neither locale claims every finite green band is spectrally pure."],
  ["normal-dispersion", ["p0223#6", "p0224#1"],
    "Violet-largest/red-smallest index is scoped to ordinary glass in the visible range, expressly not all materials or all colour ranges."],
  ["overlap-and-slit", ["p0224#2", "p0225#4"],
    "Partly overlapping coloured aperture images and the bright-source/slit/lens/screen/prism sequence are retained. Question 3 now asks about a clearly separated spectrum; it does not assert that dispersion vanishes in broad beams. The edge-only premise remains the source's broad-beam setup, not a theorem for every beam width or apparatus. The unanswered question is not solved here."],
  ["relevant-phase-speed", ["p0224#5"],
    "Red-fastest/violet-slowest is scoped to the glass just discussed; both locales define phase speed using an advancing vibration stage and distinguish it from equal vacuum speeds. This does not approve signal/group-speed or photon-trajectory claims."],
  ["historical-moon-argument", ["p0224#5"],
    "Roemer/Jupiter/satellite literal $1$, reddish emergence, violet before entry and absence of that effect remain the source's historical argument. Both locales explicitly decline to treat that absence alone as a precise vacuum-speed measurement; no stronger historical or experimental proof is endorsed."],
  ["reflection-and-ideal-filter", ["p0224#6", "p0225#3"],
    "White paper preserves approximate incident colour proportions; ordinary non-emitting/non-colour-converting objects mainly reflect their perceived colours and absorb more of others. Ideal red-only glass is named as an idealization. Almost-black grass allows non-pure reflected spectra. The red/green pencil words remain reflective marks, not coloured emitters; their layout and both glass options are retained without a selected answer."],
];

const findings = [
  {
    id: "d766-ZHEN-01", priority: 2, severity: "Major", gate: "ZHEN",
    locales: ["zh", "en"], source_refs: ["p0223#5"],
    targets: ["lesson.prose[5].text", "lesson.md"],
    title: "Provenance bookkeeping interrupts the child-facing causal account",
    quotes: {
      zh: "\u539f\u4e66\u5bf9\u6b64\u4fdd\u7559\u4e86\u5f15\u7528",
      en: "the source retains the reference",
    },
    locations: {
      zh: { file: path.join(author, "candidates/zh", card, "lesson.md"), line: 31 },
      en: { file: path.join(author, "candidates/en", card, "lesson.md"), line: 33 },
    },
    problem: "The child is told that a reference was retained and a step was linked in the source, rather than simply being directed to the cited plate while following the experiment. These are authoring/provenance operations, not an explanation of the light. The 2-3 complete-sentence count passes, but that does not make this paragraph a clean child-facing causal account.",
    required_change: "Replace only the reference-maintenance wording with direct child-facing experimental/citation wording. Keep both literal I/II references, their p0223#5 binding, all physical conditions and formulas, and the separate historical qualifications. Do not omit either plate, assign an asset, or change frozen source bytes. No replacement prose or solution is authored by this review.",
  },
  {
    id: "d766-ZHEN-02", priority: 2, severity: "Major", gate: "ZHEN",
    locales: ["en"], source_refs: ["p0223#2", "p0223#3", "p0224#3", "p0224#4"],
    targets: ["lesson.figures[*].label", "lesson.prose[3,4,8,9].label"],
    title: "English modern figure labels remain Chinese",
    locations: {
      en: { file: path.join(author, "candidates/en", card, "lesson.template.json"), line: 14 },
    },
    problem: "The modern title and caption text are English, but the modern top-level figures labels and fig/cap labels still contain the Chinese Figure 196/197 labels. This is an inconsistency in the candidate data, not a claim about an uninspected renderer or displayed artwork.",
    required_change: "Localize the modern English label fields consistently with the existing Figure 196/197 caption text while preserving figure IDs, page/order/ref identity, printed_title, source_text and source.data. If an uninspected native contract requires these labels to remain exact, record that as an unresolved dependent contract issue; do not alter code, waive the language gate or mutate provenance in this review.",
  },
];

const locales = {};
for (const locale of ["zh", "en"]) {
  const entry = manifest.candidates.find((c) => c.locale === locale);
  assert.ok(entry);
  const files = {};
  for (const key of ["lesson", "exercises", "text", "written_questions", "source_mapping", "prose_flow"]) {
    read(entry[key].path);
    assert.equal(observations.get(entry[key].path), entry[key].sha256);
    files[key] = binding(entry[key].path);
  }
  const lesson = JSON.parse(fs.readFileSync(files.lesson.path, "utf8"));
  const exercises = JSON.parse(fs.readFileSync(files.exercises.path, "utf8"));
  const flow = JSON.parse(fs.readFileSync(files.prose_flow.path, "utf8"));
  assert.deepEqual(lesson.source.data, rawLesson);
  assert.deepEqual(exercises.source.data, rawExercises);
  assert.equal(lesson.source.sha256, preparation.rawLesson.sha256);
  assert.equal(exercises.source.sha256, preparation.rawExercises.sha256);
  assert.equal(lesson.printed_title, rawLesson.printed_title);
  assert.equal(lesson.number, "83");
  assert.equal(lesson.start_page, 222);
  assert.equal(lesson.start_printed, 212);
  assert.equal(lesson.prose.length, rawLesson.prose.length);
  assert.equal(exercises.count, 3);
  assert.equal(exercises.exercises.length, 3);
  const paragraphs = [];
  lesson.prose.forEach((block, i) => {
    const original = rawLesson.prose[i];
    for (const key of ["kind", "id", "printed_page", "source_refs"]) {
      assert.deepEqual(block[key], original[key]);
    }
    assert.equal(block.source_text, original.text);
    assert.deepEqual(math(block.text), math(original.text));
    assert.deepEqual(numbers(block.text), numbers(original.text));
    assert.deepEqual(block.numeric_changes, []);
    if (block.kind === "p") {
      for (const text of block.text.split(/\n\n/gu)) {
        const sentences = text.split("\n");
        assert.ok(sentences.length === 2 || sentences.length === 3);
        assert.ok(sentences.every((s) => locale === "zh" ? /[.!?\u3002\uff01\uff1f]$/u.test(s) : /[.!?]$/u.test(s)));
        paragraphs.push({ blockIndex: i, text, complete_sentence_count: sentences.length });
      }
    }
  });
  assert.deepEqual(paragraphs.map((p) => p.text), flow.paragraph_groups.map((p) => p.text));
  assert.deepEqual(paragraphs.map((p) => p.complete_sentence_count),
    flow.paragraph_groups.map((p) => p.complete_sentence_count));
  assert.deepEqual(lesson.section_breaks, flow.selected_section_breaks);
  const resolved = lesson.section_breaks.map((boundary) => {
    const index = paragraphs.findIndex((p, i) => i > 0 &&
      p.text === boundary.after && paragraphs[i - 1].text === boundary.before);
    assert.ok(index > 0);
    assert.ok(flow.all_tool_derived_adjacent_boundaries.some((b) =>
      b.before === boundary.before && b.after === boundary.after));
    return index;
  });
  assert.deepEqual(resolved, flow.resolved_indices_from_existing_api);
  assert.equal(lesson.section_breaks.length, 6);
  assert.equal(lesson.external_dependencies.length, 2);
  assert.deepEqual(lesson.external_dependencies.map((d) => d.literal_reference), ["\u5f69\u56fe I", "\u5f69\u56fe II"]);
  const plateText = lesson.prose[5].text;
  assert.ok(plateText.indexOf("\u5f69\u56fe I") < plateText.indexOf("\u5f69\u56fe II"));
  assert.equal((lesson.prose[2].text.match(locale === "zh" ? /\u4e03/gu : /seven/gu) ?? []).length, 3);
  exercises.exercises.forEach((exercise, i) => {
    const original = rawExercises.exercises[i];
    for (const key of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) {
      assert.deepEqual(exercise[key], original[key]);
    }
    assert.equal(exercise.source_text, original.text);
    assert.deepEqual(math(exercise.text), math(original.text));
    assert.deepEqual(numbers(exercise.text), numbers(original.text));
    assert.deepEqual(exercise.numeric_changes, []);
    assert.ok(!Object.keys(exercise).some((key) => /answer|solution|correct|accept|choice/iu.test(key)));
  });
  const written = fs.readFileSync(files.written_questions.path, "utf8").trim();
  assert.equal(written, exercises.exercises.map((e) => e.text).join("\n\n"));
  const md = fs.readFileSync(files.text.path, "utf8");
  assert.ok(md.startsWith(`# ${lesson.title}\n\n`));
  const parts = lesson.prose.map((b) => b.kind === "fig"
    ? `<!-- retained source slot ${b.id}; artwork pending -->` : b.text);
  assert.equal(md.trim(), `# ${lesson.title}\n\n${parts.join("\n\n")}`);
  const coverage = frozen.blocks.map((block) => ({
    ref: block.ref, kind: block.kind,
    targets: block.kind === "h3" ? ["printed_title"]
      : block.kind === "foot" ? ["frozen-only printed folio"]
      : block.kind === "exhead" ? ["exercises[*].group/group_id"]
      : block.kind === "ex" ? exercises.exercises.flatMap((e, i) => e.pages.includes(block.ref) ? [`exercises[${i}]`] : [])
      : lesson.prose.flatMap((p, i) => p.source_refs.includes(block.ref) ? [`prose[${i}]`] : []),
    status: "PASS-TEXT-COVERAGE-ONLY",
  }));
  assert.ok(coverage.every((c) => c.targets.length > 0));
  locales[locale] = {
    files, SCI: "PASS", ZHEN: "FAIL", SOURCE_MATH_COVERAGE: "PASS",
    SCI_findings: [],
    ZHEN_findings: findings.filter((f) => f.locales.includes(locale)).map((f) => f.id),
    coverage, source_prose_blocks: 12, written_questions: 3,
    unanswered_written_questions_preserved: true,
    literal_math_sequence: lesson.prose.flatMap((b) => math(b.text)),
    paragraph_count: paragraphs.length, complete_sentence_counts: paragraphs.map((p) => p.complete_sentence_count),
    paragraphs_and_tool_anchors: "PASS", section_break_count: 6, resolved_section_indices: resolved,
    source_wrapper_and_per_block_source_text: "PASS-UNCHANGED",
    figure_identity_order_and_refs: "PASS-TEXT-METADATA-ONLY",
    modern_title: { text: lesson.title, status: "PASS" },
    modern_labels: {
      status: locale === "zh" ? "PASS" : "FAIL",
      figure_labels: lesson.figures.map((f) => f.label),
      caption_text: lesson.prose.filter((p) => p.kind === "cap").map((p) => p.text),
      limit: "No renderer, code, source pixels or artwork was inspected.",
    },
    SCI_checks: semantics.map(([id, refs, observation]) => ({ id, refs, status: "PASS", observation })),
    source_figure_approval: false, whole_card_approved: false,
  };
}

const preservation = [...observations].map(([file, before]) => {
  const after = hash(fs.readFileSync(file));
  assert.equal(after, before, `Input changed during review: ${file}`);
  return { path: file, sha256_before: before, sha256_after: after, unchanged: true };
});
const report = {
  schema: "d766/first-bilingual-text-review@1",
  ticket: "STEMROBIN-181", card, reviewer: "d766",
  candidate_revision: "d757-r1", status: "FIRST-INDEPENDENT-TEXT-REVIEW-FAIL-ZHEN",
  review_pass: false, whole_card_approved: false, review_kind: "text-only",
  scope: { checkout: repo, only_writable_root: own, boundary: frozen.boundary },
  inputs: {
    frozen_requirements: binding(frozenFile), preparation: binding(preparationFile),
    raw_lesson: binding(rawLessonFile), raw_exercises: binding(rawExercisesFile),
    author_report: binding(authorReportFile), hashes_manifest: binding(manifestFile),
  },
  independence: {
    source_read_before_candidates_and_author_claims: true,
    source_PIXEL_PASS_reused_not_rerun: true,
    basis: "Direct human authorization supplies existing source PASSs; frozen requirements and prepared raw lesson/exercises are the text-review inputs, not new pixel approval. Candidate text was read before author scientific claims. Author mapping claims are not used to infer coverage.",
    native_calls: 0, source_pixel_reviews: 0,
  },
  reader: {
    job_story: "A child follows how a prism separates existing colours and how light returned from ordinary objects gives colour, then attempts the three original written questions independently.",
    evidence: "Direct assignment's child-causal requirement and frozen source lesson/questions; age-eight readability is an editorial assumption from the author's stated limit, not a real-child test.",
  },
  locales, findings,
  historical_and_literal_exceptions: [
    "Chinese printed_title, source_text and source.data are immutable provenance, not English-title failures.",
    "The original group/group_id and the literal pencil marks with English glosses are preserved, not selected solutions.",
    "Source-bound historical aliases are not independently treated as language failures; an uninspected native declaration contract is not waived or judged.",
    "Literal p0223#5 Color Plate I/II references remain frozen and present in both locales.",
  ],
  dependency_limits: {
    identity_basis: "Direct human-provided existing d751 identity only; no identity re-review or pixel opens.",
    physical_page_identity: { I: 416, II: 416, III: 417 },
    source223_references: "UNCHANGED-FROZEN",
    native_Roman_ownership: "UNRESOLVED",
    color_fidelity: "UNRESOLVED",
    plate_source_figure_or_color_approval: false,
    dependencies_demoted: false,
    candidate_pending_identity_metadata: "Frozen first-author metadata is not rewritten or treated as color/ownership approval after the identity-only result.",
    pending: ["native-Roman-ownership", "color-fidelity", "figures", "artwork", "answers", "choices", "native-finalize", "render", "display", "canonical-retention", "whole-card-approval"],
    untouched_holds: ["source218 ambiguity", "lost paid181 bytes", "incomplete source84"],
  },
  actual_usage: {
    images_opened: 0, images_reviewed: 0, images_authored: 0,
    answers_consulted: 0, answers_authored: 0, choices_consulted: 0, choices_authored: 0,
    native_calls: 0, paid_calls: 0, browser_calls: 0, full_tests: 0,
    database_calls: 0, service_operations: 0, git_operations: 0,
    chats_messaged: 0, children_created: 0,
  },
  preservation: { status: "PASS-UNCHANGED", entries: preservation },
  verification_limit: "Structured text/hash/coverage/paragraph checks plus independent editorial and scientific reading only. No solution, code, artwork, pixel, display, native-finalization or whole-card verdict is produced.",
};
function write(name, content) {
  const file = path.join(own, name);
  assert.equal(path.dirname(file), own);
  fs.writeFileSync(file, content, { flag: "wx" });
  return { path: file, sha256: hash(Buffer.from(content)) };
}
const reportBinding = write("review-report.json", `${JSON.stringify(report, null, 2)}\n`);
const summary = [
  "# d766 n83 First Independent Text Review",
  "",
  "Bound to d757-r1 and author-report SHA256 e9e86fc254045902e5b041aa6539620151760761015c174d653b97cce8f1ff64.",
  "",
  "| Locale | SCI | ZHEN | Source/math coverage | Paragraphs/anchors |",
  "| --- | --- | --- | --- | --- |",
  "| zh | PASS (limited text scope) | FAIL | PASS | PASS: 17 paragraphs, 6 anchors |",
  "| en | PASS (limited text scope) | FAIL | PASS | PASS: 22 paragraphs, 6 anchors |",
  "",
  "## Findings",
  "1. [P2] Both locales: reference-retention/linking bookkeeping in prose[5] interrupts the child-facing causal explanation. Keep the literal I/II citations and conditions; change only the editorial maintenance wording.",
  "2. [P2] English: modern figure and fig/cap label fields remain Chinese although title/caption text are English. Immutable printed/source fields must remain untouched. No renderer or native contract was inspected or waived.",
  "",
  "## Passed Scope",
  "All frozen blocks are mapped, including title, source-only folios and question group. Twelve assembled prose blocks keep source text/order/refs; all three unanswered written questions keep numbering, group and source refs. Literal formulas $180^\\circ$, $1$, numeric order and all I/II references are unchanged. The seven-name sequence retains orange-yellow.",
  "Normal-dispersion and phase-speed scope, finite green-band distinction, ideal versus real reflection/filtering, overlapping aperture images and historical moon-argument limits pass textual SCI review. Broad-beam observability remains limited to the source setup; no question is solved.",
  "",
  "## Limits",
  "Actual images opened/reviewed/authored: 0. Native, browser, answer, choice, paid, Git, DB, service, chat, child and whole-test operations: 0.",
  "Reuse source PASSs without new pixel approval. Existing d751 identity only: I and II both on physical page 416; III on 417. Native Roman ownership and color fidelity remain unresolved; no dependencies are demoted.",
  "All observed source/candidate/report inputs remained hash-identical. No candidates, figures, answers, choices, native outputs, shared evidence, meter, index or canonical files were written. No whole-card approval.",
  "",
].join("\n");
const summaryBinding = write("review-summary.md", summary);
write("hashes.json", `${JSON.stringify({
  reviewer: "d766", candidate_revision: "d757-r1",
  author_report: binding(authorReportFile), author_manifest: binding(manifestFile),
  report: reportBinding, summary: summaryBinding,
  reviewer_script: { path: path.join(own, "review.mjs"), sha256: hash(fs.readFileSync(path.join(own, "review.mjs"))) },
  candidates: Object.fromEntries(Object.entries(locales).map(([locale, value]) => [locale, value.files])),
}, null, 2)}\n`);
console.log(JSON.stringify({
  report: reportBinding, summary: summaryBinding,
  verdicts: Object.fromEntries(Object.entries(locales).map(([locale, value]) =>
    [locale, { SCI: value.SCI, ZHEN: value.ZHEN, SOURCE_MATH_COVERAGE: value.SOURCE_MATH_COVERAGE }])),
  source_and_candidates_unchanged: true, actual_images: 0, native_calls: 0,
  whole_card_approved: false,
}, null, 2));
