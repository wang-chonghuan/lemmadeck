# Batch53 FIRST Independent FIG95 Review

2026-11-17. **Independent visual verdict: PASS.** No targeted defect found.
This substantive report is frozen before the single `record_review.py` invocation.
Its later built-in validation and hash-binding outcome is recorded separately,
without replaying the independent gate or changing historical evidence.
This verdict approves only the frozen FIG candidate, not promotion or the lesson.

## Independent Source Observation

Both durable original PNGs were opened independently at original detail first.
FIG95 original:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-95.png`

SHA-256: `565732d480e1b45e62308d104606a58c0c816182c0efac7e352da88ba931baa0`.

The original is one broad horizontal closed vessel with a wide central dark
piston. Unlike FIG94, its lower face is below the adjacent upper vessel edges.
One white arrow points down inside that piston. Round/ring marks remain in both
side wings and throughout the lower interior, with crowded marks near the
advanced piston. Rough/merged scan ink is not a second substance, a count,
a measured compression ratio or an answer annotation.
No other panels, axes, ticks, force values, pressure values, units or internal
words are present in these original pixels.

## Requirement To Candidate Map

| Independent requirement | Objects/assertions | Assessment |
| --- | --- | --- |
| Same broad sealed vessel and solid central piston as FIG94 | `gas-volume`, `piston`; `gas-width`, `gas-height`, `piston-width`, `piston-height`, `two-apparatus-polygons` | Outer vessel and piston dimensions retained; no rod, outlet or apparatus substitution |
| Piston face advances below surrounding top wall | `piston`, notched `gas-volume`; `piston-face` displacement dy=-42 | Face y=258 versus wall y=300; visible modest intrusion at native widths |
| Gas remains throughout both sides and bottom, but initially denser under piston | `gas-particle-001` through `gas-particle-108`; `all-108-particles-retained`, all individual `gas-particle-NNN-inside` | Same particle IDs conserved; central band is locally compressed, not erased or globally equilibrated |
| Exactly one downward white source arrow inside the piston | `piston-push`, `piston`; `source-push-arrow-count`, `piston-push-connects` | Arrow runs [320,330] to [320,270] in y-up coordinates; native raster shows shaft and downward arrowhead |
| No source numeric data, pressure-transmission answer or internal words | `state`, `piston-label`, `gas-label`; `three-English-identification-labels` | Modern English identification only; no invented values or transmission arrows |

All inventory object/assertion IDs resolve. Each of the 108 sample points has
an `inside` assertion against the actual notched gas region with margin 9.
These unlabelled schematic particles are not a source grid: no exact lattice,
grid count or particle coordinate is claimed as a textbook given.
The visible semantic arrow is covered by its `connects` assertion.

Native geometry's saved `piston-push` rectangle measures the line shaft, not the
full arrowhead (its vertical shaft has zero bounding width). I did not treat
that partial metric as proof of the head; the directly opened raster shows
the complete white downward arrow in all three inspected variants.

## Complete Approved Context And Paired Meaning

Read the router/readme, engineering/operations, product/project, intentfold
routing, image SKILL, quality gate and FigureSpec reference.
The author report and frozen manifest were read without inheriting approval.
Read the complete APPROVED retained lesson prose and all written exercises
only as context for this FIG review, not SOURCE/TEXT re-review.

The retained templates are at
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-retain-pascal-b53/adapt/6p/modern-us-neutral/lessons/phy6-c4-s1/`.
Both candidate authoritativeText arrays match every retained nonempty prose/
caption entry, including the later explanation of uniform final redistribution.
Template hashes: lesson `35705b66ea5975d6f449079d272e08b51846b347e654e730b352dfeec58399e7`;
exercises `523aa0f8d7f4ecf09ac3079f7e615dd8683b950a7d32ac1810edcc9d1ffa891c`;
figures `ec93205833f32f23603589b42a1e477168c37956d8b37dfaa39c09a1fcdbd815`.

The text explicitly places FIG95 at the first local compression beneath the
piston. It discusses redistribution after pushing stops afterward.
The candidate `During compression` state and locally crowded central particles
fit that sequence; it does not falsely show the final equilibrium as locally
uneven. The piston remains advanced, not reset to FIG94.

Both candidates conserve exactly the same ordered 108 modern sample IDs.
Independent coordinate inspection finds 36 changed points, all in the band
x=239.94117647058823 through 400.05882352941177, and 72 unchanged side points.
For example particle-007 moves [244.44117647058823,282] to
[244.44117647058823,243]; the piston face moves 300 to 258.
These are undisplayed author-layout numbers, not physical measurements.
The slight jitter and modern count are openly declared additions.

The three labels `During compression`, `Piston`, `Gas` identify state and objects.
The only arrow is the source down-arrow, not an answer showing transmission
directions. No answer key, equations, invented pressure/force magnitudes,
water-compressibility claim, cultural lettering/symbols, or final-rest panel
was used or added.

## Existing Native Samples

Directly opened exactly once at original detail:

- `native-306-neutral.FIRST.png`: at actual narrow media width, the arrowhead,
  advanced piston, denser central region, side particles and text remain clear.
- `native-640-accent.FIRST.png`: full-resolution complete apparatus; no labels
  touch one another or obstruct the gas/arrow; central crowding is visible.
