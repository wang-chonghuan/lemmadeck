import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const own = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-author";
const directory = path.join(repo, own);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = name => JSON.parse(fs.readFileSync(path.join(directory, name), "utf8"));
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
const freeze = read("solve-freeze.json");
for (const file of freeze.files) {
  if (sha(fs.readFileSync(path.join(repo, file.path))) !== file.sha256) {
    throw new Error(`Frozen file changed: ${file.path}`);
  }
}
const draft = read("draft.json");
const coverage = read("coverage.json");
const originalCount = coverage.groups.reduce((sum, group) => sum + group.original_task_count, 0);
const correctionCount = coverage.groups.reduce((sum, group) => sum + group.original_correction_task_count, 0);
if (originalCount !== 49 || correctionCount !== 18) throw new Error("Coverage count mismatch");
const ids = new Set(draft.questions.map(q => q.id));
const mapped = new Set([...coverage.groups, ...coverage.supplemental_questions]
  .flatMap(group => group.question_ids ?? [group.question_id]));
if (ids.size !== mapped.size || [...ids].some(id => !mapped.has(id))) {
  throw new Error("Detailed coverage and question IDs disagree");
}
const views = draft.questions.map(q => ({question_id: q.id, view: q.view}));
fs.writeFileSync(path.join(directory, "views.json"), `${JSON.stringify(views, null, 2)}\n`, {flag: "wx"});
const markdown = views.map(({question_id, view}) =>
  `## ${question_id}\n\n${view.stem}\n\n${view.options.map(o => `### ${o.id}\n\n${o.text}`).join("\n\n")}`
).join("\n\n---\n\n");
fs.writeFileSync(path.join(directory, "views.md"), `${markdown}\n`, {flag: "wx"});
const names = [
  "source.json", "solve.md", "supplementary-context.json", "solve-freeze.json",
  "draft.json", "coverage.json", "views.json", "views.md", "author-notes.md",
  "structural-first.json", "build-context.mjs", "freeze.mjs", "check.mjs", "export.mjs",
];
const hashes = {
  schema: "n38-author-handoff-hashes-v1",
  generated_at: new Date().toISOString(),
  checkout: repo,
  branch: "codex/STEMROBIN-182-textbooks",
  status: "AUTHOR_HANDOFF_INDEPENDENT_REVIEW_REQUIRED",
  source_seed_canonical_sha256: sha(canonical(read("source.json"))),
  draft_canonical_sha256: sha(canonical(draft)),
  view_count: views.length,
  original_task_count: originalCount,
  original_correction_task_count: correctionCount,
  files: names.map(name => {
    const bytes = fs.readFileSync(path.join(directory, name));
    return {path: `${own}/${name}`, sha256: sha(bytes),
      canonical_json_sha256: name.endsWith(".json") ? sha(canonical(JSON.parse(bytes))) : null};
  }),
  figures: [],
  independent_review_created: false,
};
fs.writeFileSync(path.join(directory, "hashes.json"), `${JSON.stringify(hashes, null, 2)}\n`, {flag: "wx"});
console.log(`Exported ${views.length} views. Original tasks ${originalCount}; original correction tasks ${correctionCount}.`);
console.log(`draft_sha256=${hashes.draft_canonical_sha256}`);
