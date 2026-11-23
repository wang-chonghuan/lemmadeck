# N10 affected-only correction confirmation

STEMROBIN-184 / `ana9-c2-s3-n10`, 2026-11-23.

Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Scope: only D1, the Exercise 78 sentence stop recorded in [source-comparison.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-comparison.md). Reused literal evidence: [source-first.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-first.md), p45:L15-L16.

## D1 Confirmed Resolved

Frozen source:

```text
L15 2本各值3个卢布，有3本各值1个卢布. 随机取出两
L16 本. 求它们共值5个卢布的概率.
```

The first candidate had `本，求`; the current Markdown and JSON both have exactly:

```text
本. 求它们共值5个卢布的概率.
```

- Markdown: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/raw/9c/pages/0045/page.md`, line 61.
- JSON: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/raw/9c/pages/0045/page.json`, pointer `/blocks/5/lines/2`.
- Both retain the preceding line ending `随机取出两` and the next line starting `本. 求`, preserving the physical `两 / 本` break.
- A read-only local assertion check confirmed the exact stop, following space, and matching affected text in both formats; exit code 0.

Current candidate bindings:

| File | SHA-256 |
| --- | --- |
| `0045/page.md` | `e403f6dd531ea18842af7c736f7a401e97775f6189a3d1e327e358bf30ca0298` |
| `0045/page.json` | `621c677d74e4277a640fcdfbbb57ff88200d44e0615678090043005ae89d8ce9` |

## Reuse and Stop

All other source findings and qualifications from the first comparison are reused without reopening or re-reviewing them. The caller reports native finalize `24/24` with zero normalizations; that count is not the evidence for this literal confirmation and was not rerun here.

Additional image opens: **0**. Cumulative visual opens remain **5**. No new source solving, N11/modern/answer/choice review, key inspection, or candidate editing occurred. The freezes and first comparison remain unchanged; only this report is newly written.

Stop after this affected-only D1 confirmation.
