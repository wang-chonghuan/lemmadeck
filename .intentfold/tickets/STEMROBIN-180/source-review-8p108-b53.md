# FIRST 独立 SOURCE 复核：batch53 / 8p / 物理页108

日期：2026-11-17。cwd：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

**本页完整结论：SOURCEPASS。** 仅适用于下表绑定的物理页108、印刷页96及候选实际字节。逐行 literal、数学字母和矢量箭头、负号、正文强调及标点均与原页像素吻合；确定缺陷0，独审未决 uncertainty 0。`p0108#5` 第23–25行的正确 scope 是整段粗体，不兼额外斜体。不是由作者 uncertainty 或机械绿灯推出的结论。

这不是107的复核、两页共同放行、整课 SOURCEPASS、promotion 或发布授权。107机械 BLOCK、105/106原 HOLD 均不改变。作者原 uncertainty、原报告、FIRST输入/结果、候选及 debit 原样保留，不回写作者的 HOLD 记录。Git操作0，原分支未操作；未回退他人改动。

## 实际字节绑定

均为本次实际文件的 `wc -c` 与 SHA-256，不把用户给定哈希或旧 metadata 当作实测。候选两次只读哈希观测一致。源PDF没有重读，其 metadata 中的PDF哈希不冒充本次实测。

| 实际文件 | bytes | SHA-256 |
|---|---:|---|
| [108原页PNG](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-107108-b53/work/8p/pages/0108/page.png) | 121968 | `4fbf6993b51a3b56475afd08f92a2f934383a085c21b8a2f3796063367c4729e` |
| [候选page.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-107108-b53/artifacts/8p/pages/0108/page.md) | 3480 | `1bf64dc53439c44fff04fa09af38775db1e9a0e88ed778562a81817ea10796cb` |
| [候选page.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-107108-b53/artifacts/8p/pages/0108/page.json) | 4936 | `eaba3d508799e3ebfdbcb61168d699471c8b310c4edbc6a3df4480a9e103744e` |
| [已有audit.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-107108-b53/artifacts/8p/pages/0108/audit.json) | 178 | `80467751a244f553fac572e3ec147ad6049abef254c67caf18fa6218944ce3f1` |
| [纯outgoing结构](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-107108-b53/outgoing-8p109110-structure.json) | 2872 | `be64ed91326b73f4be599ca8e177d0fc2d27f5c539e97f861622765d1a82ac80` |
| [108原FIRST call记录](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/batch53-source8p108-first-finalize.call.json) | 1069 | `ccd4aeba3d11cb5a8698d894d8ce35af37d483304aa923260514c16c7b1bb4e8` |
| [108原FIRST stdout](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/batch53-source8p108-first-finalize.stdout) | 129 | `827bf90879d6f69da7541a6383bac8c6cdaf90843ba48a1101437136e7e77c46` |
| [作者原ledger](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-107108-b53/evidence/author-ledger.json) | 6038 | `0c12391928f8856464df977d4225dc1e19ac112aae4cd9fa6f3d2f557bb5fe3d` |
| [作者原报告](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-8p107108-b53.md) | 9441 | `2c8f402ee02c0768a9b2433970d584e6af25847904e8d3c7b336a3fb0f894e40` |

原FIRST记录：108 finalize一次，2026-11-17T04:10:55.310Z–04:10:55.590Z，exit 0，6块、26/26行、图0、规范化0。本次仅读取已有 call/stdout/audit；没有重跑 finalize、计行、白名单或公式 checker。上述旧结果只证明已有机械记录，不代替下面的像素复核。

## 全页逐行复核

先读108全页像素，再对原尺寸分区逐行比较 md 与 JSON 的全部 `lines`。以下印刷行号是目视定位记录，不是新运行计行工具。共5段正文，分别4、10、6、2、3行，另1行页脚；本页没有标题、习题、图、图题或脚注。跨行断字按印刷保留，不重排或据科学知识改句。

