# STEMROBIN-182 n40 Independent FIRST Source And Modern Text Review

Date: 2026-11-19. Authorized offline scope only.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Observed branch: `codex/STEMROBIN-182-textbooks`.
Observed HEAD: `e16207d939526da0ebb2cfc528f084f0c3791afb`.
Lesson: `alg7-c4-s2-n40`, book `7a`.

## Verdict

**HOLD for one confirmed mathematical printing error at p0243#9, modern prose:18.**
The missing minus is printed, not a transcription omission. Faithful RAW is correct
as transcription and must not have its formula silently corrected. Modern mathematical
approval is withheld until a properly bound erratum and affected-only correction review.

All other reviewed text passes preservation and mathematical review. Existing FIRST
243-250 source-faithfulness PASS is inherited for unrelated content, not repeated or
promoted into mathematical/modern/finalization approval. The supplied prior p0242 PASS
is inherited as declared by the isolated-stage inputs; no p0242 image was opened.

| Reviewed item | Count |
| --- | ---: |
| RAW and modern prose blocks | 19 each |
| Actual prose-flow paragraphs | 19 |
| Original exercises | 14, 820-833 inclusive |
| Preserved formula occurrences | 137 |
| Natural Latin subparts | 60 |
| Numeric methods retained in 829 | 2 |
| Actual semantic boundary anchors | 5 |
| Figures | 0 |
| Images in this fresh context | 0 -> 1 |
| Findings / affected prose / affected exercises | 1 / 1 / 0 |
| Transcription repairs | 0 |

## Blocking Finding

**[P1] Printed missing minus breaks the negative-a equality chain.**
Physical page 243, printed page 237, page block `p0243#9` (zero-based block index 8),
modern target `prose:18` (nineteenth prose block), example 3, premise `$a<0$`.

The existing 1504 x 2289 grid was opened once with `functions.view_image`,
`detail: original`. On the second physical line of this block, the equals sign is
followed directly by the radical over `(-a)^2`, then the product with `sqrt(2)`.
There is no minus between that equals sign and radical. The later two radical terms
visibly have minus signs. The preceding physical line ends with `-(-a)sqrt(2)`.
Descriptive grid location: x approximately 490-1355, y approximately 1210-1345;
this is a locator only, not a measured crop. Actual original pixels, not the
inherited observation or author concern, settled this adjudication.

Exact normalized original, appearing once in the RAW and current modern target:

```tex
$a\sqrt{2}=-(-a)\sqrt{2}=\sqrt{(-a)^2}\cdot\sqrt{2}=-\sqrt{a^2}\cdot\sqrt{2}=-\sqrt{2a^2}$
```

Prescribed corrected expression, changing only the missing minus:

```tex
$a\sqrt{2}=-(-a)\sqrt{2}=-\sqrt{(-a)^2}\cdot\sqrt{2}=-\sqrt{a^2}\cdot\sqrt{2}=-\sqrt{2a^2}$
```

Mathematical reason: when `a<0`, `sqrt((-a)^2)=|-a|=-a>0`; multiplying that
principal square root by positive `sqrt(2)` yields a positive term. But the
preceding `-(-a)sqrt(2)` and subsequent `-sqrt(a^2)sqrt(2)` are negative.
The leading minus must remain outside the radical when the positive factor `-a`
moves under it. For signed substitution `a=-1`, the five printed terms are
`-sqrt(2), -sqrt(2), +sqrt(2), -sqrt(2), -sqrt(2)`. The prescribed correction makes
all five `-sqrt(2)`. This refutes the printed chain and proves the correction under
the stated sign condition; no exercise solution or answer key is involved.

Proposed stable erratum ID: `p0243-math-1`. Register against `p0243#9`, using
the normalized original above and the mathematical reason. Faithful page content
retains its existing physical-wrap marker `↵` and erroneous printed formula.
`p2c.py` page validation uses `blocks.text_of`, which removes `↵`; `edition.py`
requires the same registered original to occur exactly once in the assembled target.
Thus the erratum's `original` must omit `↵`, while the page literal must retain it.
Both literals are recorded in `erratum-prescription-FIRST.json`.

