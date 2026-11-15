# 10c physical15-18 Source Author Handoff

执行日期：2026-11-15。工作目录：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。

身份与结论：本批为源作者，不是本批源文字的独立审查者。四页完整源稿和首次 page.json/audit.json 已落盘，**四页首次 finalize 均 exit 1，仅行数不一致；没有独立 PASS，没有放行或装订**。交父方安排非作者源审及独立计数问题处理。

## Scope and Inputs

- 已读 lesson `SKILL.md` 的 cap1、`profiles/soviet-cn.json`；源 manifest 的 10c PDF 条目与模板 PDF SHA 一致。
- 上边界只读 physical14 的 MD 尾部及 10c TOC；没有重开 physical7-14 的图片，没有修改旧页。
- physical14 尾部是完整定理1陈述，最后正文块非 open；physical15 页首是新“证明”段。
- TOC：n77 起印刷7，n78 起印刷10，下一节/n79 起印刷13。实际四张页脚分别为9、10、11、12，physical = printed + 6。
- 每页 prepare 一次后，单独打开原始完整 `page.png`，再用 apply_patch 写该页 MD；每页 finalize 一次。没有把多页图一次输入。
- 人工横排数来自全幅原图的正文、公式、标题、图题、页脚，不从 prepare 报数反推；各页写稿前的横排观察已写入该页 notes。下述 layout 行带是其后只读的机器证据，不是转写权威。
- 没有额外 count mask、expected-count override、`count_exclusions` 或源像素改动；图4只走正常图框吸附、裁取及计数排图。
- 没有 assemble/adapt/vectorize/finalize 重跑、工具修改或测试、依赖/服务/浏览器/DB/publisher 操作；没有答案、choices 或下一任务现代作者稿读取。

源 PDF：`ssot-resources/soviet10year-textbooks/sources/soviet10years/10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`，SHA256 `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`。

源 manifest SHA256 `5114f1e03c78a847555addfcaa5c6f27f5d2cb02abf3593f9c40a6f1d5cb5ed0`。

字符 profile SHA256 `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`。

TOC SHA256 `431d02aa2d293778d0f55083ea5c1ea210839bfcea28ff9134ed8ed76d735230`。

## First Finalize Results

以下数目均保留首次实际结果。“人工”包括页脚，图题同排只计一次。

| physical / printed | prepare exit / 报数 | 人工横排 | first finalize printed / MD | 块 / 图 | finalize exit |
| --- | --- | --- | --- | --- | --- |
| 15 / 9 | 0 / 24 | 21正文公式 + 1页脚 = 22 | 24 / 22 | 8 / 0 | 1 |
| 16 / 10 | 0 / 23 | 19正文题公式标题 + 1页脚 = 20 | 23 / 20 | 18 / 0 | 1 |
| 17 / 11 | 0 / 20 | 18正文公式 + 1页脚 = 19 | 20 / 19 | 7 / 0 | 1 |
| 18 / 12 | 0 / 26 | 22正文公式图题 + 1页脚 = 23 | 24 / 23 | 6 / 1 | 1 |

实际命令模板，N 各依次为15、16、17、18；每个命令每页仅调用一次：

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page N
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page N
```

四份首次 audit 的 `normalizations=[]`、`unknown_chars=[]`、`katex_warnings=[]`、`errata=0`、`count_exclusions=[]`。每份 errors 仅如下原文一项：

```text
p15: 行数对不上：印刷 24 行，块体 22 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
p16: 行数对不上：印刷 23 行，块体 20 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
p17: 行数对不上：印刷 20 行，块体 19 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
p18: 行数对不上：印刷 24 行，块体 23 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

没有补空行、重复文字、少写断点、删除公式或改文字凑行；四份首轮审计未经后续覆盖。

## p15 / Printed9

全部属于 n77，无题、无图。

人工22排的逐组定位：

