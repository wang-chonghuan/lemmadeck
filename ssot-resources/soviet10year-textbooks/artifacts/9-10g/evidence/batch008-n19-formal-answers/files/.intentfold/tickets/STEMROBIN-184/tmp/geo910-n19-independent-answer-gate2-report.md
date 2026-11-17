# N19 Independent Standard Answer Gate 2

Ticket: STEMROBIN-184
Date: 2026-11-16 (Europe/Dublin)
Lesson: geo910-c1-s2-n19
Edition: modern-us-neutral
Decision: **PASS, all six answers 186-191.**
Exact defects: **none**.

This is the single explicitly authorized n19 Gate 2 comparison, not a second
source-solving pass. It reuses the unchanged source-first independent freeze.
The decision accepts the exact six candidate display answers described below
against the complete finalized modern written tasks and definition context.
All six are to be bound as derived, ungraded, with empty machine-grading parts.

This report is additive ticket TMP evidence, not a formal answer-key file.
Formal key binding, finalize, and publication have not been performed here.
No n18 comparison, Gate 2 decision, or formal binding is authorized by this
report: **n18 remains HOLD**.

## Evidence and Exact Bindings

The independent freeze was written before any parent answer was disclosed.
Its actual current SHA-256 remains:

`64afbddd258f58356bde4c3fee520a26d46a27e5b41cb97355e05d9d0160a5ff`

Freeze:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n18-n19-independent-answer-source-freeze.md`

The following actual local file hashes were obtained for this comparison:

| Input | Actual SHA-256 |
| --- | --- |
| Final modern lesson.json | `eaa8d90a2955e5e9d3fef5eaca3e18cb7fcd764d5a2193a8ab61b3c898011771` |
| Final modern exercises.json | `bec17cf252503bc992d97686c25f8540e7cc78dd60659346418272221576eae7` |
| Final modern figures.json | `a645039c4b8e1ab800c03cd9f0f5bbe3d52cfebf311afa125f35775fd3879bef` |
| Candidate prose container | `c82f236a7e10b29784a50575a5317ff90a8c3cda3c7be2292866975b39f86abd` |

The three modern files are in:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n19/`