Parent owns any source metadata registration and affected pipeline regeneration.
The edition author fills the pipeline-derived record's `corrected`, updates only
`prose:18`, and declares `math-correction` alongside `layout`. Derive the new
page JSON hash and source/PDF/target bindings from the actual post-registration
pipeline; do not reuse the pre-registration hash as the corrected record's binding.
Keep all original FIRST snapshots and unrelated approved text. Obtain affected-only
review before the single parent-owned modern finalization. This reviewer has not
registered the erratum, changed source/templates, or executed any finalizer.

## Complete Text Review

Every one of the 19 modern prose objects and 14 exercise objects was read and
compared against isolated RAW; both embedded source snapshots and the complete
three-template set were also compared. Mechanical preservation is independent of
the author's PASS: all 33 target comparisons succeed in `review-FIRST.json`.
The script checks exact ordered formula/numeric equality, exact source_text,
unchanged metadata, and wording equality allowing only whitespace, punctuation and
Cyrillic-to-natural-Latin enumeration. This is preservation evidence, not a
substitute for the mathematical judgment below.

| Prose targets | Independent mathematical and intent review |
| --- | --- |
| 0-2 | Positive square-factor extraction and the comparison are valid; both methods remain announced. |
| 3-5 | Moving positive factor 4 under the radical is valid. Comparison uses the increasing square-root function on its real nonnegative domain; the reason and final conclusion remain. |
| 6-8 | Both transformation names and the transition to further examples are complete, with no invented scenario or dropped explanation. |
| 9-11 | Example 1 retains `a>=0`, including zero, the factorization of `9a^7`, and the absolute value before its sign-dependent simplification. All factors used by the product theorem are nonnegative. |
| 12-14 | Example 2 correctly explains why a negative value is not itself a principal square root, retains the exterior minus, and preserves the explanatory conclusion. |
| 15-17 | Example 3 retains both possible signs of `a`; the nonnegative case, including zero, correctly uses `sqrt(a^2)=a`. |
| 18 | Faithful preservation PASS; mathematics HOLD for the single printing error above. Premise and neighboring terms are otherwise correct. |

| Exercise | Complete prompt review, without generating solutions |
| --- | --- |
| 820 | All eight extraction expressions and their intent retained. |
| 821 | Six coefficient/radical expressions, decimal factors and exterior negative signs retained; instruction still requires simplification. |
| 822 | Six positive-factor transformations, including fractional radicands, retained. |
| 823 | Eight transformations retain negative multipliers and variable radicands. Real interpretation requires each radicand to be nonnegative; no unrestricted-domain assertion was added. |
| 824 | All ten comparison pairs retained in order; asking comparison does not falsely assert strict inequality for every pair. |
| 825 | Both four-number groups remain distinct and explicitly request increasing order. |
| 826 | All six stated sign conditions retained exactly, including strict versus non-strict inequalities. Square extraction must use absolute value before applying those conditions; negative odd powers cannot silently replace their absolute values. |
| 827 | Both candidate sets and the oppositely signed equalities remain intact. Cross-page question b is closed with its complete condition and question mark. |
| 828 | Four subparts retain both stated signs of `a` and both reciprocal radicands. Denominator exclusion and radicand nonnegativity impose different sign cases; there is no erroneous common unrestricted domain. |
| 829 | Both original square-root-table methods, multiplier 6, `0.3333`, transformation to `sqrt(12)`, and the concluding convenience question retained. The decimal is a table approximation, not an asserted exact equality to one third. |
| 830 | Explicit instruction to consult the square-root table and all four expressions retained. |
| 831 | Circle-area formula, radius meaning, instruction to express radius using area and consult tables, both areas with units, approximate pi, and both area-scaling cases retained. Radius has its geometric nonnegative meaning; no negative branch was introduced. |
| 832 | Both complete domain questions retained; second rational radicand still has its denominator exclusion and zero-endpoint distinction. No solution domain was inserted. |
| 833 | Complete question retained before n41 heading. The interval remains closed and the task asks attained integer function values, not integer input values. No answer/count was produced. |

## Layout And Boundaries

Modern Chinese punctuation is outside every TeX segment. No Cyrillic, forbidden
cultural term, manual math-character span, new figure, quantity change or instruction
omission was found. All changed targets declare only `layout`; `numeric_changes`,
`historical_entities` and lesson `errata` are empty at FIRST. The missing erratum
is the blocker, not permission to change an unregistered formula.

