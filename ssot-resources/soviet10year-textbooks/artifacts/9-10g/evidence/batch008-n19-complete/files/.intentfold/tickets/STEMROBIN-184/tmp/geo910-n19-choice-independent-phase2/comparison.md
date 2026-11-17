# STEMROBIN-184 n19: Phase 2 View-Only Comparison

## Scope and Findings

The only new author-side input read was the explicitly disclosed
`geo910-n19-choice-author/view-projection.json`: six ordered `view` objects.
Raw SHA-256:
`1c367422b9bc7b29eebc482b43f9929410e18a6ef107c8483a0bb2ad7e84492d`.
Canonical SHA-256:
`216ddb69385534bf89ffc6e696ce541230487b8d517b98903afa9344f75489c5`.
Handles are **ordinals 1..6**, not undisclosed internal question IDs.

Phase 1's report, complete exact-source solutions, ledger and manifest remain
byte-for-byte frozen. No source solve was rewritten. Fidelity, redundancy
and leakage were recorded first in `pre-mathematics.json`, hash
`db0014fca51397d2251b854b03cd5599d70ace301a63b10aaeb6e435301b2451`,
before recording the independent option derivations.

**No definite mathematical defect or essential textual coverage loss was
identified.** The complete independent true sets are:

| Ordinal | Mode | Complete True Set | Source Compared |
| --- | --- | --- | --- |
| 1 | single | B | 186 |
| 2 | single | D | 187 |
| 3 | single | A | 188 |
| 4 | multiple | A, C | 189 |
| 5 | single | C | 190 |
| 6 | multiple | A, C | 191 |

These are independent results, **not a comparison with an author key**.
No draft, intent, internal solution, rationale, misconception, author coverage
record or author/reviewer judgment was read. No draft repair was made.
There is no official review schema or formal `pass` outcome.

**Additional input-freshness hold found at freeze:** the reviewed seed and
authorized projection are unchanged, but current `book.json` is
`5b63a28aa65fe2ce87bf8ddb4a3c9dcb3eef85b572d42812ce84172e25a4b20d`,
not the seed trace's
`3f45753a2dc5398ed5ae9612770a535d831c3dd5d6b80b289963160bd78d6c35`.
All three selected lesson/exercise/figure JSON trace files and both SVGs
still match. This was detected by hashing only; book contents were not read,
so its cause or mathematical impact is not inferred. `freeze-attempt-1.json`
retains the stopped strict-freshness attempt. The independent results below
are bound to the explicitly authorized frozen seed, not to a refreshed current
book snapshot. Ambient current-source freshness is **unresolved**, not passed.

Definite limits that must remain visible in later internal review:

- Ordinals 1 and 3 recognize vector/construction relationships; they do not
  demonstrate independently drawing or executing the constructions.
- Ordinals 2, 4, 5 and 6 recognize proof-relevant relationships or claims;
  they do not demonstrate independently writing the source proofs.
- Ordinal 2 asks for an ordered boundary tuple, not explicitly for the final
  parallelogram conclusion. Its correct tuple contains sufficient opposite-side
  relationships; do not claim the click separately measures articulation of
  that inference or independently naming the shape.
- Ordinal 6 C implies A, and A excludes D. This legitimate logical dependence
  is not two independent demonstrations of the identity proof.

## 1: Opposites From A

Here the visible stem explicitly makes **A** the origin:
`b=AB`, `c=AC`, `d=AD`. Thus

```text
DB=b-d, CD=d-c, BC=c-b
(AX,AY,AZ)=(d-b,c-d,b-c).
```

All output tails remain `A`; a reversal is not just an equal-length segment.
For a tetrahedron every relevant edge is nonzero.

- **A false:** all three entries are the original directions, not their
  opposites.
- **B true:** all three ordered negatives agree.
- **C false:** only the middle entry fails: `d-c` instead of `c-d`.
- **D false:** only the last entry fails: `c-b` instead of `b-c`.

For `A=0`, `B=(1,0,0)`, `C=(0,1,0)`, `D=(0,0,1)`, the target triple is
`((-1,0,1),(0,1,-1),(1,-1,0))`. This exposes each listed reversal.

Fidelity is supported as complete-triple recognition. All three source parts,
the starting point and directed signs survive. Checking enough distinguishing
entries to eliminate rows is legitimate mathematical elimination; it is not
automatically an essential loss. Independent drawing/translation remains a
real production loss. The unmarked `fig-75` concept aid does not supply named
endpoints `X,Y,Z`. No direct answer leakage is observed.

## 2: Boundary Order and Parallelogram Relationship

This stem uses **O**, not A, as the vector origin:
`a=OA`, `b=OB`, `c=OC=a-b`. Along **O-B-A-C-O**:

```text
OB=b, BA=a-b, AC=c-a=-b, CO=-c=b-a.
```

