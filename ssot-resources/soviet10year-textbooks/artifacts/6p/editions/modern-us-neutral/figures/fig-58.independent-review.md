# STEMROBIN-180 phy6-c3-s17 fig-58 Independent Affected Review

Date: 2026-11-20.

Outcome: **PASS_AFFECTED_ONLY_WITH_UNCHANGED_PASS_REUSE**.

No actionable defect remains in the authorized changed-board contact scope.
This is a substantive independent affected-only verdict, not an author/native
PASS, official review record, promotion, whole-figure fresh review, or course
approval. The parent must bind this report to the frozen candidate before its
single official recording/promotion stage.

## Authority and Scope

The human directly authorized this missing independent review stage on
2026-11-20. I acted solely as the temporary independent affected-only reviewer.
No production chat, prior reviewer, or supervisor was contacted. No IntentFold
capability, setup, freshness, backend, or ticket-state action was run.

The review addresses only whether the changed loaded-board path bears on both
support tops without penetrating support interiors, retaining central load
contact. Byte bindings were frozen before geometry interpretation or image
viewing. A recursive structural comparison of failed/current FigureSpecs found
exactly one changed JSON pointer: `/objects/10/d`, object `b-board`. All other
object properties, labels, assertions, source inventory/text, and edition
lesson/exercises are unchanged. Saved SVG XML contains that exact candidate
path, with `stroke-width="3"`, opaque paper fill, an identity `scale(1 1)`
ancestor, and a 640 by 640 viewBox; no hidden transform changes the diagnosis.

I read the image skill, its quality gate, and the production-resume contract.
The quality gate requires actual geometry and visual inspection rather than
render PASS alone. Recovery requires reuse of passed stages, preservation of
failures, affected-only review after content changes, and no usage reset.
This directly authorized narrow review therefore does not reopen the source
PNG or redo the already-completed full source/text review.

## Independent Geometry Findings

Coordinates below describe modern saved-SVG screen layout, not source-given
measurements. For the retained support/load polygons, screen y = 640 - spec y;
the board's SVG `d` already uses screen coordinates. The actual saved SVG
support polygons are x80..170 and x470..560, y435..575. The retained load
polygon is x285..355, y395..475.

The prior failed main upper quadratic ran from (125,425), control (320,525),
to (515,425), with a parallel lower edge 10 px below. At both inner support
edges x170/470, its upper/lower boundaries were approximately
y445.414201/y455.414201. Thus even the upper boundary was below the y435 top:
this was real board-body penetration, not an outline or scale issue. The prior
FAIL is valid and remains preserved; it is not retrospectively relabelled PASS.

The current path separates each support-bearing portion from the free central
span. Over x125..170 and x470..515, its upper edge is y425 and lower edge y435.
Each 45 px bearing segment therefore lies directly on its support top, with
the whole 10 px body above the support interior.

The outer curved tips were also examined, not just contact anchors. On the
left outer segment with t in [0,1]:

- x = 80 + 44t + t^2, strictly increasing;
- upper y = 410 + 24t - 9t^2, increasing from 410 to 425;
- lower y = 420 + 24t - 9t^2, increasing from 420 to 435.

The y derivative is 24 - 18t, always positive on this interval. Consequently
every part of the board over x80..125 is at y <= 435. The right outer segment
over x515..560 is its exact reflection x -> 640-x and has the same bounds.
Together with both bearing segments, this proves the whole filled strip over
the complete support ranges x80..170 and x470..560 stays at or above y435.
It does not intersect either open support interior. Corresponding upper/lower
control points have identical x and y separated by 10 throughout; vertical
end closures and monotone x make a simple, non-self-crossing strip. The 3 px
coincident outlines at bearing contact are shared boundary ink, not the old
diagonal board body crossing into the blocks.

The changed central span is x = 170 + 300t, upper y = 425 + 200t(1-t), lower
y = 435 + 200t(1-t), for t in [0,1]. Its upper/lower y ranges are
425..475 and 435..485. All downward sag below the support top occurs in the
free interval 170 < x < 470, not inside a support. At t = 1/2, x320, the upper
edge is y475 and lower edge y485; the retained load bottom remains y475.
Central separation is zero, just as before the repair. The saved full frame
shows the load meeting the board with no floating gap.

These conclusions were derived independently from the old/current path control
points and actual saved SVG attributes. The author analytic-contact-proof
file was hash-bound only, not adopted as an independent verdict. Its native
sampling statistics do not substitute for the complete continuous-path
argument above.

## Actual Viewing

Exactly the three `authorActuallyViewed` neutral frames were opened, once each,
using `functions.view_image`, in one bounded parallel group. No source image,
other native frame, crop, or reopened image entered this review.

