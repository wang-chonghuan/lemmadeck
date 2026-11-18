# Independent Affected-Only Answer DISPLAY Layout Observation

Verdict: **LIMITED_PASS_DISPLAY (affected-only, current static pixels)**.

All six current manifest PNGs were actually inspected once. In the specified
formula regions, the visible line starts, right-hand endings, closing
parentheses/braces, implication/equivalence and plus/minus symbols fit within
the captured page without horizontal displacement. No visible overlap,
hidden target row, or right-edge truncation was observed. This is a finite
static-layout approval, not an exhaustive glyph or mathematical-content pass.

## Scope and Budget

- Date: 2026-11-18. Reviewer is not the candidate author.
- Sole worktree: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
  Every shell call explicitly used this exact root as its workdir.
- Branch `codex/STEMROBIN-182-textbooks` is the human-specified context;
  no Git command was used to independently verify it.
- Read the `ld-s10y-image` batch rules and `production-resume.md`, current
  manifest, and the two prior FAIL reports as text. Source/HTML bytes were
  read for hashing only, not mathematical review or token comparison.
- Actual image loads: **6**, each exactly once with `detail: original`.
  Batch **6/8**; fresh-context image total **6/24**.
  No crops, reopens, transformed images, old PNGs, or other images.
- Only the specified n5/n6/n8 formula regions were judged. Incidental
  full-page visibility of other content does not approve that content.
- No gate, renderer, browser, DB, Git, network, other-agent/chat, or
  publication operation. No mathematical re-solution.
- Only this new report was written. Candidate files, manifest, rules and
  prior reports remain read-only. Returned image payload count: **0**.

## Hash Verification

Current manifest SHA-256:
`1b2c63e0fc0a30294cd78aaffb8f39129c4ff4d0734a7b27f36a98e6e11958d5`.

All **12 unique current bound files** match their manifest SHA-256:
3 answer sources, 3 HTML files, and 6 PNGs. The six manifest entries give
18 source/HTML/PNG references because each source and HTML is shared by
its desktop/mobile pair. PNG dimensions below were read from PNG headers.
The manifest's viewport dimensions are not full-page bitmap dimensions.
Neither hashes nor the manifest's DOM assertions replace pixel observation.

## Six Actual Pixel Observations

| Current PNG | Capture viewport | Actual PNG | Observed affected regions |
| --- | --- | --- | --- |
| n5 layout 1440 | 1440x960 | 1425x3325 | 70(d)'s A/B and C/D rows include the final `D=(1,0)` parenthesis; 71(a) shows the implication and both factor closings through `=0`; 78(b) shows the equivalence and `(x-1)^2=100` ending. 79/80 each show the point-list rows through their final pair, with visible plus/minus symbols. No target collision or clipping observed. |
| n5 layout 390 | 390x844 | 375x5473 | The same affected strings are visible in their divided rows within the mobile page. 70(d)'s final D pair, 71(a)'s complete right-hand product, 78(b)'s lower equivalence row, and the final `(\pm4,16)` / `(\pm4,-8)` pairs are visible with closing parentheses. Rows and adjacent prose remain distinguishable under 70/71/78/79/80. No horizontal recovery image was needed. |
| n6 layout continued 1440 | 1440x960 | 1425x1798 | 83(c) shows the two condition rows, including both natural-number membership symbols and the closing set brace. 83(d) shows four rows of two ordered pairs, including the last `(6,-1)` closing parenthesis and the visible outer closing brace. The multirow groups remain distinct from the adjoining explanation and next answer. |
| n6 layout continued 390 | 390x844 | 375x2719 | 83(c)'s first condition row and lower `10-k` condition are both visible, with the right brace inside the page. 83(d)'s eight pairs are discernible as four rows; the last `(3,-2),(6,-1)` row, final parenthesis and outer brace are visible. No row overlaps the adjacent prose or crosses into the next answer. |
| n8 layout 1440 | 1440x960 | 1425x2685 | 104(a) shows the initial product row, the difference row with both closing parentheses, and the terminal `=0` row. 104(b) shows both squared-factor parentheses, `-4a`, and the lower `=4a-4a=0` row. Each remains associated with its own a/b label and explanation. |
| n8 layout continued 390 | 390x844 | 375x4357 | The same 104(a) three-row identity and 104(b) two-row identity are visible inside the mobile page, including their right ends. The a/b groups, concluding prose and next answer are separated. No target endpoint clipping, hidden row or vertical collision observed. |

The gathered groups have visible vertical gaps between their rows. Some adjacent
prose and subpart labels align with the vertical middle of a gathered group;
this does not obscure the inspected rows or make their answer ownership
ambiguous in these pixels. In the inspected point lists, the plus and minus
strokes of the plus/minus symbols are visible; no claim is made about separate
graph branches or other mathematical diagrams.

