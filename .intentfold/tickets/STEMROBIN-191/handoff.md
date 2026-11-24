# STEMROBIN-191 — handoff

试产一课并计量：3m 长度单位 `math3-c1-s2`。

- Branch `STEMROBIN-191-trial-lesson`, base `1d63cbf99`, delivery commit `d02851b65`.
- Finish: `review`. Not merged, no PR opened, ticket not closed.

## 1. 这一课实际产出了什么

| | |
|---|---|
| 课 | `math3-c1-s2`「长度单位」，印刷页 30–32 = 物理页 34–36 |
| 新转写页 | `0035`、`0036`（cap1），各一次通过行数对账：20/20、26/26 |
| 复跑页 | `0034` 重新收口，补裁历史缺失的 `figures/tbl-p0034-02.png` |
| 正文 | 0 块（本课原书无正文，只有习题） |
| 题 | 12 道，原书题号 117–128 连续（117、125 带星号） |
| 图 | 2 张，**两张都是 `deterministic`，零付费图像调用** |

两张图：

- `tbl-p0034-02`（归 117 题）——长度单位换算表，现代版重排为英文缩写（`1 km = 1 000 m` 等 5 条）。
- `tbl-p0035-01`（归 118 题）——两把毫米刻度直尺 + 线段 AB、CD。

原图像素实测：刻度 164 px/cm，AB 跨 8.05 cm、CD 跨 5.03 cm → 现代版取 **AB = 8 cm（1→9）、CD = 5 cm（2→7）**。

cap3 potrace 保真（限 2%）：`tbl-p0034-01` 0.011%、`tbl-p0034-02` 0.020%、`tbl-p0035-01` 0.110%。

入库读回（`sr_lessons`）：`id=math3-c1-s2`、`subject=math`、`stage=3`、`lesson_order=3`、
`content.edition = exercises.edition = modern-us-neutral`、`count=12`、题号 117–128、
prose 0 块、2 条图载荷为内联 SVG（8.8 KB / 276 KB）、`mode` 均为 `deterministic`。
同册 `math3-c1-ex1` 仍在、edition 未变。

机械防线全绿：`audit.py` OK、`validate.py` OK（510 lessons / 2016 figure render records）、
content-db 4/4、app 测试 131/131（18 files）、`npm run build` OK。

## 2. 仪表六个数字 + 墙钟

| 指标 | 值 |
|---|---|
| turns | 420 |
| input | 1,444,291 |
| cached | 105,587,760 |
| output | 426,393 |
| **total** | **107,458,444** |
| peakContext | 376,244 |
| 墙钟 | **2 小时 52 分**（2026-11-24T11:03:41Z → 13:56:10Z） |

`meter.py record` 真实退出码 **1**（超 800 万预算约 9 950 万），按设计记录。

**cached 占 total 的 98.3%。** 这一趟再次印证根因诊断：钱花在"每轮把累积前缀重新计费"，不在内容本身。
`peakContext` 376K 说明本 session 跑在超过 200K 的上下文上——SOP「用 200K 模型」那条在本次没有生效，
没有任何强制点会拦住它。**建议把模型上下文做成开工前的硬检查，而不是 SOP 里的一句话。**

## 3. 冗余、绕路、SOP 没说清的地方

按踩到的顺序，这是人最该看的部分。

### 3.1 两条校验互相矛盾，ex120 完全无法合规发布（已停下问人 → 已修根因）

第 120 题在原书是两栏分题，3)、4) 各跨两行：

```
3) 3 800 个一=□个百      4) 5 300 个一=□个百
   3 800 毫米=□分米          5 300 毫米=□分米
```

- `validate_numbered_subpart_layout` 要求现代文本是 `normalize_numbered_subparts` 的**不动点**（每个分题独占一行）；
- `validate_text` 要求**非公式数字顺序与原文一致**。

还原列归属 → 过前者、挂后者；保留行顺序 → 过后者、挂前者。我实测了 4 种排版，
**工具唯一接受的那一种把 3) 的第二个等式并进了 4)**，等于把一道错题发给学习者。

根因：列归属只在**印刷行还分开的时候**可恢复；`exercises.json` 的 `text` 把行拼成一个字符串后，
行边界退化成普通空格，栅格就找不回来了（`lines` 里其实完好）。

修法（`edition.py`）：新增 `restore_column_rows` / `printed_rows`，在**行还在**的时候按全角分隔符
`　` 还原列归属，再按原样扁平化。没有栅格的题仍然逐字节走老路径（已验证本课其余 11 题
`printed_rows(r) == r['text']`），所以对其它书零影响。

