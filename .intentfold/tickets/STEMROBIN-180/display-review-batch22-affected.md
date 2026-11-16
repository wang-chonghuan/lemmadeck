# Batch22 Affected-Only DISPLAY Review

Status: **pass**, affected display only, for n88 and n89 at both widths.
Reviewer: session C, sole affected-only DISPLAY reviewer, non-author.
Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Evidence frozen: `2026-11-16T11:35:30Z`.

## Scope And Verdict

Exactly four new text fullpage screenshots were opened once each at original
resolution: n88 and n89 at desktop 1440x960 and mobile 390x844. No previous
screenshots, media crops or source images were opened.

| Lesson | Desktop | Mobile | Affected DISPLAY |
| --- | --- | --- | --- |
| `phy7-c1-s1-n88` | pass | pass | pass |
| `phy7-c1-s1-n89` | pass | pass | pass |

No introduced clipping, collision, obscuring overlay or missing bottom content
was observed in these four text/media displays. Prose and emphasized text fit
their columns. Figures, labels, captions and bottom navigation are visible.
This is not whole-lesson, whole-ticket, canonical or publication approval.

## Finding Resolutions

- **DISPLAY89-1 / P2: resolved in affected display.** At both widths, caption
  223 is directly below the exterior thermos labeled 1, before the cutaway.
  Caption 224 is below the cutaway labeled 2/3/4/5, above navigation. The
  captions no longer stack together under the second image.
- **DISPLAY89-2 / P3: resolved in affected display.** The two formerly
  single-asterisk-delimited terms in section 1 visibly render emphasis
  without literal asterisks at both widths.
- **n88 FIRST P3 exposed asterisks: resolved in affected display.** The
  emphasized radiation sentence visibly renders italics at both widths,
  including clean mobile wrapping, without exposed asterisks. The user
  supplied n88's prior FIRST visual PASS; that report was not reopened.

New findings: none. These are visual observations, not a code-cause diagnosis
or a new semantic, source-fidelity or figure-domain review.

## FIRST FAIL Retained

The original n89 FIRST DISPLAY **FAIL** remains unchanged at:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/display-review-batch22-n89.md`.
Raw SHA-256:
`5160e566a59bf08748815edae74bd225ac11ea47bfdadb0e21349e88773dab51`;
bytes: `5551`. This matches the supplied retained FIRST FAIL hash.
The original finding history is not overwritten or relabeled as FIRST PASS;
this separate report records only the new affected-display result.

## Exact Screenshots

Evidence root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-batch22-7p-8889-affected/`.
Each row names the exact file under that root. The owned
`inputs-manifest.json` also freezes every full absolute path.

| Read | File | Raw SHA-256 | Bytes |
| --- | --- | --- | --- |
| 1 | `phy7-c1-s1-n88-text-1440.png` | `f2aba49cf00be222d59d5f3e261967605317e1bc36eb30f7a2df2416ddf5f3a0` | 575699 |
| 2 | `phy7-c1-s1-n88-text-390.png` | `5fdd62ec29652cafbacf23c43393f716915c40d305bf4ee39fc5831a866b98eb` | 491424 |
| 3 | `phy7-c1-s1-n89-text-1440.png` | `5aa185a5d429bbeabc5dba81777529fbfbac4c5d04b0678b88af6dc5e3600bcf` | 672553 |
| 4 | `phy7-c1-s1-n89-text-390.png` | `be98e96aace63db10be0043aa9f25efc2d1d5f730508a5bfe0431553da118130` | 430734 |

## Existing Mechanical Evidence

The existing native report records `status: pass` with exactly four text
pages matching the observed screenshots:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-batch22-7p-8889-affected/report.json`.
Raw SHA-256:
`22c0c25c300513dd955ebe6338a3636b26d2bcd495c9ec67284c43baa6ed58f5`;
bytes: `3277`.

Existing command receipt:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/batch22-text-display-affected.call.json`.
Raw SHA-256:
`2e3f6fd88921e4d25b6b3d908b2c00186f08357c8047ec84e4fefc13d995c316`;
bytes: `969`. It records exit `0`, from `2026-11-16T11:33:34.422Z` to
`2026-11-16T11:33:36.784Z`. No command was rerun.

## Reuse And Boundary

Prior SOURCE, TEXT, FINAL, CHOICE, figure-domain and original unaffected
surface reviews are reused as authorized, not repeated. No tasks were
re-solved and no source, canonical, HTML, choice or exercise content was read.

The user's repair handoff states: one shared tool repair pairs complete
unique same-run figure/caption labels in htmlfrag proseFlow and renders
single emphasis in both renderers; canonical content/order are unchanged;
the new render is text-only n88/n89; choices/exercises retain exact prior
bytes; no author content repair, choice gate rerun or budget reset occurred.
These implementation and byte-identity claims were not independently
rechecked by this DISPLAY reviewer.

Entry images 0; images opened 4/4; final context images 4/24; fullpages 4;
reopens 0; media crops 0; previous screenshots 0; source images 0;
image payloads returned to parent 0. Reviewer repairs, render/gate/choice
gate reruns and new domain reviews are all 0.

Only this report and
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/display-review-batch22-affected/`
were written. `inputs-manifest.json` freezes inputs, `review.json` records
per-lesson observations/resolutions and explicit `status: pass`, and
`reviewer-handoff.json` binds both outputs and this report by raw SHA-256.
All other shared-workspace changes and the original FIRST FAIL remain
untouched. No app, DB, publish, backend, Git or chat action; no browser,
source/canonical/tool/test/skill edits or other report edits.
No exec session, browser, background job or other work remains in flight.
Return to parent is text paths, hashes and counts only.
