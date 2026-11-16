# 10c p38 metadata changed-only 独立复核

日期2026-11-16；STEMROBIN-184。实际审者 Worker B / Codex，父方既有工单委托；非本页作者或本次metadata修复者。

## 结论

**限定 PASS：两项计数专用页边噪迹登记及一项notes时间线修正合法且范围准确；当前38 audit为14/14、errors空。** MD正文逐字节未变、JSON全部blocks深相等，源PNG/完整表crop/bbox未变。复用此前唯一原图/全文/表格审查，不进行新的whole-source gate。

旧 Stage B 的“38机械FAIL、具体原因UNKNOWN”是当时真实结论，原报告和首失败不改。现披露的诊断说明两条商式本来各1个band，多出的两排是右页边孤墨与底部扫描线；**不是分式误拆**。这里据现有诊断与实际指定局部观察更新受影响判定，不假称本审者运行了counter或亲自实现诊断。

35的69首行 A 后逗号/顿号，以及图21细角弧/个别箭头端连接 UNKNOWN 原样保留。此PASS不解决它们，不批准83/§17完整，不授权assembly、现代化或发布。

## 复用与此次实际观察

原 Stage A/Stage B已实际完整看过35–38及三张完整裁图；本次不重开完整原页、商式crop或完整table，不重新计行。原 Stage B `T/source-review-10c-p35-p38.md` raw SHA仍为 `84f8aad58ffe21417f9f3b52a5fcb366b016da533a914f4f741b40611790237e`。

本次先实际逐张打开指定两条现有native strip，再读取diagnostic/候选/前后diff与最新audit。`T`为workspace下 `.intentfold/tickets/STEMROBIN-184/tmp/`；`D=T/10c-p38-count-diagnostic/`。

| 实际打开的局部PNG | 现有record的源LTRB | 实际PNG尺寸 | 独立视觉事实 |
| --- | --- | --- | --- |
| `D/table-side-native.png` | `[1337,812,1636,871]` | 299×59 | 最左可见表外缘笔画；右侧有分离孤墨，无文字/数学label。批准框只围右侧孤墨，不含左侧表边。 |
| `D/bottom-native.png` | `[0,2446,1116,2515]` | 1116×69 | 断续、接近水平的扫描边线及零散污点，没有正文/公式/folio。此strip不是全1695px宽；未重看其余宽度，整页底边无教材内容事实复用原完整源冻结。 |

局部框坐标及source SHA来自现有 `extra-bands.json`，图像视觉事实由本审者此次实际看图确认。没有重生crop或重新测components。

### 两项count-only框

1. `scan-artifact [1596,828,31,28]`：范围 x1596–1627、y828–856，包含上述右侧孤墨；与表框右边x1348分离，不跨入表格/正文。现有诊断多余band y837–845对应此位置。它是右页边无教材内容区域，不是假删图内点或prime。这里不声称该框全部落在严格右侧5%内，也不重新运行现有margin guard；候选通过guard是父方记录，源无正文是本次局部确认。
2. `scan-artifact [0,2452,1695,128]`：覆盖页底至2580，位于H=2580的底部5%内（阈值2451），在原完整folio band y2266–2300之后。已有底strip实际扫描线对应诊断band y2471–2489；原冻结已确认该底部为扫描边迹，没有正文、公式或caption。该框不碰folio或完整末商式。

两框只是计数副本排除；源和crop的原字节保持。未指定人工行数覆盖，不加`↵`、删墨或改公式。候选记录的in-memory14和现有finalize14/14与本审者原冻结14排一致，非从新机器结果倒推期待。

## 精确前后diff

before：`D/before-metadata/{page.md,page.json,audit.json}`；current：`ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0038/`；after：`D/after-metadata/`。

用结构化JSON深比较和MD frontmatter/body分开比较，只读，不调用source parser/finalize/counter。结果：

