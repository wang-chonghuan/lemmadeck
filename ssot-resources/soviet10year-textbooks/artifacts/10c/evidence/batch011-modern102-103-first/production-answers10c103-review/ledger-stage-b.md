# STEMROBIN-184 SessionB: Additive StageB Ledger

## State and Findings

- Date: 2026-11-17.
- Scope: comparison of the sole parent-authorized `n103-answer-candidate.json` against frozen StageA mathematics.
- Identity: `10c` / `modern-us-neutral` / `ana10-c7-s2-n103`; exercises `440-443`.
- Findings: NONE. No incorrect formula, expected value, unit requirement, omitted quantity, lost source condition, incomplete parameter case, or inappropriate grading setting was found.
- Coverage: `4/4` answers and `11/11` requested quantities.
- Substantive outcome: `GATE2_SUBSTANTIVE_PASS_FOR_AUTHORIZED_CANDIDATE`.
- Finalizer math syntax / ComputeEngine parsing / runtime grading verification: `NOT_RUN`.
- State: `STAGEB_REVIEW_RECORDED_WAITING_FOR_PARENT`.
- This is additive evidence only, not a formal handoff, production edit, finalize result, or publishing authorization.

## Sole Candidate Binding

The candidate content was emitted for review only after its bytes matched the parent's full authorized digest.

```text
PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c102-103/n103-answer-candidate.json
SHA256 0df3c827b497bcdd4069f092428967a2ec8f052f8eba03685c47b0ab3992b12f
```

No other candidate, choice file, author draft, scratch derivation, peer report, or ticket report was read. No conclusion here applies to a different candidate digest.

## StageA Preservation

These files were NOT rewritten. Their full digests were observed unchanged at StageB entry:

```text
PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/source-first.md
SHA256 430c43751024be60e56e2708a4112f22e6a49d0bbb99f559e2c7f44c4f22a19f

PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/ledger.md
SHA256 c8b0952d2c09f4639fe7f8f54429a269aa125334c571c6a6d8d2e3d1a1b68db3
```

Their mathematical baseline was established independently before candidate exposure. StageB records comparison without adapting that baseline to the author.

## Content Authority Digest Continuity

StageB read-only hashing confirmed all three source digests match StageA:

| Absolute path | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/lesson.json` | `29d12cf4190fdf1ce7b77d92cbc005fc1152b584a11e8449dae061922c8c5205` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/exercises.json` | `41e685e3e8284208a2b5b7187d04c010c187af92e32daa5e43491cc87ba157f7` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/figures.json` | `2a6dc86f35e0bd70b6db5291ab7aa15f25e4fa6c19eba1633101b8f1621aa730` |

ZERO images; all source figure lists and exercise figure references remain empty. No browser, rendering, image lookup, or figure inference occurred.

## New Evidence Binding

The complete review was written first and then hashed:

```text
PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/candidate-review.md
SHA256 97f38c06ab76d693465b5e261a8532741c4a1311a7a7d139fe82c41f76372ff1
```

This ledger's path is:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/ledger-stage-b.md
```

Its own SHA-256 is returned separately, not embedded in itself. Both new output paths were absent at StageB entry and were created using `apply_patch`.

## Complete Quantity Ledger

Line references identify the exact authorized candidate. Detailed formula, unit, and condition audits are in `candidate-review.md`.

| Exercise / quantity | Candidate line(s) | Result against frozen baseline |
| --- | --- | --- |
| 440 `1)` maximum height | 12 | PASS: relative rise \(v_0^2/(2g)\) and absolute peak \(h_0+v_0^2/(2g)\) distinguished |
| 440 `2)` peak velocity | 12 | PASS: \(0\); extra acceleration \(-g\) also correct |
| 440 `3)` ground-impact time | 12 | PASS: general height-dependent root; \(2v_0/g\) only under \(h_0=0\) |
| 441 distance | 21, 23 | PASS: \(122.375=979/8\), display and numeric expected agree |
| 441 endpoint acceleration | 21, 24 | PASS: \(9.77=977/100\), display and numeric expected agree |
| 442 distance | 32 | PASS: \(u\)-primitive and absolute-segment sum equal all four frozen \(t\)-based branches |
| 442 endpoint acceleration | 32 | PASS: \(R+a/4\) |
| 443 `a)` vertical velocity | 41, 43 | PASS: `2(x-1)v` equals frozen \((2x-2)v\) |
| 443 `a)` vertical acceleration | 41, 44 | PASS: `2v^2` |
| 443 `b)` vertical velocity | 41, 45 | PASS: `(3x^2-4x)v` |
| 443 `b)` vertical acceleration | 41, 46 | PASS: `(6x-4)v^2` |

442 equivalence is substantive, not a presentation preference: candidate \(F(u)=P(u^2)\), \(c=-a/R\), and \(t=c^2\). At an interior reversal \(F(c)=-a^4/(6R^3)\), yielding exactly the two turning branches. Its no-interior-reversal branch gives the other two sign cases; \(R=0\), zero coefficients, and endpoint zeros are covered.

## Expected Values, Units, and Grading

| Exercise | Candidate grading / parts | Substantive judgment |
| --- | --- | --- |
| 440 | `ungraded`, `parts=[]` | PASS: all three quantities explained, no false unique ground-height key |
| 441 | `auto`, two `numeric` parts | PASS: independent labels and exact finite numeric values `122.375`, `9.77` |
| 442 | `ungraded`, `parts=[]` | PASS: both quantities explained, complete unrestricted-sign distance, no forced displacement key |
| 443 | `auto`, four `expression` parts | PASS: authored a/b labels preserved and velocity/acceleration distinguished |

There are six automatic parts and zero `exact` parts. All six expected strings match their displays, contain only student-enterable mathematics by inspection, and include no explanatory text or invented unit suffix.

441 explicitly preserves the source's unspecified length/time units. No answer adds an unsupported unit field or unit declaration. 440 retains approximate \(g\approx9.8\); 442 retains unrestricted coefficient signs; 443 does not invent initial data or a positive-\(v\) restriction.

## Gate 2 Separation

| Gate concern | StageB result |
| --- | --- |
| Same lesson, edition, exercise identity | Substantive PASS |
| `bookRaw` verification | Not applicable to this candidate: none supplied or claimed; no book lookup performed |
| Independent full derivation / `source="derived"` | Substantive PASS for all four answers |
| Multiple requested quantities | Substantive PASS: eleven displayed quantities; six distinct auto parts; complete ungraded explanations |
| Expected-value mathematics and labels/units | Substantive PASS by inspection and derivation |
| Finalizer math syntax / parsing | NOT_RUN; not inferred from substantive agreement |
| `exact`-specific real MathLive edit requirement | No `exact` parts in this candidate; no browser/input check executed |
| Sufficient standard-answer explanation | Substantive PASS |
| Appropriate reliable auto versus ungraded treatment | Substantive PASS |
| No omission, duplication, or provenance confusion | Substantive PASS |

The substantive PASS must not be reported as an executed finalizer, parser, grading runtime, full Gate 2 completion, or production-ready result.

## Operation Boundary and WAIT

Only bounded reads of the authorized candidate, read-only hashes of the scoped inputs/evidence, and two additive `apply_patch` creations occurred in StageB.

No StageA rewrite, candidate edit, production edit, test, finalize, database access, publisher, Git command, refresh, browser, dependency action, full-project check, or formal handoff occurred. Peer files were preserved.

Final hashes of the two new documents, the frozen StageA documents, and the sole candidate are to be reported in the completion text.

WAIT for the parent. No further comparison, candidate revision, or downstream action is authorized by this evidence-only review.
