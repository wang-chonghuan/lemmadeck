# STEMROBIN-184: affected metadata/source review

Date: 2026-11-23. Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Scope: text-only comparison of the current 0046-0049 MD/JSON/audits with the
retained first-failure triples, limited to metadata changes and complete-body
delta. Existing substantive source, mathematics, U84 and C83 reviews are reused.
No source or mathematical work was re-solved or re-reviewed from images.

**Actual final reviewer image total remains exactly 8/8.**
This stage loaded zero images and created no crops. Only this new report was
written; no existing observation, addendum, source candidate or audit was edited.

## Scoped disposition

| Page | Metadata/source delta | Actual current audit | Remaining limit |
| --- | --- | --- | --- |
| 0046 | PASS: unchanged body; exact M46 erratum binding; eligible separator-only box | PASS, 24/24, errors empty, errata 1 | No modern correction/display/publication approval |
| 0047 | PASS: unchanged body; eligible bottom-edge scan box | PASS, 24/24, errors empty | Scoped page-source result only |
| 0048 | PASS: unchanged body; unsupported printed attribution removed; eligible left-margin box | PASS, 25/25, errors empty | Underline provenance remains UNKNOWN |
| 0049 | PASS for unchanged reviewed body and the eligible far-right box only | FAIL, 21/20, count error retained | Explicit count/provenance HOLD for internal handwriting |

**No whole-N11 approval is issued.** The current page-0049 failure is not
overridden, and the separate supplementary card is not approved for assembly
or publication. N11 still ends with exercise 89 before `第二章 补充习题`;
the latter is the separate `ana9-c2-ex` boundary already established by the
parent and the prior comparison.

## Compared snapshots and delta method

Current root, relative to the sole working directory:
`.tmp/stemrobin-184-six/n11-nov23-source4651/raw/9c/pages/`.
For each of 0046-0049, compared `page.md`, `page.json`, and `audit.json` against
the corresponding retained files under:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/author4649/first-failure-NNNN/`.

All twelve complete text diffs were inspected. Markdown differences are
confined to frontmatter. JSON differences are confined to `meta`; the entire
`blocks` arrays are unchanged. Audit differences are confined to the recorded
count results, exclusions, errata count and errors.
The diff commands' exit status 1 denotes these displayed differences, not an
execution failure.

Consequently there is **no body delta** on any page: no changed source word,
formula, value, line/wrap marker, block kind/order, continuation flag, footnote,
footer, heading or exercise fragment. The prior crop-supported readings
`普遍`, `戴`, total-count `r`, and comma after `比赛` remain intact.
The original 0.48 formula, 0049 factorial expressions, separate supplement
heading and open exercise-93 tail are unchanged. This is delta evidence, not
a replay of their substantive source/math checks.

Page/source identity and render-hash metadata also have no delta. Numeric
diagnostic source hashes match the source bindings in the retained independent
freeze. This stage did not open, crop, rescan or hash any source-image pixels.
The parent's explicit unchanged-pixels statement and retained bindings are
reused; no new pixel-level claim is fabricated.

## 0046 erratum: exact source binding PASS

Both current Markdown frontmatter and JSON `/meta/errata` contain exactly one
new record:

- ID: `p0046-paired-dice-rounding`.
- Block: `p0046#2`.
- Exact original full mathematical substring:

```text
$\frac{36^{24}-35^{24}}{36^{24}}=1-\left(\frac{35}{36}\right)^{24}\approx0.48<\frac{1}{2}$
```

This is byte-for-byte the source-matching math span identified in
`source-comparison.md`, still present in the unchanged second prose block,
JSON `/blocks/1/lines/11`. Its trailing sentence period remains outside the
math span. The record does not silently substitute 0.49 into the faithful body.

The reason matches the existing M46-decimal review: the source clearly prints
0.48, the already-computed probability is `0.491403876131...`, and two-decimal
rounding is 0.49. It also preserves the exact complement and less-than-half
conclusion. Those facts were not recomputed here.

Current JSON SHA-256:
`12f9f8f8e993ffeabfeefe1bb2d098a319435f20a56cf9f678dff2889c966ee2`.
Its unchanged render binding is source SHA-256
`c38155937133b54ad558d7643270418093e1564550a8db3f6b35bb2d502bd54b`.
The old JSON hash in the initial comparison remains historical and is not
represented as the current metadata-bearing file.
Audit `errata` is now 1. No other page gained an erratum.
This is source-registration review only; no modern-edition artifact was read.

## Exclusion scope: retained source/geometry evidence, not desired totals

