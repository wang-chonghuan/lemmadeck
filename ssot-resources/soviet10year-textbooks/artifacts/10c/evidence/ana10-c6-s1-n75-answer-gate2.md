# 10c Unit75 Independent Answer Gate2

2026-11-15. Reviewer: parent Codex, independent of answer author Ptolemy.
Status: **PASS** for the observed draft, with mechanical finalization still
required before durable readiness. No publisher or database operation.

The reviewer solved all14 modern written exercises before opening the author
draft, freezing the calculations in
`tmp/ana10-c6-s1-n75-answer-source-first.md`. The subsequent comparison and
identity/grading assertions were completed once before this record was written;
this record does not claim a second mathematical review.

Approved raw answer draft SHA-256:
`2d28507052b5f106d566cbe383f21f90cee98d5e1e41c4855b0eec082566e703`.
Observed modern exercises SHA-256:
`d6f2aa276b9453328009fa3b47205dfa811926f5c8afcc59206da3c373bcb279`.
Observed modern lesson SHA-256:
`7ce0c65b8ac087f79a7892357d1dce2f0948ace3e986c1bd7ce0a2053d400cb5`.

## Substantive Comparison

| Exercise | Comparison with independent source-first solution |
| --- | --- |
|1|`3cos(3x)` agrees; the inner derivative3 is retained.|
|2|`(1/2)cos(x/2+pi)` agrees, including the phase shift and factor1/2.|
|3|`-sin x` agrees; the inner derivative-1 is not lost.|
|4|`12sin(2x-1)cos(2x-1)=6sin(4x-2)` agrees; both chain factors and the outer coefficient are present.|
|5|The sine difference identity gives `sin t`, hence derivative `cos t`; key and visible argument agree.|
|6|The given function is identically0, so its derivative is the numeric0.|
|7|The given function is identically5, so its derivative is0, not5.|
|8|`2cos(2x-3.5)+2cos(2x)` agrees; exact `7/2` in the key is equivalent to3.5, not a numerical approximation.|
|9|`2+18sin^4 x cos x` agrees; both the negative inner derivative and the cosine phase sign are correctly handled.|
|10|The given function is `-sin(2u)`, hence `-2cos(2u)`; the variable and derivative factor agree.|
|11|`2-cos x>=1` establishes strict increase. The visible mean-value proof is complete and the task remains ungraded.|
|12|Derivative zeros are exactly `2pi k`. The proof first establishes nondecrease, then excludes constant intervals using the discrete zero set; it does not infer strictness from a nonnegative derivative alone. The displayed base-segment coordinates, slopes, curvature, all inflections, translation rule, unique zero, range and absence of extrema agree.|
|13|The global derivative-sign intervals, all local extreme coordinates and heights, three and only three roots, signs, oddness, range, inflections, nonperiodicity and graph continuation agree. The positive root is defined exactly by its unique-root equation; the independently checked decimal and extreme height are approximate plotting aids only. `y=x` is correctly not claimed as an asymptote.|
|14|`2cos(2x-5)-3<=-1` and the mean-value argument establish strict decrease on the complete specified real interval.|

## Gate2 Boundaries

All14 exercise identities, order and prompts agree with the allowed modern
snapshot. Every `figureEvidence` array is empty, consistently with the actual
exercise figure references; the body figure1 is not required for these tasks.
Every answer is derived; no unavailable book-back answer or `bookRaw` is
invented. Exercises1--10 have one independently verified derivative part each:
eight expression keys and two numeric keys. Exercises11--14 correctly retain
empty parts and ungraded proof, construction or discussion.

The graph tasks have concrete standard construction coordinates, slopes,
curvature and full-domain continuation, satisfying Gate2's requirement for a
key method or reason. They do not claim that a choice or numeric entry draws a
graph, nor depend on a nonexistent answer image.

No answer repair was necessary. The existing author structural check and the
reviewer's exact identity/grading assertions passed. ComputeEngine checking,
answer finalize and offline display remain separate pending pipeline actions.
There are no exact keys, so no MathLive exact-key transaction is claimed.

## Subsequent Pipeline Evidence

The current modern adaptation passed after template-only Latin marker,
sentence-layout, boundary and approved figure-path completion. All14
ordered exercise semantic objects were asserted deep-equal to the
original reviewed modern snapshot; no answer/source math changed.
The approved answer draft was copied byte-identically into the durable
lesson. One actual answer finalize passed auto10/ungraded4. No exact
keys were present. The once-only offline text/written display check
passed1440x960 and390x844,17 paragraphs/14 exercises; all four full
screenshots were actually opened. Long formula containers were
separately checked for end reachability without splitting their
mathematical expressions. These are offline artifacts, not production
publication or live product judging.
