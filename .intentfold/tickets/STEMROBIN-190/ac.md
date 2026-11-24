# ac — STEMROBIN-190

验收对象是生产流程的工具与文档,不是 web 产品页面,所以除最后一条外都用可失败的命令判定。
每条都给出使**它变成假**的方式,否则不算可失败。

## AC1 — 计量文件记录本次 session 的四个实际 token 数字

```bash
cd <worktree>
python3 .claude/skills/ld-s10y-lesson/tools/meter.py record \
  --repo . --ticket STEMROBIN-190
python3 -c "import json;s=json.load(open('.intentfold/tickets/STEMROBIN-190/production/checkpoint.json'))['sessions'][-1];\
print(s);assert all(isinstance(s[k],int) and s[k]>0 for k in ('input','cached','output','total'))"
```

为真:`sessions[-1]` 的 `input` / `cached` / `output` / `total` 四项都是正整数。
为假:任一项为 `null`、缺失或 0 → assert 失败。

**grill Q3 已定:必须先跑完一课离线生产,再读计量文件。** 顺序:

1. 选一课跑完整离线生产(备料 → 作者/复核 → 保留 → render),优先选图全为确定性渲染、
   无需新付费生成的课;若唯一可行的课确实需要新付费图像生成,先问人。
2. 该 session 结束前跑上面的 `meter.py record`。
3. 读 `sessions[-1]`,四项为正整数。

为假的另一种方式:把 `--transcript` 指向一份 usage 全为 null 的构造转写,四项应为 0 或
写入被拒,而不是落下假数字。

## AC2 — 聚合结果与转写自身的用量记录一致

```bash
python3 .claude/skills/ld-s10y-lesson/tools/meter.py read --transcript <本次 session 的 jsonl> | tee /tmp/m.json
# 独立用 jq/python 直接从同一 jsonl 累加 message.usage 的四项,比对
```

为真:两条路径算出的四个数字相等(或差异可逐项解释,例如统计口径里是否计入
`cache_creation`)。为假:数字不等且无法解释。

## AC3 — 越界写入明确失败,不截断不通过

```bash
# a) 超长字段
python3 .claude/skills/ld-s10y-lesson/tools/checkpoint.py set-lesson --repo . --ticket T --lesson x \
   --stage held --note "$(python3 -c 'print("长"*300)')" ; echo "exit=$?"
# b) 超体积
# c) 未知键
# d) 闭集外 stage
```

为真:四种情况全部非零退出,stderr 指出越界字段与上限,且 `checkpoint.json` 的
mtime 与内容不变(写入前自检拦下,未落盘)。
为假:任一情况退出 0、静默截断、或文件被改写。

## AC4 — 存量 checkpoint 字段长度全部在阈值内,由命令判定

```bash
python3 .claude/skills/ld-s10y-lesson/tools/checkpoint.py check --repo . --ticket STEMROBIN-190 ; echo "exit=$?"
```

为真:退出 0。为假:退出非零并列出越界字段。
同时:对一份人为注入超长字段的副本运行同一命令必须非零退出 —— 证明这条检查真的会失败,
而不是恒为真。

## AC5 — SOP 以"结束本 session"收尾,且检索不到两条废止规则与历史记录段落

```bash
grep -n "continue the next authorized lesson without waiting" \
     .claude/skills/ld-s10y-lesson/references/production-resume.md ; echo "exit=$?"   # 期望 1
grep -n "context compression is not a completion condition" \
     .claude/skills/ld-s10y-lesson/references/production-resume.md ; echo "exit=$?"   # 期望 1
grep -nE "^> (Migrated|Consolidated|Revised)|历史变更|迁移注记" \
     .claude/skills/ld-s10y-lesson/references/production-resume.md \
     .claude/skills/ld-s10y-lesson/SKILL.md ; echo "exit=$?"                          # 期望 1
grep -n "结束本 session\|end this session" \
     .claude/skills/ld-s10y-lesson/references/production-resume.md ; echo "exit=$?"   # 期望 0
```

为真:前三条 grep 无命中(退出 1),第四条有命中(退出 0),且交付顺序的最后一步就是它。
为假:任一条反过来。

## AC6 — 被删除的禁令逐条可指出去向

**grill Q2 已定:覆盖四个技能** —— `ld-s10y-lesson`、`ld-s10y-answer`、`ld-s10y-image`、
`ld-s10y-choice` 的 SKILL.md,以及共享 SOP。

为真:`handoff.md` 含一张映射表,左列是从这五份文档里删掉的每条禁令原文(或其可定位摘要),
右列是它现在由哪个检查器的哪个判据执行,或"不再需要"及其理由。表的行数等于 `git diff`
里删除的禁令行数,可逐条对上。
为假:存在删掉却在表里找不到的禁令。

## AC7 — 项目机械防线全绿

```bash
python3 ssot-resources/audit.py
python3 ssot-resources/soviet10year-textbooks/validate.py
node --test .agents/skills/lib/content-db.test.mjs
cd app && npm run test && npm run build
```

另加本工单自带的两个测试:

```bash
python3 -m unittest discover -s .claude/skills/ld-s10y-lesson/tools -p 'test_checkpoint.py' -v
python3 -m unittest discover -s .claude/skills/ld-s10y-lesson/tools -p 'test_meter.py' -v
```

为真:全部退出 0。为假:任一非零,原文记录。
