# STEMROBIN-180 Batch57 Independent SOURCE Review: 8p Physical 291/292

Reviewed 2026-11-17 in `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Scope: only physical pages 291/292, printed pages 279/280. Fresh independent
pixel-to-transcription review; no previous review or old HOLD was reopened.
Read the lesson and image skills. Only this report was written. No source,
tool, index, or other worker file was edited. No network, database,
modern-edition, browser, prepare/finalize/vectorize, or commit operation was
performed.

## Verdicts

| Physical / Printed | Faithful SOURCE | Mechanical Readiness | FIRST / Initially Reviewed Audit | Image Opens |
| --- | --- | --- | --- | --- |
| 291 / 279 | PASS | PASS on supplied audit, not rerun | FIRST body unchanged; 24 printed / 24 MD; no errors | 2 |
| 292 / 280 | PASS | HOLD until parent-owned affected counter gate passes | FIRST body unchanged; 7 MD / machine 10; line-count FAIL | 3 |

No source-text repair is required for either bound snapshot. Page 292's
initially reviewed audit fails; a concurrent later audit reports 7/7 as recorded
below. Mechanical readiness remains HOLD pending the parent's affected counter
gate confirmation, which this reviewer did not execute or inspect.
SOURCE PASS does not waive that gate or authorize downstream promotion.

## Independent Text And Structure Findings

- Compared every prose line, heading, footer, punctuation mark, emphasis span,
  and formula on both pages against source pixels. No omitted, added, duplicated,
  or substituted source text was found. MD block lines equal JSON block lines;
  JSON metadata equals MD metadata. Both current bodies equal their
  `page.author-first.md` bodies.
- Page 291 has 23 content lines plus one footer line: block line counts
  `5 + 3 + 1 + 3 + 4 + 3 + 4 + 1 = 24`. Blocks `p0291#1-2` are the preceding
  section's two paragraphs, not summary content. That preceding section is
  incomplete within this review's two-page scope and must remain excluded from
  the target summary. No preceding-section title is printed or fabricated.
- The summary starts exactly at `p0291#3`, the bold printed heading
  **第九章提要**. Blocks `p0291#4-7` preserve the distinct Kai-style emphasis
  using the transcription's italic markers. The under-character dots cover
  precisely `运动的` (three characters), `动能` (two), and `势能` (two).
  The non-emphasized preceding prose remains non-emphasized.
- Page 291 preserves the original wording, including `这象`, `其矢量和`,
  `说明物体运动、并叫做物体`, and `说明物体相互作用、并叫做`.
  Sentence-final printed dots remain `.`, Chinese commas and enumeration commas
  remain distinct, and the parentheses and negative-sign wording are retained.
- Formula inventory is exact: `p0291#6` has `$\frac{mv^2}{2}$`;
  `p0291#7` has `$m|\vec{g}|h$` and `$h$`; `p0292#1` has
  `$\frac{kx^2}{2}$`. The arrow above `g`, magnitude bars, superscript 2,
  numerator letters, denominators, and following punctuation match the pixels.
  The tall fractions each occupy one printed prose row; no artificial `↵`
  or extra formula row is justified.
- Page 292 has six prose lines plus one footer line:
  `p0292#1-4` line counts are `1 + 3 + 2 + 1 = 7`.
  All three prose fragments retain Kai-style emphasis; the first closes the
  emphasis opened on page 291. No additional under-character emphasis dots
  are present in this page's prose.
- The summary ends at `p0292#3`, with
  `能不守恒. 它们的一部分要转换为产生摩擦力的物体的内能.`
  The original `它们` and all punctuation are preserved. The remaining page
  has no conclusion heading, conclusion prose, exercise, or figure. In
  particular, no `结束语` boundary may be invented from a TOC page assignment.
- Both footers preserve the italic page digits (`279`, `280`). Flanking footer
  dots and unrelated scan stains are not prose. Neither page contains a figure.

## Cross-Page Seam

`p0291#7` is `p open`; `p0291#8` is a transparent `foot`; `p0292#1` is
`p cont`, with `open: false`. These flags are also present in JSON.
The source cuts after `该水平面` and resumes with `上的高度`.
Concatenation yields:

```text
的零水平面的势能等于$m|\vec{g}|h$，这里$h$是物体在该水平面上的高度. 在弹性力的情况下，势能等于$\frac{kx^2}{2}$.*
```

There is no missing or duplicate character, artificial paragraph break,
intervening heading, or missing closing emphasis marker. The footer must not
enter the paragraph. After this merge the summary has six prose paragraphs:
`p0291#4`, `#5`, `#6`, `#7 + p0292#1`, `p0292#2`, and `#3`.

## Page 292 Counter Finding

The supplied `layout.json` contains ten bands. Six are genuine prose rows
(`226-316`, `365-405`, `445-487`, `525-574`, `606-647`, `687-729`);
one is the footer (`2277-2307`).
The remaining three bands, `760-773`, `1662-1693`, and `1865-1895`,
align with isolated right-margin stains around x=1630-1665 in the full page
and grid. They contain no source character, heading, formula, or figure.
A separate right-margin stain around y=565 shares the genuine `525-574`
row band and is not a fourth extra row.

