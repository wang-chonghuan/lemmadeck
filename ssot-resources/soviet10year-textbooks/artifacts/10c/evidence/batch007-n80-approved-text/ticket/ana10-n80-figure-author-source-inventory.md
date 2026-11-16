# n80 fig-10/fig-11作者Stage A源清单

2026-11-16，STEMROBIN-184 worker B。角色为两图唯一FIGURE AUTHOR，不是独立审者；这是original-only inventory/routing冻结，不是FigureSpec、渲染稿或批准记录。

根目录：`/Users/yong/.codex/worktrees/a07e/lemmadeck/`。本单唯一新文件即本报告。没有读取母方独立gate、其他作者清单、现代n80模板/context、答案或choice，没有重开旧源页/重做n79/source review。

## 输入及实看顺序

先读当前image SKILL、routing、figure-spec及canonical schema，再完整读取忠实n80 lesson.json/exercises.json；随后用`view_image`的`detail: original`逐张、分别打开两张durable原PNG，各一次。未做第二次图像打开、局部证据crop、图像变换或浏览器操作。文件hash与本次授权精确相符。

所有以下路径相对根目录：

|允许输入|SHA256|
|---|---|
|.agents/skills/ld-s10y-image/SKILL.md|`6e839e78f784a1e9bb370fcef1104d150380523edef8a72f0ccb7fd4a8339063`|
|.agents/skills/ld-s10y-image/references/routing.md|`dc56a358971ec631b40d305c695e6ca5dccca3420fe4754568e399eacd19f8f9`|
|.agents/skills/ld-s10y-image/references/figure-spec.md|`0de03f32aa271aed552d51d41c326911cc1137c17d9217a8f74c0c4b7f7bc3a9`|
|.agents/skills/ld-s10y-image/assets/figure-spec.schema.json|`34a91459aa2885b9d9677297137d5c7e3757a62c9f51f2cf31bf7c515da6d5c1`|
|ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s2-n80/lesson.json|`efacd3b9f188d6c26f36b34fbed4109d1159eb6c06b026e478131cc1ab95556f`|
|ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s2-n80/exercises.json|`c21cc8e0889df7494d49425eb40b94d7b6f3c97679e139bf0c9d19d63b434e66`|
|ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-10.png，429x271|`f51e919518420811f91d74e077f174442ec2acdb35346a21914f7a96329b91ef`|
|ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-11.png，441x268|`4d30e4fe5c3590cc51cc90dace7b72e43a0ccfd23bfd56c6d50805c0b7aa135a`|

PNG尺寸仅作原文件身份记录，不是物理测量、作图坐标或比例常数。另仅查看现有validate_spec.py的connects/pointOnCircle等实现确认计划所用关系类型的真实能力；没有运行validator、测试或修改任何工具。

## 完整忠实文本角色边界

n80共有32正文对象：28个p、2个fig、2个独立cap；全部已读，包括后续谐振动通式、两阶导数、周期/频率/初相、初始条件、注和源向量表述。8道原书写题52-59也全部已读，全部figure_refs/figures为空；它们不向本图提供额外图内给定量。本阶段不求题、不根据后续公式给两图增加振幅、周期、频率或相位标注，不修源符号/数学。

直接图义来自`lesson.prose[2]`，refs为`p0023#2`：

- 质量为m的小球固定在两个水平弹簧上，弹簧另外两端固定。
- 图10用于说明平衡状态，球心坐标x等于零。
- 图11用于说明球心坐标x不等于零的位移状态，回归平衡的力服从F=-kx，k为正常数。
- 随后的ma=F和x''=-(k/m)x是课文推导，不是原图内可见的公式/参数标签。

图10/11的正文对象refs分别为p0023#3、p0023#5；caption refs分别为p0023#4、p0023#6。两个PNG内部都没有“图10/图11”caption，不能把正文外caption重复画入图内。

## fig-10：原像素冻结

一幅装置示意，非多案例组合、非函数图象。上层装置、下层横坐标参照分别完整可见：

