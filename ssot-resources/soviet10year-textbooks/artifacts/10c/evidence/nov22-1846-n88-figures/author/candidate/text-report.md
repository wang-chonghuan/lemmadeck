# N88 figures 38-41: deterministic candidate TEXT handoff

Candidate-only authoring and first rendering. No figure/source/crop/science/lesson approval.
Repository: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`
Owned output: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-fig38-41-author/candidate`
TEXT release manifest SHA-256: `ad2498fc54f7995be1fee1c7d83aba1a9c33d0e9be746183b8fde9ad1514fa3c`
Frozen inventory manifest SHA-256, unchanged: `8e55fa93d0b366c03630072c208b663692c0e6fe2e6ce731b9516a6f391e299b`
Source inventory intake supplied: d3970d / receipt8d54ca66, retained once.

## Outcomes

| Figure | Draft | First render | Collisions | Min text at 640px | Curves |
| --- | --- | --- | --- | --- | --- |
| fig-38 | pass | pass | 0 | 24px | 1 |
| fig-39 | pass | pass | 0 | 17px | 5 |
| fig-40 | pass | pass | 0 | 24px | 1 |
| fig-41 | pass | pass | 0 | 24px | 1 |

Renderer: installed JSXGraph 1.13.1 through the unchanged official render_spec.mjs.
Each standalone draft validator and first render ran once. The renderer's internal draft validation is accounted separately.
Actual executable, argv, cwd, exit, signal, streams, input/output hashes and technical image counts are retained in each execution receipt.
SVGs and preview PNGs were not model-viewed. Preview PNGs were created by the installed renderer's --png path in the same first render.

## Mathematical and modern regularization limits

Curves are deterministic formula samples represented only by svgPath M/L curves; labels, axes, guides and points remain renderer-owned objects.
Serialized path nodes were checked for finiteness, canvas bounds, strict descending order and the stated formula. Segment midpoints were checked to <0.01 canvas px.
This is floating-point/polyline technical evidence, not an exact analytic primitive or independent mathematical/visual approval.
Figures 38, 39 and 41 show author-chosen |y|<=3.2 windows. Figure 40 shows x in [-5.25,5.25], always strictly inside the proper output range (0,pi).
Figure 39 retains one shared frame, all five branches, all five dashed pole guides, the solid zero-pole axis, and all five half-period labels.
Its half-period labels use a lower row and inline mathematical typography as explicit modern legibility regularization.
Figure 41 uses two distinct unlabelled illustrative levels, 1.5 and -1.2, and formula-derived projections. These numbers/coordinates are NOT source facts or visible exercise-answer labels.
Both certain projection-foot dots remain; no ambiguous curve/guide junction dots, rounded-ink endpoints or guide arrowheads are invented.
Modern x/y/0/pi meanings and exact scales are text-derived or author-chosen; source codepoint identity and optical exact coordinates remain UNKNOWN.

## Full Source Group Mapping

