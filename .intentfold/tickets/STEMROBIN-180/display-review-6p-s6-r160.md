# First Independent DISPLAY Review: 6p / phy6-c4-s6 / r160

Status: **REVISE**

Review date: 2026-11-20.

## Scope and Authority

This is ONLY the first independent DISPLAY review of the completed offline lesson. It is not SOURCE, TEXT, ANSWER, CHOICE, or FIGURE scientific/semantic reapproval. Existing scientific-stage and CHOICE approvals are supplied premises, not verdicts issued here.

Official workspace, used as the exact absolute working directory for every shell command:

`/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck`

Owned outputs are limited to this report and:

`/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-display-first-independent-r160/`

The image batch rules in `.agents/skills/ld-s10y-image/SKILL.md` and technical recovery rules in `.claude/skills/ld-s10y-lesson/references/production-resume.md` were read. This six-image batch stays below the eight-image batch and 24-image context limits and uses the stricter human budget of exactly six image opens.

No canonical content, parent checkpoint, usage record, or existing evidence was edited. No browser, render, native-check rerun, database operation, environment operation, paid service, deployment, commit, worktree attachment, reviewer wake, or agent/chat messaging tool was used. Local hashing and HTML/manifest display-structure inspection are evidence inspection, not a repeated scientific or native check.

## Evidence Binding Before Image Loading

Authoritative native record:

- Absolute path: `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/display-first-r160/native.json`
- Bytes: `21779`
- Full SHA-256: `4a5cd40dabe5d57a4f63d4184afb0d714c8986d67874156fe0fb14de2a67c39c`
- Its exact bytes match the human-specified hash.
- Recorded status remains `PASS_NATIVE_ONLY_PENDING_FIRST_INDEPENDENT_DISPLAY`; this report does not modify that file.
- Recorded facts: `headed=true`, `localOfflineOnly=true`, `allBrowsersClosed=true`, six saved screenshots, one first-native execution, and `errors=[]`.
- The human supplied successful native command exit `0`; the JSON itself has no command-exit-code field. No separate execution receipt or historical report was opened to invent additional corroboration.

Before the first screenshot open, all three declared HTML files, all six screenshot files, and all ten native-bound inputs were hashed locally. Every byte length and full SHA-256 matched the corresponding native entry. Answer keys, answer audits, interactions, adaptation audit, and choice-set files were treated as opaque hash-only inputs; their internal content was not decoded or reviewed.

Only the three already-rendered HTML paths below and the current canonical lesson/exercise/figure manifests were structurally inspected for DISPLAY completeness. No source images, separate figure images, figure specs, scientific reports, historical reviews, or choice internals were opened.

## Concrete Findings

### F1: Mobile Worked Example Is Not Fully Visible

Severity: blocking DISPLAY-completeness defect.

Affected evidence: `text-390.png`, at the final two-column worked example immediately above the two navigation links; corresponding element is the last `p.para` in `text.html`.

The known-values column and divider are visible, but the right-hand solution column is cut at the right edge of the full frame. The substitution sentence and final result continue beyond what the screenshot shows. The complete sentence and trailing result exist in the permitted rendered HTML; this is a display-completeness finding, not an incorrect-calculation finding.

The HTML wraps mathematics with `.nb{display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;...;white-space:nowrap}`. An inner horizontal scroll region may explain the partial presentation. This review did not interact with that region and does not claim that its hidden end is permanently unreachable. Nevertheless, the authorized full-frame evidence does not show all rightmost worked-example content, so the explicit full-frame completeness criterion fails.

The recorded `lastReachable=true` and document-level `overflow=-15` do not contradict this observation: they do not supply an image of the inner math region's rightmost content. Desktop `text-1440.png` shows the complete two-column example.

Required disposition for the parent: ensure the mobile example is completely legible within the authorized display contract, or obtain explicit acceptance of horizontal scrolling with appropriately scoped evidence. This reviewer made no repair and no new evidence capture.

### F2: Ten Written Tasks Have No Displayed Answer Content

Severity: blocking DISPLAY-completeness defect against the stated requirement.

