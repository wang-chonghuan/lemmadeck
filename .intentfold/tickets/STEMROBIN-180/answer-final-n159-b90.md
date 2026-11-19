# n159 b90 FINAL Answer Content Comparison

## Status and Findings

- Ticket STEMROBIN-180; existing cap3 invocation 180-3; batch b90; finish review; n159 only.
- **PASS -- FINAL answer CONTENT comparison against immutable independent SOURCE, approved DRAFT-TEXT stage only.**
- Findings: **NONE**. Required repairs: **NONE**.
- Complete original questions: **4/4**; required primary content facets: **7/7**.
- All four candidate keys correctly use `source: derived` and `grading: ungraded`; none should be converted into single-word, label-only or exact mathematical auto grading.
- First FINAL content comparison of the explicitly disclosed candidate: **PASS**; first comparison failures: **NONE**. This first result is preserved in immutable `tmp/b90-n159-answer-FINAL/comparison-01.json`, not overwritten by a retry.
- Historical FIRSTFAIL remains **UNKNOWN**, untouched. SOURCE flags, data, verdict and counters, the candidate, and the author receipt were not changed.
- This is NOT approval of actual figures, full cap2 pipeline completion, current-course finalization, interactions, publication, or any different or subsequently changed key.

## Bound Inputs

W = `/Users/yong/.codex/worktrees/0f12/lemmadeck`; T = `W/.intentfold/tickets/STEMROBIN-180`.

Input binding occurred at 2026-11-19T07:43:02.296Z, before disclosed candidate content reading at 2026-11-19T07:43:06.865Z.

| Input | SHA-256 |
| --- | --- |
| Candidate `W/.tmp/ld-s10y-answer/b90/7p/modern-us-neutral/lessons/phy7-c2-s4-n159/answer-keys.authored.json`, 4412 bytes, mode 0444 | 3983d98607e01f446153ddc19a90a6364f1d098a108508d73fd4fc313efc41e6 |
| Author receipt `T/tmp/b90-n159-answer-author.json`, 1138 bytes | db8551ac715a255df035219b8dd0b19cebc67dbcbbc6efca63fd92387d978aaa |
| Frozen SOURCE report `T/answer-source-n159-b90.md` | db62cc2d3e0aa6b689e34292d7b23ffff3e84b58304a2986c675f62ad3db2291 |
| Frozen SOURCE coverage | 277315014b2680561c4be6dea307c8b6daed95d40d298c39ee4ce3b076e64220 |
| Frozen SOURCE hash receipt | b0b6f93204c53f4dffcca612913974087fc9ffc8e9ce42c2a2b13ae81034de18 |
| Approved DRAFT `lesson.json` | 7d10aa5f77ab675cc06463d1eba9df647207cc1c43f56766569718b406b1d7eb |
| Approved DRAFT `exercises.json` | ac627477efe274c2dfbafd77c81f3468c2c8d052c18196d0783c11bff8a51cda |

The two approved DRAFT files retain the SOURCE-bound root `W/.tmp/ld-s10y-answer/b90-n159-inputs/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s4-n159/`. SOURCE report content was hash-verified, not reread as a fresh solver pass. The already frozen independent solutions and original seven-facet decomposition were reused; SOURCE/RAW/TEXT reviews were not replayed. Source-file byte reads were integrity checks only.

The author receipt and explicit user statement declare that the author did not read independent SOURCE solution prose before authoring. This is attributed evidence, not a claim that the comparator independently observed the author's reading activity. The candidate was disclosed only after SOURCE freeze.

## Identity and Grading

The candidate declares schema `ld-s10y-answer/lesson-answers@1`, book 7p, lesson phy7-c2-s4-n159, edition modern-us-neutral, status draft. Its four entries have unique exercises `"1"`--`"4"` in order, and their `prompt` values exactly match the approved original written questions, whose identities are g1/source_number 1--4 with question source refs p0402#10--p0402#13. There are no extra, missing, duplicated, substituted, choice or generated questions.

Each entry has `figureEvidence: []`, `parts: []`, `historical_entities: []`, `source: derived`, a substantive `displayAnswer`, and `grading: ungraded`. Empty `parts` is appropriate for these ungraded explanatory answers: the two-part construction/operation requests are actually answered in prose, not omitted or disguised as a one-term automatic response. No book answer was supplied, and no `bookRaw` claim was introduced. The answers do not introduce undeclared historical people or numerical data.

All four require explanations with many valid equivalent phrasings. The current exact/numeric/expression auto contracts cannot reliably assess those original requests. Consequently **4 ungraded / 0 auto** agrees with SOURCE. Candidate notes support that boundary rather than proposing a choice or keyword grader.

## Per-Question Comparison

### （1）什么是受话器和送话器？

**PASS, 2/2 required facets.** The receiver is correctly at the ear-side end and converts received current variations into diaphragm and air vibration. The transmitter is correctly at the mouth-side end, is also called a microphone, and converts sound-induced vibration into electrical signal variation. Carbon resistance modulates externally supplied current; the receiver regenerates sound locally. The conversion directions are not swapped, and sound is not described as travelling down the wire as air.

SOURCE gives a more expanded magnetic/force account in its receiver definition. Question （1）asks the devices' functions; the candidate's complete functional description is sufficient. Full magnetic construction and operation are independently supplied in question （3）. No additional demand is imposed.

### （2）送话器的构造如何？它是怎样工作的？

**PASS, 2/2 required facets.**

