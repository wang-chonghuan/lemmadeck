# Bradis General And Interpolation Rules

STEMROBIN-182 OFFLINE, 2026-11-19. Exact checkout:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`; branch:
`codex/STEMROBIN-182-textbooks`; HEAD:
`e16207d939526da0ebb2cfc528f084f0c3791afb`.

**Bounded rules capture complete; answer-method HOLDs unchanged.**
Seven existing images opened once each, original detail, fresh image ledger
**0 -> 7**. No extra images, fronts, table-page images, reopens, crops, OCR,
rendering, network, browser, DB, application, answer-key authoring, tools,
finalization, promotion, Git writes, or arithmetic re-review. Only this directory
was written. Existing table-author report was read for method context only;
its full cell transcripts were not read.

## Identity And Actual Pagination

The previously identified source is V. M. Bradis, *Four-figure Mathematical
Tables*, Drofa, Moscow, 2010, 13th stereotype edition. That identity is reused
from `../bradis-identification/identification.json`, not re-established from
front matter. Existing PDF SHA-256, freshly hashed without rendering/extraction:
`249b865dc7ae985ecfa6604531efb5e8b7896c481db1a5e2f4170940f4033656`.
No claim of identical historical table content is made, and no historical-edition
approval gate is invented.

The footer region was checked first on each open:

| Existing Image | Projected Printed Page | Actual Footer | Actual Content |
| --- | ---: | --- | --- |
| page-05.png | 4 | Not visible | General rules 8-10; accuracy warning; underlined-value convention |
| page-86.png | 85 | 85, lower right | Explanations to the tables; rounding and table-step definitions |
| page-87.png | 86 | 86, lower left | Linear interpolation; lower-add / upper-subtract procedure |
| page-88.png | 87 | 87, lower right | Error sources and bound; ready-made corrections |
| page-89.png | 88 | 88, lower left | Second excess digit; admissibility warning; scaling introduction |
| page-90.png | 89 | 89, lower right | Scaling example; inverse interpolation |
| page-91.png | 90 | Not visible | Cosine, tangent, square-root and cube-root series; no explanatory prose |

Thus only printed **85-89** are authenticated by actual footers here.
The general-rule image is called **projected printed 4**, not footer-verified 4.
Likewise the last image is **projected printed 90**, not verified printed 90 or
an inspected continuation of interpolation prose. Its formula content is
recorded as a supplied-file/content mismatch with the expected task location,
not evidence of a missing/reordered PDF leaf or a reason to open another image.

## Captured Rules

English below is direct translation or close paraphrase of visually read prose;
equations and numbered references preserve the source's meaning. Exact locators,
evidence tiers, applicability and absences are in `source-rules.json`.
The three bounded Russian excerpts below total 19 whitespace-delimited words.
No explanatory grid or mathematical table cells were transcribed.

1. **Preliminary rounding is relative, not a universal four-digit cutoff.**
   Projected printed 4, top, rule 8: if some data have more decimal places
   (first-degree operations) or more significant figures (second- and
   third-degree operations) than others, round those data beforehand, retaining
   only one extra digit: `сохраняя лишь одну лишнюю цифру`.
   This rule does not say to round every table argument to four figures.
   Rule 9 says that when data may be taken to arbitrary accuracy, a desired
   k-digit result requires enough input digits to yield k+1 digits under rules
   3-6. Rule 10 applies specifically to logarithmic evaluation without addition
   or subtraction: use a logarithm table with one more decimal place than the
   fewest significant figures in an approximate datum; discard the final
   significant digit at the end. Do not transfer that logarithm-only rule
   literally to every square/root lookup.

2. **More than four input figures can be used by an extended correction.**
   Printed 88, second paragraph: for a large tabular difference, apply a
   correction not only for the first digit of the excess over the lower
   argument, but also the second if present, reducing the ready-made correction
   tenfold: `не только на первую цифру избытка, но и на вторую`.
   The prose's example is 2.9345 squared: a correction for 4 thousandths,
   then one for 5 ten-thousandths obtained by dividing the printed correction
   by 10 and rounding. This is affirmative five-significant-input method
   evidence, not a blanket instruction to preprocess to 2.935.
   No new lesson answer was calculated from that example.

3. **No explicit exact-5/tie convention was found.**
   The inspected prose rounds corrections to whole last-place units and includes
   non-tie examples such as 4.8 becoming 5 and 2.9 becoming 3. It does not
   prescribe what to do with an exact half, distinguish half-up from half-even,
   or define negative-tie behavior. This is absence in this seven-image
   selection, not absence in the whole book. Modern n38 explicitly says
   ordinary Chinese rounding for 8.4372 -> 8.437; that existing lesson contract
   must not be erased because the Bradis selection lacks a tie paragraph.

4. **Reserve digits are supported, with a first-hand/secondary distinction.**
   Rule 8's one-extra-digit preprocessing and rule 9's k+1 target are first-hand.
   The standalone intermediate-result rule 7 is on the excluded earlier
   general page: the existing identification paraphrases it as keeping one
   reserve digit in intermediate results, dropping it at the end and
   underlining it. Rules 3-6 on that earlier page are likewise secondary here:
   addition/subtraction follow the least precise decimal place; products and
   quotients follow the fewest significant figures; squares and roots of
   approximate data retain the input's significant-figure count, with different
   reliability of the final digit. This capture does not pretend to have
   re-observed those earlier pixels.
   Projected printed 4's warning is first-hand: these practical rules give no
   guaranteed accuracy for the last result digit, which can in individual
   cases err by several units; smaller errors are more probable.

5. **Main-entry rounding and interpolation have different error limits.**
   Printed 85, paragraph beginning with all tabulated function values:
   directly tabulated values are rounded to four or five significant figures
   and differ from the exact values by at most half a last-place unit.
   Printed 87, paragraph beginning with the accuracy question: interpolation
   has three errors, from the base entry (at most half a unit), from the
   correction's tabular/rounding errors, and from imperfectly uniform function
   change. If neighboring tabular differences differ by at most four
   last-place units, the third error has no appreciable influence; total
   interpolation error can slightly exceed one unit only in exceptionally
   rare cases. This is not an unconditional <=1-unit guarantee, nor the
   main-entry half-unit guarantee for corrected values.
   Printed 88 warns against linear interpolation when changes are sharply
   nonuniform. Where ready corrections are absent, check neighboring
   differences first and interpolate only when they differ by no more than
   four units: `не превосходящей 4 единиц` is the matching bound on printed 87.

6. **Corrections are genuine table-first operations, not direct final rounding.**
   Printed 86: with table step h, tabular difference d and argument excess u,
   the correction is v=du/h in the stated last-place units. Add it to the
   nearest lower tabulated value, or subtract a deficit correction from the
   nearest upper value. Printed 86 bottom -> 87 top says lower/add is more
   advantageous when the excess does not exceed half the step; above half,
   upper/subtract is more advantageous. This general recommendation does
   not overrule modern n39's explicit additive examples.
   Printed 87 bottom explains that ready-made italic corrections can use a
   row-average correction multiplied by 1-9, rounded to integers; printed
   88 top permits row subdivisions or full calculation where needed.
   Their construction is not the exact increment at every cell, and two
   separately rounded routes need not universally agree.
   Printed 89's inverse procedure uses u=hv/d after checking admissibility
   and prefers the nearer tabulated function value; it is context, not a
   replacement for n39's dedicated root-table exercise method.

7. **No task-specific sum/product/difference staging recipe appears here.**
   Rule 8, rule 9, interpolation, and the secondary earlier rules are relevant,
   but the inspected selection does not prescribe the full mixed-expression
   sequence: which square/root table entries to use, at which step to reduce
   a summed/subtracted radicand, and exactly how to round the final product.
   Function-specific scaling is illustrated on printed 89 with circle area
   changing by 100 when diameter changes by 10. Modern n39 itself explicitly
   normalizes by powers of 100 and adds correction values; that is already
   available method evidence, not a new missing historical approval.

## Applicability To The Existing HOLDs

The frozen independent reports remain authoritative for arithmetic PASS:
n38 **49/49 references agree, 18 lookup HOLDs**; n39 **14 exercises / 76
outputs agree, 19 complete / 57 table-method HOLDs**, including five overlapping
preprocessing outputs. No re-solve, new key or completion recount was performed.

| Existing Method Issue | What This Capture Supports | What It Does Not Decide |
| --- | --- | --- |
| n38 input 8.4372 | Current modern prose index 14 / p0235#7 expressly rounds to 8.437 before lookup | Bradis does not impose that as its only >4-digit method; it also permits second-excess-digit correction |
| n38 >5 correction routes | General half-step lower/add versus upper/subtract preference; preserve the table-author report's route disagreements | No replacement of lesson additive results with another route's answer |
| n39 806d: 1.0058, 6.83251, 20.156 | n38 supplies an explicit four-figure preprocessing precedent; general prose permits extended corrections in some cases | No universal IV cutoff or selected 806d route is stated in this batch; proposed 1.006 / 6.833 / 20.16 remain conditional targets, not answers |
| n39 811 sum/difference and 814 table-factor product | Keep the existing table-first prompt/method; approximate/guard precision rules are relevant | Do not replace component lookups with a direct high-precision final expression |
| n39 813b | A corrected intermediate is not entitled to the main-entry half-unit guarantee; retain the disclosed direct 3.73 versus table-intermediate 3.735 distinction | No exact-half rounding rule is captured and neither result is approved here |
| n39 815 approximate inputs | Current exercise hint explicitly retains the radicand's significant-figure count, excluding leading zeroes | No new uncertainty interval or guaranteed true-root precision |
| n39 816 squares then sum/difference then root | Original inputs 31.4/27.1 and 43.7/21.6 are approximate to three significant figures; retain the lesson's precision hint context for a final three-figure result and one reserve digit in intermediate work | No exact table-first staging is dictated by rule 8 alone; do not silently replace table-derived radicands by nominal direct arithmetic |

For 816, the permitted table-author report records table-first radicands
1720.4 / 1443.4 and conditional four-figure normalized targets 17.20 / 14.43.
Those numbers are **reused secondary method context**, not newly read cells,
new arithmetic, approved staging or new answers. Approximate original inputs
must not be treated as exact merely because a table returns four figures.

## Next Necessary Specific Gap

The next work is a **bounded method adjudication, not another arithmetic pass**:
choose and document the current lesson's 806d preprocessing route (apply the
explicit n38 four-figure precedent to IV, or use an explicitly justified
extended-correction route) and the exact guard/rounding stages for 816's
table squares -> sum/difference -> root -> final three figures, then compare
only those held methods against the already captured cell evidence.
For 813b, make the final exact-half convention explicit at the already
reported intermediate 3.735 instead of calling the direct 3.73 a table result.
No human historical-edition-equivalence approval is a prerequisite invented
by this report.

If an additional Russian primary precision/tie paragraph is claimed to exist
at projected printed 90, its location first needs correction: the authorized
`page-91.png` contains series formulas and no footer or such prose. No extra
image was opened to resolve that locator. Rules 3-7 remain clearly labeled
secondary; the earlier page was excluded and not reopened.

`source-rules.json`, `image-ledger.json`, and `hashes.json` bind these findings
to all seven images, the PDF, the read method context, current lessons and
unchanged prior reviews. The hash manifest excludes its own recursive hash.
This is rules evidence only. No answer approval and no HOLD lift. Stop here.
