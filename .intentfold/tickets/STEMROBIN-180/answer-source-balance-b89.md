# B89 Balance: Independent SOURCE Solutions

- Ticket: STEMROBIN-180; invocation: 180-3.
- Scope: original `6p/lessons/phy6-c3-s10`, printed section 24, all four written tasks.
- Result: SOURCE SOLVED, 4/4 tasks and both demands of `q1` covered. No actual blocker.
- This is an independent source-solution freeze, not a modern answer-key review, runtime gate, or publication approval.
- All answers below are derived from the original source and stated physical conditions. No book answers, old keys, choices, modern candidates, or FIRST TEXT findings were inspected.

## Input Binding And Ordering

Paths in this report are relative to `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

| Input | Actual SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s10/lesson.json` | `6de02ddb62970781e1745c52c3598b36e29b058a687b073be4330796e3b578d2` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s10/exercises.json` | `aa57969ed6739f44b4d1b8d9ad853b2f6e77c4f4d68daf82d9ad64887b23ebb7` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-46.png` | `682d2a6fb01031624128afba1c8bf33af8fe5da6039eeb2bff87db1b470352b1` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-47.png` | `f7a56fb8c9cc9a50ddca85ad15f2e98414485783b84f507d060623b78617a4aa` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b89-balance-TEXT-FIRST/freeze.FIRST.json` | `3be021526bc130ddad216ea36a29481e196e8642cfd02100294754ec19f58747` |

The FIRST hash matches the supplied hash. Only its bytes were hashed and filesystem metadata read; its JSON/findings were not parsed or displayed. Observed mode: `0444`; modification/birth time: `2026-11-19T04:05:36+0000`. The user establishes that FIRST was frozen before this source stage. This continuation's observed UTC time was `2026-11-19T04:09:35Z`; the carried source-read notes do not provide an independently captured first-read timestamp.

The complete original lesson prose and four original exercise records were read. Each exercise has empty `figure_refs` and `figures`; figures 46 and 47 were inspected as original lesson context, not as exercise-attached images. No cross-lesson source was needed: this lesson's opening paragraph already supplies the interaction/velocity mass-ratio premise.

## Actual Original Image Observations

- `fig-46.png`: monochrome illustration of a horizontal beam on a central support, two suspended pans, and a central vertical indicator/stem. No numerical scale, mass load, rated capacity, calibration value, or sensitivity specification is readable. Equal-arm construction is established by prose `p0065#4` (pivot at the midpoint), not measured from the drawing.
- `fig-47.png`: an open case with shaped weights, a tweezer-like implement, and separate flat pieces. The larger pieces visibly carry `500`, two `200` labels, `100`, `50`, and two `20` labels. The smallest triangular piece's tiny mark is not reliably resolved at the supplied size. Units and the complete inventories, including `10 mg`, are supplied explicitly by prose `p0065#9` and `p0066#3`; the gram values on weights in the case were not independently legible. No invented visual measurement was used.
- Images opened: 2 distinct original PNGs, one opening each. New crops: 0. Reopens: 0. Context-image budget used: 2/8. No image payload is part of the handoff.

## 1. Equal-Arm Balance Equilibrium

Identity: exercise `1`; source number `1`; group `g1` (questions); task reference `p0066#6`.

Original task meaning: What is the equilibrium condition of a beam balance?

**Solution.** For the source's correctly adjusted equal-arm balance, it is in its normal equilibrium position when the masses on the two pans are equal. First establish the empty-pan reference equilibrium so unequal pan weights or a zero offset are not mistaken for unequal objects. The physical condition is zero resultant turning moment about the pivot. After the balance's own contributions have been balanced, the pan loads obey

```text
m_L g l_L = m_R g l_R.
```

Both pans are in the same local gravitational field and the source has `l_L = l_R`, so this reduces to `m_L = m_R`. The pivot support balances the downward forces; equal masses are not a universal equilibrium rule for every lever with unequal arms.

Conditions/limits: the beam must be free to respond, not held or stopped by contact; use the balance's empty-pan reference rather than any temporarily motionless position. In actual weighing, no detectable departure from equilibrium establishes equality only within the instrument's sensitivity. The source gives no numerical sensitivity or permissible load.

Source support: `p0065#4`, `p0065#6`, `p0065#7`.

## 2. Weighing With Known Masses

Identity: exercise `2`; source number `2`; group `g1`; task reference `p0066#7`.

Original task meaning: How do a balance and a weight set measure an object's mass?

**Solution.** Put the balance on a stable support and check its empty-pan reference equilibrium. Put the object on one pan and select known, marked masses for the other pan, adding or removing them until the beam returns to that reference equilibrium. Let the motion settle sufficiently to judge balance. The object's mass is the sum of the masses used:

```text
m_object = sum(m_i).
```

Use consistent units when adding gram and milligram masses (`1000 mg = 1 g`). Larger weights followed by smaller weights provide an efficient selection procedure; the source does not mandate a particular object pan. The pictured implement permits careful handling of small weights but supplies no model specification.

If a container is required, its mass must be accounted for: weigh object plus container and subtract a separately determined container mass, or counterbalance the empty container before adding the object. Do not silently include the container as part of the object's mass.

