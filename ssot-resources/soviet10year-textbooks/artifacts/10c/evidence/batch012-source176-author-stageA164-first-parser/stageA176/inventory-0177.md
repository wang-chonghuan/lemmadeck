# Physical 0177: Independent Source Inventory

Input SHA-256: cc5d5ed28a1bfa9ea6189072097ecea107407c79db86b0efdaed3b53a2352712

One native original view, detail=original. Printed footer at lower right: bullet-like mark, 171, bullet-like mark / adjacent tiny speck. No transformation or second view.

## Reading Rows

`LEQ-TYPE-UNKNOWN` preserves a less-than-or-equal-like mark without deciding its exact stroke TYPE or Unicode. Formula letters are descriptive visual mnemonics.

| Row | Independently visible source content |
| --- | --- |
| R01 | 是：当 $x$ 趋向无穷大时，幂函数比对数函数增大得快。 |
| R02 | **定理 3 存在这样一个数 $M$，使得对于所有的 $x\in]0,1[$，** |
| R03 | **不等式** |
| R04 | $\lvert x^p\ln x\rvert$ `LEQ-TYPE-UNKNOWN` $x^{p/2}M$, with equation label **(3)** at far right on the same formula row. |
| R05 | **成立。** |
| R06 | 这个定理可以由定理 2 推出（因为 $\frac{1}{x}>1$）： |
| R07 | $\lvert x^p\ln x\rvert=\frac{\ln\frac{1}{x}}{(\frac{1}{x})^p}$ `LEQ-TYPE-UNKNOWN` $\frac{M}{(\frac{1}{x})^{p/2}}=x^{p/2}M$。 |
| R08 | 这个定理的直观意义是对于所有足够小的正数 $x$，可以 |
| R09 | 使积 $x^p\ln x$ 成为任意小的数。 |
| R10 | **118*. 历 史 知 识** |
| R11 | 在十四世纪，法国数学家奥莱斯姆 (1328-1382) 发现了 |
| R12 | 分数指数幂和对分数指数幂的最简单的运算法则，法国人叔 |
| R13 | 克（十五世纪）研究了负指数幂和零指数幂。 |
| R14 | 德国数学家希齐费尔 (1486-1567) 引入“指数”这一名称 |
| R15 | 并给出定义 $a^0=1$（当 $a\ne0$ 时）。他比较了自然数和同一个底 |
| R16 | 数的自然数幂，对于这种特殊情况得出了关系式 $\log(a\cdot b)=$ |
| R17 | $\log a+\log b$，$\log\frac{a}{b}=\log a-\log b$。 |
| R18 | 对数是由英国数学家纳比尔 (1550-1617) 和瑞士数学家 |
| R19 | 蒲琪 (1552-1632)（彼此独立地）引入的。纳比尔发展了对数 |
| R20 | 理论。他研究出了利用对数计算算术式的方法并编成了详细 [possible tiny following mark: TYPE/origin UNKNOWN] |
| F01 | Lower-right bullet-like mark, **171**, bullet-like mark with neighboring small speck. |

## Formula And Layout Facts

- R01 begins with 是： and finishes the conclusion from 0176's open tail. It is not a new independent heading.
- R02-R05 are a bold theorem statement plus a centered formula. The explicit interval is $]0,1[$. No extra condition on $p$ is locally supplied here.
- R04 has absolute-value bars around the whole visible product $x^p\ln x$, not around just $\ln x$. The right side is $x^{p/2}M$. The exponent $p/2$ is a small stacked fraction. (3) is a same-row equation label, not a caption or separate body row.
- R06 explicitly gives $1/x>1$, with $1/x$ printed as a tall fraction.
- R07 is one horizontal display chain. First nested fraction: numerator $\ln(1/x)$ with the inner $1/x$ stacked, denominator $(1/x)^p$ with the inner $1/x$ stacked. Second tall fraction: numerator $M$, denominator $(1/x)^{p/2}$ with both inner $1/x$ and exponent $p/2$ stacked. Final expression $x^{p/2}M$ is on that same row. Fraction component heights do not create extra source rows.
- R08-R09 explicitly say 足够小的正数 $x$ and 任意小的数; no replacement with a limit statement or an absolute-value statement is made.
- R10 is a centered numbered unit heading, 118 with a raised star, then period and widely spaced 历史知识. This is a starred UNIT heading, not a starred exercise. The visual star is locally verified, unlike the parent-transport star on physical 175.
- R11-R13 form the first history paragraph. The source wraps the name 叔克 between 叔 at R12's right edge and 克 at R13's left edge.
- R14-R17 form the next paragraph. $a^0=1$ and condition $a\ne0$ occur in one row. The visible condition is not silently removed.
- R16-R17 contain one equation intentionally split across prose rows at the equals sign: $\log(a\cdot b)=$ on R16, $\log a+\log b$ on R17. R17 then prints a second relation with a tall fraction $a/b$ as the logarithm argument. This is not one row in the physical source.
- R18-R20 begin another history paragraph. The word 对数理论 is split at the page's R19-R20 row break. The dates are faithfully transcribed as visible numeric ranges; dash code-point identity is not inferred.
- No figure, table, caption, figure label, exercise or shared exercise instruction is visible. No section/chapter heading accompanies the locally visible new unit heading.
- Sparse edge specks and thin top/bottom scan lines are visible. Their provenance is UNKNOWN, no neighbor was opened and no count exclusion is asserted.

## Uncertainty

- U177-01: exact inequality glyph TYPE / Unicode at R04 and R07 is UNKNOWN. The inventory does not authorize choosing `≤`, `⩽`, `\leq` or `\leqslant`.
- U177-02: the visible letter mnemonics $x,p,M,a,b$ cannot certify identical-looking Latin/Cyrillic source code points. Code-point provenance remains UNKNOWN where glyphs alone are non-distinguishing.
- U177-03: the tiny mark following the last visible word 详细 at the far-right end of R20 is unresolved in this single view: source punctuation versus scan trace, and punctuation TYPE / Unicode, remain UNKNOWN. Do not invent a comma, period, continuation word, or missing text.
- Historical name spellings above are source readings, not corrected against modern transliteration or external biography.

## Open Boundaries

- TOP: 0176 local tail "关于这一点，简单地说就" + 0177 local head "是：当 $x$ 趋向无穷大时，幂函数比对数函数增大得快。" is a direct-local-to-direct-local continuation. No physical 175 pixels were used.
- INTERNAL: preceding theorem/conclusion prose ends before R10. R10 starts locally visible source unit 118*. 历史知识.
- BOTTOM: unit-118* prose ends here at "并编成了详细", with U177-03 unresolved. It is OPEN. No next-page word or final closure is supplied yet.
- Footer is transparent to the open body paragraph.

StageA record only. No author comparison, source fidelity PASS, finalization, publication or StageB decision.
