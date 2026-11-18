# 186 恢复检查点

仅本修复工作树中的恢复，不是旧生产任务恢复授权。原 A-D 工作树只读取，
共享 DB 没有查询或写入；线上影响没有新证据，不能宣称线上已修复。

## 已恢复

- n104：旧留存器默认 6p，退出 0 的收据和错册输出仍保留在原 C。
  留存器在 `fs.existsSync(target)` 时拒绝已有目标；原 6p 索引/HEAD 不含
  `phy7-c1-s2-n104`。未见同名有效课程覆盖。三份批准题组 JSON 按原字节
  留存到 7p，4 题（3 单选、1 多选），原课、现代课、答案键一并精确复用。
  原书和现代索引只收录本次两个恢复课，不将其它草稿晋升。
- n105：原 C 的只读失败产物及批准模板未改。使用同样模板完成
  `adapt-finalize`，6 正文块、9 书写题、0 图。三个输出与批准模板解析后
  仅 `status: draft -> ready` 不同；源哈希和两个索引一致。未曾完成的答案/
  选择题阶段仍未完成，本单不创造这些内容。
- source464：原首次失败记录完整保留。独立源图复核确认行22一次、行23两次
  “火炉”均应为“火炕”；修正三处，行24-31包括页脚453已独立核对。
  复用行1-21已有观察，`finalize` 为31/31、14块、0图、0规范化。
  incoming 归属、ex158 outgoing 续页仍不明，不宣称整课或续页批准。
- source461：原输出父目录缺失，不是源扫描缺失。复用原 PNG，经既有
  `layout.crop(..., [150,1260,1200,525], ..., pad=0)` 恢复1200×525裁图；
  没有复读源图或开始新转写。裁图 SHA256
  `a8c485e41920ff4092605742ae4eb03d08f222559bd1899289644dd99b4da646`。
  原 PNG SHA256
  `3f2e4321e14191cf1293f9a507c2389f44af9b8007239fadeb75ccdacc4722fa`。
- source463：`suppliedbranchcodex/...` 是不存在的错误 cwd；作者进程未启动，
  后续错误目录中的终止记录不能当成内容失败。原
  `C/.tmp/ld-s10y-lesson/b81-source463/work/7p/pages/0463/` 已备料，
  其下一阶段是首次作者转写，不是重生成或没有来源。本单不启动该阶段。

## 混合输出

C 为 `/Users/yong/.codex/worktrees/0f12/lemmadeck`。以下收据都在
`C/.intentfold/tickets/STEMROBIN-180/tmp/commands/`，原 stdout 不改、不重跑。

`b79-six-year-existing-modern-stage-record-reuse.stdout` 含61个完整 JSON 文档，
不是一个 JSON。`b72-authoritative-7p8p-coverage-first.stdout` 含2个。
b72 本身列出9个7p和16个8p有 raw 的候选；b79另包含未定稿 n105，
并集才是10+16=26。这个数不是批准数或完整课程数。

逐课读取当前原课、现代输出与索引，并结合已有独立报告/生产检查点：
除 n105 的本单恢复，以下25课都没有 canonical modern 收口/答案/题组，
它们的批准模板存在 scratch；不因索引缺行宣称字节丢失。

