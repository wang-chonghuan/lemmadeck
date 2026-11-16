# 7p212 Figure Author Freeze

Ramanujan，`author`，待非作者首次独审，不自认独立PASS。
原图完整实际打开后先写 source-inventory，再构造确定性装置图。
完整已批85上下文14项、九题、17实际段及 lesson/exercises source.data 均入spec；
Volta FIRST与main44绑定结论复用，没有重跑TEXT或读答案/choices/private源解。

## 源事实与现代增加

左架台底座、立杆、卡箍、横臂、螺钮和固定套，微向右上延伸的铜丝，
四枚连接图钉、三枚脱离图钉，右侧酒精灯储液体/盖/灯芯/火焰，
完整木质支承块及灯底接触全部保留。
111对象、53断言、七inventory组。接触/连接断言绑定实际可见构造的定义点，
不是独立于图稿的常数断言。

现代规整为明确的装置示意：清晰几何线、文字源已有蜡连接点、英文识别标签、
保留木块而省去装饰木纹、常规多边形燃烧状态符号。
没有自然人物/动物/场景素材，不使用semantic svgPath或手工改输出SVG。
没有标尺、温度/时间/路程数据、操作步骤、答案箭头或轨迹。
3.7/21.5仅保留于完整题面上下文，不成为图中读数。

## 真实调用与首失败

- official build_context一次exit0，仅隔离85输入。
- FIRST canonical render一次：draft validator通过，渲染因Copper标签的顶部padding越界exit2。
- 首FAIL的spec/SVG/render/执行记录/上下文/清单完整保存于`failure-01-copper-label`。
- sole repair仅将Copper标签向下移15 canvas px；所有装置、其他标签、53断言与输入不变。
- 修复canonical render一次exit0；其内置draft validator不另行重复调用。
- native capture一次exit0，六个actual306/640 neutral/accent/print样本；
  已实际打开两张三主题sheet，观察全部六个投影。
- 实际文字最小16.25625px@306，34px@640；CSS semantic主题与print清楚、无裁切。
- 两个任务自有headless浏览器全部关闭，PWDEBUG禁用，无用户profile/CDP/system input。

作者机械inclusive修复预算1/1已耗尽，不再retry。无Azure调用、无服务重试，
故没有服务token/cost；不伪造审批或生成账。无record_review、promote、
retain/finalize、Git、DB、依赖安装。完整课和独立图审批仍pending。

精确当前spec/output/context/source/FIRST/六native/budget及冻结manifest的绝对路径与SHA
均由本图`repair-01/author-handoff.json`绑定；root handoff是同字节交接副本。
