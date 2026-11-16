# phy6-c5-s10 全文 TEXT-only 作者报告

## 授权与状态

仅现代中文TEXT作者，不是源独审或现代图作者；不生成答案、选择题或交互。复用main已成功一次的official adapt-prepare模板，没有重新prepare。final11及此前全部freeze保持原字节，本次只写新独立text-author-c5-s10根及本工单报告。

自有根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10`

候选：
`adapt/6p/modern-us-neutral/lessons/phy6-c5-s10/{lesson,exercises,figures}.template.json`

## 全文来源

完整读取raw lesson.json/lesson.md/exercises.json及main三份完整prepared模板，保留全部21源块（13正文、4正文图、4图题）、四题与图197–200。相关page.json/page.md/audit只作为当前已抽取源身份快照，不重跑源门禁或自称重新完整源审。实际逐张以functions.view_image查看完整原PNG197、198、199、200各一次；源观察、稳定图ID和每PNG SHA在source-figure-observations.json。

图197保留落重、滑轮、架子、绕绳、车轴和小车关系；图198/199保留压缩与伸展的弹簧举重实验；图200保留钢球A、木圆柱B和运动关系。没有添加隐藏构造、比例、匝数或数值。

原始source.data、source.sha256/source.path、逐块source_text、source_refs及题号/栏目/页块/图归属均不修改。只在现代text中声明clarity/layout；numeric_changes和historical_entities保持空数组。本课无需要替换或声明的来源历史身份。

## 现代措辞

全文保留电动机、燃料交通工具、水轮机及人体的能量利用实例，澄清“消耗”是利用和转化而非凭空消失。保留生活中“能量大的人”的用语示例，同时区分生活表达与物理量。

保留悬举重物、小车、弹簧和钢球做功的全部源例；区分具有做功能力与正在做功，不把静止物体说成没有能量。能量的本课定义、同为焦耳的单位和做功能力的比较均保留。

末段保留功与能量变化的联系，但明确做功传递能量、对外输出与外界输入、增加和减少，以及没有其他传能途径的范围。没有添加未登记数学公式或将正功无条件当作物体能量的正增加。

四个原问题全文不改；第1题仍问例证，第2题问能量条件，第3题问量度单位，第4题问用能量概念定义功。题目原来的A/B正文标签、图号197–200、原单位及所有原數值不变，不增加题目或填入答案。

## 排版与作者机械

初稿仅使用既有edition.normalize_lesson_layout与normalize_exercise_layout各一次，把完整语句分行并按正式规则分段。对这个内存normalize后的完整候选执行prose_flow一次；section_breaks复制其真实相邻paragraph文本，按来源块进入实例、能量定义、功与能量变化三个概念位置选取，不用手工段落数或先前未normalize文本锚点。

首次仅一次完整TEXT-only作者机械：原快照、身份、原文引用、数字和公式、文化profile、题面行分割、缓存最终flow相邻anchors、原图ID/引用及原figures模板字节、一次完整KaTeX批次。它不是独立全文语义审批，现代图规格、渲染和图独审不属于本次。图模板里的modernized为prepare既有未来占位，未填充现代图且未标已批准。

首次机械确实FAIL：normalized paragraph13末尾粗体没有闭合，闭合符被既有三句分组放到paragraph14首端；htmlfrag逐段strong配对无法跨段。其他全文来源、数学、数字、单位、题面、图身份检查均无错误。整个初稿、初稿flow、check和工具历史SHA已保存first-failure且不覆盖。

唯一修复1/1只在新repair-01候选把p0206#10现代句“大小。**”的既有粗体闭合符移为“大小**。”，没有改变任何正文词语、标点字符、源事实或源强调内容。原active候选与原author-inputs继续保留；原源层和稳定工具不改。只重normalize该一块，并对修复候选执行一次affected prose_flow获取当前相邻锚点；未变全文机械结果复用。受影响检查仅核这一块的原文身份、数字/数学、标记配对、真实htmlfrag.proseInline片段和其余块/题/图字节未变。初稿完整检查及修复affected检查分别保留，不把第二次改写说成零修复或第二次全文检查。

实际检查结果、唯一修复用量、工具前后SHA和最终paragraph/anchor数在下方计算冻结记录。修复预算已用尽；如仍失败则冻结BLOCKED，不再修。

## 冻结边界

prepared-original、raw-source-snapshot和source-freeze.json保留输入字节与身份。full-text-snapshot.json包含完整raw与现代三模板；author-freeze-manifest.json列全自有文件和报告SHA；author-handoff.json绑定三模板、全文快照、mechanics及manifest。

本地start/layout/check/freeze实际argv、exit和工具SHA在commands/及layout-execution.json。没有adapt-finalize、render、retain、canonical写入、DB、app、Git、工具/schema/依赖编辑、安装、浏览器或Azure/model服务调用。无私有答案/choices输入，无自审批或晋升。新增服务费用0，token没有独立计量。最终冻结后停止，无在途session。

## 实际冻结记录

```json
{
  "templates": {
    "lesson.template.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/repair-01/adapt/6p/modern-us-neutral/lessons/phy6-c5-s10/lesson.template.json",
      "bytes": 19756,
      "sha256": "a0a22551e103b1a46061807ce72c51f4e3c6577c1d6171eea683c697e7b6bcbd"
    },
    "exercises.template.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/repair-01/adapt/6p/modern-us-neutral/lessons/phy6-c5-s10/exercises.template.json",
      "bytes": 4419,
      "sha256": "164eb497f1b4e9df7962de38f63c446578ef179f609fae61b87bb5713f834669"
    },
    "figures.template.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/repair-01/adapt/6p/modern-us-neutral/lessons/phy6-c5-s10/figures.template.json",
      "bytes": 2116,
      "sha256": "0bb7857fc1913e7ae69040f27beacd47af3156fc6ba5d7045e275fb439d0f328"
    }
  },
  "full_text_snapshot": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/full-text-snapshot.json",
    "bytes": 36398,
    "sha256": "6bf6a8cb327bb60e10a991dd4c824288767b8ac77c1789b971f04ad37871ff26"
  },
  "source_freeze": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/source-freeze.json",
    "bytes": 14401,
    "sha256": "4aee96765600635861b5a768a69f75097a92ad724acb9df5f3dc857ee3aff2d9"
  },
  "mechanics": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/repair-01/affected-mechanics.json",
    "bytes": 6636,
    "sha256": "bf42f996bd18d49127c1a77e2a4a6f0fb2b0aa121845567e169f2f1bf60fbacf"
  },
  "initial_full_mechanics": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/text-only-mechanics.json",
    "bytes": 6751,
    "sha256": "1e3e9bd2055053d0970ebde936b84d4069351a1d0791bde40a3817c230f06e77"
  },
  "counts": {
    "source_prose_blocks": 21,
    "source_p_blocks": 13,
    "tasks": 4,
    "body_figures": 4,
    "final_prose_paragraphs": 15,
    "section_breaks": 3
  },
  "repair_used": 1,
  "repair_limit": 1,
  "first_failure": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s10/first-failure/failure.json",
    "bytes": 176,
    "sha256": "a3f41c527d6a55833e704f1dd05798430f8237278df1cf93e9e0e680264b2974"
  },
  "status": "frozen_author_pending_independent_text_review",
  "candidate_status": "draft",
  "independent_approval": false,
  "inflight_sessions": []
}
```
