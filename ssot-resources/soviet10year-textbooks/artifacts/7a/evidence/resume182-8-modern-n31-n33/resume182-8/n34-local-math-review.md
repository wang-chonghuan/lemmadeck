# n34 FIRST local mathematical adjudication

Date: 2026-11-18.
Sole workspace: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Checkout identity supplied by the requester: `codex/STEMROBIN-182-textbooks`; not independently checked with Git.
Report role: parallel sidecar, mathematical adjudication of existing source ambiguities only.

## Boundary and evidence

- Mathematical evidence is the current `7a` source page JSON/MD for physical pages 214, 215, 216 and 219, and the definitions within those pages. Block references use the one-based index in each JSON `blocks` array, including figure/caption blocks.
- The requester supplies the already-confirmed printed facts: `p0215#5` prints rising `]0,16[`, not `]6,16[`, alongside decreasing `[0,6[`, decreasing `]16,24]` and turning points 6/16; exercise 751 prints left-hand `x`, not `y`. These facts are reused, not retranscribed or recertified here. Stale uncertainty in the current source metadata does not override these supplied facts.
- Zero images opened, rendered or examined. No actual graph was inspected; no visual/source-faithfulness certification is made.
- No previous mathematical review, answer or choice artifact was consulted. No app, database, Git, network or paid/model/image-generation operation was performed. No assembly, content edit, registration, promotion or publishing operation was performed.
- The only write is this new report. The numerical square-root material before the n34 heading on p0214 is outside this adjudication; its existing errata are neither re-adjudicated nor changed.
- `CONFIRMED_LOCAL_ERRATUM_CANDIDATE` below means a text-supported mathematical correction proposal, not registration or permission to rewrite modern output. Only the parent's subsequently registered confirmed errata may affect modern output. No whole-page or whole-lesson approval is issued.

## 1. Temperature as a function: implicit domain, not a false claim

Stable references: `p0214#8` continued by `p0215#1`.

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0214/page.json`
SHA-256: `b8abfd2a20674e6f78b3afecbf6e8482759ef0f6221cc84a8ccfe61ca4eceeb6`

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0214/page.md`
SHA-256: `6585d439d65c04dec0b64f6d28c3b3d69dc0c9a5a16abd8ea991cad9196c99ee`

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0215/page.json`
SHA-256: `de5077bed7e8a5a717363665b9b17b96b7f6bca0c7d201f597f65ee7f76e778d`

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0215/page.md`
SHA-256: `87c366792afd1d584ded2ca89078e2033996433799538f03ad856b231f0af4b1`

Original whole mathematical sentence, joining only the printed continuation:

> 在图46里画出的是气温的曲线图. $x$ 轴上表示时间，$y$ 轴上表示的是相应的温度值. 这个曲线图就是一个函数的图象：对于每一时刻（$x\in[0,24]$），都有唯一的气温的数值.

Verdict: `NO_ERRATUM`; retain the whole sentence and its whole formula `$x\in[0,24]$` unchanged.

Proof/scope: assigning exactly one temperature to every time in `[0,24]` is precisely a real-valued function on that domain. Monotonicity is not required for being a function. The sentence supplies a model/premise, not proof that the unseen graph satisfies it. Nothing here licenses extending the domain beyond this particular day's `[0,24]`.

## 2. Temperature intervals: confirmed contradiction and exact local repair

Stable reference: `p0215#5`.

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0215/page.json`
SHA-256: `de5077bed7e8a5a717363665b9b17b96b7f6bca0c7d201f597f65ee7f76e778d`

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0215/page.md`
SHA-256: `87c366792afd1d584ded2ca89078e2033996433799538f03ad856b231f0af4b1`

Original whole statement:

> 我们看到，在 $[0,6[$ 区间里，气温下降：曲线上横坐标较大的点，纵坐标反而较小（曲线向下降）. 在 $]0,16[$ 区间里，气温上升：曲线上横坐标较大的点，纵坐标也较大（曲线向上升）. 在 $]16,24]$ 区间里，温度重新下降. 当 $x$ 的值等于 $6$ 时，气温由下降变为上升. 当 $x$ 的值等于 $16$ 时，气温由上升变为下降. 因此，在 $6$ 点和 $16$ 点时，函数变化的性质发生了改变.

Verdict: `CONFIRMED_LOCAL_ERRATUM_CANDIDATE`.

Proposed corrected whole statement, changing only the rising interval's lower numeric endpoint:

> 我们看到，在 $[0,6[$ 区间里，气温下降：曲线上横坐标较大的点，纵坐标反而较小（曲线向下降）. 在 $]6,16[$ 区间里，气温上升：曲线上横坐标较大的点，纵坐标也较大（曲线向上升）. 在 $]16,24]$ 区间里，温度重新下降. 当 $x$ 的值等于 $6$ 时，气温由下降变为上升. 当 $x$ 的值等于 $16$ 时，气温由上升变为下降. 因此，在 $6$ 点和 $16$ 点时，函数变化的性质发生了改变.

