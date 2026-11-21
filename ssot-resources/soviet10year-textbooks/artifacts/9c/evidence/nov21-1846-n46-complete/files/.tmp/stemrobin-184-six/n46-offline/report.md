# n46 Offline Display Review

STEMROBIN-184 / 184-6, lesson `ana9-c4-s2-n46`, book9c. ONE fresh independent offline batch, `fork_context=false`. OPEN for parent FULL text intake and actual closure. TEXT only; no images are embedded here.

## Verdict

**PASS with preserved first failure and affected-only technical recovery.** Visual verdict: PASS with permitted local formula scrolling. First stage exit **1**, 213 assertions: 207 PASS, 6 FAIL. These failures are not removed or relabelled as first-run passes. Console-only recovery exit **0**, six affected assertions PASS; no new screenshots and no passed visual, content, control, geometry or production stage replay.

The initial six errors were Chromium file-origin security errors. A separate zero-screenshot diagnostic proved normal loading emitted no error, then `CSS.enable` emitted the exact error. Isolated Chromium `--allow-file-access-from-files` recovered those six console assertions while offline remote blocking remained in force. No app, retained content or HTML was changed.

## Content and Behavior

- Actual retained n46 content: 7 prose blocks, 8 displayed paragraphs, 1 approved visible boundary between the induction conclusion and polynomial differentiability. Exact logical prose comparison excludes any n47 prose.
- Written tasks: 375, 376, 377, in order, with 3/2/2 subparts, total 7. The derivative request is attached only to 375/376; 377 retains its drawing request.
- Choice learner view: 5 questions, 3 native single and 2 native multiple, option counts 4/4/4/7/7, total 26. Identifiers come from retained `questions[].view`, not a key. No figures.
- Public choice HTML contains no author intent, key, rationale, source mapping, review, coverage or correct-set fields, hidden inputs/templates or scripts. Only a whitelist of public view fields was projected. No answer-key files were inspected; this is not a live answer-reveal flow.
- Each viewport: all 12 radio options clicked in sequence, exactly one selection per question; all 14 checkboxes independently selected, then independently deselected. Other-question state vectors stayed unchanged after every one of 40 native clicks. Task total 80 actual clicks. Native form reset restored neutral screenshots.
- Each surface/viewport: no page-level horizontal overflow, flow/control overlap, clipped ordinary text/options, broken assets, raw dollar math or KaTeX error state. All 15 text, 7 written and 88 choice formula annotations match their retained sequences.
- Fonts: 20 embedded data font faces; `document.fonts.ready` loaded; all used KaTeX font specifications resolve matching loaded faces. Actual CDP glyph use confirms Songti SC, Menlo, KaTeX_Main and KaTeX_Math. Text numeric prose is 18.656px vs Chinese 16.96px; written enumeration matches Chinese at 16.64px, number column 16px; choice numbering matches Chinese at 16px. Actual images show readable scale.
- All 8 text paragraphs have computed first-line indent 0px at both widths. Final paragraph, last written task, last option and exercise/text navigation were reached by actual scrolling and bounding-box checks.

## Six Actual Views

Every screenshot below was newly captured full-page and actually opened **once** through `functions.view_image`, in this order. No crops, no reopens. Each screenshot's `actualToolViews` is **1** in `report.json`.

1. **Desktop text, 1440x960.** Theorem, formula (1), proof and conclusion are separated and readable. A thin rule precedes the polynomial paragraph; examples and the blue three-exercise navigation are visible. The general polynomial identity shows its left local-scroll state. No paragraph overlap or page overflow.
2. **Desktop written, 1440x960.** Blue 375/376/377 numbers have a separate aligned column. All seven subparts and return navigation are visible. Derivative requests occur at 375/376; drawing request at 377. Superscripts and right edges are intact.
3. **Desktop choice, 1440x960.** Three groups of a-d radios and two groups of a-g checkboxes. Long 4b/4g and 5d/5f options wrap within the text column, separate from the control gutter. Fractions/radicals and final 5g are fully visible; no internal annotation or figures.
4. **Mobile text, 390x844.** Title and Chinese paragraphs fit within side margins; the proof's section-43/example-3 reference wraps readably. Boundary rule, both examples and exercise navigation are present. Two wide formulas show their left scroller state, with no page-wide overflow.
5. **Mobile written, 390x844.** All three tasks/seven subparts and return button fit. The complete 376a formula reaches +9 at the right; its semicolon wraps onto a separate visible line without touching 376b. Last 377b is intact. This wrap is a nonblocking visual note, not omitted.
6. **Mobile choice, 390x844.** All 26 options appear in five groups. Question 1's triple-function options wrap without touching radios/letters. Long narrative options retain clear checkbox gutters and readable math. Final 5g text and checkbox remain complete above the bottom margin; no clipped rightmost/bottommost option.

