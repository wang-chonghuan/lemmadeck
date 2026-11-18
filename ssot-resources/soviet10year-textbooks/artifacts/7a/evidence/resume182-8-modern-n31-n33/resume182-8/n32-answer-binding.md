# n32 Independent Standard-Answer Binding

## Scope and Frozen Inputs

Worktree: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

This is the late standard-answer comparison in the same ordered semantic gate. Every complete written source solution was established in `n32-independent-source.md` before any candidate view or author key. After that, all 36 visible options and eight complete true sets were recorded in `n32-choice/review.md` before author internals or these standard answers were opened. No source task was solved again for this binding.

| Input | SHA-256 of actual bytes |
| --- | --- |
| `n32-independent-source.md` | `2e33d3fa4656c262ebc206c79040ead12738dbe5dc573e8e66d19234c01e0927` |
| `n32-choice/seed.json` | `74b07f0760726ab6b1152dd97494ca88a38a0ab2ae12c72ecc71d55793d140b2` |
| `n32-choice/draft.json` | `8cd7f6d0eaff0c2ff9891d893cffe1079bbb6d92b7009f718abe9f3e936e6ab0` |
| `n32-author.json`, read only for late comparison | `f4e4165ecc8c24225f1a6f8013304305d4a0aa574b70a3278c429cb09f6d6c8d` |
| Current `answer-keys.json` | `a8fcb0b324fd9ca8f3274b97acce1f512c603d0ae26e609a198b299622711baf` |
| Current `answer-keys.audit.json` | `d065a8190c585226f6cabb853b05a5ed52d4e965be62e067b17b2bcfb0e2c7a4` |

The two current answer files are under:

`/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n32/`.

The audit records status `pass`, answerCount 8, auto 4 and ungraded 4. Those are mechanical inventory facts, NOT independent semantic approval. The following eight comparisons provide the mathematical binding.

## Complete Source-to-Answer Binding

### 737: Pass

The standard answer displays every established relation in source order: `<, <, >, <, =, <`. Its square comparisons are `7<9`, `49<50`, `5>4.84`, `10.89<11`, `6.25=2.5^2`, and `4.21<4.41`. It explicitly retains the principal-root nonnegative condition for equality and the nonnegative domain for square-order comparison.

This matches the baseline's complete six-part solution and `n32-comparison-certificates` true set `{a,b,c,d,e,f}`. The answer is ungraded with no judging parts; that does not omit the displayed comparisons or claim automatic grading of reasoning.

### 738: Pass

Both standard proofs match the established chains `9<12<16` and `50.41<51<51.84`, with positivity and the inference from square order to original-number order. The display explicitly says repeating the desired conclusions is not a proof.

The binding therefore covers proof reasoning, not merely the numeric bounds, and agrees with `n32-proof-reasoning` true set `{a,b}`. Ungraded proof production is honest; the choice's recognition loss does not weaken this standard answer's complete displayed proof.

### 739: Pass, With Source Nonuniqueness Preserved

All six standard brackets match the baseline: `(5,6),(3,4),(0,1),(5,6),(10,11),(12,13)`. The displayed midpoints `5.5,3.5,0.5,5.5,10.5,12.5` are exactly the baseline's valid witnesses. The proof `n<x<n+1 => |x-(n+0.5)|<0.5` certifies every midpoint; the positivity note for sqrt(0.4) correctly establishes the strict zero lower bound.

The answer describes these as **one** set of approximations, explicitly denies uniqueness and nearest-half-unit necessity, and accepts alternate values `5,3,0.5,6,11,12`. Their displayed squared error neighborhoods are consistent with the established tolerance; none is rejected for differing from a midpoint. Error is dimensionless absolute error, not a rounding grid.

This is deliberately broader than the choice: `n32-integer-bounds-and-approximations` has true set `{b}` only because its visible stem explicitly prescribes integer-interval midpoints. Choice option c remains valid under the written source's error condition. The ungraded standard answer avoids a false unique key or rejection of other valid source approximations.

### 740: Pass

The display and all eight numeric parts match the complete baseline, in labeled lower/upper order:

`1.7,1.8; -1.8,-1.7; 4.2,4.3; -4.3,-4.2`.

Each part has zero numeric tolerance, which is appropriate for the exact requested endpoint. The display includes `2.89<3<3.24`, `17.64<18<18.49`, reversal under multiplication by -1, and interval width 0.1. Neither negative pair is reversed or shifted toward zero. This agrees with `n32-signed-tenth-bounds` true set `{c}`.

### 741: Pass

The displayed better approximations are 2 and 2.2. Its graphical explanation reuses the actual three aligned number lines and the established `2.23<sqrt(5)<2.24` bracket, placing the root left of 2.5 and 2.25. Both explicit distance inequalities match the baseline:

`sqrt(5)-2 < 3-sqrt(5)` and `sqrt(5)-2.2 < 2.3-sqrt(5)`.

Square cross-checks `2.5^2=6.25>5` and `2.25^2=5.0625>5` agree. It correctly rejects choosing solely by under/overestimate names. This binds both selections and the requested graphical reasoning to `n32-figure-distance-judgment` true set `{a}`.

The answer is ungraded because the requested explanation is qualitative. This reviewer reused the two phase-1 image observations and existing preview-to-SVG hash chain; no additional images, source-figure approval, or whole-figure certification was performed.

### 742: Pass

The display and three exact numeric parts are lower 1.4, upper 1.5, and closer endpoint 1.4. The answer includes both `1.96<2<2.25` for bounding and `1.45^2=2.1025>2` for closeness. It explicitly notes that bracketing alone does not identify the nearer endpoint.

This matches the baseline's full two-task solution and `n32-tenth-bound-and-closeness` true set `{d}`. Zero tolerance is appropriate for the requested fixed one-decimal values; no false tie is introduced.

### 743: Pass

Both larger-expression keys match the baseline: `\sqrt{10}+\sqrt{19}` and `\sqrt{20}+\sqrt{7}`. The display retains expansions `29+2sqrt(190)>29` and `27+2sqrt(140)>27`, positivity of the compared numbers, and the warning against deleting mixed terms or distributing a square root over addition.

The two expression parts judge the requested larger expressions, not proof composition, and agree with `n32-radical-sum-relation` true set `{a,c}`. This review checks mathematical meanings only; it does not run an input, expression-judging, app, or keyboard workflow.

### 744: Pass

Both numeric keys and the displayed function match the unique established solution: `k=1/3`, `l=-2`, `y=x/3-2`. The derivation retains both point equations, subtraction giving `18k=6`, intercept substitution, and checks at A and B.

The key labels are k and l in the correct order, with zero tolerance for the exact coefficients. This agrees with `n32-linear-coefficient-pair` true set `{b}`. Numeric syntax is not exercised through an input/runtime interaction in this review.

## Aggregate Binding

**Independent standard-answer semantic binding: PASS, 8 of 8.**

No numerical, interval-order, proof-reasoning, approximation-precision, nonuniqueness, figure-distance, radical-expansion, coefficient, missing-subtask, or standard-answer/choice mismatch was found. All answers are labeled derived; no historical book answer was used as mathematical authority.

The choice package explicitly records recognition/production losses for all eight sources, including proof composition in 738 and the visible midpoint narrowing in 739. Its narrower answer set is not substituted for the unrestricted standard answer.

This binding and the choice semantic review are one ordered gate, not a new scientific recertification. The independent source baseline and frozen draft/keys are not edited. Actual reviewer image count remains exactly 2, with zero added images in phase 2.
