# STEMROBIN-180 independent SOURCE REVIEWONLY: b58 / 8p 0095-0096

Date: 2026-11-17. Same existing invocation; fresh independent source review.

**Overall verdict: REVISE.** Page 0095: **REVISE**, one source-punctuation substitution. Page 0096: **FIRSTPASS**. Existing first prepare/finalize receipts remain successful; they do not establish literal fidelity. No repair or rerun was performed.

## Finding

**[P3] Restore the sentence boundary after 2 degrees in the incoming exercise 4.**

- Location: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-angular-speed/artifacts/8p/pages/0095/page.md:43`; also `page.json` block `p0095#2`, second text line.
- Original, independently inventoried row 04: `移矢量之间的夹角为 2°。试求这两个位移矢量的大小。` The printed mark immediately after the degree symbol is a baseline full stop, with no comma tail.
- Candidate: `移矢量之间的夹角为 $2^\circ$，试求这两个位移矢量的大小.`
- Faithful profile-normalized text should read: `移矢量之间的夹角为 $2^\circ$. 试求这两个位移矢量的大小.`
- The `soviet-cn` profile permits converting a source sentence stop to ASCII `.`, not converting it into `，`. This is a change to sentence segmentation, not a mathematical erratum or harmless full-stop normalization.
- Evidence: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review9596/0095-incoming-ex4-punctuation.png`, SHA256 `5f639dc23814af5cdfb94743d7105c02d090b22fc781bc50b79f89a419aba803`. This is a 1400 x 240 text crop from original 0095 with top-left `(180,380)`, made with `sips --cropToHeightWidth 240 1400 --cropOffset 380 180`, without altering the original.
- The same comma is quoted in the author report's incoming-boundary transcription. Its claim of complete fidelity for both pages therefore needs qualification. The defect lies before the target n19 heading, but whole-page source review includes that incoming text.

No other discrepancy was found in the assigned pages' words, formulas, numeric values, emphasis, heading order, footer values, exercise membership or continuation flags.

## Independence And Scope

The first content reads were original `work/8p/pages/0095/page.png`, then original `work/8p/pages/0096/page.png`, one image at a time. Before reading candidates, the author report, layout or audit, the complete 48-row pixel inventory was written to:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review9596/independent-inventory.md`

Inventory SHA256: `d84e22664eb1aa22a6b62b227c04feb4c2e4a136550b4f71a66f60af7f7dba07`.

Only then was `source-author-8p9596-b58.md` read, followed by both candidate `page.md`/`page.json` files and the existing receipts. One local original-text crop was loaded to confirm the independently noticed punctuation difference. Total image loads: **3/8** (2 full originals + 1 crop). No grid images, figures, other source pages, answer material or choice keys were loaded.

Read rules: repository `.intentfold/readme.md`, engineering charter, `intentfold` routing, `ld-s10y-lesson` source rules, `ld-s10y-image` image-batch rules and the `soviet-cn` profile. This was not a new IntentFold capability invocation. No freshness/setup/backend/network/Git/tool-code inspection, gates, generation, finalize, vectorize, assemble, adapt, promote, checkpoint or usage operation was performed.

Writes are confined to this new report and its dedicated evidence directory. No existing page file, author report, command receipt, other dirty file or HOLD artifact was changed. No separate HOLD artifact was opened. HOLD terminology below describes only the visible n20 fragment and author-report status, not an inspected historical HOLD.

## Entire Row And Block Comparison

The evidence inventory supplies every printed row in full, including all exercises outside the target, mathematical punctuation, the bold definition, displayed formulas and footers. Independent counts were made before reading the existing 24-row receipts.

| Page | Pixel Rows -> Candidate Blocks | Result |
| --- | --- | --- |
| 0095 / printed 83 | 01-02 -> #1 ex 3; 03-04 -> #2 ex 4; 05 -> #3 h3 n19; 06-11 -> #4 p; 12-13 -> #5 p; 14-15 -> #6 bold p; 16-17 -> #7 p; 18-23 -> #8 p open; 24 -> #9 foot | All 24 rows covered; row 04 punctuation requires revision |
| 0096 / printed 84 | 01-03 -> #1 p cont; 04-09 -> #2 p; 10-13 -> #3 p; 14 -> #4 exhead; 15 -> #5 ex 1; 16 -> #6 ex 2; 17-18 -> #7 ex 3; 19-21 -> #8 ex 4; 22 -> #9 h3 n20; 23 -> #10 p open; 24 -> #11 foot | All 24 rows covered; FIRSTPASS |

No figures, tables, captions, footnotes or extra exercise groups appear. Numerator/denominator levels within a stacked fraction are not separate printed rows. Margin blemishes are not content.

### Words, Numbers, Formulas And Emphasis

