# n78 source-first answer prose

Date: 2026-11-16.
Book: `10c`. Faithful lesson: `ana10-c6-s1-n78`.
Status: independent source-first derivation, scratch only; not an approved
modern-edition answer key, official template, or machine-validated artifact.

## Source And Readiness

Read the complete faithful `lesson.md` and `lesson.json`, the complete faithful
`exercises.json` containing written tasks 42-45, and actually opened the
original `fig-04.png`. Read the answer skill for grading-contract vocabulary.
No modern lesson/answer draft, choice artifact, parent solution, or book answer
key was consulted. The solutions below were independently derived from the
faithful task statements.

Read-only SHA-256 bindings:

| Input | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s1-n78/lesson.md` | `26f09192053828fef864ef1993b2977805b39f7105ee547e3ffecef78bf87c50` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s1-n78/lesson.json` | `3dd5de0eb546c97641d79b4a64be8c4a1deafd0e4314d1bd5765e28af9ba9b1a` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s1-n78/exercises.json` | `e4d7c8ca038a00c78d46d605cea837b29b06f35e850a5bec59e3d0e38a03eb57` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-04.png` | `4bd4798c87397d795ad030e69c3f59dd13c3ef079a7ce5ea92b9af822d13cd71` |

Faithful n78 contains the proof of the first important limit, three worked
examples, the radian/degree-function note, the chord/arc theorem and proof,
and the transition to the four written tasks. The physical-page-18 glyph
issue remains unresolved as requested: it concerns a textual label in the
source context, not a coefficient, limit point, sign, or function argument
in tasks 42-45. No identification, normalization, or source repair of that
glyph is attempted here.

The three source worked examples are prose, not additional exercises:

- Example 1: the limit of `x / sin x` as x tends to zero.
- Example 2: the limit of `sin(4x) / x` as x tends to zero.
- Example 3: the limit of `tg x / x` as x tends to zero.

They contribute no answer entries. The answer set is exactly 42, 43, 44, 45,
each in source group `g1` with no printed subparts.

## Actual Original Figure Observation

The original PNG visibly shows O at the left, B above-right and A below-right.
Solid radii OB and OA bound the angle; the solid straight chord AB joins their
endpoints, and the separate curved boundary from B to A is the circular arc.
A dashed line from O runs through the chord toward the arc, between the two
printed `x/2` labels. The small angle marking lies between the radii.
There are no numerical measurements to read from the raster.

This is the apparatus for the source proof: for fixed radius r>0 and central
angle x in radians, chord length is `2r sin(x/2)` and arc length is `rx`.
As the positive arc length tends to zero, x tends to zero from above, and
their ratio is `sin(x/2)/(x/2)`, tending to 1. The figure motivates the same
fundamental limit; it does not supply extra data for the written tasks.

All four faithful exercise records have empty `figure_refs` and `figures`.
No figure reference, radius, geometric measurement or construction is added
to their answers.

## Mathematical Basis

Angles in these analytical trigonometric functions are in radians. Use the
theorem proved in n78:

$$
\lim_{u\to0}\frac{\sin u}{u}=1.
$$

The reciprocal also has limit 1:

$$
\lim_{u\to0}\frac{u}{\sin u}=1,
$$

because the first ratio tends to the nonzero value 1. It is legitimate to
take its reciprocal in a sufficiently small punctured neighborhood of zero.
In particular, for nonzero u with |u|<pi, sin u is nonzero.

All transformations below concern punctured neighborhoods of the indicated
limit point. The original fractions need not be defined at that point;
direct substitution yielding `0/0` is not evaluation of a limit. No
L'Hopital rule or trigonometric differentiation is used.

## Task 42

Source identity: number/source_number `42`, group `g1`,
source reference `p0019#5` (physical page 19, printed page 13).
The printed starred task is:

$$
\lim_{x\to0}\frac{\sin8x}{2x}.
$$

For x nonzero, multiply the fundamental-limit ratio by the exact factor
needed to restore the denominator:

$$
\frac{\sin8x}{2x}
=4\frac{\sin8x}{8x}.
$$

Set u=8x. As x tends to zero from either side, u tends to zero. Therefore

$$
\lim_{x\to0}\frac{\sin8x}{2x}
=4\lim_{u\to0}\frac{\sin u}{u}
=4\cdot1
=\boxed{4}.
$$

Standard value: **4**.
Suggested grading: one scalar numeric part, canonical expected LaTeX `4`.

## Task 43

Source identity: number/source_number `43`, group `g1`,
source reference `p0019#6` (physical page 19, printed page 13).
The printed starred task is:

$$
\lim_{x\to0}\frac{5x}{\sin4x}.
$$