- **A false:** BA and CO are reversed; OB and AC agree.
- **B false:** AC and CO are reversed; OB and BA agree. Its boundary sum
  is `2a`, not zero.
- **C false:** OB uses `a` instead of `b`, AC uses `-a` instead of `-b`,
  and BA/CO are reversed. None agrees under noncollinearity.
- **D true:** `(b,a-b,-b,b-a)` is the complete ordered result.

For `O=0`, `A=(1,0)`, `B=(0,1)`, `C=(1,-1)`, the exact tuple is
`((0,1),(1,-1),(0,-1),(-1,1))`.

The correct tuple gives `OB=-AC`, `BA=-CO`, equivalently
`OB=CA`, `BA=OC`. With the retained noncollinearity premise these are
sufficient equal-and-parallel opposite-side relationships for the original
nondegenerate parallelogram **OBAC**.

This is bounded proof-relationship recognition, not explicit proof production
or narration of the shape conclusion. The proof-relevant relationship has not
been replaced by a mere shape label. A and C also sum to zero; closing a path
alone does not identify the correct ordered edges. `fig-76` has only `O,A,B`,
not `C` or a complete quadrilateral. It is a subtraction aid, not visual proof
of OBAC. No direct leakage or equivalent-row defect is identified.

## 3: Three Spatial Construction Methods

The stem retains nondegenerate triangle `ABC`, **O outside its plane**, and
three outputs starting at O. With O as origin:

```text
P=a/2, R=b/2, M=(a+c)/2, N=(a+b)/2
target X=a-b, Y=-a-c, Z=a+b-c.
```

- **A true:** reflecting B in P gives `2P-B=a-b`; `OY=-2OM=-a-c`;
  reflecting C in N gives `2N-C=a+b-c`.
- **B false:** Y is `a+c`, the reverse of the required `-a-c`; X,Z agree.
- **C false:** reflecting A in R gives `b-a`, the reverse of the required
  X; Y,Z agree.
- **D false:** reflecting N in C gives `2c-n`, not `2n-c`. Their difference
  is `3(c-n)`, nonzero because triangle vertex C is not the midpoint of AB.
  X,Y agree.

For `O=0`, `A=(1,0,0)`, `B=(0,1,0)`, `C=(0,0,1)`, the correct endpoints
are `X=(1,-1,0)`, `Y=(-1,0,-1)`, `Z=(1,1,-1)`. Row D instead has
`Z=(-1/2,-1/2,2)`.

The actual source constructions remain substantive: reflection center/subject,
the directed double-midpoint vector, and translation to O determine geometry.
Independent drawing and construction execution are lost and must be declared.
The source never separately asked for endpoint-plane classification. As a
diagnostic, the correct Z and D's wrong Z both lie in `ABC`, so plane membership
cannot substitute for checking the endpoint.

Ordinal 2 may help with the first subtraction direction after its mathematics
is established, but it does not resolve either the Y sign or Z reflection.
The complete triple is not a directly leaked answer.

## 4: Right-Angle Norm Equality and Converse

For the nonzero vectors `u=CA`, `v=CB`:

```text
|u+v|^2-|u-v|^2=4(u dot v).
```

- **A true:** a right angle at C gives `u dot v=0`, hence equal norms.
- **B false:** `u+v=u-v` would require `v=0`, excluded by the triangle.
- **C true:** equal norms give `u dot v=0`, hence the angle at C is right.
- **D false:** perpendicularity does not force equal individual lengths.

The nondegenerate right triangle
`C=(0,0)`, `A=(1,0)`, `B=(0,2)` refutes B and D:
the sums are `(1,2)` and `(1,-2)`, their lengths are both `sqrt(5)`,
and the two operand lengths are 1 and 2.

Both source directions are tested explicitly. A and C are converse
implications, not duplicate statements; B and D retain distinct mathematical
errors rather than trivial wording variants. The nonzero premise prevents an
undefined-angle converse. No other view supplies this equivalence. Written
proof production remains unmeasured.

## 5: Every Spatial Origin

For the parallelogram's common diagonal midpoint M and any Q:

```text
S_Q=T_Q=2QM.
```

Thus the complete row is `S_O=T_O=2OM`, `S_P=T_P=2PM`.

- **A false:** it omits the factor two at both origins.
- **B false:** the O relation agrees, but the P sum must use PM, not OM.
  This row can work when `P=O`; it is not universally valid.
- **C true:** each origin has its own correctly directed double-midpoint sum.
- **D false:** MO and MP reverse the required directions.

Take `A=(0,0,0)`, `B=(2,0,0)`, `C=(2,2,0)`, `D=(0,2,0)`,
`M=(1,1,0)`, `O=(1,1,1)`, `P=(1,1,2)`. The actual sums are
`(0,0,-2)` and `(0,0,-4)`. A gives half those values, B incorrectly repeats
the first at P, and D gives opposite values.

