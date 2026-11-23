# N59 affected original-source solutions

Frozen on 2026-11-23 for STEMROBIN-187, lesson `math4-c2-s2-n59`.
Scope: independent exact solutions of exercise 980's fifth Cyrillic subpart
and exercise 1004's Cyrillic б) only, using this reviewer's certified source.

## Frozen source binding

Working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
Paths below are relative to that directory.

- Literal report:
  `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n59/evidence/literal-source-supplement.md`.
  SHA-256: `9ad0d15afcb3681704d288e712f39b5db592e4aaee842796883b30ae8088ad27`.
  Its bytes were not edited; the hash was verified before these calculations.
- Exercise 980 source: `.tmp/ld-s10y-lesson/4m/pages/0217/page.png`.
  SHA-256: `c4647a8a0885c890bd45021faf592bea5d14e503b1a0c03680e4bb482b0fe209`.
- Exercise 1004 source: `.tmp/ld-s10y-lesson/4m/pages/0220/page.png`.
  SHA-256: `a9a3067a14d3863395571044eb10d0268dd74857313bbe4dfa6fb96cf8574416`.
- The literal report's retained 1004 crop:
  `evidence/literal-crops/0220-ex1004-b-opening.png`, relative to the raw lesson
  directory. SHA-256:
  `9e70474bf8751595fde8e6447e23ac68775bbe9c6a8d23457887373088e4bc7c`.
  The crop was not reopened or changed in this step.

## Exercise 980, fifth Cyrillic subpart д)

Certified original expression: `96.3 + 0.081`.

Align both addends to thousandths, using integers throughout:

```text
96.3 = 96.300 = 96300 / 1000
0.081 = 81 / 1000
96300 + 81 = 96381
96381 / 1000 = 96.381
```

Independent exact result: **96.381**.

## Exercise 1004, Cyrillic б)

Certified original expression:
`146325 - (72 * 306 - 1693) + 75014`.
The opening is the single grouped integer 146325, not a product.

Evaluate multiplication first, then the parentheses, then addition/subtraction:

```text
72 * 306 = 72 * (300 + 6) = 21600 + 432 = 22032
22032 - 1693 = 20339
146325 - 20339 = 125986
125986 + 75014 = 201000
```

Independent exact result: **201000**.

## Independence, usage and stop boundary

These calculations were derived from the already certified expressions and
checked with local integer arithmetic, not candidate answers, prior solutions
or tests. No changing raw/modern content, answers or other reports were read.
Only these two branches were solved; no other exercise or subpart was reviewed.

New image loads: **0**. Cumulative actual image usage in this same bounded
context remains **4/24**, not reset. No original image or crop was reopened.
Only this new sidecar was written; existing evidence, edits and staging were
preserved. No DB/environment, source/tool/index/progress edits, commits, pushes
or other-chat messages.

This sidecar freezes source solutions only. It does not certify current source
or modern output files, current answer artifacts, exercise 976 grading notes,
or whole-lesson approval. Affected-only comparison awaits explicit parent
authorization; this step makes no new verdict on the prior 103 other parts.
