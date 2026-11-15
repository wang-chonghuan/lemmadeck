# 9-10g physical 12–15 source author handoff

Date: 2026-11-15. Ticket: STEMROBIN-184. Role: source transcription author, not independent reviewer.

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Scope and result

Each of physical pages 12–15 was prepared with the existing lesson tool and its full original PNG inspected individually before authoring. Metadata came from that page's template. Only p11 tail text was used for continuity; its source image was not reopened. Faithful MD was written with `apply_patch`; each page was finalized once. No assemble/adapt, modern artifacts, answers/choices, browser, services, DB, publisher, dependency changes, tool changes, or prefilled count exclusions.

All four first finalizes passed. All four current audits have empty `errors`, `normalizations`, `unknown_chars`, `katex_warnings`, and `count_exclusions`; `errata` is 0. There was no failed finalize in this four-page author batch. These are author packages awaiting a non-author source review, not independent approvals.

| Physical page | Actual printed folio | Blocks | Independently observed rows | First finalize MD/printed | Figures |
|---|---|---:|---:|---|---|
| 12 | · 5 · | 14 | 21 | 21/21 PASS | 6, 7 |
| 13 | · 6 · | 12 | 25 | 25/25 PASS | none |
| 14 | · 7 · | 7 | 26 | 26/26 PASS | none |
| 15 | · 8 · | 12 | 25 | 25/25 PASS | none; text references 8 |

Total: 45 typed blocks, 97 printed horizontal rows, 2 source figures. Actual folios confirm physical minus printed offset 7 throughout; both side dots are retained.

Durable page packages are `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0012/`, `0013/`, `0014/`, and `0015/`, each containing `page.md`, `page.json`, and `audit.json`. Temporary original/grid PNGs, layout, and template remain at `.tmp/ld-s10y-lesson/9-10g/pages/<page>/`. Crop outputs currently remain under the temporary p0012 `figures/` directory; no assembly/global figure promotion was performed.

## Object boundaries and source rows

- **p12:** `p0012#1` is `p cont`, closing p11's proof after its tail “一个点 A，和不属于这个平面的一个点 B．通过点 A 和点 B 作”. The next source begins “直线 a（公理 2）．”. Axioms 4/5 and their explanation/model text are retained. Figures 6/7 are separate `fig` blocks, followed by separate captions; the second caption has `samerow` because both captions share one printed row. Prose 19 rows, paired captions 1 row, folio 1 row = 21. `p0012#13` is `p open`, ending “教室里相邻的两面墙，可以作为说明公理 5 的例子的模”.
- **p13:** `p0013#1` is `p cont`, the printed “型．” completing p12. Axioms 6–9, the distance formula, triangle inequality, plane-geometry paragraph, and 180-degree wording are retained. `p0013#10` is `ex 3 open`: task introduction and subparts 1)/2), stopping after subpart 2)'s semicolon. Prose 19 rows, exercise heading 1, exercise 3 on this page 3, teaching footnote 1, folio 1 = 25.
- **p14:** `p0014#1` is `ex 3 cont`, preserving subparts 3)–6) and closing exercise 3. Exercises 4–7 are complete. Exercise 5's four blank rules remain blank; no answer words were supplied. Rows: exercise 3 continuation 4; exercise 4 5; exercise 5 8; exercise 6 4; exercise 7 3; teaching footnote 1; folio 1 = 26.
- **p15:** Exercises 8–15 are complete, totaling 16 source rows (3+2+2+2+1+2+2+2). The next printed heading is “§ 3．公理的推论” (1 row). It is an `h3` opening the TOC topic `geo910-c1-s1-n3`; numbered “1．推论1．” remains ordinary source prose (2 rows), not an invented new course heading. The proof has 5 printed rows; `p0015#11` is `p open`, ending exactly “4得出．实际上，任何包含直线 a 和点 M 的平面都通过点 B、”. The next page was not inspected or inferred. Folio 1 row completes 25. Figure 8 is only a printed reference here; no absent figure/caption was added.

No empty exercise-continuation blocks or owner guesses were needed: the only exercise crossing these page boundaries is exercise 3, whose number is printed before the p13 open block. Both physical source figures on p12 are referred to in its prose, not exercise-owned.

## Source glyph and footnote evidence

- p12 writes the printed intersection with a plane as `a\cap\alpha=A`, without supplying set braces.
- p13 exercise 3(2) visibly prints `a\in\alpha`, with a middle horizontal stroke. It was retained rather than mathematically changed to `\subset`. Existing source-only enlarged crop: `.tmp/ld-s10y-lesson/9-10g/pages/0013/ex3-detail.png`, source box `[180,1680,790,200]`, 2x nearest-neighbor.
- p14 exercise 3(4) prints `a\not\subset\alpha`, `b\not\subset\alpha`; 3(5) prints `b\subset\beta`; 3(6) prints `C\notin(A,B)` including the comma. Existing source-only enlarged crop: `.tmp/ld-s10y-lesson/9-10g/pages/0014/ex3-cont-detail.png`, source box `[200,165,970,290]`, 2x nearest-neighbor. No symbol/condition was replaced using a solution.
- Source small raised circles on exercise numbers 5–12 are retained as `$^{\circ}$`; exercise 13's raised star is `$^{*}$`. P13 and p14 teaching-footnote text pointing to printed page 270 and their source stars are retained. P15 has no teaching footnote body; none was invented.
- P15 exercise 15's real formula break after `|BC|` is `$|AB|+|BC|↵>|AC|$`, contributing two printed rows. The figure 8 subfigure reference is Cyrillic `а`, not a Latin option label.

