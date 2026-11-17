import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const seedPath = join(root, "seed.json");
const draftPath = join(root, "draft.json");
const viewPath = join(root, "view-only.json");
const seed = JSON.parse(readFileSync(seedPath, "utf8"));
const draft = JSON.parse(readFileSync(draftPath, "utf8"));

function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, ordered(value[key])]),
    );
  }
  return value;
}

// Match the contract's sorted, compact, ensure_ascii canonical JSON digest.
function canonicalDigest(value) {
  const ascii = JSON.stringify(ordered(value)).replace(
    /[\u007f-\uffff]/g,
    (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
  return createHash("sha256").update(ascii, "utf8").digest("hex");
}

const viewOnly = draft.questions.map((question) => ({
  id: question.id,
  source_numbers: [...question.source_numbers],
  view: {
    mode: question.view.mode,
    stem: question.view.stem,
    figure_ids: [...question.view.figure_ids],
    options: question.view.options.map((option) => ({
      id: option.id,
      text: option.text,
      figure_ids: [...option.figure_ids],
    })),
  },
}));

writeFileSync(viewPath, `${JSON.stringify(viewOnly, null, 2)}\n`, {
  encoding: "utf8",
  flag: "wx",
});

console.log(
  JSON.stringify(
    {
      seed: { path: seedPath, canonical_sha256: canonicalDigest(seed) },
      draft: { path: draftPath, canonical_sha256: canonicalDigest(draft) },
      view_only: { path: viewPath, canonical_sha256: canonicalDigest(viewOnly) },
      source_count: seed.exercises.length,
      question_count: viewOnly.length,
      option_count: viewOnly.reduce(
        (count, question) => count + question.view.options.length,
        0,
      ),
      concept_blocks: seed.concepts.map((concept) => concept.block),
      source_figure_count: seed.figures.length,
      candidate_figure_count: draft.new_figures.length,
      semantic_review: "pending_independent_reviewer",
    },
    null,
    2,
  ),
);
