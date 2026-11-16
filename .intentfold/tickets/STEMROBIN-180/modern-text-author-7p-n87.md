# phy7-c1-s1-n87 Modern TEXT Author Freeze

Author: Feynman. Status: author candidate ready for FIRST independent TEXT review, not independent approval or figure approval.

## Scope And Source First

Own root: `.tmp/ld-s10y-lesson/text-author-7p-n87/`.
Official canonical raw lesson JSON, complete MD, all three exercises, book/TOC and relevant approved pages 229–232 were read. Durable original PNG 219, 220 and 221 were each actually opened before prepare and before upper modern edits. `source-figure-inventory.json` records the observations: full factory/chimney/plume; complete qualitative smoke/chimney demonstration and base; complete building and heating network with repeated component labels 1–7. No modern figures were created, reviewed, rendered or approved.

One official isolated adapt-prepare copied the raw source into three templates, and byte copies plus full `source-context.json`/`input-binding.json` were frozen before upper edits. Raw lesson SHA: `e57794947f25ac3e3ed4112caecfae328a3479e453b824d83d980c0bb6dc0213`; exercises SHA: `5cbaa339cf9844fe92ff96b53cd4fab083590191596124324f7bb986e13a7850`. Current authority has 15 entries (9 p, 3 fig, 3 cap) and 3 complete g1 tasks, not a guessed 17-entry inventory.

## Complete Upper Coverage

| Upper unit | Source refs | Authored treatment |
|---|---|---|
| prose[0] | p0229#10 | Wind and large-scale convection retained; universal all-wind attribution qualified. Bold numbered heading retained. |
| prose[1] | p0229#11 | Summer day/night sea-land temperature contrast, same-pressure density comparison, near-surface pressure difference and both emphasized flow directions retained. Weak background wind and suitable conditions qualify the example; temperature is not treated as a universal pressure rule. |
| prose[2] | p0229#12, p0230#1 | Air-fed combustion, supply interruption, locomotive/firebox/stove/heater, factory/power-station chimneys, figure219 and complete figure220 demonstration retained. Tea-urn setting becomes a generic fuel water heater. Same-height inlet pressure and unobstructed natural draft are scoped; demonstration is teacher controlled without a new student task. |
| prose[3–6] | p0230#2–5 | Figure219/220 identities, source bindings and both printed captions unchanged. |
| prose[7] | p0230#6 | Taller-chimney draft relation retained under comparable temperatures, passage conditions and external wind. |
| prose[8] | p0230#7, p0231#1 | Complete source system retained: basement boiler1, main pipe2, attic expansion tank3, distribution4, second reference to4, descending pipes5, cast-iron radiators6 and under-window placement. Described as the illustrated system, not all modern buildings. |
| prose[9–10] | p0230#8–9 | Figure221 identity/caption/source bindings unchanged. |
| prose[11] | p0231#2 | Heat transfer, cooling, underground return7, reheating and complete repeated route retained; natural circulation requires suitable temperature difference, vertical arrangement and open passages. |
| prose[12] | p0231#3 | Pump-driven forced circulation retained and distinguished from the illustrated natural circulation. No pump is added to figure221. |
| prose[13] | p0231#4 | Heat station supplying many residences or an entire district retained; workers' residential area becomes a neutral residential area. |
| prose[14] | p0231#5 | Insulation and continuing heat replacement retained with warmer-interior/net-heat-loss conditions rather than an unconditional winter claim. |
| exercises[0–2] | p0232#2–4 | Original g1 identities1/2/3, printed numbers, group “练习 43”, refs and empty figure lists retained. Complete why-questions remain open: summer basement, upper natural-ventilation window and taller natural-draft chimney. Necessary conditions are supplied, not mechanisms or answers. |

All source.data/source_text, source identities, numerical sequences, math signatures and emphasis roles remain bound to raw originals. No formula, numerical measurement, required task, answer or choice was added. Three figure templates remain original pending placeholders.

## Actual Commands And Results

Shared interpreter: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.
Scoped helper reuses the established text-author workflow and canonical lesson APIs:

```text
python -B .tmp/ld-s10y-lesson/text-author-7p-n87/author-workflow.py prepare
  official p2c.py adapt-prepare --book 7p --edition modern-us-neutral
  --lesson phy7-c1-s1-n87 --root <canonical artifacts> --work <own root>
  exit0; 15 entries / 3 tasks / 3 figures
python -B .../author-workflow.py normalize
  canonical lesson/exercise normalization once, exit0
python -B .../author-workflow.py flow
  actual prose_flow.mjs --json once, exit0; 14 paragraphs
python -B .../author-workflow.py mechanics
  complete text mechanics once, exit0; 18 upper targets, errors=[], warnings=[]
```

Anchors copied from actual CLI paragraphs and resolved by the canonical proseFlow API inside the single mechanics call: `[3,7,11,12,13]`. No hand-counted block boundaries. Mechanics checks source/data/bindings, identities, task count, all literal numbers in addition to NUMBER API signatures, all emphasis roles, canonical layout, errata, references, profile and math. There are no formulas and no KaTeX subprocess. Execution records preserve actual before/after tool SHA epochs, not a claim that a historical epoch equals a later tool.

First failures: none. Repairs used0/1, remaining1; inclusive of mechanical/runner failure. No retry or repeat full gate. `author-workflow.py freeze` is metadata/snapshot construction, not another text gate. No adapt-finalize, retain, assembly, promotion, app/browser, DB, Git, network, model service or dependency operations.

## Exact Candidate Binding

- lesson.template.json: `16f0a859fdccc3a7ce8790ca3678ec525bd3f60b2e1afc692c93020cd0f46c0c`
- exercises.template.json: `37eb63bd99b65dff423b7ac857de2118607b6f6ede0e2a5dbba1cc19876f4e45`
- figures.template.json: `66947c13ea73356a019bc9c4cd87e904a09e67fe7db9f32e61b7bc30c09f5443`
- input-binding.json: `a55180954c01b4ca4ed94bc35634f60cec369a182fc388f8e8d399647dd5f8ef`

`author-handoff.json` binds all three final templates, full context, execution ledger, this report and immutable `frozen-01/manifest.json`. Handoff/manifest hashes are returned after their one metadata construction. Independent review is still required. n86 is untouched; figure210 cancellation is respected; figure211 FIRST review follows this freeze under its separate authorization.
