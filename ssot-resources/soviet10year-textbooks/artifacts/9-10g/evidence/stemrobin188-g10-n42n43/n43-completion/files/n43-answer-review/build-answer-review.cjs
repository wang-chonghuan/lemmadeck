const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const root = process.cwd();
const ticketTmp = ".intentfold/tickets/STEMROBIN-188/tmp/";
const outputDirectory = path.join(root, ticketTmp, "n43-answer-review");
const candidatePath = ticketTmp + "n43-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n43/answer-keys.template.json";
const choiceDirectory = ticketTmp + "n43-choice-review/";
const seedPath = ticketTmp + "n43-choice-author/seed.json";
const coreDirectory = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n43/";
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object") {
    return "{" + Object.keys(value).sort().map((key) =>
      canonical(key) + ":" + canonical(value[key])).join(",") + "}";
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (character) =>
    "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"));
}
const read = (relative) => fs.readFileSync(path.join(root, relative));
const load = (relative) => JSON.parse(read(relative));
const binding = (relative) => ({ path: relative, sha256: sha(read(relative)) });
const candidateBytes = read(candidatePath);
if (sha(candidateBytes) !== "a9d4f1a7cd7fd01f17c3abe40dc987fd26ed6004880f633d7009b82a942192b7") {
  throw new Error("New answer candidate changed");
}
const candidate = JSON.parse(candidateBytes);
const seed = load(seedPath);
const choiceReview = load(choiceDirectory + "review.json");
const core = load(coreDirectory + "exercises.json");
const figures = load(coreDirectory + "figures.json");
if (choiceReview.outcome !== "pass" || core.status !== "ready" || figures.status !== "ready") {
  throw new Error("Ordered choice review or ready-core premise missing");
}
const evidence = {
  "8": {
    display: "All four coordinate readings, sums of squares and final nonnegative lengths are shown: sqrt(3),sqrt(14),sqrt(2),2. Negative coordinates are squared and absent basis terms correctly become zero.",
    grading: "Four deterministic scalar lengths can be numeric. Labels 1)-4) match the source order. No physical length unit was specified, so none is invented.",
    parts: [
      "a=(1,-1,1) gives squared norm 3 and expected sqrt(3).",
      "b=(2,1,-3) gives squared norm 14 and expected sqrt(14).",
      "c=(0,1,-1) gives squared norm 2 and expected sqrt(2).",
      "d=(0,-2,0) has length 2, not -2 or 4."
    ]
  },
  "9": {
    display: "The display derives 3t^2=9, t=+/-sqrt(3), lists BOTH uniform-sign triples as one complete set, and explicitly forbids independent sign choice.",
    grading: "One exact complete-set part preserves sign coupling, unlike six independently graded coordinates or a scalar t. Its two expected alternatives are only the two orders of the SAME two set members. Exact matching can reliably compare these complete structured answers under the stated shared normalization contract, subject to the parent's still-pending actual MathLive edit gate. No claim of accepting every mathematically equivalent set notation.",
    parts: [
      "Both expected LaTeX sets contain exactly (sqrt(3),sqrt(3),sqrt(3)) and (-sqrt(3),-sqrt(3),-sqrt(3)). Reversing their order changes presentation only. No mixed-sign triple, lone positive/negative triple, or unexpanded independently-signed coordinates is whitelisted; no independent coordinate parts allow mixed-sign false acceptance."
    ]
  },
  "10": {
    display: "The display gives (4,2,-3), sqrt(29), and the full coordinate cancellation to (0,0,0), length 0, covering both original subparts.",
    grading: "The two numerical lengths are deterministic, and labels 1),2) preserve order. Zero-vector length is defined even though direction is not.",
    parts: [
      "(4,2,-3) has squared norm 16+4+9=29, expected sqrt(29).",
      "The opposite vectors sum to zero, expected 0, not the sum of their lengths."
    ]
  },
  "11": {
    display: "Both numerical scalar multiplications and coordinate sums are shown. The resulting vectors (8,2,-2) and (6,5,-3) have squared lengths 72 and 70, hence 6sqrt(2) and sqrt(70).",
    grading: "Two scalar norm parts preserve the original 2a+3b coefficients and order; both are reliable numerical targets without invented units.",
    parts: [
      "2(1,1,-1)+3(2,0,0)=(8,2,-2); sqrt(72)=6sqrt(2).",
      "2(3,1,0)+3(0,1,-1)=(6,5,-3); sqrt(70)."
    ]
  },
  "12": {
    display: "Dot 12 and lengths 3,9 give cosine 4/9, followed by the UNIQUE angle arccos(4/9) on [0,pi]. Display gives both radians and approximate degrees, not cosine as the final angle.",
    grading: "The source requests an angle without prescribing degrees. One numeric angle with explicit unit rad and expected arccos(4/9) is semantically valid; it is not a cosine field. Tolerance 1e-6 rad admits the shown rounded radian value. Raw 4/9 differs by about 0.6658 rad and a bare 63.6122 interpreted as radians differs by about 62.502, so neither is semantically equivalent to the expected angle. Actual editor/parser/unit execution is not claimed.",
    parts: [
      "Expected arccos(4/9) evaluates independently to 1.1102423351135742 rad = 63.61220003875701 degrees. Label is angle, unit is rad, tolerance is 0.000001; display rounding 1.1102423 differs by only 3.5113574e-8 rad."
    ]
  },
  "13": {
    display: "The display forms the requested difference and sum vectors, gives their dot 1 and both lengths sqrt(11), and concludes cosine 1/11. It does not replace their dot by the original a dot b=0.",
    grading: "One dimensionless numerical cosine part is deterministic and labeled as cosine, unlike the angle in exercise 12.",
    parts: [
      "(-1,3,1) dot (3,1,1)=1 and norm product=11, hence expected 1/11."
    ]
  },
  "14": {
    display: "All THREE source subparts are complete: (1) direction angles imply a nonzero vector; signed basis dot products identify p/L,q/L,r/L and positive scaling proves same-direction unit length; (2) the three squared cosines sum to (p^2+q^2+r^2)/L^2=1; (3) cos(gamma)=+/-sqrt(2)/2 yields 45 or 135 degrees, with explicit unit-vector witnesses for both branches. The schematic is correctly not used as an r>0/acute restriction.",
    grading: "The source includes two proofs, so the whole exercise is ungraded with zero automatic parts and a substantive standard proof. The numerical third subpart is still included in displayAnswer; leaving the proof exercise ungraded avoids pretending a numeric response grades its reasoning.",
    parts: []
  },
  "15": {
    display: "The display states the i,j,k order and signed normalization, then gives all four triples. sqrt(3)/3 is equivalent to 1/sqrt(3); zeros and all negative cosines remain intact.",
    grading: "Twelve independent dimensionless numerical cosine parts correspond to four vector subparts times the ordered i,j,k basis. Every label identifies both the subpart and the basis; none is omitted or reordered.",
    parts: [
      "1),i: 1/sqrt(3)=sqrt(3)/3.",
      "1),j: 1/sqrt(3)=sqrt(3)/3.",
      "1),k: 1/sqrt(3)=sqrt(3)/3.",
      "2),i: zero first component gives 0.",
      "2),j: -3/sqrt(10), negative because j component is negative.",
      "2),k: -1/sqrt(10), negative because k component is negative.",
      "3),i: -5/5=-1, opposite the positive i basis vector.",
      "3),j: zero component gives 0.",
      "3),k: zero component gives 0.",
      "4),i: zero component gives 0.",
      "4),j: 3/5 for vector (0,3,4), norm 5.",
      "4),k: 4/5 for vector (0,3,4), norm 5."
    ]
  }
};