- 1：“证明 我们来估计”。
- 2-4：余弦差绝对值的三排等式/不等式；MD 一个完整数学式，两个真实 `↵`。
- 5-7：“因此，如果” / “就有” / 绝对值小于 epsilon 的公式。
- 8-10：“这就是说” / 余弦极限 / “也就是余弦函数”。
- 11：“类似地，可以证明定理2”。
- 12-14：定理2第一排 / “任意” / 正弦极限。极限下标不是第四排。
- 15-18：定理3两排文字 / tg 连续性公式排 / ctg 连续性公式排。
- 19-21：证明条件 / “于是” / 正切商的极限链。整条高复分式仅一排。
- 22：`· 9 ·` 页脚。

首次生成 layout 的具体差异：真实第14排的上部与下标被记为 `[1438,1474]`、`[1492,1506]` 两带；真实第20-21排“于是”与高复分式区域被记为 `[2016,2085]`、`[2086,2155]`、`[2156,2225]` 三带。这两处多出两个带，与24/22吻合。底边细线虽可见，但这份 layout 没有底边计数带；不把本页失败一概归为页边噪声。

边界：`p0015#7` 为 `p open`，保留页末正切极限公式的逗号；接 p16 第一块 `p cont`。页首没有错误承接 p14 完整定理陈述。

## p16 / Printed10

页首先接完 n77 定理3证明；n77 习题32-41完整；随后开始 `78* 弦长与弦所对的弧长的比的极限`，保留标题星号和“习题*”，不裁掉下一单元开头。

人工20排：

- 1：承接句“类似地，可以证明定理3的第二部分”。
- 2-3：“习题*” / “求极限”。
- 4：32、33、34同排；5：35、36、37同排；6：38、39同排。
- 7-8：第40题两排，“的连” / “续性”按源断行。
- 9-12：第41题说明 / 非零分支 / 零点分支 / “作出它的图象”。
- 13：78*标题。
- 14：证明第75小节假设6的引导句。
- 15-16：“定理1” / sin x 除 x 的极限陈述。
- 17-19：证明取值条件 / 绝对值不等式与“这个不” / “等式的各个部分，得到”。
- 20：`· 10 ·`。

每道并排题仍是独立 `ex` 对象；33、34、36、37、39标 `samerow`。第41题的分段函数两个分支是真实两排，保留完整 cases 和一个 `↵`，居中的左侧 `f(x)=` 不另造第三排。中文条件以 LaTeX `\text` 保留，未把此题改成作答或补出解法。

首次 layout 对三排并列极限题分别给了两带：第4排 `[540,585]` + `[586,630]`，第5排 `[677,727]` + `[728,779]`，第6排 `[803,859]` + `[860,916]`。每排第二带是极限下标等低位印刷部分，不是新题排；三处分裂与23/20吻合。本页分段函数在该 layout 中确为 `[1209,1289]`、`[1290,1370]` 两带，没有把失败归咎于中间的 f(x)=。底边细线未进入本页 layout 计数。

边界：第一块 `p cont` 接 p15 的 `p open` 并闭合。第14块为 h3（n78）。第17块 `p open` 停在“得到：”，接 p17 第一块。第40/41题均完整、不标 open。

## p17 / Printed11

全部为 n78，无新题、无图。人工19排：

- 1-5：绝对值比值不等式 / “考虑到” / 两个不等式与“因此”同排 / “由此得到” / 正弦商与余弦差公式。
- 6-8：余弦连续性说明 / 指定 delta / 蕴含公式。
- 9-11：“因此，对于” / 绝对值估计第一排 / 其第二排。只在真实换排处写一个 `↵`。
- 12-13：“这就是说” / 定理1极限结论。
- 14：根据定理1计算极限的引导句。
- 15-17：例1 / 例2 / 例3，各一个横排。例1虽有嵌套分式和极限下标，仍一个印刷横排。
- 18：注释首排，末尾“但是这个函”。
- 19：`· 11 ·`。

