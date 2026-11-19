# Independent Source235-242 Review

STEMROBIN-182, book7a, offline finish:review. **Changes requested.**
Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Only review reports written; no source/tool edits, pipeline reruns, Git,
network, DB, app, dependencies, publishing, childagents or chats.

Eight actual source grids were opened once each, sequentially235..242,
before any target triplet or author evidence. No ninth image/crop/reopen.
The source-first inventory and row locations are preserved in
`source-observations.md` (SHA256
`a3fa64d9a1466b8649e218da5529b48c1931c6b68cc881ed490f99bb56def88d`).
The JSON report binds every current triplet, grid, FIRST receipt/stream,
failed snapshot and retained figure to SHA256.

## Findings

- **R239-lookup (P1):** Source-first reading at y317-362 is
  `sqrt(2.45) approximately1.565`, not the current1.555 at page.md:46.
  The middle fractional digit reads6. Current note and `p0239-math-1`
  register the1.555 transcription as a printed erratum. Independently,
  sqrt(2.45)=1.5652475842498528;1.555^2=2.418025 and1.565^2=2.449225.
  Thus1.555 is mathematically wrong, but this does not prove the source
  printed it. The source-reading premise of the registered erratum fails
  this independent review. Later source/current1.565 x10=15.65 agrees.
- **R241-818b (P1):** At page.md:73, current
  `1/sqrt(z+5)` differs from the source's `1/(sqrt(z)+5)`:
  the short radical bar covers z only, not+5. This changes the domain
  from source z>=0 to current z>-5. The note at:24 repeats the wrong scope.
  No defect is established for818v; the preliminary source-first
  `sqrt(1/(z-5))` reading was withdrawn, not used as a finding.
- **R237-805-rows (P2):** page.md:48 represents two physical rows,
  while source systems have upper equations y756-828, separate labels
  y835-866, lower equations y882-958. True page total23, current body22.
  Four equations are all retained; the missing represented row is the
  mid-height labels. Do not remove equations, repeat labels or fake a
  formula break. Note:24 incorrectly denies the independently visible row.
- **R238-separator (P2, counter only):** y1929-1933,x188-522 is a
  thin footnote rule, not text. True total25:23 main rows, one complete
  footnote, footer. Current text is complete; audit still fails26/25.
  The small matching star/asterisk-like markers can remain documented as*;
  the note does not continue onto239. Do not invent a26th row.

## Current Verdicts

| Physical | Printed | Source/Authored/Detected | FIRST exit | Current verdict |
| --- | --- | --- | --- | --- |
|235|229|26/26/26|1|Pass, technical recovery verified|
|236|230|26/26/26|0|Pass|
|237|231|23/22/23|1|Fail:805 physical-row representation|
|238|232|25/25/26|1|Fail:counter only; source text passes|
|239|233|26/26/26|0|Fail:lookup digit/source-erratum premise|
|240|234|28/28/28|0|Pass|
|241|235|18/18/18|0|Fail:818b radical scope|
|242|236|24/24/24|0|Pass for partial n40 only|

235 FIRST failed solely because `--books` pointed one directory too deep.
Existing `stages/source235-books-root-recovery.receipt.json` is exit0,
26/26, SHA256`a64e237aabeaf5ecfed0d46647a5848ff471348f3e3badbe8522e00d62824089`.
Its streams verify; FIRST/current body bytes are identical. Only normalized
frontmatter changed. This is **not a permanent human-approval HOLD**.
237/238 current triplets remain byte-identical to their frozen FIRST failures;
the parent229/233 counterpatch is not a237/238 retry or source approval.

## Continuity And Figure

235 p cont matches the human-supplied approved234 open sentence, text only.
803 closes on236;804/805 end n38 before heading39 on237. Examples2/4
resume in new paragraphs, so conceptual continuation does not require
unfinished p markers.806 open/cont crosses239->240;813 closes before814.
819 open/cont crosses241 figure/caption/footer to242 and closes n39 before
heading40. All806..819 belong to n39; final242 p open preserves partial n40.
Genuine formula folds, decimal digits and radical scopes otherwise match.

Figure55 is owned by819, caption separate. Grid inventory:
one36-column x12-row half-unit lattice, x=-7..11,y=-2..4; Cartesian axes
with right/up arrows and x/y labels; printed x values-6..8 and y values1,2,3.
One solid curve has finite endpoints about(-6,-1.5),(8,3), local maximum
(-2,2), minimum(2,-1), zeros near-4, between0 and1, and3.
The initial middle-zero estimate about0.5 is NOT an exact source-given value.
No legend, extra subfigure, dashed curve, named points or endpoint markers.

Audit box`[247,1533,1073,380]` contains the source inventory and excludes
caption/footer. Existing author/work figure hash
`0923bc94f6867f6e07c0551fbf5fd92d40daa6823096675d1bb99de78cf8546f`
matches. PNG header1097x404 is the box plus12px padding per side,
consistent with `layout.crop`. The crop was **not opened**; no crop/modern
visual approval is claimed. Exact paths, bounds and inventory are in JSON.

All24 current triplet files exist and Markdown metadata matches JSON.
No independent repair, self-approval or downstream approval was performed.
