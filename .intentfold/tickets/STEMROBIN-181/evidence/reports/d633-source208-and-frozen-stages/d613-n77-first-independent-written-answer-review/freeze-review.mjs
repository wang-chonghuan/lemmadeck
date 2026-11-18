import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const scratch = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp");
const owned = path.join(scratch, "d613-n77-first-independent-written-answer-review");
const script = fileURLToPath(import.meta.url);
assert.equal(path.dirname(script), owned);
assert.deepEqual(fs.readdirSync(owned), ["freeze-review.mjs"]);
const digest = (value) => createHash("sha256").update(value).digest("hex");
const descriptors = [];
const sha = {
  source: "32ad50db75c9fc8e10d3ca818f31f6bb0eaf2850ae4444901f0619e301b088de",
  lesson: "c97d100b63b38c15b248f1ecbc1cbc73174190594f3d5624f3744396fd3fc403",
  raw: "3a8dbdeb61a28548f9d76ff418446ec26c36ca78181c0f2c2e6d921955a630f5",
  rawReport: "9e6042db53eb8224d919209f902b117a579c2a53befa859fa89d78934afc7ffa",
  author: "424cf68d2815c155485bab241e61b6765c2278b1322bf02aa06e798884416cb4",
  authorFreeze: "cac9d49ae82fd73e49e6f1d0934b6f101cfa0a24a63a66f9a01f0f40e87120cf",
};

function read(relative, expected, role) {
  const absolute = path.join(scratch, relative);
  const bytes = fs.readFileSync(absolute);
  const actual = digest(bytes);
  if (expected) assert.equal(actual, expected, absolute);
  const stat = fs.statSync(absolute);
  descriptors.push({
    path: absolute, sha256: actual, bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
    birthtime: stat.birthtime.toISOString(), mtime: stat.mtime.toISOString(),
    expected_sha256: expected ?? null, expected_hash_matches: expected ? true : null, role,
  });
  return JSON.parse(bytes.toString("utf8"));
}

const sourceDir = "d602-n77-first-source-preparation/root/10p/lessons/phy10-c2-s2-n77";
const source = read(`${sourceDir}/exercises.json`, sha.source, "Original eight written questions; primary task authority");
const lesson = read(`${sourceDir}/lesson.json`, sha.lesson, "Relevant original prose; no diagram interpretation");
const rawDir = "d601-n77-first-independent-raw-solutions";
const raw = read(`${rawDir}/independent-solutions.json`, sha.raw, "Genuine preauthor independent RAW; frozen unapproved comparison, not an oracle");
const rawReport = read(`${rawDir}/report.json`, sha.rawReport, "Preauthor provenance and unresolved source qualifications");
const rawFreeze = read(`${rawDir}/review-freeze.json`, null, "Existing RAW freeze binding; observed digest, not a supplied pin");
const authorDir = "d610-n77-first-written-answer-author";
const author = read(`${authorDir}/report.json`, sha.author, "Current author report only; SCI and ZHEN were pending");
const authorFreeze = read(`${authorDir}/author-freeze.json`, sha.authorFreeze, "Exact current author freeze");
const candidates = {};
for (const locale of ["zh", "en"]) {
  candidates[locale] = {};
  for (const [kind, filename] of [["questions", "exercises.template.json"], ["answers", "answer-keys.candidate.json"]]) {
    const relative = `${authorDir}/${locale}/${filename}`;
    const relativeWorkspace = `.intentfold/tickets/STEMROBIN-181/tmp/${relative}`;
    const pin = authorFreeze.files.find((f) => f.path === relativeWorkspace);
    assert.ok(pin);
    candidates[locale][kind] = read(relative, pin.sha256, `Current ${locale} ${kind}; reviewed without alteration`);
  }
}
const authorBindings = read(`${authorDir}/input-bindings.json`, "d9043feb26ae864169b20727005bfe773a85bd27e1e3e4ceca7b32ffd2a8beee", "Author-side input assertions; no answerbook read by this reviewer");
const latex = read(`${authorDir}/local-latex.receipt.json`, "c4081f0dbb26cc1ed810e27ad90eccd366b76450e79cb54502af219ed48988c2", "Attributed author-only LaTeX receipt; never rerun");
const boundary = read("d596-first-source204205-object-boundary-adjudication/report.json", "6409c253ebe9c0dce119bc3d1b50d3c9585f52082b88e5a7136ce95a59bf3a10", "Separate paragraph/object adjudication, not a source HOLD replacement");
const projection = read("d596-first-source204205-object-boundary-adjudication/proposed-projection.json", "282e5347c7b6443390dc2e151d9a2414769255d0da8c7adad74d7f8ab9f1b893", "Derived flag-only projection scope; no assembly executed here");
const textReport = read("d607-n77-first-bilingual-text-author/report.json", "ba681ca52e4e41cd175ee05c35b744952517d92a72ed5e14335be185a20e65a5", "Separate pending text review attribution only; its lesson/figure candidates not reviewed here");