Candidate container:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n18-n19-standard-answer-prose.json`

Only the candidate selector `/lessons/geo910-c1-s2-n19` was disclosed and read.
Its six-entry parsed-value hash is:

`14059a4d06737e21802fa6d738ffe332d62b30db55b1f35da9cbf427122b3008`

The finalized lesson's complete `prose` array has parsed-value hash:

`a3dc2922cc9d8bc46dc909296e799f691629007313ba51781333b63a42892657`

Parsed-value hashes mean SHA-256 over UTF-8 `JSON.stringify(parsedValue)`,
retaining parsed member order and omitting serialization whitespace.
Text hashes mean SHA-256 over the exact parsed string's UTF-8 bytes.
The companion JSON supplies six exact modern record/text and candidate
record/displayAnswer bindings, JSON pointers, and item results.

The whole candidate-container hash is an observation, not approval of any
other lesson in that container. Scope is enforced by the selected-array and
six item hashes; no n18 candidate content was read.

## Full Modern Definition Context

The complete finalized modern lesson prose and six exercise records were read.
The relevant definitions and formulas are consistent:

- Opposite vectors are defined by a zero sum; a nonzero opposite vector has
  equal length and reversed direction.
- $\overrightarrow{BA}=-\overrightarrow{AB}$.
- The difference is defined by $\vec c+\vec b=\vec a$.
- $\vec a-\vec b=\vec a+(-\vec b)$.
- For arbitrary spatial points,
  $\overrightarrow{OB}-\overrightarrow{OA}=\overrightarrow{AB}$.
- The later examples retain
  $\overrightarrow{PQ}=\overrightarrow{MQ}-\overrightarrow{MP}$ and
  $\overrightarrow{PQ}-\overrightarrow{PM}=\overrightarrow{MQ}$.

The candidate solutions use these opposite-vector, subtraction, triangle-rule,
and cancellation meanings correctly. Midpoints, central symmetry, parallelogram
properties, and the rectangle diagonal theorem give legitimate geometric
constructions and proofs; no dot product, new scalar-multiplication definition,
or unsupported spatial flattening is required.

All three final modern files identify n19 and modern-us-neutral and have status
ready. The lesson declares six exercises; the exercise file contains exactly
186, 187, 188, 189, 190, 191 in that order, each with the same source number.
The mathematical conditions match the corresponding independent freeze
sections. No new source review or re-solving was performed.

The final modern 187 text is clean: the old isolated layout glyph recorded in
the freeze is not part of the final task's mathematical condition. A retained
embedded source-line snapshot is not confused with final modern display text.

Figures 75 and 76 belong to surrounding exposition. All six task records have
`figure_refs: []` and `figures: []`. Their file identity and ready metadata were
bound, but no image, SVG, FigureSpec, or diagram was opened. The assigning parent
reports their independent image PASS and promotion; this answer report does not
repeat or independently certify that image gate.

## Six Item Results

### 186 / 13writtenex186: PASS

Modern task: construct from $A$ vectors opposite to
$\overrightarrow{DB}$, $\overrightarrow{CD}$, $\overrightarrow{BC}$,
in a tetrahedron $ABCD$.

The candidate reverses the three vectors correctly to
$\overrightarrow{BD}$, $\overrightarrow{DC}$, $\overrightarrow{CB}$ and
then translates them to the required initial point $A$:
$\overrightarrow{AE}=\overrightarrow{BD}$,
$\overrightarrow{AF}=\overrightarrow{DC}$,
$\overrightarrow{AG}=\overrightarrow{CB}$.
Its parallelograms $BDEA$, $DCFA$, and $CBGA$ have the correct vertex order
and give precisely the freeze's three constructed endpoints, with relabeling.

All three directions, lengths, starting points, and terminal points are
specified. The source tetrahedron rules out zero input edges; no omitted
zero-edge construction is required inside this task's stated domain.
The answer is a complete construction, not a bare reversal key.
Exact defects: none.

### 187 / 13writtenex187: PASS

Modern task: with $O,A,B$ noncollinear and
$\overrightarrow{OC}=\overrightarrow{OA}-\overrightarrow{OB}$,
prove that $OBAC$ is a parallelogram.

The candidate derives $\overrightarrow{OC}=\overrightarrow{BA}$ and
$\overrightarrow{AC}=\overrightarrow{BO}$, equivalently
$\overrightarrow{CA}=\overrightarrow{OB}$. These are exactly the two
opposite-side relations in the freeze. The signs and the quadrilateral's
specified order $O,B,A,C$ are retained.

Noncollinearity is explicitly used to exclude a collapsed quadrilateral.
The statement that the vector condition puts $C$ in plane $OAB$ is correct.
Neither a different vertex order nor an added spatial assumption is substituted.
Exact defects: none.

### 188 / 13writtenex188: PASS

Modern task: for $O$ outside the plane of triangle $ABC$, construct from $O$:
1) $\overrightarrow{OA}-\overrightarrow{OB}$;
2) $-\overrightarrow{OA}-\overrightarrow{OC}$;
3) $\overrightarrow{OA}+\overrightarrow{OB}-\overrightarrow{OC}$.

All three candidate constructions are fully specified and equivalent to the
freeze, though parts 2 and 3 use different auxiliary points.

1. The candidate constructs
   $\overrightarrow{OE}=\overrightarrow{BA}$ and the correct parallelogram
   $BAEO$. This is the freeze's first resultant.
2. Reflection of $O$ in the midpoint $N$ of $AC$ gives $Y$ with
   $\overrightarrow{OY}=\overrightarrow{OA}+\overrightarrow{OC}$.
   Reflection of $Y$ in $O$ gives $F$ with
   $\overrightarrow{OF}=-\overrightarrow{OA}-\overrightarrow{OC}$.
   Both minus signs are preserved. In a common position frame the endpoint is
   $\mathbf p_F=3\mathbf p_O-\mathbf p_A-\mathbf p_C$, exactly the frozen
   second endpoint. This is equivalent to the freeze's opposite ray and
   doubled-midpoint-distance construction.
3. Reflection of $O$ in the midpoint $M$ of $AB$ gives $X$ with
   $\overrightarrow{OX}=\overrightarrow{OA}+\overrightarrow{OB}$.
   The candidate then translates $\overrightarrow{CX}$ to start at $O$.
   Its chain
   $\overrightarrow{CX}=\overrightarrow{CO}+\overrightarrow{OX}
   =\overrightarrow{OA}+\overrightarrow{OB}-\overrightarrow{OC}$
   is correct. The parallelogram $CXGO$ yields
   $\mathbf p_G=\mathbf p_A+\mathbf p_B-\mathbf p_C$, the freeze's third
   endpoint.

The common initial point is $O$, not an auxiliary point. The constructions
operate in their appropriate planes and do not assume that $O,A,B,C$ are
coplanar. Under the triangle and outside-plane hypotheses the required
construction vectors are nonzero; no missing zero case occurs in-domain.
Exact defects: none.

### 189 / 13writtenex189: PASS

Modern task: prove the length equality for a right angle at $C$ and answer
whether the converse holds, in triangle $ABC$.

Reflecting $C$ in the midpoint of $AB$ gives the same auxiliary $D$ as the
freeze. The candidate's cycle $ACBD$ is a valid order of this parallelogram:
it is a reversed/rotated order of the freeze's $CADB$, not a crossed order.
Its diagonals are $AB$ and $CD$, and
$\overrightarrow{CD}=\overrightarrow{CA}+\overrightarrow{CB}$,
$\overrightarrow{BA}=\overrightarrow{CA}-\overrightarrow{CB}$.

The forward proof correctly uses the right-angle parallelogram's being a
rectangle and its equal diagonals. The converse correctly uses the theorem
that a parallelogram with equal diagonals is a rectangle; the freeze's SSS
argument independently establishes that theorem's applicability here.
Both directions are present and the angle is at the correct vertex $C$.

The asserted converse remains within the modern task's nondegenerate triangle
domain. It does not assert a right angle for arbitrary coincident points or
zero vectors, so the freeze's degenerate boundary is not contradicted.
The named geometric theorem is a valid reason, not a missing proof step or an
unproved answer key requiring dot products.
Exact defects: none.

### 190 / 13writtenex190: PASS

Modern task: prove the opposite-vertex vector-sum equality for parallelogram
$ABCD$ and any spatial point $O$.

The candidate uses the common midpoint $M$ of $AC$ and $BD$ and expands both
sides to $\overrightarrow{OM}+\overrightarrow{OM}$ by cancellation of
opposite midpoint vectors. This is the freeze's proof.

The proof does not restrict $O$ to the center or to an exterior point. The
candidate explicitly includes in-plane, out-of-plane, and coincident-vertex
positions. Its formula also covers $O=M$, with both sums zero.
No nonzero $\overrightarrow{OM}$ assumption is introduced.
Exact defects: none.

### 191 / 13writtenex191: PASS

Modern task: 1) prove the tetrahedron identity; 2) decide whether it holds for
four arbitrary points.

The candidate uses
$\overrightarrow{AD}=\overrightarrow{AB}+\overrightarrow{BD}$ and
$\overrightarrow{BC}=\overrightarrow{BA}+\overrightarrow{AC}$,
then cancels $\overrightarrow{AB}+\overrightarrow{BA}=\vec 0$.
This gives exactly the freeze's requested
$\overrightarrow{AD}+\overrightarrow{BC}
=\overrightarrow{BD}+\overrightarrow{AC}$.

Part 2 is explicitly affirmative and explains that no tetrahedron
noncoplanarity is used. Coplanar, collinear, and coincident point cases are
included. The cancellation uses a zero vector in a proof, not an automatically
graded scalar-zero answer or a legacy interaction.
Exact defects: none.

## Gate 2 Checklist

| Gate Item | Result and Evidence |
| --- | --- |
| 1. Same exercise identity, modern task, and applicable figure context | PASS. Six matching numbers/source numbers; all task figure references and figure arrays empty. |
| 2. Actual verification of bookRaw, when present | NOT APPLICABLE. The authorized candidate has no bookRaw; all six are derived, and no book-answer material was read. |
| 3. Complete independent solution for derived answers | PASS. Unchanged source-first freeze predates candidate disclosure; every candidate method and result agrees with it. |
| 4. All subparts and requested quantities distinguishable | PASS. Three constructions in 186; proof in 187; three constructions in 188; forward and converse in 189; proof in 190; both parts of 191. Ungraded machine parts stay empty. |
| 5. Expected/input chain correct when automatically graded | NOT APPLICABLE. No automatic expected values or MathLive exact keys are authorized; no input-chain check is claimed. |
| 6. DisplayAnswer gives understandable full methods/reasons | PASS for all six exact candidate display strings. |
| 7. Auto limited to reliably judgeable tasks | PASS by the explicitly authorized all-ungraded contract; no auto task or symbolic-zero key is introduced. |
| 8. Construction/proof tasks remain ungraded | PASS under the binding contract below; formal shape is still the parent's next step. |
| 9. No omission, duplication, or source confusion | PASS. Exactly six unique candidates match six finalized written tasks; the independent derivation source is distinguished from parent prose. |

The candidate prose entries actually contain only `exercise` and `displayAnswer`.
This report does not falsely claim that a formal answer schema has already been
read or validated. The authorized binding contract is:

- Exactly one answer per exercise 186-191, in n19, edition modern-us-neutral.
- `source: "derived"` for all six.
- `grading: "ungraded"` for all six.
- `parts: []` for all six; display prose still retains every subpart.
- Preserve each accepted `displayAnswer` exactly as bound in the companion JSON.
- No `bookRaw`, automatic expected values, symbolic scalar-zero keys, or legacy
  interaction binding is supplied by this report.

## Handoff Boundary

**Explicit PASS** is given for the six bound n19 candidate standard-answer
proses and their complete mathematical/definition-context comparison.
The parent may now perform the separately requested n19 formal binding and
finalize using the exact accepted prose and the all-derived/ungraded contract.
This report itself performs neither operation and does not certify a future
formal file's shape, a finalize command, MathLive verification, or publication.

No exact defect requires a candidate prose correction. A changed accepted prose
string is not silently covered by the old hash. The unchanged source-first
freeze remains the independent mathematical evidence; do not repeat full source
solving or this completed Gate 2 merely to perform formal assembly.

No choices, unrelated answers, n18 candidate, source image, new image, or formal
key file was read. No source, candidate, freeze, formal key, publication, database,
Git, dependency, or workflow record was changed. Only this report and its JSON
bindings were added to the ticket TMP directory.

The parent's adapt-finalize/render exit-0 and independent figure-PASS statements
are disclosed upstream evidence, not commands rerun or image claims made here.
