# FIRST Independent CHOICE Review: Source Freeze

Date: 2026-11-17. Ticket: STEMROBIN-180. Batch: 52.
Book/lesson: 7p / phy7-c1-s2-n100.
Reviewer: Codex FIRST independent reviewer, separate from the candidate author.

## Stage Boundary

This file was written before opening pure-view.json, draft.json or
source-solutions.md. Content inputs were only this directory's seed.json;
the skill, review rules and contract were read as procedural instructions.
No source answers, FINAL, old choices, interactions or other ticket outputs
were consulted. No image was opened: all four sources have figure_ids=[],
seed.figures=[] and source.concept_figure_ids=[].

Seed path:
.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/seed.json

Observed canonical SHA-256:
0f89f9e6644c5169f345c30536bbda57a9179b0529a9b94fad4a66d4cfbb64d2

Canonicalization: Python json.dumps with sort_keys=True, ensure_ascii=True,
separators=(",", ":"); SHA-256 of UTF-8 bytes. This matched the requested
snapshot. Hash computation is not a structural or semantic validate run.

## Source 1: Constant Temperature During Melting

Independent solution: A pure crystal at fixed pressure, with solid and liquid
coexisting during melting, absorbs energy while its temperature stays at the
melting point. Energy changes the ordered arrangement and interactions of the
particles as solid becomes liquid; it is not an increase in the thermal-motion
temperature. In the seed's approximation (no chemical change and negligible
volume-change work), the absorbed heat increases internal energy. Constant
temperature therefore does not imply constant internal energy, absence of heat
absorption or absence of particle motion.

The qualification matters: this explanation applies to the coexistence stage,
not arbitrarily to pre-melting heating, post-melting heating, every solid or
every pressure. The task is to explain the temperature plateau by the phase
change, rather than merely name the plateau.

## Source 2: Where the Fuel's Released Energy Goes

Independent solution: The fuel's total released energy must be distinguished
from the heat that actually reaches and is absorbed by the crystal. Some can
heat the heater, container and surroundings or leave with combustion products;
no efficiency or loss budget is provided. It cannot be asserted that the whole
fuel release goes into the crystal.

For the portion absorbed by a crystal already at its melting point and
actually melting, the seed's no-chemical-change/negligible-work approximation
gives an increase of internal energy associated with changing particle
arrangement/interactions and converting solid to liquid, without raising
temperature during fixed-pressure pure-solid/liquid coexistence. Symbolically,
Q_absorbed is only part of E_fuel in a real heater, and
Delta U approximately equals Q_absorbed under the stated approximation.
No quantitative fraction is inferable. Energy is redistributed, not destroyed.

Both levels are required: account for the fuel's total release without an
unstated perfect-heater assumption, and explain the use of the crystal's
absorbed portion. A question confined to Q_absorbed can omit the first level.

## Source 3: Definition of Heat of Fusion

Independent solution: At specified constant pressure, the specific heat of
fusion is the heat required to turn unit mass of a pure crystal initially at
its melting point completely into liquid at the same temperature. The lesson
uses "heat of fusion" for this per-mass property (also called specific latent
heat of fusion); for 1 kg the corresponding required heat is its numerical
value in J/kg. Generally lambda=Q_melting/m and Q_melting=m*lambda.

This is not the total heat for an arbitrary mass, not the heat of warming a
solid from below its melting point, and not the heat for a one-degree
temperature rise. The same-temperature solid-to-liquid transformation,
specified pressure, complete melting and unit mass are definition conditions.

## Source 4: Units

Independent solution: The seed lists joule per kilogram (J/kg), kilocalorie
per kilogram (kcal/kg), and calorie per gram (cal/g). Each has dimensions
energy/mass; J, kcal and cal alone describe energy rather than this
specific quantity. A temperature factor in the denominator would describe
specific heat capacity, not heat of fusion.

The task is to identify all three listed units, not read a table or infer any
numerical material constant. No source requires figure 229, a 229 slot, a
261 table or a table-reading operation.

## Frozen Review Criteria

Check all four tasks and all options without an author key. Test fuel total
versus absorbed portion; coexistence/pressure/approximation qualifications;
internal energy versus temperature; unit-mass same-temperature fusion; and
all three listed units. Inspect cross-question text for answers or supplied
definition conditions, not only mathematical agreement with the key.

Recognition cannot establish independent prose production. That is a real
capacity limitation to record, not by itself a blocked verdict. A source's
essential physical distinctions must still require judgment, and a different
question must not simply hand over its answer.

This source-first file is frozen and will not be revised after exposure to
the candidate or author material.