1. Desktop full: `fig-58-640-neutral-full.png`. Both support-bearing regions
   are clear: the board underside follows each support top before curving
   into the free span. The central load visibly meets the board. The old
   diagonals crossing the support bodies are absent.
2. Mobile left: `fig-58-306-neutral-left.png`. The complete left support and
   its inner-edge transition are visible. The underside bears on the top;
   the free-span curve starts at the inner boundary rather than through the
   block. The clipped central area is not treated as a full-load inspection.
3. Mobile right: `fig-58-306-neutral-right.png`. The right support and bearing
   transition are visible at the saved opposite scroll endpoint. The board
   is above/on the top, with no body cutting through the block.

Actual image opens: **3**. Reopens: **0**. Crops: **0**.
The absolute paths, byte lengths, and SHA256 values of those exact frames are
listed in the binding appendix and final manifest.

## Unchanged PASS and Existing Evidence Reuse

The frozen `figure-58-blocker.md` preserves the prior full independent source
inventory and all unaffected PASS checks. Those checks, including the unchanged
upper setup, source counts/structure, other apparatus/force objects, labels,
source text, edition text, exercises, cultural checks, and typography, are
reused rather than reinterpreted. The approved lesson and exercise byte hashes
match that prior independent report. They were hash-checked, not text-reviewed.
The source PNG was hash-checked only; its pixels were not opened.

The existing render report is PASS and binds the exact current spec/SVG.
The existing native evidence is explicitly native-only pending independent
review: 6 surfaces and 9 saved frames, with 640 px media, neutral/accent/print
themes, and mobile scroll end334. All nine existing frame bindings and the
unchanged product CSS binding were checked as bytes; only the three neutral
frames above were visually opened. Native evidence and metrics are reused,
not described as a new browser run or a fresh theme/typography review.

No browser, rasterization, screenshot, render/validate replay, original-PNG
view, fig-59 review, answer/choice/source/TEXT review, repair, paid/model/network
call, additional agent, DB write, Git operation, or production promotion was
performed.

## Failure and Budget Preservation

Original correction usage remains **1 of 1**. One additional delegated contact
correction, retained as authorized in the frozen author package, makes
**cumulative correction events 2**. This review performed no correction and
resets no content, image, or paid-call budget. The historical FAIL, failed spec,
recovery package, author/native receipts, and all other workers' edits remain
untouched. Original failures are preserved as historical evidence even though
this changed candidate now passes its authorized affected scope.

All writes are confined to
`/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-independent-r171`.
Every shell call used that checkout as explicit workdir. Recorded commands use
the unchanged existing `run-command.mjs` with unique `r171-fig58-review-*`
labels. Because its default receipt directory lies outside the permitted
review folder, an in-scope `--import` shim redirects only the recorder's
receipt-root `path.join` result. The recorder itself is not edited and receipts
name their actual in-scope paths. The initial contract/recorder/manifest reads
were read-only bootstrap inspection; no outside file writes occurred.

The final manifest binds this report, frozen inputs, independent continuous
geometry analysis, exact viewed frames, reused evidence, tool scripts, and
completed command receipts. A separate final seal binds the report and manifest
by actual absolute path, byte length, and SHA256 without circular self-hashing.
Only the parent may perform the once-only official recording/promotion after
binding; this reviewer stops after this one review.

## Frozen Binding Appendix

