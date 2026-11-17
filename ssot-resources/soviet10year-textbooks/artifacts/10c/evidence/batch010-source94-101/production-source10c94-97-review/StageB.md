# StageB: source-versus-author comparison

STEMROBIN-184, 10c physical 0094-0097 / printed 88-91. Date: 2026-11-17.

Comparison complete for all 53 disclosed blocks. No authored formula/sign/domain transcription error remains identified. This is NOT finalize, acceptance, assembly, publication, or whole-lesson closure.

The frozen StageA `source-first.md`, `imageledger.json`, and `freeze.sha256` are unchanged. StageB records the higher-resolution correction separately, rather than rewriting the independent first pass. Inputs and crop hashes are in `imageledger-stageb.json`.

## Findings and exact suggestions

1. **Exercise 330: author PLUS is correct; reviewer StageA MINUS is superseded.** New native crop, allocation 5, rectangle `[200,1260,800,160]`, shows a vertical stroke crossing the denominator's horizontal stroke:
   $\frac{\sin\alpha+\sin3\alpha}{\cos\alpha+\cos3\alpha}=\operatorname{tg}2\alpha$.
   Keep `p0097#8` and the author's plus-sign note unchanged. Do NOT add an erratum or change this denominator to minus. StageA's derived cotangent claim, counterexample, and minus-based task-330 domain qualification must not be used downstream. The correct common domain requires $\cos\alpha+\cos3\alpha\ne0$ and $\cos2\alpha\ne0$, equivalently $\cos\alpha\ne0$ and $\cos2\alpha\ne0$. This domain qualification is reviewer-derived, not printed task text.
2. **p94: 23 actual printed rows, versus one extra noncontent raw band.** There are 22 content rows plus the footer row. The validated new bottom crop, allocation 7, rectangle `[0,2350,1695,230]`, shows only sparse scan specks and a broken edge trace, with no text, equation, task, caption, figure, or footer. The supplied extra band `y=2487..2492` lies wholly inside this noncontent margin. It is a `scan-artifact`, not an intentional separator. Exact admissible count-only exclusion:

```json
{
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [0, 2487, 1695, 6],
      "reason": "Broken scan-edge trace in the unprinted lower margin, independently inspected in native crop [0,2350,1695,230]; no content or footer lies in y2487..2492."
    }
  ]
}
```

The box uses zero-based `[x,y,width,height]` and excludes only rows 2487 through 2492, not the footer band 2263-2292. Dark pixels within that strip have measured bounding box `[1399,2487,232,6]`; the full-width six-row strip also covers faint peripheral noise in the same independently observed noncontent band. This is not permission to erase ink, change text, pad lines, or assign a desired count. If Parent adopts the exclusion, update p94's note that currently says no counting exclusion was used. No exclusion was applied here and no counter/finalize was rerun; final mechanical reconciliation remains unclaimed.

3. **Owner boundaries are mandatory.** n94 Example 5 comprises `p0094#2` through `p0094#11`, including task (2), the zero-function/division rationale, the reduced quadratic, and BOTH final solution families. It closes before the separate homogeneous-equation follow-up `p0094#12 open -> p0095#1 cont`, which also belongs to n94. Do not treat Example 5 as a new unit or attach its solution to n95.
4. **n95 identity (3) is one whole worked-example owner.** Keep `p0096#6 open -> p0097#1 cont` together under n95. The domain sentence excluding $\alpha=\pm\frac{\pi}{4}+\pi n$ is part of that example, not a separate exercise, answer, or new section. The example is complete only after “实数集上成立。” Equation labels (1)-(3) are local prose equation tags, not numbered exercises.
5. **Literal numbering and outer right boundary stay unchanged.** `p0097#5 -> #6 -> #7` prints `327 -> 323 -> 329`; do not repair 323 to 328 merely to make numbering continuous. Distinguish this n95 task from n94 exercise 323 by its existing owner context. Task 334 is complete; the n95 exercise group and whole n95 owner remain **OPEN / right boundary unproven until independent physical-98 boundary evidence**. No next-unit heading or explicit group termination is visible on 0097.

## Every-block comparison

Rows below are physical printed-row contributions, including footers. `samerow` contributes zero additional rows, not zero content. The source-first row inventory is authoritative; draft parsing was used only to compare the disclosed structure, not as a pipeline acceptance check. Source R/Z versus draft `\mathbb{R}`/`\mathbb{Z}` is typesetting, not a changed domain. Chinese punctuation is outside mathematical regions as required.

### Physical 0094: 13 blocks / 23 rows