Conditions/limits: a suitable balance and sufficient known masses are required; do not exceed the instrument's specified load, if available. This source does not specify that load. If the available masses cannot balance an object, or the instrument cannot resolve a residual difference, do not invent an exact measured mass. The sum of the weight set is not proof of the balance's rated capacity, and the smallest weight is not proof of its accuracy or sensitivity.

Source support: `p0065#4`, `p0065#7`, `p0065#8`, `p0065#9`, `p0066#3`; container handling and limitations are explicit physical conditions, not claims of additional printed instructions.

## 3. Composition Of The Weight Set

Identity: exercise `3`; source number `3`; group `g1`; task reference `p0066#8`.

Original task meaning: How is a physical balance's weight set composed?

**Solution.** It contains known, marked masses of different denominations. The source's illustrated set has nine gram weights:

```text
100, 50, 20, 20, 10, 5, 2, 2, 1 g.
Total: 210 g.
```

The subgram weights are aluminum sheets in eight denominations/counts:

```text
500, 200, 200, 100, 50, 20, 20, 10 mg.
Total: 1100 mg = 1.1 g.
```

Keep both copies of `20 g`, `2 g`, `200 mg`, and `20 mg`; they are distinct available pieces, not duplicate transcription errors.

The nine gram weights can form every **integer-gram** total from 1 through 210 g by selecting a subset. The prose's "any mass" in that interval must not be treated as all real-valued masses. Similarly, the sheet weights can form every multiple of 10 mg from 10 through 1100 mg; they do not form arbitrary fractional masses or 1 mg.

Derivation: sort the gram denominations as `1, 2, 2, 5, 10, 20, 20, 50, 100`. Starting with obtainable total zero, each next denomination is at most one plus the previous sum, so attainable integer totals remain contiguous through 210. Dividing the milligram denominations by 10 gives `1, 2, 2, 5, 10, 20, 20, 50` and the same reasoning gives contiguous integer totals through 110 units. A bounded integer subset-sum calculation confirmed 211 distinct gram totals including zero and 111 distinct sheet totals including zero; no official test or lesson pipeline was run.

Conditions/limits: these are properties of the known-mass inventory, not an advertised instrument range or precision. The source's separate `1885 kg` car and `1 mg` mosquito examples concern suitable specialized instruments and do not establish the capabilities of figure 46 or this set.

Source support: `p0065#9`, `p0066#3`, with the specialized-instrument distinction from `p0066#4`.

## q1. Equal Billiard-Ball Masses By Interaction And Balance

Identity: exercise `q1`; source number **null**; group `g2` (Exercise 11); task reference `p0066#10`.

Original task meaning: How can the equal masses of two billiard balls be established without a balance, and then checked with a balance?

**Solution, without a balance.** Use the source's comparison of velocities gained by two initially stationary bodies through mutual interaction. Arrange a mutual push-apart interaction of the two balls on a level, low-resistance support, and compare their acquired translational speeds in the same frame, immediately after the interaction. This is a proposed experiment, not a report of measured speeds.

For an isolated pair initially at rest, or a pair with negligible net external impulse during the interaction, their gained momenta are equal in magnitude and opposite in direction:

```text
m_1 v_1 + m_2 v_2 = 0,
m_1 / m_2 = |v_2| / |v_1|.
```

If the two balls acquire **equal nonzero speed magnitudes**, their masses are equal under those conditions. Speeds may be compared by distances traveled over the same short time interval only when changes in speed during that interval are negligible. Two stationary balls both having zero speed provide no mass comparison.

A practical mutual-release arrangement may use a light compressed spring between the balls, without an extra external shove; the spring's residual momentum must be negligible or accounted for. No spring mass, force, compression, speed, or travel distance is asserted. External friction/impulse must be negligible for the comparison, or explicitly accounted for; separately pushing the balls is not the same experiment. Equal appearance, equal final speeds after uncontrolled pushes, or similar long stopping distances alone do not establish equal masses.

**Solution, balance check.** Check the empty-pan equilibrium of a suitable equal-arm balance, put one ball on each pan, and let the beam settle. Return to the empty-pan reference equilibrium confirms equal masses within the balance's sensitivity. If the beam departs from that reference, equality is not established by the balance. Both loads must be within the actual instrument's allowable load; no value for that load is given. No measured equilibrium observation is supplied or fabricated.

Source support: opening prose `p0064#18`, `p0065#1`, and the source's equal-speed cart/equal-pan comparison `p0065#6`, `p0065#7`. This is a deduction from the original premise, not wording borrowed from a modern repair.

## Freeze And Boundaries

The structured solution record is `.intentfold/tickets/STEMROBIN-180/tmp/b89-balance-SOURCE/source-freeze.json`; its receipt binds the exact report, input, and freeze hashes. The report, freeze, and receipt are made read-only (`0444`) before any later author comparison. Source files and the FIRST freeze are left unchanged.

Coverage: `1`, `2`, `3`, `q1` once each, 4/4. No omission/capture claim, unsupported measured data, instrument specification, or numerical calibration was introduced. No modern TEXT/FIG review, candidate edit, answer preparation/finalization, choice tooling, official tests, browser/network, paid call, database, app/code/dependency operation, Git command, backend operation, or other-chat message occurred in this source stage.
