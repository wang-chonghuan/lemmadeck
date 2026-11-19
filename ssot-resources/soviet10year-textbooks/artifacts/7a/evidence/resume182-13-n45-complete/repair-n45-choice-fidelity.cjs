const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const out = `${base}/n45-choice-affected-author`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const save = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
const originalSeed = `${base}/n45-choice-author/seed.json`;
const originalDraft = `${base}/n45-choice-author/draft.json`;
const firstFidelity = `${base}/n45-choice-review/stage2-fidelity.json`;
const seed = read(originalSeed);
const draft = read(originalDraft);
const original = structuredClone(draft);
const affected = ["q886a", "q886b", "q889"];
assert.deepEqual(read(firstFidelity).issues.map(issue => issue.question_id), affected);
const bookTrace = seed.trace.find(item => item.path.endsWith("/7a/book.json"));
assert.equal(hash(`${base}/n46-n47-raw-index-before.json`), bookTrace.sha256);
const oldBook = read(`${base}/n46-n47-raw-index-before.json`);
const newBook = read(bookTrace.path);
assert.deepEqual(newBook.lessons.slice(0, oldBook.lessons.length), oldBook.lessons);
for (const item of seed.trace.filter(item => item !== bookTrace)) assert.equal(hash(item.path), item.sha256);
bookTrace.sha256 = hash(bookTrace.path);
const q = id => draft.questions.find(question => question.id === id);
const proofA = q("q886a");
proofA.view.stem = String.raw`Each argument below claims to prove $\frac1{11+2\sqrt{30}}+\frac1{11-2\sqrt{30}}=22$. Which proposed common-denominator step is valid?`;
proofA.view.options[0].text = String.raw`Put the sum over the product of the two denominators:
$\frac{(11-2\sqrt{30})+(11+2\sqrt{30})}{121-120}$.
This establishes the stated equality.`;
proofA.view.options[1].text = String.raw`Add the original numerators and denominators separately:
$\frac{1+1}{(11+2\sqrt{30})+(11-2\sqrt{30})}$.
This establishes the stated equality.`;
proofA.view.options[2].text = String.raw`Use the cross-multiplied numerator and add the squares in the denominator:
$\frac{(11-2\sqrt{30})+(11+2\sqrt{30})}{121+120}$.
This establishes the stated equality.`;
proofA.key.rationales[0].derivation = "The common-denominator step is valid: numerator22 and product121-120=1 give22. Both original denominators are nonzero.";
proofA.key.rationales[1].derivation = "Invalidly adding denominators yields(1+1)/22=1/11, not the original sum22. It cannot establish the common stated conclusion.";
proofA.key.rationales[2].derivation = "The wrong conjugate product121+120 yields22/241, not22. Its common stated conclusion is unsupported.";
proofA.intent.unit_reason = "All alternatives make the same proof claim and present unevaluated intermediate steps. Validity of common-denominator formation and the conjugate product must be checked; terminal numeral matching no longer identifies the answer.";
const proofB = q("q886b");
proofB.view.stem = String.raw`Each argument below claims to prove $\frac{\sqrt5+2}{\sqrt5-2}+\frac{\sqrt5-2}{\sqrt5+2}=18$. Which proposed common-denominator step is valid?`;
proofB.view.options[0].text = String.raw`Multiply each numerator by its missing denominator factor:
$\frac{(\sqrt5+2)^2+(\sqrt5-2)^2}{5-4}$.
This establishes the stated equality.`;
proofB.view.options[1].text = String.raw`Multiply the denominators but keep the original numerators:
$\frac{(\sqrt5+2)+(\sqrt5-2)}{5-4}$.
This establishes the stated equality.`;
proofB.view.options[2].text = String.raw`Multiply each numerator by its missing factor, and add the denominator squares:
$\frac{(\sqrt5+2)^2+(\sqrt5-2)^2}{5+4}$.
This establishes the stated equality.`;
proofB.key.rationales[0].derivation = "The correct sum of squares is18 and conjugate product5-4=1, so the displayed valid step gives18.";
proofB.key.rationales[1].derivation = "Failing cross-multiplication gives2sqrt(5), not18. The identical proof claim is unsupported.";
proofB.key.rationales[2].derivation = "Incorrect conjugate multiplication gives denominator9, so the displayed wrong step yields18/9=2, not18.";
proofB.intent.unit_reason = "Uniform proof claims and unevaluated intermediate steps require recognizing the squared cross-products and difference-of-squares denominator, rather than matching the stem's supplied terminal value.";
const graph = q("q889");
graph.view.options[0].text = String.raw`| Condition | Complete solution set |
| --- | --- |
| $f(x)=3$ | $\{1,5\}$ |
| $f(x)>3$ | $[-1.5,1)\cup(5,6]$ |
| $f(x)<3$ | $(1,5)$ |`;
graph.view.options[2].text = String.raw`| Condition | Complete solution set |
| --- | --- |
| $f(x)=3$ | $\{0\}$ |
| $f(x)>3$ | $[-1.5,0)$ |
| $f(x)<3$ | $(0,6]$ |`;
graph.key.rationales[0].derivation = "Count the crossing at the vertical axis as tick1 instead of0 and similarly shift the right crossing4 to5; use those mistaken crossing abscissas to partition the stated domain. This yields exactly the displayed1/5 partition, which is false on the actual graph.";
graph.key.rationales[0].misconception = "Count the horizontal origin as1 and shift the two read crossing ticks by one while retaining the explicitly given domain.";
graph.key.rationales[2].derivation = "Find only the first crossing0 and overlook the graph's rising branch crossing4. Assume the graph remains below3 for every later domain point. This yields equality{0}, above[-1.5,0), and below(0,6], all contradicted by the actual right branch.";
graph.key.rationales[2].misconception = "Stop scanning after the first level intersection and omit the second crossing on the rising branch.";
graph.intent.unit_reason = "The alternatives now differ on the crossing set as well as above/below directions; each proposed crossing set has a coherent strict partition of the finite given domain. Equality is no longer supplied identically in every option.";
graph.intent.figure_observations.push({
  figure_id: "fig-60",
  observation: "Affected repair only: opened the unchanged sourcePNG and complete640px modern preview once each. Both show y=3 crossings atx=0 and4, below between, above on the outer parts within[-1.5,6]. The minimum near(2,1) and both domain endpoints are visible. No formula or exact unprinted crossing was inferred.",
});
fs.mkdirSync(out, { recursive: false });
save(`${out}/seed.json`, seed);
const digest = cp.execFileSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  "-B", ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", `${out}/seed.json`,
], { encoding: "utf8" }).trim();
draft.seed_sha256 = digest;
save(`${out}/draft.json`, draft);
save(`${out}/view-only.json`, { questions: draft.questions.map(question => ({ id: question.id, view: question.view })) });
assert.deepEqual(draft.questions.filter(question => !affected.includes(question.id)),
  original.questions.filter(question => !affected.includes(question.id)));
