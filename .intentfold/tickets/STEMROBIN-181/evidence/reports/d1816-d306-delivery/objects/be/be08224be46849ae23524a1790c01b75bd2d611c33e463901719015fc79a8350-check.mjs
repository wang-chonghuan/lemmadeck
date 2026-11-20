import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const owned = path.dirname(fileURLToPath(import.meta.url));
assert.equal(
  owned,
  path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d279-n17n18-text-review"),
);
assert.equal(path.resolve(process.cwd()), repo);
const receipts = new Map();
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

function read(relative) {
  const absolute = path.resolve(repo, relative);
  const bytes = readFileSync(absolute);
  receipts.set(absolute, { path: absolute, bytes: bytes.length, sha256: digest(bytes) });
  return JSON.parse(bytes.toString("utf8"));
}

function recordText(relative) {
  const absolute = path.resolve(repo, relative);
  const bytes = readFileSync(absolute);
  receipts.set(absolute, { path: absolute, bytes: bytes.length, sha256: digest(bytes) });
}

const math = (text) => text.match(/\$[^$]*\$/gs) ?? [];
const digits = (text) => text.match(/[0-9]+/g) ?? [];
const markers = (text) => text.match(/[①②]/g) ?? [];
const groups = (text) => text.trim() ? text.trim().split(/\n\s*\n/) : [];
const figureReferences = (text) => [...text.matchAll(/(?:图|Figure)\s*(\d+)(?:[，,\s]*([aа]))?/g)]
  .map((match) => `${Number(match[1])}${match[2] ? "a" : ""}`);
