# Exercise 450 source solving

Role: ANSWER AUTHOR only. Candidate not reviewed.
Book: 6-8g. Edition: modern-us-neutral. Lesson: geo68-c3-s2-n35.
Sole cwd: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188.
Only exercise 450 is solved. No previous answer key, choice, reviewer solving,
or independent reviewer inventory was used.

## Current prompt and input binding

Current native exercise 450 prompt:

直线$AB$和直线$CD$平行。
1) 图 218 上哪几条射线的方向相同？
2) 哪几条射线的方向相反？

The current edition prompt is authoritative. The full current lesson direction
definitions and full FigureSpec were read. FigureSpec embedded text is an earlier
draft snapshot; the current ready exercise prompt above governs this answer.

The eight input file paths and SHA256 hashes are bound in capture-218.json:
SHA256 bb1406a474d3c82f9ffe61c872c3c8b84cb7c8d7758212adf07ba52d9c992c2e.
Relevant direct bindings:

- Current lesson.json: 9fa5e991f24a33808c6dcca83afb875cbe38270396a7860b81f6feb978a2e24b.
- Current exercises.json: 748d8c76cf516434a3d0a1218b124e61867d91269fe0468de2b771df6753acbf.
- Native answer template: e487dd3791a939615fb4f045ace4bf25c30e052414a14fa39c10e4137c4d6c7f.
- Original fig-218.png: 6cb29778695c079a8b871d463b70471bc9638cf49a5f10e25bdd20f4a8d1adec.
- Current fig-218.svg: 1641c74779d32ecd40817bf218eb08eb9c2e193583c9d40ae9adf0c43e361ad6.
- Current fig-218.spec.json: f9d24c1bafe310b06ccd83df8e26155eff2debbb14da380a3c74d1e9553d03ee.
- Current fig-218.review.json: 7a12b3a8b2b22408a100a50b2d4cbe1f068140e6fdc76cab03b4a2ec11eb7afe.
- Current fig-218.render.json: 3e19e9de79250905bb86b38b3108e79757a9fb2aaa5b06720542acd38fca7eb4.
- Actual SVG screenshot: ba3e30f306cae76d5144d8393e29bb18fd4e54adb6106ef09cb7edda673b6ad4.

The native prepare exit 0 was reported by the human; it was not rerun.
The existing figure review is pass and its source/spec/render/SVG bindings
matched the actual files. It is reused, not replaced by this author note.

## Pixel observations

The original PNG was opened exactly once. The actual current SVG was displayed
offline in headed Chromium at 640 x 420 and its 218-only screenshot was opened
once. The owned browser was closed before solving was sealed.
Total image loads: 2, in one batch; no crops or reopens.

On the displayed modern pixels:

- Upper support: A, Q, B, ordered from left to right.
- Lower support: C, P, D, ordered from left to right.
- Rising diagonal support: F, P, Q, E, ordered from lower left to upper right.
- Q is the upper/diagonal intersection; P is the lower/diagonal intersection.
- Exactly these three supports and these eight named points are used.
- The upper support has a small continuation before A and ends at B.
  The lower support continues before C and after D. The diagonal has small
  continuations beyond F and E. Their printing identity is not inferred.

The original crop has the same visible point order and intersection layout.
Modern labels are used to name the rays; no claim about original glyph/script
identity, arrow printing, dash identity, lengths, angles, scale or metric is made.
Original source/glyph/script/printing/dash identity and metric remain UNKNOWN.
FigureSpec pixel coordinates are rendering positions, not textbook measurements.

## Complete supported ray lists

Notation [XY) denotes the ray starting at X through Y, as in the current lesson.
All second points below lie on the displayed support of the starting point.
Equalities below are aliases of the same ray, not distinct rays.

Horizontal right:
[AB) = [AQ); [QB); [CD) = [CP); [PD).

Horizontal left:
[BA) = [BQ); [QA); [DC) = [DP); [PC).

Diagonal upper right:
[FP) = [FQ) = [FE); [PQ) = [PE); [QE).

Diagonal lower left:
[PF); [QP) = [QF); [EF) = [EP) = [EQ).

Each of these four lists is one same-direction class. Every pair of rays in
the same list has the same direction, including the displayed aliases.

Every horizontal-right ray is opposite to every horizontal-left ray.
Every diagonal-upper-right ray is opposite to every diagonal-lower-left ray.
There are no further opposite-direction pairs among the supported named rays.
No horizontal ray is in a diagonal direction class.

Coverage: the upper/lower/diagonal supports admit 6/6/12 ordered two-point names,
respectively, for 24 names total. Alias collapse gives 4/4/3/3 distinct rays in
the four direction classes, 14 total. For distinct rays, there are
6 + 6 + 3 + 3 = 18 unordered same-direction pairs and
4 x 4 + 3 x 3 = 25 unordered opposite-direction pairs.
These counts exclude a ray paired with itself and exclude alias duplicates.
The grouped answer covers all pairs without inventing an off-diagram join.

## Candidate contract

Use the native template envelope and only its exercise 450 object.
Retain prompt, figureEvidence, historical_entities, and all other native 450
metadata unchanged. Set source=derived, grading=ungraded, parts=[].
Provide the four concrete lists above with aliases, and both complete opposite
group pairings in natural Chinese/math. No proof or construction is requested;
no judging, interaction, keyboard, finalizer or publishing action is performed.

This file must be sealed mode 0444 before candidate-answer-keys.json is created.
Seal facts and actual run/scope incidents are retained in AUTHOR-RECORD.json.
