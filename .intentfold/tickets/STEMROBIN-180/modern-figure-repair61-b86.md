# B86 FIG61 Bounded Author Repair2

2026-11-19. STEMROBIN-180, existing cap3 session 180-3 only.
Outcome: **PROVISIONAL_AUTHOR_REPAIR2**. Actual renderer **PASS**, exit 0;
one actual final-preview image inspection confirms the repaired label is readable.
This is not independent science/FIG approval, recording, promotion, or handoff.

## Exact Delta

Recovered old spec SHA256:
`f9c754ea8039bf8bb00bcafbb14fe6c082ca80a0222c5765fe835cbe825623c5`.
Only `a-elastic-label.at` and `source.authoritativeText` changed.
The old spec uses upward user coordinates `[84,330]`, corresponding to the
historical screen/author coordinates `[84,350]` on the 680px canvas.
Repair2 uses spec `[240,240]`, corresponding to screen `[240,440]`.
Label text, font, placement, both a force arrows, directions, all other geometry,
source facts, inventory, display and assertions are unchanged.
A normalized deep comparison against the old full spec verifies this boundary;
the scalar diff contains five authority-text changes and two anchor coordinates.
Counts remain 43 objects, 17 points, 2 spring glyphs, 10 texts, 22 assertions,
3 inventory groups. No original source image was viewed or re-audited.

Authority is the complete supplied candidate3 s18 lesson, SHA256
`fb3c99004996ff511698569ef18261791c36bb58f42b637a8bd9ba7b5c808a75`,
at `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/phy6-c3-s18-t1/lesson.template.json`.
Its exact title + all 11 nonempty prose texts yield 12 entries; exercises=0.
No text was invented, truncated, edited, or independently approved here.
The binding remains provisional pending the independent candidate3 science verdict.

## Actual Evidence

Candidate directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b86-fig61-repair2/`.

| File | Bytes | SHA256 |
| --- | ---: | --- |
| spec.json | 38445 | `4af6ff5aa44cfcac0346c30434bc5971387dcef0dcc5db2b20a002d4c5e0b175` |
| fig-61.svg | 47496 | `4444b9811eeff5ca1e2e98b1920f1697e87bd55fbe7c2316ec670cddb47ed14f` |
| fig-61.render.json | 922 | `68ee8280d6dd290253eba17db75c89a40d27b0bf5ecd81d0f3d54b6e3837547a` |
| normalwidth-640.png | 27875 | `36c1535586b8118050b7a3c75e693f047023329d8adc8737005d408554297b0a` |

The unchanged standard JSXGraph renderer was invoked once, including one internal
draft validation. Collision list is empty; width 640 has measured minimum text 24px
against required 16px. The same renderer produced the single 640x680 native preview.
That full image was loaded once at original detail: Elastic force no longer crosses
the spring, is readable to the right of the upward arrow, and both a arrows remain.
No crop, reopen, separate screenshot, secondary render, or extra repair occurred.

Owned evidence directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-fig61-repair2/`.
It contains `candidate-delta.json`, `authority-binding.json`,
`render-command.repair2.json`, `child-cwd.json`, `author-preview.json`,
`repair2-result.json`, and the single-use ticket evidence runner `run-repair2.mjs`.
All shell and authored child cwd values were explicitly the requested worktree;
the renderer's validator and browser child calls also record that exact cwd.
No shared renderer, validator, dependency, app, or other tool was edited.

## Usage And Stop

This continuation: actual renderer calls=1; internal draft validator calls=1;
additional standalone validators=0; additional author repairs=1;
historical repair1 + this repair2 = cumulative repairs **2**;
images loaded=**1/1**; final preview files=1; source pixel loads/crops/reopens=0;
paid/context/original-builder/reviewer/recorder/promotion calls=0.
Historical lifetime renderer/image totals were not reconstructed.

FIRST and historical FAIL were retained. Before/after hashes and permissions match
for the recovered spec/receipt, both frozen manifests, old FAIL render and complete
independent blocker, supplied candidate3 lesson and shared renderer/validator.
Old FAIL SHA remains `3ddfffc211ff4a2f0b999b17996094c79a6e555b4260cecfcb235baf41930b17`.
No fig62, canonical/shared ledger/report, lesson/source/answer/choice, backend, Git,
DB, publish, service, descendant, message, app, dependency or setup/freshness action.

Unknown/pending: independent candidate3 science verdict; independent affected FIG
review; original historical SVG bytes still unrecovered; no product/mobile/print
acceptance. Newly rendered SVG bytes are necessary output, not source approval.
No further author repair is attempted. Reported and STOP.
