# STEMROBIN-184 独立转录与计行审查 002

日期：2026-11-15。仅审查原文，不解题。工作目录：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。

## 结论

1. **9c 0008-0011 全页核查发现两处脚注文字差异**：0008 的“词”被写成“问题”；0011 擅加“著名的”。其余标题、正文、公式、题号和续页边界未发现内容差异。这四页原图均无插图实体，持久页的空 figures 列表正确。
2. **9c 0010 实际 26 行，当前计数器 25 行不是转录缺行**。y=1541-1753 的三条文字/公式行被降为两条；短行“下，有”的墨量不足整带最大墨量的 12%，触发了错误的三行降两行判据。
3. **review001 的 6-8g 八处文字修正和图 6 samerow 均已确认落实**。0011、0014、0015、0016 当前人工/块体/计数一致；另实际打开 0013 原图，确认已登记的左扫描边排除。三项排除均不遮正文、公式、图内标注或页码。
4. 未修改任何源转录、工具、生产文件或其他作者的文件。只以 apply_patch 新建本报告；另外产生下列获准的临时图像诊断。没有 finalize、assemble、答案/选择题/历史测试、数据库、服务、网络、工单更新、新会话或提交。

## 方法与口径

- 先读 `.claude/skills/ld-s10y-lesson/SKILL.md` 的 cap1/行数契约，再按 0008、0009、0010、0011 顺序，每次仅打开一张完整 `page.grid.png`，独立读完原图后才读该页 `page.md`。不是以作者描述、OCR 或计数结果代替视觉阅读。
- 全页包括标题、行内/独立公式、脚注、页码、题号、图题/图框库存和续页。9c 原尺寸 1695 x 2381；6-8g 原尺寸 1441 x 2079。
- 人工行数包含教学脚注和页码，不含扫描边、分隔横线或插图内部文字；同排图题只计一次。既定字符/单位排版规范化不冒充内容差异；非严格不等号的非严格性保留。
- 6-8g 是 review001 所列修正的定向再确认，不声称本轮重新审查该书全部 0011-0018。
- 诊断读取现有 `blocks`/`layout`，遮现有 fig 框并应用已登记 count_exclusions 后计行。唯一候选判据干预发生在进程内的局部 strong_rows 列表，不写代码或源像素；未运行测试套件。

## 9c 全页审查

| 物理/印刷页 | 独立人工 | 当前块体 | 当前计数/audit | 内容差异 |
| --- | ---: | ---: | ---: | --- |
| 0008 / 1 | 21 | 21 | 21 | 脚注 1 处 |
| 0009 / 2 | 26 | 26 | 26 | 未发现 |
| 0010 / 3 | 26 | 26 | 25 | 未发现；计行缺陷见下 |
| 0011 / 4 | 23 | 23 | 23 | 脚注 1 处 |

### 0008 / 印刷 1

原图：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0008/page.grid.png`。

**[P2] 脚注第二行多/错字。** [page.md:71](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0008/page.md:71) 写作：

> “和”这个问题里，这样理解“和”，在数学中有时有用．

实际原图为：

> “和”这个词里，这样理解“和”，在数学中有时有用．

最小建议仅把“问题”改为“词”，保持此印刷行及其他脚注不变。原图脚注第二行约 y=2087-2135，已从不带网格的实际 page.png 裁下 x=300-1480、y=2010-2150 独立放大确认，证据：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0008-footnote.png`。

逐行账：1 章标题；2 节标题；3 单元标题；4-6 归纳法/奇数引入；7-11 五条求和例式；12-15 推测说明；16 一般求和式；17 “成立”；18 页末“由此可见……”；19-20 脚注；21 页码。章标题横线及脚注横线不是文字。

其余文字核对包括“加数的个数的平方”“对于所有自然数 n”、五条等式的各加数/结果/平方，以及第一条 `1=1=1^2`，均忠实。页末 `p open` 停在“而”，0009 的 `p cont` 接“这个假设……”，正确。脚注透明但保留，不能误接成该续段的文字。

### 0009 / 印刷 2

