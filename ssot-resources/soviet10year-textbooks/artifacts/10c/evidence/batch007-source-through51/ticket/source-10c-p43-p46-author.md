# 10c physical43-46 faithful source AUTHOR handoff

Ticket STEMROBIN-184. Author only; no independent source approval. All four first attempts are frozen. Mechanical failures on43/46 remain unresolved and were not diagnosed, repaired, excluded, masked or rerun. Ptolemy is the sole pending independent reviewer. New47-51 continuation is a separate authorized package and cannot alter this package.

Workspace root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Evidence root: `.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p43-p46-author-evidence`.
Complete companion manifest: `.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p43-p46-author.manifest.json`.

## Ordering And Source Scope

Parent's once-prepared originals/grid/templates/layout for all four pages were copied byte-identically to `prepared-before/<page>`, before any durable MD existed. Each page's template and native grid/original were then opened individually. Own `source-first-0043.md` through `source-first-0046.md` were written before the corresponding durable MD. Only approved42 tail TEXT was used for incoming n85 continuity; no42 image, reviewer report/inventory, answer, modern artifact or prior question was read.

Each durable MD was manually written with apply_patch and copied to `<page>/first-draft-before-finalize` before its sole first finalize. Complete stdout, stderr, cwd/argv, exit/times, durable MD/JSON/audit and scratch result including all actual crops are retained under `<page>`. All six actual source crops were subsequently opened one at a time at original detail. No hand cropping, image rendering, tool editing, prepare repetition or counter work.

## Actual First Results

Counts below are MD/actual machine; human source-first observations are separately frozen, not supplied as overrides to any tool.

| Physical / printed | Blocks | MD / machine | First exit | Actual result | Crops |
| --- | ---: | ---: | ---: | --- | ---: |
| 43 / 37 | 9 | 10 / 12 | 1 | FAIL: printed-row mismatch only | 3 |
| 44 / 38 | 9 | 18 / 18 | 0 | Mechanical line/whitelist/formula PASS, not content approval | 1 |
| 45 / 39 | 14 | 24 / 24 | 0 | Mechanical line/whitelist/formula PASS, not content approval | 0 |
| 46 / 40 | 8 | 13 / 28 | 1 | FAIL: printed-row mismatch only | 2 |

Every attempt reports zero normalization edits. All stderr files are genuinely empty. Exactly one finalize per page, zero reattempts;43/46 failures remain intact. Author continued only other unattempted pages as explicitly allowed.

Full executable is `env`; exact argument vector for each page N:

```text
-u PWDEBUG PLAYWRIGHT_HTML_OPEN=never
.claude/skills/ld-s10y-lesson/.venv/bin/python -B
.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page N
```

This is one argv sequence, not separate shell commands. N was43,44,45,46 respectively. Full command/result records are `<page>/command.json` and `<page>/result.json`, with actual stdout/stderr and timestamps.

## Content And Boundaries

- All pages belong to continuing n85; no new h3, exhead, written exercise, Cyrillic subpart or teaching footnote was printed on43-46. No exercises/next lesson were invented.
-43 first p cont begins `=π/2时` completing42's open paragraph ending `和x`. Its source body table preserves the derivative/function rows and lower extrema boxes; the visible derivative endpoint values are both-1. Two source sine diagrams retain their labels and line extents. The last p is open at `由于连续`.
-44 first p cont begins `性` and retains the inverse-sine definition, D/E, symmetry, oddness/increasing statement and all four source worked values/reasons. Actual second source group prints `sin(-π/6)=1/2` with positive RHS; left faithful, noted, no mathematical erratum. Fig26 caption shares the printed row of the first group's `而且π/4...`, with actual samerow. End of fourth group is closed.
-45 includes degree/radian explanation, literal angle range, both equations, same-row conversion statement, source worked example1 with0.9063/65°/1.1345, numbered equation(1), no-solution branch and complete a=1 branch. Fig27 is referenced but not printed here, so no invented45 crop. Final formula closes locally; n85 remains active.
-46 retains fig27/28, complete a=-1 branch, |a|<1 discussion and all three source closed intervals. Source wording `在这两个闭区间的每一闭区间上` retained. Last p ends after `arcsin a，` and remains open. No47 reading or guessed next formula when authoring46.
- Physical-to-printed offset is confirmed43→37,44→38,45→39,46→40, not assumed.
- All page marks/margin specks/scan-edge lines remained original. No count_exclusions, fabricated rows, source glyph normalization, endpoint adjustment, errata or math corrections were introduced.

