# Frozen Source-First Solutions: n92, Exercises 266-293

Stage: 1, independently solved before any candidate disclosure.
Reviewer: fresh independent choice reviewer n92 (`independent_agent`).
Ticket: STEMROBIN-184. Date: 2026-11-16.
Ownership: only `.intentfold/tickets/STEMROBIN-184/tmp/production-choice-n92-review/`.

This document freezes concrete solutions for all 28 numbered unsolved tasks.
No author directory was enumerated. No candidate views, drafts, keys, notes,
answers, derivations, or solved exposition examples were consulted.
No figures are present; image opens and screenshot opens are both zero.
No app, database, publisher, dependency, schema, Git, browser, SkillHost,
binder/archive pipeline, or global test operation was performed.
This is not a candidate review or an approval.

## Input Binding

Authorized seed:
`.intentfold/tickets/STEMROBIN-184/tmp/production-choice-n92/seed.json`

- Seed canonical SHA-256:
  `4a03d7cd0099f8d293b307781171cb558a823070d181ae271f61f08551e52bbf`
- Seed file-byte SHA-256:
  `faff454162e494af2d6b67f5c4e1b7f3a7c0e17fe4c2cfd24f36c92b78cde710`
- Canonical digest uses the contract's sorted-key, ASCII-escaped, compact JSON
  convention, obtained with the documented `prepare.py digest` command.

Additional authorized source, read only through the `{number, group, text}`
projection for numbers 266-293:
`ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s4-n92/exercises.json`

- Current source file-byte SHA-256:
  `f39e36a085e006bc49f5ab6f49c7aa030df6ad75b226b5d9a2c2395e095d9e54`
- This equals that source's hash recorded in the seed trace.
- No `source.data`, answer fields, or other source projections were inspected.

Other source trace hashes are recorded here from the authorized seed only;
their source files were not opened or independently rehashed:

- `10c/book.json`:
  `234a8ec5dea23fc666b74b9ec5514c9532023d3ede5e58c241127e6f52ed6d5e`
- Modern `ana10-c6-s4-n92/lesson.json`:
  `1ac635d89b62bc74e205a013b995199219abc61eb5ca79a11882a93a3eb00267`
- Modern `ana10-c6-s4-n92/figures.json`:
  `31a675a90917be7d005fb0c630c31b42997c8423a3bbfe222edfb59a25dd40d8`

Rules read and file-byte hashes:

- `.agents/skills/ld-s10y-choice/SKILL.md`:
  `94676fbbbc9723387c996e531ab8a7379d48d8ae5847cd7f4bf1831c199df524`
- `.agents/skills/ld-s10y-choice/references/review.md`:
  `7ab367601247bece0fa05b60a9cd1555d78f1169ed581db76f18385f75aaacea`
- `.agents/skills/ld-s10y-choice/references/contract.md`:
  `a9a44012fb526b24d8d0718c4e5e8966a49313c2a01548416cdd8699c2910083`

## Source Task Instructions

The authorized modern projection explicitly specifies:

- 266-277: write each product as a sum of trigonometric functions. A bare
  numerical value alone does not document the requested transformation.
- 278-283: rewrite for calculation without tables, and compute the result
  exactly. Both the enabling transformation and the value belong to the task.
- 284-289: lower the powers of the trigonometric functions. The solutions below
  eliminate all squared trigonometric factors.
- 290-292: prove the numbered identities. Their printed right-hand sides are
  targets to prove, not solved exposition or an external answer source.
- 293: determine whether the stated equality holds. Its individual question
  takes precedence over the inherited "prove identities" group label.

Selected seed concepts contain addition/subtraction and product-to-sum
identities, not worked numerical examples. The independently used formulas are

$$
2\cos A\cos B=\cos(A+B)+\cos(A-B),
$$
$$
2\sin A\sin B=\cos(A-B)-\cos(A+B),
$$
$$
2\sin A\cos B=\sin(A+B)+\sin(A-B).
$$

