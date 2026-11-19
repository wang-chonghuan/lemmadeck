# STEMROBIN-182 n46/n47 independent review

**Outcome: PASS. No actionable findings or required corrections.**

This is the single independent review of the two complete lessons' source
mathematics and actual final modern text/output hashes. It is not a new review of
previously captured source pixels, nor a review of any authored answers/choices.
All writes are confined to this review directory in the specified worktree.

## Scope and counts

Worktree: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

Authority root:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n46-n47-source-stage/artifacts/7a`

Raw authority is `lessons/<id>/{lesson.json,exercises.json}` and canonical
`pages/0273..0281/page.json`. Modern final authority is
`editions/modern-us-neutral/lessons/<id>/`.

| Lesson | Originals | Independent exercise tasks | Prose blocks | Prose math checks | Actual flow paragraphs | Breaks | Figures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| alg7-c4-s3-n46 | 892-901: 10 | 41 | 25 | 6 | 26 | 2 | 0 |
| alg7-c4-s3-n47 | 902-908: 7 | 24 | 17 | 4 | 19 | 2 | 0 |
| Total | 17 | 65 | 42 | 10 | 45 | 4 | 0 |

"Tasks" means each original labeled subquestion, or one task for an unlabelled
exercise; all intermediate substitution branches and exclusions are explicitly
solved inside those tasks. The ten prose checks group the complete examples,
theorems, converse proof, and coefficient conditions; they are not a claim that
only ten prose blocks were inspected. All 42 blocks were compared in order.

## Independence and freeze

Raw definitions and exercises were read first. All 65 exercise tasks and all
prose mathematical examples/proofs were independently derived before any modern
output was opened. The source solutions were then frozen to `0444`.

| Frozen source solution | SHA-256 |
| --- | --- |
| source-solutions.json | `c2ff0e265e0f7c6a374689470298c7705906eb297c1b98d8d7845f6b8b41539c` |
| source-solutions.md | `ca711878ba4171a39b1ae8e4eefd4906dd9f5b341fee7470734d6c9165dec3f1` |

These are reusable independent references for later answer/choice review, not
authored answer packages. No author keys, choice drafts, previous choices, old
ticket packages, or images were read. Exact source-file bindings accompany the
solutions. A read-only arithmetic command subsequently corroborated the exact
derivations with 102 numerical residual assertions, all passing; proofs establish
completeness and excluded branches, not numerical sampling.

## Text and source mathematics

Every raw prose/exercise object resolves to its canonical source text, with the
same original PDF identity across pages 273-281. Modern `source.sha256`,
`source.path`, embedded `source.data`, individual `source_text`, block references,
exercise numbers, source numbers, groups, page references, and empty figure
references agree with raw. Canonical page hashes are retained in `result.json`.

After ignoring only layout whitespace/bold delimiters and Latin label conversion,
all modern text matches raw exactly except the registered root-formula correction.
Formula-token arrays independently match. Thus no equation, original number,
coefficient, inequality, equation label, quantifier, or branch condition was lost.
Inline `changes` and `numeric_changes` were checked; there is no fifth changes
file. The two final directories each contain exactly the required four outputs.

All labels are natural Latin, with the stem and each labeled task on separate
lines. In particular, 903 has a-j, not a-i,k. The unlabelled 904 and 907 correctly
remain single tasks. The comparison includes the complete source instructions
such as "if roots exist", "without solving", "solve and check", and the proof
requirements, not merely the displayed equations.

High-risk independent solutions confirmed:
- 892(f), 898(c/e), 903(f), and 904 have no real roots.
- 896 yields q=35 and c=-35/4 irrespective of root naming/order.
- 900(d) holds for every real x; all three complete systems in 901 have no solution.
- 902(a) preserves `(5x-1)^2+6(5x+1)-7=0`. With t=5x-1, the second
  expression is t+2. Roots are -4/5 and 0; this is not another source erratum.
- 902(b/c/d) retain both substitution branches; (d) has distinct roots -2,-1,0,
  with -1 repeated. All 903 nonnegative/negative/zero branches and both square-root
  signs are handled explicitly.
- 905 includes both axes; (c) has only the y-axis intersection (0,6), and (d)
  has the shared origin only.
- 906 simplifies to sqrt(2)-2sqrt(15)/5 and sqrt(5).
- 907 has domain [-2,2]; 908 has [5/2,7] and [10,25/2), respectively.

## Registered quadratic erratum

**PASS, already-correctly handled; not a new defect.**
Exact target: n46 `lesson.prose[4]`, source `p0274#5`, id `p0274-math-1`.

Raw expression `$x_2=\frac{-b+\sqrt{b}}{2a}$` is wrong. Completing the square
gives `(2ax+b)^2=b^2-4ac=D`, so the radical must be sqrt(D). In the lesson's
introductory equation, b=-4 and D=256: sqrt(b) is nonreal, whereas the corrected
formula returns the actual root 2.

