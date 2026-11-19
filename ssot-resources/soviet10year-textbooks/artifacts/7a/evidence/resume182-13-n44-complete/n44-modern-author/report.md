# n44 Modern Author Candidate

Date: 2026-11-19. Ticket: STEMROBIN-182. Offline AUTHOR only.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.

## Result

Modern Chinese prose and natural Latin sublabels are authored in the existing
prepared templates. Author preservation checks pass. This is a frozen author
candidate, not independent modern approval or finalization.

| Item | Count |
| --- | ---: |
| Original source-bound prose blocks retained | 78 |
| Final deterministic proseFlow paragraphs | 80 |
| Original exercises, exactly 858-872 | 15 |
| Subparts retained with exact formula-byte bindings | 63 |
| Modern formula spans checked by KaTeX | 202 |
| Tool-derived section boundaries, both sides compared | 10 |
| Figures/references | 0 |
| Registered modern math corrections | 1 |
| Numeric context changes | 0 |

The existing source-bound erratum, text-signature and numbered-subpart-layout
contracts returned no errors. All 93 text targets retain exact expected formula
and outside-math number signatures. Every subpart's formula spans also match its
prepared-FIRST source-label binding byte for byte, including exercise 866's
already restored natural order. All lesson/exercise identities, source objects,
source texts, refs/pages, groups, counts and figure data remain unchanged.
The empty figure template is byte-identical to prepared-FIRST.

Requirements checked explicitly include table lookup and 0.01 accuracy in 862,
both methods in 865, complete parameter sets and root counts in 866-868, both
universal claims and the inclusive lower bound in 869, every mapping subpart,
all eight questions and both proofs in 870, and the nonzero quantifier and
strict bound in 872. All original worked-example root alternatives and signs
are preserved by the exact formula checks.

## Hashes

Frozen candidate and WORKING templates have identical SHA-256 values:

| Template | SHA-256 |
| --- | --- |
| lesson.template.json | `ede70b73ff44b1509b964d6b280de89e98f31b4ed126f9b856302ca3014727a0` |
| exercises.template.json | `ebe7406aaaaf8310611d0321580cf02853e5b93137023324efdf07162471c5d1` |
| figures.template.json | `7096f0d73743e69523da2319a5c028de78e3317f52b6a902bc0a5d1e7c69553d` |

Prepared-FIRST hashes:

| Template | SHA-256 |
| --- | --- |
| lesson.template.json | `bf7d367021dd60e2fd85f8a41b6af02f31dcffb897aa8faae1de765014b87ad2` |
| exercises.template.json | `cc2573e5db1d1dd31f5e0a5e8993875412a3fb56f1d6c7de347f890986bae4ad` |
| figures.template.json | `7096f0d73743e69523da2319a5c028de78e3317f52b6a902bc0a5d1e7c69553d` |

Paths resolve below this report directory:

- `prepared-FIRST/`: immutable before-edit template snapshots.
- `candidate-FINAL/`: immutable author candidate snapshots.
- `reasoning.md`: prose decisions and parent metadata update.
- `verify-FINAL.json`: 21 passed author checks and counts.
- `verify-FINAL-signatures.json`: all 93 expected/modern signatures and erratum binding.
- `verify-FINAL-subparts.json`: all 63 source-to-Latin subpart formula bindings.
- `section-boundaries-from-tool.json`: exact selected `prose_flow.mjs` boundary objects.
- `section-boundary-comparison.json`: exact before/after comparisons after flow.
- `normalize-FIRST.*`, `prose-flow-FIRST.*`, `prose-flow-FINAL.*`,
  `verify-FINAL-contracts.*`: actual saved output/error/exit receipts.
- `hash-report.json`, `hashes.sha256`: candidate, prepared, evidence and source-input hashes.

## Issues And Handoff

The only math correction is `p0262-math-1`, `lesson.prose[53]`:
`$c=1.21$` becomes `$c=-1.21$`, with `math-correction` and `errata.corrected`.
The printed equation and every other formula remain unchanged.

Parent update: independent source-erratum Stage1 CONFIRMED this correction, but
the inherited reason incorrectly calls this paragraph example 3. The parent
owns the metadata-only reason correction and is re-finalizing metadata.
The author candidate deliberately retains the previous reason and source page
JSON SHA `916b6e0ea925f1de9c3ee40c0493906e07ed7a9c7f713d1969bf31aafc6597cb`.
After this freeze, the parent will rebind only the reason and page SHA in
scratch/WORKING files. The prepared-FIRST and candidate-FINAL snapshots stay
unchanged. Independent full modern review, including this affected binding,
is pending; finalization remains the parent's stage.

Exercise 870 retains printed unprimed `$E(7)$` and primed `$F'(0)$` exactly.
The source review's observation is not treated as permission to add a prime.
No additional mathematical printing error was established or corrected.
Parameter-leading coefficients in 867(c) and 868(c) remain untouched; no
nonzero-parameter restriction was invented.

The passed source review and source counter/264 repair work were reused, not
rerun or edited. No source image, network, live ticket, environment, database,
app, dependencies, shared tools, publishing, preparation, source finalization,
modern finalization, commit or Git mutation was used by this author.
Only the lesson/exercise WORKING templates and this exclusive report directory
were written; others' work was preserved.

All files in this report directory are frozen 0444. The three WORKING templates
remain writable. The author stops here.