Also, $\cos(-t)=\cos t$, $\sin(-t)=-\sin t$, and
$\cos^2t=(1+\cos2t)/2$, $\sin^2t=(1-\cos2t)/2$.
These power identities follow by taking equal arguments in the formulas above.
Degree signs and radian notation are retained as given. For angular minutes,
$30'=1/2^\circ$, not $0.30^\circ$.

## 266

Task: transform $\cos40^\circ\cos50^\circ$ into a trigonometric sum.

$$
\cos40^\circ\cos50^\circ
=\frac12[\cos90^\circ+\cos(-10^\circ)]
=\frac12\cos90^\circ+\frac12\cos10^\circ.
$$

Since $\cos90^\circ=0$, this also simplifies to $\frac12\cos10^\circ$.

## 267

$$
\cos\frac{\pi}{12}\cos\frac{5\pi}{12}
=\frac12\left[\cos\frac{\pi}{2}+\cos\left(-\frac{\pi}{3}\right)\right]
=\frac12\cos\frac{\pi}{2}+\frac12\cos\frac{\pi}{3}
=\frac14.
$$

The two-cosine line supplies the requested sum; $1/4$ is its exact simplification.

## 268

$$
\sin\frac{5\pi}{24}\sin\frac{\pi}{24}
=\frac12\left[\cos\frac{\pi}{6}-\cos\frac{\pi}{4}\right]
=\frac{\sqrt3-\sqrt2}{4}.
$$

The cosine difference, including its order and factor $1/2$, is the requested
product-to-sum transformation.

## 269

$$
\sin110^\circ\sin50^\circ
=\frac12[\cos60^\circ-\cos160^\circ].
$$

As $\cos160^\circ=-\cos20^\circ$, an equivalent simplified sum is
$\frac14+\frac12\cos20^\circ$.

## 270

Let $A=x+\pi/4$, $B=x-\pi/4$. Then $A-B=\pi/2$, $A+B=2x$, so

$$
\sin\left(x+\frac{\pi}{4}\right)\sin\left(x-\frac{\pi}{4}\right)
=\frac12\left[\cos\frac{\pi}{2}-\cos2x\right]
=-\frac12\cos2x.
$$

This holds for every real $x$.

## 271

Here $A=\alpha+\pi/3$, $B=\alpha-\pi/6$, giving
$A-B=\pi/2$ and $A+B=2\alpha+\pi/6$.

$$
\sin\left(\alpha+\frac{\pi}{3}\right)
\sin\left(\alpha-\frac{\pi}{6}\right)
=\frac12\left[\cos\frac{\pi}{2}-\cos\left(2\alpha+\frac{\pi}{6}\right)\right]
=-\frac12\cos\left(2\alpha+\frac{\pi}{6}\right).
$$

This holds for every real $\alpha$.

## 272

The argument sum is $2x$ and the difference is $2\beta$:

$$
\cos(x+\beta)\cos(x-\beta)
=\frac12\cos2x+\frac12\cos2\beta.
$$

This holds for every real $x,\beta$.

## 273

The argument difference is $2\alpha$ and the sum is $2x$:

$$
\sin(x+\alpha)\sin(x-\alpha)
=\frac12\cos2\alpha-\frac12\cos2x.
$$

This holds for every real $x,\alpha$.

## 274

First transform the two smaller-angle sine factors, then the remaining products:

$$
4\sin30^\circ\sin20^\circ\sin10^\circ
=2\sin30^\circ(\cos10^\circ-\cos30^\circ)
$$
$$
=\sin40^\circ+\sin20^\circ-\sin60^\circ-\sin0^\circ
=\sin40^\circ+\sin20^\circ-\sin60^\circ.
$$

Alternatively, using $2\sin30^\circ=1$ in the first transformed line gives the
equivalent two-term sum $\cos10^\circ-\cos30^\circ$.

## 275

$$
4\cos60^\circ\cos20^\circ\cos10^\circ
=2\cos60^\circ(\cos30^\circ+\cos10^\circ)
$$
$$
=\cos90^\circ+\cos30^\circ+\cos70^\circ+\cos50^\circ.
$$