Only modern text changes it to `$x_2=\frac{-b+\sqrt{D}}{2a}$`.
The canonical block, raw lesson, and modern embedded/source text all retain the
wrong original faithfully. Modern registration matches canonical `page.meta.errata`
in id, block, original, and reason, and binds physical page 274 / printed page 268,
page.json SHA-256
`38c3a8bf267cf26b2b49e90201caee8abff8c2ab43f0ab2d9a2e493649dc1b9f`,
and original PDF SHA-256
`8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052`.
The previous source-pixel determination is reused without reopening any image.

## History and section boundaries

n46 `prose[11]`, source `p0275#5`, retains the original
`法国数学家弗兰苏阿·韦达（1540－1603）` exactly.
The sole historical declaration names `弗兰苏阿·韦达` and explicitly cites
`p0275#5`, preserving the source identity and dates. No historical claim was
rewritten or substituted, and no external biography verification is claimed.

The existing read-only `prose_flow.mjs`/`htmlfrag.js` helpers were used on the
actual final lesson JSON, not templates or manually calculated block offsets.
Every boundary is an exact, unique adjacent before/after text match:

| Lesson | Flow boundary index | Original block transition | Concept transition |
| --- | --- | --- | --- |
| n46 | 14 | 13 -> 14 | Theorem/example -> converse |
| n46 | 22 | 21 -> 22 | Monic converse -> equation from roots |
| n47 | 3 | 2 -> 3 | Factorization -> new variable |
| n47 | 13 | 11 -> 12 | General substitution -> biquadratic example |

The full literal before/after strings are frozen in `result.json`.
Each actual resolution agrees with `adaptation.audit.json`. n46's final example
adds one display paragraph; n47's examples add two. Consequently the actual flow
counts are 26 and 19, not the raw-block counts 25 and 17.

## Four-output inventory: n46

Directory: authority root +
`/editions/modern-us-neutral/lessons/alg7-c4-s3-n46/`.
These are SHA-256 of the actual inspected final bytes, not templates or claimed
author hashes.

| Output | Bytes | SHA-256 |
| --- | --- | --- |
| lesson.json | 25847 | `ba705694286cd4907408a759ca45d506948576b562947f681d41f98b39df8c61` |
| exercises.json | 17915 | `f3d715bebf5f2fbf368e3a1caae76b842a223ade1438857bd4961219037d00d9` |
| figures.json | 153 | `93dcc3dd8f4fafc8ee8050405ab7e091f396de5e7bed1af42bc39cf2d3a0f7ba` |
| adaptation.audit.json | 1179 | `e60985fa5037da00c12c76d220194f3f9c882835d032ea9b8340c9823f379cc2` |

Audit status pass, no errors; 25 prose blocks, 14 changed for layout/correction;
10 exercises, all 10 changed for label/layout; 2 resolved breaks; 1 erratum;
zero figures. Actual values and source bindings agree, not just the status string.

## Four-output inventory: n47

Directory: authority root +
`/editions/modern-us-neutral/lessons/alg7-c4-s3-n47/`.

| Output | Bytes | SHA-256 |
| --- | --- | --- |
| lesson.json | 16378 | `959cd3bd126ce94fc748ccda969f7f3e7e1ac5d1044fafb8226704612db7ecc3` |
| exercises.json | 11244 | `c0a2887860ab7aba63a123e42a71fad44d2922edc6858c15a93a101eee3497db` |
| figures.json | 153 | `d03816c301648d704316858b38439188fc77aa6fbfeb237ab36d2fa47f249921` |
| adaptation.audit.json | 1106 | `0d91e3bfd682d588554e4233c09a4a867809270a2891bda66217ee77c04fa44d` |

Audit status pass, no errors; 17 prose blocks, 9 changed for layout;
7 exercises, 5 changed for label/layout; 2 resolved breaks; no errata;
zero figures. Actual values and source bindings agree.

## Verification and boundaries

Scoped check:
`node .intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n46-n47-modern-review/review-check.mjs`
exited 0, PASS. Script SHA-256:
`41d1e175271a34f2380c4c4ac4caf5dbd7452ad7f9002c4ce042ffcc23760480`.
The eight output hashes stayed stable across their inspection within this one
review. This report includes the complete output binding now; no separate
repeated output-binding review is needed.

No finalize rerun, source or modern edit, fifth modern changes file, app/global
test, DB, Git, network, dependency, production, or image operation occurred.
No concurrent edits were modified. Manual artifacts were written with apply_patch.
Source solutions, result, report, and reproducibility script are frozen `0444`.

Remaining limitations are the explicitly excluded surfaces: this does not claim
new pixel/render/app evidence or an answer-key/choice review. There is no remaining
gap or actionable finding within the requested mathematical/text review.
