# STEMROBIN-184 / SessionB / 10c n103 / Stage2 View-Only

Status: FROZEN independent view-only evidence before Stage3 internal disclosure.
Date: 2026-11-17 (Europe/Dublin).
This is not a final contract review, approval, or author-key comparison.

## Snapshot and Exposure Boundary

- Sole newly authorized input: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/view-only.json`.
- View-only canonical SHA-256, independently computed: `70c9db907d932eab9c3155dd33b2227893580f549822322b4fdaf4d17f915d9d`.
- View-only raw-byte SHA-256, independently computed: `28863c65f5e2e3d83d496e61ca33f3cb2e36623d8f67daa8a2b1b7dd2e08f77b`.
- Both computed digests match the user's supplied bindings.
- Existing seed canonical SHA-256: `02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf`.
- Previously frozen source-first byte SHA-256: `ac24683f10dfb608428a46fcdc15c56d5b76951c882d316efba0c3c4a269348f`.
- Previously frozen Stage1 ledger byte SHA-256: `b2f723f3ddd8bf8d6d101ce20c58486b234e8cc2ff890dabc09d9af5a7e3f730`.
- The user reported consuming both complete Stage1 records before this disclosure. No parent's private reasoning or other interaction was read to verify that report.
- The input contains four views in array order, without question IDs, author intent, source mapping, or keys. This record uses ordinal 1-4, not invented author question IDs.
- All four view `figure_ids` lists and all eighteen option `figure_ids` lists are empty. ZERO images were opened, rendered, generated, or transmitted.
- No draft, author source-solutions, intent, limitations, coverage artifact, key, rationale, standard answer, previous choice, or other ticket artifact was read.
- No validation, prepare/refresh rerun, test, browser, database, publisher, application/source/edition edit, or Git operation was performed.

Comparison with source numbers below is an independent correspondence derived from the displayed mathematics and the already authorized seed. It is not a read of hidden source-mapping or author-coverage metadata.

## Part I: Fidelity, Redundancy, Leakage, and Relationships

This section records the source-task and option-structure checks separately from the independent option mathematics in Part II. No author's correct set was available for either section.

### Ordinal 1: Projectile Triple

The visible stem explicitly says:

- initial **vertical** velocity `v0 > 0`;
- launch height `h0 >= 0`, unspecified;
- maximum rise `H` measured from the launch point;
- velocity component at the apex denoted `v_y`;
- elapsed launch-to-ground time `T`;
- approximate numerical gravity model `g = 9.8`.

Fidelity observation: these written qualifications address the Stage1 height and direction ambiguities openly. In particular, `v0` is a vertical component, not an assumed total speed; the stem does not assert that the horizontal component vanishes. It also does not replace unknown `h0` with zero. Its three-formula response preserves rise, apex vertical velocity, and ground-landing time as distinct quantities.

Scope qualification: source 440 says "最高位置时的速度" without explicitly naming a component. This view assesses apex vertical velocity only. It does not assess the stone's total velocity or speed for a possible nonvertical throw. This is an actual visible qualification, not evidence that a hidden author has declared the corresponding limitation. Whether the internal limitation/coverage record honestly accounts for this scope remains UNKNOWN until Stage3.

The rise reference and `h0 >= 0` domain are expressly supplied, not guessed. The value `9.8` is the declared approximate model; exact algebra below is within that model.

Provisional fidelity assessment: supported as an explicitly qualified vertical-component adaptation; retain the unqualified-source velocity scope reservation. There is no visible silent ground-launch assumption.

Redundancy: the response contains three related source tasks, not three identical tasks. No second question duplicates the full projectile triple. Repeated correct-looking components within the four alternatives are, however, relevant to leakage.

Answer-pattern finding, recorded before key comparison:

| Component | Unique most frequent displayed value | Occurrences |
| --- | --- | --- |
| `H` | `v0^2/19.6` | A, C, D: three |
| `v_y` | `0` | A, B, C: three |
| `T` | `(v0 + sqrt(v0^2 + 19.6h0))/9.8` | B, C, D: three |

Selecting the alternative that combines the most frequent value of every component identifies C, without solving a peak equation, integrating motion, or finding a ground intersection. This is an option-frequency cue, not mathematically justified elimination and not an explicit leaked key. Its success in this exact snapshot is corroborated independently in Part II.

Provisional leakage disposition: `revise` finding for a non-mathematical component-frequency route. This is a specific observed pattern, not a claim that repeated components always invalidate a choice question.

### Ordinal 2: Distance and Endpoint Acceleration

The stem retains `v(t) = 9.8t - 0.003t^2`, the full interval `0 <= t <= 5`, distance `S`, and endpoint acceleration `alpha(5)`. "按给定量的相容单位" avoids inventing SI labels absent from the seed.

Fidelity observation: both source 441 tasks are explicitly present. Distance is not renamed displacement, and endpoint five is not replaced by a stopping time. A pair is a coherent response unit for integration and endpoint differentiation.

Redundancy: neither quantity is a duplicate of the other. The view is not a repetition of ordinal 1; the acceleration law is not constant gravity despite the shared number `9.8`.

Answer-pattern finding:

| Component | Unique most frequent displayed value | Occurrences |
| --- | --- | --- |
| `S` | `122.375` | B, D: two; each competing value occurs once |
| `alpha(5)` | `9.77` | A, B, C: three |

The unique alternative containing both modal/plurality values is B. A learner can identify that candidate by counting displayed values without integrating or differentiating. The distance value is a unique plurality rather than a strict majority; that distinction does not remove the visible route.

Provisional fidelity: supported. Provisional leakage disposition: `revise` finding for the component-frequency route, to be kept separate from the mathematical result.

### Ordinal 3: Conditional Identities for Unrestricted Real Parameters

The stem expressly supplies real constant `R,a`, unrestricted signs, distance on `[0,4]`, acceleration at four, and the quantifier that each conclusion must hold under its own stated conditions.

Fidelity observation: this preserves both tasks in source 442 while making the signed-parameter issue explicit. The options distinguish no interior sign change, `a(a+2R) >= 0`, from an interior reversal, `a(a+2R) < 0`. Those complementary conditions cover all real constant pairs, including the zero/boundary cases. This is not a silent assumption that both coefficients are nonnegative.

The pair of distance-case identities can cover the full symbolic distance problem in a multiple-response unit. The universal acceleration statement supplies the other source task. Recognizing correct complete identities does not demonstrate independent written production, but this limitation is not by itself a fidelity failure under the skill's review rule.

Redundancy: A/B compare acceleration formulas; C/D compare signed displacement with distance under no reversal; E/F compare accumulation across a reversal. These are related contrasts, not interchangeable statements or duplicate source tasks. The two distance domains are different and both are needed.

Leakage: there is no explicit option key or copied answer from another view. The absolute-value and denominator contrasts require mathematical sign/accumulation judgment. Knowing "distance is nonnegative" can reject some formulas, but that is legitimate mathematical elimination, not a wording-only key. No ordinal-1/2-style unique modal-component combination is exposed here.

Provisional fidelity, redundancy, and leakage checks: supported by the visible contrasts; no definite view-only defect established here.

### Ordinal 4: Two-Curve Identity Table

The stem gives the two original curves, explicitly states `dx/dt = v` with constant `v`, asks for vertical projection velocity and acceleration, and requests expressions in `x`.

Fidelity observation: both parts of source 443 and all four requested expressions appear in each complete table. The displayed premise identifies horizontal coordinate velocity, not total path speed. It does not state `v = 1`, `v > 0`, or any concrete numerical value. Candidate tables must therefore be checked as identities in `x` and the symbolic constant parameter `v`.

Part a already requests `x` expressions. Expressing part b in `x` is also supported by its graph law; no initial coordinate or time is invented. Reusing the general chain rule across both curves is the source's mathematical relationship.

Redundancy: the curve derivatives differ. The two rows are not identical source tasks, though they share the same time-chain-rule mechanism.

Local-elimination limitation: the four parabola acceleration entries alone are `2`, `2v`, `0`, and `2v^2`. A learner who knows that one requested expression can identify a unique table without checking the cubic row or either velocity column. This limits what the selected table proves about completion of all four written outputs.

This is not automatically a fidelity or leakage failure: reasonable mathematical elimination and complete-table recognition are expressly permitted by the skill. Unlike the modal-value route in ordinals 1 and 2, this shortcut requires a relevant mathematical derivative relationship. The recognition/partial-elimination production loss should still be acknowledged in Stage3 rather than claimed away.

Leakage: no explicit correct-set cue, numeric `v` convention, or answer imported from another question was found. The distinct acceleration powers are mathematically meaningful, not a free author-key disclosure.

Provisional fidelity: supported as a complete symbolic-table recognition unit. Retain the one-row elimination limitation for internal comparison.

### Cross-Question and Whole-Package Observations

- Four views independently correspond to the four seed prose topics: projectile, polynomial velocity, square-root velocity, and two graph projections. No hidden author IDs or mapping were available.
- Ordinal 1 carries three visibly qualified projectile outputs; ordinal 2 carries two interval-motion outputs; ordinal 3 carries distance in both sign domains and endpoint acceleration; ordinal 4 carries four curve-projection outputs. All eleven Stage1 task categories are visibly represented, with the ordinal-1 component qualification noted above.
- The exact number `9.8` occurs in ordinals 1 and 2, but ordinal 1 uses a constant gravity magnitude and ordinal 2 has a time-varying velocity law. Neither view states the other's result.
- Differentiating velocity is common to ordinals 2 and 3; the chain rule is common within ordinal 4. Shared concepts are not answer leakage or a duplicated task.
- Ordinal 1's zero apex vertical velocity does not imply zero acceleration in ordinal 4. Treating it that way would be an invalid transfer, not a disclosed answer.
- The coefficient `a` in ordinal 3 and constant horizontal velocity `v` in ordinal 4 are locally defined. No cross-question substitution of numeric parameters is authorized.
- No visible answer to one view is a necessary input to another. Their mathematical solving dependencies are independent given the supplied definitions.
- The repeated modal-component construction in ordinals 1 and 2 creates a package-level answer-pattern risk. It lets a non-mathematical selection heuristic target two distinct candidates without performing their source tasks.
- Ordinal 4 permits partial mathematical elimination. That is a documented production limitation, not an automatic reason to reject a correct complete table.
- Internal author mappings, omission declarations, limitations, and claimed intent remain UNKNOWN. This section does not assign a final package-coverage verdict.

## Part II: Independent Mathematics and Every Visible Option

Truth below means that the whole alternative answers the actual stem. A tuple/table with any false required entry is false. A conditional conclusion is true only if it holds for every parameter pair satisfying its own conditions, not merely for a chosen convenient example.

### Ordinal 1: Fresh Derivation

Let `g_model = 49/5 > 0`, upward vertical coordinate positive, `h(0) = h0 >= 0`, and initial vertical velocity `v0 > 0`. The actual view supplies this vertical-component datum; no zero horizontal component is needed.

```text
v_y(t) = v0 - g_model t,
h(t) = h0 + v0 t - (g_model/2)t^2.
```

At the vertical-height maximum,

```text
t_peak = v0/g_model,
H = h(t_peak) - h0 = v0^2/(2g_model) = v0^2/19.6,
v_y(t_peak) = 0.
```

The negative second derivative confirms a maximum. Ground landing solves

```text
(g_model/2)T^2 - v0 T - h0 = 0,
T = (v0 + sqrt(v0^2 + 2g_model h0))/g_model
  = (v0 + sqrt(v0^2 + 19.6h0))/9.8.
