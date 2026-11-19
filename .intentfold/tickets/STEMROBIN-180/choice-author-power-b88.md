# B88 power choice author handoff

`STEMROBIN-180`, invocation `180-3`, `2026-11-19`.
AUTHOR only, offline. Structural validation passed once; semantic review was
not run and no semantic approval is claimed.

All shell cwd:
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.
No source, application, other author's output, or existing edit was modified.
No Git, web, model service, paid service, DB, publisher, or dependency operation.

## Handoff

Author directory: `.intentfold/tickets/STEMROBIN-180/tmp/b88-power-choice/`.

- `seed.json`: exactly nine current modern written exercises
  `1,2,3,4,5,g2-1,g2-2,g2-3,g2-4`; definition blocks
  `2,3,4,5,6,8,9,10,26,27`, excluding worked examples.
- `source-solutions.md`: full independent solutions written before options.
- `draft.json`: eight questions, six native single and two native multiple,
  33 options, nine coverage rows, internal derivations and losses.
- `view-only.json`: exactly the ordered array of question `view` subtrees,
  mechanically matched to the draft, without internal source mappings or keys.
- `author-report.md`: exact commands, timestamps, assumptions, losses, and
  full source/seed/draft/view literal and canonical hashes.

Original written questions: `12`, unchanged. The three `g3` investigations are
excluded from the seed and deferred as original written tasks. No substitute
measurements, equipment models, nameplates, or vehicle data are fabricated:

- `g3-1`: climbing and obtaining the learner's own mass, height, and slow/fast
  times remain hands-on work, not demonstrated by these choices.
- `g3-2`: locating workshop equipment and reading real motor nameplates remain
  hands-on work, not demonstrated by these choices.
- `g3-3`: identifying known/seen vehicles and obtaining/evaluating their real
  engine-power information remain investigation work, not demonstrated by these
  choices.

Other production losses: selection does not establish independent definition
writing, algebraic derivation, numerical calculation, or full modeling prose.
These losses are named in intent and coverage.

The modern source remains byte-for-byte unchanged. The textbook's horsepower
conversion remains 736 W. Average power and elapsed-time conversions remain
explicit. Both gravity-dependent source tasks were solved with symbolic `g`,
then branched at 9.8 and rounded 10 N/kg; the authored stems explicitly select
9.8, losing open convention choice rather than silently rounding.
Engine-work stems explicitly use actual operating power. The conveyor item
determines useful average lifting power but leaves real motor input numerically
undetermined: no efficiency or lossless-real-motor assumption is invented.

Source images `0`; new figures `0`. All nine exercise references are empty; the
unreferenced table was not needed. Answers, old choices/interactions/tests,
other ticket outputs, and prior source-solve reports were not read.

## Calls and Result

Recorder:
`tmp/b83-n65-raw-and-text/record-command.mjs`, invoked once under each label:

- `b88-power-choice-inspect`: `prepare.py inspect`, exit `0`.
- `b88-power-choice-prepare`: `prepare.py prepare` with the explicit nine
  exercise selectors and ten definition selectors above, exit `0`.
- `b88-power-choice-author-validate`: `validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b88-power-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b88-power-choice/draft.json`,
  exit `0`; no review argument and no rerun.

Validation output: `mechanical checks passed; semantic review still required`.
Each label has `.call.json`, `.stdout`, and `.stderr` evidence in the recorder
directory. Three substantive tool calls total; one separate read-only
projection/count/hash audit and one recorder/timestamp read. Model, web, image,
DB/app/publisher, paid, dependency, and Git calls: all `0`.

## Exact Hashes

SHA-256. Literal means actual bytes. Canonical means sorted ASCII JSON with
compact separators, as specified by the offline contract.

| Snapshot | Literal | Canonical |
| --- | --- | --- |
| Seed | `c35fe3588a66feb15a54069d2d3a09df15a2029ace843ba5a31ad40083e2f506` | `d90e341cae7a9f167991e3087b33ab5bde48493b5c575668cdd59b2a5a15e8f8` |
| Draft | `9795e2c3e502c12ec4ee5f82d94e0e07d293a3f0bd22216a881efc5fae159200` | `c24f91909fb2ce8e88d66da1e07560995b83fc3fb6a560cb49809d38032fcb9e` |
| View-only | `030bf191b0649b468d5f2af2b8760b82d1011c1f90cdd06b71723124c93d52c3` | `f4e15151ff3752dbf2cd6a773976e081b3960d28c315a5ec298d9824ba544e81` |

Source modern lesson root:
`ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c5-s2/`.

| Source | Literal | Canonical |
| --- | --- | --- |
| `lesson.json` | `e3ed92bb158265d249c7cb13f5d07d7741df113252cc21743adb8a6eb6ca380e` | `9bc87b600ac3db1aab8dadbef40418090f470297c9ad5d47b14218f89ba9326f` |
| `exercises.json` | `2cfb8a4298b13767ce477f1a219dcb5d492224b6c8d36719faa651205525c615` | `553954df288a764364a0283e7505ff738a151ff4eb78ae491fad4f82065c790e` |
| `figures.json` | `0759e7d30299b25cc1805664e50f351f38fa2a7b4fd620270275835d00862911` | `82b12cc1cf960ce1a33311cd8f4ec13e4ccbe982388abfd239e4c273f1ea2f41` |

`6p/book.json` supplemental full-file literal:
`1e9a6c4518880614320620244597b3612dab48a7d11c22745c80ec6ca178241f`.
Full-file canonical:
`4fa7f163b9a190a74fed82700fc958bf9a92d3b604537281dd75d7231f5b7d66`.
Authoritative selected-membership canonical book trace:
`5f85da405f54252f4012c3a3b863f6a1e6c55c299af74de2779720508af03447`.
Whole-book hashes do not add a semantic dependency on unrelated lessons.

Source-solutions Markdown literal:
`5d5ab9a773b79d1ec8e828ad58a6fed80ae31397ede4d094f498023ee69fa167`.
No JSON canonical hash applies to that Markdown file.

## Boundary

Stopped at AUTHOR. Task fidelity, redundancy, cross-question leakage, and
mathematical truth still await semantic review. No review file, semantic pass,
publication, app payload, or written-task replacement is claimed.
