# 9c Source Transcription Review: Physical Pages 23–25

Date: 2026-11-15. Ticket: STEMROBIN-184.
Role: independent source-transcription reviewer, not the author of these pages.
Scope: source facts only; no exercises were solved and no answers or choices
were read for this task.

## Result And Minimum Differences

- **p23: REVISE.** `p0023#9`, second printed line, omits the printed character
  `即`: source says `位置上，即第n个位置上有`, whereas MD and JSON say
  `位置上，第n个位置上有`. Restore only that character.
- **p23: stale structured boundary.** MD already marks the P2–P8 list as
  `p open`, but JSON `p0023#11.open` is still `false`; JSON notes also retain
  the earlier statement that the P8 formula is complete and later content
  has not been handled. The list continues directly into p24's P9–P11
  `p cont`. The author must synchronize the existing boundary/notes through
  the normal source route; this reviewer did not edit it.
- **p24/p25: no definite additional prose/formula/object omission found.**
  Their current MD and JSON agree on the inspected content and boundaries.
- **No page gate PASS is claimed.** Current first-finalize audits remain failed:
  p23 machine25 / block26, p24 machine25 / block24, p25 machine22 / block21.
  Actual independent printed-row totals are **26,24,21**, respectively,
  including one page-number row per page. Do not remove/add text or fabricate
  formula breaks to match the machine counts.

## Observation Order And Evidence

Each page was opened individually as its full clean PNG **before** reading
that page's persistent MD/JSON/audit. Order:23, then24, then25.
The whole page was observed once at each stage, including the bottommost
exercise/formula and page number. The only extra image was a direct original
pixel crop from p23 to resolve the printed `即` beside handwriting.

Full source PNGs were1695×2381. No renderer, browser, application, system input,
page finalize, assemble, full test run, DB or publisher was used.
Pages22 and earlier were not reopened. No source/tool/book-index file was
changed. Existing failed audits are preserved, not replaced by a review PASS.

Clean images:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0023/page.png`
and the corresponding0024/0025 paths.

Persistent evidence:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0023/{page.md,page.json,audit.json}`
and the corresponding0024/0025 paths. Existing `layout.json` line-band inventories
were read only to distinguish machine bands from visually verified printed rows.

Hashes of the inspected snapshot:

| Physical Page | clean page.png SHA-256 | page.md SHA-256 |
| --- | --- | --- |
|23|`ad028bd06fb23c0a994b1ed92c5516141c1ffe7b2b126c912be91e7c2c7a9b91`|`4f0bb993ac180234d227b8897a8c7b8394a00e6f43bae74cb51731f06b74ad20`|
|24|`f49f7f171441b5a813428e80703e7dd67ef0ebd4842ed98aae65d2311d48aa6c`|`4f4678d38aa1b9f5575476e82fd8a6603fb44401c3d69467a2ca448617edea6e`|
|25|`363d0880f7b9e31021fe5e963ba635c048edcee061c1897183ef2c1d32433d3d`|`ec73264fab48eb1a6fe7a766c0a8ceb64db6a67d21e3dd82b4695a5d84403b64`|

| Physical Page | page.json SHA-256 | audit.json SHA-256 |
| --- | --- | --- |
|23|`7ff556c3f2eaaeb241984a56c66706703b33feb511a53b2892785c175183e217`|`ae85589615df80457a7242c9b8cda6fc30f266213a86d1435d909fe2b86232aa`|
|24|`4e8b404181c2d0d00291a91978bdbba3077a4b555eb0c8460cc2d8bdfa3a7855`|`e38546066fd7424eea3446a5190176236986396cd751fcb10724444159762e0c`|
|25|`80e8a464f446571806710379147a1c39912020d110a85ce7771b32a8bd20eebf`|`8269efbc5069765083a5f64501d233963f29a8139d80acad46cac27aedeac9f4`|

All three actual PNG hashes match the render hashes retained in their MD/JSON.
The audits have empty figures, unknown_chars, KaTeX warnings, normalizations
and count_exclusions; the recorded failure in each is the printed/block row
count mismatch. Empty warning lists do not prove faithful content.

## Physical 23 / Printed 16

### Objects, Text And Formula Inventory

The page starts with the continuation `集合，只能用唯一一种方法排列...`.
This is a continuation, not a new heading. The preceding page was not reopened.
Current `p0023#0.cont=true` correctly represents the source fragment and
the already supplied boundary context.

Printed letter objects are the Cyrillic А,Б,В. The one-element discussion,
two-element arrangements `АБ` or `БА`, and six printed three-element arrangements
are retained in order:
`АБВ，АВБ，БАВ，БВА，ВАБ，ВБА`.
No handwritten alternative arrangements are added.

The definition says an order established in a finite set is its elements'
全排列, and uses $P_n$ for the total. Source formulas, verified as printed:

- $P_1=1,\ P_2=2,\ P_3=6$, on one row.
- $P_n=nP_{n-1}$, with equation number(1) on that same row.
- The six-row printed argument ends with $nP_{n-1}$ methods.
- $P_2=2P_1=2$ and $P_3=3P_2=6$, one shared printed row.
- $P_4=4P_3=24$ and $P_5=5P_4=120$, one shared printed row.
- $P_6=6P_5=720$.
- $P_7=7P_6=7\times720=5040$.
- $P_8=8P_7=8\times5040=40320$, ending with a semicolon.

Multiplication symbols, subscripts and the numeric strings match current
MD/JSON. No new mathematical correction is inferred.

The local omission is in the second row of the proof paragraph:

```text
Original:
些元素中的某一个放在最后一个位置上，即第n个位置上有

Current MD/JSON:
些元素中的某一个放在最后一个位置上，第$n$个位置上有

Minimum restoration:
些元素中的某一个放在最后一个位置上，即第$n$个位置上有
```

The original crop shows a clear, separate printed `即`, not a handwritten
stroke. Direct crop coordinates in the original image:
`[left=145, top=1050, right=1480, bottom=1370]`.
No image processing or ink removal was applied.

Evidence:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/transcription-review-9c-p23-proof-detail.png`

Crop SHA-256:
`ef7ed04553ca5c2245220b272c32422013e1d8d8c471da491a4ce731292c67f2`.

### Boundaries And Nonprinted Ink

The P2–P8 list's last line is a complete individual formula but is not the
end of the list object: p24 begins with P9, P10, P11 and closes that list.
Current MD correctly uses `p open`; current JSON still has
`p0023#11.open=false`, a definite source-structure mismatch. The page-number
foot is transparent to the cross-page list boundary.

The thick handwritten recurrence beside `依次计算P_n很方便` and above the
following proof paragraph is not printed textbook content. Wavy underlines
under the definition and isolated right-margin ink spots are also not new
objects, formulas, diagram parts or printed rows. There is **no source figure**.

### Actual Printed Rows

| Rows | Printed Content | Row Count |
| --- | --- | --- |
|1–3|page-start continuation through two-letter introduction|3|
|4|АБ or БА|1|
|5|three-letter introduction|1|
|6|six three-letter arrangements|1|
|7–9|definition and “已经求出”|3|
|10|P1/P2/P3 values, same row|1|
|11|利用递推公式|1|
|12|recurrence plus(1), same row|1|
|13|依次计算Pn很方便|1|
|14–19|printed recurrence proof, including “即” on row15|6|
|20|根据公式(1)依次得到|1|
|21|P2/P3 formulas, same row|1|
|22|P4/P5 formulas, same row|1|
|23–25|P6,P7,P8|3|
|26|printed page number16|1|

Total:25 non-foot rows +1 foot = **26**.
The source crop visibly separates the recurrence row, the “依次计算” row and
the opening proof row despite handwriting between them. The machine's25 bands
cannot justify merging two of those printed rows or treating handwriting as
an extra formula. Exact counting-algorithm diagnosis/repair is left to the
tool owner; this review establishes the independent source total.

## Physical 24 / Printed 17

### Objects, All Formulas And Text

`p0024#0.cont=true` starts exactly with the continuing list:

- $P_9=9P_8=9\times40320=362880$.
- $P_{10}=10P_9=10\times362880=3628800$.
- $P_{11}=11P_{10}=11\times3628800=39916800$.

These are three separate printed rows. The subsequent seating example has
11 guests,11 chairs and the printed numeric string39916800. It occupies two
rows. The definition/factorial section retains:

- Reference to equation(1) and exercise19.
- $P_n=1\times2\times3\times\cdots\times n$, numbered(2), one row.
- $n!$, read as “n的阶乘”, in the two-row prose paragraph.
- $P_n=n!$, numbered(3), one row.
- The explicit empty-set arrangement convention $P_0=1$.
- The statement that equation(1) applies for $n=1$ and
  $P_1=1\times P_0=1$.

The convention is actually printed on this page; it is not retroactively
inserted into an earlier exercise. No solutions were inferred from it here.

Exercises are32,33 and the first part of34:

-32 stem is one row; а)$A=\{1\}$ and б)$A=\{7,8\}$ share the next row;
  в)$A=\{a,b,c\}$ and г)$A=\{m,n,p,q\}$ share the third row.
  Existing Cyrillic subpart labels match the source order.
-33 has the three colors red/blue/white, horizontal cloth strips and asks
  about different tricolor flags; it is exactly two printed rows.
-34 stem prints the condition $n>m$; part а) prints
  $\frac{(m+3)!}{m!}=(m+1)(m+2)(m+3)$ on one formula row.
  Its numerator/denominator are parts of one high fraction, not two rows.

