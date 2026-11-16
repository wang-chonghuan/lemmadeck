# FIRST SOURCE Review: 7p Physical 302/303

Same STEMROBIN-180/C rolling OFFLINE batch30 invocation. Sole independent source review completed: **1/1; inflight 0**. No capability freshness or Grill restart.

Base: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Review root: `.tmp/ld-s10y-lesson/source-review-7p-302303-first/`.

## Decisions

| Physical / Printed | Decision | Rows | Blocks | Figures | Correction Used / Unused |
| --- | --- | --- | --- | --- | --- |
| 302 / 291 | HOLD: confirmed typography corrections and unresolved source certainty; not approved | 23 | 14 | 1 | 0 / 1 |
| 303 / 292 | HOLD: confirmed punctuation/typography corrections and unresolved source certainty; not approved | 26 | 7 | 0 | 0 / 1 |

## Confirmed Smallest Corrections

Each entry is independent. Addresses use one-based block references and zero-based JSON array pointers. No correction was applied.

1. **302-C1: remove the bold markers around the single glyph 一 at the end of printed row 6.** The independently observed bold statement begins on the next printed row; 一 is regular. Current `artifacts/7p/pages/0302/page.md:54`; `page.json#/blocks/1/lines/1`; block `p0302#2`, printed row 6. FIRST candidate `FIRST/302/before-finalize/page.md:35`; FIRST result has the current MD address. Do not fold the unresolved next-row 个 boundary into this correction.
2. **302-C2: preserve the footer digits' observed bold-italic appearance.** Current footer encodes italic only as `*291*`; independent source facts record bold, slanted digits. Current `artifacts/7p/pages/0302/page.md:96`; `page.json#/blocks/13/lines/0`; block `p0302#14`, printed row 23. FIRST candidate line 76. Smallest marker change: `*291*` to `***291***`, leaving the surrounding dots unchanged.
3. **303-C1: restore the sentence-ending dot after 不易发生变化的.** Printed row 8 reads `不易发生变化的. 如果`; the candidate/current artifact substitutes a comma before 如果. Current `artifacts/7p/pages/0303/page.md:45`; `page.json#/blocks/1/lines/3`; block `p0303#2`, printed row 8. FIRST candidate line 37. Smallest correction is `，` to `.` at that boundary; preserve the following word and printed row.
4. **303-C2: preserve the footer digits' observed bold-italic appearance.** Current footer is `*292*`. Current `artifacts/7p/pages/0303/page.md:73`; `page.json#/blocks/6/lines/0`; block `p0303#7`, printed row 26. FIRST candidate line 65. Smallest marker change: `*292*` to `***292***`, leaving the surrounding dots unchanged.

All artifact paths above are below the directly bound `.tmp/ld-s10y-lesson/source-author-7p-302303/`; no pointer inside an older manifest was followed.

## Unresolved Certainty

- **302-U1:** exact bold classification of next-row 个 and the emphasis-ending dot at current MD line 55. Frozen facts distinguish the securely thickened 原子...中性的 characters from these boundary glyphs. This is not an additional confirmed correction.
- **302-U2/U3:** biography type-weight boundaries outside the name and precise whitespace around 放射性, current MD lines 80–84. Source raster does not establish exact whitespace codepoints.
- **303-U1:** terminal dot weights and adjacent parentheses/comma at emphasized terms, current MD lines 43, 50, 53, 59, 62. Character spans are enumerated; punctuation weight is not borrowed from candidate certainty.
- **303-U2:** tiny below-baseline marks in printed row 25/current MD line 70 cannot be assigned to an exact intentional underdot span with secure independent certainty. Candidate plain text does not settle this.
- **303-U3:** source plus-glyph Unicode width is indeterminate; the bound profile allows mathematical `$+$`. No glyph-width repair is asserted.
- **303-U4:** frozen own row 11 transcribes 成分, while FIRST/current says 成份 at MD line 50 (`#/blocks/2/lines/1`). The source glyph discrimination is not secure enough to claim a confirmed substitution. Frozen facts are preserved, not silently rewritten or replaced with candidate wording.
- **303-U5:** frozen own row 16 transcribes 原子, while FIRST/current says 质子 at MD line 57 (`#/blocks/3/lines/0`). This is an unresolved independent-reading discrepancy, not an authorized correction or an inference from physics.

## Evidence and Boundaries

Original 0302 then original 0303 were opened before any candidate, template, layout, author facts or report. Four own detail crops preceded exclusive `wx` sourcefacts allocation at mode `0444`. Candidate exposure began only after that freeze. One final immutable snapped portrait was then opened. Image ledger: **7/8 used, 1 unused; 2 originals + 4 own crops + 1 final portrait; no reopens; parent 0; context 7/24**.

Authority: `.tmp/ld-s10y-lesson/source-author-7p-302303/delivery-manifest.json`, **114465 bytes**, SHA256 `cbbf0d74f9a3c569b9b6603183754a2dc47be7a8810d67475549bca009ad4420`. Independently bound **483 OBJECT.files[] direct workspace-relative paths once**, preserving actual input modes. No nested history/origin/source_path/declared_by traversal and no PDF copy.

Current MD/JSON/audit are byte-identical to immutable FIRST results and CURRENT snapshots. Both FIRST finalize calls exited **0 once**; printed/MD rows **23/23** and **26/26**, blocks **14/7**, portrait **1**. Their authoritative proof is reused; no finalize rerun, supplementary checker, repair, or repeated source review.

Page identity is `page.meta.book == "7p"` and `page.meta.page == 302/303`. Hierarchy agrees: 302 incoming `p cont`, independent neutrality paragraph, 问题 and questions 1–6, independent biography, uncaptioned portrait owned by `phy7-c2-s1-n119`, h3 120, `p open`, footer; 303 matching initial `p cont`, five further closed paragraphs, footer. No fake `samerow`. Figure256 is a text reference only on 303.

Incoming structural evidence was read only after frozen facts, without following its pointers. Its earlier status is superseded by the user's current gap list: **239,242,246,257,271–277,280,281,288–296,298–301**. 300/301 remain blocked; none of their body/images was read. 297 remains approved/promoted; total 7p **61**, raw index **54/21/85**, unchanged. Neither full unit119/120 nor cross-gap completeness is claimed.

No source304, author changes, promotion, assembly, modern/answer/choice work, DB/backend/env/app/schema/shared-tool changes, Git, network, publication, deployment, handoff, extra supervision or other-chat messages. Immutable `sourcefacts.json`, `imageledger.json`, `review.json` and flat self-excluded `delivery-manifest.json` live in the review root. Actual unique recorder calls/streams use `batch30-source302303-first-review-`.