```

The plus root is the descending landing time. With `h0 = 0`, the zero root is launch, while the positive landing time is `2v0/g_model`. With `h0 > 0`, the other root is negative. Height `h0` remains a parameter, not a secretly assigned number.

#### All Four Options

| Option | `H` entry | Apex `v_y` entry | `T` entry | Whole-option truth |
| --- | --- | --- | --- | --- |
| A | Correct | Correct | Incorrect | FALSE |
| B | Incorrect | Correct | Correct | FALSE |
| C | Correct | Correct | Correct | TRUE |
| D | Correct | Incorrect | Correct | FALSE |

Concrete evidence:

- **A:** write `w = sqrt(v0^2 + 2g_model h0)`. Its time is `T_A = (w - v0)/g_model`, whereas the required descending time is `(w + v0)/g_model`. Their difference is `2v0/g_model > 0`. If `h0 = 0`, `T_A = 0` is launch, not the requested positive landing time. If `h0 > 0`, substitution gives `h(T_A) = 2v0 T_A > 0`, so the stone has not reached ground. The other two entries are correct.
- **B:** proposed rise `v0^2/9.8 = v0^2/g_model` is exactly twice `v0^2/(2g_model)`. Since `v0 > 0`, it cannot agree with the true rise. Its apex component and plus-root time are correct.
- **C:** all three entries equal the independently derived expressions, with the actual stated reference, vertical-component interpretation, and unknown-height parameter.
- **D:** the peak satisfies `v_y = 0`, not `-v0`, and `v0 > 0` excludes equality. The value `-v0` occurs at return to launch height, not at the apex. Its height and landing-time entries are correct.

Complete independent true set: `{C}`. Exactly one whole tuple is true, consistent with visible `single` mode.

The total stone speed at the apex is not inferred: the view asks only for `v_y`.

### Ordinal 2: Fresh Derivation

Use exact rational coefficients of the written velocity law:

```text
v(t) = (49/5)t - (3/1000)t^2
     = t(9800 - 3t)/1000.
