# STEMROBIN-188: n43 Offline Answer Author

Status: **AUTHORED ONLY, NOT INDEPENDENTLY REVIEWED OR APPROVED**.

Authorized scope: `9-10g / modern-us-neutral / geo910-c2-s1-n43`, written
exercises 8-15, same188-6/STEMROBIN-188. All command cwd values were
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.
Only `.intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/` was used for
authored files, working outputs, originals, receipts and reports.
No core answer file was written. No finalize, publication, DB, env setup,
installation, network/API/paid call, Git operation, other worker output or
thread/supervisor message was used.

The direct human instruction supplied the parent adapt-finalize-repair exit-0
prerequisite. I did not independently inspect the parent's receipt or claim to
approve that repair. The current lesson, exercises and figures JSON all declare
`status: ready`; these current modern inputs, not earlier answer/interaction/
choice/ticket-math outputs, supplied the mathematical prompts.

## Candidate and Evidence

All paths below are relative to the command cwd; `report.json` and
`inputs.manifest.json` contain absolute paths and SHA-256 bindings.

- Candidate: `.intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n43/answer-keys.template.json`.
- Current candidate SHA-256: `a9d4f1a7cd7fd01f17c3abe40dc987fd26ed6004880f633d7009b82a942192b7`.
- Untouched prepared original: `.intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/originals/answer-keys.template.prepared.json`.
- Prepared-original SHA-256: `9b004c3ceb8844c0b1d8eda243cb1167ba338366be17a72e8d215ec855351624`.
- Input manifest: `.intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/inputs.manifest.json`; 15 input/tool/rule files hashed. Original modern lesson, exercises, figures and FigureSpec JSON snapshots were retained.
- Modern lesson SHA-256: `a931778a149bbcfbee6d8e551531f9bdc7b42b70600002193bcaf08e4b6f9b80`.
- Modern exercises SHA-256: `b796848292035b78971f310ebaa0fa1072275c69a15697782dacf4c1b6f2a1e6`.
- Modern figures SHA-256: `c397c1caeb292769a747e1922460e87708ee389fb5bdd405661d2d3b798fb445`.
- Image ledger: `.intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/image-ledger.json`.
- Machine report: `.intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/report.json`.

`9-10g/answers.json` does not exist. All eight answers have `source: derived`;
none contains `bookRaw`, and no book-answer PDF pages were read.
Prepared exercise IDs, prompts, figure evidence, source and historical-entity
fields were retained. Current `source_number`, `group` and `group_id` are
retained as `sourceNumber`, `group`, `groupId`; numbering scope remains `book`.
All exercises are group `g1`, label `习题`, source numbers 8-15 in order.
The candidate remains `status: draft`.

## Mathematical Basis

The course basis is an orthonormal spatial unit basis:
$\vec i\cdot\vec i=\vec j\cdot\vec j=\vec k\cdot\vec k=1$ and all
pairwise cross dot products are zero. Consequently,
$(x,y,z)\cdot(u,v,w)=xu+yv+zw$ and
$|(x,y,z)|=\sqrt{x^2+y^2+z^2}$.
For nonzero vectors, their angle lies in $[0,\pi]$ and its cosine is the
dot product divided by the product of their lengths.
The problem imposes no further positivity, acute-angle or hidden coordinate
constraints. In exercise 14, the existence of direction angles implies
$\vec a\ne0$; this is a domain requirement, not an added numerical assumption.

## Complete Derivations and Crosschecks

### Exercise 8

1. $\vec a=(1,-1,1)$, so $|\vec a|^2=1+1+1=3$ and $|\vec a|=\sqrt3$.
2. $\vec b=(2,1,-3)$, so $|\vec b|^2=4+1+9=14$ and $|\vec b|=\sqrt{14}$.
3. $\vec c=(0,1,-1)$, so $|\vec c|^2=0+1+1=2$ and $|\vec c|=\sqrt2$.
4. $\vec d=(0,-2,0)$, so $|\vec d|^2=4$ and $|\vec d|=2$, not $-2$.

