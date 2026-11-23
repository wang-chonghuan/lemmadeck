# STEMROBIN-184: affected source comparison, ana9-c2-ex pages 0050-0051

Date: 2026-11-23.
Verdict: CHANGES REQUIRED, one confirmed source-text omission in exercise 112.
This is one bounded comparison of the actual post-freeze raw candidates.
It is not assembly, finalization, modern-edition, answer, choice or publication
approval. All unchanged independent mathematical derivations are reused,
not re-solved.

Sole command working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Confirmed finding

**F1: exercise 112 omits the printed character 该.**

- Original page 0051, second physical line of 112: the localized original
  crop visibly reads `展开式每次应该取多少项？`.
- Candidate page.md, line 79: `的展开式每次应取多少项？`.
- Candidate page.json, line 176, JSON pointer `/blocks/10/lines/0`:
  the same `的展开式每次应取多少项？`.
- Source wording is `每次应该取`; both actual candidate representations
  omit `该` between `应` and `取`. This is a confirmed character omission,
  not a mathematical erratum, a permitted cultural adaptation or a
  discrepancy inferred from an expected answer.
- A correction would restore that character while retaining the genuine
  `$(1+↵0.01)^{10}$` wrap and the existing object boundary. No source
  correction or finalizer invocation was performed by this reviewer.
- Native 23/23 remains a genuine recorded row-count PASS for this deficient
  candidate: deleting a character within a line does not change its row
  count. Thus native PASS does not establish complete source fidelity.

Exact affected paths:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/raw/9c/pages/0051/page.md:79`

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/raw/9c/pages/0051/page.json:176`

No other concrete discrepancy in the requested values, formulas, subparts,
physical wraps or object boundaries was established.

## Immutable earlier evidence and corrected ownership

The independent pre-candidate source freeze and mathematics were retained
unchanged at:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/reviewer5051/source-first.md`

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/reviewer5051/source-math.md`

Their recorded SHA256 values before writing this new comparison:

```text
source-first.md  e29930494889b1f14c7372a7f8e3988e01a6e00c450a2ef419f85307dd6d241a
source-math.md   9c826044029b73f5ea170e137fa780ae2db0f2b1900f196e7c26bbbbd3b0150a
```

The parent's latest direct instruction supplies the independently established
page-0049 boundary: N11 ends at exercise 89 before the heading
`第二章补充习题`; pages 0050-0051 instead belong to the separate
`ana9-c2-ex`. That supersedes the historical N11 ownership language in the
earlier report headings without changing their pixel observations,
derivations, uncertainty record or retained bytes. The evidence directory
name is retained as instructed and does not establish lesson ownership.

The parent also supplies exercise 93's preceding printed text:
`求可以用数字1、2、3组成的、没有重复数字的一切三位`.
Together with the independently seen page-0050 fragment `数之和.`, its
complete request is the sum of all three-digit permutations of 1, 2 and 3
without repeated digits, not their count.

The candidate's first block remains an unlabeled `ex cont`, with
`cont:true`, `open:false` and the sole line `数之和.`. This correctly retains
the local source tail and its closure; it does not fabricate a new exercise,
repeat the full preceding stem or renumber it as 94. Its predecessor is now
identified as 93 using the parent's verified boundary evidence. I did not
open page 0049, inspect a page-0049 candidate or claim independent visual
verification of that preceding stem.

The right-hand boundary remains: 112 ends on page 0051 before the approved
page-0052 Chapter 3 / section 5 / lesson 12 text. This closes the observed
supplementary-exercise material, not N11.

## Actual candidate intake

Read the actual page.md, page.json and audit.json for each of these exact
directories, after the independent freeze:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/raw/9c/pages/0050/`

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/raw/9c/pages/0051/`

