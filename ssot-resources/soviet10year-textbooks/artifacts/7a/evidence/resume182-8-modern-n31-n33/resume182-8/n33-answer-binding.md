# STEMROBIN-182 / n33 Answer-Output Binding

**裁决：PASS / CURRENT_745_ANSWER_BINDING_ONLY。** 唯一 W=`/Users/yong/.codex/worktrees/d9b1/lemmadeck`；所有 exec 显式 workdir=W。只读取当前 n33 answer-keys.json、answer-keys.audit.json、exercises.json 和指定既有独立数学报告。零图、零新求解、零 pipeline 重跑；未读其他旧答案键，未改源/键/audit/原审查报告。仅新增本文。

## Current Input Hashes

L=`W/ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n33`。以下为本次实际读取字节的 SHA-256：

| Input | SHA-256 |
| --- | --- |
| `L/answer-keys.json` | `068f154f95cee6f8982958e8ebc3fb8341953e0f180c993b518b43e1294f5b29` |
| `L/answer-keys.audit.json` | `cf57a94e93eb6750cf43576403c15bb4c06a2be8da77ec1f3f0b054b20d00c07` |
| `L/exercises.json` | `bb1d8e36603e1a5b5f3ddc76d37a680aeb04e9a87ce74b754f800e3601e9707a` |
| `W/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n33-math-review.md` | `44345ee9d4b22fae57df68d7078c0c928a0745319aa81afec747380bec36bb3e` |

## Concrete Comparison

当前题文唯一题745，a/b/c/d依次为 `sqrt(20), sqrt(36.5), sqrt(525), sqrt(95.28)`，来源 `p0214#6`。key与题文的 lesson/edition、题号和count=1吻合。四个有序parts均为 `judge:numeric`，各仅一个expected，依次 `4.472 / 6.042 / 22.913 / 9.761`，与本人既有独立舍入结果全部一致，无错序、漏项或误绑。

displayAnswer 采用初值 `4,6,22,9`、递推 `y_(n+1)=(y_n+x/y_n)/2`。其“前三次更新”对应既有独立解的 y2/y3/y4，而非把初值算作一次更新；全部十二个显示数逐项吻合既有值的十位小数展示：

| Part / Radicand | Displayed First Three Updates | Final Numeric Key |
| --- | --- | --- |
| a / 20 | `4.5, 4.4722222222, 4.4721359558` | `4.472` |
| b / 36.5 | `6.0416666667, 6.0415229885, 6.0415229868` | `6.042` |
| c / 525 | `22.9318181818, 22.9128862961, 22.9128784748` | `22.913` |
| d / 95.28 | `9.7933333333, 9.7612003631, 9.7611474737` | `9.761` |

displayAnswer 明说“最后四舍五入保留三位小数”，最后四项与numeric键完全一致。既有独立报告已认证四个半千分位中点平方夹界、无tie，四个绝对误差分别严格小于 `0.000135956, 0.000477014, 0.000121526, 0.000147474`，均小于0.0005，更满足原题0.001。本次只比对已建立结果，未再次开方、重算递推或重复科学复核。

audit为本课本edition的 `status:pass, answerCount:1, auto:1, ungraded:0`，与key的一条 `grading:auto, source:derived` 记录一致。audit自身未携带键输入哈希，不能把status当数学证明；本文用上表绑定当前文件并提供具体独立比对。

范围限制：原题文仍只要求“准确到0.001”；display及notes公开给出四舍五入标准值。这是有效标准答案，不声称原绝对误差条件只允许这一组数，也不批准未来自动判分拒绝其他满足源题误差要求的表示。notes的离线只读、不能证明学生实际使用递推之限制保留。本文不认证答案输入交互、整课科学、n31、batch commit或发布；没有 pipeline 新退出码可报告。