assert.equal(source.count, 8);
assert.equal(source.exercises.length, 8);
assert.equal(raw.solutions.length, 8);
assert.equal(raw.status, "INDEPENDENT_RAW_NOT_APPROVED");
assert.equal(rawReport.approved_answer_key, false);
assert.equal(rawReport.future_draft_approval, false);
assert.equal(rawReport.independent_solutions.sha256, sha.raw);
for (const item of rawFreeze.files) {
  const observed = descriptors.find((d) => d.path === item.path);
  assert.ok(observed);
  assert.equal(observed.sha256, item.sha256);
  assert.equal(observed.mode, "0444");
}
assert.equal(author.SCI, "pending-first-independent-answer-review");
assert.equal(author.ZHEN, "pending-first-independent-answer-review");
assert.equal(authorFreeze.independentApproval, false);
assert.equal(authorBindings.independentD601SolutionsNotReadBeforeAuthorFreeze, true);
assert.equal(authorBindings.capturedAnswersForN77, 0);
assert.equal(latex.invocations, 1);
assert.equal(latex.exitCode, 0);
const latexChecks = JSON.parse(latex.stdout);
assert.equal(latexChecks.length, 28);
assert.ok(latexChecks.every((item) => item.ok === true));
const rawStat = descriptors.find((d) => d.sha256 === sha.raw);
const rawReportStat = descriptors.find((d) => d.sha256 === sha.rawReport);
const authorStat = descriptors.find((d) => d.sha256 === sha.author);
assert.ok(rawStat.birthtime < authorStat.birthtime);
assert.ok(rawReportStat.birthtime < authorStat.birthtime);

const questionBindings = source.exercises.map((question, i) => {
  assert.equal(question.number, String(i + 1));
  assert.equal(question.source_number, String(i + 1));
  assert.equal(question.group_id, "g1");
  assert.deepEqual(question.pages, [`p0206#${i + 4}`]);
  assert.deepEqual(question.figure_refs, []);
  assert.deepEqual(question.figures, []);
  assert.equal(raw.solutions[i].id, `N77-Q${i + 1}`);
  assert.equal(raw.solutions[i].original_question, question.text);
  assert.equal(raw.solutions[i].original_ref, question.pages[0]);
  assert.equal(raw.solutions[i].question_text_sha256, digest(question.text));
  const locales = {};
  for (const locale of ["zh", "en"]) {
    const qs = candidates[locale].questions;
    const keys = candidates[locale].answers;
    assert.equal(qs.count, 8);
    assert.equal(qs.exercises.length, 8);
    assert.equal(keys.answers.length, 8);
    assert.deepEqual(qs.source.data, source);
    assert.equal(qs.source.sha256, sha.source);
    assert.equal(keys.readOnlyWrittenResponses, true);
    assert.equal(keys.automaticGradingKeys, 0);
    assert.equal(keys.nativeFinalizeRun, false);
    assert.equal(keys.completeCard, false);
    const q = qs.exercises[i];
    const answer = keys.answers[i];
    for (const field of ["number", "source_number", "group_id", "group", "pages", "figure_refs", "figures"]) {
      assert.deepEqual(q[field], question[field]);
    }
    assert.equal(q.source_text, question.text);
    assert.deepEqual(q.lines, [q.text]);
    assert.deepEqual(q.numeric_changes, []);
    assert.equal(answer.exercise, question.number);
    assert.equal(answer.source_number, question.source_number);
    assert.equal(answer.group_id, question.group_id);
    assert.equal(answer.prompt, q.text);
    assert.deepEqual(answer.source_refs, question.pages);
    assert.deepEqual(answer.figureEvidence, []);
    assert.equal(answer.source, "derived");
    assert.equal(answer.grading, "ungraded");
    assert.deepEqual(answer.parts, []);
    assert.equal(answer.reviewStatus, "PENDING-INDEPENDENT-SCI-ZHEN");
    assert.ok(answer.displayAnswer.length > 100);
    for (const prohibited of ["bookRaw", "judge", "expected", "correct_index", "accept", "answerKey", "options", "interaction"]) {
      assert.equal(Object.hasOwn(answer, prohibited), false);
    }
    locales[locale] = {
      prompt_file: path.join(scratch, authorDir, locale, "exercises.template.json"),
      prompt_pointer: `/exercises/${i}/text`,
      source_snapshot_pointer: `/source/data/exercises/${i}`,
      answer_file: path.join(scratch, authorDir, locale, "answer-keys.candidate.json"),
      answer_pointer: `/answers/${i}/displayAnswer`,
      prompt: q.text, prompt_sha256: digest(q.text),
      displayAnswer: answer.displayAnswer, display_answer_sha256: digest(answer.displayAnswer),
      source: answer.source, grading: answer.grading, parts: answer.parts,
    };
  }
  return {
    id: `N77-Q${i + 1}`, original_pointer: `/exercises/${i}`,
    original_question: question.text, question_text_sha256: digest(question.text),
    source_number: question.source_number, group_id: question.group_id, pages: question.pages,
    original_figure_refs: [], raw_pointer: `/solutions/${i}`,
    raw_status: raw.solutions[i].status, locales,
  };
});

const assumptions = {
  refraction: [
    "Stationary locally smooth interface between ordinary positive-phase-index, homogeneous isotropic transparent media; geometrical optics.",
    "Indices and phase speeds are evaluated at one unchanged optical frequency; angles are from the interface normal.",
    "A propagating transmitted ray is considered only when it exists. At normal incidence both ray segments lie on the normal.",
  ],
  critical_angle: [
    "Use the actual incident-to-transmitted order, n1>n2, for an isolated ordinary lossless ideal interface.",
    "Strictly above the critical angle there is no propagating transmitted ray away from the boundary; equality is a grazing limiting ray.",
    "An evanescent field is not an ordinary transmitted ray; the candidate need not teach frustrated reflection for this elementary task.",
  ],
  lens: [
    "Ideal centered thin lens, paraxial geometrical optics, same ordinary homogeneous surrounding medium on both sides.",
    "Neglect thickness, principal-plane offsets, aberrations and diffraction at the intended accuracy; thinness alone is not a nonparaxial accuracy guarantee.",
    "Measure signed d and f from the common effective lens plane: real object d>0, virtual object d<0, real image f>0, virtual image f<0.",
    "F is signed focal length, not lowercase image distance f; F>0 for convergence and F<0 for divergence.",
    "Finite image and size-ratio expressions assume nonzero finite conjugate distances and nonzero object size. Collimated limits are not finite images.",
  ],
};