表中代码形式是像素文字的忠实编码，两个数学片段用 LaTeX 表示实际箭头；23–25行代码中的 `**` 是候选与像素相符的粗体范围。每行均与 md、JSON 相符。

| 印刷行 | 块 | 像素文字 / 候选忠实编码 | 独审 |
|---:|---|---|---|
| 1 | p0108#1 | `相抵消. 但是，对于相对地球以恒定速度 $\vec{v}$ 运动的冰球队员` | PASS |
| 2 | p0108#1 | `来说，这个冰球是向冰球队员运动的相反方向运动，其速度为` | PASS |
| 3 | p0108#1 | `$-\vec{v}$. 在与运动着的冰球队员连在一起的参照系中，冰球作匀` | PASS |
| 4 | p0108#1 | `速直线运动.` | PASS |
| 5 | p0108#2 | `然而，冰球队员用曲棍打击冰球，由于曲棍这个很短暂的` | PASS |
| 6 | p0108#2 | `作用，冰球开始运动，获得了一定的速度. 很明显，打击之后，` | PASS |
| 7 | p0108#2 | `曲棍对冰球的作用已经停止，冰球仍继续运动. 同时，打击以` | PASS |
| 8 | p0108#2 | `后，其他物体对冰球的影响仍与打击前一样，地球的作用仍然` | PASS |
| 9 | p0108#2 | `和冰的作用抵消，而曲棍仍与打击前一样，对冰球的运动无丝` | PASS |
| 10 | p0108#2 | `毫影响. 打击之后冰球以几乎恒定的速度（打击时所获得的）` | PASS |
| 11 | p0108#2 | `沿着直线运动. 虽然冰球最终要停止，但从实验得知：冰和冰` | PASS |
| 12 | p0108#2 | `球越光滑，冰球持续运动的时间越长. 因此可以想象到：如果` | PASS |
| 13 | p0108#2 | `冰对运动的冰球的作用（叫做摩擦）完全没有，那么冰球相对` | PASS |
| 14 | p0108#2 | `于地球就以恒定的速度永不停止地继续运动.` | PASS |
| 15 | p0108#3 | `总之，我们看到：如果其他物体对该物体的影响互相抵` | PASS |
| 16 | p0108#3 | `消，则物体相对于地球或处于静止，或作匀速直线运动. 这个` | PASS |
| 17 | p0108#3 | `断言是正确的. 然而，不是对所有的参照系都适用. 例如，对` | PASS |
| 18 | p0108#3 | `于急速冲锋的，因此相对于地球作加速运动的冰球队员来说，` | PASS |
| 19 | p0108#3 | `冰球的运动也是非匀速的. 自然，这个冰球队员会说地球和` | PASS |
| 20 | p0108#3 | `冰对冰球的作用互相抵消.` | PASS |
| 21 | p0108#4 | `这样，我们就得出一个力学的重要定律，叫做牛顿第一` | PASS |
| 22 | p0108#4 | `定律.` | PASS |
| 23 | p0108#5 | `**存在有这种参照系，如果其他物体对运动的物体没有作**` | PASS |
| 24 | p0108#5 | `**用，或其他物体的作用互相抵消，则相对于这种参照系来说，**` | PASS |
| 25 | p0108#5 | `**运动物体保持自己的恒定速度.**` | PASS |
| 26 | p0108#6 | `· 96 ·` | PASS |

数学：第1行是小写 v 上的向右箭头；第3行同样是向右箭头的小写 v，其左侧另有独立横向减号。`$\vec{v}$` 与 `$-\vec{v}$` 都正确；没有把减号并进箭头、漏矢量、改成标量或据运动方向推导原文。本页无其他公式、单位、上下标、分式或习题小问。