const exerciseReviews = candidate.answers.map((answer, index) => {
  const modern = core.exercises[index];
  const source = seed.exercises[index];
  const expectedEvidence = evidence[answer.exercise];
  if (!modern || !source || !expectedEvidence ||
      answer.exercise !== modern.number || answer.exercise !== source.number ||
      answer.sourceNumber !== modern.source_number || answer.groupId !== modern.group_id ||
      answer.group !== modern.group || answer.prompt !== modern.text ||
      source.text !== modern.group + "\n" + modern.text) {
    throw new Error("Candidate/core/seed identity discrepancy");
  }
  const requiredFigures = modern.figure_refs;
  if (canonical(requiredFigures) !== canonical(answer.figureEvidence.map((item) => item.id))) {
    throw new Error("Figure identity mismatch");
  }
  for (const item of answer.figureEvidence) {
    const manifest = figures.figures.find((figure) => figure.id === item.id);
    const bookRoot = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/";
    const editionRoot = bookRoot + "editions/modern-us-neutral/";
    if (!manifest ||
        item.originalPng !== bookRoot + manifest.source.png.path ||
        item.editionAsset !== editionRoot + manifest.svg ||
        item.figureSpec !== editionRoot + manifest.spec) {
      throw new Error("Figure evidence paths do not identify the ready manifest");
    }
  }
  if (answer.source !== "derived" || Object.hasOwn(answer, "bookRaw") ||
      answer.parts.length !== expectedEvidence.parts.length) {
    throw new Error("Source provenance or part-count discrepancy");
  }
  return {
    exercise: answer.exercise,
    verdict: "PASS",
    identity: {
      verdict: "PASS",
      evidence: "exercise/sourceNumber " + answer.exercise +
        ", group g1/习题 and exact prompt match the current ready modern exercise; seed prose matches with its group header. Referenced figure set matches figureEvidence" +
        (requiredFigures.length ? ", including the original PNG, current edition SVG and current FigureSpec paths." : " (both empty).")
    },
    independent_solution: choiceReview.source_reviews.find((row) => row.source_number === answer.exercise).independent_solution,
    display_answer: { verdict: "PASS", evidence: expectedEvidence.display },
    grading: { verdict: "PASS", evidence: expectedEvidence.grading },
    provenance: {
      verdict: "PASS",
      evidence: "source=derived, no bookRaw; checked against the ONCE independent source solution, not a book answer or the new author's claimed answer."
    },
    part_checks: answer.parts.map((part, partIndex) => ({
      label: part.label,
      judge: part.judge,
      expected: part.expected,
      unit: part.unit || null,
      tolerance: part.tolerance === undefined ? null : part.tolerance,
      verdict: "PASS",
      evidence: expectedEvidence.parts[partIndex]
    }))
  };
});
const parts = candidate.answers.flatMap((answer) => answer.parts);
const counts = {
  exercises: candidate.answers.length,
  auto: candidate.answers.filter((answer) => answer.grading === "auto").length,
  ungraded: candidate.answers.filter((answer) => answer.grading === "ungraded").length,
  parts: parts.length,
  numeric_parts: parts.filter((part) => part.judge === "numeric").length,
  exact_complete_set_parts: parts.filter((part) => part.judge === "exact").length
};
if (canonical(counts) !== canonical({
  exercises: 8, auto: 7, ungraded: 1, parts: 23, numeric_parts: 22, exact_complete_set_parts: 1
})) throw new Error("Unexpected coverage counts");