const notes = [
  {
    topic: "Snell coplanarity, normal angles and fixed-frequency isotropic media",
    SCI: "FAIL", ZHEN: "PASS",
    independent_reasoning: [
      "Tangential phase continuity at a stationary isotropic interface gives k1 sin(theta1)=k2 sin(theta2), and k_j=n_j omega/c gives n1 sin(theta1)=n2 sin(theta2).",
      "Both candidate languages correctly give coplanarity, normal-referenced angles, fixed frequency and the product-form law, rather than the reflection law.",
      "The product form itself includes normal incidence. Setting the incident angle to zero forces the refracted angle to zero for ordinary positive indices: both geometrical ray segments lie on the normal, not strictly on its opposite sides.",
      "No nonzero-incidence qualification accompanies the separate opposite-sides sentence. The original question specifies no restriction excluding normal incidence. This is a localized literal-domain error, not a failure of Snell's formula.",
    ],
    bilingual_review: [
      "The Chinese request to briefly state the law and the English request to state the laws ask for the same conceptual work.",
      "Coplanarity, the interface normal, the angle convention and fixed-frequency condition are faithfully paired; both languages also preserve the same scientific overstatement.",
      "The final contrast with reflection is optional explanatory material, not a fabricated source quotation or a new task.",
    ],
    raw_comparison: [
      "RAW agrees on the phase-matching derivation, same-frequency domain and product form. It explicitly says in /solutions/0/assumptions/2 that exactly normal incidence stays on the normal.",
      "Critically, RAW /solutions/0/correct_explanation_candidate itself also contains an unqualified opposite-sides clause. Its surrounding normal-incidence caveat does not make that isolated wording a quotation or an oracle.",
      "This review therefore identifies the literal side-clause limitation in both current display strings and the analogous RAW summary, rather than merely checking agreement.",
    ],
    defects: ["N77-Q1_NORMAL_INCIDENCE_SIDE_CLAIM"],
  },
  {
    topic: "Absolute versus ordered relative phase index",
    SCI: "PASS", ZHEN: "PASS",
    independent_reasoning: [
      "Absolute phase index n_j=c/v_j uses vacuum as the fixed reference. Dividing n2 by n1 gives (c/v2)/(c/v1)=v1/v2, so n21 is the index of medium 2 relative to medium 1, not its inverse.",
      "Both answers explicitly identify phase speed, the 1-to-2 direction and equal-frequency evaluation. Swapping the ordered media gives the reciprocal.",
      "No numerical indices or specified medium pair exist in the source, and none have been introduced. These are conditional definitions, not unprovided earlier source wording.",
    ],
    bilingual_review: [
      "Both prompts ask for the distinction rather than a numerical calculation.",
      "The Chinese term for phase speed and the English 'phase speed' match. Both locate medium 2 relative to medium 1 and preserve the numerator/denominator order.",
      "The vacuum comparison and the ordered-pair comparison are stated directly and equivalently, without hidden notation changes.",
    ],
    raw_comparison: [
      "The independent RAW algebra and definitions agree with the candidate exactly on index direction, phase rather than group speed, frequency and reciprocity.",
      "RAW's additional warning against group speed is not mandatory extra wording: the current answers already explicitly name phase speed.",
    ],
    defects: [],
  },
  {
    topic: "Critical angle, higher-to-lower index and strict threshold",
    SCI: "PASS", ZHEN: "PASS",
    independent_reasoning: [
      "For incident medium 1 and transmitted medium 2, Snell's law gives sin(theta2)=(n1/n2)sin(theta1). The limiting propagating ray has theta2 a right angle, so sin(theta_c)=n2/n1 and theta_c=arcsin(n2/n1).",
      "An ordinary nongrazing critical threshold requires n1>n2. Strictly greater incidence would require sin(theta2)>1, while equality is the grazing limiting ray, not the same geometrical case as incidence strictly above.",
      "Both current answers state the normal-angle convention, the ordered inequality, the symbolic angle and the equality distinction. Ideal transparent-interface wording is read in the ordinary isolated lossless geometrical-optics domain.",
      "The right angle and zero-incidence limit elsewhere are intrinsic conceptual boundary cases, not invented numerical measurements. No numerical critical angle is asserted here.",
    ],
    bilingual_review: [
      "The source asks what the critical angle equals; Chinese preserves that request verbatim. English 'What determines' is a slightly broader phrasing, but naturally requests the index relationship and is immediately answered by the same angle definition and formula.",
      "Both languages preserve higher-to-lower ordering and distinguish 'above' from 'equality'. There is no reversed inequality or angle-from-surface translation.",
      "Nonblocking wording note: the English prompt is less direct about asking for the angle expression. This is not promoted to an independent failed task given the actual symbolic answer and retained conceptual question.",
    ],
    raw_comparison: [
      "RAW and current answers agree on the limiting-angle calculation and the direction of incidence.",
      "RAW also discusses an evanescent field and absence of frustrated transmission. Those physically appropriate boundary qualifications are retained in reviewer assumptions, not required as added elementary display material.",
      "This PASS does not interpret equality as an ordinary refracted ray carrying power normally away from the boundary.",
    ],
    defects: [],
  },
  {
    topic: "Thin-lens thickness, curvature scale and paraxial common plane",
    SCI: "PASS", ZHEN: "PASS",
    independent_reasoning: [
      "A real lens has two separated refracting surfaces. Negligible axial thickness relative to relevant curvature radii, together with negligible effective-plane offsets at the intended precision, permits a common-plane thin-lens representation.",
      "Both answers compare thickness with the two curvature radii and explicitly make neglect accuracy-dependent. Their single-plane statement is expressly in the corresponding paraxial model.",
      "A plane surface's infinite curvature radius is a harmless limiting case. No arbitrary thickness cutoff, radius, diameter or focal distance is supplied or needed.",
      "They do not identify thinness with short focal length or convergence; neither makes thinness a universal nonparaxial accuracy guarantee.",
    ],
    bilingual_review: [
      "Both prompts ask for the thin-lens definition, not a thickness calculation.",
      "Negligible thickness, required accuracy, curvature radii and the two-refractions/one-plane approximation have equivalent scope in both languages.",
      "The last sentence removes common definition confusions without turning the question into a particular converging-lens problem.",
    ],
    raw_comparison: [
      "RAW agrees on curvature comparison, accuracy dependence and common effective plane, but is more explicit about negligible principal-plane/conjugate offsets.",
      "That elaboration is a validity condition of the same approximation, not evidence that the shorter current definition is false. The candidate already says neglect at required accuracy.",
      "Earlier exact author definition wording remains unknown; neither RAW nor candidate is treated as recovered textbook wording.",
    ],
    defects: [],
  },
  {
    topic: "Image-side principal focus, real and virtual, for both lens types",
    SCI: "PASS", ZHEN: "PASS",
    independent_reasoning: [
      "For incident paraxial rays parallel to the principal axis, the thin-lens slope rule alpha_out=alpha_in-y/F gives an axial intersection at x=F, or an axial backward-extension intersection when F<0.",
      "This defines the image-side principal focus for the specified incidence direction; real outgoing convergence belongs to a converging lens and only backward extensions meet for a diverging lens.",
      "Both answers distinguish an actual ray path from a virtual backward extension and do not claim that a lens has only one focus.",
      "The original prompt does not supply a lens type. The response appropriately covers both rather than inventing a particular case. Exact earlier source wording is not available.",
    ],
    bilingual_review: [
      "Both prompts ask the principal-focus definition. Both answers explicitly qualify the focus being defined as image-side for the incidence direction.",
      "The English 'image-side' denotes a conjugate role, not a guarantee of a physical outgoing-side location for a virtual focus; the Chinese has the same meaning.",
      "Real convergence and virtual backward extensions are paired faithfully. A full object-side-focus definition would be optional clarification, not required by this exact review criterion.",
    ],
    raw_comparison: [
      "RAW gives the same image-side definition and adds an object-side definition and equal focal-distance magnitudes in equal surrounding media.",
      "Those additions do not change the correctness of the current bounded image-side answer. Equal distances are not falsely generalized to thick or unequal-medium systems.",
    ],
    defects: [],
  },
  {
    topic: "Lens formula, lowercase f versus F and signed virtual object",
    SCI: "PASS", ZHEN: "PASS",
    independent_reasoning: [
      "Use the lens plane x=0, an object conjugate (-d,y_o), and a ray crossing at y. Its incident paraxial slope is (y-y_o)/d and the lens changes it by -y/F.",
      "At x=f its height is y[1+f/d-f/F]-(f/d)y_o. Independence from aperture height requires 1/d+1/f=1/F, retaining signed distances even when d<0.",
      "The original prose at p0204#2 names d as object distance, f as image distance and F as focal length; p0204#3 states the formula. p0205#1 expressly assigns real/virtual signs including a virtual light-source point, and p0205#2 permits a negative unknown result.",
      "Both current answers preserve all these sign assignments, same surrounding medium and paraxial thin-lens conditions. Their virtual object is where the incoming converging bundle would meet without this lens.",
      "No unknown is forced positive, no sign is applied twice, and lowercase f has not been silently changed to the conventional modern focal-length notation. A focal object gives a collimated infinite-image limit, not a finite f.",
    ],
    bilingual_review: [
      "Both prompts request the lens formula. Both answers preserve the source notation rather than translating f into focal length.",
      "All six real/virtual object/image/focal sign clauses and the virtual-object explanation match between languages.",
      "The signed-unknown instruction is concise and faithful to the source's mathematical intent; neither language treats a coefficient plus sign as proof of a positive result.",
    ],
    raw_comparison: [
      "The independent slope derivation, source refs and virtual-object signs agree with RAW; the comparison was checked algebraically, not accepted because both files print the same formula.",
      "RAW also gives optical power D=1/F. The original request is satisfied by one equivalent lens formula, so omitting the alternative D form is not a capacity loss.",
      "RAW's original-source JOIN HOLD does not forbid use of the complete equation and signs as separately read paragraphs; it also does not authorize clearing that historical HOLD.",
    ],
    defects: [],
  },
  {
    topic: "General construction rays, lens type and axial degeneracy",
    SCI: "FAIL", ZHEN: "PASS",
    independent_reasoning: [
      "In the paraxial same-medium thin-lens model, a parallel incident ray maps to the image-side focus, a ray with an incident supporting line through the object-side focus leaves parallel, and a ray at optical center y=0 has zero slope change.",
      "The candidate starts explicitly with a converging thin lens and supplies a diverging-lens virtual-focus/aimed-ray rule, so it does not silently assume that the original question specifies convergence.",
      "Two genuinely independent outgoing rays or their backward extensions locate a finite real or virtual image; coincident axial rays cannot locate it. Both current answers explicitly recognize the on-axis degeneracy.",
      "However, the second converging-lens rule requires actual passage through the object-side focus 'before the lens'. For a real object between lens and focus, 0<d<F, the focal point x=-F lies behind the emitting object x=-d. It is not on the actual incident ray segment from that object to the lens.",
      "In that entirely admissible original-task case only the incident ray's backward supporting-line extension passes through the focus. With a virtual object, incident supporting lines are similarly the appropriate general description. No such qualification appears in the current second rule.",
      "This is a localized generality/actual-path error, not a request to draw a supplied source figure or to invent an object position. The symbolic interval is a countercase to an unrestricted claim, not new problem data.",
      "For an arbitrary auxiliary nonaxial ray of slope alpha, an axis-parallel auxiliary bundle with that slope identifies y_F=F alpha on the image-side focal plane (or its virtual extension); the refracted ray is determined through this point. The current focal-plane instruction is terse but consistent with that method.",
    ],
    bilingual_review: [
      "Both prompts retain the original request for convenient construction rays, with no specified lens or object distance added to the question.",
      "Converging-lens rules, diverging-lens virtual extensions, two independent rays and the axial-degeneracy warning are paired faithfully.",
      "Both languages use actual passage before the lens in the second rule; this is the same SCI defect, not a mistranslation unique to English.",
      "Nonblocking clarity notes: the outgoing-side focal point in the diverging rule is the object-side principal focus; the nonaxial focal-plane instruction could be more explicit. Neither is recorded as a second scientific failure or as permission for author repair.",
    ],
    raw_comparison: [
      "RAW correctly uses 'incident supporting line' in /solutions/6/correct_explanation_candidate and explicitly allows its extension for a virtual object in /solutions/6/independent_derivation/1.",
      "Unlike literal agreement checks, this review tested the current actual-passage formulation against the allowed symbolic inside-focus case. The loss of RAW's extension qualification is consequential.",
      "RAW's axial-degeneracy treatment is broader than the author's focal-plane shorthand. The current explicit degeneracy warning is nevertheless retained as a correct positive feature.",
      "Neither file is evidence of a viewed or rendered construction drawing. The requested task is naming useful rays, not constructing an image for an unspecified numerical conjugate.",
    ],
    defects: ["N77-Q7_FOCAL_RAY_ACTUAL_PATH_RESTRICTION"],
  },
  {
    topic: "Nonnegative linear-size magnification Gamma",
    SCI: "PASS", ZHEN: "PASS",
    independent_reasoning: [
      "The complete original definition at p0205#4 is image linear size divided by object linear size. p0205#5 defines Gamma=H/h, and p0206#2 gives Gamma=|f|/|d|.",
      "The independent ray-height relation from Q6 gives signed transverse m=y_i/y_o=-f/d. Taking size magnitudes H=|y_i| and h=|y_o|>0 gives Gamma=|m|=|f|/|d|.",
      "Both answers explicitly treat h and H as size magnitudes, require nonzero object height and call Gamma nonnegative. They do not use a negative Gamma to encode an inverted image.",
      "The size ratio applies to finite nonzero conjugate distances in the same paraxial thin-lens model. A point of zero size or an infinite-image limit is not a finite ratio; no such exceptional problem data are specified.",
    ],
    bilingual_review: [
      "Both prompts ask for the magnification definition and both answers identify linear, corresponding sizes, not areas or volumes.",
      "The nonzero-object-size condition, absolute values on conjugate distances and nonnegative/no-orientation-sign explanation match exactly in meaning.",
      "The English word 'magnification' has not silently introduced a signed convention conflicting with the source Gamma.",
    ],
    raw_comparison: [
      "RAW and candidate agree on the nonnegative source Gamma and absolute-distance formula.",
      "RAW additionally states the separate signed transverse m and zero-height/infinite-image caveats. The candidate need not introduce m to answer the source's size-ratio question and already rules out h=0.",
      "No numerical scale, orientation, lens type or particular object position has been added.",
    ],
    defects: [],
  },
];