## Geometry and Local Scrolling

Desktop document/body widths are 1440px for all three surfaces; mobile widths are 390px for all three.

- Desktop text polynomial: 685px client / 999px content, actual right scroll 314/314.
- Mobile text polynomial: 358px client / 999px content, actual right scroll 641/641.
- Mobile final example: 358px client / 681px content, actual right scroll 323/323.
- Written/choice surfaces: no local scrollers at either width. No tables.

All scrollers were actually moved to both ends and restored left before the single screenshot. The polynomial's terminal recorded KaTeX marker is zero-width; content-edge reach is established by the actual maximum scroll position, not a claim to have visually inspected hidden ink in a second screenshot.

End reach: desktop last choice option scrollY 1197, bottom 959.875px; mobile last option scrollY 2492, bottom 843.71875px. Mobile final paragraph scrollY 180, bottom 843.9375px; exercise navigation scrollY 273, bottom 843.609375px. Written last task and return navigation are reachable without vertical scrolling at both widths.

## Network and Accounting

`remoteDependencies=0`, remote attempts/responses=0. Route allows only `file:`, `data:`, `about:`; all other schemes are aborted. Service workers blocked. Exact request lists remain in machine evidence.

First stage: 6 routed allowed document requests, 0 routed blocked, 12 observed requests. The extra 6 observed local `other` requests failed browser file-origin security during CDP instrumentation. Recovery: 7 routed allowed documents, 0 routed blocked, 8 observed requests (one diagnostic document plus origin request, then six recovered documents). Combined: 13 routed allowed, 0 routed blocked, 20 observed. No remote CSS or resource timings in any screenshot surface.

Exactly **6 screenshots created / 6 actual image-tool views**. Batch 6/8; fresh reviewer context 6/24; parent permanently 24/24 unchanged. `parentImagesOrDecodes=0`. Zero source scan views, crops, reopens, recovery screenshots, paid calls, DB connections, app edits, publication, peer messages or new chats. First/recovery target navigations 6+7=13; zero reloads. Three contexts and three browsers closed in finally; no temporary servers.

**UNKNOWN:** hidden browser/renderer internal image loads and decodes, and unobservable browser background activity. They are not reported as zero. Explicitly authorized isolated HEADLESS offline artifacts only, not live app acceptance, DB validation, source/mathematical reapproval, production-stage replay or publication authorization.

## Paths and Hashes

All paths below use:

`OUT=/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n46-offline`

`STAGES=/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/stages`

`report.json` has individual absolute path/bytes/SHA-256 bindings for every retained/scratch/process input read, checker, HTML, projection, first evidence, recovery evidence, stdout/stderr and both command receipts. Screenshot bindings:

| OUT File | Bytes | SHA-256 |
|---|---:|---|
| desktop-text.png | 100932 | 3dd10519f199cbb45779a8c39565f7245591c6eb7db02db3915a8a1f22e20762 |
| desktop-written.png | 52724 | bf8ca121b9134a6ee0a914cbbc3f1d2ed9ca69a7a67db92b9d89502b406ad4cc |
| desktop-choice.png | 339660 | 3ca036bebad02eee907f49cb7ab288a4cbf4ddcd311620903775a8ecf5ed6b80 |
| mobile-text.png | 85568 | b110ba3c4fd686b303bc45a087683421d3710ace9c84b815ccd14c4917ea0590 |
| mobile-written.png | 42991 | 8ad65637c1002f4d5b014def0cf1da1092c64f9a7f0d0e8c2f2dbba74f67c676 |
| mobile-choice.png | 315905 | 2cac90cb6c4c247e428860b06244d5d0d3cd1c174f141230f859b4adb29b0a20 |

First evidence `OUT/evidence.json`: `f90c2761f2ad9aece6b88fce33ef54654d1acb9862a7d40a3b7287553ab4d85f`.

Recovery evidence `OUT/console-recovery-evidence.json`: `4a962bda8babc1d7410128c9fe1459af2eb3937e62388c08f30ececf2b9a0292`.

First receipt `STAGES/n46-offline-first-nov21-independent-7d93.receipt.json`: `77452e21f91a56ca09463482ab31bb7d6850759299ef82bd64695aafceaa69d8`, exit1.

Recovery receipt `STAGES/n46-offline-console-only-recovery-nov21-7d93.receipt.json`: `cabba7e6ce28ebf23e6855cfecb3e9c0dadb670cd11629cb01092370187ccc33`, exit0.

Completed files are sealed 0444. OUT stays writable for parent FULL intake. Report self-hashes are returned in final TEXT after sealing, avoiding circular self-hashes. **STOP OPEN.** No parent usage/progress journal or parent completion is performed.
