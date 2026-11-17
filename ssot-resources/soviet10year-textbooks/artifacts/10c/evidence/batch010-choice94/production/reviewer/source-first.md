# STEMROBIN-184 Independent Source-First Freeze

## Scope And Status

- Invocation: production-choice10c94; lesson: ana10-c6-s4-n94; book: 10c.
- Role: independent choice reviewer, Stage1 ONLY.
- Date: 2026-11-17.
- Status: all 15 selected written equations independently solved; source-first record frozen before author disclosure.
- Sole mathematical input: the already-prepared `../seed.json`, reproduced byte-for-byte in the final fenced block below. No preparation was repeated.
- Procedural rules read: current `.agents/skills/ld-s10y-choice/SKILL.md`, `references/review.md`, and `references/contract.md`. The repository session-entry readme was also read; it supplied no mathematical input.
- No book answers, author solutions, keys, intents, drafts, visible questions, previous choices, old ticket outputs, source images, or other worked prose were opened.
- No candidate approval, coverage verdict, semantic gate outcome, or formal candidate review is issued by this record.
- No browser, tests, finalizer, DB, environment, publishing, application, dependency, schema, Charter, Git, workflow initialization, SkillHost, grill, or other-chat messaging actions were performed.
- Image usage: 0 opened in this Stage1; reported incoming usage 0; no reset. Limits remain permanent 8, batch 24, plus the existing context limit. Two later view screenshots remain undisclosed.
- Next state: WAIT for explicit Stage2 visible-only disclosure. Do not autonomously inspect author material.

## Snapshot Binding

Seed path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94/seed.json`

- Raw bytes: 2862, UTF-8, ending in one LF.
- Raw seed SHA-256: `52df395359f23509b7c706ca07a0151db9a7fe3cb3360584e109b945d8c8966c`.
- Canonical seed SHA-256: `598d5321a199d9f7e0cc424b1a5394b595976399d0c6f7431d476263bd9654d0`.
- Canonicalization: `json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")`.
- Selected source numbers, in seed order: 310 through 324 inclusive.
- Concepts: `[]`. Figures: `[]`. Every exercise's `figure_ids`: `[]`.
- Seed `trace` hashes are retained as supplied provenance only. Their files were not opened, refreshed, or treated as additional mathematical input.
- Individual exercise-object canonical digests and exact exercise snapshots are also frozen in `ledger.md`.

## Conventions And Completeness

In every solution below, x is real, angles are radians, and k independently ranges over all integers in each displayed family. There is no finite interval in the supplied input; none is introduced. A finite set of principal angles is never substituted for the full solution set.

`tg` means tangent and `ctg` means cotangent. Source 313's mixed number is 5/2, not a product. Source 320's mixed number is 7/3, not a product. These are the explicit invocation conventions. `arcsin` is the principal inverse in [-pi/2, pi/2]; `arctan` is the principal inverse in (-pi/2, pi/2).

All expressions have domain R except 313 and 315, whose original domain is
`R \ {k*pi/2 : k in Z}`. Division by a potentially zero trigonometric factor is justified explicitly or avoided. Polynomial roots outside [-1,1] are rejected when representing sine or cosine. Every retained branch satisfies the original, unsquared equation.

## Independent Full Solutions

### 310

Source: `1 + cos(x) + cos(2x) = 0`.

Domain: R. Put c = cos(x), so c is in [-1,1]. The identity cos(2x) = 2c^2 - 1 gives the reversible reduction
`1 + c + 2c^2 - 1 = c(2c + 1) = 0`.
Thus c = 0 or c = -1/2; both are admissible.

Complete solution:
`x = pi/2 + k*pi`, or
`x = 2*pi/3 + 2*k*pi`, or
`x = 4*pi/3 + 2*k*pi`.

For c = 0, cos(2x) = -1, so the original left side is 0. For c = -1/2, cos(2x) = -1/2, again giving 0. The factorization exhausts possible cosine values and the families exhaust their inverse images.

### 311

Source: `3 - cos(x)^2 - 3*sin(x) = 0`.

Domain: R. Put s = sin(x), with s in [-1,1]. Since cos(x)^2 = 1 - s^2, the equation is equivalent to
`s^2 - 3s + 2 = (s - 1)(s - 2) = 0`.
Reject s = 2 because no real angle has that sine. Retain s = 1.

Complete solution:
`x = pi/2 + 2*k*pi`.

At these angles cos(x) = 0 and sin(x) = 1; the original left side is `3 - 0 - 3 = 0`. No second real branch survives the sine-range condition.

