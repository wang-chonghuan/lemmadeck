# STEMROBIN-169 交付

已验证，等待人工批准；不自动合并、关闭或部署。

## 交付内容

使用现有 `ld-s10y-choice` 技能的 prepare、独立语义审核、finalize、publish 流程，补齐六年级代数第二章缺失的 10 份题集、806 道选择题。共享 Supabase 内容库已发布；全章 15 份题集共 972 道题。原题逐小问覆盖，来源关系仅内部保留，沿用现有习题界面及服务端判分。

| 新增课 | 题数 |
| --- | ---: |
| alg6-c2-s1-n8 | 45 |
| alg6-c2-s1-n9 | 47 |
| alg6-c2-s1-n10 | 61 |
| alg6-c2-s1-n11 | 103 |
| alg6-c2-s2-n12 | 73 |
| alg6-c2-s2-n13 | 15 |
| alg6-c2-s2-n14 | 18 |
| alg6-c2-s2-n15 | 87 |
| alg6-c2-s4-n21 | 62 |
| alg6-c2-ex | 295 |

跳过已有 5 课，166 道题完全保留：n16 27 道、n17 14 道、n18 44 道、n19 27 道、n20 54 道。

持久产物仅位于 `ssot-resources/soviet10year-textbooks/artifacts/6a/editions/modern-us-neutral/lessons/<lesson-id>/` 的 `choices.json`、`choices.audit.json`、`choices.review.json` 和 `choice-figures/`。新增 187 幅图，每幅均有当前源文件、FigureSpec、渲染及输出哈希绑定的独立像素审核。未修改原课文、教材题、答案、已有选择题、应用、技能、依赖或 schema。

## 验收结果

- AC1 通过：10 份新题集完成来源绑定、小问覆盖、数学与干扰项独立审核。发布后的 DB revision 与持久 audit.hash 一致；全部 15 份题集在浏览器显示完整题数。章末复习含原教材 328–412 共 85 题，拆为 295 个选择目标。
- AC2 通过：`node .intentfold/tickets/STEMROBIN-169/tmp/snapshot.mjs --verify` 验证原课文、去除 choices 后的教材题 JSON，以及已有 choices 内容、revision 和持久文件哈希全部不变。
- AC3 通过：本地 headed Chromium 桌面 1440×960、手机 390×844，各检查 15 份题集，共 30 项通过。新题连续呈现、图表加载、题文与选项无横向溢出；单选点击即可判分，恰好写入一条正确作答事件，无提交按钮。书写题无输入控件。章末答题及三幅图的实际桌面/手机截图已查看。测试仅使用 user_id=2，脚本产生的记录已清理，最终限定本章与本次时间窗口查询无残留。
- AC4 通过：完整逐课清单、时间、主会话与四个独立审核会话的实际累计计数差保存在 `metrics.json`。

浏览器证据位于本票未提交的 `tmp/ac-progress.json`、`tmp/ac-results-courses.json`、`tmp/ac-results-remainder.json` 及逐课截图。运行命令为从 `app/` 执行 `node ../.intentfold/tickets/STEMROBIN-169/tmp/ac-check.mjs --published-new` 和 `--remainder`。

工程机械检查均已通过：资源 audit；教材 validate（16 个 PDF、17 卷、510 课、869 个图记录）；内容库 helper 4 项测试；应用 17 个测试文件、118 项测试；生产构建。无额外回归检查。

## 时间与用量

UTC 起始 2026-10-11 19:55:08，计量截止 20:53:13.321，生成、审核、发布及验收耗时 3485 秒，即 58 分 5 秒。后续交付记录、推送及最终回复不含在该截止统计内。

- 输入：74,954,298 tokens，其中缓存读取 70,877,551，缓存写入 4,045,058。
- 输出：398,866 tokens，其中推理 80,087。
- 合计：75,353,164 tokens，仅输入加输出，不再次累加缓存或推理。

使用本地 Codex `token_usage_record.thread_token_usage` 的实际计数差，包含每次调用重复携带的上下文，不是独有内容字数。未额外调用模型或图像生成 API；美元账单与成本折算不可得，不作估算。每个会话计量截止点及统计方法见 `metrics.json`。

## 偏离与发现

无范围偏离。为完成独立审核发现的真实问题，修正了缺失条件、重复或等价选项、不准确干扰项原因、分数格式、浮点尾数及图选项 A/B/C 与显示顺序。针对新图的射线边界、多图坐标框及闭端点问题，仅修正本票临时生成器，未改稳定技能。

初次 n11 判分断言的默认 5 秒不足：DB 后台事件实际稍后到达。将验收等待改为真实完成条件、上限 30 秒后，仅重跑未完成场景，已通过；迟到的测试事件也已限定清理。初次进度未落盘的三个桌面场景曾补跑一次。

## 环境与剩余

预览：`http://localhost:52169/card/alg6-c2-s1-n8?tab=choices`；章末：`http://localhost:52169/card/alg6-c2-ex?tab=choices`。开发服务保留运行。环境变量无新增、修改或删除，沿用既有 `LEMMADECK_DATABASE_URL`。工作树 `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-169`，分支 `codex/STEMROBIN-169-chapter-choices`。

本票无未完成生成或阻塞。教材既有现代版与扫描差异（图 48/49、n21 表 325 的 1.54 与扫描 1.51）按现代版权威处理并保留两者，未借本票改源。图形选择测量识别能力，不替代独立作图，原书写题仍保留。内容已发布到共享库，但本票没有进行网站代码部署。
