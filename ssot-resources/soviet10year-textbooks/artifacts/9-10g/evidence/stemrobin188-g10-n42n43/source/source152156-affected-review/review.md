# 188-6 / 152-156 受影响修项收口

**pass，仅针对下列已指出修项；不是首次整页复审、整课或现代稿批准。**

先读取两个首次独审的 review.md/json，再核对当前工作副本与原作者 md/json/audit 的字节 diff、五份 finalize-*-affected-01 receipts。未重开任何整页、已 PASS 裁图或必要字符 ROI。原 FIRST、逐行 PASS、裁图保真/归属 PASS 只在原输入和未变部分的 SHA 绑定仍成立时复用。

## 逐修项

| 修项 | 结果 | 当前核对 |
| --- | --- | --- |
| 152 标题层级 | pass | 十年级 h1 保留；第四章 h2；§42 h3；全部标题文字不变。 |
| 154 正文引用 | pass | 正文仅 0→6，成为 §26；题4 的 §20 和整块题文不变。 |
| 155 首 ex 续接 | pass | `ex cont`、JSON label=null；原印 2) 及题面不变，不补印6；承154题6 open 的已有独审边界。只修原 stale note。 |
| 156 题9句点 | pass | “坐标都相等. 计”已恢复；下一原行仍“算向量的坐标.”。 |
| 五页 g10 作用域 | pass | 五页 md frontmatter、JSON meta、audit 均为 g10。原印刷页码145–149、题号、图号和图题不变。 |
| 五图派生 ID 隔离 | pass | md 引用、JSON meta/fig block、audit、receipt 一致为 fig-g10-01..05；只更名，精确源框、原源 PNG、五裁图字节不变。不是全书碰撞或工具算法批准。 |

各当前 JSON 的其他 block 字段/行与原作者完全一致；当前 Markdown 也逐字节符合上述唯一替换集合。153 正文完全无变化。图1/2、图3/4 caption 同排及图5题14同页 open/cont、caption samerow、图归属，沿首次 hash-bound PASS 复用，不作第二次源审。

## SHA 绑定

全部路径以 `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck` 为根；完整路径/hash、原 FIRST、旧/新源 PNG、布局、原作者三文件、每页六个 receipt 文件均在 review.json 的 evidence。

| 页 | 当前 page.md SHA256 | 当前 page.json SHA256 | 当前 audit.json SHA256 |
| --- | --- | --- | --- |
| 152 | 98f6235cc3c7b2aa5513ad67422d926b10cde6b99183945c78658eea2fd01568 | facccd66a3be7b85a855e5d7c080a4023f01b27da12b1ab613a2a3ada7ce1243 | a08c3a0c1a630d7deae04dff98361b22676e629bf89d085f032ee1bed8dcaca0 |
| 153 | 59ab4760d4f344cd8feea992fff86d9679d6a572758ad715605b5e42d7cb4f32 | 0f4b2cea61a7f6f833df0d66f549a2630e602a844125ada9928438661462003d | 6b708dac20fd8b636aeff739b9b317093cf43ad6a87856b3c3568827ac568efe |
| 154 | 155dadd66c58b97589e28e1a6613897e5c780a4eeaa0233a76f303a0ca01c51e | 5521865ae0af6c10ce4e1b3ca68da7ca87ff8f71ed5ab9f95cfeee782560f37e | 95627509481eaa4413c0eaf516029d04b7b466469503f7667ab86c3b87ae9ec6 |
| 155 | 358bef17cf5d525cece8787b13efb9fe07867528391cbfee3553cdecfdf833ca | e0d850468d48f4301ab585f65b5f0325996cc6e704ea7569a902ee21d9207d79 | 8e5d55e20c96b3fe7f6ebb4d24d3ec5e01c2650e0cd5bc3fa6f3673c557468b0 |
| 156 | d64ce3053764171a060a24881701f1c018e2fe4fb6d426749518a840e8359ba3 | a81a9922702aa547eee1deae6aee8e5e05167cf9e0cf235cd0e99383e311fe05 | a4ceace30c7bc29b0b2f9e382e0823ecca54f625bb4a2a70f51a7118003dba3b |

五裁图 SHA256：

- fig-g10-01：[281,1245,354,384]；cfd9bf74e90a570ba9fe696a32cf461a0c01adfb040343ae4daea5306b3cba98。
- fig-g10-02：[756,1212,451,415]；a9ecfdaa5aeb62cec584ca0d89c76e0e7207736323642b393fc82e8903b18614。
- fig-g10-03：[209,842,343,321]；86b778026de5ca4cb4d66708a9d5ac4882202028ddce77ef88781a8908afb99c。
- fig-g10-04：[799,840,347,331]；8b1e49d641ff926c1a19d259d4294e44aca181fc9e7772ffa0533c08cacd1fa0。
- fig-g10-05：[881,1027,319,321]；ead0b7efbccc03c7d8205535a406dd7b6be2da7697567dd34b596337255f2cc7。

五份回执 exit=0，当前输出 hash 和图绑定均相符，规范化为0。`page.before.md` 是已修文字/作用域但尚未更新派生图 ID 的输入；至当前 md 的变化仅对应图 ID/引用。只读既有 receipts，没有执行 finalize。机械计数为14/14、26/26、23/23、16/16、25/25；这些不是新的源证据。155 实际16行只引用首次独审的 FIRST/row_checks，未读父方新增计数测试。

## 历史与边界

原两份首次独审仍为 REWORK_REQUIRED / REALREVISE，不改写为 PASS。155 首次16/18 FAIL 的原稿、audit、call/stdout/stderr保留原 SHA；当前audit的18→16及去除旧计数错误只收口与已获首次独审16行事实的一致性，不抹去旧 FAIL。153“将使用→将仅用”、156漏负号及题9句点的 FIRST 更正链原样保留。

156页脚 `· 149 · [unknown]` 与原候选完全相同，仅 SOURCE_UNKNOWN_LOCAL。当前 audit 的 unknown_chars=[] 不消除这条局部未知；不猜字、不擦像素、不认定噪迹、不添加排除框、不对数学题整体 HOLD。§44首句仍止于“一个”，p open；不批准其右边界或N44。152/153及154/155接合只复用已有独审边界；无 assemble 验收。

本审图片实际加载0、打开尝试0、当前context0，单批0≤8/context0≤24。历史不重置：152–154作者4+首次审7=11；155–156作者8+首次审6=14，合计历史25次来自不同已记录上下文，不是本context加载25次。所有原图片打开条目与失败尝试沿两份绑定的真实ledger引用，不重新打包。原作者5次finalize（含155首次1次失败）+既有affected5次保留，本审finalize0、paid0、实际内容修订0。

本次技术ledger保留：初始rg查询未存在的输出目录exit2；只读verify首次错误假设page.before.md应等于final md而exit1，定位为审者断言错误，仅修本目录脚本后检查通过；不算源缺陷、候选修订或图片加载。字节diff的exit1表示有预期差异，不是执行失败。

只写本受影响审查目录的文字/代码；不改候选、工具、他人产物或Git；未执行setup/freshness/Grill/backend/.env/API/DB/install/paid/finalize/assemble/全项目防线；未访问其他聊天；未批准现代稿、整课或全书索引。