## Current File Bindings

All paths below are relative to the sole worktree stated above.
Sources are `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/<lesson>/answer-keys.json`.
HTML and PNG basenames are under `.intentfold/tickets/STEMROBIN-182/tmp/resume182-3/`.

| Lesson | Source SHA-256 | HTML basename | HTML SHA-256 |
| --- | --- | --- | --- |
| alg7-c1-s2-n5 | `84e66483ef0b634debbe9635899baa94377c28bfaa8faef90cc9658ec85cd4cc` | alg7-c1-s2-n5-answers-layout.html | `81df0bde37b6cb74b77341d2aefb76602a0619c5cea49f2e26ba2ba87840dc81` |
| alg7-c1-s2-n6 | `2be06e17fa3c7e926732bfbfa1882608ee19a61247187ccc440e35e917713850` | alg7-c1-s2-n6-answers-layout83.html | `3c40b6e6de214b75bb3321d4e6caf92d7522396adff7e96edebd27fda085936d` |
| alg7-c1-s3-n8 | `fecee5d0a5e1076d95a9e51726e84dd2891e5bb53923dba08cc875ace358f98f` | alg7-c1-s3-n8-answers-layout.html | `54595c4f215a9d573352631e3c2a89c272e3d7f97ced274993fafded1e41ce54` |

| Actually inspected PNG basename | SHA-256 |
| --- | --- |
| alg7-c1-s2-n5-answers-layout-1440.png | `9fe4a61ac5896f2eedfcf29a63c92ecc4b36dfbea014ae4957fb9660c94dbe18` |
| alg7-c1-s2-n5-answers-layout-390.png | `8fe36cbfc9095cbf4247cd6b24debb34e17994c0acbcf21e13ed58e3663c8b2b` |
| alg7-c1-s2-n6-answers-layout-continued-1440.png | `ab2cc7bfbfc59ca12073d5dc7bdff5ddee2056af0fbd7ed06d3db11c18be52f8` |
| alg7-c1-s2-n6-answers-layout-continued-390.png | `4ff30aaf931ac6b5126c27d61bd841ff087475ceaf771a133ba48e67f056f7c2` |
| alg7-c1-s3-n8-answers-layout-1440.png | `83ddd548571f78d7eb4a33e081b525d81ecb7f40e8fdf1304a3030740c68ef65` |
| alg7-c1-s3-n8-answers-layout-continued-390.png | `b8e3ce67602878be170f1b780d497096d624ee1bbd4c4442a97a0b817138445b` |

## Preserved and Inherited Evidence

These existing manifest bindings match; no old PNG was opened:

| Existing evidence basename | Preserved SHA-256 |
| --- | --- |
| answer-display-review.md | `8be50feb8c2b98b5a811c7043400fd5032378302459ca904115a3f97f01ba070` |
| answer-display-affected-review.md | `997b8c26cfece70812187d291d39b32f474d1031e6290d3d73889ac2a3849e62` |
| answer-display-layout-first-failure.json | `af4b9effc15b8454fbf038d2b342c3f6637f909d56c8fa27b5dcff21436a405d` |

Both prior **FAIL_DISPLAY** verdicts remain historical failures of their
respective captured states. The six old left/right scrolling PNGs are not
the currently reviewed layout. A visible scrollbar is not a requirement
for this review; complete static display without horizontal recovery is.

The n7 desktop and mobile prior **LIMITED_PASS** observations are directly
inherited as authorized, not re-inspected or newly approved. The old report
binds them to PNG hashes `cd610297dec4b973577906668d423df6f91f2a2cd4ed5c0645a1b817d0fbdad3`
and `516d222c4c107ceabe0ae79b75921c633e60d07b8983dfbc350f18f0e2ec24cd`.
Their current bytes were not independently rehashed here.

## Exact Approval Limit

This approves only the observed current DISPLAY layout of 70(d), 71(a),
78(b), the introductory point lists of 79/80, 83(c/d), and 104(a/b) in these
six static captures: their discernible formula rows and endings are visible
without a horizontal recovery state, with no observed overlap or hiding.

Full-page presentation can reduce effective detail. This was not a
native-viewport reading sweep, and no crop or reopen was used to resolve
every small glyph. The target endpoints and row separation were discernible;
every glyph, superscript, numeral, Chinese character and answer was not
exhaustively certified. No exact pixel-clearance measurement is claimed.

The assertion that removing gathered/line-separator layout instructions
leaves all text and mathematical tokens unchanged belongs to the separate
structural reviewer; this report does not independently establish it.
No mathematics, source-figure fidelity, other formulas, whole-answer,
whole-lesson, APP/runtime, touch/scroll interaction, independent writing,
881-corpus, DB or publication approval is granted.