- MD frontmatter仅 `/notes/5` 与新增 `/count_exclusions`；MD body字节字符串完全相同。
- JSON仅 `/meta/notes/5` 与新增 `/meta/count_exclusions`；7个blocks的全部字段深相等，包括所有公式、真实行、kind、open/cont、figure身份、bbox和caption/owner字段。
- notes[5]旧值：“不据四页边界认定83整课完成，不写counter exclusions或数学勘误。”
- notes[5]新值：“首次作者稿未写count_exclusions或数学勘误；本次仅登记母方逐像素定位的两处页边扫描噪声，不改正文和图框，不据四页边界认定83整课完成。”
- 两项kind/box/reason在MD、JSON、audit及candidate记录完全对应；reason分别明确right-margin speck不含table/text/math label、broken bottom line在完整folio之后。
- 全部其余metadata深相等：printed_lines仍14、source/profile/render/notes0–4/errata/provenance/figures不变，无数学erratum。
- audit仅 `lines_printed:16→14`、`count_exclusions:[]→两项`、`errors:[原行数失败]→[]`；`lines_md=14`、figure完整记录（含components99和原粗框from）、normalizations/unknown_chars/katex_warnings、errata及所有其他字段深相等。
- current三文件与`after-metadata`三文件分别字节相同。before三文件raw SHA正是原Stage B记录的失败snapshot，没有覆盖首失败。

现有 `finalize-command.json` 记录父方metadata变更后的实际调用：

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 38
```

record为exit0、signal/error null，时间06:16:49.372Z–06:16:49.818Z；stdout实际记录7块、14行（印刷14）、1张表、normalizations0及PASS，stderr空。此前首次作者finalize exit1仍保留。本审者没有重跑上述命令或检查工具实现。

## 当前 raw SHA256

| 文件 | 原FAIL / before | current（与after原字节相同） |
| --- | --- | --- |
| page.md | `42c1e2bef45a048e65436f60789ee3f6deb3c420741cebbd00fa4932acd0ce69` | `40e7f6c144114056fb8b1b3d5b324fc0dbec6cf90885f11a7d7feb5e92942df1` |
| page.json | `1b8ddae67b63ec0335fb919fdb5d3f2ba20587a44df5e9cda592dd818a0a8f62` | `3a493b149906d5f08713c9137f842b41b3f792120c21ef3cb69049c625132321` |
| audit.json | `38b507026dbdaa7ae478b150a1c848b04da3001c7846572b65f65127bc85efd0` | `9b32c39a0f3cd51eb3e43ba10b87e07313bfe6ada37ec59bf44ce0fa580e47fe` |

不变资产：

- `.tmp/ld-s10y-lesson/10c/pages/0038/page.png`：`240b9f30df2c58441a0811d79caa6028f646cf571bebaddd0061a46ccc90b199`，1695×2580，与原freeze同。
- `.tmp/ld-s10y-lesson/10c/pages/0038/figures/tbl-p0038-01.png`与`D/after-metadata/tbl-p0038-01.png`：`5efbd8da9ee3dcbaa1f50bd9b40315d4647f8c0a3705f15185b959a1cd301ba9`，1141×580，与原完整crop批准时同。MD/JSON/audit框始终 `[231,775,1117,556]`。

此次实际观察/读取的证据：

- table-side-native.png：`3d72477c411d78f97e0444316596bc81c4e9fc6419644485fda1d25032606483`。
- bottom-native.png：`d20e61772ea82ab7e10142ccf83935ef98ceeffd559eff8c22b25160f58079c6`。
- report.json：`f00a6836c4947c82deafa5671c1de6d88789c3769bd3e7958b6363f88920c934`。
- extra-bands.json：`b96aced0af184e0905316b2b035ab31f4a6ca18747971c9254385192164670ca`。
- candidate-exclusions.json：`f389d8aa1ad46c2fc9acddbe4f7fb095df626d1a44df97ae911d4327eb6631ee`。
- finalize-command.json：`88444024d136ffacc6ca20fd070b11ca47dd1ef520d4310cd2e1d1f10f7358c2`。
- finalize.stdout.txt：`3adf21aee850a50e179269f1d61e00ff0d72385ec244a42869ecaf19a4737433`。
- finalize.stderr.txt：`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`。

## 不可变停止

只新写本报告。没有重新看完整页/完整crop、源正文/math review、计行、finalize、测试、工具/源编辑、assembly、现代、答案/choices、Git、DB、网络或浏览器。原35–38Stage B raw SHA不变；39–42原图冻结也保持 `68cd478a852dab7c538cb4d604c3c18cc0e6108741b109150a2500575cd8788c`，不因本metadata复核扩大其Stage A权限。

38本次metadata及受影响14/14绑定限定PASS，35原UNKNOWN仍在，无运行中进程；停止该受影响复核，不自动执行assembly/现代/publish。
