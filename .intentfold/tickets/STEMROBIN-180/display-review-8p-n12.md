# STEMROBIN-180 n12 Display Review

Verdict: **REVISE (display checker); remaining coverage HOLD, not PASS.**

## Scope And Execution

- Authorized DISPLAY ONLY, same independent reviewer; no source, text, math, option, or answer review replay.
- All commands used `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
- Ran the existing script exactly once through `.tmp/180-7-n12/run_stage.mjs`, without a surface argument. Intended coverage: desktop 1440x960 and mobile 390x844, each text/exercises/choices.
- Receipt: modern lesson `production-evidence/display/execution.json`, 2026-11-23T08:17:43.372Z through 08:17:44.722Z, exit 1, no signal. No retry, bypass, checker edit, or dependent production action.
- Only `display/first-desktop-text-failure.png` and its JSON were generated. All generated screenshots (1/1) were inspected once; the other five were never generated. No `check.json` or passed-surface result exists.

## Finding D12-DISPLAY-1

**REVISE, technical assertion mismatch:** `.intentfold/tickets/STEMROBIN-180/tmp/180-7-n12-display.mjs:56` removes whitespace from the H1 and expects `加速度匀加速运动`. The actual normalized H1 is `12.加速度匀加速运动`. The rendered HTML contains `<h1>12. 加速度　匀加速运动</h1>`; the lesson title metadata, inspected only as a scalar for this failure, is `加速度　匀加速运动`.

Narrow repair for the parent: change only this checker's expected normalized H1 to `12.加速度匀加速运动`, retaining exact title matching. Do not remove the displayed lesson number or change lesson content to satisfy the checker. Preserve this first execution receipt, stderr, failure JSON, and screenshot. No repair was applied by this reviewer.

The assertion fails before runtime metrics collection. `passedSurfaces` is empty and `metrics` is absent. This is not evidence that the lesson body, options, or answers failed.

## Actual Visual Result

- Desktop text failure screenshot: original 1440x5213 full-page PNG. Numbered heading and body text are legible, with ordinary/bold/italic text distinguishable. Formula glyphs render rather than raw markup; no obvious overlap, horizontal clipping, or blank region is visible in this screenshot.
- Seven horizontal section dividers are visible, including the divider after the separate scientific footnote. The page ending and both navigation links are visible without obvious clipping. These are visual observations, not a new source/content approval.
- Static display CSS declares H1 `1.6em`, prose `1.06em`, prose math `1.1em` relative size, `KaTeX_Main` for `.prose-math`, prose indent `0`, line height `1.95`, and section border `1px`. Actual computed pixel sizes, loaded family metrics, scroll-width equality, and bottom-scroll assertion remain unverified because the checker stopped first.
- Exact runtime counts of 48 paragraphs and boundary indices `[2,10,16,21,26,31,40]` remain HOLD. No recount or semantic adjacency review was substituted for the authorized display check.
- Complete rendering of 8 written answers, 7 choices/28 options, disabled/unselected controls, absence of key/rationale leaks, and mobile wrapping remain HOLD: those surfaces were not reached.

## Surface Verdicts

| Surface | Verdict | Evidence |
| --- | --- | --- |
| Desktop text | REVISE checker; visual observations only | Preserved first failure PNG/JSON |
| Desktop exercises | HOLD, not reached | No screenshot or metrics |
| Desktop choices | HOLD, not reached | No screenshot or metrics |
| Mobile text | HOLD, not reached | No screenshot or metrics |
| Mobile exercises | HOLD, not reached | No screenshot or metrics |
| Mobile choices | HOLD, not reached | No screenshot or metrics |

## Bindings And History

Durable bindings: modern lesson `display/review-bindings.json`. The lesson root is `ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s2-n12/`.

- Executed script SHA256: `c47bf0f4d4976eaf6b7373f926cfad1a8ae0689fd614389af44771897a4834c0`.
- Failure screenshot SHA256: `01ac91380670b783b24817e6b8f57f056db6c8c0c8130f8285873fef3abc7c6b`.
- Failure JSON SHA256: `528f0a479e25927525857eb1d6dcd46e5afc03e322c768789858b72de68208cb`.
- Execution receipt SHA256: `e72df391ee251215af3eb0e847e464433b6f1f25e1c1e1bad22f2dfe9a4269a4`.
- The failure JSON itself binds rendered `text.html` SHA256 `7741e6201baeb058008a043664521d158ff1d4161667243c67c12be5a6f25506`. Other input/render hashes in the bindings are post-execution observations, not script-issued all-surface approvals.
- Approved answer snapshot remains mode `0444`, SHA256 `8031d97517078a674eb275e8421c7f4e3889c37072c4166fe646e27995f968c8`. It was hashed, not semantically reopened.
- Earlier source/modern/blind/internal approvals, the initial sign-stem failure and affected repair, and the parent's first answer-copy PermissionError remain historical evidence. Nothing was overwritten or reclassified; earlier counts/cost records remain authoritative. This phase adds one failed display execution and no fabricated cost measurement.
- Image ledger: prior 11 + this phase 1 original failure screenshot + 0 crops/reopens = **12/24 cumulative**, **1/8 this phase**. No source images or image payloads returned.

Stop: no overall display PASS; dependent stage remains stopped pending the parent's narrow checker repair and subsequent authorization. No content edits, script copy, finalization, render rerun, DB, Git, install, worker, chat, or timer creation.
