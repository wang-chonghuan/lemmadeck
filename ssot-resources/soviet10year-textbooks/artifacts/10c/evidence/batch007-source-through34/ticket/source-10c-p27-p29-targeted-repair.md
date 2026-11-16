# 10c p27-p29定点作者修复交接

2026-11-16，STEMROBIN-184 worker B，原p27-p30忠实源作者。仅执行父方明确授权的三项修复，不充当Dalton的独立changed-only审者，不新增源审或独立批准。

本报告路径：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p27-p29-targeted-repair.md`。

## 授权输入与完整旧稿

读取并复用唯一审者冻结事实：

- `tmp/source-review-10c-p27-p30.md`，SHA256 `f77f276f19b8df8a304c5716ae9509b035e93ae72d6f1ae053212da63de3623f`，仅B1/B2两处确定标点修正及原22/13/18行观察。
- `tmp/10c-p27-count-diagnostic.md`，SHA256 `c53d97380720fccbc2c17c3169d4bc8efcd898b7ab31842be053d4e61e921125`，父方实际打开底部原像素crop后的噪声定位。

上述tmp相对本单 `.intentfold/tickets/STEMROBIN-184/`。本次没有重新打开原PNG/grid/crop，没有重新计数诊断或求解数学，没有读答案/choice/其他作者内容。

每次改稿前，完整当前27/28/29的page.md、page.json、audit.json均已保存到：

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p27-p29-targeted-repair-evidence/before/0027|0028|0029/`

九份文件编辑前逐字节等于对应当前文件；不是用hash代替旧稿。原p27 audit的23/22 FAIL及其完整errors仍保存在before/0027/audit.json，未覆盖或重写。原p28/29通过的audit也完整保留。四张原裁图保存于before/crops/。修后九份完整文件另存同evidence的after/0027|0028|0029/。

## 精确改动及保护

**p27**：page.md frontmatter唯一新增count_exclusions数组，其一条记录经finalize同步至page.json.meta及audit：

```json
{
  "kind": "scan-artifact",
  "box": [0, 2460, 1695, 40],
  "reason": "复用Dalton冻结的22条真实印刷横排及父方实际打开局部原像素确认的底部破碎浅横迹；额外计数带y2471-2491是扫描边缘墨迹，真实页脚止于y2311。依父方明确授权，仅在计数副本排除底部5%内的该迹线，不改正文、页脚、原PNG或预期行数。"
}
```

依据是已冻结的实看噪声，不是照机器23/22猜出应删一行。父方诊断定位额外带y2471-2491、1052墨像素、ink bbox[339,2471,1336,21]，与真实22条印刷横排分离。原页尺寸1695x2580；授权box在底部5%内，起点y2460在页脚末y2311下方149px，不覆盖正文、页脚或教学脚注。仅计数副本使用，原PNG不掩盖。

p27原body全部字节及page.json.blocks深等不动；notes、printed_lines=22、errata=[]、source/render/profile/provenance全部不动。原notes中的“未登记count_exclusions”为首次作者稿的历史记录，依本次“不得改notes”约束原值保留；当前新增登记事实在此追加，不伪造首次已有排除。audit唯一差异为lines_printed 23 -> 22、追加该exclusion、原行数错误消失；lines_md仍22，其余audit字段深等不变。

**p28 B1**：p0028#2仅一条印刷行的 `得到；如果` -> `得到: 如果`，ASCII冒号后有一个源要求的空格。对应JSON唯一叶子差异 `/blocks/1/lines/6`。无新换行、公式或词语变化。

**p29 B2**：p0029#1仅一条印刷行的 `伸长，当然` -> `伸长. 当然`，ASCII句点后有一个源句间空格。对应JSON唯一叶子差异 `/blocks/0/lines/3`。无新换行、公式或词语变化。

p28/29的MD均精确等于旧MD执行这一次字面替换；两页全部frontmatter/notes/errata/边界/图框不动，audit原字节不动。p30没有编辑或finalize；三份文件hash不变。

## 实际finalize，三页各一次

使用现有官方p2c.py，SHA256 `691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1`。没有prepare、counter补丁、重跑旧页、count override或新增正文exclusion。实际命令如下，各执行一次，三个真实exit均为 **0**：

```text
/bin/zsh -o pipefail -c '.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 27 2>&1 | tee .intentfold/tickets/STEMROBIN-184/tmp/source-10c-p27-p29-targeted-repair-evidence/p0027-finalize.stdout.txt'
/bin/zsh -o pipefail -c '.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 28 2>&1 | tee .intentfold/tickets/STEMROBIN-184/tmp/source-10c-p27-p29-targeted-repair-evidence/p0028-finalize.stdout.txt'
/bin/zsh -o pipefail -c '.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 29 2>&1 | tee .intentfold/tickets/STEMROBIN-184/tmp/source-10c-p27-p29-targeted-repair-evidence/p0029-finalize.stdout.txt'
```

完整输出：

```text
[finalize] 10c p0027: 10 块 / 22 行（印刷 22）, 插图 0 张, 规范化 0 处
  ✓ 通过 行数对账 + 白名单 + 公式

[finalize] 10c p0028: 7 块 / 13 行（印刷 13）, 插图 2 张, 规范化 0 处
    fig-12(图 12) → [122, 1429, 1266, 292]
    fig-13(图 13) → [125, 1863, 1266, 288]
  ✓ 通过 行数对账 + 白名单 + 公式

[finalize] 10c p0029: 6 块 / 18 行（印刷 18）, 插图 1 张, 规范化 0 处
    fig-14(图 14) → [327, 1528, 1087, 610]
  ✓ 通过 行数对账 + 白名单 + 公式
```