Whole formula replacement: `$]0,16[$` -> `$]6,16[$`.

Concrete contradiction: choose times `x_1=1`, `x_2=2`. Both lie in `[0,6[` and `]0,16[`. The decreasing claim gives `T(2)<T(1)`; the increasing claim gives `T(2)>T(1)`. Both cannot hold for the same real-valued function. This uses the strict comparisons printed in this block and formalized on p0216, not a graph estimate.

Why this repair is justified: retaining the stated decrease up to 6 and the explicitly stated change from decreasing to increasing at 6 fixes the start of the described intervening rising segment at 6; the explicitly stated reversal at 16 fixes its end at 16. Merely deleting an assertion would avoid the contradiction without recovering that segment. Choosing 7 or another later lower bound would describe only a subinterval and would not reproduce the segment between the named turning points. Changing the first interval to increasing would contradict the stated reversal at 6.

Scope: uniqueness is for this minimal, context-preserving repair of the described segment, keeping the other statements and original bracket convention. It is not a claim that logical inconsistency alone determines an arbitrary corrupted author's text. Whether a turning-point endpoint can also be included requires additional function values; no open/closed bracket is changed. The actual graph and its detailed shape remain unverified.

## 3. Strict monotonicity: valid set definition, implicit domain, stricter interval premise

Stable references: `p0216#1`, `p0216#2`, `p0216#3`, `p0216#4`, `p0216#5`; the first continues `p0215#12`.

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0216/page.json`
SHA-256: `0164f521089ef866fbb5b1bc779fe675272b5ccbee5a2f028c8e521ad36a8b2c`

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0216/page.md`
SHA-256: `24f4ae157874c7073f7f11b83f7a9f6e9ada462e5df8502929296afd0bbdb002`

Continuation source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0215/page.json`
SHA-256: `de5077bed7e8a5a717363665b9b17b96b7f6bca0c7d201f597f65ee7f76e778d`

Continuation source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0215/page.md`
SHA-256: `87c366792afd1d584ded2ca89078e2033996433799538f03ad856b231f0af4b1`

Original complete comparison statements/formulas:

> 从区间 $[-3,2[$ 里取出任意两个值 $x_1$ 和 $x_2$，如果 $x_2>x_1$，那么就有 $f(x_2)>f(x_1)$. 我们说，函数 $f$ 在区间 $[-3,2[$ 内增大.

> 一般地，如果函数 $f$ 的自变量在集合 $M$ 上取较大的值时，对应的函数值也较大，就说函数 $f$ 在集合 $M$ 上是增函数.

> 从区间 $]2,7]$ 里取出任意两个值 $x_1$ 和 $x_2$，如果 $x_2>↵x_1$，那么就有 $f(x_2)<f(x_1)$. 我们说，函数 $f$ 在区间 $]2,7]$ 内减小.

> 一般地，如果函数 $f$ 的自变量在集合 $M$ 上取较大的值时，对应的函数值反而较小，就说函数 $f$ 在集合 $M$ 上是减函数.

> 如果在整个定义域上函数 $f$ 总是增大（或者减小），那么就说，$f$ 是增函数（或者减函数）.

Verdict: `NO_ERRATUM`; retain these whole statements/formulas unchanged. The printed `↵` is a line break, not a mathematical operator.

Proof: the general definition means, for every `x_1,x_2 in M`, `x_1<x_2` implies respectively `f(x_1)<f(x_2)` or `f(x_1)>f(x_2)`, with implicit `M subseteq D_f`. It is meaningful on an arbitrary ordered subset of the real domain; `M` need not be an interval. Restricting the premise to intervals would produce a true special case by strengthening the premise, not expose a false original definition.

Concrete example of a noninterval domain: on `M={-2,2}`, `f(x)=x` is strictly increasing by the definition, since the only ordered distinct pair has `-2<2` and `f(-2)<f(2)`. Undefined values outside `D_f` are not counterexamples because those arguments violate the implicit domain premise.

Scope: the interval statements do not assert maximal intervals and do not assert that `f(2)` must be excluded from every monotonic interval. A function can increase on `[-3,2]` and also on its subset `[-3,2[`. Thus a possibly stricter true endpoint restriction is not by itself an erratum. The specific graph-based assertions about figure 47 cannot be confirmed or refuted from its unexamined image. These definitions do not assert that every function must be globally increasing or decreasing.

## 4. Constant function: contextual counterexample, not a false printed assertion

Stable reference: `p0219#8` (exercise 749), used only to interpret the definition/task language.

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0219/page.json`
SHA-256: `ead546937f0e87fc5a3bb2cd478245dde06df2ea09fef7a82c253b59174dc523`

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0219/page.md`
SHA-256: `beb49b0000ce00763e22efe4e3e01f7120f9f1de1e56d5864047519d5165a7ee`

Original whole formula at issue: `$y=0x+5$`.
Original question premise: `749. 下列函数哪些是增函数，哪些是减函数？`