原图：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0009/page.grid.png`。

未发现全文差异。逐一核对 `P(x)=x^2+x+41`；P(1)..P(5) 的 43/47/53/61/71；P(0)、P(-1)..P(-4) 的 41/41/43/47/53；`P(41)=41^2+41+41=41×43`；“不完全归纳法”“完全归纳法”两段及结尾“举几个应用……”。

逐行账：1 上页续文；2-3 第二例引入；4 多项式；5 “中的 x，得到”；6-7 正数代入结果；8-11 非正数代入说明；12-13 假设；14 P(41) 反例式；15-19 不完全归纳法说明；20-21 提出/推翻假设；22-24 完全归纳法说明；25 引出例子；26 页码。

无图、图题或脚注。右边 `[1550,640,120,260]` 与底边 `[0,2300,1695,81]` 两项 scan-artifact 可见均在正文外，页码保留。开头承接 0008；页末完整，不应加 open。

### 0010 / 印刷 3

原图：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0010/page.grid.png`。

未发现正文或公式内容差异。核对例 1 的 `2≤n≤15`、质数清单 2/3/5/7/11/13、两质数乘积清单 4/6/9/10/14/15、三质数乘积 8/12；例 2 的非严格三角不等式、同号等式、异号两差 `|a|-|b|` 与 `|b|-|a|`、严格不等式、零值第三种情况均完整。非严格不等号的源印刷斜等号已放大核对，未丢成严格号。

逐行账：1-2 例 1 题面；3-5 分类证明；6 例 2 引入；7 不等式及编号；8 任意 a/b；9-10 验证说明；11-12 同号情况；13 等式；14 非严格说明；15-19 异号说明；20 严格不等式；21 “即不等式（1）也成立”；22-24 零值情况；25 总结续文；26 页码。无图、图题或教学脚注。

[page.md:81](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0010/page.md:81)、82、85 正确保留人工第 18-20 行；不得删“下，有”、合并这两条正文印刷行、补 ↵ 或修改公式去迎合计数。页末 `p open` 停在“不等”，0011 的 `p cont` 接“式（1）都成立”，正确。

### 0011 / 印刷 4

原图：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0011/page.grid.png`。

**[P2] 教学脚注擅加修饰语。** [page.md:103](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0011/page.md:103) 写作：

> 楚．（这个问题就是著名的哥德巴赫猜想．——译者注）

原图为：

> 楚．（这个问题就是哥德巴赫猜想．——译者注）

最小建议仅删除“著名的”，不改变脚注行数或归属。已裁下不带网格的实际源图 x=210-1385、y=2020-2150 确認，证据：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0011-footnote.png`。

逐行账：1 上页续文；2 习题标题；3-4 题 1；5-6 题 2；7 单元 2 标题；8 重新考虑等式；9 求和式及编号；10-13 A(n)/A(1)..A(5) 说明；14 A(5) 前提；15-16 推得 A(6) 的两行式；17 “就是说……”；18-19 总结推出关系；20 页末符号引入；21-22 教学脚注；23 页码。

两题题号、题 1 的大于 2/小于 40、题 2 的 `a>0`/`x∈Z`/`a^x>0`、`(2n-1)`、`5^2+11=5^2+2×5+1`、`(5+1)^2=6^2` 和推出符号均保留。脚注 `foot note owner-ex 1` 与题 1 的星号关联正确。右/底两项 scan-artifact 不遮题目、标题、脚注或页码。页末引号内语句未完，`p open` 正确；本轮不对未打开的 0012 内容作全文结论。

## 0010 计行缺陷的精确原因

实际执行（没有 finalize）：

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python \
  .intentfold/tickets/STEMROBIN-184/tmp/inspect_lines.py 9c 10
```

实际打开输出 `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0010/counted-lines.png`。该图第 18 框 y=1541-1647、第 19 框 y=1648-1753，合起来吞了三条实际印刷行：

| 人工行 | 原图实际内容 | 计数副本低阈值行带，端点包含 |
| --- | --- | --- |
| 18 | 是正的，所以它们的差小于它们的和．因此，在第二种情况 | 1541-1599 |
| 19 | 下，有 | 1620-1673 |
| 20 | `|a+b|<|a|+|b|`， | 1705-1753 |

直接源图局部（不是计行框或作者描述）：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0010-three-rows.png`。

只读追踪 [layout.py:228](/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py:228) 至 [layout.py:329](/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py:329) 得到：

