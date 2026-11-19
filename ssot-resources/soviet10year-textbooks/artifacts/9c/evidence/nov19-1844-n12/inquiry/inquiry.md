# n12 Independent Inquiry

STEMROBIN-184B；2026-11-19。只读源后的离线数学/勘误 inquiry；scratch-only，零新图片。

## Decision

本页上下文足以支持十进制整数数字域 **{0,...,9}**，最小现代勘误候选 **0<=a_k<=9**。数学依据不处于上下文不足的 HOLD；正式登记/target 核验/传播未执行，不是正式 Gate2，也没有整课或全页 PASS。

源式严格 <9 必须保留。不重新猜源 glyph <=，不声称原作者意图，不声称已登记；未读作者 modern/keys，故没有作者产物通过/不通过结论。

## Independent Freeze First

独立结果先完成并冻结于 `2026-11-19T15:51:17.793Z`；inquiry 从冻结文件生成，不反向调整独立解。

- independent-source.json SHA-256: `89f90a365bd991a154d607d0cfbd28651134a523ec3fedac186162e6f91afac0`。
- independent-source.md SHA-256: `843d7a9f2490aacba777f6dff82d7a7b315ab735185bae7113dd920958dbfab6`。
- freeze.json SHA-256: `0a593190da669d4c3afeeae9f81047147eda095b940b766abfe2dd060caf6bdc`。
- edition-text-contract SHA-256: `97d086b100b63150a23d218a2c6f0bafd2ddff17b17d189a91ec01638b75b977`。

## Exact Source Binding

9c physical **53** / printed **46**，**p0053#6**，zero-based block index **5**，原式 pointer `/blocks/5/lines/3`。

page.json SHA-256: `2fc6a28876d9f3d575580aa07ab7d78da862fcee02d44730e63967bc8cdd7c6a`

PDF SHA-256（仅页 metadata 声明，未读取 PDF）: `622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec`

原式精确 span: `$0\leqslant a_k<9$`

最小现代候选: `$0\leqslant a_k\leqslant9$`

原式在本 block 和源页正文各出现一次；没有读取/重建 assembled authoritative target，故不把源页唯一性当作正式 target 唯一性。

## Local Mathematical Basis

1. 本段谈的是十进制位值小数，不是另一个进制；给定 r=m/n，整数部分取 a0=floor(r)，小数部分 t=r-a0 满足 0<=t<1。有限小数按已写出的约定补无限个零。（p0052#7, p0052#8, p0053#1, p0053#2, p0053#3, p0053#6）

2. 逐位除法令 0<=R<n，则下一位 ak=floor(10R/n)，所以 0<=ak<=9，且新余数仍在 [0,n)。数字不能为 10；0 和 9 都是合法且可实际出现的十进制数字。（p0052#7, p0053#2, p0053#3）

3. 本页实际写出 -0.789；取其相反数得到非负有理数 789/1000。依十进制位值提取，a1=7、a2=8、a3=9，随后补零。故同页“任何非负有理数”与排除数字 9 的域不相容；这不把 -0.789 的全数负号误读成整数部分上横线。（p0053#5, p0053#2, p0053#6）

4. 排除 9 也不能靠另一个展开避开矛盾：若所有位仅允许 0..8，为表示 0.789，首位只能为 7、次位只能为 8，此后尾数最大为 sum(k>=3,8/10^k)=8/900。因此总值至多 0.78+8/900=71/90=0.788888…，仍严格小于 789/1000，差 1/9000。（p0053#2, p0053#5, p0053#6）

5. 唯一被上下文支持的是整数数字集合 {0,1,2,3,4,5,6,7,8,9}。边界可等价写为 0<=ak<=9 或 0<=ak<10；选择 <=9 是保持原式数字 9 的最小现代替换，不是唯一可能的文字，也不是对源 glyph 或原作者意图的判断。（p0053#6）

这确定的是数字集合，不是唯一文字或印刷意图；<10 也等价，但 <=9 保留源式的 9，替换范围最小。

## Contract Comparison

1. **SUPPORTED_PROPOSAL_ONLY**
契约：Confirmed mathematics stays unchanged in the faithful source block; a source-bound erratum is recorded in that page's frontmatter.
证据：独立推导充分支持 {0,...,9}；冻结 actual block 仍逐字保留 $0\leqslant a_k<9$。
未执行/不声称：No source frontmatter edit or registration is executed. The parsed page.json meta snapshot has no errata field; no global registry is queried.

2. **SOURCE_SPAN_VERIFIED_TARGET_NOT_CHECKED**
契约：The source block exists and contains original; exact original span must be unique in the authoritative raw lesson/exercise target.
证据：源 p0053#6 实际存在，/blocks/5/lines/3 正好是原式；本 block 和本页正文各一次。
未执行/不声称：Authoritative assembled lesson/exercise target has not been reconstructed or inspected; source-page uniqueness is not target uniqueness.

3. **INQUIRY_BOUND_TO_CURRENT_SOURCE_SNAPSHOT**
契约：Authoritative bindings preserve physical/printed page, page JSON SHA-256, PDF SHA-256 and the source block reference; stale bindings fail.
证据：本 inquiry 精确绑定 physical 53 / printed 46、p0053#6、页 JSON 2fc6a28876d9f3d575580aa07ab7d78da862fcee02d44730e63967bc8cdd7c6a。PDF hash 仅来自源 meta，未读取 PDF。
未执行/不声称：No assemble/adapt binding reconstruction, PDF-byte verification or publication revalidation is performed.