Verdict: `NO_ERRATUM`; proposed whole formula remains `$y=0x+5$`.

Concrete counterexample to an overreading: on the natural real domain, take `x_1=0`, `x_2=1`. The values are both 5, so neither required strict inequality holds. This refutes the extra claim "every listed function must fall into one of the two strict classes", but the printed "哪些" question never makes that claim. A constant function's presence does not warrant changing the definitions to nonstrict comparisons or changing its zero coefficient.

Scope: this is a contextual counterexample only, not an answer pack, exercise rewrite or all-items classification.

## 5. Exercise 751: empty literal real relation; uniquely supported local function repair

Stable reference: `p0219#10` (exercise 751).
Same-page task context: `p0219#7` (748) and `p0219#9` (750) use the same function-graph instruction with explicit `y=...` formulas.

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0219/page.json`
SHA-256: `ead546937f0e87fc5a3bb2cd478245dde06df2ea09fef7a82c253b59174dc523`

Source file: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0219/page.md`
SHA-256: `beb49b0000ce00763e22efe4e3e01f7120f9f1de1e56d5864047519d5165a7ee`

Original whole task/formulas:

> 751. 用作图的方法表示下列函数图象的位置：
> а) $x=-\frac{6}{x}$；б) $y=\frac{4}{x}$.
> 分别指出函数增大和减小的区间.

Verdict: `CONFIRMED_LOCAL_ERRATUM_CANDIDATE`, not `LOCAL_HOLD` under the context-preserving repair scope below.

Proposed corrected whole task/formulas, changing only the first formula's left-hand variable:

> 751. 用作图的方法表示下列函数图象的位置：
> а) $y=-\frac{6}{x}$；б) $y=\frac{4}{x}$.
> 分别指出函数增大和减小的区间.

Whole formula replacement: `$x=-\frac{6}{x}$` -> `$y=-\frac{6}{x}$`; companion whole formula `$y=\frac{4}{x}$` unchanged.

Literal proof: the denominator imposes `x != 0`. Multiplication by that nonzero `x` gives `x^2=-6`, impossible for real `x`, since `x^2>=0`. At `x=0` the original expression is undefined, not a missed solution. Hence there is no real solution, and no real `(x,y)` pair satisfying this relation for any `y`. Complex roots `x=+/-i sqrt(6)` do not provide a graph in the real-coordinate task.

Classification: an equation with no real solutions is not intrinsically an invalid equation. The defect is presenting this empty real relation as one of the nonempty functions to graph and compare in this school exercise. An empty-domain function can formally be both strictly increasing and decreasing vacuously; that does not supply the intended plotted function or nonempty intervals and does not make the exercise's functional premise appropriate.

Why replacing the left-hand `x` with `y` is warranted: the task explicitly asks for function graphs and their monotonic intervals; its second item and the same-page parallel tasks use `x` as argument and `y` as output. Holding the printed right-hand expression `-6/x`, its coefficient, sign and argument fixed, the corresponding function graph must be `y=-6/x`. This is the single-variable correction that restores the displayed input/output pattern without changing the function expression. A competing one-letter repair `x=-6/y` gives `xy=-6` and, over the same nonzero real coordinates, the identical graph `y=-6/x`; it is not a different substantive mathematical intent. A sign-only repair would instead give `x^2=6`, still not the displayed real function graph `y=f(x)`.

Concrete consistency proof, not a produced answer artifact: the repaired expression assigns exactly one real `y` for every `x != 0`. For `a<b` in the same component of its domain,

`(-6/b)-(-6/a) = 6(b-a)/(ab) > 0`.

For the companion formula on the same type of component,

`(4/b)-(4/a) = -4(b-a)/(ab) < 0`.

Both consequently have well-defined strict comparisons on the two real intervals separated by zero. Branchwise behavior must not be silently promoted to global monotonicity: for the repaired first formula, `a=-1<b=1` gives values `6>-6`, a counterexample to global increase; for the companion, those arguments give `-4<4`, a counterexample to global decrease.

Scope: the correction is uniquely supported as the minimal semantic repair preserving the printed right-hand expression and the explicit real function-graph task, not as a theorem recovering authorial intent under unlimited changes to numerals, variables or task wording. No equally supported nonequivalent local correction is identified in this supplied context, so no source-intent hold is needed for this candidate. The original source must still retain printed `x` unless a separate authorized erratum process applies. No graph drawing, graph inspection, source-fidelity certification, exercise answer production or output modification occurred.

## Outcome

Two confirmed local mathematical erratum candidates:

1. `p0215#5`: `$]0,16[$` -> `$]6,16[$`, retaining all other text and brackets.
2. `p0219#10 / 751 а)`: `$x=-\frac{6}{x}$` -> `$y=-\frac{6}{x}$`, retaining the right-hand expression and companion formula.

No candidate is registered or applied by this report. Other entries distinguish true definitions/premises, implicit domains and contextual counterexamples from false claims; they carry no mathematical rewrite. All graph-dependent observations remain outside verification. Images examined: **0**.
