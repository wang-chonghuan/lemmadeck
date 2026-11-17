# STEMROBIN-184 SessionB: StageB Candidate Review

## Findings and Outcome

No actionable findings in the sole authorized candidate. All four answers and all eleven requested quantities agree mathematically with the frozen StageA derivations, including all parameter cases and missing-source-condition safeguards.

Outcome: `GATE2_SUBSTANTIVE_PASS_FOR_AUTHORIZED_CANDIDATE`.

This is a substantive content-and-grading review, NOT a finalizer pass, production readiness declaration, publication approval, or formal handoff. Finalizer math syntax, parser behavior, and runtime grading validation remain `NOT_RUN`.

## Authorization and Immutable Inputs

- Date: 2026-11-17.
- Book / edition / lesson: `10c` / `modern-us-neutral` / `ana10-c7-s2-n103`.
- Sole candidate, inspected only after matching the parent-authorized SHA-256:

```text
PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c102-103/n103-answer-candidate.json
SHA256 0df3c827b497bcdd4069f092428967a2ec8f052f8eba03685c47b0ab3992b12f
```

Frozen StageA evidence used for comparison, with unchanged digests observed before StageB:

```text
PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/source-first.md
SHA256 430c43751024be60e56e2708a4112f22e6a49d0bbb99f559e2c7f44c4f22a19f

PATH /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c103-review/ledger.md
SHA256 c8b0952d2c09f4639fe7f8f54429a269aa125334c571c6a6d8d2e3d1a1b68db3
```

The three sole content authorities are unchanged from StageA:

| Absolute path | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/lesson.json` | `29d12cf4190fdf1ce7b77d92cbc005fc1152b584a11e8449dae061922c8c5205` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/exercises.json` | `41e685e3e8284208a2b5b7187d04c010c187af92e32daa5e43491cc87ba157f7` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/figures.json` | `2a6dc86f35e0bd70b6db5291ab7aa15f25e4fa6c19eba1633101b8f1621aa730` |

Candidate line numbers below refer to the exact authorized bytes. JSON paths identify individual values where a display is stored on one line.

## Complete Quantity Comparison

| Exercise / requested quantity | Candidate result and location | Frozen StageA comparison | Outcome |
| --- | --- | --- | --- |
| 440 `1)` maximum rise | \(v_0^2/(2g)\); absolute peak \(h_0+v_0^2/(2g)\), line 12 | Exact match; rise and ground-relative height are correctly distinguished | PASS |
| 440 `2)` velocity at highest point | \(0\), line 12 | Exact match; additional acceleration \(-g\) is also correct | PASS |
| 440 `3)` elapsed time to ground | \((v_0+\sqrt{v_0^2+2gh_0})/g\); \(2v_0/g\) only for \(h_0=0\), line 12 | Exact match; missing launch height is explicitly retained | PASS |
| 441 distance on \([0,5]\) | \(122.375\), lines 21 and 23; `answers[1].parts[0].expected=["122.375"]` | \(979/8=122.375\); displayed value and numeric expected agree exactly | PASS |
| 441 acceleration at \(t=5\) | \(9.77\), lines 21 and 24; `answers[1].parts[1].expected=["9.77"]` | \(977/100=9.77\); displayed value and numeric expected agree exactly | PASS |
| 442 distance on \([0,4]\) | No reversal: \(|D|\); interior reversal: \(|F(c)|+|D-F(c)|\), line 32 | Equivalent to all four StageA branches; complete derivation below | PASS |
| 442 acceleration at \(t=4\) | \(R+a/4\), line 32 | Exact match, with \(a\) treated as a velocity-law coefficient | PASS |
| 443 `a)` vertical velocity | \(2(x-1)v\), lines 41 and 43; `answers[3].parts[0].expected=["2(x-1)v"]` | \((2x-2)v=2(x-1)v\) | PASS |
| 443 `a)` vertical acceleration | \(2v^2\), lines 41 and 44; `answers[3].parts[1].expected=["2v^2"]` | Exact match | PASS |
| 443 `b)` vertical velocity | \((3x^2-4x)v\), lines 41 and 45; `answers[3].parts[2].expected=["(3x^2-4x)v"]` | Exact match | PASS |
| 443 `b)` vertical acceleration | \((6x-4)v^2\), lines 41 and 46; `answers[3].parts[3].expected=["(6x-4)v^2"]` | Exact match | PASS |

Coverage: four distinct answers in source order, eleven displayed requested quantities, six independently labeled automatic-grading parts, and five quantities explained in the two ungraded answers.

## Exercise 440: Every Formula and Condition

Candidate answer: lines 9-15; `answers[0]`.

- \(v(t)=v_0-gt\): correct for upward-positive motion with acceleration \(-g\) and launch at \(t=0\).
- \(h(t)=v_0t-(g/2)t^2\): explicitly defined relative to the launch position, so the missing absolute height has not been silently discarded.
- \(v_0>0\), \(t_{\max}=v_0/g\), and maximum rise \(v_0^2/(2g)\): correct for the stated upward throw.
- Peak velocity \(0\) and peak acceleration \(-g\): both correct. Zero velocity is not mistaken for zero acceleration.
- Introduced \(h_0\ge0\): explicitly an unspecified launch height, not a fabricated given.
- Ground-relative maximum \(h_0+v_0^2/(2g)\): correct.
- Ground-impact time \((v_0+\sqrt{v_0^2+2gh_0})/g\): correct positive/later root. For ground launch, the root \(t=0\) is the launch event rather than the later impact.
- Ground-launch specialization \(h_0=0\), \(T=2v_0/g\): expressly conditional and correct.
- \(g\approx9.8\): correctly retained as approximate source data, without asserting exact physical gravity or invented units.
- The note accurately records the missing height and distinguishes relative and absolute maxima. No source value for \(v_0\) or launch height is invented.

Air resistance is not reintroduced; the formulas use the source's gravity-only model. The display covers all three authored subparts even though the explanation is written as one coherent paragraph.

`grading="ungraded"` and `parts=[]` are appropriate for this condition-dependent answer. No false unique machine key or unconditional ground-launch answer is exposed.

## Exercise 441: Every Formula, Unit, and Expected Value

Candidate answer: lines 18-26; `answers[1]`.

The source law is preserved exactly through \(v(t)=t(9.8-0.003t)\). On \(0\le t\le5\), the second factor is positive, so the displayed \(v(t)\ge0\) assertion is valid. Therefore the displayed velocity integral is distance, not merely displacement.

The primitive \(4.9t^2-0.001t^3\) differentiates to \(9.8t-0.003t^2\). Evaluation on the correct interval yields

\[
4.9(25)-0.001(125)=122.5-0.125
=122.375=\frac{979}{8}.
\]

The acceleration \(a(t)=v'(t)=9.8-0.006t\) and endpoint value \(a(5)=9.77=977/100\) are correct.

The two independent parts are:

- Label `路程`, judge `numeric`, expected `["122.375"]`.
- Label `终点加速度`, judge `numeric`, expected `["9.77"]`.

These labels identify the source's two unnumbered requested quantities without inventing source numbering. Both expected values are exact finite real numbers for the supplied decimal law, contain only answer mathematics, and match the display.

The candidate explicitly states that the source does not give length/time units and uses the units consistent with the original velocity formula. There is no invented metre, second, or \(\mathrm{m/s^2}\) requirement, and neither part adds an unsupported `unit` field.

`grading="auto"` with two `numeric` parts is substantively appropriate. Actual parser and runtime numeric-equivalence behavior were not exercised.

## Exercise 442: Every Formula and Full Equivalence

Candidate answer: lines 29-35; `answers[2]`.

The displayed endpoint derivative \(v'(4)=R+a/4\), signed displacement

\[
D=\int_0^4(Rt+a\sqrt t)\,dt=8R+\frac{16a}{3},
\]

and general distance \(L=\int_0^4|Rt+a\sqrt t|\,dt\) match StageA exactly. The candidate correctly warns that no parameter sign restrictions are supplied.

To distinguish primitive variables, call the frozen StageA primitive

\[
P(t)=\frac{R}{2}t^2+\frac{2a}{3}t^{3/2}.
\]

The candidate's \(u\)-based primitive is

\[
F(u)=\frac{R}{2}u^4+\frac{2a}{3}u^3=P(u^2).
\]

With \(u=\sqrt t\), \(dt=2u\,du\), and \(v=u(Ru+a)\), the transformed distance is exactly

\[
L=\int_0^2 2u^2|Ru+a|\,du.
\]

Also \(F'(u)=2u^2(Ru+a)\), \(F(0)=0\), and \(F(2)=D\). The candidate is not mistakenly using \(F'(u)=v(t)\); its substitution correctly includes the Jacobian.

If \(R=0\), no division by \(R\) is needed, there is no interior reversal, and \(L=|D|=16|a|/3\).

For \(R\ne0\), the unique potential nonzero zero is \(c=-a/R\) in \(u\). It is an interior reversal precisely when \(0<c<2\), equivalent to \(Ra<0\) and \(|a|<2|R|\). The time is \(t=c^2\), exactly StageA's \(\tau=a^2/R^2\) with the necessary sign guard.

If \(c\) is outside the open interval, the sign does not change internally, so \(L=|D|\). This correctly includes \(c=0\), \(c=2\), \(a=0\), and parameters of either sign.

If \(0<c<2\), each side has a fixed velocity sign and the distance is

\[
L=|F(c)-F(0)|+|F(2)-F(c)|
=|F(c)|+|D-F(c)|.
\]

Moreover,

\[
F(c)=-\frac{a^4}{6R^3}=P(\tau).
\]

This proves exact equivalence to the four frozen StageA branches:

| Parameter condition | Candidate evaluated segment sum | StageA result |
| --- | --- | --- |
| \(a\ge0,\ a+2R\ge0\) | No interior reversal, \(D\ge0\), so \(|D|=D\) | \(D\) |
| \(a\le0,\ a+2R\le0\) | No interior reversal, \(D\le0\), so \(|D|=-D\) | \(-D\) |
| \(a<0<a+2R\) | \(R>0\), \(F(c)<0\), \(D-F(c)>0\), so \(D-2F(c)\) | \(D+a^4/(3R^3)\) |
| \(a>0>a+2R\) | \(R<0\), \(F(c)>0\), \(D-F(c)<0\), so \(2F(c)-D\) | \(-D-a^4/(3R^3)\) |

The sole overlap of the first two rows is \(R=a=0\), which gives zero in both. Endpoint reversal guards and the \(R=0\) guard are complete. In particular the frozen analytical example \(R=1,a=-1\) gives \(c=1\), \(F(c)=-1/6\), \(D=8/3\), and the candidate sum \(L=3\), not \(8/3\).

The candidate's special case \(R,a\ge0\Rightarrow L=8R+16a/3\) is explicitly conditional and is a correct sufficient condition, not an invented source restriction.

The \(u\)-primitive and evaluated absolute-segment sum constitute a complete exact answer. No preference for StageA's presentation is a finding. No numerical coefficient values, units, or initial coordinate are invented.

`grading="ungraded"` and `parts=[]` avoid forcing an unconditional signed displacement or falsely unique key for the unrestricted parameter problem. The endpoint acceleration is still fully answered in the display.

## Exercise 443: Every Formula and Expected Value

Candidate answer: lines 38-48; `answers[3]`.

The constant horizontal velocity equations \(dx/dt=v\), \(d^2x/dt^2=0\) are correct. The displayed chain-rule equations

\[
\frac{dy}{dt}=y'(x)v,\qquad
\frac{d^2y}{dt^2}=y''(x)v^2
\]

retain the required second factor of \(v\) in acceleration.

Both source curves, \(y=x^2-2x+3\) and \(y=x^3-2x^2\), are copied without changing coefficients. The resulting four displayed formulas and four `expression` expected values match the frozen results exactly or by elementary expansion:

- `a) 纵向速度`: `2(x-1)v` equals \((2x-2)v\).
- `a) 纵向加速度`: `2v^2`.
- `b) 纵向速度`: `(3x^2-4x)v`.
- `b) 纵向加速度`: `(6x-4)v^2`.

Labels preserve both authored subparts and distinguish velocity from acceleration. The formulas describe signed vertical-projection quantities, not total speed along the curve. They are valid for any constant real \(v\), including \(v=0\); no positive-\(v\) restriction is introduced.

Using \(x\) satisfies `a)` explicitly and supplies a complete `b)` answer without inventing initial position/time. No unsupported time trajectory, coordinate range, or unit field is added.

`grading="auto"` with four independently labeled `expression` parts is substantively appropriate. Parentheses, adjacency multiplication, and powers are ordinary mathematical/LaTeX notation by inspection; the expected strings contain no explanatory prose or code-style function syntax. This is NOT a ComputeEngine parsing or input-contract result.

## Provenance, Figures, and Gate Boundary

Candidate metadata matches the authorized scope: schema `ld-s10y-answer/lesson-answers@1`, book `10c`, lesson `ana10-c7-s2-n103`, edition `modern-us-neutral`, status `draft`. The four exercise IDs are unique and in source order.

Every answer has `source="derived"`; no `bookRaw` is present, no book answer is claimed, and all `historical_entities` arrays are empty without introducing any historical entity. No choice or other candidate file was read.

ZERO images and zero source figure references remain authoritative. No figure input, image-dependent condition, or invented visual evidence appears in the candidate.

Substantive Gate 2 conclusions: identity, independent derivation, full quantity coverage, explanatory completeness, appropriate automatic-versus-ungraded treatment, expected-value mathematics, source conditions, and units all pass this bounded comparison.

The six automatic parts are two `numeric` and four `expression`; there are no `exact` parts. The `exact`-specific real MathLive edit requirement is therefore not instantiated by this candidate, but general finalizer math syntax and any applicable runtime checks still have NOT been run. This review does not substitute for them.

No production edit, finalize, test, database access, publisher, Git command, refresh, browser, dependency action, or formal handoff occurred.

Status: `STAGEB_REVIEW_RECORDED_WAITING_FOR_PARENT`.
