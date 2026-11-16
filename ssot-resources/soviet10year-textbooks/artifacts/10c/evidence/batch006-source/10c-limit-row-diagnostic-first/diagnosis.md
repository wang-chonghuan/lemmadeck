# 10c p15/p16 limit-row read-only diagnosis

## 范围、版本和证据顺序

本记录是现有 STEMROBIN-184 委托下的工具诊断，不是新 source review、修补或放行。先复用独立源审已冻结的 p15/p16 真实 22/20 行与局部 1/2 行事实，读取初诊 JSON 和实际 production 实现，再观察初诊目录现存六张局部图；未重开完整原页、读取 unit tests、执行分段函数、测试或 finalize。p16 转录 findings 与 p18 字形未决不在本次修稿范围。

初诊 `diagnostic.json` 的 `exit=1`、五项 `unresolved` 和失败 audits 原样保留。六张局部 PNG 带初诊红/蓝行带覆盖线，不是假称新生成的无覆盖原 crop；原字形和行间关系仍可见，与先前完整原图冻结一致。两个整页 counting-mask PNG 仅核对哈希，未打开。

- 当前读取 `layout.py` SHA-256：`c56e7727a71671ef3f497367e6d3fc9c5ea0189d6e3c9fd07b892cc883725d4f`。
- 初诊所执行 `layout.py` SHA-256：`887b464fbf1bf8bef65d6a6070e29475dc01100fa154abf84d69dce82ad18fc7`。
- 初诊 JSON SHA-256：`e5612a99a97a2bf3267ffbccb687fa7a1423f02ec93602397d6d7122b76a538b`。
- 独立源审 SHA-256：`4118a801804bdb872e18e1f661edf4d97975a2d06fe982e8bc1818af0f8d21e4`。

当前代码不是初诊执行版本，因此下列具体运行数值归属初诊 trace；当前代码行号用于定位仍存在的相应判据，不宣称重新复现了当前版本。只读原字节比对确认 `diagnostic.guarded_files` 中 p15/p16 PNG、layout.json、MD、JSON、audit 共十文件全部仍与初诊哈希相同。

## 定点原因

坐标均为原页坐标，行带端点 inclusive；component box 为 `[x,y,w,h]`。

| 局部事实（源先冻结） | 初诊带/决策 | 实际原因与当前代码定位 |
|---|---|---|
| p15 行14 `lim sin x = sin x0` 是 **1 行** | `[1438,1474]` 和 `[1492,1506]`，各 count=1 | 主带与下标带距离 `1492-1474=18`，超过 merge_gap=16。第二轮 joined 的全行中心/宽度判据不能识别贴在左侧 lim 下的短下标；fraction_spill 又要求更高的主带。不是 expansion 把本行一分为二。见 335–352、365–396。 |
| p15 行20“于是，”与行21完整极限商式是 **2 行** | merged `[2016,2225]`，height=210；`round((210+34)/77)=3`，最终等分成三带 | 初并阶段小间隔把正文和高公式并成一个 envelope；expansion 按正文 pitch 推算三行。其普通投影 glyph_rows 实际只有 `[1,44]`、`[68,178]`；第二个高片段是商式内部，而非两个独立正文行。整个 envelope 的 single_fraction=false 正确说明“不是单行”，却不能说明“是三行”。见 336–353、419–459。 |
| p16 行4 三题并排求极限是 **1 行** | merged `[540,630]`，height=91；glyph_rows `[1,39]`、`[52,90]`；compact_text_rows=true；count=2 | 第一片段是主式/题号，第二片段是三个 lim 的小下标及其中的 π/2，横向错位累成 39px 高投影。`glyph_rows` 实际来自全宽投影，不是普通字号连通域。见 422–434、449–452。 |
| p16 行5 三题并排求极限是 **1 行** | `[677,779]`，height=103；glyph_rows `[1,49]`、`[54,102]`；compact_text_rows=true；count=2 | 相同误判：π/4 与其他短下标在不同 x 上/下错位，合成第二个 49px 投影。其成员并不是完整普通字行。 |
| p16 行6 两题并排求极限是 **1 行** | `[803,916]`，height=114；glyph_rows `[12,60]`、`[71,113]`；compact_text_rows=true；count=2 | 两个分式下标合成 43px 投影，仍无第二条完整主式。边侧小污墨会影响全宽 envelope，但不是必须遮除才能修复的正文，也不支持更改 exclusions。 |
| p16 cases 第一/第二分支是 **2 行**（反例） | `[1209,1370]`，height=162，count=2 | 两条“当…时”各有完整普通字号字群，第二行还有独立的 1；这不是极限下标。单行分式检查对整个 cases=false，原两行结论必须保留。 |

### 不是“把 gap 调大”能共同修复

