# physical49 同门禁 affected-only 复核

## 结论

**PASS，仅本次49两处源literal修复。** 118第二小问“体→形”及122原句点加ASCII空格均准确恢复；完整JSON diff恰为两个授权block-line，其他文字/数学/对象/metadata不变，audit逐字节不变，prepared四输入不变。保存的一次修复finalize实际23/23、exit0。

本结论复用原StageA/B所有未受影响内容，不重新开图、重计数或解题。原初稿、原作者报告、原StageB REVISE和首次机器23/23证据仍保持原字节；此次PASS不反改旧报告。未读n83 draft、答案或choice。

角色：STEMROBIN-184 worker B，49原唯一非作者独立SOURCE reviewer，现作同门禁affected-only复核；源修稿作者Peirce。此为已有工单下母方委托，不冒称新的逐题人类数学批准。

根目录 `/Users/yong/.codex/worktrees/a07e/lemmadeck`；T为根下 `.intentfold/tickets/STEMROBIN-184/tmp`。E为 `T/source-9g-p49-targeted-repair-evidence/`。

## 原证据复用与顺序

- 原完整StageA：`T/source-review-9g-p48-p49-source-first.md`，rawSHA `51b5b00b8166ef8ffe6aa5343d1c9e597f183998fc2b35de1e9f5fc58f9b3acf`。
- 原49StageB：`T/source-review-9g-p49.md`，rawSHA `302ab89943760c6291c1e0ba3c33cffb389c184d32854b45bbdb3a7c30b96746`。
- 本轮仅复用原两个确定差异及其余内容PASS，再读此次授权修复报告、before/manual/after字节、保存diff及实际命令streams。
- 未打开PNG/grid/crop；prepared图片仅按原始字节做相等/哈希比较，不作像素重新观察。
- 只执行只读JSON/字节比较与取哈希；没有调用source counter、p2c、validator、finalize或其他流水线工具。

## 两处精确修复

| 路径 | before | after |
| --- | --- | --- |
| `p0049#2`，118第二小问，`/blocks/1/lines/2` | `的截面；2) 如果正方体的棱长等于 $a$，求截面的最大的边.` | `的截面；2) 如果正方形的棱长等于 $a$，求截面的最大的边.` |
| `p0049#7`，122第二排，`/blocks/6/lines/1` | `段 $AB$、$BC$、$CD$、$DA$ 的中点在同一个平面内，这些点是怎样` | `段 $AB$、$BC$、$CD$、$DA$ 的中点在同一个平面内. 这些点是怎样` |

118只恢复第二小问的一个“形”字；第一排源“正方体”、119源“正方体”与120源“长方体”原值保留。122仅将该处分句连接逗号恢复为ASCII `.` 后跟一个U+0020，仍在同一原印刷排。

二者都是原字面/标点恢复，不是数学勘误，没有推导或修正源假设。原 `|AM|=|MA_1|=2`、各题条件/请求、117 continuation、复习题标题、123 open、脚注和folio全部沿用旧审，未新增数学检查。

## 严格diff与不可变字段

本轮独立只读比较实际得到：

```text
JSON完整diff仅：
  /blocks/1/lines/2
  /blocks/6/lines/1
onlyExactTwoReplacements: true
metadataUnchanged: true
mdExactTwoReplacements: true
manualMDEqualsAfter: true
auditBytesUnchanged: true
```

比较以完整before JSON为底稿只替换上表两条字符串，结果与完整after JSON深等；不是只查看作者diff摘要。完整before MD也只有上述两个唯一字符串替换，直接得到after全部字节；manual-before-finalize MD与after MD相同，finalize没有额外重写。

所有source/render/profile/identity、notes、printed_lines、空errata/figures/count_exclusions、正文其余行、对象flags和边界均不变。metadata完全深等；audit不是仅errors相同，而是before/after全文件字节相同。

逐件实际bytes equality全部true：

- before durable三件与原 `T/source-9g-p49-evidence/after-finalize/durable/` 三件相同。
- 当前durable三件与E/after/durable三件相同。
- manual-before-finalize JSON/audit仍为对应before原件。
- prepared `page.png`、`page.grid.png`、`page.template.md`、`layout.json`各自在E/before、E/after、当前.tmp及原作者prepared快照之间字节相同。

本轮没有改notes补新阶段叙述，因为本次授权只允许两个block-line；原notes没有被更新或拿来替代源事实。

## 实际一次修复运行

已保存argv：

