# STEMROBIN-180 B84 n73 Offline Choice Author Handoff

Status: author draft delivered; one no-review mechanical validation passed.
Semantic approval is pending the parent's independent reviewer. No self-review
or semantic-approval artifact was produced.

Every executed shell command used the explicit working directory
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.

## Artifacts and Freeze Order

All paths below are relative to that working directory.

- Immutable source: `.intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/seed.json`
- Frozen independent solutions: `.intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/source-solutions.md`
- Freeze receipt: `.intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/source-freeze.json`
- Authored draft: `.intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/draft.json`

All four full source tasks were solved independently in `source-solutions.md`
before options were authored. At the freeze observation,
`2026-11-18T23:01:00.283298+00:00`, `draft.json` did not exist.
The frozen solution bytes were rechecked after draft creation and validation.
The existing seed's canonical digest and byte digest also remained unchanged.

The seed alone supplied the written prose and selected definition paragraphs;
no further modern-prose inspection was needed. Selected concepts are not source
answers. No prepare/inspect rerun was made.

## Complete Hashes

Digest conventions: canonical JSON uses the contract's sorted ASCII JSON with
compact separators; file hashes cover actual bytes.

| Artifact | Kind | SHA-256 |
| --- | --- | --- |
| `seed.json` | canonical | `b4c934cc9b34dc55fda7cfc98bbd4b7f3f3272cb122aca8d8a323963f8744f00` |
| `seed.json` | bytes, 4540 | `6b6c0364b9fee10c573e8c9c97ebad2ddd7722fde29b62dd1b535ef882245c72` |
| `source-solutions.md` | bytes, 11555 | `ed0ec8d561625fe8194205ea53354e785b8654cc791d2640c76a9a56160349b6` |
| `source-freeze.json` | canonical | `8a15dce7c5a04229acc0de0b4e68d740e2bfacbe0b68624a0348ad62b0bb8c4b` |
| `source-freeze.json` | bytes, 596 | `352fb56445a99ea878a8764ddfb2086fbe33411284ddcbd1c507c7b03256ed97` |
| `draft.json` | canonical, review-binding | `88ec77f258023bc3e91d01abfcfcdc8b56aa9d9703ca143754c9e35fa180bbd8` |
| `draft.json` | bytes, 22110 | `b4d4d53e76629779b0dc0f265395fac0f2f672a7fe51cec95600ff3b51c78430` |

## Counts

- Full written tasks retained: 4 of 4.
- Full source tasks independently solved before options: 4.
- Choice questions: 3, comprising 2 native single and 1 native multiple.
- Options: 11; author-keyed true options: 4; author-keyed false options: 7.
- Source tasks with questions: 1, 2, 3; deferred source: 4.
- Selected definition blocks: 2, 5, 8; worked examples selected: 0.
- Source images: 0; new images: 0; image observations required: 0.
- Validation executions: 1, without review. Semantic reviews/approvals by author: 0.

These are draft counts, not an independently established correct set.

## Coverage and Response Units

| Source | Question | Mode / Options | Definition blocks | Coverage |
| --- | --- | --- | --- | --- |
| 1 | `n73-q1-solar-to-furnace` | single / 4 | 2, 5, 8 | One continuous solar-water-cycle-reservoir-flow-turbine-generator-furnace chain, including the destination of actual losses. |
| 2 | `n73-q2-fall-and-collision` | multiple / 4 | 2, 8 | Complete descent/contact/post-contact accounts under separately stated drag/non-rebound and ideal no-drag/elastic models. |
| 3 | `n73-q3-alex-hammer-chain` | single / 3 | 2, 8 | Whole body-energy/lifting/descent/impact chain; permits release alone or additional downward muscular work, without counting gravitational work twice. |
| 4 | none | deferred | 8 supports only the invariant | Full written task and corrosion warning retained; no uniquely keyed reaction/constraint partition invented. |

Source 1 uses definition 5 for mechanical-to-electrical generator direction,
2 for dissipative internal-energy transfers, and 8 for losses not being
destruction. The solar-driven water cycle and high-level water storage are
independently reasoned connections, not supplied answers.

Sources 2 and 3 use 2 for possible dissipative destinations and 8 for including
the affected surroundings in the energy account. They do not use unrelated
generator definition 5. Definition 2 does not exclude temporary elastic storage,
rebound or other transfer pathways.

No source was split into per-stage or per-cell clicks. No fixed option/question
quota was used. The chosen alternatives are complete process explanations.
All seven incorrect alternatives have explicit reproducible mistaken procedures
in their internal rationales, not arbitrary adjacent claims. Character-count
ranges are 91-96 for source 1, 75-87 for source 2, and 97-103 for source 3.
These lengths are mechanical observations, not an answer-leakage approval.

### Capacity Losses

Recognition does not establish the ability to independently write any of the
three complete explanations. Source 2 also has explicit vertical-motion,
initial-rest and fixed-ground model boundaries; it does not independently
assess other target-motion/collision branches or the learner's own model
selection. Source 3 retains both release and continuing downward muscular work,
but explicitly neglects air resistance. No energy fractions or efficiencies
were fabricated.

Source 4 is fully retained in the immutable seed and frozen source solution.
Its missing deformation constraint/release sequence, specific reaction and
thermal/mechanical boundaries prevent a unique final destination or partition.
The dissolution reaction has its own chemical-energy change; a temperature rise
cannot simply be assigned to the original elastic energy. A freely relaxing
spring and a constrained reacting spring need not take the same energy pathway.
Adding the missing conditions would change the task, while asking only whether
energy disappears would reduce it to copying definition 8. The distinctive
destination/partition reasoning is therefore explicitly deferred, not resolved
by a trivial definition question. There are no acid-handling or experimental
instructions.

## Validation Evidence

Exactly one invocation, with the existing parent recorder and unique label:

```bash
node .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/record-command.mjs b84-n73-choice-validate-author python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/draft.json
```

Recorded start: `2026-11-18T23:06:11.927Z`.
Recorded finish: `2026-11-18T23:06:11.963Z`.
Return code: `0`; stderr: empty.

Exact stdout:

```text
mechanical checks passed; semantic review still required
```

All three receipts are under
`.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/`:

| Receipt | SHA-256 |
| --- | --- |
| `b84-n73-choice-validate-author.call.json` | `ecd522eb33835e8ac26770889e9886942746e0eaf29789761ca1154fc56c430a` |
| `b84-n73-choice-validate-author.stdout` | `1c46f6519fd9f330b0c6109ab08c85474ff02f961f0fb5eb11550590e646f90b` |
| `b84-n73-choice-validate-author.stderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

## Diff and Boundaries

Filesystem change account, not a Git operation:

- Added `source-solutions.md`, `source-freeze.json`, and `draft.json` only within
  the owned `tmp/b84-n73-choice/` directory.
- Added this owned `choice-author-n73-b84.md` report at the ticket root.
- The required existing parent recorder created only the three uniquely labeled
  receipts listed above; its source file was not edited.
- Seed remained byte-for-byte unchanged. No modern/canonical lesson, book,
  exercise, figure or retained choice artifact was edited.
- No preexisting file was overwritten or removed. Concurrent agents' work was
  preserved; no global state or Git diff was inspected.
- No old choices, answers, interactions, history, skill tests, DB, `.env`,
  services, paid calls, app edits, Git operations, publishing, images,
  descendants or cross-chat messages were used.

The independent parent reviewer must supply the semantic verdict for the exact
draft canonical hash above. Structural success is not semantic approval.
