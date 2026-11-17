# STEMROBIN-184 / SessionB / 10c n103 / Stage3 Internal Comparison

Status: FROZEN comparison; final semantic outcome `revise`; WAIT before any repair.
Date: 2026-11-17 (Europe/Dublin).
This stage compares disclosed internals with already frozen independent evidence. It does not approve, repair, publish, or edit the candidate.

## Authorization and Snapshot Identity

The user reported fully consuming the entire frozen Stage2 evidence and ledger, including all eighteen independent option checks and the leakage/scope findings, before authorizing this internal disclosure.

Sole newly disclosed mathematical artifact:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/draft.json`

| Binding | SHA-256 |
| --- | --- |
| Draft canonical, supplied and independently computed | `a7149030c0401f0f187092b2182ef1d0c1e6d6ed4e5752b4d1b89aa2c5febffb` |
| Draft raw bytes | `6bcd7db62f42c47fff24ea3cbc7e558a53a5da60ed2855545936720050301058` |
| Draft's independently computed view-only projection canonical | `70c9db907d932eab9c3155dd33b2227893580f549822322b4fdaf4d17f915d9d` |
| Previously frozen Stage2 view-only canonical | `70c9db907d932eab9c3155dd33b2227893580f549822322b4fdaf4d17f915d9d` |
| Seed canonical | `02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf` |
| Stage1 source-first bytes | `ac24683f10dfb608428a46fcdc15c56d5b76951c882d316efba0c3c4a269348f` |
| Stage1 ledger bytes | `b2f723f3ddd8bf8d6d101ce20c58486b234e8cc2ff890dabc09d9af5a7e3f730` |
| Stage2 evidence bytes | `a17103c59e9deaf8c29d303f1abc49fe55e2c4990815d8b74642bf9fbed6ac80` |
| Stage2 ledger bytes | `251781d4d29acbff89757c225d91baed7ed2d0476dc0356a5cd41238223e1457` |

Both the disclosed draft digest and its projection binding matched before comparison. The projection match establishes that these internals belong to the exact four views independently reviewed at Stage2, not a repaired or different candidate.

Question IDs and source mappings were disclosed only now:

| Frozen visible ordinal | Disclosed question ID | Disclosed source |
| --- | --- | --- |
| 1 | `q01` | `440` |
| 2 | `q02` | `441` |
| 3 | `q03` | `442` |
| 4 | `q04` | `443` |

These agree with the independent mathematical correspondence previously recorded without hidden metadata.

No separate answer-key file, source-solutions file, other draft, standard answer, earlier choice, or other ticket evidence was read. `intent.source_solution`, `key`, and `coverage` were read solely as fields of the exact newly authorized draft.

The explicitly named operational runner `tmp/production-run-once.mjs` was located and read only to determine its output/executable argument order for the one authorized validation. It was not mathematical evidence or a second author artifact.

## Outcome First

Aggregate semantic outcome: **`revise`**.

The two failing checks are:

1. `q01.answer_leakage`: C uniquely combines the modal displayed value in each of the three components.
2. `q02.answer_leakage`: B uniquely combines the most frequent displayed distance and acceleration values.

These non-mathematical routes were identified before internal disclosure and independently confirmed to reach the true selections. Correct keys, derivations, declared limitations, and a mechanically valid JSON artifact do not erase them.

No mathematics defect or unresolved mathematical evidence blocker was found in the disclosed snapshot. No other independent failure is manufactured merely because complete-table recognition or relevant mathematical elimination is possible.

## Source Solution, Intent, Definitions, and Limitations

### q01 / Source 440

The author's source solution explicitly separates upward vertical component `u0` from possible total initial speed. Its equations

```text
u(t) = u0 - g*t,
h(t) = h0 + u0*t - g*t^2/2,
t_peak = u0/g,
rise = u0^2/(2g),
ground-relative peak = h0 + u0^2/(2g),
T = (u0 + sqrt(u0^2 + 2*g*h0))/g
```

agree with frozen Stage1. It distinguishes the launch root zero from the subsequent landing root when `h0=0`, and it does not infer a numerical `h0`.

The solution also states that an oblique interpretation with initial total speed lacks an angle/vertical component and that the full apex velocity would retain its horizontal component. The visible question instead explicitly names initial and apex vertical components.

The three disclosed limitations and three source coverage omissions account for:

- independent written integration/extremum/quadratic-root production;
- missing source launch height and the distinction between rise and absolute altitude;
- the unrecoverable complete-vector task under a possible oblique/total-speed reading.

Thus the Stage2 qualification reservation is resolved by actual internal statements, not guessed author intent. A coverage/fidelity pass is supported for the available explicitly qualified vertical tasks. The source's other possible interpretations are not falsely claimed to have a unique complete answer.

The task and unit rationale correctly identify three related trajectory quantities. The mathematical relation is substantive, but the claim that the complete tuple tests all those operations is undermined by the actual modal-component route. That remains the separate `answer_leakage = revise` finding.

Concept blocks `0,1,4,5` are authorized and relevant to initial coordinate, initial velocity, and integrating velocity/acceleration. Empty figure observations are appropriate.

### q02 / Source 441

The disclosed solution matches the independent sign check:

```text
v(t) = t*(9.8 - 0.003*t),
9.8 - 0.003*t >= 9.785 > 0 on [0,5].
```

Its integral `122.375 = 979/8`, derivative value `9.77 = 977/100`, and endpoint velocity `48.925 = 1957/40` agree exactly with Stage1/Stage2.

The intent preserves interval accumulation and endpoint rate, and the pair is a coherent response unit. The limitations/coverage explicitly acknowledge that recognition does not prove independently written sign reasoning, integration, and differentiation. No invented SI label or initial coordinate is used.

That honest production-loss declaration does not justify the different non-mathematical frequency route. The internal key is correct, but this visible construction still needs revision.

Concept blocks `0,4` are authorized and relevant. There are no figures.

### q03 / Source 442

The disclosed solution matches the full unrestricted-parameter analysis, not only a positive-parameter special case:

```text
D = 8R + 16a/3,
alpha(4) = R + a/4.

