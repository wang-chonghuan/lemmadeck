const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-choice-affected-author";
const out = `${base}/RECOVERY1`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
const draft = read(`${base}/draft.json`);
const previous = structuredClone(draft);
const target = draft.questions.find(question => question.id === "q889");
assert.equal(target.intent.figure_observations.length, 2);
target.intent.figure_observations = [target.intent.figure_observations[1]];
previous.questions.find(question => question.id === "q889").intent.figure_observations = target.intent.figure_observations;
assert.deepEqual(draft, previous);
fs.mkdirSync(out, { recursive: false });
save(`${out}/draft.json`, draft);
save(`${out}/view-only.json`, { questions: draft.questions.map(question => ({ id: question.id, view: question.view })) });
assert.deepEqual(read(`${out}/view-only.json`), read(`${base}/view-only.json`));
save(`${out}/binding.json`, {
  previousDraft: { path: `${base}/draft.json`, sha256: hash(`${base}/draft.json`) },
  seed: { path: `${base}/seed.json`, sha256: hash(`${base}/seed.json`) },
  draft: { path: `${out}/draft.json`, sha256: hash(`${out}/draft.json`) },
  view: { path: `${out}/view-only.json`, sha256: hash(`${out}/view-only.json`) },
  change: "Only q889 duplicate observation consolidated into one record; every view, option, key and source solution unchanged.",
  firstStructuralFailurePreserved: true, newImagesOrSolves: 0,
});
for (const name of ["draft.json", "view-only.json", "binding.json"]) fs.chmodSync(`${out}/${name}`, 0o444);
console.log(JSON.stringify({ metadataOnlyRecovery: true, learnerViewsUnchanged: true }));
