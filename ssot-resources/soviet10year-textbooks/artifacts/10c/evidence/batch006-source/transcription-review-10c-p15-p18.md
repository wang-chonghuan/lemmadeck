# STEMROBIN-184：10c p15–18 独立 source review

## 范围和顺序

- 仅独立审查物理 15–18；唯一写文件为本记录。已读 lesson cap1 合约。
- 四张完整原 PNG 各自单独观察，逐页冻结真实印刷行、完整数学/字形、对象和边界，再看实际新 crop；全部完成后才读目标 MD/JSON，audit 和作者 notes 最后读。
- 用户给定四页首次 count FAIL 24/22、23/20、20/19、24/23，此处暂只作为已知失败信息，不用于推定原图行数。不得以作者或机器预期凑行。
- 不修稿、不设 exclusions、不 finalize/计数 patch/assemble/render，不读答案/choices，不改当前 7–14 book index 或任何其他文件。n76 Stage1 结论保持冻结，Stage2 等父方披露 view。
- 当前阶段：p15–18 原图和实际图 4 已冻结；目标 MD/JSON/audits/author notes 均未读。

## 完整单张原图冻结

### p15：冻结 A

- 实际原 PNG：`.tmp/ld-s10y-lesson/10c/pages/0015/page.png`。
- SHA-256：`eb8a734d0f3823857b8fbc1f9c72eed5c40a7486fece8e80548e69cbf80a0a41`。
- 实际 folio：`· 9 ·`，本页物理减印刷为 6。
- **独立印刷文字行：22**。高分式的分子/分母和极限下标不是额外印刷行；左侧散黑点、顶/底边缘细线不计正文。无正式图、图题、习题、教学脚注或新单元标题。

| 行 | 原图完整文字/数学 |
|---|---|
| 1 | 证明　我们来估计 $\lvert\cos x-\cos x_0\rvert$． |
| 2 | $\lvert\cos x-\cos x_0\rvert=\left\lvert2\sin\frac{x_0-x}{2}\sin\frac{x+x_0}{2}\right\rvert$ |
| 3 | $=2\left\lvert\sin\frac{x_0-x}{2}\right\rvert\cdot\left\lvert\sin\frac{x+x_0}{2}\right\rvert\leqslant2\left\lvert\sin\frac{x-x_0}{2}\right\rvert$ |
| 4 | $\leqslant2\left\lvert\frac{x-x_0}{2}\right\rvert=\lvert x-x_0\rvert$． |
| 5 | 因此，如果对于任意的 $\varepsilon>0$，设 $\delta=\varepsilon$，当 $\lvert x-x_0\rvert<\delta$ 时， |
| 6 | 就有： |
| 7 | $\lvert\cos x-\cos x_0\rvert\leqslant\lvert x-x_0\rvert<\varepsilon$． |
| 8 | 这就是说， |
| 9 | $\lim_{x\to x_0}\cos x=\cos x_0$， |
| 10 | 也就是余弦函数在点 $x_0$ 是连续的． |
| 11 | 类似地，可以证明定理 2： |
| 12 | 定理 2　在整个数轴上，正弦函数是连续的，也就是对于 |
| 13 | 任意 $x_0\in R$， |
| 14 | $\lim_{x\to x_0}\sin x=\sin x_0$． |
| 15 | 定理 3　正切函数和余切函数在它的定义域内都是连续 |
| 16 | 的，就是 |
| 17 | 对于任意 $x_0\in D(\mathrm{tg})$，$\lim_{x\to x_0}\mathrm{tg}\,x=\mathrm{tg}\,x_0$； |
| 18 | 对于任意 $x_0\in D(\mathrm{ctg})$，$\lim_{x\to x_0}\mathrm{ctg}\,x=\mathrm{ctg}\,x_0$． |
| 19 | 证明　实际上，如果 $x_0\ne\frac{\pi}{2}+k\pi,\ k\in Z$，那么 $\cos x_0\ne0$． |
| 20 | 于是， |
| 21 | $\lim_{x\to x_0}\mathrm{tg}\,x=\lim_{x\to x_0}\frac{\sin x}{\cos x}=\frac{\lim_{x\to x_0}\sin x}{\lim_{x\to x_0}\cos x}=\frac{\sin x_0}{\cos x_0}=\mathrm{tg}\,x_0$， |
| 22 | · 9 · |