Read the retained text/numeric evidence at:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/author4649/count-diagnostic/`:

- `count-diagnostic.md`;
- `count-attribution.json`, specifically the four proposals, source bindings
  and stored diagnostic counts;
- `crop-component-facts.json`, specifically the corresponding component
  bounds and the internal handwriting/printed-semicolon distinction.

No diagnostic script, shared counter, native finalizer, attribution test or
image helper was run. No author diagnostic crop was opened.
Boxes use `[x,y,width,height]` with top-left source-pixel origin and exclusive
upper bounds. Each current page has exactly one exclusion, and its kind/box
matches the retained diagnostic proposal exactly in MD, JSON and audit.

| Page | Current kind and exact box | Source-supported scope |
| --- | --- | --- |
| 0046 | `separator-rule`, `[225,2036,470,14]` | Matches component 899, 3108 ink pixels: only the thin instructional-footnote separator. It ends at y=2049; retained note components begin at y=2077. Initial independent observation identified the short separator and genuine `* 用对数计算.` note separately. The note is unchanged, not masked or labelled noise. |
| 0047 | `scan-artifact`, `[0,2334,1596,47]` | Matches the retained bottom-edge ink union, including main component 818 `[0,2334,1575,47]`. It is below the printed footer and confined to the bottom margin. Initial independent observation identified the long bottom-edge scan line separately from content. |
| 0048 | `scan-artifact`, `[0,811,52,71]` | Matches component 334, 2832 ink pixels, entirely in the far-left margin. It leaves the centered exercise heading and body intact; it does not cover the internal underline. This matches the initial independent distinction between left-edge blotches and content. |
| 0049 | `scan-artifact`, `[1562,843,47,45]` | Matches component 282, 1540 ink pixels, at the far-right margin after exercise 89 and before the supplement heading. It is separate from the printed body and from internal handwriting. Initial independent observation identified far-right blobs as margin marks. |

The kinds comply with the lesson skill's limited separator-rule/far-margin
scan-artifact categories. These scoped PASS findings rest on initial
source-object observations plus retained component geometry and bindings,
**not** on a count becoming equal. No blanket margin box, internal-text box,
extra wrap, deleted denominator, masked punctuation or forced target count
has been introduced.

The old authoring notes still contain the initial phrase
`未添加count_exclusions`; that historical authoring statement is not treated
as the current field value. Current explicit exclusion lists and audits are
the affected metadata evidence reported here.

## 0048 underline attribution: affected metadata PASS, provenance UNKNOWN

The only changed prose-note field is `/meta/notes/1` and its Markdown
frontmatter equivalent. It now states:

```text
正文集合论下可见波浪下划线；其印刷或读者添加的来源未知，不是独立图或文字行，也不作为计行排除依据。习题80至86均完整；小问采用源书西里尔标号，并排小问保留物理同行。
```

This removes the unsupported attribution `印刷`, expressly leaves the origin
unknown, and refuses to use the underline as exclusion authority. That is
consistent with the independent freeze/comparison and the retained diagnostic.
The internal wavy strokes have no exclusion box. Their diagnostic component
bounds remain under `集合论`, within the existing body band, distinct from
the eligible left-margin blotch.

**UNKNOWN stays UNKNOWN.** Page 0048's 25/25 audit does not establish that the
underline is printed, reader-added, or causally relevant to the previous extra
count. No source body or underline pixels were changed by this metadata edit.

## 0049: explicit residual count/provenance HOLD

The current audit preserves the count error:

```text
行数对不上：印刷 21 行，块体 20 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

Its single far-right exclusion accounts only for the transition from the
first failure's 22/20 to current 21/20. That is consistent with the retained
diagnostic's far-right-blotch-only result. It does not account for the residual
annotated-formula split, and this review does not pretend it does.

The retained diagnostic distinguishes the four handwriting components
476/479/481/482 from printed semicolon component 466. The handwriting's
reported union `[1160,1592,124,68]` is **not** an eligible exclusion proposal:
the diagnostic reports 27 printed-punctuation ink pixels inside that union.
It is internal to the formula area, unlike the current far-right blotch.
No rectangle over the union, selective component mask or broader internal
mask has been added to source metadata or the audit.

The recorded diagnostic explanation is an annotation-associated split of the
single printed 91а/б row; its second native band includes printed denominator
glyphs. Existing source/wrap review remains applicable. It is not grounds to
invent another source formula line, change a factorial, add `↵`, infer the
handwritten answer, or repair the shared counter generally.
This stage does not reproduce or elevate the diagnostic experiment into an
approved native treatment.

**HOLD:** page-0049 count reconciliation remains failed, and the permissible
treatment/provenance of internal handwriting remains unresolved. Current
source content and the one eligible far-right box have scoped PASS; the page
does not have a complete finalization PASS. No whole-N11 release follows from
this distinction. No next operation or exclusion is authorized by this report.

