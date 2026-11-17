# phy6-c5-s8 FIRST FINAL author b51

2026-11-17。仅6p/modern-us-neutral/phy6-c5-s8，same branch、offline。
作者转换冻结，**不是独立批准，未official finalize**；等待独立affected conversion reviewer，之后由main处理正式FINAL。
只写自有scratch和本报告；未修改他人文件、源/TEXT/FIG首次失败或整合历史。

## Candidate And Evidence

自有根：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-c5-s8-b51`。

| 自有根内文件 | 用途 |
| --- | --- |
| `answer-keys.json` | 唯一正式prepare0模板的副本，经manual apply_patch填写；status仍draft |
| `input-bindings.json` | 全文20blocks/9tasks输入快照；逐题当前/源prompt SHA、pages、group、sourceNumber、源解及容量、实际图像/当前SVG/spec绑定 |
| `frozen-manifest.json` | 候选、输入快照、工具、图片观察、repair记录及本次检查的bytes/SHA；非循环冻结 |
| `author-check.json` | 唯一新FINAL语法/数学格式检查、计数和待评审状态 |
| `repairs.json` | 两次真实读取exit1；唯一目录修复1/1，后一可选读取失败未修复 |
| `image-observations.json` | 8次实际完整PNG打开的绝对路径、一次打开观察、用途及匹配SVG SHA；parent TEXTONLY |

Candidate：13420bytes，SHA `247b5e8f588823b36549e69c3388eef06b0cd0b9607f74411070b67136dc0bbb`。
Frozen manifest：9063bytes，SHA `85d96d663dc8413e264398cb91e8d8400937146dff78819ce048c0dfb28beb3f`。

## Conversion

已完整读取当前ready lesson/exercises/figures及4份FigureSpec，20blocks/9tasks/4approved figs195196181100。
官方sole prepare0：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/6p/modern-us-neutral/lessons/phy6-c5-s8/answer-keys.template.json`。
只复制该模板到自有根，未重新prepare。全部derived；模板无bookRaw，候选不造bookRaw。

唯一求解权威复用已独立FIRST PASS的`source-author-c5-s8/source-only.json`，
SHA `1c25194705fed1c2b8490f6acc3f53bb3e0cc8ff7479b5c83865df47a996581a`及本票
`answer-source-c5-s8.md`、`answer-source-review-c5-s8.md`。
9份源displayAnswer逐字保留为候选前缀，只补明确的条件、单位和符号说明；不重新源推导或SOURCE/TEXT/FIG review。

9derived、7ungraded、2auto、3numeric parts、0exact；保留33要求组件。
g1/1-5、g2-3、g3/q1需定性解释、操作设计或完整证明，parts空，不硬判解释。
g2-1仅距离`3 m`；g2-2按7m、5m顺序分别`2240 J`、`1600 J`。
160N明确为各次恒定沿绳拉力，绳端14m/10m；瞬时拉力不足以决定总功，不造质量或g。
倒用动滑轮保留轴输入/自由端负载、半输入行程及倍力；液压证明保留等体积、共同额外压强、
小降大升、等功、正输出/负负载功及理想条件，不造图中测量值。

## Actual Images

原图195196181100各1次，既有现代完整PNG各1次，共8；0新render、0重开、0图gate。
PNG真实路径和观察全部在`image-observations.json`，bytes/SHA/尺寸和自有副本在`input-bindings.json`。
4份预览生成SVG与当前正式SVG逐字一致。181左B/l2/F2、右A/l1/F1，与195短左下标1/长右下标2不同；
196完整固定端/两支绳/动轴负载/自由端测力计和h/2h；100连通液体、两活塞及向下施力箭头完整。
示意刻痕、箭长、面积、液体纹理均未当数值测量。父任务仅接收文字。

## Check And Repair

唯一新候选检查+freeze：
`env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-answer/final-author-c5-s8-b51/check-and-freeze.py`
实际exit0，tool chunk42a7a2；48spans/48results、0warnings，ComputeEngine3numeric expected通过。
只检查新候选JSON/绑定、分隔符/KaTeX和numeric格式，不是重新数学推导或独立semantic approval；PASS不重复。

新FINAL作者repair **1/1 used，0remaining，内容修复0**。初次`ls`读取尚未存在的新自有路径exit1，
唯一修复创建自有目录；之后可选181预览报告`cat`缺文件exit1，原样记录，未重试、补文件或二次修复。
后一失败只影响可选报告读取，实际181 PNG/匹配SVG证据此前已取得；不隐藏它，也不重置budget。
源作者旧repair1/1 exhausted及源/TEXTintegration firstfail全部不变。
无cap3/interactions、DB、publish、service、dependency、app、Git或官方FINAL finalize。
