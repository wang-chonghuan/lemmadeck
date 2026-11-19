# Affected Stage3: Pass

The new author seed is byte-identical and deep-equal to the prior final seed.
New draft canonical SHA-256:
`12e12cd7627a6c18ba78053c1f40f70ed67ebe7ae471cb12473469b83491ad06`.

Exactly four author strings changed: derivation and misconception for q877f/B
and q885a/C. Every other author field is deep-equal, including all48 views,
keys, source solutions, source mappings, limitations, coverage and figures.
No source, view, coverage or figure review was repeated.

## Two Comparisons

- **q877f/B passes:** Wrongly distributing `10(y-2)` as `y-20` gives
  `8(3-y)=y-20+5(y-2)^2`, hence `5y^2-11y-24=0`. Discriminant601 and
  roots `(11+-sqrt(601))/10` exactly reproduce the existing alternative.
  The frozen original polynomial differs by `9y`, nonzero at both generated
  roots. This concrete partial-distribution error genuinely generates a false
  option. Prior issue S3-M-001 is resolved for this internal snapshot.
- **q885a/C passes:** Ignoring the second machine's contribution and treating
  first's observed `4+8=12 h` running time as its solo completion time,
  then subtracting8 h, gives second4 h. This exactly reproduces `(12,4)`.
  Actual scheduled work is `12/12+8/4=3` fields, not1. This concrete
  participation-time/solo-time confusion genuinely generates a false option.
  Prior issue S3-M-002 is resolved for this internal snapshot.

Both inherited incorrect truth labels remain incorrect. Independent true sets
remain q877f `{C}` and q885a `{B}`. No explanation is accepted merely because
its option is false; both new wrong procedures actually generate the option.

## Complete Canonical

`canonical-review.json` is a complete `s10y-choice-review-v1` for the new seed
and draft. It copies all46 unaffected mathematics question units,150 unaffected
option checks, all48 fidelity/redundancy/leakage checks, all48 independent
solutions and complete true sets, all19 source solutions/coverage verdicts and
both figure checks exactly.

Only eight canonical leaf values change: draft hash, two affected mathematics
verdicts, two affected option evidence strings, removal of obsolete defect
language in the two affected source coverage evidence strings, and outcome.
Historical bindings are recorded separately in `binding.json`; canonical text
contains no absolute, `.tmp` or `.intentfold` path reference.

Final inherited counts:19 exercises,57 tasks,48 questions,152 options
(53 true/99 false),43 single/5 multiple,48 mathematics pass and152 author
derivations pass. Existing source880/890 conventions and production losses
remain unchanged and explicit. Four frozen image observations are reused;
zero new image reads/opens, crops or rerenders.

## Validation And Preservation

`validation-receipt.json` retains the exact one new final validator command.
Exit **0**:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

The prior Stage3 validator was not rerun: its exit3 rejection evidence and
complete8-file/33-entry freeze were completed first and remain unchanged.
No separate pure-structure validator or repeated Stage2 review was run.

New affected comparison, binding and canonical review were0444 before the
validator. All seven new owned files, including receipt, report, freeze and hash
manifest, are frozen0444. `affected-comparison.json` contains the two semantic
comparisons; `binding.json` records deep-equality and inherited evidence;
`freeze.json` and `frozen-files.sha256` bind the final output.

This is an offline review handoff, not a live promotion or publication.
No author/source/live/app/DB/index/dependency/Git changes or other-chat messages.