a(a+2R) >= 0:
    S = |D|.

a(a+2R) < 0:
    R != 0,
    t_star = a^2/R^2 in (0,4),
    J = -a^4/(6R^3),
    S = |J| + |D-J| = |D+a^4/(3R^3)|.
```

Both crossing directions and boundary/stationary cases are retained. The solution correctly notes that a nonfinite right derivative at zero for nonzero `a` does not remove an endpoint from the distance interval or obstruct acceleration at four.

The task and response-unit reasoning justify selecting general conditional assertions together. The written-production limitation is declared. The coverage entry explicitly retains every parameter-sign domain and both source tasks.

Concept blocks `0,4` are authorized and relevant. There are no figures.

### q04 / Source 443

The disclosed source solution uses signed horizontal coordinate velocity with arbitrary constant `v`, including negative or zero values:

```text
v_y = f'(x)*v,
alpha_y = f''(x)*v^2,
```

with the four correct expressions

```text
parabola: (2x-2)*v,             2*v^2,
cubic:    (3x^2-4x)*v,         (6x-4)*v^2.
```

These match the frozen functional-identity proof. No concrete `v` or initial coordinate is inferred. The author's illustrative numeric counterexamples for false tables are legitimate witnesses to failure of general identities, not substituted values of the stem's unknown parameter.

The task/unit rationale supports comparing common chain-rule structure and different second derivatives in one complete table. The limitation and source coverage omission expressly say that table recognition does not establish separately written double time derivatives for both curves.

Stage2 recorded the sharper fact that the parabola acceleration alone can identify the table. That is a concrete instance of the declared recognition/independent-production loss. Under the semantic-gate rule permitting reasonable mathematical elimination, it is not automatically an essential capacity failure and does not create a new revise check.

Both curves and all four expressions remain visible. Concept blocks `0,4` are authorized and relevant; there are no figures.

## Every Rationale and Misconception Compared

The true sets were already frozen before the key was disclosed. A false conditional/formula option is evaluated as a general statement, not required to fail at every special parameter value.

### q01: Four Rationales

| Option | Claimed procedure or correct reasoning | Independent comparison |
| --- | --- | --- |
| A | Choose nonpositive ground root and take its absolute value | Produces exactly `(sqrt(v0^2+19.6h0)-v0)/9.8`. It is shorter than the descending root by `2v0/9.8>0`. At `h0=0` it is launch, not landing; at `h0>0`, substitution gives positive height `2v0*T_A`. False time; other entries true. |
| B | Treat ascent as constant initial velocity over `t_peak` | Gives `v0*(v0/9.8)=v0^2/9.8`, exactly twice the correct rise. False height for every allowed positive `v0`; other entries true. |
| C | Integrate vertical motion and select descending root | All three formulas match the independent peak/rise/ground derivation. Correct rationale; misconception null. |
| D | Put return-to-launch-height velocity at the peak | At `2v0/9.8`, velocity is `-v0`, exactly the wrong entry. Peak at `v0/9.8` has zero vertical component. False velocity; other entries true. |

All three wrong procedures reproduce their actual alternatives and produce false complete tuples. Key `{C}` agrees with the frozen set.

### q02: Four Rationales

| Option | Claimed procedure or correct reasoning | Independent comparison |
| --- | --- | --- |
| A | Omit division by 3 in integrating the quadratic term | `4.9*25-0.003*125=122.125=977/8`, exactly the option and `1/4` below the true integral. Acceleration remains true. |
| B | Correct sign-conditioned integral and endpoint derivative | `S=979/8`, `alpha(5)=977/100`. Correct rationale; misconception null. |
| C | Use endpoint velocity as a constant full-interval velocity | `5*(1957/40)=1957/8=244.625`, exactly the option, versus true `979/8`. Acceleration remains true. |
| D | Evaluate velocity instead of differentiating it | `v(5)=1957/40=48.925`, exactly the wrong acceleration entry, versus true derivative `977/100`. Distance remains true. |

All three wrong procedures are exact, concrete, and false as displayed pairs. Key `{B}` agrees with the frozen set.

### q03: Six Rationales

| Option | Claimed procedure or correct reasoning | Independent comparison |
| --- | --- | --- |
| A | Differentiate square root and evaluate at four | Denominator `2sqrt(4)=4`; `R+a/4` is the universal identity. Correct rationale; misconception null. |
| B | Omit the exponent factor `1/2` | Gives `R+a/sqrt(4)=R+a/2`, exactly B. Difference from truth is `a/4`, not identically zero. Author witness `R=1,a=-1` gives `1/2` versus `3/4`; valid general-claim falsification. |
| C | Mistake no sign change for positive sign | Direct signed integral gives `D`. Allowed `R=0,a=-1` has distance `16/3` and displacement `-16/3`. Procedure yields the exact false conditional claim. |
| D | Take absolute total displacement on a monotone interval | `a(a+2R)>=0` prevents interior reversal. `S=|D|` covers negative, positive, zero, and boundary cases. Correct rationale; misconception null. |
| E | Sum both monotone legs across the interior root | `J=-a^4/(6R^3)`; `D-2J` or `2J-D` combines as `|D+a^4/(3R^3)|`. Both crossing directions proved. Correct rationale; misconception null. |
| F | Omit the first leg and keep only the second | Gives `|D-J|=|D+a^4/(6R^3)|`, exactly F. Strict crossing has `|J|>0`, so F is always too small by the first-leg length. Author witness gives `17/6` instead of `3`. |

All three false-option procedures reproduce the option and fail on the stated domain. Key `{A,D,E}` agrees with the frozen set. B's special equality at `a=0` cannot make its universal assertion true.

### q04: Four Table Rationales

| Option | Claimed procedure or correct reasoning | Independent comparison |
| --- | --- | --- |
| A | Differentiate with respect to `x` instead of time twice | Produces exactly both `f'` velocity cells and both `f''` acceleration cells. Missing factors `v` and `v^2` give nonzero error identities `f'(1-v)` and `f''(1-v^2)`. The author's numeric witness supplements this general proof. |
| B | Use chain rule once but omit its factor the second time | Both velocity cells are true; both accelerations become `f''v` instead of `f''v^2`. Error `f''v(1-v)` is not a zero identity. Exact false-table procedure. |
| C | Infer every acceleration is zero from `dv/dt=0` | Keeps true velocities but drops time variation of `f'(x(t))`, exactly yielding both zero cells. True accelerations are not zero identities. The author's numeric witness is valid but is not an assumed input. |
| D | Apply `dx/dt=v` in each time derivative | Produces all four correct cells for arbitrary signed constant `v`. Correct rationale; misconception null. |

