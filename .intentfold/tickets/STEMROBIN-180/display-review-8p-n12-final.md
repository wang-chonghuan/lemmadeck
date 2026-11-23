# STEMROBIN-180 n12 Remaining-Surface Display Review

Verdict: **REVISE, D12-DISPLAY-3 (mobile written question 7 unit wrapping). Automated combined six-surface checks PASS; actual combined display PASS is not supported.**

## Authorized Execution

- Same independent reviewer, remaining-five DISPLAY ONLY. Commands used `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
- Current checker uses the three exact surface-specific titles and the explicit optional `device:surface` skip. Executed once through the existing wrapper into modern n12 `production-evidence/display-surface-title-recovery`, with arguments `text,exercises,choices` and `desktop:text`.
- Receipt: 2026-11-23T08:26:08.778Z through 08:26:10.562Z, exit 0, no signal, empty stderr. Output `display/affected-check.json` records `reusedSurfaces=["desktop:text"]` and exactly five successful new results.
- Desktop text runtime/visual PASS was reused from the preserved exercises-failure JSON and first affected report. Its screenshot was neither opened nor regenerated in this phase.
- All five new screenshots were inspected once. No additional browser run, crop, source replay, text/math/answer review replay, renderer, finalization, or whole-package proof gate.

## Finding D12-DISPLAY-3

**REVISE, actual visual defect:** at mobile 390x844, written question 7 in `display/mobile-exercises.png` wraps the squared exponent onto the next line, detached from its unit. The preceding line ends with `1.6 米/秒`; the next begins with the raised `2` followed by the question continuation. This makes the acceleration unit visually incomplete on its first line despite every character being present.

Narrow repair for the parent: keep the displayed unit and its exponent as one nonbreaking inline unit in the written-question rendering. Preserve the exact question, value, units, exponent, answers, and approved semantic inputs. Do not replace the literal unit, edit source text, or correct the science. The automated page-width/count checks do not detect this orphaned exponent.

No repair was applied. Stop dependent work pending affected mobile-exercises display recovery; do not replay the five visually approved surfaces.

## Runtime And Visual Coverage

| Surface | Runtime | Visual Verdict | Evidence |
| --- | --- | --- | --- |
| Desktop text | Reused PASS | Reused PASS | Prior exercises-failure JSON and affected report |
| Desktop exercises | New PASS | PASS | `desktop-exercises.png`, 1440x2239 |
| Desktop choices | New PASS | PASS | `desktop-choices.png`, 1440x2295 |
| Mobile text | New PASS | PASS | `mobile-text.png`, 390x7191 |
| Mobile exercises | New PASS | REVISE | `mobile-exercises.png`, 390x3263, question 7 exponent |
| Mobile choices | New PASS | PASS | `mobile-choices.png`, 390x2732 |

- Text on desktop (reused) and mobile has 48 paragraphs, zero paragraph indent, and seven visible 1px separators at exact indices `[2,10,16,21,26,31,40]`, each with nonempty adjacent prose. The independent previously approved adjacencies were not semantically rereviewed.
- Mobile prose math: 101 measured elements, `KaTeX_Main`, 18.656px against 16.96px prose, matching the reused desktop result. The long example calculation wraps without clipping; page ending and navigation are visible.
- Each written surface has 8 whole question rows and 8 nonempty reference-answer blocks. All eight are visually present through the final answer. Mobile typography remains legible, but the question 7 unit/exponent break prevents its display approval.
- Each choices surface has 7 questions and 28 complete visible options. All 24 radios and 4 checkboxes are disabled and unselected; no key/rationale markers, enabled answer controls, raw markup, or KaTeX-error elements passed through the checks. The screenshots show no answer highlights or visible key leakage. These are display findings, not a repeat option-truth review.
- New page scroll widths equal their viewport widths (1440 or 390), console errors are empty, and all five bottom-reachability checks pass. There are 0 figures. No obvious overlap or clipping was seen other than the identified unit/exponent separation.
- Mobile exercise/choice headings wrap onto two lines without overlap. The mobile text image was automatically displayed at 325x6000 by the image tool; the stored original remains 390x7191. This is one image load, not a reviewer crop.

## Exact Evidence And History

Durable final-phase bindings: modern n12 `display/final-review-bindings.json`.

- Current executed checker SHA256: `f5c77ccc8ab9e42c48702b710942c2e1d64b1ecbfd2e7fa15a7be4fc35928068`.
- Five-result runtime evidence SHA256: `b1b48946213f1424235904bb409dbfee5a46e2a0cfb7b21d453d714bde550bd6`.
- Recovery receipt SHA256: `744c9e139c105b48def589ba927de7be8c13dcc4d8a8141b5cfd3823d8ae81c1`.
- Affected mobile exercise screenshot SHA256: `6a91db13fe1c87e82b372ef312370debac1ff62bfb84a6b1e6b07e406e9e4da3`.
- Reused desktop-text runtime evidence SHA256: `8899eea7a971bc1e6d2d6c9213885d7fedc9b73cb57e8e6fa746a607537d81b0`; its earlier visual approval remains in the first affected report.
- First report/bindings and first affected report/bindings retain their frozen hashes. D12-DISPLAY-1 and D12-DISPLAY-2 remain historical failed assertions; their title conditions now pass. The parent-preserved `title-recovery-checker.mjs` matches the prior executed script hash.
- New runtime input hashes match the seven previously bound approved inputs. No semantic or whole-package gate was rerun. Prior source/modern/blind/answer approvals, earlier sign-stem failure, answer-copy PermissionError, counts, and costs are retained without reclassification.
- Execution ledger: initial display exit 1, title recovery exit 1, this remaining-surface recovery exit 0; each authorized execution ran once. This adds one visual finding despite the successful final runtime execution. No new cost measurement asserted.
- Image ledger: prior 14 + 5 newly generated screenshots inspected once + 0 crops/reopens = **19/24 cumulative**, **5/7 this phase**. Byte-identical newly generated desktop exercises still counts. No source images or image payloads returned.

No `display/check.mjs` copy was made because actual display approval remains REVISE. Only the requested final-phase report/bindings were written. No content, options, answers, previous reports, previous bindings, historical failures, or production inputs were edited.