Current MD/JSON match these formulas and text. Ex34 is correctly `open`
on this page and p25's initial б) is correctly `cont` for34.
The P9–P11 list continuation closes before the seating example; no `open`
is needed there.

The six handwritten color arrangements near33/34 are not source subparts
or answers and were not transcribed as textbook content. Margin black spots
are not figures. There is **no source figure**.

### Actual Printed Rows

| Rows | Printed Content | Row Count |
| --- | --- | --- |
|1–3|P9,P10,P11 continuation|3|
|4–5|11-guest/11-chair example|2|
|6–7|factorial product introduction/reference19|2|
|8|product formula plus(2), same row|1|
|9–10|n! notation and reading|2|
|11|Pn=n! plus(3), same row|1|
|12|empty-set convention introduction|1|
|13|P0=1|1|
|14|applicability for n=1|1|
|15|P1=1×P0=1|1|
|16|习题 heading|1|
|17–19|32 stem and two shared subpart rows|3|
|20–21|33, two rows|2|
|22|34 stem|1|
|23|34а, full single fraction/equality row|1|
|24|printed page number17|1|

Total:23 non-foot rows +1 foot = **24**.
The existing machine inventory gives25 bands. Near33/34 it has five adjacent
bands `[1809,1875]`, `[1876,1942]`, `[1943,2009]`, `[2010,2076]`,
`[2077,2143]` over the four actual printed rows20–23 plus intervening handwriting.
This is localized diagnostic evidence, not authorization to mask printed
text or change the source row count. No exact arbitrary exclusion box is
proposed.

## Physical 25 / Printed 18

### All Formula/Subpart Checks

The first row is34б), continuing p24:
$\frac{n!}{(n-m)!}=n(n-1)\cdots(n-m+2)(n-m+1)$.
It is complete on this page and the34 continuation correctly closes.

All printed subparts of35–37 match MD/JSON:

| Exercise/Subpart | Observed Formula Or Condition |
| --- | --- |
|35а|$8!+9!$|
|35б|$10!-11!$|
|35в|$\frac{102!}{100!}$|
|35г|$\frac{6!-5!}{120}$|
|36а|$\frac{n!}{(n-1)!}$|
|36б|$\frac{(n-2)!}{n!}$|
|36в|$\frac{(n-1)!}{(n-3)!}$|
|36г|$\frac{2k(2k-1)}{(2k)!}$, $k\in N$|
|37а|$\frac1{n!}-\frac1{(n+1)!}$|
|37б|$\frac1{(k-1)!}-\frac1{k!}$|
|37в|$\frac{p(p-1)(p-2)(p-3)(p-4)!}{(p-2)!}$|
|37г|$\frac{m(m-1)(m-2)\cdots(m-(k-1))}{m!}$, $m\geqslant k$|

In37в, only the last factor $(p-4)$ has the factorial sign; neither the
whole numerator nor every factor does. In37г, the denominator is $m!$.
Source36г's denominator is the complete $(2k)!$; no cancellation/result was
substituted for the original expression. All minus signs and factorial scopes
are preserved. No mathematical erratum was inferred.

Remaining exercise prose matches the scan:

-38 asks the element count for full permutations with а) not greater than1000
  and б) not less than500. The stem has two rows; both subparts are on the
  second row, not two separate printed rows.
-39 is the list of nine students, one row.
-40 gives14 train carriages and14 attendants, exactly one per carriage,
  two rows; the second is the condition and question continuation.
-41 uses digits0,1,2,3, no repeated digit, four-digit numbers, two rows.
-42 uses1,2,3,4,5, all five-digit numbers without repeated digits; the stem
  is one row and а) asks for numbers beginning with3 on the next row.

35–41 are closed complete source exercises.42 has only а) on this page and
correctly remains `open` in MD and JSON. Its unseen further parts are not
invented, and no claim that the unit closes here is made.

Right-margin ink spots and the bottom scan edge are not printed source lines.
There are no source diagrams or figure crops to approve.

### Same-Row And Fraction Facts

35а/б share one row,35в/г share one row.
36а/б/в share one row,36г occupies its own row.
37а/б share one row,37в and37г occupy one row each.
These are preserved inside their exercise blocks as common line bodies;
separate `samerow` flags are not needed for subparts already in one block row.
Every numerator/denominator belongs to its full formula's row, with no
formula actually continuing onto another printed row.

### Actual Printed Rows

| Rows | Printed Content | Row Count |
| --- | --- | --- |
|1|34б continuation fraction/equality|1|
|2|35 stem|1|
|3–4|35а/б then35в/г, shared rows|2|
|5|36 stem|1|
|6|36а/б/в, shared row|1|
|7|36г fraction and condition|1|
|8|37 stem|1|
|9|37а/б, shared row|1|
|10|37в, one full fraction|1|
|11|37г, one full fraction and condition|1|
|12–13|38 stem and shared а/б question|2|
|14|39|1|
|15–16|40|2|
|17–18|41|2|
|19|42 stem|1|
|20|42а|1|
|21|printed page number18|1|

