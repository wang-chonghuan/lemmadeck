# STEMROBIN-184 SessionB: Frozen StageA Ledger

## Authorization and State

- Date: 2026-11-17.
- Task: bounded STANDARD ANSWER independent review, source-first StageA only.
- Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- Authorized content scope: book `10c`, edition `modern-us-neutral`, lesson `ana10-c7-s2-n103`, exercises `440-443`.
- Explicit path identity governs; the request's `n1034` token was not used to expand or change the scope.
- State: `STAGEA_FROZEN_AWAITING_PARENT_AUTHORIZATION_FOR_CANDIDATE_COMPARISON`.
- Evidence only. No formal handoff, ticket-state transition, production mutation, or Gate 2 approval.

## Frozen Evidence

Source-first derivations were created before this ledger, without reading a candidate:

```text
PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/source-first.md
SHA256 430c43751024be60e56e2708a4112f22e6a49d0bbb99f559e2c7f44c4f22a19f
```

This ledger's own absolute path is:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/ledger.md
```

Its SHA-256 is returned separately in the completion text; it is not embedded in itself. Both documents are frozen StageA evidence and are not to be rewritten to match a subsequently exposed candidate.

## Source Manifest

These three files are the ONLY content authorities. Digests are of the actual edition files, not the embedded original-source hash fields.

| Absolute path | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/lesson.json` | `29d12cf4190fdf1ce7b77d92cbc005fc1152b584a11e8449dae061922c8c5205` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/exercises.json` | `41e685e3e8284208a2b5b7187d04c010c187af92e32daa5e43491cc87ba157f7` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/figures.json` | `2a6dc86f35e0bd70b6db5291ab7aa15f25e4fa6c19eba1633101b8f1621aa730` |

All three digests were re-observed after writing `source-first.md` and matched the initial observations.

Structured, read-only enumeration observed:

- `lesson.exercise_count=4`, `exercises.count=4`, and four array entries.
- Exact exercise sequence: `440`, `441`, `442`, `443`; no omissions or duplicates.
- Each exercise has its matching `source_number` and `group_id=g1`.
- `lesson.figures=[]`, `figures.figures=[]`, and every exercise's `figure_refs=[]` and `figures=[]`.
- ZERO image files were opened, rendered, requested, or inferred.

## Instructions Read

These are behavioral instructions, NOT additional content authorities:

| Absolute path | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-answer/SKILL.md` | `afc242003e5bc2f3165dfc5bee60e2e684ed85e2627c7d57ce3501cdd76bfc83` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md` | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/readme.md` | `f8dd29bc96c49c08a668dfece3de3fee85dab43f49460ecf3fffe0cb605b1e76` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/charter/engineering.md` | `d4b38ea7ed61f21c70da56d600500f113f9eab8987b9267be6baf905c924977c` |
| `/Users/yong/.agents/skills/intentfold/SKILL.md` | `ccc1c9e4ba4d5f897df568eaa87283d5789e91ec8f1cc3cf171bcc6ed57f201c` |

No IntentFold capability was invoked; this bounded evidence task did not trigger a refresh, backend read, setup, handoff, or closure workflow. The engineering Charter was read only.

## Independent Quantity Ledger

Every row is derived from the authorized source and independently solved. "Source part" preserves authored labels; descriptive quantity names for unnumbered requests are ledger labels only.

