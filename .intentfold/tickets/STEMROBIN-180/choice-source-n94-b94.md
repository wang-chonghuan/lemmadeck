# STEMROBIN-180 n94 b94 Independent CHOICE SOURCE Report

SOURCE ONLY; offline; fresh independent reviewer. Author draft, choice views,
author reasoning/report, answer keys and historical choice/interaction artifacts
remain unseen. No canonical lesson files or other workers' files were changed.
No questions, options, keys, coverage selection or semantic package approval exist
in this report. BLIND review awaits the parent's actual bindings.

## Input Binding

- Seed: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-choice-author/seed.json`
- Seed byte SHA-256: `baea271b575be291e3f087e25acc9d38ca6b3fbbc1fac55f5fdfd2c5c79497a3`
- Definitions: selected concept blocks 6, 7 and 13 only.
- Original image: `ssot-resources/soviet10year-textbooks/artifacts/7p/figures/tbl-p0247-01.png`
- Original image SHA-256: `072e3c3eece1c65b3d11d8b264527f41d9164ab8f13a1d0cf57b7924b7298e98`
- Approved modern image: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-figure-author/tbl-p0247-01/candidate-01/native-combined.png`
- Modern image SHA-256: `b5f3f48d47b2ef245d939ad4343bf9f9dbcedfdfaf56d869f0d06795cd52d831`
- Seed SVG byte-only binding: `539a9c2c708fc126edeadf3221e1036c1097488491d5f5ef578ded74f3b7bbae`

Original 1181x906 PNG and approved 1380x2112 combined screenshot were each
opened exactly once; 2 total opens, no crops or reopens, no image returned.
Original observations were recorded before opening the modern screenshot.
No FigureSpec, source-row metadata or figure-author report was consulted.
The current SVG was hashed only; renderer provenance is not inferred from that
hash. The approved screenshot's upper full table shows all relevant data;
lower labelled start/end scroll panels are partial positions, not full tables.

## Independent Pixel Inventory

The original and modern full table have 12 data rows and 3 columns. The regional
identity, rightmost calorie column, bottom Hydrogen row and both range endpoints
are present. Modern Brown coal (Moscow region) preserves the original's brown coal
produced near Moscow.

| Fuel | q (J/kg) | q (kcal/kg or cal/g) |
| --- | --- | --- |
| Dry firewood | 1.0x10^7 | 2500 |
| Peat | 1.4x10^7 | 3400 |
| Brown coal (Moscow region) | 1.3x10^7 | 3000 |
| Coal | 2.7x10^7--3.0x10^7 | 6500--7500 |
| Alcohol | 2.7x10^7 | 6500 |
| Anthracite | 3.0x10^7 | 7500 |
| Charcoal | 3.4x10^7 | 8000 |
| Natural gas | 4.4x10^7 | 10500 |
| Petroleum | 4.4x10^7 | 10500 |
| Gasoline | 4.6x10^7 | 11000 |
| Kerosene | 4.6x10^7 | 11000 |
| Hydrogen | 12x10^7 | 30000 |

Each energy column retains its own tabulated rounding. Do not recompute one from
the other or require exact converted equality. kcal/kg and cal/g themselves have
identical numerical values because both numerator and denominator scale by 1000.

## Independent Source Solutions

- `1`: q is the heat released by complete combustion of 1 kg of the specified
  fuel, equivalently energy per mass Q/m. It is not arbitrary sample heat or rate.
- `2`: the three selected-definition units are J/kg, kcal/kg and cal/g.
- `3`: q=1.4x10^7 J/kg or 3400 kcal/kg means complete combustion of 1 kg releases
  the corresponding approximate 1.4x10^7 J or 3400 kcal; for m kg, multiply by m.
  The latter is 3400 cal for 1 g, not 3400 cal for 1 kg.
- `4`: Q=qm for complete combustion; use compatible mass units so the mass
  denominator cancels. Neither q/m nor an unprovided efficiency is the relation.
- `g2-1`: Petroleum's 10500 belongs to the calorie column: 10500 kcal/kg or
  10500 cal/g. One completely burned kg gives 10500 kcal; one g gives 10500 cal.
  The separate rounded J/kg entry is 4.4x10^7. Do not substitute kerosene/gasoline.
- `g2-2`: for equal positive masses burned completely, Moscow-region brown coal
  gives more heat: 1.3x10^7*m > 1.0x10^7*m J, or independently 3000*m > 2500*m kcal.
  The source's identical conditions must preserve equal mass, not equal volume.
  Unequal masses do not give an unconditional answer. Do not demand a common
  exact percentage increase from the independently rounded columns.
- `g2-3`: 15 kg charcoal gives 15*3.4x10^7=5.1x10^8 J; independently
  15*8000=1.2x10^5 kcal=1.2x10^8 cal. Alcohol's 200 g is 0.200 kg:
  0.200*2.7x10^7=5.4x10^6 J, or 0.200*6500=1300 kcal=1.3x10^6 cal.
  These are two distinct calculation subtasks; silently dropping either loses
  coverage. Each result inherits the rounding of its chosen q column.
- `g2-4`: 2 L kerosene cannot yield a unique numerical heat without its mass or
  density, absent from this whitelist. Conditionally m=rho*V and Q=q*rho*V.
  With rho in kg/m^3 and V=2x10^-3 m^3, Q=9.2x10^4*rho J or 22*rho kcal.
  With rho_L in kg/L, Q=9.2x10^7*rho_L J or 22000*rho_L kcal.
  No density was guessed; no answers or other lessons were inspected.

## Conditions and Losses

Seven source records have determinate solutions under their stated/explicit
conditions. g2-4 has a substantive conditional solution but a blocked numerical
datum. Honest potential exclusion must name the lost numerical
volume-to-mass-to-heat task. A conditional-expression or missing-data recognition
question would be a declared transformation needing future fidelity review.
The missing density alone does not prevent selecting the other seven records.
No stage claims that all eight, or any particular subset, were converted.

Full per-source tasks, conditions, uncertainties, observations and counts are in
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-CHOICE-FIRST-SOURCE/independent-solutions.json`.
The same directory's `SOURCE.md` and `manifest.json` retain the stage boundary and
hash bindings. Evidence and this durable report are sealed 0444 before handoff.

Execution exception: an initial direct runner `--help` assertion failure had no
contemporaneous runner receipt. It executed no child process and was explicitly
retrospectively recorded under `n94-choice-source-008`. The malformed labelled
call is preserved under `n94-choice-source-001`; subsequent commands used the
unmodified runner with unique labels. No content stage was repeated.

Counts: 8 source solution records; 7 determinate, 1 conditional/numeric-blocked;
12 table rows; 3 columns; 2 image opens; 0 choice views/keys read; 0 choice
questions authored or approved. SOURCE checkpoint only; STOP awaiting bindings.
