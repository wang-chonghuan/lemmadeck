# fig-51 独立图审查

结论：**FAIL，缺少源磁铁S/N标记。当前snapshot不可晋升。**

审查者：Codex independent reviewer，非Ramanujan图作者。2026-11-15。这是本次独立首次失败证据，必须保留，不覆盖或自行修图。

## 最终稿与权威上下文

先读author-handoff.json、author-preview.json、author-notes.md定位作者最终交接文件。`draft`是未独审/未晋升生命周期；剩余门禁明确为独审及晋升，不批准仍在编辑的pending稿。handoff及preview的20项当前哈希独立核对一致，完整当前s15正文/cap/四题与spec.authoritativeText逐项一致。

权威模板：

- `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s15/lesson.template.json`：`6220965c96d575ebfc474309626cd54ea94605703c43f4f5c4bb73d021cadae8`
- 同目录`exercises.template.json`：`794143435f24a4a53d42bad7e37effa574dd172b4ed9c26f2ba06787223962c4`

正文明确铁块置于浮在水中的软木上，并被磁铁吸引而运动。它没有授权去除磁铁极性标签；本次用户还明确要求核对磁铁S/N。S和N是合法物理标签，不是应去除的文化文字。

## 独立像素库存

原PNG完整实际打开：`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-51.png`。

像素实际有：一个俯斜视浅水容器，完整椭圆边缘/前壁/水面波纹；水中中央一个浮动组件，深色铁块在浅色软木平台之上，部分被原箭头遮挡；前侧容器外一个纵向条形磁铁，近水/上端明确`S`，远水/下端明确`N`；一支从浮动组件朝前侧磁铁的下向箭头。无手、线、刻度、数值、第二磁铁或子图。

最终artwork.png单独全图已实际打开；铁块在软木上、软木浮在水面，磁铁在容器外且有非接触间隙，场景完整，未把铁块换成浮于水面的裸铁块。最终SVG单独在640实际CSS宽度看过，仅一支下向箭头。现场叠加两层后，箭头由软木下方朝近侧磁铁，未盖住铁块；在306/640实际媒体宽度均清楚。

## 真实缺陷与最小修复

**D51-1：源磁铁的S/N未投影到最终输出。**

当前spec.objects只有`source-scene`图像与`source-direction-arrow`，没有任何S/N text对象；artwork和组合图均只有红蓝两色而无S/N。作者source.inventory.json及notes承认原标签存在但主动省略，因此不是像素歧义或未记录原库存。颜色本身不确定代表哪一极，不能保留源“近端S、远端N”的明确身份。

最小建议：只在该unit的确定性overlay补`S`于靠水面的上/近红色段、`N`于下/远蓝色段；不要让image生成文字，不反转极性，不添加磁场线、力大小或答案。将两源标签映射到visible text对象及库存；306/640实际媒体上两字母各须至少16px，验证无碰撞/裁切。保留此次FAIL与作者当前首稿snapshot，作者仅可进行一次定向修复并重新render/hash绑定；本审查没有使用或代行修复额度。作者当前记录postRenderRepairs=0/artworkRegenerations=0。

其它已核事实可复用，但修复后必须核对新SVG、组合及哈希，当前不能先PASS再补标签。

## 复验与证据

spec机械验证及render均PASS；它们不证明源标签完整，故本独审仍FAIL。方向断言`dx=0,dy=-250`及connects正确；generated原图无额外文字/数值/文化符号/答案。最终两个标签缺失是唯一发现的真实缺陷。

只读Playwright现场media度量与图在内存中显示，没有写截图或改作者preview；HTTP/HTTPS禁用，浏览器已关闭。

| 宽度/层 | 实际mediaWidth | 图像载入 | 文字数 | overflow | 内存PNG SHA-256 |
| --- | --- | --- | --- | --- | --- |
| 640 overlay | 640 | 不适用 | 0 | false | `89a2d11c962c850e39dd24c4952e687980b5e525771d51537dadc2af639a20e1` |
| 640 composite | 640 | true，1024×1536 | 0 | false | `cd33a5735ee284558597bc69175577e693bf3d30665a483f5323cdf7783b6e12` |
| 306 composite | 306 | true，1024×1536 | 0 | false | `9fc2b5e1cd9e234a4fdb37b2c36073c11f4a607bcea37feefd087aa3188e5a3c` |

0个标签不构成“字至少16px”实测PASS；当前缺的正是应有标签。

| 文件 | SHA-256 |
| --- | --- |
| 原PNG | `04e66edb8a3036ebcf33a1c93df356dab0124fabe06e188f02ff4d8434bb6de2` |
| spec.json | `4cfd5cbee813e2298f2812f16c82537a24ccb3dab9be867cc12a29f2578208e4` |
| source.inventory.json | `4b5384555f8535d889c666b252bec74f0b46b024636ac508aa2085523dd75742` |
| artwork-opaque.png.json | `88df4192fa83e42db52b34c0311bcb396794956f8b8a0207c7afb884882b0661` |
| artwork.png | `3a674a4c6c8c60cb5a47a235e37d68eb110818d69cc6c4aaf6b95cab4bd8b7a4` |
| fig-51.svg | `83bd52ece7523209b6dab70ddd98594345663f34a133ea60e208238ed827c91c` |
| fig-51.render.json | `5c9d81f7ba9916959ec8ee03ee4d91ad8241a5fd26fd745f6877813ecbf01ae5` |
| author-preview.json | `4036927ea9657417490379e93ff540e2386378562a1625ce4f03736c0ce424a1` |

review.json由`record_review.py --render fig-51.render.json --status fail`生成，绑定失败snapshot及本报告哈希。仅新增本报告/review.json，不修源/spec/图，不生成，不晋升，不改模板/DB/Git/他人文件。