Affected evidence: both exercise screenshots and `exercises.html`.

Both full frames show all ten question/instruction blocks, grouped 5 + 3 + 2, and figures 115, 116, and 117. They proceed to the return-to-text link without displaying answers or a solution appendix. The required "10 readonly written tasks with complete displayed answers" is therefore not established: task display count is 10, displayed answer count is 0.

Structural inspection of the permitted HTML finds ten `.body` task containers, no answer/solution/explanation class or ID, and no answer/solution label in any of those containers. The first six containers contain only the question text; the later containers add line breaks, the existing unit markup, and/or the three figures. The only link is the return-to-text link. This agrees with the images; a label search alone is not being substituted for visual inspection.

The native record counts written tasks but has no displayed-answer completeness field. Hash-binding an existing `answer-keys.json` does not prove that its answers appear in the rendered HTML. The answer-key content was not read, solved, or reapproved.

Required disposition for the parent: expose the already-approved written answers in the intended readonly display, or clarify that complete displayed answers are not part of this acceptance contract. Do not treat this report as an answer-authoring instruction.

### F3: Visible Disabled Choice Inputs Differ From a Literal Zero-Widget Requirement

Severity: DISPLAY-contract/measurement discrepancy; F1 and F2 already require REVISE independently.

Affected evidence: both choice screenshots and `choices.html`.

Small checkbox/radio controls are visible beside all 34 options. The permitted HTML contains 18 checkbox inputs and 16 radio inputs; all 34 have `disabled`, and none has `checked`. They are actual input elements, not newly drawn static symbols.

The native record reports `inputWidgets=0` for every surface. That value is retained exactly as recorded, not silently changed to 34. It does not establish the absence of the 34 visible disabled inputs. This review does not know the native selector's definition and did not open or rerun its checker.

Readonly/non-editable presentation is consistent with the disabled attributes. However, if "no input widgets" means literally no visible input controls, both choice frames fail it. If it means no enabled/editable response controls, the HTML evidence meets that narrower interpretation. No answer-selection interaction or internal-answer leak is alleged.

Required disposition for the parent: reconcile the literal zero-widget requirement with disabled option indicators and the native measurement definition. No CHOICE content or correctness review is requested.

## Six Full-Frame Observations

1. **Text, actual viewport 1440 x 960.** Opened `text-1440.png` once. The heading, prose, fractions, superscripts, three section separators, and final two-column worked example are readable and separated. Figure 114's tank, depth arrow, dimension arrow, base-plan label, complete bottom grid, and rightmost base edge are visible. The caption and both bottom navigation links are present. No text/figure collision, clipped final example, or visually mismatched drawing layer was observed in this frame.

2. **Text, actual viewport 390 x 844.** Opened `text-390.png` once. The title and paragraphs wrap, the three separators remain distinct, and figure 114's complete tank/base/grid and labels fit the frame. Ordinary prose and inline mathematics remain distinguishable; one long unit expression wraps its exponent onto the next line, but the glyph remains present. The caption and bottom links are visible. The final worked example's right-hand column is visibly cut off: F1. No separate apparatus-layer collision was observed.

3. **Exercises, actual viewport 1440 x 960.** Opened `exercises-1440.png` once. All ten prompts/instructions and all three group headings are readable. Figure 115's tube, support, platform, weight, bladder and bottom label are complete; figure 116's receiving tray and rightmost stream are visible; figure 117's two panels, upper tubes, bulbs, labels a/b and bottom-right arrow are complete. The return link is visible. No apparatus-label collision or truncation was observed, but no written answers are displayed: F2.

4. **Exercises, actual viewport 390 x 844.** Opened `exercises-390.png` once. The numbered prompts and long instructions wrap within the narrower task column. All ten tasks and the return link remain present. Figure 115's long water-column label and bottom bladder label are fully visible. Figure 116's tray and figure 117's right-hand bulb/downward arrow and a/b labels are not cut off. No incoherent text/figure overlap was observed. Answers are again absent: F2.

