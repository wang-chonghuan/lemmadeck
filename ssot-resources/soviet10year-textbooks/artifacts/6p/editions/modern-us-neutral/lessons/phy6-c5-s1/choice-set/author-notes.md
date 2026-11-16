# c5-s1 Choice Author Handoff

Status: AUTHOR COMPLETE PENDING INDEPENDENT REVIEW. This is not a semantic approval.

## Input and Sequence

- The official whitelist inspect and explicit seed prepare each ran once.
- All 12 original tasks were selected: 1, 2, 3, 4, g2-1, g2-2, g2-3, g2-4, 5, 6, g3-1, g3-2.
- Selected zero-based concept blocks: 0, 1, 6, 7, 8, 9, 11, 14, 16, 17, 18, 19. Worked examples were not selected as definitions.
- `source-solution.md` and its seed snapshot were frozen before a draft or pure view existed. Their original hashes remain binding; no source solution was revised to match options.
- No answer key, answer-author file, private source solution, old choice or interaction was consulted. The other agent's `main-source-first.md` was not opened.
- There are no seed figures, candidate figures or figure-observation claims. No browser, model service, network, DB or Git operation was needed.

## Actual Inventory and Coverage

The draft has 9 questions and 37 options: 5 native single-choice and 4 native multiple-choice questions. All 12 sources have explicit coverage entries; none is deferred.

| Question | Sources | Mode / Options | Response Unit |
| --- | --- | --- | --- |
| work-conditions-and-ice | 1, g2-3 | multiple / 4 | Nonzero-work condition and its frictionless horizontal-ice application |
| controlled-proportionality | 2 | multiple / 4 | Both controlled proportionality relationships |
| joule-name-and-definition | 3, 4 | single / 4 | One complete unit-name / operational-definition correspondence |
| five-situations-and-force | g2-1 | multiple / 5 | All five situations, with explicit force/object/displacement conditions |
| fable-work-and-usefulness | g2-2 | single / 4 | Mechanical-work versus useful-labour criteria without invented plot |
| two-lifting-results | g2-4, 5 | single / 4 | Both complete lifting calculations, including mass/length conversions |
| train-traction-work | 6 | single / 4 | Force balance followed by specified traction-force work |
| stairs-measurement-method | g3-1 | multiple / 4 | Required actual data, vertical-height method and model boundary |
| walking-textbook-estimate | g3-2 | single / 4 | Complete parameterized 0.05 estimate with kilometre conversion |

Each of the 37 options has a separate rationale. Every incorrect alternative identifies a reproducible wrong operation or invalid inference; correct alternatives have `misconception: null`. Those rationales are author claims for independent checking, not independent proof.

## Conventions and Limits

The selected seed does not supply a numerical g. The frozen source solutions therefore give the lifting and train results in terms of g. Two numerical question stems publicly add g=9.8 N/kg as a calculation convention, together with the stated ideal force-balance conditions. This is not represented as an original seed datum or as a rejection of other local-g solutions. Under that visible convention:

- Crane: 2500 kg x 9.8 N/kg x 12 m = 294000 J.
- Hammer: 20 t = 20000 kg; 120 cm = 1.2 m; work = 235200 J.
- Train: 3000 t = 3000000 kg; 5 km = 5000 m; traction = 0.003mg = 88200 N; traction work = 441000000 J.

Specified lifting/traction-force work is not resultant-force work. Opposite-direction gravity work is negative and perpendicular gravity/support work is zero.

All five everyday situations remain present. Door displacement and wall displacement/deformation are not invented. Climbing gravity is considered using the whole body's upward displacement, not treated as a claim about static hand/tree contact or all internal muscular work.

The fable retains the provided "耍弄木头" description. No trajectory, outcome or extra scene is invented; the question distinguishes physical and usefulness criteria without pretending to determine missing facts.

The two practical homework tasks remain complete in the read-only seed. Choices only recognize methods/expressions: they do not demonstrate actual weighing, height measurement, local-g acquisition, climbing, walking, personal calculation or notebook recording. No personal mass, floor height, observation or result was fabricated. Stairs use the actual vertical height difference, not the sloping route length or all metabolic energy. Walking retains the source-bound approximate 0.05 comparison, not a universal law, gravity's horizontal zero work or measured total body energy.

All groups lose free recall, independent derivation and/or open explanation to the extent recorded in their `intent.limitations` and each source's `coverage.omitted_tasks`. These losses are explicit, not evidence of practical completion.

## Mechanical Evidence and Review Boundary

`author-ledger.json` records the exact commands, timestamps, exits and log hashes. The structural validator is authorized only once, without `--review`; its actual exit and complete output are bound by `author-handoff.json`. No reviewed validator or semantic review is performed by this author.

The sole structural invocation exited 0 and printed: `mechanical checks passed; semantic review still required`. No author repair, failed command or repeated validator occurred in this choice task.

`view.json` is generated solely as `{questions: [{id, view}]}` from the final draft. It contains no source mapping, author intent, coverage, rationales or correct sets. The handoff independently binds its exact equality to that projection and the unchanged source-first snapshot.

Main's next step is pure-view blind review before opening the author draft/rationales. No `review.json`, retention, finalization or promotion is authored here.
