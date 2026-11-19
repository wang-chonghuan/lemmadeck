# N38/N39 Affected Table Method And Key Review

Ticket: STEMROBIN-182. Date: 2026-11-19.
Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Observed HEAD: `e16207d939526da0ebb2cfc528f084f0c3791afb`.

## Decision

**PASS_AFFECTED_TABLE_METHOD_AND_KEYS. No actionable candidate defects found.**

All **18 n38 + 57 n39 affected outputs** agree with independently derived
normalized addresses, frozen printed cells, correction units, finite decimal
arithmetic, scaling and selected final precision. All 75 actual answer-key display
outputs were separately extracted in prompt order and compared, including
significant trailing zeros. The successful comparison has 873 checks and no
failures, covering 70 used lookup references and 82 component lookup calls.

This is the requested affected-only content/method review, not finalization,
promotion, runtime-grading approval, a whole-table source review, or a pipeline
state change. The author FIRST files remain frozen draft/derived/ungraded with
`parts=[]`; their historical pending/hold fields were not edited.
No new source or historical-same-edition approval prerequisite is introduced.

## Findings

No incorrect normalized address, correction scale, finite operation, final
display result, false route-equivalence claim, or unsupported error guarantee was
found in the affected candidates.

The existing `affected-binding-review.json` is **PASS_AFFECTED_BINDINGS** and its
corrected-transcript, rule and frozen-capture hash bindings match current bytes.
The three corrected cells reach the current keys correctly:

| Cell | Frozen source address | Current downstream output | Verdict |
| --- | --- | --- | --- |
| CELL-1 | III, PDF33/printed32, row `4,3`, correction5 = `5` | `799.c2`: `18.66+0.05=18.71` | PASS |
| CELL-2 | IV, PDF39/printed38, row `60,`, correction7 = `4` | `806.c3`: `7.765+0.004=7.769` | PASS |
| CELL-3 | IV, PDF37/printed36, row `6,5`, main2 = `2,553` | `809.a1/a2`: `2.553/25.53` | PASS |

This reuses the existing source-cell adjudication; it does not reread pixels or
re-review the 136 unaffected distinct cells/139 matching occurrences as a source
gate. The current answer-method computations still bind each address they use.

## Affected Outputs

| Exercise/scope | Count | Independently derived displayed results, in prompt order | Verdict |
| --- | ---: | --- | --- |
| 799.c | 6 | `1.545,18.71,52.40,66.04,43.17,81.79` | PASS |
| 800.a | 4 | `27.49,2749,2.749*10^7,0.2749` | PASS |
| 800.b | 4 | `1.729,0.01729,1.729*10^4,1.729*10^8` | PASS |
| 801.e-h | 4 | `0.3471,548.1,0.004609,9.754*10^11` | PASS |
| 806.a | 6 | `2.074,2.490,2.983,3.162,7.071,8.660` | PASS |
| 806.b | 5 | `1.118,3.834,4.561,6.332,9.121` | PASS |
| 806.c | 4 | `1.069,2.199,7.769,9.051` | PASS |
| 806.d | 3 | `1.003,2.614,4.490` under explicit four-figure input convention | PASS |
| 807.a-l | 12 | `2.258,2.449,6.928,1.439,5.612,7.403,2.675,5.296,8.147,6.100,7.314,9.341` | PASS |
| 809.a | 4 | `2.553,25.53,80.75,0.8075` | PASS |
| 809.b | 4 | `1.810,57.25,0.1810,572.5` | PASS |
| 810.a-h | 8 | `18.57,17.03,35.79,60.99,160.4,0.5925,0.2691,0.06519` | PASS |
| 811.a-b | 2 | `25.55,196.3` | PASS |
| 813.a-b | 2 | `5.92,3.74` | PASS |
| 814 table outputs | 3 | `4.243,1.414,6.000` | PASS |
| 815.a-b | 2 | `2.50,8.4` | PASS |
| 816.a-b | 2 | `41.5,38.0` | PASS |

The `*` notation above is report shorthand only. Candidate scientific notation
is valid literal LaTeX; no expected-value or interaction objects were authored.

## Method Decisions

**Lower-main plus correction: PASS.** The current modern n38 lesson
`prose[12:14]` uses lower-main addition and explicitly preprocesses `8.4372`
to `8.437`. Current n39 `prose[8:10]`, `prose[21]` and `prose[27]` provide
addition and even-exponent scaling. The candidate chooses this lesson route
explicitly. It does not recast dedicated III `III-high-fourth-digit` as an
unconditional-add instruction or apply its threshold to IV.

