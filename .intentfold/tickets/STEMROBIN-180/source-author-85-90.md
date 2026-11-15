# Source Author: 6p Physical Pages 85-90

2026-11-15. Source author only; independent review remains pending.
Write boundary: durable pages 0085-0090, their corresponding scratch page
preparation/crops/vectors, and this report. No assemble, edition, global figure
promotion, DB, model, service, app, dependency, tool or Git changes.
Pages 82 and 84 are read-only; page 84 supplies boundary prose context only.

Use the already-confirmed shared interpreter:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.
Commands are page-scoped `p2c.py prepare/finalize/vectorize --book 6p --page N`,
with `-B`, using existing tools and dependencies. All six prepare commands
passed on first execution at 1472x2161, 300dpi. Initial whole-page line bands
are 24/25/26/26/24/25, before figure masking.

Source PDF: `6-7p 苏联中学课本 物理 六-七年级.pdf`, SHA-256
`46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`.
Each authored page preserves the complete prepared source/render/profile fields.
Actually read each page.grid.png separately before writing with apply_patch.
Retain printed lines, source numbers/units/names/countries, open/cont and
same-row captions. Do not alter source based on present-day knowledge.
Confirmed source errors must remain verbatim and be declared in errata.

## Incremental Status

| Page | Prepare | Grid/Transcription | Finalize | Vectorize |
| --- | --- | --- | --- | --- |
| 85 | PASS | Written from actual grid; one U+0020 repair completed | PASS: 24/24, 9 blocks, repair rerun PASS | Executed twice: 0 figures |
| 86 | PASS | Written from actual grid | PASS: 25/25, 17 blocks | Executed: 0 figures |
| 87 | PASS | Written from actual grid and original page | PASS: 26/26, 13 blocks | PASS: fig-63, 0.071% mismatch |
| 88 | PASS | Written from actual grid | PASS: 26/26, 8 blocks | PASS: fig-64, 0.017% mismatch |
| 89 | PASS | Written from actual grid | PASS: 18/18, 8 blocks | PASS: fig-65, 0.046% mismatch |
| 90 | PASS | Written from actual grid | PASS: 19/19, 14 blocks | PASS: fig-66 0.006%, fig-67 0.003% mismatch |

## Source Observations

Page 85: no figure; §33 continues after page 84's closed paragraph.
Original French place name 法国塞佛尔城 and all density/force figures are
retained. Last paragraph remains open at "重" for page 86. A trailing U+0020
after the printed "$1$" keeps its unit separated across the printed-line join.
Finalize/vectorize passed first execution with zero normalizations.

Page 89: source quotation completes page 88. Section 34 starts; figure 65
contains both instrument states, with source Cyrillic subfigure references
а and б. 1/9.8 kg, 102/204/306 g and 1/2 N are retained at printed precision.
The diagram splits one p open/cont; the last p open ends at 砝 and continues
on page 90. Finalize/vectorize passed first execution with zero normalizations.

Page 90 grid contains figures 66 and 67, not figure 69. The authorized pages
85-90 contain only figures 63-67. Figure 69 cannot be supplied by this batch;
do not invent an identity, prepare an extra page, or alter page 82 to satisfy
the earlier forward reference.

Page 90: first p cont completes 89's 砝码; 0.1/0.2/0.3 N and the 0-1/1-2/2-3
graduation intervals remain faithful. Figure 66 includes the gripping hand
and instrument, with samerow caption; figure 67 includes the entire
instrument/tractor/trailer group, source 0-5 dial, label and leader. Question
1 is complete; this page has no final open object. Finalize/vectorize passed
first execution with zero normalizations.

Page 88: first p cont completes page 87; figure 64 caption shares the left
prose row. Source 化费, Tsiolkovsky's name and novel title, nine planets,
600 kg, 6000/1000 N, 11/2.4 km/s, Ceres and Vesta fractions and the quoted
30/60/50 figures are retained. Final quoted p open continues on page 89.
Finalize/vectorize passed first execution with zero normalizations.

Page 86: first p cont completes page 85's 重力; both F=gm and P=gm,
9.8 N/kg and the 0.1kg/100g/10N/500g/5N approximation are preserved.
No figure. Questions 1-4 continue with questions 5-6 on page 87.

Page 87: questions 5-6, exercise 15 (1-3), and the unnumbered two-line
supplementary heading are retained. Source nine planets (including Pluto),
the visually checked integer 30000000000000000000000, 3x10^22 N, 3x10^19 kN,
318 times and 380000 km are not modernized. Figure 63 caption shares the
left prose row and uses samerow. The final p open continues on page 88.
Finalize/vectorize passed first execution with zero normalizations.

## Failure History

No prepare failure. The initial read-only existence inventory reported absent
target files (`ls`, exit 1); absence was expected and no retry or file repair
was required. Any first execution/check failure will be appended here before
one repair of its smallest affected unit. Failed files must be preserved.

