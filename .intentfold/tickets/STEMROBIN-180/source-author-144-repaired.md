# 6p 物理144页：唯一表示法修复冻结

日期：2026-11-15。身份：Codex，原源稿作者，本次表示法修复作者；不是独立审查者。

结论：B144-1的唯一授权修复已完成，官方finalize本次仅执行一次、exit 0，14块、17/17行、4图、规范化0。作者机械检查通过，**受影响独立像素/source/audit审查仍pending**；本报告不是独立批准，不授权晋升或装订。141、142、143、145沿用Sagan已冻结的批准，本次没有重新读取或改写这四页。146–150此前已完成冻结，无任务在途，本次保持不动。

## 范围与授权

```text
R = /Users/yong/.codex/worktrees/0f12/lemmadeck
B = R/.tmp/ld-s10y-lesson/source-author-141-145
A = B/artifacts/6p/pages/0144
W = B/work/6p/pages/0144
H = B/failure-01-p0144-original-circled-subquestions
```

依据用户对Sagan `source-review-141-145.md` 中B144-1的明确授权，仅修改当前144正文的三个圈号前缀：

```text
① -> $\text{\textcircled{1}}$
② -> $\text{\textcircled{2}}$
③. -> $\text{\textcircled{3}}$.
```

采用用户指定的现有圈号源编码，不改为普通编号，不改变圈号语义、编号或顺序。未读取131/135、答案、选择题或现代稿来参照修改。

手工编辑仅通过apply_patch修改A/page.md三处。官方finalize派生更新A/page.json及A/audit.json。本报告为唯一新增工单记录，没有创建第二套源流程。

## 唯一官方执行

本次修复消耗 **1/1**。本次finalize调用 **1次**；此前原始FAIL的finalize仍是历史第1次，本次是该页历史第2次。没有prepare、vectorize、独立crop命令、浏览器预览或其它门禁重试。

```bash
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .claude/skills/ld-s10y-lesson/tools/p2c.py finalize \
  --book 6p --page 144 \
  --root .tmp/ld-s10y-lesson/source-author-141-145/artifacts \
  --work .tmp/ld-s10y-lesson/source-author-141-145/work
```

真实exit：0。真实stdout：

```text
[finalize] 6p p0144: 14 块 / 17 行（印刷 17）, 插图 4 张, 规范化 0 处
    fig-131(图 131) → [268, 230, 293, 327]
    fig-132(图 132) → [867, 265, 424, 251]
    fig-133(图 133) → [297, 710, 921, 339]
    fig-134(图 134) → [1033, 1369, 191, 293]
  ✓ 通过 行数对账 + 白名单 + 公式
```

官方finalize内部按现有流程重用已收口几何并重新物化四个PNG；不能声称内部没有PNG写入。未另外运行裁图或vectorize，执行前后四个PNG字节SHA完全一致，四个既有SVG未变。

## 只读差异核对

修复前实际核对当前MD/JSON/audit与首FAIL副本一致。修复后通过Node内置fs/crypto/assert进行限定范围的结构及字节核对，没有写测试、修改工具或重新求解正文。

- A/page.md字节内容严格等于H/page.md仅在三个行首替换指定圈号后的结果，其它字符及换行一致。
- A/page.json严格等于H/page.json仅在相应blocks.lines中替换三个前缀后的结构；全部meta、14块、标签、题号、open/cont/samerow及图框完全一致。
- A/audit.json严格等于H/audit.json仅将unknown_chars及errors清空后的结构；17/17、四图几何、components/from、normalizations、katex_warnings及errata完全一致。
- U144-1保留：第三小问仍为编码后的圈号加半角点；原notes关于该点可能是标点或污点的不确定性逐字未动。本修复没有判定它是印刷标点，也没有删除它。
- W原页、网格、layout、template、两张detail和四个PNG与H/work对应文件逐项SHA一致；四个SVG与修复前SHA一致。
- H全部14文件的规范manifest执行前后一致；原作者报告、Sagan完整报告、146–150冻结报告及官方p2c/profile字节身份一致。

以上是作者机械差异检查，不是重复全文或独立图审；本次没有重新打开原页或裁图像素。像素观察依据仍是冻结作者证据与Sagan全文审查，待main安排本次受影响独审。

## 当前冻结哈希

下列均为本次实际读取字节计算的SHA-256，路径相对上述A/W：

