# STEMROBIN-184 source AUTHOR ledger: 10c physical 106-109

Scope: continuing invocation; author only. Parent remains permanently 24/24.
This bounded author context started at 0/24, this batch at 0/8.
Final cumulative counts are 4/8 batch, 4/24 author context.
No wait, output, or text handoff resets either counter.
Prepared originals are immutable. No prepare, grids, reopens, resampling,
adjacent-page pixels/text artifacts, answers, choices, or modern figure work.

## Image load ledger

All four original dimensions verified with `sips -g pixelWidth -g pixelHeight`
before any view; SHA-256 verified with `shasum -a 256`.
Paths below are relative to this scratch root, not durable dependencies.

| Slot | Image | Native dimensions | SHA-256 | Rectangle [x,y,w,h] | Load | Cumulative batch/context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 10c/pages/0106/page.png | 1695x2580 | dc99f6a793ede1732a5d5525bab10089c707c6a49aba3ad860beeae7dbd4ea35 | [0,0,1695,2580] | loaded once with view_image detail=original | 1/8, 1/24 |
| 2 | 10c/pages/0107/page.png | 1695x2580 | 267c5c5c8f6998966a7e9c98499ec9cb822b554ccb15398be5a52112731942ff | [0,0,1695,2580] | loaded once with view_image detail=original | 2/8, 2/24 |
| 3 | 10c/pages/0108/page.png | 1695x2580 | c0fda47bf8b1ca7a0dbb192e11f27893f9bdf751517700ba1a8f357e3123556d | [0,0,1695,2580] | loaded once with view_image detail=original | 3/8, 3/24 |
| 4 | 10c/pages/0109/page.png | 1695x2580 | b223d3342f2499f0f1712929a551fb40a7b9bb0d7b3905ffd60b7761ab8912d3 | [0,0,1695,2580] | loaded once with view_image detail=original | 4/8, 4/24 |

At most four NEW, genuinely necessary crops may be loaded as slots 5-8.
Each requires its own dimensions, SHA-256, original rectangle, reason, and load
counter. No crop has been created or loaded.

## Incoming text boundary

Only the human-supplied physical-105 text summary was received:
printed 99, unit 97 原函数; definition F'=f complete; solved Examples 1
(p0105#4, including infinite-constant prose) and 2 (p0105#5) fully closed and
excluded from future blind seeds. Exercise 392 has complete visible а), б)
but no proven global right boundary; 习题 / 证明 governs it. Actual page-106
start must establish further subparts and closure. No original, author, or
review from 105 was read.

## Block and row mappings

Raw layout line bands are mechanical metadata, not an independent printed-row
count. Block references use one-based order of typed block headers in page.md.

### p0106 / printed 100

Independently observed 19 real printed rows including footer; no figure.
Body block rows sum to 21, less two samerow overlaps = 19.

| Block | Type/object | Actual printed rows | Approximate original y | Boundary/ownership |
| --- | --- | --- | --- | --- |
| p0106#1 | ex 393 | R1-2 | 254-444 | complete а), б); inherited 习题 / 证明, unit 97 |
| p0106#2 | ex 394 | R3-4 | 483-716 | complete а), б); same proof group |
| p0106#3 | ex 395 | R5-6 | 754-978 | complete а), б); same proof group |
| p0106#4 | ex 396 | R7-8 | 1028-1250 | complete а), б); same proof group |
| p0106#5 | ex 397 | R9-10 | 1292-1420 | starred request, complete а), б); same proof group |
| p0106#6 | exhead 求函数 f 在 R 上的原函数 | R11 | 1454-1502 | actual new exercise-group heading, unit 97 |
| p0106#7 | ex 398 | R12 left | 1536-1583 | closed on same row as 399 |
| p0106#8 | ex 399 samerow | R12 right | 1536-1583 | closed, overlaps #7 first row |
| p0106#9 | ex 400 | R13 left | 1620-1709 | closed on same row as 401 |
| p0106#10 | ex 401 samerow | R13 right | 1620-1709 | closed, literal mixed number 2 1/2 |
| p0106#11 | h3 98. 原函数的基本性质 | R14 | 1840-1892 | actual unit-98 start; observed unit-97 closure |
| p0106#12 | p 积分的任务 | R15-16 | 1946-2072 | complete prose |
| p0106#13 | p 预备定理（常数函数判别法） | R17-18 | 2105-2234 | complete statement; no invented open |
| p0106#14 | foot | R19 | 2281-2310 | printed 100 |

Page 106 starts with 393, so 392 has no further subparts/continuation here and
its physical-105 right boundary is now proven. Do not add an empty 392 cont.
Unsolved requests 393-401 remain eligible future blind-source candidates;
no answers or proof were supplied for those requests.

### p0107 / printed 101

Independently observed 26 real printed rows including footer; no figure.
Body rows sum to 26; no samerow overlap.