Total:20 non-foot rows +1 foot = **21**.
The existing machine inventory gives22 bands. In particular, its adjacent
`[1189,1239]` and `[1240,1289]` bands lie over the numerator and denominator
of the **single** printed37в fraction row. They are not two source lines.
This source fact does not authorize adding a formula-break marker to that
fraction or duplicating its text.

## Handoff Boundary

Parent corrections should be limited to the printed `即`, synchronization of
p23's already intended list continuation, and the actual counting defect(s).
The original print row inventories above are independent evidence, not a
manual override for a failed counter. No synthetic expected count, source-ink
mask, tool patch, page finalization or assembly was performed by this reviewer.
Any later changed-only check must preserve this initial failed snapshot report.

## Changed-Only Confirmation: p23 Character And Boundary Synchronization

Date:2026-11-15. This appendix checks only the authorized repair against
`tmp/source-9c-p23-p25-initial/0023..0025/{page.md,page.json,audit.json}`.
The preceding first-review record is retained unchanged; its pre-append
SHA-256 is
`0fdbf51023cbe06cd4516621cfc30c00fc5e0f5b5ec696d74e2f6b7b5b179339`.

No image was reopened. No source solving, repeated whole-page review, counter
run, finalize, masking, assemble, browser or DB operation was performed.
The original source observations above remain the authority.

### Three Changes Confirmed

A recursive JSON comparison found **exactly these three changed leaf paths**:

| JSON Path | Initial | Current | Source-Fact Assessment |
| --- | --- | --- | --- |
|`/blocks/9/lines/1`|`位置上，第$n$个位置上有`|`位置上，即第$n$个位置上有`|Restores the independently observed printed `即`; no other character changed.|
|`/blocks/11/open`|`false`|`true`|Synchronizes the existing MD `p open` for P2–P8 continuing into p24 P9–P11.|
|`/meta/notes/1`|Ends `末尾P8公式完整，后续内容尚未处理。`|Ends `末尾P2至P8的公式列表续物理24页P9至P11，保留open边界。`|Synchronizes the existing MD continuation note; its preceding handwriting/noise description is unchanged.|

The full MD comparison is exactly the single replacement
`位置上，第$n$个位置上有` -> `位置上，即第$n$个位置上有`.
Its `p open` and notes were already present in the first-review MD snapshot;
they are not additional MD edits in this repair.

All remaining JSON leaves are identical, including formula text, other
characters, source/render/profile metadata, printed_lines, figures, errata,
other boundary flags and row ordering. MD newline count is unchanged.
p23 still has13 blocks and26 block-body rows. Restoring `即` adds no printed row.

### Current Hash Binding

Current p23:

| File | SHA-256 |
| --- | --- |
|`page.md`|`25a3b4461786e6b15ad8347ea86d401b29adb572052de1a456f38b9bae39b5ab`|
|`page.json`|`779ffede1e1a2d2a3c252d40b67dadbfea0e8998f60c4300ee2f7586bc41c7c1`|
|`audit.json`|`ae85589615df80457a7242c9b8cda6fc30f266213a86d1435d909fe2b86232aa`|

Current p24/p25 files are byte-identical to their preserved first snapshots:

| Page | File | Current SHA-256 |
| --- | --- | --- |
|24|`page.md`|`4f4678d38aa1b9f5575476e82fd8a6603fb44401c3d69467a2ca448617edea6e`|
|24|`page.json`|`4e8b404181c2d0d00291a91978bdbba3077a4b555eb0c8460cc2d8bdfa3a7855`|
|24|`audit.json`|`e38546066fd7424eea3446a5190176236986396cd751fcb10724444159762e0c`|
|25|`page.md`|`ec73264fab48eb1a6fe7a766c0a8ceb64db6a67d21e3dd82b4695a5d84403b64`|
|25|`page.json`|`80e8a464f446571806710379147a1c39912020d110a85ce7771b32a8bd20eebf`|
|25|`audit.json`|`8269efbc5069765083a5f64501d233963f29a8139d80acad46cac27aedeac9f4`|

### No Page-Gate Release

All three audit files are byte-identical to the first failed audits.
p23 remains machine25 / block26 **FAIL**, with empty count_exclusions.
p24 remains25/24 FAIL, and p25 remains22/21 FAIL. Their block-row totals remain
26/24/21. No counting correction, mask or count override is introduced by
the three checked changes.

The authorized character/boundary/notes repair is confirmed, but it does
**not** imply source-page finalize PASS or authorize assembly. The real counting
defects remain for the parent tool owner. Stop here and await further direction.
