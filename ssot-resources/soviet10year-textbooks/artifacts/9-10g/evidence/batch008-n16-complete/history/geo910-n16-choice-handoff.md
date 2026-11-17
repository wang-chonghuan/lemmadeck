# n16 Choice Author Handoff

Status: **author draft present; structural validation blocked by source
snapshot drift; semantic review pending**.
This scratch handoff is not approval, retention, publication or a client payload.
The parent owns answer finalization independently; those answers were not read.

## Artifacts and Hashes

All paths below are relative to
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`.

| Artifact | File SHA-256 |
| --- | --- |
| `geo910-n16-choice-seed.json` | `39bbb19a6abf4f2615465b89d534e822e930e7cb9892eeb3367e478ecfcaca13` |
| `geo910-n16-choice-source-solve.md` | `4082b59f99a101df69b3139965c91baa202d799105af0c5c00e544a303d41658` |
| `geo910-n16-choice-learner-views.json` | `70ccae34f17fab314c138454eab0329c91411777d66771c6f3880c025f733829` |
| `geo910-n16-choice-draft.json` | `f08b33b66665a4d4dc7d3dcb914e691bf0c1d871be0f7f78e793af263c840e6a` |
| `geo910-n16-choice-images/fig-62-complete.html.png` | `2a24d9aebd19139ed3b33df2cf23600391bdd0446aff00c6e8af56ff08c7cfa9` |
| `geo910-n16-choice-images/fig-63.svg.png` | `e45398d6f440c7b353621d18f44401b68f077017eadffb383b1fc2a14e52bfa9` |

Canonical JSON digests (not formatted-file byte hashes):

- Seed: `59d912e291e3e89f3d965d408a680d9dbb0627c6f34575c070e4ed2f05f7b43d`.
- Draft: `bae379cc4496f01303dca016936e9e7daeb53431353ceb37664f66a55e4f74e1`.

The learner file is exactly the ordered array of all six draft `view` subtrees,
confirmed by parsed JSON equality. It contains no source numbers, intent,
solutions, key, correct set, rationales or coverage.
The source-solve checkpoint was created first, then the learner-only views,
then the internal draft. Options and rationales were manually authored.

## Questions and Options

IDs below have the prefix `geo910-n16-choice-`.

| ID suffix | Mode | Option IDs | Internal correct set |
| --- | --- | --- | --- |
| `164-proof` | single | a-d (4) | b |
| `165-same-pairs` | multiple | a-n (14) | d, f, i, k |
| `165-opposite-pairs` | multiple | a-n (14) | h, m |
| `166-distinct-witness` | single | a-d (4) | a |
| `166-common-opposite-proof` | single | a-d (4) | b |
| `167-support-origin-cases` | multiple | a-h (8) | a, d, f, h |

Six questions, 48 options; three native single units and three native multiple
units. Full stems and all options are in the learner-only views. Full internal
derivations for every option are in the draft.

## Coverage and Recognition Loss

- 164: all six pairs of a noncoplanar tetrahedron independently solved; neither
  direction relation exists. One complete proof judgment, not two bare yes/no
  targets. Original rays are not replaced with finite edges.
- 165: all eight literal rays, including C1D with endpoint D, in a general
  nondegenerate oblique parallelepiped. All 28 unordered pairs independently
  enumerated before options. The two disjoint 14-pair candidate pools cover all
  28 once and contain all four same-direction pairs and both opposite-direction
  pairs. AB/C1D is an opposite-direction distractor so changing D to D1 is
  detectable. No rectangular or equal-length assumptions.
- 166: the first unit uses three distinct ray sets with distinct origins 0,1,2
  and checks all three intersections before the nontransitivity conclusion.
  The second unit checks the arbitrary-ray proof via common-origin opposite
  uniqueness; it does not equate original ray sets.
- 167: all four support/origin cases retained: different parallel supports
  (coplanar and disjoint), same-support outward disjoint rays, same-origin
  opposite rays sharing one point, inward opposite rays sharing a nondegenerate
  closed segment. Skew, nonparallel crossing, coincident rays and a ray-shaped
  intersection are rejected alternatives.

Recognition loss is explicit in every relevant `intent.limitations` and in
`coverage.omitted_tasks`: no independent proof composition, invention of the
166 witness, free generation of pairing/classification lists, or independent
drawing is demonstrated. Each neither-direction pair in the partitioned pools
is tested against one nominated relation, not by separate written exclusions
of both relations. These are not claims of equivalent production ability.

## Images

Definition blocks selected: 1, 4, 10, 12. No worked construction/example
selected. Concept figures 62 and 63 alone were necessary for the two direction
definitions; 64 and 65 were not included.

Both actual SVGs were rendered and inspected. The complete-image observations
and their SVG byte hashes are in the pre-option source-solve checkpoint.
Four images loaded in one batch, including two unsuccessful/cropped attempts;
the final padded figure-62 rendering and complete figure-63 rendering are the
usable evidence. No new diagrams, no fabricated original for 164/165.
No figures are displayed in learner questions: the textual data suffice.

## The One Structural Validator Invocation

Run from `/Users/yong/.codex/worktrees/a07e/lemmadeck`:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-seed.json --draft .intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-draft.json
```

Exit status: **2**.
Exact output:

```text
contract error: seed projection/source/asset changed; prepare again
```

The seed was prepared only once. The validator was invoked only once.
Its suggestion to prepare again was NOT executed, in accordance with the
human's constraint. No second validator run or modified seed was produced.
This is not a structural pass; the validator stopped at the source integrity
boundary. No semantic review, self-review or review artifact was produced.

Post-failure hash-only diagnosis of the exact whitelist:

| Source | Prepared SHA-256 | Observed SHA-256 after failure |
| --- | --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json` | `34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7` | `d58eaec04808ebca8fe6ae4db279751432ccbd7629aaaca51caca93fe847b155` |

The finalized n16 `lesson.json`, `exercises.json`, `figures.json`, `fig-62.svg`
and `fig-63.svg` all remained byte-identical to the seed trace/assets. The
official `prepare.py inspect` projection after failure still showed the same
164-167 prose and selected definition text. No answer content was read to
diagnose drift. The source of the shared book-file change was not investigated
or attributed to another author's work.

## Boundaries

Only the assigned `geo910-n16-choice-*` scratch prefix was written.
No finalize, answers, old choices, interactions, precursor content, history
content, answer keys, database, environment, service/model, application,
dependency installation/change, Git, durable approval or publisher operations.
An initial filename lookup identified the book directory as `9-10g` after
`--book in9-10g` failed because that directory does not exist; the official
seed was subsequently prepared once for `9-10g`.

Next required coordination: the parent must reconcile the shared book trace
after concurrent finalization under its own authorization. The preserved
author snapshot and learner views can be handed to an independent reviewer,
but they are not approved and have not passed the source-integrity validator.