1. 当前 `line_h=54`、`glyph_h=45`、`merge_gap=18`。行片段/补充连通域包括 `(1541,1599)`、`(1555,1600)`、`(1618,1661)`、`(1620,1673)`、`(1644,1688)`、`(1705,1753)`。
2. `(1541,1600)` 到短行起点 1618 的距离为 18，达到合并条件。左边独立污迹实际连通域 `[5,1644,29,45]`（706 墨像素）被补充窄字形逻辑视作一个候选，延长到 1688；到公式起点 1705 距离 17，又达到合并条件。最终 `(1541,1753)` 高 213。
3. `typical_h=54`、`typical_gap=27`、`pitch=81`；几何估计 `round((213+27)/81)=3`，本来正确。
4. `core.max()=530`，强投影阈值为 `0.12*530=63.6`。短行 y=1620-1673 的逐行墨量最大只有 **56**，虽有完整的“下”“有”两字，也全部低于阈值。过滤后 `strong_rows=[(1544,1597),(1713,1743)]`。
5. 328-329 的 `count == 3 and len(strong_rows) == 2` 把正确的 3 降成 2。`fraction_starts` 为空；这个完整三行区域的 `_single_fraction_row(...,54)` 为 False，不是分子/分母或单行分式。

**最小建议：仅收紧“三行降两行”的证据条件。** 在该局部判据复用 `_row_fragments` 的低阈值行带，要求确实没有第三个正常字高的独立行片段，才允许降成两行；仍保留现有单行分式保护。不能仅因第三行相对整页长行墨量小就删去它。

建议性伪代码（未应用到工具）：

```python
glyph_rows = [
    (x, y)
    for x, y in _row_fragments(ink[a:b + 1], content_w)
    if y - x + 1 >= 0.6 * glyph_h
]
if count == 3 and len(strong_rows) == 2 and len(glyph_rows) < 3:
    count = 2
```

**独立验证而非期望数回填：** 在 trace 到现有第 328 行时，仅当局部 `_row_fragments` 找到三个正常字高片段，给内存 strong_rows 补入该已有独立片段证据，以让原来的降两行条件失效；没有设置人工期望行数，也没有写工具或遮字。本页证据来自 `(1541,1599)`、`(1620,1673)`、`(1705,1753)`，高度分别 59/54/49，均超过 `0.6*45=27`。实测计数恢复 26。现有等距分框为 1541-1611、1612-1682、1683-1753，这只是工具分框，不冒充精确字形边界。

同一次只读诊断中，9c 0008/0009/0011 仍为 21/26/23，6-8g 0011/0013/0014/0015/0016 仍为 22/16/25/25/25。这是所审源页的有限诊断证据，不是多行方程组和单行嵌套分式的广泛回归验收；主作者实际改工具后仍须按技能契约验证这些反例。本任务不读取或运行历史测试。

**排除法记录：** 只在内存计数副本加左边非文字污迹 `[0,1635,60,65]`，本页仍为 25（局部成为 `(1541,1661)`、`(1705,1753)`）。所以不把新增扫描排除冒充本缺陷的完整修正，更不使用遮正文/公式、行数覆盖、补空行或伪造 ↵。

## 6-8g 定向再确认

每页实际单独打开同路径 `page.grid.png`，再比当前 `page.md`；8 项均与原图及 review001 对齐：

| 页 | 当前 Markdown 行 | 已确认修正 | 源图位置/直接证据 |
| --- | ---: | --- | --- |
| 0011 | 50 | `1. 什么是几何图形？` 保留问号 | y=1155-1204，“形”后可见问号 |
| 0011 | 60 | `我们来看看半径为` 补回第二个“看” | y=1441-1487，原文两个“看” |
| 0011 | 66 | `任意一点` 补回“一” | y=1719-1762 |
| 0014 | 84 | `小圆圈` 补回“圆” | 脚注 y=1810-1860 |
| 0015 | 56 | `$|OX|\ge r_1$` 非严格号 | y=1160-1220，符号下方有独立等号笔画 |
| 0015 | 51 | `而又不相交两个不同的轨道运行？` 去掉擅加“的” | y=950-1010，保留原书措辞 |
| 0015 | 70 | `所有其他的概念都要定义．` 恢复原句 | y=1765-1835 |
| 0016 | 76 | `这两个角的交是什么图形？` 恢复问号 | y=861-911；下一行另问“它们的并呢？” |

当前 0011 的导语 `p preface` 同时已存在，不列为新增问题。

