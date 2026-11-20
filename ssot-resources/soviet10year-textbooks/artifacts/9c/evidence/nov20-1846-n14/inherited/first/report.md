# STEMROBIN-184 SAME B: N14 Offline FIRST Review

- Invocation: STEMROBIN-184 SAME B / FIRST / ana9-c3-s1-n14
- Result: **FAIL**. This bounded observation task is complete; this is not mathematical, source-fidelity, product acceptance, or publication approval.
- Evidence directory: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-offline-first`
- Input freeze: 2026-11-19T20:26:11.641Z; all three raw input hashes still match after review.
- Images: exactly six screenshots and six single opens, zero reopens/crops; parent image count stays permanently 24. No image payloads are returned.
- Desktop 1440x960 and mobile 390x844; headless Chromium with a fresh context per view, existing Playwright resolved by createRequire(app/package.json).
- Both in-memory 127.0.0.1 servers served only the three frozen HTML files. Both browsers and servers closed in finally.

## Finding

**Text count precondition failed:** text.html contains 12 prose paragraph elements, not the requested 7. All 12 contain prose; the excess is not five formula-only wrappers. The supplied-input count mismatch is retained as a failure, without guessing which prose is intended or consulting forbidden source/history materials.

Dependent text-page checks stopped on this first real failure. The separate mobile first screenshot was still taken and inspected. Font glyph-use, character reachability, scroll interaction, end-of-page hit testing, and the text page's own forward/back navigation remain UNKNOWN.

## Technical Recovery

The original platform-font collector queried the outer sheet only and omitted nested KaTeX text nodes. Its two missing-custom-font outcomes were technical parser/collection failures, not font product defects. Original events, FAIL labels, native exit 1 and raw streams are preserved unchanged.

The one recovery pass queried actual text-bearing font-family/style/weight/size nodes, confirmed custom KaTeX Main Regular/Bold and Math Italic glyph use, and resumed only checks that had not executed. No screenshot, image open, or complete check was repeated. Recovery native exit: 0. The text page was not re-reviewed.

## View Matrix

| View | Visual | Content | Fonts | Bounds | All Text Reach | Scroll | Tables | Controls | End | Navigation |
|---|---|---|---|---|---|---|---|---|---|---|
| text-desktop | PASS | FAIL | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| text-mobile | PASS | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| exercises-desktop | PASS | PASS | PASS | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| exercises-mobile | PASS | PASS | PASS | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| choices-desktop | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| choices-mobile | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

## Measurements

### text-desktop

- Initial document/body width: 1440/1440px; viewport: 1440x960; initial scroll height: 1627px.
- Screenshot: 1440x1627px, 269996 bytes; one open. Full-page first visual observation: heading, prose, decimals, radicals, arrow/subscript notation, punctuation and final forward link are visible and legible; no incoherent overlap or visible ink clipping. Input renders twelve paragraph elements, not the seven requested; content precondition is evaluated separately.
- Prose/raw paragraph elements: 12/12; expected prose count: 7. All dependent measurements remain UNKNOWN.

### text-mobile

- Initial document/body width: 390/390px; viewport: 390x844; initial scroll height: 2041px.
- Screenshot: 390x2041px, 236923 bytes; one open. First 390px full-page visual: Chinese lines wrap cleanly; decimal, radical, arrow/subscripts and inline punctuation remain legible; final forward link is visible; no page-level horizontal overflow, incoherent overlap or visible ink clipping. Dependent checks remain UNKNOWN after the text-desktop content-count failure.
- Prose/raw paragraph elements: 12/12; expected prose count: 7. All dependent measurements remain UNKNOWN.

### exercises-desktop

- Initial document/body width: 1440/1440px; viewport: 1440x960; initial scroll height: 960px.
- Screenshot: 1440x960px, 62876 bytes; one open. Both 116 and 117 are visible with complete exercise text, fractions, radicals, signs, membership symbols, decimals, commas and terminal punctuation; layout and final return link are legible without overlap or visible ink clipping.
- Rendered-text traversal: 72/72 nodes, 207 non-whitespace characters reached inside viewport and clipping ancestors with 2px layout-range tolerance.
- Actual rendered fonts: Songti SC (STSongti-SC-Bold; custom=false); PingFang SC (PingFangSC-Regular; custom=false); Menlo (Menlo-Regular; custom=false); KaTeX_Main (KaTeX_Main-Bold; custom=true); KaTeX_Main (KaTeX_Main-Regular; custom=true); Songti SC (STSongti-SC-Regular; custom=false); KaTeX_Math (KaTeX_Math-Italic; custom=true). Used embedded families confirmed, font set loaded; unused declared families may remain unloaded.
- End: scrollY=0, max=0; link box x=377.59375, y=600.78125, w=98.046875, h=37.71875; fully visible and correct hit target.
- Native navigation: existing HTML link: http://127.0.0.1:51820/text.html; back: http://127.0.0.1:51820/exercises.html; forward: http://127.0.0.1:51820/text.html. Back restores source; forward restores existing target HTML.
- Exercises 116 and 117 present, no control groups or choice tables. One incidental 2px radical wrapper scroll range is inside the tolerance; exact tiny-scroll gesture movement is not independently established.

### exercises-mobile

- Initial document/body width: 390/390px; viewport: 390x844; initial scroll height: 844px.
- Screenshot: 390x844px, 52500 bytes; one open. First mobile screenshot shows all of 116 and 117 plus the return link. Fractions, square roots, decimal sequence, membership symbols and punctuation are readable; line wraps do not overlap, truncate ink or overflow the page.
- Rendered-text traversal: 72/72 nodes, 207 non-whitespace characters reached inside viewport and clipping ancestors with 2px layout-range tolerance.
- Actual rendered fonts: Songti SC (STSongti-SC-Bold; custom=false); PingFang SC (PingFangSC-Regular; custom=false); Menlo (Menlo-Regular; custom=false); KaTeX_Main (KaTeX_Main-Bold; custom=true); KaTeX_Main (KaTeX_Main-Regular; custom=true); Songti SC (STSongti-SC-Regular; custom=false); KaTeX_Math (KaTeX_Math-Italic; custom=true). Used embedded families confirmed, font set loaded; unused declared families may remain unloaded.
- End: scrollY=0, max=0; link box x=16, y=699.109375, w=98.046875, h=37.71875; fully visible and correct hit target.
- Native navigation: existing HTML link: http://127.0.0.1:51820/text.html; back: http://127.0.0.1:51820/exercises.html; forward: http://127.0.0.1:51820/text.html. Back restores source; forward restores existing target HTML.
- Exercises 116 and 117 present, no control groups or choice tables. One incidental 2px radical wrapper scroll range is inside the tolerance; exact tiny-scroll gesture movement is not independently established.

### choices-desktop

- Initial document/body width: 1440/1440px; viewport: 1440x960; initial scroll height: 2689px.
- Screenshot: 1440x2689px, 217585 bytes; one open. First full-page desktop visual: two questions and nine controls are visible. Each of A-D has a header plus eight complete data rows and three columns; rightmost fractions/status cells and final x rows are visibly present. The five checkbox labels, fractions/radicals and end return link are legible with no incoherent overlaps or visible ink clipping. Table row count is nine DOM rows because the header is additional to the requested eight data rows.
- Rendered-text traversal: 347/347 nodes, 658 non-whitespace characters reached inside viewport and clipping ancestors with 2px layout-range tolerance.
- Actual rendered fonts: Songti SC (STSongti-SC-Bold; custom=false); KaTeX_Main (KaTeX_Main-Bold; custom=true); Songti SC (STSongti-SC-Regular; custom=false); KaTeX_Main (KaTeX_Main-Regular; custom=true); KaTeX_Math (KaTeX_Math-Italic; custom=true). Used embedded families confirmed, font set loaded; unused declared families may remain unloaded.
- End: scrollY=1729, max=1729; link box x=377.59375, y=841.796875, w=79.046875, h=37.71875; fully visible and correct hit target.
- Native navigation: existing HTML link: http://127.0.0.1:51820/text.html; back: http://127.0.0.1:51820/choices.html; forward: http://127.0.0.1:51820/text.html. Back restores source; forward restores existing target HTML.
- Four tables: each 8 data rows + 1 header, 3 columns in every row; table/scroller widths 569/569px. Header and eighth-row first/rightmost cells fully reachable.
- Horizontal wheel observations: no overflowing desktop containers.
- Controls: 21 recorded actions, all state vectors match expectations. Four radios exclusive; each text label selects; selected radio stays checked. Five checkboxes independent; all direct clicks and label off toggles preserve other boxes and radio. Checkbox E label toggles on; radio C preserves checkbox E.

### choices-mobile

- Initial document/body width: 390/390px; viewport: 390x844; initial scroll height: 2957px.
- Screenshot: 390x2957px, 172512 bytes; one open. Sixth and final image: all four tables show classification and full rightmost fraction/status column at the intentional horizontal right endpoint, including every eighth data row; first column is intentionally off-screen, not discarded. Both questions, all nine labels/controls and return link appear. Radicals/fractions and comma/period punctuation are legible, with no incoherent overlap or visible ink clipping. Some option terminal periods wrap onto their own line but remain visible.
- Rendered-text traversal: 347/347 nodes, 658 non-whitespace characters reached inside viewport and clipping ancestors with 2px layout-range tolerance.
- Actual rendered fonts: Songti SC (STSongti-SC-Bold; custom=false); KaTeX_Main (KaTeX_Main-Bold; custom=true); Songti SC (STSongti-SC-Regular; custom=false); KaTeX_Main (KaTeX_Main-Regular; custom=true); KaTeX_Math (KaTeX_Math-Italic; custom=true). Used embedded families confirmed, font set loaded; unused declared families may remain unloaded.
- End: scrollY=2113, max=2113; link box x=16, y=742.1875, w=79.046875, h=37.71875; fully visible and correct hit target.
- Native navigation: existing HTML link: http://127.0.0.1:51820/text.html; back: http://127.0.0.1:51820/choices.html; forward: http://127.0.0.1:51820/text.html. Back restores source; forward restores existing target HTML.
- Four tables: each 8 data rows + 1 header, 3 columns in every row; table/scroller widths 340/252px. Header and eighth-row first/rightmost cells fully reachable.
- Horizontal wheel observations: table 0: right=88/88, left=0; table 1: right=88/88, left=0; table 2: right=88/88, left=0; table 3: right=88/88, left=0.
- Controls: 21 recorded actions, all state vectors match expectations. Four radios exclusive; each text label selects; selected radio stays checked. Five checkboxes independent; all direct clicks and label off toggles preserve other boxes and radio. Checkbox E label toggles on; radio C preserves checkbox E.

## Input Freeze

| Input | Bytes | Raw SHA-256 |
|---|---:|---|
| text.html | 386939 | `43dc3da98d209e797af1d4d179dda84aef8a6881908e134ccda8fea4cd0a1c29` |
| exercises.html | 386111 | `0059cfe9c8f24ca2cba81168342e61172514c87692a203194a7fef143155a5f7` |
| choices.html | 471965 | `1e528da8ad1b6565472ef6f87a8feece9cb900ac49ca8889ff0a3b7eba8cac62` |

## Native Receipts

- Command: `/Users/yong/.local/opt/node-v24.16.0/bin/node /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-offline-first/review.mjs`; native exit=1; signal=none.
- Executed script snapshot: 30370 bytes; SHA-256 `df63e2b7d4c6deab52fc297ffc2ef077c3e792ca0a3a17dbdd954907cf887ea1`.
- stdout: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-offline-first/review.stdout.jsonl`; 24067 bytes; raw SHA-256 `c2747f70773ccaa2b7f8ce2d3b29b38cd122386fe4a3cd34e182e6e9f1cf049f`.
- stderr: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-offline-first/review.stderr.log`; 0 bytes; raw SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- Command: `/Users/yong/.local/opt/node-v24.16.0/bin/node /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-offline-first/recover-font-parser.mjs`; native exit=0; signal=none.
- Executed script snapshot: 23251 bytes; SHA-256 `60405bad61ab9943f80ad0497d2566110e8b3a76ff472f17fe9c75d72f84299b`.
- stdout: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-offline-first/recovery.stdout.jsonl`; 85050 bytes; raw SHA-256 `2ff7ea2e36a2ae294853ec70935a03bc6c6ebd8d09df429c1da750059e953a65`.
- stderr: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-offline-first/recovery.stderr.log`; 0 bytes; raw SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## Image Ledger

| # | View | Pixels | Bytes | Raw SHA-256 |
|---:|---|---|---:|---|
| 1 | text-desktop | 1440x1627 | 269996 | `d320f8bd1dc9eef80d8e946d47909ce5b34b7669f610b74c0367b6c810b5c8e0` |
| 2 | text-mobile | 390x2041 | 236923 | `7d069b69020a3ebdfbfaeca5d0208ddeb173bf9dedf506422bad8b8e9445d685` |
| 3 | exercises-desktop | 1440x960 | 62876 | `77c52a432b5365622d84ce285f0f94af5b460fb11064975742cefd20b7c95551` |
| 4 | exercises-mobile | 390x844 | 52500 | `684ec86769b79d700ea4559f78ea460f54c9dbf851b346cd68b351778239d645` |
| 5 | choices-desktop | 1440x2689 | 217585 | `ee5f14e874e521102d4bca0fa1a8a8e449fca35a1103ce4d6923a4805ffda4cd` |
| 6 | choices-mobile | 390x2957 | 172512 | `79db6cdf5a7291a2d524159bc370205db5acaa412d98e85b53c55071a8eec84a` |

## Unknowns And Limits

- text-desktop / fonts: UNKNOWN. not run after first real/technical failure.
- text-desktop / pageBounds: UNKNOWN. not run after first real/technical failure.
- text-desktop / contentReachability: UNKNOWN. not run after first real/technical failure.
- text-desktop / scrollContainers: UNKNOWN. not run after first real/technical failure.
- text-desktop / tables: UNKNOWN. not run after first real/technical failure.
- text-desktop / controls: UNKNOWN. not run after first real/technical failure.
- text-desktop / endOfPage: UNKNOWN. not run after first real/technical failure.
- text-desktop / navigation: UNKNOWN. not run after first real/technical failure.
- text-mobile / content: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / fonts: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / pageBounds: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / contentReachability: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / scrollContainers: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / tables: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / controls: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / endOfPage: UNKNOWN. dependent checks stopped after first real failure on this page.
- text-mobile / navigation: UNKNOWN. dependent checks stopped after first real failure on this page.
- exercises-desktop / exactTinyScrollerGestureEndpoints: UNKNOWN. The incidental radical wrapper has a 2px range, equal to the endpoint tolerance. Raw right/left snapshots were 0/2, so exact gesture endpoints are not established; content-range reachability and visible ink were assessed separately..
- exercises-mobile / exactTinyScrollerGestureEndpoints: UNKNOWN. The incidental radical wrapper has a 2px range, equal to the endpoint tolerance. Raw right/left snapshots were 0/2, so exact gesture endpoints are not established; content-range reachability and visible ink were assessed separately..
- Text count mismatch is a count precondition failure, not an inferred missing paragraph or mathematical defect.
- Text-page font glyph use, reachability, scrolling, end-of-page and its own forward/back navigation remain UNKNOWN because they were not run after the first real count failure.
- Actual ink clipping and incoherent overlap were visually assessed in the six original full-page screenshots. Character-range reachability uses a 2px layout-box tolerance and is not a glyph-ink or mathematical proof.
- Tables have eight data rows plus one header row (nine DOM rows), each with three columns; table structure checks use data rows.
- Mobile choices screenshot shows each table at the right endpoint. All first-column and last-row characters were subsequently reached without another screenshot.
- A 2px incidental radical wrapper scroll range in exercises is within the endpoint tolerance; it is not evidence of a large deliberate scrolling region. Exact tiny-scroll gesture movement was not independently confirmed.
- Unused declared font faces remain unloaded by design; text-bearing computed-family probes confirmed actual custom KaTeX glyph rendering on exercise and choice views.
- Page request interception permits only the local server and the three HTML paths; no OS-wide packet capture was performed.
- The recovery raw boundaries.textPageNotRevisited field means no dependent text-page review was resumed, not zero text.html navigations. Native exercise/choice navigation intentionally loads text.html as the existing link target; only its heading/URL is observed there.

## Evidence And Ownership

- Full JSON includes baseline geometry/content, font probes, per-character reachability, table endpoint measurements, every control state vector, native receipts, technical failures and retained UNKNOWNs.
- Original/recovery observations and raw stdout/stderr are retained, alongside the scripts and receipts. No inputs, application files, ticket data or other agents' work were changed.
- image-ledger.json records all six unique screenshot paths, bytes and raw hashes; no previews are embedded in this report.
- manifest.json enumerates ALL owned output files by absolute path, bytes and raw SHA-256, excluding itself and any parent-result. It is written once with exclusive creation. All owned evidence files and the manifest are sealed read-only; the directory remains writable for the parent.