- 左、右各一个固定端支座：粗黑竖向边及上下短横边，外侧有斜向排线。斜排线表示固定支承的画法，不是弹簧圈、刻度、阴影数据或单位长度标记。两内侧面之间有完整装置，不补台面、地面或球下方的第三支承。
- 两根连续线迹的水平弹簧，分居球的两侧。各有端部过渡线和一串回环；左根连接左支座与球左侧，右根连接球右侧与右支座。原末端与支座/球缘接入，不能画成悬空的独立蛇形线或在球旁留明显断口。
- 一个深色、近圆的小球，位于装置左右中部。没有第二个球、球心独立点标、m/k标签、吊线或力箭头。球缘和弹簧末端有黑墨合并，不能从该局部反推出独立挂钩/穿球结构、精确接触角或严格水平直径接点。
- 两侧弹簧都完整保留，球和两根弹簧的整体中线近似水平；两侧视觉跨度大体均衡。这里的“近似/大体”是示意外观，不声明像素精确相等、相同原长或相同弹簧刚度。
- 下方一条长实线横轴，从左至右，右端有向右箭头；轴名x在箭头附近下方。没有左向箭头、y轴/y标签、时间轴、数字刻度列或F-x曲线。
- 球的下方有一条从横轴向上伸出的竖实线参考标记，其横向位置近似对应球心。它与球之间有白色间隔，不是实际吊杆，也没有可确认的竖向箭头头部。
- 此参考标记下方有一个空心、倾斜、零样/字母O样的字形。只冻结该字形的存在、外观和参考位置角色，不判定原字符是数字0、Latin O或其他码点。课文明确“坐标等于零”是语义依据，不是像素码点鉴定。
- 可读标签角色共两项：参考位置的空心字形、横轴的x。原图没有额外数值、物理单位、长度尺寸、弹簧常数、振幅或频率。
- 主体与轴线都是实线，支座为排线；不增虚线“隐藏边”。原黑墨有粗细/接触合并及白底散点，不把破墨或孤立小斑当作点、刻痕或新标签。

**源/课文分离**：图像给出上述两层装置布局和参考标记；“这就是平衡位置、其球心坐标为零”来自本课明确正文。不能把大体居中外观量成物理位移或等长断言。

## fig-11：原像素冻结

仍是一幅完整同类装置，不是新增两状态叠图，也不是力曲线：

- 左右两个固定支座均保留粗黑竖边、上下短边和外侧斜排线；两端固定结构与图10相应。没有把右支座省去或改成手推/牵引装置。
- 仍有两根弹簧和一个深色近圆小球，端部接入支座及球缘。小球处在装置偏右的状态，不是另加一颗平衡位置的浅色球。
- 左弹簧的横向跨度较长，右弹簧较短且回环更密。相对图10，表示向右位移后的左侧拉长/右侧压短的布局；不统计源圈数，不据回环数量推力学模型、长度比或精确压缩量，也不声称课文给出了两根弹簧各自的未变形长度。
- 球及弹簧仍组成上方水平装置行。端部黑墨接触/合并与图10相似，不编挂钩、球内连线或接触点精确角度。
- 下方长实线横轴向右有箭头，轴名x在箭头附近下方；没有y/F/t轴、刻度列或图内物理常数。
- 横轴上有两条分离的竖向实线参考标记，均向上伸出，均不是带可确认箭头的独立坐标轴。左标记在原平衡位置参照处，其下是同类空心零样/O样字形；右标记近似竖直对应当前小球中心，其下是x。
- 因而图11保留三个标签角色：原平衡位置的未定码点空心字形、当前位移位置值x、横轴名x。两个x不能去重、合并或互换；空心字形不以图10观察替代本图实际存在。
- 两标记之间的间隔表达图中右移的非零位置。图像显示的是x向右的一种状态，不是把正文一般x≠0偷换成“所有位移只能向右”。
- 原图没有从当前球到平衡点的F箭头、位移量双箭头或虚线投影，没有x>0数值标签，也没有弹簧长度/单位。后续若要新增必须另获现代context授权，不能标记为源已有。
- 支座、弹簧、小球、横轴和两个参考竖标的上下空间关系完整；轴不与上方弹簧接触，参考竖标上端与小球保留白色间隔。散点/墨迹不登记为新部件。

## 最小生成路由

两图均规划为 **deterministic + instructional**。关键为双固定支座、双弹簧、小球、两个状态下的位置对应及可读标签；当前schema的segment/polygon/circle/axis/text/svgPath足以表达，不需写新spring对象类型、不需生成模型、自然背景、hybrid artwork或任何新3D系统。

- 支座及排线：segment，必要时polygon表达粗支座面；排线始终保留支承角色，不做尺标。
- 小球：一个circle，填充与线条使用semantic roles；圆半径是未来示意外观参数，不作为源实测球径或物理常数。
- 弹簧：每根一个连续、确定性构造的svgPath回环主体，加必要的短segment端部过渡。它是机械弹簧示意，不能误画为另一个sin函数曲线图。回环圆整、线宽及周期性可作为现代笔迹规整，具体回环数量不是源给定、不写成教学计数要求。
- 横轴、向右箭头、竖参考标记、可读标签：由axis/arrow/segment/text等既有对象承担；不自动生成数值tick序列、y轴或额外原点点标。
- 只建议保持原上下两层及右移对照。未来任何严格球心投影、理想水平性、清洁接触与统一支座形状，必须声明为text-supported schematic regularization，不伪称像素精确测量。
- 现代是否使用数字0，待批准完整context后由其“平衡位置坐标为零”的语义明确声明为text-derived notation；本源清单不先决定原空心字形的码点，不写现代label。
- 未来需全canvas及实际产品宽度检查，最终文字≥16px；本阶段没有选择具体canvas/width、坐标、生成display字段或开展视觉gate。

