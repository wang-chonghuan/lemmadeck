# ana10-c8-s2-n114: First Actual Offline Browser And Visual Acceptance

Status: PASS_OFFLINE_ONLY. Independent browser assertions PASS; independent visible inspection PASS.
This does not alter the first package's historical harness FAIL/UNKNOWN or its lifetime0/24.
No lesson/HTML/content/source/math correction or additional acceptance execution occurred.

## Scope And Executions

Exactly one authorized corrected copy of the old harness was made, and exactly one subsequent
browser/check execution occurred. The previous attempt stopped at parse time before runtime.
The exact actual diff, reasons, original/copied byte bindings, capture executable argv/cwd,
timestamps/status/errors, program/runtime hashes, and RAW stdout/stderr are retained.

See correction-reasons.md, copy-bindings.json, commands/diff.stdout.raw and
commands/{prepare,diff,browser-check,project-images}.receipt.json.
Diff exit1 means the exact requested changes were present; it is not an acceptance failure.
The inherited six snapshots and original input-freeze.json were reused byte-identically;
no new original-content freeze command or PASS was run.

The corrected browser result is immutable browser-results.json:
581716 bytes, SHA256 ac1f8f7ec4312dfe766358b7fa089439f71ab9faff3c28a5e30407198548ca88.
RAW browser output proves an isolated installed Playwright HEADLESS Chromium launch,
PID72091, graceful close and process exit0. Both viewport contexts closed in finally.
The actual headless-shell executable path/hash is recorded separately in
native-image-projection.json from the real raw launch line; the configured Chromium
executable receipt in browser-results.json is not misrepresented as the launched binary.

## Browser Observations

Desktop1440x960: text document1440x2632; exercises1440x960.
Mobile390x844: text document390x3704; exercises390x844.
All four surfaces reached the exact copied self-contained file:// HTML bytes.
Whole-page widths remain equal to viewport widths, including formula start/end/reset states.

The existing proseFlow helper derived28 rendered paragraphs and section indices5 and25 from
current frozen JSON for browser assertion input only. Counts, exact derived section indices,
solid1px boundary rules, no-indent, positive paragraph/formula/wrapper geometry and vertical
paragraph order passed. This was not a prose_flow CLI, author/text review or mathematical proof.

Zero exercise entries and zero figures were asserted against their frozen JSON and rendered
surfaces. No invented written question, answer input or choice appeared. No error element,
page/console error, page script, remote request, failed request, non-inline asset or remote CSS
URL appeared. KaTeX Main loaded; prose numeric/Latin spans use it at sizes no smaller than
Chinese prose. Each text surface has6 intrinsic KaTeX SVGs, excluded only from instructional
figure/media counts; both exercise surfaces have0 intrinsic SVGs.

Every overflowing formula wrapper fits inside its page and has positive content dimensions.
All ten native scrollers reached their exact saturated maximum, reset to0 and preserved page
width. The six2px overhang scrollers show x_1 or exp_a; the four genuinely longer mobile
expressions scroll16/56/25/13px. There are3 desktop and7 mobile scrollers total, with6 tiny
2px cases and4 longer cases. Native start/end PNGs preserve the actual reachable appearances.
No demand for an unscrollable inner KaTeX width was substituted for the existing .nb contract.

## Independent Visible Judgments

All six native projections were actually loaded once with view_image detail original.
No model image was resized, reopened, zoom-cropped or taken from source/author evidence.
No screenshot payload is returned to the parent. Numerical pixel equality is provenance only;
the PASS below comes from seeing the newly captured images.

Desktop upper: a clean white centered page, legible complete title and printed-page metadata,
readable Chinese prose and distinct mathematical operators, fractions and subscripts.
The first light-gray full-column separator is actually visible before the numbered properties.
The initial definitions, properties1-4 and product-log continuation occupy separate readable
paragraphs without collisions, clipped baselines or obscured punctuation.

Desktop lower: properties5-7 and the a/b/c/d cases are visibly ordered, with clear paragraph
gaps. Both underbraces and their labels are intact below their formulas and do not collide with
the next paragraph. The second full-column separator is visible before the corollary. The exp
paragraphs and final registered modern formula appearance are readable. The bottom navigation
states0 questions and fits its button. Small scroller endpoints were separately seen in slot6.

Mobile upper: the complete title wraps to two readable lines rather than leaving the viewport.
The16px side gutters remain clear, Chinese and inline mathematics retain readable proportions,
and the first separator remains visible across the column. Paragraphs and properties1-4 are
legible with no overlap. The long product-log expression intentionally exposes only its START
at the right edge of this image; its actual END was inspected, not guessed.

Mobile lower: properties5-7 and the a/b/c/d cases retain their visible vertical sequence.
Fractions and underbrace labels remain distinguishable without text collisions. Three longer
formula tails intentionally require native horizontal scrolling and were seen at END in slot6.
The second separator is visible before the corollary, the final exp formula and following prose
fit the column, and the bottom0-question link remains readable. No page-wide clipping was seen.

Exercises: the native side-by-side sheet covers both entire exercise surfaces. Each contains a
legible lesson/Exercises heading, printed-page metadata and return-to-text link. The rest is
genuinely empty: no written exercises, instructional figure, answer entry or choice is visible.
This is an empty exercise page, not an error-only blank state.

Scroll endpoints: all20 native element captures were seen in one documented contact sheet,
START at left and END at right, rows in exact viewport/wrapper order. The tiny x_1 and exp_a
subscripts remain legible. The longer mobile ENDs show the final log terms and punctuation;
the underbrace curve and labels remain readable. Opposite-edge cropping is the expected scroll
window, not hidden/unreachable content. START and END ranges overlap, covering each complete
formula without an unobserved middle. No destructive clipping or visible overlap was found.

## Exact Image Coverage

Slot1 desktop text1440x1283: native full-width y[0,1283).
Slot2 desktop text1440x1349: native full-width y[1283,2632).
Slot3 mobile text390x1888: native full-width y[0,1888).
Slot4 mobile text390x1816: native full-width y[1888,3704).
Both cuts lie in actual paragraph gaps; there is no y-gap, overlap, omitted row or resized pixel.
Both concept lines are covered: desktop y601.9375 and2157.96875; mobile y931.5 and3075.96875.

Slot5 exercises1838x960 contact sheet: full desktop[0,960) at x0, full mobile[0,844) at x1448.
Slot6 endpoints756x524 contact sheet: all10 START/END pairs,20 native snapshots, no scaling.
Exact source PNG hashes, native crop rectangles, destination positions and raw RGBA equality
receipts are in native-image-projection.json. All original full/element PNGs remain unopened.
Plan was recorded before any model load in visual-allocation-before-load.json.
Final ledger is image-ledger.json: batch6/8 and lifetime6/24,0 reopens,0 additional crop loads.

## Preserved Unknowns And Exclusions

The original first harness failure is retained and not replaced or resealed. The supplied
prior text review PASS28, exact anchors and independently justified erratum are inherited
context only; none was rerun. Source/faithful114 exp_a BOTH subscripts versus the modern
registered exp correction remains unchanged; this check judges appearance, not that proof.
All unrelated historical UNKNOWNs remain unchanged.

Product UI, headed/OS behavior, auth, quiz judging, answer generation, DB/publication,
full-book acceptance and promotion remain out of scope and unverified here. No Git/backend,
refresh/setup, app/server, dependency/schema/Charter, publisher, p2c, prose_flow CLI,
layout/count/tests or answer operations ran. All writes stay inside the new correction root.
The parent must retain these evidence bytes before any separately authorized promotion.
