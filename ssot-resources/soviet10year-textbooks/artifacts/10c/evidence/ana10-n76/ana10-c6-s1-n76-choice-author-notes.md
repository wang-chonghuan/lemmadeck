# n76 Choice Author Notes

Role: author only; no independent semantic approval. The source solutions below
were recorded before writing any options or draft. No answer keys/templates,
answer-author/source-first/review artifacts, previous choices, interactions,
history, tests, database, browser or services were accessed.

## Allowed Snapshot and Heading

Whitelist inspect then explicit prepare selected all 17 exercises 15--31 and
only concept blocks 1/2/6/7. Blocks 5/8--13 (solved sine example) were not selected.
No concept figure or task figure is selected; the seed has no images. Previously
approved body Fig. 2 is not an input for these tasks and is not reopened.

Seed: `ana10-c6-s1-n76-choice-seed.json`

Canonical SHA-256:
`0ee0631574f39c8287096862532ba84d14b226232d8f930d5f1b266f69a3756f`

The preparation projection omits group headings. A separate allowed
`{number,group,text}` projection of current modern `exercises.json` confirms:

- 15--28: `求下列函数的导函数：`
- 29--31: `求下列函数图象的切线方程：`

Thus derivative/tangent intent comes from actual written instructions, not a
filename or an assumed assignment. The seed trace hashes the entire allowed
exercises file, including those groups:
`b78272216a35305bc3af6640c8540ff0c54db9cd896b81a6853b506829b0058f`.
All source-number prefixes now use ASCII dots. No math was reinterpreted from
that display-only change; seed/schema/tools remain untouched.

Concept 1 supplies cosine/tangent/cotangent derivatives; concept 2 limits them
to the corresponding function domain; 6/7 give contact point and general
tangent rule. Angles are in radians. Decimal constants are exact printed
values. `sin2x`, `cos2u` etc. mean sin(2x), cos(2u), not squared functions.

## Independent Complete Source Solutions

For every derivative task, the mathematical demand is the derivative function
on the original domain, not only a value at a sample point. All trigonometric
sum/product expressions without tangent/cotangent denominators have domain R.
Chain/product/sum rules and addition identities are mathematical derivations
by this author, not copied solved examples.

### 15

`f=1.3 cos x`; constant multiple rule and `(cos x)'=-sin x` give
`f'=-1.3 sin x`, domain R. Preserve the coefficient and derivative sign.

### 16

For `a=2.3x-10pi`, `a'=2.3`. Therefore
`h'=3(-sin a)2.3=-6.9 sin(2.3x-10pi)=-6.9 sin(2.3x)`, domain R.
The phase is five full cosine periods, not an extra derivative factor.

### 17

`a=pi-x`, `a'=-1`. The constant `2pi` has derivative zero, hence
`g'=(-0.5)(-sin a)(-1)=-0.5 sin(pi-x)=-0.5 sin x`.
Alternatively `cos(pi-x)=-cos x`, so `g=2pi+0.5cos x`. Domain R.
Three signs in the chain product must be retained.

### 18

`(2x^2)'=4x` and `[-30cos(5x+6)]'=(-30)(-sin(5x+6))5`.
Thus `u'=4x+150sin(5x+6)`, domain R. Both independent summands must
be differentiated, including the internal factor 5.

### 19

`[-2cos(x-pi)]'=2sin(x-pi)` and `[2sin(2x)]'=4cos(2x)`.
Therefore `v'=2sin(x-pi)+4cos(2x)=-2sin x+4cos(2x)`, domain R.
The shifted sine changes sign under a pi shift, not under a full period.

### 20

`tg(pi/4)=1`, so the second summand is the constant 2. With `a=2x+3`,
`v'=5*2/cos^2(a)=10/cos^2(2x+3)`.
Original and derivative domain:
`D={x in R: cos(2x+3)!=0}`, equivalently
`x!=(pi/2-3+kpi)/2`, every integer k.
The constant neither creates a derivative term nor removes a tangent pole.

### 21

`s'=3*2/cos^2(2x+1)=6/cos^2(2x+1)`.
`D={x in R: cos(2x+1)!=0}` or
`x!=(pi/2-1+kpi)/2`, k any integer.
Coefficient and phase must each stay attached to their own function.

### 22

