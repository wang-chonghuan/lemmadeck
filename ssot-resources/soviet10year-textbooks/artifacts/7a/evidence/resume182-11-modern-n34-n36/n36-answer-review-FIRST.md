# STEMROBIN-182 n36 independent cap2 answer gate FIRST

## Verdict: revise

Reviewed only `alg7-c4-s2-n36`, exercises 761-776 and every subpart.
All supplied mathematical results are correct. Fifteen exercises pass; 768
needs a complete answer to its explicit square-representation request.
No blocker, no candidate edit, no finalization, no release authorization.

### [P2] 768 omits the requested radicand-as-square answers

Candidate `answer-keys.json:68`, exercise 768, `displayAnswer` gives the eight
correct values and the general instruction `偶次幂先写成平方`, but does not
actually give the eight requested square representations. Even h) supplies
only the post-root multiplication `100*(0.1)^5`, not the squared radicand.
The prompt asks for BOTH the representation and the value. This is an answer
completeness defect under Gate 2 items 4 and 6, not a numeric/sign error and
not a demand for graded parts.

Parent should add these representations alongside the unchanged values:

| Subpart | Original radicand as a square | Final value |
| --- | --- | --- |
| a | $2^4=(2^2)^2=4^2$ | $4$ |
| b | $3^6=(3^3)^2=27^2$ | $27$ |
| c | $(-5)^4=((-5)^2)^2=25^2$ | $25$ |
| d | $(-2)^8=((-2)^4)^2=16^2$ | $16$ |
| e | $(-2)^8=((-2)^4)^2=16^2$ | $48$ |
| f | $(-10)^4=((-10)^2)^2=100^2$ | $-200$ |
| g | $(-3)^8=((-3)^4)^2=81^2$ | $8.1$ |
| h | $(0.1)^{10}=((0.1)^5)^2=(0.00001)^2$ | $0.001$ |

Keep external coefficients outside the original radicand. Keep `ungraded`
and `parts=[]`. Parent integrates the defect; this reviewer has not fixed it.
Review the affected 768 answer after that change, retaining unchanged passes.

## Exact binding

All paths below are relative to the sole operation cwd:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