### 312

Source: `4*sin(x) = 4 - cos(x)^2`.

Domain: R. Put s = sin(x), with s in [-1,1]. The original equation is equivalent to
`4s = 3 + s^2`, hence
`s^2 - 4s + 3 = (s - 1)(s - 3) = 0`.
Reject s = 3; retain s = 1.

Complete solution:
`x = pi/2 + 2*k*pi`.

Substitution gives `4 = 4 - 0`. The solution set equals 311's, but this is a separately derived equation with a different inadmissible polynomial root.

### 313

Exact mixed-number interpretation: `tan(x) + cot(x) = 5/2`.

Original domain: sin(x) and cos(x) must both be nonzero, so
`x notin {k*pi/2 : k in Z}`.
On this domain put t = tan(x), where t is finite and nonzero and cot(x) = 1/t. Multiplication by 2t is reversible:
`t + 1/t = 5/2`
iff `2t^2 - 5t + 2 = (2t - 1)(t - 2) = 0`.
Thus t = 1/2 or t = 2. Both are nonzero and finite.

Complete solution:
`x = arctan(1/2) + k*pi`, or
`x = arctan(2) + k*pi`.

Neither family meets the excluded domain points. Their sums are respectively `1/2 + 2` and `2 + 1/2`, both 5/2.

Independent equivalent form: the sum is `1/(sin(x)*cos(x))`, so the equation is equivalent on its domain to `sin(2x) = 4/5`. If a = arcsin(4/5), the same full solution set is
`x = a/2 + k*pi` or `x = (pi - a)/2 + k*pi`.
Both double-angle branches are necessary; no finite interval is assumed.

### 314

Source: `cos(x/2) = 1 + cos(x)`.

Domain: R. Put u = cos(x/2), with u in [-1,1]. Since `1 + cos(x) = 2u^2`, the equation is equivalent to
`u = 2u^2`, or `u(2u - 1) = 0`.
Thus u = 0 or u = 1/2. No division by u is used.

Complete solution:
`x = pi + 2*k*pi`, or
`x = 2*pi/3 + 4*k*pi`, or
`x = -2*pi/3 + 4*k*pi`.

At u = 0 both sides of the original equation are 0. At u = 1/2 both sides are 1/2. The half-angle branches for u = 1/2 have period 4*pi in x; replacing them with 2*pi families would introduce u = -1/2, which fails the original equation.

### 315

Source: `tan(x) - tan(pi/2 - x) = 1`.

Original domain: tan(x) requires cos(x) != 0, and tan(pi/2 - x) requires sin(x) != 0. Hence
`x notin {k*pi/2 : k in Z}`.
On this domain `tan(pi/2 - x) = cot(x)`. Put t = tan(x), finite and nonzero. The equation is reversibly equivalent to
`t - 1/t = 1`
iff `t^2 - t - 1 = 0`.
Thus `t = (1 + sqrt(5))/2` or `t = (1 - sqrt(5))/2`.

Complete solution:
`x = arctan((1 + sqrt(5))/2) + k*pi`, or
`x = arctan((1 - sqrt(5))/2) + k*pi`.

Both roots are finite and nonzero, so all displayed angles are in the original domain. Dividing `t^2 - t - 1 = 0` by t verifies `t - 1/t = 1` for both roots.

Equivalent compressed family:
`x = arctan((1 + sqrt(5))/2) + k*pi/2`.
The negative root is the negative reciprocal of the positive root, and its principal arctangent is the positive root's arctangent minus pi/2. Thus the compressed family contains exactly both tangent branches, not just the positive branch.

### 316

Source: `5*cos(x) + 12*sin(x) = 13`.

Domain: R. Let b = arctan(12/5), so b is in (0,pi/2), cos(b) = 5/13, and sin(b) = 12/13. Then
`5*cos(x) + 12*sin(x) = 13*cos(x - b)`.
The original equation is equivalent to `cos(x - b) = 1`.

Complete solution:
`x = arctan(12/5) + 2*k*pi`.

For this family cos(x) = 5/13 and sin(x) = 12/13, so the left side is `(25 + 144)/13 = 13`. It is the positive equality case of the amplitude bound; the opposite vector gives -13 and is not a solution. No squaring or sign loss is used.

### 317

Source: `sin(x) - sin(2x) = 0`.

Domain: R. The double-angle identity gives the reversible factorization
`sin(x)*(1 - 2*cos(x)) = 0`.
Thus sin(x) = 0 or cos(x) = 1/2. Division by sin(x) would lose a whole branch and is not used.