| Block | Rows | Compared source content and outcome |
| --- | ---: | --- |
| #1 `p cont` | 3 | Incoming Example 4: tg=2, arctg2+pi n, approximate 1.11+pi n; tg=1, pi/4+pi k; integer parameters. Matches; tail only, no invented incoming task. |
| #2 `p` | 2 | Example 5 heading and $3\sin^2x-4\sin x\cos x+\cos^2x=0$, tag (2). All signs/powers match. |
| #3 `p` | 2 | Half-angle tangent / biquadratic alternative and simpler solution prose. Matches both printed rows. |
| #4 `p` | 6 | y=sin x, z=cos x; quadratic homogeneity; neither zero branch is a solution; divide cos squared or sin squared; equivalent equation (2). Matches, complete rationale retained. |
| #5 `p` | 1 | $3\operatorname{tg}^2x-4\operatorname{tg}x+1=0$. Matches. |
| #6 `p` | 1 | 由此得. Matches. |
| #7 `p` | 1 | tg x=1 or tg x=1/3. Matches. |
| #8 `p` | 1 | 于是. Matches. |
| #9 `p` | 1 | x=pi/4+pi n, n integer. Matches. |
| #10 `p` | 1 | 或. Matches; not a separate owner. |
| #11 `p` | 1 | x=arctg(1/3)+pi n, n integer. Matches; Example 5 closes. |
| #12 `p open` | 2 | sin x+2cos x=0; cubic sin cubed +2sin squared cos -3sin cos squared +2cos cubed. Matches every term; open math region continues to 0095, no =0 invented here. |
| #13 `foot` | 1 | Printed 88 with surrounding dots. Matches; do not exclude. |

### Physical 0095: 20 blocks / 20 rows

| Block | Rows | Compared source content and outcome |
| --- | ---: | --- |
| #1 `p cont` | 4 | Leading =0 closes the cubic; division by first/third power of cos or sin; substitute y for tg/ctg. Matches and closes 0094#12. |
| #2 `exhead` | 2 | 习题 / 解方程. Matches; n94 owner. |
| #3 `ex 310` | 1 | $1+\cos x+\cos2x=0$. Matches. |
| #4 `ex 311` | 1 | $3-\cos^2x-3\sin x=0$. Matches both minus signs. |
| #5 `ex 312 samerow` | 0 | $4\sin x=4-\cos^2x$. Matches; shares 311's row. |
| #6 `ex 313` | 1 | tg x+ctg x=$2\frac12$. Matches mixed number, not product. |
| #7 `ex 314 samerow` | 0 | cos(x/2)=1+cos x. Matches; shares 313's row. |
| #8 `ex 315` | 1 | tg x-tg(pi/2-x)=1. Matches both minus signs. |
| #9 `ex 316 samerow` | 0 | 5cos x+12sin x=13. Matches; shares 315's row. |
| #10 `ex 317` | 1 | sin x-sin2x=0. Matches. |
| #11 `ex 318 samerow` | 0 | 1-cos x=2sin(x/2). Matches; shares 317's row. |
| #12 `ex 319` | 1 | 1+cos x=2cos(x/2). Matches. |
| #13 `ex 320 samerow` | 0 | cos2x=$2\frac13$ sin x. Matches mixed coefficient; shares 319's row. |
| #14 `ex 321` | 1 | sqrt(3)sin x-cos x=0. Matches. |
| #15 `ex 322 samerow` | 0 | cos x+sin x=0. Matches; shares 321's row. |
| #16 `ex 323` | 1 | cos squared x-3sin x cos x=-1. Matches. |
| #17 `ex 324` | 1 | 3cos squared x=4sin x cos x-sin squared x. Matches equality and minus. |
| #18 `h3` | 1 | 95. 证明三角恒等式. Matches; closes preceding n94 exercise group and starts n95. |
| #19 `p open` | 3 | Proof-method introduction, ending “也可以分别使”. Matches; open to 0096#1. |
| #20 `foot` | 1 | Printed 89 with dots. Matches. |

### Physical 0096: 7 blocks / 22 rows

