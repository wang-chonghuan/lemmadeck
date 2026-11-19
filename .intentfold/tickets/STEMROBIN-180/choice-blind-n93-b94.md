# STEMROBIN-180 n93 Choice BLIND b94

Status: BLIND_COMPLETE_PENDING_PARENT_BINDING.
Reviewer: fresh independent agent `n93-CHOICE-FIRST-BLIND/b94`.
Date: 2026-11-19. Offline C, finish=review.
BLIND outcome: pass for visible fidelity/redundancy/leakage, six selected
source tasks, and independent mathematics. No undisclosed draft is approved.

## Authority and Sequence

Exact root:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

Sealed SOURCE manifest:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-CHOICE-FIRST-SOURCE/manifest.json`,
SHA-256 `861a881fe2ae80bb78c1e520429f36604ae959fd4b02bf9f1ff93a3f0557c5a2`,
14994 bytes, mode 0444. The human reported parent binding of 48 entries.
The designated parent command receipt was verified exit 0:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/commands/n93-choice-SOURCE-bind-1.json`,
SHA-256 `7b5991bc17d6cdb0819fcd21c08608d5702b6f3cf76e364930b2f32cd87edc28`,
909 bytes.

Only authorized learner input:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-author/learner-only-views.json`,
SHA-256 `3f8cb31e5b81c60cbd6f27e156cdc0622c51e0bb9a86591212ceb1e1fc40a783`,
6409 bytes. Five questions, twenty options, three single/two multiple.

Fidelity/redundancy/leakage and coverage were written and frozen first
in `n93-CHOICE-FIRST-BLIND/fidelity-first.json`,
SHA-256 `769fb95e025fb832484d00ddea9b1e4c7bdad9d377dd79f7a7a6901f02da2576`,
13008 bytes. Recorder receipt `n93-cfb-003-fidelity-seal-1.json`
precedes `n93-cfb-004-independent-arithmetic-1.json`.
Then independent mathematics was recorded in `mathematics.json`.
No author key, author reasoning, draft, stage1, hidden coverage,
limitations, or misconception record was opened.

## Independently Solved True Sets

| Question | Mode | Complete true set |
| --- | --- | --- |
| n93-q01 | single | c |
| n93-q02 | multiple | a, c |
| n93-q03 | single | c |
| n93-q04 | multiple | a, c |
| n93-q05 | single | d |

Total: seven true and thirteen false options. These are independently
determined sets, not an author's key comparison.

## All Twenty Options

| Option | Truth | Concrete independent check |
| --- | --- | --- |
| q01/a | false | Warming 42000 J is right; -42000 J on cooling is signed heat into the body, not positive Q_out as defined. |
| q01/b | false | 4200/0.5*20=168000 reproduces the wrong inverse-mass formula; actual heat is 42000 J and c/m has wrong dimensions. |
| q01/c | true | 4200*0.5*(40-20)=42000 J for warming and positive release on reverse cooling, with reversed endpoint order. |
| q01/d | false | 4200*0.5*(40+20)=126000 uses sum 60 instead of the interval 20 C. |
| q02/a | true | In the ideal water-only mixing model, hot release equals cold absorption when container/ambient gains are negligible. |
| q02/b | false | 0.5 kg at 80 C plus 1 kg at 20 C reaches 40 C ideally: 40 C hot drop versus 20 C cold rise, each exchanging 84000 J. |
| q02/c | true | With colder container/air also gaining heat, hot release equals cold-water gain plus container gain plus air gain. |
| q02/d | false | The unequal-mass example still exchanges equal 84000 J, so equal mass is not necessary. |
| q03/a | false | Oil is fastest, but 0.48 is the kcal numeric entry; required per-unit heat is 2000 J, not 0.48 J. |
| q03/b | false | Water's 4200 J per kg per C is right; its largest c makes warming slowest at equal mass/absorbed power. |
| q03/c | true | Oil's c=2000 is the smallest liquid value and 2000*1*1=2000 J. |
| q03/d | false | Kerosene's 2100 J is right, but oil's smaller c=2000 gives the faster rise. |
| q04/a | true | Q=m*c*rise at fixed mass/rise is greatest for water's greatest c. |
| q04/b | false | At 1 kg and absorbed 4200 J, oil/kerosene/alcohol/water rise 2.1/2/1.68/1 C, so water rises least. |
| q04/c | true | For 4200 J and allowed rise 1 C, needed masses are 2.1/2/1.68/1 kg, so water needs least. |
| q04/d | false | At 1 kg and rise 1 C, absorbed heats are 2000/2100/2500/4200 J, not equal. |
| q05/a | false | Components 2/3 are correct; 138000 J is 460*1.5*200 using iron instead of cast iron c=540. |
| q05/b | false | First is correct; 3220000 J uses raw 50 g as kg and 75000 J uses raw 2 tonnes as kg. |
| q05/c | false | First is correct; 4140 and 90000000 J use final temperatures 90/60 rather than rises 70/50 C. |
| q05/d | true | 540*1.5*200=162000; 920*0.050*70=3220; 750*2000*50=75000000 J. |

Correct underlying quantities: q01 absorbed/released magnitudes are
42000/42000 J; q03 ranks oil, kerosene, alcohol, water at equal mass/net
heating; q04 follows direct c dependence for absorbable heat and inverse
c dependence for rise/required mass; q05 gives 162 kJ, 3.22 kJ, 75 MJ.
Every component of every triple was checked, including partially true
alternatives. Wrong procedures were derived independently from visible
formulas/numbers, without checking an author's claimed misconceptions.

## Coverage and Fidelity

| Selected source | Question | Retained task |
| --- | --- | --- |
| 2 | q01 | Worked warming/cooling heat example and heat-direction meaning. |
| 3 | q01 | Complete formulas and positive cooling-release convention. |
| 4 | q02 | Ideal and real experimental heat balance, distinct from mass/temperature equality. |
| g2-2 | q03 | Fastest liquid from inverse c, with explicit equal-mass/equal-absorbed-power conditions. |
| g2-3 | q04 | High-c coolant advantage under fixed heat/rise/mass conditions. |
| g2-4 | q05 | All three source bodies, quantities, materials, conversions, and temperature intervals. |

The example and formula tasks can share q01 because applying the formula
is the example's core reasoning. No selected task is silently dropped.
The views resolve the SOURCE-stage g2-2 mass/net-heating condition
explicitly; the finding is not an unconditional arbitrary-mass ranking.
The q05 cast-iron rise remains 200 C, while the endpoint-defined rises
remain 70 and 50 C; 50 g and 2 metric tonnes become 0.050 and 2000 kg.
Only SI c values are requested, avoiding false exact conversion demands
between the rounded SI/kcal source columns.

The unselected task 1 is not fully covered merely because q01 supplies
needed conditions. The unselected g2-1 aluminum 920 J / 0.22 kcal meaning
is not directly covered by q03's oil-per-unit query. No all-eight coverage
claim is made.

## Redundancy and Leakage

All five questions have individually supported passes in the sealed
fidelity-first record. q01 distinguishes sign, mass dependence, and
temperature interval; q02 distinguishes complete energy balance from
mass or equal-temperature assumptions; q03 distinguishes heating rate
from material/unit lookup; q04 varies which quantities are fixed; q05
varies wrong material, unconverted masses, and endpoint misuse.

q04's maximum-heat and minimum-mass statements are related implications
but not duplicated propositions under identical controls. q03/q04 use
the same source data for inverse heating-rate versus direct heat-storage
reasoning. q01 supplies no q05 result; its formula can legitimately
scaffold later application. No cross-question numeric answer disclosure
or source-to-question mapping instruction was observed.
Reasonable elimination and full-triple recognition are not automatic
fidelity failures under the source criteria.

## Actual Recognition Losses

- q01 cannot prove independent creation/writing of an example or formula.
- q02/q04 recognize explanations rather than require composing them.
- q03 supplies the four-liquid domain rather than test independent
  filtering of the full sixteen-row table.
- q05 supplies the metric-tonne conversion fact and permits eliminating
  a triple from one faulty component; selecting correctly does not prove
  independently completing all three written calculations.

The essential mathematical distinctions remain visible. These losses
must be compared with the author's undisclosed declarations in FINAL,
not silently assumed to have been declared correctly.

## Images, Freeze, and Stop

Reused the two sealed SOURCE observations only:
original `tbl-p0241-01.png` and existing
`native-repair-1-1440-full.png`, which established sixteen data rows,
three columns, all printed values/precision, the rightmost kcal column,
and bottom Water row/border. BLIND loaded zero new images and performed
zero reopens/crops. q03/q04/q05 use `tbl-p0241-01`.
No current mobile/layout or unseen figure-spec review is claimed.

Owned evidence:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-CHOICE-FIRST-BLIND/`.
Report, fidelity record, mathematics, and generated manifest are frozen
0444 with exact path/SHA-256/byte and receipt bindings.
No other writes, DB/env/apps/dependencies/paid models/other agents.

No BLIND revision or blocker was found. FINAL remains pending for exact
draft binding, author key agreement, solutions/misconception claims,
declared intent/coverage/limitations, and any undisclosed figure registry.
This is not a completed full semantic review schema.
STOP awaiting parent binding before FINAL disclosure.
