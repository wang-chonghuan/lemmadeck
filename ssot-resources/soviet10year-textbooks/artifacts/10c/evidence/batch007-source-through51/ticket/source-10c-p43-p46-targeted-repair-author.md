# 10c43/46 Targeted Repair Author

STEMROBIN-184; 2026-11-16; fresh text-only context. Author repair/count diagnosis only, no new source gate or independent PASS. **STOP: residual count-algorithm defect cannot safely be repaired through metadata.**

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`.
Evidence: `source-10c-p43-p46-targeted-repair-evidence/`; machine manifest: `source-10c-p43-p46-targeted-repair-author.manifest.json`.

## Changes

- 43 MD/JSON notes[2]: unsupported uppercase-T certainty becomes provisional T/tau-like UNKNOWN. Both body `\vec{T}` expressions and actual positive first `pi/2` remain unchanged; no minus added.
- 46 MD/JSON notes[1]: provisional a/q UNKNOWN, chosen `a` retained without decoding; last prose block's open flag becomes false and terminal Chinese comma becomes ASCII period outside math. Local closure does not assert n85 completion.
- All other printed rows, math, blocks, flags and metadata are unchanged. No durable `count_exclusions` added.

## Actual Count Diagnosis

The existing official `layout.line_bands` on original ink with the existing snapped figure boxes masked reproduces43's10/12 and46's13/28 first FAILs, without manual expected-count override. Current prepare/layout is reused, not regenerated.

Eight specific native strips were created and loaded once each at original detail; zero originals, existing full crops, reopens or other images loaded. `native-strips.json` binds exact boxes/pixels/hashes and `observations.json` records read order and findings.

- 43 last prose is one printed row: the counter retains bracket-top band y2115-2121 and splits the same interval/formula row into y2133-2177 /2178-2223. These are printed content, not permissible exclusions.
- 46 initial scale is line_h22/glyph_h21.75: ordinary prose and a single fraction formula are over-split. Native strips also confirm two isolated right-margin specks and a bottom scan-edge line, not body/figure content.
- One diagnostic-only counting-copy probe uses existing guard-approved `scan-artifact` boxes `[1594,1360,11,14]`, `[1589,1554,11,17]`, `[492,2468,1153,31]`; exact reasons are in `margin-only-diagnostic.json`. It naturally changes46's count28→16 and scale to29/30.75, without changing original pixels/crops or durable metadata.
- Residual46 middle interval row still splits y1682-1734 /1735-1787; final row retains bracket-top y2113-2117 plus2130-2174 /2175-2219. Removing these three extra counts through exclusions would hide printed brackets/fractions/prose. The inspected caption/figure boundary requires no crop change.

Therefore no sufficient metadata candidate exists for either page. **Affected finalize invocations:43=0,46=0; no retries or stable-tool changes.** First audits remain byte-identical FAIL10/12 and13/28, not replaced by the diagnostic16. MD/JSON literal repairs are consistent and await the parent's counter decision.

## Byte Evidence

Before edits,131 files were copied with exact-byte comparison, including full current MD/JSON/audits, all four prepared source sets, six crops, original author/StageA/StageB records and every first-attempt output/snapshot. `before.manifest.json` SHA256: `ae72fe165cd3d93aaab5f4205823d510b838b3379b224bc92e9dd04f6469b5bf`.

One scoped comparison proves125 untouched files byte-identical, both edited MD/JSON pairs exactly limited to the permitted replacements, all other blocks/metafields unchanged, and both FAIL audits unchanged. After-repair triples are frozen. `comparisons.json` SHA256: `f61a22b58f499d603ef461dbbc25bb52aa32795b02b8c7e7d70a1c908ef53c6b`.

Immutable StageB remains SHA256 `711c6ade6097c9315deb9020882044a041e72bbdafad0bcfa3903af29b069151`, including its six crop-limited PASS dispositions. All six existing crop bytes, source pixels, layout/tool patches,44/45 triples and source index remain unchanged. Exact diagnostic/strip/probe/comparison subprocess argv/cwd/environment/exit/stdout/stderr are saved beside their results. No old gate, other-page/index write, vector/adapt/answer/choice/app/dependency/DB/Git/browser operation or independent approval.

Remaining UNKNOWN:43 T/tau-like identity;46 final a/q identity; all other StageB UNKNOWNs remain unchanged and were not re-reviewed. Stop this image batch; return report/manifest paths and external hashes as text only.
