# phy6-c5-s11 offline choice author

作者冻结待main独立pure-view盲审；不是review、批准、自动说理证明、retention或发布。

## Authority and order

只使用当前canonical现代课whitelist projection：8正文块、7原题、0图。官方inspect一次、prepare一次，seed完整选择`1,2,3,4,5,g2-1,g2-2`，完整定义段`0,1,4,6`，不选数值worked example。实际图片/新图片均0，不需要浏览器或图服务。

先独立现场完成七原题完整源解、所有必要条件及原g未给时的参数答案，`source-solutions.json`与`source-solution-freeze.json`在draft不存在时冻结。此后才手写选项。没有读取main私有源解、已有answer-keys、其他作者解、旧choices、interaction、tests、env或DB。

## Seven response units

- 定义：完整相对位置关系与动能/合力/静止时间区别，single。
- 举例：高处重物/受压弹簧/较高水位水的native multiple集合；无逐物体是非或组合码。
- 零点：参考约定与静止、合力、能量差区别，single。
- 重力量度：由重量和沿力位移的功量度能量，single。
- 弹簧：说明有能量、恢复功量度、未变形零点完整三项一组，single。
- 100千克/10米：明确可见g=10牛顿/千克，完整能量结果，single。
- 500千克锤头：4米剩余势能及10米至地面全程可供做功能量完整二量账，single。

7题、6single/1multiple、29options；内部9true/20false，每选项均有可重现推导而非随便填邻近数字。完整7coverage/29源要求组件，9项能力损失明确记录。choice不证明自主书写、开放举例或实际演示/计算步骤生产。

## Missing g and process scope

两原数值题未给g，源解先写含g表达式，并分别给常用9.8/10条件结果。choice数值题面明确g=10，不悄设g、不编辑seed/canonical prompt。锤头原“一共”公开明确为初始10米至地面全程；4米剩余势能与10至4已释放量不得混用。所有原质量/高度完整保留，没有虚构测量。

## Pure view

`view.json`只含question id及其可见view，不含源映射/解/键/intent/错因/coverage。独立review应先读seed定义与pure view，独立求解后再对比内部draft。`draft.json`不是客户端载荷。全课0图，不产生新图。

## Calls and limits

全部用shared Python、`PYTHONDONTWRITEBYTECODE=1 -B`。官方inspect/prepare各1，源解先冻1，pure-view projection1，`validate.py --repo . --seed .../seed.json --draft .../draft.json`一次，exit0：“mechanical checks passed; semantic review still required”。完整argv/UTC/stdout/stderr hashes在evidence。

结构PASS不是数学或语义批准。没有读/写review，没有运行带review的checker，没有self_review或独立review。最大机械-inclusive修复1，实际0/1，无首FAIL；没有额外回放/重跑PASS。作者源解、题面、选项均冻结。

无新图、成本、服务、浏览器、env/install/DB/Git/app/tool/schema/canonical edits或publication/retention。独立TEXT已finalize的成功使用不重复其gate；等待main第一次完整pure-view盲审。
