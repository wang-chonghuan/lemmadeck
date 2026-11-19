# STEMROBIN-182 n40 Affected-Only Review 1

Date: 2026-11-19.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Scope: sole FIRST finding `n40-FIRST-p0243-negative-a-minus`.

## Verdict

**PASS. The sole FIRST mathematical HOLD is resolved for the reviewed affected
template. No outstanding finding.** Unrelated FIRST approvals are inherited,
not re-reviewed. Original FIRST reports, snapshots, author evidence and editable
templates remain byte-identical and retain their historical verdicts.

Reviewed one bound source erratum and one changed formula in `prose:18`.
No source page content, unchanged formula set, exercise content, or image was
re-reviewed. Images opened this review: 0. Cumulative image ledger: 1 -> 1.

## Source Binding

Read `n40-erratum-application.json`, the new isolated source `binding.json`,
changed template objects, and existing affected-stage receipts. Application
hashes match actual affected templates and the exact FIRST prescription.

The affected p0243 JSON contains exactly one source record:
`p0243-math-1`, block `p0243#9`, physical page 243, printed page 237.
Its normalized `original` exactly equals the FIRST prescription; the physical
wrap marker remains in the faithful page block but not in erratum `original`.
The recorded reason correctly identifies the negative-a contradiction and
signed substitution. All faithful p0243 blocks are deep-equal to FIRST, its
Markdown body is byte-identical, and metadata differs only by the new erratum.
Other staged pages 242 and 244-246 are byte-identical to the original stage.

New p0243 JSON SHA-256:
`596d958785e8da22695c789506ce35f451aaba5f51511d1b8ac5accd63d3c43f`.
The edition record uses this new hash, not the pre-registration hash.
Its `id`, `target: lesson.prose[18]`, physical/printed page, block, PDF hash,
original, corrected, and reason exactly match the source-derived expected record.
RAW `prose[18]` has the unique `p0243#9` source reference, and the normalized
original occurs exactly once there. Embedded RAW snapshots and hashes are unchanged.

Existing parent receipts have exit 0 and matching stream hashes. The page
finalize receipt reports 24 printed/transcribed rows and zero normalizations;
the isolated audit reports one erratum and no errors. These are existing command
evidence, not a fresh visual row count or reviewer-run finalization.
The affected prepare receipt names the correct new isolated source root/work
directory and n40 target. RAW lesson, exercises, Markdown and book bytes remain
identical to the old isolated stage; the original assembly receipt is reused
with its original hash. No redundant assembly was run by this reviewer.
No durable production page was reopened.

## One-Formula Review

The corrected formula exactly equals the FIRST prescription:

```tex
$a\sqrt{2}=-(-a)\sqrt{2}=-\sqrt{(-a)^2}\cdot\sqrt{2}=-\sqrt{a^2}\cdot\sqrt{2}=-\sqrt{2a^2}$
```

For every `a<0`, `sqrt((-a)^2)=|-a|=-a`, so the newly negative radical
product equals `a*sqrt(2)`, just like both neighboring terms. With `a=-1`,
all five corrected terms are `-sqrt(2)`. The sign condition, source text and
source reference are unchanged. Only the missing exterior minus was inserted.

The entire new lesson equals the FIRST authored lesson after exactly three
specified updates: replace the one original formula with the prescribed formula
in `prose:18`; add `math-correction` beside `layout` on that object; add the
single source-bound corrected erratum. No other field changes are present.

All 18 other authored prose objects are deep-equal to FIRST. Exercise and
figure templates are byte-identical to FIRST, retaining 14 exercises and zero
figures. All five `{before, after}` anchors are unchanged. Their inherited
parser resolutions remain `3, 6, 8, 12, 15`; no parser rerun was needed.

## Current Template Hashes

| Affected template | SHA-256 |
| --- | --- |
| Lesson | `4516bf40a1df7bcea214d917e7b9865db7703e46c7a14f9ec6c5b791756d7ba1` |
| Exercises | `1aa9fc150fd1633b6699f3cc792731c4c0d24fe671cdb53f9f75355b9ea7343f` |
| Figures | `9b8feb41e98e3d2945995b3a8a9c480a098371b99f42719a9ee4102dce8decae` |

`review-affected1.json` records the exact corrected object/record, scope,
checks and existing receipts. `bindings-affected1.json` and
`hashes-affected1.sha256` bind actual absolute input paths and their bytes.
All bound inputs remained unchanged during this review.

## Stop Boundary

Only new files in the authorized `n40-modern-review/` directory were written.
No source/template edits, images, finalization, assembly, preparation, renderer,
test, answer/key/choice access, app, network, DB, publication, commit or push.
This PASS combines with the inherited unrelated FIRST results; it does not
claim parent `adapt-finalize` success or approve unobserved normalized outputs.
Parent owns the single modern finalization afterward. Review stops here;
retain this context for hash-only output binding if tool normalization changes
the produced bytes, without rerunning unrelated source or mathematical review.
