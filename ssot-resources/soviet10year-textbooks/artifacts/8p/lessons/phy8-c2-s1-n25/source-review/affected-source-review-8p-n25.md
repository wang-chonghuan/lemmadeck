# n25 affected SOURCE repair review

Date: 2026-11-23. Ticket: STEMROBIN-180.
Exact workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.
Sole independent reviewer; review-only continuation.

## Affected verdict

**FAIL for the current affected n25 SOURCE snapshot: one confirmed minimum
italic term is still missing on 116.** The other listed repairs pass this
affected comparison. There is no additional necessary source repair found
in the authorized diff.

This report is separate from the initial FAIL, original inventory, native
follow-up and initial bindings. Those files remain byte-identical. The four
first-failure-p0116.page.md through first-failure-p0119.page.md snapshots
exactly match the initially bound failing candidates.

## One remaining necessary fix

Current pages/0116/page.md line 49, p0116#3 row 1:

```text
Current:  它是物体的重要性质之一
Required: 它是*物体*的重要性质之一
```

Only the 物体 immediately after 它是 needs the missing italic representation.
Do not italicize 它是, the surrounding phrase, or punctuation.
The same omission exists in current page.json's third block, first line.

This was already within the original native observation: the follow-up's
116 S02-S03 row explicitly identifies every 物体 in the first selected
paragraph as distinct slanted type. After soft-row joining, the current
paragraph represents four of its five 物体 occurrences in italic; this
one remains plain. It is a definite missing core term, not a newly expanded
span and not a punctuation-endpoint hypothesis.

## Repairs reviewed

| Page | Affected result | Comparison with preserved native observations |
|---|---|---|
| 116 | FAIL, one term only | Comma after 之一 restored; initial 物体, split 物/体, 另外物体, later 物体, second-paragraph minima and 物理 restored. 物体 after 它是 remains plain. |
| 117 | PASS for affected changes | 机轴 corrected to native 机械; 物体 after 无论取什么 italic; footer 105 italic. |
| 118 | PASS for affected changes | Both line-74 物体 terms italic; split word across p open / fig / p cont correctly represented; footer 106 italic. |
| 119 | PASS for affected changes | Exact confirmed dotted additive span represented by strong markup; three minimum 物体 terms restored; footer 107 italic. |

Unchanged source wording, glyphs and formulas were checked for byte/line
preservation through the diff, not re-reviewed from source pixels.
No additional source facts, larger italic spans or body text changes were
introduced in the affected blocks.

116's profile SHA changed from the old recorded digest to the currently
installed soviet-cn digest
ae373713f7b09f810d6de1e4a12b5916710e5673e4827148c875674f847f1e81.
This is a finalization metadata refresh, not a source-text correction.
Source/PDF/page/dpi/render metadata is unchanged on all four pages.
The profile file was read for its digest only, never edited.

## Split emphasis representation

The source-page contract preserves physical rows but treats their body
line breaks as soft joins. The existing read-only blocks parser and text_of
helper were used to check these literal joins, without executing assemble,
finalize, rendering or producing a lesson.

- **116:** row 1 ends 因为*物; row 2 starts 体*与另外.
  Direct body-row joining gives 因为*物体*与另外. The italic markers
  enclose precisely 物体, not 因为 or the following words.
- **118:** p open ends 不管*物; the intervening figure retains its original
  marker and box; p cont starts 体*怎样. Joining the continuing prose
  gives 不管*物体*怎样. The source contract makes the figure transparent
  to this prose continuation, so its position does not enter the italic
  span or become a prose character.
- Both halves of each split occur in current page.json as well as page.md.
  Individual fragments intentionally carry an unmatched opening/closing
  marker; this is not an invalid source paragraph when the existing
  continuation contract is applied. Do not independently render a fragment
  and use that to invent a source-format defect.
- **119:** the strong span joins to exactly
  当两个或一些物体连结为一个物体时，它们的质量是相加的.
  因此 and its comma remain outside the span; the final period is inside.
  This matches the previously observed dot-emphasis endpoints. Strong
  markup is the established extraction representation, not a claim that
  the original dot-emphasized sentence was bold.

No row, block, continuation flag, caption-sharing flag or source figure
position was changed to accommodate emphasis.

## Wider endpoint uncertainty

**Nonblocking stylistic endpoint uncertainty, not a substantive SOURCE
blocking HOLD.** Exact wider punctuation-inclusive italic endpoints outside
the definite source term cores are still unapproved; no global typography
PASS is asserted.

The native observations established the minimum slanted term cores and,
separately, the additive sentence's actual dotted endpoints. They did not
establish an additional missing word or a required larger punctuation-
inclusive italic span. Current repairs do not widen those spans by inference.
Thus that residual stylistic uncertainty does not require another image,
arbitrary italic expansion or repeated unaffected review.

The remaining 116 term is different: its core 物体 was positively observed
as slanted and is still unmarked. That concrete omission alone keeps this
affected verdict FAIL. This distinction does not erase any original author
HOLD, the initial review FAIL or historical uncertainty.

## Read-only consistency and evidence

Changed one-based source blocks: 116 [3,4]; 117 [4,5]; 118 [3,5,8];
119 [1,3,4,7]. Parsed page.md metadata and block fields/lines agree with
current page.json. Compared with the first-failure snapshots, all block
types, counts, flags and physical body-row counts are unchanged.
Incoming n24 is unchanged and receives no semantic approval.

Parent's canonical repair-execution/{0116,0117,0118,0119}/execution.json
receipts specify the exact workdir, one finalize for the corresponding
page, exit_code 0 and retained stdout/stderr. Their stdout and current
audits show respectively 24/24, 24/24, 26/26, 25/25 with zero
normalizations and empty errors. This reviewer did not run those commands.
Mechanical PASS does not resolve the remaining source emphasis omission.

The source figure marker/box and caption flags are unchanged. This is a
structural diff observation only, not new figure approval.
Physical 120 and all other lessons are outside this affected comparison;
unchanged previously passed source evidence is not reopened.

Historical semantic approval of selected 116 and preexisting tracked
117/118 candidates remains UNKNOWN. No FIRST authorship claim is made.
Exact old author drafts, first-failure snapshots, existing receipts,
installer/dirty/staged files and prior review records remain untouched.

## Handoff

New files: affected-source-review-8p-n25.md and
affected-source-bindings.json, exclusively under this n25/source-review/.
The binding records the failed/repaired file hashes, initial evidence,
canonical repair receipts, affected verdicts and narrowly scoped uncertainty.
It is not a package hash or an additional review gate.

**New image loads: 0. Actual reviewer cumulative image loads: 8/24.**
No source page/crop/figure was reopened, and no extra image budget was used.
No authoring edit, assembly, finalizer, Git/DB/install/paid/browser/CUA,
message, new chat/tree, modern/science/figure/answer/choice approval occurred.
