# STEMROBIN-184 /184-6: physical 53-55 affected-count diagnostic

2026-11-22; finish=review. Diagnostic handoff only, not page/content PASS.
Every exec used `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
Stage A original-first observations were frozen before author diagnostics, counts or candidates were read; never subsequently edited.

## Affected Findings

**53: genuine counter merge defect; keep HOLD.** Literal neighboring rows are `而且 π/6 ∈ [0,π];` and `图 31`. In the native 1:1 ROI, ordinary body glyph bottoms are approximately y=1461, caption bottoms y=1503 (about 42 px apart, visual tolerance 4 px). Body ordinary ink is around [224,1418,420,46]; caption ink around [1196,1468,110,37]. Only the fraction's denominator descends to about y=1486, overlapping caption ink vertically. This is not a shared typographic baseline. The frozen ROI box is [190,1390,1290,250].

Existing diagnostic band x229..1300,y1409..1503 merges those two independent rows. First failed audit retains native 19 / authored 20. Current `0053/page.md` line 69 contains the interval row; lines 74-75 contain `<!-- cap 图 31 -->` and `图 31`, with no samerow marker. Those rows must remain separate. No marker correction, extra line break, omission, count override, exclusion, row hack, or stable-tool/skill change is approved. Local geometry establishes this merge defect without rereviewing the remaining page.

**54: independent scan-artifact basis approved for the bottom strip only.** Saved surplus bands x155..600,y2479..2481 (164 ink pixels) and x1449..1646,y2486..2489 (153) match the freshly observed broken lower scan edge. They lie well below the retained footer (saved band y2260..2292), with blank paper between. First failed audit remains native 25 / authored 23.

```json
{"kind":"scan-artifact","box":[0,2470,1695,30],"reason":"Broken lower scan-edge fragments in blank bottom margin; contains the two saved surplus bands at y2479..2481 and y2486..2489, at least 178 px below the retained footer; no body, formula or footer ink."}
```

**55: independent scan-artifact basis approved for top and bottom strips only.** Saved surplus bands x797..1694,y0..18 (2296 ink pixels) and x1381..1606,y2503..2511 (234) match the freshly observed ragged upper and lower scan edges. Top proposal ends at y30, far above first figure ink (saved figure box begins y266); bottom begins y2470, below caption 33 (saved y2201..2234) and footer (saved y2280..2314). First failed audit remains native 17 / authored 15.

```json
{"kind":"scan-artifact","box":[0,0,1695,30],"reason":"Ragged upper scan-edge trace in blank top margin; contains the saved y0..18 surplus band and stops 236 px before the first figure box; no figure, caption or body ink."}
{"kind":"scan-artifact","box":[0,2470,1695,60],"reason":"Broken lower scan-edge trace in blank bottom margin; contains the saved y2503..2511 surplus band and starts 156 px below the retained footer; no figure, caption or footer ink."}
```

**Approval scope:** only source-clear noncontent classification and the three exact rectangles above on these hash-bound sources, solely for a future count-copy exclusion proposal. Nothing applied. All are `scan-artifact`, not `separator-rule`: irregular scan-edge traces, not printed layout rules. Do not enlarge these boxes, exclude interior/side marks, erase source pixels, alter figure boxes, or exclude formulas/captions/footers. The other observed top-margin specks and bottom speck on 54, and top cluster near y201..219 on 55, are not implicated in the saved failed bands and have no proposed exclusion here. Geometric coverage of saved bands is not a rerun or automatic PASS.

## Exact Bindings

Native source path base: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/10c/pages/`; each source is `NNNN/page.png`, 1695x2580.

| Physical | Source SHA256 | First failed output-audit SHA256 |
|---|---|---|
| 53 | `10c637fa27f71059839822d4f579bde1cceb2f27084cbf00e14077779c1af333` | `cc1c9e7cceb232dac7dfad626d13bb2cfddb1359ea0d37dc4b0e26f4b4fad8f7` |
| 54 | `38b0ff3372a6b6d7a6773334dae2caaaad920118acd515e4e9eea3fd66b7d5f7` | `e6efae4d447ad11098fb632978713898a98e83b5a387b1fd52e47cb1529f0399` |
| 55 | `d6dc690b00c551b7c15c7392b574a0a62ac304c02aa33bfaec74e237eac1e7c4` | `819a278bd8e49c407e5aaf5181c200d48ad5047a14aed116cf69a6da1a35285f` |