The alternatives stated in `method-route.md` are distinct, not guaranteed equal:
`799.c3` is `52.40` versus `52.41`; `799.c4` is `66.04` versus `66.05`;
`801.h` normalized is `97.54` versus `97.53`; IV `807.i` is `8.147` versus
`8.148`, `807.k` is `7.314` versus `7.313`, and the second component of `811.a`
is `6.139` versus `6.138`. These follow the frozen main/correction strings.
They are not new printed results or substitutes for the chosen keys.

**806.d preprocessing: PASS.** Positive decimal four-significant rounding gives
`1.0058 -> 1.006`, `6.83251 -> 6.833`, `20.156 -> 20.16`.
The derived addresses are IV `(1,0; main0; correction6)`,
`(6,8; main3; correction3)`, `(20,; main1; correction6)`.
With unit `0.001`, the roots are `1.000+0.003=1.003`,
`2.613+0.001=2.614`, `4.483+0.007=4.490`.
This is accepted as the explicit current lesson-series convention requested for
this candidate, not a universal Bradis input-cutoff rule or direct accurate
rounding of the original radicands. `I-second-excess-digit` positively allows an
extended-correction method; the candidate acknowledges it without claiming to
use it.

**811 component precision: PASS.** `376.8=3.768*100` and `37.68` yield
`19.41` and `6.139`; their finite sum is `25.549`, finally `25.55` at `0.01`.
`82340=8.234*10000` and `8234=82.34*100` yield `287.0` and `90.74`; their
finite difference is `196.26`, finally `196.3` at `0.1`. The intermediate place
is one decimal place finer than the coarsest displayed table component.
This is a disclosed table-component reporting convention using the inherited
G3-G7 context, not new accuracy in either component or an exact-root error bound.
The prior direct references were not substituted.

**813.b two-stage rounding: PASS.** The product radicand is `13.95`; IV
row `13,`, main9 `3,728`, correction5 `7`, last-place unit `0.001` gives
`3.735`. Explicit positive decimal half-up to `0.01` gives **3.74**.
The inherited accurate-root direct reference `3.73496988... -> 3.73` remains
clearly labeled as a different direct rounding. The candidate attributes half-up
to its author convention, not to a sourced Bradis tie rule, and does not claim
the two-stage answer is within `0.005` of the accurate root.

**814 table-first product: PASS.** Frozen main values `4.243` and `1.414`
have the finite exact product `5.999602`; four-significant reporting gives
**6.000** without prematurely truncating the product. The separately inherited
exact radical product `6` and its explanation are preserved verbatim.
The word "exact" for the finite decimal multiplication does not certify the
exactness of the table factors as roots.

**815 significant zeros: PASS.** The current prompt supplies the precision
rule: `6.24` has three significant figures and `2.498 -> 2.50`, not `2.5`;
`71` has two and `8.426 -> 8.4`. Unknown true-input uncertainty is not
converted to a guaranteed accurate root.

**816 square-table to root-table staging: PASS.** III row `3,1`, main4 is
the upper physical line with `9,860`; the candidate correctly uses it.
Four-figure square readings scale to `986.0/734.4` and `1910/466.6`.
The finite radicands are **1720.4/1443.4**, not inherited direct-square
references `1720.37/1443.13`. Four-figure rounding before the root lookup gives
`1720=17.20*100` and `1443=14.43*100`.
IV `17,; main2` gives `4.147 -> 41.47 -> 41.5`; IV
`14,; main4; correction3` gives `3.795+0.004=3.799 -> 37.99 -> 38.0`.
The last roots have three significant figures, with the zero in **38.0**
retained. The extra intermediate significant digit and its rounding stage are
explicit conventions, not an unconditional guard-digit guarantee.

**Source/prose claim boundaries: PASS.** Candidate prose distinguishes direct
main-entry half-unit rounding from interpolation and approximate-input
uncertainty. General `I-interpolation-error-and-admissibility` has conditions
and exceptions; `G-warning-last-digit` warns about the last digit. None became
an unconditional half-unit/one-unit bound in the affected key text.
The 2010 table identity is inherited text evidence only; no historical
same-edition equivalence is claimed. The corrected nine-column statement,
four-figure scaling example and explicitly retained erroneous IV printed
coefficient remain separate source facts, not candidate accuracy guarantees.