首次 layout 前19带对应上述印刷横排，另有 `[2491,2508]` 底边带。完整原图中这是页脚以下的扫描底边痕迹，不是第二页脚或正文；页脚本带为 `[2286,2312]`。没有登记排除框，更没有改源像素；供非作者核验及父方单独处理，不能据此擅自放行。

边界：第一块 `p cont` 接 p16 未完证明并闭合。第6块“注”是 `p open`，末尾“这个函”；p18 第一块从“数是”接起，完整跨页词为“这个函数是”。

## p18 / Printed12

全部为 n78；先完成注释，再有定理2及其完整证明，没有人为追加下一节/n79 内容。

人工23排：

- 1-4：注释续文，依次以“把正” / “把” / “数 x 的正” / “应当写成”收尾。
- 5：公式(2)。
- 6-7：区分 sin 与带下标的几何正弦的两排正文。
- 8：公式(3)。
- 9-12：“如果” / f(x)定义链 / “代替用等式(2)” / f'(0)公式。
- 13-15：“而不是简单公式” / sin'(0)公式 / “这样做是不方便的”。
- 16-18：定理2三排；第18排“限等于1(图4)”与右方“图4”图题共享一个横排。
- 19-22：证明第一排以“x 弧”结束 / 第二排从“度”起 / “用 l 表示弧长” / 完整复分式极限链。
- 23：`· 12 ·`。

图4正常排图后 first finalize 为24/23。prepare 的未排图 layout 最后带 `[2478,2497]` 位于页脚 `[2292,2319]` 以下，对应原图扫描底边痕迹；这与首轮多1行相符。该 layout 中部还混有整幅图的行带，不能把未排图的26带当正文26行，也不能声称已重新运行排图计数证明了底边唯一原因。

下标字形复核点：原图几何正弦的下标形近斜体 r，本次写 `\sin_{\text{г}}`（西里尔 г），并在源 notes 显式记录供非作者复核；未借第63小节旧图或答案认定。所有带该下标的公式及正文保留一致。原文“当用弧度制度量角度时”照录，不凭数学解释改为另一种单位措辞。`(180/pi · x)`右括号后的度数符号、`x°`、`pi/180`、`\sin'(0)`以及末式两处 `l→0` 和最后 `x→0` 均按原式记录。

源 notes 中“分支条件”是本批 p16 的表示说明；p18 本页没有另加分支公式。

### Figure4 Crop

首次粗框 `[885,1145,465,485]`；首次 finalize 精确吸附框 `[902,1144,426,468]`，19个组件。

实际 crop：`.tmp/ld-s10y-lesson/10c/pages/0018/figures/fig-04.png`，SHA256 `4bd4798c87397d795ad030e69c3f59dd13c3ef079a7ce5ea92b9af822d13cd71`。

该裁块已单独实际打开一次：O在左顶点、B在右上、A在右下；OA/OB为斜实线，AB为右侧竖实线，外侧圆弧连接A/B；从O横向到外弧为虚线，两处 x/2 标号分别在虚线上下，内弧完整。没有图题、正文、页脚混入。图块形状保留源像素，不新建SVG，不作为独立图审批准。

语义归属为 n78 定理2，其第三排引用“图4”，单独 cap 标 `samerow`。本批仅有这一个新图；没有重审或改图1-3/5。

边界：第一块 `p cont` 接 p17 的“注”；定理2和证明均完整，最后数学链以 ASCII `.` 结束，无 open 尾块。下一节在本批外，不 prepare 下一页。

## Byte Bindings

持久产物基址：`ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`。
scratch 基址：`.tmp/ld-s10y-lesson/10c/pages/`。
以下均 raw SHA256；MD/JSON/audit 是各页首次 finalize 后字节，没有第二次 finalize。