| 文件 | 当前SHA-256 |
| --- | --- |
| A/page.md | `df6bca01b05f1b074fa8a00da3798d84c1eadf3106a6d665d683441d070b08ee` |
| A/page.json | `28a06e3bad2a7c82d656d6fa63cef6bc5741df102dca9896920f8df132b93f31` |
| A/audit.json | `19a8cb0fc535693427f18961ac103c96b882cda1d07428baf72e92f6a39b9851` |
| W/page.png | `299a9a440c949dd0f82c30bfe2ea026e7e0e25f7188b99b2f47d2219ead9bbbc` |
| W/page.grid.png | `76d9a35e706c9fca397c942d2e1de28fac9ef72f5309fdf54fcb7744816ef366` |
| W/layout.json | `762901661f66c71907c8d59f546c0eec1162e3bc04bd09fb01c91e70580c3f2c` |
| W/page.template.md | `1114b02e864f639d5ae13e427ed726dbefff90507b2f23bfb47729d11feb0f53` |
| W/detail-task-1.png | `136a2664998f71d9e1ea69bb27bf7f637aa659128bbfda620aef1895e9d8e824` |
| W/detail-subquestions.png | `00c8a90f121269b6333677c66b28ea6b4f17da2d56d325c1bfdb1967b37e40a3` |

四图框、尺寸及执行前后均未变的字节身份：

| 图 | box；PNG尺寸 | PNG SHA-256 | SVG SHA-256 |
| --- | --- | --- | --- |
| 131 | `[268,230,293,327]`；317×351 | `6cd9b3bfb0d7716f6a5520a79e2c713cb9994967e3ec48fa8a2901e7d51173c1` | `4ee46c3f4604f10d0af5f618c132dfd17277e37c3c4d837d836ec9ada4c2cbcf` |
| 132 | `[867,265,424,251]`；448×275 | `9f372ffa4fac4f737574778f44e9b27029760c6d8f206129e04f6896c1300266` | `d2f658120bbd149253f85f1510c5f2cb03509a04b2d0191698596e575a209c13` |
| 133 | `[297,710,921,339]`；945×363 | `6f452d0a6abd02e13158f6c6336b13a27e04a6e9444d291823070ab25b66be7d` | `ac9201c7491e38594de2c20e3a860f6c2489033887350c594b83239f0f0e42f0` |
| 134 | `[1033,1369,191,293]`；215×317 | `151853a5aa35d1ddf0f478fe6bbd24eb816259a6d5e91d70fcb0ac37e678f3d8` | `dc7f790ec714bd3e866387d2475b873dace4da4562d0e156a8834bcea8f97631` |

## 首FAIL与其它冻结绑定

H保持原样，未覆盖首失败：

| 文件/绑定 | 未变SHA-256 |
| --- | --- |
| H/page.md | `490411e389ec9513a51087212e46dfdcea977cc4831c3b1739920b126490d6f1` |
| H/page.json | `67b7b2253437aba745ab9f086a2a97b1ef05aae46f3e28cfaf75e448e9364ed8` |
| H/audit.json | `c35ff116ae8b511276fa266d95ab3536ad59a122e70c32206a60f6f144c61128` |
| H/finalize-result.md | `cf7b6aa422b4efbca71cd276c0a80fafd9dedfe9cde1e98c0efc06f5b5318c56` |
| H全14文件规范manifest | `48a542aa398bbd08f3a6783a38a5b0087c55ac9639bfc1ddf93e20045a417483` |
| R/.intentfold/tickets/STEMROBIN-180/source-author-141-145.md | `51fc9cb289ea6260f9012660ed93b8c7eb7587d3d6e9d65f82bdd4305fc4182b` |
| R/.intentfold/tickets/STEMROBIN-180/source-review-141-145.md | `35e7b695ea0e7bc9d4d4ca6ceaa0bd7199746ddfc722ac84fcb8cc5c19873886` |
| R/.intentfold/tickets/STEMROBIN-180/source-author-146-150.md | `ca624a5891f6f000a656ac615599b2104a6b81a43e42d505e0d067c0880ee9c5` |
| R/.claude/skills/ld-s10y-lesson/tools/p2c.py | `483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b` |
| R/.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |

H规范manifest定义：递归枚举H现有14个文件，各条为`<sha256>  <相对H路径>\n`，按相对路径字典序排序后拼接，再计算SHA-256。不包含本新增报告。

旧五页57文件manifest绑定的是修复前冻结字节，不能当作修复后current manifest；本报告仅冻结本次受影响144的当前身份，不重新扫描其它已批准页。

未改工具/profile、其它页、源PDF、图框、源图、索引、app、依赖、DB或Git；没有模型/网络服务、assemble、晋升、发布或自签review。当前修复冻结，等待main安排独立affected-only审查。