| Exercise | Source part / quantity | Exact independent result | Conditions and status |
| --- | --- | --- | --- |
| 440 | `1)` maximum rise | \(\Delta h_{\max}=v_0^2/(2g)\); absolute peak \(h_0+v_0^2/(2g)\) | SOLVED; \(v_0>0,g>0\); absolute height requires the unstated launch height \(h_0\) |
| 440 | `2)` peak velocity | \(0\) | SOLVED; upward-positive vertical-motion convention |
| 440 | `3)` time to ground | \((v_0+\sqrt{v_0^2+2gh_0})/g\) | SOLVED AS A FAMILY; \(h_0\ge0\) is missing; \(2v_0/g\) only if \(h_0=0\) |
| 441 | Unnumbered distance | \(979/8=122.375\) | SOLVED; \(v(t)\ge0\) on \([0,5]\), proved rather than assumed |
| 441 | Unnumbered endpoint acceleration | \(977/100=9.77\) | SOLVED; derivative evaluated at \(t=5\) |
| 442 | Unnumbered distance | Full four-branch result below | SOLVED FOR ALL FIXED REAL \(R,a\); sign/no-reversal data are absent |
| 442 | Unnumbered endpoint acceleration | \(R+a/4\) | SOLVED; \(a\) is a coefficient, not the full acceleration |
| 443 | `a)` vertical velocity | \((2x-2)v\) | SOLVED; \(\dot x=v\) constant |
| 443 | `a)` vertical acceleration | \(2v^2\) | SOLVED; \(\ddot x=0\) |
| 443 | `b)` vertical velocity | \((3x^2-4x)v\) | SOLVED; \(\dot x=v\) constant |
| 443 | `b)` vertical acceleration | \((6x-4)v^2\) | SOLVED; \(\ddot x=0\) |

Coverage: `4/4` exercises, `11/11` requested quantities. No numerical value was fabricated for a source parameter.

For 442 let \(D=8R+16a/3\). The full distance is:

\[
S=
\begin{cases}
D,&a\ge0,\ a+2R\ge0,\\
-D,&a\le0,\ a+2R\le0,\\
D+\dfrac{a^4}{3R^3},&a<0<a+2R,\\
-D-\dfrac{a^4}{3R^3},&a>0>a+2R.
\end{cases}
\]

Only \(R=a=0\) overlaps the first two branches; both yield zero. The last two branches imply \(R>0\) and \(R<0\), respectively, so their denominators are nonzero. The derivation, turning-point conditions, boundary cases, and counterexample are frozen in `source-first.md`.

## Conditions and Missing-Data Register

| Exercise | Conditions faithfully retained | Missing data / interpretation limit |
| --- | --- | --- |
| 440 | Upward throw; no air drag; \(g\approx9.8\); symbolic \(v_0\); three source subparts | Launch height above ground; absolute-versus-relative height wording; no explicit units; no numeric \(v_0\). The throw defines the time origin by convention. |
| 441 | Exact supplied law \(9.8t-0.003t^2\); interval \([0,5]\); endpoint \(t=5\) | No explicit units. Initial position is not needed. Nonnegative velocity is derived from the actual coefficients. |
| 442 | Exact law \(Rt+a\sqrt t\); interval \([0,4]\); endpoint \(t=4\); fixed real coefficient interpretation | No numeric values or sign restrictions for \(R,a\); no no-reversal premise; no explicit units. Initial position is not needed. Acceleration at zero need not exist for this endpoint question. |
| 443 | Both exact polynomial curves; horizontal velocity \(v\) constant; vertical-projection quantities; `a)` expressly uses \(x\) | No numeric \(v\), sign restriction, initial position/time, coordinate range, or explicit units. These do not prevent answers in \(x\); a unique time-only trajectory would need initial data. |

Unit declarations were not added as source facts. Using \(g=9.8\) as the adopted numerical model permits exact rational coefficients, but remains an approximation to physical gravity.

## Gates and Boundaries

- Source identity, complete subpart enumeration, full derivations, sign checks, derivative checks, and explicit conditions are recorded.
- No candidate was read or compared. No findings about a production candidate are claimed.
- No book answer was read; no `bookRaw` verification or claim of absent book answers is made.
- No grading mode or production `expected` contract was approved.
- Gate 2's real MathLive editing/input verification was NOT run. This evidence cannot replace it.
- No tests, finalize, Git command, database access, app operation, publisher, dependency action, Charter edit, refresh, browser, full-project check, or formal handoff occurred.
- The only files created are the two authorized evidence documents, using `apply_patch`.
- Output paths were checked for existence only before creation; both were absent. No peer artifact content was read, changed, or removed.

## Stop Boundary

WAIT for the parent to explicitly authorize candidate comparison. Until then, read no answer keys, author drafts, choice files, scratch derivations, peer reports, or ticket reports. Keep these StageA files frozen; record any later authorized comparison separately rather than altering this evidence.