## Actual audit transitions

| Page | Retained first audit | Current audit | Current errata / exclusions |
| --- | --- | --- | --- |
| 0046 | FAIL 25/24 | PASS 24/24, `errors=[]` | 1 / 1 |
| 0047 | FAIL 25/24 | PASS 24/24, `errors=[]` | 0 / 1 |
| 0048 | FAIL 26/25 | PASS 25/25, `errors=[]` | 0 / 1 |
| 0049 | FAIL 22/20 | FAIL 21/20, one count error | 0 / 1 |

Block-line totals are unchanged. Figures, normalizations, unknown-character
warnings and KaTeX warnings remain empty. These are observations of the actual
stored audits, not a finalizer replay. The parent reports one affected finalize
per page; this reviewer did not run one or independently inspect execution
streams beyond the requested current audit/first-failure comparison.

## Current snapshot hashes

Paths below are relative to the current root defined above.

| File | SHA-256 |
| --- | --- |
| `0046/page.md` | `cc0106f8a10a938dc0a0fc832e981b8f88aaf20c8ad5f8aa4b4fb459a092a5ca` |
| `0046/page.json` | `12f9f8f8e993ffeabfeefe1bb2d098a319435f20a56cf9f678dff2889c966ee2` |
| `0046/audit.json` | `b7e1ece910e13efc43b188b0026ce4b14befcbd86fa4710a5f3fd28c9abd46fe` |
| `0047/page.md` | `29f616e574ee219cfb71d07167c3ad629461057a266b0e13993fcc71b3e06247` |
| `0047/page.json` | `35747aae8a36f177d730bc97cccf6bb968a8fb9a4127f2c0c013d994b58d28a9` |
| `0047/audit.json` | `374c6aa95dd6849799018afb35a4767378a67bf94c8a9404537e8dacb914e17c` |
| `0048/page.md` | `1f274fa272b148a97228d39e3239b14e3386a046231f4be9228677e0fc473adb` |
| `0048/page.json` | `22e5783679cdd2b1afa429163efc13c4a47f46336ddba75ff11536398070f5d5` |
| `0048/audit.json` | `dfde0a8badd3d6ebd4d36163535d0abde010d0cf2580a6c228a034045462818a` |
| `0049/page.md` | `cbb73e6a8f0c708458f58d409563118eb9da244af41fcfbc2291efbd8c3ef5e5` |
| `0049/page.json` | `bc2e8e99953d44f925b7deab0564f51eba1e5bbcbc87e63f9f1fb14bb5f53a5e` |
| `0049/audit.json` | `e0245c5f3d13eee5574eb513a33df1da71c7077bb1540736fa1386c7479f56ae` |

Retained diagnostic text/numeric hashes:

- `count-diagnostic.md`:
  `7ddfff008eb14f95e41901756e0c7ebf221015760fb5a1d513f63d316ad0bdc6`.
- `count-attribution.json`:
  `a2afa3feb371d76d0b3bc16d09534cd45ef7c1a99d4eace5707aa171fd533a14`.
- `crop-component-facts.json`:
  `a8735c2e7a770e882ade65d78edeffcd88beebafc53de988dc2b47419f7cd202`.

All twelve retained first-failure hashes still match the original bindings in
`source-comparison.md`; those snapshots were not overwritten.
Prior reviewer hashes also remain unchanged:

- `source-first.md`:
  `3fa8125174a9aea6b084084675692362e4a87fdb9e155e7422e87bd6340ee6f1`.
- `source-math.md`:
  `b14c6f6a521efdd266eb90252d8a138f59a0cd1cbf6b5124e14dec850b7c29fc`.
- `u84-glyph.md`:
  `c0166792dcbf4be992676f987e23cbcdc3c9746e717d94c6d07e6934829112d5`.
- `source-comparison.md`:
  `aae210a50e96b0fdf36230b43dc574a3769fdebf86b5030e5c62555d8afefefa`.
- `c83-punctuation.md`:
  `399b143883ee7e546d13009be6aaa5722009fb847c3edaa1ef7889726d182fd3`.

## Final boundary

No image loads, pixel operations, source/candidate edits, fresh mathematics,
finalizer/count replay, diagnostic/helper execution, shared-tool edits, erratum
registration by this reviewer, Git, DB, `.env`, app, dependency, browser,
external historical checking or other-agent operations occurred.
File reads, text diffs, hash bindings and this new report are the entire stage.
Existing source/first-failure evidence, substantive reviews and all image crops
remain retained unchanged.

**Final actual image total: exactly 8.** Stop here. No whole-N11 approval,
downstream action or continuing task is implied.