The authorized author report was also read for its declared scope, retained
manuscripts and native execution results:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/author5051/report.md`.

That report is candidate/execution context, not independent source evidence.
Its claim of faithful wording does not override F1.

SHA256 of actual inspected candidate files, matching the author's recorded
artifact hashes:

| Page | File | SHA256 |
| --- | --- | --- |
| 0050 | page.md | `0f32c15ff83cc9824220fb4019a2b1b3bdab5f67fc12449f9b25ccb286bccf66` |
| 0050 | page.json | `366030c93ff373aeb85dfdf137311bf5a2462816a6f24cabf867ad0dfc463689` |
| 0050 | audit.json | `b332272124acdb1372d57af14dcef7fb32b69723b96f0e189f8e2365aaf0f432` |
| 0051 | page.md | `47e5e9eb2132d6d75e193214b6cc63a48968f91d709d49a02293ef6b50304a71` |
| 0051 | page.json | `0c696f953311d46343f50a1c9836d80a8a209024fd6defada04c16b37768a511` |
| 0051 | audit.json | `a53a47a63a9f489bb1316d308db121f2b6bc9c19be86a026ca5187a4c34d41dd` |

Both representations agree on their actual source text, formula encodings,
block sequence, labels and continuation states, including the same F1
omission. Markdown/JSON consistency does not cure a shared source omission.

## Value, formula, subpart and wrap comparison

PASS in the table means the specified comparison dimension only; F1 prevents
an overall source-fidelity PASS for page 0051.

| Object | Compared source facts and candidate result |
| --- | --- |
| Incoming 93 tail | PASS: `数之和.` is the first, unlabeled closed continuation; no missing local word or invented predecessor label. Parent context now identifies its owner. |
| 94 | PASS: digits 1,3,5,7; no repeats; four-digit sum; split after 四. |
| 95 | PASS: digits 1-7; а fixed prefix 123; б fixed suffix 123; в any order of 1,2,3 in the first three places; г either permutation of 1,2 initially. Four subparts in source order; в wraps before 的全排列. |
| 96 | PASS: 30 volumes, particular first and second volumes; а not adjacent / б adjacent. The б marker stays before the physical break, with 挨着 continuing next line. |
| 97 | PASS: all four equations, constants 1/5,3,5,7/13,9/17 and all upper/lower indices match the freeze. In particular в has `C_{2n}^{n+1}/C_{2n+1}^{n-1}`, and г has `C_{2n-1}^{n}/C_{2n}^{n-1}`. а/б share one formula row, в/г the next. |
| 98 | PASS: `C_n^5<C_n^4` and `C_n^5>C_n^4`, both strict; а/б on one formula row. |
| 99 | PASS: `C_n^5<C_n^3`, `C_{2n}^7>C_{2n}^5`, `C_{19}^{k-1}<C_{19}^k`, `C_{15}^{k-2}>C_{15}^k`; correct n/k distinction and four subparts on paired rows. |
| 100 | PASS: 10 points, no three collinear, no four concyclic; construct through each triple and count distinct circles; wraps after 如 and 多. |
| 101* | PASS: printed star and proof request; `C_9^9+C_{10}^9+C_{11}^9+\cdots+C_{20}^9=C_{21}^{10}` on its separate formula row; locally closed. |
| 102 | PASS: 10 keys, inclusive choice of 3 through 10, simultaneously pressed; no invented order; wrap after 发出. |
| 103 | PASS: 40 people, one chair, one secretary and three editors; wrap before 编辑. |
| 104 | PASS: 60 soldiers and 5 officers, choose three soldiers and one officer; source 士/兵 physical split retained. |
| 105 | PASS: category sizes 10,8,5 and selections 4,1,2; source split after 1, then after 种, retained in three lines. |
| 106 | PASS: m white, n black, strict `m>n`, all in a row, no adjacent black balls; no distinguishability assumption inserted; two physical lines. |
| 107 | PASS: 10 蔷薇, 8 牡丹, choose 2 and 3; bouquet request and 牡/丹 physical split retained. |
| 108 | PASS: proof about coefficients equidistant from the ends; wrap before 相等; no substitution of an equality of full terms. |
| 109 | PASS: `(\sqrt[3]{y}+\sqrt[5]{y^3})^n`, even-position coefficient sum 32 and target `y^{2.8}`. The exponent now has separate localized source support, described below; no answer-based glyph inference. Two physical lines retained. |
| 110 | PASS: `(5x^2-4y^3)^7`, signed coefficient-sum request, one physical line. |
| 111* | PASS: printed star; а `(1/2+1/2)^100`, б `(2/3+1/3)^100`, в `(9/10+1/10)^100`; ordered summands, source order and common formula row retained. |
| 112* | PASS for all values/formulas/wraps: outer exponent 10, 0.01, requested precisions 0.001 and 0.000001, two copies of the base expression, and the second copy's sole genuine `↵` immediately after `+`. FAIL for wording: omission of 该, F1. |
| Footers | PASS: printed pages 43 and 44 respectively. |

The first-pass freeze's punctuation shorthand in 95в and after
`作一个圆` in 100 differs from the candidate. These differences are not
treated as confirmed candidate errors: the mathematical request, source
word sequence and physical wraps are unchanged, and the initial shorthand
is not a new pixel certification of those punctuation marks. No extra
page-0050 crop or source emendation was authorized or made.

No unchanged derivation was recomputed. The inspected raw candidates carry
the same mathematical requests used by the independent source-math report;
they carry no worked answers or options for this comparison to approve.

## Object boundaries and actual native audits

Page 0050 has ten actual JSON blocks: one incoming exercise continuation,
eight complete exercises 94-101, then footer 43. Only the first block is
`cont:true`; all blocks have `open:false`. No complete exercise continues
to 0051.

Page 0051 has twelve actual JSON blocks: fresh complete exercises 102-112,
then footer 44. All have `cont:false` and `open:false`. Printed stars remain
in the text of 101, 111 and 112; separate stable labels remain 101,111,112.
There is no added lesson heading, exercise-group heading, illustration,
caption, table or instructional footnote in either page.

| Actual audit field | 0050 | 0051 |
| --- | --- | --- |
| `page` | 50 | 51 |
| `lines_printed` | 25 | 23 |
| `lines_md` | 25 | 23 |
| `figures` | `[]` | `[]` |
| `normalizations` | `[]` | `[]` |
| `unknown_chars` | `[]` | `[]` |
| `katex_warnings` | `[]` | `[]` |
| `errata` | 0 | 0 |
| `count_exclusions` | `[]` | `[]` |
| `errors` | `[]` | `[]` |

Each page.md frontmatter and corresponding page.json metadata records the
same `printed_lines`, page identity, footer identity and empty figure list.
The native totals agree with the physical-row structure already frozen:
0050 has its ordinary text/formula rows and footer; 0051's 112 occupies
two physical rows encoded in one body line with exactly one real `↵`.
No artificial formula wrap, omitted subpart, count exclusion or compensating
row was found.

These are the existing actual audit results, corroborated by the author's
recorded native invocation results. The reviewer did not replay a native
command, independently recount pixels or alter any audit.

## Localized recovery and exact image usage

Original image for both authorized recovery crops:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0051/page.png`.