```

On `[0,5]`, the second factor is at least `9785 > 0`, so the velocity is nonnegative and has no interior reversal.

```text
S = integral[0,5] |v(t)| dt
  = [(49/10)t^2 - (1/1000)t^3] from 0 to 5
  = 245/2 - 1/8
  = 979/8
  = 122.375.

alpha(t) = 49/5 - (3/500)t,
alpha(5) = 49/5 - 3/100 = 977/100 = 9.77.

v(5) = 49 - 3/40 = 1957/40 = 48.925.
```

The last expression is endpoint velocity, not endpoint acceleration.

#### All Four Options

| Option | Distance entry | Acceleration entry | Whole-option truth |
| --- | --- | --- | --- |
| A | `122.125 = 977/8`, false | `9.77 = 977/100`, true | FALSE |
| B | `122.375 = 979/8`, true | `9.77 = 977/100`, true | TRUE |
| C | `244.625 = 1957/8`, false | `9.77 = 977/100`, true | FALSE |
| D | `122.375 = 979/8`, true | `48.925 = 1957/40`, false | FALSE |

Concrete evidence:

- **A:** the proposed distance is `1/4` below the exact integral `979/8`; the acceleration is correct.
- **B:** both entries equal the independent integral and derivative.
- **C:** its distance equals `5v(5) = 1957/8`, not the integral of the time-varying velocity. It exceeds the true distance by `(1957 - 979)/8 = 489/4`. Its acceleration is correct.
- **D:** the displayed second quantity is `v(5)`, not `v'(5)`. Their exact numerical difference is `1957/40 - 977/100 = 7831/200`, which is nonzero; they also have different dimensions. The distance is correct.