All twelve table cells belonging to false alternatives were examined, including the velocity cells that remain correct in B/C. Key `{D}` agrees with the frozen functional-identity set. Occasional special-parameter coincidences do not turn a false general table into an additional correct answer.

### Comparison Counts

- Four source solutions compared: all agree with independent source reasoning and visible qualifications.
- Four intents/unit rationales and all declared limitations/coverage entries examined.
- Four author correct sets agree with the frozen independent sets.
- Eighteen rationales checked: six correct alternatives with null misconceptions and twelve incorrect alternatives with exact mistaken-procedure derivations.
- Every claimed false option is false as the actual whole tuple/table/general assertion; no falsehood was inferred only from its label.
- ZERO source figures, new figures, figure checks, or image payloads.

## Fidelity, Redundancy, Leakage, and Package Coverage

The final review has four source coverage passes and fourteen passing question-level checks. The only two revise checks are the already frozen answer-pattern findings.

For q01:

```text
H = v0^2/19.6:                         A,C,D
apex v_y = 0:                         A,B,C
plus-root ground T:                   B,C,D
unique tuple of all modal components: C
```

For q02:

```text
S = 122.375:                          B,D (each other distance appears once)
alpha(5) = 9.77:                      A,B,C
unique pair of modal/plurality values: B
```

