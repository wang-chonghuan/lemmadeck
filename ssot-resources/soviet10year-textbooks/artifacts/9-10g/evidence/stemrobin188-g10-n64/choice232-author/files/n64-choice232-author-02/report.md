# N64 / 232(1) conditional native-choice author handoff

STEMROBIN-188 / SAME188-6。仅作者，不是独审。
新唯一写入 root：
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/`

## 候选与真实状态

原五题及 20 个选项全量保留，新增 1 道 native single、4 个选项，完整候选为 6 题、24 个选项。
新题明确比较球心在所选角域和邻补角域的两种条件；有完整半角推导及区域未定时的结论。
作者新任务改编次数 1，内容修复 0，新图 0。
新完整候选唯一结构校验 exit 0。语义仍 pending，没有 review、没有语义 PASS。

原 232(1) 的一般单一距离任务仍因源区域约定缺失而 BLOCKED。
新增明确条件使改编任务可判定，不使冻结源原任务获得唯一解。
实际 seed、源课、现代 exercise、答案及原五题 views/keys/intents 都没有改写。

## 快照及顺序

- seed 精确复制，4420 bytes，0644；raw SHA-256 `e9d4003196accc240f86973b87b04cf93c8820057b4aa9b9948dd298eaff1dbb`；canonical SHA-256 `d4e6f9112c995fd2d07cdc7508f537bf8383a49139bb7968e089f6744fa86f6d`。
- 先复用作者独立源解，手写完整条件化推导，再实际将 source-first solution chmod/stat/hash 为 0444，之后才写新选项。
- source-first solution：6537 bytes，0444；SHA-256 `379d2a0b763b58ea39e72e0f9a6f70ab80b6bf8a5e71d23379bb70f7c4aee9e4`。
- 新 FIRST：37858 bytes，0444；工作稿同字节，37858 bytes，0644；实际 cmp exit 0。
- 新候选 raw SHA-256 `6f5c0b2b51c1cd133dcf6639cfe740b8b79d8bc25f813115c43ce4867a800da4`。
- 新候选 canonical SHA-256 `796f1507a7ee35afa5afd5bf93af1ad1b389093096b41346fbac9c1eb8b53dda`。
- 所有手工数学内容用 apply_patch 写，不由脚本生成选项或假审查。

## 原五题及旧目录不变

机械比较确认五个旧对象各自的原始 JSON 字节和逻辑对象均完全相同，包含 views、keys、intents 和逐选项 rationales。
229/230/231/233/234/235 的六个既有 coverage 对象也逐字节相同。
仅 source 232 coverage 更新为原坐标球题加新增条件区域题，公开任务改编及原源 blocker。
旧目录所有十个文件（含 FIRST、工作稿和 index）的字节/hash/mode 与进入本次续作时基线一致。
实际对象 hash 与旧目录基线记录在 preservation 证据中，而不把旧文件列为新 outputs。
本次对旧目录写入次数 0，没有回退任何其他工作者的字节。

## 可见任务变化

源题没有指定哪种二面角区域含球心。新 native 题由作者明确给定：

- 两不同平面相交于棱 l，球半径 R>0。
- 过球心且垂直棱的截面中，选定张角 φ 的角域 D，0<φ<π。
- D' 与 D 共一边且为张角 π-φ 的邻补角域。
- 条件Ⅰ：球心在 D 内部；条件Ⅱ：球心在 D' 内部。
- 对整个参数区间判断完整推导及未指定区域时的确定性，不只判断一个特殊角度。

这些可见条件仅属于改编任务，并非父提供的新源条件，也不是作者推断的源约定。
从原本未定的单值求解改成完整条件比较，是公开的 native-choice 任务变化。
边界 0、π 被明确排除，不伪造退化相交棱或球。

## 独立推导与新选项

球心到两切面迹线的垂距都为 R。位于角域内部时，其所在角域的内部平分线上有球心。
设该所在角域张角 θ，垂足直角三角形给 R=d sin(θ/2)。
Ⅰ令 θ=φ，得 dⅠ=R/sin(φ/2)；Ⅱ令 θ=π-φ，得 dⅡ=R/cos(φ/2)。
两距离仅在 φ=π/2 相等，此时为 √2R；其他 φ 的两种区域都存在合法相切球。

- A 的错误程序将半角三角形的对边 R 当邻边，统一用余弦，实际产生两距离对应交换；φ=π/3 时交换实际 2R 和 2R/√3，故完整条件结论错误。
- B 的完整关系、区域对应、解出的距离及仅直角时唯一的结论均由作者独立推导。
- C 的错误程序遗漏半角，直接用整角；由 sinφ=sin(π-φ) 错称两条件恒同。φ=π/2 时其 R 值与实际 √2R 不同。
- D 的错误程序在第二条件仍用第一角域 φ，忽略球心位置切换；φ=π/3 时把第二条件真实 2R/√3 错写成 2R。

作者完整 true set 是 B；每个错误选项均来自声明的可重现程序且有实际反例。
个别角度上的公式相等不构成全域等价。此处是作者推导记录，不是语义审核 verdict。
旧题可见部分没有打印新半角距离对，新题也不打印旧题的具体结果或键；共享切面基础概念仍需真正独审判断跨题辅助是否可接受。

## 原源歧义及容量损失

源歧义见证继续成立：φ=π/3，平面 y=0、y=√3x，棱为 z 轴。
球心 (√3R,R,0) 与 (-R/√3,R,0) 都距两切面 R，但距棱分别 2R 与 2R/√3。
source 未指定哪种球心区域，不能从新题条件倒推源已选定它。
仅额外给直角时两值一致，不解决一般源约定。

认出完整条件比较不能证明独立作垂直截面、证明角平分、推导距离及写出原解答。
原五题的容量损失不变，尤其 235 的独立证明设计和书写仍未被测得。
原 233 的可见参数/退化边界完成保持原样，本次不把它改称源原条件。
原 12 个在五题中表示的任务加一个改编比较题，不能包装成所有 13 个原书写任务已经唯一解答。

## 一次实际结构校验

```text
python3 /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.agents/skills/ld-s10y-choice/scripts/validate.py --repo /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck --seed /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/seed.json --draft /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/draft.json
```

新调用 1 次，exit 0，stdout 原文 `mechanical checks passed; semantic review still required` 加换行，stderr 空，未提供 review。
完整 command/argv/cwd/timestamps/exit/stdout/stderr 保存在 validation 回执。
使用 PYTHONDONTWRITEBYTECODE=1，避免导入在允许 root 外写缓存。
旧调用保留 1 次，本次没有重跑旧候选校验或 prepare/inspect；累计两个不同候选各有一次结构校验。
真实新执行失败 0，新内容审查失败 0，语义审查次数 0；没有伪造审查或抹去 FIRST。

## Outputs

以下与 report.json 使用同一 outputs 字段、同一已完成种子与证据列表。
最终 index 追加两个报告文件的实际 hash/bytes/mode，不列 index 自己；报告不循环自列自身 hash。
所有 outputs 都在新 root，actual absolute path，mode 四位。

```json
{
  "outputs": [
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/seed.json",
      "sha256": "e9d4003196accc240f86973b87b04cf93c8820057b4aa9b9948dd298eaff1dbb",
      "bytes": 4420,
      "mode": "0644"
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/independent-solutions.FIRST.md",
      "sha256": "379d2a0b763b58ea39e72e0f9a6f70ab80b6bf8a5e71d23379bb70f7c4aee9e4",
      "bytes": 6537,
      "mode": "0444"
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/draft.FIRST.json",
      "sha256": "6f5c0b2b51c1cd133dcf6639cfe740b8b79d8bc25f813115c43ce4867a800da4",
      "bytes": 37858,
      "mode": "0444"
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/draft.json",
      "sha256": "6f5c0b2b51c1cd133dcf6639cfe740b8b79d8bc25f813115c43ce4867a800da4",
      "bytes": 37858,
      "mode": "0644"
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/author-notes.md",
      "sha256": "288ff3b6863cfe2de21a2044f5e4b357015381504d47d15da477ba94e9d6c6aa",
      "bytes": 7723,
      "mode": "0644"
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/validation.json",
      "sha256": "841e730a0a23bc4b04f7e11e5f469ed4b04190b9a8e47af2d2cb1a294a6d9d20",
      "bytes": 1410,
      "mode": "0644"
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/preservation.json",
      "sha256": "cde3e6234e5c13cabe0143f5abb0a5acea71f522bc73e308efa97d00f91f619d",
      "bytes": 5166,
      "mode": "0644"
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-choice232-author-02/freeze-evidence.json",
      "sha256": "9a4e83c48221debea5f0d1f53c2252673ef3f5ef3dc4a3a872cf3d1d0f6adcb3",
      "bytes": 6664,
      "mode": "0644"
    }
  ]
}
```

没有 .env/DB/install/paidmodel/publisher/application/Git/otherchat/agent 动作。
没有启动、联系或代行任何 reviewer。父另独审 pending；原源一般单值歧义保留。