The local glyph crops resolved the noted membership/subset/comma reading issues. No unresolved glyph was silently filled, and no mathematical erratum was invented by this author task.

## Source figure ownership and hashes

P12 figure crops were inspected after the first finalize: whole source groups and labels are retained, while prose and separately transcribed captions are outside the crop. Each full source figure, rather than separate model parts, is one semantic crop.

| Figure | Author coarse box | Final ink box | Audit components | Current temporary PNG SHA-256 |
|---|---|---|---:|---|
| 6, three-stick/cardboard model | `[225,900,410,355]` | `[236,914,390,330]` | 8 | `6f7be851915a2e924b4127a2f7b3fb2f38f17061c05ebd271ef85e5205964406` |
| 7, intersecting-plane illustration | `[760,965,460,270]` | `[768,976,443,243]` | 13 | `ce77f8979bf0f9b8e9fb317602a42dceaf8f75f2f2bfcf1d798dd85e5955b79f` |

Paths: `.tmp/ld-s10y-lesson/9-10g/pages/0012/figures/fig-06.png` and `fig-07.png`.

Glyph-crop SHA-256: p13 `ex3-detail.png` = `eb204bf6210c33befde56462863c780caa74e6a710cac6be158ce0d2644ff57c`; p14 `ex3-cont-detail.png` = `ee654a68a53bb31d13a599e6a8aa08451cda7bbb1822559ef95f8f1c5d9aff13`.

## Current byte hashes

Actual SHA-256 values were computed with `shasum -a 256` after the first finalizes, not copied as placeholder provenance.

Source PDF: `ssot-resources/soviet10year-textbooks/sources/soviet10years/9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf` = `1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`.

| Page | Actual original `.tmp/.../<page>/page.png` SHA-256 |
|---|---|
| 0012 | `f0e35d04608a213a199b243a57e6f6eb01d9f955847fba892bc87fa8b2f7614b` |
| 0013 | `ce1dda2adb2fbfededa6945f3508955a6e24ad14b7b9021ab53c6a56cd7219cd` |
| 0014 | `2570b048b3c2919072dd57ce328f5ad853631735721d97c18c7894db5e7d9423` |
| 0015 | `f0d3e3dc8d3e838a7536f02d3703fe79e43fb4ded9a3ee25f1057b1732b3b7ee` |

Each following file is relative to `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`.

| File | Current SHA-256 |
|---|---|
| `0012/page.md` | `d6c18153f777f934e3e303d19b3dfbb0af9d35e9462a4e85a7e0bda0a8b09555` |
| `0012/page.json` | `97885cd2378dc0e9ea40ad29349074d8e2ebfc203fb134bfaaa91097dcdea512` |
| `0012/audit.json` | `fe18f2887d81a5c5edef5ec51c203160422d55de19880754b12043171b018155` |
| `0013/page.md` | `39504bfe1ac10c8446d9afa5490763621544f29c2a73d9ae479b31cbe7ded86c` |
| `0013/page.json` | `1e6340d83af45d56113ee521c2a01e49cffb72b03555b6b9f52411c958827d20` |
| `0013/audit.json` | `c0b43477b1565c2729e853c322827e0c397a5df1173ec4fa5b5c76bb5b0cbada` |
| `0014/page.md` | `f1bd481f3919aae6c28d97674c0ce0648a87dfbb4695b56012dd99458d10f3b8` |
| `0014/page.json` | `0c0a9ebcd0fb46c5b7791fd39fec464b95894afc6afcf9729959013bfcaf0fde` |
| `0014/audit.json` | `3907663dc1705912ad58fbd1e6d495f1bf2919feee0e104aee325e186e1d5520` |
| `0015/page.md` | `9646697156a213b37ba39a6a9e9a1388e2b8e7b9b1e1d2d5e6c451cc7ad8f858` |
| `0015/page.json` | `0887079887c6de58968afd934a005fda7223007d3e5fceec434f08b8ed907570` |
| `0015/audit.json` | `bced7676d89e9aa16b737ea63f5a70ac3ffbf6924abacef4d14866d34b8f5840` |

## Handoff limit

No page-count blocker remains in this four-page author batch. The ordinary source boundary remains open: §3's first proof continues after p15. Independent source review and any later assembly belong to the parent/non-author reviewer. Pages 8–11 and all existing other-book work were left unchanged; there is no active author process.