Independent coordinate-norm computations give approximately
1.7320508075688772, 3.741657386773941, 1.4142135623730951 and 2.
Their squares are respectively 3, 14, 2 and 4. Four numeric parts.

### Exercise 9

Write the equal coordinates as $(t,t,t)$. The length condition gives
$3t^2=3^2=9$, hence $t^2=3$ and $t=\sqrt3$ or $t=-\sqrt3$.
The complete vector-coordinate solution set is
$\{(\sqrt3,\sqrt3,\sqrt3),(-\sqrt3,-\sqrt3,-\sqrt3)\}$.
Both vectors have length 3 and have three identical coordinates.
Mixed signs violate coordinate equality; independently choosing signs would
incorrectly introduce six extra solutions.

One exact part contains the **whole two-vector set**, with both member
orderings accepted. This avoids three independent +/- coordinate fields
accidentally accepting mixed signs or a one-vector answer losing a solution.
The shared normalizer accepts the two complete sets and rejects five
incomplete/incorrect examples: either single tuple, a mixed-sign set, a
positive-only set, and a set with the extra zero vector.
These are lexical contract checks, not a real MathLive editing test.

### Exercise 10

1. $\vec a+\vec b=(1+3,2+0,-1-2)=(4,2,-3)$.
   Its squared length is $16+4+9=29$, giving $\sqrt{29}$.
   Independently, $|\vec a|^2=6$, $|\vec b|^2=13$ and
   $\vec a\cdot\vec b=5$; polarization gives $6+13+2(5)=29$.
2. $\vec a+\vec b=(1-1,-1+1,3-3)=(0,0,0)$, length 0.
   Independently, the squared lengths are 11 and 11 and the dot product
   is $-11$; polarization gives $11+11+2(-11)=0$.

The lengths are approximately 5.385164807134504 and 0. Two numeric parts.
The zero vector is valid here because the question asks for length, not angle.

### Exercise 11

1. $2\vec a+3\vec b=(2,2,-2)+(6,0,0)=(8,2,-2)$.
   Squared length $64+4+4=72$; length $\sqrt{72}=6\sqrt2$.
   Independently, $|\vec a|^2=3$, $|\vec b|^2=4$,
   $\vec a\cdot\vec b=2$. The expansion
   $4|\vec a|^2+9|\vec b|^2+12\vec a\cdot\vec b$ gives
   $12+36+24=72$.
2. $2\vec a+3\vec b=(6,2,0)+(0,3,-3)=(6,5,-3)$.
   Squared length $36+25+9=70$; length $\sqrt{70}$.
   Independently, $|\vec a|^2=10$, $|\vec b|^2=2$,
   $\vec a\cdot\vec b=1$. The same expansion gives
   $40+18+12=70$.

The lengths are approximately 8.48528137423857 and 8.366600265340757.
Two numeric parts.

### Exercise 12

$\vec a\cdot\vec b=(-1)6+2(3)+(-2)(-6)=-6+6+12=12$.
The squared lengths are $1+4+4=9$ and $36+9+36=81$, so the lengths
are 3 and 9. Therefore $\cos\varphi=12/(3\cdot9)=4/9$.
The unique vector angle is
$\varphi=\arccos(4/9)=1.1102423351135742$ radians,
equivalently $63.61220003875701^\circ$.

Independent distance crosscheck:
$\vec a-\vec b=(-7,-1,4)$ has squared length $49+1+16=66$.
Thus $(9+81-66)/2=12$ recovers the dot product.
The positive cosine also verifies the computed angle is between 0 and
$\pi/2$. The numeric key is exact LaTeX `\arccos\left(\frac{4}{9}\right)`,
with unit `rad` and tolerance $10^{-6}$ radians; the displayed rounded
radian answer differs by about $3.51\times10^{-8}$.
There is no substitution of the cosine for the requested angle.

### Exercise 13