assert.deepEqual(draft.new_figures, original.new_figures);
save(`${out}/binding.json`, {
  originalSeed: { path: originalSeed, sha256: hash(originalSeed) },
  originalDraft: { path: originalDraft, sha256: hash(originalDraft) },
  rejectedFidelity: { path: firstFidelity, sha256: hash(firstFidelity) },
  seed: { path: `${out}/seed.json`, sha256: hash(`${out}/seed.json`), canonical: digest },
  draft: { path: `${out}/draft.json`, sha256: hash(`${out}/draft.json`) },
  view: { path: `${out}/view-only.json`, sha256: hash(`${out}/view-only.json`) },
  affected, unchangedQuestions: 45, correctSetsUnchanged: true, newFigures: 0,
  sourceMathAndAssetsUnchanged: true, traceOnlyBookAppendRebound: ["alg7-c4-s3-n46", "alg7-c4-s3-n47"],
  imageOpens: [
    { path: "ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-60.png",
      sha256: hash("ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-60.png"), opens: 1 },
    { path: "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/evidence/n45-independent/fig-60.preview.png",
      sha256: hash("ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/evidence/n45-independent/fig-60.preview.png"), opens: 1 },
  ],
  limitationPreserved: "Proof/complete-table recognition is not independent written production.",
  canonicalKeyNotDisclosed: true, changedSnapshotReviewPending: true,
});
for (const name of ["seed.json", "draft.json", "view-only.json", "binding.json"]) fs.chmodSync(`${out}/${name}`, 0o444);
console.log(JSON.stringify({ affected, unchangedQuestions: 45, sourceTraceReboundOnly: true }));