标点：逐行核对所有逗号、句点、冒号、两组圆括号及页脚两侧点。正文句末为实心句点，忠实用 ASCII `.`，没有改为空心中文句号；句内句点后的空格保持。第11、12、15行的冒号、第10与13行括号、23–25行强调范围内的逗号和末句点均未漏或移出范围。页边孤立黑斑及页脚旁小污点没有转成文字、图块或额外标点。

Literal：保留“曲棍”“摩擦”“急速冲锋的，因此”“存在有这种参照系”等实际字句，不统一本页“参照系”为“参考系”，不审107字词，也不作科学改写。第23行“运动”与“物体”之间确有“的”；全页初看时的疑似多字已由完整末段原尺寸裁片排除。

## 强调 Scope 与 Independent Uncertainty

**独立像素判定：p0108#5 全部三行只有粗体，没有需要额外编码的斜体 span。**

目标原图区域为用户指定的 `x170..1440,y2047..2255`；原尺寸裁片04包含整个区域及页脚，裁片05、06只用于扩大已有原像素便于观察，不生成新细节。

- 第23行“存在有这种参照系”直至末尾“作”，第24行“用”直至末尾逗号，第25行“运动物体保持自己的恒定速度”及末句点，全部为明显较粗、较均匀的黑体笔画。粗体覆盖整段，不仅是定律关键词。
- 第25行放大图中，“自”的左右框边直立，上下横画与各内部横画保持框形；“己”的竖段、“恒”右部框形没有共同向右剪切。“运”“动”“物”本身的斜笔不能据此认作整字斜体。
- 第23行开头放大图中，“种”的主竖、“照”左部框边同样直立；“参”的斜撇是字的固有笔画，不构成独立斜体起点。原尺寸第二行“用”“相”“照”等也没有形成不同于整段的共同斜体 span。
- 第21–22行“牛顿第一 / 定律.”仍是普通正文印字，末三行的粗体不能扩展到它；正文“摩擦”也不另加粗或补造斜体。
- 这是一项可见强调范围的判断，不声称已从扫描反推出印刷字体名称或元数据。数学 v 的惯常字形由数学编码承载，不混同为中文正文强调。

| Independent uncertainty / 疑点 | 像素依据及处置 | 本次状态 |
|---|---|---|
| I1：末三行粗体是否兼额外斜体 | 全段原尺寸图04，加第25行图05、“存在有这种参照系”图06；直立框边和主竖相互印证，局部斜笔不是整段/独立span的剪切。候选三行 `**…**` 足够，无需 `***…***` 或 `<em>`。 | 已解决；非缺陷，无未决 uncertainty |
| I2：第23行是否多写“的” | 全页初看产生疑点；图04第一行完整可见“对运动的物体没有作”，“的”确有独立字形。 | 已解决；非缺陷，不要求删字 |
| I3：两处 v、箭头与负号 | 图01第1/3行分别看见向右箭头；第3行箭头左下另有减号，均与候选相符。 | 已解决；非缺陷，不用科学推断 |

确定 defect 列表：空。最小具体修项：无。未消耗 repair1；不因本页 PASS 修订别页、原注记或旧 ledger。

**作者原 uncertainty 原文保留，不能删除或伪称作者 FIRST 时已确认：**

> 原uncertainty：第23至25印刷行（原图x170..1440,y2047..2255）粗体确定；中文粗体字形是否兼有独立斜体scope不能可靠判定。本稿只标确认的粗体，未凭语义扩大或补造斜体。需独立像素判定，计行通过不消除此uncertainty，非SOURCEPASS。

该原始历史记录继续存在于候选 frontmatter / JSON notes 和作者 ledger；本报告另外给出独审解析，不回写它。原 ledger 的 `limit=1, repairused=0, remaining=1, reset=false, affected_page_repair_calls=[]` 保持不变。本次 repair=0，finalize=0，不另给一份修复额度。

## 图片次数与裁片绑定