### fig-38
Spec: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-fig38-41-author/candidate/fig38/spec.json`
Spec SHA-256: `87817fcc63d67465d0cff8d92dcfd7de08e6874679f7e6316ca6a8d87cd54172`
SVG SHA-256: `15947962622f6d4882f70d35d8cfe7d6e7c6e84771e4183f88df7af8acfd8930`
Render report SHA-256: `2bb1e5c0cdffd1fd21dd95f2783f81f966ffd5bd8f52567c0067e13ab2879d7d`

- `f38-layout`
  Objects: `f38-axis-horizontal`, `f38-axis-vertical`, `f38-label-origin`, `f38-label-x`, `f38-label-y`, `f38-line-dashed`, `f38-label-pi`, `f38-label-fraction`, `f38-curve-main`
  Assertions: `f38-one-curve`, `f38-axes-perpendicular`
  Requires: no grid / no multi-point requirement for this group
- `f38-axes`
  Objects: `f38-axis-horizontal`, `f38-axis-vertical`, `f38-label-origin`, `f38-label-x`, `f38-label-y`
  Assertions: `f38-axes-perpendicular`, `f38-horizontal-arrow-connects`, `f38-vertical-arrow-connects`, `f38-origin-horizontal`, `f38-origin-vertical`
  Requires: no grid / no multi-point requirement for this group
- `f38-solid-curve`
  Objects: `f38-curve-main`
  Assertions: `f38-one-curve`, `f38-zero-on-axis`
  Requires: no grid / no multi-point requirement for this group
- `f38-mid-label`
  Objects: `f38-label-fraction`
  Assertions: `f38-zero-on-axis`, `f38-zero-coordinate`
  Requires: no grid / no multi-point requirement for this group
- `f38-dashed-reference`
  Objects: `f38-line-dashed`, `f38-label-pi`
  Assertions: `f38-pole-parallel-y`, `f38-pole-connects`, `f38-pole-coordinate`
  Requires: no grid / no multi-point requirement for this group
- `f38-unresolved-marks`
  Objects: none; no reconstructed unknown marks
  Assertions: `f38-no-invented-markers`, `f38-axis-arrows-count`
  Requires: no grid / no multi-point requirement for this group

### fig-39
Spec: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-fig38-41-author/candidate/fig39/spec.json`
Spec SHA-256: `2f7e70bd5ef2a2b6c8e26323691771336048fb6155754911a4aa3fd173a946e1`
SVG SHA-256: `666694a6bb441673f3cc4d755407251e361ff539a2e771fcd3900ca218ef6ded`
Render report SHA-256: `ca98685c3b611fdc1ffdc7c455fea2cef00509387436e280c65b8036a9eb4680`

- `f39-layout`
  Objects: `f39-axis-horizontal`, `f39-axis-vertical`, `f39-label-origin`, `f39-label-x`, `f39-label-y`, `f39-dash-01`, `f39-label-dash-01`, `f39-dash-02`, `f39-label-dash-02`, `f39-dash-03`, `f39-label-dash-03`, `f39-dash-04`, `f39-label-dash-04`, `f39-dash-05`, `f39-label-dash-05`, `f39-curve-01`, `f39-label-mid-01`, `f39-curve-02`, `f39-label-mid-02`, `f39-curve-03`, `f39-label-mid-03`, `f39-curve-04`, `f39-label-mid-04`, `f39-curve-05`, `f39-label-mid-05`
  Assertions: `f39-five-curves`, `f39-five-dashed-guides`, `f39-axes-perpendicular`
  Requires: no grid / no multi-point requirement for this group
- `f39-axes`
  Objects: `f39-axis-horizontal`, `f39-axis-vertical`, `f39-label-origin`, `f39-label-x`, `f39-label-y`
  Assertions: `f39-axes-perpendicular`, `f39-horizontal-arrow-connects`, `f39-vertical-arrow-connects`, `f39-origin-horizontal`, `f39-origin-vertical`
  Requires: no grid / no multi-point requirement for this group
- `f39-dashed-references`
  Objects: `f39-dash-01`, `f39-label-dash-01`, `f39-dash-02`, `f39-label-dash-02`, `f39-dash-03`, `f39-label-dash-03`, `f39-dash-04`, `f39-label-dash-04`, `f39-dash-05`, `f39-label-dash-05`
  Assertions: `f39-dash-01-connects`, `f39-dash-01-coordinate`, `f39-dash-01-parallel-y`, `f39-dash-02-connects`, `f39-dash-02-coordinate`, `f39-dash-02-parallel-y`, `f39-dash-03-connects`, `f39-dash-03-coordinate`, `f39-dash-03-parallel-y`, `f39-dash-04-connects`, `f39-dash-04-coordinate`, `f39-dash-04-parallel-y`, `f39-dash-05-connects`, `f39-dash-05-coordinate`, `f39-dash-05-parallel-y`, `f39-five-dashed-guides`
  Requires: no grid / no multi-point requirement for this group
- `f39-branch-01`
  Objects: `f39-curve-01`, `f39-label-mid-01`
  Assertions: `f39-curve-01-zero-on-axis`, `f39-curve-01-zero-coordinate`, `f39-curve-01-periodic-offset`
  Requires: no grid / no multi-point requirement for this group
