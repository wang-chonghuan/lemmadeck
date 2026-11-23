# N62 SOURCE BLIND FIRST freeze

Date: 2026-11-23. Ticket: STEMROBIN-187. Reviewer: sole independent
source-blind and mathematical-derivation reviewer.

**Frozen before author/key comparison. Source PASS with one known mathematical
HOLD.** This is not modern-figure, authored-answer, choice, interaction, display,
finalization or publication approval. No excluded files were read.

## Source bindings

All paths below are under `ssot-resources/soviet10year-textbooks/`. Exact SHA-256
bindings are also recorded in the companion `source-blind-FIRST.json`.

| Current source | SHA-256 |
| --- | --- |
| artifacts/4m/lessons/math4-c2-s3-n62/lesson.json | a114d13dceb159f207cef16440fe536696620113b032899a1ee7f4e6703c43ed |
| artifacts/4m/lessons/math4-c2-s3-n62/exercises.json | 8ba5b24dec6aab79f96a83838c71f8ababa0a09f8e0740edeb185dbf7c8f0e30 |
| artifacts/4m/pages/0233/page.json | 2f4535dd3c6fe51fc0278b52d73be7560e392be296bf4e49fce88f8904e456a6 |
| artifacts/4m/pages/0233/page.md | 62b936db390027001b6ca59e84f76ab826896e5554d379255eb92cf9e5279b57 |
| artifacts/4m/pages/0234/page.json | e1ec3b7b249661d22b658d421bf106720fce05915ff04abd33c58ba84fc5cb8f |
| artifacts/4m/pages/0234/page.md | c03095948494325fc72446dc9ca936a59b2e2b2dfdb0f31edef1e974e974f8d7 |
| artifacts/4m/pages/0235/page.json | f90370a440ab0cd8b75b172caa3a312e76e2a1cb653b97d6221e5958246baae1 |
| artifacts/4m/pages/0235/page.md | be65240fb0b97d28ceaf5bfb2f5bdb3ddaf74a483da43189d186f6fb1e929af7 |
| toc/4m/zh.json | 35f60224523ab693f8484b806944aeb1a5e542cc123352ff41be79890a676a85 |

Page metadata consistently declares PDF SHA-256
`642b18080aeaedd63a713f8e7e83c179459df1f5a21a93d80841a6c8530600d8`.
The PDF was not reopened or rehashed in this review.

## Pixels, fidelity and ownership

**Actual images: 2, one batch; each actual grid opened once. No reopens/crops.**
Limits read from installed shared rules: 8/batch, 24/context. Parent is permanently
24/24 per caller and receives TEXT ONLY.

- Physical 234 / printed 225 grid SHA-256:
  `84f8da45371e68f052a12f36e16f762b69ab6f229b12673448cce5aa187348c6`.
  Full source MD/JSON matches all 24 text rows: left-shift rule, examples 3/4,
  exercises 1073-1079, review heading and footer. Literal `003.7`, all decimals,
  powers of ten, source Cyrillic labels and printed `10 000` grouping are retained.
- Physical 235 / printed 226 grid SHA-256:
  `a95d4e128e2300872cd21080ac3e54e3ea2d888c8a371c6e2b9e797771de1035`.
  Full source MD/JSON matches all 23 distinct text rows: complete 1080, homework
  heading, 1081-1083, N63 heading and all boundary prose/caption/footer. The caption
  shares the last introductory N63 prose row. Figure 228 has AB with O between
  A/B, ray OC rising right, A/O/B/C labels and an irregular stippled upper region.
  This observation establishes ownership, not exact crop geometry or modern approval.
- **Physical 233 / printed 224 was NOT opened.** Caller-provided prior independent
  SOURCE pixel pass is reused; this review derives its mathematics from current
  retained prose and source-bound erratum metadata. No prior reviewer file was read.
  Current MD/JSON bodies agree and preserve `一位`. Current erratum `original` is
  the full exact sentence containing `4.576` and `457.6`. Caller states the raw body
  was unchanged; no historical byte-diff claim is made here.

TOC puts N62 at printed 224 and N63 at printed 226. N62 starts at `p0233#2`,
after the N61 exercise-1072 tail. It ends after complete 1083 at `p0235#5`,
before heading 63 at `p0235#6`. Figure/caption 228 and their reference lie below
that heading and belong to N63 alone, not 1080 or N62.

Raw assembly has exactly 13 prose blocks, 11 complete exercises and no figures
or exercise figure refs. Groups are `g0`: 1073-1076, no printed heading;
`g1`: review 1077-1080, continued across pages; `g2`: homework 1081-1083.
No missing/duplicate exercise, incomplete object, new transcription defect or
N63 ownership contamination was found.