| Role | Actual Absolute Path | Bytes | SHA256 |
| --- | --- | ---: | --- |
| authorManifest | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/final-candidate-manifest.json` | 5082 | `bce9f025cf4dbbfbcea49621b231985726aaf18fe72b9c30612d5ed94d33ab00` |
| input.recovery | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/recovery-manifest.json` | 2579 | `b6ecbe793096a50359ea867da321374c6e41969b5ea2a9c9a4f68cfeea549b7c` |
| input.candidateSpec | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/fig-58.spec.json` | 14101 | `d050d4e0841e66408decbf7afff784d0182bb62dae6ec3ad8fc2d844587623a4` |
| input.candidateSvg | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/fig-58.svg` | 32722 | `7d7ad6cf10c8b37141a17d7d6eb68ca525a90f1a07fb07995d16a4986f8e97d0` |
| input.render | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/fig-58.render.json` | 1032 | `74bb2ba55fd35dedd428b582a969e41baeaabb8b250e3db902ea0925066d1fa7` |
| input.native | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/native.json` | 10719 | `444b9dc3f05eee5fd96f25bcaa0163b04239456e606243d5c9d55a5ee6bc6a10` |
| input.analyticContactProof | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/analytic-contact-proof.json` | 3013 | `55b5209c137def1075c5951db9fd8c2474b40db0e6d6d7362c0287ba2d3a1863` |
| input.source | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-58.png` | 11533 | `1a578460ea64c04c140c0294fd50678dfc189ac971d85ccb38a30b9edc89a0f4` |
| input.priorIndependentFailure | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/figure-58-blocker.md` | 4714 | `e9ac2730a9de055e53aa2928ac7cff06bf8655042ef4e7f8d97a70aa4c2e940d` |
| input.approvedLesson | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/known-text-recovery-r166/s17/approved/lesson.template.json` | 13500 | `df47070681d36b1de93c49fa741255fc32ac28ce25d00037bf7f043cb8200285` |
| input.approvedExercises | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/known-text-recovery-r166/s17/approved/exercises.template.json` | 2204 | `41c19d185426aa5a7e77ca89096a9f7393ae41693724dd38fa2ee4fe0a9d1743` |
| input.authorActuallyViewed[0] | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-640-neutral-full.png` | 16623 | `3531211427bb0d90c723f74f62b4ed3a473448fa9d83bbd57dea1ae25cd9b386` |
| input.authorActuallyViewed[1] | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-neutral-left.png` | 6541 | `681f69b61d3df2aa38a97ebb600dfacaa45542771be2ae35b1fd7fdb2c96a08e` |
| input.authorActuallyViewed[2] | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-neutral-right.png` | 10484 | `8c04d98863e1c3875294139f3f0c7c4f696de349d11bed9d1824455996f3a293` |
| input.failedSpec | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/failed/spec.json` | 14061 | `d98c6c3db00e4e17b9d1a262582dbce0019caddc253197113b4bd79d95ea5711` |
| contract.imageSkill | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.agents/skills/ld-s10y-image/SKILL.md` | 12304 | `d31ecbea164b4c5c0ac781146976f50381466ae4a8931486bdb2e92e29015747` |
| contract.qualityGate | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.agents/skills/ld-s10y-image/references/quality-gate.md` | 4183 | `95a8afa8c410d91b5f3810f30780f6552945ab5e20b460e6bde8b6be86828ca9` |
| contract.productionResume | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.claude/skills/ld-s10y-lesson/references/production-resume.md` | 4311 | `8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58` |
| contract.sessionRouter | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/readme.md` | 4096 | `f8dd29bc96c49c08a668dfece3de3fee85dab43f49460ecf3fffe0cb605b1e76` |
| contract.engineering | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/charter/engineering.md` | 14249 | `d4b38ea7ed61f21c70da56d600500f113f9eab8987b9267be6baf905c924977c` |
| inputFreeze | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-independent-r171/input-freeze.json` | 7851 | `7c3e8e08e5f5006c1e257040448dafdf0a8a3e40a1893955e648937a859708e2` |
| independentGeometry | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-independent-r171/independent-geometry.json` | 9348 | `52ba7f15beda1942789d0ebb037e9c385dcef058d4afa49cde82978a70150a10` |
| reusedNativeFrame[0].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-640-neutral-full.png` | 16623 | `3531211427bb0d90c723f74f62b4ed3a473448fa9d83bbd57dea1ae25cd9b386` |
| reusedNativeFrame[1].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-640-accent-full.png` | 16753 | `0fcf3e10c4b298b633d430325dd37ba01e86669481c2b2e073166957b01bbf0c` |
| reusedNativeFrame[2].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-640-print-full.png` | 16623 | `3531211427bb0d90c723f74f62b4ed3a473448fa9d83bbd57dea1ae25cd9b386` |
| reusedNativeFrame[3].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-neutral-left.png` | 6541 | `681f69b61d3df2aa38a97ebb600dfacaa45542771be2ae35b1fd7fdb2c96a08e` |
| reusedNativeFrame[4].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-neutral-right.png` | 10484 | `8c04d98863e1c3875294139f3f0c7c4f696de349d11bed9d1824455996f3a293` |
| reusedNativeFrame[5].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-accent-left.png` | 6546 | `65e020ff6da69a15755c3a8618062181739e8275c041df05d122f80f856924e2` |
| reusedNativeFrame[6].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-accent-right.png` | 10485 | `783b38781e11d5d9e6def3dd84d59da8a07bc3d0a2e452058e0208b416b6d9aa` |
| reusedNativeFrame[7].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-print-left.png` | 6541 | `681f69b61d3df2aa38a97ebb600dfacaa45542771be2ae35b1fd7fdb2c96a08e` |
| reusedNativeFrame[8].binding | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s17-fig58-r167/contact-repair/native/fig-58-306-print-right.png` | 10484 | `8c04d98863e1c3875294139f3f0c7c4f696de349d11bed9d1824455996f3a293` |
| reusedCss | `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/app/src/styles/app.css` | 81851 | `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f` |