- `f39-branch-02`
  Objects: `f39-curve-02`, `f39-label-mid-02`
  Assertions: `f39-curve-02-zero-on-axis`, `f39-curve-02-zero-coordinate`, `f39-curve-02-periodic-offset`
  Requires: no grid / no multi-point requirement for this group
- `f39-branch-03`
  Objects: `f39-curve-03`, `f39-label-mid-03`
  Assertions: `f39-curve-03-zero-on-axis`, `f39-curve-03-zero-coordinate`, `f39-curve-03-periodic-offset`
  Requires: no grid / no multi-point requirement for this group
- `f39-branch-04`
  Objects: `f39-curve-04`, `f39-label-mid-04`
  Assertions: `f39-curve-04-zero-on-axis`, `f39-curve-04-zero-coordinate`, `f39-curve-04-periodic-offset`
  Requires: no grid / no multi-point requirement for this group
- `f39-branch-05`
  Objects: `f39-curve-05`, `f39-label-mid-05`
  Assertions: `f39-curve-05-zero-on-axis`, `f39-curve-05-zero-coordinate`, `f39-curve-05-periodic-offset`
  Requires: no grid / no multi-point requirement for this group
- `f39-endpoints-and-print-marks`
  Objects: `f39-curve-01`, `f39-curve-02`, `f39-curve-03`, `f39-curve-04`, `f39-curve-05`
  Assertions: `f39-five-curves`, `f39-no-invented-markers`, `f39-axis-arrows-count`
  Requires: no grid / no multi-point requirement for this group

### fig-40
Spec: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-fig38-41-author/candidate/fig40/spec.json`
Spec SHA-256: `ca61e45c225a76158d6b08a44814c01d9074611a71c4172e99fb307ad0a01502`
SVG SHA-256: `fa77973659a21795429fae565cd824acf0a16dc17e77689449ec4cde32c364e1`
Render report SHA-256: `77d376c7564d783605f60ea28e873587c00e96a31e3e56439c5dd04f0931654f`

- `f40-layout`
  Objects: `f40-axis-horizontal`, `f40-axis-vertical`, `f40-label-origin`, `f40-label-x`, `f40-label-y`, `f40-line-dashed`, `f40-label-pi`, `f40-label-fraction`, `f40-curve-main`
  Assertions: `f40-one-curve`, `f40-axes-perpendicular`
  Requires: no grid / no multi-point requirement for this group
- `f40-axes`
  Objects: `f40-axis-horizontal`, `f40-axis-vertical`, `f40-label-origin`, `f40-label-x`, `f40-label-y`
  Assertions: `f40-axes-perpendicular`, `f40-horizontal-arrow-connects`, `f40-vertical-arrow-connects`, `f40-origin-horizontal`, `f40-origin-vertical`
  Requires: no grid / no multi-point requirement for this group
- `f40-dashed-reference`
  Objects: `f40-line-dashed`, `f40-label-pi`
  Assertions: `f40-dashed-connects`, `f40-dashed-parallel-x`, `f40-upper-level`
  Requires: no grid / no multi-point requirement for this group
- `f40-solid-curve`
  Objects: `f40-curve-main`
  Assertions: `f40-one-curve`, `f40-mid-on-y-axis`
  Requires: no grid / no multi-point requirement for this group
- `f40-middle-label`
  Objects: `f40-label-fraction`
  Assertions: `f40-mid-on-y-axis`, `f40-mid-coordinate`
  Requires: no grid / no multi-point requirement for this group
- `f40-unresolved-marks`
  Objects: none; no reconstructed unknown marks
  Assertions: `f40-no-invented-markers`, `f40-axis-arrows-count`
  Requires: no grid / no multi-point requirement for this group

### fig-41
Spec: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-fig38-41-author/candidate/fig41/spec.json`
Spec SHA-256: `0bdc73bb7c5167cf417233dd503cf47188c381f77ff926968d9092c98299297f`
SVG SHA-256: `79495648a26d2de429c245ff37c1336fdd4a62120defb6549cb3f7ef0f2c6239`
Render report SHA-256: `dad3d8604ccfa27cee726c6548c8d508fe6f2c24349a6c1045dd59930e2e868e`