For `a=6x+3`, wherever cos(a)!=0,
`s=2tg(a)+tg(a)=3tg(a)`, giving `s'=18/cos^2(a)`.
Direct quotient differentiation independently gives
`[2sin a/cos a]'=[12cos^2a+12sin^2a]/cos^2a=12/cos^2a`;
the remaining tangent contributes `6/cos^2a`. Sum is 18/cos^2a.
The original denominator prevents extension through any cos(a)=0:
`D={x in R: cos(6x+3)!=0}`, equivalently
`x!=(pi/2-3+kpi)/6`, k any integer.

### 23

`cos(2u)sin u+sin(2u)cos u=sin(3u)`, hence `f'=3cos(3u)`.
Product differentiation also gives
`[-2sin(2u)sin u+cos(2u)cos u]+
[2cos(2u)cos u-sin(2u)sin u]`
`=3[cos(2u)cos u-sin(2u)sin u]=3cos(3u)`. Domain R.

### 24

`cos(2pi)=1`, `sin(2pi)=0`, both constants in t.
Thus `g(t)=cos(3t)` and `g'(t)=-3sin(3t)`, domain R.
Differentiating the constants gives zero, not an extra frequency.

### 25

`v'(t)=4[-1/sin^2(2t+3)]2=-8/sin^2(2t+3)`.
`D={t in R: sin(2t+3)!=0}`, equivalently
`t!=(kpi-3)/2`, k any integer.

### 26

`v'(x)=7[-1/sin^2(2x-2pi)]2=-14/sin^2(2x-2pi)`.
Cotangent has period pi, so shifting by 2pi leaves the same function:
`v=7ctg(2x)`, `v'=-14/sin^2(2x)`.
Original domain `sin(2x-2pi)!=0` is equivalent to `x!=kpi/2`.
No cancellation makes a pole part of the domain.

### 27

Addition identity gives
`f=sin((2.5+0.5)x)=sin(3x)`, so `f'=3cos(3x)`, domain R.
The product-rule route gives
`-2.5sin(2.5x)sin(0.5x)+0.5cos(2.5x)cos(0.5x)+
2.5cos(2.5x)cos(0.5x)-0.5sin(2.5x)sin(0.5x)`
`=3[cos(2.5x)cos(0.5x)-sin(2.5x)sin(0.5x)]`.
Source 23 and 27 are exactly the same sin(3 variable) function after
the identity, not two distinct numerical outcomes.

### 28

`sin x cos(5x)-sin(5x)cos x=sin(x-5x)=sin(-4x)=-sin(4x)`.
Differentiation yields `f'=-4cos(4x)`, domain R.
Direct product rule:
`cos x cos5x-5sin x sin5x-5cos5x cos x+sin5x sin x`
`=-4[cos x cos5x+sin x sin5x]=-4cos(4x)`.
Reversing the subtraction changes the sign and is not equivalent.

### 29 (Both Subparts)

For sine, `f'=cos x`.

- At `x0=-pi`: `y0=0`, slope `cos(-pi)=-1`.
  `y-0=-(x+pi)`, hence `y=-x-pi`.
- At `x0=pi/2`: `y0=1`, slope zero. `y=1`.

Each tangent is a full line; a horizontal tangent is not the vertical line
through its abscissa. Both contacts lie in domain R.

### 30 (Both Subparts)

For cosine, `s'=-sin x`.

- At `x0=-pi/2`: `y0=0`, slope `-sin(-pi/2)=1`.
  `y=x+pi/2`.
- At `x0=2pi`: `y0=1`, slope zero. `y=1`.

The negative abscissa and cosine derivative minus sign both matter.
Both contacts lie in domain R. The horizontal result repeats source 29(b),
but the nonhorizontal cases come from different functions and slopes.

### 31 (Both Subparts)

`g'=1/cos^2x` on `cos x!=0`.

- At 0: `y0=0`, slope 1, tangent `y=x`.
- At pi/4: `y0=1`, slope 2.
  `y-1=2(x-pi/4)`, hence `y=2x+1-pi/2`.

Both abscissas satisfy the tangent domain condition. Slope 2 alone is
not the full second line; the contact condition fixes its intercept.

## Capacity Boundary Before Options

No original derivative, tangent subpart or domain condition is unresolved.
Choice recognition cannot demonstrate independently producing a derivative
derivation or writing a tangent equation; these production losses must be
listed in intent/coverage rather than claimed as assessed. No written graph
construction is requested here, so no figure is necessary. The response units
will keep whole derivative functions or whole two-contact tangent records,
not split into answer slots. Equivalent 23/27 outcomes belong together; the
common y=1 tangent will not be a standalone repeated question.

