# SOURCE235 Original-First Inventory

Scope: STEMROBIN-181/181-3; 10p physical page 235, printed page 225 only.
Sole R: `/Users/yong/.codex/worktrees/00b1/lemmadeck`.
Original first: existing d843 preparation `work/10p/pages/0235/page.png`,
SHA-256 `eb468dd93d626681de05163b5339ae1fd40aa015747d0b10fcaac3951f503c6e`.
The original was opened before its grid, author text or any local crop.
Two images have been loaded in one batch; no prior-page or source236 images.

## Source Rows

Each numbered entry is one actual prose, caption or footer row, not a figure
label row. Periods use the required source profile's ASCII "." convention.

```text
01 同时，菲涅耳定量地研究了不同类型的障碍物的衍射.
02 1818年在法兰西科学院会议上发生了一个有趣的情况.
03 出席会议的一个学者在会议上注意到由菲涅耳学说得出的事
04 实，明显地与合情理的看法相矛盾. 在孔的大小一定和从小
05 孔至光源及屏幕的距离一定的情况下，光斑的中心应是一小
06 暗斑. 相反，在一个不透明的小圆盘后面的阴影中心应是一
07 亮斑. 当实验证明的确是这么一回事时，学者们是多么惊
08 奇啊！
09 不同障碍物的衍射图样　由于光波的波长很短，光偏离
10 直线传播的角度不大. 所以为了清楚地观察到衍射（尤其是
11 象刚才讲过的那些情况）光绕过的障碍物到屏幕之间的距离
12 应该是很大的.
13 图205表明，在照片上的各种障碍物引起的衍射图样：а)
14 细金属线的，б) 圆孔的，в) 圆形物的.
15 图　205
16 显微镜和望远镜的分辨本领　光的波动性使得用显微镜
17 观察和辨别物体的细节或很小的物体的可能性受到限制. 衍
18 射使我们不能得到细小物体的清晰的像，因为光并不是严格
19 ·225·
```

Rows 01, 02-08, 09-12, 13-14 and 16-18 are five prose paragraphs.
Rows 09 and 16 have bold lead-ins on the same row as their prose, not
standalone chapter/section/numbered headings. Row 15 is the sole caption.
No row is shared with an adjacent prose row.

Paragraph 01 is closed and not cont: the user supplies prior234 as closed at
`即直线传播.` with no outgoing open object; approval there remains pending.
Paragraph 16-18 is open and ends literally `因为光并不是严格`; no next-page
text has been read or invented. The figure does not interrupt a prose object.

Expected inventory: 8 blocks = 5 p + 1 fig + 1 cap + 1 foot; 17 prose
rows + 1 caption + 1 footer = 19 distinct text rows.
There are zero heading blocks, exercise headings, questions, subquestions,
tables, inline math spans, display formulas, real formula wraps or errata.
The year 1818 and figure number 205 are plain numerical source text,
not invented mathematics.

## Figure 205

Exactly one composite original figure, referenced in rows 13-14:

- Left subfigure а: a vertically oriented narrow photographic field; a dark
  central vertical band with neighboring narrow light/dark bands and speckled
  surrounding field. It illustrates diffraction associated with the thin
  metal wire named in the prose. The label а is below this panel.
- Middle subfigure б: a dark rectangular field with a central bright ring
  region, nested dark/bright circular structure and a dark central spot.
  The prose names the round hole. The label б is below this panel.
- Right subfigure в: a roughly square field with concentric light/dark
  diffraction rings around a large central dark disk and a tiny bright
  central spot. The square outer border is source ink. The prose names a
  round object. The label в is below this panel.
- Retain all three source fields, their actual ring/stripe textures and all
  three subfigure labels as one image; do not replace them with ideal geometry.
- `图　205` is a separate caption, not part of the image crop.
- No axes, grid, dimensions, mathematical point labels, table cells, question
  answers, extra panels or modern artwork exist here.

Coarse aggregate box from the grid: `[250,1155,1090,480]`. It includes the
three subfigure labels and excludes the caption below and prose above.
Native snapping/cropping is still to run, once only.

## Literal Codepoints

The subfigure references use Cyrillic а U+0430, б U+0431, в U+0432,
not Latin a/b/e. Parenthesis after each label is ASCII ")" U+0029.
Prose sentence periods are "." U+002E; the join after "情况." at row 02
requires a trailing ASCII space before row 03. CJK punctuation remains
fullwidth; the printed word `象` in row 11 is not repaired to `像`.

This is the FIRST author's source inventory, not independent review or approval.
