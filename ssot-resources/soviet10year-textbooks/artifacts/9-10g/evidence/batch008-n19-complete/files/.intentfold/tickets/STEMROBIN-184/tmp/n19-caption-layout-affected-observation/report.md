# STEMROBIN-184 n19 affected caption display observation

## Result

**AFFECTED_DISPLAY_PASS**, limited to the four explicitly authorized saved
screenshots. Both repaired Figure75/76 captions directly follow their own
media at desktop and mobile sizes, without intervening section text. Both
figures are complete and legible. The original written screenshots visibly
contain all six labels186..191 and their parts, without clipping, unintended
overlap or answer-entry controls.

The initial report remains **STOP_DISPLAY_FAILURE**, unchanged:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/n19-first-offline-display/report.md`
SHA256 `8f4a3e21fd363e75d114ce402ba38cda229808ae79aa98fbcb17d602d69c2a9d`.
This new scoped result records the authorized affected observation after the
parent's single caption-only repair; it does not rewrite the first failure.
No source fidelity, mathematical truth, answer, choice or semantic approval.

## Observation Ledger

Exactly four `view_image` calls, each with detail`original`, no crops/reopens.
All calls occurred after the pre-observation hash checkpoint
`2026-11-16T20:10:22.761Z` and before the post-observation UTC checkpoint
`2026-11-16T20:10:59Z`. Individual image calls expose no tool timestamp.

1. **Repaired text1440**: full1440x2219 raster, viewport1440x960.
   Figure75's a/-a labels, both overhead vector symbols, both shafts and both
   arrowheads are fully visible; the upper right shaft end and lower/right
   arrowhead are not cut off. Its caption is directly below the media, before
   the section divider and section2. Figure76's A/B/O labels and all three
   shafts/arrowheads are visible, including the rightmost O label and bottom O
   vertex. Caption76 is directly below this media and above the navigation
   button. No section prose interrupts either figure-caption pair.
2. **Repaired text390**: full390x2221 raster, viewport390x844.
   The same complete Figure75/76 objects and labels remain readable within the
   narrow page. Caption75 follows its drawing before the divider/section2;
   caption76 follows its drawing before navigation. Labels, captions and
   surrounding prose do not collide; no right/bottom figure object is clipped.
   Visible vector glyphs and text remain legible. No formula truth was judged.
3. **Original written1440**, previously never opened: full1440x1008 raster,
   viewport1440x960. All six numbered tasks186..191, including their last lines
   and all visible numbered parts, fit inside the content column. Rightmost
   formula endings and the bottom191(2) prompt are complete. Separators and
   task labels remain distinct from body text. No visible input/textarea,
   answer box, option control or submit button; only return-to-text navigation.
4. **Original written390**, previously never opened: full390x1272 raster,
   viewport390x844. All six labels/parts are present and legible; long prose
   and formulas wrap without obscuring adjacent tasks. The heading wraps to a
   second line but stays within the page, above the metadata. Task189's
   follow-up question is visible across wrapped lines. Task190's formula and
   both parts of191 are complete, including the bottommost question. No
   clipping, unintended overlap or visible answer-entry control.

No interactive action was taken. These are observations of complete saved
full-page screenshots, not fresh browser measurements or live product behavior.

## Written Coverage

This is a display inventory, not a source or mathematical comparison.

| Task | Visible Parts On Both Original Written Images |
| --- | --- |
| 186 | Prompt and numbered1),2),3) vector entries, all complete |
| 187 | Complete proof prompt and its concluding second line |
| 188 | Prompt and numbered1),2),3) expressions, all complete |
| 189 | Proof prompt/formula and the unnumbered follow-up question |
| 190 | Complete prompt and terminal formula, including its rightmost term |
| 191 | Numbered1) proof prompt/formula and2) follow-up question |

Visible vector arrows, minus/plus/equality symbols and delimiters remain
distinguishable on both written images. No raw-TeX error presentation was
seen. This does not approve or solve any expression or proposition.

## Screenshot Hashes

| Image | Complete Raster | Bytes | SHA256 | Loads This Invocation |
| --- | --- | --- | --- | --- |
| repaired text-1440.png | 1440x2219 | 174144 | `e17d2c28b4c92eb9b5c22fa7b1d79d03fcae3254bc3715d3470531525a436472` | 1 |
| repaired text-390.png | 390x2221 | 143324 | `d919f1b234b9a267059bdf9ad4718676d7d8226e9db01b1ed9b02564ae581cc6` | 1 |
| original exercises-1440.png | 1440x1008 | 103032 | `d8fabf2ad769454a6f1b483f582cd1dfcdfa378aca34f94c8cb5d0381ad33a05` | 1 |
| original exercises-390.png | 390x1272 | 93477 | `f43d4617087b88b79bcf92aa2cdc147fab2e076666711d28b00be30fdba4cf8a` | 1 |

Repaired images reside in
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/n19-caption-layout-repair/`.
Original written images reside in
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n19/`.
The ledger and hashes JSON retain each full absolute path.

## Reused Evidence

- Parent completion:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/n19-caption-layout-repair/completion.json`,
  SHA256 `6fdb0df9e634fe002b0fcb8fbce7686d283e6b016a4b5300720a766ba46db890`.
  Its status is `CAPTION_LAYOUT_MECHANICAL_PASS_VISUAL_PENDING`.
  It records unchanged HTML outside captions and unchanged exercisesHTML
  SHA256 `f681c69ad420c2b7b67c5aa013278406536416e40fd16d8c32259c527dae8959`;
  repaired textHTML SHA256
  `d98da1ec2367502f6185abaa6f9e30b5825f4dc4a10b26eacc9372a7dd434fcb`.
  Parent separately reported all six caption-only fixturesPASS. Those
  contracts and protected modern/source/answer/spec/SVG records were reused,
  not rerun or independently re-reviewed here.
- Original script report:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n19/report.json`,
  SHA256 `65a40d7c33206a2fe5fa23651ce4bda7ea475347214b3d47631a100f10b48fd4`.
  Its original once-only exit0, paragraph/exercise counts, no-input/error,
  label-fit and page-width assertions are reused. No new measurement is
  claimed. The repaired caption geometry is the parent's recorded measurement,
  consistent with the four actual image observations here.
- Original report, observation, manifest and execution records were hashed
  for preservation; no initial failed text screenshot or old mobile text
  screenshot was opened. Preservation identities are in `hashes.json`.

## Budget And Scope

Prior image loads1; newly authorized loads4; cumulative**5/8**. Three loads
remain reserved for a later unique choice display only with parent approval.
Zero new images captured, unexpected scrollshots, reopens, crops or source-image
loads. Hashing PNG bytes is not a further image observation.

Only this new report, ledger and hashes were written in
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/n19-caption-layout-affected-observation/`.
No browser/offline/render rerun, second repair, source/answer/choice/math gate,
source-image access, Git, DB, network, server, model, native UI or user-profile
operation. No other worker's files were edited or reverted. This is a scoped
offline display result, not a complete-lesson, semantic, live-app, interaction,
judging, persistence or publication approval.
