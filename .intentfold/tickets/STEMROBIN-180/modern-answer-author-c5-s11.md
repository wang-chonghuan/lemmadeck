# phy6-c5-s11 final answer 作者冻结报告

## 范围

本次仅在独立 scratch 写 finalmodern 绑定答案候选；不是正式收口或独立语义审批。main已明确报告 source七题 FIRST comparison PASS，以及TEXT FIRST PASS、exact绑定retain和官方adapt-finalize exit0；本作者复用该授权，不读取其审查答案或私有比较内容。源稿及s11 TEXT所有原freeze、s7 source-only新freeze保持不变。

自有根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-c5-s11`

读入main既有prepared `final-prepare-c5-s11/.../answer-keys.template.json`，没有重新prepare；完整读取当前canonical finalmodern lesson/exercises/figures，确认为8正文块、7题、0图。全部7条figureEvidence=[]，没有作图或浏览器工作。输入原文件及完整快照SHA在source-inputs.json，最终精确题面/身份绑定在prompt-bindings.json。

## 内容与判题

题1定义保留物体间和物体内部各部分相对位置两方面；题2保留多个源绑定实例及开放性；题3说明参考零点、地面约定及地面压缩弹簧反例；题4说明落回地面时重力做功量度及mgh；题5三个问句均回答，说明恢复可做功、功的量度及自然未变形零点，不能把某瞬时弹力乘以总位移当总功。

练习39第一题明确题面没有g，本答案取9.8N/kg；m=100kg、h=10m、地面零点，势能9800J。没有把g加入题面，也没有将9.8伪装为题面给定。

练习39第二题保留质量500kg、10m起点及4m询问高度；按同一9.8约定，4m处势能19600J；如果“一共”指从起点10m一直到地面，理想总可用功49000J；如果指已经下降到4m的区间功，则为29400J，必须说明范围。无耗散、从静止释放的能量解释明确注明模型，而不增加题目初速度或损耗数值。

七题全部source=derived、grading=ungraded、parts=[]、historical_entities=[]。前五为解释/开放题；后两没有题面g，最后一题还有功的范围解释。原source-only“未来可auto”的建议不沿用到最终候选。不写expected，不作交互规格，不启用任何自动判题。

## 绑定

candidate `answer-keys.json` 由既有prepared模板生成，保留schema/book/edition/lesson/status draft、原prompt及figureEvidence；仅添加完整displayAnswer/method/notes和精确身份、题面SHA。7题顺序为1、2、3、4、5、g2-1、g2-2；问题g1与练习39 g2不混淆，原题号、来源页块、原文及现代题面分别绑定。

每条promptSha256及frozenExerciseTextSha256均为当前finalmodern exercise.text的精确UTF-8 SHA，包含原有粗体和真实换行，不做手工normalize；sourcePromptSha256另绑定自己的已冻结原题推导。原prompt及canonical原文件不修改。prompt-bindings.json另记canonical源data、prepared prompt、来源身份及完整finalmodern文件哈希。

## 机械与使用

仅调用已有lesson_answers.validate_lesson一次作为作者结构/文化机械检查，载入现有modern-us-neutral profile。检查顺序、完整七条displayAnswer、derived/ungraded/parts及身份哈希；不运行正式cmd_finalize，不调用MathLive/浏览器/表达式子流程，不重审源或TEXT，不运行整批测试。

机械结果及工具前后SHA在author-validation.json。总修复预算1次（含机械），本候选若首检查失败将保留first-failure全字节，不以改变题面、g或判题状态凑通过；本次实际状态和预算使用在下方计算冻结记录与handoff。

本地命令的实际argv、工具SHA和进程步骤记录在commands/；仅author、validate、freeze三阶段。无服务调用、浏览器、DB、Git、app、工具、schema、依赖、canonical或其他作者目录写入；没有prepare、retain、官方finalize、promotion、publish或interaction调用。外部model调用0、外部服务新增费用0；token未取得独立计量，不虚报。没有读取main私有answer-source/review/choice keys。

完成后作者候选和交接字节冻结，待main非作者独立比较及其后retain/finalize；无在途session。

## 实际冻结记录

```json
{
  "candidate": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-c5-s11/answer-keys.json",
    "bytes": 14430,
    "sha256": "9f9270bfd0867e3695e91cb93701c2f38dc26694a4cb172cc344dc43af2204a1"
  },
  "prompt_bindings": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-c5-s11/prompt-bindings.json",
    "bytes": 9297,
    "sha256": "f3598c8d8b5f4865b54e8578bb1af1ef7842f1cebc55bb431cc134a15e73e8a8"
  },
  "source_inputs": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-c5-s11/source-inputs.json",
    "bytes": 4096,
    "sha256": "1eff822de6e047ddd1c7b5eb5d00f16ee6c2ed1fb2e3acfd539de53eeaaaa0ec"
  },
  "author_validation": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-c5-s11/author-validation.json",
    "bytes": 2467,
    "sha256": "fcd756ea4d35db91ffcd4dfb6341cd029498505066bdd30c1060cf69a7fb43ca"
  },
  "counts": {
    "answers": 7,
    "derived": 7,
    "ungraded": 7,
    "auto": 0,
    "figureEvidence": 0
  },
  "repair_budget": {
    "maximum": 1,
    "used": 0,
    "first_failure": null
  },
  "author_status": "frozen_pending_independent_answer_review",
  "candidate_status": "draft",
  "independent_approval": false,
  "existing_validate_lesson_calls": 1,
  "official_prepare_retain_finalize_calls": 0,
  "inflight_sessions": []
}
```