**图 6 同排确认：** [page.md:93](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0016/page.md:93) 是 `<!-- cap 图 6 samerow -->`。原图 y=1276-1321 同一横排左边为“给出这种图形的定义．”，右边为“图 6”。图框 `[973,1084,250,188]` 包含带斜线的透镜区域、左右点与 O1/O2 标注，不吞正文或图题；图是一个原书整体，未擅拆。仅一次计行后块体为 25，与独立人工数和当前计数相同。

**注册排除再次确认：**

| 页/类型 | 已登记 box | 原图依据与安全边界 | 当前人工/块体/计数 |
| --- | --- | --- | --- |
| 0013 scan-artifact | `[0,0,50,2079]` | 实际另打开整页原图：左黑边及凸起在 x<50；正文/页码与图 4、5 内容均在右方 | 16/16/16 |
| 0014 separator-rule | `[150,1776,450,14]` | 仅脚注上方薄横线；第 6 题、完整“小圆圈”脚注、页码都在框外 | 25/25/25 |
| 0016 separator-rule | `[160,1540,1110,30]` | 第 17 题末行和“3. 量和数”之间薄横线；两条文字行都未遮 | 25/25/25 |

0011 和 0015 无新增登记排除，当前分别为 22/22/22、25/25/25。以上 audit 的 errors 均为空，计数也独立实际重算过；不是只读 audit 宣告通过。

## 审查快照 SHA-256

均以 `shasum -a 256` 对实际文件计算，不抄 frontmatter 当作计算；源 page.png 的实算哈希与各页 render.sha256 一致。6-8g 五张网格图哈希也逐一等于 review001 所读原图，修正没有替换源图。

绝对根：

- M = `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/`
- P = `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/`

表中 `<book>/<page>` 表示 M 或 P 下的 `<book>/pages/<page>/`。

| book/page | M/page.md | P/page.png | P/page.grid.png |
| --- | --- | --- | --- |
| 9c/0008 | `82d905a4d245e8ac8a1c5fc81d89afdb45cd233b9b5ec8e2614728609ffc87d9` | `4ccd5b6581f3ae8692d5ee40cbce18897f82d7141b0fb75f98c87093124bbf3f` | `6f2de880dae8946cfb0e0d1286ef570e9477d58034af89d3f7d95e112077d9e0` |
| 9c/0009 | `7f097c709935fbfee3c9175074b4547b4cdbe1b3a03429c7ee91cc6f83af906a` | `2d5a6ee8b8f4fc1dced06b370e711a59a4333ee184c0d40200660e31dccd0717` | `c7db39b649b8aacdeae8a28fcf732444c83a73e8a24111b8287e7b438a5f23ba` |
| 9c/0010 | `4506493b6b33ec3ac9965ddea3c39aecfe14e6bfa82adbba4444f814004bf14f` | `86f7e119bad2a333aaae3406c19bbd5151a16bd541e2cd63577416efd317aa36` | `85da1e7c877b7afb175550c859ea4854de3b53de188b7b1659fa09dffbfb9d15` |
| 9c/0011 | `20a997173626b1cd11839980dd7705f618dbfab870d6b8db6fee9a160a42940b` | `82b98d779776c640b50475f46e3292870a5f84c2895a30a3b4ce301b0312f227` | `cffc41e60ede4b20c882a96b64657b89681500dca81186ad0bbdc707d9f2ecfd` |
| 6-8g/0011 | `bc26d1aecb66238e8e0beb845c9fab09cfaec4312e4d67edc83f16b9de3f5bad` | `b047839243b88766cd3469662bc120e19dfdc4a6b65554a24bd642210dacefcd` | `6ca36543ff7bb228b138ca902773f3feaa63797b16b0c9ef1ef72bbaefa85a53` |
| 6-8g/0013 | `a4901f08bdce73c07f141097581775388ceed1e23025ac0fd6428b96bb883a90` | `addbe7a177fdca16ee55dea7e01886adfcfb071e6b2c6f53a2f001aed779cced` | `96dfb1a336b4016b2074b56fda15489a6ef592eb4acbe0750957186775cd4e49` |
| 6-8g/0014 | `504be5b6c57afda59c2ca88f09e6ab963e58f77e74ff6cacddee44bd3eb51cf3` | `517c442853b44218282fd5f040ef6628fb4f47aadaeaa887e0cbba02d339091d` | `676fd185826b8e2b0b9d45ac012350ec2946f122fe29c39b7bbb1278504fd539` |
| 6-8g/0015 | `75722b71a5d0b3b9355f938b327912d9b599409fbd2681cfc65e1bb405a4a654` | `94754e9b5afd5ec2330d45e75bcb4ecb452833df3dd05f30b094e0e105eb7ba0` | `2d655e536025f81199b217b8c3e2344c7c6dd3e2cf66b0cc3c65983b86ce4e27` |
| 6-8g/0016 | `478da2ecea8f69cce95cc0229f5a60e57fab387d5c1cdb9444dfb37ce4d0547c` | `c5af4ce61beb1078100ccf4b60b876c3dad976fa7f3bf91a64a5ec0493e5ca32` | `e3f5fa27bb9e3fffda2c64d1c24299b074682c64b1a1e80bab66a534b36dc326` |

