---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 70,
  "printed_page": 63,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 70
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "fb79e99ac41e47ecff22ba8ad221b224280abd9c1a7cc61049dab03c8378c1ad"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "Original FIRST metadata retained verbatim as provenance, without deriving fields from YAML:\nsource_id: source70\nsource_path: /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0070/page.png\nsource_sha256: fb79e99ac41e47ecff22ba8ad221b224280abd9c1a7cc61049dab03c8378c1ad\nprinted_page: 63\nprinted_page_basis: Directly read central footer numerals in full page and final native crop.\nincoming_identity: null\noutgoing_identity: null\nnotes:\n  - Blind FIRST source70 only; no adjacent source or text, draft, key, review, old transcription or logical lesson identity was consulted.\n  - Original FIRST.inventory.json was recorded before transcription and is retained unchanged. FIRST.inventory.final.json contains post-crop resolutions.\n  - The title prints a raised star after 18.; body uses ASCII * to represent that mark.\n  - The word 稠密性 has a wavy printed underline; the body preserves the word without adding unapproved style markup.\n  - The inequality in exercise 147 has a visibly slanted lower comparison stroke; transcribed as LaTeX \\geqslant.\n  - Exercise 146 subpart а) is encoded as Cyrillic per the loaded Soviet-CN transcription rule; б) is directly identifiable in the source.\n  - The footer is two dot-like decorations flanking directly legible 63. Bullet characters record visible shape, not a claim about the printer's original encoding.\n  - Filled printed sentence-stop dots are transcribed as ASCII periods; the printed colon and semicolon shapes use ASCII colon and semicolon.\n  - Bottom prose ends visibly at 一一对 with no punctuation completing the sentence; p open is supported by this same-page incomplete syntax.\n  - The bottom sentence is unindented prose directly following the fraction display; it stays in the same final p open block with the preceding prose and two formula rows.\n  - No cont or samerow block flags are asserted; the incoming boundary identity remains unknown.\n  - Isolated margin and bottom-edge marks remain unclassified; no count exclusion was invented.\nunknowns:\n  - Incoming lesson, column or exercise-group identity.\n  - Outgoing continuation text and its identity.\n  - Origin and ownership of isolated margin or edge marks without adjacent-source comparison.\n  - Original type encoding and precise geometric shape of footer decorations.\ncount_exclusions: null\nsource_count_pass: null\nmath_pass: null\nfigure_pass: null\nwhole_lesson_pass: null\napproval: not_requested_not_performed\n",
    "Exact frozen FIRST typed body and flags. Direct footer63; no physical offset inference, boundary completion, figure or count-exclusion invention.",
    "Original initial inventory and later resolution addendum remain distinct. Source69 unknown boundary is not guessed.",
    "Original PNG SHA-256:fb79e99ac41e47ecff22ba8ad221b224280abd9c1a7cc61049dab03c8378c1ad; source70 cumulative4/4 exhausted; parent24/24 unchanged, zero new opens/payloads."
  ],
  "errata": [],
  "printed_lines": 23,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex 146 -->
146. а) $\{(x,y)\mid(x-2)(y+3)=0\}$; б) $\{(x,y)\mid\frac{y-x}{x-1}=0\}$.

<!-- ex 147 -->
147. $\{(x,y)\mid x<0,\ y\geqslant-1\}$.

<!-- h3 -->
18. * 实数集合的某些性质

<!-- p -->
如果将数学仅仅局限于有理数的范围，在许多方面数学
的内容将十分贫乏（“2”开平方将没有“准确的”根，不是坐标
轴上的每一点都具有坐标，等等）. 但只从实践的观点看来，如
上所述，影响并不太大. 在实践中，甚至不用全部有理数，仅
用有限小数就足够了.

<!-- p -->
实际上，这里包含着有理数子集在全部实数的集合中的
稠密性. 这一性质的几何意义表明，在坐标轴的任何闭区间
上，至少存在一个有理点（也就是说存在无限多个有理点）.

<!-- p -->
离开实际的可能性，可以说，如果在每一个有理点上点
灯，那么在坐标轴上不会出现任何黑暗的区间，整条轴都将发
光. 尽管如此，在整条坐标轴上仍然隐藏着无数个无理点. 从
某种意义上说，无理点甚至“多于”有理点.

<!-- p open -->
现在我们来解释一下最后一个论点的意义. 把全部有理
数排成数列: $(r_1,r_2,\cdots,r_n,\cdots)$，按照和数 $|p|+q$ 增加的顺序
写出不可约分数 $\frac{p}{q}$，但是，当这个和相等时就按分子增加的顺
序写出:
$\frac{0}{1},\frac{-1}{1},\frac{1}{1},\frac{-2}{1},\frac{-1}{2},\frac{1}{2},\frac{2}{1},\frac{-3}{1},\frac{-1}{3},\frac{1}{3},\frac{3}{1},\frac{-4}{1},$
$\frac{-3}{2},\frac{-2}{3},\frac{-1}{4},\frac{1}{4},\frac{2}{3},\frac{3}{2},\frac{4}{1},\frac{-5}{1},\frac{-1}{5},\cdots$
全部有理数集合和全部自然数集合 $N$ 之间建立起来的一一对

<!-- foot -->
• 63 •
