import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticket = path.join(repo, ".intentfold/tickets/STEMROBIN-181");
const root = path.join(ticket, "tmp/d846-n71-native-recovery");
const first = path.join(ticket, "tmp/d822-n71-first-bilingual-native");
const repair = path.join(ticket, "tmp/d829-n71-source-contract-repair");
const reviewFile = path.join(ticket, "tmp/d838-n71-source-contract-affected-review/report.json");
const seeds = path.join(ticket, "tmp/d842-n71-seed-byte-recovery");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const answerTools = path.join(repo, ".claude/skills/ld-s10y-answer/tools");
const card = "phy10-c2-s2-n71";
const edition = "modern-us-neutral";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const bind = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const inputs = [];
const receipts = [];
const outputs = {};
assert.equal(process.cwd(), repo);
const review = read(reviewFile);
assert.equal(review.results.reviewedFieldsFailed, 0);
assert.equal(review.results.reviewedFieldsPassed, 18);
assert.equal(read(path.join(seeds, "report.json")).recoveredSeedBytes.length, 4);
inputs.push(bind(reviewFile), bind(path.join(seeds, "report.json")));

function owned(file) {
  assert.ok(file.startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  assert.equal(fs.realpathSync(path.dirname(file)), path.dirname(file));
}

function write(file, value) {
  owned(file);
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}

function copy(file, target, expected) {
  const input = bind(file);
  if (expected) assert.equal(input.sha256, expected);
  owned(target);
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o644);
  assert.equal(hash(target), input.sha256);
  inputs.push(input);
}

function copyTree(source, target) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const file = path.join(source, entry.name);
    const destination = path.join(target, entry.name);
    if (entry.isDirectory()) copyTree(file, destination);
    else {
      assert.ok(entry.isFile(), `Unsupported redirected input: ${file}`);
      copy(file, destination);
    }
  }
}

function native(locale, stage, command, args, attempt = 1) {
  const directory = path.join(root, "native", locale, stage);
  write(path.join(directory, "started.json"), { cwd: repo, command, args, attempt, startedAt: new Date().toISOString() });
  const result = spawnSync(command, args, {
    cwd: repo, encoding: "utf8", timeout: 180000, maxBuffer: 12 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  write(path.join(directory, "stdout.txt"), result.stdout || "");
  write(path.join(directory, "stderr.txt"), result.stderr || "");
  const receipt = {
    locale, stage, attempt, command, args, cwd: repo, nativeExit: result.status,
    signal: result.signal, error: result.error ? String(result.error) : null,
    status: result.status === 0 ? "PASS" : "FAIL", firstFailurePreserved: true,
    finishedAt: new Date().toISOString(),
  };
  write(path.join(directory, "receipt.json"), receipt);
  receipts.push(bind(path.join(directory, "receipt.json")));
  console.log(`${locale} ${stage}: exit=${result.status}`);
  if (result.status !== 0) console.log((result.stdout || "") + (result.stderr || ""));
  return result.status === 0;
}

for (const locale of ["zh", "en"]) {
  const artifactRoot = path.join(root, locale, "workingartifactroot");
  const work = path.join(root, locale, "work");
  copyTree(path.join(first, locale, "workingartifactroot"), artifactRoot);
  copyTree(path.join(first, locale, "work"), work);
  const templates = path.join(work, "adapt/10p", edition, "lessons", card);
  for (const kind of ["lesson", "exercises"]) {
    const source = path.join(repair, locale, card, `${kind}.template.json`);
    const approved = review.candidateFiles.find((item) => item.locale === locale && item.kind === kind);
    assert.equal(hash(source), approved.sha256);
    const target = path.join(templates, `${kind}.template.json`);
    const previous = bind(target);
    inputs.push(bind(source));
    fs.copyFileSync(source, target);
    fs.chmodSync(target, 0o644);
    write(path.join(root, locale, `${kind}-replacement.json`), { previous, approved: bind(source), working: bind(target) });
  }
  for (const pack of ["q12", "q3"]) {
    const target = path.join(root, locale, "original-choice-set", pack);
    copy(path.join(seeds, locale, `${pack}-seed.json`), path.join(target, "seed.json"));
    for (const name of ["draft.json", "review.json"]) {
      copy(path.join(first, locale, "choice-set", pack, name), path.join(target, name));
    }
  }
  const target = path.join(artifactRoot, "10p/editions", edition, "lessons", card);
  const base = ["--book", "10p", "--edition", edition, "--lesson", card, "--root", artifactRoot, "--work", work];
  const item = { artifactRoot, work, target, templates, completeCard: false };
  outputs[locale] = item;
  if (!native(locale, "adapt-finalize-retry2", python, [path.join(tools, "p2c.py"), "adapt-finalize", ...base], 2)) {
    item.dependentStagesStopped = ["render", "answer-finalize", "interaction-prepare", "interaction-finalize", "display"];
    continue;
  }
  item.adapt = "PASS";
  if (!native(locale, "render-FIRST", python, [path.join(tools, "p2c.py"), "render", ...base])) continue;
  item.render = "PASS";
  if (!native(locale, "answer-finalize-FIRST", python, [path.join(answerTools, "lesson_answers.py"), "finalize", ...base])) continue;
  item.answers = "PASS";
  const interactionBase = ["--book", "10p", "--edition", edition, "--lesson", card, "--root", artifactRoot];
  if (!native(locale, "interaction-prepare-FIRST", python, [path.join(answerTools, "lesson_interactions.py"), "prepare", ...interactionBase])) continue;
  if (!native(locale, "interaction-finalize-FIRST", python, [path.join(answerTools, "lesson_interactions.py"), "finalize", ...interactionBase])) continue;
  item.interactions = "PASS";
}
write(path.join(root, "report.json"), {
  schema: "d846-n71-native-recovery@1", card, outputs, receipts, inputs,
  reused: "d433 unaffected + d838 affected text; d814 exact figs; approved answers; d842 exact choice seeds",
  firstD822FailuresUntouched: true, newImages: 0, paidCalls: 0,
  nativeCalls: receipts.length, choiceMeaningOrHistoricalHashesChanged: false,
  choiceBindingToCurrentSource: "PENDING_NATIVE_SUCCESS", display: "NOT_RUN", completeCard: false,
});
