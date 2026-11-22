import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const owner = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(owner, "..", "..", "..", "..", "..");
const draft = path.join(path.dirname(owner), "n29-draft-first-06");
const lessonId = "geo68-c2-s4-n29";
const edition = "modern-us-neutral";
const exerciseIds = Array.from({ length: 9 }, (_, i) => String(364 + i));
const checked = [];

assert.equal(repo, "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck");
assert.equal(
  owner,
  path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n29-text-and-nine-answers-author-first-06"),
);

const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readJson = (name) => JSON.parse(fs.readFileSync(name, "utf8"));
const binding = (name) => {
  const bytes = fs.readFileSync(name);
  return { path: name, sha256: sha(bytes), bytes: bytes.length };
};
const check = (name, action) => {
  action();
  checked.push(name);
};
const ownedPath = (name) => {
  const target = path.resolve(owner, name);
  assert.ok(target.startsWith(`${owner}${path.sep}`), "Writes must remain in the dedicated owner directory");
  return target;
};
const writeGenerated = (name, text) => fs.writeFileSync(ownedPath(name), text, { flag: "wx" });
const writeJson = (name, data) => writeGenerated(name, `${JSON.stringify(data, null, 2)}\n`);
const math = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((match) => match[1]);
const expectHash = (name, expected) => assert.equal(binding(name).sha256, expected);
const modernLessonPath = ownedPath("candidates/lesson.candidate.json");
const modernExercisesPath = ownedPath("candidates/exercises.candidate.json");
const keysPath = ownedPath("candidates/answer-keys.candidate.json");
const baselineLessonPath = ownedPath("sealed/lesson.template.json");
const baselineExercisesPath = ownedPath("sealed/exercises.template.json");
const recordPath = path.join(draft, "retained-and-prepared.json");
const templateRoot = path.join(draft, "work/adapt/6-8g", edition, "lessons", lessonId);
const rawRoot = path.join(draft, "artifacts/6-8g/lessons", lessonId);
const baselineLesson = readJson(baselineLessonPath);
const baselineExercises = readJson(baselineExercisesPath);
const modernLesson = readJson(modernLessonPath);
const modernExercises = readJson(modernExercisesPath);
const keys = readJson(keysPath);

check("Original and sealed template hashes match the directly supplied identities", () => {
  for (const root of [path.join(owner, "sealed"), templateRoot]) {
    expectHash(
      path.join(root, "lesson.template.json"),
      "efc029cb50dd33ba27e48d56d60dbc3647fece73338ab725099a197001cc1ade",
    );
    expectHash(
      path.join(root, "exercises.template.json"),
      "0d9d18543c5c7b131c7ee8a0857de643a02130b9bfa387f1c606b7c05400339a",
    );
  }
  for (const name of [recordPath, ownedPath("sealed/retained-and-prepared.json")]) {
    expectHash(name, "6c6733befca5f89b33edf8aadccba9fdd28d9a03ad311883ad41c8eb5749b0c3");
  }
});

check("Sealed bytes are separate read-only files; candidates are writable", () => {
  for (const name of [baselineLessonPath, baselineExercisesPath, ownedPath("sealed/retained-and-prepared.json")]) {
    assert.equal(fs.statSync(name).mode & 0o222, 0);
  }
  for (const name of [modernLessonPath, modernExercisesPath, keysPath]) {
    assert.notEqual(fs.statSync(name).mode & 0o200, 0);
  }
  assert.notEqual(fs.statSync(baselineLessonPath).ino, fs.statSync(modernLessonPath).ino);
  assert.notEqual(fs.statSync(baselineExercisesPath).ino, fs.statSync(modernExercisesPath).ino);
});

check("Embedded raw source and its source hash match retained raw lesson/exercise bytes", () => {
  for (const [document, name] of [[modernLesson, "lesson.json"], [modernExercises, "exercises.json"]]) {
    assert.deepEqual(document.source.data, readJson(path.join(rawRoot, name)));
    assert.equal(document.source.sha256, binding(path.join(rawRoot, name)).sha256);
  }
});