p15 行14主带高37、下标带高15，页面 line_h=43、glyph_h=40。下标属于 components 380–384，高仅 3/8/13/14/15；主式有 24–34px 的 normal-height components。主带横向完整 component 包络约 `[677,1029]`，下标约 `[678,750]`，宽比约0.207，中心和差约278px，而 joined 的 aligned 门限为43px、宽比下限为0.65。fraction_spill 的短片段分支还要求主带至少 `1.35*43=58.05px`，实际37px不满足。即便已保存的 combined single_fraction 检查 true，joined 的前置几何条件也不允许该路。

还须注意该 true **不是实际分式证明**：初诊返回 rules `[870,900]`，实际就在等号两条横笔的 x 范围；源行根本没有普通分式。不能直接把“combined single_fraction=true”当作任意邻带应合并的充分证据。

p16 页面 line_h=46、glyph_h=45。行4/5/6 的下标 components 分别最高22/23/22px，均低于现有 ordinary-component 高下限 `0.6*45=27px`，而主式题号/lim 有33–40px components。可是 expansion 的 `glyph_rows` 只检查**投影片段**高度：分散下标构成39/49/43px高片段，就被误认成 ordinary rows。

这三个局部的 single_fraction 在两个尺度都于“无 rules”返回 false。实际 π 分式横线宽分别26、24–25、23–26px，小于 `0.7*45=31.5px`，且处在整体 envelope 的下部；它们不是主式中部的普通分式线。降低该宽度/位置门限会扩大等号、汉字笔画等误认范围，不能作为通用修复。

### 大商式的另一个关键

p15 商式 numerator/denominator 各自包含正常高度的 lim/sin/cos，不能仅用“删掉所有小 components”解决。初诊中长规则如 component606 `[845,2143,191,7]`、605 `[700,2143,94,5]` 和608 `[1084,2145,122,6]` 有明确分式上下归属；lowest components643–647（y2205起）是 denominator lim 的下标。它们与主公式属于一个表达式，而“于是，”的普通字群在 x339–443、y2016–2061，是另一个真实行。whole-band single_fraction 的 false 保留这两个行群是合理的；当前 binary single/not-single 无法把高公式归并后再得到行群数量2。

共同根因是：**把纵向投影片段高度/正文 pitch 当作独立印刷行证据，没有在该局部区分普通字行与有横向归属的上下标/分式层级。** p15 的短下标是同一缺失归属在 joining 的另一表现，并非五项都走同一代码分支。

## 最小通用修正建议（父方实施前需 focused 验证）

建议仅在“短片段邻接”及“高 band 拟 expansion”这两个歧义入口共用一个局部 component-support 判定，不调整全局 INK_THRESHOLD、ROW_INK_MIN_RATIO、GLYPH_GAP_FACTOR、正文 pitch、folio 或 exclusions，也不按页号/题号/作者行数分支：

1. 普通行支持应取正常字号 **components 的实际位置**，不是原全宽 `_row_fragments` 的高度。保留现有普通 glyph 尺度判据作为候选，不把孤立的小字行自动丢弃；缺乏支持只表示“不能据此新增 ordinary row”。
2. 对相邻小片段仅在其 compact components 可横向归属到上方局部字群、没有第二个普通行支持、且间距/组合高度仍在字体尺度的近邻范围时，允许作为附属笔画并回父行。检查局部 x 字群，不强求整行中心对齐；p15 行14应由此连回。不能仅因“短、在整行 bbox 里面”就合并独立数字或短标号。
3. 对高 band 保留实际长分式规则的上下归属，先形成局部表达式行群，再作行数判断；只对有独立普通字行支持的群增加行数。p16三排应各只有一个主行群。p15“于是”保留独立群，后面高商式的 numerator/denominator/lim下标归属一个公式群，结果2，而不是把整个 envelope 强制改成1。
4. 复用既有单行分式保护，但对候选公式群而不是“正文+公式”整个 envelope 使用。附属归属未能建立时保留失败，不以 `count=len(glyph_rows)`、`min(count,2)` 或手工 cap 获得绿色；也不能把等号横笔当作任意分式归属凭据。

这是局部修正方向，不是已实现、已验证算法。现有 JSON 足以定位上述失败及设计独立预期；尚未证明某组新阈值普遍安全。单凭像素几何无法可靠区分一个任意小字号独立行与外观相同的下标时，必须停留在不确定/原失败，而非伪造来源行数。

## 独立预期正反例

下列预期来自既有源事实或人工指定 synthetic 行，不来自函数输出。建议父方之后的 focused 验证覆盖；本次没有创建/读取/运行 tests。

