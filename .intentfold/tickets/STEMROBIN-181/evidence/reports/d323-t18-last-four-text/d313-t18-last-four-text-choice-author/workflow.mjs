import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const sourceRoot = path.join(repoRoot, ".intentfold/tickets/STEMROBIN-181/tmp/d032-t18-text-repair/frozen");
const toolRoot = path.join(repoRoot, ".agents/skills/ld-s10y-choice");
const selected = ["13", "14", "15", "16"];
const seedRelative = ".intentfold/tickets/STEMROBIN-181/tmp/d313/seed.json";
const expected = {
  "lesson.template.json": "5ec317b53627f947129d0f56d9cd46ee4089df5ec139e263e2b377c6dcf2b6fd",
  "exercises.template.json": "fb4ca6d2d5d7d060c51e2ae8d0e3c8310cc4c67aa72b3d9cbe1e2ac494f392f0",
  "english.lesson.template.json": "d1b3cf80796c12c94915d59a5da01c09661cfc4379aa209dda41168450f29f86",
  "english.exercises.template.json": "fbc806dcc4c5108bfe3bd9bec17931d5bd65df6dd21b745c7474e980b1219f02",
  "figures.template.json": "254a760157bfec9af60f556759ec37a9bb79de2cd4694a53c62abe6f7587ff8d"
};
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const record = (file) => ({ path: file, sha256: hash(file) });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (relative, data, mode = 0o644) => {
  const file = path.join(root, relative);
  assert(file.startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx", mode });
  return file;
};
const locations = (language) => {
  const repo = path.join(root, language, "repo");
  const book = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/9p");
  return { repo, book, lesson: path.join(book, "editions/modern-us-neutral/lessons/phy9-c2-s4-t18"), seed: path.join(repo, seedRelative) };
};
const native = (name, script, args, projection) => {
  const relative = `receipts/${name}`;
  const directory = path.join(root, relative);
  assert(!fs.existsSync(directory), `first-attempt receipt already exists: ${name}`);
  fs.mkdirSync(directory, { recursive: true });
  const argv = ["python3", path.join(toolRoot, "scripts", script), ...args];
  const startedAt = new Date().toISOString();
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }
  });
  fs.writeFileSync(path.join(directory, "stdout.txt"), result.stdout || "", { flag: "wx" });
  fs.writeFileSync(path.join(directory, "stderr.txt"), result.stderr || "", { flag: "wx" });
  const receipt = {
    schema: "d313-native-receipt-v1",
    argv,
    command: argv.map((value) => `'${value.replaceAll("'", "'\\''")}'`).join(" "),
    cwd: repoRoot,
    startedAt,
    completedAt: new Date().toISOString(),
    exit: result.status,
    signal: result.signal,
    spawnError: result.error?.message || null,
    script: record(argv[1]),
    stdout: record(path.join(directory, "stdout.txt")),
    stderr: record(path.join(directory, "stderr.txt")),
    meaning: "Exact first native command evidence; structure/projection only, not a semantic or independent PASS."
  };
  write(`${relative}/receipt.json`, receipt);
  console.log(JSON.stringify({ name, exit: receipt.exit, stdout: projection ? projection(result.stdout || "") : result.stdout, stderr: result.stderr }));
  return receipt;
};
const digest = (name, file) => {
  const receipt = native(name, "prepare.py", ["digest", file]);
  assert.equal(receipt.exit, 0);
  return fs.readFileSync(path.join(root, "receipts", name, "stdout.txt"), "utf8").trim();
};

