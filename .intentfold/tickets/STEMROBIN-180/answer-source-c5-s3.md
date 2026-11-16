# phy6-c5-s3 source-only 独立答案作者冻结

2026-11-16；STEMROBIN-180；仅 §70《简单机械》。状态：**COMPLETE 作者冻结，待独立比较**。不是现代答案键，不是作者自审批，不是完整课批准。

## 精确交接

根目录：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s3`

| 文件 | SHA-256 |
| --- | --- |
| `source-only.json` | `7c771334add7321efbc9ac2cc1dcb51d3b2bc2364c131797f9d95289722f1e82` |
| `source-only.md` | `7e4a547afa9cea6394d3301d265eac3bbc3191d8da4d4ae151327f3ec882e17e` |
| `input-bindings.json` | `f00d0aa52a64954b42c18d26a98e16357b367cd10ee93e9a390a9bd786063854` |
| `manifest.json` | `9e5d1feeb69d1310668e31840ee915823b2212b9781aedcbad3e37532f1841af` |
| `author-handoff.json` | `3b1f742cc0faf0afb9b5f8d4c68736cd6d33c819a5b7b61004fcf0259b5a8be4` |

manifest绑定10文件：三个作者稿/绑定文件及七份输入副本；manifest与handoff自身另由上表绑定，不作循环自哈希。scratch合计12文件，另本工单报告1文件。没有覆盖任何已有文件。

## 全文与原题输入

实际完整读取 canonical raw 目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c5-s3`

| 文件 | 字节 | SHA-256 |
| --- | ---: | --- |
| `lesson.json` | 4491 | `58c2f0b725b1ba6ce8be6c3a02e0b0bc12d4fe0d062967cccd05237a30e2e1a6` |
| `lesson.md` | 1345 | `62054eecac977a5a8d3a11bd9c5b7103ae2f7f4649d5281bd741ff0b6e6021e5` |
| `exercises.json` | 1135 | `ba9f72cf713dd5dabf3eb4ba1649b28077f7e1cd10d6d0207a065b48af35ae31` |

全课16块（8正文、4图、4图题），三题均为“问题”g1，源物理页189、190、191。完整source snapshots保留在input-bindings.json，七个输入副本逐字节保留于inputs/。原题空figure_refs/figures未伪造为题面附件。主代理提供的through194官方assemble/source批准复用，没有重跑源审、assemble或任何生产门禁，也没有重开整张原页。

原文全文hash：`564b701922b8175be0ba25fa09175ca9f141a2988503b5c503faf61bc25fcafe`。
完整prose对象hash：`a0fddc2069ab386fdefd5a41c3eed56d31dbacd916c47a2214e4601c2987dd6e`。
三题合并题面hash：`b3a066e9a826f4b371bfc4a2ded976ecb63ee42ff6b546c60c2130f7419aba08`。
文本hash采用UTF-8，不规范化、不添加尾换行；合并各text字段仅用一条LF连接，正文包括空图text。对象hash采用解析后JSON.stringify，原文件字节hash另列。

## 实际原图观察

以下原始PNG每张完整打开一次，均在根路径：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures`

| 文件 | 实际尺寸 | SHA-256 | 实见语义 |
| --- | --- | --- | --- |
| `fig-176.png` | 930x442 | `c8bd8fa74fc7f9751e4cc60f89a47e5c239e94582e09dca56d7e7ff98720bc92` | а/б两种杠杆；B施力、A重物作用、O支承。а的O在B/A之间，б的O在右端，A在B/O之间；不混同几何关系。 |
| `fig-177.png` | 1103x387 | `b977d03afb840fdfecc8bc7c65df7ac2ad7ed8176b33d853384421255e0dc3e0` | 台阶石块、多人、长杆、支承结构及右上金字塔轮廓，展示用杠杆分级搬升石块。 |
| `fig-178.png` | 686x257 | `2049b8283e1a3bcc0e5aed60e1a3f7c65122623f18c9c5bcbaa3f504875c1e8c` | 斜板通向车厢，人沿斜板推圆形重物上车。 |
| `fig-179.png` | 183x913 | `270d4b17d65f45650c19b9591e2c4762191f45b2a9d5ff2a7bb486ad62775af7` | 高处固定滑轮，绳一侧挂篮、另一侧通向地面拉绳者，上方有人接收；改变下拉/上提方向，不是负载随行的动滑轮。 |

原图没有数值力臂、坡度、推力、效率等，未按画面长度给出校准或计算。全图观察只作为本课源解上下文，没有重审源裁图或读取现代SVG。

## 三题完整推导范围

结构化全文、完整displayAnswer、逐条reasoning、conditions、notes及源引用见source-only.json；source-only.md保留相同完整展示答案。

| 原题身份 | 题面SHA-256 | 推导范围 |
| --- | --- | --- |
| g1-1，p0191#4 | `d674ebd1d8eb496c8b61a3b403f0bb0eebf567e5c423d94d82223c9bddba750e` | 简单机械是改变力的装置，分别说明大小或方向；图176与179辅助解释，不能只定义为省力工具。 |
| g1-2，p0191#5 | `de12eb4f43e091361b1f6a4acf45168ac7371d4d656b76ac63623535e80952d6` | 目的为方便搬动、提升等操作；合适布置可省力，固定滑轮可仅改变方向。保留力臂、缓慢运动、摩擦损耗、理想无净储能和距离代价的条件；不声称省功或制造数值。 |
| g1-3，p0191#6 | `b7778789b89023cb005ffcbacf96500bce5a9bbc43a207f36c03c03f0ea9c7f8` | 源内应答杠杆，依据p0189#13及实际图177；保留教材历史叙述，不换成斜面/滑轮，也不夸大为只用杠杆。 |

原文“三千年前”在完整副本中未变，未按当前日期重算，也没有外部历史研究。第三题的Egypt/pyramid内容保留源绑定史实，未以现代常识替换。最终现代历史实体处理必须跟随批准的现代题面与合同，不预设文化豁免。

精确作者计数：3题/3完整答案，derived3，预计ungraded3，auto0，parts0；无需数值、单位计算或虚构个人观测数据。此处grading仅表示源稿预期，不是正式绑定结果。

## 调用与冻结证据

阅读ld-s10y-answer及gate2语义合同；未执行cap2正式流程。四次view_image实际打开四张完整原PNG。使用两个`cp -n`命令保留七份输入，只写本scratch及本报告。

一次本地Node输入/稿件身份绑定检查exit0，MATCH：七个原文件及其七份副本合计14次字节hash比对；16块、3题、无漏重身份、逐题snapshot/题面hash和group/sourceNumber一致；三份JSON展示答案在Markdown中逐字出现。该检查不是科学独审、生产门禁或作者批准。manifest/handoff由`shasum -a 256`取实际字节hash。

失败0，修复0。官方prepare0/finalize0，生产门禁0，浏览器0，服务0，DB0，Git0，安装0，环境变更0，durable内容写入0；工具调用均已结束。未读取modern TEXT候选、其他keys/choices、主代理私有解或其他作者源解。

## 停止边界

本稿冻结不再改。等待独立源解比较；仅在完整现代TEXT及所需图独立批准、主代理另行明确授权后，才能进入最终现代答案阶段。现在没有现代prompt绑定、答案prepare/finalize、交互、发布或课完整批准；若最终题面变动，只重核受影响题。
