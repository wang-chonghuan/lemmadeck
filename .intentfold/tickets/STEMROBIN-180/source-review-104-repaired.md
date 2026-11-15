# 104连接空格修复独立复核

日期：2026-11-15。审者：Codex，非104源作者。
**Affected-only PASS：首审唯一行尾连接空格缺陷已闭合。**
复用 `source-review-104.md` 的完整像素首审及其余PASS，不重审整页。
仅核 `p0104#7` 第1体行、第12印刷行的一个U+0020修复。
不代表assemble、传播、其它页或现代内容通过。

## 唯一受影响行

持久 `pages/0104/page.md:83` 和
`page.json /blocks/6/lines/0` 均在原句
“例如，当一根钢索受到拉伸时，其分子间的距离就增大.”
后增加一个行尾ASCII空格。修后尾部为
`U+002E U+0020`，随后才是MD的原换行；不是全角空格、
新空行或句点替换。

直接首尾连接下一体行的起始“分子间的引力胜过斥力”得到
`增大. 分子间`，不再是首审所报的`增大.分子间`。
这只是本地页输入连接验证，未运行assemble或声称下游已传播。
原句像素与物理内容沿用完整首审，不重新开图或猜测其它文字。

## Snapshot Minimal Diff

独立对比
`.tmp/ld-s10y-lesson/6p/pages/0104/failure-01-join-space/`
与当前持久同名文件：

- MD字节级验证只有该行增加一个字节`0x20`，其余全部字节相同。
- JSON字节级同样只增加该行字符串尾部一个`0x20`。
  结构diff仅 `/blocks/6/lines/0`；所有meta、其它行、图、
  open/cont/samerow及页尾完整段状态都未变。
- audit前后字节完全相同：printed/md=18/18，
  normalizations、unknown_chars、katex_warnings、errors为空。
  这是读取原管线已有结果，本审者未runfinalize。
- failure快照MD/JSON/audit哈希均与完整首审绑定一致，
  确认保留的是实际首FAIL，不是后续中间稿。

## 图框与源哈希

两图meta、fig块、audit的精确框修前修后均相同：
fig81 `[353,212,249,486]`，fig82 `[932,340,286,343]`。
原page.png字节哈希与完整首审及metadata render.sha256一致。

本次仅做非语义的像素一致性核验：当前fig81/82裁图分别
273×510、310×367，与未变原页中上述框外扩12px区域逐像素相同。
未重新审图内单位、箭头、图题或整页正文，这些复用首审PASS。
首审未绑定裁图PNG历史字节哈希，failure目录也无裁图快照；
因此只记录当前裁图hash及其与未变源像素的相等性，
不伪称已直接比较不存在的修前PNG字节。

## SHA-256

| 文件 | SHA-256 |
| --- | --- |
| 当前durable page.md | ccdb46859f0962cea7f62c31507eb00358729d4300ce29acd604d602ded70330 |
| 当前durable page.json | 6b007f26d0f3c490a4fb2783361349a86b7e33268cf841751a86960ed274ff15 |
| 当前及failure audit.json | 8e657dd49cc21ee611d71219503bce8982d62460b80d52e56a82ae21bdb59be1 |
| failure page.md | dc46b9c34b757c268afcfeab21b40b37b2a4650f1a8e2753d7f28000ba05262e |
| failure page.json | 4ad14a95db21635f011e28202be998109094baf1b4b2e01970f84e575bb7b742 |
| 原page.png | f20f2732d0ae51a050af033d74fd736028de7ee82c1a1e4f2053a160afb8ba8c |
| 当前fig81 PNG | d20689b47834d132dbbd0a2b439c8e53f9a3c0c558bf7665ae7c2cfca80310d0 |
| 当前fig82 PNG | fbe9c9f2fd387b248f07193563541bd10e61ddc7246eb3067a5f0b34039e1131 |
| 保留source-review-104.md | e095f6bfce74d2163e982702571c7ad359c4ed9d49b56922f7f124b4ef81b17b |

仅apply_patch新增本工单 `source-review-104-repaired.md`。
首FAIL报告及失败三文件未改；未修作者稿、重审整页、
runfinalize/assemble、读取其它页/答案/choices/现代图。
101修复复核仍归main，不在本报告范围；无DB/Git/app/依赖操作。