These routes work in the exact reviewed snapshot without the required physics/calculus. The same visible construction across two questions adds a package-level pattern cue. This is not the same as eliminating a table using the correctly derived `2v^2`.

The internal mappings and omission records otherwise match the independently observed coverage. All eleven mathematical output categories remain represented, with q01's explicitly acknowledged component interpretation. No shared result is required as an input to another question. Common coefficients, differentiation concepts, and the two-curve chain rule are legitimate mathematical relationships, not independent leakage defects.

No blocked check is justified: the visible symbolic problems are determinate under their written conditions, the source ambiguity is openly qualified, and the evidence stages are all available. Declared capacity losses do not nullify the separate actual leakage.

## Final Review Artifact

Path:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/review.json`

| Binding/count | Value |
| --- | --- |
| Schema | `s10y-choice-review-v1` |
| Reviewer | independent SessionB, not the author of this draft |
| Review canonical SHA-256 | `b07fba1a91c8a6ffca233f3efff353d4c59f8dbf71c75c33ee22809f1701fb7e` |
| Review raw-byte SHA-256 | `cc16389c615e4a1f32435cdce99d8e5bc280fe5c751501995ee303a752073677` |
| Source reviews / coverage checks | 4 / all 4 pass |
| Question reviews | 4 |
| Question-level checks | 16: 14 pass, 2 revise, 0 blocked |
| Total verdict-bearing checks | 20: 18 pass, 2 revise, 0 blocked |
| Option checks | 18: 6 correct, 12 incorrect |
| Figures / new-figure reviews | 0 / 0 |
| Aggregate outcome | `revise` |

No undocumented schema fields, app fields, image entries, or claimed publisher payload were added.

## Sole Authorized With-Review Validation

Exactly one invocation was made, after independent comparison and creation of `review.json`:

```sh
node /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-run-once.mjs /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-review python3 /Users/yong/.codex/worktrees/a07e/lemmadeck/.agents/skills/ld-s10y-choice/scripts/validate.py --repo /Users/yong/.codex/worktrees/a07e/lemmadeck --seed /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/seed.json --draft /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/draft.json --review /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/review.json
```

Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

The runner recorded:

```text
started:  2026-11-17T03:30:03.303Z
finished: 2026-11-17T03:30:03.346Z
exitCode: 3
signal:   null
error:    null
stdout:   empty
stderr:   mechanical checks passed; semantic review outcome: revise
```

This establishes a mechanically/schema-valid artifact with a nonpassing semantic review. It does not establish approval, an independently executed mathematical proof, or a passing semantic gate.

| Exact execution record | Raw-byte SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-review/command.json` | `5ac1177ff8c96164af287ebb2ed19a44464aa3d56f53c3420aab267a9deb0f4c` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-review/stdout.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-review/stderr.txt` | `ff8f4fb4f881df39ed71f4794f8749f44bc8ba11fd062d75fce831136a7652d9` |

No no-review validation, repeated validation, successful semantic gate, test, prepare/refresh command, or browser was run.

## Preservation and Freeze

Post-validation byte hashes of both Stage1 records, both Stage2 records, the seed, and the draft matched their preexisting bindings. No source/candidate/edition/application file was edited. No Git, DB, publisher, browser, workflow transition, or image operation occurred. Peer artifacts outside these new Stage3 outputs were left untouched.

This comparison, the new Stage3 ledger, `review.json`, and the one-run execution records are frozen at their returned hashes. No prior record is rewritten to agree with the author. No candidate repair is performed.

Next action: **WAIT before any repair**. Any repair or revalidation needs new explicit authorization and a new snapshot/evidence record; do not overwrite this rejected review or its frozen reasoning.