| 例 | 人工构造或已有源事实 | 独立 expected |
|---|---|---|
| 真实正例A | p15 行14原 crop，lim下的 `x→x0`，无第二主式 | 1 行 |
| 真实正例B | p16 三个并排求极限 crop，各题号与主式同排，低位 π/2、π/4 不另行 | 每个 1 行 |
| 真实正例C | p15“于是”+完整嵌套极限商式原 crop | 2 行，不是1或3 |
| 真实反例D | p16 cases 原 crop，两条“当…时”分别完整，第一分支含分式 | 2 行，不能因存在分式合并 |
| synthetic E | 明确字号尺度g=40；主字群高32位于y100–131；三个横向独立表达式各有h12小下标位于y150–161，其中分式下标的两层h12分别在y146–157/y167–178；这些都人工声明属于同一主式行 | 1 行；横向错位不增加行数 |
| synthetic F | 两条人工独立 ordinary 行；每行重复的24×32字群分别在y100–131和y154–185，第二行不是任何 operator 的附属部分；可由共同 brace相接 | 2 行，即使 band 连续/有共同brace |
| synthetic G | “于是”普通字行y100–139；第二条数学行有明确长规则y235、numerator y180–219、denominator y250–289，lim小下标继续到y310；所有上下层都人工指定属于第二式 | 2 行，不能用整体高度/body pitch推3或4 |
| synthetic H | 单条行内/嵌套分式，明确连续规则包住上下层，旁边同排普通字/运算符，无第二条独立文字 | 1 行；保留已有单行分式保护 |
| synthetic I | 一条普通字行后独立完整数字/标号行；第二行24×32字形在y154–185，横向可能落在上一行包络内 | 2 行；“小宽度+横向包含”不充分 |
| synthetic J | 三条明确独立小字号脚注行，各重复14×18字群，y100–117/125–142/150–167，无局部operator附属归属 | 3 行；不能按正文g=40一概丢弃small components |

如果 focused 实现要求更精确的 source support 或 synthetic glyph topology，应先固定上述数学/排版归属再构造像素，不从新函数返回值倒推 expected。真实整体预期仍是 p15=22、p16=20，但只有局部正反例均成立之后才可由父方实际 finalize 验证，不能以总数相抵替代正确分段。

## 观察哈希与停点

| 实际打开的已有局部 PNG | SHA-256 |
|---|---|
| `0015-sine-limit-source-row-14.png` | `f8ababd0a7fd6443e05a1b3a8da384e0ef232e6d48b7e106b0fc505a262c14c9` |
| `0015-thus-and-limit-source-rows-20-21.png` | `7f311a0114d1f3224a7a700a55e3930204a7da8c9d34c09469f8eb52d7d58953` |
| `0016-parallel-limits-source-row-4.png` | `b1d473534029acf5009bcbde3ab3447409dccf6af4a3505f657b8dde842de12a` |
| `0016-parallel-limits-source-row-5.png` | `287c6c596b0f131146494d0f75c6160d36edb8d0d1767d2aeb31f8a37220fa40` |
| `0016-parallel-limits-source-row-6.png` | `2de7767aa7fab8e6a07247c9d91af36201b9e702990ff718eaec4735df3f45b3` |
| `0016-cases-source-rows-10-11-control.png` | `df51ee654c28d627fa3c30132a33f8449f42ba34c38fce9419f6a130ae4d8b89` |

结论：五处 unresolved 原因已定位，最小建议是局部主行/附属表达式归属，而非总数补丁。首失败、source bytes及六crop全部保留；本次唯一新增文件为本 diagnosis.md。不报告工具修复 PASS，不解除 p16/p18 内容 findings，不放行第五批。无运行中进程、browser 或后续自动动作，交父方后停止。

## 后续授权实现与 focused 验证追加

前文原诊断与停点原样保留；下文是随后明确授权的实施记录，不把先前未实施状态改写成历史 PASS。本次追加前本报告 SHA-256 为 `78d1190eeb2c5e82dfabfdef5e36a76ee0fba7e31662e1cae6751409302d2a23`。本次追加未重新运行任何测试。

### 实现绑定

仅修改 `.claude/skills/ld-s10y-lesson/tools/layout.py`，新增 `.claude/skills/ld-s10y-lesson/tests/test_limit_subscript_rows.py`；源 MD/JSON、索引、依赖、图和应用均未改。

- `_merge_close` 对重叠/内含区间取 `max(existing_end, incoming_end)`，避免已恢复的完整 glyph 被内部短投影缩短。
- joining 的 `_subscript_continues` 根据下方小 components 与附近上方局部字群的尺度、宽度、中心匹配识别归属，不要求整行中心相同；完整 ordinary-height 下行阻止合并。
- expansion 对同一局部归属提供保护，避免不同列 lim 下标叠加的高投影被误算为独立正文行。
- `_fraction_tail_split` 以实际宽规则及既有单行分式判定分开普通前行与高分式尾部；也处理二者因投影间隙暂在相邻 bands 的情况。“于是”仍独立，不将两行整体压成一行。
- `_small_text_rows` 保留多个由重复、同尺度小字 components 独立支持的紧凑脚注行；不将“小于正文”直接判成下标。
- 全局 ink/投影/gap 常量、folio、排除区规则及原有单行分式判据未改。没有页号、题号或人工总数覆盖分支。

