# 平行题合同

读者任务：读完当前课，独立回答原题的数学问题，不因书写或公式输入而卡住。
每题问一个原题已有的判断、数值、式、集合或图象，不创造无来源的课外题。

## 产物

覆盖表每项包括原题号和语义 target（小问/空格/作图识别），每个 target 恰有一道题。
没有印刷小问的独立多要求题也要拆分；同一公式的“判断是否属于某类；若是，指出系数”
可用一个完整的“判断＋系数”选项同时回答，不必拆成重复题。
集合值域保留整集合的目标，不为每个元素额外造一道题。复习题沿用原知识类型。
questions 的 source.exercise/source.target 绑定覆盖项，id 在本课内稳定。
来源题号、小问标签、group 与能力限制属于内部记录，不进入学生题面或反馈。
学生只看到本课连续题号。题面独立可读，不写“原题”“原表”“本题检查某种能力”等生成说明；
需要图表时直接附图表并称“下表”“图中”，不要求学生返回原习题寻找条件。
每题包含 prompt、figureRefs、3–4个 options、correctOptionId、explanation 与 verification。
options 各有稳定 id、text；错误项有 misconception，数值/表达式项带 value。
value 与显示的数学表达式必须相同；分数写完整的 `\frac{a}{b}`。
解释1–3个短句，回答本小问，不一次揭示同原题后面的所有小问。

verification:
- numeric：expected 是已求解的数值，逐选项 value 验算，恰一个相等。
- expression：expected 是 LaTeX，按题目定义域检查等价与唯一解。
- set：有限数集的 expected、option.value 和纯数学 option.text 均写完整集合 LaTeX。
  工具按数学集合判等（忽略顺序和重复，识别分数/小数等价），不把换序当作干扰项。
  人工独立代入定义域每个元素，核对整个值域；不能只查元素个数。
- literal：每项理由和结论逐项审核；不以唯一 correctOptionId 冒充数学正确。
- graph：图由 ld-s10y-image 的确定性 FigureSpec 渲染，选项同坐标范围、刻度、尺寸。
  图 A/B/C 按 options 当前显示顺序命名，不从稳定 option.id 推断；调整顺序时同步图名，
  不为改显示名称而改 id 或 correctOptionId。
  数值反比例/正比例选项可用
  `scripts/graph-options.mjs <choices.json> <reference-source.png> <inspected-inventory.json>`。
  先看实际源PNG，inventory JSON 中的 description 记录源图内容和现代新增框架的区别，
  authoritativeText 数组记录完整相关课文/题面（每项含 text）。
  不从旧课模板复制题号、图形类型或来源说明；没有给定图的作图题可借源图作坐标框架参考，
  但不能把参考图的曲线、刻度与标签冒充当前题的给定条件。
  option.graph 写 `{k,type}`，type 为 inverse、inverse-positive、direct、direct-positive。
  坐标识别可写 `{type:"points",points:[["A",x,y],...]}`，从原题给定值定义点及错误变换。
  线性函数可写 `{type:"affine",k,l,domain:[a,b],closed:[true,true],integers:false}`；
  不写 domain 表示全部实数，integers 表示只描定义域内的整数点、绝不连线。
  domain 的有限端点是实际定义域边界，不是绘图窗口；不能把无穷射线写成窗口上的闭区间。
  半无限定义域、数轴射线或组合图交给 ld-s10y-image，不把临时模型当作本工具支持的类型。
  数轴射线以箭头表示延伸；实线/虚线只区分曲线，不改变端点的实心/空心含义。
  question.graphFrame 指定 bounds、xStep/yStep、xTicks/yTicks 和可选 xLabel/yLabel，
  同题选项共用框架。读图材料可在 generatedGraphs 中写 id、graph、frame、text，
  text 为完整相关题面；工具产生 generatedFigures 引用，同 id 可供多题复用。
  图框必须包含所查询的坐标和需判断的有限端点；组合图各子图使用同一足够大的框架，
  不丢弃子图要求后套默认窗口。非整数精确读数可明确允许按给定公式验算。
  工具在网格外缘标刻度值，与网格线对齐，避免曲线遮字或自动避让将数字移离刻度。
  两轴单位不同时使用独立缩放；判断斜率依赖刻度，不依赖屏幕上的倾斜角。
  其他图形直接委托 ld-s10y-image。图保存在当前课的 choice-figures；
  option.figure 引用 spec/svg/render/review 四个文件，不能手写内嵌SVG。
  该工具只渲染，不自动批准；检查正常屏宽的图后用 ld-s10y-image record_review.py 记录。

## 转换

- 原条件、数据、公式、图表保持；把“求/写/说明”改为选择，必要的条件显式说清。
- 定义以本课文字为准，不套用别的教材中同名/近似概念的附加条件。
- 表格每个空格单独选择。没有读图判断要求的纯数值填表，可把该列已知值和公式
  完整写进题面；内部记录表ID与列位置，不重复展示整张宽表。
  要求读图、读表或跨列比较的题仍须展示相应材料。求系数、写式、填表分别覆盖。
- 判断可以选择判断与理由，但不能把正确答案写进题干。
- 应用题优先选结果；多要求拆开，只有原题真的需要才加步骤。
- 作图转选图，内部标为 recognition，不宣称完成独立作图；学生反馈只解释数学结论。
- 原题同时要求描已知点、构造对称点、求坐标时，图形识别和坐标分别覆盖。
  先选图后读图的原题，后续小问各自附确定的读图材料，不改成只有公式的代入题。
  本技能渲染的材料用 question.generatedFigures 引用 spec/svg/render/review；
  不需要往原题的 figures.json 里加选择题资产。
- 读图仍看原图；粗刻度不能要求不可能读出的精确值，注明约值或允许用原式验算。
- 真/假原题可保留二选一，或采用3项判断与理由；不可为凑4项添加同义选项。
- 不用“以上都对”、明显荒谬的数值或因选项长度而泄露答案。
- misconception 要指出该错项的具体错误，不用“请看解析”充数。
  按所写错误再算一遍，结果必须等于该错项，不能给数值配一个算不出它的泛化理由。
  当前小问只能使用原题给定值推导，不能用后面空格的答案作为已有条件。
- 分数/小数不能构成两个等价正确选项；近似题需约定精度。
- 点是否在曲线上先检查定义域；区间端点与实际变量正值限制要保留。
- 比较实际定义域时问“完整取值范围”，避免必要条件与充分限制都被读成正确。

答案必须现场验算。已有 answer-keys 是参考，不是新的语义权威。
书后答案缺失不阻止求解；原题无法唯一理解时暂停该题并报告，不静默漏题。