| 书 | 课程稳定 ID | 实际未完成阶段/保留原因 |
| --- | --- | --- |
| 7p | phy7-c1-s1-n84 | TEXT affected PASS；现代210/211图件仍未使本课完整 |
| 7p | phy7-c1-s1-n85 | TEXT FIRST PASS；现代图/后续阶段未完成 |
| 7p | phy7-c1-s1-n86 | TEXT FIRST PASS；现代214-218图件/后续阶段未完成 |
| 7p | phy7-c1-s1-n87 | TEXT FIRST PASS；现代图/后续阶段未完成 |
| 7p | phy7-c1-s1-n90 | 原课存在，但末段 open、source239缺口；没有完整现代批准 |
| 7p | phy7-c1-s1-t16 | TEXT FIRST PASS；fig227失败保留，fig228批准不能替代227 |
| 7p | phy7-c2-s3-n149 | TEXT及六源解已通过；目录/接入误停可技术续接，不是科学否决 |
| 7p | phy7-c2-s4-n150 | TEXT PASS；图309缺少顶部测试导线覆盖，实际图 HOLD不能解除 |
| 7p | phy7-c2-s4-n157 | 首次Q4答案线索曾REVISE，有受影响修补；图件实际失败仍保留 |
| 7p | phy7-c1-s2-n105 | TEXT PASS；0444写入失败。本单完成现代定稿，答案/题组未开始 |
| 8p | phy8-c2-s1-n31 | TEXT REVISE：第三定律教学/条件问题，非工具失败 |
| 8p | phy8-c2-s1-t12 | TEXT REVISE：合力、适用域、不同物体的力对、预测模型 |
| 8p | phy8-c2-s2-n38 | TEXT HOLD：悬挂法测量限度需要条件；来源忠实不等于现代批准 |
| 8p | phy8-c2-s2-n40 | TEXT HOLD：6项静摩擦模型条件问题 |
| 8p | phy8-c2-s2-n41 | TEXT HOLD：5项，包括静/滑系数混同、启动阈值、题目条件 |
| 8p | phy8-c2-s2-n42 | TEXT HOLD：8项阻力/相对流速及练习条件问题 |
| 8p | phy8-c2-s2-t13 | TEXT REVISE：静/滑摩擦、胡克定律适用域及强调显示问题 |
| 8p | phy8-c2-s3-n43 | TEXT HOLD：圆周运动条件/参照位置及未绑定高年级承诺 |
| 8p | phy8-c2-s3-n46 | TEXT HOLD：弹簧瞬态、不拉断不等于零力；另有布局缺陷 |
| 8p | phy8-c2-s3-n50 | 前置索引比较误停已技术续接；实际全文审查仍HOLD，不混淆二者 |
| 8p | phy8-c2-s3-n51 | 实际全文TEXT HOLD，不是零题元数据即可通过 |
| 8p | phy8-c2-s3-t14 | TEXT REVISE：牛顿域、质点/平动条件及非惯性系表述 |
| 8p | phy8-c3-s1-t7 | TEXT REVISE：不稳定平衡被否认，标量力矩缺轴/符号范围 |
| 8p | phy8-c4-s1-t5 | TEXT REVISE：同冲量是同动量变化，不是无条件同最终动量 |
| 8p | phy8-c4-s2-n69 | TEXT HOLD：8项系统/能量/适用域及Q3条件不足 |
| 8p | phy8-c4-s2-n75 | TEXT HOLD：2项科学/教学问题，不以来源忠实晋升 |

报告仍在 `C/.intentfold/tickets/STEMROBIN-180/modern-text-review-*.md`；
科学五课的直接报告分别为 static-friction-b59、sliding-friction-b59、
fluid-drag-b59、mechanical-energy-b59、weightless-b61。仅引用已有结论，
没有再次全文审查或授权科学改写。生成这些历史阶段的真实修订/图片/付费
记录仍在原 `production-usage.json`，没有清零。

## A/B

`ab-recovery.md` 是独立只读取证结果。

B 的108-111作者与独立观察已收取，但比较/来源/整课批准仍为HOLD/UNKNOWN；
112-115、116-119共8次备料实际全部exit0，必须复用，不重新执行。
没有把这些范围说成已完成转写或已批准。

A 的17个预期私有ex4原始哈希，在218个现有小文件及126个相关可达Git blob
中均未匹配；可用的有限备份搜索没有找到。没有把新四部分题组冒充旧三块
92-source包。缺口是旧私有证据原字节，需要实际备份，不是整个课题面不存在。
