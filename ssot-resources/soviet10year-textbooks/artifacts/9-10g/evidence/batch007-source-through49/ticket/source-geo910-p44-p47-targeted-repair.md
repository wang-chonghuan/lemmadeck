# 9-10g physical44-47 targeted source-author repair

Date: 2026-11-16. Ticket STEMROBIN-184. Role: original source author, not independent reviewer. This immutable handoff addresses exactly the authorized three body differences and two consequent notes. No new source or mathematical review.

## Authority and preservation

Authorized independent report `source-review-geo910-p44-p47.md` was read and raw SHA verified: `f5527ff17f549a3f7451c203b519da7173aa254fd35c93e9c02a60a8b4184c0c`.
Initial author report remains unchanged, SHA `f5f36994d66e30789cff236cd09d5862b5e1c78828d654c746ce57dd8b6abc95`; initial evidence manifest remains `d88732e7ae383569ce5bafd76f525c6d52caff9f25dd18cd578dc64f57f1da7d`.

Before editing, complete four-page durable directories, prepared PNG/grid/template/layout and all twelve crops were copied to ticket tmp `source-geo910-p44-p47-targeted-repair-evidence/<id>/before/{durable,prepared}/`. The whole first author evidence package, including first stdout/stderr/commands and source-first notes, is additionally preserved under `initial-author-evidence/`. Both immutable reports are copied under `reports/`. Existing evidence was not overwritten.

## Exact manual differences

Only apply_patch was used:

- 0045 `/blocks/14/lines/1`: `连接` -> `连结`.
- 0045 `/meta/notes/4`: quoted `连接点C和` -> `连结点C和`.
- 0046 `/meta/notes/1`: same quoted replacement; no body change.
- 0047 `/blocks/4/lines/1`: `画出的` -> `作出的`.
- 0047 `/blocks/10/lines/0`: `直观图，求作` -> `直观图. 求作`.

These are the glyph/period scopes confirmed by the authorized independent report. No original or crop was reopened. Page44 was neither edited nor finalized.

## Actual single repair runs

Common exact executable/argv prefix, cwd `/Users/yong/.codex/worktrees/a07e/lemmadeck`:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python
.claude/skills/ld-s10y-lesson/tools/p2c.py
finalize --book 9-10g --page <45|46|47>
```

Each repair page ran once only. Actual results:

| Page | Blocks | MD / printed | Crops | Normalizations | Exit |
| --- | ---: | --- | ---: | ---: | ---: |
|45 |16 |18 /18 |4 |0 |0 |
|46 |13 |13 /13 |4 |0 |0 |
|47 |12 |19 /19 |2 |0 |0 |

All actual stderr streams are empty; signals/errors null. Exact command arrays, stdout/stderr and outcomes are saved in `<id>/finalize-run.json`, `finalize.stdout.txt`, `finalize.stderr.txt`. Post-manual/pre-finalize durable snapshots and complete after directories are retained separately. No second repair run.

## Strict unchanged evidence

`strict-diff.json` SHA `1c6da234633ff4200053574ee85bb790a6aa2f5d2ddcbfe1e88b67669a942807` records every changed JSON leaf, before/after strings, current triple hashes and all prepared file comparisons. Only the five leaves listed above differ. Each MD equals its preserved before bytes with exactly the authorized substitutions. All four audits remain byte-identical. All prepared files, including original PNG/grid/templates/layout and twelve crop PNGs, remain byte-identical. Thus every other body/math/object flag/row/boundary/source identity, box and crop byte is unchanged. No new exclusions or errata.

The initial read-only comparison script had a JavaScript key-literal `TypeError` before producing evidence; it was corrected to quoted page identifiers. This was not a source gate, source edit or finalize retry. The completed comparison confirmed the exact five-leaf scope.

| Page | Current MD SHA256 | Current JSON SHA256 |
| --- | --- | --- |
|44 |`dfc083028dd2b54d32654ac98b2cfed47d87b434657eced0059fc7dc83917e5a` |`1d7efd8480a0b3902fe94c1608038d8a34d479427985a21bf9aa1ae47f8e33cf` |
|45 |`bb675a21e280ef4f7c071f1d0864cc2f7a1cee0efb75519c14ab707f81efce12` |`ad8d66edc02cdf2a6c0b0c7acf89b3305622af56a6a08909e9e75074f904b798` |
|46 |`657facd1647e7b6258af87b6156bfac14abd92f01aa68eb7ad0a1d0c65e210fb` |`f8d83d29b86a4e7643d826512ac95cee2cc7bd2c40e640098720b3867aa99d3c` |
|47 |`5dee9e9d2893903057cfe2543e41db824524a3aba5d6e321a2d88cafc588f6ef` |`1b2b15402e9e0a68d6e8205c7d4dc6f698f8df90759cf2d2b74d2fd8e50240f7` |

Unchanged audit SHAs44/45/46/47: `c6c9f7f73b6c8163b57003abc344eaba632e8e8dc224f688047e51db93537895`, `157d7abd6991250cd133805fb4a0b5b9e34436baf0ad2164128a137e162b8b75`, `017229fa40d1d6d0dd7dae7264c1d555c6d99a5675d9dbfcd2d5e6760dcb56e5`, `46d4a0e62e82a171f7b0dcd4dd5e8ec0db2ffcce432eb0d0a1b2a03177379861`.

Complete targeted evidence manifest: `source-geo910-p44-p47-targeted-repair-evidence/hashes.json`, 168 files, raw SHA `333109f63d8f085ee0a9d59463a37c6008332c598334868044943539e5649528`.

Author repair is frozen for the same Aristotle affected-only comparison; these actual mechanical successes do not constitute independent source approval. No tool/render/test/vectorize/assembly/index/modern/Git/DB/network/browser activity. No further edit or finalize on this package.