### 3.2 `owner-ex 117*` 往返会**静默破坏**已收口的页

`blocks.py` 的 `OWNER` 正则是 `[A-Za-z0-9._:-]+`，**不含 `*`**。对页 0034 重跑一次 `finalize`：

- `owner-ex 117*` → 被解析成 owner `117`，剩下的 `*` 被吞进 label；
- `label "表"` → `"表  *"`，`page.md` / `page.json` / `audit.json` 三个文件一起被改写；
- 全程 **`✓ 通过`，不报任何错**。

这不是我引入的——它是重跑 `finalize` 就会发生的既有缺陷。全语料里只有 3m 这两处用了带星块头
（`ex 117*`、`ex 125*`）；其它书（如 10c p0103）的写法是 `<!-- ex 388 -->` + 正文 `388.* …`，
**星号在正文、不在块头 id**。我把 3m 这两处对齐了语料惯例，顺带让 `owner-ex` 往返稳定。

**`blocks.py` 的正则缺陷我没有动，仍然潜伏**（任何带星题号的 `owner-ex` 都会中招）。建议单独开单。

### 3.3 `exerciseNumbering` 静默默认成 `book`

`p2c.py` 两处都是 `.get("exerciseNumbering", "book")`。3m 在 `sources/manifest.json` 里没有这个字段，
于是走全书连续编号校验——而 SKILL.md 明确写着「**不能根据其它物理教材推断本书也采用全书连续编号**」。
代码默认值做的正是它禁止的事。本册 `book.json` 其实早就记着 `"lesson"`，两处长期不一致。

我给 manifest 补了 `"exerciseNumbering": "lesson"`。**建议把它改成必填，或至少在缺失时告警**。

### 3.4 `adapt-finalize` 校验的是 `.tmp` 模板，不是持久 edition 文件

SKILL.md 的措辞（「只有通过内容验收的结果才分别以 lesson.json… 写入 artifacts/…」）读起来像是
作者自己写持久文件。实际上 `cmd_finalize` 把 `candidate_paths` 指向
`.tmp/.../lessons/<id>/*.template.json`，**校验模板并由工具提升**。

我按字面理解先写了持久文件，`adapt-finalize` 却一直报 `仍含旧文化词: 集体农庄`——因为它读的是
没改过的模板。白绕一圈。**SOP/SKILL 应直说：改模板，finalize 负责提升。**

### 3.5 `figures.template.json` 缺必填字段

`adapt-prepare` 生成的图条目只有 `spec` / `changes` / `source`，但 `edition.py` 随后强制要求
`mode` / `svg` / `render` / `review` 四个路径字段，缺了就报
`deterministic 缺 svg` / `缺 render` / `当前图片缺 review 证据路径`。模板应该直接预置这四个字段。

### 3.6 edition 索引写进了**绝对路径**