4. **MINIMAL_REPLACEMENT_PROPOSED_NOT_APPLIED**
契约：The edition author fills corrected, updates the target text and adds math-correction to that target's changes.
证据：最小现代候选是 $0\leqslant a_k\leqslant9$，保留十进制数字集合的等价 <=9 边界。
未执行/不声称：No modern draft is read/edited, no corrected field or changes array is written to a formal artifact.

5. **NO_FORMAL_PIPELINE_APPROVAL**
契约：Missing records, stale hashes, mismatches, unchanged propagation and formula changes outside registered replacements fail.
证据：inquiry 将独立数学结论与正式登记/传播证据分开；既有计数排除不能代替科学认可。
未执行/不声称：No finalize, assemble, adapt-finalize, author keys, official Gate2 or lesson PASS is called or claimed.

6. **NOT_IN_SCOPE_NO_SECTION_BREAK_AUTHORED**
契约：Section breaks use actual adjacent final-paragraph anchors from the authoritative prose flow, not independently counted blocks.
证据：本次只从实际 JSON 识别 114 的跨页 continuation 与下一个 n13 标题；#block 只是 source binding。
未执行/不声称：No prose_flow command, section_breaks edit or substitute paragraph numbering is used.

本 inquiry 只比较已读取的 edition-text-contract 文本，不运行 finalize、assemble、adapt-prepare、adapt-finalize、author keys、发布或 backend freshness。

## Minimal Recommendation

1. 不改忠实 block。保留严格 <9、已有条尾和上横线范围，保留 p0055 重复 4 count UNKNOWN。24/24 metadata exclusion 不算科学批准。
2. 日后若正式应用，只在授权源流程中登记这一条 source-bound erratum。以下是契约形状的提案，**未写入源 frontmatter**，id 没有做全局碰撞核验：

```json
{
  "errata": [
    {
      "id": "p0053-math-1",
      "block": "p0053#6",
      "original": "$0\\leqslant a_k<9$",
      "reason": "The stated base-ten digit domain excludes 9, but the same page gives -0.789 and claims decimal representation for every nonnegative rational. Long division requires integer digits 0 through 9."
    }
  ]
}
```

3. 日后通过 authoritative source binding 确定实际 n12 target，核验 original 在该 raw target 恰好一次，再填 corrected、仅替换对应原式并给该 target 加 math-correction。不得猜造 target id、source_refs 或用本 inquiry 代替正式传播证据。
4. 若登记 frontmatter 改变 page.json 字节，当前页哈希只能保留为前登记证据。登记后的 authoritative hash 必须由后续正常流程产生；不能把 body 未变当作 raw page hash 未变。本次没有重跑任何 setup/freshness。
5. 十问结果仅供有限范围的独立比较，不是正式 keys；源上横线仅负整数部分。保留终止小数无限零尾约定。
6. 如写现代解释，说明严格逐位比较使用标准展开，不使用最终全 9 的另写法。0.249999…=0.250000… 是局部边界提醒，不在此提议第二个 source formula 改动，也不声称 p0054#2 已正式获批。

## Independent Exercise Oracle

**113（p0054#6；六问）**

| 问 | 本书无穷小数写法 | 普通全数负号等值写法 | 尾部 |
| --- | --- | --- | --- |
| а | $7.00000\ldots$ | $7.00000\ldots$ | 无限零尾；终止值 |
| б | $12.3800000\ldots$ | $12.3800000\ldots$ | 无限零尾；终止值 |
| в | $\overline{8}.06500000\ldots$ | $-7.93500000\ldots$ | 无限零尾；终止值 |
| г | $0.2500000\ldots$ | $0.2500000\ldots$ | 无限零尾；终止值 |
| д | $\overline{1}.7500000\ldots$ | $-0.2500000\ldots$ | 无限零尾；终止值 |
| е | $\overline{1}.333333\ldots$ | $-0.666666\ldots$ | 无限重复 3 |

例如 -7.935=-8+0.065，不是 -8.065；-1/4=-1+0.75，不是 -1.75。第六问 -2/3=-1+1/3，不能将有限个 3 后面补零当作精确答案。

**114（p0054#7 + p0055#1；四问）**

| 问 | 源数比较结论 | 本书记法的决定证据 |
| --- | --- | --- |
| а | $17.586631<17.586897$ | 整数部分 17 相同，小数第 4 位 6<8 |
| б | $-2.37561>-2.37571$ | $\overline{3}.6243900000\ldots>\overline{3}.6242900000\ldots$，第 4 位 3>2 |
| в | $-0.786<0.687$ | $\overline{1}.21400000\ldots<0.68700000\ldots$，整数部分 -1<0 |
| г | $0.2444444444\ldots>0.244$ | 右数为 0.244000…；第 4 位 4>0，不依赖重复 4 印出数量 |

114 的跨页接续只由实际 p0054#7 open=true、p0055#1 cont=true/open=false 判断；p0055#2 是 n13 标题，不扩展到循环小数节。

## UNKNOWN And Nonclaims

p0055#1 候选逐字保留：

```text
г) $0.2444444444\ldots$ 和 $0.244$。
```

重复 4 的精确印出数量仍 UNKNOWN。仅用已知前缀 0.2444 就有左数 >=0.2444>0.244、差 >=1/2500，因此比较可定 >。无需确认重复数量、无需证明省略号后永远是 4。若采用无限循环 4 的常规读法，左数 11/45、差 1/2250，但不据此关闭 glyph UNKNOWN。

其他旧 science/glyph UNKNOWN 原状保留；未读其历史包，未作额外页面/全教材审查。没有新图片/浏览器/网络/Git/DB/发布/同伴消息，没有正式 Gate2 或整课 PASS。所有新文件只在当前 n12-independent scratch 目录。
