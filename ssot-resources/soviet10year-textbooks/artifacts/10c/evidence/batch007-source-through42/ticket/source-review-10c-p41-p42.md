# 10c physical41/42 唯一独立 Stage B 源审

日期：2026-11-16。工单 STEMROBIN-184。实际身份：Worker B / Codex，父方既有工单授权下的唯一独立源审者，不是41/42转录作者。只复用先行完整原页冻结并完成本次稿件/裁图比较；不是新的逐题直接人类授权、数学答案审查或现代图批准。

## 限定结论

**41 limited PASS；42 limited PASS。** 当前可辨文字、全部公式因素/归属、实际21/17横排、跨页对象和两个图号的完整裁图相符；未发现确认的漏字、漏公式、错归或缺损。保留下列光学 UNKNOWN 及实际观察顺序局限，不作无条件 whole-gate PASS。不消除40此前机械FAIL，不批准整个83/84/85或任何现代内容。

| physical / printed | 独立先行表外横排，含folio | 当前blocks | 作者首次MD/机器排 | 本次限定判断 |
| --- | ---: | ---: | --- | --- |
| 41 / 35 | 21 | 17 | 21/21，exit0 | 完整题组/起段/开放尾文相符；109左侧字形磨损UNKNOWN保留 |
| 42 / 36 | 17 | 12 | 17/17，exit0 | 完整定理、三同排caption、两个图号三panel、85开放尾文相符；端点/原点细义UNKNOWN保留 |

## 实际顺序与原冻结不覆盖

先行报告 `source-review-10c-p39-p42-source-first.md` 当前最终raw SHA256为 `68cd478a852dab7c538cb4d604c3c18cc0e6108741b109150a2500575cd8788c`。39→40→41→42逐页完整原PNG观察和逐页落盘先于作者Stage B披露。父方早先看到的 `12b871...` 是报告settling时的pre-final观察，不是最终immutable绑定；没有声称保存一份不存在的pre-final副本。最终原冻结本次未编辑。

本次先复用最终冻结41/42的文字、数学、21/17排、图形和边界，再读取当前MD/JSON，逐项比对；之后实际逐张打开全部以下七个现有局部/裁图文件一次，未重开任何完整原页：

- `source-10c-p41-p42-evidence/0041/source-109-variable.png`。
- `source-10c-p41-p42-evidence/0041/source-variables-110-112.png`。
- `source-10c-p41-p42-evidence/0041/source-inverse-variable.png`。
- `source-10c-p41-p42-evidence/0042/source-fig22-region.png`。
- `source-10c-p41-p42-evidence/0042/source-fig23-region.png`。
- `.tmp/ld-s10y-lesson/10c/pages/0042/figures/fig-22.png`。
- `.tmp/ld-s10y-lesson/10c/pages/0042/figures/fig-23.png`。

读稿后另有两处有界原像素辨认，仅以内存Pillow裁图显示，未写新crop、未重扫整页：

| 具体差异 | 原页LTRB范围 | 显示PNG SHA256 |
| --- | --- | --- |
| 定理“某”字 | `[450,610,1120,710]` | `0a5dbe80d9f19fa99c35475fc29972c1265c00506bcc91ade8f5008d38c93a00` |
| 图23а后句点 | `[1110,770,1425,857]` | `e4a0774b55d3a5d7ed540496f13d578b398ed8ce78a5b923fd2c5848c3d712b1` |

这些辨字**在MD披露之后**，不能假称全部字符均原始盲读无误。Sharp加载/定位尝试失败，未安装或改变依赖；改用现有技能Python `-B`/Pillow只作像素显示，不是counter、图renderer或源生成。随后才读当前audit/首次stdout；**作者报告最后读**，不读取其source-first笔记来代替本审者冻结或消疑。

## 原始初读误述及有界更正

