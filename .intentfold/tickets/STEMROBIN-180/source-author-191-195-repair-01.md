# Source 193/195 Sole Affected Repair

2026-11-16. Author Bacon; independent affected review pending Ramanujan. Not source approval.

Candidate root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-191-195-repair-01`.

Original author handoff `89aabd89c03c7b7b1fe3f62875fe497752cd8459035d62d3f32588219e0f8a17`, full independent FAIL report `9da561ff7e6d6b9acc3a4600f7d101531f8d61d7546b5d67bcb79767ceebfb27`, and first-FAIL manifest `8910b20db824f6b8904a784a11cb081f706632a58838d90a31a99389e886a762` were bound before copying. All112 originally owned files plus original handoff were verified; the original full author freeze and reports/FAIL manifest were copied to `first-failure-01` (116 snapshot files) before edits. Original and copied failure bytes remain unchanged.

Only authorized edits, via apply_patch:

- F193-1: p0193#7, second line, `力平衡甚至克服较大的力，而为此` -> `力平衡甚至克服较大的力. 而为此`.
- F195-1: p0195#1, fourth line, `柄要比锋刃长得多，这` -> `柄要比锋刃长得多. 这`.

MD equality was checked against exactly one replacement per page. Structured JSON differs only in the corresponding `blocks[].lines[]` string. Meta, audit and complete work trees (original PNG/grid/layout/template/all crop PNG/SVG) are byte/structure unchanged. No source rerender, vectorize, math edit, note change or whole-page independent re-review.

| Page | Sole repair | Official finalize | MD SHA256 | JSON SHA256 |
| --- | --- | --- | --- | --- |
| 193 | 1/1 | exit0,24/24,0normalize | `cc19ca6e9e6acaf31043389119f1db4e5590fafcce65410fbd236f9912596bc6` | `4ff36b958e128ae1de5cc9d114f9d4e334db191278ea07b81de3d01ee1ca43d8` |
| 195 | 1/1 | exit0,22/22,0normalize | `0bd428991bd065c1bb6f3c20b6772791259d9ba2c54cced8d320fb09783ef2ed` | `2f5f7f75126b51bdcfa584eb39acbc283dd91520430b85b7d9ad730a137d0330` |

Both original audit hashes unchanged:193 `e96a7b8e493c24d100d240900c165767f0bf193744c8556126182373bd053680`;195 `aa13ef8dea05aa10b45d7ca472b530928b924cb556d1b993caddfebb58254f12`.

Current active union:191/192/194 from original `source-author-191-195` root with their full independent PASS reused;193/195 from the new repair root pending affected-only review. All five original figures180–184 retain their full independent PASS and existing vector proof.195's two figures are copied byte-identically into this repair root.

Source-manifest SHA256: `b24ca3b32319667f94bd34a5eceb1c99608c917ded0ee64f2929bc4b601ee82f`. It records exact union paths/current files/figure bytes/call snapshots and the two source diffs.

Official invocation1 per affected page, executed with the existing shared Python:

```bash
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/source-author-191-195-repair-01/finalize-once.py 193
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/source-author-191-195-repair-01/finalize-once.py 195
```

Each wrapper records actual p2c argv with isolated `--root`/`--work`, stdout/stderr, output hashes, and every tool before/after. Both p2c epochs are `acda64449af5a9c043a8502e7840f6391c95cf01a63458bbf005011b773fa8ac`; each complete before/after tool collection is identical. Current MD/JSON/audit bytes match official exit0 outputs.

Preparation/vectorization/new-render/browser/service/DB/Git/assemble/promotion/test calls0. Full independent source gates0. Repairs exhausted per affected page; no additional source edit. Await Ramanujan affected review for F193-1/F195-1 only. No in-flight sessions.

196 author firstFAIL (two original① charset rejects, otherwise11/11 and three crops) remains separately preserved in `source-author-196-200`. That new source task resumes after this repair handoff;201+not read. c5-s2 source-only freeze is unchanged, final modern notification pending.