## Authored Response Units

After freezing the complete solutions above, the author manually wrote 12
questions / 48 options. No script generated questions, alternatives or keys.
There are 11 native single questions and one native multiple question.

| Question | Source | Coherent Mathematical Unit |
| --- | --- | --- |
| q01 | 15/16 | Complete direct/compound cosine derivative pair. |
| q02 | 17 | Constant term and three-sign chain product. |
| q03 | 18 | Whole polynomial plus composite cosine derivative. |
| q04 | 19 | Whole shifted cosine plus double-angle sine derivative. |
| q05 | 20/21 | Complete tangent derivative/domain pair, contrasting a fixed-angle constant. |
| q06 | 22 | Whole quotient-plus-tangent derivative and original denominator domain. |
| q07 | 23/27 | Two equivalent addition-identity structures in one full derivative record. |
| q08 | 24 | Fixed-angle factors and full variable cosine derivative. |
| q09 | 25/26 | Complete cotangent derivative pair with original domains retained. |
| q10 | 28 | Difference-angle whole derivative including its sign. |
| q11 | 29/30 | All four tangent equations in one complete record. |
| q12 | 31 | Native multiple selection of independently judged complete tangent records. |

F/G in q07 and w in q09 are only function-name disambiguations for jointly
displayed original expressions; variables and all numerical data remain
unchanged. Other merges are justified by common derivative structure or shared
tangent distinction, not by a requested question count.

All 17 seeds and all six tangent subparts are covered. No whole mathematical
task is deferred. The unavoidable loss of autonomous writing is recorded once
for every source in coverage and explicitly in every question's intent.
Original 15--28 ask derivatives rather than explicit domain enumeration;
q05/q06 expose their already necessary denominator restriction as an additional
concept-2 judgment, without inventing a new convention or numerical premise.
q09 retains domains in the stem, without claiming to assess autonomous domain
enumeration.

Every option has a concrete internal derivation and false options have a
reproducible mistaken procedure. Correctness, source mapping and these
misconceptions are internal, not in `view`. Options avoid combination codes,
source exercise numbers, body-figure/solved-example cues and answer slots.
23/27's identical simplified outcomes cannot be copied from a separate item;
29/30's repeated y=1 results are not standalone questions. The q11 incorrect
complete records respectively test omission of horizontal contact displacement,
omission of ordinate, and cosine derivative sign; each of the four source
subparts occurs in a false record as well as the correct one.

Only structural validation is authorized here. Independent source-first and
view-only review, followed by author comparison, remain the parent's next gate;
this author does not claim a semantic PASS.

## Bounded Structural Handoff

Exactly one structural validator invocation:

```sh
python3 .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n76-choice-seed.json \
  --draft .intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n76-choice-draft.json
```

Exit 0: `mechanical checks passed; semantic review still required`.
No review was read or authored, and no self semantic approval was recorded.
There was no validator-triggered repair or second validation.

All three assigned outputs are inside
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`:

- `ana10-c6-s1-n76-choice-seed.json`
- `ana10-c6-s1-n76-choice-draft.json`
- `ana10-c6-s1-n76-choice-author-notes.md`

Snapshot hashes:

| Artifact | Canonical JSON Digest | File-Bytes SHA-256 |
| --- | --- | --- |
| seed | `0ee0631574f39c8287096862532ba84d14b226232d8f930d5f1b266f69a3756f` | `434a697f8518917d78b8c4850e61307345d6a57ae22b08c74cf8aa5442a1b2fa` |
| draft | `0c94261c73aa97b659b0bd0a0e34fabf4c450142af5e3b9a660d7b02db854713` | `9b710c479b5a46b28f02fedb65009cbbb1b0ae674234a686f8d343eb36f04a04` |

Final counts: 17 seeds; 4 selected definition blocks; 12 questions (11 single,
1 multiple); 48 options/rationales; 17 coverage entries; 0 source/new images.
All derivative functions and six tangent subparts are represented. Independent
production is not established by choice recognition; those concrete losses
are retained rather than claiming full written-proof equivalence.

Stop at author handoff. The parent owns the view-only projection and separate
independent review. No browse/render/publish/promotion/tool edit occurred.