const evidenceRecords = notes.map((note, i) => ({
  ...questionBindings[i], ...note,
  scientific_assumptions: i < 3 ? (i === 2 ? [...assumptions.refraction, ...assumptions.critical_angle] : assumptions.refraction) : assumptions.lens,
  source_definition_scope: [0, 1, 2, 3, 4, 6].includes(i)
    ? "Earlier exact source definition wording absent from the authorized n77 prose; candidate physics is independently conditional clarification, not recovered source quotation."
    : "Definitions/equations checked against the supplied original n77 prose; no source image or source boundary re-review.",
}));
const findings = [
  {
    id: "N77-Q1_NORMAL_INCIDENCE_SIDE_CLAIM", gate: "SCI", status: "FAIL",
    question_id: "N77-Q1", source_ref: "p0206#4", severity: "P2",
    locations: ["zh", "en"].map((locale) => ({
      path: questionBindings[0].locales[locale].answer_file,
      pointer: "/answers/0/displayAnswer", display_line_1based: 2,
      exact_line: questionBindings[0].locales[locale].displayAnswer.split("\n")[1],
    })),
    reason: "The unqualified opposite-sides clause excludes the normal-incidence case even though the unrestricted question and product-form Snell law include it. At normal incidence both ray segments are on the normal.",
    raw_limitation: "The analogous RAW summary also has this literal side clause; its explicit normal-incidence assumption is the qualifying evidence, not blanket RAW correctness.",
    candidate_modified: false, repair_performed: false,
  },
  {
    id: "N77-Q7_FOCAL_RAY_ACTUAL_PATH_RESTRICTION", gate: "SCI", status: "FAIL",
    question_id: "N77-Q7", source_ref: "p0206#10", severity: "P2",
    locations: ["zh", "en"].map((locale) => ({
      path: questionBindings[6].locales[locale].answer_file,
      pointer: "/answers/6/displayAnswer", display_line_1based: 3,
      exact_line: questionBindings[6].locales[locale].displayAnswer.split("\n")[2],
    })),
    reason: "The second rule demands actual passage through the object-side focus before the lens. For 0<d<F, the focus lies behind the real emitting object; only the incident supporting line's backward extension passes there. The original task does not exclude this case or virtual objects.",
    raw_comparison_pointer: "/solutions/6/independent_derivation/1",
    candidate_modified: false, repair_performed: false,
  },
];

