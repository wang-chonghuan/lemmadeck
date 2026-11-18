import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const owned = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp");
const source = path.join(tmp, "d032-t18-text-repair/frozen");
const scripts = path.join(workspace, ".agents/skills/ld-s10y-choice/scripts");
const selected = ["4", "5", "6", "7"];
const seedRelative = ".intentfold/tickets/STEMROBIN-181/tmp/d308/seed.json";
const expected = {
  "lesson.template.json": "5ec317b53627f947129d0f56d9cd46ee4089df5ec139e263e2b377c6dcf2b6fd",
  "exercises.template.json": "fb4ca6d2d5d7d060c51e2ae8d0e3c8310cc4c67aa72b3d9cbe1e2ac494f392f0",
  "english.lesson.template.json": "d1b3cf80796c12c94915d59a5da01c09661cfc4379aa209dda41168450f29f86",
  "english.exercises.template.json": "fbc806dcc4c5108bfe3bd9bec17931d5bd65df6dd21b745c7474e980b1219f02",
  "figures.template.json": "254a760157bfec9af60f556759ec37a9bb79de2cd4694a53c62abe6f7587ff8d"
};
const effectiveReview = path.join(tmp, "d032-t18-science-effective-review.json");
const effectiveReviewExpected = "20a9faf60ed130ff34d1d0c10b32dab5f981f8ade18c062193df030c0d48f6b9";
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fileSha = (file) => sha(fs.readFileSync(file));
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (relative, value) => {
  const file = path.join(owned, relative);
  assert(file.startsWith(`${owned}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  return file;
};
const record = (file) => ({ path: file, sha256: fileSha(file) });
const stagePaths = (language) => {
  const repo = path.join(owned, language, "repo");
  const lesson = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/phy9-c2-s4-t18");
  return { repo, lesson, seed: path.join(repo, seedRelative) };
};
const runNative = (name, script, args, stdoutProjection) => {
  const receiptDirectory = path.join(owned, "receipts", name);
  assert(!fs.existsSync(receiptDirectory), `receipt already exists: ${name}`);
  fs.mkdirSync(receiptDirectory, { recursive: true });
  const argv = ["python3", path.join(scripts, script), ...args];
  const start = new Date().toISOString();
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: workspace,
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }
  });
  for (const [name, text] of [["stdout.txt", result.stdout || ""], ["stderr.txt", result.stderr || ""]]) {
    fs.writeFileSync(path.join(receiptDirectory, name), text, { flag: "wx" });
  }
  const receipt = {
    schema: "d308-native-receipt-v1",
    argv,
    command: argv.map((arg) => `'${arg.replaceAll("'", "'\\''")}'`).join(" "),
    cwd: workspace,
    startedAt: start,
    completedAt: new Date().toISOString(),
    exit: result.status,
    signal: result.signal,
    spawnError: result.error?.message || null,
    executableSource: record(path.join(scripts, script)),
    stdout: record(path.join(receiptDirectory, "stdout.txt")),
    stderr: record(path.join(receiptDirectory, "stderr.txt")),
    interpretation: "Native first attempt; structural/projection evidence only, not independent semantic approval."
  };
  write(`receipts/${name}/receipt.json`, receipt);
  console.log(JSON.stringify({ name, exit: result.status, stdout: stdoutProjection ? stdoutProjection(result.stdout || "") : result.stdout, stderr: result.stderr }));
  return receipt;
};

const stage = process.argv[2];
if (stage === "setup") {
  const inputs = Object.entries(expected).map(([name, expectedSha256]) => {
    const file = path.join(source, name);
    const actual = fileSha(file);
    assert.equal(actual, expectedSha256, name);
    return { path: file, sha256: actual, expectedSha256 };
  });
  assert.equal(fileSha(effectiveReview), effectiveReviewExpected);
  const contractPaths = [
    ".agents/skills/ld-s10y-choice/SKILL.md",
    ".agents/skills/ld-s10y-choice/references/authoring.md",
    ".agents/skills/ld-s10y-choice/references/contract.md",
    ".agents/skills/ld-s10y-choice/scripts/prepare.py",
    ".agents/skills/ld-s10y-choice/scripts/validate.py"
  ];
  write("input-hashes.json", {
    schema: "d308-input-binding-v1",
    boundAt: new Date().toISOString(),
    inputs,
    statusOnlyReview: { path: effectiveReview, sha256: effectiveReviewExpected },
    contract: contractPaths.map((relative) => record(path.join(workspace, relative))),
    selectedSourceNumbers: selected,
    imageBudget: { inherited: 24, newOpens: 0, cumulative: 24, limit: 24 },
    forbiddenInputs: "No answers, historical choices, interactions, d305/d306/d307/d309 solutions, parent independently frozen baseline, or image content."
  });
  // Persist the byte binding before parsing any source semantics or review status.
  const review = read(effectiveReview);
  write("effective-text-status-summary.json", {
    source: record(effectiveReview),
    consumedFields: ["status", "approval", "completeCardClaim", "editorialCorrectionStatus", "exercises[number in 4,5,6,7].number", "exercises[number in 4,5,6,7].status"],
    status: review.status,
    approval: review.approval,
    completeCardClaim: review.completeCardClaim,
    editorialCorrectionStatus: review.editorialCorrectionStatus,
    exercises: review.exercises.filter((item) => selected.includes(String(item.number))).map((item) => ({ number: item.number, status: item.status })),
    forbiddenContentNotConsumed: ["finding", "observations", "independent_solution"],
    retainedHoldsFromHumanDirection: ["1: fig189 repair HOLD remains", "9: glow/corona without erratum authorization HOLD remains"]
  });
  const staging = [];
  const consumption = [];
  for (const language of ["zh", "en"]) {
    const { repo, lesson } = stagePaths(language);
    const mapping = {
      "lesson.json": language === "zh" ? "lesson.template.json" : "english.lesson.template.json",
      "exercises.json": language === "zh" ? "exercises.template.json" : "english.exercises.template.json",
      "figures.json": "figures.template.json"
    };
    fs.mkdirSync(lesson, { recursive: true });
    for (const [destinationName, sourceName] of Object.entries(mapping)) {
      const from = path.join(source, sourceName);
      const to = path.join(lesson, destinationName);
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
      assert.equal(fileSha(from), fileSha(to));
      staging.push({ language, source: record(from), staged: record(to), byteEqual: true });
    }
    const lessonData = read(path.join(lesson, "lesson.json"));
    const exercises = read(path.join(lesson, "exercises.json"));
    assert.equal(lessonData.id, "phy9-c2-s4-t18");
    assert.equal(lessonData.status, "draft");
    assert.equal(lessonData.prose.length, 0);
    assert.equal(exercises.exercises.length, 16);
    const book = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/9p/book.json");
    fs.writeFileSync(book, `${JSON.stringify({ lessons: [{ id: lessonData.id }] }, null, 2)}\n`, { flag: "wx" });
    staging.push({ language, selectorAdapter: record(book), provenance: "Minimal isolated lookup adapter derived from authorized lesson.id, not original/canonical book provenance or adapt-finalize approval." });
    const tasks = exercises.exercises.filter((item) => selected.includes(String(item.number)));
    assert.equal(tasks.length, 4);
    for (const item of tasks) {
      assert.deepEqual(item.figure_refs || [], []);
      assert.deepEqual(item.figures || [], []);
    }
    consumption.push({
      language,
      lesson: { id: lessonData.id, status: lessonData.status, proseCount: lessonData.prose.length },
      exercisesStatus: exercises.status,
      fullSourceExerciseCount: exercises.exercises.length,
      selectedTasks: tasks.map((item) => ({
        number: item.number,
        availableFieldNames: Object.keys(item),
        text: item.text,
        source_text: item.source_text,
        source_refs: item.source_refs,
        figure_refs: item.figure_refs || []
      })),
      selectedConceptBlocks: [],
      noConceptsReason: "Standalone exercise card has no definition prose; no outside card definitions added."
    });
  }
  write("source-binding.json", { inputHashes: record(path.join(owned, "input-hashes.json")), staging, fullCopiesUnmodified: true, originalStatusPreserved: true });
  write("selected-source-projection.json", consumption);
  write("actual-opens.json", {
    schema: "d308-actual-opens-v1",
    inheritedCumulative: 24,
    opens: [],
    newImageOpens: 0,
    cumulative: 24,
    limit: 24,
    renderedImages: 0,
    note: "No PNG, SVG, crop, preview, screenshot, or other image opened; no image generation."
  });
  console.log(JSON.stringify(consumption, null, 2));
  console.log(JSON.stringify(read(path.join(owned, "effective-text-status-summary.json")), null, 2));
} else if (stage === "prepare") {
  for (const language of ["zh", "en"]) {
    const { repo, seed } = stagePaths(language);
    const common = ["--repo", repo, "--book", "9p", "--lesson", "phy9-c2-s4-t18"];
    const inspected = runNative(`${language}-inspect-initial`, "prepare.py", ["inspect", ...common], (stdout) => {
      const data = JSON.parse(stdout);
      return { exercises: data.exercises.filter((item) => selected.includes(item.number)), concept_candidates: data.concept_candidates, figureIdsOnly: data.figures.map((figure) => figure.id) };
    });
    assert.equal(inspected.exit, 0, "initial inspect failed; retained receipt, no automatic retry");
    const prepared = runNative(`${language}-prepare-initial`, "prepare.py", [
      "prepare", ...common, ...selected.flatMap((number) => ["--exercise", number]), "--no-concepts", "--out", seed
    ]);
    assert.equal(prepared.exit, 0, "initial prepare failed; retained receipt, no automatic retry");
    const data = read(seed);
    assert.deepEqual(data.exercises.map((item) => item.number), selected);
    assert.deepEqual(data.figures, []);
    assert.deepEqual(data.concepts, []);
  }
} else if (stage === "checkpoint") {
  const preoptions = path.join(owned, "pre-options-independent-solutions.json");
  assert(fs.existsSync(preoptions));
  for (const language of ["zh", "en"]) {
    assert(!fs.existsSync(path.join(owned, language, "draft.json")), "draft exists before independent-solution checkpoint");
    assert(fs.existsSync(stagePaths(language).seed));
  }
  fs.chmodSync(preoptions, 0o444);
  const seeds = ["zh", "en"].map((language) => {
    const { seed } = stagePaths(language);
    const result = runNative(`${language}-seed-digest`, "prepare.py", ["digest", seed]);
    assert.equal(result.exit, 0);
    return { language, ...record(seed), canonicalSha256: fs.readFileSync(path.join(owned, "receipts", `${language}-seed-digest`, "stdout.txt"), "utf8").trim() };
  });
  const checkpoint = write("pre-options-checkpoint.json", {
    schema: "d308-pre-options-checkpoint-v1",
    frozenAt: new Date().toISOString(),
    independentSolutions: record(preoptions),
    permissions: "0444",
    seeds,
    draftFilesAbsentAtCheckpoint: true,
    phase: "Independent source reasoning completed and frozen before any options were authored.",
    author: "Existing Galileo; not an independent reviewer."
  });
  fs.chmodSync(checkpoint, 0o444);
  console.log(JSON.stringify(read(checkpoint), null, 2));
} else if (stage === "validate") {
  const checkpoint = read(path.join(owned, "pre-options-checkpoint.json"));
  assert.equal(fileSha(checkpoint.independentSolutions.path), checkpoint.independentSolutions.sha256);
  for (const language of ["zh", "en"]) {
    const { repo, seed } = stagePaths(language);
    const draftPath = path.join(owned, language, "draft.json");
    const receipt = runNative(`${language}-validate-initial`, "validate.py", ["--repo", repo, "--seed", seed, "--draft", draftPath]);
    const draft = read(draftPath);
    write(`${language}/visible-only.json`, draft.questions.map((question) => question.view));
    write(`${language}/validation-snapshot.json`, {
      seed: record(seed),
      draft: record(draftPath),
      visibleOnly: record(path.join(owned, language, "visible-only.json")),
      exactViewProjection: true,
      nativeReceipt: record(path.join(owned, "receipts", `${language}-validate-initial`, "receipt.json")),
      exit: receipt.exit,
      semanticReview: "PENDING; author structural validation only",
      initialFailurePreserved: receipt.exit !== 0
    });
  }
} else if (stage === "handoff") {
  const inputBinding = read(path.join(owned, "input-hashes.json"));
  const inputRecheck = [...inputBinding.inputs, inputBinding.statusOnlyReview, ...inputBinding.contract].map((entry) => {
    assert.equal(fileSha(entry.path), entry.sha256, `bound input changed: ${entry.path}`);
    return { ...record(entry.path), byteUnchanged: true };
  });
  const binding = read(path.join(owned, "source-binding.json"));
  const fullCopyRecheck = binding.staging.filter((entry) => entry.staged).map((entry) => {
    assert.equal(fileSha(entry.source.path), entry.source.sha256);
    assert.equal(fileSha(entry.staged.path), entry.source.sha256);
    return { language: entry.language, source: record(entry.source.path), staged: record(entry.staged.path), fullFileByteEqual: true };
  });
  const checkpoint = read(path.join(owned, "pre-options-checkpoint.json"));
  assert.equal(fileSha(checkpoint.independentSolutions.path), checkpoint.independentSolutions.sha256);
  assert.equal(fs.statSync(checkpoint.independentSolutions.path).mode & 0o777, 0o444);
  const languageOutputs = [];
  const coverage = [];
  const sourceIdentity = [];
  for (const language of ["zh", "en"]) {
    const { repo, lesson, seed } = stagePaths(language);
    assert(!fs.existsSync(path.join(repo, ".git")), "isolated input must not be a Git repository");
    const lessonData = read(path.join(lesson, "lesson.json"));
    const exercises = read(path.join(lesson, "exercises.json"));
    assert.equal(lessonData.status, "draft");
    assert.equal(exercises.status, "draft");
    assert.equal(exercises.exercises.length, 16);
    assert.equal(lessonData.prose.length, 0);
    const seedData = read(seed);
    assert.deepEqual(seedData.concepts, []);
    assert.deepEqual(seedData.figures, []);
    assert.deepEqual(seedData.exercises.map((item) => item.number), selected);
    const draftPath = path.join(owned, language, "draft.json");
    const visiblePath = path.join(owned, language, "visible-only.json");
    const draft = read(draftPath);
    const visible = read(visiblePath);
    assert.deepEqual(visible, draft.questions.map((question) => question.view));
    assert.deepEqual(draft.new_figures, []);
    assert.equal(draft.questions.length, 4);
    for (const view of visible) {
      assert.deepEqual(Object.keys(view).sort(), ["figure_ids", "mode", "options", "stem"]);
      assert.deepEqual(view.figure_ids, []);
      for (const option of view.options) {
        assert.deepEqual(Object.keys(option).sort(), ["figure_ids", "id", "text"]);
        assert.deepEqual(option.figure_ids, []);
      }
    }
    const digestReceipt = runNative(`${language}-draft-digest`, "prepare.py", ["digest", draftPath]);
    assert.equal(digestReceipt.exit, 0);
    const draftCanonical = fs.readFileSync(path.join(owned, "receipts", `${language}-draft-digest`, "stdout.txt"), "utf8").trim();
    const seedBinding = checkpoint.seeds.find((entry) => entry.language === language);
    assert.equal(fileSha(seed), seedBinding.sha256);
    const validation = read(path.join(owned, language, "validation-snapshot.json"));
    assert.equal(validation.draft.sha256, fileSha(draftPath));
    languageOutputs.push({
      language,
      isolatedRepo: repo,
      seed: { ...record(seed), canonicalSha256: seedBinding.canonicalSha256 },
      draft: { ...record(draftPath), canonicalSha256: draftCanonical },
      visibleOnly: record(visiblePath),
      validationSnapshot: record(path.join(owned, language, "validation-snapshot.json")),
      selectedSeeds: 4,
      questions: 4,
      options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
      nativeStructureExit: validation.exit,
      semanticReview: "PENDING"
    });
    coverage.push({ language, seed: record(seed), draft: record(draftPath), source_task_coverage: draft.coverage });
    sourceIdentity.push({
      language,
      fullSourceCount: 16,
      fullStagedFile: record(path.join(lesson, "exercises.json")),
      fullFileByteEqualToAuthorizedSource: true,
      unselectedSourceNumbers: exercises.exercises.filter((item) => !selected.includes(item.number)).map((item) => item.number),
      selectedIdentity: exercises.exercises.filter((item) => selected.includes(item.number)).map((item) => ({
        number: item.number,
        source_number: item.source_number,
        group: item.group,
        group_id: item.group_id,
        pages: item.pages,
        figure_refs: item.figure_refs,
        embeddedSourceTextByteUnchangedThroughFullCopy: true,
        modernTextByteUnchangedThroughFullCopy: true
      })),
      status: exercises.status
    });
  }
  const zh = read(path.join(owned, "zh/draft.json"));
  const en = read(path.join(owned, "en/draft.json"));
  const structureProjection = (draft) => draft.questions.map((question) => ({
    id: question.id,
    source_numbers: question.source_numbers,
    mode: question.view.mode,
    figure_ids: question.view.figure_ids,
    options: question.view.options.map((option) => ({ id: option.id, figure_ids: option.figure_ids })),
    correct: question.key.correct,
    truth: question.key.rationales.map((rationale) => ({ option_id: rationale.option_id, truth: rationale.truth })),
    concept_blocks: question.intent.concept_blocks,
    figure_observations: question.intent.figure_observations
  }));
  assert.deepEqual(structureProjection(zh), structureProjection(en));
  write("source-task-coverage.json", {
    schema: "d308-source-task-coverage-v1",
    register: record(path.join(owned, "scope-and-model-register.json")),
    languages: coverage,
    fullCardTasks: 16,
    selectedSourceNumbers: selected,
    unselectedSourceNumbers: ["1", "2", "3", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
    unselectedTasksRetainedNotDeletedOrReclassified: true,
    residualHold: "Source5 unconditional real-deposition comparison; only explicitly conditional ideal comparison authored.",
    previousHolds: ["1: fig189", "9: glow/corona without erratum authorization"],
    independentSemanticReview: "PENDING",
    fullCardClaim: false
  });
  write("candidate-binding-checks.json", {
    schema: "d308-candidate-binding-checks-v1",
    checkedAt: new Date().toISOString(),
    inputsUnchanged: inputRecheck,
    fullCopies: fullCopyRecheck,
    sourceIdentities: sourceIdentity,
    preOptionsPhaseUnchanged: record(checkpoint.independentSolutions.path),
    preOptionsFileWasAlready0444: true,
    exactViewOnlyProjection: true,
    crossLanguageIdentifiersModesOptionIdsTrueSetsAndFigureRefsMatch: true,
    sourceFormulaAndQuantitiesPreservedThroughFullCopies: true,
    noExternalDefinitions: true,
    imagesOpenedOrGenerated: 0,
    isolatedReposHaveNoGitDirectory: true,
    limitation: "These local binding/structure comparisons do not constitute semantic, SCI, visual, or whole-card review."
  });
  const receiptDirectories = fs.readdirSync(path.join(owned, "receipts")).sort();
  const receipts = receiptDirectories.map((name) => {
    const file = path.join(owned, "receipts", name, "receipt.json");
    const receipt = read(file);
    return { name, ...record(file), command: receipt.command, argv: receipt.argv, cwd: receipt.cwd, exit: receipt.exit, stdout: receipt.stdout, stderr: receipt.stderr };
  });
  write("native-receipts.json", {
    schema: "d308-native-receipts-v1",
    initialProjectionAndValidationRunsPerLanguage: { inspect: 1, prepare: 1, validate: 1 },
    digestCommandsAreReadOnly: true,
    receipts,
    failures: receipts.filter((entry) => entry.exit !== 0),
    retries: 0,
    finalize: 0,
    publish: 0,
    render: 0,
    wholeProjectChecks: 0
  });
  const structurePass = languageOutputs.every((entry) => entry.nativeStructureExit === 0);
  const reportPath = write("report.json", {
    schema: "d308-author-report-v1",
    ticket: "STEMROBIN-181",
    author: "Existing Galileo",
    directory: owned,
    book: "9p",
    lesson: "phy9-c2-s4-t18",
    role: "First bilingual text-only choice author",
    status: structurePass ? "AUTHOR_STRUCTURE_PASS_SEMANTIC_REVIEW_PENDING" : "AUTHOR_STRUCTURE_FAIL_SEMANTIC_REVIEW_PENDING",
    authorStructure: structurePass ? "PASS" : "FAIL",
    independentReview: "PENDING_OTHER_EXISTING_REVIEWER",
    semanticPassClaim: false,
    completeCardClaim: false,
    sourceNumbers: selected,
    fullCardSourceCount: 16,
    selectedCount: 4,
    unselectedCount: 12,
    unselectedNumbers: ["1", "2", "3", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
    unselectedPreserved: true,
    unselectedNotAllHold: true,
    retainedPriorHolds: ["1: fig189 repair", "9: glow/corona without erratum authorization"],
    additionalResidualHold: "Source5 unconditional real concentration-independent deposition is not established; only the explicit ideal-model comparison is authored.",
    sourceTextApprovalConsumption: record(path.join(owned, "effective-text-status-summary.json")),
    sourceBinding: record(path.join(owned, "source-binding.json")),
    inputHashes: record(path.join(owned, "input-hashes.json")),
    preOptionsCheckpoint: record(path.join(owned, "pre-options-checkpoint.json")),
    preOptionsIndependentSolutions: record(checkpoint.independentSolutions.path),
    sourceTaskCoverage: record(path.join(owned, "source-task-coverage.json")),
    scopeAndModelRegister: record(path.join(owned, "scope-and-model-register.json")),
    localBindingChecks: record(path.join(owned, "candidate-binding-checks.json")),
    nativeReceipts: record(path.join(owned, "native-receipts.json")),
    reviewContract: record(path.join(workspace, ".agents/skills/ld-s10y-choice/references/review.md")),
    outputs: languageOutputs,
    selectedDefinitionProseIndices: [],
    noConceptsReason: "Empty-prose standalone exercise card; no definition imported from another lesson.",
    adapterDisclosure: "Owned non-Git input copies retain all 16 source/modern exercises and draft status byte-for-byte. Minimal book.json lookup adapters derive only from authorized lesson.id, not original book provenance. No whole-adapt-finalize success claimed.",
    visibleOnlyContract: "Each language visible-only.json is exactly an array of each question.view; no keys, solutions, intent, question IDs, or source mappings.",
    initialNativeFailures: receipts.filter((entry) => entry.exit !== 0),
    nativeReruns: 0,
    capacityLosses: [
      "Recognition does not establish independently written explanations, derivations, or construction.",
      "Source5 full unrestricted real-deposition comparison remains unresolved, not silently solved by adding an ideal model.",
      "Source6 determines the corresponding interval-average magnitude under explicit ordinary DC/no-accumulation assumptions, not arbitrary transient transport.",
      "Source7 mechanism/carrier recognition is not an exhaustive explanation of all energy sources or ionization mechanisms."
    ],
    imageBudget: { inherited: 24, newlyOpened: 0, cumulative: 24, limit: 24, newFigures: [], rendered: 0, actualOpens: record(path.join(owned, "actual-opens.json")) },
    actionsNotTaken: ["No historical answers or choices", "No parent baseline", "No d302 rerun", "No new worker/worktree/branch", "No Git", "No DB or app", "No prepare of lesson scans", "No adapt-finalize/publish", "No stable tool/skill edits", "No shared meter/index/canonical writes", "No rollback/cleanup"],
    nextReviewOrder: "Existing independent reviewer consumes source and visible-only before author internals; author approval cannot substitute for that review.",
    freezeMode: "0444"
  });
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink(), `unexpected symlink: ${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  });
  const outputs = walk(owned).sort().map((file) => ({ ...record(file), mode: "0444" }));
  const freezePath = write("author-freeze.json", {
    schema: "d308-author-freeze-v1",
    frozenAt: new Date().toISOString(),
    author: "Existing Galileo",
    role: "Author only",
    status: structurePass ? "AUTHOR_STRUCTURE_PASS_SEMANTIC_REVIEW_PENDING" : "AUTHOR_STRUCTURE_FAIL_SEMANTIC_REVIEW_PENDING",
    report: record(reportPath),
    scope: { sourceNumbers: selected, fullOriginalTasks: 16, selectedSeedsPerLanguage: 4, questionsPerLanguage: 4, optionsPerLanguage: 17, unselectedTasks: 12 },
    retainedHolds: ["1: fig189", "9: glow/corona", "5: unrestricted real-deposition comparison"],
    imageBudget: { inherited: 24, new: 0, cumulative: 24, limit: 24 },
    preOptionsFrozenBeforeDrafts: true,
    preOptionsIndependentSolutions: record(checkpoint.independentSolutions.path),
    nativeReceipts: record(path.join(owned, "native-receipts.json")),
    languages: languageOutputs,
    files: outputs,
    selfHash: "Not embedded; author-freeze.json byte SHA-256 is returned separately to avoid a recursive hash.",
    permissions: "Every owned regular file is 0444; directories remain traversable.",
    independentSemanticReview: "PENDING",
    fullCardClaim: false
  });
  for (const file of walk(owned)) {
    fs.chmodSync(file, 0o444);
    assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  }
  for (const entry of outputs) assert.equal(fileSha(entry.path), entry.sha256);
  console.log(JSON.stringify({
    report: record(reportPath),
    freeze: record(freezePath),
    preOptions: record(checkpoint.independentSolutions.path),
    receipts: record(path.join(owned, "native-receipts.json")),
    outputs: languageOutputs,
    ownedFrozenFiles: walk(owned).length,
    initialNativeFailures: receipts.filter((entry) => entry.exit !== 0),
    newImages: 0,
    cumulativeImages: 24,
    independentReview: "PENDING"
  }, null, 2));
} else {
  throw new Error("Use setup, prepare, checkpoint, validate, or handoff; no implicit stages or retries.");
}
