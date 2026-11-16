# 10c n83: immutable modern table author handoff

Date: 2026-11-16. Ticket STEMROBIN-184.
Authority: parent-agent delegation under existing human ticket authority.
Role: sole table author, not independent reviewer. Ptolemy owns the separate figure gate.

**AUTHOR STAGEB COMPLETE. Both first official renders exit0/status pass. No spec repair, rerender, independent approval or promotion. STOP after this handoff.**

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
All package paths below are relative to this workspace.

## 1. Inputs and immutable binding

The two originals were independently opened during original-only StageA. Their already frozen pixel inventory was reused; no original/page/source gate was reopened in StageB.

Own original inventory:
`.intentfold/tickets/STEMROBIN-184/tmp/ana10-n83-table-author-source-inventory.md`
SHA256 `156193cf96d0576fc8d9c4d511d8d43d5019daaf3cb90b0c96bfb2015fad35d4`.

The complete approved modern lesson/exercises were read, then each full official context. Neither parent review nor any answer, choice, other author/reviewer inventory or mathematical solution was read.

Approved durable DRAFT:
`ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n83/`

- `lesson.json`: `d4db11167eea1ec208f6d30039e3b9befaa94e48fbce03e5ccedb4a7b102ff8e`
- `exercises.json`: `3174f166733abd18869f76197cec5577573b6e3468e729b194b0a583af110266`

The author runner checked these exact current input hashes before rendering. Spec `source.authoritativeText` equals the complete official nearby-text projection, including every string and its whitespace; no context excerpt was silently omitted. `source.image` uses the actual durable root path and SHA.

| Table | Root original SHA256 | Official context SHA256 |
| --- | --- | --- |
| `tbl-p0036-01` | `ab6f1b14ae9b98c981eb337d5c0b55bd692b1661fa45716c9c8132ff42f978a4` | `89821cef344d74669edc353d9be16d4d037595a140060e120d0b6499f0e76e70` |
| `tbl-p0038-01` | `5efbd8da9ee3dcbaa1f50bd9b40315d4647f8c0a3705f15185b959a1cd301ba9` | `a77e9616cdfb371a749f5bfb961f586afb5e73df761a29667495578e45cbb62c` |

## 2. Complete source-to-object representation

Both tables use only existing JSXGraph `grid`, `segment` and renderer-owned `text` primitives. All source cells, signs, numbering, fraction components and blank headers have stable inventory mappings.

### tbl-p0036-01

Package: `.tmp/s10y-image/batch007/10c/tbl-p0036-01/`

- Canvas640x552, fixed640 scroll display.
- Four columns: blank numbering header / `u` / `sin u` / `cos u`.
- Four physical ruled bands: header; entries1-3 together; entry4; entries5-7 together. Thus16 physically bounded cells and32 logical alignment positions, including the blank header.
- No horizontal rule is added within1/2/3 or5/6/7. Seven aligned data baselines remain intact.
- The narrow numbering strip and three equal formula columns use two adjacent finite grids per physical band. Each of the eight mapped grids has its own exact `gridDimensions` assertion; collectively they cover four columns/four physical bands. `objectCount` is supplemental, not a replacement.
- Ten source inventory groups cover the lattice, blank header, other headers and each of the seven complete entries.
-51 objects:8 grids,4 fraction-bar segments,39 text components.

| Entry | u | sin u | cos u |
| --- | --- | --- | --- |
|1 | pi/2 + alpha | cos alpha | -sin alpha |
|2 | pi + alpha | -sin alpha | -cos alpha |
|3 | 3pi/2 + alpha | -cos alpha | sin alpha |
|4 | -alpha | -sin alpha | cos alpha |
|5 | pi/2 - alpha | cos alpha | sin alpha |
|6 | pi - alpha | sin alpha | -cos alpha |
|7 | 3pi/2 - alpha | -cos alpha | -sin alpha |

### tbl-p0038-01

Package: `.tmp/s10y-image/batch007/10c/tbl-p0038-01/`

- Canvas640x320, fixed640 scroll display.
- Four columns: blank numbering header / `u` / `tg u` / `ctg u`.
- Four physical/logical ruled rows: header and three individually ruled data rows,16 cells.
- Eight mapped finite grids have exact per-grid dimensions, preserving the narrow numbering column plus the three formula columns.
- Six source inventory groups cover the lattice, blank header, other headers and each complete entry.
-29 objects:8 grids,2 fraction-bar segments,19 text components.

| Entry | u | tg u | ctg u |
| --- | --- | --- | --- |
|1 | pi/2 + alpha | -ctg alpha | -tg alpha |
|2 | -alpha | -tg alpha | -ctg alpha |
|3 | pi/2 - alpha | ctg alpha | tg alpha |

Both tables retain stacked fractions. `tg`/`ctg` are unchanged, not replaced with `tan`/`cot`. Positive function values do not gain plus signs. Blank top-left headers do not gain a title, No., number, question mark or fallback token. No new value, domain/condition cell, answer, caption or exercise annotation is added.

## 3. Current output identities