Since $2\cos60^\circ=1$, an equivalent reduced sum is
$\cos30^\circ+\cos10^\circ$.

## 276

$$
4\sin25^\circ\cos15^\circ\sin5^\circ
=2\cos15^\circ(\cos20^\circ-\cos30^\circ)
$$
$$
=\cos35^\circ+\cos5^\circ-\cos45^\circ-\cos15^\circ.
$$

All four terms, with both minus signs, result from transforming the two
remaining cosine products.

## 277

Successive product transformations give

$$
2\cos1^\circ\cos2^\circ=\cos3^\circ+\cos1^\circ,
$$
$$
4\cos1^\circ\cos2^\circ\cos4^\circ
=\cos7^\circ+\cos1^\circ+\cos5^\circ+\cos3^\circ.
$$

Multiply the last line by $2\cos8^\circ$ and transform each term:

$$
8\cos1^\circ\cos2^\circ\cos4^\circ\cos8^\circ
=\cos15^\circ+\cos1^\circ+\cos9^\circ+\cos7^\circ
+\cos13^\circ+\cos3^\circ+\cos11^\circ+\cos5^\circ.
$$

Equivalently, this is $\sum_{k=0}^{7}\cos((2k+1)^\circ)$.
Every cosine has coefficient $1$; there is no remaining factor $1/2$.

## 278

Convert the minutes: $22^\circ30'=22.5^\circ$, $7^\circ30'=7.5^\circ$.

$$
2\sin22.5^\circ\cos7.5^\circ
=\sin30^\circ+\sin15^\circ.
$$

To compute without tables,
$\sin15^\circ=\sin(45^\circ-30^\circ)=(\sqrt6-\sqrt2)/4$.
Therefore the exact value is

$$
\frac12+\frac{\sqrt6-\sqrt2}{4}
=\frac{2+\sqrt6-\sqrt2}{4}.
$$

## 279

$$
\cos45^\circ\cos15^\circ
=\frac12[\cos60^\circ+\cos30^\circ]
=\frac{1+\sqrt3}{4}.
$$

The transformed angles have standard exact values and require no tables.

## 280

The angles are $52.5^\circ$ and $7.5^\circ$; their difference is $45^\circ$
and their sum is $60^\circ$.

$$
\sin52.5^\circ\sin7.5^\circ
=\frac12[\cos45^\circ-\cos60^\circ]
=\frac{\sqrt2-1}{4}.
$$

## 281

$$
\sin\frac{\pi}{4}\sin\frac{\pi}{12}
=\frac12\left[\cos\frac{\pi}{6}-\cos\frac{\pi}{3}\right]
=\frac{\sqrt3-1}{4}.
$$

The cosine arguments are standard exact angles.

## 282

$$
\cos\frac{\pi}{12}\cos\frac{\pi}{4}
=\frac12\left[\cos\frac{\pi}{3}+\cos\left(-\frac{\pi}{6}\right)\right]
=\frac12\left[\cos\frac{\pi}{3}+\cos\frac{\pi}{6}\right]
=\frac{1+\sqrt3}{4}.
$$

This is the same product as source 279, with its factors reversed and its
angles expressed in radians. This equivalence is a source-only observation,
not a conclusion about any undisclosed candidate package.

## 283

Pair the $50^\circ$ and $70^\circ$ factors:

$$
2\cos50^\circ\cos70^\circ
=\cos120^\circ+\cos(-20^\circ)
=-\frac12+\cos20^\circ.
$$

Hence

$$
8\cos10^\circ\cos50^\circ\cos70^\circ
=-2\cos10^\circ+4\cos10^\circ\cos20^\circ
$$
$$
=-2\cos10^\circ+2[\cos30^\circ+\cos(-10^\circ)]
=2\cos30^\circ=\sqrt3.
$$

The cancellation supplies an exact computation without tables.

## 284

Taking equal arguments in the cosine product formula gives
$2\cos^2x=\cos2x+\cos0$, so

$$
2\cos^2x=1+\cos2x.
$$

There are no squared trigonometric factors on the right.

## 285

With $t=2x$, $2\sin^2t=1-\cos2t$, giving

