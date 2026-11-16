# phy6-c5-s9 完整 TEXT 作者冻结

STEMROBIN-180，印刷§76「机械效率」。仅作者，待 main 首次完整独立 TEXT 审查；不是全文独审或正式 lesson 批准。主 official adapt-prepare 一次 exit0 已复用，作者未重跑。

## 完整交接

隔离 root：`.tmp/ld-s10y-lesson/text-author-c5-s9`。

Candidate：`adapt/6p/modern-us-neutral/lessons/phy6-c5-s9`。

| 文件 | SHA256 |
| --- | --- |
| `author-handoff.json` | `27e9d8b896e1e240f4a9b92510d720dbcbf8cd9cf0aca3cafaaebb1dfd9d9963` |
| `frozen-manifest.json` | `a227672f42e73f747998a9bef307482358835ceebe9b51cfc7358e9ef7a2fead` |
| candidate `lesson.template.json` | `617c4a65a342000af1401c9b49c9c39f5d851098cd48cd6de8d76340d31bad45` |
| candidate `exercises.template.json` | `090e7f4a695ffd431c0f5a4e928c5f3b29be1e25a64be3b7d87066d74c8e3179` |
| candidate `figures.template.json` | `b6f49c54f8e1fe01975fca407c61606b52554711d34c14ac0bef3c1f5a90a60c` |

完整全文、全部四题和源快照在 `author-context.json`/`author-context.md`；逐处17块/4题说明在 `author-notes.json`。原 raw lesson.json、lesson.md、exercises.json 和 main 默认三份 supplied templates 完整读取并分别复制至 `raw-snapshot/`、`prepared-snapshot/`；全部 source.data、source_text、页/栏目/任务身份与原输入绑定保持不变。输入/hash见 `input-bindings.json`。

冻结 manifest覆盖30文件；manifest/handoff另外绑定，freeze过程退出后生成的三份流/调用文件在 `evidence/freeze-1.{stdout,stderr,call.json}`，避免循环自hash。全 root35文件，未修改任何已有 freeze/default/canonical 文件。

## 语义与布局

完整17源块对应17现代块、4原任务、0图；figures template逐字节保持原样。全部23数学片段原字节及完整数字序列保持不变，numeric_changes/errata/historical_entities均为空；无源历史实体须文化豁免。

规范句式、公式外中文标点和官方分行；保留总功/有用功/机械效率的强调与源符号。首段理想等功模型与实际机械附加功分开限定，严格不等式仅承接实际机械；动滑轮自身、绳子、轴摩擦的附加功都保留。

例题原100千克、250牛顿、0.08米、0.4米、9.8牛顿/千克、约1000牛顿、80焦耳、100焦耳、80%及全部等式不变。显式写“本例按教材的近似取值计算”及“按上述近似计算”，不把教材取整当成精算、不新增或替换数值。第四题只明确原1指有用功/总功的比值形式，不给理由答案。另三题完整原知识和提问保留，未读任何私有/source-author-c5-s9/answers/keys/choices。

使用 official `prose_flow.mjs` 的实际相邻段落锚点：工作分析到效率定义、百分数公式到例题，解析边界5与9。不是按块号手算边界；全部锚点字节见 candidate `section_breaks` 和机械报告。

## 命令与一次收口

执行目录为 workspace。共享 Python 使用 `env PYTHONDONTWRITEBYTECODE=1` 与 `-B`。实际完整 argv、起止UTC、exit、stdout/stderr及hash均在 `evidence/*.call.json`，计数汇总见 `call-ledger.json`。

```bash
P=/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
W=.tmp/ld-s10y-lesson/text-author-c5-s9
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py compose-1 $P -B $W/text-author.py compose
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py normalize-1 $P -B $W/text-author.py normalize
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py prose-flow-1 node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs $W/adapt/6p/modern-us-neutral/lessons/phy6-c5-s9/lesson.template.json
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py text-mechanics-1 $P -B $W/text-author.py check
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py freeze-1 $P -B $W/text-author.py freeze
```

以上各一次、均exit0。normalize调用现有 `edition.normalize_lesson_layout`/`normalize_exercise_layout`；全文检查用现有 source/identity/text/number/subpart/figure-reference/prose-flow/KaTeX APIs 的隔离dispatcher，不调用 adapt-finalize。

完整 TEXT 机械检查一次 PASS：21单元（17正文+4题）、17最终段落、2锚点、23数学片段；错误0、警告0、首次FAIL无、mechanical-inclusive修复0/1。首次失败若发生须冻结，本次没有失败或重试。没有把本作者机械PASS当作独立语义审批。

调用时 tool epoch起止相同，详列于 `text-only-mechanics.json`/handoff。`edition.py` SHA `4c15c8aba51f65eb5ee3bf3cdeecf9691777b221bd120b590aba7e448f64cf19`；`katex_check.js` SHA `b5e082a863b785bf037a3fbf7b27f92221342359d313be144a27fc6ed98df35e`，已读到main的UTF-8 stdin修复；未改稳定工具、未重跑main已完成检查。

## 停止边界

source复审0；图作者/图门禁0；答案/choice读取或写入0；adapt-finalize/retention/promotion/durable课写入0；DB/Git/服务/浏览器/安装/环境变更0。只写 own scratch 和本报告。

最新main指令已收：s5因187 BLOCKED排除完整批次，本作者不开始185 Azure请求。185实际调用0、没有在途请求/输出或浏览器会话；未建立185图作者文件。s5 source-only独立八题freeze已另交 `answer-source-c5-s5.md`，不向图作者披露。此s9 freeze完成后等待 main，不自分配任务。
