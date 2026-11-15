# 6-8g 图01/05独立源优先审查

- 日期：2026-11-15。
- 根目录：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。
- 作者：另一作者；本审查者没有绘制或修改这两图。
- 结论：**fig-01 PASS；fig-05 REJECT / 必须修复**。这不是整个lesson或提升gate通过。
- 先实际分别打开两张完整原PNG，再读s1现代`lesson.template.json`、`exercises.template.json`、`figures.template.json`；据源像素和当前正文建立下述独立inventory，然后查看当前全尺寸及240px preview、作者inventory/notes、spec、render/display/validation/trace证据。没有把作者“机械pass”当作独立视觉结论。
- SVG完整文件通过XML解析读取：枚举全部文字、路径、线、填充、样式、隐藏构造元素及viewBox；spec完整JSON经结构化解析读取，fig05长路径不逐字符抄录。实际绘制结果由现成全尺寸及240px PNG核对，没有重新渲染。
- 未读answers/choices，未解练习，未运行独立validator、render、课display或浏览器检查；未改源图、spec、SVG、模板、工具、资源、app、DB或提升任何文件。只写本报告，以及通过后授权的fig01 scratch review记录。

## 必须修复的发现

### F0105-01：fig05复制扫描磨损和噪点，未通过现代图视觉gate

**确定问题，阻断当前图05通过。**

- 定位：`.tmp/s10y-image/6-8g/fig-05/fig-05.spec.json`的`objects[0]` / `globe-ink`；对应`.tmp/s10y-image/6-8g/fig-05/fig-05.svg`唯一可见compound path。
- 当前400×640预览及240×384预览仍有球面外侧孤立墨点、球面右半部分密集碎斑、格线间的孤立短线、破碎的细经纬线和底座/支柱的随机白缺口。它们不是新增的有意义地理对象或数学点。
- 在240px实际预览，部分本应作为球面上连续曲线线索的笔画成为互不连接的短痕；海岸线、网格线和零碎黑点难以稳定区分。右侧许多碎斑与线交点附近的粗黑块尤其不能当作“原图所有对象都保留”的理由通过。
- 源语义是“地球近似于球形，其表面可看作球面”，并以地球仪承载曲面/网格线索；不是让学生辨认老版雕刻纹理或在随机墨点中判定数学点。
- 技能明确禁止将old-book texture从源像素复制到现代图。把扫描墨迹转成SVG、换semantic ink或加白边，并不消除旧书纹理。
- 作者已诚实记录该限制，但记录限制不等于满足gate。`objectCount(point)=0`只表示没有`point`类型对象；把噪点、断线和主体合并进81972字符的path，同样会显示伪点和碎线。`one-source-ink-path`也不证明经纬线、海岸和支撑结构可辨。
- trace记录237条轮廓、阈值128、`turdsize=2`和`alphamax=1.0`，与当前像素转轮廓方法一致；这些是机械来源信息，不是现代视觉合格证据。

**最小语义修复要求：**

保留可辨的球形地球仪、球面上同一框架内的曲线网格、适度简化的陆地轮廓，以及倾斜连接/下托架/竖支柱/底座。清除无语义的周边散点和雕刻碎斑，使关键可见曲线、球面轮廓和支撑轮廓清晰连贯；不要继续把“原墨迹全部原样保留”作为现代规范。

源扫描不能可靠提供完整经纬线数量、精确角间隔或每个小岛身份，修复不得伪造这些为原书数据；可明确登记现代示意规整，不需要添加圆心、半径、点标签、6400km文字或未给出的隐线。尤其不应把磨损造成的断续重新解释为有意义的实/虚线约定。本审查不代作者修图或决定新的渲染产物。

## 独立source inventory与正文关系

### fig01

源PNG完整画面为**2行×2列，共四幅**：

