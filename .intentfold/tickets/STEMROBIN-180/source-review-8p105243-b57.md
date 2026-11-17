# Batch57 Independent Source Review: 8p 105 / 243

Date: 2026-11-17. Verdict: **PASS for both replacement pages**. No source-revision findings.

## Scope and Method

- Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
- Reviewed only physical pages 105 and 243, printed pages 93 and 231, in `.tmp/ld-s10y-lesson/b57-summaries/{work,artifacts}/8p/pages/{0105,0243}`.
- Read the lesson and image skills first. For each page, opened the original `work/.../page.png` before its existing emphasis crop and recorded an independent source inventory before reading any replacement Markdown, JSON, or audit. Both inventories preceded all replacement-file reads.
- Then compared the entire printed page, row by row, with current `page.md` and `page.json`. Did not use `page.first.md`, templates, layout inventories, prior reviews, or old HOLDs as source evidence.
- A read-only Node command independently checked Markdown frontmatter/block bodies against JSON, source-derived row vectors, open/cont flags, empty figure inventories, existing audit contents, PNG dimensions, and PDF/render/profile hash bindings. It did not invoke pipeline tools.
- This reviewer wrote only this report. No source edits, prepare/finalize/vectorize/assemble reruns, DB access, index changes, ticket updates, commits, or changes to other workers' files.

## Physical 105 / Printed 93: PASS

### Source Inventory

| Source object, in printed order | Kind | Printed rows | Boundary |
| --- | --- | ---: | --- |
| 动力学 | h1 | 1 | Complete part heading |
| 第四章　运动定律 | h2 | 1 | Complete chapter heading |
| 引言 | h3 | 1 | Complete introduction heading |
| Previous chapter, initial coordinates/velocity, and acceleration | p | 3 | Closed |
| Changes in motion; acceleration, its magnitude/direction, and control of motion | p | 6 | Closed |
| 力学的主要部分——动力学，回答了所有这些问题. | p | 1 | Closed |
| Definition ending 分力学，叫做*动力学*. | p | 2 | Closed |
| 22. 物体及其周围的环境　牛顿第一定律 | h3 | 1 | Complete section heading |
| 为了寻求产生加速度的原因，应当从实验、观察入手. 但 | p | 1 | Open |
| · *93* · | foot | 1 | Complete footer |

Total: `1+1+1+3+6+1+2+1+1+1 = 18` printed rows. No actual figures, captions, tables, or exercises.

### Precise Findings

- Full-page text matches, with no missing, duplicated, invented, or reordered text. All physical line breaks match the scan, including the definition's `这部` / `分力学` break.
- The introduction consists of four closed prose blocks and ends at `分力学，叫做*动力学*.` before section 22. Its `动力学` emphasis matches the source; the earlier occurrence after the dash remains unmarked.
- Source punctuation is retained: sentence-ending periods, Chinese commas and enumeration marks, the long dash in `主要部分——动力学`, parentheses around `它的绝对值和方向`, and the section-number period. The heading and italic page number match.
- The new section's one-row paragraph is correctly `p open`, ending exactly at `但`, without an invented ending or continuation. All `cont` and `samerow` flags are false. No introduction block remains open, and no connection to physical 243 is claimed.
- `page.md:37-73` and all 10 JSON blocks agree. Metadata says physical 105 / printed 93; the existing audit reports `lines_printed=18`, `lines_md=18`, empty figures/normalizations/unknown characters/KaTeX warnings/errors, and zero errata.
- **Required revisions: none.**

## Physical 243 / Printed 231: PASS

### Source Inventory

| Source object, in printed order | Kind | Printed rows | Boundary |
| --- | --- | ---: | --- |
| 第九章　机械功和能量 / 能量守恒定律 | h2 | 2 | One complete two-row chapter heading |
| 引言 | h3 | 1 | Complete introduction heading |
| Momentum conservation, energy conservation, and the importance of mechanical work | p | 6 | Closed |
| 究竟什么是机械功呢？ | p | 1 | Closed |
| 63. 机械功 | h3 | 1 | Complete section heading |
| Nineteenth-century origin of work; machinery and earlier human labor | p | 8 | Closed |
| 上述几个例子的共性是：*物体在运动并且有一个力或几* | p | 1 | Open |
| · *231* · | foot | 1 | Complete footer |

Total: `2+1+6+1+1+8+1+1 = 21` printed rows. No actual figures, captions, tables, or exercises.