$$
2\sin^2 2x=1-\cos4x.
$$

The argument doubles from $2x$ to $4x$, not to $2x$.

## 286

Reduce the first square, then the square created by multiplication:

$$
2\cos^2x\cos2x=(1+\cos2x)\cos2x
=\cos2x+\cos^2 2x
$$
$$
=\frac12+\cos2x+\frac12\cos4x.
$$

Stopping at $\cos2x+\cos^2 2x$ would leave a squared factor unreduced.

## 287

Since $2\sin x\cos x=\sin2x$,

$$
\cos^2x\sin^2x=\frac14\sin^2 2x
=\frac18(1-\cos4x).
$$

Both original squares are eliminated.

## 288

$$
\sin^2 6x=\frac12(1-\cos12x).
$$

This follows from the sine-square identity with $t=6x$.

## 289

$$
\cos^2 4x=\frac12(1+\cos8x).
$$

This follows from the cosine-square identity with $t=4x$.
All identities in 284-289 hold for every real $x$.

## 290

Start from the left-hand side and apply the sine product formula:

$$
2\sin4x\sin2x+\cos6x
=[\cos(4x-2x)-\cos(4x+2x)]+\cos6x
$$
$$
=\cos2x-\cos6x+\cos6x=\cos2x.
$$

This proves the numbered identity for every real $x$, without assuming it or
dividing by a potentially zero trigonometric expression.

## 291

Independently reduce the left-hand side, not the supplied right-hand side:

$$
\sin^3x\cos^2x=\sin x(\sin^2x\cos^2x)
=\frac18\sin x(1-\cos4x)
$$
$$
=\frac18\sin x-\frac18\sin x\cos4x
=\frac18\sin x-\frac1{16}[\sin5x+\sin(-3x)]
$$
$$
=\frac18\sin x-\frac1{16}\sin5x+\frac1{16}\sin3x.
$$

This establishes the printed target for every real $x$.
The positive $\sin3x$ coefficient comes from $\sin(-3x)=-\sin3x$.

## 292

Transform $\sin5x\cos3x$ first:

$$
\sin5x\cos3x\cos6x
=\frac12(\sin8x+\sin2x)\cos6x
$$
$$
=\frac14[\sin14x+\sin2x+\sin8x+\sin(-4x)]
$$
$$
=\frac14(\sin14x+\sin2x+\sin8x-\sin4x).
$$

This proves the printed identity for every real $x$.
The final negative term is obtained from the difference $2x-6x=-4x$.

## 293

The equality does hold. To establish it exactly, first calculate

$$
2\sin40^\circ\sin80^\circ
=\cos(-40^\circ)-\cos120^\circ
=\cos40^\circ+\frac12.
$$

Consequently,

$$
4\sin20^\circ\sin40^\circ\sin80^\circ
=2\sin20^\circ\left(\cos40^\circ+\frac12\right)
$$
$$
=\sin60^\circ+\sin(-20^\circ)+\sin20^\circ
=\sin60^\circ.
$$

Multiply by $\sin60^\circ/4$:

$$
\sin20^\circ\sin40^\circ\sin60^\circ\sin80^\circ
=\frac14\sin^2 60^\circ
=\frac14\left(\frac{\sqrt3}{2}\right)^2
=\frac3{16}.
$$

This gives a derivation of the yes/no conclusion, not numerical agreement or
an assumption that the stated equality is already proven.

## Stage Boundary

All 28 unsolved tasks 266-293 have independent concrete solutions above.
The source transformations, exact results, and proof obligations are frozen
before candidate access. There are no omissions or unresolved source inputs.
Candidate task fidelity, redundancy, leakage, true option sets, author-key
comparison, and package coverage have not yet been assessed.

Wait for Parent's explicit VIEW-ONLY Stage2 disclosure. Do not proactively
locate or open candidates or author internals. Do not rewrite this frozen
source-first document in response to a candidate. Later image access, if any,
remains subject to the stated permanent limits: at most 8 per batch,
24 per context, zero reopens; Parent's image24 budget is exhausted.