const forbiddenResidue = /[\u0400-\u04ff\u3400-\u9fff]/u;
const expectedKinds = { 17: { p: 8, fig: 3, cap: 4 }, 18: { p: 8, fig: 3, cap: 3 } };
const transplant = read(".intentfold/tickets/STEMROBIN-181/tmp/d1816-d278-text-transplant/result.json");
assert.equal(
  receipts.get(path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d278-text-transplant/result.json")).sha256,
  "60a4efff56716c46a34ab52281429c3d4ad9bc4e34927a2db4ae2f5dc7232ff5",
);
const freeze = read(".intentfold/tickets/STEMROBIN-181/tmp/d1816-d274-n17-n18-text-author/freeze.json");
recordText(".intentfold/tickets/STEMROBIN-181/tmp/d1816-d274-n17-n18-text-author/report.md");
assert.equal(receipts.get(transplant.authorFreeze.path).sha256, transplant.authorFreeze.sha256);
assert.equal(freeze.author, "D274");
assert.equal(freeze.approval, false);

const results = [];
const pairs = [];
let reviewedBlocks = 0;
let reviewedGroups = 0;
for (const number of [17, 18]) {
  const id = `phy10-c1-s3-n${number}`;
  const sourceRelative = `.tmp/STEMROBIN-181/d1816-d276/root/10p/lessons/${id}/lesson.json`;
  const source = read(sourceRelative);
  const sourceHash = receipts.get(path.join(repo, sourceRelative)).sha256;
  const exercisesRelative = `.tmp/STEMROBIN-181/d1816-d276/root/10p/lessons/${id}/exercises.json`;
  const exercises = read(exercisesRelative);
  assert.equal(source.exercise_count, 0);
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  const candidates = [];

  for (const edition of ["modern-us-neutral", "modern-us-neutral-en"]) {
    const prefix = `.tmp/STEMROBIN-181/d1816-d276/source-work/adapt/10p/${edition}/lessons/${id}`;
    const candidatePath = path.join(repo, prefix, "lesson.template.json");
    const candidate = read(`${prefix}/lesson.template.json`);
    candidates.push(candidate);
    const receipt = transplant.results.find((item) => item.edition === edition && item.id === id);
    assert.ok(receipt);
    assert.equal(receipts.get(candidatePath).sha256, receipt.transplanted.sha256);
    assert.equal(candidate.source.path, `lessons/${id}/lesson.json`);
    assert.equal(candidate.source.sha256, sourceHash);
    assert.deepEqual(candidate.source.data, source);
    for (const key of ["id", "card_id", "section", "number", "start_page", "start_printed", "exercise_count"]) {
      assert.deepEqual(candidate[key], source[key]);
    }
    assert.equal(candidate.prose.length, source.prose.length);
    assert.deepEqual(candidate.errata, []);
    assert.deepEqual(candidate.section_breaks, []);
    assert.deepEqual(
      candidate.figures.map(({ id: figureId, page }) => ({ id: figureId, page })),
      source.figures.map(({ id: figureId, page }) => ({ id: figureId, page })),
    );
    const kinds = {};
    const blocks = candidate.prose.map((block, index) => {
      const raw = source.prose[index];
      for (const key of ["kind", "id", "printed_page", "source_refs"]) {
        assert.deepEqual(block[key], raw[key]);
      }
      assert.equal(block.source_text, raw.text);
      assert.deepEqual(math(block.text), math(raw.text));
      assert.deepEqual(digits(block.text), digits(raw.text));
      assert.deepEqual(markers(block.text), markers(raw.text));
      assert.deepEqual(figureReferences(block.text), figureReferences(raw.text));
      assert.deepEqual(block.numeric_changes, []);
      assert.equal((block.text.match(/\*\*/g) ?? []).length % 2, 0);
      if (block.kind === "fig") {
        assert.equal(block.text, "");
        assert.deepEqual(block.changes, []);
      }
      if (edition.endsWith("-en")) {
        assert.equal(forbiddenResidue.test(block.text), false);
        if (block.label && block.label !== "footnote") assert.match(block.label, /^Figure \d+$/);
        if (block.text) assert.ok(block.changes.includes("translation"));
      } else {
        assert.equal(block.label, raw.label);
      }
      for (const entity of block.historical_entities) {
        assert.ok(block.text.includes(entity.term));
        assert.ok(raw.text.includes(entity.source_term ?? entity.term));
        assert.ok(entity.reason.includes(block.source_refs[0]));
      }
      kinds[block.kind] = (kinds[block.kind] ?? 0) + 1;
      reviewedBlocks += 1;
      const paragraphs = block.kind === "p" ? groups(block.text) : [];
      reviewedGroups += paragraphs.length;
      return {
        index: index + 1,
        kind: block.kind,
        source_refs: block.source_refs,
        authored_blank_line_groups: paragraphs.length,
        source_text_sha256: digest(raw.text),
        modern_text_sha256: digest(block.text),
        math_tokens: math(block.text),
        ascii_digit_sequences: digits(block.text),
        figure_reference_semantics: figureReferences(block.text),
        footnote_markers: markers(block.text),
        source_identity_equal: true,
        source_text_equal: true,
        formulas_and_digits_exact: true,
      };
    });
    assert.deepEqual(kinds, expectedKinds[number]);
    const exerciseCandidate = read(`${prefix}/exercises.template.json`);
    assert.equal(exerciseCandidate.source.path, `lessons/${id}/exercises.json`);
    assert.equal(
      exerciseCandidate.source.sha256,
      receipts.get(path.join(repo, exercisesRelative)).sha256,
    );
    assert.deepEqual(exerciseCandidate.source.data, exercises);
    assert.equal(exerciseCandidate.count, 0);
    assert.deepEqual(exerciseCandidate.exercises, []);
    assert.equal(candidate.locale, edition.endsWith("-en") ? "en" : undefined);
    results.push({
      edition,
      lesson: id,
      candidate: receipts.get(candidatePath),
      source: receipts.get(path.join(repo, sourceRelative)),
      embedded_source_matches_fresh_file: true,
      matches_d278_transplanted_sha256: true,
      source_ref_count: blocks.reduce((sum, block) => sum + block.source_refs.length, 0),
      kinds,
      exercise_count: 0,
      blocks,
    });
  }
  assert.deepEqual(candidates[0].source, candidates[1].source);
  const pairBlocks = candidates[0].prose.map((block, index) => {
    const english = candidates[1].prose[index];
    assert.deepEqual(block.source_refs, english.source_refs);
    assert.deepEqual(math(block.text), math(english.text));
    assert.deepEqual(digits(block.text), digits(english.text));
    assert.deepEqual(figureReferences(block.text), figureReferences(english.text));
    assert.equal(groups(block.text).length, groups(english.text).length);
    return {
      index: index + 1,
      source_refs: block.source_refs,
      paragraph_groups_each_language: block.kind === "p" ? groups(block.text).length : 0,
      ordered_formulas_digits_refs_equal: true,
    };
  });
  pairs.push({ lesson: id, blocks: pairBlocks });
}

// Analytic LC states settle the half/full-period distinction without a pipeline.
const phaseStates = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI].map((phase) => ({
  phase_in_periods: phase / (2 * Math.PI),
  normalized_charge: Math.cos(phase),
  normalized_current_dq_dt: -Math.sin(phase),
  electric_energy_fraction: Math.cos(phase) ** 2,
  magnetic_energy_fraction: Math.sin(phase) ** 2,
}));
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12);
near(phaseStates[2].normalized_charge, -1);
near(phaseStates[2].normalized_current_dq_dt, 0);
near(phaseStates[4].normalized_charge, 1);
near(phaseStates[4].normalized_current_dq_dt, 0);
near(phaseStates[1].electric_energy_fraction, 0);
near(phaseStates[1].magnetic_energy_fraction, 1);
for (const state of phaseStates) near(state.electric_energy_fraction + state.magnetic_energy_fraction, 1);
assert.equal(reviewedBlocks, 58);
assert.equal(reviewedGroups, 92);
for (const receipt of receipts.values()) {
  assert.equal(digest(readFileSync(receipt.path)), receipt.sha256, `Input changed during check: ${receipt.path}`);
}
const inventory = {
  schema: "d279-text-review-mechanical-evidence@1",
  batch: "D279",
  checked_at: new Date().toISOString(),
  status: "pass",
  scope: "read-only JSON/text checks; analytic normalized LC states; not pipeline validation",
  input_files: [...receipts.values()],
  source_bound_blocks_checked: reviewedBlocks,
  authored_blank_line_groups_checked: reviewedGroups,
  rendered_paragraph_count_claimed: false,
  images_opened: 0,
  results,
  bilingual_pairs: pairs,
  analytic_lc_states: phaseStates,
  analytic_current_sign_convention: "dq/dt for one fixed plate; reversing the circuit orientation reverses the listed current signs, not the conclusions",
  limits: [
    "No source-pixel or image judgment.",
    "Fresh lesson source_refs and embedded source snapshots checked; authoritative PDF/page reconstruction not rerun.",
    "String/formula checks do not replace the independent scientific and bilingual review in report.json.",
    "No renderer, full-project test, production pipeline, database, publication, Git or other-chat action.",
  ],
};
writeFileSync(path.join(owned, "inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`);
console.log(JSON.stringify({
  status: inventory.status,
  source_bound_blocks_checked: reviewedBlocks,
  authored_blank_line_groups_checked: reviewedGroups,
  inventory: path.join(owned, "inventory.json"),
  sha256: digest(readFileSync(path.join(owned, "inventory.json"))),
}, null, 2));
