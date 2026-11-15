# fig-65 F65-1 Affected-Only Independent Re-review

2026-11-15。Sagan，independent_agent，不是图作者。

**结论：PASS，仅当前一次修复快照。F65-1固定guide缺陷已关闭；未变内容复用首审通过证据。修复1/1已耗尽，不授权第三稿或晋升。**

## 范围与证据顺序

main转发COMPLETE与三项最终hash后，先读取首轮独立FAIL、`author-handoff.json`和`repair-01-report.md`，再将当前spec与`failure-01-fixed-guide/spec.json`按稳定对象/断言ID比较。只复核guide/backing关系、新断言、受影响显示及绑定，不重审s20全文、原图库存或65/66/67整组。

原图库存与其他物理/文化/标签内容复用首审实际打开证据。当前source PNG和完整authoritativeText未变，两个现代模板的字节哈希仍等于首审绑定；不借文字PASS替代本次guide观察。

实际打开新完整预览：

- `repair-01-preview-306-neutral.png`，实际media306；
- `repair-01-preview-640-neutral.png`，实际media640；
- `repair-01-preview-306-accent.png`；
- `repair-01-preview-306-print.png`。

读取当前SVG的guide线条和backing多边形、当前render及新preview metadata，并核验其hash。未执行作者renderer、重截图、浏览器或负例渲染；不把作者自检作为独立图义结论。

## F65-1与传播复核

1. 首FAIL指出原图两guide都靠近各自背板底部，当前首稿却让左guide随杆移动。修复将`a-lower-guide`从user y330移至y270，右guide保持y270；对齐背板的底部仍为user y240。两guide均固定在背板底部上方30绘图单位，不随受载后的杆/指针下降。
2. 实际SVG两guide均为screen y630，左端点x158/192、右端点x448/482；背板底部仍为screen y660。已看306/640新预览中，两横件位于同一背板相对高度，细杆贯穿，各自与下钩保持可区分位置，F65-1的错误运动关系不再出现。
3. 30单位偏移和34单位横件跨度仅是示意几何，不冒称原图给定厘米、量程或精确源像素间隔。新inventory描述将guide固定于背板，与首轮源像素观察一致。
4. 按ID比较，44个原对象中的40个完全未变；变化仅为a/b-guide及a/b-backing的点引用。解析新点引用后，两backing的实际四顶点与首稿完全相等。右guide实际位置未变，左guide只有预期下移。
5. 新增6个点为两背板底顶点和四guide端点；不是新标签、测量标记或器具。原有18条断言完整未改。新增8条断言逐项独立核算如下：

| 新断言 | 实际关系 | 结论 |
| --- | --- | --- |
| `a-fixed-guide-to-backing` | 背板底点到guide左端：dx=-72，dy=30 | PASS |
| `a-fixed-guide-span` | guide两端：dx=34，dy=0 | PASS |
| `a-fixed-guide-connected` | 实际guide segment端点引用对应两个被检查点 | PASS |
| `b-fixed-guide-to-backing` | 背板底点到guide左端：dx=-72，dy=30 | PASS |
| `b-fixed-guide-span` | guide两端：dx=34，dy=0 | PASS |
| `b-fixed-guide-connected` | 实际guide segment端点引用对应两个被检查点 | PASS |
| `same-backing-bottom-height` | 两背板底点：dx=290，dy=0 | PASS |
| `same-fixed-guide-height` | 两guide左端：dx=290，dy=0 | PASS |

这些点实际用于绘制对应backing polygon和guide segment，不是与图形脱离的辅助断言；各construction inventory包含自己的新增点及内部关系。活动杆、弹簧端、指针和钩仍按未变原断言运动。

## 受影响显示与绑定

- 实际306/640预览中guide均清晰，未与背板下边融合，也未导致细杆、空钩、受载钩或最终下环被裁切。上方支架、右端、102 g及最下环仍完整；这里只检查改动造成的传播，不重新审未变装置。
- accent/print的306预览保留两固定横件，新增点未形成虚构刻度或标签。原guide样式及所有原标签、颜色角色、canvas/display规格未变。
- 当前render实际为PASS、50对象、8标签、零碰撞；306/640测得最小文本17.2125/36 px。六份新preview记录与当前spec/SVG及PNG完整字节哈希吻合，标签fitsCanvas且外侧2像素无墨。本人实际目视四份如上，不声称另开了640 accent/print。
- main提供的spec/SVG/render三hash均与实测当前文件完全一致。未变source与authoritativeText核对一致，其余首审PASS结论可以复用。
- 首轮根`review.json`仍为FAIL，根`independent-review.md`字节未改；它们仅为被拒快照记录，不绑定当前修复作PASS。`failure-01-fixed-guide/snapshot-manifest.json`中的48个文件逐项实测字节数及SHA256全部吻合，未覆盖或删除。

