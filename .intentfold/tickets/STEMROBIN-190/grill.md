# grill — STEMROBIN-190

一批问人的问题,三条。人先误点了一次,按其要求重问同一批,下面记的是重问后的答案。

## Your decisions

### Q2 共享 SOP 改了,另外三个技能的 SKILL.md 改不改?

- 推荐过:只改共享 SOP 和 `ld-s10y-lesson/SKILL.md`,另外三个只删废止规则原文。
- **人选的是:「四个技能一起瘦身」** —— 偏离推荐。
- 落地:`ld-s10y-lesson`(39,079B / 574 行 / 68 行禁令)、`ld-s10y-answer`(14,709B / 277 / 11)、
  `ld-s10y-image`(13,894B / 260 / 14)、`ld-s10y-choice`(5,668B / 99 / 10)四份 SKILL.md
  全部纳入瘦身,共 73,350B / 1,210 行 / 103 行含禁令。AC6 的映射表相应覆盖四个技能。
- 实测补充:两条废止规则原文只出现在 `production-resume.md` 一处,另外三个技能里没有。
  所以对那三个来说这次是纯瘦身,不是删规则。

### Q3 AC1 要不要真的跑完一课才算验收?

- 推荐过:用一个真实开发 session 的转写验证四个数字即可。
- **人选的是:「必须跑完一课」** —— 偏离推荐。所选项的说明里写明了"数小时 + 付费图像调用",
  按此视为对该范围内时间与付费调用的授权。
- 落地:AC1 改为在一课完整离线生产跑完之后再读计量文件。优先选图全为确定性渲染、
  无需新付费生成的课,把付费调用压到零;若唯一可行的课确实需要新的付费图像生成,
  在发出调用之前单独问人,不自行决定(`SKILL.md` 硬规则:花钱需要人)。

## Recommendations you approved

### Q1 在飞的 6 个工单要不要迁到新 checkpoint?

- **人选的是推荐项:只对新工单生效。** 180/181/182/184/187/188 按原样停住,不转换、不续跑。
- 理由(原样保留):转换要把 781,244 字符的 `currentResume1816` 之类的散文压成定长行,等于
  重新判断每一课的真实状态 —— 那是人工判断,不是格式转换,做错会把已入库的课误判成未完成。
  而且一旦允许续跑,它们会带着现有的大上下文继续,正是本工单要消除的东西。
- 落地:新 schema 不读旧文件,也不改动它们;新检查器只对本工单之后新建的生产 checkpoint 生效。

## Decided for you

### D1 新工具用系统 python3,仅标准库

实测:`.venv` 是 git-ignored,新 worktree 里不存在;系统 `python3` 是 3.13.13。
依据:`engineering.md` 红线 5 禁止未经批准新增依赖;`Guidance` 的"No gratuitous dependencies"。
所以 `checkpoint.py` / `meter.py` 只用标准库,AC 命令用 `python3` 而非 `.venv` 里的解释器。

### D2 转写定位不猜:cwd slug 对不上就失败

实测反例:project 目录 `-Users-yong-work-lemmadeck-ws-lemmadeck`,而记录里的 cwd 是
`/Users/yong/work/stemrobin-ws/stemrobin` —— **slug 与 cwd 不一致**(目录改过名)。
所以自动定位只做"按 cwd slug 找,命中唯一才用";miss 或多于一个就非零退出并要求显式
`--transcript`。依据:`SKILL.md` Guidance "Uncertainty surfaces",宁可停下也不猜。

### D3 checkpoint 放 `.intentfold/tickets/<id>/production/checkpoint.json`

依据:intentfold 的 `.intentfold/readme.md` 规定 ticket 产物住在 `tickets/<ticket-id>/`,
生产状态是该工单的产物。不另起项目级账本,避免多工单互相覆盖。

### D4 上限取值:单字段 200 字符,整文件 256 KB

依据:定长行所需的最长字段是 commit sha(40)、lesson id(约 30)、ISO 时间(20);200 给
`note` 留出一句话的余量。256 KB 在每课约 150 字节下可容纳约 1700 课,远超全书系列规模,
同时比现状的 2.0MB 小一个数量级。两个数都写进检查器,不写进散文。

### D5 `lessons[].stage` 闭集

取 `prepared | authored | retained | pushed | published | held`,对应现有管线实际存在的阶段
(备料 / 作者稿 / 持久保留 / 已推送 / 已入库 / 卡住)。依据:`SKILL.md` cap1–cap6 的阶段划分
与现 SOP 第 1–5 步。闭集外取值失败,防止再出现 `active-1817-explicit-human-resume-after-pause`
这类自由文本状态。

### D6 预算默认 8,000,000 token / session

依据:实测一课真实内容 25–50 万 token;一课一 session 约 30 轮、均值 10 万上下文 ≈ 300 万。
8M 留 2.5 倍余量,又远低于现状单 session 6.34 亿。可用 `--budget` 覆盖。

### D7 删除禁令的映射表放 `handoff.md`,不放技能文档

依据:人的明确要求"不要保留历史变更记录之类的"。映射表是本次交付的证据,属于工单产物;
放进技能文档就是墓碑,正是要去掉的东西。

### D8 计量只取数值,不触碰转写正文

依据:`operations.md` 红线 4 禁止把密钥写进检查脚本或工单产物;会话转写里含工具输出,
可能带密钥。工具只累加 usage 字段并记录 session id,不写绝对路径、不写转写片段。