Modern lesson directory `M`:
`ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36`.
Evidence directory `B`:
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-11`.
Own receipts directory `R`: `B/n36-answer-review-FIRST-receipts`.

| Input | SHA-256 |
| --- | --- |
| M/answer-keys.json | `30b5d125ff674cfc4bb3246102b4da5b11311e3c3ffae1f6d9d6a6270d221372` |
| M/lesson.json | `9491dea5575ade5261d12d308bd3c1ce58908d35e769246761017bc5f9c92463` |
| M/exercises.json | `a2915f4c5936f022629e2c48dc3f09662b9408a33402166075c7b7673b0b1abb` |
| M/figures.json | `5cb365752bc66957456663151a6be872b1903bfb8b223e0d412ba51d6c1c8688` |
| B/answer-prepare/7a/modern-us-neutral/lessons/alg7-c4-s2-n36/answer-keys.template.json | `e6b65a05a555a54d415d49c3350e982e2b7bc8a73bc2482e9f4bf1db9f52f58d` |

This verdict applies only to those bytes. Per-exercise prompt, display-answer
and answer-object hashes are in `R/mechanical-contracts.json`; object hashes
use `JSON.stringify` of each parsed object, UTF-8, not original JSON slices.

## Independence and authorization

First read the answer skill, gate-2 guide and production-resume guide. Read the
current modern prose and every exercise; independently solved all 761-776.
Then wrote `R/independent-solutions.md` using apply_patch, hashed it, made it
0444, and wrote `R/independent-freeze.json` BEFORE first opening candidate
answer-keys.json or the named prepare template. Parent author math was never
opened, including after the freeze.

- Independent solution receipt SHA-256: `ed897c7a3b50481f4a6978586e39e76231190f7806d67f631d29b7a5e69024c7`.
- Freeze record at 2026-11-18T23:46:20Z SHA-256: `311a9eace168324f88d515f2a97654d2ec646fe90918c60c152dc3da375db22e`.
- Mechanical receipt at 2026-11-18T23:47:43.277Z SHA-256: `0f0c3528edb267854051960b3def0a0a5264075b00b1cd613351a45bd3398ddf`.

Only authored these review files and files in R. Ran offline Node built-ins for
structured input/hash checks. No images opened or generated, no .env, network,
DB, app, Git, publish, finalize or cap3. No other agent's files were changed.

## Per-exercise comparison

### 761: pass

a) `|x|=x` selects exactly `{3,0,10}` from the supplied list; b) `|a|=-a`
selects `{-6,-8}`. Candidate correctly states nonnegative versus nonpositive
conditions. Zero is included in a), but is absent from b)'s supplied list.

### 762: pass

All nine values in label order are `0.1,0.4,0.8,1.7,1.9,2.4,23,52,61`.
Independently took the absolute value of each base. No minus sign from a
negative base survives the principal root; no subpart is missing.

### 763: pass

All eight substitutions match: a) `22,35,5/3,0`; b) `14,24`; c) `1.5,3.7`.
The mixed number means `-(1+2/3)`, and candidate's `5/3` is correct. The
ordered-list wording maps each value to its ordered input without ambiguity.

### 764: pass

a-d are `|p|,|y|,3|b|,-0.2|x|` on all real inputs. Bars are retained because
the prompt has no sign assumptions. The negative external coefficient in d)
is retained, rather than made positive with the root.

### 765: pass

a-f are `c,a,-x,4a,-2b,1.5x` under the exact supplied conditions. In f),
`-1.5(-x)=1.5x`. Both modern and embedded source 765b say `a>0`, and candidate
explicitly preserves this strict condition; it does not replace it with `a>=0`.
Zero remains allowed only by the appropriate nonnegative assumptions a), d).

### 766: pass

a-d are `|a-1|,|c+2|,|x+1|,|2y-1|`. Independently factored c)'s radicand as
`(x+1)^2` and d)'s as `(2y-1)^2`. These squares are defined for all real
inputs, and bars handle both sides of their zeros correctly.

### 767: pass

a-f are `x-4,2-a,m-3,-7-y,10+c,-n-4`. Checked each whole inner expression's
sign. Included boundaries a) x=4, c) m=3, e) c=-10 give zero; b), d), f)
retain strict source exclusions. Candidate says to use the given signs and
does not falsely assert an unrestricted identity for one signed branch.

### 768: revise completeness; all values pass

Eight values match `4,27,25,16,48,-200,8.1,0.001`. In particular, f) is
negative because of its outside coefficient, and h) is `100*10^-5=10^-3`.
Each radicand-as-square is independently derived above and in the frozen
receipt. Candidate omits that separately requested output for all a-h.

### 769: pass

a-f are `y^3,m^2,-x^5,5a^4,c^6/3,-1.5z^9`. On negative x,z the inner
odd powers x^5,z^9 are negative, so c), f) reverse signs. Even inner powers
m^2,a^4,c^6 are nonnegative, including negative m or a. Applicable zero
endpoints are retained; no false sign reversal of an even power appears.

### 770: pass

a-d are `sqrt(2)-1,sqrt(3)-1,sqrt(11)-sqrt(10),sqrt(8)-sqrt(5)`.
Compared roots using `2>1`, `3>1`, `11>10`, `8>5`; the two originally
negative differences b), d) are reversed. All four principal roots are positive.

### 771: pass

a) `{-4,4}`; b) no real solution since `|x|+1>=1`; c) `{0,2}`;
d) `{-10,-4}`. Substituting both roots for each solvable subpart returns
4,1,3 respectively. Original radicands are squares, with real domain R.

### 772: pass

a-d are the closed intervals `[-2,6],[2.5,7.5],[-16,-14],[-13,-1]`.
Expanded each absolute-value inequality to a double bound; for b), multiplying
by -1 reverses both inequalities. At each pair of endpoints the root equals
the bound (4,2.5,1,6), hence all endpoints belong; outside points fail.

### 773: pass

Candidate gives the origin vertex, rays `y=-x` for x<=0 and `y=x` for x>=0,
and asks for the rays and axes to be constructed. This is a concrete graph
method, not a generic substitution tip. Including x=0 in both branch formulas
is consistent because both give zero. Largest increasing interval is
`[0,+infinity)`; candidate's `[0,+infinity[` is equivalent open-right notation,
not a numerical-domain defect. No image production is required by this gate.

### 774: pass

a) Candidate instructs drawing `y=sqrt(x)` and `y=6-x` on shared axes, reading
(4,2), hence x=4. Independent squaring gives 4 and 9, but x=9 is extraneous
because `sqrt(9)=3` whereas `6-9=-3`; original solutions require 0<=x<=6.

b) Candidate instructs drawing the square-root curve and `6/x` on their common
domain x>0, then reading the intersection. With t=sqrt(x)>0, t^3=6 gives
`x=cuberoot(36)=3.301927...` and `y=cuberoot(6)=1.817120...`.
The increasing root curve and decreasing positive hyperbola intersect once.
Candidate's `x approximately 3.30` is correctly approximate, and its exact
cube-root verification explicitly does not replace graph production. Both
method and values are present; denominator zero and negative x are excluded.

### 775: pass

a-f: `81,1/9,no real solution,0,14/3,-7/10`. Original domains are respectively
`x>=0,x>=0,x>=-1,x>=-1,x>=1/2,x>=-7/10`. Substitution returns 9,1/3,
no negative root,1,5,0. Squaring c) would propose x=3, but sqrt(4)=2, not -2.
The solution f) lies exactly on an included radicand-zero endpoint.

### 776: pass

`-1<=x/3-8<=1` gives `7<=x/3<=9`, hence `21<=x<=27`. Multiplication by
positive 3 does not reverse signs. Endpoints give y=-1 and y=1, both included;
the original linear function imposes no further domain restriction.

## Source and grading checks

Every candidate exercise maps once to the modern prompt and named template.
All 16 template entries are `derived` and have NO `bookRaw` field. Each
candidate likewise has `source=derived` and no `bookRaw`. Exact field presence
and, where present, value comparison passed. There is no existing bookRaw to
copy or correct in this template; this does not claim that unseen printed
answer pages were inspected or that the whole book contains no answer.

All 16 candidates have `grading=ungraded`, empty `parts`, and no executable
`judge` or `expected`. This is explicitly authorized, so Gate 2's usual
automatic-part requirement is not applied. Display subparts were still checked
individually. No false right/wrong judgments are produced by these answer keys.
Runtime MathLive and app behavior were not tested, and no such test is claimed.

Modern/source title `恒 等 式` and printed title `36. 恒 等 式` preserve their
spacing. All lesson, exercise and template figure lists are empty. Graph tasks
ask students to produce graphs; that does not imply existing figure assets.

## Handoff boundary

Parent may integrate only the reported 768 content defect, then request an
affected-only gate. No changed candidate is approved by this report. Unchanged
exercise passes remain bound to their prompt/display/object hashes in R.
If any other prompt or answer changes, include that affected exercise as well.
Draft status is expected at this pre-finalize gate, not a defect and not Ready.