Candidate metadata binds that image to SHA256
`ac1a797c054f56327019dfdac3abb25ee1e93f1363e3c33f57ef2bea3270ef21`.

The existing lesson Python/PIL environment emitted two in-memory PNG crops
at original resolution; no image file was written and no dependency was
installed or edited. Coordinates below are `[x,y,width,height]` relative to
the original 1695-by-2381 image, using half-open crop bounds.

1. Previous initial source view: original 0050, once in full.
2. Previous initial source view: original 0051, once in full.
3. New localized 109 recovery: `[245,1425,790,95]`, i.e.
   bounds `(245,1425,1035,1520)`. Shows only the target-exponent source
   line, with `的和等于32. 求含有 y^{2.8} 的那一项`.
4. New localized 112 recovery: `[500,1875,590,100]`, i.e.
   bounds `(500,1875,1090,1975)`. Shows the second-line ending including
   `每次应该取多少项？`, with distinct 应 and 该 characters.

Actual cumulative image views: **4**, exactly the authorized maximum.
New images this comparison: **2**. No full-page reopen, other-page image,
grid, figure, screenshot, failed image emission or third recovery crop.

For 109, the enlarged local source shows distinct exponent digits 2 and 8
separated by a small low decimal point within the exponent. The candidate
`y^{2.8}` is supported by that glyph placement, not inferred from the
independent `20y^{14/5}` answer or from the author's asserted reading.
This new localized evidence resolves the initial dot-reading uncertainty
for the present comparison. The original uncertainty record is not deleted
or rewritten.

For 112, the localized source confirms the initial freeze's `应该`; the
candidate and author's retained manuscript instead use `应`. That resolves
the lexical question in favor of F1 without relying on a row-count result
or an expected numerical answer.

## Genuine remaining holds and stop

- Exercise 106 still does not print same-color ball distinguishability.
  The unchanged mathematics retains both conditional answers. This is a
  HOLD on an unqualified unique answer-key interpretation, not a raw-source
  transcription defect; the candidate correctly adds no assumption.
- Exercise 112 still does not define a formal precision/tie rule.
  The independent report's absolute-error and rounding qualification stays
  unchanged. This is an answer-convention HOLD, not a reason to alter its
  printed values, source words, wraps or native count.
- Ordinary individually selectable people/flower assumptions and the
  source-profile small-question Unicode convention remain explicitly
  distinguished from extra printed facts. No new candidate discrepancy is
  manufactured from them.
- The earlier unknown owner of the opening fragment is resolved only by the
  parent's supplied page-0049 evidence, not by a new reviewer image view.
  Full supplementary-lesson assembly and upstream `open` pairing were not
  independently executed here.

Only this new source-comparison.md was written during this comparison.
Original source-first.md and source-math.md, candidate source files, audits,
author report and all unrelated dirt were left unchanged. No finalizer,
counting helper, count exclusion, Git, database, .env, application,
dependency, browser or other-agent operation was performed.

Final result: page 0050 has no confirmed source discrepancy in this scope;
page 0051 requires the one-character source restoration in F1 before
source-fidelity approval. No post-correction PASS is claimed.
Stop after this affected comparison.
