# n47 First Offline Visual / Behavior Review

Assertion verdict: **FAIL**. Visual verdict: **FAIL**. Finish: review.

Offline file previews only; not live app, server/keyboard/DB acceptance or strict full-source approval. All prior HOLD/UNKNOWN statuses remain.

## Unresolved Findings

- Text desktop/mobile: actual screenshots show gray vertical mini-scrollbars on inline math. This is outside the horizontal-only oversized-formula allowance; no preview repair was made.
- Choices desktop/mobile: first no-ink-clipping assertions each flag 56 parenthesis/ancestor range records. Full-page pixels do not show obvious missing curve segments, but Range bounds are not exact glyph ink. Neither failure was resolved or waived.

## Actual Execution

- One headed Chromium transaction (149.0.7827.55), two fresh offline contexts; no GUI limitation.
- Mandatory stage n47-offline-browser-check-first: exit 1; original stdout/stderr/receipt preserved and copied under execution/.
- 150 assertions: 148 passed, 2 unresolved. No recovery or browser replay.
- Six full-page screenshot creations; six actual image-tool observations, one per file. Extra views 0; reserved views unused 2.
- Manual PNG/Pillow decode/open 0; parentImagesOrDecodes 0; hiddenBrowserImageInternals UNKNOWN.
- Native clicks: 64 (desktop-choices 32, mobile-choices 32), all with trusted events. Inventory derives four IDs and sixteen options from each actual DOM; every option was clicked and clicked again, with exclusive single selection and cross-question isolation asserted.
- Font readiness, six prose blocks, four exercises 378-381, four rendered display answers including mixed variables and all three 381 condition/zero/empty-domain paragraphs passed preservation assertions.
- No raw dollar/KaTeX error, paragraph indentation, page-wide horizontal overflow or incoherent flow overlap was detected. Both static text/written navigation directions actually resolved at both viewports.
- Choices expose native view/id projection, not answer/rationale/internal source payload; no answer semantics were re-reviewed.

## Horizontal Scroll Limitation

- desktop-text: 1 equation scroller(s), client/scroll widths 670/697px. Both endpoints were reached and unmasked hit-tested, then reset left before capture. A single left-reset image cannot show the complete long expression at once.
- mobile-text: 3 equation scroller(s), client/scroll widths 358/545px, 358/697px, 358/480px. Both endpoints were reached and unmasked hit-tested, then reset left before capture. A single left-reset image cannot show the complete long expression at once.

## Six Single-View Observations

### 1. desktop-text: FAIL

The Chinese title and all six prose blocks are visible in a narrow centered column on white. Paragraph starts align without indentation; the proof, lemma reference, example and final written-page button are separated and do not overlap. The long limit chain has its own horizontal scrollbar. Concrete defect: several short inline formulas also show gray vertical mini-scrollbars, including the theorem's u/v and quotient derivative, the proof's u/v, and the example. These bars are not part of the allowed horizontal-only treatment and interrupt the formula/punctuation flow. No raw dollar signs or obvious missing Chinese glyphs were seen. The screenshot is left-reset; the concealed right part of the long chain is supported by actual DOM endpoint evidence, not visible in this single image.

SHA256: de8a1e60ebe5babdca3cc402c1600f6e0a78507e95236641feab82df264f0004

### 2. desktop-written: PASS

All four numbered exercises 378-381 appear above the return link; all four display answers appear below a conspicuous but non-overlapping white gap. Number columns and math are aligned. Both y and x requests are visible in exercise/answer 379; exercise 381 retains x, y, 0 and 1. Its answer visibly has three separated paragraphs: domain/general derivative, four conditional values, and zero-determinant/constant/empty-domain discussion. The final statement that 0/0 cannot be taken as zero is visible. Fractions, Chinese text and paragraph breaks are legible; no apparent cropping, raw math delimiters or collisions are visible.

SHA256: 7c7bc5007d83a291706c396cac72200c258a60bb269b9ad1fb535eddc45d565e

### 3. desktop-choices: HOLD

All four English stems and sixteen radio options are visible, with consistent left control gutters and separated question sections. One blue radio per question is selected, reflecting the final option clicked, not a marked correct answer. The last parameter-family tuple is visible. The formulas and enclosing parentheses appear readable without an obvious missing curve segment at this full-page viewing scale; the DOM Range-based clipping failure is not disproved by these pixels and remains unresolved. No rationale, answer-key panel or internal-source payload is visible. No incoherent prose/control overlap is apparent.

SHA256: 50a00629c0ea8a03b54591a7070a1baf902f4b36adb533900f3cd82e2814178c

### 4. mobile-text: FAIL

The title, six prose blocks, example and bottom written-page button fit the 390px layout with aligned paragraph starts and no page-wide sideways spill. The lemma prose wraps naturally. Three long equations are left-reset and visibly continue beyond their local windows; all right endpoints were separately reached in the browser. Concrete defect: narrow gray vertical mini-scrollbars remain next to inline/long math containers, including the theorem and the proof/example right edges. This is local vertical scrolling decoration, outside the horizontal-only allowance. No visible line collision or raw dollar delimiter is apparent.

SHA256: fc471388a484377cae68d82b2d070196052cecac1880943111af17db1f5e410d

### 5. mobile-written: PASS

All four exercises and four display answers are present in a single readable vertical column. The requests for g'(x) and g'(y) both survive wrapping; exercise 381's last request wraps to a second line without colliding with its number. The 381 answer shows all three separated paragraphs, each conditional derivative, excluded input, constant/zero case and empty-domain warning. The last Chinese sentence wraps across the final lines but remains inside the page and visible. Fractions and punctuation are not apparently clipped; no control/text overlap or raw delimiters are seen.

SHA256: 5e5e8540efc04208a7d7bb0fd9bf669962992358d45d644745c5deaf840b7256

### 6. mobile-choices: HOLD

All four stems and sixteen options remain visible at 390px. English text wraps within the page; radio circles occupy a stable left gutter, separate from the formulas. The fourth stem's denominator condition and the final quadruple remain visible. Each question has one blue selected radio corresponding to the last test click. Enclosing parentheses appear intact at this full-page viewing scale, but the unresolved DOM Range clipping assertion cannot be waived. No internal key/rationale/source panel or incoherent text/control overlap is visible.

SHA256: 633ff8cb142c0a2f5ee7cfa0bcf58a83039b73f16e27529b58e21d925e9299e1

## Evidence And Scope

report.json carries actual click states, assertion references, content/font/endpoint evidence and SHA-bound observations. browser-evidence-first.json retains full first-run facts; its imageViewed=false and PENDING visual status intentionally preserve its pre-observation state. The final report records the completed six observations.

Read/execution disclosure: an initial over-broad filename search listed ticket/history names without reading their bodies; an extra guidance search scanned unrelated skill files without matching content. These are disclosed metadata/search overreach, not prior gate consumption. Source fields embedded in authorized modern JSON were ignored for judgement. No artifacts, source, preview or pipeline scripts were modified.

hash-manifest.json binds all owned files except its unavoidable self-reference, plus inputs, consulted tooling/guidance and the NEW first-stage receipts. The manifest SHA is emitted after freeze. Owned files are frozen 0444 and directories 0555; finalizer verifies modes and hashes after chmod.

Browser and both contexts are actually closed. Parent must fully consume the report/checker/evidence/ledgers/manifest and actually close this agent. Parent closure is not claimed here. Text-only handoff; do not reopen the six-image batch in the parent.
