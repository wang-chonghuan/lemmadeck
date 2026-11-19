# n94 / b94 Offline Choice Author

Authoring status: sealed structural-only handoff; independent
SOURCE -> BLIND -> FINAL semantic review is still required.
No semantic approval, promotion, finalization, display or course claim.
Finish=review; Grill=self. No independent reviewer was started or impersonated.

Date: 2026-11-19.
Exact cwd for every shell command:
/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck.
Book/lesson: 7p / phy7-c1-s1-n94.
Owned package:
.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-choice-author/.

## Evidence

Official seed: seed.json.
Independent full source solving: stage1.md.
Manually authored draft and per-option reasoning: draft.json.
Exact learner-only projection: learner-only-views.json.
Hash/receipt binding: author-manifest.json.
This durable report is also included in the manifest's artifact hashes.
All six handoff files are sealed with permission mode 0444.

Stage1 and seed were sealed before draft.json existed; the recorded assertion
and hashes are in commands/n94-choice-author-stage1-seal-1.json under the
resume-180-4 directory. Stage1 was not subsequently edited.

Canonical SHA-256:

- Seed: 243312ab9946ece7f0594e624ac014486be3aff9fe3faf3ad2be2f01c70c2c3d.
- Draft: 0016e110208a0ad79c9252c76bcafbb348a2db371647efa0bc4dbf55bd1c5246.
- Views: 1bf37bf38b0c31819273db7489595eb5bdd355b9dbb15fcfa3b516fe0e639076.

Byte SHA-256:

- Stage1: c3347dae0ff07a4eee54a2ec662bdfdd2e504558468eb990644db0185d0cd0eb.
- Seed: baea271b575be291e3f087e25acc9d38ca6b3fbbc1fac55f5fdfd2c5c79497a3.
- Draft: cf7b7212aefff04fccc72af867feea6a2477dc26790da71d85fdce838dc1c089.
- Views: b2836f85f3b87e1ebd03fe92473948fb2ce35babd4d47cb96865aedebd2589b8.

The manifest binds thirteen completed recorder receipts. One additional
final-seal receipt binds the manifest itself, the final 0444 modes and all
handoff artifacts, for fourteen author-stage receipts in total.
Recorder was reused, not replaced:
.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/run-stage.mjs.
Recorder SHA-256:
5712b5d546ede7cc5abc3edf5ec322b3e784486f1b5f60a3ca55319877c165cf.

## Coverage

Eight written seeds; seven represented; one entire task blocked.
Four questions, eighteen options: one native multiple and three native single.
Three genuine definition blocks: 6, 7 and 13; worked example block 12 excluded.
One seed table; zero new figures. Four actual image opens, zero crops/reopens.
The four per-open receipts bind the original PNGs and complete native
screenshots; no image payload is part of the textual handoff.

| Question | Sources | Preserved task |
| --- | --- | --- |
| n94-q1 | 1, 2, 4 | Definition, all three energy-per-mass units, Q=qm |
| n94-q2 | 3, g2-1 | Both quoted values, one-kilogram heat meaning, petroleum 10500 unit |
| n94-q3 | g2-2 | Two-fuel comparison and calorific-value grounds |
| n94-q4 | g2-3 | Both 15 kg charcoal and 200 g alcohol; complete J/kcal results |
| Omitted | g2-4 | Numerical heat from 2 L kerosene; missing density/sample mass |

The original table and approved modern rendering retain independent rounded
J/kg and kcal/kg columns. No modern conversion constant was imported, no column
was replaced, and calculated totals use each source column separately.
The kcal/kg versus cal/g prefix identity does not imply exact J/cal equivalence.
The fuel comparison explicitly states equal masses and complete combustion;
the source's less explicit same-conditions wording is recorded as a clarification,
not silently expanded into a claim about unequal masses.

Every represented written task loses independent production: defining, listing,
explaining, deriving or documenting computations. Each loss is explicit in the
draft's intent and eight-row coverage. Both quantitative parts of g2-3 are retained.
No table-value copying is the sole task of any table-backed question.
fig-226 was inspected but is not a question or seed figure because the chemical
mechanism is outside these written calorific-value tasks.

## Precise Blocker

g2-4 gives 2 L kerosene and the table gives q=4.6 x 10^7 J/kg or
11000 kcal/kg. Authorized prose, definitions and both actual figures give
no kerosene density and no mass for the 2 L sample.
Needed: an authorized density with stated mass/volume units and relevant
conditions, or the sample mass. No numeric answer is justified without it.
No density was guessed or obtained from answers or another lesson.
The missing numerical task was not replaced by an "insufficient information"
choice question, and its omission is not treated as semantic approval.

## Mechanical Checks

Exactly one structural validator invocation, exit 0:

```bash
python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-choice-author/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-choice-author/draft.json
```

Observed stdout: "mechanical checks passed; semantic review still required".
Receipt: commands/n94-choice-author-structural-validate-1.json.
No --review invocation, tool tests, semantic review artifact or semantic verdict.

Views were generated separately by the exact expression
draft.questions.map(question => question.view), persisted and read back.
Deep equality and exact field sets were asserted: only mode, stem, figure_ids,
options and option id/text/figure_ids. The learner projection contains no source
mappings, intent, keys, rationales, coverage or author question IDs.
Receipt: commands/n94-choice-author-learner-only-views-1.json.

## Boundaries and Handoff

No environment, database, model service, network, dependency, application,
Git or other-agent operations. No answer content or old choice/interaction
content, tests or history were consulted. No canonical source file was edited.
An initial broad reference-path search listed unrelated ticket basenames;
none of those hits' contents was opened or used. Subsequent artifact reads
were explicitly scoped to this author package and permitted figure evidence.
All other worktree changes are preserved.

Independent SOURCE review should start with seed.json and the actual referenced
table, without stage1, the draft's intent or key. BLIND review receives only
learner-only-views.json. FINAL comparison can then use the sealed full author
package and manifest. The kerosene blocker and declared production losses
remain matters for that independent gate. Author stops here.