5. **Choices, actual viewport 1440 x 960.** Opened `choices-1440.png` once. Seven stems and all 34 options are visible in groups 6/4/4/4/4/6/6. Mathematical labels and units are distinguishable; options do not overlap one another or the figures. Figures 115/116/117 have complete supports, tray endpoints, paired apparatus panels and bottom labels/arrows. The last question's option f and its ending are visible. Disabled selection controls are visible: F3. No additional rightmost/bottommost content truncation or visually mismatched figure layer was observed.

6. **Choices, actual viewport 390 x 844.** Opened `choices-390.png` once. Seven stems and 34 options wrap without colliding; a trailing punctuation mark in the third question's last option occupies its own line but is present. All three figures fit their media regions; the longest tube label, stream tray, a/b labels, right bulb and downward arrow are complete. The final option f and its final line are visible above the bottom whitespace. Disabled selection controls are visible: F3. No additional option truncation or drawing-layer mismatch was observed.

These are independent visual DISPLAY observations only. Describing a visible object does not reapprove its scientific meaning, geometry, source fidelity, or choice correctness.

## Completeness and Recorded Measurements

The numbers below come from the hash-bound native record and permitted static display-structure inspection, not from font-size estimates based on the screenshots.

- Text: native and rendered HTML both have 20 displayed prose paragraphs, 3 section breaks, and figure 114. The current lesson manifest has 17 prose items of kind `p`; one expands into four paragraph blocks, giving 20 displayed paragraphs. Its one figure and one caption are separate manifest items.
- Exercises: native, canonical exercise manifest, and rendered HTML agree on 10 written tasks and figures 115/116/117. Complete displayed answers fail as described in F2.
- Choices: native and rendered HTML agree on 7 questions, 34 options, and figures 115/116/117. Option counts by question are 6/4/4/4/4/6/6. No choice-set internals were consulted.
- Canonical figure manifest contains four figure IDs, 114 through 117; the surface allocations above account for them without opening separate figure assets.
- All six native records have `learnerMarkupLeaks=false`, `inputWidgets=0`, `lastReachable=true`, and `overflow=-15`. The disabled-choice-input discrepancy is explicitly preserved in F3.
- Native `errors=[]` and all recorded drawing-pixel counts are positive. Neither errors nor pixel checks were rerun.
- The configured viewports are 1440 x 960 and 390 x 844, not the dimensions of the full-page PNG files. The PNG headers are 1425 pixels wide on desktop and 375 pixels wide on mobile; their heights equal the native document heights.

| Surface / Viewport | Document Height | Actual Figure Media Width | Native Drawing Pixels |
| --- | ---: | --- | --- |
| text / 1440 | 3402 | fig-114: 640 | fig-114: 85511 |
| text / 390 | 3578 | fig-114: 343 | fig-114: 26752 |
| exercises / 1440 | 4144 | figs 115/116/117: 627.234375 | 123427 / 17765 / 42188 |
| exercises / 390 | 3853 | figs 115/116/117: 295.015625 | 32169 / 7049 / 16705 |
| choices / 1440 | 5003 | figs 115/116/117: 640 | 126495 / 18526 / 42418 |
| choices / 390 | 5339 | figs 115/116/117: 343 | 42211 / 8770 / 19712 |

Recorded text caption size is 16 px at both viewports. Exercise and choice records have empty caption lists, so this report does not invent caption measurements for them.

Recorded label sizes:

- Text desktop, figure 114: `Base plan`, `h`, `4 m` each 36 px.
- Text mobile, figure 114: those labels each 19.29375 px.
- Written desktop, figure 115: `5 kg`, `Glass tube`, `Water column: 1 m`, `Football bladder` each 35.28160714285714 px; figure 117 a/b each 35.281933593750004 px.
- Written mobile, figure 115: those four labels each 16.594285714285714 px; figure 117 a/b each 16.594628906249998 px.
- Choices desktop: the four figure-115 labels and figure-117 a/b each 36 px.
- Choices mobile: those labels each 19.29375 px.
- Figure 116 has an empty native label list, not a measured zero-pixel label.

