# 9-10g physical44-47: affected-only repair review

Date: 2026-11-16. Ticket STEMROBIN-184.
Authority: parent-agent delegation under existing human ticket authority.
Role: same sole independent source reviewer, not repair author Peirce.

**Result: PASS for the authorized three body corrections and two quoted notes. R1-R3 are resolved.**

This is the affected-only tail of the existing original StageA/B source gate, not another whole-page, mathematical, object or figure review. Prior source/crop observations and explicit unknowns are reused unchanged.

## Immutable bindings

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
`T` means `.intentfold/tickets/STEMROBIN-184/tmp/` relative to this workspace.

Actual file-byte SHA256 identities:

- Original-only freeze `T/source-review-geo910-p44-p47-source-first.md`: `da910f4aea9c9384ba3302e856d62a58310defe3dcd353ef4e653c43a3d41a9b`.
- Initial full StageB `T/source-review-geo910-p44-p47.md`: `f5527ff17f549a3f7451c203b519da7173aa254fd35c93e9c02a60a8b4184c0c`.
- Disclosed repair handoff `T/source-geo910-p44-p47-targeted-repair.md`: `ac53167202194a246fcfb85ea53127fa2bdf10f4e8f2a045fa63f252df288599`.
- Repair evidence `T/source-geo910-p44-p47-targeted-repair-evidence/hashes.json`: `333109f63d8f085ee0a9d59463a37c6008332c598334868044943539e5649528`.
- Saved repair `strict-diff.json`: `1c6da234633ff4200053574ee85bb790a6aa2f5d2ddcbfe1e88b67669a942807`.

StageA/B bytes remain unchanged, including the first REVISE result and StageB's correction of its initial p45 punctuation reading. No initial evidence or report was rewritten to make the repair appear initially correct.

## Exact five-leaf comparison

Current durable root: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`.
The indexes below are zero-based JSON pointers. A read-only structured comparison independently found exactly these five differing leaves, and no others:

| Page / affected leaf | Exact authorized replacement | Result |
| --- | --- | --- |
|0045 `/blocks/14/lines/1` |`连接点 $C$ 和` -> `连结点 $C$ 和` |PASS: matches independently frozen original 连结; complete line otherwise identical. |
|0045 `/meta/notes/4` |`“连接点C和”` -> `“连结点C和”` |PASS: only the quoted tail changes. |
|0046 `/meta/notes/1` |`“连接点C和”` -> `“连结点C和”` |PASS: only the preceding-page quote changes; no p46 body alteration. |
|0047 `/blocks/4/lines/1` |`画出的线段` -> `作出的线段` |PASS: matches frozen source 作出的; selector/colon and rest of line unchanged. |
|0047 `/blocks/10/lines/0` |`直观图，求作` -> `直观图. 求作` |PASS: restores frozen original sentence period and space without changing either request or physical wrap. |

Current full affected body leaves:

```text
0045 /blocks/14/lines/1:
于点 $O$ 对称的平行四边形 $ODEF$（§12性质3）. 连结点 $C$ 和

0047 /blocks/4/lines/1:
б): 它们中的每一条都和作出的线段中的一条平行，且长度