Complete independent true set: `{B}`. Exactly one whole pair is true, consistent with visible `single` mode.

No hidden unit convention is needed; the stem explicitly requests compatible units.

### Ordinal 3: General Derivation

The actual stem quantifies real constant `R,a` with signs unrestricted. The real time domain is `t >= 0`. Let

```text
F(t) = (R/2)t^2 + (2a/3)t^(3/2),
D = F(4) = 8R + 16a/3.
```

For `t > 0`,

```text
alpha(t) = R + a/(2sqrt(t)),
alpha(4) = R + a/4.
```

Possible lack of a finite derivative at zero when `a != 0` does not affect this endpoint-four task or the distance integral.

For positive time, `v(t) = sqrt(t)(R sqrt(t) + a)`. The linear factor over `sqrt(t) in [0,2]` has endpoint values `a` and `a + 2R`.

#### No Interior Sign Change

When `a(a + 2R) >= 0`, there is no interior reversal. Therefore

```text
S = |D|.
```

This includes `R = 0`, `a = 0`, endpoint-zero cases, and `R = a = 0`. It does not force velocity to be nonnegative; it can be negative throughout the positive-time interval.

#### Interior Sign Change

When `a(a + 2R) < 0`, necessarily `R != 0`, and

```text
t_star = a^2/R^2,          0 < t_star < 4,
sqrt(t_star) = -a/R,
F_star = F(t_star) = -a^4/(6R^3),
S = |F_star| + |D - F_star|.
```

