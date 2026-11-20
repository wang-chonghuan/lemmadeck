import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const out = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n46-note-source175176-review-02");
if (process.cwd() !== root) throw new Error("Unexpected cwd");
const manifestPath = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n46-answer-note-repair-02/manifest.json");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const save = (name, value) => {
  const p = path.join(out, name);
  if (fs.existsSync(p)) throw new Error(`Refusing to overwrite ${p}`);
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};
const manifest = read(manifestPath);
const source = read(manifest.sourceFirst.path);
const mode = process.argv[2];

if (mode === "before" || mode === "after") {
  const verify = b => {
    try {
      const actual = sha(b.path);
      return { path: b.path, expected_raw_sha256: b.sha256, actual_raw_sha256: actual, match: actual === b.sha256 };
    } catch (e) {
      return { path: b.path, expected_raw_sha256: b.sha256, match: false, error: e.message };
    }
  };
  const groups = {
    repair117: manifest.bindings.map(verify),
    source16: source.bindings.map(verify),
    direct: [manifest.candidate, manifest.before, manifest.previousAnswerReview, manifest.sourceFirst].map(verify)
  };
  const snapshot = {
    phase: mode,
    cwd: process.cwd(),
    captured_at: new Date().toISOString(),
    repair_manifest: { path: manifestPath, raw_sha256: sha(manifestPath) },
    source_manifest: { path: manifest.sourceFirst.path, raw_sha256: sha(manifest.sourceFirst.path) },
    groups,
    counts: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, { total: v.length, matched: v.filter(x => x.match).length }])),
    failures: Object.values(groups).flat().filter(x => !x.match)
  };
  if (mode === "after") {
    const before = read(path.join(out, "bindings-before.json"));
    snapshot.identical_to_before = isDeepStrictEqual(before.groups, groups)
      && isDeepStrictEqual(before.repair_manifest, snapshot.repair_manifest)
      && isDeepStrictEqual(before.source_manifest, snapshot.source_manifest);
  }
  save(`bindings-${mode}.json`, snapshot);
  console.log(JSON.stringify({ phase: mode, counts: snapshot.counts, failures: snapshot.failures, identical_to_before: snapshot.identical_to_before }, null, 2));
  if (snapshot.failures.length || snapshot.identical_to_before === false) process.exitCode = 1;
} else if (mode === "delta") {
  const before = read(manifest.before.path);
  const candidate = read(manifest.candidate.path);
  const changes = [];
  const escape = s => s.replaceAll("~", "~0").replaceAll("/", "~1");
  const diff = (a, b, pointer = "") => {
    if (isDeepStrictEqual(a, b)) return;
    if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
        if (!(k in a) || !(k in b)) changes.push({ pointer: `${pointer}/${escape(k)}`, before: a[k], after: b[k], membership_changed: true });
        else diff(a[k], b[k], `${pointer}/${escape(k)}`);
      }
    } else changes.push({ pointer, before: a, after: b });
  };
  diff(before, candidate);
  const expectedAfter = before.answers[2].notes.replace(manifest.exactChange.from, manifest.exactChange.to);
  const restored = structuredClone(candidate);
  restored.answers[2].notes = before.answers[2].notes;
  const result = {
    scope: "N46 notes-only; no mathematical recomputation or images",
    before: { path: manifest.before.path, raw_sha256: sha(manifest.before.path) },
    candidate: { path: manifest.candidate.path, raw_sha256: sha(manifest.candidate.path) },
    changes,
    exact_single_field: changes.length === 1 && changes[0].pointer === "/answers/2/notes",
    exact_phrase_replacement: candidate.answers[2].notes === expectedAfter
      && before.answers[2].notes.split(manifest.exactChange.from).length === 2,
    whole_object_restored_equals_before: isDeepStrictEqual(restored, before),
    all_six_displayAnswers_unchanged: candidate.answers.length === 6 && candidate.answers.every((a, i) => isDeepStrictEqual(a.displayAnswer, before.answers[i].displayAnswer)),
    answers_except_affected_notes_unchanged: isDeepStrictEqual(restored.answers, before.answers),
    grading: candidate.answers.map((a, i) => ({ index: i, number: a.number, grading: a.grading, part_count: a.parts?.length ?? 0 })),
    no_new_gate2: true,
    mathematical_recomputations: 0,
    answer_image_loads: 0
  };
  save("answer-delta.json", result);
  console.log(JSON.stringify(result, null, 2));
} else if (mode === "index") {
  const files = fs.readdirSync(out).filter(n => n !== "output-index.json").sort();
  save("output-index.json", {
    ticket: "STEMROBIN-188",
    assignment: "SAME188-6",
    reviewer_role: "sole independent reviewer",
    directory: out,
    entries: files.map(name => ({ path: path.join(out, name), raw_sha256: sha(path.join(out, name)), bytes: fs.statSync(path.join(out, name)).size })),
    self_hash: "Excluded to avoid recursive self-hashing; emitted separately for collection."
  });
  console.log(JSON.stringify({ path: path.join(out, "output-index.json"), raw_sha256: sha(path.join(out, "output-index.json")) }, null, 2));
} else {
  throw new Error("Expected before, after, delta, or index");
}