`adapt-finalize` 把 profile 路径按 `profile_path.as_posix()` 原样写入
`editions/modern-us-neutral/book.json`，而默认值是绝对路径，于是提交物里出现了
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-191/.claude/...`——把产物钉死在我这台机器上，
也泄漏本地路径。已加 `portable_path()` 改为相对仓库根（三处写入点）。

### 3.7 交付一课会改到**另一课的已发布绑定**

`assemble` 是全书重算，不是单课。它把已交付的 `math3-c1-ex1` 的 `section: "计数法"` 抹成 `null`、
`lesson.md` 删掉 `> 计数法` 两行——而该课 edition 的 `source.sha256` 正绑在旧内容上，
**绑定当场失效**（实测：改后 sha 不匹配，还原后匹配）。

按工单约束已 `git checkout --` 还原，`adaptation.audit.json` 仍为 `pass`。
**但下一次任何人跑 `assemble` 都会重演。** 这是「一课一 session」最危险的暗礁：
单课交付会污染邻课的发布状态，而且不报错。

### 3.8 `assemble` 物化出一个孤儿课

未被目录认领的页 0012/0014 被装订成 `x1-承上页`（17 题），`book.json` 现在列着它。
为与生成索引保持一致，已一并提交（`card_id: null`，永远不会发布）。

### 3.9 遗留的既有失败（未修，非本课）

`assemble` 仍报 `（承上页）: 题号缺号: [17, 24..93]`。
我用 `git archive HEAD` 复刻了提交态单独跑了一遍 `assemble`，**确认是既有失败**（当时报的是
`题号重复 [11..23]`，换成 lesson 模式后变为本条），与本课无关，未处理。

本课自身在 assemble 中全绿。

### 3.10 仪表会把自己算进去，而且退出码容易被吞

连跑两次 `meter.py record`：417 turns / 106,325,821 → 420 turns / 107,458,444。
它读的是**活的转写**，所以跑仪表本身也计费。想要可复现的数，得约定「只跑一次、以第一次为准」。

更坑的是：`meter.py record ... | tail` 之后 `$?` 是 `tail` 的退出码（0），
**超预算的非零信号被管道吞掉**。我第一次就被这个骗了，以为退出码是 0。
SOP 里那段示例命令没有管道，但现实中一定会有人加 `| tail`。建议 SOP 明确提示。

### 3.11 cap1 的行尾空格规则是承重墙，但没有任何机械防线

SKILL.md 里「把空格写在行尾」那条，决定了相邻印刷行拼接时会不会粘连。我第一版漏了，
装订出来是 `…个一5米7分米…`、`…\cdot6$$(164+250)…`。
**行数对账照样全绿**，`finalize` 照样 `✓ 通过`——只有肉眼看装订结果才发现。
这是最容易悄悄发错内容的地方，建议加一条检查（例如：相邻行拼接处若两侧都是字母/数字则告警）。

### 3.12 `operations.md` 里的 psql 命令在本库用不了

文档写的是 `psql "$LEMMADECK_DATABASE_URL" -c '...'`。本库连接串的**密码里含 `@`**，
psql 会把主机名截成 `0621@aws-1-eu-central-1.pooler.supabase.com` 直接失败。
只能改用 app 的 Node `postgres` 客户端读回。**`operations.md` 的只读核对命令是失效的。**

另外 `sr_lessons` **没有 `edition` 列**（版次在 `content`/`exercises` 两个 jsonb 里），
`exercises` 也不是数组而是 `{count, edition, exercises[]}`。按文档直觉写查询会连挂两次。

### 3.13 显示复核的一个小瑕疵（既有）

桌面 1440px 下图宽 640px、正文栏宽 627px，`figure.fig` 出现横向滚动条，最后约 13px 需滚动才可见。
移动端 390px 无页面级横向溢出，图与长公式各自可横向滚动、未被裁切。
同册已发布的 `tbl-p0030-01` 也是 640px，**属既有约定而非本次引入**，未改。

## 4. 停下问人的点 / 偏离工单的地方

**停下问人 1 次**：3.1 的 ex120。给了三个选项（改 edition.py 修根因 / 停在这里交还 / 照工具排版发布），
人选了**改 edition.py 修根因**。此后的 `edition.py` 改动是在该授权下做的。

**偏离工单的改动**（工单说「只碰 3m 的 math3-c1-s2 及其页面/图/索引」）：

1. `.claude/skills/ld-s10y-lesson/tools/edition.py` —— 两处根因修复（3.1 列归属、3.6 绝对路径）。
   3.1 有人的明确授权；3.6 是顺带发现的提交物污染，改动极小且同文件。
2. `ssot-resources/soviet10year-textbooks/sources/manifest.json` —— 补 `exerciseNumbering: "lesson"`（3.3）。
   SKILL.md 要求开工前核对编号范围，且与本册 `book.json` 既有记录一致。
3. `artifacts/3m/pages/0034/page.md` —— 两处块头去星号（3.2），正文 `117.*` 原样保留。
4. 新增 `artifacts/3m/lessons/x1-承上页/`（3.8），`assemble` 的产物。

**按约束还原的**：`artifacts/3m/lessons/math3-c1-ex1/{lesson.json,lesson.md}` 已 `git checkout --` 还原（3.7）。

**没做的**：没开 PR、没合并、没关单；没跑第二课；零付费图像调用（两张图都走 potrace/JSXGraph 确定性路径，
全程没有调用 Azure `gpt-image-2`）。

## 5. 建议的后续单

1. `blocks.py` 的 `OWNER` 正则补 `*`（3.2）——潜伏缺陷，重跑 `finalize` 就会静默改写已收口的页。
2. `assemble` 单课交付不应改写邻课 `lesson.json`（3.7）——会打断已发布课的 edition 绑定。
3. `exerciseNumbering` 改必填或缺失告警（3.3）。
4. `adapt-prepare` 的 figures 模板预置 `mode`/`svg`/`render`/`review`（3.5）。
5. 更新 `operations.md` 的 DB 只读核对命令（3.12）。
6. 行尾拼接检查（3.11）。
7. 开工前强制校验模型上下文窗口（第 2 节）。
