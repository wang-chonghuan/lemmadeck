# N45 Mobile First-Display Pixel Review

Outcome: **scoped_pass**. Exactly eight requested images were inspected once each,
with zero reopens, other images, new crops, browser runs or renders. No blocking
display defect was identified in the observed regions. The files are sealed 0444.

This is a display-only observation of existing source text and written exercises.
Source, mathematical, answer and figure fidelity PASS are inherited from the
user's explicit premises, not re-solved or compared with original images.
Headed runtime PASS is inherited from the hash-bound capture report.

## Observations

- Text: title, throwing-object example, graph/caption and motorboat example stay
  ordered without visible overlap. Body text and displayed equations are readable
  at delivered scale. Targeted paragraphs show the inline formula and substitution
  lines without a visibly missing terminal or line collision.
- Figure 59: the initial window renders the height axis, labelled grid, solid
  curve/crest and dashed guides. The right-end window renders the descending
  branch, dashed guide, axis labels through 8, arrow and t (s). This is a real
  instructional graph, not an empty or decorative placeholder.
- Exercises: 873-891 and the review heading remain ordered. The dense 877-878
  equations occupy distinct rows. Exercise 887's targeted capture makes its
  fractions, radical bars and signed x/y assignments distinguishable.
- Figure 60: the initial window renders axes, grid, endpoint guide and curve into
  its low region; the right-end window renders the rising curve, endpoint guide,
  axis labels 3-6, arrow and x. Its instruction remains framed above the graph.
- Figure 61: both number-line schematics are fully visible in the targeted image,
  with zero ticks, A/B labels, point markers and arrowheads separated. The upper
  A marker is visibly open. Mathematical relationships remain inherited.
- Minor, nonblocking layout observation: a unit exponent wraps to the following
  line in the gravity footnote and exercise 874(a). It remains visible and does
  not collide with adjacent text.

## Specific Limits

There are no identified **necessary unresolved regions** blocking this scoped
display pass. The following coverage is explicitly not certified:

- Figure 60 has an unobserved 20-pixel media strip, x in [310,330): the continuation
  of curve/grid/axis between the initial low-region view near x=2 and the right-end
  view near x=3. The inherited 310-pixel client width and scrollLeft=330 define this
  gap. No uniquely necessary label or requested read-off location in that strip
  was identified from the visible captures. Its pixels and continuous native
  strokes are not asserted; figure fidelity remains inherited.
- Figure 59's endpoint windows overlap by 76 media pixels according to inherited
  width/offset data, but intermediate scroll states were not observed. Endpoint
  reachability and tiny inline 2-pixel scrolls are runtime inheritance, not new
  interaction observations.
- All images were requested with `detail=original`; the tool does not provide a
  native 1:1 or no-resampling guarantee. Exact anti-aliasing and every small
  fraction bar, subscript or superscript in full-page exercises 877-878, the
  throwing-object inline formula and motorboat rational equations are not
  independently certified at native scale. Their layout is visibly readable.
  Full-page length alone is not a blocker.
- The full-page PNGs are 375x3123 and 375x5286; targeted captures are 358 pixels
  wide. These extents are not the inherited 390x844 viewport. Runtime minimum
  figure text values (22px for graphs; 16.59375px for the 295.0078125px number-line
  media) are inherited current measurements, not new source assertions.

## Exact Evidence

All absolute realpaths and SHA-256 values matched the immutable request. The
`checked_images` array in `review.json` records each exact absolute reference,
capture dimensions, owner and individual observation. The ledger order was:

| Open | Existing Image | SHA-256 |
| --- | --- | --- |
| 1 | alg7-c4-s3-n45-text-390.png | 94a86c5f94159858505b51ece6637420dfe76148fd298a216fd1c0825d5f7cb2 |
| 2 | alg7-c4-s3-n45-text-390-right-1.png | c664a60bfc37697e232a9320d2a90bb677f197817d9e8811cba556c4a0f4226c |
| 3 | alg7-c4-s3-n45-text-390-right-2.png | f16a1f46bfab9d94c9448ea4887218d81660d2799022a2df377b8bf67fe301ab |
| 4 | alg7-c4-s3-n45-text-390-right-3.png | a7e14e01deb3fd9e8f190762d5fb3fffc4bab28b1c1d78d1f8f596f0bcb93122 |
| 5 | alg7-c4-s3-n45-exercises-390.png | 4c0c76abd2e2ded3d888ef94353216e5f320a71ae5279768480fa278dcb85b89 |
| 6 | alg7-c4-s3-n45-exercises-390-right-1.png | 76ec37a40b759842468614cc1403e8c0837f8e14090fd8da1638ce7eb20ef414 |
| 7 | alg7-c4-s3-n45-exercises-390-right-2.png | fd2c16304eec4be0f42b656f32a51f7e9b3b4ef0b287f200230903ed94df53ba |
| 8 | alg7-c4-s3-n45-exercises-390-right-3.png | 15205006c15b5b4d58d8d5a37ab9cdd230f280e694f55debec9a0438fac472dc |

Existing image root:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n45-source-FIRST/`.

Capture report:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n45-source-FIRST/result.json`;
SHA-256 `1bc045b3ef826595204b2c26c5160926f614e37d995aacf7d3ac6152c8b2db60`.

Immutable request:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n45-source-pixel-review/mobile/request.json`;
SHA-256 `e4b3a08e51dc0e7ca6446ff39d425b96910c43bb59ae42474dd6446fb2f60e0b`.

Only `review.json` and `report.md` were created inside the authorized mobile
directory. Request, captured inputs and all other workers' files were preserved.
No product, source, key, math, figure, app, DB, dependency, Git, progress or
network changes were made. No image payload is included in this report.
