# Affected Pure-View Review: 8p n12

2026-11-23. SAME independent reviewer/solver. Only the repaired
`speed-and-direction` view is semantically re-reviewed; the six unchanged
PASS judgments are reused. All commands used
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## Result

**PASS. Complete affected true set: {A,B,C}; D is false.**
The repaired stem explicitly states fixed straight-line motion and takes that
line as the coordinate axis. It retains current-time `v,a` and `v!=0`.
The missing premise in initial finding `PV-n12-axis-condition-1` is resolved.
No further edit, REVISE or HOLD is required in the affected scope.

Exact repaired stem:

`物体沿一条固定直线运动，取这条直线为坐标轴。在某一时刻，$v$ 和 $a$ 分别是速度、加速度在该轴上的投影，且 $v\ne0$。以下哪些说法正确？`

Motion along the fixed axis gives speed `|v|`. At current `v!=0`,
`d|v|/dt=sign(v)*a=v*a/|v|`. This instantaneous relation does not require
constant acceleration or use initial velocity in place of current velocity.

| Option | Exact claim | Independent truth | Reason |
| --- | --- | --- | --- |
| A | `v>0,a>0`: speed increases | True | `v*a>0`; `d|v|/dt=a>0` |
| B | `v<0,a<0`: speed increases | True | `v*a>0`; `d|v|/dt=-a>0` |
| C | `v>0,a<0`: speed decreases | True | `v*a<0`; `d|v|/dt=a<0` |
| D | `v<0,a>0`: speed increases | False | `v*a<0`; `d|v|/dt=-a<0`, so speed decreases |

The complete set is now justified by the displayed stem itself, not by
borrowing an unstated source condition or reading an author key. It matches
the previously frozen independent source3 solution. The axis premise restores
source fidelity; no source unit, option wording or numeric task is changed.

## Reused Views And Relationships

Complete structured equality confirms that only
`questions[1].view.stem` changed. The six other complete views, all four
affected options, modes, IDs and empty figure arrays are unchanged.
The comparison uses the frozen initial option-check text/mode records and
previously observed empty figure arrays, not a reopened initial view or
internal draft. Per-view canonical hashes are retained in the affected JSON.

| View | Source questions | Current complete true set | Evidence |
| --- | --- | --- | --- |
| `acceleration-meaning` | 1+2 | {A} | Unchanged PASS reused |
| `speed-and-direction` | 3 | {A,B,C} | Affected PASS above |
| `uniform-acceleration` | 4 | {B} | Unchanged PASS reused |
| `trolley-time` | 5 | {C} | Unchanged PASS reused |
| `braking-acceleration` | 6 | {A} | Unchanged PASS reused |
| `truck-speed-change` | 7 | {D} | Unchanged PASS reused |
| `maximum-speed` | 8 | {B} | Unchanged PASS reused |

The added premise supplies a physical condition, not the sign criterion or
an answer. No affected cross-question leakage or redundancy is introduced.
The current-velocity sign test remains distinct from average-acceleration
meaning, constant-vector acceleration and the four numerical tasks.
Seven response units still merge only source1/2; source3-8 remain separate.
No new assertion that recognition proves written ability is made.
Question6's literal km/second unit and question8's stated stopping-interval
maximum remain under their unchanged approvals, without source replay.

## Exact Bindings

Repaired view:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/.tmp/180-7-n12/choice/view.json`,
bytes6215, SHA256
`a82390160d375531be753bfb17b6ce5bc1a66aff08d8c5e0078a17dd57a0aa48`.
Affected complete-question canonical SHA256:
`017861a691655e8dc82b5511298a2eaa979a532485f849efa6450954afc380e0`
(UTF-8 compact JSON, recursively sorted object keys, Unicode retained).

Initial option-check JSON SHA256, verified unchanged:
`0d3890898ef22f8748eeefb8a79127aaecd9474fe220f7d210beddc780d7d87c`.
Independent source-solutions SHA256, verified unchanged:
`13b6db34459cde21930af917cf430b3ea639170408c25f823a52417b45eff447`.
Initial blind-report identity is inherited without replay:
`f6fd2a983a379c68fb55100f514cb3ecd7e05835eec2b52a5aa307a170bef350`.
Its original REVISE, literal empty true set and counterexamples remain frozen;
this supplement does not overwrite or retroactively normalize them.
The initial view identity remains
`23eaa9ef0670387972b52c2043465fc0ba6f219e5e13841ac6909bce840e3d2b`.

[affected-option-checks.json](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s2-n12/choice-review/affected-option-checks.json)
retains exact affected stem/options, every truth judgment, complete set,
bindings, six reusable results and per-view canonical hashes.
This report and that JSON are frozen read-only evidence, not executable
production templates or answer-key artifacts.

## Scope And Order

Independent source freeze preceded initial pure-view review, which preceded
this affected review. Internal author drafts/solutions, answer keys/templates
and parent source solutions remain unopened. Only the authorized repaired
view, frozen option checks and own frozen source-solutions JSON were read;
the seed identity was inherited, not reopened this phase.

New images0; cumulative **11/24**; reopens0, returned payloads0.
Initial failures, the parent one-stem repair and known/unknown costs are
preserved, not reset. Unknown historical cost remains unknown; no paid request.
No source/view/template edit, source/review replay, production renderer/checker,
finalize/assembly/promotion, DB/deploy/Git write, install or
worker/chat/timer creation. Only this affected report and owned affected
option-check JSON were written.

**Current pure views PASS with six prior judgments reused. Wait for explicit
authorization of the later internal/key/answer comparison.**