- 数学字形：估计链第一、第二横排中的角是 $(x_0-x)/2$，后续界变成 $(x-x_0)/2$，不得因绝对值等价而统一改写；绝对值竖线、乘积点及全部 2 都保留。小于等于号为斜式 `⩽`（`\leqslant`），严格小于仍为 `<`。
- 下标 $x_0$、$\varepsilon/\delta$、成员关系 $\in$、不等号 $\ne$、R/Z、tg/ctg 均为原书数学字形；不把成员关系改为子集或把定义域记号改成其他写法。
- 必须覆盖的逻辑对象顺序：余弦连续性证明及三行估计链 → $\varepsilon/\delta$ 条件和一行不等式 → 极限及文字闭合 → 定理 2 的正弦连续性 → 定理 3 的 tg/ctg 连续性 → 正切证明开头及一行完整极限商式 → folio。定理 2/3 是正文定理标号，不是新 h3 单元。
- 入批文本以“证明”新起完整句，所证定理来自批外；未读取 p14，不宣称批外对象配对已验证。
- 末商式在本页数学完整，句尾为逗号，证明还需由 p16 实际首文确认如何承接；不猜补余切证明或单元完成。

### p16：冻结 B

- 实际原 PNG：`.tmp/ld-s10y-lesson/10c/pages/0016/page.png`。
- SHA-256：`ccecddca9bd0eee706caea1de7612167a0e164e446b2b7874bc592d3c0698340`。
- 实际 folio：`· 10 ·`，本页实证偏移 6。
- **独立文字横排：20**。32/33/34、35/36/37、38/39 分别是三条横排，不是八条；极限的下标分式不是新行。题 41 的 cases 有两条独立分支横排，居中的 `f(x)=` 和跨两行左括号不另计。
- 正式图/图题/教学脚注均无。习题栏含上抬星；本页后部真正出现新单元 **78*** 标题，不是习题号。

| 行 | 原图完整文字/数学 |
|---|---|
| 1 | 类似地，可以证明定理 3 的第二部分． |
| 2 | 习题*（星上抬） |
| 3 | 求极限： |
| 4 | 32．$\lim_{x\to0}\sin x$． / 33．$\lim_{x\to\pi/2}\sin x$． / 34．$\lim_{x\to0}\cos x$． |
| 5 | 35．$\lim_{x\to\pi/4}\cos x$． / 36．$\lim_{x\to0}\mathrm{tg}\,x$． / 37．$\lim_{x\to\pi/4}\mathrm{tg}\,x$． |
| 6 | 38．$\lim_{x\to\pi/4}\mathrm{ctg}\,x$． / 39．$\lim_{x\to\pi/2}\mathrm{ctg}\,x$． |
| 7 | 40．证明函数 sin 在点 $x_0\in R$ 和函数 ctg 在点 $x\in D(\mathrm{ctg})$ 的连 |
| 8 | 续性． |
| 9 | 41．证明：对于所有的 $x\in R$，函数 $f$ 是连续的；其中 |
| 10 | $f(x)=\begin{cases}\frac{\sin x}{x},&\text{当 }x\ne0\text{ 时，}\\1,&\text{当 }x=0\text{ 时．}\end{cases}$ 的第一分支印刷行 |
| 11 | 同一 cases 的第二分支印刷行：$1$，当 $x=0$ 时． |
| 12 | 作出它的图象． |
| 13 | 78*　弦长与弦所对的弧长的比的极限（星上抬） |
| 14 | 我们从证明第 75 小节假设 6 着手． |
| 15 | 定理 1 |
| 16 | $\lim_{x\to0}\frac{\sin x}{x}=1$． |
| 17 | 证明　设 $0<x<\frac{\pi}{2}$ 或 $-\frac{\pi}{2}<x<0$．于是，有不等式 |
| 18 | $\lvert\sin x\rvert<\lvert x\rvert<\lvert\mathrm{tg}\,x\rvert$（参看第 77 小节）．用 $\lvert\sin x\rvert$ 除这个不 |
| 19 | 等式的各个部分，得到： |
| 20 | · 10 · |

- 字形/数学：8 道求极限题的目标角完整；源写 sin/tg/ctg 的函数名字而非后补求值。题 40 前一个点是 $x_0$，后一个在完整原图中为 $x$，不根据对称性自行加下标。题 36 题号后的墨点略有拖尾，不能据墨迹形状推导数学变化。
- cases 第一分支为 $\sin x/x$ 当 $x\ne0$，第二为 1 当 $x=0$；不拆成三个公式行，也不少记第二分支。图象作图命令是题 41 的组成部分，不能落入新单元正文。
- 习题星和单元 78 星均保留，原页没有对应教学脚注，不发明脚注。定理 1 是 78 单元正文内的定理标题，不是另一个单元。
- p15→p16：首句“类似地，可以证明定理 3 的第二部分”承接上一页证明并以句点闭合；其后习题 32–41 都属于前单元 77 的结束部分。实际 78 标题在 **p16 印刷 10** 后部开始。
- 出页边界：末证明止于“得到：”，公式必须由 p17 原图实际承接；本页不得补式或据标题宣称 78 完成。

### p17：冻结 C