## Prior Review Reuse

The n38 review at `resume182-12/n38-answer-review/reports/answer-review.md`
continues to supply its 49/49 direct-arithmetic matches. It is not rerun.
Current candidate entries 802-805 equal the previous reviewed objects;
799.a/b display lines and the 801.a-d approved display substrings are unchanged.
No earlier arithmetic or source review was replaced.

The authoritative discovered n39 review is
`resume182-13/n39-answer-review/stage2-review.md`, not under resume182-12.
Its **19 unaffected complete outputs** are reused. Entries 808, 812, 817, 818,
819 equal the prior objects and the 814 exact-product paragraph is identical.
No figure/image inspection or old choice/input interaction was used to reuse
those passes. Reference arithmetic in the changed exercises remains inherited;
only the new table route was computed.

## Current Hash Binding

| Input/evidence | Current SHA-256 |
| --- | --- |
| FIRST/n38/answer-keys.json | `346a2476f1f86349263fa983dff0f9785384a60b7b768b982b8132fc3c3e8b90` |
| FIRST/n39/answer-keys.json | `f19e29f6b667864976db99bb7ac06871c5a4ab04df647f14044a848e0d42f97a` |
| FIRST/provenance.json | `48b09279123af0fd69a4dbd4bc54876e50bc8713be1b6d21ebc86eb478571216` |
| FIRST/bindings.json | `868cd21b4a80cf1ae209e71ec85816d3cacf15b082f09e3437bca0003cab5755` |
| FIRST/method-route.md | `d86d316c7de24e23781847966a90a36c809cfae04ef89ab19f25c23c8a5fb75e` |
| FIRST/freeze.json | `7a3a9aa64e455be6ccafc1f5cf3f29c7e8e5f1ebd9895ece1f7dc571250ea58f` |
| Corrected transcriptions | `248d2961eb1f272fe2a047103f4fb154c9e5bef070589670e605bdc10523e953` |
| Corrected dedicated table rules | `41a84bf4ad20217b9eb056bdaebcf5417d5d72d08820119b63bbf05308611f46` |
| General method rules | `a0f08bfe1b78099bd6489bc53fd869c4c215f16bf6ea7cf3787050080df1d05a` |
| Existing affected-binding PASS | `7b1fa46799ce9300dc937db4086ccae3d9c306885f3d5b7f7adf07d01920ae29` |
| Independent source derivation | `f6a95a67cdaa3a28f73531a637c0ecac285940769d9a336015cdd0e3044ccffb` |
| Successful comparison | `8e3b3867656b47ab953346ba2c44a42b1d24a25e03c836c3fe150ace808d0b19` |

All capture-33.json through capture-40.json, four current modern lesson/exercise
JSON files, prior reviews and author input bindings have full absolute-path
hashes in `comparison.json:/inputs`. Every FIRST freeze artifact matches its
current bytes. Source identity/PDF hash is inherited; the PDF was not opened
or rehashed. Only local text evidence was used.

## Execution And Stop

The source derivation was written exclusively before the first candidate
answer-key read. The method route and provenance had already been inspected;
this review does **not** claim a blind pre-provenance experiment. Arithmetic is
independent of author computations/checker: operands come from current prompts,
addresses are derived from table step/normalization rules, and numerical values
come from frozen captures. No exact square/root full re-solve occurred.

One comparison attempt failed when a plain-Decimal parser encountered the valid
`801.h` LaTeX scientific display. `first-execution-failure.json` preserves this
technical failure; only the comparison parser was repaired and only compare was
rerun. `source-derivation.json` was not overwritten or recomputed.
The successful comparison is an exclusive new file.

Commands actually executed, from the exact checkout:

```sh
python3 -B .intentfold/tickets/STEMROBIN-182/tmp/resume182-13/table-answer-review/review.py source
python3 -B .intentfold/tickets/STEMROBIN-182/tmp/resume182-13/table-answer-review/review.py compare
```

These write-once commands cannot silently overwrite existing evidence. A future
changed candidate requires new affected evidence, not replacing these files.

Reviewer writes are confined to `table-answer-review/`. New image opens,
renders, OCR, network, model calls, app/runtime checks, DB operations,
finalization, promotion and commits: **0**. No author/source file, previous
review, product artifact, n43 work or figure integration was edited.
Stop after returning this targeted PASS; no parent gate state is changed.
