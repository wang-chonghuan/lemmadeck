# n14 Choice 116 Revision 1: Affected-Only Visual/Interaction Review

**Scope status: FAIL. No mathematics or whole-lesson approval.**

## Finding

New E fraction numerator/denominator leaves render at **12.8128px** on both desktop 1440x960 and mobile 390x844, below the image policy minimum **16px**. The parent math size is 18.304px and body size 16.64px; neither proves leaf readability.

Affected E cells: data row 1 columns 1 and 3; rows 2, 3, 4 and 7 column 3. Rows are one-based, excluding the header. Small-leaf isolated browser-font ink heights are 8.53146-8.81328px; their DOM Range boxes are 15px high. Ink height, CSS font size, and DOM layout boxes are distinct measurements. No page-pixel ink segmentation was performed.

The full E table has no observed collision/clipping in the two inspected screenshots, and all measured visible text-leaf layout boxes are inside their cells. This does not override the font failure. No mathematical values or classifications were judged.

## Frozen First Execution

- Input: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-choice-preview-revision1/choices.html`
- Raw bytes: 486543. SHA-256: `3a598748a6ab0d13f5c883a2ce70769c0d311c5fe6748819d5721c99ce6a3776`. Expected hash matched; after-run bytes/hash unchanged.
- Existing app Playwright; headless Chromium; two fresh in-memory contexts; no persistent profile.
- In-memory server bound to 127.0.0.1 with only choices.html and the designated text.html routes. No directory serving or external requests.
- FIRST stdout/stderr/exit captured once before reporting. Exit **1**, signal none. No repair or rerun.
- Browser and both contexts closed; server closed. No ongoing runtime.

```text
{"viewport":"desktop","status":"FAIL","checks":41,"vectors":33,"firstFailure":"E-fonts-and-layout-no-cell-clipping","errors":[{"type":"realCheckDefect","message":"E-fonts-and-layout-no-cell-clipping"}]}
{"viewport":"mobile","status":"FAIL","checks":41,"vectors":33,"firstFailure":"E-fonts-and-layout-no-cell-clipping","errors":[{"type":"realCheckDefect","message":"E-fonts-and-layout-no-cell-clipping"}]}
{"scopeStatus":"FAIL","screenshotCount":2,"browserClosed":true,"serverClosed":true,"inputUnchanged":true}
```

FIRST.stderr: (empty, 0 bytes). Complete command and frozen check-script hash are in FIRST.exit.json.

## Completed Checks

| Check | Desktop | Mobile |
| --- | --- | --- |
| Frozen revision input served | PASS | PASS |
| 116 all-valid prompt, five associated native checkboxes, no radios | PASS | PASS |
| Five labels independently toggle on/off | PASS | PASS |
| Native cumulative on/off and Space on/off | PASS | PASS |
| Reciprocal 116/117 group isolation | PASS | PASS |
| 116 prompt layout fit | PASS | PASS |
| Added E height, 117 placement and end-nav normal flow | PASS | PASS |
| E three headers, eight rows, three nonempty cells per row | PASS | PASS |
| Left endpoint reaches every first-column cell | PASS | PASS |
| Right endpoint reaches every third-column cell; row 8 complete | PASS | PASS |
| E actual leaf font >=16px | FAIL | FAIL |

Total: 80 PASS assertions and 2 FAIL assertions; 66 actual control-state vectors. Counts include the individual control steps. No unrun check is counted as PASS.

## Control Vectors

Bits are in A,B,C,D,E order; 1 means checked. Desktop and mobile independently produced the identical sequence below (33 vectors each); the complete separate sequences are in report.json.

| Action | 116 | 117 |
| --- | --- | --- |
| fresh-native-default | 00000 | 00000 |
| 116 A label on | 10000 | 00000 |
| 116 A label off | 00000 | 00000 |
| 116 B label on | 01000 | 00000 |
| 116 B label off | 00000 | 00000 |
| 116 C label on | 00100 | 00000 |
| 116 C label off | 00000 | 00000 |
| 116 D label on | 00010 | 00000 |
| 116 D label off | 00000 | 00000 |
| 116 E label on | 00001 | 00000 |
| 116 E label off | 00000 | 00000 |
| 116 A native on cumulative | 10000 | 00000 |
| 116 B native on cumulative | 11000 | 00000 |
| 116 C native on cumulative | 11100 | 00000 |
| 116 D native on cumulative | 11110 | 00000 |
| 116 E native on cumulative | 11111 | 00000 |
| 117 A label on with 116 all on | 11111 | 10000 |
| 117 B label on with 116 all on | 11111 | 11000 |
| 117 C label on with 116 all on | 11111 | 11100 |
| 117 D label on with 116 all on | 11111 | 11110 |
| 117 E label on with 116 all on | 11111 | 11111 |
| 116 A native off with 117 all on | 01111 | 11111 |
| 116 B native off with 117 all on | 00111 | 11111 |
| 116 C native off with 117 all on | 00011 | 11111 |
| 116 D native off with 117 all on | 00001 | 11111 |
| 116 E native off with 117 all on | 00000 | 11111 |
| 117 A native off | 00000 | 01111 |
| 117 B native off | 00000 | 00111 |
| 117 C native off | 00000 | 00011 |
| 117 D native off | 00000 | 00001 |
| 117 E native off | 00000 | 00000 |
| 116 E keyboard Space on | 00001 | 00000 |
| 116 E keyboard Space off | 00000 | 00000 |

## Endpoints And Flow

| Viewport | E table | Container | Left | Right/max | Row 8 |
| --- | --- | --- | --- | --- | --- |
| desktop 1440x960 | 569px | 569px | 0px | 0/0px | complete |
| mobile 390x844 | 340px | 252px | 0px | 88/88px | complete |

Mobile is controlled horizontal scrolling: table min-width 340px, container client width 252px, overflow-x auto, endpoint 88px. These values were measured by executed endpoint checks. The later dedicated width assertion and right-to-left return were stopped after the defect.

| Viewport | Prompt W x H | 116 bottom | 117 top/bottom | Nav top | Document width |
| --- | --- | --- | --- | --- | --- |
| desktop | 627.234 x 189.656 | 2604.328 | 2604.328/2992.531 | 3030.531 | 1440px |
| mobile | 310.016 x 284.484 | 2683.156 | 2683.156/3276.922 | 3314.922 | 390px |

Vertical values are document coordinates in CSS pixels. 117 follows E without overlap; end navigation follows 117 with 38px separation. Reachable-hit tests and navigation click/heading inspection were not run after the stop.

## Image Ledger 2/2

| Image | Captures | Opens | State and affected observation |
| --- | --- | --- | --- |
| desktop-1440x960.png | 1 | 1 | E on; full eight-row/three-column E visible; 117 separate below; small fraction digits |
| mobile-390x844.png | 1 | 1 | E off; right endpoint 88px; eight rows and every new rightmost cell complete; left column intentionally scrolled offscreen |

No reopens, crops, supplementary images or history payload. Parent permanent 24/24 and prior visual FIRST 6/6 preserved separately, not loaded or replayed. Report returns paths and hashes, not image embeds. Capture-time browser-evidence.json opens=0 is retained; the final report ledger records the later two actual opens.

## Stopped / Limitations

- NOT RUN: Dedicated mobile 340px-in-252px assertion; dimensions were already recorded by the executed endpoint measurements.
- NOT RUN: Right-to-left return interaction after reaching the right endpoint.
- NOT RUN: 117 heading viewport hit-test after scrolling.
- NOT RUN: End-navigation viewport hit-test, click, and target-heading inspection.
- Designated text target was not read because navigation was blocked before use.
- A-D table content and 117 mathematics/glyphs were reused as supplied, without baseline comparison, solving or old review replay.
- Two screenshots focus on E/downstream layout; prompt and other positions use browser measurements, not extra screenshots.
- Headless is the explicit human override of the operations headed default.
- DOM layout containment and visual inspection are not a exhaustive pixel-level glyph collision proof. Long radical SVG tails were distinguished from their effective clip bounds.
- Scope FAIL only. No semantic, mathematics, promotion, whole-lesson, deployment, handoff or closure approval.

## Artifacts And Ownership

Full structured evidence, separate per-viewport vectors, cell/leaf measurements, endpoint coordinates and limitations: report.json. Unmodified pre-review evidence: browser-evidence.json. First execution: FIRST.stdout, FIRST.stderr, FIRST.exit.json.

raw-sha256-bytes-manifest.json records exact bytes and SHA-256 for ALL owned outputs recursively, including both PNGs, both reports, scripts and FIRST records; it excludes only itself. No input HTML or existing script was edited. Only this new scratch directory was written; no agents/messages/Git/backend/setup/freshness/DB/.env/publisher/app/main/merge/deploy/handoff/closure/install operations.
