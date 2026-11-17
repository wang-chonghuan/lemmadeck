# Modern TEXT Author: Planets B53

状态：`FIRST / TEXT-author-complete / awaiting-sole-independent-review`。仅 `6p / phy6-c3-s19-t1`《其它行星上的重力》补充阅读；不是独立审查 pass、FIG 验收或发布许可。

## Ownership

- Checkout：`/Users/yong/.codex/worktrees/0f12/lemmadeck`；沿用原分支，未运行 Git，不回退其他工作者改动。
- 唯一写集：`.tmp/ld-s10y-lesson/text-author-planets-b53/` 和本记录。作者稿不进入 batch52 提交。
- 已读 AGENTS/router、IntentFold readme/project/charter、intentfold skill、lesson SKILL cap4、edition-text-contract、image-batch 规则和 profile；完整读取本课 canonical lesson.md、lesson.json、exercises.json。
- 复用 official 首次 adapt-prepare（2026-11-17，exit 0），本作者 prepare 调用 0；未运行 IntentFold capability、backend、SOURCE gate、answers、choices、FIG spec/generation/gate、adapt-finalize、promotion、render、DB、Git、services、app、deps 或 globaltests。
- 三模板已在 OWN/adapt 下准备。本作者仅编辑 lesson.template.json 的五个 p 块和 section_breaks；exercises/figures 两模板完整字节未变，book.template.json 与索引未写。

## Frozen Templates

候选目录：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-planets-b53/adapt/6p/modern-us-neutral/lessons/phy6-c3-s19-t1/`。
最终完整字节副本：OWN/FIRST/templates/；以下哈希为实际文件字节 SHA-256，不是 JSON 对象签名。

| 文件 | actualbytes | SHA-256 |
|---|---:|---|
| lesson.template.json | 18698 | `e43cf7fcefa2a457e6d8b33bf6bd523926f8329820f84bbd63d9650d61058207` |
| exercises.template.json | 419 | `e35ad98ec7650c0715397bda5044411be99560d5140da877d6c4f5ed2b94e207` |
| figures.template.json | 1127 | `a23a8365c460a8a7ac35d1d27499ff2147ed52bf23a2a55c91f85aed2a658ce9` |

冻结清单：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-planets-b53/FIRST/manifest.json`，24345 bytes，SHA-256 `4ed8861b39b87eda3086a8e88630ddbb50f5d952de778bec960b3bdc918e383e`。三模板仍为 draft。

保留 9 个源块（5 p + 2 fig + 2 cap），0 题，2 图；改写 p 索引 0/3/4/7/8。原 source.data/source.sha256/source_text、source_refs、metadata 和图 63/64 身份未变。15 个数学区原字节与顺序全部一致，公式和值没有增删替换，numeric_changes 0，target errata 0。实际 proseFlow 为 17 段；四个 section_breaks 逐字复制唯一一次 prose_flow 输出，解析位置为 3/6/11/14，不由源块或换行推算。

## Source And Primary Reference

canonical 完整字节副本在 OWN/source-snapshots/，初始三模板在 OWN/supplied/。

| canonical | actualbytes | SHA-256 |
|---|---:|---|
| lesson.json | 4725 | `0c3d2a048076446f5fdf8963684f33360437ffdb8e163cee9ce27e214762b59f` |
| lesson.md | 2775 | `ef28791618ba064b1f9339397cc152baf82db566977fa54b1c299040604a8a86` |
| exercises.json | 66 | `9ed2d5717d12f3fa539699dbd473d7ca57b06441c77c432592e72e88354df184` |

已实际读取现成 NASA 官方主资料 `.intentfold/tickets/STEMROBIN-180/tmp/commands/batch53-planets-primary-reference.stdout`：science.nasa.gov/solar-system/planets/，cloak-fetch GET 200、exit 0，页面标记更新日期 2026-10-28。本作者没有重新抓取。正文资料 actualbytes 5861，SHA-256 `f47a0bbb25ac08c1f3919a1f610192aff84e5b22df70533f28ed3a633e86ce80`。该资料和首次 prepare 的 call/stdout/stderr 均精确复制到 OWN/FIRST/reused-evidence/。

## Text Decisions

