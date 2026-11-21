# SOURCE167 Fixed-Author Stage 2

Outcome: REVISE. Reviewer remains OPEN.
Coverage: all 22 physical rows and all 13 semantic objects compared once.
Coverage counts are NOT match counts: 21 rows and 12 objects agree after
permitted punctuation/encoding normalization; R13 / O08 / author S08 differs.
New images or decodes: 0. No source/native tool or existing checker was rerun.

## Required Revision

F01: exercise 376 б), R13, first exponent attached to `2x`.

Fixed author:
`g(x)=7-2x^3+x^4-3x^9`.

Independent baseline AFTER the blind U1/U2 addendum:
`g(x)=7-2x^9+x^4-3x^9`.

Affected immutable author locations:

- `source167-active/source.body.md:25`
- `source167-active/source.inventory.json:42`,
  `/physical_baselines/12/literal`
- `source167-active/native/9c/pages/0167/page.md:62`
- `source167-active/native/9c/pages/0167/page.json`,
  `/blocks/7/lines/1`

All these paths are under:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/`

The author's final exponent is `9`, agreeing with resolved U1. Its FIRST
exponent remains `3`, contradicting U2, which was already established inside
the same authorized blind ROI before author disclosure. No expected answer,
new pixel interpretation, or new image operation was used in this comparison.

This changes the mathematical function, not punctuation or encoding.
For the recovered source function, the independently frozen derivative is
`4x^3-45x^8`. Differentiating the incorrect author function would instead yield
`4x^3-6x^2-27x^8`; that is an impact calculation, NOT an authored answer.
The two functions differ by `2x^9-2x^3`; their derivatives differ by
`18x^8-6x^2`. They are not identically equal.

Keep the failed fixed author byte-identical. A future corrected candidate
must carry the actual first exponent `9` and disclose this source-fidelity
revision. Do not rewrite the original freeze, call this textbook errata,
discard the failed candidate, or infer approval from its native PASS.
No corrected candidate or affected-only rereview is performed here.

## Evidence And Release Provenance

Author manifest: 10852 bytes, SHA-256
`3dc1977b5430a04d3ea19e9b74bb71c1c269e1780fb2035efebe8dd8ef8a6936`.
Author frozen body: 1029 bytes, SHA-256
`1ac5f559bd414989886c80abaf6cae1b2ddb24e854d975b4ebbcec6eb4f8a84d`.
Author frozen inventory: 10544 bytes, SHA-256
`7fd256a129c3115aa505e77aee1bc461d017fad4bce17353ac6d4fd2e71bc766`.

Only the named released author TEXT files and necessary bound native TEXT
receipts were consumed. The actual manifest-bound integrity files are
`source167-active/input-integrity.json` and
`source167-active/final-integrity.json`; the later path clarification caused
no mistaken-path read, new stage, broadened intake, or replay.
Manifest references to images, layout/template, PDF, runtime and other files
were not followed. No image file, including the old ROI, was opened.

The source/ROI pixel bindings are inherited from the preserved independent
freeze and recovery TEXT, not newly verified by opening image bytes.
Both independent frozen packages are bound in `stage2-receipt.json`.
All original Stage 1 and recovery files remain unchanged.

The parent-reported Stage 1 intake, recovery intake and fixed-author release
are dispatch/intake facts under the existing ordinary human authorization,
NOT new direct human prompts. Current reported recovery intake references:
`022a6c`, `9833db`, `fb4c3f`, `90c2f0`; reported stage
`source167-u1-blind-recovery-full-intake-nov21`, exit 0. Reported fixed-author
release stage: `source167-fixed-author-stage2-release-nov21`, exit 0.
No parent release/intake receipt or other chat was opened. Older wording
claiming a new direct human instruction remains historical in the immutable
files; this qualification does not alter their bytes.

## All-Row Mapping

Every row also maps to the same numbered author inventory baseline and
postfreeze owner-map band. Native JSON block indexes below are zero-based.
`segment` denotes one physical row encoded by a U+21B5 wrap marker inside a
single math span, not an added block or extra prose baseline.

| Source row / object | Author object | Body line | Native MD line / JSON location | Result |
| --- | --- | ---: | --- | --- |
| R01 / O01 | S01 | 2 | 39; blocks[0].lines[0] | Agree; period normalization; incoming cont supported |
| R02 / O02 | S02 | 5 | 42; blocks[1].lines[0] | Agree; 事实上， |
| R03 / O02 | S02 | 6, segment 0 | 43; blocks[1].lines[1], segment 0 | Agree; original polynomial under prime |
| R04 / O02 | S02 | 6, segment 1 | 43; blocks[1].lines[1], segment 1 | Agree; sum of term derivatives |
| R05 / O02 | S02 | 6, segment 2 | 43; blocks[1].lines[1], segment 2 | Agree; expanded derivative; terminal normalization |
| R06 / O03 | S03 | 9 | 46; blocks[2].lines[0] | Agree; example 1 |
| R07 / O04 | S04 | 12, segment 0 | 49; blocks[3].lines[0], segment 0 | Agree; example 2 starts |
| R08 / O04 | S04 | 12, segment 1 | 49; blocks[3].lines[0], segment 1 | Agree; leading +2 continues example 2 |
| R09 / O05 | S05 | 15 | 52; blocks[4].lines[0] | Agree; centered exercise heading |
| R10 / O06 | S06 | 18 | 55; blocks[5].lines[0] | Agree; owners 375 and 376 only |
| R11 / O07 | S07 | 21 | 58; blocks[6].lines[0], label 375 | Agree; all three subparts, same physical row |
| R12 / O08 | S08 | 24 | 61; blocks[7].lines[0], label 376 | Agree; 376 а) |
| R13 / O08 | S08 | 25 | 62; blocks[7].lines[1] | REVISE F01: first exponent 3 versus source 9; final 9 agrees |
| R14 / O09 | S09 | 28 | 65; blocks[8].lines[0], label 377 | Agree; local graphing request |
| R15 / O09 | S09 | 29 | 66; blocks[8].lines[1] | Agree; both graph functions |
| R16 / O10 | S10 | 32 | 69; blocks[9].lines[0] | Agree; numbered heading 47; display spaces normalized |
| R17 / O11 | S11 | 35 | 72; blocks[10].lines[0] | Agree; differentiability and nonzero denominator |
| R18 / O11 | S11 | 36 | 73; blocks[10].lines[1] | Agree; inline u/v and sentence continuation |
| R19 / O11 | S11 | 37 | 74; blocks[10].lines[2] | Agree; quotient prime, numerator order/sign, squared denominator |
| R20 / O11 | S11 | 38 | 75; blocks[10].lines[3] | Agree; theorem concludes 给出 |
| R21 / O12 | S12 | 41 | 78; blocks[11].lines[0] | Agree; w=u/v; proof open after 这时 |
| R22 / O13 | S13 | 44 | 81; blocks[12].lines[0] | Agree; decorated folio 160 |

## All-Object Ownership

| Independent / author | Source rows | Ownership and completeness result |
| --- | --- | --- |
| O01 / S01 | R01 | Incoming p cont, not a new standalone assertion; permitted prior166 final p-open TEXT supports the join |
| O02 / S02 | R02-R05 | One prose/three-row polynomial calculation; both physical wraps retained |
| O03 / S03 | R06 | Complete example 1, prose rather than exercise |
| O04 / S04 | R07-R08 | Complete example 2; second physical row belongs to the same example |
| O05 / S05 | R09 | Exercise heading, not a shared request or numbered exercise |
| O06 / S06 | R10 | Prose shared request explicitly owns 375 and 376; does not own 377 |
| O07 / S07 | R11 | Exercise 375, three Cyrillic-labelled subparts; number stored as native ex label |
| O08 / S08 | R12-R13 | Exercise 376, two subparts; ownership correct, source content REVISE F01 in б) |
| O09 / S09 | R14-R15 | Exercise 377 owns its own graphing request and both subparts; no source plot supplied |
| O10 / S10 | R16 | New numbered section 47, 商的导数; not an exercise |
| O11 / S11 | R17-R20 | Complete quotient-rule theorem; fraction tiers stay within their containing physical rows |
| O12 / S12 | R21 | Proof opening, p open; ends at 这时; no unseen continuation added |
| O13 / S13 | R22 | Folio 160 and both decoration dots, not an exercise or body claim |

The four stacked math objects F18Q, F19L, F19R and F21Q are represented by the
same numerator/denominator components and prime placements in author S11/S12.
No figure, caption, table, diagram or footnote is added or omitted.
The four major right-margin nontext marks and diffuse speck/gap regions are
also inventoried by the author. Approximate visual coordinates can differ
without a substantive mismatch. Their origin and exact component census
remain UNKNOWN; no mask or fresh measurement was performed.

## Mathematics Compared

- Polynomial differentiation in R03-R05 is correct for fixed coefficients:
  `P'=sum(k=0..n-1) (n-k)*a_k*x^(n-k-1)`. The constant term differentiates to zero.
