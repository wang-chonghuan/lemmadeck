# B84 n73 Independent ANSWER + CHOICE Review

**PASS.** One substantive independent review, no concrete question or answer
defects found. Four original written tasks were independently solved first;
all eleven visible options were solved next. Author solutions and keys were
opened only after both blind solutions and hash receipts were frozen.

Worktree: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Ticket: STEMROBIN-180, existing cap3 invocation; no setup or update.
Scope: 8p / modern-us-neutral / phy8-c4-s2-n73, zero images.
No source or whole-TEXT review/rebuild was performed.

## Blind Order and Actual Freeze Hashes

1. Read seed.json and its selected definition prose (blocks 2, 5, 8), not
   the view or any author solution/key. Solve all original tasks 1-4.
2. Freeze `tmp/b84-n73-combined-review/source-solutions-blind.md`, then
   create source-freeze-receipt.json at **2026-11-18T23:10:48Z**.
   SHA-256: `3e607418b55df6b673005be1e1f3df01a4b5d9177aabcfc1bf2e6d4e56546acb`.
3. Only then open view-only.json; judge fidelity/redundancy/leakage, solve
   all three questions and all eleven alternatives, determine complete sets.
4. Freeze `tmp/b84-n73-combined-review/view-solutions-blind.md`, then
   create view-freeze-receipt.json at **2026-11-18T23:12:03Z**.
   SHA-256: `766a8f651b667aca6514c9b3104b172b0bdc0c6a86d853651c7463d5145410c3`.
5. Only afterward open draft.json, author source-solutions.md, rationales,
   coverage and the canonical n73 answer-keys.json. Compare without changing
   either independent solution. Both frozen file hashes remained unchanged.

## Choice Findings

The visible projection is exactly equal to the reviewed full draft's
id/source_numbers/view projection. Counts: **3 questions, 11 options,
2 single, 1 multiple**. Every option truth and each author's misconception
procedure was checked, not just the keyed options.

| Question | Verdict / Complete Set | Tight Pointer and Substantive Check |
| --- | --- | --- |
| n73-q1-solar-to-furnace | PASS / C | draft `/questions/0/view/options` and `/key/rationales`: A reverses generator direction, B mislabels elevation storage as internal energy, C connects solar water cycle -> potential -> flow/turbine mechanical -> electrical -> furnace internal energy/heat, D deletes losses from the energy ledger. |
| n73-q2-fall-and-collision | PASS / A,C | draft `/questions/1/view/options` and `/key/rationales`: A includes real drag and stopping-impact destinations, B incorrectly dissipates an unrecoverable part in a perfectly elastic model, C recovers elastic contact storage and original height under stated ideal conditions, D omits negative drag work. |
| n73-q3-alex-hammer-chain | PASS / B | draft `/questions/2/view/options` and `/key/rationales`: A counts W_g and -delta U_g as separate inputs (2mgh counterexample for release alone), B uses delta K=-delta U_g+W_Alex and includes chemical lifting work/impact, C assigns nonzero stored kinetic energy to a stationary elevated hammer. |

Fidelity, redundancy and leakage all PASS, judged before key disclosure.
Every alternative is a complete process explanation, not an isolated label
click. q1 tests water-cycle and electrical direction; q2 compares stated
real/ideal fall and collision models; q3 tests bodily chemical work and
gravitational double counting. Related conservation ideas do not make these
three tasks interchangeable. Shared wording/length does not disclose a
key; correct physical data still leave substantive alternative comparisons.

## Answer Gate 2 Findings

Canonical answers have exercise identifiers 1-4 exactly once, all
`source=derived`, `grading=ungraded`, `parts=[]`; no bookRaw is provided or
claimed. No invented deterministic expected values or auto-judging.

| Answer | Verdict | Tight Pointer and Full Written-Task Check |
| --- | --- | --- |
| 1 | PASS | answer-keys `/answers/0/displayAnswer`: solar evaporation/atmospheric water cycle supplies elevated water; water-Earth potential -> water kinetic -> turbine mechanical -> generator electrical -> furnace internal energy; explicitly a main path, not all solar input. |
| 2 | PASS | `/answers/1/displayAnswer`: ideal no-drag kinetic increase, real resistance/internal-energy transfer and post-impact deformation/internal energy/vibration/sound, with unspecified time/conditions and full-system conservation. No fabricated single partition. |
| 3 | PASS | `/answers/2/displayAnswer`: Alex chemical energy and muscle work in lifting, increased gravitational potential, falling kinetic energy plus optional active downward input, and hammer/anvil/environment impact destinations with optional rebound. All three original stages retained. |
| 4 | PASS | `/answers/3/displayAnswer`: loss of strain-supporting structure does not destroy elastic energy; allows internal energy and prior motion/vibration; separates acid-metal reaction energy from elastic storage; identifies unknown metal, fixing, reaction and heat-transfer conditions; no invented all-heat destination, fractions or final temperature. Theory-only corrosivity warning retained. |