assert.equal(boundary.gates.SOURCE204205_OBJECT_BOUNDARY.status, "PASS");
assert.equal(boundary.historical_d586_join_hold_retained.status, "HOLD");
assert.deepEqual(projection.source_block_deltas, [{
  native_ref: "p0204#3", json_pointer: "/blocks/2/open", from: true, to: false,
  only_in_this_derived_view: true,
  reason: "Complete independently observed equation tail plus independently observed indented new explanatory paragraph; closes this prose object, not section 77.",
}]);
assert.equal(projection.payload_policy.string_join, false);
assert.equal(projection.payload_policy.span_join, false);
assert.match(textReport.SCI, /^pending/);
assert.match(textReport.ZHEN, /^pending/);
const retained = {
  original_SOURCE204205_JOIN: {
    status: "HOLD", id: "SOURCE204_OPEN_VS_SOURCE205_INDENTED_PARAGRAPH",
    provenance: "Exact blocker retained from supplied d596 report; its original d586 path/digest are provenance, not a new read or pixel review here.",
    evidence_file: path.join(scratch, "d596-first-source204205-object-boundary-adjudication/report.json"),
    evidence_pointer: "/historical_d586_join_hold_retained",
    original_blocking_list: boundary.historical_d586_join_hold_retained.blocking_list,
    original_report_path: boundary.historical_d586_join_hold_retained.path,
    original_report_sha256: boundary.historical_d586_join_hold_retained.sha256,
    original_open_flag_cleared: false, old_report_superseded: false,
    blocks_new_signature_on_original_join: true,
    blocks_standalone_conditional_answer_review: false,
  },
  separate_d596_derived_object_boundary: {
    status: "PASS_EXACT_PARAGRAPH_OBJECT_BOUNDARY_ONLY",
    inherited_not_reissued: true, user_authorized_scope_acknowledged: true,
    projection_file: path.join(scratch, "d596-first-source204205-object-boundary-adjudication/proposed-projection.json"),
    projection_sha256: "282e5347c7b6443390dc2e151d9a2414769255d0da8c7adad74d7f8ab9f1b893",
    delta_pointer: "/source_block_deltas/0", only_delta: "p0204#3 /blocks/2/open true -> false in derived view",
    separate_paragraphs: ["p0204#3", "p0205#1"], intervening_footer: "p0204#4",
    words_formulas_and_source_payloads_unchanged: true, string_or_span_join: false,
    projection_applied_here: false, native_assembly_run_here: false,
    original_hold_erased: false, whole_card_approval: false,
  },
  d607_lesson_text: {
    SCI: textReport.SCI, ZHEN: textReport.ZHEN,
    independently_reviewed_here: false, approves_current_answers: false,
    figure_or_display_claims_reused: false,
  },
  native: {
    current_author_report_status: author.native, author_latex_checks: 28,
    author_latex_result: "PASS_ATTRIBUTED_TO_AUTHOR_ONLY",
    receipt_file: path.join(scratch, authorDir, "local-latex.receipt.json"),
    native_finalize_or_latex_reruns_by_this_reviewer: 0,
    reviewer_native_PASS: false,
  },
  whole_n77_card: {
    status: "PENDING", images: "PENDING_SEPARATE_AUTHORIZED_IMAGE_WORK",
    DISPLAY: "PENDING_NOT_OBSERVED", choices: author.choices,
    approved: false, new_source_or_fig_signature: false,
  },
  earlier_exact_definition_wording: {
    status: "UNKNOWN_IN_THIS_SOURCE_SCOPE",
    questions: ["N77-Q1", "N77-Q2", "N77-Q3", "N77-Q4", "N77-Q5", "N77-Q7"],
    fabricated_source_quotations: 0, numerical_question_data_invented: 0,
  },
};