1. 原冻结109左右均写x，并曾说明109使用x。现有原字形局部显示右侧明确α，左侧有α形低位环与右尾、上部磨损。当前源稿α/α有像素支持；**左侧损耗仍UNKNOWN**，不能用恒等式真伪消疑。这是本审者初读误述，不是作者改变变量；原冻结保留不覆写。110/111的α及112的x在另一个源局部清楚，当前分别保留。
2. 原冻结逆函数定义曾写 `x_0=g(y_0)`。实际已有源局部清楚显示 `x_0=g(y)`，g中y没有下标0；相邻量词 `y_0` 和其他下标均可见。当前源稿的 `g(y)` 忠实保留；不由定义意图补下标，不在本次制造数学勘误。
3. 原冻结42定理写“函数值的集合是一区间J”，漏述“某”。读稿后上述有界原像素显示“是某一区间J”；当前稿没有漏字，本审者原记录漏字仍如实保留。
4. 原冻结42图23а后记分号；上述有界原像素显示一个基线点及其后“如”。当前句点符合实际；不将初读误述指控为作者标点丢失。
5. 原冻结84标题用全角括号，当前稿用ASCII `(减)`。源只能给出括号字形/语义，不能由光栅断言Unicode码点；不据此造一个内容缺陷。

## 41 内容/对象逐项比较

三个共用题干及所有109–118完整，分别归属证明109–112、化简113–116、计算117–118。109/110的45度加减，111的180/90度和tg/ctg位置，112全部四项及右侧 `tg(2π-x)` 均保留；109变量仅按上述有界字形判断，不以数学值倒推。

113保留y、`3π/2`及三项符号；114保留三个商式、首分子负α、第二项减号、第三项加号以及各自分母。115/116各一个完整长商式，分子/分母函数因素无交换或丢失；116固定角130/320/270与50/220/360均未为整齐结果而改写。117/118的10/8、乘点、π/6、π/3、135/225/315/240/210度分别完整。未补源题面没有的定义域或解答。

114虽有三分式，115/116虽高，均各一实际印刷横排；当前各题一排，不按分式层增加题或印刷行。41实际无figure/table/caption/星号/脚注，稿和audit均无虚造裁图。

118句尾后新84标题及两正文段完整；平方/平方根例子、七/八年级回指、忠实法式区间 `[0,\infty[`、D/E交换等式、双向等价箭头和源 `g(y)` 保留。最后 `p open` 停在“互”，不是补齐后的闭合段。与42 `p cont` “为反函数时”连成原句，folio未被并入正文。

## 42 内容/对象逐项比较

首段完整承接41，保留关于 `y=x` 对称及习题1008–1013的原回指。定理全体条件有定义/连续/上升或下降、值集某一区间J、J上的逆函数g及g连续、两单调分支均完整；“证明超出了中学教科书的范围”没有省略或补一份作者证明。中途“区/间”“如/果”为真实换行，不造新段。

源有图22一个panel及图23а/б两个panel，三个caption共一个印刷横排。当前两个cap blocks（cap22正常，cap23 `samerow`含两caption）保持这个横排，不要求把三个可见caption硬变成三个工具blocks/行。

85是一个两排完整标题，含正弦性质/图象、反正弦和方程 `sin x=a` 的解。正文用闭区间 `[-π,π]`，图24只前向引用，本页未裁一张不存在的图24。源 `sin' x=cos x` 保留一排。末 `p open` 停在“和x”，未从已知驻点推填下页。84在85标题前的源对象边界相符；85仍未闭合。

## 实际裁图判断与限制

| 当前生成crop | audit snapped `[x,y,w,h]` | raw SHA256 | 本次观察 |
| --- | --- | --- | --- |
| fig-22.png | `[156,1002,394,399]` | `445c97cfa431c6c8b3cf1fedfc1cc47be22d43821df64e6be13c5f639e8dbb70` | 一panel完整；x/y轴箭头/尾、0/O形标记、上升曲线和 `y=f(x)`、I/J hatch、投影/端点墨迹均在，无caption或正文混入 |
| fig-23.png | `[593,1003,839,428]` | `6d96cb5f7c20042d94d60d649aa1be4527960b25a18759df6dfa4e7b965ea981` | а/б两panel完整；全部轴/箭头/原点、虚对角线及延伸、两上升/两下降曲线及f/g标签在，无caption或邻文混入 |

