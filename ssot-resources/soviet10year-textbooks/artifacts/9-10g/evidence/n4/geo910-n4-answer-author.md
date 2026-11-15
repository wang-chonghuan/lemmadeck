# geo910 n4 Answer Author Handoff

日期：2026-11-15。角色：本批标准答案作者，不是本批答案独立批准者。范围仅为现代n4书写题27–29；n1/n2有效partial不计本批完整。

## Allowed Inputs

仅从当前durable现代lesson/exercises及父方已prepare一次的空模板独立推导。未读取父方`n4-source-first.md`、父方答案、choices、reviews或作者选择题内部稿。没有重新prepare、改源、修改模板、生产inputwidget、finalize、promote、网络、DB或commit。

实际输入raw SHA256：

- `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n4/lesson.json`：`78725b68d739504657c1e4ee3382f0dac2e1214fdf7af1d2b4bf53bcfe8ccec2`。
- 同目录`exercises.json`：`e92b23248c77e2bdea6942b653c77f9703d6ee41285101978911e024c73a1a85`。
- `.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n4/answer-keys.template.json`：`a7c74bd0b7dfc35f1bfc5a6c83bc5bde57d0b11791b272d86b88413a7e9d20b0`。

当前lesson/exercises均为draft，未提升。现代课文明确把空间“作平面/直线”解释为证明满足条件的对象存在，并在自身解法中引用直线与线外点确定唯一平面的性质。本稿沿该含义给出作法与存在性证明，同时说明解数。全部三题figure_refs为空；figure11只是正文占位图，不是三题输入，figureEvidence均保留空数组，未声称题图缺失。

## Independent Solutions

27：两种空间情形完整覆盖。

- `M∉a`：先作唯一平面`(a,M)`，在该平面内作过M的垂线。任何解与a相交，故也必须在这个唯一平面内；平面内垂线唯一。解数为1。
- `M∈a`：任取通过a的平面，在该平面内于M处作垂线。通过a的不同平面给出不同解；任何解与a又唯一确定其中一个平面。因此恰有无穷多解，构造族穷尽全部解。没有把异面直线的方向垂直混入“相交成直角”。

28：题面不足以确定唯一交线，但不是无解；本稿完整列出所有合法构造族，因此没有用ungraded掩盖未解分支。

- `a∩alpha=M`只给出a穿过alpha，`N∉alpha`只排除N在alpha及N=M；它允许N在a上。
- `N∉a`：唯一平面beta通过a和N。通过N作b平行a，与alpha交于P，作MP即交线。证明P存在且不同M：在beta中，alpha的交线与a相交，也必与平行于a的不同直线b相交；交点若为M，将迫使a、b重合，矛盾。交线唯一。
- `N∈a`：N不同M，但通过a和N并不额外限制平面。alpha内任一过M直线ell都是合法交线：取其上P不同M，唯一平面beta通过a和P，自动含N且与alpha恰沿ell相交。反向，任一通过a的平面与alpha必沿某条过M直线相交。不同ell对应不同beta；全部解数为无穷多。
- 第一分支的平行辅助线方法在第二分支退化为b=a、P=M，不能据此漏解或暗加`N∉a`。本稿提供完整解族，不声称原条件足以确定唯一对象；独立审查仍应按该实际范围判断任务是否接受这种条件分析。

29：存在且唯一，并给出实际作法。

- 在已知alpha内过M作a的垂线ell，分别覆盖M在线上/线外；由于alpha固定，ell均唯一。
- 取ell上P不同M，以M、P、N确定beta。N在alpha外，故三点不共线；beta存在并不同alpha，交线恰为ell。
- 任一其他解的交线必须是同一平面内同一条唯一垂线ell，而通过ell与线外点N的平面唯一，故beta也唯一。辅助点P的选择不改变结果。

## Draft And Grading

草稿：`tmp/geo910-c1-s1-n4-answer-draft.json`。

raw SHA256：`5fd0e7cc3da7d08b4f387a7016669ada8b6ee35c5c4df8623654372eb1dbcc85`。

3个answer对象，原顺序27/28/29，全部derived/ungraded，status=draft。没有bookRaw、exact键或输入widget；parts均为空，全部构造、解数、证明和限制在displayAnswer中逐项呈现。无穷多解及空间构造说明不适合作为有限numeric或expression输入自动判定；没有为自动判分发明数值编码。ungraded不替代完整解答，本稿已覆盖各分支及题28的全解族。

本n4草稿一次写成，未进行后续改稿，也未覆盖旧版本。后续若需修稿，必须先保留完整旧稿字节快照，而非仅记录hash。

## One Read-Only Check

实际只调用一次官方`lesson_answers.validate_lesson`：使用现有lesson Python环境，通过静态`import lesson_answers`入口，设置`PYTHONDONTWRITEBYTECODE=1`。调用时使用代码所有的现代文化禁词profile；没有调用finalize或其浏览器入口。

真实结果：exit `0`，`errors=[]`，answerCount=3，exerciseIds=`["27","28","29"]`，status=draft。

同一只读调用中额外核对了模板header、prompt/exercise/historical_entities/空figureEvidence、现代题面及空figure_refs逐项相等；核对全部derived/ungraded/空parts且无bookRaw；lesson/exercises raw hash与实读输入绑定一致。所有核对均无错误。上述结果只证明结构及绑定，不冒称独立数学批准或Gate2/finalize通过。

CE：没有numeric/expression parts，不适用，未运行。MathLive：没有exact parts，未运行。没有full tests、新服务或浏览器。

## n1 Evidence Retention

n1首次稿原路径确曾被覆盖，但现已从本对话覆盖前完整实读内容精确恢复为`tmp/geo910-n1-answer-initial-from-observed-bytes.json`；实际raw SHA256为`5babbf84d423803d4e062af983b6ee06afc78683bbf7fa407463b68713dc7f22`，与首次原稿hash完全一致。它仅是已撤回、未获课程分类authority的完整初稿证据，不是有效答案或批准稿；恢复没有重做n1求解，也未修改n1当前受阻稿或n2恢复检查点。

停止于本作者handoff，等待父方独立比较；不自行批准或继续其他任务。