| 位置 | 直接源像素观察 | 需要保持的数学/视觉关系 |
| --- | --- | --- |
| 左上，源`а)` | 一条向右上倾斜的实线，`A`在左下端附近，`B`在右上端附近，无箭头或数值。`A`附近厚墨与端部/字形相连，不能据此确认独立的额外点标记。 | 一条有命名端位置的线段，不扩成直线，不加箭头/测量或独立点。 |
| 右上，源`б)` | 封闭、近方形的四边外框；左下`A`、右下`B`、右上`C`、左上`D`；内部排线向右上倾斜，无对角线、等长记号或数值。 | 外框封闭、对边平行、相邻方向垂直、四标签归属正确，内部排线不是另画一条对角线。 |
| 左下，源`в)` | 较宽的封闭矩形；左上`C`、右上`K`、左下`B`、右下`M`，内部排线向右下倾斜。右上是`K`，不是`X`。 | 两对平行边及直角方向保持；不得换K/M位置或翻转排线方向。 |
| 右下，源`г)` | 左侧顶位置`B`，实线分别向右上`A`和右下`C`延伸；中间斜排线，右端截断；**没有右侧闭合边**。 | 两个共同起点的可见边及内部排线；不能改为右侧封闭的三角形，不能增添箭头、角度或顶点圆点。 |

共有13个大写数学字母标签、4个小问标签。没有坐标轴、刻度、数值长度或可测网格；排线的墨迹条数和不均匀间隔不是给定网格尺寸。

s1现代正文只把这些作为熟悉的几何图形/点集示例，没有给图01单独的数值、等边命题或求解任务。当前spec所引四个相关正文块与模板一致，没有取答案构图。

### fig05

源PNG中只有**一个有支架的实体地球仪**，不是带圆心/半径的抽象平面圆：

- 圆形投影外轮廓上有陆地/海岸笔画，曲线/斜向网格与陆地共用同一球面框架。
- 上端连接位于右上倾斜方向，下端有弯曲托架；球体下方还有连接部、竖向渐变宽度的支柱、外扩底托及宽而低的底座。
- 无字母、数字、地理名称、角度、箭头、半径线或明确命名数学点。
- 源网格细线磨损、与海岸/边缘/粗墨重叠；不能独立可靠地数出每一条完整经线/纬线或角间隔。小块陆地、雕刻斑和孤立打印点也不能全部一一命名。这个不确定性不授权把噪点纹理作为现代图内容。

s1现代模板明确以图05说明地球近似球形及球面，约6400公里属于正文，不属于源图标签；球面定义在空间中，图05不应变成平面圆的半径示意。练习8讨论地球仪圆周，但无fig05直接引用；本审查不解该题，也不增加答案性标签。

## fig01 当前对象/关系/视觉结果

**PASS，限定于当前scratch独立图审查。**

- source四组分别映射到`a-edge`；`b-frame/b-hatch`；`c-frame/c-hatch`；`d-upper/d-lower/d-hatch`和对应文字对象，所有组都实际可见，顺序是原2×2顺序。17个SVG text与13大写字母/4个Latin小问标号一一核对。
- `a-edge-connects`和d的两个`connects`保持端位置与共同B顶位置。b/c的平行、垂直和布局距离断言与当前坐标一致；布局235、300等数值没有作为给定长度显示。
- SVG b外框为屏幕`x480..715,y60..260`，即235×200；c外框为`x60..360,y460..665`，即300×205。两轴同尺度，没有意外SVG transform拉伸。
- 源b看起来近方形，当前b略宽；该变化在本范围记录为无量值尺寸规整，**不声称原书已经给出或当前图满足严格等边**。正文没有把b当作等边求解条件。当前仍保留其封闭正交外框、标签、排线及与较宽c的相对外形区别，因此本审查不将没有原数值/等边记号的比例变化升级成确定等边错误。
- b/c排线在外框内，b方向右上、c方向右下；d排线位于两边之间并在右侧截断，没有加入A–C右闭合边。全部外边、排线为实线，没有把它们改成虚线。
- 没有可见新增point圆点、箭头、标尺、对角线、数值或答案。SVG内14个JSXGraph构造ellipse和两个辅助path均`display:none`且`visibility:hidden`，不把隐藏构造元素误报成可见点。
- 可见线/字/排线使用`--ld-figure-ink`、`--ld-figure-muted`，纸面使用`--ld-figure-paper`；隐藏JSXGraph辅助元素的固定颜色不会出现在图中。
- 800×800完整预览清晰，240×240实际预览仍保持四组、17标签、各边和排线方向，未见文字相互覆盖或越界。
- 当前render为pass、25个声明对象、17个标签、零collision；这是复用的既有机械证据，不是重新运行。