图22上右端明确空心形；左下曲线端与短投影墨迹相并，**不能确定空/实端点或每条短连接**，不将初冻“实心点样”升级为闭端事实。0/O形标记身份光学UNKNOWN，notes的“0形字”不等于码点证据。hatch对应I/J区间，不转成二维填区。

图23不补图内未印的 `y=x` 标签，不给精确解析式/镜像坐标，不把粗末端当新命名点或箭头。Cyrillic а/Latin a同形，当前按本书profile枚举 convention，不声称像素可辨码点；б清楚。实际裁图忠实/完整判断不等于现代图数学/视觉审批。

## 当前原始字节与首次记录绑定

当前65文件manifest逐项读取字节SHA/长度核对，**65/65相同，0 mismatch**。两页当前MD/JSON/audit均byte-equal各自 `after-finalize/durable/`；当前原PNG/grid/template/layout均byte-equal各自 `unattempted-before/prepared/`。两个当前crop也与after快照相同。

before-finalize→current的41 MD仅finalize元数据；42另有官方fig bbox从粗框吸附到上述实框及image alt空格规范化。没有数学/正文/caption文字变更。raw snapshots和首次stdout保留，本审者只读不重新运行。

| 绑定对象 | raw SHA256 |
| --- | --- |
| 作者41/42报告，实际最后读取 | `e4ae34ef574184d1eaad1f7e5154344ed8ad58a75fa024811d1f97998de554e1` |
| 65文件manifest | `ba6f0986c3583a4bc915d69298c33312861ad3108e1275da0b64a1ce38774cf8` |
| status.json | `ca127dc7960627eba9b68630e7dcf8fed0d59c6dc58e972b5bbf8fe03d396f58` |
| 41原PNG | `93ef6af360bbf1136ec61fd934426ca4485cd6b6d2cb152520b76b3768a6ed8c` |
| 42原PNG | `f300b99433638f81a25c3d6443bc14608e88c2e60ad812242ac66085416f85b5` |
| 41 MD | `8ee796b41f8ea8c661b1ca95cd11582f7e343f069c595f76e1a813ef5576f6e3` |
| 41 JSON | `a9d4042068c380444408c85dbbdc81f86a3164b90540ceb20f5292c612085e7a` |
| 41 audit | `1ccae30ce59217801998737444e9326029013955fc617393f517aa4bda189eac` |
| 42 MD | `d6f2e88f2b06476b6d75b82aaf12c23266340b24b5830c2c8add3949484070c1` |
| 42 JSON | `fd6cb4428a9c17614402475f1c2c9ed2668c7a516cc5809f6de89894c655f4f5` |
| 42 audit | `6d81618c99e9c3b417e5c4a97dd4aa51338ab9c6e6a652afa6557557f8d49df7` |
| 41首次run record | `071dfbdcfbf846b84c2397a7ac932bf3bc7227fbb17bc46e564b394409487940` |
| 42首次run record | `6eca9b45d2085926a2943263849369b53f3c824215c923928ae31757acf753c9` |

首次argv分别为 `.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 41|42`，cwd为本工作树；现有run records exit0/signal null/error null，stderr空。audit normalizations/unknown_chars/katex_warnings/count_exclusions/errors均空、errata0。42两图components30/99只记录工具结果，不拿objectCount替代实图观察。audit空unknown不消除本报告UNKNOWN。没有声称执行这些命令或模型验证。

## 停止

唯一41/42 substantive Stage B完成；只新建本报告，原冻结和源包不改。没有重新源页审、counter/finalize/test/render、修复/诊断、现代/答案/choice、工具/索引/装订、Git、DB、网络/浏览器/服务或其他聊天操作。未批准整单元、图形精确重建或发布。35细标点与图21细箭头的此前UNKNOWN不在本报告消除范围；40首机械FAIL仍由原报告保留。