First failed receipts, all exit 1, with exact cwd and `finalize --book 10c --page N` argv verified from saved executions:
- 53: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/receipts/nov22-finalize-p0053-01/execution.json`; SHA256 `af34e7e34e90db7af02caaec56682731e0a5b7256f887a75f110d87a23b626b5`.
- 54: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/receipts/nov22-finalize-p0054-01/execution.json`; SHA256 `58484eb7c42ddb6d04bf5ba6be90a3bf5e8d5953f0f8ea329ec7bbfe1ea3ad35`.
- 55: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/receipts/nov22-finalize-p0055-01/execution.json`; SHA256 `08dca79c85246878e003981e037b7d7dd44f802330a1163b7478290c6f25be42`.

Each first failed `output-audit.json` is in its receipt directory above. Current `artifacts/10c/pages/NNNN/audit.json` equals that first failed snapshot by bytes/hash; current page.md/page.json likewise match the receipt's output snapshots. Both original streams and input snapshots were hash-verified. Stdout records the line-count failure; preserved stderr has the ignored instrumentation logging-shutdown AttributeError, not evidence of source approval.

Reused diagnostic: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-author/nov22-resume/line-band-diagnostics.json`, SHA256 `64fb2d61a83749046e3e4b95202b25e1c0534b9ec6317d61892dc98d3f813fe0`. Its source and audit bindings match actual files. No diagnostic producer or countchecker was executed.

Frozen Stage A: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5355-count-review/stageA-observations.json`, SHA256 `b42597ac299747b6136f42ae5e31141460e5d5bfd7e7ec7e949f19108b34c934`. Full absolute paths, current candidate hashes, exact argv, stream hashes/text, first audit failures and affected saved bands are in adjacent `bindings.json`, SHA256 `f75989f7cdc28d09f137cff0096484c27071f9bb8eb9e80bd3255f1a3580b9b5`.

## Usage And Created Paths

Visual ledger: original 53 once, necessary native 53 ROI once, original 54 once, original 55 once: 3 originals + 1 ROI = 4/8 this batch, 4/24 this fresh context. No reopens/other images. Parent remains permanently exhausted at 24/24 and receives text paths/hashes only.
Separate technical ledger: 1 ROI creation; 1 source open/decode for cropping; 3 original native-view tool observations + 1 ROI native-view tool observation. PNG dimensions were header reads only, not pixel decodes. Internal tool/codec cycles UNKNOWN. No new pixel-decode diagnostics, native reruns, math/content revisions, paid calls, browser/network/Git/backend/DB/app actions, other agents/messages, assembly/publication/deployment, or later images.

Only new files were created; exact owner base is `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5355-count-review/`:
- `crop53.py`: single-use ROI creation, SHA256 `f3fba4c09cc2d86db1f91966ee5dff014157ca4ec27e7b7e39dc6bb6cbca1390`.
- `0053-baseline-roi.png`: native-scale ROI, SHA256 `d719518fa698ce68287b3d7846c991a53bcb93809507266ac11f5caf5c12b521`; path/hash reference only, no handoff image payload.
- `stageA-observations.json`: frozen independent source observations.
- `verify_bindings.mjs`: scratch read-only byte/JSON binding verifier, SHA256 `56def864c00fcde6a638e44e532ea209a413224fb461c5b4da24d5bd0844f98e`; refuses to replace its new output.
- `bindings.json`: exact text evidence bindings; no native execution.
- `REVIEW.md`: this diagnostic handoff.

All earlier candidates, source files, failed receipts and HOLDs remain unchanged, including O0/guide/figure/content HOLDs. 53 counter HOLD remains; 54/55 remain failed until any separately authorized affected-only application/check. Stop here; no dependent finalization or stable-tool/skill modification is authorized.
