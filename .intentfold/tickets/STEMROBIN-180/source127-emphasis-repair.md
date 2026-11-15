# 127 强调缺失最小修复

2026-11-15。仅按授权修复独立源审的F127-1；
不是作者自批、独立源审PASS或126–130整体晋升。
完成后停止，等待Sagan affected-only review。

## 发现与首拒绝保留

完整读取冻结source-review-126-130.md中127的具体发现：
p0127#1 / JSON blocks[0].lines[3:5]缺失“故”之后跨两行
结论的加粗。实际打开同一原PNG的独审局部证据
tmp/source-review-126-130-evidence/0127-gas-conclusion-detail.png，
仅核对本次受影响强调，不重审整页或其他页。

修复前实际字节比较确认rejected-127-first三文件与当前127相同，
且hash与独审冻结报告一致；修复后再次核对三份首拒绝hash未变。
没有覆盖、移动或修改首拒绝证据。

| 首拒绝文件 | 字节 | SHA256 |
| --- | --- | --- |
| page.md | 2517 | `f5bee6441d63820771726814d3a1385388f4ee611a0337594c2d239ae7ce44d3` |
| page.json | 5574 | `7fa7ab6d72af783fdb5eb3c466ffe4a3da34380b3cc961280cc4c61784f32718` |
| audit.json | 654 | `7822b0a8aec671729ee323392f7cd969d711bca416fc6217cefe07924c43b72e` |

保留目录：
`.intentfold/tickets/STEMROBIN-180/tmp/source-review-126-130-evidence/rejected-127-first/`。
首拒绝F127-1仍是本轮历史，不以机械20/20抹去。

## 唯一编辑与官方收口

通过apply_patch仅编辑持久pages/0127/page.md两行：

```text
可以自由地向各个方向运动，故**气体就要占满它所能占有的
全部体积**.
```

新增两处ASCII `**`，共4字节；“故”和末句点不在加粗范围内。
字词、标点、换行、空白、块头、行数、图框、题号和其他元数据不变。

仅运行官方finalize一次，使用指定共享venv及禁写bytecode：

```bash
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 6p --page 127
```

exit=0，实际输出：

```text
[finalize] 6p p0127: 15 块 / 20 行（印刷 20）, 插图 2 张, 规范化 0 处
    fig-108(图 108) → [341, 1557, 220, 151]
    fig-109(图 109) → [935, 1410, 250, 367]
```

行数对账、白名单、公式机械检查通过；audit中的errors、
normalizations、unknown_chars、katex_warnings均为空。
finalize调用1次、失败0次；人工修复单位1个，未追加修复。

## 差分与裁图不变证据

只读Node断言实际验证：

- 新MD严格等于首拒绝MD仅在指定两行插入两处 `**`。
- 新JSON逐结构等于首拒绝JSON仅修改blocks[0].lines[3]和[4]，
  全部meta及其余块保持相同。
- 新旧audit逐字节相等；仍15块、20/20行、2图。
- meta.figures和两个fig块几何完全相同：108框
  `[341,1557,220,151]`，109框`[935,1410,250,367]`。
- 原page.png、page.grid.png、layout.json及两图PNG/SVG
  共7份文件的完整字节hash与修复前基线相同。finalize复用旧精确
  图框，虽重新保存页级PNG，PNG字节未漂移；未运行vectorize。

| 当前持久文件 | 字节 | SHA256 |
| --- | --- | --- |
| page.md | 2521 | `f4aff7a39367e0b367019df3b4448b9cf30f4cecbea46b71c1b599572296ae96` |
| page.json | 5578 | `703a850bc980682da649d4f7c05e513f26a97782129c724d757c89b306509f09` |
| audit.json | 654 | `7822b0a8aec671729ee323392f7cd969d711bca416fc6217cefe07924c43b72e` |

以下路径均在`.tmp/ld-s10y-lesson/6p/pages/0127/`，前后hash一致：

| 文件 | 字节 | SHA256 |
| --- | --- | --- |
| page.png | 69494 | `713420e2b59716ace41ba57e140c6a6f467506e6a71371a5a0f6752fb7541d61` |
| page.grid.png | 85874 | `c1fc79327bf62a609c70b938bb4683a68581160326687029c07d5da3f2cd2757` |
| layout.json | 991 | `406a22bd85c84723c5d4d50fc3ed79cf19c5d20e73708ee654e9475645862823` |
| figures/fig-108.png | 2601 | `17dae0c54faaee65a316f5e84b5619fb2aec1042309ed645a6e03856fd306359` |
| figures/fig-108.svg | 8817 | `fa9f22545758dc7e1e62c1517686ce44842ddbea9e89f76782b7bd6d27a33d39` |
| figures/fig-109.png | 4118 | `d571377564117c161d5ed714ad5434314ca6d955cdf16bfa3c5418f0ba28ea61` |
| figures/fig-109.svg | 17236 | `bc2f016ddb6353303a77573434a43168a96ce797397c840a09e1a3c6e0ff70f4` |

完整字节SHA256，不是canonical摘要或视觉裁图重新批准。
只读修复差分/裁图不变断言失败0次。

## 路径探测与停止

修复前首个基线探测命令exit=1：试读尚不存在的全书图库
`artifacts/6p/figures/fig-108.png`时ENOENT。这不是源缺陷或
finalize失败；页级两图PNG/SVG均存在。随后只对实际页级文件
取得基线并完成前后核对，没有创建全书图库或重装订。

未修改126/128/129/130或s31/s32/s33答案，未更改工具。
未vectorize、assemble、重审、发布、DB、Git、浏览器、服务或安装。
无遗留工具session。仅交付此受影响修复及官方机械证据，停止等待
Sagan核对F127-1；不声称独审通过或§52闭合。