| book/page | M/page.json | M/audit.json |
| --- | --- | --- |
| 9c/0008 | `0da77c0b745a264bf6089a5d69e5f1065257638c4b5df66ea4e3419f67039f10` | `766c14af3d9f2eb9fa88e542926e6792ed7abe01cdf6315b3a9debbcbcd3c0c8` |
| 9c/0009 | `fabf3bb51844cebe1236c745349080e438eefc8a1321579e447ee4d42e994245` | `8e650c7ffe573d664e0262071bfb7a951acb37380811371eb62551b989cf5c84` |
| 9c/0010 | `714e927419f62549c1cff0e3e1bf350768ae8b07e69234bdfbebac8aef7eec66` | `a2444c88eea2add17797e4bfcd3b2207fc7ff7773bd2a94bda40d60911de8c83` |
| 9c/0011 | `0dcf38b6c3c2aedfa67238302f3731da94e0719e5309875262d8f10f5c598f81` | `d5528a4123b89626f3901c46d92f1c03eda0364cd5d1ca179d4446f61544c308` |
| 6-8g/0011 | `6613cac68fddec9371580ea38fea7a0dce8331f3d50203904265cad5926471c6` | `166f4fc9dcd449dd359787004a92de848414a37ccf3333e0de59f1e138d45cd7` |
| 6-8g/0013 | `78c1ad3ddb025f2c3861e46f5ffd25110342e5f2c9a72c4ca5f82c0f4db9b221` | `2cf332221c60e773329b2b9a39b477ec5c7ff66f734c17b23f973078aef47ce9` |
| 6-8g/0014 | `a0f8ccb485ab426a4ec17a55b0296afb7e413d0c7b3ff2287ae8197ee53d85f9` | `fa61af0c16d98f1a54d27163b98308db90092f2125e1ceb30d487a7eb30b836d` |
| 6-8g/0015 | `2711fc6ae6c1834529f9333c99365eb4c807d13e6625547fcaf70489e3c0160e` | `bced7676d89e9aa16b737ea63f5a70ac3ffbf6924abacef4d14866d34b8f5840` |
| 6-8g/0016 | `bc317c76e31c76208c413b60975d6ebfa01cf0081335211156c1f384c74bb27c` | `604fa968870c4026c25bcfc3fabbc0ebc6b1e1350e78b3510f0f14e031cf1d29` |

诊断依据指纹：

| 绝对路径 | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/transcription-review-001.md` | `4b8bc3e8a3062bf0d4b488092acac7ba73aa9b86427d807df5983b5659f60c77` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/inspect_lines.py` | `6c25f6425de17f0efebe40ddea0a788e9e718813c61cccbc4ba0cf832657b57b` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/SKILL.md` | `4cf89f8448aeeab992340aef218c1a5188ca6880019003c8de567f00e93d456d` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py` | `e2be784eb19dc8d0a1395b97dab75c8bca61a60dae49e4393a0194f5e64414c7` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/blocks.py` | `1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66` |

这些值标识本轮读取快照；并行作者后续改动后必须重新确认，不能把本报告冒充新版本审查。

## 本任务写入路径

唯一手工编辑：

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/transcription-review-002.md`（apply_patch 新建）。

获准的临时诊断图像输出：

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0010/counted-lines.png`（现有 inspect_lines.py 重新生成）。
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0008-footnote.png`。
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0011-footnote.png`。
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0010-inequality.png`。
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0010-three-rows.png`。
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0010-left-blot.png`。

不接管主作者的 modern s3，不撤销或修改开始时已存在的脏工作树改动。

