# 131/133/135 Targeted Source Repair

2026-11-15. Main repair author, not Bacon's independent source reviewer.
Addresses only F1–F7 in source-review-131-135.md. No independent PASS claimed.
132/134 remain untouched and their existing independent conclusions are reused.

Original131 and135 full PNGs and133 original example detail were actually
opened before editing. Only durable page.md files were manually edited;
official finalize regenerated JSON/audit.

## Changes

- 131: emphasize only `重量` in the opening question; restore `9.8牛顿. 这就是说`.
All words, two question rows and final open continuation remain otherwise
unchanged.
- 133: emphasize only `根据`, not `公式`; restore `接，球胆...`; replace only
the mixed-column example unit with two independent four-row arrays separated
by a vertical rule. The left array has its original short horizontal rule
below density; the right array retains its multiplication continuation on the
fourth row without inserting the left unknown `p—？`. All source words,
numbers, units, density period, approximate equality and final80kPa remain.
Three source `↵` markers account for the four actual parallel printed rows;
the arrays are layout, not an invented equal-row data table or new illustration.
- 135: encode both actual circled1 markers with the established equivalent
`$\text{\textcircled{1}}$`. Preserve the complete instructional footnote as `p`
directly after the referenced paragraph, before the later `p open`. Its
original physical position below118/above the page number is explicitly
documented. Only the real page number remains `foot`; the unfinished sentence
still ends at `但它们的底面`. No profile or assembler change was made for this.

## Official Commands And First Failure

Using the existing sharedvenv Python, `-B`, official `p2c.py finalize --book 6p
--page <n>`:

| Page | Final Result | Blocks / Rows | Figures | Normalizations |
| --- | --- | --- | --- | --- |
|131 | First repaired finalize exit0 |11 /20 of20 |1 |0 |
|133 | First array candidate exit1; delimiter-only correction then exit0 |16 /24 of24 |0 |0 |
|135 | First repaired finalize exit0 |8 /18 of18 |1 |0 |

133's first candidate failed because removing `↵` joined `\hline` with the
following `p`, producing undefined `\hlinep`. The failed MD/JSON/audit are
preserved in tmp/source133-array-first-failure. The sole subsequent edit adds
an empty control-word delimiter `{}` after `\hline`, with no glyph, data,
row-count or layout change. No failure was covered by altering the counter.

Original independent rejected131/133 MD/JSON/audit are preserved in
tmp/source-review-131-135-rejected/0131 and0133. The original135 circled-marker
failure remains in .tmp/ld-s10y-lesson/6p/pages/0135/failure-01-circled-footnote.
The original review and author freeze were not modified.

## Current Byte SHA256

| Page | page.md | page.json | audit.json |
| --- | --- | --- | --- |
|131 | b31bffa75ba00206b15cebee8b75b3f4aaec729bb60ff754aa0e0cc48f1fd7d0 |07144753906dba0d304c42b5b83fb5fba0940a5f9569b14af68fe957b1baa3c2 |2954d327e1055228782687023e751100a9fdff2b8c65ba824b5f49a9b8174842 |
|133 | feac953242b66ba529c7fce6168b1bc6c09e33ca1886a2eca91439283538115e |0005c3aa3bc8206e1c68bc0d68803a07db6bb8f3f88de44e0acbe87d5e4f19f9 |f3943516d22cb7b9b27d5d4ad01864e79f8f6073716c7bd7766b05dc2b8d15cc |
|135 |11eeb6628e5628c1ec74275b8fa5846db2c4a366caa53df5d48faa5d7429a84e |dbcf2db58026888fab922f35ad79200f52b10b21d197b0a7ad435f4dcca7f18f |4569edad20155363f764f6295cb9e9ec167ac5ffb012753058c690abfb5b15d0 |

131/133 final audit bytes equal their original audits. Actual114/118 PNG
hashes remain `10405c879c73804cc0a5bff9f7d7bb6090ee05085414fea86071fb7a8dbbffb6`
and `a6c2b4cc10eb2afc1a5b87d31800864077cc2c0d2fafaee1e30593063a0f3718`;
exact boxes remain[457,990,643,349] and[470,1259,621,489]. No vectorize rerun.

Affected independent review must still inspect133's actual formula layout,
131's two text edits,135's marker/footnote retention and all unchanged-scope
diffs. No full-page repeat, assembly, promotion, modern lesson, publication,
DB, app/dependency/schema/charter change or full-project test occurred.