$\vec a-\vec b=(-1,3,1)$ and $\vec a+\vec b=(3,1,1)$.
Their dot product is $-3+3+1=1$; each squared length is 11.
The requested cosine is $1/(\sqrt{11}\sqrt{11})=1/11$.

Independently, $|\vec a|^2=6$, $|\vec b|^2=5$ and
$\vec a\cdot\vec b=2-2+0=0$.
The difference-sum dot identity gives $6-5=1$, and both sum/difference
squared lengths are $6+5=11$. Numeric value approximately
0.09090909090909091. One numeric part.

### Exercise 14

Let $L=|\vec a|=\sqrt{p^2+q^2+r^2}>0$.

1. Orthonormality gives $\vec a\cdot\vec i=p$,
   $\vec a\cdot\vec j=q$, $\vec a\cdot\vec k=r$.
   The direction-angle cosine formula therefore gives
   $\cos\alpha=p/L$, $\cos\beta=q/L$, $\cos\gamma=r/L$.
   Hence $\vec u=\vec a/L=(p/L,q/L,r/L)
   =(\cos\alpha,\cos\beta,\cos\gamma)$.
   Since $1/L>0$, its direction is the same as $\vec a$; since
   $|\vec u|=|\vec a|/L=1$, it is indeed the required unit vector.
2. Squaring and adding gives
   $\cos^2\alpha+\cos^2\beta+\cos^2\gamma
   =(p^2+q^2+r^2)/L^2=1$.
3. With $\alpha=\beta=60^\circ$,
   $\cos^2\gamma=1-1/4-1/4=1/2$.
   Thus $\cos\gamma=\pm\sqrt2/2$, and over $[0^\circ,180^\circ]$
   the complete solution is **$\gamma=45^\circ$ or $135^\circ$**.
   Existence crosscheck: $(1/2,1/2,\sqrt2/2)$ and
   $(1/2,1/2,-\sqrt2/2)$ each have squared length
   $1/4+1/4+1/2=1$ and direction cosines $1/2,1/2$ on the first
   two axes. The third coordinate respectively gives 45 and 135 degrees.

All three parts, including both complete proofs, are explicitly in
`displayAnswer`. The whole mixed exercise is `ungraded`, with empty `parts`,
because deterministic grading of its numeric subpart cannot grade its proofs.
The illustration does not imply $r>0$ or permit excluding the obtuse solution.

### Exercise 15

For a nonzero vector $(x,y,z)$, the ordered cosines with
$(\vec i,\vec j,\vec k)$ are $(x/L,y/L,z/L)$.

1. $(1,1,1)$ has $L=\sqrt3$, so the ordered triple is
   $(1/\sqrt3,1/\sqrt3,1/\sqrt3)
   =(\sqrt3/3,\sqrt3/3,\sqrt3/3)$.
   Its squared-cosine sum is $1/3+1/3+1/3=1$.
2. $(0,-3,-1)$ has $L=\sqrt{10}$, so the triple is
   $(0,-3/\sqrt{10},-1/\sqrt{10})$.
   Its squared-cosine sum is $0+9/10+1/10=1$.
   Zero and both negative signs are required.
3. $(-5,0,0)$ has $L=5$, so the triple is $(-1,0,0)$.
   Its squared-cosine sum is $1+0+0=1$; the first direction is opposite
   $\vec i$, not in the same direction.
4. $(0,3,4)$ has $L=5$, so the triple is $(0,3/5,4/5)$.
   Its squared-cosine sum is $0+9/25+16/25=1$.

Each coordinate was independently checked as a dot product with its axis
unit vector divided by $L$, retaining sign and zero. All cosines lie in
$[-1,1]$. There are twelve independent scalar numeric parts, labelled by
original subquestion and axis, rather than one ambiguous tuple field.

## Figure Evidence

Exactly two images were actually opened with `functions.view_image`:

1. Original `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-05.png`,
   SHA-256 `ead0b7efbccc03c7d8205535a406dd7b6be2da7697567dd34b596337255f2cc7`.
