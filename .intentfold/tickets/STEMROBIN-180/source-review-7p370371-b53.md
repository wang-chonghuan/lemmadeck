# Batch53 FIRST SOURCE 独立复核：7p 物理 370/371

2026-11-17。唯一 FIRST 独立 SOURCE 审者；仅两页新候选，不是 368/369 旧 HOLD 重审。

结论：**370（印刷 359）PASS；371（印刷 360）PASS，严格限下列哈希绑定的页级候选。**
确认缺陷：各页 0。独立复核后仍未判定的细微疑点：各页 0。这两类记录分别为空，是逐字、标点和强调 scope 比源像素后的结论，不是沿用作者 `raw_uncertainty:[]` 或 finalize 绿灯。

## 来源与实际绑定

cwd：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。
本表路径均相对作者独占根 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-370371-b53/`；实际源页在 `work/7p/pages/`。没有另找或重建 `original/` 副本。
所有 bytes 和 SHA-256 均读取当前文件实际字节计算，两个 md 哈希与人类指定值一致。

| 页 | 实际文件 | bytes | SHA-256 |
| --- | --- | ---: | --- |
| 370 | `work/7p/pages/0370/page.png` | 71593 | `fc9079f8d32624d154191b9e12d500f1eecff7da68f888f85679e8b618fe5d21` |
| 370 | `artifacts/7p/pages/0370/page.md` | 3026 | `c08dc5cdbd5f38d2bdc60c9f07287a5edd9d3b6b794b353d2f62ded89817bf8b` |
| 370 | `artifacts/7p/pages/0370/page.json` | 6229 | `304a4dc72edc64dd8b9f19cfd27002e7deb5f2d212ddbdd66dceb115e520de3c` |
| 370 | `artifacts/7p/pages/0370/audit.json` | 178 | `c4180816fcef1813ceed92bdefa61a3288a19a1e85ac7ee90282423bd004b200` |
| 371 | `work/7p/pages/0371/page.png` | 73065 | `71c38e86328f19e0cbc96072e263fb828ad1994b906703fd037f49583101aa1d` |
| 371 | `artifacts/7p/pages/0371/page.md` | 3129 | `82a9d1ae4a2713dcf4ff54678363fa6d47a8ad199818214636079810aee6011d` |
| 371 | `artifacts/7p/pages/0371/page.json` | 6358 | `246039a2d7bdea61b041f45f6a3b523e5b981b8c5485adcd4fc9805bf8c5bfa3` |
| 371 | `artifacts/7p/pages/0371/audit.json` | 178 | `ff3175b2ce105b054ea80372d1e6e1fd9f22aa6a302a1c4a32b31653803b9423` |

已读 router、`.intentfold/readme.md`、工程/操作章程、lesson SKILL cap1 和 image batches。作者报告与账本仅供实际命令、路径、预算定位；独审来源为亲自加载的原页及经原像素核验的局部，不把作者字重判断当证据。

## 实际图数

**单 batch 8，本 context 8：2 全页 + 6 必要原像素裁片；视觉 reopen 0。**
先单独加载 370 全页、370 top/middle/bottom，再单独加载 371 全页、371 top/middle/bottom；未同一调用加载两全页，未读 grid、其他页、图稿或生成图。

复用作者已有裁片，只读且重新独立辨字。独立用 Pillow 核对六裁片与当前对应源图的指定 xyxy 裁切，尺寸、mode、全部像素 bytes 均完全相等；没有 resize、过滤、OCR、生成或额外视觉加载。

| 原像素裁片 | 原图 xyxy | bytes | SHA-256 |
| --- | --- | ---: | --- |
| `pixel-evidence/0370-top.png` | `[190,210,1370,950]` | 29980 | `0d51ec363d37cf8055953538a40b39ce03c14f3311c3b56a35c90e68b4bcbc3a` |
| `pixel-evidence/0370-middle.png` | `[195,995,1370,1650]` | 24919 | `ea26b4adc34a802b997e7563ac8e7c86676b965d91d667b4a1d0c77376035aaa` |
| `pixel-evidence/0370-bottom.png` | `[195,1650,1370,2060]` | 13862 | `661bc17fc41844091f286fc9085492c73967d76a54c09ba6b8b5565fbc5e439b` |
| `pixel-evidence/0371-top.png` | `[165,205,1350,935]` | 27753 | `125885b71863698f1b190b5a95036cb6a6163f88076786506d8aba62abcdb41f` |
| `pixel-evidence/0371-middle.png` | `[170,980,1350,1695]` | 28337 | `03def91b4325676e7d8f440c0619b7d9bbb8ae45631ee6c79b1955a9d72f7fcd` |
| `pixel-evidence/0371-bottom.png` | `[175,1745,1350,2055]` | 14201 | `1174652bfb4341e8d6d16ea746857d97c32cc9611f1adabdab5d489e9b75ba2e` |

## 370 独审 PASS

完整核对 `p0370#1` 至 `#16`，不是抽题。以下每项均与源页逐字/逐标点对照，且 md 与 JSON 的块体及标记一致：

