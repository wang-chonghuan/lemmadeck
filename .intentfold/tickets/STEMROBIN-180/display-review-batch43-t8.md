# STEMROBIN-180/C: Batch43 T8 DISPLAY FIRST

Decision: **FAIL**. Single fresh OFFLINE DISPLAY FIRST observation, 2026-11-16.
Candidate `phy7-c1-s2-t8`, Metal Casting supplemental reading. FIRST preserved;
no repair or budget reset. This is not headed, live-product or production acceptance.

## First Finding

**DISPLAY-FIRST-43-T8-1: desktop inline media is 480 px, not the requested 640 px.**
Exact affected units: the text page at desktop `1440x960`, `fig-230` and `fig-231`,
specifically their `.figure-media` widths. Existing `B/report.json` result 0,
media entries 0 and 1, measures both at `480x480`. The current text HTML's
`.figure-media` rule caps width at `30em` with `font-size:16px`, consistent with
480 px. Both figures declare inline instructional layout. Mobile result 2
measures both at the required `358x358`; mobile is not an affected unit.

The visible content is usable at the actual 480/358 widths. This FAIL is the
specified desktop display-width mismatch, not a source-fidelity, artwork,
caption, text-completeness, overlap or unreadability finding. Do not silently
claim a 640 px observation from the viewport width or prior native figure reviews.

## Complete Display Coverage

All eight existing screenshots were enumerated from the report and directory
listing, then opened exactly once at original resolution: text desktop/mobile,
exercises desktop/mobile, then fig-230/231 desktop crops and fig-230/231 mobile
crops. No new crop, image reopen, original/source image, old figure or parent
image payload was used.

Both full text screenshots were inspected completely:

- P1: both introductory sentences are fully visible and separated from the title.
- P2: all three pattern/sand/cavity sentences, bold wood-pattern and flask terms,
  and both numeric figure references are readable with no literal Markdown stars.
- P3: all three sentences are fully present, including the wrapped pouring
  continuation and final extraction sentence.
- P4: the complete shrinkage sentence is present above fig-230, with clear spacing.
- P5: the entire metal-mould paragraph is visible after caption 231.
- P6: both final sentences, all examples and final punctuation are visible before
  the navigation link; neither full-page bottom is truncated.

The title is complete and rendered with strong emphasis on both text pages.
The mobile exercise title wraps cleanly; it does not overlap or clip.

Fig-230 is whole at both actual widths: cap, shoulders, taper, rounded lower end
and curved wood grain remain visible. Fig-231 is whole: flask frame, upper
attachment, solid wood and sand at both sides and below are visible, with sand
contact along the wood boundary. `Moulding sand` points into left-side sand;
`Wood pattern` points into solid wood. The two labels and leaders are readable,
separated and not clipped. The existing composite views show aligned artwork
and SVG; separate layers were not reopened or reviewed again.

Caption `图230` immediately follows fig-230; `图231` immediately follows fig-231.
Each is centered, correctly paired, separated from neighboring content, and in
the accepted order. P5/P6 remain below the second pair on both full pages.

Both empty exercise pages are legitimate: title, page identity and return link,
with zero questions, choices, answer controls, figures or answers. The text
page's `0`-question link is navigation, not an invented question. Read-only
HTMLParser inspection confirms six prose paragraphs, three strong elements,
two inline instructional figures, two embedded PNG elements and one separate
SVG overlay with two labels. Neither sheet contains input/button/form/select/
textarea controls or hidden answer-bearing question content. Unused choice CSS
is not a rendered choice question. The consumed answer document has zero answers.

No visible overlap, clipped content, broken raster or error-only page was found.
These are screenshot observations, not newly measured browser assertions.

## Existing Measurements

The supplied isolated HEADLESS `B/report.json` reports **PASS, four page results**:
text and exercises at desktop `1440x960` and mobile `390x844`.

| Existing text media | Desktop | Mobile | Recorded figure text |
| --- | --- | --- | --- |
| fig-230 | 480x480 | 358x358 | empty arrays; figure has no text |
| fig-231 | 480x480 | 358x358 | 24.375 px desktop; 18.1796875 px mobile, each twice |

All four media ink ratios are positive; all scroll fields are `null`; exercise
media arrays are empty. The minimum recorded figure label size is
`18.1796875 >= 16` px. The report has no measured prose-font minimum and no
explicit img-loaded/complete/naturalWidth, clipping, overflow or console/page
error values. Those absent fields remain **unreported**, not invented zeros or
independent PASS assertions. Visible pixels support the observation that both
figures are nonblank. No headed/live acceptance is claimed.

Both directly hashed current HTML files match their `htmlSha256` bindings in
all four report results.

## Frozen Record

Workspace W: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Existing B:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-batch43-7p-t8/`.

Current E:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c1-s2-t8/`.

Consumed HTML:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/render/7p/modern-us-neutral/phy7-c1-s2-t8/{text.html,exercises.html}`.

Own new evidence:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/display-first-batch43-t8/`.

`first-findings.json` freezes every paragraph's displayed wording and complete
observations, all eight exact screenshot paths/open order, measurements,
affected units, limits and unchanged budget. `input-bytehashes.json` binds
exactly 15 consumed current leaves: four E JSON, B report, eight B screenshots,
two current HTML. `seal-observations.json` records the direct byte-only seal.
`seal-and-manifest.mjs` writes only new own seal/manifest leaves, exclusively.
`manifest.json` has exactly `{workspaceW,files:[{path,bytes,sha256}]}` and lists
the four other own direct leaves plus this ticket report, excluding itself.
No recursive history, inherited manifest or referenced asset rehash.

The full approved text and figure review reports were read only for accepted
inventory identity. All prior FIRST approvals remain untouched; source/figure
fidelity and fig-230's provenance-only asset-path repair were not judged again.

## Return

**FAIL; 6/6 paragraphs, 2/2 figures, 2/2 captions, 0 exercises, 0 invented
questions, 0 exposed answers; four existing browser page results PASS.**
Images opened 8, reopens 0, existing crops 4, new crops 0, context 8/24.
DISPLAY repair budget: initially used 0 / unused 1; finally used 0 / unused 1;
new repairs 0, reset false. Inflight 0.

Only the specified new evidence directory and this report were written.
No browser/render/validator rerun, source/figure review, DB/app/backend,
publish, Git, deploy, automation, handoff, full-project check or user-window
action. Existing candidate, FIRST evidence and concurrent work were preserved.
