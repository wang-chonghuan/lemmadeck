# 10c physical39-42 source-author handoff: stopped on first p40 failure

Date: 2026-11-16. Ticket STEMROBIN-184. Root `/Users/yong/.codex/worktrees/a07e/lemmadeck`. Sole source author, not independent reviewer. **Incomplete source precursor: p39 first mechanical PASS; p40 first mechanical FAIL; p41/42 unattempted. No full source or modern approval.**

This separate package began only after the authorized 9g45/46/47 targeted repair was frozen at `source-geo910-p44-p47-targeted-repair.md`, SHA `ac53167202194a246fcfb85ea53127fa2bdf10f4e8f2a045fa63f252df288599`. No batch snapshots were mixed.

## Source-first chronology and facts

Current lesson cap1 was read. Parent's existing once-prepared inputs were used; no prepare was run.

- Physical39: native full PNG opened individually at original detail, then full grid individually. Complete source-row/prose/formula/boundary inventory was frozen in `source-10c-p39-p42-evidence/0039/source-first.md` before durable MD. Printed33;20 body rows plus folio1. No figures/tables/captions/tasks/stars. All paragraphs close. Two worked-example equation chains each physically span two rows. The final paragraph's `π-0.1π=0.9π` spans the actual last two prose rows. One `↵` per actual formula break retains these source positions; no inferred algebra or extra row.
- Physical40: native full PNG then full grid, each individually, before its inventory and MD. Printed34; exercises71-108, all38 complete, with main 习题 heading and four full original group instructions. Three-column or two-column actual baseline sharing retained using `samerow`. Source101 is mixed number `2又1/7` timesπ;102 is decimal2.1π. Degrees, minute marks, signed-angle parentheses and all source numerals retained. No figures/tables/captions/footnotes/stars or open exercise. Own visual ledger records21 rows including folio; the machine reports22. This discrepancy is retained, not attributed to a guessed noise/component cause.
- Physical41/42: **not visually opened, not inventoried, not transcribed, not finalized** after the real p40 failure. Their complete parent-prepared packages were copied byte-for-byte to evidence `0041/prepared-unattempted/` and `0042/prepared-unattempted/`. No source fact, printed page, boundary or formula is claimed from them.

For39/40, the native originals and grids were actually viewed, not replaced by layout/template/author or reviewer conclusions. No figure/table inventory is invented for41/42. No original or prepared file was modified. Edge marks/bottom lines observed on39/40 were only noted; no masks, exclusions, glyph fixes or errata were added.

## Actual first finalize results

Each attempted page ran **exactly once** after apply_patch authoring. Exact cwd and argv are preserved in per-page `finalize-run.json`:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python
.claude/skills/ld-s10y-lesson/tools/p2c.py
finalize --book 10c --page 39
finalize --book 10c --page 40
cwd /Users/yong/.codex/worktrees/a07e/lemmadeck
```

| Physical / printed | Blocks | MD / machine rows | Crops | Normalizations | Actual exit |
| --- | ---: | --- | ---: | ---: | ---: |
|39 /33 |10 |21 /21 |0 |0 |0 |
|40 /34 |44 |21 /22 |0 |0 |1 |
|41 /not observed |not authored |not run |not observed |not run |not run |
|42 /not observed |not authored |not run |not observed |not run |not run |

Actual p40 stdout:

```text
[finalize] 10c p0040: 44 块 / 21 行（印刷 22）, 插图 0 张, 规范化 0 处
  ✗ 失败 1 项:
    - 行数对不上：印刷 22 行，块体 21 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

Both actual stderr streams are empty; signals/errors null. This is a real exit1, not approval. No repair, second finalize, count/tool diagnosis or subsequent page production was performed. No crops were generated for the two attempted pages, so there is no crop opening to omit or substitute.

## Immutable snapshots and hashes

Evidence root: `.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p39-p42-evidence/`.
For39/40 it contains `source-first.md`, complete `before-finalize/{durable,prepared}/`, actual streams/argv/outcome and complete `after-finalize/{durable,prepared}/`. Parent-prepared template/layout/PNG/grid and manual MD-before bytes are retained even onFAIL. Both current attempted durable triples are retained. No absent41/42 source files were created.

Complete63-file manifest, including current files and evidence snapshots: `hashes.json`, raw SHA `90ae9ebd53ff710837517ee8481ae9a4eb1e9ea5289b8ab5316e87b3a8d932bd`.
Per-page attempted/unattempted status and all input/triple hashes: `status.json`, SHA `4f090a4e54443936e13764b5e7189cce0ae27146875d95979e84b4f374e13f74`.

| Physical | Actual original PNG SHA256 | Actual original grid SHA256 |
| --- | --- | --- |
|39 |`71e3333ae0e97ed515d6276c9254d7740dd5986877fac6aaf752696619245145` |`0741b70c76e8d6f4faa744a3fda23ac1c426f8bc68f45651c07acbf57a7b866c` |
|40 |`76cac42c4045ebd6e457fb8cc6f6b2ca71069fb8a5d4381a466154181d9da4e0` |`6d44c45fd0f2e2186ab863fe0086d49938fa8f15a862796a9c437dc63108ec4e` |
|41, unviewed |`93ef6af360bbf1136ec61fd934426ca4485cd6b6d2cb152520b76b3768a6ed8c` |`e00ac3682d44706050b69ec8dd2d3fa16d4861f8bbb1f0d612ca90e6b9f91263` |
|42, unviewed |`f300b99433638f81a25c3d6443bc14608e88c2e60ad812242ac66085416f85b5` |`5e7db0fd6899213a79baa5e4b4a481e0eed395da75335c3bf45e68b574f48623` |

| Physical | Current durable MD SHA256 | Current JSON SHA256 | Current audit SHA256 |
| --- | --- | --- | --- |
|39 |`1e8aaacffabd647960786cbde65ea3a1189418dd38f0127c010328d718011531` |`4e57dad92c3b440f00c7df7ed8b16f0d6da5c81e31d836e7cd7bd2f3da86b0b9` |`550f175924737ad69c930e457e4b0143ca25e5b548ded9e3fe23695ad8740a0c` |
|40 |`13c53b1c416b525adb57182207eb0ceb7beea80da04c62558dff226d7cfba637` |`88af1f446cc15852d6a66d4b483840a506744688ccb5a4a5ca3a5f68562e4e29` |`ef7d43a8a1a6af6199ac3f23c16bec0ad4b780bf0e944f7dce09f2b532678aa7` |

All source identity fields were copied from the respective parent-prepared template; the39/40 PDF SHA is `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`, dpi300,1695x2580. Actual observed physical-to-printed offset is6 on these two pages only;41/42 folios are not inferred.

## Stop

Only durable10c39/40 MD and this ticket's scratch evidence/report were manually written with apply_patch; scoped first finalize generated their JSON/audits. No35-38/9g repair revisit, source index/assembly/modern/answers/choice/tool/schema/app/charter/vectorize/renderer/test/Git/DB/network/browser or reviewer/other-author material access. No enclosing lesson completion is claimed. Work stopped onp40FAIL and is frozen for parent disposition and independent original-first review.