```text
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
command: .claude/skills/ld-s10y-lesson/.venv/bin/python
args: ["-B",".claude/skills/ld-s10y-lesson/tools/p2c.py",
       "finalize","--book","9-10g","--page","49"]
```

已保存result：`exit_code:0`，`signal:null`，`error:null`。实际stdout：

```text
[finalize] 9-10g p0049: 10 块 / 23 行（印刷 23）, 插图 0 张, 规范化 0 处
  ✓ 通过 行数对账 + 白名单 + 公式
```

stderr零字节。本审者只读该已发生的一次修复运行记录，没有执行或重跑命令。

before/after audit全字节相同，均为 `lines_printed:23/lines_md:23/errors:[]`，无figures、normalizations、unknown_chars、katex_warnings、errata或count_exclusions新增。该机器结果不单独提供源批准；本次源PASS由原独立冻结及准确两处修复比较得到。

## 实际rawSHA绑定

| 输入 | 实际rawSHA256 |
| --- | --- |
| `T/source-9g-p49-targeted-repair.md` | `46a15db9fe26ef7249c723bfc092c82aacd94418db7205378b72a8da33a676a3` |
| `E/hashes.json` | `d53a386f7d074894b02e79087a12319ef037ba16a1929e7c3a0038388aa202b6` |
| `E/strict-block-diff-and-bindings.json` | `08a51de6bd51fc8e238f2a81ebfc608ef5cc2b699a758a26a4a167f8fe1a33b7` |
| `E/manual-md-strict-diff.json` | `3b44733f08f657d982dbd99b222f0547983d40380b3ddf46138b92e9ea4baa90` |
| `E/before/durable/page.md` | `83e0f316a540bc0c057052d7d41d8dd80a22b7179b6f66ff00dc7579bd51648e` |
| `E/before/durable/page.json` | `5717f5e77b8b92370db444688e96c58ca926d2cd0079e5726d6a84ba8f2ef284` |
| `E/before/durable/audit.json` | `d18b61a07dd2c3444edcc291c9b286188caa2b592b2d6a684ff814b56649c36d` |
| `E/after/durable/page.md`，与当前durable相同 | `3c33b9864d1809d5792c150e97ad9b057825d04ad74ee9afb8403ac45ccdea9d` |
| `E/after/durable/page.json`，与当前durable相同 | `6b030c183df1bd80f8f30845b6518f727fd3caaa88b3cea433bb177d46132c69` |
| `E/after/durable/audit.json`，与当前durable相同 | `d18b61a07dd2c3444edcc291c9b286188caa2b592b2d6a684ff814b56649c36d` |
| `E/finalize.argv.json` | `691792a7ceebd05e4769c25d6a6896d0548c27a525a24db78293b742a55d07d0` |
| `E/finalize.result.json` | `3f61b7edb784a95342b7f740c144564d015ed9c6432893f407c7d15a00b74e9b` |
| `E/finalize.stdout.txt` | `73d1dae2ddab7a0b1d98865410d8173a72a2aff351da55c9cbd0aef4b418751e` |
| `E/finalize.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

当前durable49根为repo根下 `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0049/`。

prepared before/after/current/原包四路字节一致，实际SHA：

| 输入 | rawSHA256 |
| --- | --- |
| `page.png` | `a92263b577cabc139629387ad50773b4c89b6f90b5c6359c3b6997c300f74868` |
| `page.grid.png` | `1c536cdf2bb66a41a80920dc16b8e4b18ee2e0f1ee538dac118f4cb9015baa28` |
| `page.template.md` | `e32828d906d5804fd9b6160bdf10c419eeec49e17a015781b4a317fe071f9c7e` |
| `layout.json` | `47804b3b0e5b606d3c88310228304e689eadb7512de6e78f43ec3b2fa1724768` |

原作者报告rawSHA仍为 `eed16e8775f71c07e9fea406188c62b2a7313f6f54aecaef136fdada5864f043`，原StageA/B哈希如前保持不变。旧作者库存正文没有新打开；保存diff中的完整原包保留宣称不被当成对其中未知正文的新审查。

## 停止

仅新增本affected-only报告，不覆盖任何旧稿/旧审。不重开图、重计数、重解数学、修源或重跑finalize；未读n83draft/答案/choice，未作modern/index/Git/DB/browser/net操作。

49本次限定修复PASS，无新增源UNKNOWN；其余内容严格复用旧门禁，本报告不批准后续装订/现代/出版。外取报告SHA后冻结停止。