check("All immutable metadata, source fields, item order and math-span sequences are unchanged", () => {
  for (const [baseline, candidate, listKey] of [
    [baselineLesson, modernLesson, "prose"],
    [baselineExercises, modernExercises, "exercises"],
  ]) {
    const baselineMeta = { ...baseline };
    const candidateMeta = { ...candidate };
    for (const object of [baselineMeta, candidateMeta]) {
      delete object[listKey];
      if (listKey === "prose") delete object.section_breaks;
    }
    assert.deepEqual(candidateMeta, baselineMeta);
    assert.equal(candidate[listKey].length, baseline[listKey].length);
    for (let i = 0; i < baseline[listKey].length; i += 1) {
      const oldItem = { ...baseline[listKey][i] };
      const newItem = { ...candidate[listKey][i] };
      for (const object of [oldItem, newItem]) {
        delete object.text;
        delete object.lines;
        delete object.changes;
      }
      assert.deepEqual(newItem, oldItem);
      assert.deepEqual(math(candidate[listKey][i].text), math(baseline[listKey][i].text));
      if (listKey === "exercises") {
        assert.equal(candidate[listKey][i].lines.join("\n"), candidate[listKey][i].text);
      }
    }
  }
});

check("Exactly 23 original blocks, 9 exercises in order, 3 untouched figure slots, no exercise image references", () => {
  assert.equal(modernLesson.prose.length, 23);
  assert.equal(modernLesson.exercise_count, 9);
  assert.equal(modernExercises.count, 9);
  assert.equal(modernLesson.prose.filter((item) => item.kind === "fig").length, 3);
  assert.deepEqual(modernExercises.exercises.map((item) => item.number), exerciseIds);
  for (const exercise of modernExercises.exercises) {
    assert.deepEqual(exercise.figure_refs, []);
    assert.deepEqual(exercise.figures, []);
  }
});

check("Modern candidate prose and answer math delimiters balance; Chinese punctuation is outside math", () => {
  const texts = [
    ...modernLesson.prose.map((item) => item.text),
    ...modernExercises.exercises.map((item) => item.text),
    ...keys.answers.map((item) => item.displayAnswer),
  ];
  for (const text of texts) {
    assert.equal((text.match(/\$/g) ?? []).length % 2, 0);
    for (const expression of math(text)) assert.ok(!/[，。；：？！、]/u.test(expression));
  }
});

check("Original distance cases and literal Cyrillic figure-187 correspondence stay unchanged", () => {
  const byRef = (ref) => modernLesson.prose.find((item) => item.source_refs.includes(ref));
  assert.deepEqual(math(byRef("p0136#1").text), ["h>r", "h=r", "h<r"]);
  assert.ok(byRef("p0135#5").text.includes("а、б、в"));
  assert.ok(byRef("p0136#3").text.includes("187$，а"));
  assert.ok(byRef("p0136#5").text.includes("187$，б"));
  assert.ok(byRef("p0136#8").text.includes("187$，в"));
  for (const [ref, prefix] of [["p0136#7", "35 "], ["p0136#12", "36 "], ["p0137#1", "**37** "]]) {
    assert.ok(byRef(ref).text.startsWith(prefix));
  }
});

check("Every multipart exercise has its ordered part labels on separate lines", () => {
  for (const [number, count] of [["364", 3], ["365", 2], ["368", 2]]) {
    const exercise = modernExercises.exercises.find((item) => item.number === number);
    const partLines = exercise.lines.filter((line) => /^\d+\)/.test(line));
    assert.equal(partLines.length, count);
    assert.deepEqual(partLines.map((line) => line.match(/^\d+\)/)[0]), Array.from({ length: count }, (_, i) => `${i + 1})`));
    assert.ok(exercise.lines[0].startsWith(`${number}.`));
    assert.ok(!/^\d+\)/.test(exercise.lines[0]));
  }
});

