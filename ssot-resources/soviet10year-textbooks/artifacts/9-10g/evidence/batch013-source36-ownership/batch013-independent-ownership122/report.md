# Source122 Affected Ownership Gate

Ticket: STEMROBIN-184. Worker: worker184-3, same184-3 fresh independent gate.
Recorded: 2026-11-18T22:29:05Z.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

**PASS: source122 figures133/134 affected ownership only.** A belongs to134; D belongs to133. No remediation or blocker within this scope. This is not full section36, page122/123, prose, source-unit, modern-figure, publication or code approval.

## Independent Pixels

The existing source ROI was inspected first, before repair claims, followed by one view of each complete corrected crop. Exactly3 images; no reopens, new crops, contact sheets or parent image payloads. Limits: authorized3, shared batch8, shared context24.

- Figure133: labels M/A/B/C/D; segments MA/MB/MC/MD/AB/AD/BC/CD. MC crosses AD at the same unlabeled intersection. Its own A and right-hand D are intact; the foreign figure134 A is absent.
- Figure134: labels A/B/C/N/M; triangle edges AB/AC/CB and complete NM. NM crosses AC at an unlabeled intersection and terminates above AB. Its A is intact; the foreign D is absent.
- Both corrected crops preserve the visible source structure. No unintended cut, false new join, missing segment, clipped endpoint or duplicated neighbor label was observed.

## Ownership And Receipts

- Whole A component `[916,938,22,31]`:288 pixels,133 ->134, local ink SHA-256 `89e4cf97dbb1596db4a2c621be34fc3089a6f15040740fd42dfa78da4d2afd0a`.
- Whole D component `[929,795,24,30]`:291 pixels,134 ->133, local ink SHA-256 `fa60ba07d30084e584ca4e6d1b21cd1312b4f592acfeed918f5bee1b391da66c`.
- Both originally shared glyphs are removed only from the wrong owner's mask, not moved or redrawn. Their total579 pixels explains the original overlap.
- Figure133 crop box `[582,618,371,355]`, roughbox `[590,600,370,375]`; figure134 crop box `[916,619,397,350]`, roughbox `[910,610,410,370]`: all unchanged against prior audit. Existing12-pixel white padding is unchanged.
- Hash-bound preflight/postflight and inspected assertions record selected-ink conservation, exact own-component retention, zero double ownership, exact crop/owned-mask equality, unchanged owned raw pixels, and unchanged source render. Figure133:11659 pixels/10 components; figure134:8672 pixels/8 components.
- Inspected implementation validates render binding and each complete component's bounds/count/hash, rejects partial/foreign/duplicate/crop-cut transfers, protects owned pixels during exclusion, and applies masks before the unchanged duplicate-component intersection/error gate.
- Reused actual finalize receipt: one attempt, exit0,13 blocks, printed19/MD19,3 figures,0 normalizations,0 errors, empty stderr. Nothing finalized or rerendered here.
- Reused focused10-test PASS/exit0 from HANDOFF/postflight/usage, without rerun. No separate raw test output was available in the sidecar listing.

## Exact Current SHA-256

Paths below are relative to `/Users/yong/.codex/worktrees/a07e/lemmadeck`. Full evidence paths and hashes are in `report.json`.

| Artifact | SHA-256 |
| --- | --- |
| Source122 render, also candidate-work page.png | `ccb8c8183d722151b376212964030b4ff287dc7508051c7ee13affce727b68e6` |
| `.tmp/s10y-source/batch013-ownership122/source122-roi.png` | `21a27d8672673705aa3a9e1e67a67677feb97358f8a38cb60b0b39bda80f6eab` |
| Candidate source122 `page.md` | `ba7ba27080345c3fd209766a37a1525e89b55c55b00dfba60e7d77a64e310147` |
| Candidate source122 `page.json` | `3b92f262eec6b2c34b82487ff8e4fa47262cd2c13346ee79f6477f87c5c1a8a5` |
| Candidate source122 `audit.json` | `ac6b68c081065b1093b1754434c6e306be11314a21927de499bff650978898c2` |
| Corrected `fig-133.png` | `7763a56b74218bec4df6d8177b1a717b383cb1f724729b31ee51ca83be465474` |
| Corrected `fig-134.png` | `7fb64dff7f203c15f0615f2747781b222154d843cd8c0c239b903f6e46bacd87` |
| Ownership metadata JSON, stored key order | `5cc623b1b8b7600c439092f72eaa15d88d8e36e445b4796c326e4ee9b348d5e1` |

Current live source122 page.md/page.json/audit.json equal candidate bytes. Candidate Markdown/JSON metadata agree; current code/test hashes match changed snapshots and checked candidate/receipt hashes match the author manifest.

## Limitations

Pixel-exact assertions and focused tests were reused, not rerun. The independent semantic verdict comes from the three permitted image views. ROI provenance is the existing author's rectangle `[570,590,1330,990]`; it was not regenerated or pixelwise rederived. The PDF digest is metadata-only, not freshly verified.

The authoritative pre-repair Markdown body is byte-unchanged, SHA-256 `22363f7bb138450a37a72d09c5c5b2897be652bbb0a8f8e14abf2e68121cb953`, and its sole frontmatter change is ownership. A strict saved-before-JSON comparison was unequal; no prose differences, D1-D3 or uncertainty341 were examined, and no JSON prose equivalence is claimed from that baseline.

Corrected PNG bytes intentionally differ because wrong-owner ink is excluded; "no crop changes" means unchanged boxes/roughboxes/padding and retained owned pixels, not byte-identical failed PNGs. Later concurrent affected edits are not covered.

Only this assigned report directory was written. No source/candidate/code edit, pipeline/test rerun, full or additional review, answer/choice read, environment/DB/install/web/paid/Git/chat/descendant/message operation occurred.