当前audit均errors=[]。输出日志SHA256分别为：

|evidence内文件|SHA256|
|---|---|
|p0027-finalize.stdout.txt|`68a71f6915d8d8256115d19ec38aa2f3ee18b3138d1fa449e31cd89fa2b65e72`|
|p0028-finalize.stdout.txt|`7143717be6ccc742036ef643a3cf86180e4e7a05444b72dec4855d5fd8f7c353`|
|p0029-finalize.stdout.txt|`0637ad22dbcd87e1fc4716ccb511db6f3780d891db2fad47a615e2563d16ea14`|

## MD/JSON/audit完整hash比较

当前durable页根：`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`。

|物理页/文件|修前SHA256|修后SHA256|
|---|---|---|
|0027/page.md|`b101e6e3fcc5399cdbd06881f14dbe9bafec29252ac3dd08d783c2e840969eb3`|`61ee5d6328fcffb7f9915ad0c53fb81bed4b9f1c81a50cb4e8627f71b8e0a72c`|
|0027/page.json|`180480cf59a57e22ed7348f97a83ba16c729a0775237c14c1dfc02fc6ae0085e`|`76a630559110cfe27793ee968cc12123cb4ef6b989fe592c34b6ddda37de1652`|
|0027/audit.json|`27594d824ff5a31728151bc53388ff1a31561d665b08a985796d1029300d6f78`|`0ebfae5fd0372bb4da2b3f8d3239bdfe49c600e3bbd4bbf4b964846870c9d539`|
|0028/page.md|`95522290ac841f2216a9712294e0da78ed907398ba9fddf27d81d5ea0500c59a`|`6e88c23ce8896043c7c1c6d4e2f83e4c21189f98d93f3a993b8ff01179e8178f`|
|0028/page.json|`7cbd133dd2a1062f2c6c7d2a70147c8e3509daa65485bb14e10959b2dbdc860d`|`24168270964f30b7bcf0011b9ba25b5d61d40be4c5ed9d4e951c288fe5a49c6c`|
|0028/audit.json|`05baa45a729bc7cd1aec81f1314743f8c57114806d444008fa5182a3c66eb97b`|`05baa45a729bc7cd1aec81f1314743f8c57114806d444008fa5182a3c66eb97b`|
|0029/page.md|`b7213ce18c394e8748cd5e966ef66da8de0e226ef39fc84bca991aefc75219e1`|`951d22ba52eb32664c3e67a8081d210e5ef8ff7b665becf81390752421604998`|
|0029/page.json|`875a990e267a8ea0de6f3ad462c74fda9a4ca57a9be9f285a58abba156f6eb85`|`7a0fd8bea14c36e1839f4c78ef2737d03bd8d2f6eb482720421c814ba01f5ccb`|
|0029/audit.json|`fe104435cd6a29219832eb9f45a139bbe3b5942c3e7bd25e2490c7afa29236d8`|`fe104435cd6a29219832eb9f45a139bbe3b5942c3e7bd25e2490c7afa29236d8`|

未动p30：page.md `00fe5769d130c4646c28efb7e0442c33d3ba4afb6d16b473d0c104888221a251`；page.json `3e6b47b115f9c8de802da58f866db5d58611610d7c58351849220535405c2ee1`；audit.json `31cebe53591fd3e196f5ac21e1ac9183fbae28c93c4b118ef648050abd64a56d`。

## 原PNG、图框和裁图保护

仅读取hash/执行官方finalize，没有再次视觉打开：

|原page.png|当前绑定SHA256|
|---|---|
|0027|`0a50daeabe59fed1935454ce84e6304733e20d808160221b061d3c0d115cf721`|
|0028|`9eb7f2e57bf285b8513e069a96ca9bd09951a669f537adff7bcff5a7b4fdc46d`|
|0029|`b81591ae8c5175ffaa0fe68a92a73bfd434a795612c57972879b8aa9ccce588c`|

官方复用已收口图框，未以粗框再次吸附。当前crop与before/crops中完整原PNG逐字节相同：

|crop，均在.tmp/ld-s10y-lesson/10c/pages中|图框|修前=修后SHA256|
|---|---|---|
|0028/figures/fig-12.png|[122,1429,1266,292]|`a5970d8c13709475dcfd0fec39a8730bdf595686c2d8218e307b19e3507648a7`|
|0028/figures/fig-13.png|[125,1863,1266,288]|`a30cdcdf8c7213a6d1544a427405f6e5ebd292cfc063383ae55345d79f22b989`|
|0029/figures/fig-14.png|[327,1528,1087,610]|`fab7ca5f77d266a4f6b300f539a452bcc2ceac5fa6c08a4b8e9e6d358dd8e5bc`|
|0030/figures/fig-15.png，未finalize|未改|`3e50483b4fdcdefe9c816d7f76a77cf0100d2fe8417c3821341883efac2084b2`|

## 冻结与停止

这三次是作者修复后的实际官方机器收口结果，不代替Dalton独立changed-only核验。没有修正文数学/符号未知项、源errata、其他页/书册、工具/依赖、索引/book、assemble/vectorize/adapt、图spec、答案/choices、Git/stage、DB/发布/应用/服务/网络或其他chat。没有覆盖原FAIL证据，没有重跑finalize。当前稿及完整before/after和stdout已冻结交接，停止等待母方授权唯一审者。
