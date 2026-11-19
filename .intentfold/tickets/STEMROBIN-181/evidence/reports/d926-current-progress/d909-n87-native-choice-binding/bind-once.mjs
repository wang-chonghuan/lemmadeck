import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const root = path.join(tmp, "d909-n87-native-choice-binding");
const nativeRoot = path.join(tmp, "d900-n87-first-bilingual-native");
const authorRoot = path.join(tmp, "d885-n87-first-choice-author");
const independentRoot = path.join(tmp, "d896-n87-first-independent-choice-review");
const card = "phy10-c2-s3-n87";
const artifactPath = "ssot-resources/soviet10year-textbooks/artifacts/10p";
const scripts = path.join(repo, ".agents/skills/ld-s10y-choice/scripts");
const expectedBlocks = [1, 6, 11, 12, 14, 16, 17, 20, 21];
const expectedReviews = {
  zh: "74075be4bcc2dc64330941191327e027a98b851f6e514a8b1dd30920fcfd8928",
  en: "708816e8692aefdf295c2c40fa879e14c6d9bcc39dd4cc1cb969de52cd6ef0dc",
};
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = (file) => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const protectedFiles = new Map();
const report = {
  schema: "d909-n87-native-choice-binding-v1",
  ticket: "STEMROBIN-181", assignment: "successor181-3", card, repository: repo,
  status: "FIRST-NATIVE-CHOICE-BINDING-STARTED", binding: "HOLD", outputs: {},
  commands: [], firstFailure: null, completeCard: false,
  semanticReview: {
    status: "inherited d896 independent semantic PASS; metadata-only source reconciliation",
    newIndependentMathematicsReview: false,
    authoringOrSemanticChanges: 0,
  },
  nativeFinalizeReplays: 0, nativeRenderReplays: 0, paidCalls: 0,
  imagesLoadedIntoModel: 0, databasePublisherPromoteIndexMeterGitDeploy: false,
};
assert.equal(process.cwd(), repo);
function write(file, value) {
  assert.ok(path.resolve(file).startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
function protect(file) {
  const binding = bind(file);
  protectedFiles.set(file, binding.sha256);
  return binding;
}
function canonical(file) {
  const command = spawnSync("python3", [path.join(scripts, "prepare.py"), "digest", file], {
    cwd: repo, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  assert.equal(command.status, 0, command.stderr);
  assert.match(command.stdout.trim(), /^[0-9a-f]{64}$/);
  return command.stdout.trim();
}
function commandOnce(locale, phase, args) {
  const receiptRoot = path.join(root, locale, `${phase}-FIRST`);
  const command = ["python3", ...args];
  write(path.join(receiptRoot, "started.json"), { command, cwd: repo, timestamp: new Date().toISOString() });
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  const receipt = {
    command, cwd: repo, exit: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
    timestamp: new Date().toISOString(),
  };
  write(path.join(receiptRoot, "receipt.json"), receipt);
  report.commands.push({ locale, phase, ...bind(path.join(receiptRoot, "receipt.json")), exit: result.status });
  assert.equal(result.status, 0, `${locale} ${phase}: ${result.stderr || result.error || result.stdout}`);
}
function copyExact(source, destination) {
  const sourceBinding = protect(source);
  assert.ok(path.resolve(destination).startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(destination).sha256, sourceBinding.sha256);
  return { source: sourceBinding, destination: bind(destination), byteIdentical: true };
}
function without(value, fields) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => !fields.includes(key)));
}
function textComparison(before, after, field) {
  assert.equal(typeof before, "string");
  assert.equal(typeof after, "string");
  const layout = (text) => text.replace(/\s+/gu, " ").trim();
  assert.equal(layout(before), layout(after), `${field}: substantive text changed; no remapping permitted`);
  return {
    field, exact: before === after, whitespaceLayoutOnly: before !== after,
    beforeTextSha256: hash(before), afterTextSha256: hash(after),
  };
}
function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  }).sort();
}
function freeze() {
  const files = listFiles(root);
  const manifest = files.map((file) => ({ ...bind(file), relativePath: path.relative(root, file) }));
  write(path.join(root, "freeze.json"), {
    schema: "d909-freeze-v1", timestamp: new Date().toISOString(), files: manifest,
    excludes: ["freeze.json", "SHA256SUMS"], report: bind(path.join(root, "report.json")),
    readonlyFiles: true, sourceSnapshotsUnmodified: true,
  });
  write(path.join(root, "SHA256SUMS"), listFiles(root).map((file) =>
    `${bind(file).sha256}  ${path.relative(root, file)}`).join("\n") + "\n");
  for (const file of listFiles(root)) fs.chmodSync(file, 0o444);
}
write(path.join(root, "started.json"), report);
try {
  const native = read(path.join(nativeRoot, "report.json"));
  report.native = protect(path.join(nativeRoot, "report.json"));
  assert.equal(native.status, "FIRST-BILINGUAL-NATIVE-PASS");
  const independent = read(path.join(independentRoot, "report.json"));
  report.semanticReview.originalReport = protect(path.join(independentRoot, "report.json"));
  assert.equal(report.semanticReview.originalReport.sha256,
    "b2b871a943392c67c811f11f50112ad48cf5bc97305dfe81939f117fedbbfb4d");
  assert.equal(independent.status, "FIRST-SEMANTIC-PASS-OFFLINE-DRAFTS-ONLY");
  report.tools = [protect(path.join(scripts, "prepare.py")), protect(path.join(scripts, "validate.py"))];
  for (const locale of ["zh", "en"]) {
    const packet = native.outputs[locale];
    assert.ok(packet.raw.startsWith(`${nativeRoot}/`));
    assert.ok(packet.target.startsWith(`${packet.raw}/`));
    for (const phase of ["adapt", "render", "answers", "interactionPrepare", "interactions"]) {
      assert.equal(packet[phase], true);
    }
    const oldSeedFile = path.join(authorRoot, locale, "seed.json");
    const oldDraftFile = path.join(authorRoot, locale, "draft.json");
    const oldReviewFile = path.join(independentRoot, locale, "review.json");
    const oldSeed = read(oldSeedFile);
    const oldDraft = read(oldDraftFile);
    const oldReview = read(oldReviewFile);
    const inputs = { seed: protect(oldSeedFile), draft: protect(oldDraftFile), review: protect(oldReviewFile) };
    assert.equal(inputs.review.sha256, expectedReviews[locale]);
    assert.equal(oldReview.outcome, "pass");
    assert.equal(oldReview.reviewer.kind, "independent_agent");
    assert.equal(oldDraft.seed_sha256, canonical(oldSeedFile));
    assert.equal(oldReview.seed_sha256, oldDraft.seed_sha256);
    assert.equal(oldReview.draft_sha256, canonical(oldDraftFile));
    assert.deepEqual(oldSeed.source, { book: "10p", lesson: card, concept_figure_ids: [] });
    const numbers = oldSeed.exercises.map((item) => item.number);
    assert.deepEqual(numbers, ["1", "2", "3", "4", "5", "6"]);
    assert.deepEqual(oldSeed.concepts.map((item) => item.block), expectedBlocks);
    assert.deepEqual(oldSeed.figures, []);
    assert.deepEqual(oldDraft.new_figures, []);
    assert.deepEqual(oldReview.figure_checks, []);
    assert.equal(oldDraft.questions.length, 6);
    assert.equal(oldDraft.questions.reduce((sum, question) => sum + question.view.options.length, 0), 26);

    const sourceRepo = path.join(root, locale, "source");
    const destinationBook = path.join(sourceRepo, artifactPath);
    const destinationLesson = path.join(destinationBook, "editions/modern-us-neutral/lessons", card);
    const copies = [copyExact(path.join(packet.raw, "book.json"), path.join(destinationBook, "book.json"))];
    for (const name of ["lesson.json", "exercises.json", "figures.json"]) {
      copies.push(copyExact(path.join(packet.target, name), path.join(destinationLesson, name)));
    }
    const figureManifest = read(path.join(packet.target, "figures.json"));
    assert.deepEqual(figureManifest.figures.map((figure) => figure.id), ["fig-201", "fig-202"]);
    for (const figure of figureManifest.figures) {
      assert.match(figure.svg, /^figures\/fig-20[12]\.svg$/);
      copies.push(copyExact(path.join(packet.raw, "editions/modern-us-neutral", figure.svg),
        path.join(destinationBook, "editions/modern-us-neutral", figure.svg)));
    }
    const seedFile = path.join(sourceRepo, ".intentfold/tickets/STEMROBIN-181/tmp/seed.json");
    const prepareArgs = [
      path.join(scripts, "prepare.py"), "prepare", "--repo", sourceRepo,
      "--book", "10p", "--lesson", card,
      ...numbers.flatMap((number) => ["--exercise", number]),
      ...expectedBlocks.flatMap((block) => ["--concept-block", String(block)]),
      "--out", seedFile,
    ];
    const output = report.outputs[locale] = {
      sourceRepo, sourceCopies: copies, originalInputs: inputs, seed: seedFile,
      prepareInvocations: 1, validateReviewInvocations: 0, selectedFigureIds: [],
      binding: "HOLD", reconciliation: null,
    };
    commandOnce(locale, "prepare", prepareArgs);
    const seed = read(seedFile);
    assert.deepEqual(seed.source, oldSeed.source, "source selectors changed");
    assert.deepEqual(seed.figures, oldSeed.figures, "selected figure relationships/assets changed");
    assert.deepEqual(seed.trace.map((item) => item.path), oldSeed.trace.map((item) => item.path));
    assert.deepEqual(seed.exercises.map((item) => without(item, ["text"])),
      oldSeed.exercises.map((item) => without(item, ["text"])), "exercise selectors/figures changed");
    assert.deepEqual(seed.concepts.map((item) => without(item, ["text"])),
      oldSeed.concepts.map((item) => without(item, ["text"])), "concept selectors changed");
    const comparisons = [
      ...seed.exercises.map((item, index) =>
        textComparison(oldSeed.exercises[index].text, item.text, `exercises[${index}].text`)),
      ...seed.concepts.map((item, index) =>
        textComparison(oldSeed.concepts[index].text, item.text, `concepts[${index}].text`)),
    ];
    output.reconciliation = {
      status: "PASS", exactSourceSelectorsAndFigureRelationships: true,
      substantiveProseAndMathUnchanged: true, comparisons,
      traceChanges: seed.trace.map((item, index) => ({
        path: item.path, before: oldSeed.trace[index].sha256, after: item.sha256,
        changed: item.sha256 !== oldSeed.trace[index].sha256,
      })),
      newIndependentMathematicsReview: false,
    };
    write(path.join(root, locale, "reconciliation.json"), output.reconciliation);

    const seedDigest = canonical(seedFile);
    const draft = { ...oldDraft, seed_sha256: seedDigest };
    const draftFile = path.join(root, locale, "draft.json");
    write(draftFile, draft);
    const draftDigest = canonical(draftFile);
    const review = { ...oldReview, seed_sha256: seedDigest, draft_sha256: draftDigest };
    const reviewFile = path.join(root, locale, "review.json");
    write(reviewFile, review);
    assert.deepEqual(without(draft, ["seed_sha256"]), without(oldDraft, ["seed_sha256"]));
    assert.deepEqual(without(review, ["seed_sha256", "draft_sha256"]),
      without(oldReview, ["seed_sha256", "draft_sha256"]));
    write(path.join(root, locale, "client-views.json"), draft.questions.map((question) => question.view));
    output.changedFieldsOnly = ["draft.seed_sha256", "review.seed_sha256", "review.draft_sha256"];
    output.seedBinding = bind(seedFile);
    output.draft = bind(draftFile);
    output.review = bind(reviewFile);
    output.clientViews = bind(path.join(root, locale, "client-views.json"));
    output.canonicalDigests = { seed: seedDigest, draft: draftDigest, review: canonical(reviewFile) };
    output.inheritedIndependentSemanticPass = {
      report: report.semanticReview.originalReport, review: inputs.review,
      sourceTasks: 6, choiceUnits: 6, options: 26, reviewer: oldReview.reviewer,
      substantiveReviewUnchanged: true,
    };
    output.validateReviewInvocations = 1;
    commandOnce(locale, "validate-review", [
      path.join(scripts, "validate.py"), "--repo", sourceRepo,
      "--seed", seedFile, "--draft", draftFile, "--review", reviewFile,
    ]);
    output.binding = "PASS";
  }
  for (const [file, expected] of protectedFiles) assert.equal(bind(file).sha256, expected);
  report.inputSnapshotsUnmodified = [...protectedFiles].map(([file, sha256]) => ({ path: file, sha256 }));
  report.binding = "PASS";
  report.status = "FIRST-NATIVE-CHOICE-BINDING-PASS";
} catch (error) {
  report.status = "FIRST-NATIVE-CHOICE-BINDING-HOLD";
  report.firstFailure = { message: String(error.stack || error), timestamp: new Date().toISOString() };
  write(path.join(root, "FIRST-failure.json"), { ...report.firstFailure, report });
  process.exitCode = 1;
} finally {
  write(path.join(root, "report.json"), report);
  freeze();
}
console.log(JSON.stringify({
  status: report.status, binding: report.binding, commands: report.commands.map(({ locale, phase, exit }) => ({ locale, phase, exit })),
  report: bind(path.join(root, "report.json")), completeCard: false,
}));
