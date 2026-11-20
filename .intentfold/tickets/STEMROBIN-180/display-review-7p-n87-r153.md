# STEMROBIN-180 FIRST Independent DISPLAY: phy7-c1-s1-n87

Verdict: **REVISE DISPLAY ONLY**. One display defect; no whole-course approval.

## Finding

DISPLAY-1: The figure-number captions for figures 219, 220 and 221 are below the requested 16px label minimum on both text surfaces. Each is rendered by `.figcap { font-size: .85em }`, inheriting the 16px base: **13.6px**. The saved native text records additionally contain caption numeric tokens measured at **14.96px**, with **13.6px** parents. Neither value reaches 16px. These are learner-visible labels identifying instructional figures, not private metadata. The issue is label typography only; all three complete figures and their captions are present.

Affected existing evidence:

- `/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/n87-final-stage-r153/display-first/text-1440.png`
- `/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/n87-final-stage-r153/display-first/text-390.png`
- `/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/n87-final-stage-r153/work/render/7p/modern-us-neutral/phy7-c1-s1-n87/text.html`

Required disposition: bring these learner-facing figure labels to at least 16px at both reviewed widths. No repair was made. This finding does not reopen SOURCE, TEXT, ANSWER, CHOICE or FIG review.

## Inspection

The six supplied screenshots were actually opened once each, in this exact order:

1. `text-1440.png`: full lesson heading, all 14 rendered prose paragraphs, five section boundaries, complete figures 219/220/221 in order, final insulation paragraph and bottom navigation visible. REVISE for DISPLAY-1 only.
2. `exercises-1440.png`: full heading, exercise group 43, three complete written tasks in order and return navigation. PASS DISPLAY.
3. `choices-1440.png`: full heading, three complete questions, four A-D options per question, including the final D option. PASS DISPLAY.
4. `text-390.png`: complete heading wraps onto two lines; all 14 paragraphs, five boundaries, three complete figures, complete seven-entry figure-221 legend, final paragraph and bottom navigation. REVISE for DISPLAY-1 only.
5. `exercises-390.png`: complete two-line heading, all three complete written tasks and return navigation. PASS DISPLAY.
6. `choices-390.png`: complete two-line heading, three complete questions and all 12 options, including final D. PASS DISPLAY.

Full-page images were inspected without crops, reopens, zoom derivatives or additional captures. Exact prose inventory and fine typography were supported by a read-only extraction of saved learner HTML and the current canonical lesson prose; visual inspection alone is not claimed to establish every pixel-level font measurement. A first supplementary HTML extraction returned structure but empty text because of a local reader-state error; the corrected read-only extraction returned learner text. This did not execute a renderer, browser, capture or validator.

No missing content, overlap, clipping, positive horizontal overflow, error-only surface or learner-visible internal key was found. All six native records report `lastReachable: true`, no learner-markup leak and no errors. All three figures have positive saved drawing-pixel counts at both widths. Body prose is 16.96px; written-task and choice-stem text is 16.64px; choice-option text is 16px. Figure-221 diagram labels are measured at 36px desktop and 19.29375px mobile. Caption text is separately reported above, not silently treated as satisfying that minimum. Secondary breadcrumbs and navigation are not instructional body or figure labels.

## Binding And Preserved History

Authoritative native manifest:

`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/n87-final-stage-r153/display-first/native.json`

SHA256 `603780c4d7b4d123893bfcec53063d000a2a3756d0fa7ee36f91268e07a7fca5`; 22183 bytes; mode 0444. Its actual bytes and all 19 unique referenced screenshot, HTML and canonical-input bindings matched before the six image opens. Private inputs were opaque-hashed only to verify supplied bindings; no answer, solution, draft or private review content was parsed or exposed. Screenshots and native evidence are 0444; existing HTML and canonical inputs are 0644 and were not chmodded or edited.

Original failed adaptation receipts remain intact, including their 0444 stdout/stderr:

- Runtime failure: `/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/commands/n87-adapt-finalize-first-r153.json`; SHA256 `22fba3738af5dece7b94996535dbc1d07b3feba5b3319a9d105e03f85d93ce06`; 1333 bytes; mode 0444; exit 2.
- Anchor failure: `/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/commands/n87-adapt-finalize-runtime-corrected-r153.json`; SHA256 `80655bc8b4ba24f69147653aceb0f4c4af483257303b71fde8395c01a49c6c94`; 1356 bytes; mode 0444; exit 2.

The existing focused normalization receipt is reused, not replayed: `/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/commands/n87-normalization-focused-r153.stdout`; SHA256 `3dce4ec14b33f83d5c3bbbfb3bbd2e85c008b406018eee3fafd91d30896d6b38`; 348 bytes; mode 0444. It records preservation of all 15 reviewed blocks, 14 rendered paragraphs and five anchors `[3, 7, 11, 12, 13]`, approved document unchanged and no semantic-review repeat. The subsequent heading-corrected adaptation receipt has SHA256 `53a785796e642d26c89559b31e4d9c1b08421ef19c812494d7a476dc4f5ab9e3`, 1355 bytes, mode 0444, exit 0. This display finding does not reject or undo that narrow heading fix.

## Scope And Counts

One batch; exactly six existing screenshot opens; context image count six, within the 8-per-batch / 24-per-context limits. Three surfaces at two widths. Unique content: one lesson heading, 15 reviewed blocks, 14 prose paragraphs, five section boundaries/anchors, three figures, three written tasks, three choice questions and 12 options. Three distinct caption labels below minimum, appearing six times across two affected surfaces; one defect category.

SOURCE/TEXT/ANSWER/CHOICE/FIG219/FIG220/FIG221 PASS reused. Semantic reviews repeated: 0. Source-image opens: 0. Screenshot reopens/crops/new captures: 0. Renderer/browser/checker/standalone-validator executions by this observer: 0. Children spawned or old chats contacted: 0. Paid calls, technical repairs, promotions, production edits, DB/git/merge/deploy/auth/environment/install operations: 0. Browsers remain closed per supplied native evidence; this observer opened none. Whole-course approval: false; complete-course increment: 0; finish remains review.

Only this report and the owned `n87-display-first-independent-r153/` output records were written. The machine review binds all inputs and findings; the output-only manifest binds the frozen report and machine review by absolute path, full SHA256, byte size and mode 0444.
