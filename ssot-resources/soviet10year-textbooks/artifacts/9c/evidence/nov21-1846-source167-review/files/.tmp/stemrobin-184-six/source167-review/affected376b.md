# SOURCE167 Affected-Only F01 / 376 б)

Outcome: PASS, ONLY for the bound working repair of F01 / 376 б).
Reviewer remains OPEN pending FULL affected TEXT intake and actual close.
No original Stage 1 or fixed-author Stage 2 approval is asserted.

## Scope And Inputs

This is one affected-row check, not another 22-row / 13-object semantic review.
Only the four files in `source167-working-repair`, the named repair script,
and that repair stage's receipt/stdout/stderr were read. All paths below are
under `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/`.

The parent reports FULL Stage 2 intake references `662ce3`, `51cff2`, `1e44c3`
and `source167-review-stage2-full-intake-nov21` exit 0, recording REVISE/F01
rather than approval. That intake receipt was not opened. The allowed repair
stage `source167-376b-one-glyph-working-repair-nov21` was read and bound;
it records exit 0. The repair script was inspected as TEXT, not executed.

No old author, independent package, source image, ROI, prior/later page,
parent math draft, answer, choice or modern output was reopened.
Prior bindings and blind mathematical results are the already frozen baseline.

## Exact Affected Row

Working MD line 62 and JSON `/blocks/7/lines/1` agree exactly:

```text
б) $g(x)=7-2x^9+x^4-3x^9$。
```

This matches the already frozen blind ROI fragment `2x^9+x^4-3x^9.` and
the previously recovered complete R13 given. Chinese final punctuation and
math delimiters are the unchanged author encoding, not a mathematical change.
The first exponent is now `9`; the last exponent remains `9`.
F01 is resolved for THIS bound working candidate, not for the failed original.

## Structured And Byte-Level Change Check

The known failed-author baselines, bound before this check, are:

- Original MD SHA-256:
  `0abbbb4322295e8e1ba4414c7fbd8109567fc51b48687a1278ced2e0ae306cab`
- Original JSON SHA-256:
  `43714999ec15892c8cfa092882eff7347e8d693d88ec12c7691db36a09c49641`

They were NOT reread. Instead, the current allowed working files were
reverse-patched in memory only, changing the first exponent back from `9`
to `3`, and checked against these prior fixed hashes.

For MD, the reverse-patched 2359 bytes have exactly the known original MD
hash. There is one differing byte, zero-based offset 1917:
old ASCII `3` = 51, new ASCII `9` = 57. Thus every other MD byte, including
frontmatter and all other body bytes, is unchanged.

For JSON, the working file parses successfully. A structured clone with only
`/blocks/7/lines/1` restored to its old literal, serialized with the original
two-space JSON formatting and final newline, has exactly the known original
5029-byte JSON hash. The unchanged serialization of the working structure
also matches its supplied working-file hash. Recursive structured diff reports
exactly one changed leaf: `/blocks/7/lines/1`, whose exact before/after strings
differ only in that first exponent.

All other JSON blocks, keys, line strings, metadata, ownership arrays/flags,
exercise labels, math-wrap markers and count fields are consequently unchanged.
MD frontmatter JSON equals working JSON `meta`. The changed MD row equals the
JSON row. JSON retains 13 blocks and `meta.printed_lines=22`.
These are inert byte/structure checks, not a replay of their source semantics,
native finalization, source review, or any existing checker.

## Inherited Audit And Mathematics

Working `audit.json` is 204 bytes with unchanged SHA-256
`fb25e5d0e13b0ac953b180bf366cbcdbd1aab6b2b16310f4c5fb973663715596`.
Its original `lines_printed=22` and `lines_md=22` are inherited FIRST-native
evidence. No fresh native count, native PASS, validator result or image operation
is claimed.

The corrected given is `7-2x^9+x^4-3x^9=7+x^4-5x^9`. The already derived
blind-source derivative is `4x^3-45x^8` on R: the ninth-power contributions
are `-18x^8` and `-27x^8`. This confirms the repaired given against earlier
independent math; no expected answer or repair-script assertion chose a glyph.

## Preservation And Return

The failed author remains failed historical evidence. Original Stage 1
conditional answers, U1/U2 recovery, Stage 2 REVISE/F01, and prior provenance/
accounting qualifications are not rewritten or retrospectively approved.
The repair receipt's PENDING_AFFECTED_REVIEW status is its historical production
state; this separate report records the affected review result without changing
that receipt.

No input file was written or chmodded. Repair script and stage streams/receipt
retain their observed 0644 modes; working files retain 0444. Only the two new
reviewer-owned affected files are sealed 0444.

`affected376b.json` binds the new report, all four working inputs, repair script,
and stage receipt/streams. Its own final byte count and SHA-256 are returned
as detached TEXT to avoid a circular self-hash.

Unresolved findings in this affected scope: none. Technical failures: none.
No full-page source or all-row semantic comparison replay, checker/native
rerun, image/decode, descendant, network, paid/model call, environment/credential
inspection, DB/backend/Git operation or message occurred.

Accounting unchanged: SOURCE167 8; tracked aggregate 32; task conservative
operations 3/8; context image payloads 2/24; conservative operations 3;
hidden internals UNKNOWN; parent permanent 24/24 with zero new views/decodes.
No source168+, assembly, publication, merge, deployment or closure occurred.

STOP. AFFECTED-ONLY PASS; reviewer remains OPEN for FULL affected TEXT intake
and actual close. No exec session is left active.
