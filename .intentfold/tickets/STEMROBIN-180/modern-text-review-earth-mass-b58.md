# B58 n39 地球的质量 - FIRST Full Text Review

**FIRST verdict: PASS. Exact actionable findings: 0. All 5 source-bound prose blocks reviewed; 0 exercises, 0 figures, 0 image loads.**

STEMROBIN-180, same invocation, fresh review on 2026-11-17. This is an independent text/physics review of the frozen draft, not SOURCE pixel review, adaptation validation, publication approval, or release of any existing HOLD.

## Frozen Inputs

Initial hashes were taken before reading any of the six input contents. The new report and evidence directory did not exist at entry; no earlier modern-text verdict was reused or overwritten. Absolute paths and SHA-256:

| Input | SHA-256 |
|---|---|
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n39/lesson.json | `f76e0cbb30d80fb43111ed2b96eb632b3796cee00d2d1a3214537681a2620b77` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n39/lesson.md | `6a247fc086f98e49afac9ab12f854f751efb5e8cc3ecb573eadc30afe0efe876` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n39/exercises.json | `dd1f7ae9fbc7f1b4695b00fe81ea0e68109422b6466247c053713b6cfe6b27eb` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n39/lesson.template.json | `81ba71e2cd9f6a3f1f1a02b4394ef45abafb2944219d2b0341b54e77eecb39f6` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n39/exercises.template.json | `0f0ed55fd692c60e867be23b00dea7fb1c9f9f4b31045f6fabd6aabf4a0cf9d3` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n39/figures.template.json | `d3f86da7db0a6230d90e577e856e24913286e35fa4b35c4a93823c39ce3b08b7` |

The evidence directory is /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-earth-mass-text-review/. `input-first.sha256` and `scope-first.json` preserve entry binding; `auxiliary-first.sha256` binds authoritative page text/JSON, TOC, and the existing SOURCE reports. Exact input-byte snapshots are included in `independent-text-evidence.FIRST.json`.

## Source Binding

Independently joined the authoritative page JSON lines, removing only the printed formula line-break marker `↵`, and matched every raw paragraph byte-for-byte. Raw `lesson.md` also equals the heading plus all five JSON paragraphs. Modern `source.data`, `source.sha256`, `source.path`, per-block `source_text`, references, printed pages, identity and metadata all agree with the raw layer.

The ordered references are exactly `p0162#5`, `p0162#6`, `p0163#1`, `p0163#2`, `p0163#3`. Physical162/printed150 `p0162#4` is the n39 heading; physical163/printed151 `p0163#4` is the n40 right boundary. Structured TOC independently agrees. The earlier incoming material and outgoing n40 text are excluded. No open/cont paragraph is falsely inherited; the final approximation and period close n39.

Existing SOURCE FIRST report SHA `a6f6b3d2205fe26512d484d12379510ffd102338fccc20210ee69228e96b4cb7` retains its historical FAIL for an outgoing n40 comma. Its affected-only report SHA `48c9e24941560dc4f615cf293339f97b0978ba95bbbfcdef4ac88e5e8fcb366c` records that repair. Neither was relabeled, edited, or treated as proof of physics correctness.

## Every Block

Locations below are in the frozen modern lesson template identified above. Each row covers the entire block, not a sample.

| Source / location | Source, formula and number exactness | Units, approximation and teaching correctness | Closure and declarations | Verdict |
|---|---|---|---|---|
| `p0162#5`, `prose[0]`, line16 | Original balance contrast and complete formula retained. Magnitude bars/vector arrow, `G`, `M`, division and `R^2` are exact. No sign or numerical change. | `g` is acceleration magnitude, `G` the gravitational constant, `M` Earth's mass and `R` its radius as supplied by subsequent blocks. Surface/spherical-model restriction is essential; this is not a claim about all altitudes or interior points. The balance comparison is an ordinary practical impossibility, not fabricated human context. | Two complete sentences; `changes=["layout"]`, no numeric change, no historical entity needed. | PASS |
| `p0162#6`, `prose[1]`, line32 | `M=|\vec g|R^2/G` follows by multiplying by `R^2` and dividing by nonzero positive `G`; all formula bytes match. | The same surface-model condition carries through. Algebra is correct and yields a mass dimension, not force or weight. | Complete derived formula and sentence; layout only, empty numeric/entity declarations. | PASS |
| `p0163#1`, `prose[2]`, line48 | Both measured quantities, `6.67`, negative exponent `-11`, `9.8` and all unit powers unchanged. All four math fragments match. | `G` is experimentally determined, not defined exactly; `6.67e-11` is valid three-digit rounding of S1. `9.8 m/s^2` is a representative near-surface value, not a universal exact constant (S2). The experimental inputs avoid circularly assuming Earth's mass. `N m^2/kg^2` is correct for `G` (S1/S3). | Complete sentence. One declaration correctly identifies `牛顿` as a force-unit name inside `\text{牛顿}`. It does not assert that a fictional or historical person appears in this block. | PASS |
| `p0163#2`, `prose[3]`, line69 | `6370` km and `6.37 x 10^6` m, exponent and equality preserved. | Conversion is exact: `6370 x 1000 = 6370000` m (S3). The adopted radius itself is approximate; it is not a newly claimed precise geodetic mean. S2 gives 6371 km, only about 0.016% different. “平均半径” supplies the representative-radius context rather than a local-altitude radius. | Complete radius paragraph; layout only, no numeric or entity change. | PASS |
| `p0163#3`, `prose[4]`, line85 | Full nested substitution, squared parenthesis, `G` denominator, `-11` and final `≈6 x 10^24` kg are byte-exact. All five math fragments match. | Independently evaluated to `5.961823388305847e24` kg; `≈6e24` kg is valid one-significant-digit rounding. Units reduce to kg, not kg squared. Coarse source inputs and spherical surface approximation are consistent with the deliberately coarse result. | Full substitution/result/period close the lesson before n40. One source-bound Newton-unit declaration is accurate; no answer, exercise, figure or extra claim has been added. | PASS |