These are complete explanatory display standards, not inputs that can be
reliably judged by exact/numeric/expression logic. The MathLive exact-input
gate is inapplicable because no exact part exists. Status remains `draft`;
parent finalization is still required, not silently performed by this review.

## Capacity and Deferral

Draft `/coverage/0..2`, corresponding `/intent/limitations`: choosing supplied
complete chains does not prove autonomous written explanation or derivation.
q2 openly limits collision paths to vertical motion and fixed overall ground;
no unprovided energy shares are fabricated.

Draft `/coverage/3`: source 4 choice conversion is explicitly deferred,
with no question_ids and two substantive omitted-task entries. Adding a
release/constraint/reaction protocol changes the original task; asking merely
whether energy disappears would copy definition 8 and lose the dissolution
reasoning. This deferral is allowed by the current review request. Its full
written task remains in seed.exercises[3], its complete author written
solution in source-solutions.md / Source 4, and its retained derived/ungraded
standard in canonical answers[3]. It is not a missing written answer.

## Bound Snapshot Hashes

Hashes use contract canonical JSON (sorted keys, ensure_ascii, compact
separators) and exact file bytes respectively.

| Artifact | Canonical SHA-256 | File SHA-256 |
| --- | --- | --- |
| seed.json | `b4c934cc9b34dc55fda7cfc98bbd4b7f3f3272cb122aca8d8a323963f8744f00` | `6b6c0364b9fee10c573e8c9c97ebad2ddd7722fde29b62dd1b535ef882245c72` |
| view-only.json | `b2834dce961270324bb4c41996d89e9bbd949730532f3756bc92e6c590badff3` | `5859ce810819510374afc3c7bf14e94a18f0174d5443f6ebfd9050501574c7ca` |
| draft.json | `88ec77f258023bc3e91d01abfcfcdc8b56aa9d9703ca143754c9e35fa180bbd8` | `b4d4d53e76629779b0dc0f265395fac0f2f672a7fe51cec95600ff3b51c78430` |
| canonical answer-keys.json | `4533382d2f1f4685ddf1f5bc9d98ae6259c2e9d8e713f0131fe128882a23d61e` | `aad604306aaff696cf41a917289b0df724a7f33bb5cb17d81402d28dc0ac00a4` |
| independent review.json | `f583ec15fb7a4ab221af974b8a3cc3607d0ff107fb07a591f3ae1b9cc2bce178` | `74bd84924e0d5a6b0612aff1a8664027ee2fcfcd9cdd8e6446f867b01f0bbaaa` |

Author source-solutions.md file SHA-256:
`ed0ec8d561625fe8194205ea53354e785b8654cc791d2640c76a9a56160349b6`.
All input file hashes were unchanged after the official validation.

## Actual Official Call

The substantive answer comparison and review.json were complete before
running this command **once**, with the existing recorder and a unique label:

```bash
node .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/record-command.mjs b84-n73-choice-validate-independent python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/b84-n73-choice/review.json
```

Actual recorder cwd: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Started: `2026-11-18T23:15:28.187Z`; finished: `2026-11-18T23:15:28.224Z`.
Return code **0**. stdout:
`mechanical checks passed; declared semantic review: pass (not automatically proved)`.
stderr: empty.

Actual call receipt:
`tmp/b83-n65-raw-and-text/b84-n73-choice-validate-independent.call.json`.
File SHA-256:
`a0a4abb671c73e4c71411e3122a0a0d1274cdd82177ec6291b16e27c72af7bba`.
stdout SHA-256:
`4d6e19d8819a643ffffe3767f827ec9c4ef89649dc6c78b83a0d8d8e789adc09`.

Call counts for this reviewer: official choice validation with review **1**;
prepare/inspect **0**; author validation **0**; answer finalize **0**;
tests **0**; paid/model/image calls **0**; images opened **0**.
No Git, DB, services, publishing, descendants or messages. No edits to
seed, view, draft, author solutions, answer keys, lesson or other agents'
files. Manual writes only own review.json, this report and combined-review
evidence; the authorized existing recorder created only its unique call
receipt/stdout/stderr in its already configured directory.

**Parent action:** finalize the reviewed answers and retain approved choices.
No reviewer repair is requested. Any subsequent changed unit needs the
affected-only repair/review path; this PASS binds only the above snapshots.