- Construction preserves diaphragm6 made from thin steel or pressed carbon; carbon shoe2 with carbon powder5 in its recess; housing1; gasket4 insulating the carbon shoe from the housing; and fixed electrode3 at the housing bottom, also insulated from the housing.
- The supplied current path includes diaphragm, carbon shoe, carbon powder and electrode3. Operation correctly proceeds from air sound vibration to diaphragm vibration, carbon-contact/pressure change, resistance change, and current-strength change.
- The stable quiet case and supplied-energy limitation are correct. Pulsation is strength variation on DC, not repeated reversal. AB and BC refer to the already approved prose's quiet/speaking descriptions, not new graph-derived measurements.

SOURCE additionally gives a qualitative resistance/current direction deduction and mentions vocal cords here. Neither addition is a new requirement for this question: the candidate completely explains how this transmitter works, and the full voice origin is present in question （4）. Figure-number and AB/BC mentions are consistent with approved text but do not approve the actual figures.

### （3）受话器的构造如何？它是怎样工作的？

**PASS, 2/2 required facets.**

- Construction preserves housing2, permanent magnet3 with two pole shoes, fine-wire coils4 fitted over the pole shoes, circular thin steel diaphragm1, the small gap between diaphragm and pole shoes, and cover5 securing the diaphragm to the housing. Receiver numbers are not confused with transmitter numbers.
- Operation correctly distinguishes permanent-magnet attraction with zero coil current, a static combined-field position with constant current, and vibration caused by changing coil field together with the permanent magnet changing the diaphragm's attractive force.
- Diaphragm motion drives nearby air to regenerate sound locally. The candidate does not assert repeated current reversal, alternating attraction/repulsion, or strict proportionality between current, magnetic force and sound.

SOURCE's explicit elastic-return discussion is explanatory elaboration, not a missing original requested facet in the candidate's complete force-to-motion description. No separate spring, dimensions, extra field-law formula or perfect-fidelity disclaimer is demanded.

### （4）用电话谈话是怎样进行的？

**PASS, 1/1 required facet, complete conversation chain.** Candidate covers vocal cords -> speaker-side air -> transmitter diaphragm -> carbon contact and pressure -> resistance -> externally supplied current-strength change -> telephone line -> remote receiver coils -> changing coil field plus permanent magnet -> changing attraction of the steel diaphragm -> receiver diaphragm and local air -> listener hearing. It states that both parties have equivalent transmitter/receiver functions and can speak and listen to one another, so counterpart reply is covered without requiring a second verbatim enumeration.

The candidate explicitly distinguishes electrical-signal transmission from sound moving directly along the wire and limits the explanation to the early carbon-transmitter telephone model. It does not invent dialing, ringing, switchboards, duplex circuitry, induction coils, or digital conversion. Repeating every earlier caveat in this last answer is not necessary for complete original-question coverage.

## Coverage and Boundaries

| Question identity | Required original facets | Result |
| --- | --- | --- |
| g1/1, （1） | Receiver function; transmitter function | PASS 2/2 |
| g1/2, （2） | Complete transmitter construction; operation | PASS 2/2 |
| g1/3, （3） | Complete receiver construction; operation | PASS 2/2 |
| g1/4, （4） | Complete conversation chain, including mutual reply | PASS 1/1 |

All four original tasks have zero explicit figure associations. Figures in the lesson remain UNAPPROVED and unread; the presence of text-level figure references in the candidate is neither a graph inspection nor a figure approval.

No new SOURCE requirements were invented. Correct equivalent wording was accepted, and no candidate was edited to match solver prose. Final status attaches only to candidate SHA-256 3983d98607e01f446153ddc19a90a6364f1d098a108508d73fd4fc313efc41e6 and the bound approved DRAFT text.

## Recording and Freeze

The original `T/tmp/b83-n65-raw-and-text/record-command.mjs` was reused directly, under unique FINAL labels in its explicitly authorized owned prefix. Its content remains unchanged. The earlier SOURCE-local recorder exception remains retained and disclosed; the SOURCE copy was not rerun or altered.

New writes are limited to this report, `T/tmp/b90-n159-answer-FINAL/`, and uniquely labeled recorder outputs in the authorized original recorder prefix. The first comparison evidence and final report are create-once. `freeze-receipt.json` binds their hashes plus all input hashes; `freeze-receipt.sha256` binds the receipt itself. FINAL files are protected with mode 0444 and user-immutable `uchg`, and those flags are checked. SOURCE integrity and its existing flags are checked before and after without changing them.

## Accounting

| Counter, FINAL-local unless stated | Value |
| --- | --- |
| Unique candidate key files read for content | 1 |
| Independent semantic FINAL comparisons | 1 |
| Original questions compared / required facets covered | 4 / 7 |
| Findings / first comparison failures / repairs | 0 / 0 / 0 |
| Images viewed, rendered or generated | 0 |
| SOURCE re-solves / SOURCE, RAW or TEXT review replays | 0 / 0 |
| SOURCE flags, data, counters or candidate edits | 0 |
| Paid / network / browser calls | 0 / 0 / 0 |
| Pipeline / prepare / finalize / publish / canonical writes | 0 |
| Git / DB / backend / app / dependency / generation / other-chat operations | 0 |
| Actual figure or finalized-course approvals | 0 |

SOURCE's frozen `keyReads: 0` remains unchanged; FINAL's single explicitly authorized unique candidate-content read is accounted here separately. No repair is presently needed. Any later work is limited to an explicitly requested actual affected FINAL repair, with separately bound changed inputs and this first comparison retained.