## 更正落实再确认（定向追加）

日期：2026-11-15。本节仅回应主作者修复后的定向复核，前面的发现和哈希保留为修复前历史快照，不代表当前仍有这两处脚注错误。

**两处均已修正，与同一实际源图一致：**

- [9c/0008/page.md:71](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0008/page.md:71) 现为 `“和”这个词里，这样理解“和”，在数学中有时有用．`。重新实际打开原 page.png 的既有脚注裁图，独立确认是“词”，不是“问题”；当前 page.json 的 `foot` / `label: "note"` 块也保存相同修正行。
- [9c/0011/page.md:103](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0011/page.md:103) 现为 `楚．（这个问题就是哥德巴赫猜想．——译者注）`。重新实际打开同源脚注裁图，独立确认没有“著名的”；当前 page.json 的教学脚注块也保存相同行，`owner_exercise: "1"` 未改变。

本次只重新看两处脚注局部，不重复全文源页审查。重新实算 0008/0011 的 page.png 和 page.grid.png 哈希，均与本报告原快照完全相同。重新打开的局部亦未被改写：

| 原源图局部绝对路径 | 当前 SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0008-footnote.png` | `2432a572dabce82596a4390d7f7e8754c284c08cda4a3e401f63a5f2e7d8ad4f` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/review002-9c-p0011-footnote.png` | `119df67aa9528dbee4c982dcaa5d78e4385f801c06b2ac7dfbbc7788b66de22c` |

**收口后的持久结果已观察到：** 三页 page.md、page.json、audit.json 修改时间均为 `2026-11-15 12:17:07 +0000`；0011 的新 page.json 已含修正脚注。当前 audit 如下，不以先前旧 audit 冒充修改后的文字确认：

| 页 | audit.lines_printed | audit.lines_md | audit.errors |
| --- | ---: | ---: | --- |
| 0008 | 21 | 21 | `[]` |
| 0010 | 26 | 26 | `[]` |
| 0011 | 23 | 23 | `[]` |

本次没有运行 finalize、assemble 或计数器。仅只读查看主作者写出的收口产物；文字正确性依据上面的源图局部及当前 md/JSON。当前 layout.py 的静态局部也确有 `glyph_rows` 与 `len(glyph_rows) < 3` 的降两行保护，保留 `core > 0.12 * core.max()` 及原单行分式保护。本次不做新的工具/测试验收。

收口后九个持久文件均重新执行 `shasum -a 256`，绝对根为：

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/`

| 页 | page.md SHA-256 | page.json SHA-256 | audit.json SHA-256 |
| --- | --- | --- | --- |
| 0008 | `fc2bc0e07a909a53be866065030fa096c697773cb97e965ea5482603b14ca2ad` | `77db90882c569581d8e93e9b505b85a0d4d6eaab1f3608b795d2e240233e6f34` | `766c14af3d9f2eb9fa88e542926e6792ed7abe01cdf6315b3a9debbcbcd3c0c8` |
| 0010 | `4506493b6b33ec3ac9965ddea3c39aecfe14e6bfa82adbba4444f814004bf14f` | `714e927419f62549c1cff0e3e1bf350768ae8b07e69234bdfbebac8aef7eec66` | `de2d8bff31e30db22b606f60a661697727bdb68edbc264a2f6f35f1546794fcb` |
| 0011 | `d1eefb157eaff41a69914f04af423fe63b9ce1598a7b45cae808c45eb867e0ae` | `2eb569b2a2fb19a33b483345c9353f6594e2b275bdfb2909f07c38165b0655f4` | `d5528a4123b89626f3901c46d92f1c03eda0364cd5d1ca179d4446f61544c308` |

0008/0011 的 audit 哈希保持旧值是实际实算结果：两处文字修复不改变其行数/审计字段，但 page.md 与 page.json 哈希均已改变。0010 的 md/JSON 保持原值，audit 因 25 恢复为 26 而改变；没有补写源行。

当前 `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py` SHA-256 为 `c28101f9101c0ccd717efdfdeadc48ec36bb8c371fec6be2217eaec7c7d7a6f7`，用于区分修复前工具快照，不声称本轮广泛验证其行为。

本次后续唯一写入是 apply_patch 追加本报告；未生成新诊断文件，未改源转录/JSON/audit/工具，未运行测试或任何共享产物写入命令。
