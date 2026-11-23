# N35 Choice Display Independent Review

Verdict: **FAIL**. Display only; existing source/math/keys/figure-218 approval reused. No semantic re-solving or canonical/shared edits.

## Finding

`N35-DISPLAY7-001`: In `choices-390-part1.png`, question 4 (`ray-set-table`) options A-D lose the entire fourth column, `U intersection V`, beyond the right edge. Every first-row union interval is also cut mid-expression; further long union entries in A-C are cut. Desktop shows the complete tables. The supplied manifest declares and records scrolling only for figure 218, not these tables. Runtime table access was not tested; this verdict is the observed mobile cutoff, not an invented runtime diagnosis. Original failure screenshots remain unchanged.

## Coverage

| Screen | Stems | Labels/controls | Complete option bodies | Complete/partial tables |
| --- | --- | --- | --- | --- |
| 1440 part 1 | 6 | 25 | 25 | 21 / 0 |
| 1440 part 2 | 3 | 14 | 14 | 4 / 0 |
| 390 part 1 | 4 | 17 | 13 | 9 / 4 |
| 390 part 2 | 5 | 22 | 22 | 12 / 0 |

Each viewport covers all 9 stems and 39 option labels/controls. Desktop has 39 complete options, 25 complete tables and 58 complete table data rows. Mobile has 35 complete options, 21 complete tables and 42 complete data rows; four tables containing 16 rows are partial. Split ranges are continuous: desktop `0..7194`, mobile `0..9258`, with no gap or overlap.

Outside that finding, stems, labels, controls, notation, table rows and final options are readable; no leaked keys, duplicate numbering, orphan text or incoherent overlap is observed. Figure 218 is fully visible/readable on desktop. Mobile shows its declared left scroll-window portion; supplied geometry records `640px` media, `358px` window and `282px` reached end. No standalone figure or new end-state image was opened.

Nonfatal KaTeX ideographic-comma warning count: **UNKNOWN**. Ray-list separators are visibly rendered; no missing-glyph boxes or error text observed. No mathematical failure inferred from warnings and no rerender.

## Bindings And Limits

Capture manifest SHA-256: `618b2021405063edc19260577f35cc142208412455edde177b0b9336224f53dc`.

Learner-only coverage SHA-256: `a7eb10191e97724966f588078eed312e8ae4209a197316a4b47a5e195e60db73`.

All four PNG hashes/dimensions and four current canonical input hashes match the manifest. Exact paths, hashes and per-screen observations are in `review.json`. Canonical inputs and approved figure dependencies were hashed only, not read for decisions.

Actual counters: **4 PNG opens, once each; 1 batch; 4 images in context; 0 reopens/crops/new screenshots/rerenders/diagnostics/browser launches or interactions**. Browser status: `not-started`. No functional, keyboard, dependency, environment, DB, Git, worktree or chat/peer actions. Both owned review files sealed `0444`.