Thus the allegation of three spurious right-margin rows is independently
supported by pixels and the saved layout. This is a mechanical counter defect,
not missing transcription. Do not add stain text, blank rows, duplicated prose,
fake figures, or formula breaks to obtain ten MD rows. The parent owns the local
counter repair and affected gate. Until that gate records the real seven rows
and clears the affected audit error, page 292 remains mechanically HOLD.
This reviewer did not run or claim that repair/gate.

### Concurrent Audit Update

The post-write hash check found that another worker had replaced only
`A/0292/audit.json` among the sixteen bound evidence files. The later audit
reports `lines_printed: 7`, `lines_md: 7`, and `errors: []`; its SHA-256 is
`37107067dc20df83e8a1ac660958656bfcbc537e4f9af9365f1fc9148ebc7406`.
All fifteen other bindings, including both source images, MD/JSON pairs,
FIRST bodies, crops, and saved layouts, remained unchanged.

The original failing audit hash below identifies the bytes initially inspected,
not the now-replaced on-disk file. No worker change was reverted. This later
read-only audit observation is not verification of the parent-owned counter
repair or affected positive/negative gate evidence; this reviewer does not
release mechanical HOLD from it. No image or old review was reopened.

## Image Budget

Five image opens total, including crops; no reopens and no images from other
pages. Maximum authorized: eight. Existing crops were read, not created.

1. `W/0291/page.png`
2. `W/0291/page.lower-check.png`
3. `W/0292/page.png`
4. `W/0292/page.grid.png`
5. `W/0292/page.top-check.png`

Page 291's grid was hashed but not opened. The crop/full-page comparisons
support the same source glyphs; crop hashes are bound below.

## Exact Snapshot Bindings

All digests are SHA-256 of local file bytes initially reviewed, except the
explicitly labeled metadata-only PDF/profile bindings. The concurrent audit
replacement is separately bound above. Paths expand from:

```text
W = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/8p/pages
A = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/artifacts/8p/pages
```

| File | SHA-256 |
| --- | --- |
| W/0291/page.png | ca2849f85d180f3a6d9decd7f4a47611acb188204eaf1f1b796c9d8650290199 |
| W/0291/page.grid.png | 85db6a1935d7c3db5d4db0ef4c04a6af5b7ceb0918e5f0c2b05e7df26673f37b |
| W/0291/page.lower-check.png | 8bbf01dfd2eaee28c6e8f437c9029051a7c38a3b9afd51bac35d9ed05da661b1 |
| W/0291/layout.json | afb76db66b8273f7ca4057613a04bb2df6d69c97f2e83770cae3b16dc292a64f |
| A/0291/page.md | 3c4416d5fb20a0c61e9f31caf144bd07a7ad689fbc6b54eb4873c23737fbd900 |
| A/0291/page.json | 3c524fe8e209b101b98d82f2b018b686603cdea63d350646a493ff3cc81e52f0 |
| A/0291/audit.json | 1fa2546256e363f97e5317515755cd3a5b3dcc0790afdeaf13f900362d3dbfda |
| A/0291/page.author-first.md | 5509c4f7124f0d15e9af14938ac433d9f1c6df7645d7536913d2a951f3ebc49d |
| W/0292/page.png | b1664c111007ae84b9e58251d6f22fdc5a88130e6a0f9a4beedbcdf0b1d8703d |
| W/0292/page.grid.png | 53991e4a9017acf150930c54c63f4c7296404a1e4ad8b031698a114408aa77e2 |
| W/0292/page.top-check.png | cc2b87a928e28bdc3cd31a37b767950b51bbaed83f0754ea42fcb51b95158362 |
| W/0292/layout.json | 43dbe2200ada83e4ac208694513f01462d213b7fb7cf65aec7079c29c93df018 |
| A/0292/page.md | 15dd9deee2a9b1c5b839276bd688bc799e539610f407b64b4a0bb06b90252e0f |
| A/0292/page.json | a67859bd7a7e88bdcba3f3908a8503d528b7d1f39547d67f75f700d5c6135026 |
| A/0292/audit.json | b0dc498880f85c7e8574f2409279acec1d069462e211750a97b3752ac250b936 |
| A/0292/page.author-first.md | ffb85dee7b0f0d1c57f5e346e65e64f6455096edf99269807a7196d441f18725 |

Both MD/JSON source metadata record PDF
`8p 苏联中学课本 物理 八年级.pdf`,
SHA-256 `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`,
with respective `pdf_page: 291/292`. Both record `dpi: 300`, dimensions
`1695 x 2580`, and render hashes equal to the local full-page PNG hashes above.
The recorded `soviet-cn` profile hash is
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.
The full PDF and profile were not separately rehashed in this bounded review.

Read-only Node assertions passed for MD/JSON metadata, all block lines,
unchanged FIRST bodies, MD line totals, boundary flags, and the exact text seam.
The supplied audits were read rather than regenerated. Verdicts apply to
these exact snapshots and do not assert publication or later mechanical success.