## 实际SHA256

以下路径相对 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-65/`。

| 文件 | SHA256 |
| --- | --- |
| `spec.json` | `1db3a56af9256b0f36c0ae3c485ad9ca930b3099c1a4123d9ea067e8954382f9` |
| `fig-65.svg` | `f70ce7ca51c92fbe6fb8c9a34d331dc101c4c94d6b4914914ce9de75f2b7170e` |
| `fig-65.render.json` | `26d13e6f98b294756d18b9035dcf259384f3f2f9481c47c92af2c63011c2abe6` |
| `repair-01-preview.json` | `61be35dedc6f9c3c6943237482fdfd11d9bc415b837c6f408cdcfe70ba421912` |
| `repair-01-preview-306-neutral.png` | `4b1c683d76d24e8a2bf4c46ad764d74a2d520d2a6aa5805a46b2195a1a75d285` |
| `repair-01-preview-640-neutral.png` | `367bf4d9e2e88f1553922e99b08cbd84a2d24bd115deef86ca4851c713d14aa3` |
| `repair-01-preview-306-accent.png` | `8cd1e2493aa4dd6d749471fca9e1814b9249bd710094b1bbca9af040b0f972bc` |
| `repair-01-preview-306-print.png` | `d0edaca093bd690323d9e2898d530625b87c5a1c98dc242363db89677b8d166b` |
| `inventory.md` | `50bb4578f9a93d4979c71ee2ad133858f63f0ef6e6cf9a86a1c01f5c3bcbef23` |
| `repair-01-report.md` | `93cb37b004ac3430fdae737fe8e365c59a2ab5234cf6cea926374573d4845886` |
| `author-handoff.json` | `10bed3e850879fd041905661edce7a3583460be688bf576637001bf2a02c7b7d` |
| `failure-01-fixed-guide/snapshot-manifest.json` | `b84eab634eb06ee1903ea8527f99405010b135a226a78e37c6a8ee55dfa569bc` |
| `failure-01-fixed-guide/spec.json` | `5760745a460d4d1520d8270707af1e2a9a7bec883e89212ff87176ca0f562c68` |
| `failure-01-fixed-guide/fig-65.svg` | `cb9932608e84db3f0c895ae8d0ec774124ad524e66f967467ee26fd822d97657` |
| `failure-01-fixed-guide/fig-65.render.json` | `68fda9cf7ff7cb6a6fae20a12ef179cc639e40431ae3d7ded193e9a2bfb34a2c` |
| `review.json`（首FAIL，保留） | `3b66ccab8ef1fda91bd62c09fc5d7b0c6af6da62de7b54a620903cb45996fa5c` |
| `independent-review.md`（首FAIL，保留） | `3ae42c550b4a9005ec948058b06d9cff470d493985fceef543ec6b71f334857e` |

原PNG完整字节hash仍为 `e9d2d6384e359cfe54b18ef0092c621b11b08409661182293fdefe3eada063a4`；s20 lesson/exercises模板仍为 `154731b18ac6f73c87af461fe38488c2abdb90bfbfb3fe9d99d53fa98e50dc35` / `dfb3f54e334ef086316ec946da06eb77d532f9edf5b0e4f370aa175e056010ea`。这些实际文件哈希已与handoff及首审绑定核验，不重审正文。

现有record_review.py仅将当前PASS及真实source/spec/render/output哈希记录到新`review-repaired.json`，不覆盖首FAIL。只新增此报告与该记录；不改作者稿、不渲染、不晋升、不发布、不访问DB/Git/.env/外部服务、不消息其他会话。精确模型、推理设置和累计token未知。若以后发现本次修复仍有真实实质缺陷，因一次修复已耗尽须FAIL/blocked，不再修。
