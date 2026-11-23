# Exercise 338: first retained-solution candidate comparison

Verdict: MATCH.
Scope: SAME STEMROBIN-184 /184-6, review9c/10cOFFLINEONLY;
10c / modern-us-neutral / ana10-c6-ex / exercise 338 ONLY.
Reviewer: the same sole independent MATH reviewer as Phase A.
State: completedOPEN, awaiting parent retention and actual closure.

Actual cwd:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`

## Retention before disclosure

The current parent instruction reports Phase A consumed and retained ONCE,
before candidate disclosure: four files, 15058 bytes, execution `6d507077`,
exit 0, retention SHA-256
`6dbbb7c6283eb3e46ea68448a43b1279a8180d2b550f4bc02f08b9aaf585118c`.
This is a parent-reported retention fact, not a new local verification.

The comparison uses my already frozen first independent result:

$$
y'=2\sin x+2x\cos x-2x\cos(x+2)+(x^2-2.3)\sin(x+2),
\qquad x\in\mathbb R.
$$

Its retained report is
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-answer338-math-review/phaseA/independent-solution.md`,
SHA-256 `ca6603cfaef80e35fdac3e0e7768c6298d002ac218380d1f6752001c91a6b96f`.
The authoritative modern exercise input SHA-256 remains
`485c156b1896f531f54fa39fe15f805eb49af309c0d442f2bb7b7274c5861d8d`.
These references come from retained conversation context; no Phase A file,
governance file, previous review, source image or historical answer was reread.

## Released candidate binding

Candidate file:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-answer-reviewed-working-copy/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex/answer-keys.json`

Whole-file SHA-256:
`61496802538c7216a8f2b113d0731d243ca3d74c164b2c80e45f9539e5062f5e`.
File size: 26083 bytes. Structured JSON parsed; expected hash matched;
exactly one exercise "338" selected. Only its displayAnswer, notes, grading,
source and parts were projected. Phase B was asserted absent before any write.
The parent's unchanged-other-56-entries/package-metadata diff proof is reused,
not repeated, and is not an independent claim made by this comparison.

Exact candidate displayAnswer:

> $y'=2\sin x+2x\cos x-2x\cos(x+2)+(x^2-2.3)\sin(x+2)$。

Exact candidate notes:

> 按已独立复核的现代题面，将 2.3 读作小数。两项分别用乘积法则：(2x sin x)'=2sin x+2x cos x；[(x^2-2.3)cos(x+2)]'=2x cos(x+2)-(x^2-2.3)sin(x+2)。保留原式外部减号后得到所列四项。定义域为全体实数。来源复核支持小数语义转写，不宣称扫描件具有已知编码字符。

Other selected fields are present and exactly:
`grading: "ungraded"`, `source: "derived"`, `parts: []`.

## Mathematical and metadata comparison

| Frozen independent term | Candidate comparison |
| --- | --- |
| $+2\sin x$ | Present exactly, with positive sign. |
| $+2x\cos x$ | Present exactly, with positive sign. |
| $-2x\cos(x+2)$ | Present exactly, with negative sign and unchanged phase shift. |
| $+(x^2-2.3)\sin(x+2)$ | Present exactly, with positive sign and accepted decimal. |

The candidate notes agree with both independently obtained product derivatives:
$A'=2\sin x+2x\cos x$ and
$B'=2x\cos(x+2)-(x^2-2.3)\sin(x+2)$.
Subtracting all of B' explains the last positive sine product; neither product
term nor the outer subtraction is omitted.

The inner function x+2 has derivative 1. The displayed sine term contains
exactly that chain factor implicitly, with no spurious factor 2 and no lost
phase shift. The constant 2.3 is unchanged and has derivative zero.

The notes explicitly state the domain is all real numbers. This agrees with
the frozen domain analysis: both products and their derivatives exist
everywhere on the real line. The domain is in notes, not separately appended
to displayAnswer; the displayed formula is valid on the entire real domain.
There are no missing cases or further requested quantities.

The displayed derivative is a complete suitable ungraded answer.
`grading: "ungraded"` does not pretend to judge submissions;
`parts: []` is consistent with that declared mode.
`source: "derived"` accurately labels the independently derived result rather
than a claimed copied book answer. The notes give correct derivation and
qualified decimal-transcription context.

No mathematical, completeness or selected-metadata issue was found.
MATCH applies only to this exercise and these released fields. It is not
whole-lesson Gate 2 approval, runtime rendering evidence, automatic-judging
validation, unchanged-package verification or authorization to finalize.

## Provenance qualification without rewriting Phase A

The Phase A wording "direct human-supplied retained acceptance" is overstrong.
The original source acceptance was relayed by the PARENT AGENT under continuing
user authorization. It came from retained independent SOURCE reviews
`497ee858` / `aeec81c6`; it was not fresh direct human source approval.
This correction qualifies every equivalent overstrong provenance description
in the preserved Phase A evidence. Its original 0444 bytes are not rewritten.

The semantic decimal 2.3 and heading acceptance remain retained source facts.
Raster codepoint remains UNKNOWN, with no new raster proof requirement.
The mathematical authority remains the SHA-bound modern prompt. This
provenance wording correction creates no mathematical or source-proof failure
and does not reopen source review. The candidate notes do not make the
overstrong direct-human-approval claim.

## Completion boundary

This was the FIRST TEXT-only candidate comparison, after reported Phase A
retention and only within the new Phase B authorization.
No additional independent solution was generated from the candidate.
No other exercise, old key, previous solution/review or source was disclosed.
Only this new report and a new ledger under phaseB are written and sealed.
No finalizer, answer/lesson/canonical edit, image/browser/native-image/paid call,
job, agent/tree/chat, Git/DB/backend/environment, publication or message action
is performed. Existing dirt and all Phase A files are preserved.

Await parent retention of this comparison and parent actual closure.
Remain completedOPEN; no further comparison or production stage is authorized
by this report.