| 块 | 实际核对内容 / 结果 |
| --- | --- |
| `#1` | `(2)` 怎样计算功率？题号、文字、问号 PASS。 |
| `#2` | `(3)` 怎样用电压和电流强度表示电功率？全部 PASS。 |
| `#3` | `(4)` 功率的单位是什么？全部 PASS。 |
| `#4` | `(5)` 怎样用电压和电流强度的单位来表示功率的单位？全部 PASS。 |
| `#5` | `(6)` 在实践中都应用哪些功率的单位？全部 PASS。 |
| `#6` | 练习 `67`，字与数字同在粗体 scope，PASS。 |
| `#7` | 练习 67 `(1)` 两印刷行完整；`127`、`0.60`、伏特/安培、`电源电路中.`、逗号和末尾 `电功率.` 全部 PASS。 |
| `#8` | 练习 67 `(2)` 两行完整；两个“规定”、`220`、`3.0`、伏特/安培及句点全部 PASS。 |
| `#9` | 本页明确印 `146. 用电功率表示电功`；不是 145，编号含句点与全部标题在粗体内，PASS。 |
| `#10` | 四行全部比对，保留“就象”、电灯/电炉/电动机顿号、公式 `P=A/t`、时间 `t`、句点后的“由这个公式可导”及下一行单字“出”；无漏字、额外强调或伪 cont，PASS。 |
| `#11` | 独立公式 `A=Pt` 和公式外句点，PASS。 |
| `#12` | 两行从“以瓦特”到“焦耳：”，单位、逗号、冒号及常规字重全部 PASS。 |
| `#13` | 完整一行 `1 瓦特=(1 焦耳)/(1 秒)，所以 1 焦耳=1 瓦特×1 秒.`；分子分母同一印刷行，数字、单位、等号/乘号、逗号、句点和整行粗体 PASS。 |
| `#14` | 两行全部比对，保留“其它”，末尾“单位：”常规字重；不延伸入粗体等式，PASS。 |
| `#15` | `1 瓦特小时=3600 焦耳；` 全部粗体，分号在 scope 内；列表 `open:true`，PASS。 |
| `#16` | 印刷页号 `359`；旁边实心装饰点不是正文，PASS。 |

七个括号题号均为常规字重，题面无另起粗体/中文斜体。数学斜体范围逐处核对：`#10` 第二行 `P`、分子 `A`、分母 `t`，第三行时间 `t`；`#11` 的 `A/P/t`。数学符号、单位文字不伪作变量斜体。`#10` 的“由”至“出”均恢复/保持常规中文；`#12/#14` 的冒号不吞入后块粗体。两条单位式的粗体均从首个 `1` 到末尾标点，无缺尾或越界。未发现其他正文强调 scope。

## 371 独审 PASS

完整核对 `p0371#1` 至 `#16`：

| 块 | 实际核对内容 / 结果 |
| --- | --- |
| `#1` | 两行承接单位列表；百瓦小时式 `100`、`360000` 与千瓦小时式 `1000`、`3600000`、各 `×1 小时` 全部 PASS。第一行末 `焦耳；`，第二行末 `焦耳.`，两行独立整行粗体均包含末尾标点，`cont:true/open:false`。 |
| `#2` | “知道了电灯的额定电功率及点燃的时数，就可以算出／电功.” 两行完整；“知道”起常规字重，PASS。 |
| `#3` | 例题两行完整；“额定”、`100` 瓦特、每天 `6` 小时、`(30 天)`、全部标点 PASS。仅照核本页例题，不读答案或另推数值。 |
| `#4` | “利用公式”，独立常规正文，PASS。 |
| `#5` | `A=Pt`，公式外为逗号而非句点，PASS。 |
| `#6` | 两行“得 A=100 瓦特×180 小时=18000 瓦特小时=18 千瓦小／时.” 完整，数字零数、单位、乘号、等号、断行及句点 PASS。 |
| `#7` | “问题”全部粗体，PASS。 |
| `#8` | 问题 `(1)`，完整“在用电器的说明书中通常都要标明哪一个量？”PASS。 |
| `#9` | 问题 `(2)`，完整“怎样用电功率及时间表示电功？”PASS。 |
| `#10` | 问题 `(3)`，完整“在实践中经常使用哪些电功的单位？”PASS。 |
| `#11` | “练习 68”，包括数字 `68` 的完整粗体 scope，PASS。 |
| `#12` | 练习 68 `(1)` 两行完整：“电熨斗”、`0.6` 千瓦、`1.5` 小时、`能／量？` 全部 PASS。 |
| `#13` | 练习 68 `(2)` 三行完整：住宅、`60/40` 瓦特各两盏、每天大约 `3` 小时、每 `1` 千瓦小时交费 `4` 戈比、`问一／个月 (30 天)`、全部标点 PASS。 |
| `#14` | “作业”全部粗体，PASS。 |
| `#15` | 无印刷题号，`ex/label:null` 正确；三行每字与句点完整，保留“各种电器”“一周内”“并把你算得／的钱数”“根据电度表所得的钱数加以比较.”；无伪编号、遗漏或余续接，PASS。 |
| `#16` | 印刷页号 `360`，装饰点排除，PASS。 |