All 60 Latin labels are natural per-exercise sequences and each subpart occupies its
own line. Exercise prefixes occupy separate lines; 831 retains its two introductory
prompt lines and its post-subpart instructions. Numeric `1)` and `2)` in 829 remain
methods, not relabeled Latin subparts. Fullwidth print-column spaces are absent.

The existing shared `prose_flow.mjs --json` was executed once, without HTML/KaTeX
rendering. Its output exactly matches the author's FIRST flow. Five actual adjacent
paragraph pairs resolve uniquely, in order, at indices `3, 6, 8, 12, 15`: first
method to second method; comparison conclusion to terminology; terminology to further
examples; example 1 to example 2; example 2 to example 3. These indices are reported
by the parser, not authored integers. Exact `{before, after}` strings are preserved
in `prose-flow-FIRST.json` and `review-FIRST.json`.

## Exact Bindings

All paths below are under the exact checkout named above. `bindings-FIRST.json` and
`hashes-FIRST.sha256` contain absolute paths, full hashes and unchanged-at-end checks.
Author input hashes, candidate binding, all three read-only FIRST snapshots and all
three current editable templates match their declarations. Isolated pages 0243-0246
match the inherited FIRST source hash manifest; supplied stage inputs bind 0242 too.
No current durable production artifact was opened to repeat those source reviews.

| Input | SHA-256 |
| --- | --- |
| RAW lesson JSON | `4fd930dcb75c7241ae78723b1d4e8d9f872cf9902bb5980b66586c17ea5163ad` |
| RAW exercises JSON | `7d782a72a94eeea15c0d3f26b9e763a34f08a0fd42d8a02e500c1647385748c6` |
| Current / FIRST lesson template | `1d725df0abe06cc0ff7f45b1075280ec1542b892331d36164c9c8c661d1bd09d` |
| Current / FIRST exercise template | `1aa9fc150fd1633b6699f3cc792731c4c0d24fe671cdb53f9f75355b9ea7343f` |
| Current / FIRST figure template | `9b8feb41e98e3d2945995b3a8a9c480a098371b99f42719a9ee4102dce8decae` |
| Isolated p0243 page JSON, BEFORE erratum registration | `072a4e492fd117f21f046a4d2980591dbab5c2bc1b5151a71eccaacad5b35fa6` |
| Isolated p0243 page MD | `e0132dac7b07bbdcba4af93af33c4eac100beddf606144c27bdaa2ac1fa1cb79` |
| Inherited source FIRST review | `32ed61fa1441633b7c1a22e158e35d014a5639948668d125ff65d9d269ad764e` |

Source metadata declares PDF SHA-256
`8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052`
and page render SHA-256
`e0e1278791a05bef5be70946ce26d87df315451f9c31670124852d311a8bb6da`.
These declarations are recorded, not independently established by opening the PDF
or page.png. The actual viewed-grid binding is below.

## Image Ledger

| Load | Transition | Absolute existing image | SHA-256 |
| --- | --- | --- | --- |
| 1 | 0 -> 1 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0243/page.grid.png` | `486d5325adc944d8bbf7f7bd42c81697fe4b7276fee52171db931a8d7115c37e` |

Exactly one actual image load, `detail: original`. No crop, reopen, other page,
figure, screenshot, generated image or image-bearing handoff. Hashing the same
existing grid reads bytes for identity and does not load another image into context.

## Stop Boundary

Only this authorized `n40-modern-review/` directory was written. No source/template,
other worker, ticket progress, Charter, production content or environment was edited.
No answers, author keys or choices were read or authored; no network, DB, application,
renderer, test, finalizer, promotion, publisher, commit or push was run. Read-only Git
identity commands and text/provenance comparison are not finalization evidence.
Existing assembly warnings concern excluded 819 and n41; they were retained, not
silenced, and do not change this n40 content verdict.

This is the complete FIRST review and it stops here. Retain this reviewer context
for an affected-only subsequent review of the bound erratum and `prose:18` if needed;
do not reopen the source set or rerun unrelated passed review stages.
