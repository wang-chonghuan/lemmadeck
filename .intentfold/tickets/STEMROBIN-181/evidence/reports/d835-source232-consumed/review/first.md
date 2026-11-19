# Source232 First Independent Review

Status: **SOURCE FAIL (one localized Cyrillic initial); NATIVE FAIL (first 23/24
receipt preserved); current read-only counter diagnostic also 23/24.**
No SOURCE PASS, RAW PASS, waiver, native recovery, or dependent-stage approval.

Scope: STEMROBIN-181/181-3 authorized offline review, book 10p physical232 /
printed222 only. Sole checkout and every shell cwd:
`/Users/yong/.codex/worktrees/00b1/lemmadeck`.
Only writes: this checkout's
`.intentfold/tickets/STEMROBIN-181/tmp/d819-source232-first-independent-review/`.

## Scoped Findings

1. **SOURCE character defect, p0232#10, physical row22, candidate page.md line81.**
   Frozen `А·П·杰列宁` does not match the pixel-supported reading `А·Н·杰列宁`.
   The disputed glyph has two uprights with separate top serifs and opposing
   inward mid-height stubs; the middle connection is broken in the scan.
   It does not have a connecting top bar. This supports Н (U+041D), not
   П (U+041F), solely from the source pixels. The source-focused crop is
   `(x=970,y=1925,width=115,height=65)`, enlarged 6x by nearest neighbor.
   The first scientist's `И·В·` (U+0418/U+0412) is correctly preserved and must
   not be Latinized or otherwise changed. No surname, identity, science, or
   modern translation correction is proposed. No corrected candidate was made.
   An authorized localized candidate correction and affected-only review remain
   necessary; a counter repair alone cannot approve this frozen candidate.

2. **NATIVE row-count defect; content has 24 real physical rows, not 23.**
   Original finalize exit1, `lines_printed=23`, `lines_md=24` stays authoritative
   for that invocation. Prepared saved bands `[1882,1946]`, `[1947,2011]`
   divide the three-row footnote into two artificial bands. Source ink extents
   in isolated footnote row windows, inclusive y:
   `[1881,1924]`, `[1933,1977]`, `[1983,2011]`; the last row is the real `的.`.
   The first row's row-projection threshold starts at1882, excluding one
   sparse top pixel; this does not change its row identity.

   The **updated** read-only `layout.py` snapshot
   `2a49cc6debed81c6cf74c53923e37c67dacb446d6f664845708416e14d119285`
   still returns23 but now has footnote bands `[1882,1924]`, `[1933,2011]`.
   Its trace in `diagnostic.json` confirms:
   - `line_bands` first merge, lines431-448: `[1933,1977]` and `[1983,2011]`
     have gap6 <= merge_gap16. `_small_prose_continuation`, lines193-245,
     requires at least two qualifying lower-row glyphs; the isolated final
     Chinese character plus a full stop is not protected as a separate row.
   - Expansion, lines515-539: merged height79, body typical_h42,
     typical_gap28, pitch70 initially gives count2. The 20%-of-maximum
     ink threshold yields only strong core `[1936,1970]`; the short last row
     is missed. Height79 <= 2.2*42 and fewer than two cores force count1.
   - This is a demonstrated remaining short-footnote-tail defect in the
     updated tool, not a re-executed first failure or approval of that patch.
     The first native tool hash was
     `59dd8aeedf0950585df7247b82def7cb96e0422cdca5ed42fe70579ed210a0ee`.
     Its code was not recovered through Git or silently treated as unchanged;
     only its retained receipt and saved bands establish that first failure.

No content was collapsed, omitted, duplicated, or artificially wrapped to
match the detector. Parent d816 owns any layout repair and later failed-native
recovery; this reviewer patched no tool and invoked no finalize.

## Checks That Pass Within This Review