## Independent mathematical prose

Every raw prose reference is covered below; pure quantities here are
dimensionless. Powers-of-ten factors are dimensionless and preserve any
pre-existing physical unit.

- `p0233#3,#10`: write a finite decimal as `N/10^d`. Multiplication by `10^k`
  gives `N*10^k/10^d`, equivalent to shifting the decimal right `k` places and
  padding zeros when needed. `10,100,1000` are powers of ten, not arbitrary
  numbers ending in zero.
- `p0233#4,#5`: `4576*10=45760`; restoring three fractional places gives
  `45.760=45.76`. Thus `4.576*10=45.76`.
- `p0233#6`: one rightward decimal place in `4.576` gives `45.76`, correctly.
- `p0233#7,#8`: `4576*100=457600`; restoring three fractional places gives
  `457.600=457.6`. Thus `4.576*100=457.6`.
- `p0233#9`: **known HOLD**. One rightward place gives `45.76`, not `457.6`;
  the latter requires two places. See the exact registered sentence below.
- `p0233#11`: `(124124/1000000)*10000=124124/100=1241.24`.
- `p0233#12`: `3.7=3.70=37/10`; `(37/10)*100=370`. Trailing zero changes
  representation only. The colon introduces `3.7=3.70`, not another multiplication.
- `p0234#1`: `0.1,0.01,0.001` equal `10^-1,10^-2,10^-3`; multiplication
  divides by `10^k`, shifting left `k` places with leading-zero padding as needed.
- `p0234#2`: `(264/10)*(1/10)=264/100=2.64`.
- `p0234#3`: `003.7=3.7` in decimal notation, so
  `(37/10)*(1/100)=37/1000=0.037`. Literal leading zeros are harmless, not errata.

## Independent complete exercise solutions

All printed exercise numbers below are source numbers. Cyrillic `а) б) в) г)`
are literal source labels, not Latin `a/b/c/d`; code points are
U+0430/U+0431/U+0432/U+0433. Numeric `1)/2)` are literal source labels.
Any `item` or `group` identifier in the JSON is reviewer-created only.

**1073, `p0234#4`, unheaded group, dimensionless.**
Each product scales by the given power of ten; entries remain in source order.

| Source group | Complete products |
| --- | --- |
| а) | `6.42*10=64.2`; `0.17*10=1.7`; `6.387*100=638.7`; `0.00081*1000=0.81` |
| б) | `3.8*10=38`; `20.35*100=2035`; `0.75*100=75`; `0.0001*1000=0.1` |
| в) | `0.006*100=0.6`; `45.48*100=4548`; `7.8*1000=7800`; `0.102*10000=1020` |

**1074, `p0234#5`, unheaded group, dimensionless.**
Substitute into `61.3x`: for source `x=8,10,35,100,1000,10000`,
the respective results are **490.4, 613, 2145.5, 6130, 61300, 613000**.
The non-power cases are `61.3*8=613-122.6=490.4` and
`61.3*35=1839+306.5=2145.5`. No printed sublabels are supplied.

**1075, `p0234#6`, unheaded group, dimensionless.**
а) `3.214*100+75=321.4+75=396.4`.
б) `0.041*100+59=4.1+59=63.1`.

**1076, `p0234#7`, unheaded group, natural-number counts.**
`千=1000`, `百万=1000000`, `十亿=1000000000`; these are scale words,
not physical units. All nine entries become positive integers.

| Unlabelled source quantity, printed order | Independent expansion |
| --- | --- |
| 4.5千 | `4.5*1000=4500` |
| 87.4千 | `87.4*1000=87400` |
| 7648.1千 | `7648.1*1000=7648100` |
| 8.9百万 | `8.9*1000000=8900000` |
| 42.4百万 | `42.4*1000000=42400000` |
| 67.56百万 | `67.56*1000000=67560000` |
| 0.954百万 | `0.954*1000000=954000` |
| 1.1十亿 | `1.1*1000000000=1100000000` |
| 25.77十亿 | `25.77*1000000000=25770000000` |

**1077, `p0234#9`, review group, dimensionless.**
Round `8271.9354` in printed label order:
а) units: tenths 9 rounds up, **8272**;
б) hundreds: tens 7 rounds up, **8300**;
в) hundredths: thousandths 5 rounds up, **8271.94**;
г) thousands: hundreds 2 rounds down, **8000**.
Hundredths and hundreds must not be interchanged.

