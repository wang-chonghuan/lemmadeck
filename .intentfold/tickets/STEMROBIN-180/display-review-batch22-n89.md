# Batch22 n89 Independent Display Review

Verdict: **FAIL, display only**. Two concrete presentation defects; no edits.
Reviewer: independent Codex n89 visual-only context, non-author.
Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Evidence frozen: `2026-11-16T11:25:07Z`.

## Findings

1. **DISPLAY89-1 / P2: detached figure-223 caption.** In
   `phy7-c1-s1-n89-text-1440.png` and `phy7-c1-s1-n89-text-390.png`,
   at the bottom of section 2, the exterior thermos labeled 1 is followed by
   the cutaway labeled 2/3/4/5 without its caption in between. Both captions,
   figure 223 then figure 224, are stacked beneath the cutaway and above
   the navigation buttons. This visually attaches the figure-223 caption
   to the wrong image and makes the two figure references ambiguous.
2. **DISPLAY89-2 / P3: exposed emphasis syntax.** In the same two text
   screenshots, section 1's greenhouse explanation visibly shows literal
   paired asterisks around the visible-radiation term in the sentence about
   sunlight passing through glass and around the invisible-radiation term
   in the later sentence about heated soil. The prose is readable, but
   formatting delimiters remain in the learner-facing text.

No cause was inferred from code and no repair was attempted.

## Visual Coverage

The six fullpage screenshots cover text, exercises and choices at viewport
1440x960 and 390x844. Two existing mobile figure screenshots complete the
eight-image batch. Each was opened once at original resolution.

Both written tasks are complete at both widths, including the final question.
Both choice questions, all eight options and all eight unchecked radios fit.
The final choice question and final D option are fully visible in both fullpage
choice screenshots. No visible key, correctness marking or internal answer
metadata is present. This does not assert anything about client payloads.

Headings, Chinese prose, numbering and the temperature expression are legible.
No unintended obscuring overlay, collision, horizontal clipping or missing
bottom content was observed. Mobile headings and option lines wrap cleanly.
Both thermos figures are nonblank, proportionate and complete. Label 1 and
labels 2/3/4/5 are legible; their leaders and bottle bases are not clipped.
The caption placement and emphasis delimiters above prevent a display PASS.

## Reused Evidence

The existing offline report is PASS for both n88/n89, with 12 results,
including the six n89 surface/viewport results. Its raw SHA-256 is
`d5331b225623ad0644b1ba59bc55b1a9370b0e719a56648fd6aa091663a783a0`.
The user's declared single successful offline-check run is reused; reviewer
reruns are zero. No HTML, render or screenshot was regenerated.

The existing n89 SOURCE-answer, TEXT, FINAL, CHOICE and figure223/224
semantic reviews are reused. Their exact paths and current raw SHA-256
values are frozen in `inputs-manifest.json`. No task was re-solved, no
source pixels or original/canonical lesson files were opened, and no new
source, text, answer, choice or figure-domain approval is claimed.
Two unrelated source-review reports were read as discovery text only;
neither is used as n89 approval or to alter an existing blocker.

## Exact Screenshots Read

All eight files are under:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-batch22-7p-8889`.
Order, raw SHA-256, byte counts and PNG dimensions are also frozen in the
owned `inputs-manifest.json`.

| Read | Existing Screenshot | SHA-256 |
| --- | --- | --- |
| 1 | `phy7-c1-s1-n89-text-1440.png` | `4d206e1335443aa120356fc0866be40f6f0f6f0b025924a35aff744c56f692a7` |
| 2 | `phy7-c1-s1-n89-text-390.png` | `8e9d5aefae354613546af6882a768020f5137f7cf4a8856a6d32a0b1da1a25e7` |
| 3 | `phy7-c1-s1-n89-exercises-1440.png` | `382d97ad9e3e5ccce499f781cd48eca519c8771ac0d76b2feb4f515a4bdf85a3` |
| 4 | `phy7-c1-s1-n89-exercises-390.png` | `4452461636cb24ceea8c154a60cadca3af44f680d0eec1f81c3dcc3471aa7867` |
| 5 | `phy7-c1-s1-n89-choices-1440.png` | `d728b584573d58bcd3f45c5be7102466a3f7e16febb17caaf2ae54e0d28960e7` |
| 6 | `phy7-c1-s1-n89-choices-390.png` | `f2c249fa237d473190dd8468066c77d8f1c5a3519fa648440eff08ce6234eced` |
| 7 | `phy7-c1-s1-n89-text-390-fig-223.png` | `e0497bb3397b2077e13a013044ca7ee8753bc032ba7c5956300f2b754b5a645e` |
| 8 | `phy7-c1-s1-n89-text-390-fig-224.png` | `5bb7e0625eea77e95b3056ca029b976167c6277adf135422b4b629c231886f92` |

## Counters And Boundary

Written tasks 2; choice questions 2; options 8; radios 8; figures 2.
Entry images 0; screenshots read 8/8; final context images 8/24.
Fullpages 6; existing media screenshots 2; reopens 0; new crops 0;
new source pixels 0; image payloads returned to parent 0.
One display review; new domain reviews 0; gate reruns 0; repairs 0.

Only this ticket report and the owned reviewer root were written:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/display-review-batch22-n89`.
`inputs-manifest.json` freezes inputs; `review.json` records observations
and findings; `reviewer-handoff.json` binds both files and this report by
raw SHA-256. All other worktree changes remain untouched.

No app, dependency, tool, canonical, Git, database, publish or backend writes.
No browser/render/content/source/figure gate was rerun. No browser or CUA
was used; user-owned browsers were untouched. No exec session, browser,
background job or follow-up action remains inflight. This is not n88 visual
approval, canonical approval, publication or whole-ticket handoff.
