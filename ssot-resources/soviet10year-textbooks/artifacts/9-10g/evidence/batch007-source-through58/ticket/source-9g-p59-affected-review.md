# STEMROBIN-184 · 9-10g p0059 · R1/R2 affected review

## 限定结论

**PASS-AFFECTED：原唯一完整StageB的R1、R2已按授权精确修订，MD/JSON同步。**

本报告只检查p0059#5首行合同式及`notes[1]`的图面朝向表述，并作差异/字节保护核验。不是第二次完整source gate，不重新判源字、不重新求解或纠正反身性的数学问题，也不重新检查图形。

其余内容沿用不可改的唯一完整StageB：
`.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-independent-review.md`，
SHA256 `065360b056bfcedf6e17cdceb2ed1b7deef294b90ddf23cbe4e62c0ffc69ae22`。

**该限定通过不等于无保留整批/整课SOURCE PASS。** p58 C1/C2及此前全部字形UNKNOWN继续保留；图61 owner160、161 open及§15 open不变。§14右边界仍仅复用158之后的已见§15标题，不作更广课程完整性声明。

工作区：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。

## R1：首个合同式的原下标1恢复

当前文件：
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0059/page.md`第66行；
对应`0059/page.json`的`/blocks/4/lines/0`。

唯一的公式替换为：

```text
before: 反身性（$\Phi\cong\Phi$）
after:  反身性（$\Phi\cong\Phi_1$）
```

整个目标行现在为：

```text
从位移的性质а) — в)得出图形合同具有反身性（$\Phi\cong\Phi_1$），
```

MD与JSON目标行一致；恢复的是已接受StageA冻结的字面右下标1，而不是重新选择数学上合理的式子。没有改“反身性”、左Φ、合同符号、范围а) — в)、标点，或该段后续对称/传递公式及`\Phi_2\cong↵\Phi_1`断点。

判定：**R1 CLOSED（限于原修订要求）**。原反身性表述的数学问题未在本轮纠正或解答；没有打开源图来新增字形判断。

## R2：note仅述图面朝向，不述垂直关系

当前`0059/page.md` frontmatter第15行的第二条note，
对应`0059/page.json`的`/meta/notes/1`。

精确替换为：

```text
before: 垂直穿越平面的线在下部部分为虚线，其余实线
after:  图面近竖向、穿过平面的两条对应连线在下部部分为虚线，其余实线
```

MD frontmatter与JSON meta同步。新表述明确“图面近竖向”，不再把画面方位称作直线与平面垂直。note的其他字节不变：图61归属160、两组对应点、三个无名点、连接线及实虚区别均未改；源题干`(MM₁) // l`、α平分MM₁、α内点固定的原规则未改。

判定：**R2 CLOSED（来源说明文字限定）**。没有修改crop、图标签、点名、图框、图形或增加直角/垂直给定。

## 差异及同步核验

- `before/0059/page.md` → `after/0059/page.md`的只读diff只有两处：上述note片段及首式右下标。将before文本只作这两处指定字面替换，所得文本与after全字节一致；不存在第三处MD变动。
- JSON结构差异只有`/meta/notes/1`、`/blocks/4/lines/0`。其他meta、所有其他块/行/类型/label/box/owner、open/cont/samerow及目标段的第二行均未变。这是差异保护，不是把未变内容重新做完整gate。
- after MD frontmatter JSON与after `page.json.meta`结构一致；目标公式行在两种表示中一致。
- 当前durable MD/JSON/audit分别与after快照和`after.json.targets`的SHA一致；before三文件分别与`before.json.targets`及原StageB绑定一致。
- p0059 audit的before/after/current为同一SHA。没有重算印刷行或人工计数，也没有给行数override或排除区。
- JSON中的图61仍是`fig-61`、`owner_exercise: "160"`；161块仍为label`"161"`、`open: true`。160图前open/图题samerow/图后cont及其请求不变；§15未闭合。

## 当前产物与快照绑定

durable根：
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0059/`。

证据根：
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p59-targeted-repair-evidence/`。