| Block | Type/object | Actual printed rows | Approximate original y | Boundary/ownership |
| --- | --- | --- | --- | --- |
| p0107#1 | p 必要性及充分性证明 | R1-3 | 262-480 | proof of p0106#13; complete, not a new unsolved request |
| p0107#2 | p 现在我们来证明 | R4 | 510-559 | introduction, unit 98 |
| p0107#3 | p 基本性质定理 + equation (1) | R5-9 | 587-954 | entire statement, closed |
| p0107#4 | p 验证两个事实 | R10 | 988-1033 | proof introduction |
| p0107#5 | p facts 1), 2) | R11-13 | 1064-1278 | both source facts intact in one block |
| p0107#6 | p 第一个命题验证 | R14-17 | 1307-1599 | full proof, formula spans R15-16 with ↵; closed |
| p0107#7 | p 第二个命题及 Φ givens | R18-21 | 1629-1921 | complete printed introductory paragraph ending colon |
| p0107#8 | p displayed derivative difference | R22 | 1953-2000 | equation owned by second proof |
| p0107#9 | p 常数函数判别法结论 | R23-24 | 2035-2163 | owned by same second proof |
| p0107#10 | p open 因此， | R25 | 2198-2244 | real crosspage open, next page not yet viewed |
| p0107#11 | foot | R26 | 2285-2315 | printed 101; transparent to open/cont |

Theorem p0107#3 and its entire demonstration p0107#4 onward must remain
together as solved instructional material, excluded from future blind seeds.
The preliminary theorem and proof likewise remain linked as
p0106#13 + p0107#1. No synthetic ex block was made from either proof.

### p0108 / printed 102

Independently observed 14 real textual printed rows including both figure
captions (one shared row) and footer. Body rows sum to 15, less one caption
samerow overlap = 14. Two figures contribute zero body rows. Raw layout has
27 bands, including figure strokes and a bottom-edge thin line: do not make
the transcription fit that mechanical count.

| Block | Type/object | Actual printed rows | Approximate original y | Boundary/ownership |
| --- | --- | --- | --- | --- |
| p0108#1 | p cont Φ-F=C or Φ=F+C | R1 | 230-273 | matches p0107#10 open |
| p0108#2 | p 这就是所要证明的 | R2 | 305-350 | observed final closure of theorem proof |
| p0108#3 | p 几何说明及图46引用 | R3-5 | 384-587 | closed paragraph; owns fig 46 |
| p0108#4 | fig 图46 | no body row | coarse box [165,830,485,565] | entire left diagram, body owner #3 |
| p0108#5 | fig 图47 | no body row | coarse box [805,625,565,790] | entire right diagram, solved-example owner #8 + actual continuation |
| p0108#6 | cap 图46 | R6 left | 1458-1491 | belongs to #4 / #3 |
| p0108#7 | cap 图47 samerow | R6 right | 1450-1491 | belongs to #5 / #8, overlaps #6 first row |
| p0108#8 | p open whole solved example | R7-13 | 1558-2202 | givens R7-8, general antiderivative R9-10, graph/reference and equation R11-13; not yet complete |
| p0108#9 | foot | R14 | 2255-2286 | printed 102; transparent |

Real row details after figures: R7 first example line with M(9,; R8 -2)
closes given point; R9 function/any-antiderivative prose; R10 2sqrt(x)+C;
R11 fig47 and M; R12 (9,-2) and solve-equation prose; R13 -2=2sqrt(9)+C.
The first coordinate uses ↵ exactly at its printed line break.

Only coarse original-figure boxes/ownership were recorded. No figure was
extracted, cropped, loaded separately, modernized, or assigned an unsolved
exercise owner. Source fig46 has x/y axes, origin 0, and four vertically
translated wavy curves; fig47 has x/y axes, origin 0, and eight rising
concave curves. Neither visibly labels M or gives numeric ticks. These are
original observations, not instructions to add labels or solutions.

The unit-98 theorem and its proof are now observed closed at p0108#2:
p0107#3-10 + p0108#1-2 stay linked as solved instructional material.
The separate solved example begins p0108#8 and remains genuinely open.

### p0109 / printed 103

Independently observed 18 real textual printed rows including footer.
Body rows sum to 21, less three samerow overlaps = 18. The table contributes
zero body rows. Raw layout has 22 bands including four table-stroke bands;
its count is not the printed textual-row count.

