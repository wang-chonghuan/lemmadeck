# NEW N44 standard-answer review: semantic PASS

Candidate: n44-answer-author/work/9-10g/modern-us-neutral/lessons/
geo910-c2-s1-n44/answer-keys.template.json.
Raw SHA-256: 079c1a2d9ce935ca02b0e10438eb24f9158787391deaa21459952f2173e77173.
Only opened after the choice review and its seal persisted. No old answers,
current core key, history or author reports read. The seven already-sealed FIRST
solutions were reused; independent solve count stays one per source exercise.

## All Display Answers

| Exercise | Verdict | Independent semantic evidence |
| --- | --- | --- |
| 16 | PASS | Concrete signed construction paths for all A,B,D,E,G agree with FIRST. E in Oyz; G on negative Oz. Correctly ungraded. |
| 17 | PASS | Both ordered Q-P triples: (-3,5,-3),(-11/10,4/3,-1/6). Signs and fractions preserved. |
| 18 | PASS | Projection (0,-3,1); OB=sqrt(10), not AB or squared length. Length unit clear. |
| 19 | PASS | Entire real t; squared distances yield unique t=1, point (0,1,0), distances 3. |
| 20 | PASS | Both full medians sqrt(62)/2,sqrt(53)/2, centroid distance sqrt(182)/3, and all internal angles including obtuse C retained. Cross product (-2,4,-3) confirms nondegeneracy. |
| 21 | PASS | Exactly all three opposite-known-pair completions; paired lengths (sqrt(33),sqrt(105)),(sqrt(59),3sqrt(3)),(sqrt(10),sqrt(174)). No unannounced vertex ordering. Correctly ungraded for the unordered case set. |
| 22 | PASS | Opposite-side equalities and nonzero cross product prove the parallelogram. Common midpoint, diagonal dot 63 and squared norms 113,57 give labelled AXB/CXD=38.2803 degrees and BXC/DXA=141.7197 degrees. Smaller-line-angle convention stated conditionally. Correctly ungraded for proof plus angles. |

The answer candidate's "全部交角" labels the four cross-diagonal intersection
sectors, unlike the choice stem's unrestricted "all angles of four endpoint
rays." It does not ask for every unordered pair of rays or silently remove an
original source subtask. No analogous answer defect is found.

## All 10 Expected Parts

| Exercise / Part | Judge | Semantic Verdict | Evidence |
| --- | --- | --- | --- |
| 17 / 1 | exact | PASS | Complete signed triple (-3,5,-3) equals FIRST Q-P. |
| 17 / 2 | exact | PASS | Complete fractional triple (-11/10,4/3,-1/6) equals FIRST Q-P. |
| 18 / 1 | numeric | PASS | Positive sqrt(10); squared norm 10. |
| 19 / 1 | exact | PASS | Full point (0,1,0); not just its y component. |
| 20 / 1 | numeric | PASS | AA1 positive sqrt(62)/2 from squared norm 62/4. |
| 20 / 2 | numeric | PASS | BB1 positive sqrt(53)/2 from squared norm 53/4. |
| 20 / 3 | numeric | PASS | OT positive sqrt(182)/3 from squared norm 182/9. |
| 20 / 4 | numeric | PASS | (180/pi)arccos(14/15)=21.0394697813 degrees. |
| 20 / 5 | numeric | PASS | (180/pi)arccos(11/(5sqrt(6)))=26.0845415520 degrees. |
| 20 / 6 | numeric | PASS | (180/pi)arccos(-5/(3sqrt(6)))=132.8759886666 degrees, not acute supplement. |

Tuple labels specify full (x,y,z). Length units are coordinate units. Angle
labels explicitly require degrees, expected formulas convert radians to degrees,
and tolerance 0.01 degrees supports the displayed approximations. Each numeric
formula denotes a finite real value; all arccos inputs are strictly between
-1 and 1. This is mathematical reasoning against FIRST, not expected/display
self-string comparison or a claim that the product parser/editor was executed.

Source identities/prompts match current exercise 16-22, sourceNumber and g1.
All seven source fields are derived; no bookRaw invented. The named
9-10g/answers.json does not exist (existence checked only, no old answer opened).
Exactly 4 auto / 3 ungraded; 3 exact / 7 numeric parts; no duplicate or missing
exercise or requested auto-answer quantity.

## Findings and Pending Gates

Answer semantic findings: none; repairs used: 0.
No new source/figure/text/surface acceptance pass is claimed. Candidate exercise
figureEvidence entries are empty; its note about the author's figure-8 inspection
is inherited provenance, not evidence that this reviewer opened figure 8.
This reviewer actually opened only the two SVG-bound source concept previews
already recorded with FIRST. No original PNG or FigureSpec reopened.

PENDING parent: real MathLive keyboard-edit/reserialization checks for all three
exact values, parser/judging checks and lesson_answers finalize, and any subsequent
authorized integration. MathLive attempts by this reviewer: 0; no semantic PASS
claim for an unrun MathLive gate. No validator with review/finalize/publish run.

The separate choice package is REVISE for CHOICE-01; the standard-answer semantic
PASS does not waive it. Parent may repair that one affected choice unit later.