## fig05 当前对象/关系/视觉结果

**REJECT，尽管机械spec/render/display均pass。**

- 球体、海岸/网格及全部支架大结构仍存在，球面没有变成完全黑块，白开口还在；未加中心/半径/6400km文字或地理标签。此部分语义保留可确认。
- spec三组inventory全部指向同一个`globe-ink`；SVG唯一个可见81972字符compound path有237个`M`子轮廓。这能追溯墨迹，不能分别证明球体曲线、支架及非语义噪点合格。
- 400×640 viewBox和预览一致；原330×557墨迹按原尺度放在白边中，未对球体横纵向不等比缩放。
- 填充使用semantic ink，纸面为semantic paper；没有可见文字或文化符号。但不是“无文字所以通过”。
- 源图断线多为磨损/遮挡，不是能可靠恢复的数学虚线约定。当前trace保留碎段但没有消除纹理，实际小宽度辨认失败，详见F0105-01。

## 宽度、English及16px核对边界

| 图 | 实际检查和当前证据 | 结论 |
| --- | --- | --- |
| 01 | SVG 800×800；实际打开800px及240px预览。17个SVG文字全部ASCII大写数学标签或`a) b) c) d)`，font-size=56。按实际240px媒体缩放，`56×240/800=16.8px`。既有display证据的媒体宽依次240/280/310/343/358/400/560/640，最小文字分别16.8/19.6/21.7/24.01/25.06/28/39.2/44.8px；所有宽度≤maxWidth640。 | 当前scratch实际最小宽预览和SVG字形检查通过；全部声明宽度的算术与已有证据一致。 |
| 05 | SVG400×640；实际打开400px及240px预览，后者240×384。既有媒体宽240/280/310/320，对应高384/448/496/512，均≤maxWidth320。没有text或点标签，minLabelPx为null。 | 无文字，English/16px不适用，不能将null宣称为“测得≥16”；几何未越界，但小宽视觉仍REJECT。 |

两份display.json均明确为**author-only offline**，`parentBatchAppDisplay=pending`。本次不重新打开课display或测headed app；实际产品媒体宽/整课gate仍由父会话后续负责，不能将这份scratch PASS记录等同于产品显示已过。已通过的图01review notes也应保留这一边界。

## 当前快照摘要

下面`f01/`、`f05/`分别表示`.tmp/s10y-image/6-8g/fig-01/`、`.tmp/s10y-image/6-8g/fig-05/`；`s1/`表示`.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-s1/`。已直接读取文件摘要，现有render/display记录引用的source/spec/SVG/template哈希全部一致。