| Block | Type/object | Actual printed rows | Approximate original y | Boundary/ownership |
| --- | --- | --- | --- | --- |
| p0109#1 | p cont solved-example conclusion | R1-2 | 241-375 | matches p0108#8; C=-8 and final expression; observed closure |
| p0109#2 | p 原函数的一般形式 | R3-4 | 427-555 | starts independent prose after complete example |
| p0109#3 | p 原函数表引言 | R5 | 588-638 | owns unnumbered table #4 |
| p0109#4 | fig 表 | no body row | coarse box [265,690,1220,295] | entire original table; body owners #3 and #5, no exercise owner |
| p0109#5 | p 自行检验表及第48/115小节指向 | R6-9 | 1037-1324 | unsolved reader verification request, intact with qualification |
| p0109#6 | exhead 习题 | R10 | 1419-1461 | actual exercise heading, unit 98 |
| p0109#7 | exhead 函数 f 的原函数过已知点 | R11 | 1515-1565 | common given/request for 402-407 |
| p0109#8 | ex 402 | R12 left | 1595-1646 | f=x^3, M(2,1); closed |
| p0109#9 | ex 403 samerow | R12 right | 1595-1646 | f=sin x, M(0,3); closed; overlaps #8 |
| p0109#10 | ex 404 | R13 left | 1682-1776 | f=1/cos^2 x, M(pi/4,0); closed |
| p0109#11 | ex 405 samerow | R13 right | 1682-1776 | f=-2, M(3,5); closed; overlaps #10 |
| p0109#12 | ex 406 | R14 left | 1818-1916 | f=1/x^3, M(-1/2,3); closed |
| p0109#13 | ex 407 samerow | R14 right | 1818-1916 | f=cos x, M(pi/2,0); closed; overlaps #12 |
| p0109#14 | ex 408 | R15-17 | 1982-2219 | complete visible question, no invented open; global right boundary unproved |
| p0109#15 | foot | R18 | 2265-2299 | printed 103 |

Table inventory from original pixels, text record only: two rows and six
columns including the left row labels. First row is f(x); entries are
x^a (a != -1), sin x, cos x, 1/cos^2 x, 1/sin^2 x.
Second row is F(x); respective entries are x^(a+1)/(a+1)+C,
-cos x+C, sin x+C, tg x+C, -ctg x+C. No printed table number/caption,
missing cells, added domain claim, or modernization is asserted.

## Final object boundaries and seed exclusions

- Incoming solved Examples 1 and 2 remain exactly the human-supplied closed
  objects p0105#4 and p0105#5. No p0105 artifact or pixels were read.
- Exercise 392 is observed right-closed by the actual 393 start on 106;
  no continuation or extra subpart was invented.
- Unit 97 is observed closed by actual h3 unit 98 at p0106#11.
- Preliminary theorem p0106#13 and its given proof p0107#1 are linked;
  not an unsolved-proof seed.
- Basic-properties theorem p0107#3 and all its proof/givens through
  p0108#2 are linked; actual chain p0107#10 open -> p0108#1 cont.
- Complete solved example: p0108#8 open -> p0109#1 cont, with figure
  p0108#5 (fig47), caption p0108#7, all givens and solution lines. Closure
  is observed before p0109#2. Exclude this entire object, not only its
  final expression, from any future blind seed.
- Figure 46 and caption remain explanatory body material owned by p0108#3.
- Unsolved requests 393-401 and 402-407 are complete candidates within
  their actual headings. The unnumbered table-verification request
  p0109#5 is unsolved and remains eligible with its table/givens. Exercise
  408 is visibly complete but its global right boundary remains unproved.
- There is no source-evidenced mathematical erratum in these four reads;
  errata arrays remain empty. No silently corrected source formula.

## Unresolved / limits

- No physical-110 original, text, author, review, answer, or choice read.
  Therefore the global right boundary of 408 and unit-98 closure remain
  unproved. Visible 408 ends with its two complete questions; not marked
  open just because a later page is unread.
- Figure boxes are deliberately coarse, not snapped or extracted.
  No modern figure output, source figure hash separate from whole-page
  hashes, geometry audit, or finalization evidence is claimed.
- Mechanical row-band discrepancies on 108/109 are recorded, not repaired.
  No count exclusions, manual count override, gate, render, test, or
  finalize/assemble command was run.
- AUTHOR transcription only; no independent reviewer result is claimed.
- No image slots 5-8 used; no helpers/crops created. Counts remain 4/8,
  4/24 in this author context and parent remains 24/24. Return text only.
- Writes confined to four owned durable page.md files and this scratch
  ledger/handoff; preserve all other agents' work. No Git or workflow action.

## Durable text hashes

Root: /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/

| Text path below durable root | SHA-256 |
| --- | --- |
| 0106/page.md | 2b7b588c96c1a452d562a3435d867572589ebe7fe13aef1c96403449b52f576c |
| 0107/page.md | 0b8f65ce7810e5280695875d1698d2742beed6788e11e0409fdef046a4a9db15 |
| 0108/page.md | 71748176a14018c1e71595fcfcbd7804fbce7f8b7b771024d3599cf5184cdbfc |
| 0109/page.md | abc8b1d2a8aaba6627dace0a42fe051b1b96541aa121553156146ef860974c24 |

Final handoff returns the complete text artifacts and their hashes only.
WAIT; no images forwarded to parent and no further image reads authorized
by this completed batch.