| Source-only check | Result |
|---|---|
| Row inventory by block | 3,5,1,3,4,1,1,1,1,3,1 = 24 |
| Figures, captions, tables | None; RAW review not applicable |
| Original questions | Exactly 1,2,3; three complete separate ex blocks |
| Incoming boundary | p0232#1 `p cont` completes supplied text-only p0231#10 after `那么` |
| Actual paragraph endings | Closed; no block open at this page end |
| Formula reference | (7.8) preserved |
| Green wavelength | λ_绿 = 5.5 x 10^-5 厘米; source value, not corrected |
| Real formula wrap | One `↵` immediately after `=` across physical rows6/7 |
| Quarter wavelength / equation | 1/4; h = λ_绿 / (4 n_膜) retained |
| Footnote | Three physical rows; unique body① and matching footnote① |
| Footnote wording | 波长的整数倍 preserved without science correction |
| First Cyrillic initials | И·В· exact |
| Footer | Printed222, one row |

These individual passes are not an overall SOURCE PASS for the frozen candidate.
The previous page was not reviewed or approved. Only its block10 text was read,
after the source232-first observations; no source231 pixels were loaded.

## Independence And Actual Usage

`source-first.md` was written before reading candidate prose, author prose
report, previous-page block10, or counter code. The supplied manifest was read
first only for location/hash binding; its initial/count questions were visible.
No author crop, author inventory, other source page, external biography,
scientist-name knowledge, answer key, or modern edition drove this verdict.

This invocation used **one batch, four actual image loads, zero reopens**:
one original source232 full page; the initials 3x crop; the original formula
crop; the focused second-initial nearest-neighbor 6x crop. The three displayed
crops/derivatives each count as one load. Unshown crop files and numeric pixel
analysis add no image-bearing context. Batch4/8; context4/24.
The author's separate historical four loads are preserved, not reset or
claimed as this review's usage. No meter or token/billing telemetry was read.

Zero prepare/finalize/vectorize invocations, source/content revisions, paid
calls, assemble/modern/canonical/index/meter/Git/DB/publish/deploy operations,
branches/worktrees, messages, other chats, or agents. All other contributors'
files remain untouched. The read-only counter loaded one current in-memory
snapshot with bytecode disabled; its hash matched after execution.

## Bound Paths And Hashes

All following paths are within the sole absolute checkout above. `review.json`
and `freeze-manifest.json` record absolute paths, sizes, hashes and statuses.
The latter binds the author's own source pixels, root/work and first failure
without copying that entire evidence package. All20 frozen author file entries
matched their manifest at this review's diagnostic.

- Author report: `d810-source232-first-author/report.md`
  SHA256 `a48d264ded582b62d71eb7717cbbdc62740248233900b32a863f7c7aa654e241`.
- Author freeze: `d810-source232-first-author/freeze-manifest.json`
  SHA256 `0064ca682a5130646ce76dbd73a01cdbb724955ebdc4d82a5dc540ab4f043a6c`.
- Author source: `d810-source232-first-author/work/10p/pages/0232/page.png`
  SHA256 `d216590b3e7feb7b70356361535274efee03bdf9cdc39ae39e87c0165935d94a`.
- Author candidate: `d810-source232-first-author/root/10p/pages/0232/page.md`
  SHA256 `24595fab4e04ebf32d74b9956763717be9ef063f25a322fd671d5c1439d021ba`.
- Native first failure: `d810-source232-first-author/receipts/finalize.json`
  SHA256 `c1b1cd2c440ea2b113a2675727bff13bf2178cc93aaa2e47c9808845556e9a20`.
- Text-only previous page: `d797-source231-first-author/root/10p/pages/0231/page.md`
  SHA256 `77280221ceac8f4582a16db9196f9104397bfc3728523abef60ee97a02ed27d0`.
- Independent source-first note: this directory's `source-first.md`
  SHA256 `d03530360e02823fd9745d596a850d908195a14e767cb91ab359709bfe394e53`.
- Independent diagnostic: this directory's `diagnostic.json`
  SHA256 `2ad3daf3393589c80b41a1cca6dfdb20405fbd4d4ad1371e601bf9c80c6f1466`.
- Decisive pixel crop: this directory's `crops/second-initial-nearest-6x.png`
  SHA256 `0c28455e52918fa50d00688ad47a03310e997d4be07f66484b48d7e27d675641`.

Review complete. No further work or parent recovery is performed here.