- `native-640-print.FIRST.png`: the same complete scene remains readable in
  the saved print-role variant.

These names resolve within
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b53-fig94-95/fig95/`.
The other three PNGs were not loaded; all six saved sample records, geometry,
label rectangles, pixel results and exact current hashes were inspected.

| Actual width | Saved themes | Media height | Minimum text | Ink pixels | Black pixels | Edge ink |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 306 | neutral, accent, print | 239.0625 CSS / 240 PNG | 17.212500000000002 | 10049 | 2038 | 0 |
| 640 | neutral, accent, print | 500 CSS / PNG | 36 | 40020 | 17384 | 0 |

All six individual samples say pass. In each, all 108 particle nodes exist and
are visible, vessel/piston/arrow are present, all three text labels contain ink,
labels are disjoint and inside media, and wholePageOverflow=false.
Pixels are nonblank=true and notBlack=true. Current renderer collisions=[]
and both actual-width display checks pass.

The SVG uses semantic ink/muted/paper; accent changes only unused roles, so
theme samples having identical hashes at a given width is legitimate.
`print` is the saved print-role variant, not actual browser print-media/full-page
acceptance. Existing previews were isolated/headless and closed; the reviewer
ran no browser, renderer, screenshot capture or product/lesson acceptance.

## Native Font Failure And Recovery Preserved

`native-preview.FIRST.json` retains overall **FAIL**; original native command
exit=1. All six native samples and PNGs had already completed with **PASS**
before the final expected-zero-requests assertion observed six attempted Inter
CSS font imports. The saved helper aborts every routed request. Successful
external requests=0. SVG text explicitly uses Arial/Helvetica/sans-serif rather
than the imported Inter family.

`native-tool-recovery-01.json` is the existing author-only final tooling
disposition: originalOverallStatus=fail, author-native-evidence-complete,
screenshotReplays=0, contentRepairsConsumed=0, browserClosed=true.
Its disposition command exit=0 does NOT change the original overall failure
to pass and is not independent FIG approval. I retain and accept the completed
native sample evidence on its own merits; I do not call it missing, rerun it,
erase its failure or use the author's pending review flag as a verdict.

## Frozen Candidate Hashes

| File in candidate directory | SHA-256 |
| --- | --- |
| `fig-95.spec.FIRST.json` | `468023c3d584d893829e0127925daeba64b8926943aed319acac82a24323574f` |
| `fig-95.FIRST.svg` | `fcc0ef0c46ae40552060230421d63f43dd3df29bc8803a0004b24ff30fc90da7` |
| `fig-95.render.FIRST.json` | `904ccc9b566244d22a5246593b0fa10c3215018c327642d5232fcacd8c1eae48` |
| `native-preview.FIRST.json` | `0e2e0bf3fb9bf86460280f7467c730fea0dc737391678b4bef45f6f4263578c9` |
| `native-tool-recovery-01.json` | `f18d54d4a41b67299bc4393a11f4d692623bf0fb9d18437a13b5c9ef62452896` |
| `native-306-neutral.FIRST.png` | `685ab75ca441618596474fa6fd598c780ad1dacf82c5fa276867e223cd0326fd` |
| `native-640-accent.FIRST.png` | `a1e60f0b88284420036ce5b1cd8dee5bde222b64aaf43d96e722b4b35c1a5d43` |
| `native-640-print.FIRST.png` | `a1e60f0b88284420036ce5b1cd8dee5bde222b64aaf43d96e722b4b35c1a5d43` |

Manifest `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b53-fig94-95/manifest.FIRST.json`
SHA-256 `b428da36ecaea48f9b5244e25f0e7eb05f0888f2bbf4f28551013d3529d8445a`.
A read-only byte comparison of 89 manifest entries (including repeated candidate
bindings, history and all existing PNGs) found no missing/changed evidence.
No app/tooling global audit was run.

## Single Recorder And Stop

FIG95 geometry repair budget used=0, remaining=1; reviewer repair count=0.
The native tool disposition consumed no geometry repair. Any newly found
defect would BLOCK with targeted findings, not authorize a reviewer repair.

Record using exact absolute arguments and cwd
`/Users/yong/.codex/worktrees/0f12/lemmadeck`, the actual producer cwd against
which the render's relative spec/output paths resolve. They are NOT resolved
against the figure directory. Output is `fig95/review.json`; sibling
`review-fig95/` holds pre-call report hash and exact command/stdout/stderr/exit
and validation receipts. The single recorder's built-in rendered validation
is the only validator invocation authorized here, not an independent replay.
Its result is not presumed in this pre-call report.

The two initial read-only Node summary expressions had syntax errors (exit 1,
before execution); corrected summaries exited 0. No gate failure or content
repair resulted. An empty reviewer-artifact search exit 1 only confirmed that
no prior reviewer report/review.json existed.

Image ledger: sibling `review-fig95/image-ledger.json`. Independent total 8
loads = 2 durable originals + 6 existing native samples across the pair, limits
8/batch, 24/context. No reopens/crops and no further image payload to parent.

Only new reviewer scratch, this substantive report, `review.json` and the
specified ticket review report are written. No candidate/spec/render/history/
manifest overwrite, rerender, gate/browser replay, source/TEXT re-review, Git,
backend, DB, promotion, adaptation finalize, answers/choices, app/dependency/
service/global-check work. Stop after the reports and review hashes.
