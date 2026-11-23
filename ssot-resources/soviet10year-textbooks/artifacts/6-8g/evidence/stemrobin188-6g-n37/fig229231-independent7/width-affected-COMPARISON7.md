# N37 figures 229-231: width-only affected comparison

Date: 2026-11-23. Reviewer: independent7. Ticket: STEMROBIN-188.
Status: **pass**, final figure-scoped independent approval.

Sole working root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Only write root:
`.intentfold/tickets/STEMROBIN-188/tmp/n37-fig229231-independent7/`.

This approval applies only to figures 229, 230 and 231, their current bound
source/spec/render/SVG metadata and reused affected offline media evidence.
It is not a native `record_review`, promotion, publication, whole-lesson
approval, running-product test, DB operation or functionality approval.

## Scope And Preserved Basis

This stage compared ONLY width metadata and its bindings. Original independent
source inventories, mathematical/point/label/visual/cultural PASS comparisons,
resolved arrow provenance and both offline-surface PASS comparisons are reused.
No substantive review or image inspection was repeated.

All six prior records remain unchanged and sealed 0444:

| File in the owned directory | SHA-256 |
| --- | --- |
| `SOURCE-FIRST.md` | `07ce12237f2831327e726d4768df1cf0e99fd2858817642ddf4b133aed6b506e` |
| `source-review.json` | `5b02fbc9bd8cf70c405222b478a54ac5505890e1a9104e14420db39610217ce1` |
| `COMPARISON.md` | `a04045398b50de97c3484ec0d08479bf3dd413a777ee4d8782613a877f7584b5` |
| `review.json` | `516a225fad6f0a1e1bef3a882338824fdbb610b394362dfd6f4c727861a10c0a` |
| `affected-COMPARISON7.md` | `0d0e049b3847ed6dbc147d7570a1c4f76de3f9efe7bb0221228c15c163721de0` |
| `affected-review7.json` | `5fcca0c4e82119be18c1001ce41c14b1bc6bbd58e00a001af0b747677f3de388` |

Original HOLD/REVISE findings and the original clearance failure remain
historical evidence. They were not overwritten or reclassified in place.

## Verified Metadata Changes