Complete solution:
`x = k*pi`, or
`x = pi/3 + 2*k*pi`, or
`x = -pi/3 + 2*k*pi`.

The first family makes both sine terms zero. In the other two, sin(2x) = 2*sin(x)*(1/2) = sin(x). These factors account for all real solutions.

### 318

Source: `1 - cos(x) = 2*sin(x/2)`.

Domain: R. Put u = sin(x/2), with u in [-1,1]. The identity `1 - cos(x) = 2u^2` gives
`2u^2 = 2u`, equivalently `u(u - 1) = 0`.
Thus u = 0 or u = 1; no division or squaring is needed.

Complete solution:
`x = 2*k*pi`, or
`x = pi + 4*k*pi`.

The first family gives 0 = 0, and the second gives 2 = 2. The value u = -1 is not allowed by the original equation: x = 3*pi gives 2 = -2, which is false. In particular, the second family must not be broadened to all odd multiples of pi. The union has period 4*pi.

### 319

Source: `1 + cos(x) = 2*cos(x/2)`.

Domain: R. Put u = cos(x/2), with u in [-1,1]. The identity `1 + cos(x) = 2u^2` gives
`2u^2 = 2u`, equivalently `u(u - 1) = 0`.
Thus u = 0 or u = 1.

Complete solution:
`x = pi + 2*k*pi`, or
`x = 4*k*pi`.

The first family gives 0 = 0 and the second gives 2 = 2. The value u = -1 fails: x = 2*pi gives 2 = -2. Replacing the second family with every even multiple of pi introduces false solutions. The union has period 4*pi and differs from both 314 and 318.

### 320

Exact mixed-number interpretation: `cos(2x) = (7/3)*sin(x)`.

Domain: R. Put s = sin(x), with s in [-1,1]. The equation is equivalent to
`1 - 2s^2 = (7/3)s`,
hence
`6s^2 + 7s - 3 = (3s - 1)(2s + 3) = 0`.
Thus s = 1/3 or s = -3/2. Reject -3/2 by the sine range.

Let a = arcsin(1/3), with a in (0,pi/2). Complete solution:
`x = a + 2*k*pi`, or
`x = pi - a + 2*k*pi`.

For either family cos(2x) = 1 - 2/9 = 7/9, and `(7/3)*sin(x) = 7/9`. The supplementary family is required; retaining only the principal inverse would be incomplete.

### 321

Source: `sqrt(3)*sin(x) - cos(x) = 0`.

Domain: R. The exact identity
`sqrt(3)*sin(x) - cos(x) = 2*sin(x - pi/6)`
makes the equation equivalent to `sin(x - pi/6) = 0`.

Complete solution:
`x = pi/6 + k*pi`.

At these angles `(cos(x), sin(x)) = ((-1)^k*sqrt(3)/2, (-1)^k/2)`, giving zero in the original expression. Alternatively, cos(x) = 0 cannot solve the original equation, so justified division gives tan(x) = 1/sqrt(3). Both descriptions retain all pi-periodic solutions.

### 322

Source: `cos(x) + sin(x) = 0`.

Domain: R. The identity
`cos(x) + sin(x) = sqrt(2)*sin(x + pi/4)`
gives `sin(x + pi/4) = 0`.

Complete solution:
`x = -pi/4 + k*pi`,
equivalently `x = 3*pi/4 + k*pi`.

In either form sin(x) = -cos(x), so the original sum vanishes. A cosine-zero angle has sine +/-1 and cannot be a solution; thus tan(x) = -1 is also a valid equivalent reduction, not an additional domain restriction on the original equation.

### 323

Source: `cos(x)^2 - 3*sin(x)*cos(x) = -1`.

Domain: R. Move -1 to the left and use `1 = sin(x)^2 + cos(x)^2`:
`2*cos(x)^2 - 3*sin(x)*cos(x) + sin(x)^2 = 0`
iff
`(sin(x) - cos(x))*(sin(x) - 2*cos(x)) = 0`.
At cos(x) = 0, the original equation is 0 = -1, so these angles are not solutions. On either factor's zero set cos(x) is nonzero, and the tangent values are 1 or 2.

Complete solution:
`x = pi/4 + k*pi`, or
`x = arctan(2) + k*pi`.

For t = tan(x), the original left side is `(1 - 3t)/(1 + t^2)`. It equals -1 for t = 1 and t = 2. Conversely, justified division gives `t^2 - 3t + 2 = 0`, with exactly these roots. No cosine-zero family is lost.

### 324