check("Nine complete draft answer keys; one numeric classification, eight ungraded complete solutions", () => {
  assert.equal(keys.schema, "ld-s10y-answer/lesson-answers@1");
  assert.equal(keys.book, "6-8g");
  assert.equal(keys.lesson, lessonId);
  assert.equal(keys.edition, edition);
  assert.equal(keys.status, "draft");
  assert.deepEqual(keys.answers.map((item) => item.exercise), exerciseIds);
  for (const answer of keys.answers) {
    assert.deepEqual(Object.keys(answer).sort(), ["exercise", "grading", "source", "displayAnswer", "parts", "notes"].sort());
    assert.equal(answer.source, "derived");
    assert.ok(answer.displayAnswer.trim().length > 0);
    assert.ok(Array.isArray(answer.notes) && answer.notes.some((note) => note.includes("AUTHOR_ONLY")));
    assert.ok(Array.isArray(answer.parts));
    if (answer.exercise === "364") {
      assert.equal(answer.grading, "auto");
      assert.deepEqual(answer.parts.map((part) => part.expected), [["0"], ["2"], ["1"]]);
      for (const part of answer.parts) assert.equal(part.judge, "numeric");
    } else {
      assert.equal(answer.grading, "ungraded");
      assert.deepEqual(answer.parts, []);
    }
  }
  for (const [number, count] of [["364", 3], ["365", 2], ["368", 2]]) {
    const answer = keys.answers.find((item) => item.exercise === number);
    for (let i = 1; i <= count; i += 1) assert.match(answer.displayAnswer, new RegExp(`(?:^|\\n)${i}\\)`));
  }
});