- Example 1 agrees: `(x^10)'=10x^9`.
- Example 2 agrees: derivative `20x^3+12x^2+6x+2`.
- 375 а), б), в) givens agree; independent derivatives are respectively
  `4x^3`, `3x^2`, and `4(x-4)^3`.
- 376 а) agrees; derivative `10x^4-12x^3+14x-5`.
- 376 б) fails source fidelity at F01. Correct source derivative
  `4x^3-45x^8`; original Stage 1 conditional derivatives are NOT approved.
- 377 а) given agrees: `x^2(x-2)`. Domain and range R; zeros 0 (double) and 2;
  y-intercept (0,0); derivatives `3x^2-4x`, `6x-4`. Local maximum (0,0);
  local minimum (4/3,-32/27); increasing on (-infinity,0) and (4/3,infinity),
  decreasing on (0,4/3). Inflection (2/3,-16/27), concave down before it and
  up after it. Opposite infinite ends; no finite vertical, horizontal or linear
  oblique asymptote; central symmetry about the inflection, not even or odd
  about the coordinate origin. The frozen manual method plots these anchors,
  touches the axis at 0, turns at the minimum, and crosses at 2 with correct
  tangent and curvature transitions.
- 377 б) given agrees: `x^3-6x`. Domain and range R; zeros -sqrt(6), 0, sqrt(6);
  derivatives `3x^2-6`, `6x`. Local maximum (-sqrt(2),4sqrt(2)), local minimum
  (sqrt(2),-4sqrt(2)); increasing outside the critical interval, decreasing
  inside. Inflection (0,0); concave down left, up right; odd/origin symmetry;
  opposite infinite ends, no vertical/horizontal/linear oblique asymptotes.
  The frozen manual method plots roots and extrema, crosses the origin with
  slope -6 and connects branches with correct curvature and symmetry.