If `R > 0`, the motion is initially negative and then positive:

```text
S = D - 2F_star = D + a^4/(3R^3) > 0.
```

If `R < 0`, the motion is initially positive and then negative:

```text
S = 2F_star - D = -D - a^4/(3R^3) > 0.
```

Consequently, for both directions of reversal,

```text
S = |D + a^4/(3R^3)|.
```

This proves the absolute-value formula as a general identity under the strict-crossing condition; no presumed sign of `R` is used.

#### All Six Options

**A: TRUE.**

It states universally `alpha(4) = R + a/4`. This is exactly the derivative evaluated at `sqrt(4) = 2`, with denominator `2sqrt(4) = 4`. It holds for every real constant pair.

**B: FALSE as a universal identity.**

Its value `R + a/2` differs from the derivative by `a/4`. That difference is not the zero expression in the unrestricted parameter `a`. For an explicit allowed counterexample, `R = 0, a = 4` gives true endpoint acceleration `1`, while B gives `2`. Agreement when `a = 0` cannot establish a universal conclusion.

**C: FALSE under its own stated domain.**

The condition `a(a+2R) >= 0` guarantees no reversal, not nonnegative velocity. With the allowed pair `R = 0, a = -1`, the condition holds since the product is `1`. Here `v(t) = -sqrt(t)`, `D = -16/3`, and `S = 16/3`. C incorrectly reports the negative displacement as distance. It is correct on a smaller nonnegative-velocity subdomain, but not throughout the displayed domain.

**D: TRUE under its own stated domain.**

The absence of an interior reversal yields `S = |D| = |8R + 16a/3|`, regardless of which sign is maintained. Boundary zeros and the stationary case are included. No division by `R` occurs here.

**E: TRUE under its own stated domain.**

The strict condition makes `R` nonzero and creates the one interior root. From the two crossing-direction derivations above, `D + a^4/(3R^3)` is either `S` or `-S`, so its absolute value is exactly `S`.

For direct exact arithmetic corroboration, `R = 1, a = -1` gives `D = 8/3`, `F_star = -1/6`, and `S = 3`, as does E. The mirror pair `R = -1, a = 1` gives E's inner expression `-3` and distance `3`. These witnesses supplement, rather than replace, the general proof.

**F: FALSE under its own stated domain.**

Its expression is

```text
|D + a^4/(6R^3)| = |D - F_star|.
```

This is only the distance from the reversal point to the end. The full distance is

```text
S = |F_star| + |D - F_star|.
```

Under strict crossing, both `a` and `R` are nonzero, so `|F_star| > 0`. F is therefore strictly too small for every pair in its displayed strict-crossing domain, not merely one counterexample.

For `R = 1, a = -1`, F gives `|8/3 + 1/6| = 17/6`, whereas the complete distance is `3 = 18/6`.

Complete independent true set: `{A, D, E}`. This matches visible `multiple` mode in cardinality only; no author's key has been seen.

### Ordinal 4: Functional-Identity Derivation

The actual premise is `dx/dt = v` with constant symbolic `v`. It is not a numerical-speed instance.

For either curve `y = f(x(t))`,

```text
v_y = f'(x)v,
alpha_y = d/dt[f'(x)v] = f''(x)v^2,
```

because `dv/dt = 0`.

The correct complete table is

| Curve | `v_y` | `alpha_y` |
| --- | --- | --- |
| `y = x^2 - 2x + 3` | `(2x - 2)v` | `2v^2` |
| `y = x^3 - 2x^2` | `(3x^2 - 4x)v` | `(6x - 4)v^2` |

All entries are identities in `x` and the unspecified real constant `v`. No numerical `v` is invented to choose between tables.

#### All Four Tables, Including Every Cell

**A: FALSE as a general table.**

