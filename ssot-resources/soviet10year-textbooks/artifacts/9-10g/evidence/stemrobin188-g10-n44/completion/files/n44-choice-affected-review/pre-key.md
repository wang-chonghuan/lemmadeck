# N44 Affected Pre-Key Evidence

Persisted before changed intent/key and FIRST/REVISE records were read.
This independent affected-only review uses only source22, the selected seed
definitions and the public views of `n44-diagonal-angles` and
`n44-proof-validity`. Zero images opened. Unchanged prior PASS checks will be
inherited transparently rather than rerun.

Bindings: canonical seed
`e38a37fe10a5c7023e1045fdad0acc896f7bd7c9c8489f1534377f85dc5c84c2`;
canonical repaired draft
`3f1798b3509039c20aeb4b6397406ae5599da18b08ecc2a5779c6a4aee0c6332`.

## Fidelity, Domain And Leakage

The exact source22 coordinates are retained. The repaired public stem requests
all distinct sizes obtained by taking an intersection ray toward A or C and one
toward B or D. This supplies an explicit unoriented four-ray scope, not an
unstated acute-only convention. The paired proof question still requires
judging sufficient parallelogram relations: an internal intersection alone
does not imply midpoint bisection or noncollinearity.

With `u=AC=(-4,-4,9)` and `v=BD=(-2,2,7)`, both midpoints are
`M=(0,2,1/2)`. The dot product is `63`; squared lengths are `113` and `57`.
The inequality `3969<6441` proves noncollinearity and a real, nonzero acute
`alpha=arccos(63/sqrt(6441))`. The four ray-pair cosines are `+x,-x,-x,+x`,
where `x=63/sqrt(6441)`, so the complete distinct set is
`{alpha,pi-alpha}`. The stem's `[0,pi]` domain resolves arccos uniquely.

No cosine, length or angle result is disclosed by either public stem.
Supplementary option symmetry cannot distinguish the correct denominator
family without computation. The proof view contains no angle result; the angle
view does not declare midpoint bisection. Affected fidelity, domain, redundancy
and leakage all pass.

## Every Option Computed Independently

- `a`: false. Using the product of squared norms gives
  `beta=arccos(63/6441)`, with `alpha<beta<pi/2`; this is neither true size.
- `b`: true. Ray pairs MA/MB and MC/MD have cosine `63/sqrt(6441)`.
- `c`: false. `pi-beta` lies strictly between `pi/2` and `pi-alpha`,
  and is neither true size. Supplementing the misnormalized angle remains wrong.
- `d`: true. Ray pairs MA/MD and MC/MB have cosine `-63/sqrt(6441)`;
  principal arccos gives `pi-alpha`.

Independent complete true set: `["b","d"]`. No internal key or author intent
was displayed before this evidence was persisted.