| 文件名 | before快照SHA256 | after快照与当前文件SHA256 |
| --- | --- | --- |
| `page.md` | `24e9bb98504e6f2f4596a34891e36a44b4b7829064ea999d20e62e6c8e56ccf7` | `a9e1f7175028521d2e7fd3d6194ff7f21cdcb5782f13c66f0ba038defb3bf1ab` |
| `page.json` | `99b0adb7364f24784f2a1f66f458994f1598aa84758702d909ee45ae97a6f797` | `398b385f47908b407ee0cd87eb519bc4f7150943a269e3e9930190767a2b40b8` |
| `audit.json` | `2864760f507dc5ce2b4cc3fc1b4d695099b54cc0fa9405aa0b1e25023b3f252a` | `2864760f507dc5ce2b4cc3fc1b4d695099b54cc0fa9405aa0b1e25023b3f252a` |

before快照路径为`before/0059/<文件名>`；after为`after/0059/<文件名>`。这些绑定的是实际文件，不是重建before内容或修改历史快照。

### 修订证据摘要

| 相对证据根的文件 | raw SHA256 |
| --- | --- |
| `before.json` | `cfea766503687e92b63e4e59e2633ff9f773befaee34f41462424572bc167de0` |
| `after.json` | `d80928f788e87a611ad02240f79788dc14221a0ed34a04a384a412efa7cec844` |
| `finalize.command.json` | `97fdbbc6ef1ddc0b2cb046ab99e7870f0e059c57ee0c284c987bbbe2c2a18621` |
| `finalize.stdout.txt` | `0139ea774b9814c24a65f3351b58752b29a037b6b53c911edcd42e9e1bf7dcd9` |
| `finalize.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

完整读取before/after证据JSON及已有command/stdout/stderr；没有读取或执行父方repair脚本。绑定command记录的实际子命令为repo的Python带`-B`执行`p2c.py finalize --book 9-10g --page 59`，cwd为本工作区；时间为2026-11-16 `11:57:55.097Z → 11:57:55.399Z`，exit0、signal null、error null、stderr空。

stdout既有结果为13块、25/25行、图1张、规范化0处、图61精框`[693,1268,517,462]`。这些是父方已运行一次的冻结证据及母方明确授权事实，本轮只读取，不执行该命令、不复算行数，不以机械PASS替代源审查。记录本身不用于推断任何未记录的外部操作。

## 受保护内容不变

对`before.json.protected`的34个路径，逐项核对`after.json.unchanged`中的相同SHA/true及当前raw bytes摘要；全部一致，没有遗漏或漂移。没有语义重读这些未变源页或重新载入其图片。

该保护集合包括：

- p0056/p0057/p0058各MD、JSON、audit。
- p0056–59全部证据列出的当前scratch page.png、page.grid.png、layout.json、page.template.md及四张crop。
- StageA、原唯一完整StageB、作者报告、作者manifest与现有book.json。

四份历史文本当前SHA仍为：

| 历史文件（工作区相对路径） | raw SHA256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-independent-source-first.md` | `a24a8e7d01591a87d21d0763d973f3784daf14da52434e380282bd39b21c9a30` |
| `.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-independent-review.md` | `065360b056bfcedf6e17cdceb2ed1b7deef294b90ddf23cbe4e62c0ffc69ae22` |
| `.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-author.md` | `9683e55d4a5503b30fa44ec77a579f851b63b13c0ff8181bd4ef97b070c2902a` |
| `.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-author.manifest.json` | `cfb4c17a4110b79a6a3f293a57b15db656a74f05f033bd8e7987c5a19ae128c5` |

book.json当前SHA仍为`09b7503438ca530df95ef569c48d762e1f8fb8e8fc8ceb384995074008065e24`；这里只核对摘要，不读其课程索引内容或更新索引。

p58 C1/C2原标点冲突没有被本次修订触及。所有此前字形UNKNOWN，包括Z下标O/0、首а码点、边界P/p、合同token、159圈/点、M∉α细部、l/L及图58小附笔，继续按原报告限制保留，不能被本次限定PASS推定为已解决。

## 停止与预算

本轮新增图像载入为0，没有打开original page或crop，既有8/8批次预算不增加、不重置；无第9张图片。只读文件差异、结构化JSON及raw SHA核验不是源图重开、行数重算或源求解。

本轮仅新写本报告。未编辑源页/历史文本/作者包/索引/图形/答案，未运行repair/finalize/assemble、模型服务或生产流程，未stage/commit/push、未访问DB/app/browser/生产。

最终限定状态：**R1与R2已闭合；复用原完整StageB，不追加完整gate；UNKNOWN、owner160、open161及§15范围限制维持，停止。**
