# STEMROBIN-180 Source Author211–214

Status: FROZEN AUTHOR CANDIDATE; independent full source review pending.
Role: source author, not independent reviewer. No approval, promotion or assembly.
Scope: physical211–214 only, printed200–203, source catalog6p in the shared6–7pPDF.

## Active Files

All four pages use the one fresh active root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-211-214`.

- Author handoff: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-211-214/author-handoff.json`.
- Exact manifest: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-211-214/source-manifest.json`.
- Current MD/JSON/audits: same root, `artifacts/6p/pages/0211`, `0212`, `0213`, `0214`.
- Original PNG/grid, prepare templates, layouts and exact crops/SVGs: same root, `work/6p/pages/0211` through `0214`.
- Actual call ledgers, immutable finalize inputs and complete native crop/SVG sheets: same root, `evidence/p0211` through `p0214`.
- Full source inventory: same root, `source-inventory.md`.
- Exact continuation and old-freeze preservation evidence: same root, `boundaries.json`, SHA256 `0478862a6fa8da6454d5a61e5e229a3580708cc974b6a6229f798774ff040904`.

The handoff derives all current/source/crop/SVG/output/ledger SHA256 values and
includes every owned file except itself. The manifest preserves actual historical
before/after tool bytes separately from current tool bytes. Neither file is an
independently approved source manifest.

## Actual Page Results

| Physical / Printed | Blocks | MD / Printed Rows | Tasks | Figures | Official Result | Repair |
|---|---:|---:|---:|---|---|---|
|211 /200|14|25 /25|6|none|prepare/finalize/vectorize exit0|0 /1|
|212 /201|12|20 /20|0|203,204|prepare/finalize/vectorize exit0|0 /1|
|213 /202|11|16 /16|0|205,206|prepare/finalize/vectorize exit0|0 /1|
|214 /203|6|9 /9|2|none|prepare/finalize/vectorize exit0|0 /1|

Total:43blocks,70/70physical text rows,8written task blocks,4figures.
Exactly4prepare+4finalize+4vectorize calls; all12exit0. Zero normalizations,
unknown characters, math errors or official firstFAILs. Repair usage remains0/1
on every page; no retry or affected repair was needed.

211audit retains four nonblocking KaTeX `mathVsTextAccents` warnings for the four
source circled subitems encoded by the established `\textcircled` convention.
These warnings are reported, not removed or misrepresented as absent.

## Exact Figure Bounds

All four are supplementary-reading body figures, with independent source captions;
none is an exercise-owned crop. No `cap.box` was required. Only each second
side-by-side caption has `samerow`, because the original captions truly share a row.

| Figure | Tool-snapped Source Rect [x,y,w,h] | Official Vector Mismatch |
|---|---|---|
|203|[366,854,272,438]|0.010%|
|204|[956,960,258,301]|0.000%|
|205|[294,1156,302,521]|0.007%|
|206|[912,1040,227,641]|0.000%|

Each source page was actually viewed ungridded in full before its full grid.
Both complete native PNG/SVG comparison sheets for212/213 were actually viewed:
`evidence/p0212/complete-crops-and-svg-sheet.png` and
`evidence/p0213/complete-crops-and-svg-sheet.png`, under the absolute root above.
Water-wheel/turbine channels, wheel/hub/blades, windmill rods/body/ground,
wind-engine rotor/tail/lattice/base and the adjacent building remain in the crops.
No visual review was inferred from vector mismatch alone. This is author evidence,
not independent source approval.

## Text And Boundary Facts

211retains “问题”2tasks, “练习40”3tasks with four original circled subitems,
and one unnumbered “作业”. The supplementary-reading title occupies two real rows;
only the source title words are bold. The two-line calculation preserves9.8,
1000,50, approximately500000and500, source units and exactly one formula-wrap marker.
No answers or external solution files were used.

Only approved210tail text was used as incoming context; no210pixels were opened.
Its body is closed, so211starts a fresh “问题”column without cont.
211open“所能做的功就为”joins212cont“A=500千焦耳.”.
212open“功率64万8千千”joins213cont“瓦的德聂伯河列宁水电站”;
the original split unit and all station identities/numbers remain unchanged.
213's source underdotted complete wind-energy definition is bold, not its next sentence.
Its figure-interrupted“图205所示的是”open joins the post-caption“风磨.”cont.
213open“传递给执”joins214cont“行某种任务的工作机.”.
214's final prose and both exercise41tasks are closed according to its own actual pixels.
The large lower blank area is not counted as text; its physical footer203 is retained.

The shared sourceTOC places7p§81at printed204/physical215. Physical215+was not read,
rendered or transcribed. No7pcontent was silently mixed in. The closed214boundary
is a page/source fact, not a claim that the complete6pbook has been assembled or published.

## Actual Commands And Tools

Shared existing interpreter:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.

For each page individually, the scratch runner invoked exactly this official argv,
substituting one assigned page and one stage:

```text
<shared-python> -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py <prepare|finalize|vectorize> --book 6p --page <211|212|213|214> --root /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-211-214/artifacts --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-211-214/work
```

Manual author inputs and the scratch helpers were written using apply_patch.
`author-run.py write` merged only printed_page/notes into actual prepare metadata,
never manufacturing source/render/profile hashes. `author-run.py views` used the
existing local svg_raster.js only to observe native complete crop/SVGs, not to
repeat official vector gates. `capture-boundaries.py` captured source identities
and verified all listed original206–210and207repair frozen files unchanged.
`author-run.py freeze` performs byte binding/inventory capture, not official gates.

Current core toolSHA256:

- p2c.py: `acda64449af5a9c043a8502e7840f6391c95cf01a63458bbf005011b773fa8ac`.
- layout.py: `c64ba63bdb73b29cf984f3d63438ab78b5f16d179b8c800c9d3917ced0bd7271`.
- katex_check.js: `b5e082a863b785bf037a3fbf7b27f92221342359d313be144a27fc6ed98df35e`.

Historical tool/input hashes are recorded for each actual invocation and are not
required to equal a future tool epoch. No completed gate was replayed for hash
normalization.

## Stop State

Author bytes freeze for main-appointed independent source review.
No in-flight exec, browser, service or image-generation request.
No changes to206–210/207repair/older freezes, canonical resources, modern editions,
tools, charter, app, dependencies, environments, DB or Git. No assembly, promotion,
publication, independent selfapproval, full checks or tests. Figures182/183/184
remain deferred with no additional figure/service calls.