const stage = process.argv[2];
if (stage === "bind") {
  const inputs = Object.entries(expected).map(([name, expectedSha256]) => {
    const file = path.join(sourceRoot, name);
    assert.equal(hash(file), expectedSha256, `source binding mismatch: ${name}`);
    return { ...record(file), expectedSha256 };
  });
  const tools = ["SKILL.md", "references/authoring.md", "references/contract.md", "scripts/prepare.py", "scripts/validate.py"].map((name) => record(path.join(toolRoot, name)));
  write("input-hashes.json", {
    schema: "d313-input-hashes-v1",
    boundAt: new Date().toISOString(),
    inputs,
    tools,
    selectedSourceNumbers: selected,
    inheritedImageCount: 24,
    imageLimit: 24,
    semanticInputRestriction: "Only selected original source_text and modern prose, no definitions available. No answers, old choices, d312 baseline, d314 answers, parent independent baseline, or images."
  });
  // Save hashes before parsing source text. Unselected blocks remain byte-preserved, not semantically consumed.
  const staging = [];
  const projections = [];
  for (const language of ["zh", "en"]) {
    const { repo, book, lesson } = locations(language);
    fs.mkdirSync(lesson, { recursive: true });
    const sources = {
      "lesson.json": language === "zh" ? "lesson.template.json" : "english.lesson.template.json",
      "exercises.json": language === "zh" ? "exercises.template.json" : "english.exercises.template.json",
      "figures.json": "figures.template.json"
    };
    for (const [toName, fromName] of Object.entries(sources)) {
      const from = path.join(sourceRoot, fromName);
      const to = path.join(lesson, toName);
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
      assert.equal(hash(from), hash(to));
      staging.push({ language, source: record(from), staged: record(to), fullFileByteEqual: true });
    }
    const lessonData = read(path.join(lesson, "lesson.json"));
    const exercises = read(path.join(lesson, "exercises.json"));
    assert.equal(lessonData.id, "phy9-c2-s4-t18");
    assert.equal(lessonData.status, "draft");
    assert.equal(exercises.status, "draft");
    assert.equal(lessonData.prose.length, 0);
    assert.equal(exercises.exercises.length, 16);
    const adapter = path.join(book, "book.json");
    fs.writeFileSync(adapter, `${JSON.stringify({ lessons: [{ id: lessonData.id }] }, null, 2)}\n`, { flag: "wx" });
    staging.push({ language, selectorAdapter: record(adapter), reason: "Minimal native lookup adapter derived solely from bound lesson.id; not original/canonical book provenance or whole-adapt-finalize approval." });
    const tasks = selected.map((number) => exercises.exercises.find((item) => item.number === number));
    assert(tasks.every(Boolean));
    for (const item of tasks) {
      assert.deepEqual(item.figure_refs || [], []);
      assert.deepEqual(item.figures || [], []);
    }
    projections.push({
      language,
      sourceFile: record(path.join(lesson, "exercises.json")),
      fullCopiedTaskCount: 16,
      status: exercises.status,
      selectedConceptProseIndices: [],
      selectedTasks: tasks.map((item) => ({
        number: item.number,
        source_number: item.source_number,
        group: item.group,
        group_id: item.group_id,
        pages: item.pages,
        text: item.text,
        source_text: item.source_text,
        figure_refs: item.figure_refs || []
      }))
    });
    assert(!fs.existsSync(path.join(repo, ".git")));
  }
  write("source-binding.json", {
    schema: "d313-source-binding-v1",
    inputBinding: record(path.join(root, "input-hashes.json")),
    staging,
    fullCopiesByteUnchanged: true,
    fullCopiesHaveAll16TasksAndDraftStatus: true,
    selectedSourceNumbers: selected,
    selectedConceptProseIndices: [],
    definitionReason: "Standalone exercise card has empty prose; --no-concepts; no outside definitions added.",
    adapterDisclosure: "Only temporary book selector adapters, not canonical inputs or full-card adapt-finalize."
  });
  write("selected-source-projection.json", projections);
  write("actual-opens.json", {
    schema: "d313-actual-opens-v1",
    inherited: 24,
    opens: [],
    newImages: 0,
    cumulative: 24,
    limit: 24,
    imagesGenerated: 0,
    note: "No source/crop/SVG/preview/screenshot image was opened or generated."
  });
  console.log(JSON.stringify(projections, null, 2));
} else if (stage === "prepare") {
  for (const language of ["zh", "en"]) {
    const { repo, seed } = locations(language);
    const selectors = ["--repo", repo, "--book", "9p", "--lesson", "phy9-c2-s4-t18"];
    const inspected = native(`${language}-inspect-initial`, "prepare.py", ["inspect", ...selectors], (stdout) => {
      const inventory = JSON.parse(stdout);
      return {
        exercises: inventory.exercises.filter((item) => selected.includes(item.number)),
        concept_candidates: inventory.concept_candidates,
        figureIdsOnly: inventory.figures.map((item) => item.id),
        unselectedProseNotSemanticallyConsumed: true
      };
    });
    assert.equal(inspected.exit, 0, "Initial inspect failure retained; do not rerun automatically.");
    const prepared = native(`${language}-prepare-initial`, "prepare.py", [
      "prepare", ...selectors, ...selected.flatMap((number) => ["--exercise", number]), "--no-concepts", "--out", seed
    ]);
    assert.equal(prepared.exit, 0, "Initial prepare failure retained; do not rerun automatically.");
    const seedData = read(seed);
    assert.deepEqual(seedData.exercises.map((item) => item.number), selected);
    assert.deepEqual(seedData.concepts, []);
    assert.deepEqual(seedData.figures, []);
  }
} else if (stage === "checkpoint") {
  const solutions = path.join(root, "pre-options-independent-solutions.json");
  const arithmetic = path.join(root, "pre-options-arithmetic.json");
  assert(fs.existsSync(solutions));
  assert(fs.existsSync(arithmetic));
  for (const language of ["zh", "en"]) assert(!fs.existsSync(path.join(root, language, "draft.json")));
  fs.chmodSync(solutions, 0o444);
  fs.chmodSync(arithmetic, 0o444);
  const seeds = ["zh", "en"].map((language) => {
    const { seed } = locations(language);
    return { language, ...record(seed), canonicalSha256: digest(`${language}-seed-digest`, seed) };
  });
  const file = write("pre-options-checkpoint.json", {
    schema: "d313-pre-options-checkpoint-v1",
    frozenAt: new Date().toISOString(),
    independentSolutions: record(solutions),
    arithmetic: record(arithmetic),
    mode: "0444",
    draftsAbsent: true,
    seeds,
    author: "Existing Galileo",
    role: "Independent source reasoning by author before options; not separate independent review."
  }, 0o444);
  console.log(JSON.stringify(read(file), null, 2));
} else if (stage === "validate") {
  const checkpoint = read(path.join(root, "pre-options-checkpoint.json"));
  assert.equal(hash(checkpoint.independentSolutions.path), checkpoint.independentSolutions.sha256);
  assert.equal(hash(checkpoint.arithmetic.path), checkpoint.arithmetic.sha256);
  for (const language of ["zh", "en"]) {
    const { repo, seed } = locations(language);
    const draftPath = path.join(root, language, "draft.json");
    const result = native(`${language}-validate-initial`, "validate.py", ["--repo", repo, "--seed", seed, "--draft", draftPath]);
    const draft = read(draftPath);
    const visible = write(`${language}/visible-only.json`, draft.questions.map((question) => question.view));
    write(`${language}/validation-snapshot.json`, {
      seed: record(seed),
      draft: record(draftPath),
      visibleOnly: record(visible),
      exactQuestionViewsOnly: true,
      nativeReceipt: record(path.join(root, "receipts", `${language}-validate-initial`, "receipt.json")),
      nativeExit: result.exit,
      firstFailureRetained: result.exit !== 0,
      semanticReview: "PENDING_OTHER_EXISTING_REVIEWER"
    });
  }
} else if (stage === "freeze") {
  const binding = read(path.join(root, "input-hashes.json"));
  const rechecked = [...binding.inputs, ...binding.tools].map((entry) => {
    assert.equal(hash(entry.path), entry.sha256, `bound input changed: ${entry.path}`);
    return { ...record(entry.path), unchanged: true };
  });
  const sourceBinding = read(path.join(root, "source-binding.json"));
  const copies = sourceBinding.staging.filter((entry) => entry.staged).map((entry) => {
    assert.equal(hash(entry.source.path), entry.source.sha256);
    assert.equal(hash(entry.staged.path), entry.source.sha256);
    return { ...entry, finalFullFileByteEqual: true };
  });
  const checkpoint = read(path.join(root, "pre-options-checkpoint.json"));
  assert.equal(hash(checkpoint.independentSolutions.path), checkpoint.independentSolutions.sha256);
  assert.equal(fs.statSync(checkpoint.independentSolutions.path).mode & 0o777, 0o444);
  assert.equal(hash(checkpoint.arithmetic.path), checkpoint.arithmetic.sha256);
  assert.equal(fs.statSync(checkpoint.arithmetic.path).mode & 0o777, 0o444);
  const languages = [];
  const coverage = [];
  const structures = [];
  for (const language of ["zh", "en"]) {
    const { repo, lesson, seed } = locations(language);
    assert(!fs.existsSync(path.join(repo, ".git")));
    const lessonData = read(path.join(lesson, "lesson.json"));
    const exerciseData = read(path.join(lesson, "exercises.json"));
    assert.equal(lessonData.status, "draft");
    assert.equal(exerciseData.status, "draft");
    assert.equal(lessonData.prose.length, 0);
    assert.equal(exerciseData.exercises.length, 16);
    const draftPath = path.join(root, language, "draft.json");
    const draft = read(draftPath);
    const visiblePath = path.join(root, language, "visible-only.json");
    assert.deepEqual(read(visiblePath), draft.questions.map((question) => question.view));
    assert.deepEqual(draft.new_figures, []);
    for (const question of draft.questions) {
      assert.deepEqual(Object.keys(question.view).sort(), ["figure_ids", "mode", "options", "stem"]);
      assert.deepEqual(question.view.figure_ids, []);
      for (const option of question.view.options) {
        assert.deepEqual(Object.keys(option).sort(), ["figure_ids", "id", "text"]);
        assert.deepEqual(option.figure_ids, []);
      }
    }
    const seedBinding = checkpoint.seeds.find((item) => item.language === language);
    assert.equal(hash(seed), seedBinding.sha256);
    const validation = read(path.join(root, language, "validation-snapshot.json"));
    assert.equal(hash(draftPath), validation.draft.sha256);
    const canonicalDraft = digest(`${language}-draft-digest`, draftPath);
    languages.push({
      language,
      isolatedRepo: repo,
      seed: { ...record(seed), canonicalSha256: seedBinding.canonicalSha256 },
      draft: { ...record(draftPath), canonicalSha256: canonicalDraft },
      visibleOnly: record(visiblePath),
      validationSnapshot: record(path.join(root, language, "validation-snapshot.json")),
      sourceSeeds: 4,
      questions: draft.questions.length,
      options: draft.questions.reduce((count, question) => count + question.view.options.length, 0),
      nativeStructureExit: validation.nativeExit,
      independentReview: "PENDING"
    });
    coverage.push({ language, rows: draft.coverage });
    structures.push(draft.questions.map((question) => ({
      id: question.id,
      source_numbers: question.source_numbers,
      mode: question.view.mode,
      optionIds: question.view.options.map((option) => option.id),
      correct: question.key.correct,
      truth: question.key.rationales.map((item) => ({ option_id: item.option_id, truth: item.truth })),
      concept_blocks: question.intent.concept_blocks,
      figure_observations: question.intent.figure_observations
    })));
  }
  assert.deepEqual(structures[0], structures[1]);
  write("candidate-binding-checks.json", {
    schema: "d313-candidate-binding-checks-v1",
    boundInputsUnchanged: rechecked,
    fullCopiesUnchanged: copies,
    fullCopiedTaskCount: 16,
    selectedSourceNumbers: selected,
    unselectedSourceNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    draftStatusPreserved: true,
    selectedConceptProseIndices: [],
    preOptionsUnchangedAnd0444: record(checkpoint.independentSolutions.path),
    preOptionsArithmeticUnchangedAnd0444: record(checkpoint.arithmetic.path),
    exactViewOnly: true,
    bilingualStructuralParity: true,
    imageOpens: 0,
    imageGeneration: 0,
    semanticReviewClaim: false
  });
  write("source-task-coverage.json", {
    schema: "d313-source-task-coverage-v1",
    selectedSourceNumbers: selected,
    selectedSeedCount: 4,
    fullSourceCount: 16,
    unselectedCount: 12,
    unselectedRetainedNotDeleted: true,
    unselectedNotBlanketHold: true,
    priorHolds: ["1: fig189 repair", "9: discharge without erratum authorization"],
    tasks8And10: "Unselected, unchanged, not newly designated HOLD.",
    languages: coverage,
    scopeAndModelRegister: record(path.join(root, "scope-and-model-register.json")),
    completeCardClaim: false,
    independentReview: "PENDING"
  });
  const receipts = fs.readdirSync(path.join(root, "receipts")).sort().map((name) => {
    const file = path.join(root, "receipts", name, "receipt.json");
    const data = read(file);
    return { name, ...record(file), argv: data.argv, command: data.command, cwd: data.cwd, exit: data.exit, stdout: data.stdout, stderr: data.stderr };
  });
  write("native-receipts.json", {
    schema: "d313-native-receipts-v1",
    firstPassPerLanguage: { inspect: 1, prepare: 1, validate: 1 },
    digests: "Read-only canonical JSON digests, not repeated projection or validation.",
    commands: receipts,
    initialFailures: receipts.filter((item) => item.exit !== 0),
    affectedRepairs: 0,
    retries: 0,
    finalize: 0,
    publish: 0,
    render: 0,
    wholeProjectTests: 0
  });
  const pass = languages.every((item) => item.nativeStructureExit === 0);
  const reportPath = write("report.json", {
    schema: "d313-author-report-v1",
    ticket: "STEMROBIN-181",
    author: "Existing Galileo",
    role: "FIRST bilingual choices author only",
    directory: root,
    book: "9p",
    lesson: "phy9-c2-s4-t18",
    status: pass ? "AUTHOR_STRUCTURE_PASS_INDEPENDENT_REVIEW_PENDING" : "AUTHOR_STRUCTURE_FAIL_INDEPENDENT_REVIEW_PENDING",
    authorStructure: pass ? "PASS" : "FAIL",
    semanticReview: "PENDING_OTHER_EXISTING_REVIEWER",
    independentPassClaim: false,
    wholeCardPassClaim: false,
    selectedSourceNumbers: selected,
    selectedSeedCountPerLanguage: 4,
    fullOriginalTasks: 16,
    unselectedCount: 12,
    unselectedRetainedNotDeletedOrBlanketHold: true,
    retainedPriorHolds: ["1: fig189", "9: discharge"],
    tasks8And10: "Unselected, unchanged, not blanket HOLD.",
    inputHashes: record(path.join(root, "input-hashes.json")),
    sourceBinding: record(path.join(root, "source-binding.json")),
    preOptionsCheckpoint: record(path.join(root, "pre-options-checkpoint.json")),
    preOptionsIndependentSolutions: record(checkpoint.independentSolutions.path),
    preOptionsArithmetic: record(checkpoint.arithmetic.path),
    localArithmeticCommandReceipt: record(path.join(root, "arithmetic-command-receipt.json")),
    reviewContract: record(path.join(toolRoot, "references/review.md")),
    modelAndCapacityRegister: record(path.join(root, "scope-and-model-register.json")),
    sourceTaskCoverage: record(path.join(root, "source-task-coverage.json")),
    candidateBindingChecks: record(path.join(root, "candidate-binding-checks.json")),
    nativeReceipts: record(path.join(root, "native-receipts.json")),
    outputs: languages,
    selectedConceptProseIndices: [],
    noConceptsReason: "No definition prose in standalone exercise card; no solved examples or outside definitions added.",
    sourceIntegrity: "All full staged templates, embedded original source, quantities, task identities and statuses are byte-equal to the authorized templates.",
    adapterDisclosure: "Each non-Git isolated input has a minimal book.json lookup adapter derived from authorized lesson.id. It is not original book provenance, canonical promotion, or whole-adapt-finalize PASS.",
    visibleOnly: "Exactly question.view arrays in draft order; no source mappings, question IDs, keys, solutions, intent or coverage.",
    initialFailures: receipts.filter((item) => item.exit !== 0),
    affectedRepairCount: 0,
    imageBudget: { inherited: 24, new: 0, cumulative: 24, limit: 24, actualOpens: record(path.join(root, "actual-opens.json")), newFigures: [] },
    reviewOrder: "Parent independently consumes its pre-author baseline and visible-only before author keys; author did not read that baseline.",
    actionsNotTaken: ["No old answers/choices", "No d312 baseline or d314 answers", "No image opens or generation", "No new agent/worktree/branch", "No Git/DB/app", "No stable skill edits/tests", "No finalize/publish", "No shared meter/index/canonical writes", "No rollback or cleanup"],
    freezePermissions: "0444"
  });
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    assert(!entry.isSymbolicLink(), "Unexpected symlink in owned outputs");
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
  const files = walk(root).sort().map((file) => ({ ...record(file), mode: "0444" }));
  const freezePath = write("author-freeze.json", {
    schema: "d313-author-freeze-v1",
    frozenAt: new Date().toISOString(),
    author: "Existing Galileo",
    role: "Author, not independent reviewer",
    status: pass ? "AUTHOR_STRUCTURE_PASS_INDEPENDENT_REVIEW_PENDING" : "AUTHOR_STRUCTURE_FAIL_INDEPENDENT_REVIEW_PENDING",
    report: record(reportPath),
    selectedSourceNumbers: selected,
    seedsPerLanguage: 4,
    fullOriginalTaskCount: 16,
    unselectedCount: 12,
    inheritedPriorHolds: ["1: fig189", "9: discharge"],
    images: { inherited: 24, new: 0, cumulative: 24, limit: 24 },
    preOptionsFrozenBeforeDrafts: true,
    independentSolutions: record(checkpoint.independentSolutions.path),
    preOptionsArithmetic: record(checkpoint.arithmetic.path),
    nativeReceipts: record(path.join(root, "native-receipts.json")),
    languages,
    files,
    permissions: "Every owned regular file 0444; traversable directories.",
    selfHash: "Returned separately; not recursively embedded.",
    independentSemanticReview: "PENDING",
    wholeCardPassClaim: false
  });
  for (const file of walk(root)) {
    fs.chmodSync(file, 0o444);
    assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  }
  for (const item of files) assert.equal(hash(item.path), item.sha256);
  console.log(JSON.stringify({
    report: record(reportPath),
    freeze: record(freezePath),
    independentSolutions: record(checkpoint.independentSolutions.path),
    nativeReceipts: record(path.join(root, "native-receipts.json")),
    outputs: languages,
    frozenFileCount: walk(root).length,
    imagesNew: 0,
    cumulativeImages: 24,
    semanticReview: "PENDING"
  }, null, 2));
} else {
  throw new Error("Explicit stage required: bind, prepare, checkpoint, validate, freeze. No automatic repeats.");
}