五个括号题号及全部题面常规字重；“问题”“练习 68”“作业”的粗体不扩到后题。`#5` 的 `A/P/t`、`#6` 的 `A` 为数学斜体，单位、数字、标点不作变量斜体；其余正文无新粗斜体 scope。
两页均单列正文，居中公式不是第二栏；题面跨行照原行保存，无并栏错序。全部 `samerow:false`，无图。

## 仅复用实际 FIRST receipt

receipt 的 cwd 均为作者独占根，实际路径为该根下 `.intentfold/tickets/STEMROBIN-180/tmp/commands/`；stdout/stderr 相对路径按 receipt.cwd 解析，不按共享仓库 cwd 猜测。
已读取两 call.json，并对实际 streams bytes/hash 核对相等。没有因共享 receipt 不存在判全局失败，没有重跑命令。

| 页 / 标签 | call.json bytes / SHA-256 | 实际 stdout / stderr | 复用机械事实 |
| --- | --- | --- | --- |
| 370 / `batch53-source7p370-first-finalize` | 1317 / `463ae44fd39b418ad513a065ccd38bad5a6590d1159307adffb8b1f8cedd6c86` | 130 / 0 bytes，均与 receipt 哈希匹配 | 一次 exit 0；23/23；0 图；修复 0/1 原样 |
| 371 / `batch53-source7p371-first-finalize` | 1317 / `9de3ee2f95f979716fec3e3cd2fd763e64c726808690df999010795711a15049` | 130 / 0 bytes，均与 receipt 哈希匹配 | 一次 exit 0；25/25；0 图；修复 0/1 原样 |

streams 的逐页完整 bytes/hash 在独审账本中绑定。审者 repair/prepare/finalize/计行/KaTeX/vectorize 均 0；无图不空跑 vectorize。机械行数记录不代替上面的像素判断。

## 纯结构边界

incoming 只读 `.tmp/ld-s10y-lesson/source-author-7p-368369/outgoing-7p370371-structure.json`（3640 bytes；`8c261f8ae0924287caba1c4997ba28ab60bcb2e4385f2ee61ae0785d25736dea`）。
**369 仍 HOLD，原预算耗尽不变；incoming 的 `hold:false` 被人类明确 HOLD 覆盖。** 未读 369 全页/题/解/图或失败报告；章 `phy7-c2`、小节 `phy7-c2-s3`、370 首五题的上游栏目 `p0369#8` 仅为未批准结构，不能从本次页 PASS 推成完整 SOURCE 批准。

本页标题 `p0370#9` 的 `146` 由 370 像素独立校准；拼成 `phy7-c2-s3-n146` 的祖先归属仍是未批准继承，未做 TOC 核验。
批内唯一续接为 `p0370#15 open → p0371#1 cont`，第二条单位式句点关闭；371 最后主块 `#15` 为无编号闭合 ex，当前栏目 `#14`，最后块 `#16` 为 foot。372 未读，不推断其首块 cont 或本课/栏目完整。

新出界文件仅携带编号、结构引用、标记和页候选身份；无课文、标题全文、公式、题面、答案或图片载荷：
[独审 outgoing 纯结构](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p370371-b53/outgoing-7p372373-structure.json)。
页 PASS 不跨 HOLD assemble、不 promotion、不批准完整课程；作者 outgoing 与所有其他工作者文件保持不变。

## 写集与停止点

仅新增本报告及 `.tmp/ld-s10y-lesson/source-review-7p370371-b53/` 的账本、纯结构文件。
[独审图片/预算与 actualbytes/hash 账本](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p370371-b53/image-and-budget-ledger.json)。
没有复制 toolchain、候选修复或回退；没有新的审查体系、模型服务、Git、backend、DB、app、依赖变更、prepare/finalize/vectorize/assemble/promotion。只返回文字与既有证据路径，停止于以上两页限定 PASS。