const common = {
  ticket: "STEMROBIN-181", batch: "D033",
  review_id: "d613-n77-first-independent-written-answer-review",
  card: "phy10-c2-s2-n77", record_date: "2026-11-18",
  workspace, ownership_root: owned,
};
const artifactPaths = ["input-bindings.json", "independent-evidence.json", "comparison.json", "report.json", "review-freeze.json"];
function writeFrozen(filename, payload) {
  assert.ok(artifactPaths.includes(filename));
  const absolute = path.join(owned, filename);
  fs.writeFileSync(absolute, `${JSON.stringify(payload, null, 2)}\n`, { flag: "wx", mode: 0o444 });
  fs.chmodSync(absolute, 0o444);
  const bytes = fs.readFileSync(absolute);
  return { path: absolute, sha256: digest(bytes), bytes: bytes.length, mode: "0444" };
}
const bindingFile = writeFrozen("input-bindings.json", {
  schema: "n77-first-independent-written-answer-bindings@1", ...common,
  pins_verified: true, input_files: descriptors,
  original_source_snapshot_deep_equal_in_both_locales: true,
  exact_eight_original_bindings: questionBindings,
  chronology: {
    raw_solutions_birthtime: rawStat.birthtime, raw_report_birthtime: rawReportStat.birthtime,
    current_author_report_birthtime: authorStat.birthtime,
    observed_raw_files_predate_current_author: true,
    filesystem_times_are_corroboration_not_cryptographic_time_attestation: true,
    raw_unapproved_freeze_verified: true,
    current_author_declares_raw_not_read_before_freeze: true,
  },
  read_order: [
    "Repo entry and relevant instructions; original d602 eight questions and original lesson prose were the first substantive content read.",
    "Specified d601 independent RAW solutions/report/freeze were read next, before current authored prompts or display answers.",
    "Specified current d610 report/freeze and both locales' question/answer candidates were then read.",
    "Specified d596 adjudication/projection, separate pending d607 report and attributed author LaTeX receipt were subsequently read for scope only.",
  ],
  hash_timing: "Initial source reads and hash commands shared the first source tool batch. All supplied pins matched before RAW/candidate review; this emitter verifies each pin before JSON parse. No claim that every initial shell read followed its parallel hash command.",
  scope: "Hash binds complete file bytes; JSON pointers and UTF-8 text hashes bind each original question and each reviewed display answer. No figure bytes, native run, answerbook or canonical source reread.",
});
const evidenceFile = writeFrozen("independent-evidence.json", {
  schema: "n77-first-independent-written-answer-evidence@1", ...common,
  role: "Fresh short-lived FIRST independent SCI and ZHEN reviewer of the current eight written prompts/readonly answers; not current author, not permanent/replacement A-D.",
  review_is_after_candidate_read: true,
  no_claim_of_new_blind_or_preauthor_solve: true,
  genuine_preauthor_evidence: { path: path.join(scratch, rawDir, "independent-solutions.json"), sha256: sha.raw, status: raw.status, treated_as_oracle: false },
  reader_job: "After a written conceptual response, the learner should be able to compare it with a scientifically correct and equivalent Chinese/English reference explanation without automatic correctness judging.",
  evidence_method: "One actual semantic review of the exact current snapshot, with independent phase-matching/paraxial reasoning, symbolic countercases and critical comparison to preauthor RAW. Mechanical bindings are not semantic proof.",
  assumptions, per_question: evidenceRecords,
  findings, retained_scope_states: retained,
  images_opened: 0, image_bytes_read: 0, diagrams_observed: 0, DISPLAY_claimed: false,
});
const comparisonFile = writeFrozen("comparison.json", {
  schema: "n77-first-independent-written-answer-comparison@1", ...common,
  raw_source: { path: path.join(scratch, rawDir, "independent-solutions.json"), sha256: sha.raw, approved: false },
  current_author_report: { path: path.join(scratch, authorDir, "report.json"), sha256: sha.author },
  current_author_freeze: { path: path.join(scratch, authorDir, "author-freeze.json"), sha256: sha.authorFreeze },
  source_first_not_author_first: true, comparison_does_not_promote_raw_to_answer_key: true,
  independent_evidence: evidenceFile,
  per_question: evidenceRecords.map((item, i) => ({
    id: item.id, original_ref: item.pages[0], original_pointer: item.original_pointer,
    raw_pointer: `/solutions/${i}`, RAW_status: item.raw_status,
    reviewed_answer_pointers: ["zh", "en"].map((locale) => ({
      path: item.locales[locale].answer_file, pointer: item.locales[locale].answer_pointer,
      sha256_of_display_string: item.locales[locale].display_answer_sha256,
    })),
    SCI: item.SCI, ZHEN: item.ZHEN, comparison: item.raw_comparison,
    localized_defect_ids: item.defects,
  })),
  counts: { original_questions: 8, SCI_PASS: 6, SCI_FAIL: 2, ZHEN_PASS: 8, ZHEN_FAIL: 0, localized_answer_strings: 16 },
  RAW_critical_qualification: "Q1 RAW summary repeats the literal side-clause problem despite its correct normal-incidence caveat; Q7 RAW supporting-line qualification correctly generalizes the focal ray. Extra RAW discussions are not mechanically made mandatory display content.",
  retained_scope_states: retained,
  author_repair_or_replacement_answer_created: false,
});