The smallest recorded actual figure-label size is 16.594285714285714 px, above the skill's required 16 px floor. This specifically uses the 295.015625 px written-task media width rather than the larger prose width. The human supplied actual-labels-at-least-spec-minimum as an accepted premise; the native JSON lists actual sizes but not per-spec minimum fields. Under the restricted reading scope no FigureSpec was opened and no new per-spec comparison is claimed.

Native text math measurements record `KaTeX_Main, serif` at 18.656 px with parent 16.96 px for ten entries and at 17.6 px with parent 16 px for one entry, at each text viewport. The other surfaces have empty native font arrays. These are measurements of the recorded elements, not assertions that every descendant glyph, superscript, or fraction is independently 16 px.

## Exact Asset Inventory

Each entry is an existing absolute path, byte length, and complete SHA-256, independently matched before any image loading. No screenshot is embedded in this report, copied, cropped, or reopened.

### Rendered HTML

- `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/work/render/6p/modern-us-neutral/phy6-c4-s6/text.html`
  Bytes `547735`; SHA-256 `fc06a392ba471f7ea19a9a79ffbe0f74b7069c3a2d75f30db94c9007fb71e893`.
- `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/work/render/6p/modern-us-neutral/phy6-c4-s6/exercises.html`
  Bytes `530937`; SHA-256 `cdd5793fc94c02841091390ab9ad2f3cc9414f21ee10889abc470693056fe345`.
- `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/work/render/6p/modern-us-neutral/phy6-c4-s6/choices.html`
  Bytes `581781`; SHA-256 `72b82664fc3c29271c973fb41c4ac88f6e57dddc148ffb6c9978aea950a65b3a`.

### Screenshots in Actual Open Order

1. `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/display-first-r160/text-1440.png`
   Bytes `357444`; SHA-256 `5d5e8fbbc324d46edbdc5c7a716e59d9172345ca869e33f4c5fcb3a93ec40234`; PNG `1425 x 3402`.
2. `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/display-first-r160/text-390.png`
   Bytes `301498`; SHA-256 `a511ccb70c0c7bb40a268b7a2cc3924afdeea22faba5d8dcf8bdde929b950853`; PNG `375 x 3578`.
3. `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/display-first-r160/exercises-1440.png`
   Bytes `363582`; SHA-256 `f18f6da56c88cee57dbb2a888c9d1fa1e3a9412ec7bd2e4bdbfdb992cd5faa3c`; PNG `1425 x 4144`.
4. `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/display-first-r160/exercises-390.png`
   Bytes `290611`; SHA-256 `ffedee709f39aa34eabb4f0d368e4d6770fdc406260624a6879b3607c8876590`; PNG `375 x 3853`.
5. `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/display-first-r160/choices-1440.png`
   Bytes `575272`; SHA-256 `999fddb727669fd69f779ed3981ab402c0775d9bdafc279dee500af436b21cb7`; PNG `1425 x 5003`.
6. `/Users/yong/.codex/worktrees/stemrobin-180-six-6813/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-6813/s6-final-stage-r159/display-first-r160/choices-390.png`
   Bytes `510671`; SHA-256 `3265fa2b5938e10d95076053f756eb012703fee1b2223523619c362b984184fb`; PNG `375 x 5339`.

The companion manifest includes the native asset, these nine rendered assets, all ten opaque-input byte/hash receipts, per-surface observations, the three findings, and this report's exact byte length and SHA-256. A report cannot meaningfully include a hash of its own final bytes; its hash is therefore stored in the manifest and returned separately. The manifest's own final hash is returned separately rather than creating a self-referential hash.

## Final Accounting

- Image opens: exactly `6`; each authorized full-page PNG exactly once.
- Image reopens: `0`; crops: `0`; other image opens: `0`.
- New browser sessions: `0`; native/render/check reruns: `0`.
- New paid calls: `0`; semantic reviews repeated: `0`.
- Agent/chat messaging tool calls: `0`.
- Canonical/checkpoint/usage edits: `0`; commits: `0`.
- No full-course approval, complete-course increment, database publication, or deployment claim.
- Final verdict: **REVISE**, limited to this independent DISPLAY review.
- Report and companion `manifest.json` are frozen with file mode `0444` after final hashing.
