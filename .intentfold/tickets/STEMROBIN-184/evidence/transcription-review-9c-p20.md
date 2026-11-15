# 9c Physical Page20 Independent Transcription Review

Ticket: STEMROBIN-184. Physical20 / printed13; source PNG1695x2381.
The actual full clean PNG was inspected before the durable transcription.
This is the completed single source-first inspection, not a repeated image
review. Only this page's faithful MD/JSON, audit and prepared layout were
compared. No answers, choices, modern artifacts, other reviews or neighboring
source scans were consulted. No source edit, finalize, assembly or browser ran.

**Initial comparison: REVISE, one definite omitted source character in exercise24.**
The current mechanical audit is PASS21/21. All other inspected text/formulas
and the page boundaries are accepted; a row-count PASS does not detect this
character omission.

## Finding P20-01: Exercise24 Omits 个

Durable `ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0020/page.md`,
line45, the second printed row of ex24:

- Actual print: `条不交于一个点. 证明它们将平面划分成...`
- Current transcription: `条不交于一点. 证明它们将平面划分成...`
- Required faithful correction: insert `个` between `一` and `点`.

The direct-source crop `24-wording.png`, box `[320,1040,1180,185]`,
shows the complete second printed row and distinctly printed `一个点`.
This is a pixel-based character finding, not an inferred mathematical
rephrasing. It changes neither the three-row ownership of ex24 nor its
formula. Parent owns the correction; no durable file was changed here.

## Source Coverage And Boundaries

- The first object is `ex 22 cont`, containing Cyrillic `б)` only. Its first
  printed row ends after the alternating sum's `n^2`; the second begins
  with `=` and the printed right side. The current single formula with
  `↵` before equals faithfully preserves those two actual rows.
- Ex23 has starred23 and Cyrillic `а)` / `б)`. Both subparts independently
  occupy two actual printed rows, with equals beginning the second row.
  Both existing `↵` markers are correct. The source crop `23-breaks.png`
  preserves the whole two-subpart layout; numerator/denominator height is
  not counted as extra print rows.
- Ex24 occupies three printed rows. Apart from the omitted `个`, the stem,
  displayed inline fraction and final `区域.` match.
- Ex25 occupies five printed rows: three prose rows, one separate tall-
  fraction formula row and `个区域.`. The separate formula is not a
  duplicate line and is not split into numerator/denominator text rows.
  The printed conditions and `(n+1)(n^2-n+6)/6` are retained.
- Ex26 occupies two printed rows and retains `不多于` with
  `n^2-n+2`, followed by the one-row exhead for27--28.
- Ex27 has one row each for Cyrillic `а)` and `б)`, with the observed
  powers, coefficients and divisor text unchanged.
- The last object is `ex 28 open`, containing only `а)` on this page.
  Its printed expression `10^n+18n-28` and divisor27 are retained.
  The unfinished exercise boundary is correct; no empty continuation
  or invented next-page text is needed.
- The folio is `· 13 ·`, with a visible round dot on each side.
  This page has no source figures, captions or section heading.

## Independent Printed-Row Inventory

| Source object | Actual printed rows |
| --- | --- |
| ex22б) continuation, broken before equals | 2 |
| ex23а) + б), each broken before equals | 4 |
| ex24 | 3 |
| ex25 | 5 |
| ex26 | 2 |
| exhead | 1 |
| ex27а) + б) | 2 |
| ex28а), exercise remains open | 1 |
| folio | 1 |
| Total | 21 |

There are20 actual body/exhead/formula rows plus one folio, independently
consistent with the durable21-line transcription. No `samerow` or figure
ownership is required.

## Raw Layout Caveat

Current `audit.json` reports21/21 and empty errors, normalizations,
unknown characters and KaTeX warnings, with no count exclusions.
The prepared raw layout is not a one-to-one representation of those
actual rows: band `[712,939]` combines both printed ex23б) rows, while
band `[2360,2380]` counts the bottom scan-edge ink. Thus its21-band total
is consistent with one merged pair and one extra non-text band, rather
than proving that every actual printed row was independently detected.
The narrow left-margin ink near ex23б) is irregular scan ink, not a glyph,
formula or figure; its direct crop is retained as evidence.