| File | tbl-p0036-01 SHA256 | tbl-p0038-01 SHA256 |
| --- | --- | --- |
| `spec.json` | `ee66b348c00178095f66022a7699df63a1ca94cbefffd25c589c1724fde583a2` | `8c8b798af679d16d25f33743299bf632cb2355568fda68607940d18024d7f6eb` |
| `table.svg` | `3853005f986df08252a97774c686c306b06d44742b4ca4bd90d5330f595c182b` | `64e78c538cb1e72156a51477f24932c6d37089fd0a03f5fecfc5f82275758f47` |
| `table.png` | `a4f6ba628d2e43fed4b3adb4d2581afa6f7a1b1218af46ca3f52b75d880172e0` | `39b061f445bed367f24285504328072781b06bd18df3a77284f5a608a8ad6115` |
| `table.render.json` | `1182a24ca29cbfa8782b50daa7938776a0614a57b765805eb13db9ebc4c15e3e` | `b07d961af6f4165319b6ba2a2d0bf76489efe47107879581ee4a32e8dd9522d1` |
| `previews/metrics.json` | `214547dd59f084ca4bdaf863973b5a6b7dd7fef3eda7d864e910d5c005a3aa08` | `b8b14323f769515af7a9925fc2482d5a2cec4b806c98bf88bb94026dba6ee4f6` |

The immutable manifest is:
`.intentfold/tickets/STEMROBIN-184/tmp/ana10-n83-modern-tables-author.manifest.json`.
It enumerates current package bytes, initial snapshots, commands, stdout/stderr, preview PNGs and helper provenance with actual SHA256/byte sizes. The report and manifest receive externally calculated raw hashes at handoff, avoiding circular self-hashes.

## 4. Exact bounded attempt history

Two initial invocations:

```sh
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .tmp/s10y-image/batch007/10c/n83-author-run.mjs tbl-p0036-01
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .tmp/s10y-image/batch007/10c/n83-author-run.mjs tbl-p0038-01
```

The author runner invokes the existing `validate_spec.py --stage draft --json` once explicitly, then the existing `render_spec.mjs --spec ... --svg ... --png ... --report ...` once per table. The renderer also performs its normal built-in draft-validation precondition; that is not another render attempt. Actual absolute executable/argv/cwd/env/times/exits and full stdout/stderr are preserved in each `attempt-01/`.

| Table | Explicit draft check | First renderer | Report | Collisions | Render attempts | Spec repairs |
| --- | --- | --- | --- | --- | --- | --- |
|36 | exit0/pass | exit0 | pass |0 |1 |0 |
|38 | exit0/pass | exit0 | pass |0 |1 |0 |

Before each first render, `attempt-01/` received byte-identical spec/context, complete approved lesson/exercises, own frozen inventory and original PNG. It then received the exact first SVG/PNG/render-report outputs. No first renderer failure occurred, and no first output was overwritten.

The optional display-probe script first exited1 at ESM module resolution, before any script execution or browser launch. Its original script bytes, actual command and exact returned error excerpt remain at shared scratch paths named `n83-display-probes.first-module-resolution-failure.*`. The error excerpt is explicitly not misrepresented as a full raw stderr capture. This was not a spec/renderer failure.

Only the scratch probe's import resolution changed: `createRequire` anchored at the existing renderer locates the already installed `playwright-core`. No dependency, renderer or tool was changed. The subsequent actual probe command/stdout/stderr are retained as `n83-display-probes.{command.json,stdout.txt,stderr.txt}`; exit0. No spec correction or rerender followed.

## 5. Actual preview evidence and width limitation

The existing SVGs were previewed, not regenerated, in isolated headless Chromium contexts with network requests blocked. The renderer launcher and probe launcher both use `headless: true`; `PWDEBUG` is unset and `PLAYWRIGHT_HTML_OPEN=never`. No user profile/CDP, windows/tabs, foreground activation or system input was used. All task-owned contexts/browser processes closed.

Each package has eight preview PNGs:

- `previews/neutral-640-full.png`
- `previews/print-640-full.png`
- `previews/neutral-240-{start,middle,end}.png`
- `previews/print-346-{start,middle,end}.png`

The native `table.png` and generated `neutral-640-full.png` are byte-identical for each table. Native full PNGs were actually viewed separately at original detail, as were both complete print PNGs and every one of the twelve mobile start/middle/end PNGs. No original image was reopened.

Actual full previews show the complete outer frame, the blank header, every formula/sign and the required physical grouping. Mobile cuts retain readable symbols without shrinking: the whole table is reached by horizontal scrolling. Partial neighboring cells at scroll boundaries are expected viewport clipping, not missing/clipped canonical geometry.

Measured in every preview:

- Media width640px, not240/346px; declared renderer width640.
- Text22px, fraction numerator/denominator18px; actual minimum effective text18px, exceeding16px.
-240 container: scrollWidth640, maximum scroll400, observed0/200/400.
-346 container: scrollWidth640, maximum scroll294, observed0/147/294.
- No whole-page horizontal overflow. No resource requests. All canonical spec/SVG/PNG/render hashes equal before/after probe hashes.

This is an honest fixed640 scroll-media harness using theme variables, not a full lesson/product finalization or headed application acceptance. No inline240/346 readability claim is made; shrinking these tables to those widths would violate the intended contract.

## 6. Explicit retained limitations and stop

The original a/alpha-shaped angle glyph does not independently establish an alphabet/code point. The modern alpha variable is bound to the supplied approved context, and this original glyph limitation remains recorded in the inventory and both specs. No question-mark fallback or assertion that pixels uniquely decode alpha is made.

Coordinates, column proportions, baseline spacing and clean line weights are unmeasured modern typesetting regularization. Physical grouping, all cells, signs and mathematical expressions are preserved. These正文 tables do not depend on written-task answers; task101 remains outside this figure authorship and is not resolved here.

No independent review file, approval, manifest promotion, source/modern/template/context change, record_review, finalize, DB/network/service/model, app/tool/dependency/Git or other-chat action occurred. Only the two scratch packages, their local author/probe helpers/evidence, this report and its manifest were written. Existing work is preserved.

**Stop at immutable author handoff. Ptolemy's independent gate and parent promotion remain pending.**
