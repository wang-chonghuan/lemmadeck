# First Independent SOURCE Review: REVISE

Date: 2026-11-23. Ticket: STEMROBIN-180 /180-7 n7.
Role: sole independent SOURCE reviewer, not author.
Workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## Finding And Required Change

**R1: transcription omission, not printed erratum.** Physical 0041 / printed 29, `p0041#6`, the second printed line of the paragraph following figures 30/31: `pages/0041/page.md:78`; JSON `blocks[5].lines[1]`.

The original page prints **“画细线的长方形面积”**. Both reviewed page artifacts instead contain **“细线的长方形面积”**, omitting **“画”** after “等于”.

Required author repair: restore that one character in the faithful page transcription and regenerate only the affected structured output/audit through the normal authorized process. Do not rewrite the surrounding prose, formulas, line breaks, captions or crops. The missing character does not change the number of printed lines; PASS 19/19 cannot establish its fidelity.

This is the first substantive source verdict and remains **REVISE** for the bound candidate. No source repair was performed by this reviewer. Preserve this report and snapshot; subsequent repair/review may address only R1 and its changed source hashes. Unchanged reviewed scope need not be reopened.

## Scope And Completion

- Actual scanned title: **7. 运动的图象**, physical 0038 / printed 26, `p0038#9` (`page.md:70`). The request's Russian “Перемещение...” is not the title shown by this source; do not rename the lesson from that shorthand.
- Complete n7 source boundary: `p0038#9` through `p0042#1`. Its opening prose is `p0038#10`; `p0038#11 open` continues into `p0039#3 cont`. The remaining page and figure interruptions have matching continuation flags.
- **练习 5** has exactly three complete questions: `p0041#8` references figure 29's dashed line; `p0041#9` asks the separation of objects 2 and 4 at 3 seconds; `p0042#1` asks speed magnitude/direction from figure 28. No missing n7 tail or incomplete exercise was found.
- Other than R1, the reviewed prose, numbers, formulas, captions and continuation flags match the five full-page scans. Page.md and page.json block bodies agree.
- Physical 0042's next heading **8. 运动的相对性** and its opening prose were checked for page-level transcription fidelity. This is **not approval of complete n8**. Earlier n6 material on 0038 is not a complete-n6 approval.

## Figure And Caption Fidelity

All six retained raster crops preserve the necessary objects/labels seen on the original full pages:

| Figure / page | Source inventory and correct ownership |
| --- | --- |
| 27 / 0039 | Five clocks, `t=0`, `t_1..t_4`, inclined trajectory with `x_0..x_4` and positive `X` arrow; n7 opening reference. |
| 28 / 0039 | Position/time axes and units, `A` at initial coordinate 3 m, position ticks 1..5, time ticks -30..30 s, solid positive-time line and dashed backward extension; n7 prose and question 3. |
| 29 / 0040 | Curves 1..4, velocity labels 3, 1.5, 0.5, -1 m/s, signed position/time ticks and dashed constant-position line; n7 prose and questions 1/2. |
| 30 / 0041 | `v`, `t`, zero, upper I and lower II horizontal lines; n7 positive/negative velocity projection explanation. |
| 31 / 0041 | Both hatched rectangles, `v`, `v_1`, zero, `t`, and printed `s=vt`, `s_1=|v_1|t`; n7 displacement-magnitude explanation. |
| 32 / 0042 | Settlements A/B, `l_1`, `l_2`, and N/O direction axes; **n8 only**, not an n7 illustration. The car location is described by the prose/intersection, not a separate visible automobile icon. |

Captions 27..32 match their actual figures. Shared-row flags are correct: caption 28 with `p0039#6`'s final line; caption 31 with caption 30; caption 32 with `p0042#4`'s final line.

Read-only pixel comparison confirmed all six crop interiors are identical to their recorded source boxes, with the existing 12-pixel blank border. An initial unpadded-size comparison failed because it omitted that border; the corrected comparison passed 6/6. This was a reviewer comparison-premise error, not crop/source corruption. No crop image was displayed or rewritten.

## Scientific Check

Independent calculation gives figure 28's motion `x=3+0.1t` in metres/seconds: velocity +0.1 m/s, and `x=0` at -30 seconds. Figure 29 gives object 3 a +2 m displacement and object 4 a -4 m displacement from 1 to 5 seconds. Exercise checks: question 1 is rest at coordinate 3 m; question 2 gives 7.5 m separation; question 3 gives 0.1 m/s along positive X.

No confirmed mathematical/physical printed erratum was found in this n7 source. The rectangle argument concerns displacement **magnitude**: the negative-projection case explicitly prints `|v_1|t`. Do not reinterpret the generic `vt` magnitude statement as signed negative displacement, or silently alter faithful source formulas. R1 is an omitted printed character, not an erratum.

## Immutable Binding And Image Budget

Read-only candidate copies and SHA-256 bindings: `snapshot-first-source-review/manifest.json`, captured at `2026-11-23T03:02:42.322Z`; manifest SHA-256:
`73ef9892157840e0352f459ff6518a95658f00d66021672c262ef8e2cbedf9f6`.
The manifest records all five page.md/page.json/audit.json snapshots, original page.png/page.grid.png hashes, and six retained crop hashes. No PDF or image package was duplicated.

Actual source PDF: `ssot-resources/soviet10year-textbooks/sources/soviet10years/8p 苏联中学课本 物理 八年级.pdf`; verified SHA-256:
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.

Affected candidate SHA-256: page.md `3ff9fad4c626946ec67aef1b595362347790be9f3ac255b7908b182ccea629b4`; page.json `7e2d4adc4c262feddc79e064a84df5dd0c2e13ca22901efb8d39106c3740a9fe`; current audit `0b0e15f37d33cba85320f874f244aae284c30570d4f7036179812efbb4dd1803`.

Current audits: 0038 25/25; 0039 18/18; 0040 17/17; 0041 19/19; 0042 25/25, with zero normalizations and no audit errors. These are mechanical results, not source approval. The original p0041 21/19 failure and counter-sidecar history remain untouched under `pages/0041/first-failure/`. Its failed audit hash is `8435813c07ce6bfd5946debe49eaf7927ddf6fa6cdc7976efdbf658c2ed60b67`; current page.md/page.json and figures 30/31 remain byte-identical to that failed candidate, including R1. The technical repair does not approve its content.

**Visual image loads: 5/8 total**, exactly one prepared `page.png` for each of 0038..0042. Reopens: 0. Additional visual crops: 0. Figure-only image opens: 0. No images returned. Parent must not reopen this whole batch.

Only this report and the necessary immutable candidate snapshot were written, within the authorized `source-review/` directory. No source/tool/app/schema edits, assembly, installation, paid calls, DB writes, Git commit/push, deployment, agents, chats, branches, worktrees or timers were performed. Shared dirty work was preserved.