## 计划ID映射，不是实际spec

以下仅稳定命名和后续验证计划。没有写at/from/to坐标、radius数值、路径d、assertion参数或context。接触/中心/投影锚点是内部示意构造角色，不是原图印出的额外点，不得据命名新增可见点或标签。

|源部件或角色|fig-10计划对象ID|fig-11计划对象ID|后续关系/核验计划|
|---|---|---|---|
|左固定支座及外侧排线|f10-left-support-face、f10-left-support-caps、f10-left-support-hatching|f11-left-support-face、f11-left-support-caps、f11-left-support-hatching|支承组完整；支座接点与其内侧面关系|
|右固定支座及外侧排线|f10-right-support-face、f10-right-support-caps、f10-right-support-hatching|f11-right-support-face、f11-right-support-caps、f11-right-support-hatching|支承组完整；不能仅有一固定端|
|左弹簧及两个端部过渡|f10-left-spring、f10-left-wall-lead、f10-left-ball-lead|f11-left-spring、f11-left-wall-lead、f11-left-ball-lead|两个lead的connects；回环主体与相同端点接续的视觉检查|
|右弹簧及两个端部过渡|f10-right-spring、f10-right-ball-lead、f10-right-wall-lead|f11-right-spring、f11-right-ball-lead、f11-right-wall-lead|同上，不遗漏短的压缩侧弹簧|
|唯一小球|f10-ball|f11-ball|一个circle，球侧接点pointOnCircle；不额外画平衡球|
|向右横轴及轴名|f10-position-axis、f10-axis-x-label|f11-position-axis、f11-axis-x-label|保持完整轴及右箭头；没有自动数字刻度|
|原平衡位置竖标、其空心字形角色|f10-equilibrium-marker、f10-equilibrium-label|f11-equilibrium-marker、f11-equilibrium-label|竖标/横轴perpendicular，基点pointOnLine；label角色单独保留|
|当前位置竖标及位置值x|图10当前位置与平衡标记同一角色，不增第二标记|f11-displacement-marker、f11-displacement-x-label|独立竖标/独立x；与轴垂直及基点在轴上|
|球心与位置参照|f10-ball-center、f10-axis-origin、f10-marker-top等内部锚点|f11-ball-center、f11-axis-current、f11-current-marker-top及f11-axis-origin等内部锚点|源为近似对应，严格投影是已声明的现代规整；不打印新点名|

计划接触锚点分别命名为`f10-left-wall-contact`、`f10-left-ball-contact`、`f10-right-ball-contact`、`f10-right-wall-contact`，图11同名前缀替换为f11。它们只界定端部关系，不宣称源有四个显式点标。

计划关系ID：两图各用`f10/f11-rel-left-wall-contact`、`f10/f11-rel-left-ball-contact`、`f10/f11-rel-right-ball-contact`、`f10/f11-rel-right-wall-contact`映射实际lead连接；`f10/f11-rel-left-ball-boundary`、`f10/f11-rel-right-ball-boundary`映射球缘pointOnCircle；`f10/f11-rel-reference-on-axis`、`f10/f11-rel-reference-perpendicular`映射平衡标记。图11另有`f11-rel-current-on-axis`、`f11-rel-current-perpendicular`，球心/当前参考的规整对应另列`f11-rel-current-alignment`；图10用`f10-rel-equilibrium-alignment`。这些是计划名称，不是已执行断言。

现有connects仅接受arrow或segment，不能将svgPath回环主体冒充已受connects验证。未来端部lead由同一端点定义、用既有关系验证，回环主体端点连续与拉长/压短的定性对照仍须完整实际render/source视觉gate。没有源物理长度值或压缩比例，不能用distance/equalDistance假造测量事实，也不能让objectCount替代接触/对齐关系。

未来source.inventory要将可见机械部件、真实标签角色与有效关系正确分组；内部未打印锚点不可被冒称可见源点。是否requires pointRelationships须在实际对象/关系建立后按真实契约绑定，不在本阶段生成虚假通过标志。

## 不确定性与冻结

空心字形的0/O码点、弹簧末端墨迹合并的精细接触角、回环的机械尺寸及源未给的原长/刚度不可由本图可靠确定；以上局限不以常识或未来正文覆盖。两图足以规划现有deterministic教学示意，尚不具备current-approved-modern-context，故本次到源清单/路由为止。

本报告为作者观察，未读取或代替母方已冻结的独立观察。未写spec/context/SVG/render/review/manifest，未调用图片服务或validator，未修改source/page/index/tools/dependencies/现代稿，没有Git/stage、DB、chat、发布、浏览器、网络或服务操作。只读输入，唯一报告冻结后停止。