- 0095 incoming exercises retain two equal speed-vector magnitudes `15 米/秒`, included angle `5°`, displacement-difference magnitude `2 厘米`, and included angle `2°`. All words and values match; only the cited sentence stop differs.
- Target heading is exactly `19. 匀速圆周运动的角速度和线速度`; the prose cites `§18`. It retains the distinction between a radius's angular speed and a point's angular speed, the radians-per-second unit, and the equality between linear speed and the magnitude of instantaneous velocity.
- The entire two-row angular-speed definition remains bold; ordinary surrounding prose is not spuriously emphasized. Actual headings are represented by `h3` and `exhead`. Their visual display spacing is not treated as semantic word content.
- Every target mathematical occurrence was compared: lowercase `\varphi`, `\omega`, `t`, `l`, `r`, `n`; uppercase `V`, `T`; `\omega=\frac{\varphi}{t}`; inline `\frac{l}{r}`; `\omega=\frac{l}{r\cdot t}` with the multiplication dot; `l=Vt`; `\omega=\frac{V}{r}`; `V=\omega r`; `2\pi`; `2\pi n`; `\omega=2\pi n`; and `T=\frac{1}{n}=\frac{2\pi}{\omega}`. No numerator, denominator, case, operator or value discrepancy was found.
- 0096's first displayed formula ends with a comma, followed by standalone `或` and the second formula's full stop. These are retained. Other source full stops become profile-authorized ASCII dots, distinct from the finding above.
- Actual `练习 14` contains exactly ex 1-4. The first two ask for the angular-speed definition/unit and its relation to linear speed. Ex 3 retains `地球绕太阳`, both requested speeds and exactly `150000000 千米`. Ex 4 retains `克里姆林宫钟楼自鸣钟`, `3.5 米`, the minute-hand tip-speed question and the angular-speed comparison with a wristwatch's minute hand. No subquestions, values or geographic wording were silently adapted.
- Footer values are independently visible as `83` and `84`, each between two decorative dots. Candidate `· 83 ·` and `· 84 ·` preserve that content as one row each.

## Verified Boundaries

Supplied boundary descriptions were treated as hypotheses and verified from the two original images, not accepted from the author report.

- **Left boundary:** 0095 rows 01-04 are two complete incoming exercises, printed 3 and 4, above the real n19 heading. They are not target exercises. Their upstream lesson/group remains unclaimed; no preceding page was opened.
- **Target start:** 0095 row 05, printed page 83, is the actual n19 heading.
- **Cross-page target continuation:** `p0095#8` ends `又因为 $l=Vt$，所以`, with `open: true`. `p0096#1` has `cont: true`, `open: false`, and exactly the three rows `$\omega=\frac{V}{r}$，` / `或` / `$V=\omega r$.`. This matches and closes the carried derivation.
- **Target end:** n19 theory reaches `T=1/n=2π/ω`, then its actual `练习 14` has four complete exercises. Its final exercise ends `进行比较.` at 0096 row 21. No n19 block remains unmatched.
- **Right boundary:** 0096 row 22 is genuinely `20. 匀速圆周运动物体的加速度`, printed page 84. Its following prose is only `现在回到我们的任务——求做匀速圆周运动的物体（我`, stopping at the unclosed `（我`. Candidate `p0096#10` is correctly `open: true`, not an exercise continuation. Preserve **HOLD / OPEN / UNCLAIMED**; no next page was opened or missing continuation invented.

Thus **n19 itself is source-complete and its target content passes this comparison**, with four exercises. **The entire assigned two-page source candidate is REVISE** because of the incoming exercise punctuation. Source completeness is not assembly, adaptation, promotion, publication or product acceptance.

## Exact Input Binding

Absolute page-input root:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-angular-speed/`

Every path in the next table is joined to that exact absolute root. All 14 measured SHA256 values agree with the author report. Grid/template files were hashed for binding; grid images were not loaded and template text was not used for independent inventory.

| Relative Path Under Exact Root | SHA256 |
| --- | --- |
| `work/8p/pages/0095/page.png` | `f48152d38d48ebb6cd43d3b73ef1ce4b0ef90ebf38eb0db244473906fa30796d` |
| `work/8p/pages/0095/page.grid.png` | `c8373db6199097298c63ff7a49f577dc130b33c7a178f63012c6a091970d1ad7` |
| `work/8p/pages/0095/layout.json` | `cbc1f9f0d75743c7d5087c2e048598d21c58fd611d38a207eccdae67cdd2dc5e` |
| `work/8p/pages/0095/page.template.md` | `4c6229c17dc10378573ad0693c4907769e07b28d370ffc980042c162760250fe` |
| `artifacts/8p/pages/0095/page.md` | `7ff758aa9c13dacabd9e4159497742629e168ad6b0fcfaf445b854903c948550` |
| `artifacts/8p/pages/0095/page.json` | `210432e296b8e8efbc69c27faf95f0ab84df4e50465928f0db6cc29160221798` |
| `artifacts/8p/pages/0095/audit.json` | `13ebdc5afe506e3942d1f5892020e52803fdbf726be20fbe576a1c85cbd7fbdf` |
| `work/8p/pages/0096/page.png` | `860834a3ce3b5d577260dd2ab6923ebee2614d4ef6c8afe5f0af78307e0ba954` |
| `work/8p/pages/0096/page.grid.png` | `0a9ca3157b0ed0abeb961ec4449f6ab1959276fc7727e10b91d8fc486a30b57a` |
| `work/8p/pages/0096/layout.json` | `cc3f34e83e61aa2ef0cb849b8fd67ceb9bd5e74b0c9af370dfb638057738476d` |
| `work/8p/pages/0096/page.template.md` | `29e2f4be76ebf57cfdf7572b2fecba0175f1e5724bfeb80a8800e863aa225576` |
| `artifacts/8p/pages/0096/page.md` | `78f4c3504cbdff0fbeb2e21ae5a0a8d0464f110fdcb7dc3fd6e3750383ffc0f6` |
| `artifacts/8p/pages/0096/page.json` | `bccfe0ca0709ab790ec8c5a846fd9340e79ba264ba148cf9cba0d9388cd6dce0` |
| `artifacts/8p/pages/0096/audit.json` | `1b2470cfdcc8f39ce6472297e76e6d4249889759f7180e922bbcae5c4344325e` |

Source/profile metadata on both pages binds PDF `8p 苏联中学课本 物理 八年级.pdf`, SHA256 `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`, physical pages 95/96, renders 1695 x 2580 at 300 dpi, and profile `soviet-cn`, SHA256 `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`. The profile file was directly read and hashed. The PDF/TOC/manifest identities in the author report were not independently re-extracted or queried; boundary conclusions above come from assigned page pixels.

Author report:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-author-8p9596-b58.md`