for (const descriptor of descriptors) {
  const actual = fs.readFileSync(descriptor.path);
  assert.equal(digest(actual), descriptor.sha256, `Concurrent input change: ${descriptor.path}`);
  assert.equal((fs.statSync(descriptor.path).mode & 0o777).toString(8).padStart(4, "0"), descriptor.mode);
}
const reportFile = writeFrozen("report.json", {
  schema: "n77-first-independent-written-answer-review-report@1", ...common,
  status: "FAIL_LOCALIZED_SCI_CURRENT_WRITTEN_BUNDLE_NOT_APPROVED",
  bounded_first_review_finished: true,
  SCI: "FAIL", ZHEN: "PASS_TEXT_ONLY",
  original_task_and_source_bindings: "PASS_EXACT_EIGHT",
  ungraded_readonly_candidate_contract: "PASS_OFFLINE_ONLY",
  current_written_bundle_approved: false,
  full_card_approved: false,
  per_question: evidenceRecords.map((item) => ({
    id: item.id, source_ref: item.pages[0], SCI: item.SCI, ZHEN: item.ZHEN,
    localized_defect_ids: item.defects,
  })),
  counts: { original_questions: 8, bilingual_prompt_pairs: 8, reviewed_display_strings: 16, SCI_PASS: 6, SCI_FAIL: 2, ZHEN_PASS: 8, images_opened: 0 },
  blocking_findings: findings,
  nonblocking_language_notes: [
    { id: "N77-Q3_EN_PROMPT_INDIRECT", pointer: "/exercises/2/text", locale: "en", status: "NOTE_NOT_FAIL", note: "'What determines' is broader than the source's direct request for what the angle equals; the actual answer preserves the symbolic-angle task." },
    { id: "N77-Q7_AUXILIARY_RAY_CLARITY", pointer: "/answers/6/displayAnswer", locales: ["zh", "en"], status: "NOTE_NOT_ADDITIONAL_FAIL", note: "Object-side focus in the diverging rule and the auxiliary focal-plane construction are terse; the meaningful blocking finding is the actual-passage restriction above." },
  ],
  artifacts: [bindingFile, evidenceFile, comparisonFile],
  verification: {
    performed: "Local Node fs/crypto/assert checks for supplied hashes, author and RAW freezes, candidate identities, eight original source snapshots, readonly ungraded fields, chronology corroboration and final unchanged input bytes.",
    successful_assertions_required_before_report_creation: true,
    source_numbers_and_g1_and_pages_preserved: 8,
    complete_original_source_snapshots_equal: 2,
    candidate_prompts_equal_answer_prompts: 16,
    source_derived_grading_ungraded_parts_empty: 16,
    automatic_judge_or_input_payloads: 0,
    no_source_figure_refs_or_figure_evidence: 16,
    author_latex_receipt_checked_as_attribution_only: true,
    independent_semantic_judgment_is_not_an_automated_validation_result: true,
  },
  independence: {
    fresh_short_lived_reviewer: true,
    current_author_outputs_only_reviewed_not_authored: true,
    genuine_RAW_read_before_current_candidate_contents: true,
    RAW_remains_frozen_unapproved: true,
    current_candidates_remain_frozen_unapproved: true,
    no_repeated_review_of_accepted_answers: true,
    no_blind_preauthor_claim_for_this_postauthor_review: true,
    old_unrelated_choices_keys_interactions_answers_or_answerbooks_read: false,
    ticket_backend_operations: 0,
    intentfold_capability_not_invoked: "Bounded offline evidence-only review under the named existing ticket; not autonomous development, handoff, closure or product mutation.",
    external_search: "Two public primary-source discovery search calls (six queries) returned no usable text; no external page, diagram or document was opened or used. Scientific judgments use original prose and explicit independent reasoning, not an external quotation.",
  },
  retained_scope_states: retained,
  operations: {
    writes_outside_owned_root: 0, outside_file_permission_changes: 0,
    shared_original_branch_changed: false, git_commands: 0,
    database_access: 0, paid_calls: 0, image_opens: 0, image_byte_reads: 0,
    source_or_candidate_repairs: 0, native_or_latex_reruns: 0,
    canonical_edits: 0, env_reads_or_writes: 0,
    deploy_or_publish: 0, permanent_workers: 0, new_threads_worktrees_branches: 0,
    runtime_input_or_auto_judging_verification: 0,
    unrelated_shared_bytes_preservation: "All writer and chmod targets are confined to this new owned directory. All bound input bytes/modes were rechecked unchanged; unrelated concurrent changes were not inspected, overwritten or reverted.",
  },
  freeze: {
    required_mode: "0444",
    manifest: path.join(owned, "review-freeze.json"),
    self_hash_policy: "The freeze manifest binds every other owned file. Its own full SHA-256 is delivered in the final text to avoid circular self-hashing.",
    findings_preserved_without_self_author_repair: true,
    no_new_native_or_display_or_full_card_signature: true,
  },
});