- 实际原 PNG：`.tmp/ld-s10y-lesson/10c/pages/0017/page.png`。
- SHA-256：`4214f52aa58439c1042685a87be35752bd4fbf4c9fb0d9de439d25b4cc54aba5`。
- 实际 folio：`· 11 ·`，本页实证偏移 6。
- **独立文字横排：19**。例 1 的嵌套分式、极限下标虽高，仍与整条等式共享同一横排，不是两行。正文中一条绝对值估计真正跨两行，不能漏其第二行。
- 无正式图/图题、习题或新单元题头；三个“例”是单元 78 的正文例，不是另起习题号。“注”在正文底部并跨页，不是教学脚注。

| 行 | 原图完整文字/数学 |
|---|---|
| 1 | $1<\left\lvert\frac{x}{\sin x}\right\rvert<\frac1{\lvert\cos x\rvert}$． |
| 2 | 考虑到在给定条件下，$\frac{x}{\sin x}>0,\ \cos x>0$，就有 |
| 3 | $1<\frac{x}{\sin x}<\frac1{\cos x}$，因此 $1>\frac{\sin x}{x}>\cos x$． |
| 4 | 由此得到： |
| 5 | $0<1-\frac{\sin x}{x}<1-\cos x=\cos0-\cos x$． |
| 6 | 因为余弦函数是连续函数，那么对于任意的 $\varepsilon>0$，可以指定 |
| 7 | $\delta>0$，使得 |
| 8 | $\lvert0-x\rvert<\delta\Longrightarrow\lvert\cos0-\cos x\rvert<\varepsilon$． |
| 9 | 因此，对于 $x\ne0$ 并满足不等式 $\lvert x\rvert<\delta$ 的 $x$，有 |
| 10 | $\left\lvert1-\frac{\sin x}{x}\right\rvert=1-\frac{\sin x}{x}<\cos0-\cos x$ |
| 11 | $=\lvert\cos0-\cos x\rvert<\varepsilon$． |
| 12 | 这就是说， |
| 13 | $\lim_{x\to0}\frac{\sin x}{x}=1$． |
| 14 | 根据定理 1，可以计算某些极限． |
| 15 | 例 1　$\lim_{x\to0}\frac{x}{\sin x}=\lim_{x\to0}\frac1{\frac{\sin x}{x}}=\frac1{\lim_{x\to0}\frac{\sin x}{x}}=\frac11=1$． |
| 16 | 例 2　$\lim_{x\to0}\frac{\sin4x}{x}=\lim_{x\to0}\frac{\sin4x}{4x}\cdot4=1\cdot4=4$． |
| 17 | 例 3　$\lim_{x\to0}\frac{\mathrm{tg}\,x}{x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\frac1{\cos x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\lim_{x\to0}\frac1{\cos x}=1$． |
| 18 | 注　在数学分析里，正弦是数值自变量的数值函数，但是这个函 |
| 19 | · 11 · |

- 字形/数学：原第一式两个绝对值都在；后面在给定条件下去掉绝对值时，正号条件 $x/\sin x>0$、$\cos x>0$ 都完整。所有不等式为严格 `<`/`>`，不改成 $\leqslant$。
- 估计链第 10–11 行是真实折行，需要完整保存一个续行断点；它与高分子/分母造成的视觉高度不同。$\cos0-\cos x$、$\lvert0-x\rvert$ 的原顺序不能按数学等价重排。
- 例 1 的两个嵌套分式和四个等号、例 2 的两处 4 与乘积、例 3 的两次分离极限均须保留；不因它们是正文已解例而删减源转写。
- p16→p17：首式真实承接“得到：”；定理 1 证明在第 13 行极限结论处闭合。三个正文例随后完整。
- p17→p18：最后“注”止于 `函`，属于正文 p open；必须等下一页真实 `数...` 承接，folio 不截断该对象。

### p18：冻结 D

- 实际原 PNG：`.tmp/ld-s10y-lesson/10c/pages/0018/page.png`。
- SHA-256：`7669a7c5f7f482435dc8178a34a0930a29b2d50d7b2f5e695da1096f980f8bfc`。
- 实际 folio：`· 12 ·`，四页实证偏移均为 6。
- **独立文字横排：23**，含 folio；图 4 图题与左侧定理末行共享横排，不能另加 1 行。末极限式高分式和下标都在一条印刷横排。
- 一个正式正文图 4、一个同排图题；无新单元题头、习题或教学脚注。定理 2 是 78 正文内的定理。
- 下表暂以 `sin_[r形]` 记录真实下标轮廓，不把尚未确认的 r/西里尔字形体系假写成已确定码点。

| 行 | 原图完整文字/数学 |
|---|---|
| 1 | 数是从几何意义引入的（参看第 63 小节里的定义）．在几何学里，把正 |
| 2 | 弦看作角度值的数值函数．角度值可以利用不同的测量单位度量．把 |
| 3 | 正弦定义成数值自变量的函数时，取角度的弧度制作为基础：数 $x$ 的正 |
| 4 | 弦等于 $x$ 弧度角的正弦．为了确切起见，应当写成 |
| 5 | $\sin x=\sin_{\text{[r形]}}(x\text{ 弧度})$．　(2) |
| 6 | 在等式左边，sin 是数值自变量的函数的记号，而在等式右边，sin_[r形] 是 |
| 7 | 角度值的函数的记号．当用弧度制度量角度时，得到 |
| 8 | $\sin x=\sin_{\text{[r形]}}\left(\frac{180}{\pi}\cdot x\right)^\circ$．　(3) |
| 9 | 如果在数学分析里引入函数 |
| 10 | $f(x)=\sin_{\text{[r形]}}(x^\circ)=\sin_{\text{[r形]}}\left(\frac{\pi}{180}x\text{ 弧度}\right)=\sin\left(\frac{\pi}{180}x\right)$， |
| 11 | 代替用等式 (2) 定义的函数 sin，那么，对于它来说，就得到公式 |
| 12 | $f'(0)=\lim_{x\to0}\frac{f(x)}x=\frac{\pi}{180}$， |
| 13 | 而不是简单公式 |
| 14 | $\sin'(0)=\lim_{x\to0}\frac{\sin x}x=1$． |
| 15 | 这样做是不方便的． |
| 16 | 定理 2　圆的弦长与弦所对 |
| 17 | 的弧长的比，当弧长趋向零时，极 |
| 18 | 限等于 1（图 4）． / 右侧同排图题：图 4 |
| 19 | 证明　设圆的半径等于 $r$，它的弦 $AB$ 所对的弧是 $x$ 弧 |
| 20 | 度，那么弦 $AB$ 的长度等于 $\lvert AB\rvert=2r\sin\frac{x}{2}$，而弧长等于 $xr$． |
| 21 | 用 $l$ 表示弧长，得到： |
| 22 | $\lim_{l\to0}\frac{\lvert AB\rvert}{l}=\lim_{l\to0}\frac{2r\cdot\sin\frac{x}{2}}{xr}=\lim_{x\to0}\frac{\sin\frac{x}{2}}{\frac{x}{2}}=1$． |
| 23 | · 12 · |

- 下标源像素补看在 MD/JSON/notes 前完成：内存局部 `[560,535,960,600]`，最近邻放大 4 倍，未写文件。第 (2) 式下标有短竖/钩及上端右伸笔，呈 **r 形**；完整页同记号重复五处（(2)、解释句、(3)、f 的两个角度函数）。无法仅凭这一墨形可靠区分拉丁 r 与相似西里尔字形，**字符体系未决**，不得以几何意义猜代码点。
- 源文字确写“当用弧度制度量角度时”，下一式却带角度上抬圆圈；只作忠实记录，不将“弧度制”自行改成“角度制”。(2)/(3) 是公式编号；`x^\circ` 和括号整体上抬圆圈不是题号标记。
- 末式前两个极限下标为 $l\to0$，第三才为 $x\to0$；$\lvert AB\rvert$、$r$、$l$、$xr$、$\sin(x/2)$ 与嵌套分母 $x/2$ 都完整。不按等价运算调整源式顺序。
- p17→p18：`函` / `数是从几何意义引入的...`，正文“注”续接，至“这样做是不方便的”闭合；图后定理 2 和其证明完整到末等式，但下一单元/后续习题未读，不将 78 宣称完整。
- 图 4 的独立完整页清单：O 在左，B 在右上、A 在右下；OA/OB 两条实半径、竖直 AB 弦、右凸的 AB 圆弧；从 O 到右侧圆弧的水平虚线经过弦中部；O 附近一条内角弧分成上下两半，两处 $x/2$ 标签。O/A/B 三个标字完整，原图没有额外 r/l 标字，不后补。

## 实际裁图冻结

完整四页行账冻结为 **22/20/19/23** 后列全四个目录的实际 PNG：只有 p18 的 `figures/fig-04.png` 是正式 crop，没有其他局部 crop。没有读 grid PNG 或布局计数预期。

### 图 4：冻结 E

- 实际 crop：`.tmp/ld-s10y-lesson/10c/pages/0018/figures/fig-04.png`。
- SHA-256：`4bd4798c87397d795ad030e69c3f59dd13c3ef079a7ce5ea92b9af822d13cd71`。
- 单张实际观察：O/A/B 三字完整，OA/OB 实线半径和竖直 AB 弦完整，右凸 AB 圆弧从 B 连到 A。水平虚线从 O 穿过内角弧、弦中部到右侧圆弧，两处 $x/2$ 分别在虚线上下，数字 2 和分数线没有裁断。
- 内角弧、右端圆弧、底部 A 及顶部 B 均有完整边界，没有题干或图题混入，不含虚构 r/l 标签。与冻结 D 的实际图清单一致，**crop 内容 PASS**。
- 到此四页和实际 crop 均已在 MD/JSON/audit/作者 notes 前冻结。以下首次 MD/JSON 读取只投影正文与结构；meta.notes 和独立 author handoff 留到内容对照后最后读取。

## 一次 MD / JSON 正文对照

首次读取只输出 MD 块体和 JSON blocks、source/render/folio/figures；MD frontmatter 与 JSON meta.notes 没有输出。audit 和作者 handoff 尚未读。

### 独立正文 Finding

1. **p16 题 41 分号变逗号**：冻结 B 第 9 行原文“函数 f 是连续的；其中”，MD 75 / JSON ex41 第一行写成“函数 f 是连续的，其中”。同一次比对对该疑点作局部原像素核验 `[830,1095,1230,1175]`（3 倍、仅内存），源为上下两笔的分号，不是逗号。需忠实保留原标点；不需改数学。
2. **p16 “求极限：”栏目归属**：MD 43–44 / JSON 第 3 块是 `p`；实际源中它位于“习题*”之后，指令性地统领题 32–39，而不是 77 的理论正文。应以 exercise heading 归属保存，不能当正文段丢掉练习任务绑定。此项按 cap1 对象语义报告，未运行 assemble。
3. **p16 上抬星的表达**：MD 41 的“习题*”和 MD 80 的“78*”保留了字符，但均是普通文本 `*`，未记录其实际升高位置；原图两星上抬。需要保留这项字形事实，不能把普通基线星宣称为精确原版排版。没有替作者改稿。
4. **p18 下标字母体系未决**：MD 54/55/57/59 使用西里尔 `г`（U+0433，五次），独立原图冻结只有 r 形轮廓及不确定性，尚不能支持“已独立确认是 г”的无条件字形 PASS。原数学/角度关系不受此记录影响；保留未决，不以数学或字源猜测指定替换为 r。

### 审查记录纠正和顺序限制

- 冻结 B 对题 40 后一个点初记为 $x$。MD 后同一次差异核验的局部源像素 `[960,940,1450,1010]`（3 倍、仅内存）明确显示很小的 **0**，实际为 $x_0\in D(\mathrm{ctg})$；作者 MD 71 正确，不报添字缺陷。
- 冻结 C 第 18 行初记“数值函数，但是”；局部源像素 `[1080,2180,1510,2250]`（3 倍、仅内存）显示实际为 **句点** 后“但是”。作者 MD 63 的半角 `.` 是合法规范化，正确，不报句读缺陷。
- 两项是审查者的初读误判，原冻结不静默覆盖。本次完整原页和正式 crop 均先于 MD，但这两处最终辨字以及题 41 分号的针对性确认发生于 MD 后；不能把所有最终字形都宣称为 MD 前已无误冻结。没有重作整页内容审查或读取作者 notes 解决这些点。

### 逐页对照

| 页 | 独立原行数 | 当前块/数学/边界结果 |
|---|---|---|
| 15 | 22 | 8 块，正文数学与冻结 A 一致。MD 38 的两个 `↵` 准确保留三行估计链；末极限商式完整为一行。p open 接 p16 cont 正确。**内容 PASS**，不据此放行计数。 |
| 16 | 20 | 18 块；32–39 用 samerow 保存三排；cases 恰一 `↵` 保存两分支；题 40 两处 $x_0$ 经上述局部确认都正确。题 41 完整保留作图命令，随后 h3 78 起，末“得到：”open 正确。**内容 revise**，具体为分号、栏目类型及上抬星记录问题。 |
| 17 | 19 | 7 块；前证明 cont、跨两横排估计链恰一 `↵`、三个正文例的全部嵌套分式/乘积完整；“注”p open 在 `函` 结束。MD 的句点经局部确认正确。**内容 PASS**。 |
| 18 | 23 | 6 块；“注”cont 闭合、公式 (2)/(3)、圆圈、$\pi/180$、$\sin'(0)$ 和末式 l/l/x 三个极限下标完整；图题 samerow 与实际相符，正文图 4 清单 PASS。除下标字母体系仍未决外，正文数学/边界吻合；**不能给无条件字形 PASS**。 |

### 对照快照 SHA-256

持久页根为 `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`：

| 页 | page.md | page.json |
|---|---|---|
| 0015 | `a5123a028f62970f28b668539fa6149c31f2586debf5e064d1b6bf589f5d794f` | `596c4a1b542e1329cd0fbf153b23f216b34ec01951adb731af4adeb03d06cd4d` |
| 0016 | `7f0d4bb55e550e1641fe194f9dee76b0710d7d5aedb41fce712c064299c1c62c` | `8585950494e28f8c3d624156787be98e6f9348825378615b7b3ee991c5c29934` |
| 0017 | `d2569e2f0e6dacfae3fcb5bc2c38662eab545b73feb4dc18c47d5f7cf136479c` | `c05fe495ec7b54ece3c4dfca21bc42b8770e41f60659eebd4ed04fe6360aa023` |
| 0018 | `3e445ed08343e7dcb9e6438cbbb00aa7eda78037b707de512c75bf575a3afa2f` | `fd45ad5ff3aa0cdc3e4fc8e1f0d01d7e35ea8e11b2d0474d1a6adc4706afeee4` |

## 最后读取 audit / 作者 notes

以上独立冻结和一次正文对照完成后，才读取四份 audit、作者 handoff 和 prepare 的 layout。前文“尚未读”是各冻结点的历史状态，不代表最终状态。没有重开完整原图或重做内容审查；恢复后只核对下列文件的 SHA-256，全部与既有对照快照相同。

| 页 | 真实独立行数 | 实际 audit 机器/块体 | audit SHA-256 |
|---|---|---|---|
| 0015 | 22 | **FAIL 24/22** | `cee15297a05aacad5ba0bcb486d248ee3e19e044230ab6e9197b130ff2205173` |
| 0016 | 20 | **FAIL 23/20** | `0e61aaaca54e1f8bbbc2960977d46c2a28cea7cafe966cb6dbd26730c351fb37` |
| 0017 | 19 | **FAIL 20/19** | `adeee961db3e72b0dd728a7c1541d3b478cb5b4c6a597837e2bd2722f37665cb` |
| 0018 | 23 | **FAIL 24/23** | `1e0e48bee563adb133bb93b4e5ccbe3f4ec81f211f0944e69de7e71f6aef1120` |

- 四份 audit 的 normalizations、unknown_chars、katex_warnings、count_exclusions 均为空，errata 为 0；每份保留实际 count-error，未 rerun、修计数或加 exclusions。空 warning 不是独立内容正确性的替代证据。
- 作者 handoff：`.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p15-p18-author.md`，SHA-256 `6cd2be318d2e3a97b1273101a57df72c286fc03bab338b2638d7c970dc7e1260`。它记录真实四次失败及 p18 下标的不确定性，列出的 PNG/MD/JSON/audit/图 4 哈希与本审查快照相符。作者选择 `г` 不是独立字符体系证明，不解除未决。

### 具体源行 / layout 诊断

这些诊断来自已冻结真实横排与随后读取的实际 layout，不以机器行数反推正文。

| 页 | 具体诊断 | layout SHA-256 |
|---|---|---|
| 0015 | 实际第 14 行的极限被拆为 `[1438,1474]`、`[1492,1506]` 两带；实际第 20–21 行“于是”及高极限商式被记为 `[2016,2085]`、`[2086,2155]`、`[2156,2225]` 三带。两处合计多 2。此页底边未计入，不归咎于扫描底噪。 | `f46f916975450338d5fa463b039d281ed2d5fa5b1572c9e8300b563fa45a54a9` |
| 0016 | 三条并排求极限横排分别被拆为 `[540,585]` / `[586,630]`、`[677,727]` / `[728,779]`、`[803,859]` / `[860,916]`，合计多 3。cases 两分支实际对应 `[1209,1289]`、`[1290,1370]`，没有多算，不把失败归咎于 cases 或底噪。 | `93dfdbcd477649c6660995e6d5ad2ab3372754c49add4993ca7ff9834394e173` |
| 0017 | 前 19 带对应真实 19 横排；另有 `[2491,2508]` 底边带，位于 folio `[2286,2312]` 下方，对应多 1。 | `df0fbb5683c531a0d0a30804b53042eee9b814c0edbf186a4144cc7d54ae2f68` |
| 0018 | prepare layout 含图带共 26 带；folio `[2292,2319]` 下方另有底边 `[2478,2497]`。audit 遮图后为 24，独立文字为 23；底噪是实际可见的候选原因，但未独立重数遮图副本，不宣称已证明它是唯一原因。 | `f7db57a0aea76ba42c5b9917ca4c4e335d6d465ec07a4c1a0c350ce1be64c0d7` |

## 最终限定结论

- **不通过整批放行**：四份 count FAIL 保留；p16 有上述具体内容/对象/排版 findings；p18 几何正弦下标字符体系未决。p15/p17 内容 PASS 和图 4 crop PASS 不替代这些失败。
- 真实 folio 为 9/10/11/12，偏移 +6；边界是 p15 proof open → p16 cont 闭合，p16 proof open → p17 cont 闭合，p17 “函” → p18 “数”正文注续接闭合。实际 78* 标题在 p16，不是 p17；p18 定理 2 证明闭合不等于单元 78 完成。
- 此次只做一轮独立 content/crop review；未改任何 source、图、audit、tool 或 7–14 index，未 finalize/assemble/render，未读取答案或 choices。本限定 source review 已完成并停止；后续 n76 Stage2 是另一个已获授权的只读选择题任务，不把其读取计入本 source 审查。

## 15–18 Affected-only 修复复核

父方授权复用上述冻结源审，只核对当前局部修复与实际finalize产物。没有重开任何原整页或图4、没有再作源求解、没有运行门禁/计数器/布局工具或检查其代码。首次拒绝、原始行数和字形未决均保留在上文；本段给新快照限定结论。

### 比较基线及访问限制

只用结构化diff输出变化，未输出新旧源全文。各基线三文件实测SHA逐项等于上文首次表，确认不是混用其它教材或未审快照：

- 0015：`tmp/10c-p15-before-limit-row-finalize/`。
- 0016：用户给的`10c-p16-before-source-restoration`实际不存在；定向文件名检索找到`tmp/10c-p16-before-source-repair/`，其三文件哈希全部等于首次0016快照。
- 0017：`tmp/10c-p17-before-bottom-exclusion/`。
- 0018：`tmp/10c-p18-before-bottom-exclusion/`。

先完成15/16，再比较17/18。只读本报告、对应before/current三文件及原PNG/图4的哈希；未读新答案/选择题/modern/工具诊断或源全文。一次文件名检索输出过宽，只有路径名，没有读取这些无关文件内容；随即限定10c15–18路径。

### 0015／0016：PASS，可复用完整77源范围

**0015：**

- page.md与page.json逐字节等于首次源审稿；全部meta/source/render、8块文本、数学、↵、open/cont及行数不变。
- audit只有lines_printed 24→22以及原行数error移除；lines_md=22、figures空、normalizations/unknown_chars/katex_warnings/count_exclusions/errata及其它字段全部不变。
- 当前22/22、errors空，是读取父方实际finalize产物，不是本审查执行或证明新counter。复用独立22行源观察，未新增排除、虚构行或修改数学。

**0016：**

- MD正文及JSON只有此前三个明确finding对应修复：习题及78单元的两枚星改为数学上标`^{*}`；“求极限：”块kind p→exhead；ex41第一行逗号恢复原分号“连续的；其中”。新增一条notes记录这些源事实。
- JSON blocks[1].lines[0]、blocks[2].kind、blocks[12].lines[0]、blocks[13].lines[0]精确对应上述变化。其它文本、各个lim目标角、sin/tg/ctg、两个x₀、cases两分支及图象任务、全部samerow、open/cont、源码身份与数值未变。
- audit只有lines_printed 23→20、原计数errors移除；lines_md20，其它字段无变化，仍没有count_exclusions。现20/20，errors空。
- 原三个内容/对象/位置finding已全部消除；源习题32–41、78起始边界和p15→p16证明闭合均复用原独立审，不自行assemble或宣称现代单元ready。

两页受影响范围 **PASS**。此限定审批支持父方用已另获批准的7–14加15/16处理完整77源范围；本审查没有审当前book索引或执行装订，不宣称索引已更新。

### 0017／0018：计数修复范围PASS，18字符体系限制不变

- 两页MD正文逐字节不变；JSON全部sourceblocks、数学、open/cont、图题samerow、fig4 bbox和source/render字段完全不变。
- 唯一metadata变化是各一条说明及单一kind=`scan-artifact`的count_exclusions，box均`[0,2452,1695,128]`。理由仅绑定页脚结束后底部扫描边界，不覆盖正文/公式/图题/folio或图4。
- 0017首次独立layout观察：folio到2312，额外带2491–2508；0018首次独立观察：folio到2319，候选底边2478–2497。新增半开范围y2452–2579位于两页脚下方，与旧冻结/诊断事实一致；本轮不再看原图或重数遮图副本。父方实际audit移除一个额外行给出19/19、23/23，不把未跑计数说成本审查新验证。
- audit分别只有lines_printed20→19、24→23；加入与meta完全相同排除及reason；原errors移除。lines_md/figure审计box/from/components、其它所有字段不变。
- fig4实际哈希仍`4bd4798c87397d795ad030e69c3f59dd13c3ef079a7ce5ea92b9af822d13cd71`，完整原裁图PASS复用，不再次打开。
- 0017已知阻塞解除，源内容 **PASS**；0018计数/metadata受影响范围 **PASS**，但五处几何正弦下标仍原`г`、未获得新的字符体系证据，**不得无条件字形PASS**。保留原“r形/г体系未决”，不更换字母、不改弧度制源句、不改边界。

### 当前SHA256

四张原PNG实测哈希仍逐项等于上文冻结A–D，图4亦相同；没有原像素漂移。

| 文件 | 当前SHA256 |
| --- | --- |
|0015/page.md|`a5123a028f62970f28b668539fa6149c31f2586debf5e064d1b6bf589f5d794f`|
|0015/page.json|`596c4a1b542e1329cd0fbf153b23f216b34ec01951adb731af4adeb03d06cd4d`|
|0015/audit.json|`6c3b0de904551598cf75e4816e802792cfb4e685c84edfcb7d771303bc78f676`|
|0016/page.md|`8c347880dbf06592a7cf73b2858488ba4ae4c7698812284983e8562e9330bdb5`|
|0016/page.json|`5b6a03f70be8c2532ddb339ea667e7acd02b0ed585f630953beb67b553b93c96`|
|0016/audit.json|`222d6669be32f8d889b0b2f40c26a5cb6d12f8ee3ea6717b50e23b71032c69a7`|
|0017/page.md|`fd4611a3e4a67e8366cd9684111d9b6f7df41ce4f757675abbef2148001ce233`|
|0017/page.json|`be054683cc0c56a115ac055d1547d0ec5b4bf412b94624a001fd3a1459f00b6f`|
|0017/audit.json|`65599347013b2dbad623121ffe8d027c323b6f55db033e494ad440f65664b319`|
|0018/page.md|`7758d8adf635da73ebff18edb2d8b56a2165b6fcd35d432af6084228083f3939`|
|0018/page.json|`209d45c6885c2d1ba017246e242ddf1f470db8f6ebc524a799f8f023a9e0ca98`|
|0018/audit.json|`52ecba40a1091e5f45ba8c05c982a1aaea97f7785e521e1abac605eb8e301515`|

本次affected-only复核完成。15/16明确PASS，17PASS，18计数修复PASS而字形体系限定保留；不是无条件整批全字形批准。只追加本报告，无源/工具/index改动、门禁重跑、DB/服务/Git/浏览器。

## 2026-11-16 p18 note／绑定极窄复核

**限定PASS：只批准追加未决说明及当前文件绑定，不是glyph resolved。** 复用本报告唯一完整源审、冻结D/E及既有affected-only结论。基线为 `tmp/source-before-notation-metadata/10c/0018/{page.md,page.json,audit.json}`，三份原字节hash逐一等于上段0018绑定；追加前本报告SHA-256为 `bcef05b07d883cb08130bb30e64b1e589eb8747e6a00e67784289f1232cd6f1a`。未重看整页、局部图或fig04，未重计、测试、finalize或assemble。

唯一差异是MD frontmatter notes及JSON `meta.notes[4]` 追加同一条说明：五处下标为r样轮廓，暂存U+0433，U+0072/U+0433体系仍未决，不是已独立确认的西里尔字母；保留原转录编码和完整数学。旧四条notes全部保留，其余全部metadata、count_exclusions、source/render及blocks deep-equal；MD正文原字节完全相同。五处U+0433仍恰为五处，没有替换成r或ang，`meta.errata=[]`、audit errata=0，没有新增数学erratum。

新增note关于现代采用ang文字下标的表述只记录未来可明确命名角度函数角色的方案，不是声称恢复源字母体系。本次未读取或批准未来现代正文、答案或定点diag；父方所述Confucius定点diag仍UNRESOLVED，不据新增note解除未决，也不借此作数学errata。原审初读误判及MD后局部辨字顺序限制全部保留。

audit与before逐字节相同，当前 `lines_printed=23`、`lines_md=23`、`errors=[]`，复用独立冻结23横排。这里只读取父方实际finalize产物，不冒称执行新计行验证。fig04的完整audit对象、JSON图块及bbox `[902,1144,426,468]` 全部未变。

| 0018文件 | before SHA-256 | current SHA-256 |
|---|---|---|
| `page.md` | `7758d8adf635da73ebff18edb2d8b56a2165b6fcd35d432af6084228083f3939` | `c4fe5f7078b32a62fe197a47252bf1132287b1e732b3d7db3180dfb5e6f35599` |
| `page.json` | `209d45c6885c2d1ba017246e242ddf1f470db8f6ebc524a799f8f023a9e0ca98` | `9e5973966bd535c110e0ccdd600484ec8c7e596ea8bca06dd56ad8c85f48fff6` |
| `audit.json` | `52ecba40a1091e5f45ba8c05c982a1aaea97f7785e521e1abac605eb8e301515` | `52ecba40a1091e5f45ba8c05c982a1aaea97f7785e521e1abac605eb8e301515` |

原 `page.png` SHA-256仍为 `7669a7c5f7f482435dc8178a34a0930a29b2d50d7b2f5e695da1096f980f8bfc`，当前meta.render仍精确匹配；fig04原crop仍为 `4bd4798c87397d795ad030e69c3f59dd13c3ef079a7ce5ea92b9af822d13cd71`。只读diff中MD/JSON exit1对应上述唯一note，audit exit0；结构化精确差异及哈希比较exit0，无额外差异。

本轮仅追加本报告，保留旧拒绝、失败及未决记录；不扩大到无条件源字形PASS、未来现代正文或整单元批准。未改源/图/工具/metadata/index，无DB、服务、Git、浏览器或其他chat操作。到此停止。