The allowed midpoint/coincident special cases do not rescue false universal
rows. The original arbitrary spatial O is not narrowed; P makes origin
dependence explicit. The conditional parallelogram identity, opposite pairs
and sufficient midpoint proof relationship survive. Independent proof
production is still lost. No factor, sign or equality was given as a true
stem assertion.

## 6: Unrestricted Four-Point Identity

With positions relative to any common origin:

```text
p=(d-a)+(c-b)=c+d-a-b
q=(d-b)+(c-a)=c+d-a-b
M=(a+b)/2, N=(c+d)/2
2MN=c+d-a-b.
```

- **A true:** both sums agree for a tetrahedron and for every four points.
- **B false:** `AB+CD=b-a+d-c`; the common sum minus this is
  `2(c-b)`, not identically zero.
- **C true:** the common value is precisely the directed vector `2MN`,
  including degenerate midpoint cases.
- **D false:** the universal algebra proves that no collinear counterexample
  exists. This is a refutation of an existential claim, not just one sample.

For the standard tetrahedron `A=0`, `B=(1,0,0)`, `C=(0,1,0)`,
`D=(0,0,1)`, `p=q=(-1,1,1)` but `AB+CD=(1,-1,1)`, refuting B.
As a collinear illustration, `A=0,B=1,C=3,D=7` gives both sums 9.

No distinctness, noncollinearity, noncoplanarity or parallelogram condition is
needed. Coincident points do not invalidate the midpoint formula.
The factor two and **M-to-N** direction in C are substantive extra content.
C logically entails A, but A does not determine the common value.
A also rules out D. This is valid mathematical implication/elimination,
not an excuse to count A and C as independent demonstrations of proof.
The arbitrary-four-point extension is not lost.

## Package Fidelity and Dependence

All six full sources and twelve substantive source tasks retain a corresponding
mathematical judgment in the visible questions:
three opposites, one ordered parallelogram proof relationship, three construction
methods, both norm implications, the arbitrary-origin midpoint identity, and
the four-point identity plus unrestricted extension.

The package shifts from independently producing constructions/proofs to
recognizing full relationships, methods or claims. Those production losses are
real. Under the review contract they are not automatically essential losses
when the mathematical distinctions and key relationships remain. No click is
claimed to prove drawing or independent proof competence.

There is shared instructional mathematics across questions:

- Ordinals 1, 2 and 3 use ordered subtraction, but the local origins differ.
  An established relation can aid another question; no entire target triple
  is provided as a given true answer elsewhere.
- Ordinals 3, 5 and 6 use midpoint algebra, with different local segment
  definitions. Transfer requires applying signs and directed differences.
  Unmarked alternatives are not a source of authoritative answers.
- Ordinal 5's opposite-vertex sum equality is conditional on a parallelogram.
  Ordinal 6's directed identity is unconditional for four points. The package
  preserves rather than collapses this scope distinction.
- Within ordinal 6, C implies A and A excludes D. This is acknowledged logical
  dependence, not a direct cross-question key leak.

No preceding question or exposed answer is necessary to solve any view from
its own data and the authorized mathematical concepts. No genuine direct
cross-question answer disclosure, silent source omission, or mathematically
equivalent full-option defect was identified in the supplied text. Learner
feedback, navigation and interaction order were not inspected.

## Zero-Image Scope and Holds

**Phase 2 image opens: 0. Reopens: 0. Cumulative: 2/8; six reserved.**
No SVG, source screenshot or new figure was opened. Source-image observations
are reused from the hash-bound Phase 1 record. No image payload is sent to a
parent chat. No browser, dev server, database, renderer or screenshot was run
in Phase 2.

The parent's statement that only an offline caption renderer was fixed is
context, not observed learner-display evidence. No author renderer code or
report was inspected. Unchanged seed/source SVG byte hashes do not establish
desktop/mobile typography, captions, layout or final image framing.

Holds:

1. The ambient book trace hash differs as recorded above. Current-source
   freshness cannot be certified without an authorized explanation or decision;
   no seed was reprepared and no source or other worker's file was changed.
2. Actual learner HTML/desktop/mobile evidence is not provided. Visual quality
   and caption rendering remain **not assessed**, not visually passed.
3. Internal IDs, keys, rationales, misconception derivations, source mappings,
   omitted-task records and limitation declarations remain undisclosed.
   Their agreement with these independent results awaits explicit Stage 3.
4. No official semantic review `pass` JSON is authorized here.

`phase2.json` binds every independent option check and true set to its ordinal
and canonical view hash, retaining exact disclosed views.
`complete-inputhashledger.json` records authorized inputs, Phase 1 lineage,
matching seed/selected-lesson/SVG hashes, ambient book drift, zero-image scope
and output hashes.
`freeze-manifest.json` binds this complete comparison and the structured solution
snapshot. Only this new owned Phase 2 directory is written.