- 走用户允许的历史注释路线：保留原“九大行星”，紧接现行八大行星完整名单，并解释冥王星在二〇〇六年由 IAU 归为矮行星。没有把原九颗或其图身份删掉；八颗分类与日期是新增澄清，不替换任何原式或原数值。
- 保留太阳引力 `$30000000000000000000000$`、`$=3\times10^{22}$` 牛顿、`$3\times10^{19}$` 千牛顿，以及水星/木星/月球原书数值，明确其为旧近似，不作当前精确数据。
- 原质量与引力关系补上被吸引物体质量和到天体中心距离相同的范围；不同天体表面还要比较半径，不能只由天体质量判断重力。
- 汽车 `$600$` 千克的质量不变；`$6000$` / `$1000$` 牛顿对应原书每千克约十牛顿及月球约六分之一的近似。举车图是想象示意，不是安全举车能力证明。
- 地球 `$11$` / 月球 `$2.4$` 千米/秒是表面附近、忽略空气阻力、此后无持续推进等理想条件下的逃逸速度旧近似，不是任何离开地面都必须达到的速度。没有新增或改动公式。
- “登上木星”与重量“几乎增加了两倍”只作为原书假想对比和旧估计保留。明确木星为气体巨行星、没有可站立的固体表面，需要指定距离/参考高度，不把这当真实登陆或地表称重。
- 谷神星现属矮行星，仍为小行星带最大天体；原半径/质量比例、灶神星第四位的尺寸次序和质量比例明确标作历史说法，不充当现行排名或精确测量。“推一下就飞离”须考虑质量、半径与获得的速度，不泛化到全部小行星。
- 保留真实作者康·爱·齐奥尔科夫斯基及书名，historical_entities 的 term 在 source_text 与现代 text 同现，reason 绑定 p0088#7/p0089#1。未命名的小说叙述者没有新造姓名；30/60/50/30/15 及十层楼、松树、沟壑和不用助跑等原设想均保留，明确为文学假想而非实验测量。
- 零题保持零题，不编练习，也不需要 SOURCE 解、答案键或选择题。

## Original PNG Observations

两张 PNG 各实际打开一次，仅作 TEXT 上下文观察。1 批 2 图，task/context 均 2，重开/裁图/现代图/parent payload 均 0；返回文字，不返回图片，不生产 inventory/spec 或图验收。

| PNG | SHA-256 | 文字观察 |
|---|---|---|
| fig-63.png | `bbf6ea8a23c1b4dc256ecbe45d9d5f2850ba9b34576147211a31415063f11793` | 下方太阳符号及九个有标签的绕行天体；内圈水金地火木，外侧弧线土天海冥，土星有环。水金地火有指示线，中文标签；无距离、尺寸或质量测量值。冥王星必须继续保留，但现代语境应标明 dwarf planet，不能删成只有八个源对象。 |
| fig-64.png | `8f0b3ef3ca8ba7d850eaaf5e8d6bcd16666371ed77a9d2297627ecd51209326a` | 一人举起一辆正面汽车，坑洼地形；车上 600 千克，向下重力箭头 1000 牛顿，图内没有 6000 牛顿标签。仅为月球较小重力的假想示意，不能当实验负重或操作指令。 |

## Actual Commands

仅复用既有 B52 TEXT 作者 helper 的执行模式，在 OWN 复制并适配本课路径、数量和语义词检查；没有改稳定 lesson/image 工具或另建 pipeline。helper 来源与字节哈希在 intake/FIRST manifest。Python 使用已有 `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`，环境 `PYTHONDONTWRITEBYTECODE=1`，cwd 为上述 checkout。

OWN/commands/<stage>/ 保留实际 argv.json、stdout.txt、stderr.txt、exit.json 和输入三模板；六个已结束处理阶段精确复制到 FIRST/commands/。freeze 自身完整调用与输出保留在 OWN/commands/freeze/，避免递归自哈希。

| stage | 次数 | exit | 内容 |
|---|---:|---:|---|
| intake | 1 | 0 | 已准备模板与完整 canonical 快照；原图文字观察、原图/索引/资料哈希 |
| normalize | 1 | 0 | 现有 normalize_lesson_layout / normalize_exercise_layout 各一次，只有正文布局改变 |
| prose-flow | 1 | 0 | 现有 prose_flow.mjs 的实际最终段落和候选相邻锚点 |
| text-check | 1 | 0 | 一次完整 TEXT source/identity/number/math/layout 契约检查 |
| text-katex | 1，text-check 内 | 0 | 15 个原数学区实际调用现有 katex_check.js，均 ok、warnings 空 |
| text-layout | 1，text-check 内 | 0 | htmlfrag.js 的实际锚点、图题配对、无孤立/跨段强调检查；不渲图 |
| freeze | 1 | 0 | 三模板完整字节副本、actualbytes/hash、实际处理命令与报告冻结 |

完整 TEXT 实际底层 argv：

```text
["/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python","-B",".tmp/ld-s10y-lesson/text-author-planets-b53/text-check.py"]
```

TEXT 缺陷/失败 0，修复 0/1、剩余 1，重跑 0，已通过门禁 replay 0；没有失败候选，不伪造 failed-snapshot。两次只读文件发现命令因附带不存在路径返回 exit 1，未执行 TEXT 门禁、没有修改文件，也未重跑原发现命令，不混计为 TEXT 修复。

## Next Boundary

FIRST 作者工作已冻结并停止，只等待唯一独立 TEXT reviewer 复用这组三模板和实际命令证据。本记录及机械 pass 不替代科学语义/儿童可读性独审，也不批准图稿、提升、发布或 batch52 提交。
