# n83 First Finalize/Display Run: Completed, Display REVISE

## Actual Disposition

STEMROBIN-184; approved n83 mechanical closing and first offline display only. **Official adapt-finalize, render and existing offline layout helper each ran once and exited0. First screenshot reading found N83-DISPLAY-01, so the display disposition is REVISE, not unconditional PASS.** No repair or rerun followed. No whole-course completion, answer, choice, or new independent text/math/source approval is claimed.

Approved TEXT and Ptolemy's unique two-table StageB are reused; disclosed table StageB SHA is `7d38fb24ce0c25d80dcb6db46905e12e473a6f118f869ba84a4e9a239256a38c`. The parent-retained table package remains at `ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-n83-tables/`. No original image/inventory or source mathematics was rereviewed.

## First Actual Display Defect

**N83-DISPLAY-01:** the shared `g2` instruction for exercises71-76 exposes literal `$45^{\circ}$` instead of a rendered angle. This is visibly present in both first desktop/mobile exercise screenshots. The saved native HTML contains:

```html
<div class="exgroup">把下列三角函数值化成小于 $45^{\circ}$ 的正角三角函数值：</div>
```

The raw formula starts at character offset370916 in the saved `native-render-first/exercises.html`. `first-visual-display-finding.json` records the exact snippet and screenshot basis. The existing offline helper checks counts, geometry, error elements and figure labels but does not reject raw TeX in group headings; its exit0 therefore does not settle this display defect.

No source/group mathematical data was modified, no inferred solution was added, and no repair was attempted. A later parent-authorized affected display fix must retain this first output; it is not a reason to reopen text/source/answer gates.

## Historical STOP And Narrow Index Authority

The original STOP was the parent's wording conflict between “do not touch indexes” and the official command's intrinsic edition-index generation. It was **not a command FAIL**: initial adapt-finalize attempts were0.

The initial report remains untouched at `T/ana10-n83-finalize-display-author.md`, SHA `e04d01b75a71f61d67d034c1e4923835d3972922496d40f7f26f78979ec49cfc`, and was copied exactly to `T/n83-finalize-display/partial-before-index-authority.md`. The original manifest SHA remains `fd8aa5462111327088b6dc74a5aca926630b7fc4d105f06707fb8869006d6a9c`; its separate original-byte copy is `partial-manifest-before-index-authority.json`.

After explicit clarification, current edition `book.json` was copied once to `before/edition-book.json`, SHA `625438d1310f5129a7fd5b6fa9ecd68d55fef36962807a8bd44263ba748c20b9`. Only official adapt-finalize generated the new edition index, SHA `fdfbc4d82bf0c7aac382ccba89fe234afcd2dcc8ae9c08c2bce202f3c9db268f`; its post-run snapshot and structured automatic-output diff are retained.

Source `10c/book.json` remains exactly `93d6d63d1572316e8ecda7b296911b593279a6a425be0261939d619e924f1565`. No source index or manual index operation occurred. The already-PASS binder was **not rerun**, and the three original template backups were **not repeated**.

## Commands And Actual Results

All commands ran from `/Users/yong/.codex/worktrees/a07e/lemmadeck`. `T` means that root's `.intentfold/tickets/STEMROBIN-184/tmp`, and evidence `E` means `T/n83-finalize-display/`.

```text
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never \
  .claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-finalize \
  --book 10c --edition modern-us-neutral --lesson ana10-c6-s3-n83
exit0; stdout: [adapt-finalize] ana10-c6-s3-n83: PASS 正文改写 23/30, 题改写 0/48, 新图 2
```

```text
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never \
  .claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .claude/skills/ld-s10y-lesson/tools/p2c.py render \
  --book 10c --edition modern-us-neutral --lesson ana10-c6-s3-n83
exit0; render ok:true, exercises48, rendered flow objects35
```

```text
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never OFFLINE_REPORT=report-first.json \
  node .intentfold/tickets/STEMROBIN-184/tmp/offline-check.mjs \
  10c ana10-c6-s3-n83
exit0; existing helper status:pass; viewports1440x960 and390x844
```

Each command's full argv/cwd, stdout, empty stderr and actual result (signal:null, error:null) are preserved in `E/adapt-finalize-first.*`, `render-first.*`, and `offline-first.*`. No initial command failure is omitted and no automatic retry occurred. Binder count remains1 total,0 on this resume; all three later operations count1 each.

The exact existing offline helper was copied to `E/offline-check-used.mjs`, SHA `08aada5d0ec8847c6d32972e8b33a24187f2549ea382f435c91b45c07a6b1847`. Its effective standalone launcher is `chromium.launch({headless:true})`, using the app-installed official Playwright. Both contexts are isolated and nonpersistent; HTTP(S) requests are aborted, `PWDEBUG` is cleared, and the browser is closed in `finally`. No user window, profile, CDP, OS input or visible fallback was used.

## First Display Observations