2. Existing approved preview `ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/stemrobin188-g10-n42n43/geo910-c2-s1-n43-figures/fig-g10-05.preview.png`,
   SHA-256 `b208a7c07dc22b876978aa23f05de2e64e906b284424dc1ee2f51f7fe51fe022`.

Both show the same common tail, i down-left, j right, k up, a upper-right,
and associations alpha(i,a), beta(j,a), gamma(k,a), without numerical givens.
The current modern FigureSpec was read; SHA-256
`092c305cbbd709f349613537ff09a2bdc826e09246b519ad7dd9e89d61c27158`.
It explicitly disclaims circular screen sweeps and projected basis lengths
as true spatial angles/lengths. Its rendering coordinates are not the
exercise's $p,q,r$.
Current SVG SHA-256:
`623558b4a090909da9af9e45dceb08b4dbf9846cbd2b19075ed67547b16c0f05`.
The existing preview was the visual evidence for the modern asset.
No other figures, source answer pages, crops or reopens were used.
Batch opens: 2/8. Current-context opens: 2/24. No image payload accompanies
this textual author report.

## Commands, Failures and Repair Counts

Preparation ran **once**, using the existing Python venv:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python
.claude/skills/ld-s10y-answer/tools/lesson_answers.py prepare
--book 9-10g --edition modern-us-neutral --lesson geo910-c2-s1-n43
--root ssot-resources/soviet10year-textbooks/artifacts
--work .intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/work
```

Receipt `receipts/prepare.json` retains exact cwd, argv, timestamps, stdout,
stderr and exit code 0, plus output-stream hashes. The tool's stdout suggested
later writing to the core answer path; that suggestion was **not executed**.
The unedited prepared template was retained before authoring.

- `validate-structure`: existing `validate_lesson` imported and called only
  against the owned candidate; exit 0. Eight exercise identities and order,
  current metadata, preserved prepared fields, seven auto/one ungraded,
  23 parts, draft status and derived-only source checked.
- `validate-latex`: existing `check_math_expressions.mjs` against the owned
  candidate; exit 0, 22 numeric expected strings parsed as finite real numbers.
- `validate-arithmetic`: first exit 1, with the full stdout/stderr/command
  retained in `receipts/validate-arithmetic.*`. ComputeEngine returned imaginary
  component `-0` for a real expression; Node's strict assertion distinguished
  it from `0`. This was a validator assertion defect, not a mathematical or
  candidate defect. The failing script was retained as
  `originals/validate-arithmetic.first-fail.mjs`.
- One technical assertion repair changed `assert.equal(boxed.im, 0)` to
  `assert.ok(boxed.im === 0)`, accepting both mathematically identical zeros
  while still rejecting nonzero imaginary components.
- `validate-arithmetic-repair-1`: exit 0. All 22 numeric expected values were
  independently recalculated from the written question vectors, then compared
  with ComputeEngine-parsed candidate values. The report includes polarization,
  dot/norm, signs, zero, complete coordinate sets and both gamma solutions.
  All 15 hash-bound input/rule/tool files remained unchanged.
- Two earlier path-discovery failures and their valid output were retained in
  `discovery-failures.json`: the not-yet-created owned directory and an incorrect
  interpretation of the user's preview-path shorthand. They were corrected by
  authorized directory creation and a filename-only preview search.

Counts: prepare invocations 1; prepare repairs 0; answer-content repairs 0;
failed focused validation invocations 1; validator repairs 1;
path-discovery corrections 2. No passed preparation or validation stage was
rerun. Candidate bytes were unchanged by the validator repair.

## Deferred Gates

These are focused offline author checks, **not gate-2 approval**.
The exact solution-set key still requires the real MathLive keyboard editing
and reserialization check before any future finalization. Shared normalizer
checks are expressly not a substitute for that input-chain check.
No browser, finalize, publish or full-project defence was run.
The parent must independently review this hash-bound candidate, including
proof completeness, both-signed solution sets and the real exact-input
contract, before deciding any further action.