For nonzero x sufficiently close to zero, sin(4x) is nonzero. Rewrite

$$
\frac{5x}{\sin4x}
=\frac54\frac{4x}{\sin4x}.
$$

Set u=4x. Then u tends to zero, and the reciprocal fundamental limit gives

$$
\lim_{x\to0}\frac{5x}{\sin4x}
=\frac54\lim_{u\to0}\frac{u}{\sin u}
=\frac54\cdot1
=\boxed{\frac54}.
$$

Standard value: **5/4**, equivalently **1.25**.
Suggested grading: one scalar numeric part, canonical expected LaTeX
`\frac{5}{4}`.

## Task 44

Source identity: number/source_number `44`, group `g1`,
source reference `p0019#7` (physical page 19, printed page 13).
The printed starred task is:

$$
\lim_{x\to\pi}\frac{\sin(\pi-x)}{\pi-x}.
$$

Set u=pi-x. As x tends to pi, u tends to zero; x differs from pi exactly
when u differs from zero. Approaching pi from below gives positive u, while
approaching from above gives negative u. Both sides are covered by the
two-sided fundamental limit:

$$
\lim_{x\to\pi}\frac{\sin(\pi-x)}{\pi-x}
=\lim_{u\to0}\frac{\sin u}{u}
=\boxed{1}.
$$

No minus sign remains: the same quantity pi-x is both the sine argument
and the denominator.

Standard value: **1**.
Suggested grading: one scalar numeric part, canonical expected LaTeX `1`.

## Task 45

Source identity: number/source_number `45`, group `g1`,
source reference `p0019#8` (physical page 19, printed page 13).
The printed starred task is:

$$
\lim_{x\to0}\frac{\cos\left(\frac{\pi}{2}-6x\right)}{5x}.
$$

Use the cofunction identity, valid for all real arguments:

$$
\cos\left(\frac{\pi}{2}-6x\right)=\sin6x.
$$

For x nonzero,

$$
\frac{\cos\left(\frac{\pi}{2}-6x\right)}{5x}
=\frac{\sin6x}{5x}
=\frac65\frac{\sin6x}{6x}.
$$

Set u=6x. Then u tends to zero from both sides, so

$$
\lim_{x\to0}\frac{\cos\left(\frac{\pi}{2}-6x\right)}{5x}
=\frac65\lim_{u\to0}\frac{\sin u}{u}
=\frac65\cdot1
=\boxed{\frac65}.
$$

Standard value: **6/5**, equivalently **1.2**.
Suggested grading: one scalar numeric part, canonical expected LaTeX
`\frac{6}{5}`.

## Proposed Judging Structure

This is a prose recommendation, not formal JSON or a claimed runtime PASS.

| Source task | Proposed grading | Proposed parts | Judge | Canonical expected LaTeX |
| --- | --- | --- | --- | --- |
| 42 | `auto` | One whole-task scalar part | `numeric` | `4` |
| 43 | `auto` | One whole-task scalar part | `numeric` | `\frac{5}{4}` |
| 44 | `auto` | One whole-task scalar part | `numeric` | `1` |
| 45 | `auto` | One whole-task scalar part | `numeric` | `\frac{6}{5}` |

Suggested provenance is `derived`: the task statements and theorem were read
from faithful source, but no printed answer key was consulted. Do not invent
`bookRaw` evidence. Preserve each source number, group identity and source
order when an official template is authorized. No invented subparts or
additional tasks are needed.

The display answer should retain the full elementary solution above. A
numeric final-value check does not certify a submitted proof; it only judges
the requested scalar limit. Exact equivalent finite real values should be
accepted, including the terminating decimals for 43 and 45. This is not a
request for loose approximate matching, string matching against explanations,
or LLM judging.

Independently expected negative examples: 42 is not 8 or 1/4; 43 is not 4/5;
44 is not -1 or 0; 45 is not 5/6 or -6/5. `0/0`, an undefined expression or
infinity is not an answer to any of the four tasks. These are mathematical
expectations only; no grading implementation or tests were run.

## Stop And Handoff

Complete source-first solution coverage: four written tasks, in order,
standard values `4`, `5/4`, `1`, `6/5`; three worked examples excluded.
The original fig04 was actually viewed. The page-18 textual glyph remains
unresolved and does not enter these four calculations.

Only this scratch Markdown was authored. No prepare/finalize, formal JSON,
source/figure/tool/index edit, DB action, Git action, dependency change or
network operation was performed. No mechanical or independent-review PASS
is claimed. Modern-edition readiness remains pending: wait for approved
modern text and explicit official-template authorization before adapting or
persisting any answer key.