**实际加载8次，单批1，当前context累计8/24，父图片0。** 顺序：1全页；2图04；3图01；4图02；5图03；6一次不可用黑幅；7正确图05；8正确图06。有效证据为1全页+6裁片。重开和失败的图片加载也计数，未把本次记成7次。此后没有再加载图片。

第6次原本拟加载放大裁片05，但将 cropOffset 与 resample 合在一次 sips 调用，产生无可用字形的黑幅；完全排除于判断。随后分开裁切、缩放，得到第7次正确图05。第6次临时黑幅已在本次 scratch 同名文件内替换，未在替换前冻结其字节；下表05的哈希只绑定第7次，不冒充失败加载的哈希。没有对原页、候选或作者证据做替换。

| 有效裁片 | 原图裁切边界 `(x0,y0,x1,y1)`，右/下半开 | 显示处理 | bytes | SHA-256 |
|---|---|---|---:|---|
| [01：第1–4行](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p108-b53/01-lines-01-04.png) | `(155,250,1470,580)` | 原尺寸 | 31909 | `2470c0e2d40c49b6287041497495ef17c7e9d34c7b22071dd470a84a384ca36c` |
| [02：第5–14行](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p108-b53/02-lines-05-14.png) | `(155,585,1470,1380)` | 原尺寸 | 88862 | `a47eaae62246b9edcd70692090b9fd09a9953010fd2889e054969a78af59d533` |
| [03：第15–22行](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p108-b53/03-lines-15-22.png) | `(155,1385,1470,2030)` | 原尺寸 | 62887 | `1d843acf4f7d8418cb6ee338dc9dacaa462a8bd7eb5ed4ffd9bde6303db60313` |
| [04：第23–26行](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p108-b53/04-lines-23-26.png) | `(155,2035,1470,2350)` | 原尺寸 | 25058 | `639f409009ec565ff8e49f2bf2aa2f8dc177373310e9c019e189f7d6aca18531` |
| [05：第25行放大](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p108-b53/05-bold-line-25-3x.png) | `(160,2195,845,2265)` | 裁后3倍，2055×210 | 26042 | `e6ec508d4e9db3b3a53b5d2fd523191db9f25e7ffc3158e52403111daa751dec` |
| [06：第23行开头放大](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p108-b53/06-bold-line-23-start-3x.png) | `(260,2045,695,2105)` | 裁后3倍，1305×180 | 17646 | `4d8838e155a482a3649ee19ceb905cf2f9155e6255c0772455cd8c6be390dbe6` |

裁片只用系统 sips 作矩形裁切/显示放大，原页未经改动。开始尝试裁片时，本worktree技能venv路径不存在、系统python缺Pillow；两次尝试都没有运行prepare/checker或装依赖，随即使用现有sips。没有复制工具链、保留新脚本或另起报告体系。

## 结构与边界

只读取作者 pure outgoing 的身份/标志，不读取107原图、107源码全文、答案或邻页正文。结构记录为 `p0107#5 open → p0108#1 cont`，本页首段结束有句点且 `open=false`。本报告只确认108片段完整、标志与所见页内边界相符，不认证107的文字、图或机械结果；不以107 BLOCK跨页否决108。

本页末段 `p0108#5 open=false`，末块 `p0108#6 foot`，没有新标题、待续题或待续正文。outgoing 中105/106的未批准层级仅为身份引用，仍不批准；没有装订、关闭HOLD或断言完整课。109/110没有读图、读正文或prepare。原outgoing的 `source_approval=false` / `promotion=false` 不回写。

本次写集只有本报告及 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p108-b53/` 中裁片。prepare/finalize/计行/KaTeX/其他checker全部0；assemble/vectorize/现代图生成/模型服务/DB/Git/backend/app/deps/newpipeline/promotion全部0。裁片不是教材figure生成；本页原图对象0，不vectorize。只读文件、已有执行记录、actual bytes/hash及直接像素观察不冒充新跑checker。