- The30 source objects remain; official rendered prose flow has33 paragraphs plus two tables, explaining render's35 flow objects. Both viewport checks counted all33 paragraphs, four actual section boundaries and48 written tasks.
- The complete exercise number range71-118 and all seven shared instructions were observed in the first saved screenshot pixels. Desktop lesson/exercise views run through the final examples/tasks and bottom navigation. No overlapping prose/table regions were observed.
- Both tables were actually opened whole from first desktop figure screenshots. They retain7 and3 data rows; native media dimensions are640x552 and640x320.
- In both viewport checks the media stay exactly640px wide. There are39 and19 SVG text labels; minimum actual screen-CTM font size is18px for each table, and every label fits its full media box.
- Mobile horizontal table frames have clientWidth358 and scrollWidth640. Both first scroll-end operations reached actualScrollLeft282, exactly maxScrollLeft282. All four saved mobile start/end screenshots were opened; last `cos u`/`ctg u` columns and the right frames are visible at the ends.
- Whole-page document widths are1440/390, matching viewports with no horizontal page overflow; all paragraph/task rows have positive dimensions and remain inside the viewport. The helper found no remote assets, error-only/KaTeX-error elements, input/textarea controls or page errors.
- Narrow-view long formulas retain the renderer's local horizontal clipping/scroll presentation. This run does not certify every separate mobile formula-tail interaction; no second browser cycle was added. Full formula chains are visible in the desktop screenshot pixels, and approved text evidence is reused without solving.

Four full-page screenshots and eight table-scroll screenshots are retained in both `T/offline/ana10-c6-s3-n83/` and `E/offline-first-evidence/`. Four optional native-pixel reading atlases were made only from those saved screenshots: no rescaling or browser reexecution, with exact crop provenance retained. They allow readable first inspection of every page region without replacing the native screenshots.

## Immutable Output Bindings

Durable n83 root is `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n83/`.

| Output | SHA-256 |
| --- | --- |
| `lesson.json` | `c7006989e5faae2403ebb3c5e3f103188c6974c8ab5a96f92240ff78cbb2bdb8` |
| `exercises.json` | `375e93b39f4c0de68f5249ff316bf3fee5d3cbd4505f6a0a223991a56cec22c3` |
| `figures.json` | `9da8f9e20d3d40cf62a0b989f2fcec3e887c184167f53b9e2cad50a1f083ee87` |
| `adaptation.audit.json` | `7650ab03921a3c8944bb075fda5c6998289cce1d281b1c046735d8ae3e4094bd` |
| Native `text.html` | `6cf894d3a2c6dfeab1d4b1b431c996ada63808382fbe8c855e0189e95dad4a47` |
| Native `exercises.html` | `be9c637465764145a459551c447dc90e39ab58be44a3a5eb42e2fe6b89b21b49` |
| `E/offline-first-evidence/report-first.json` | `acabe257d1546e5ede5f7b9876ca81f4826e8e46236ef60efe271ff2bf20c898` |
| `E/completed-bindings-and-disposition.json` | `66f93d35288e76bae555d2bd2b588e55ea721c638cbc899d2c49f4b21f99bbe8` |

Candidate-to-final strict comparisons show only `status:draft -> ready` for lesson/exercises and no changes to the already-bound figure manifest. All approved text, source wrappers, mathematical data and101 literal remain unchanged. Exercise101 is still exactly `101. $\sin2\frac{1}{7}\pi$.`; its semantic UNKNOWN is unselected and no answer/choice was generated.

Durable table spec/SVG bindings:

| Table | Spec SHA-256 | SVG SHA-256 |
| --- | --- | --- |
| `tbl-p0036-01` | `ee66b348c00178095f66022a7699df63a1ca94cbefffd25c589c1724fde583a2` | `3853005f986df08252a97774c686c306b06d44742b4ca4bd90d5330f595c182b` |
| `tbl-p0038-01` | `8c8b798af679d16d25f33743299bf632cb2355568fda68607940d18024d7f6eb` | `64e78c538cb1e72156a51477f24932c6d37089fd0a03f5fecfc5f82275758f47` |

Complete current render/review contract hashes, before/after snapshots, screenshot hashes and metrics are in `E/completed-bindings-and-disposition.json`. Native HTML is preserved under `E/native-render-first/` and remains at `.tmp/ld-s10y-lesson/render/10c/modern-us-neutral/ana10-c6-s3-n83/`.

The companion manifest is `T/ana10-n83-finalize-display-completed.manifest.json`, binding this report and all retained first-run evidence. Both raw hashes are obtained externally after freezing.

Only the explicitly permitted official edition-index output expanded scope. No source/book-source edit, n84/n13 action, new text/math/source gate, app/tool/dependency change, DB/Git/network service, answer/choice access, publishing or whole-course completion was performed. First-run failures/dispositions and initial STOP history remain intact. Writes stop here for the parent's first visual comparison and any separately authorized affected display repair.