| Block | Rows | Compared source content and outcome |
| --- | ---: | --- |
| #1 `p cont` | 1 | “两边变形，使它们化为同一个式子。” Matches; closes 0095#19. |
| #2 `p` | 5 | Identity-on-a-set explanation; sin squared alpha+cos squared alpha=1 (1), whole R, alpha in ]-infinity,infinity[. Matches interval endpoints/brackets. |
| #3 `p` | 2 | Double-angle tangent formula $2\operatorname{tg}\alpha/(1-\operatorname{tg}^2\alpha)$ (2). Matches minus and square. |
| #4 `p` | 7 | Exclusions pi/2+pi n and pi/4+pi k/2; tg squared=1, tg=+1/-1; later pi/4+pi m and -pi/4+pi p, m,p integers; already-excluded explanation. All signs/parameters match. Exactly one `↵` at the printed pi/4+ wrap accounts for the seventh row. |
| #5 `p` | 3 | Cancellation-factor-zero domain rule. Matches; not an exercise and not a new owner. |
| #6 `p open` | 3 | Identity (3), $(\cos^4\alpha-\sin^4\alpha)/(\cos^2\alpha-\sin^2\alpha)=1$; cancellation factor and trailing “因此，”. Matches both minuses/powers; open to 0097#1. |
| #7 `foot` | 1 | Printed 90 with dots. Matches. |

### Physical 0097: 13 blocks / 14 rows

| Block | Rows | Compared source content and outcome |
| --- | ---: | --- |
| #1 `p cont` | 2 | Identity (3) excludes alpha=+/-pi/4+pi n, n integer; “实数集上成立。” Matches; closes WHOLE worked example from 0096#6. |
| #2 `exhead` | 2 | 习题 / 证明恒等式. Matches. |
| #3 `ex 325` | 1 | sin alpha/(1+cos alpha)=(1-cos alpha)/sin alpha. Matches all signs. |
| #4 `ex 326 samerow` | 0 | (sin alpha+tg alpha)/(1+cos alpha)=tg alpha. Matches; shares 325's row. |
| #5 `ex 327` | 1 | (cos alpha+sin alpha)/(cos alpha-sin alpha)=tg(alpha+pi/4). Matches. |
| #6 `ex 323` | 1 | Literal 323; cos alpha/(1+sin alpha)=tg(pi/4-alpha/2). Matches label and both argument fractions/signs; expected sequence position 328 is not a source correction. |
| #7 `ex 329` | 1 | tg(pi/4+x/2)-tg(pi/4-x/2)=2tg x. Matches. |
| #8 `ex 330` | 1 | (sin alpha+sin3alpha)/(cos alpha+cos3alpha)=tg2alpha. Author matches allocation-5 native pixels; StageA minus reading superseded. |
| #9 `ex 331` | 1 | sin(x-pi)tg(x-pi/2) over cos(3pi/2+x)ctg(pi-x)=-1. All function names, signs, arguments, denominator factors match; one tall printed row. |
| #10 `ex 332` | 1 | cos x tg(pi+x)tg(3pi/2-x) times reciprocal sin(pi/2-x)=1. All four factors/signs match; one tall printed row. |
| #11 `ex 333` | 1 | cos squared(alpha-3pi/2)/sin(alpha-pi)=cos(pi/2+alpha). Matches square, arguments, signs; one tall printed row. |
| #12 `ex 334` | 1 | sin squared(alpha-630 degrees)/(1+sin(-alpha))=1+cos(alpha-90 degrees). Matches 630/90, degrees, powers, signs; statement complete. |
| #13 `foot` | 1 | Printed 91 with dots; uncertain nearby fine trace remains note-only, not mathematics. Matches. |

No figure/table/caption blocks or references occur on any page. The four declared render hashes match the original StageA source identities; the four draft hashes match the disclosed `SHA256SUMS`. Only the authorized four drafts and handoff/ledger/checksum text were read; no author crop image, answers, choices, page.json, audit, layout file, or other page was read.

## Image-handling exception and final scope

Allocation 6 was intended to be the requested native bottom crop. `sips` silently emitted the full 1695x2580 original instead of 1695x230, and it was viewed before dimension validation. Its bytes equal the original p94 hash. This was an unintended full-page reopen and violates the requested no-reopen constraint; it is explicitly counted, not hidden or treated as freed history.

Allocation 7 is a genuinely new exact `[0,2350,1695,230]` crop made from the source with Pillow, checked as 1695x230 BEFORE viewing, without resampling or altering source pixels. Allocation 5's exact source-rectangle RGB equality was also checked. Final permanent usage: **7/8 batch, 7/24 context: initial four originals + two genuine new targeted crops + one unintended reopen.** Allocation 8 is unused; no additional images will be loaded for this review.

Only owned review artifacts/crops were written. The malformed allocation-6 file is retained solely for the honest ledger and must not be opened by Parent. No author draft, source image, or StageA frozen file was changed. No finalize, gates, binders, renders, tests, pipeline reruns, DB, publishing, app, Git, dependency, schema, Charter, or global workflow was run.

Source comparison is complete; p94's count-only metadata repair is proposed, not applied. n95 remains OPEN. Return text report/ledger paths and hashes only, then WAIT.