- The quotient-rule theorem retains differentiability of u and v at x and
  `v(x)!=0`, giving `(u'v-uv')/v^2`; the statement is correct. The visible
  proof only defines w and ends at 这时. No unseen later proof is completed.

The author package contains written tasks, not authored solutions or plotted
answers. These mathematical conclusions compare its givens/statements to the
pre-disclosure independent work; they are not a review of unprovided answers.

## Continuity, Normalization And Historical Limits

The only consumed prior166 source material is the bound 470-byte stage TEXT:
`由这个定理和前面得到的微分法则得出，多项式是处处`.
Joining R01 yields the grammatically and mathematically consistent statement
that polynomials are everywhere differentiable. No full prior166 page,
metadata, other claim or image was reviewed. Global unit/card routing beyond
the explicit heading 47 is not newly established by this local comparison;
n46 assembly remains pending.

Allowed differences: source `.` to Chinese `。`, `;` to `；`, presentation
spaces, TeX math delimiters, `\left`/plain parentheses, `\ne` for the observed
nonzero sign, `\cdots` for ellipsis, and U+21B5 physical-row encoding inside
math. Printed exercise numbers are preserved in native ex labels rather than
duplicated in block text. None alters the mathematical scope or operand.
Changing the first exponent in 376 б) is NOT any of these normalizations.

Historical native finalize exit 0 / 22 rows / 13 blocks and empty audit errors
remain genuine native syntax/count evidence. Native body equals frozen author
body, including the wrong exponent. They do not prove source fidelity.
`report.md:4` explicitly scopes its PASS to native; its `passed page167`
wording at line 98 must not be promoted to source approval. Future status must
retain native history while recording this REVISE.
Input-integrity's pre-native page.md binding (2257 bytes) and final page.md
binding (2359 bytes) describe distinct recorded phases; they are not an
additional source-content discrepancy.

Retained reviewer history: first exponent 3 in original Stage 1; its affected
conditional math; aggregate 31 rather than corrected Stage 1 aggregate 30;
and prior direct-human-prompt wording. They remain immutable and are not
treated as extra operations or renewed approval.

## Technical Error And Final State

A local TEXT suffix assertion initially used delimiter offset +7 for the
six-character `\n---\n\n`, dropping the first `<` and exiting 1
(exec output 216f75). All input hashes before that assertion were already
verified. A corrected suffix/header TEXT check exited 0 (584291). This was
reviewer verification code error, not author content change or a source/native
failure. No successful semantic comparison, native operation or image was
replayed. The error remains recorded in the receipt.

Accounting unchanged: SOURCE167 8; tracked 164/165/166/167 aggregate 32;
reviewer task conservative operations 3/8; context image payloads 2/24;
conservative context operations 3. Hidden internals UNKNOWN.
Parent permanent 24/24; zero new parent views/decodes.

Only these three new Stage 2 TEXT files are produced and individually sealed
0444. Author, Stage 1 and recovery evidence remain byte-identical. No
descendant, environment/credential inspection, backend/DB/network/paid/model/
Git operation or peer/supervisor message occurred.

STOP with outcome REVISE and reviewer OPEN after FULL TEXT return. No repair,
closure, source168+, assembly, publication, merge or deployment is performed.