fs.chmodSync(script, 0o444);
const scriptBytes = fs.readFileSync(script);
const scriptFile = { path: script, sha256: digest(scriptBytes), bytes: scriptBytes.length, mode: "0444" };
const freezeFile = writeFrozen("review-freeze.json", {
  schema: "n77-first-independent-written-answer-review-freeze@1", ...common,
  status: "FROZEN_FAIL_LOCALIZED_SCI_ZHEN_PASS_TEXT_ONLY",
  files: [bindingFile, evidenceFile, comparisonFile, reportFile, scriptFile],
  self: {
    path: path.join(owned, "review-freeze.json"), required_mode: "0444",
    sha256: "Excluded to avoid a circular self-digest; full byte SHA-256 delivered externally after freeze.",
  },
  input_bindings: bindingFile, reviewed_original_questions: 8,
  SCI: "FAIL", ZHEN: "PASS_TEXT_ONLY",
  localized_FAIL_ids: findings.map((item) => item.id),
  original_HOLD_id: "SOURCE204_OPEN_VS_SOURCE205_INDENTED_PARAGRAPH",
  original_HOLD_preserved: true, separate_d596_authorized_projection_not_superseded: true,
  RAW_unapproved_preserved: true, current_author_outputs_unchanged: true,
  native_latex_reruns: 0, images_opened: 0, DISPLAY_or_fig_PASS: false,
  whole_n77_card: "PENDING_NOT_APPROVED",
  repair_performed: false, writes_outside_owned_root: 0,
  new_permanent_workers_worktrees_branches: 0,
  bounded_first_independent_review_finished: true,
});

for (const record of [bindingFile, evidenceFile, comparisonFile, reportFile, scriptFile, freezeFile]) {
  assert.equal(digest(fs.readFileSync(record.path)), record.sha256);
  assert.equal(fs.statSync(record.path).mode & 0o777, 0o444);
  if (record.path.endsWith(".json")) JSON.parse(fs.readFileSync(record.path, "utf8"));
}
for (const descriptor of descriptors) assert.equal(digest(fs.readFileSync(descriptor.path)), descriptor.sha256);
assert.deepEqual(fs.readdirSync(owned).sort(), ["freeze-review.mjs", ...artifactPaths].sort());
console.log(JSON.stringify({
  status: "FAIL_LOCALIZED_SCI; ZHEN=PASS_TEXT_ONLY; WHOLECARD=PENDING",
  original_questions: 8, SCI_PASS: 6, SCI_FAIL: 2, ZHEN_PASS: 8,
  images_opened: 0, native_reruns: 0, all_owned_files_0444: true,
  files: [reportFile, bindingFile, comparisonFile, evidenceFile, freezeFile, scriptFile],
}, null, 2));
