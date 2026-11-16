# n79 CHOICE: affected-only repaired Stage2 freeze

## Scope, independence, and bindings

STEMROBIN-184; Peirce remains the sole independent reviewer for this existing gate. This is the affected-only view stage of the one author repair, not a new complete source/view gate.

The only content read in this stage was:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-choice-views-repaired.json
```

Its actual raw SHA-256 matches the disclosed immutable hash:

```text
87628a48b699fd305bb7679e1671de3551dad5c738dd3eb37890787c094e9c4c
```

The full permitted view was read for the three changed assertions and their relationships with existing stems/candidate universes. The existing 42 option checks and all source/coverage conclusions are carried forward, not newly blind solved.

Previously frozen bindings, retained unchanged:

| Evidence | Raw SHA-256 |
| --- | --- |
| Original views | `6bae66d6b2b69d2368450a64571ed7a5216f05274012cce31d92681a355e4666` |
| Independent Stage1 source freeze | `8c2a1cffdc050d96af99da840734dfeacfdf75ca50a8e1f0c5e2e84859d71c14` |
| Original independent Stage2 freeze | `0785f48de52d4e4070d145a33fce662475f5075bf17e4a79da434f187316d017` |
| Initial rejected review JSON | `f964105fc77d9565eebdad9b5d9b89ac4aa0ff5d4d805a4f8ba8e9b83693d366` |

No repaired draft, rationales, author repair report, strict-diff report, or new internal key was read. No programmatic comparison with the undisclosed repaired internal draft was performed. Source/seed/modes/order and the other 42 options are reused under the explicitly authorized unchanged scope.

## Q2(e): endpoint speed

Changed visible assertion:

> 从区间内趋近任一端点时，函数变化速度的绝对值趋于 $1$。

### Independent local calculation

The stem still specifies `f(x)=sin x` on `(-pi/2,pi/2)`. Its change speed is the derivative, not the function value:

```latex
|f'(x)|=|\cos x|=\cos x
\quad\text{on }(-\pi/2,\pi/2).
```

Cosine is continuous at both limiting abscissae, so

```latex
\lim_{x\to-\pi/2+}|f'(x)|=0,\qquad
\lim_{x\to\pi/2-}|f'(x)|=0.
```

The claim of limit `1` is therefore **incorrect** at each endpoint. This does not assign a value to an excluded domain endpoint; it computes an interior one-sided limit.

A plausible independent error route is to replace absolute derivative by absolute function value. The endpoint limits of `|sin x|` are indeed `1`, whereas those of `|cos x|` are `0`. Thus the proposed value is meaningful rather than an arbitrary nearby number. This is my view-only explanation, not a claim about the unread repaired author rationale.

### Task role and affected relationships

The assertion still tests the original source46 speed/property discussion, with an additional meaningful open-endpoint distinction. It is not equivalent to another Q2 alternative: Q2(a) concerns function range, Q2(b) derivative trends, and Q2(d) local tangent behavior at zero, not endpoint speed limits.

The old Q4-to-Q2(e) leak is removed. Every Q4 first tangent candidate has absolute slope `1`, but those candidates concern **zero**, not `+-pi/2`. Knowing any candidate slope at zero cannot establish the limit of a derivative at either different endpoint. Transferring that value would itself be a mathematical error, not an answer given by the other question.

Neither the Q4/Q5 stems nor their candidate universes supply the endpoint derivative limit. The range assertions elsewhere supply function values, not speeds. Recognizing the distinction between them is substantive reasoning. Combining other unselected property options to check consistency is normal mathematical elimination, not literal given-to-answer leakage.

Repaired complete Q2 true set: **`{a,b,d}`**, with unchanged a-d checks carried forward and new e independently false.

## Q3(d): boundedness of the tangent derivative

Changed visible assertion:

> 函数的一阶导函数在整个 $]-\frac{\pi}{2},\frac{\pi}{2}[$ 上有界。

### Independent local calculation

The derivative remains

```latex
g'(x)=\frac{1}{\cos^2x}>0.
```

Writing `x=pi/2-t` with `t>0` gives

```latex
g'(\pi/2-t)=\frac{1}{\sin^2t}\longrightarrow+\infty
\quad(t\to0+).
```

Similarly the derivative tends to positive infinity near the left endpoint. It is consequently **unbounded**, although it exists and is finite at every individual interior point.

An explicit interior sequence gives the same conclusion: for integers `n>=1`, let `x_n=pi/2-1/n`. Then `x_n` belongs to the stated interval and

```latex
g'(x_n)=\frac{1}{\sin^2(1/n)}\ge n^2,
```

using `0<sin t<=t` for these positive `t`. No finite bound can contain all derivative values.

A plausible independent error route is to apply a closed-interval boundedness theorem to a derivative that is continuous only on a bounded **open** interval, or to confuse each value being finite with a uniform bound. This is relevant to the original whole-interval discussion. It is not an arbitrary unrelated property.

### Task role and affected relationships

This differs from Q3(a)/(b)'s local slope trends and Q3(f)'s function range. Positive derivative is not equivalent to bounded derivative, and a finite interval length is not a bound on its values.

The old Q6/Q7-stem-to-Q3(d) leak is removed. The existence of tangent graph points at zero and `-pi` establishes neither boundedness nor unboundedness over the entire principal branch. The Q6 candidate slopes at these two centers are only local data.

Q7(a) is an **unselected candidate** about function asymptotes, not an unconditional giver stem or disclosed answer. Inferring unbounded derivative from finite-distance function blow-up would require mathematical reasoning, such as the mean value theorem: a uniform derivative bound would bound `|g(x)-g(0)|` by that bound times `|x|`. It is not a raw text negation like the former zero-domain claim. Q3(f)'s range assertion likewise concerns the function rather than the derivative and is not a supplied key.

No new immediate stem/candidate-universe cue is found for this changed boundedness assertion.

Repaired complete Q3 true set: **`{a,b,e,f}`**, with the other five checks carried forward and new d independently false.

## Q7(e): reflection about the center tangent

Changed visible assertion:

> 两个分支分别以各自中心点处的切线为对称轴，关于该切线反射后各自保持不变。

### Independent local calculation

Use the already-frozen center tangents: `y=x` for center `(0,0)`, and `y=x+pi` for center `(-pi,0)`. For either center abscissa `a=0` or `a=-pi`, introduce `u=x-a`, `v=y`. The tangent is `v=u`, and the branch equation is `v=tan u`.

Reflection about `v=u` sends `(u,v)` to `(v,u)`. The original branch contains the exact point

```latex
(u,v)=(\pi/4,1).
```

Its reflected point is `(1,pi/4)`. That point is not on `v=tan u`, because

```latex
\tan1>\tan(\pi/4)=1>\pi/4.
```

Here `pi/4<1<pi/2`, and strict increase of tangent on the principal branch justifies the first inequality. The reflected point's abscissa is still inside the same branch, so this is not merely a reflection outside a chosen display window.

In the original coordinates the two counterexamples are:

| Center | Original point on its branch | Reflected point not on its branch |
| --- | --- | --- |
| `a=0` | `(pi/4,1)` | `(1,pi/4)` |
| `a=-pi` | `(-3pi/4,1)` | `(-pi+1,pi/4)` |

The changed assertion is therefore **incorrect for both branches**.

Actual central symmetry is a different relationship. Since tangent is odd in `u`, `(u,tan u)` maps to `(-u,-tan u)` under a half-turn about the center, remaining on the branch. Confusing that center symmetry with axial reflection about the tangent is a plausible independent drawing misconception. The axial transformation exchanges local coordinates, not their simultaneous signs.

These are calculations, not a new choice figure or a rendered graph. No source image or diagram was fabricated.

### Task role and affected relationships

The assertion tests a geometric relationship relevant to source49's graph task. It remains a text-based relationship-recognition task, not actual graph production. Existing source49 production/visual-reading losses remain carried forward and are not waived.

It is not a duplicate of Q7(b)'s above/below-tangent relationship or Q7(c)'s second-derivative sign changes. Crossing a tangent does not establish reflection symmetry about it; center symmetry and line symmetry differ.

The old Q6-candidate-universe-to-Q7(e) leak is removed. All Q6 candidates have slopes `+-1`, but a nonzero tangent slope alone does not settle whether a graph has that line as an axis of symmetry. In particular it does not mechanically negate the new assertion, as it negated the old zero-slope conjunction. The reflection calculation or equivalent substantive geometry is needed.

Q3's unselected local convexity/tangent alternatives and Q7's unselected asymptote alternative may support mathematical reasoning after their truth is established; they do not disclose a center-tangent symmetry key. No existing stem states that these branches are or are not symmetric about their tangents. No new immediate package leakage is identified for this changed assertion.

Repaired complete Q7 true set: **`{a,b,c}`**, with a-d carried forward and new e independently false.

## Affected package disposition

| Changed assertion | Truth | Task role | Old leak removed | New essential defect found |
| --- | --- | --- | --- | --- |
| Q2(e) | Incorrect | Function value versus derivative endpoint limits | Yes: zero-point candidate slopes no longer negate it | No |
| Q3(d) | Incorrect | Whole-open-interval derivative boundedness | Yes: existence at zero no longer negates it | No |
| Q7(e) | Incorrect | Center symmetry versus tangent-axis reflection | Yes: nonzero candidate slopes no longer negate it | No |

All three remain plausible, mathematically false distractors under the unchanged stems. No arbitrary nearby value, unresolved convention, or lost original subtask has been introduced by these local changes. The unchanged 42-option mathematical evidence and all six source/coverage conclusions are reused, not repeated.

Complete package true sets for binding convenience:

```text
q1  {a}        q2  {a,b,d}    q3  {a,b,e,f}
q4  {a}        q5  {a,b,e}    q6  {a}
q7  {a,b,c}    q8  {a}        q9  {a}
q10 {a}
```

Only the three falsehood checks above are newly independent. Every other entry is explicitly carried forward from the prior frozen evidence.

The earlier partial zero-point overlaps, common Q1 range, autonomous drawing/proof-production losses, and fixed first-option answer pattern remain as previously assessed. They are not reclassified into new essential rejection grounds after the one repair. The initial review did not impose a letter-distribution quota, and this affected check does not silently add one.

**Affected-only Stage2 view disposition: PASS for the three repaired assertions and their affected package relationships.** This is not repaired-draft approval: new internal rationale/misconception consistency, exact snapshot changes, binding and final contract review are still undisclosed and unexamined. Any essential defect in that authorized later comparison must remain blocked after the exhausted repair; this view report does not preapprove it.

Only this report was written. No author file, previous reviewer freeze, seed, source, or option string was edited. No browser, renderer, full test, validator, Git, DB, service, or other-chat operation was performed.

Freeze and stop after report hashing. Await separate affected-only internal comparison authorization.