### Precise Findings

- Full-page text matches, including both printed chapter-title rows; no unprinted part heading is inserted. All physical line breaks match the scan, including `另` / `外一个`, `发` / `现之后`, and `问` / `世之前`.
- Both introduction prose blocks are closed. The introduction ends at `究竟什么是机械功呢？` before section 63, without absorbing its heading or prose.
- Section 63's complete eight-row first paragraph retains `十九世纪`, `150年`, `“工作”`, the tractor/plow, lathe, crane, and pre-machinery examples, through `完成功.`. No text or emphasis is invented there.
- Periods, commas, enumeration marks, parentheses, quotation marks, the dash before `能量守恒定律`, the introduction's question mark, and the colon in the final paragraph match the source.
- The following paragraph is correctly `p open`; its italic span begins at `物体`, after the un-emphasized colon, and runs through the visible `几`. Closing the local Markdown emphasis delimiter does not close the paragraph. It stops at `或几`, without invented continuation text. All `cont` and `samerow` flags are false; no link to physical 105 is claimed.
- `page.md:37-72` and all 8 JSON blocks agree. Metadata says physical 243 / printed 231; the existing audit reports `lines_printed=21`, `lines_md=21`, empty figures/normalizations/unknown characters/KaTeX warnings/errors, and zero errata.
- **Required revisions: none.**

## SHA-256 Bindings

All hashes below were computed from the reviewed files, not copied as proof from their metadata.

Shared source PDF: `ssot-resources/soviet10year-textbooks/sources/soviet10years/8p 苏联中学课本 物理 八年级.pdf`

`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`

Profile: `.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`

`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`

Paths in this table are relative to `.tmp/ld-s10y-lesson/b57-summaries/`.

| Reviewed file | SHA-256 |
| --- | --- |
| work/8p/pages/0105/page.png | `d537c86b84495e7b483429d64f505425f0273344a3e5d28f4e30f88380011252` |
| work/8p/pages/0105/emphasis-crop.png | `0b9946757eb80fa9a922b2fb06ca48914bae0f1ac77f0d89d840dfc6b1d7f084` |
| artifacts/8p/pages/0105/page.md | `7f1642bc15d8dc6b72e29da02379acd32017f08f659db3d38057bf4015c11072` |
| artifacts/8p/pages/0105/page.json | `a45d3084c55748ac929f837c2c9f2bf508f4873a2e9c0f9d88923ec9b288f690` |
| artifacts/8p/pages/0105/audit.json | `6cc840cbebabe8e93744ddf8bf675d2eae5e2b4b938755ff6c4f2cf60fee1b7f` |
| work/8p/pages/0243/page.png | `2150a4d6ca7fa219ab47ff3f05c5f2d4eec43351d7e1ec4d57e155aabf16ed4d` |
| work/8p/pages/0243/emphasis-crop.png | `4df6f63ed5144e413ff68008e9bc979f031565b37d6b4c18b2ec32e65eb1b6ee` |
| artifacts/8p/pages/0243/page.md | `5945c6094703b0099504a6b4d01a738761196c0184bc7a84004d856cbbf51942` |
| artifacts/8p/pages/0243/page.json | `fa57198e53577e989afe9735557b23e90460ee62c0baff2467fa0c87b037241c` |
| artifacts/8p/pages/0243/audit.json | `9e22f3f1dd57e56335a31c76a2157fe209d7b0bbe1d828370b17fe5d37235104` |

Both scan files are `1695 x 2580`; their actual hashes/dimensions and the actual shared PDF/profile hashes agree with each page's metadata.

## Image-Open Ledger and Limits

1. Physical 105 original `work/8p/pages/0105/page.png`.
2. Its existing `work/8p/pages/0105/emphasis-crop.png`.
3. Physical 243 original `work/8p/pages/0243/page.png`.
4. Its existing `work/8p/pages/0243/emphasis-crop.png`.

**Total: 4 image opens, including crops; 2 per page; 0 reopens.** No new crops, grid images, figure images, adjacent pages, or screenshots were opened or generated. The eight-image limit was respected.

PASS applies only to these hash-bound replacement page artifacts. The unfinished following paragraphs remain unfinished; physical 106 / printed 94 and physical 244 / printed 232 were not reviewed. This is not approval of adjacent pages, assembly, modern editions, publication, or any old HOLD.
