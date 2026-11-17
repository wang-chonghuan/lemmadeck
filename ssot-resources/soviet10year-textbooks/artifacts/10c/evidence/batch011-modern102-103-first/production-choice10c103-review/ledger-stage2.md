# STEMROBIN-184 / SessionB / 10c n103 / Stage2 Disclosure Ledger

Status: FROZEN Stage2 view-only ledger; WAIT for explicit Stage3 internal disclosure.
Date: 2026-11-17 (Europe/Dublin).
This is a staged evidence ledger, not `s10y-choice-review-v1` or a final verdict.

## Snapshot Bindings

| Item | Binding |
| --- | --- |
| Root | `/Users/yong/.codex/worktrees/a07e/lemmadeck` |
| Authorized view-only input | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/view-only.json` |
| Supplied and independently computed canonical view SHA-256 | `70c9db907d932eab9c3155dd33b2227893580f549822322b4fdaf4d17f915d9d` |
| Supplied and independently computed raw view SHA-256 | `28863c65f5e2e3d83d496e61ca33f3cb2e36623d8f67daa8a2b1b7dd2e08f77b` |
| Previously authorized seed canonical SHA-256 | `02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf` |
| Existing frozen source-first byte SHA-256 | `ac24683f10dfb608428a46fcdc15c56d5b76951c882d316efba0c3c4a269348f` |
| Existing frozen Stage1 ledger byte SHA-256 | `b2f723f3ddd8bf8d6d101ce20c58486b234e8cc2ff890dabc09d9af5a7e3f730` |
| Stage2 evidence path | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/stage2-view-only.md` |
| Frozen Stage2 evidence byte SHA-256 | `a17103c59e9deaf8c29d303f1abc49fe55e2c4990815d8b74642bf9fbed6ac80` |
| Stage2 ledger path | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/ledger-stage2.md` |
| Stage2 ledger byte SHA-256 | Returned externally at freeze; not self-embedded. |

The view digest was computed from only the authorized JSON file, using recursively sorted keys, compact JSON, ASCII escapes for non-ASCII characters, and SHA-256 of UTF-8 bytes. The raw digest hashes its actual file bytes. No source freshness check, prepare/refresh rerun, validator, or test was invoked.

## Authorization and Exposure Sequence

1. Stage1 had already been frozen and handed off with both file hashes.
2. The user reported that the parent fully consumed the entire frozen source-first and Stage1 ledger before disclosure. This is recorded as a user statement, not a read of a parent's reasoning or other interactions.
3. The user expressly authorized the sole exact Stage2 view-only file and the already frozen seed. No internal artifact disclosure was authorized.
4. Read the exact view-only file. Its four ordered entries expose only mode, stem, figure references, and options. No question IDs, internal fields, or source mapping were present.
5. Assessed source-task fidelity, redundancy, answer-pattern leakage, and cross-question relationships separately from option mathematics. All source correspondence was independently inferred from the displayed prose and previously authorized seed, not read from hidden metadata.
6. Independently derived each visible task and checked all eighteen alternatives, including every required tuple/table entry and the complete domains of conditional statements.
7. Computed both view digests and confirmed their supplied values. Existence checks were limited to the two requested new output names; both were absent.
8. Created `stage2-view-only.md` through `apply_patch`, then computed its byte hash and froze it.
9. Created this ledger through `apply_patch`, binding the already frozen Stage2 evidence. The next and last planned operation is hashing the two Stage2 outputs for handoff.

The already frozen Stage1 files were not edited. No pre-existing peer file was read, overwritten, removed, or modified. Only the two requested new Stage2 Markdown files were created.

## Disclosure State at Stage2 Freeze

| Evidence | State |
| --- | --- |
| Seed and selected definitions | Already authorized Stage1 baseline |
| Ordinal 1-4 visible stems, modes, and options | READ |
| Source/draft question IDs | UNKNOWN / NOT DISCLOSED |
| Author source-mapping metadata | NOT READ |
| Author draft | NOT READ |
| Author source-solutions or intent | NOT READ |
| Author judging key or complete correct set | NOT READ |
| Author option rationales or misconception derivations | NOT READ |
| Author limitations or coverage declarations | NOT READ |
| Standard answers | NOT READ |
| Previous choices or interactions | NOT READ |
| Prior/final review artifact | NOT READ / NOT CREATED |
| Validation output | NOT READ / NOT GENERATED |
| Source or authored images, screenshots | NONE OPENED; ZERO images |
| Other ticket artifacts | NOT READ |

The mathematical true sets in the Stage2 evidence are independently derived, not disclosed keys. Any claim that they agree with an author remains UNKNOWN until Stage3.

No browser, image rendering, model service, dependency install, DB/publisher/app operation, source/edition edit, Git action, prepare/refresh rerun, validation, test, or full-test command occurred.

## Frozen Independent Mathematics

| Visible ordinal | Visible mode | Option checks | Complete independent true set |
| --- | --- | --- | --- |
| 1 | `single` | A false, B false, C true, D false | `{C}` |
| 2 | `single` | A false, B true, C false, D false | `{B}` |
| 3 | `multiple` | A true, B false, C false, D true, E true, F false | `{A, D, E}` |
| 4 | `single` | A false, B false, C false, D true | `{D}` |

Eighteen options checked: six true, twelve false.

Key independent findings:

- Ordinal 1 supplies initial vertical component, positive `v0`, nonnegative but unknown `h0`, and a launch-relative rise reference. Its plus-root time retains the unknown height. No zero horizontal component or ground-launch convention was invented.
- Ordinal 2's velocity is nonnegative on `[0,5]`; distance is `979/8` and endpoint acceleration is `977/100`, in compatible units.
- Ordinal 3 is universally/conditionally quantified, not a numeric instance. Under strict reversal, `F_star = -a^4/(6R^3)` and `S = |F_star| + |D-F_star|`; E is the full-distance identity, while F is only the second leg. The no-reversal domain permits negative velocity, which invalidates C and requires D's absolute value.
- Ordinal 4 was checked as identities in `x` and arbitrary constant `v`. No concrete value of `v` was assigned. Both correct accelerations contain `v^2`.

## Fidelity and Leakage Register

| Issue | Frozen view-only evidence | Stage3 status |
| --- | --- | --- |
| Ordinal 1 source velocity scope | Visible question asks apex vertical component, whereas source wording says unqualified velocity. The qualification is explicit and does not imply zero total speed for a nonvertical throw. | Check declared intent/limitations; internal treatment UNKNOWN. |
| Ordinal 1 component-frequency route | Each coordinate of the independently true C tuple is the unique most frequent displayed value. Counting components identifies C without the projectile mathematics. | Preserve provisional `revise` leakage finding; no author-key knowledge used. |
| Ordinal 2 component-frequency route | B uniquely combines the most frequent distance and acceleration values; that route matches the independently derived true pair without calculus. | Preserve provisional `revise` leakage finding. |
| Ordinal 3 full sign coverage | Complementary no-reversal/reversal conditions plus the universal acceleration identity cover the unrestricted real-parameter task. | Compare declared coverage and rationales; no view-only omission found. |
| Ordinal 4 recognition/partial elimination | Checking only the parabola acceleration can select the unique general table without evaluating every cell. This is relevant mathematical elimination, not automatically a failure. | Check honest production-loss declaration; do not infer it from unseen intent. |
| Cross-question mathematical dependence | No displayed answer is necessary input to another view; common coefficients/concepts do not expose another answer. | Author mapping still UNKNOWN. |
| Package-level pattern risk | The same non-mathematical modal-component route reaches the independently true alternatives in both ordinals 1 and 2. | Keep leakage evidence distinct from correct mathematics. |

All eleven Stage1 task categories have visible counterparts, with ordinal 1's component qualification reserved. No final source coverage verdict or author limitation agreement is assigned.

Recognition and mathematical elimination do not automatically fail the semantic gate. The specific ordinal-1/2 finding instead concerns an actually successful non-mathematical frequency route in this frozen snapshot.

## Stage State

| Stage | State |
| --- | --- |
| Stage1 source-first | COMPLETE, FROZEN, UNCHANGED |
| Stage2 view-only | COMPLETE, FROZEN |
| Stage3 internal comparison | NOT DISCLOSED / NOT STARTED |
| Final review | NOT CREATED |
| Validation / tests / prepare reruns | NOT RUN |
| Images | ZERO |

There is no final package verdict. Independent mathematical determinacy and the separate provisional leakage findings are retained together; one does not erase the other.

## Next Authorized Gate

WAIT for explicit internal disclosure naming the permitted artifact and snapshot.

After such authorization, compare the frozen source and view mathematics with the disclosed author solution, key, every rationale, and claimed misconception procedure. Check whether the declared limitations/coverage honestly account for the actual visible qualifications and production losses. Do not read or discover those fields now.

Keep all Stage1 and Stage2 records unchanged after disclosure. New comparison evidence belongs in a separate Stage3 record. If the views are repaired, that is a new snapshot requiring new bound evidence, not permission to rewrite these pre-internal conclusions.

No final review is authorized before all stages are complete. Handoff is TEXT, full paths, and hashes only; no image payload.