const optionalCanonical = ["bookanswers.json", "answers.json"].map((name) => ({
  path: path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/6-8g", name),
  exists: fs.existsSync(path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/6-8g", name)),
}));
check("Optional canonical answer sources are absent; no bookRaw attribution is fabricated", () => {
  assert.ok(optionalCanonical.every((item) => !item.exists));
  assert.ok(keys.answers.every((item) => !Object.hasOwn(item, "bookRaw")));
});

const helperPath = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs");
const helperStart = new Date().toISOString();
const helper = spawnSync(process.execPath, [helperPath, modernLessonPath], {
  cwd: repo,
  encoding: "utf8",
});
assert.ifError(helper.error);
writeGenerated("prose-flow.txt", helper.stdout);
writeGenerated("prose-flow.stderr.txt", helper.stderr);
const helperReceipt = {
  schema: "n29-author-local-helper-execution@1",
  purpose: "Read-only existing prose boundary helper; not a producer, render, finalizer or review",
  cwd: repo,
  argv: [process.execPath, helperPath, modernLessonPath],
  startedAt: helperStart,
  finishedAt: new Date().toISOString(),
  exitCode: helper.status,
  signal: helper.signal,
  helper: binding(helperPath),
  candidateInput: binding(modernLessonPath),
  streams: {
    stdout: binding(ownedPath("prose-flow.txt")),
    stderr: binding(ownedPath("prose-flow.stderr.txt")),
  },
};
writeJson("prose-flow.execution.json", helperReceipt);
check("Section boundaries are copied from existing prose_flow.mjs output, not counted offsets", () => {
  assert.equal(helper.status, 0);
  const boundaries = helper.stdout.split("\n")
    .filter((line) => line.trimStart().startsWith("break: "))
    .map((line) => JSON.parse(line.slice(line.indexOf("break: ") + 7)));
  assert.equal(modernLesson.section_breaks.length, 4);
  for (const selected of modernLesson.section_breaks) {
    assert.ok(boundaries.some((item) => item.before === selected.before && item.after === selected.after));
    assert.deepEqual(Object.keys(selected).sort(), ["after", "before"]);
  }
});

const candidateBindings = {
  lesson: binding(modernLessonPath),
  exercises: binding(modernExercisesPath),
  answerKeys: binding(keysPath),
};
const exerciseBindings = modernExercises.exercises.map((exercise, i) => ({
  exercise: exercise.number,
  candidatePromptFile: candidateBindings.exercises,
  candidatePromptTextSha256: sha(exercise.text),
  sourceTextSha256: sha(exercise.source_text),
  sourceRefs: exercise.pages,
  candidateAnswerFile: candidateBindings.answerKeys,
  answerItemJsonSha256: sha(JSON.stringify(keys.answers[i])),
  answerDisplayTextSha256: sha(keys.answers[i].displayAnswer),
  grading: keys.answers[i].grading,
  source: keys.answers[i].source,
  independentReview: "pending",
}));
const counts = {
  originalProseBlocks: 23,
  modernCandidateProseBlocks: modernLesson.prose.length,
  textProseBlocks: modernLesson.prose.filter((item) => item.kind === "p").length,
  figureSlotsRetained: 3,
  captionSlotsRetained: 3,
  exerciseCandidates: modernExercises.exercises.length,
  answerCandidates: keys.answers.length,
  derivedAnswerCandidates: 9,
  autoAnswerCandidates: 1,
  autoParts: 3,
  ungradedAnswerCandidates: 8,
  sectionBoundaryObjects: 4,
  ownSessions: 0,
  childSessions: 0,
  independentReviews: 0,
  imageLoads: 0,
  imageFilesProduced: 0,
  screenshots: 0,
  sourcePdfOpens: 0,
  networkCalls: 0,
  paidCalls: 0,
  backendCalls: 0,
  databaseCalls: 0,
  gitMutations: 0,
  producerReruns: 0,
  setupOrUpdateCalls: 0,
  adaptFinalizeCalls: 0,
  renderCalls: 0,
  nativeAnswerPrepareCalls: 0,
  nativeAnswerFinalizeCalls: 0,
  wholeBookGates: 0,
  publishCalls: 0,
  deployCalls: 0,
  handoffs: 0,
  extraChatsCreated: 0,
  failedLocalInvariantAttempts: 1,
  candidateTextWritingPasses: 1,
  affectedFormulaReferenceRepairs: 1,
  answerWritingPasses: 1,
  proseFlowHelperCalls: 2,
};
const authorChecks = {
  schema: "n29-author-local-checks@1",
  status: "AUTHOR_ONLY",
  interpretation: "Local producer assertions only, not independent text/key review, gate2 approval, runtime verification or full-lesson approval.",
  checkedInvariants: checked,
  candidateBindings,
  exerciseBindings,
  counts,
  independentTextReview: "pending",
  independentKeyReview: "pending",
  formalGateExecuted: false,
  approved: false,
};
writeJson("author-checks.json", authorChecks);

const inputPaths = [
  recordPath,
  path.join(templateRoot, "lesson.template.json"),
  path.join(templateRoot, "exercises.template.json"),
  path.join(rawRoot, "lesson.json"),
  path.join(rawRoot, "lesson.md"),
  path.join(rawRoot, "exercises.json"),
];
const angleDefinitionPaths = [51, 52].map((number) =>
  path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages", String(number).padStart(4, "0"), "page.json"),
);
const scopedInputs = [
  ...inputPaths.map(binding),
  ...angleDefinitionPaths.map((name) => ({
    ...binding(name),
    use: "Only literal prose defining rays, angle regions, nonconvex angles and straight angles; no figures read.",
  })),
];
const rulePaths = [
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".claude/skills/ld-s10y-answer/SKILL.md",
  ".claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md",
  ".claude/skills/ld-s10y-answer/tools/lesson_answers.py",
];
const listOwnedFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const name = path.join(directory, entry.name);
  return entry.isDirectory() ? listOwnedFiles(name) : [name];
});
const outputFiles = listOwnedFiles(owner).sort();
assert.ok(outputFiles.every((name) => !/\.(?:png|jpe?g|svg|webp|gif|pdf|html|css)$/i.test(name)));
const report = {
  schema: "n29-text-and-nine-answers-author-report@1",
  status: "AUTHOR_ONLY",
  createdAt: new Date().toISOString(),
  ticket: "STEMROBIN-188",
  assignment: "SAME188-6 continuous OFFLINE finish=review",
  owner,
  book: "6-8g",
  lesson: lessonId,
  edition,
  exerciseScope: exerciseIds,
  installedAuthorityAsSupplied: "db613601/corresponding093a4baa",
  authorityChanged: false,
  sourceBoundaryAsSupplied: {
    startInclusive: "p0135#4 29.直线和圆周的相关位置",
    endExclusive: "p0138#4 30.作图问题",
  },
  parentPermanentCounterAsSupplied: "24/24 retained; not reset, replaced or incremented by an independent review",
  originalInputs: scopedInputs,
  rulesAndConventions: rulePaths.map((name) => binding(path.join(repo, name))),
  optionalCanonicalBookAnswers: optionalCanonical,
  candidateBindings,
  exerciseBindings,
  outputManifest: outputFiles.map((name) => ({
    ...binding(name),
    mode: (fs.statSync(name).mode & 0o777).toString(8).padStart(4, "0"),
    role: name.includes(`${path.sep}sealed${path.sep}`) ? "immutable byte-identical baseline" : "author-owned candidate or producer evidence",
  })),
  reportIntegrity: {
    path: ownedPath("Report.json"),
    selfSha256: "Returned externally in the final text; omitted here to avoid a recursive self-hash.",
    manifestCoverage: "Every other file under this exact owner directory at report creation.",
  },
  counts,
  wordingNotes: [
    {
      sourceRefs: ["p0136#3"],
      type: "SOURCE_WORDING_LOGIC_DEFECT",
      originalIssue: "The parenthesis treats the nearest point as any point of the line.",
      candidateAction: "Explicitly infer exclusion of all other points from the minimum distance already exceeding the radius.",
      sourceOrFormulaChanged: false,
      formalErratumCreated: false,
    },
    {
      sourceRefs: ["p0137#4", "p0137#7"],
      type: "PROOF_JUSTIFICATION_CLARIFIED",
      candidateAction: "Name the preceding distance trichotomy as justification that all noncontact points of a tangent are exterior.",
      sourceOrFormulaChanged: false,
    },
    {
      sourceRefs: ["p0136#7", "p0136#12", "p0137#1"],
      type: "OPAQUE_PRINTING_IDENTITY_UNRESOLVED",
      candidateAction: "Retain prepared visible prefixes literally; do not decode black printing markers, create theorem identities, or reconstruct removed printing marks.",
    },
    {
      type: "LAYOUT_ONLY_BOUNDARIES",
      evidence: binding(ownedPath("prose-flow.execution.json")),
      candidateAction: "Use four exact before/after boundary objects emitted by the existing helper; no hand-counted offsets, CSS or HTML.",
    },
  ],
  mathematicsNotes: {
    evidence: binding(ownedPath("author-reasoning.md")),
    allNineNewlyDerived: true,
    originalGivensAndFormulasPreserved: true,
    rayFeetAndVertexCasesHandled: ["365", "368", "369"],
    finiteTriangleSegmentsNotExtensions: "371",
    internalAndExternalCircleTangency: "370",
    nonCircularNearestPointConverse: "372",
    inventedBookRaw: false,
    mathematicalFormulaErrataCreated: false,
    independentCorrectnessApproval: false,
  },
  diagnostics: [
    {
      type: "LOCAL_FORMULA_REFERENCE_CHECK_FAILED_THEN_AFFECTED_ONLY_REPAIR",
      evidence: binding(ownedPath("first-author-check-failure.json")),
      producerReplayed: false,
      sourceChanged: false,
    },
    {
      type: "READ_ONLY_LOOKUP_DIAGNOSTICS",
      observations: [
        "Owner directory was initially absent; created only that authorized output directory and its sealed/candidates subdirectories.",
        "modern.py was absent; the existing edition.py string-array changes convention was located without editing any core file.",
        "Angle text was first sought without the ten-page physical offset; only pages0051/0052 definitions supply the angle assumptions used here.",
      ],
      formalHoldInvented: false,
    },
  ],
  localAuthorChecks: binding(ownedPath("author-checks.json")),
  reviewState: {
    independentTextReview: "pending",
    independentKeyReview: "pending",
    producerIsIndependentReviewer: false,
    selfApproved: false,
    formalGate2Executed: false,
    fullLessonApproved: false,
    modernFiguresProduced: false,
    modernFiguresApproved: false,
    nativeFigure189DamagedLabelsResolved: false,
    historicalBlackMarkerIdentitiesResolved: false,
    published: false,
    formalHoldsCreated: [],
    nextCoordinationOwner: "Parent retains and collects these files and coordinates one independent reviewer; no chat or handoff created here.",
  },
  boundaries: {
    writesOnlyUnderOwner: true,
    originalsUnchanged: true,
    sharedCoreFilesChanged: false,
    imagesOrPdfOpened: false,
    networkOrDatabaseUsed: false,
    producerOrNativeFinalizationRun: false,
    wholeBookApprovalClaimed: false,
  },
};
writeJson("Report.json", report);
console.log(JSON.stringify({
  status: "AUTHOR_ONLY",
  report: binding(ownedPath("Report.json")),
  candidates: candidateBindings,
  invariantsRecorded: checked.length,
  independentTextReview: "pending",
  independentKeyReview: "pending",
  ownSessions: 0,
  images: 0,
}, null, 2));
