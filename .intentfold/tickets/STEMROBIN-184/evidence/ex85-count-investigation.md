# Exercise85: Source-First Count Investigation

2026-11-15. Future-batch investigation only; not an authored answer, approval, artifact correction or blocker for the current 1/6/7 commit.

**Conclusion:** the printed **5 closed / 20 open** counts are mathematically valid under the coherent, contextually recoverable reading “all vertices of each polyline are selected from the square's four vertices; not necessarily all four are used.” The book's explicit `n>2` excludes one-segment open paths. Under the competing literal reading “use all four vertices,” the counts are **1 closed / 8 open**, not 5/20. Thus no numerical misprint is established, but the current modern wording needs a registered clarification before an unconditional standard task/answer can select the intended reading.

## Actual Source and Definitions

Viewed the complete actual physical p38 PNG, printed page28, before reading the transcription. The top three printed rows visibly contain “五条,” “20条,” and, in part2, **曲线**, not 折线. Faithful `p0038#1` is:

```text
85.** 已知一正方形$ABCD$.1) 证明：以这个正方形的所有
顶点为顶点的简单闭折线共有五条.2) 证明：以这个
正方形的所有顶点为顶点的简单非闭曲线共有20条.
```

Current s8 exercise85 preserves that wording and changes layout only. Relevant current s8 definitions, whose `source_text` carries the same substantive conditions:

- `p0034#4`: “如果线段$A_1A_2,A_2A_3,\cdots,A_{n-1}A_n(n>2)$当中，按顺序相邻两段不在一条直线上，而不相邻两段没有交点，那么这些线段的并集叫做简单折线$A_1A_2\cdots A_n$．”
- `p0034#5`: “点$A_1,A_2,\cdots,A_n$叫做折线$A_1A_2\cdots A_n$的顶点，点$A_1$和$A_n$叫做端点．”
- `p0035#9`: “**简单折线**$A_1A_2\cdots A_n(n>2)$和线段$A_nA_1$当中，如果相邻两段（按圆周排列顺序）不在一条直线上，而不相邻的两段没有公共点，那么$A_1A_2\cdots A_n$和$A_nA_1$的并集叫做简单闭折线．”
- `p0035#10`: “**注** 以后我们提到折线时均指简单折线（闭折线或不闭折线）．”

Therefore open simple polylines here have at least three distinct vertices and two segments. Closed ones also have at least three vertices. Repeated vertices in an open path would create forbidden nonadjacent intersections or adjacent collinearity/backtracking. Count the geometric segment union, not traversal direction: reversing an open path does not create another figure; rotating the starting vertex or reversing a closed traversal likewise does not. The square's fixed labelled positions are not identified under a symmetry of the whole square.

## Exhaustive Derivation

Let A,B,C,D occur cyclically around the square. No three are collinear; among straight connections the sole possible crossing of disjoint edges is the intersection of diagonals AC and BD.

| Allowed vertices | Closed simple polylines | Open simple polylines |
|---|---:|---:|
| Exactly three selected vertices | Four triangles: ABC, ABD, ACD, BCD | Choose the triple in 4 ways and its middle vertex in 3 ways: 12 |
| Exactly all four vertices | Only the square boundary ABCDA: 1 | 24 permutations / reversal = 12 candidates; exclude 4 crossing paths: 8 |
| Any selected subset, with source `n>2` | 4+1 = **5** | 12+8 = **20** |
| Any selected subset, additionally allowing one segment | Still 5 | Add AB,AC,AD,BC,BD,CD: **26**, not 20 |

For four-vertex closed paths there are `(4-1)!/2=3` cyclic orders: ABCDA is simple; ABDCA and ACBDA both contain crossing diagonals AC/BD and fail. Hence the all-four closed count is exhaustively 1.

For four-vertex open paths, representatives modulo reversal are:

```text
Valid (8):   ABCD, ABDC, ADBC, ADCB, BACD, BADC, BCAD, CBAD
Invalid (4): ACBD, ACDB, BDAC, CABD
```

Each invalid path uses both diagonals as its nonadjacent first/third segments. Equivalently, choose the middle connector from the four square sides to obtain exactly these four crossing edge unions. The eight valid paths comprise four three-side boundary paths and four paths with exactly one diagonal.

For the 12 two-segment open paths, the complete representatives are:

```text
ABC, ACB, BAC; ABD, ADB, BAD; ACD, ADC, CAD; BCD, BDC, CBD
```

All are simple because each uses three noncollinear vertices and has no pair of nonadjacent segments. This accounts for every allowable vertex subset and every order. A single read-only standard-library permutation enumeration, with a square normalized to unit coordinates only for proof, reproduced all lists above; it created no script, figure, test or artifact.

## Modern Clarification Decision

The counts jointly support the selected-vertex interpretation, but the words “以这个正方形的所有顶点为顶点” do not explicitly distinguish a permitted vertex pool from a requirement to use all four. Do not silently turn “all four required” into “a subset allowed” in an answer.

Smallest numbers-preserving proposal for parent registration: replace that phrase in both parts by **“顶点均取自这个正方形的四个顶点”**, and make part2 explicitly **“简单非闭折线”**. If desired, state that the existing `n>2` convention applies and that the same geometric figure traversed oppositely is counted once. These are proposed wording clarifications only, not edits made here. If parent instead retains an explicit all-four requirement, a numerical erratum to 1/8 would be necessary.

The printed “非闭曲线” has been faithfully retained. Interpreted as arbitrary curved arcs rather than this section's polylines, it does not define a finite 20-object family: infinitely many simple arcs can connect the same vertices. The contextual polyline reading explains 20; the modern noun should make that interpretation explicit. No extra convention excluding one-segment paths needs to be invented: `n>2` already supplies it.

The inspected current s8 lesson's errata list contains `p0037-boundary-term-83`, not an exercise85 clarification. No broader erratum registry was consulted. Parent owns any future registration and promotion.

## Actual SHA-256 Bindings

| Inspected file | SHA-256 |
|---|---|
| `.tmp/ld-s10y-lesson/6-8g/pages/0038/page.png` | `4ed288ebc5278ffa1d27b28729dcdd979afb5b5cf02b12445a5283a207d79e2b` |
| `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0038/page.md` | `5cf830e211178aa0814220082745e210fb6e4a4a07cc97dc96b07955a862abe9` |
| `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-s8/lesson.template.json` | `c6644e2f8d81f9dc9173621d5c7a8476a7cd470aff520f26baf2df11e9ea06de` |
| Same lesson's `exercises.template.json` | `08fef28289e18cdc4194b2b3d4b83fb93f504194227f6c3dd8f8245499d181ec` |

No answer/choice drafts or prior math reports were accessed for this investigation. No browser, DB, app, dependency, Charter, page finalization, assembly, modern/faithful artifact edit or commit operation was performed. Only this report was written.
