# STEMROBIN-180/C - n102 Independent Offline DISPLAY Review

**DISPLAY FAIL - one concrete defect; local defect limit 1/1. No repair or approval.**

Scope: `phy7-c1-s2-n102`, canonical `modern-us-neutral` display content and retained choice-set draft `questions[].view` only. The supplied six desktop/mobile screenshots are the visual authority. Existing p2c render and offline-check receipts both report exit 0; neither was rerun. This decision is limited to these offline displays, not product acceptance, answer correctness, publication, or any unseen state.

## Finding

**D1: Written-exercise group headings expose Markdown delimiters.** Both desktop and 390px mobile show literal `**练习50**` and `**作业**`, rather than formatted headings without asterisks. These are the canonical group labels, not intended literal stars. Approximate original-image locations: desktop x378-478/y744-768 and x378-468/y1127-1151; mobile x16-116/y1050-1075 and x16-106/y1558-1584. This is one rendering defect with four observed occurrences, not four defects. Expected: readable formatted group titles with no visible Markdown delimiters. No implementation cause is asserted.

## Complete Content Check

| Written object | Desktop / mobile observation |
|---|---|
| g0 / 1, worked steel example | Complete 300 kg premise, latent-heat explanation, lambda, powers of ten, `Q=lambda m`, substituted calculation and final line visible. |
| g0 / 2, worked ice/water example | Both starting cases and all explanation present; Q1, Q2, total, long substituted equation and both ending values visible. The long equation wraps within the content column, including on mobile. |
| g1 / g1-1 | Entire room/ice question and temperature readable. |
| g1 / g1-2 | Entire bucket/ice/water question, temperature and final dependency question readable. |
| g1 / 3 | Entire 4 kg ice calculation prompt readable. |
| g1 / 4 | Entire 20 kg lead prompt, both initial-temperature cases and final question readable. |
| g2 / q1, report assignment | Entire unnumbered assignment visible: adult guidance, two suitable identical containers, water/snow masses, simultaneous heating, hot-container warning, actual timing, report and explanation. Absence of a printed q1 label is intentional. |

Both choice stems match the retained draft VIEW, including the thermal-exchange qualifications. All ten options were individually compared on both widths: `room-equilibrium` r1, r2, r3, r4 (4/4); `external-heat-cases` h1, h2, h3, h4, h5, h6 (6/6). Text and identifiers are complete. Single mode has four unselected radio circles; multiple mode has six unselected checkboxes. No choice correctness was evaluated or marked.

Canonical prose and figure references are empty. Both empty text views are valid: title, printed page 252, seven-written-object entry and choice entry are visible without phantom body content. All six page titles and view suffixes fit. Apart from D1, no visible overlap, clipped formula, missing content, whole-page horizontal overflow, error-only state or unexpected answer-key disclosure was observed. The two public worked examples include their canonical calculations intentionally; they are not private-key leakage. Screenshot observation cannot prove console state, hidden payload security, click behavior, scoring, or live-product behavior.

## Actual Image Ledger

All paths below have this absolute prefix:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-batch42-7p-n102/`

| Open order | Existing screenshot | Actual pixels | Visual coverage |
|---|---|---|---|
| 1 | phy7-c1-s2-n102-text-1440.png | 1440 x 960 | Valid empty body, title and both entries; right/bottom frame visible. |
| 2 | phy7-c1-s2-n102-exercises-1440.png | 1440 x 1474 | All seven objects, D1 headings, full final assignment and return button. |
| 3 | phy7-c1-s2-n102-choices-1440.png | 1440 x 960 | Both stems, radio/checkbox modes and all ten options, including final h6. |
| 4 | phy7-c1-s2-n102-text-390.png | 390 x 844 | Valid empty body and unclipped title/entries. |
| 5 | phy7-c1-s2-n102-exercises-390.png | 390 x 1986 | All seven objects, wrapped equations, D1 headings, full assignment and return button. |
| 6 | phy7-c1-s2-n102-choices-390.png | 390 x 1313 | Both complete stems and all ten wrapped options; h6 and bottom whitespace visible. |

Each original was opened exactly once with native/original detail. Actual images: 6; batches: 1; crops: 0; reopens: 0; parent image payloads: 0; batch budget: 6/8; context budget: 6/24. Every right and bottom edge was visible. No image-bearing return is sent. Reviewer in-flight work: 0.

## Constraints And Freeze

Only the newly created owned directory and this report were written. No repair, rerender, checker run, browser, app operation, dependency change, Git, DB, backend, network, freshness, supervision or other-chat action occurred. No separate source, private-solution, answer-key, choice-intent or key file was opened; draft output was restricted to VIEW fields. Read-scope exception: the initial direct canonical lesson/exercises reads also emitted their embedded source metadata, `source_text` and part of `source.data`; these were not used as comparison authority. Initial filename/rule discovery also returned unrelated filenames/reference lines; no other lesson body or image was reviewed. These exceptions are recorded rather than claiming perfect read-scope compliance.

Owned evidence root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/display-review-batch42-n102/`

`view-only.json` freezes the selected public comparison fields. `review.json` records the FAIL, complete item/option checks, limitations and direct evidence bindings with absolute paths, exact byte lengths and SHA-256. `image-ledger.json` records the six actual opens and their hashes. `manifest.json` is exactly the flat object `{workspaceW,files:[{path,bytes,sha256}]}` for the owned direct leaves and this report; it excludes itself and runtime receipts, includes no corpus inventory and follows no incoming manifests. Referenced screenshots, n102 HTML hashes, canonical inputs and existing command receipts are bound inside `review.json`, not copied or altered.