Let N be
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37`.
Current candidates are `N/figure-width-repair7/fig-N.{spec.json,render.json,svg}`.

For 229 the base is `figure-provenance-repair7`; for 230/231 it is
`fig229231-author7`. Structural comparison of each complete spec verifies that
ONLY `display.widths` differs. Each render report differs ONLY in `spec.sha256`,
which matches its actual current spec. Its SVG hash matches the actual current
SVG and the prior reviewed SVG. Every old native display check is unchanged.
No source, geometry, label, assertion, canvas, display layout, maximum width,
minimum text size or cultural content changed.

| Figure | Current declared integer widths | Actual mobile width retained separately |
| --- | --- | --- |
| 229 | `[280,300,320,331,346,352,480]` | 346 |
| 230 | `[280,294,295,300,320,331,352,480]` | 294.40625 |
| 231 | `[280,294,295,300,320,331,352,480]` | 294.40625 |

Three retained first draft validations in `N/resume7/` name these exact current
spec paths, the authorized W, `--stage draft`, and exit 0. Their stdout records
PASS and stderr is empty. They were inspected as execution evidence, not
replayed. No new native render/display checks at 294, 295 or 346 are claimed.

## Integer Contract Interpretation

The prose FigureSpec contract says actual mobile media widths belong in
`display.widths`. The unchanged native checker, `validate_spec.py:1019-1029`,
requires integer entries. Literal insertion of 294.40625 would therefore be
invalid. This prose/checker inconsistency is documented, not silently repaired
or hidden by rounding.

The prior explicit reviewer guidance accepted this compatible interpretation:
use 346 directly for 229; use integer brackets 294 and 295 for 230/231 while
preserving the exact fractional actual width and actual measured fonts in
separate bound recovery/surface evidence. The implemented metadata matches
that approved interpretation. Neither brackets alone nor the narrower native
check are substituted for actual-surface proof.

The unchanged checker hash is
`f6a11fd2a58a27db7e033321aafa928fa4e57eeb6c4a91164a0a14249792be6e`.
The unchanged prose-contract hash is
`0de03f32aa271aed552d51d41c326911cc1137c17d9217a8f74c0c4b7f7bc3a9`.
No shared checker or contract file was edited.

## Actual Surface Evidence Reused

`N/figure-surfaces7/manifest.json`, both screenshots and its fixture HTML retain
their prior hashes. No screenshot was opened again and no surface was replayed.
Existing surface PASS applies to the exact unchanged SVG bytes and unchanged
media layout/max-width. The manifest's spec hashes identify historical
pre-width-update specs; the verified width-only diff and current spec/SVG/report
bindings bridge those historical hashes to the current metadata. The manifest
is not falsely described as directly naming the new spec hashes.

Already inspected/measured evidence, reused without a new review:

- Desktop: all three media 480 px, all measured labels 34 px.
- Mobile prose 229: actual media 346 px, labels 24.508333333333333 px.
- Mobile exercises 230/231: actual media **294.40625** px, labels
  **20.852890625** px.
- All measured labels exceed 16 px; old native checks, including the narrower
  280 px PASS, remain exactly their original checks.
- Height-only natural capture preserved the measured widths; no layout or
  picture geometry changed.

This remains an offline app-container fixture, not a running product/DB/
functionality/full-lesson test. No new screenshot, product test or full suite
is required for this completed metadata recovery.

## Current Bindings

Paths below are relative to N:

| File | SHA-256 |
| --- | --- |
| `figure-width-repair7/fig-229.spec.json` | `3d8e26ae2a5bcf3afd3b4549bcf803c15a5be5b5e7c1e3937d4be2ae32513c47` |
| `figure-width-repair7/fig-229.render.json` | `12eabd3a042ccd0a299e027682b89b1865855b3356af64c7320670e7a9af1337` |
| `figure-width-repair7/fig-229.svg` | `fbb24f5c3655702d5f5a59bf6aa38faad5db857834ba7591353fe31e61f2b971` |
| `figure-width-repair7/fig-230.spec.json` | `8dcb640d0cbb3132983c7970c56cbb655a01b20ee29682e5ad010c564370bfb2` |
| `figure-width-repair7/fig-230.render.json` | `4b3dccc481b97c83057f17eb49523948c4ea824b4dbfcc2092e7a7abd5270013` |
| `figure-width-repair7/fig-230.svg` | `a06e50e1f3d6b60b70f8f5bfb62b972c600a0c352fad35674fba73e5d72ec72a` |
| `figure-width-repair7/fig-231.spec.json` | `e4d86df3e3718724828c281720367db68921529b07db85e2282a9e9519a70220` |
| `figure-width-repair7/fig-231.render.json` | `88706d219d8a1c4770e94f525d90f3bf2148752c723ab01ea9a56d4076e6bc21` |
| `figure-width-repair7/fig-231.svg` | `f5bf96cbcdb8482be898f80194e90bbdaac212cedd599a1fdfba7383f9294b8c` |
| `figure-width-repair7/recovery.json` | `6fcbda5d0558b8f1e47cd92effadbdd5fd65a8cd7f5179a280189ed9717e46ca` |
| `figure-surfaces7/manifest.json` | `e270b50e3036967f3fb3b13a167491cbdf03ab6798962101b020b424c332e0dc` |
| `figure-surfaces7/surface.html` | `a670f227e165925be12e75ad7d00497d20cf6216742438b89800b0ca2c982377` |
| `figure-surfaces7/surface-1440.png` | `81180ba7547cfcd8877920cdb4d2d97059679b9232ef745203b20e26bb61db81` |
| `figure-surfaces7/surface-390.png` | `2f28232540deb490e05f29af65da91dbee39d4dbf3016e6d91d2095db2adf9ba` |

Current source PNG hashes and approved-text bindings are unchanged from FIRST.
All prior candidate, native, failed-clearance and substantive evidence remains
available through the sealed prior reviews. Current metadata validation receipt/
stdout/stderr hashes and predecessor/current bindings are listed in the
companion width-affected-review7.json.

## Result And Counters

All remaining in-scope findings are resolved under the documented integer
compatibility interpretation. Final independent figure-scoped status is pass.
Original source alphabet, connector arrowhead/directed-vector role and C-speck
role remain UNKNOWN; no new identity or finite-length equality is assigned.

This stage loaded **zero images**. Cumulative: source 3 + output previews 3 +
affected surfaces 2 = **8/8 batch, 8/24 context**. No budget reset, original/
output/surface reopen, crop, source transcription, solving, substantive/
cultural review repetition, renderer replay or reviewer validator invocation.
Only three metadata/binding comparisons and reuse of three retained first
draft-validation results occurred.

Only width-affected-COMPARISON7.md and width-affected-review7.json are new files,
sealed 0444; prior six records remain unchanged. Browser sessions, paid/model
calls, native recording, promotion, app/shared/canonical edits, git/DB/
environment/dependency operations are zero.

The parent may use this final independent result for its separately owned,
current-hash-bound native figure review. This reviewer has not performed native
recording or promotion and does not approve the whole lesson.
