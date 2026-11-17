# n97 Frozen Views-Only Ledger: Stage2

Reviewer: independent choice reviewer n97, STEMROBIN-184, 2026-11-17.
Status: Stage2 complete; WAIT for explicit Stage3.

## Snapshot Binding

Views: `../author/views.json`, raw-byte SHA-256
`30667c88c102bdcdc8a436747c413437edbfb271d3d4a90798c09971224b827f`.
Source seed canonical SHA-256:
`54cb3765d97f5f74b7dc26cf5ff7cfd2e5c552f9545a0582412e5f28e67cf091`.
Stage1 files remain unchanged:
`source-first.md` raw-byte SHA-256
`d56409b043adb7e0715e27e675f63a920d72f582411fdf77e9d2c68ac42437ac`;
`ledger.md` raw-byte SHA-256
`78384113f2161bf5133dc78237d9b0398aa574b4217541490aa47b1d86e55e45`.
Substantive fidelity evidence and all per-option calculations are in the new
`stage2-report.md`, not duplicated here.

## Independent Complete Option Inventory

Pointers below refer only to the views snapshot. Each option's exact pointer
is its row's `/view/options/` base followed by the zero-based index shown.
T/F is independent truth of the whole assertion, not an author key.

| Question | View pointer | Mode | All option indices and truths | Complete true set |
| --- | --- | --- | --- | --- |
| n97-392 | `/0/view` | multiple | A[0]:F; B[1]:T; C[2]:T; D[3]:F | B, C |
| n97-393 | `/1/view` | multiple | A[0]:T; B[1]:F; C[2]:T; D[3]:F | A, C |
| n97-394 | `/2/view` | multiple | A[0]:T; B[1]:F; C[2]:T; D[3]:F; E[4]:F | A, C |
| n97-395 | `/3/view` | multiple | A[0]:F; B[1]:T; C[2]:T; D[3]:F; E[4]:F | B, C |
| n97-396 | `/4/view` | single | A[0]:F; B[1]:F; C[2]:T; D[3]:F | C |
| n97-397 | `/5/view` | multiple | A[0]:F; B[1]:T; C[2]:T; D[3]:F; E[4]:T | B, C, E |
| n97-398 | `/6/view` | single | A[0]:F; B[1]:T; C[2]:F; D[3]:F | B |
| n97-399 | `/7/view` | single | A[0]:F; B[1]:T; C[2]:F | B |
| n97-400 | `/8/view` | multiple | A[0]:T; B[1]:F; C[2]:F; D[3]:T | A, D |
| n97-401 | `/9/view` | single | A[0]:F; B[1]:F; C[2]:F; D[3]:T | D |

Total: 10 questions, 42 options, 17 true and 25 false assertions.
Every option has a substantive calculation or valid counterexample in the
report. All four single-mode questions have one true option; all six
multiple-mode questions have nonempty complete true sets.

## Source Obligations and Recognition Limits

Source references retain the Stage1 seed JSON pointers. The following are
independent visible relationships, not claims about an unseen coverage record.

| Source tasks and exact seed reference | Visible mathematical evidence | Retained limit of assessment |
| --- | --- | --- |
| 392.a/b, `/exercises/0/text` | n97-392 B covers cube-root quotient factorization; C covers the sine increment and constant cancellation. | Final $h\to0$ limits and explicit primitive conclusions are not requested; full written proof is not assessed. |
| 393.a/b, `/exercises/1/text` | n97-393 A retains $u+v$ after factorization; C retains the minus-cosine increment signs. | Final limits and explicit primitive conclusions are not requested. |
| 394.a/b, `/exercises/2/text` | n97-394 A tests chain differentiation; C tests tangent quotient differentiation; D tests excluded poles. | Derivative arguments are recognized, not independently produced as full proofs. |
| 395.a/b, `/exercises/3/text` | n97-395 C tests the radical inner factor; B tests negative cotangent differentiation; E tests excluded poles. | Full written derivative simplification and proof production are not required. |
| 396.a/b, `/exercises/4/text` | n97-396 C covers both fixed constants, the positive reciprocal derivative on both half-lines, and zero's exclusion. | One complete-assertion selection replaces two written proofs. |
| 397.a/b, `/exercises/5/text` | n97-397 B and C cover the two branches; E contrasts the zero cusp with the open intervals. | Branch-based proofs and the one-sided limits are supplied for recognition. |
| 398, `/exercises/6/text` | n97-398 B simplifies to $x^4/4+1/4$ and differentiates to the cubic. | Construction and stating the whole $+C$ family are not elicited. |
| 399, `/exercises/7/text` | n97-399 B simplifies to $x^5/5+1/5$ and differentiates to the quartic. | Construction and the whole $+C$ family are not elicited. |
| 400, `/exercises/8/text` | n97-400 A and D simplify to $x^2/2+1/2$ and $x^2/2+2$. | Two constants illustrate nonuniqueness but do not require constructing the full family. |
| 401, `/exercises/9/text` | n97-401 D has derivative $5/2$ for every real $x,C$. | The stem supplies mixed-numeral conversion; the family is recognized rather than constructed. |

All sixteen source tasks retain mathematical evidence at the recognition
level. No source task is silently treated as fully reproduced. The report
records fidelity, redundancy, and leakage before its independent option
mathematics. Shared methods across questions are learning transfer; no exact
cross-question answer disclosure was found.

## Screenshot and Evidence Ledger

Exactly two original screenshot assets were opened, once each:

- `../../offline/ana10-c7-s1-n97/choices-1440.png`, raw-byte SHA-256
  `6db80510322736f6518abfcc4ff4fcc07ad7f9cf20fb578708cb1fbbffc50c6e`;
  stored PNG 1440x5159. Full stack through question 10 D was visible.
  No display-ratio certification was supplied.
- `../../offline/ana10-c7-s1-n97/choices-390.png`, raw-byte SHA-256
  `6944388995e37050250eac4b0b2c342ef5571937c6e9a667a20e4f63d993ad51`;
  stored PNG 390x6979, explicitly resized by the tool to 335x6000.
  Wrapped formulas and the full stack were observed; fine-detail readability
  and every local overlap are not certified.

Existing `../../offline/ana10-c7-s1-n97/choices-report.json`, raw-byte SHA-256
`ecc2b708545100f6eec2223f2ba9ab3606bd6d19cee7b49f71580b0216fb1176`,
reports 42 option boxes within each viewport width. It was read, not rerun;
its `pass` is not a substitute for mathematical or fine-detail visual review.

Permanent image usage is now 2/8 batch, 2/24 context. No crop, reopen, image
reset, new browser task, renderer, validator, or test was used. No author
internals were read. Only the two new Stage2 reports were written.

## Stage3 Boundary

Still pending: compare independent true sets to author keys and all rationales;
check actual misconception derivations; check internal source coverage and
explicit capacity-loss disclosure; distinguish any author claim of complete
proof from the visible proof-step limits recorded here.
No final aggregate candidate verdict is issued in Stage2.
Keep both Stage1 and both Stage2 files immutable after hash freezing.
STOP. WAIT for explicit Stage3 internals.