Source: `3*cos(x)^2 = 4*sin(x)*cos(x) - sin(x)^2`.

Domain: R. Move everything to one side:
`sin(x)^2 - 4*sin(x)*cos(x) + 3*cos(x)^2 = 0`
iff
`(sin(x) - cos(x))*(sin(x) - 3*cos(x)) = 0`.
At cos(x) = 0 the original equation becomes 0 = -1, so such angles do not solve it. The two factors therefore give tan(x) = 1 or tan(x) = 3.

Complete solution:
`x = pi/4 + k*pi`, or
`x = arctan(3) + k*pi`.

For t = tan(x), justified division of the original equation by cos(x)^2 gives `3 = 4t - t^2`, or `(t - 1)(t - 3) = 0`. At t = 1 the original sides are 3/2 and 3/2; at t = 3 they are 3/10 and 3/10. The pi/4 family is shared with 323, while the second family is different.

## Exact Raw Seed Snapshot

The contents inside this fence, including the final LF before the closing fence, are the exact 2862-byte input snapshot. JSON escapes are preserved rather than decoded or reformatted. This is evidence, not a newly prepared seed.

```json
{
  "schema": "s10y-choice-seed-v1",
  "source": {
    "book": "10c",
    "lesson": "ana10-c6-s4-n94",
    "concept_figure_ids": []
  },
  "exercises": [
    {
      "number": "310",
      "text": "310. $1+\\cos x+\\cos2x=0$\u3002",
      "figure_ids": []
    },
    {
      "number": "311",
      "text": "311. $3-\\cos^2x-3\\sin x=0$\u3002",
      "figure_ids": []
    },
    {
      "number": "312",
      "text": "312. $4\\sin x=4-\\cos^2x$\u3002",
      "figure_ids": []
    },
    {
      "number": "313",
      "text": "313. $\\operatorname{tg}x+\\operatorname{ctg}x=2\\frac{1}{2}$\u3002",
      "figure_ids": []
    },
    {
      "number": "314",
      "text": "314. $\\cos\\frac{x}{2}=1+\\cos x$\u3002",
      "figure_ids": []
    },
    {
      "number": "315",
      "text": "315. $\\operatorname{tg}x-\\operatorname{tg}\\left(\\frac{\\pi}{2}-x\\right)=1$\u3002",
      "figure_ids": []
    },
    {
      "number": "316",
      "text": "316. $5\\cos x+12\\sin x=13$\u3002",
      "figure_ids": []
    },
    {
      "number": "317",
      "text": "317. $\\sin x-\\sin2x=0$\u3002",
      "figure_ids": []
    },
    {
      "number": "318",
      "text": "318. $1-\\cos x=2\\sin\\frac{x}{2}$\u3002",
      "figure_ids": []
    },
    {
      "number": "319",
      "text": "319. $1+\\cos x=2\\cos\\frac{x}{2}$\u3002",
      "figure_ids": []
    },
    {
      "number": "320",
      "text": "320. $\\cos2x=2\\frac{1}{3}\\sin x$\u3002",
      "figure_ids": []
    },
    {
      "number": "321",
      "text": "321. $\\sqrt{3}\\sin x-\\cos x=0$\u3002",
      "figure_ids": []
    },
    {
      "number": "322",
      "text": "322. $\\cos x+\\sin x=0$\u3002",
      "figure_ids": []
    },
    {
      "number": "323",
      "text": "323. $\\cos^2x-3\\sin x\\cos x=-1$\u3002",
      "figure_ids": []
    },
    {
      "number": "324",
      "text": "324. $3\\cos^2x=4\\sin x\\cos x-\\sin^2x$\u3002",
      "figure_ids": []
    }
  ],
  "concepts": [],
  "figures": [],
  "trace": [
    {
      "path": "ssot-resources/soviet10year-textbooks/artifacts/10c/book.json",
      "sha256": "138c02f09ddd18d263c1046fdb4d5f55a0d1b2d03aee199379e65c1c949bb6a7"
    },
    {
      "path": "ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s4-n94/lesson.json",
      "sha256": "4e71de4dee6620c81d7dcff69d695ac29c5a00d140bf5d196c3b080c60214b33"
    },
    {
      "path": "ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s4-n94/exercises.json",
      "sha256": "7f9cb7bbdd0f9302b2a3c07c383ae32408d18071b80073838723467ca9c11324"
    },
    {
      "path": "ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s4-n94/figures.json",
      "sha256": "2cc307ac85f5003733da1d1f3c9ff666c168f88f0bcd3e96070786d170aee8c9"
    }
  ]
}
```
