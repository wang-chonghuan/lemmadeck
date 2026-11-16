import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const directory = ".intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-n42";
const oldPath = ".intentfold/tickets/STEMROBIN-182/tmp/5m-n42/rejected-midpoint-before-repair/view.json";
const newPath = ".intentfold/tickets/STEMROBIN-182/tmp/5m-n42/view.json";
const oldBytes = fs.readFileSync(oldPath);
const newBytes = fs.readFileSync(newPath);
const oldView = JSON.parse(oldBytes.toString("utf8"));
const newView = JSON.parse(newBytes.toString("utf8"));
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const sort = value => Array.isArray(value)
  ? value.map(sort)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]))
    : value;
const canonical = value => JSON.stringify(sort(value)).replace(
  /[\u007f-\uffff]/g,
  character => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
);
const deltas = [];
function compare(before, after, location = "") {
  if (canonical(before) === canonical(after)) return;
  if (Array.isArray(before) && Array.isArray(after) && before.length === after.length) {
    before.forEach((value, index) => compare(value, after[index], `${location}/${index}`));
  } else if (before && after && typeof before === "object" && typeof after === "object"
    && canonical(Object.keys(before).sort()) === canonical(Object.keys(after).sort())) {
    Object.keys(before).forEach(key => compare(before[key], after[key], `${location}/${key}`));
  } else {
    deltas.push({ path: location, before, after });
  }
}
compare(oldView, newView);

// Quote-aware object spans establish original physical bytes, not just JSON equality.
function questionSpans(text) {
  const start = text.indexOf("[", text.indexOf('"questions"'));
  const spans = [];
  let quoted = false;
  let escaped = false;
  let depth = 0;
  let objectStart = -1;
  for (let index = start + 1; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quoted = false;
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === "{") {
      if (depth === 0) objectStart = index;
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) spans.push(text.slice(objectStart, index + 1));
    } else if (character === "]" && depth === 0) break;
  }
  return spans;
}
const oldSpans = questionSpans(oldBytes.toString("utf8"));
const newSpans = questionSpans(newBytes.toString("utf8"));
if (oldSpans.length !== oldView.questions.length || newSpans.length !== newView.questions.length) {
  throw new Error("Question span extraction does not match parsed questions.");
}
const questionChecks = newView.questions.map((question, index) => ({
  question_id: question.id,
  question_index: index,
  physical_object_bytes_identical: oldSpans[index] === newSpans[index],
  before_object_sha256: sha(oldSpans[index]),
  after_object_sha256: sha(newSpans[index]),
  mode_stem_ids_sources_and_order_unchanged: canonical({
    id: oldView.questions[index].id,
    source_numbers: oldView.questions[index].source_numbers,
    mode: oldView.questions[index].view.mode,
    stem: oldView.questions[index].view.stem,
    figure_ids: oldView.questions[index].view.figure_ids,
    options: oldView.questions[index].view.options.map(option => ({ id: option.id, figure_ids: option.figure_ids })),
  }) === canonical({
    id: question.id,
    source_numbers: question.source_numbers,
    mode: question.view.mode,
    stem: question.view.stem,
    figure_ids: question.view.figure_ids,
    options: question.view.options.map(option => ({ id: option.id, figure_ids: option.figure_ids })),
  }),
}));
const evidence = {
  schema: "independent-pure-view-byte-delta-v1",
  inputs: {
    old_view: { path: oldPath, file_sha256: sha(oldBytes), canonical_sha256: sha(canonical(oldView)) },
    revised_view: { path: newPath, file_sha256: sha(newBytes), canonical_sha256: sha(canonical(newView)) },
    own_source_solutions: { path: `${directory}/source-solutions.json`, file_sha256: sha(fs.readFileSync(`${directory}/source-solutions.json`)) },
    own_prior_view_checks: { path: `${directory}/view-checks.json`, file_sha256: sha(fs.readFileSync(`${directory}/view-checks.json`)) },
  },
  question_count: newView.questions.length,
  option_count: newView.questions.reduce((count, question) => count + question.view.options.length, 0),
  leaf_deltas: deltas,
  physical_question_byte_checks: questionChecks,
  unchanged_question_count: questionChecks.filter(check => check.physical_object_bytes_identical).length,
  changed_question_count: questionChecks.filter(check => !check.physical_object_bytes_identical).length,
  all_non_text_metadata_unchanged: questionChecks.every(check => check.mode_stem_ids_sources_and_order_unchanged),
  internal_files_opened_by_this_script: [],
};
fs.writeFileSync(path.join(directory, "revised-view-byte-delta.json"), `${JSON.stringify(evidence, null, 2)}\n`);
const snapshotPath = path.join(directory, "revised-view-snapshot.json");
if (!fs.existsSync(snapshotPath)) fs.writeFileSync(snapshotPath, newBytes, { flag: "wx" });
console.log(JSON.stringify({
  old_view_bound_to_prior_evidence: evidence.inputs.old_view.file_sha256 === "e6c2089ebdbd48cbd1806552035f0a0d2785891e36b91ee767da8a45eaecbb01",
  source_still_frozen: evidence.inputs.own_source_solutions.file_sha256 === "36872c7604c37c8c9b79dd5d8c9d1df47a552f1e51a27a3651ef787fd81b5ff0",
  prior_view_still_frozen: evidence.inputs.own_prior_view_checks.file_sha256 === "e06ab49c1929f255c4259fc7084f9fa0b427dc0b90ea2c632018783e1faf7dd5",
  counts: { questions: evidence.question_count, options: evidence.option_count, changed: evidence.changed_question_count, unchanged: evidence.unchanged_question_count },
  changed_paths: deltas.map(delta => delta.path),
  all_non_text_metadata_unchanged: evidence.all_non_text_metadata_unchanged,
}, null, 2));