## Actual Crop Observations

Source crop path prefix: `.tmp/ld-s10y-lesson/10c/pages/<page>/figures/`. Each image is also byte-retained under `<page>/after-scratch/figures/`.

| Page / crop | Actual snapped source box | Source-only post-finalize observation | Raw PNG SHA256 |
| --- | --- | --- | --- |
| 43 / tbl-p0043-01.png | [263,469,1224,419] | Opened full image: complete3 main rows, all columns/arrows and both hanging 极小值/极大值 boxes; no neighboring prose or fabricated caption | 502daf2525eae862f68d5f750e5e95d37e754f84538da7ce94767cd38e99e589 |
| 43 / fig-24.png | [485,1239,847,350] | Opened: sine trace, full x/y axes,0 and all4 original pi labels, no±1 labels added | 39d1906beba349067a337f6a164e5608ced000e01b5b35fa33dc0ca521664644 |
| 43 / fig-25.png | [251,1706,1271,269] | Opened: repeated trace, both axes,0,±1 and all actual labels from-2pi through3pi with original curve extents | 39089fd532ea6b6892d06bf38638bf13a64726fbba4b44c947fcfefbb9823d74 |
| 44 / fig-26.png | [959,770,435,524] | Opened: inverse-sine trace,0,±1,±pi/2, both axes and all dashed endpoint projections, no prose/caption in crop | 47adf3220b439fe7a24d9495986174a9ef4c094a95ba34747f452b540b3b9a52 |
| 46 / fig-27.png | [155,261,1288,388] | Opened: all5 horizontal levels including x axis, periodic trace, a>1/a<-1, all extrema labels/guide dashes and axis arrows. Source ink/noise not altered | 90383a12ea5f11571494ead792efb20820ecd75a16e849c88f16b0089fa210b4 |
| 46 / fig-28.png | [168,763,1271,302] | Opened: both a horizontals, trace,0<a<1/-1<a<0, all shown intersections/dashed projections, extrema labels and full axes | c8f7749b95bc91e1a22b2cf2aac1aeee9b9346540bd032fb5c69fb4d4d85b809 |

These observations are author crop completeness checks, not an independent image PASS or promotion.

## Frozen Durable Bindings

Durable prefix: `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/<page>/`.

| Page | page.md SHA256 | page.json SHA256 | audit.json SHA256 |
| --- | --- | --- | --- |
| 0043 | 50f7c4130b42a895a23b475c0857ef4f2a8b62c7485bba3af8f8e27b84c29df0 | 21a53c324d8c7396bb5840cf7e4fdd30fa95fbfb9fe380bb201c7c1dae0048e2 | 8fe17392a54850829bab07f4d99cb1bc92ce7bb24467d4be701c37a5071bbb04 |
| 0044 | e240563722e991eb470e377cb7f2a1fc3b4d66ec5c973bb4b55c6f04e3c76350 | 5b48fb7e21ef53d99bc2650230e9c03afcb7c8166be0df4745dfa47463449fb8 | d6e5c3073136a87ed4ed64e72950c0eddc8db9a0363dd88755b11c7a7263e918 |
| 0045 | 6a41971d8b42fc0060d0c72814d9485f7e056e04fd950e4410271a790e7c67d3 | 71023115699a9053ca7cba5160e4fca962da8aea0b0f02fa2da52c3f17fbdeff | 2997ae909a2d5eeef16438dbb6699973fe47412ea87106206812b2f807f2a9ed |
| 0046 | 9019817988e0ca7ae160aba01e5e3aa7bdca14259deb0d9b3e603e276d1b1a6b | 6af9e0918d0ec1f181f8f5720fd13eeb6cf76347394416289dffbd904e568ae8 | 96753a7948a9f544e1843ef0459d93636075b91c3ff9859971e50d87a28e1a4e |

`current-bindings.json` contains every original/grid/template/layout SHA, source-first SHA, crop SHA and equality to full after snapshots. All16 once-prepared files match prepared-before bytes; all12 durable files match their after snapshots. The source book index remains raw SHA256 `93d6d63d1572316e8ecda7b296911b593279a6a425be0261939d619e924f1565`, byte-identical to before. No source index, previous page, modern lesson, answer/choice, figure vector/spec, tool, DB, Git, dependency, browser, service or other chat touched.

This report and companion manifest are immutable author handoff.43/46 FAIL is not cleared,44/45 mechanical PASS is not independent approval. Stop this package for sole Ptolemy StageB; no further43-46 author action.