0047 /blocks/10/lines/0:
109. 已知三角形和它的两条高的直观图. 求作原三角
```

For each page, the current complete JSON is structurally equal to the preserved pre-repair JSON with only its authorized leaves substituted. Each current MD is byte-for-byte equal to its preserved pre-repair MD with exactly the corresponding literal substitutions: two on45, one metadata quote on46, two on47, none on44. This checks protected equality without re-reviewing53 source objects.

The repair `before/durable/` snapshots equal the initial author's `after-finalize/durable/` bytes. Current45-47 triples equal repair `after/durable/` snapshots; current44 triples equal its unchanged `before/durable/` snapshot.

## Protected equality and reused evidence

- Page44 MD/JSON/audit are byte-identical to the original StageB baseline. It was not part of the repair finalize commands.
- All four audits are byte-identical to that baseline. Printed/MD counts, boxes, exclusions, errata and audit results did not change.
- Every other JSON field, source identity, mathematical string, body row, object boundary, `cont/open/samerow` flag and caption ownership is unchanged by exact structured equality.
- All twelve current crop PNGs42-53 equal the initial StageB crop bytes and the repair before/after snapshots. Their prior direct-visual PASS is reused, not rerun.
- All four original PNGs, grids, prepared templates and layouts equal their baseline and repair snapshots. These were compared as bytes only, not reopened as visual/text inputs.
- The literal p45 O/O_1 and quadrilateral-name discrepancies, figure44's unnamed blob, fig43's uncertain AC tick reading and p44's unreviewed predecessor remain exactly as previously recorded. No new erratum or mathematical interpretation is inferred.

## Saved actual repair commands/results

Read the repair evidence files `<0045|0046|0047>/finalize-run.json`, `finalize.stdout.txt` and empty `finalize.stderr.txt`; no gate was executed by this reviewer.

Exact common argv:

```text
[".claude/skills/ld-s10y-lesson/.venv/bin/python",
 ".claude/skills/ld-s10y-lesson/tools/p2c.py",
 "finalize", "--book", "9-10g", "--page", "<45|46|47>"]
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
```

Each saved repair run reports `exit:0`, `signal:null`, `error:null`; actual stderr is0 bytes. Actual stdout:

| Physical | Blocks | MD / printed | Figures | Normalizations | Saved exit |
| --- | ---: | --- | ---: | ---: | ---: |
|45 |16 |18 /18 |4 |0 |0 |
|46 |13 |13 /13 |4 |0 |0 |
|47 |12 |19 /19 |2 |0 |0 |

All three stdout streams print `通过 行数对账 + 白名单 + 公式`. The handoff records one repair finalize per affected page; the disclosed command records and snapshot progression are consistent with that. No reviewer finalize, counter or validator was run.

| Page | Saved repair finalize-run.json SHA256 | Saved repair stdout SHA256 |
| --- | --- | --- |
|0045 |`aa9c71f2c9a39a79d5b68d02212189b2234db957edaefca525cdb467f165cf15` |`bf9eadb92b2832ca0fcb4eb27f03e41f30022e78d1dbfd2c59610760ffb3df84` |
|0046 |`7fde533bd0ed545ffe15bebfea1018bdb9f438287c14d2743024ffd3eaf8ec4d` |`03795713010969f992924ccbae1db93a16ef370c465b12ee55f7d6c8c857a785` |
|0047 |`ae02009694727831263ee4c95deb889372c28b6c361c092033bf5f73b7df627e` |`10049dac246b75cf7384d00ee290cc3497104bacce1bd38076f4e03356fdcd1d` |

All three empty stderr SHA256 values are `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

The immutable author handoff discloses a first read-only comparison JavaScript `TypeError` before evidence output, followed by correction of its client-script page-key literals. That is a comparison-client failure, not a source finalize failure or retry. It is not erased, counted as another source gate or used as semantic evidence; this reviewer independently confirmed the actual five-leaf/byte equality.

## Actual current durable hashes

All entries are actual raw file SHA256, not semantic digests.

| Page | Current page.md | Current page.json |
| --- | --- | --- |
|0044 |`dfc083028dd2b54d32654ac98b2cfed47d87b434657eced0059fc7dc83917e5a` |`1d7efd8480a0b3902fe94c1608038d8a34d479427985a21bf9aa1ae47f8e33cf` |
|0045 |`bb675a21e280ef4f7c071f1d0864cc2f7a1cee0efb75519c14ab707f81efce12` |`ad8d66edc02cdf2a6c0b0c7acf89b3305622af56a6a08909e9e75074f904b798` |
|0046 |`657facd1647e7b6258af87b6156bfac14abd92f01aa68eb7ad0a1d0c65e210fb` |`f8d83d29b86a4e7643d826512ac95cee2cc7bd2c40e640098720b3867aa99d3c` |
|0047 |`5dee9e9d2893903057cfe2543e41db824524a3aba5d6e321a2d88cafc588f6ef` |`1b2b15402e9e0a68d6e8205c7d4dc6f698f8df90759cf2d2b74d2fd8e50240f7` |

Unchanged actual audit hashes:

-0044: `c6c9f7f73b6c8163b57003abc344eaba632e8e8dc224f688047e51db93537895`.
-0045: `157d7abd6991250cd133805fb4a0b5b9e34436baf0ad2164128a137e162b8b75`.
-0046: `017229fa40d1d6d0dd7dae7264c1d555c6d99a5675d9dbfcd2d5e6760dcb56e5`.
-0047: `46d4a0e62e82a171f7b0dcd4dd5e8ec0db2ffcce432eb0d0a1b2a03177379861`.

## Stop

The only initial StageB repair findings R1-R3, including R1's two consequential quotes, are now cleared. Together with unchanged protected source/crop bytes, the prior gate can be retained with this affected-only PASS tail; the initial REVISE evidence remains intact. No additional repair or full review is requested.

Only this new ticket tmp report was written with apply_patch. No original/page/crop viewing, whole-object semantic review, source edit, finalize/counter/validator/render/assembly/vectorize/tool/index/Git/DB/network/browser/other-chat operation was performed. Stop at immutable changed-only handoff.