Measured author-report SHA256: **`37d468dff1bd6fb74adc2e284f8c2d3959361486d3b382a836569216a2573320`**. It equals the existing `b58-author9596-026-report-hash.stdout` report binding.

## Existing FIRST24 / 24-Each Receipts

Receipt root:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`

The following original receipts were read, not executed or regenerated. Their actual call/stdout/stderr hashes match both the call records and the author report. Each call records exit 0, null signal and zero-byte stderr.

| Page | Exact Receipt Basename | Existing Result | Call JSON SHA256 | Stdout SHA256 |
| --- | --- | --- | --- | --- |
| 0095 | `b58-author9596-012-prepare-0095-first` | FIRST24: 24 detected rows | `a825b0bd0fa28c57edd4b5d7da9b7c8c535730639b134409bb5a7ada5cde0855` | `7b8ea2e8f82757e30297b38bd1407ae371caea309eec45c758d5a9dc31e611b1` |
| 0095 | `b58-author9596-018-finalize-0095-first` | First finalize PASS, 9 blocks, 24/24, figures 0, normalizations 0 | `a590b035c7fdb583174c735f93724f9f0fec67039066f16d5d174245327b4d37` | `6400c4466e2aca44ed11acc3fb2f45230b5477c04d79972e982109e67554c233` |
| 0096 | `b58-author9596-019-prepare-0096-first` | FIRST24: 24 detected rows | `2dfd0da501e73ef9bb8d8b6163f58c33696c5038ddb465ca68d7d73a0ba50202` | `991e39bef3b07b85e8636dfa9925cff91f7759ba78c35e7b0fff44afdf4881bd` |
| 0096 | `b58-author9596-023-finalize-0096-first` | First finalize PASS, 11 blocks, 24/24, figures 0, normalizations 0 | `99a88f7ca472e3d6e6e47830aa636ec115a9941c43be1a99f0bc3ef55e06a16c` | `2ed31448660ab6d8a6d2cacf94effec210b006ad9055cccc6e4369c822b8ebeb` |

All four exact `.stderr` files hash to `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Their commands use interpreter `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`, `-B`, tool `.claude/skills/ld-s10y-lesson/tools/p2c.py`, operation `prepare`/`finalize`, `--book 8p`, `--page 95`/`96`, `--root .tmp/ld-s10y-lesson/b58-angular-speed/artifacts`, `--work .tmp/ld-s10y-lesson/b58-angular-speed/work`, and cwd `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Both existing audits record `lines_printed: 24`, `lines_md: 24`, no figures, no normalizations, no unknown characters, no KaTeX warnings, `errata: 0` and no errors. Existing layouts contain 24 line bands per page, matching the independently inventoried row positions. These are mechanical observations only and do not negate the punctuation finding.

Existing author-report hash receipt binding:

- `b58-author9596-026-report-hash.call.json`: `e4894de79019ea07d5af46df25ca7e078bbfd5aee111e51bb8425ad7b271efed`
- `b58-author9596-026-report-hash.stdout`: `1c1098d6479511a963db6441c9e265cfbe727de577d1f47ac9a138357b571760`
- `b58-author9596-026-report-hash.stderr`: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

This review report's own SHA256 is stored externally, avoiding a self-referential report hash:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review9596/report-sha256.md`

**Stop:** report REVISE concretely; retain page 0096 FIRSTPASS, both existing first mechanical passes and the n20 OPEN boundary. No fixes, reruns, other-page investigation or downstream work are authorized or undertaken here.