**1078, `p0234#10`, review group, dimensionless.**
The instruction rounds EACH FACTOR to units before multiplying:
1) `78.164 -> 78`, `11.289 -> 11`, so product is **approximately 858**.
2) `67.236 -> 67`, `10.635 -> 11`, so product is **approximately 737**.
These are not exact original products, nor exact-product-then-round results.

**1079, `p0234#11`, review group, dimensionless.**
1) `(7-5.38)*2.5=1.62*2.5=4.05`.
2) `(8-4.46)*1.5=3.54*1.5=5.31`.

**1080, `p0235#1`, review group, degrees.**
Use ordinary closed non-reflex angular regions. Their intersection is exactly
one shared boundary ray, of zero angular width; their interiors do not overlap.
Union measure is **60+100=160 degrees**.

Complete textual construction: choose vertex O and common ray OR. Put outer
ray OP 60 degrees counterclockwise from OR, and OQ 100 degrees clockwise from
OR. Sectors POR and ROQ share OR only; their union is sector POQ of 160 degrees.
O/R/P/Q and this orientation are reviewer-introduced, not source labels or a
copied diagram. Rotations/reflections are equivalent. This does not use figure 228.
Bare pairs of rays or directed/reflex encodings are not the source's
angular-region domain. Actual drawing/display approval remains outside scope.

**1081, `p0235#3`, homework group, dimensionless.**
Each product follows the same exact power-of-ten scaling.

| Source group | Complete products |
| --- | --- |
| а) | `3.12*10=31.2`; `0.14*10=1.4`; `2.174*100=217.4`; `0.00015*1000=0.15` |
| б) | `0.314*10=3.14`; `151.45*100=15145`; `0.0001*10000=1`; `0.3*100=30` |
| в) | `0.0062*1000=6.2`; `2.348*10000=23480`; `0.1002*100=10.02`; `0.1*10=1` |

**1082, `p0235#4`, homework group, dimensionless.**
а) `15.2*10+1.73*100=152+173=325`.
б) `16.52*10+18.1=165.2+18.1=183.3`.

**1083, `p0235#5`, homework group, individual white mushrooms.**
Day 1 is already one of FOUR days: **8** mushrooms.
Day 2: `8*1.5=12`; day 3: `12*1.5=18`; day 4: `18*1.5=27`.
Total: **8+12+18+27=65 white mushrooms**.
All daily values are integers; no fractional-mushroom or rounding gap arises.
Do not add a fifth day or treat 1.5 times as a 150-percent increase.
An extrapolated fifth day would be 40.5, but the source does not ask for it.

## HOLDs And Domain/Capacity Notes

Exactly one HOLD, already registered as `p0233-math-1`, bound to `p0233#9`:

> 如果把乘数的小数点向右移一位就可以从乘数4.576得到积457.6。

Current full exact sentence and both numbers are bound in retained MD/JSON
metadata and body. Independent derivation shows `4.576*10=45.76`, whereas
`4.576*100=457.6`. Raw source is unchanged and may not be approved as
mathematically correct. Later modern erratum handling must be checked separately;
no modern correction is assumed or inspected here. No new pixel review of 233.

No new unresolved source ambiguity or exercise-math HOLD was found.
1080 requires angular-region semantics and a construction, not only a scalar.
1083's four-day integer-count domain is consistent; no physical collection or
storage capacity is specified or mathematically required.

1076 requires the answer **25770000000**, exceeding signed AND unsigned 32-bit
integer capacity. Exact storage needs at least unsigned 35 bits or signed 36 bits;
the value is below `2^53-1`. This is a downstream capacity requirement, not an
observed app/key defect: those files were not read. No capacity or correction
from neighboring lessons was imported.

## Verification And Stop

Observed checker result: **PASS, exit 0**. Nine source bindings, three page
pairs, 13 prose blocks, 11 exercises, 53 independent outcomes, zero image
payloads loaded by the checker, and one known mathematical HOLD.

Minimal local read-only checker checks nine source hashes, all three retained
MD/JSON pairs and printed counts, exact raw assembly/prose refs, all 11 exercise
lines/groups/labels/numerals/source refs, TOC boundaries, absence of N62 figure
contamination, current full erratum original, **53 independent scalar outcomes**
and eight prose arithmetic checks using exact rational decimal arithmetic.
It does not load images or substitute for their semantic observations.

Installed lesson/image and production-resume rules were read without
refresh/bootstrap. Only these NEW durable FIRST reports and a minimal scratch
checker are written. No source/modern/stable/app changes, author/key comparison,
finalize/render, DB/env/paid/install, Git/branch/worktree, chats/timers/peers or
subagent actions. Return before comparison. Preserve this FIRST freeze unchanged
for any separately authorized later comparison.