Do not simply remove the bottom band and then delete or duplicate a formula
to recover the total. The complete21-row source transcription must remain.
This report does not change exclusions or rerun the counting pipeline.

## Actual SHA-256

All current input hashes still match the snapshots used for the source
inspection and comparison:

- `.tmp/ld-s10y-lesson/9c/pages/0020/page.png`:
  `4b2169535e95cfe2c898093803c497d136305c106c9173c3da79598ae915f7e5`
- The same scratch page's `layout.json`:
  `79520de4f5a1a924f78aa3ce4404b34666eff0b00d0dddab29297a13ddc454c0`
- Durable `ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0020/page.md`:
  `71fcea2ae3fd19b323710f8033d79f93c5a7d3e642f78d403d92b413fd4e370a`
- The same durable page's `page.json`:
  `9715ad7666f9ce786389a5b752a2745030f2ab7a1ecf8700afddc800ac82302c`
- The same durable page's `audit.json`:
  `c624a54c757b38b34ad55298283ecb1b861196b8127c4e48a517aae393c14d91`

Direct-source crops under ticket `tmp/transcription-review-9c-p20-crops/`:

- `24-wording.png`, box `[320,1040,1180,185]`:
  `3f787c65943f41b4850b7328a7ad89adac0a0317267fc2d1fc66e0bff71dc824`
- `23-breaks.png`, box `[215,420,1270,535]`:
  `f5615e5d3e5ff17cdee21acb8e3099bcd3afc2b8611b0e67d2d2ea91db88d0c2`
- `left-ink-bridge.png`, box `[0,700,100,250]`:
  `b85c1c967e23d85ba9c58aed1b976eca6606f9d445d1a7447186f9e455a31b1f`

These crops preserve actual source pixels. No mathematical answers or
truth-of-exercise judgments were derived for this transcription review.

## Changed-Only Follow-Up: P20-01 Resolved

Parent inserted the original printed `个`; the current ex24 second row is:

```text
条不交于一个点. 证明它们将平面划分成$1+\frac{n(n+1)}{2}$个
```

**Current transcription PASS; current audit PASS21/21.** No p20 scan or crop
was reopened for this follow-up. The finding above remains the initial
source-based evidence, not a request for another correction.

Exact changed-only checks, without writing reconstructed files:

- The target `条不交于一个点.` occurs once. Removing only that added `个`
  from current `page.md` reconstructs SHA-256
  `71fcea2ae3fd19b323710f8033d79f93c5a7d3e642f78d403d92b413fd4e370a`,
  exactly the initial independently reviewed MD hash.
- Removing only the same `个` from ex24's current JSON block and serializing
  with the existing formatting reconstructs SHA-256
  `9715ad7666f9ce786389a5b752a2745030f2ab7a1ecf8700afddc800ac82302c`,
  exactly the initial reviewed JSON hash.
- Thus every other body/formula byte, source metadata and block boundary
  remains unchanged. The source PNG hash also remains unchanged.
- Current audit has21 printed and21 MD rows, empty errors and character/
  formula warnings, no figures, errata or exclusions. Its bytes are unchanged.
  The raw-layout caveat above still applies; no counting changes were made.

Current actual SHA-256:

- Source PNG:
  `4b2169535e95cfe2c898093803c497d136305c106c9173c3da79598ae915f7e5`
- Durable `page.md`:
  `344c2fa2e71b8d44d45ce8bd333c3786f9d481ec449681b572183f6bf1f24188`
- Durable `page.json`:
  `809ff7841609891ef72aeff2baa61ec60bdf218ec019c989863f40bc90819e18`
- Durable `audit.json`:
  `c624a54c757b38b34ad55298283ecb1b861196b8127c4e48a517aae393c14d91`

Only this review report was changed here; parent retained source/finalize
ownership.