| 文件 | SHA-256 |
| --- | --- |
| 原`artifacts/6-8g/figures/fig-01.png` | `6662a63e78fbb4d2009ad873a48cab52ef779ebd84b1a9a57a38fde19f708d80` |
| `f01/fig-01.spec.json` | `8ec9a7640c8363c83b9081a1663d5da3bb0469867df8f9223cc684083e1ae25f` |
| `f01/fig-01.svg` | `d449be5fb2d61aefcc93333ba1e0517cd05c99598a4720c9817f5d3378ac5991` |
| `f01/fig-01.render.json` | `241f521ccd12655efd7133b8fae051a08016297730b9f64e4bed2be586e83833` |
| `f01/fig-01.display.json` | `3302df3b67ab7552438db0a45498d69852de71f7ea62fda82912b387af79eab9` |
| `f01/fig-01.preview.png` | `998b3672ce3055e0aa2e40c4a4efe054cf9dd025e71318bf09be3480e2a13a5a` |
| `f01/fig-01.mobile-240.preview.png` | `c93d5b16f764e7dd2b0e1afdcf3ccff19f014810fd63b7711f20e9f22d4fbbeb` |
| `f01/source-inventory.md` | `abfaaea99eace8c3bb1290d2b0c08d9f855038d95a1fc98cbbaa4e0d0020c613` |
| `f01/author-notes.md` | `4539864cc3ec1fa14d856d6c049656dc5b85cdd538922929db3aab1155d94c75` |
| 原`artifacts/6-8g/figures/fig-05.png` | `f17bf058b4e1b47dfb067badb8e3b51f1b099d511521ab20d2716f8dc768f96f` |
| `f05/fig-05.spec.json` | `4c5cc17fa6956747535d05df8499a7c89e004738806d3430b9c86660a2578a26` |
| `f05/fig-05.svg` | `9ea6c7287335a3188d70738c2e6b449eb42cfd585619eeea04a7ce051c568b8c` |
| `f05/fig-05.render.json` | `33a161989b06cc65b63f4bfa0b5b3cc55645b594ddcffddbcd0d0553f1467884` |
| `f05/fig-05.display.json` | `f989a33280f4424928a11c3558aca230117a388f6308d2be57e5ff0c75e33b2e` |
| `f05/fig-05.preview.png` | `55a980187bc69bba89ce28ac580f3d2b1a882d637cae10046ed74fc85f7703e0` |
| `f05/fig-05.mobile-240.preview.png` | `fe205ffd282a28b071311d76ff6ff6391fb9298998750a5f7884b52b74eaeb41` |
| `f05/source-inventory.md` | `9d3c70edb29fa29cf358acbb67fbd5f3d01f54dcbd0c522bb0de528b22e9e9e6` |
| `f05/author-notes.md` | `80602aca0fd5cc929f9372f42778b2e757d4b68929134a0a44ad323cc40680fe` |
| `f05/fig-05.trace.json` | `1c5611d3d86e712c0317de6b9f0eaac7de1df3397bcefcd2f8981fa1bd61fd6e` |
| `s1/lesson.template.json` | `afd177bc831c2e39d8eed3f7ba4431d6bef2c8d18487d405151fcc101961f321` |
| `s1/exercises.template.json` | `76e454a43bb0d01c2df3bea5086fa21a1fa37a26b42bbb43d5414373c03c7ea5` |
| `s1/figures.template.json` | `9459181e97135cdb697c9092942da236548e9b8a3c13cee3f9a49f297f510234` |

## 收口动作

图01通过后仅允许调用授权的`record_review.py`，输出`.tmp/s10y-image/6-8g/fig-01/fig-01.review.json`，notes指向本报告并明确未做headed课display/提升。该命令自带规格与哈希一致性检查，不另启动独立validator或render。

图05本快照不写PASS review，不提升；其机械pass证据原样保留。F0105-01是作者需先处理的具体必修问题，本审查不自动进入重绘、再次渲染或下一轮审查。

### 已执行记录

仅一次调用授权的`record_review.py`，退出码0，输出`PASS: fig-01 -> .tmp/s10y-image/6-8g/fig-01/fig-01.review.json`。随后只读该新review确认schema为`ld-s10y-image/review@1`、figure为fig01、status为pass，source/spec/render/SVG摘要均与上表一致，notes明确限定本图及scratch范围。

新review SHA-256：`d663c119ad1d3ffe2519821f70a34b283cd02feb698befa0b86e377753fa8a0f`。图05没有写review，未改任何图产物或进行提升；本轮到此停止。
