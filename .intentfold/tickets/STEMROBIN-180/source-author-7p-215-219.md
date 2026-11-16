# 7p physical215–219 source author freeze

Status: COMPLETE, awaiting FIRST independent source review. This report is author evidence, not independent approval.

## Scope And Source

- Exclusive root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-215-219`.
- Source PDF: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/sources/soviet10years/6-7p 苏联中学课本 物理 六-七年级.pdf`.
- Actual PDF SHA256 verified: `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`.
- Source manifest catalog `7p` resolves to shared PDF `6-7p`, numbering `lesson-group`; original unit numbering continues81/82/83, original figure numbering continues207/208/209.
- TOC boundaries: n81 printed204/physical215; n82 printed205/physical216; n83 printed208/physical219. Next n84 printed209/physical220 is outside this batch and its pixels/text were not read.
- Approved214 closed sixth-year boundary was reused as incoming context only, not reopened or duplicated. No canonical writes, assembly, adaptation, publishing, app, DB, Git, services, dependency or stable-tool changes.

## Authored Pages

| Physical / Printed | Blocks | Printed / MD Rows | Tasks | Original Figures | Repair Budget |
| --- | ---: | ---: | ---: | --- | --- |
| 215 / 204 | 8 | 12 / 12 | 0 | 207 | 1/1 used, scratch native-evidence helper only |
| 216 / 205 | 12 | 24 / 24 | 4 | none | 0/1 |
| 217 / 206 | 13 | 18 / 18 | 0 | 208,209 | 0/1 |
| 218 / 207 | 10 | 25 / 25 | 2 | none | 0/1 |
| 219 / 208 | 10 | 24 / 24 | 2 | none | 0/1 |

Total53 blocks,103 text rows,8 tasks,3 original figures. Row expectations came from the individually viewed pixels before finalize, not by adding/removing text to match a counter. `prepare` counts include illustration ink and are not the final masked text-row count.

Each full300dpi original was opened individually, then its100px grid. All3 original crops and complete native source-SVG images were actually opened in the two source/native comparison sheets. No modern figures were made. The displayed source/native sheets do not certify a future modern figure.

## Text And Boundaries

-215: preserve three printed level headings including 七年级, source81 heading, all6 prose rows, complete rectangular figure207 with all trajectory segments and nodes, separate caption and footer dots. Paragraph closes before page end; no fictitious incoming continuation.
-216: all molecular-motion prose and thermal examples, decimal `25000000000000000000` / `$2.5\times10^{19}$`,1厘米$^3$, §11, full bold thermal-motion definition, and all4 问题 retained. The new82 paragraph ends at `例`, marked open.
-217: first `如` is cont, joining the prior `例` to 例如. All energy-conversion text and §80 retained; lead ball/lead plate remain 铅球/铅板. The falling-ball paragraph spans the two illustrations via open/cont. Figures208/209 have distinct printed numbers and captions; their two captions share one real row, so209 is samerow. Figure208 retains child/held ball/plate;209 retains child/upper dashed ball/vertical dashed falling path/downward arrow/contact ball/plate. The observation paragraph ends at 扁了, open.
-218: 一些 continues the preceding 扁了. All observation, deformation/heat and particle-energy clauses, §11/§12, entire two-row bold internal-energy definition, and source emphasis scopes retained. First2 questions of82 are individually closed; their printed group continues on219.
-219: questions3/4 continue82 without an invented repeated exhead; new83 follows. Full two-row bold independence-of-overall-motion/position clause and the room-temperature emphasis retained. Source hydrogen molecule value `0.000000000000000000005` and `5/10^21` share one real printed row, not two fraction rows. Preserve1米$^3$,140000焦耳,5吨,3米, and the entire hammer comparison. The source line ending 很大的数量了 has no added sentence dot.
- Outgoing `p0219#9` is open: `但对物体内能的利用却不是这样简单的，并且也不总是`. No unseen continuation is inferred.83 is not claimed as a closed/publishable unit.
- Every footer retains its actual two round dots as `·204·` through `·208·`. Source dotted emphases are represented by Markdown emphasis with explicit notes distinguishing dotted emphasis from print bold. Mathematical errata remain empty; no new math correction was applied.

## Calls And Failure

Shared Python:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`

Official tool:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py`

For each physical page215,216,217,218,219 exactly once each:

```text
<shared-python> -B <p2c.py> prepare|finalize|vectorize --book 7p --page <N> --root <exclusive-root>/artifacts --work <exclusive-root>/work
cwd=/Users/yong/.codex/worktrees/0f12/lemmadeck
PYTHONDONTWRITEBYTECODE=1
```

All15 official calls exited0. Existing finalize audits report no errors, unknown characters, KaTeX warnings or normalization changes. Vectorization stdout records207 mismatch0.004%,208/2090.000%; no vectorization rerun. The resvg native display calls each ran once per actual SVG and exited0; they are retained as viewing evidence, not additional vectorization gates.

Preserved FIRST failure:215 scratch display helper looked in `artifacts` instead of `work` and emitted an empty list (process exited0 but semantic evidence failure). Empty record and failure declaration remain at `evidence/0215/`. Conservative mechanical-inclusive215 budget is1/1 used. Sole correction changes only the scratch helper lookup; repaired evidence is separate `native-evidence/0215/`. Official source bytes/crops/SVG and already-PASS calls were not changed or repeated. No other page has a failed call or consumed repair.

Exact argv, cwd, start/end, stdout/stderr hashes, tool before/after epochs, interpreter binding, and immutable call input/output copies are retained in `calls/<N>-<stage>/record.json`. Historical rough-box/pre-normalization inputs are deliberately distinguished from finalized MD/JSON/audit/output hashes. Tools were not rerun to align hashes to a later epoch.

## Exact Handoff

- Manifest: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-215-219/source-manifest.json`.
- Handoff: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-215-219/author-handoff.json`.
- Calls: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-215-219/call-ledger.json`.
- Each page MD/JSON/audit: `artifacts/7p/pages/0215` through `0219` under the exclusive root.
- Originals/grids/layouts/prepare templates/crops/source SVG: `work/7p/pages/0215` through `0219`.
- Actually viewed full source/native sheets: `native-evidence/0215/source-native-sheet.png` and `native-evidence/0217/source-native-sheet.png`.
- All file references in the manifest have exact absolute paths, byte sizes and SHA256. Handoff binds that manifest, ledger and this report; current MD/JSON/audit match their original successful finalize output snapshots with no postfinalize text edits.

Stop at author freeze. Independent reviewer must decide source fidelity; no self-source approval or promotion is recorded here.
