# Semantic Gate

First ask: **Does this artifact make the learner think through the written
mathematical task, or could it be followed correctly while missing that task?**
Formatting or a correct numeric answer cannot rescue a failed purpose.
Judge fidelity by mathematical distinctions, key relationships and coverage,
not by whether a choice response proves independent writing or construction.
Complete-table recognition and reasonable elimination do not automatically fail.
Require recorded production losses; block if they destroy the learning task.
Fail genuine data-copying, absent mathematical judgment, leakage or removal of
a key task. Keep source, correct-set and distractor standards unchanged.

## Review Order

1. Read the seed prose, selected definitions and actual images. Solve the source
   independently. Record `source_reviews.independent_solution`. Do this without
   the author's internal solution or correct set. A separate agent receives the
   seed and images first, and the draft's `view` sections next; internal author
   reasoning is disclosed only for the later comparison.
2. Compare the visible questions against the source task. Judge `task_fidelity`,
   `redundancy` and `answer_leakage` before seeing the author's key. Can the task
   be answered by isolated cell clicks, wording clues or another question's
   answer? Have direction, quantifiers, interval endpoints, units or data changed?
   Does a drawing-to-recognition limitation honestly account for lost ability?
3. Solve each visible question afresh, determine the complete true set, and
   check **every** option. Only now compare the author's solution, derivations,
   misconceptions and key. A plausible distractor must actually result from the
   stated wrong procedure and must actually be false here.
4. Check whole-package source coverage and cross-question dependence. Make sure
   both merged seeds and split tasks have mathematical justification. Inspect any
   omitted task; a silent omission or essential capacity loss blocks approval.

Use separate records for fidelity and mathematics. Neither implies the other.
A concise but concrete evidence statement names the task or option and gives
the observed relationship, counterexample, calculation or leaked cue. "Pass",
"correct", "no issue" and rubric restatements are not evidence.

For every used figure, record the asset opened, its hash and the relevant visual
observation. A stored hash proves which asset was referenced, not that anyone
understood it. Confirm the rendered view contains every relevant object, including
the rightmost and bottommost ones; cropped previews do not establish a full check.
Unreadable diagrams, ambiguous labels, unresolved definitions or
insufficient conditions receive `blocked`, not a guessed answer.

For every draft `new_figures` entry, obtain the separate hash-bound
`new_figure_reviews` record from an independent reviewer who actually opens it.
Check the rendered image against its mathematical `basis`, including deliberate
wrong-option geometry and legible labels; do not reject an intentionally false
alternative merely for being false. Source figure observations and authored-figure
approval remain distinct from checking the option's mathematical truth.

## Verdicts

- `pass`: the specific check is supported by substantive evidence.
- `revise`: a definite authoring/math defect can be corrected from available input.
- `blocked`: missing evidence or an unresolved decision prevents a justified check.

`outcome` is `blocked` if any check is blocked, otherwise `revise` if any check
needs revision, otherwise `pass`. Do not weaken a failure just to match the key.
Keep rejected reviews. On repair, replace only the affected draft units and
review the new snapshot, including any affected package relationships.

Use `reviewer.kind = independent_agent` only for a genuinely separate reviewer.
With no available authorized delegation, an inline independent-stance pass is
allowed but must say `self_review`; do not claim agent independence.

## What the Tool Settles

`validate.py` checks field structure, exact identifiers/sets, seed freshness,
asset references, coverage relationships, snapshot binding and the declared
review's agreement with the draft when a mathematics check says `pass`. It
returns a nonzero exit for a non-passing review.

It does not read minds, execute mathematical proofs, detect equivalent options,
prove a misconception plausible, establish that a diagram was viewed, or decide
fidelity/leakage from text. A mechanically consistent wrong draft can pass this
tool. Human/agent semantic evidence is mandatory and remains separately labeled.