const traceBindings = seed.trace.map((item) => {
  const current = binding(item.path);
  if (current.sha256 !== item.sha256) throw new Error("Source input changed since seed");
  return current;
});
const report = {
  schema: "n43-standard-answer-independent-review-v1",
  reviewer: {
    kind: "independent_agent",
    identity: "Authorized SINGLE N43 reviewer, same188-6/STEMROBIN-188; independent of both current candidate authors."
  },
  semantic_outcome: "PASS",
  outcome: "PASS",
  outcome_scope: "Semantic mathematics, source identity, completeness, grading suitability, labels, units and declared expected-answer sets ONLY; not a finalize, publish, or real-keyboard mechanical-gate pass.",
  candidate: {
    path: candidatePath,
    sha256: sha(candidateBytes),
    canonical_sha256: sha(canonical(candidate)),
    status: candidate.status,
    book: candidate.book,
    lesson: candidate.lesson,
    edition: candidate.edition
  },
  input_bindings: [
    binding(seedPath),
    binding(choiceDirectory + "FIRST-source.md"),
    binding(choiceDirectory + "views-only.json"),
    binding(choiceDirectory + "pre-key.md"),
    binding(choiceDirectory + "pre-key.json"),
    binding(choiceDirectory + "review.json"),
    ...traceBindings,
    binding("ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-05.spec.json"),
    binding("ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-05.svg"),
    binding("ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-05.png"),
    binding("ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/stemrobin188-g10-n42n43/geo910-c2-s1-n43-figures/fig-g10-05.preview.png")
  ],
  chronology: {
    order: ["seed/definition/actual images and independent original solutions", "persist FIRST-source.md", "project ONLY questions[].view", "persist pre-key fidelity, redundancy, leakage and all-option truth/derivations", "disclose private choice intent/keys/coverage and compare every rationale", "persist choice review.json", "ONLY THEN disclose NEW standard-answer candidate", "compare candidate with ONCE independent solutions and current ready core identity"],
    independent_solution_authority: choiceDirectory + "FIRST-source.md",
    choice_or_answer_author_keys_used_as_authority: false,
    book_answers_or_prior_answers_read: false
  },
  counts,
  exercise_reviews: exerciseReviews,
  figure_evidence: {
    figure_id: "fig-g10-05",
    inherited_modern_figure_approval: "PASS inherited, unchanged; no new approval or rerender",
    actual_open_observations: "Modern complete preview and original raw PNG were actually opened in phase 1. Four common-tail rays i down-left,j right,k up,a up-right, alpha(i,a),beta(j,a),gamma(k,a); all rightmost/bottommost labels and tips visible. No numeric, sign or acute restriction. Current FigureSpec describes schematic 3D projection only.",
    actual_image_opens: 2,
    context_images: 2,
    batch_limit: 8,
    context_limit: 24,
    new_images_opened_in_answer_phase: 0
  },
  findings: [],
  required_revisions: [],
  pending_mechanical_gate: {
    status: "NOT_RUN_PENDING_PARENT_FINALIZE",
    evidence: "Gate 2 requires both exact expected alternatives for exercise 9 to undergo actual MathLive initialization, real keyboard input/deletion, input-event verification, preserved mathematical content and reserialized .value normalization. This reviewer did not run it, did not compare an expected string to itself as a substitute, and did not rerun author PASS checks. Numeric ComputeEngine parsing and runtime input acceptance are likewise not asserted by this semantic report.",
    prevents_claiming_finalized_or_published: true
  },
  boundaries: {
    candidate_repairs: false,
    core_tool_figure_edits: false,
    finalize_retention_db_env_install_network_paid_git_thread_contact_deploy_closure: false,
    output_directories_only: [ticketTmp + "n43-choice-review/", ticketTmp + "n43-answer-review/"]
  }
};
fs.writeFileSync(path.join(outputDirectory, "answer-review.json"), JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  semantic_outcome: report.semantic_outcome,
  candidate_raw_sha256: report.candidate.sha256,
  candidate_canonical_sha256: report.candidate.canonical_sha256,
  answer_review_raw_sha256: sha(fs.readFileSync(path.join(outputDirectory, "answer-review.json"))),
  counts,
  mechanical_gate: report.pending_mechanical_gate.status
}, null, 2));