| page | file | SHA256 |
| --- | --- | --- |
| 0015 | scratch/page.png | `eb8a734d0f3823857b8fbc1f9c72eed5c40a7486fece8e80548e69cbf80a0a41` |
| 0015 | page.md | `a5123a028f62970f28b668539fa6149c31f2586debf5e064d1b6bf589f5d794f` |
| 0015 | page.json | `596c4a1b542e1329cd0fbf153b23f216b34ec01951adb731af4adeb03d06cd4d` |
| 0015 | audit.json | `cee15297a05aacad5ba0bcb486d248ee3e19e044230ab6e9197b130ff2205173` |
| 0015 | scratch/layout.json | `f46f916975450338d5fa463b039d281ed2d5fa5b1572c9e8300b563fa45a54a9` |
| 0016 | scratch/page.png | `ccecddca9bd0eee706caea1de7612167a0e164e446b2b7874bc592d3c0698340` |
| 0016 | page.md | `7f0d4bb55e550e1641fe194f9dee76b0710d7d5aedb41fce712c064299c1c62c` |
| 0016 | page.json | `8585950494e28f8c3d624156787be98e6f9348825378615b7b3ee991c5c29934` |
| 0016 | audit.json | `0e61aaaca54e1f8bbbc2960977d46c2a28cea7cafe966cb6dbd26730c351fb37` |
| 0016 | scratch/layout.json | `93dfdbcd477649c6660995e6d5ad2ab3372754c49add4993ca7ff9834394e173` |
| 0017 | scratch/page.png | `4214f52aa58439c1042685a87be35752bd4fbf4c9fb0d9de439d25b4cc54aba5` |
| 0017 | page.md | `d2569e2f0e6dacfae3fcb5bc2c38662eab545b73feb4dc18c47d5f7cf136479c` |
| 0017 | page.json | `c05fe495ec7b54ece3c4dfca21bc42b8770e41f60659eebd4ed04fe6360aa023` |
| 0017 | audit.json | `adeee961db3e72b0dd728a7c1541d3b478cb5b4c6a597837e2bd2722f37665cb` |
| 0017 | scratch/layout.json | `df0fbb5683c531a0d0a30804b53042eee9b814c0edbf186a4144cc7d54ae2f68` |
| 0018 | scratch/page.png | `7669a7c5f7f482435dc8178a34a0930a29b2d50d7b2f5e695da1096f980f8bfc` |
| 0018 | page.md | `3e445ed08343e7dcb9e6438cbbb00aa7eda78037b707de512c75bf575a3afa2f` |
| 0018 | page.json | `fd45ad5ff3aa0cdc3e4fc8e1f0d01d7e35ea8e11b2d0474d1a6adc4706afeee4` |
| 0018 | audit.json | `1e0e48bee563adb133bb93b4e5ccbe3f4ec81f211f0944e69de7e71f6aef1120` |
| 0018 | scratch/layout.json | `f7db57a0aea76ba42c5b9917ca4c4e335d6d465ec07a4c1a0c350ce1be64c0d7` |

## Unchanged Parent Boundary

以下任务前后实际 raw SHA256 相同，只做字节绑定，不重读/重审 n75 内容：

- 当前 `artifacts/10c/book.json`：`4d54a8e4240752e3320641a47d70cb27a3107ee94c2e759d4c073ee1f966c459`。**现有 physical7-14 装订索引未扩大**；本批15-18只在 pages 下备未来边界。
- `tmp/ana10-c6-s1-n75-seed.json`：`c691f6c9806042e48b4b4dc97bc6592f42803fdcc921827a94f094dbd3d02fa1`。
- `tmp/ana10-c6-s1-n75-review-repaired.json`：`9e987216c580d7a999170d40971702dcce02a2ee7830f37957107158cc4d0761`。
- `artifacts/10c/pages/0014/page.md`：`fe3b0fb367a0b99a4fee97930c1c96d3249a1f6c57324ca1cca3c123d1d3db5c`。

ASCII句点、tg/ctg、原公式均保留；本批无新的西里尔分题序列或法式区间需要改写，未改旧页区间。不主张字形疑点已获独立数学批准。

收口：本次源作者任务到此停止；仅交上述完整源稿、裁块和首轮真实失败。后续须父方独立安排，未开始 modern geo910 n1/n2 任务，未读取其作者稿。