- Parabola velocity `2x - 2` omits the factor `v`.
- Parabola acceleration `2` omits the factor `v^2`.
- Cubic velocity `3x^2 - 4x` omits the factor `v`.
- Cubic acceleration `6x - 4` omits the factor `v^2`.

In general notation, proposed-minus-true velocity is `f'(x)(1-v)` and proposed-minus-true acceleration is `f''(x)(1-v^2)`. These are not zero identities in `x,v`; in particular the parabola has nonzero constant second derivative. Possible agreement at special parameter values or individual points does not make A a general solution.

**B: FALSE as a general table.**

- Both velocity entries are correct: `(2x-2)v` and `(3x^2-4x)v`.
- Parabola acceleration `2v` is not the general identity `2v^2`.
- Cubic acceleration `(6x-4)v` is not the general identity `(6x-4)v^2`.

The proposed-minus-true acceleration is `f''(x)v(1-v)`, not identically zero. The omitted second time-chain-rule factor invalidates both acceleration formulas as general functions. No assumed numeric `v` repairs that.

**C: FALSE as a general table.**

- Both velocity entries are correct.
- Parabola acceleration zero is not the identity `2v^2`.
- Cubic acceleration zero is not the identity `(6x-4)v^2`.

Constant horizontal velocity implies zero horizontal acceleration, not zero vertical acceleration along a curved graph. Accidental zeros at a special point or stationary motion are not the requested general expressions.

**D: TRUE as a general table.**

- Parabola velocity equals `f'(x)v = (2x-2)v`.
- Parabola acceleration equals `f''(x)v^2 = 2v^2`.
- Cubic velocity equals `f'(x)v = (3x^2-4x)v`.
- Cubic acceleration equals `f''(x)v^2 = (6x-4)v^2`.

Each cell is derived by time differentiation with the displayed constant horizontal-velocity premise. The acceleration's sign is not artificially forced positive for the cubic; it follows the factor `6x-4`. The formulas also cover stationary or negative horizontal coordinate velocity without changing the identity.

Complete independent true set: `{D}`. Exactly one table supplies general identities for all four cells, consistent with visible `single` mode.

Special-parameter coincidences do not create additional true general tables. They are not treated as a concrete value of the unspecified `v`.

## Frozen Independent Results

| Visible ordinal | Mode | Options independently checked | Complete true set |
| --- | --- | --- | --- |
| 1 | `single` | A, B, C, D | `{C}` |
| 2 | `single` | A, B, C, D | `{B}` |
| 3 | `multiple` | A, B, C, D, E, F | `{A, D, E}` |
| 4 | `single` | A, B, C, D | `{D}` |

Eighteen options were checked. Six options are true and twelve are false under their actual stems. Every tuple/table component was checked; conditional identities were checked over their full stated domains.

## Post-Mathematics Corroboration and Reservations

- The modal/plurality candidates found structurally in Part I, C for ordinal 1 and B for ordinal 2, are exactly the independently derived true alternatives. Thus the identified non-mathematical pattern route actually reaches the correct selections in this snapshot. This is a view-only leakage finding, not information obtained from a key.
- The view's mathematical answers themselves are determinate. Unknown `h0` in ordinal 1 is retained symbolically. Unrestricted signs in ordinal 3 are handled by complete conditions. Unspecified constant `v` in ordinal 4 is handled as a parameter in identities.
- No internal draft is available, so agreement with the author's key, source solution, derivation, or claimed misconception remains UNKNOWN.
- Whether the author declared ordinal 1's vertical-component qualification and ordinal 4's recognition/partial-elimination limitation remains UNKNOWN.
- No final review outcome is assigned. Mathematical truth does not erase the separate answer-pattern finding.

## Freeze and Next Gate

This Stage2 record is frozen at its returned byte SHA-256. Stage1 records remain unchanged. Any later comparison, disagreement, or repair belongs in a new Stage3 record or an explicitly authorized new snapshot; do not retroactively edit these pre-internal records.

Next action: WAIT for explicit internal disclosure. No draft discovery, coverage read, key read, validation, final-review creation, browser, or image operation is authorized by this Stage2 handoff.