- `f41-layout`
  Objects: `f41-axis-horizontal`, `f41-axis-vertical`, `f41-label-origin`, `f41-label-x`, `f41-label-y`, `f41-guide-upper`, `f41-guide-lower`, `f41-line-dashed-reference`, `f41-label-pi`, `f41-label-fraction`, `f41-label-upper-a`, `f41-label-lower-a`, `f41-label-positive-condition`, `f41-label-negative-condition`, `f41-point-upper-foot`, `f41-point-lower-foot`, `f41-projection-upper`, `f41-projection-lower`, `f41-curve-main`
  Assertions: `f41-one-curve`, `f41-two-foot-dots`, `f41-five-guide-projection-segments`, `f41-axes-perpendicular`, `f41-foot-horizontal-relationship`
  Requires: pointRelationships
- `f41-axes`
  Objects: `f41-axis-horizontal`, `f41-axis-vertical`, `f41-label-origin`, `f41-label-x`, `f41-label-y`
  Assertions: `f41-axes-perpendicular`, `f41-horizontal-arrow-connects`, `f41-vertical-arrow-connects`, `f41-origin-horizontal`, `f41-origin-vertical`
  Requires: no grid / no multi-point requirement for this group
- `f41-solid-curve`
  Objects: `f41-curve-main`
  Assertions: `f41-one-curve`, `f41-zero-on-axis`
  Requires: no grid / no multi-point requirement for this group
- `f41-upper-guide`
  Objects: `f41-guide-upper`, `f41-label-upper-a`, `f41-label-positive-condition`
  Assertions: `f41-upper-guide-connects`, `f41-upper-guide-parallel-x`, `f41-upper-chosen-level`
  Requires: no grid / no multi-point requirement for this group
- `f41-upper-projection`
  Objects: `f41-projection-upper`, `f41-point-upper-foot`
  Assertions: `f41-upper-projection-connects`, `f41-upper-projection-displacement`, `f41-upper-foot-on-axis`
  Requires: no grid / no multi-point requirement for this group
- `f41-middle-fraction`
  Objects: `f41-label-fraction`
  Assertions: `f41-zero-on-axis`, `f41-zero-coordinate`
  Requires: no grid / no multi-point requirement for this group
- `f41-lower-guide`
  Objects: `f41-guide-lower`, `f41-label-lower-a`, `f41-label-negative-condition`
  Assertions: `f41-lower-guide-connects`, `f41-lower-guide-parallel-x`, `f41-lower-chosen-level`
  Requires: no grid / no multi-point requirement for this group
- `f41-lower-projection`
  Objects: `f41-projection-lower`, `f41-point-lower-foot`
  Assertions: `f41-lower-projection-connects`, `f41-lower-projection-displacement`, `f41-lower-foot-on-axis`
  Requires: no grid / no multi-point requirement for this group
- `f41-tall-dashed-reference`
  Objects: `f41-line-dashed-reference`, `f41-label-pi`
  Assertions: `f41-pole-connects`, `f41-pole-coordinate`, `f41-pole-parallel-y`
  Requires: no grid / no multi-point requirement for this group
- `f41-unresolved-print-marks`
  Objects: none; no reconstructed unknown marks
  Assertions: `f41-two-foot-dots`, `f41-axis-arrows-count`
  Requires: no grid / no multi-point requirement for this group

## Retained HOLDs and Accounting

Original-page/extraction fidelity, unknown source codepoints/scales/coordinates/end intent, upstream science comparison and independent output/display review remain unresolved.
No record_review, durable promotion, edition finalize, browser/display interaction, network, paid generation, DB, Git, install, backend, chat, managed-workspace or new-agent operation.
Source model views: 4/4 unchanged; parent: 24/24 exhausted. No reset, reopen, ROI/crop, new model payload or output image view.
Native original PNG-header reads: exactly 4, only the four official context builders; parent headers 0. Their four SHA reads are separate byte work.
First renders: 4; preview PNGs created: 4; extra render/converter calls: 0.
Charges supplied/carried: 74; paid calls: 0; fees UNKNOWN; complete 0; approvals 0.
All exec/child sessions exited; no running session is needed.
Failures retained: []