First post-finalize structured check failed on page 85: the printed line
"除了牛顿以外还使用一种更大的力的单位——千牛顿." ends with U+002E
but lacks the U+0020 separator before the next printed line in the same
paragraph. This is a genuine join-space defect, not a line-count failure.
Preserve failed page.md/page.json/audit.json under the corresponding page
scratch `failure-01-join-space/` before the single affected-page repair.
Scan the remaining lines read-only before that repair; do not change prose,
numbers, units, figure identities or any other page without a found defect.

Read-only scan of all six pages found exactly this one missing separator.
Failed files were copied before editing. Repair 1 for page 85 adds only a
single trailing U+0020 on block 3, line 1. No textual, numerical, unit or
figure change. Page-scoped finalize/vectorize and the structured check must
now pass; a repeat failure is blocked, with no second page repair.

The rerun passed page 85 (including the repaired separator) and page 86,
then failed a new crop-size assertion on page 87. The assertion compared
the PNG dimensions directly with the ink bounding box and may omit tool
padding. No page/figure edit or retry of finalize/vectorize is authorized
by this check alone. Inspect the existing crop implementation and actual
dimensions read-only, and record whether the check or artifact is wrong.

Resolved read-only: `tools/layout.py:441-450` defines `crop(..., pad=12)` and
adds blank padding without copying neighboring source text. PNG dimensions
for figures 63-67 are 415x685, 344x658, 680x416, 291x290, 1115x429, respectively:
exactly their ink bounding boxes plus 24px on each axis. The assertion was
wrong, not the artifacts. No page or crop repair was made for that assertion.
The transient read-only check was corrected to derive padding from the
existing function signature; no tool source or extra script file was written.

Final structured check PASS for all six pages: prepared source/render/profile
metadata, actual page PNG SHA-256, page.md-to-page.json projection (figure
IDs derived using existing blocks.fig_id), printed line counts, empty
errors/unknown chars/KaTeX warnings/normalizations, padded crop geometry,
nonempty SVGs, samerow flags, open/cont links and U+002E/U+0020 joins.
The page 85 repair was verified to be exactly one added trailing U+0020;
finalize and vectorize reruns passed, with no second repair.

## Author Completion Boundary

All six actual grids were read individually; page 87's original-resolution
page.png was also opened to verify its long integer. All five final PNG crops
were opened individually: complete source objects/labels and no caption or
prose bleed observed. Existing vectorize resvg comparison passed for every
figure with 1px tolerance, well below the 2% limit.

No confirmed person/country/unit source misprint was silently corrected;
errata remains empty. Historical/scientific source conventions and printed
precision remain faithful. This is author completion, not independent approval.
No assemble, edition change, global figure promotion or publication occurred.
No page beyond 90 was prepared or authored. Figure 69 remains outside this
batch and needs separate source-page authorization.

Durable write set: pages 0085-0090, each page.md/page.json/audit.json.
Scratch write set: those six pages' preparation files, five PNG/SVG pairs,
and page 0085/failure-01-join-space/{page.md,page.json,audit.json}.
The only ticket file written is this report. No Git, DB, service, model,
app, dependency or existing tool modification.

Final page.json SHA-256 bindings:

| Page | SHA-256 |
| --- | --- |
| 85 | `2c9f7b8a188a97b0c3c0c5f7908bf7159895e8f547ee4da2b2ea6135a23a4d27` |
| 86 | `2a387199af016e456aac9881be5ecd7a6748a5328a506d30aa76b150e5e4a048` |
| 87 | `7f65911637a42cfc7d45ab08d06c27c9266eed633606976a6fd9f8a1e6fd25db` |
| 88 | `d3f8c7ced80bae041876517f2f6dd9bf2b2f168c1b782cf7902aedf6b45785d5` |
| 89 | `fa87fd81535ff5c2d4e567f1cb9620eb8589e0b876aa181a3a9734a6c1fdc3d2` |
| 90 | `8cc8e2d47e6fc6deb7835d6cdae1e14ddbc26a129be4587d2860940ef51a4b52` |

## Protected Boundary Hashes

| File | Initial SHA-256 |
| --- | --- |
| 0082/page.md | `06472f2bc601d6a1e2811fd15fd85ca395d54a11cc9e0383e7bedcc6aca51207` |
| 0082/page.json | `df033776a667d38a2ddc5d0a1ba9f57b5d5d32f78dc273485023b8297c49850e` |
| 0082/audit.json | `fe659512c6e0f0362f318e170cd0ca089ee726e11c2dddd3b27271b28d5f7969` |
| 0084/page.md | `0d4569363457facb26dcb0ecfc19e1d60af04c05686c03b36c8124520662fa7a` |
| 0084/page.json | `ad8191417a3cd9f38091018e874d8affd15c6d9caab1a5b96fc4c9d262af5945` |
| 0084/audit.json | `5b0027206bd2369974f564996bfb0e8ba4dcf389c28bc45cbfb279462b113089` |

Final read-only SHA-256 comparison: all six protected files above are unchanged.
Author work stopped at this boundary; independent source review remains pending.