All five `changes` arrays contain only `layout`; all `numeric_changes` arrays are empty. Actual text changes are exclusively ASCII prose sentence stops to `。`, including removal of the adjacent sentence space. Every mathematical fragment and every numerical token is unchanged. Both Newton declarations are metadata, not new prose or a new scientific-history claim. Their exact reason is `原书公式中的力的单位名称，保留来源单位，不作为虚构人物改名。` It is truthful even though the field is named `historical_entities`; no rename or unit alteration is warranted.

## Independent Calculation

The review calculated first, rather than accepting the source result or an external worked answer:

```text
R = 6370 x 1000 = 6,370,000 m
R^2 = 40,576,900,000,000 m^2
9.8 R^2 = 397,653,620,000,000 m^3/s^2
M = (98 x 40,576,900,000,000 x 10^12)/667 kg
  = 5.961823388305847 x 10^24 kg
  approximately 6 x 10^24 kg
```

BigInt arithmetic preserves the exact rational substitution until the final decimal conversion. The displayed coarse approximation differs from the substitution by +0.6403513%, consistent with one-significant-digit rounding. NASA's independently listed `5.9722e24` kg (S2) is a scale check, not a replacement input; the substitution is about 0.174% lower.

```text
1 N = 1 kg m s^-2
[G] = N m^2/kg^2 = m^3 kg^-1 s^-2
[g R^2/G] = (m s^-2)m^2/(m^3 kg^-1 s^-2) = kg
```

The check independently asserts SI exponent vectors `[mass,length,time]`: `G=[-1,3,-2]`, final mass `[1,0,0]`. Formula dimensions, numerical substitution and approximation all PASS separately from SOURCE agreement.

## Teaching Conditions

This PASS is for an elementary estimate using Earth's representative surface gravity and average radius. In Newtonian gravity a spherical mass distribution has the exterior field `GM/r^2`; using `r=R` is the surface idealization. For practical free fall the body must be negligible compared with Earth, drag irrelevant, and rotational/non-spherical corrections neglected or separately accounted for (S4). S2 independently confirms that real Earth's equatorial/polar accelerations differ.

The five blocks do not explicitly enumerate those model assumptions. They invoke an already-named free-fall formula, supply an average radius and representative inputs, and finish with a coarse `≈` result. That is an adequate bounded estimate, not a numerical or formula defect requiring alteration in this punctuation-only draft. It must not be promoted to a globally exact local-gravity law, an interior-Earth law, a high-altitude law using the same `R`, or precision geodesy. No unseen earlier lesson is certified, and the source's approval does not supply these scientific qualifications.

## Scientific Sources

Search requests were used for discovery; all public page reads used `cloak-fetch`, with no other browser or page-fetch tool. Successful pages returned HTTP200 and CLI exit0. Exact commands, observed values, release/update dates and limitations are in `scientific-sources.FIRST.json`.

- S1: NIST/CODATA, `https://physics.nist.gov/cgi-bin/cuu/Value?bg`, 2022 recommended `G=6.67430(15)e-11 m^3 kg^-1 s^-2`.
- S2: NASA Goddard Earth Fact Sheet, `https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html`, updated November 15, 2024; independent mass/radius/gravity comparison.
- S3: NIST SI Guide chapter4, `https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes`, table3 Newton unit and kilo prefix; unrelated older unit definitions were not used.
- S4: Original OpenStax University Physics1 §13.2, `https://openstax.org/books/university-physics-volume-1/pages/13-2-gravitation-near-earths-surface`; used only for model scope. Its Example13.3 displays `5.95e24` kg for these same inputs; that numerical result disagrees with our calculation and was explicitly NOT adopted.

The initial malformed NIST query `?bg=` returned an ill-formed-request page and supplied no scientific evidence. The corrected `?bg` request returned S1. An optional absent author-report lookup likewise supplied no evidence. Neither failure was represented as a successful comparison or gate.

## FIRST Seal And Stop

`independent-text-check.mjs` was executed once, exit0: all five source bindings, full formula/number equality, raw Markdown, snapshots, metadata, zero exercise/figure inventories and independent arithmetic/dimensions passed. This reviewer-owned comparison is not an adaptation or publication gate. No source images or complete scanned pages were opened.

Exact findings are `[]`. No repair is proposed or performed. `review-seal.FIRST.json` records the report's SHA-256, its identical frozen `report.FIRST.md` copy, input-preservation results and hashes of the evidence. The report is never revised after that FIRST freeze.

Only this NEW report and NEW files in the stated evidence directory are owned. Sources/candidates, all prior reports/HOLDs, dirty edits, checkpoint and usage files remain untouched. No IntentFold capability/freshness/setup, backend, Git mutation, database, app/dependency, answer, DISPLAY, gate, assemble, adapt-finalize, publication or HOLD action was run. **Text-only PASS; stop.**
