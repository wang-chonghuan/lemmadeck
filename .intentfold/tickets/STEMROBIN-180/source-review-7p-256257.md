# 7p Physical256-257 FIRST Independent SOURCE Review

Outcome: **256 REVISE / 257 BLOCKED**. Full review completed.
Reviewer: C sole FIRST independent SOURCE reviewer; author: Curie.
No author changes, repairs, source gate reruns or promotion.

## Findings

**F256-1: six missing nested italic terms.**
In p0256#3/#5/#7/#9 the complete definitions are bold, with the word
`物质` additionally italic. Source occurrence counts are 1/2/1/2.
Current MD and JSON retain whole-definition bold only and lose all six italic
terms. The actual source definition crop confirms each occurrence.
Minimum affected change: restore italic on those six two-character terms inside
the unchanged bold ranges. Keep every character, punctuation mark and row.

**F256-2: italic boundaries in p0256#2/#4.**
In #2 row1 both occurrences of `物体` are italic, while `给` and `使`
are upright. Current `*给物体*` wrongly includes `给`, and the second
`物体` is unmarked. In #4 only `物体` is italic; current
`要*使物体熔解*` wrongly includes `使` and `熔解`.
Minimum affected change: #2 use `给*物体*` and mark the second `物体`;
#4 use `要使*物体*熔解`. No wording or row changes.

Page256 repair remains **0/1**, with one combined affected-only repair
available to the author. Reviewer made no author changes and does not reset
or spend that budget.

**F257-1: omitted italic in introduction and table caption.**
p0257#1 source `各种物质` has italic `物质`; current text has none.
p0257#2 source bold `一些物质的熔点` additionally has italic `物质`;
current caption retains only whole-title bold. Unit `°C` is upright outside
the bold title. Full page and actual top-region crop confirm both omissions.
Page257 repair is **1/1 exhausted: BLOCKED**. No further repair, gate retry,
author edit or repair request is allowed.

## Coverage

Both entire source pages were read individually before detail crops.
Complete current MD/JSON/audits/layout, source manifest, TOC, author inventory,
initial failure, sole repair, call ledger, stdout/stderr and existing native
bindings were inspected. All input/reference/history hashes matched at entry.
Final verification preserves external shared-reference drift separately;
author SOURCE inputs and all frozen copies remain unchanged.

|Physical / Printed|Blocks|Text / Audit Rows|Tasks|Tables|Result|
|---|---:|---:|---:|---:|---|
|256 /245|12|25 /25|0|0|REVISE|
|257 /246|10|15 /15|3|1|BLOCKED|

All **22 blocks /40 text rows /3 complete tasks /1 table** reviewed.
Word-for-word source content, punctuation, math/data, row grouping and
cont/open flags pass; the eight affected blocks fail emphasis fidelity.
**14 unchanged blocks pass; eight fail. Whole-page approved subset is empty.**
Passed blocks remain reusable only at their bound hashes, not independently
promotable pages. Complete per-block and per-row results are frozen in the
review root.

§97 title/TOC starts physical256/printed245; §98 starts257/246; §99
starts259/248. Three `问题` tasks 1/2/3 belong to §97, before the new
§98 heading, consistent with manifest `lesson-group` numbering.
The table belongs to §97 body prose, not an exercise; caption stays outside
the crop. All cont/open/samerow flags are false: page256's last paragraph
closes; page257 begins a separately indented new paragraph. Its last §98
paragraph ends `相对应.` and closes, but §98 itself is not complete.
Figure229 remains a printed reference only. No255 text or other-page pixels read.

## Table

Actual complete crop and existing native raster observed separately.
Table has two name/value groups, four columns, eleven paired rows,
top/bottom rules, three internal vertical rules, no per-row horizontal
rules or left/right outer vertical borders. No invented header row.
Title is `一些物质的熔点`, shared unit `°C`; caption emphasis fails
F257-1, while table pixels/data/grid pass.

|Row|Left °C|Right °C|
|---:|---|---|
|1|氢气 -259|琥珀 350—380|
|2|氧气 -219|锌 420|
|3|氮气 -210|铝 660|
|4|酒精 -114|金 1061|
|5|水银 -39|铜 1085|
|6|冰 0|铸铁 1100—1300|
|7|铯 29|钢 1300—1500|
|8|钾 63|铁 1539|
|9|钠 98|铂 1772|
|10|锡 232|锇 3045|
|11|铅 327|钨 3387|

All22 labels/value cells, signs and three ranges preserved; no scientific
correction. Final right labels 锇/钨 agree with the sole repaired inventory.
Original wrong inventory remains frozen, budget not reset.
Audited source box `[188,409,1159,661]`, actual crop/native1183×685
with12px padding each side. SVG/input/native/call hashes bind; original
vectorize mismatch0.024% reused, not rerun.

## Freeze And Budget

Owned root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-256257-first`

Author handoff SHA256:
`17e423803c1eb55d990c1f65a781d30cbe26d526a04ade2694c21d54c0618ccb`
Author source-manifest SHA256:
`0c65ccc08dab3e1f34cc19447996d803ed53edd4a2e75bb4cd83bd834c5ea263`
Reviewer `input-freeze.json`:215 inputs verified,214 copied
(source PDF hash-bound only, never rerendered).
SHA256 `deeb8a0226141814b0af7d79f76709255a8f4789c9af16bce02b391bd24ee583`.
Final `review-handoff.json` binds all evidence, results, this report,
empty page-approved subset and14 passed block references.

Images **8/8 batch,8/24 context**, one batch: two whole source pages,
one actual table crop, one existing native and four source detail crops.
Reopens0; other-page pixels0; parent image payload0. No more image loads.
Detail evidence and exact source coordinates/scales are in the review root.

Reused inherited prepare2, finalize2, vectorize1, explicit native1 and
MD/JSON-equivalence result. Reviewer calls to those gates **0**.
Historical prepare tool epoch stays unknown, not fabricated.
Original first failure/repair and successful command records preserved.
First reviewer final-binding command exited1 because shared `htmlfrag.js`
changed externally from5155 to6335 bytes after entry. Failed recorder preserved
as `finish-first-failed.mjs` and `finish-first-failure.json`; no result/gate was
emitted by that failed command. Final handoff binds any external reference
drift separately, without reverting it or repeating SOURCE review. This is
not an author failure, repair, SOURCE gate or budget reset.

Only owned review root and this report written. No author/canonical/
promotion/assembly/app/dependency/stable-tool/DB/publish/Git/backend writes.
Live Plane ticket read-only through n-plane helper. No IntentFold capability
or SkillHost update. No browser launched; all commands returned, no in-flight
execution remains.