当前实际哈希（追加时再次只读核对，与已验证实现相同）：

| 文件 | SHA-256 |
|---|---|
| `layout.py` | `f1cf22ba2bf945665bd607fbe2b74adc01006215a39fecf54a1f8d41a6b9e20c` |
| `test_limit_subscript_rows.py` | `c6013ed496c26cee8d013e70d6faa369a79932ab6bc63da93c611a9e27eb1764` |
| 原 `diagnostic.json` | `e5612a99a97a2bf3267ffbccb687fa7a1423f02ec93602397d6d7122b76a538b` |

### 真实迭代失败（不删除或改预期）

相同新增模块 discovery 命令先后三轮 exit1，然后第四轮 exit0。预期 1/2/3 行、真实页22/20及区域归属均未降低：

1. 首轮 Ran9、failures9：p15=23（期待22）、p16=22（期待20）；局部下标、长商式、单行长分式、三组并排下标、小字号三行有失败。独立完整数字、两cases、brace两行已通过。
2. 第二轮 Ran9、failures5：p16真实页通过；p15仍23；synthetic长商式、两组并排下标和小字号三行仍失败。
3. 第三轮 Ran9、failures2：仅p15仍23和一组两列分式下标仍失败。
4. 修正局部上方匹配范围和独立 joining 下标入口后，原9 tests全部通过；再新增内含区间 union 的直接回归，并只运行该新增方法，1 test通过。没有为了凑绿色改数学/行数预期。

各次原始命令返回、trace诊断与失败文本保留在本会话工具记录；未另造/覆盖首诊断目录、失败audit或source快照。既有首诊断 `exit1` 保留，不将其改成修补后的运行记录。

### 已执行命令和结果

以下均在仓库根执行；不是本次追加时重跑。`PYTHONDONTWRITEBYTECODE=1` 避免写入代码缓存：

```sh
env PYTHONDONTWRITEBYTECODE=1 .claude/skills/ld-s10y-lesson/.venv/bin/python \
  -m unittest discover -s .claude/skills/ld-s10y-lesson/tests \
  -p test_limit_subscript_rows.py -v
```

该命令真实迭代结果如上；最后一次 **Ran9 / OK / exit0**，包含源PNG哈希绑定的p15/p16及六个区域断言。真实页只读 `line_bands` 得22/20；五个lim错误区对应1、2、1、1、1行，cases控制区2行。没有调用finalize。

```sh
env PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.claude/skills/ld-s10y-lesson/tests \
  .claude/skills/ld-s10y-lesson/.venv/bin/python -m unittest -v \
  test_inline_fraction_row test_fraction_line_spacing test_compound_fraction_rows
```

真实 **Ran17 / OK (skipped=4) / exit0**；4个SKIP是缺失本地source-page render的可选fixture（268/269/270/275），不是假称运行通过。

```sh
env PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.claude/skills/ld-s10y-lesson/tests \
  .claude/skills/ld-s10y-lesson/.venv/bin/python -m unittest -v \
  test_small_footnote_rows test_compact_footnote_rows test_short_numeric_rows \
  test_short_prose_row test_underlined_rows test_decorated_folio_rows \
  test_split_decorated_folio test_clipped_folio_row test_scan_border_rows
```

真实 **Ran37 / OK / exit0**。相关已有focused在实现ready后才执行；没有以旧tests设计代码，也没有更改这些测试。

```sh
env PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.claude/skills/ld-s10y-lesson/tests \
  .claude/skills/ld-s10y-lesson/.venv/bin/python -m unittest -v \
  test_limit_subscript_rows.LimitSubscriptRowsTest.test_contained_projection_fragments_cannot_shorten_a_glyph
```

真实 **Ran1 / OK / exit0**。此方法追加后只运行该受影响方法，复用之前9项成功证据；故当前新增测试共10项已实际通过，并非声称追加后重新整模块跑10项。

`git diff --check -- layout.py路径 新测试路径` 实际exit0。末尾只读哈希比较原诊断十个guarded文件（PNG、layout.json、MD、JSON、audit）**changes=[]**，源像素和初失败bytes未变。没有全suite、finalize、assemble、browser、DB或发布。

限定交付：所列focused正反例通过，不是独立批准任意未见版面；页级实际finalize及其失败/通过记录由母方随后执行，本文不代执行、不推填结果。p16源转录及p18字形 findings仍不因工具修复而解除。
