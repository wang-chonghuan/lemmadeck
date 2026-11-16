# STEMROBIN-184 — Affected-Only R1 Notes Review

## Decision

**R1 RESOLVED by the two notes-only additions.**

Both additions record the already observed heavier source wording and explicitly retain UNKNOWN full weight spans. This satisfies R1's requested source-emphasis record without guessing markup or altering literal text.

This is an affected-only continuation of the completed unique physical-70/71 StageB, not a second substantive StageB or an unconditional full-package PASS. The original packaging failure, invalid comparison measurements, aligned-pixel UNKNOWN, exercise boundary, and every other original review limitation remain in force.

## Immutable Prior Evidence

- StageA: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-6g-p70-p71-independent-source-first.md`; SHA-256 `c00e337bdbd14de28eec94d22fcbf4bb8386f86fa7ab17af832de31b0757cdcc`.
- Consumed StageB: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-6g-p70-p71-independent-review.md`; SHA-256 `4c8a0e8c05ef9675e8dfe99f7f7eb1ecb1daef40841e111a31d419e65ae65e56`.

Both hashes were rechecked and match. Neither file was edited. The prior image observations are reused as existing evidence; no image was loaded, reopened, cropped, decoded, or rendered for this comparison.

## Changed Notes

Evidence root `R` is the absolute directory:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-6g-p70-p71-notes-repair`

The actual before/after saved page artifacts were compared, not merely the planned `notes` field in `before.json`.

Physical 70, page JSON block 9 mapping statement; exactly one appended note:

```text
物理页70第9块以“现在我们得到了圆周到它自身上的一个映射.”开头的陈述有较重字形强调，已由独立原图审查确认；完整字重范围为UNKNOWN，不猜测整段粗体，原文字面及印刷行界保持不变。
```

Physical 71, page JSON block 6 contrasting statement; exactly one appended note:

```text
物理页71第6块的对比措辞，尤其“而不能说：”，有较重字形强调；相邻否定及象的措辞亦较重，但完整字重范围为UNKNOWN，不扩展为猜测的整段粗体，原文字面及印刷行界保持不变。
```

Each actual addition equals the declared repair note. The MD frontmatter and JSON `meta` agree. All preceding notes retain their original text and order. Both additions correspond to R1's existing crop observations; neither claims a newly inspected source, an exact complete bold span, or renderer behavior.

## Notes-Only Preservation

Read-only byte and structured-data comparisons established:

- All 12 before/after saved target files match their respective snapshot hashes.
- All six live durable targets match `after.json`.
- For both pages, the entire MD body is byte-identical before/after. No markup, literal, physical row break, formula break, figure reference, or block-head edit occurred.
- For both JSON pages, replacing the new notes array with the prior notes array restores exact structural equality with the before JSON. The entire `blocks[]` structure is unchanged, including every line and `open/cont/samerow` field.
- All metadata outside the appended notes is unchanged. Both audit files are byte-identical before/after and equal the existing audit objects in `after.json`.
- The before/after `protectedFiles` arrays are identical. All 121 currently referenced protected files match their recorded hashes, including the source/crop/prepared inputs and preserved original review/evidence files.
- Other-page entries in the protected list were handled as byte/hash preservation only; their text, images, and content were not reviewed.

The six before target hashes match the original StageB bindings. Current durable page roots are exclusively:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0070`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0071`

| Page | Current Artifact | After SHA-256 |
|---|---|---|
| 70 | `page.md` | `787df0d4866cc28de53b126ec196828a033f2b98f13ea3d3325c707742795a95` |
| 70 | `page.json` | `e1b12f3b7a196de06355de9185e55fee1210b7047a08940933f5343812d35ba2` |
| 70 | `audit.json`, unchanged | `fe230f24c9c036facba1df71ff0f85a23bc012af7a597b5f1c249dec3a778b3d` |
| 71 | `page.md` | `c0613beb5872de0dc257a3c64201730627e8aaa89a7e9623fc7741bf5fc09b3d` |
| 71 | `page.json` | `475126047f239e9b5f42b27fc0565562ce96e7347354deeef6b50eeee87ae1b1` |
| 71 | `audit.json`, unchanged | `efb06c27096352223c95dc15000962bf1f0bb656133b34977cac12e999ac2cc0` |

Source/crop hashes remain the already reviewed values:

- Physical 70 `page.png`: `069bafde193ad80bfbdfdbaf0efe1b896bdbb5c76860f66a7ab5b9e1728bc6ee`.
- Physical 71 `page.png`: `10a1ace0f1eba03ff7de38acfa5bdbeb60eb1bd1277047cc49e6800374eaedd8`.
- Official figure 81: `4571acf62750fa0216c1ccbfe918a9ad5402b7e8cc9b4f8445cb37462a150c9b`.
- Official figure 82: `108d37411d70b94cba7fecdfb561c758dbfa94b41a26cd0753f10de0ad35ebe9`.

Matching these bytes is preservation evidence, not a new pixel-alignment computation or figure review.

## Existing Affected Execution Records

The two command JSONs record one affected finalize each, using `.claude/skills/ld-s10y-lesson/.venv/bin/python`, argument `-B`, and `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 6-8g --page 70` or `71`. Their cwd is `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

| Page | Recorded UTC Start / End | Existing Result |
|---|---|---|
| 70 | `2026-11-16T12:47:54.565Z` / `2026-11-16T12:47:54.947Z` | Exit 0; invocationCount 1; 11 blocks; 26/26 lines; zero normalizations. |
| 71 | `2026-11-16T12:47:54.952Z` / `2026-11-16T12:47:55.247Z` | Exit 0; invocationCount 1; 9 blocks; 25/25 lines; zero normalizations. |

Both records have null signal/error. Actual saved stdout agrees, both saved stderr files are empty, and unchanged audits retain empty normalizations/errors/exclusions. These are later authorized affected finalizes, not replacements for the original first-finalize history. None was run by this reviewer.

Affected evidence bindings, relative to the absolute `R` above:

| File | SHA-256 |
|---|---|
| `before.json` | `3021a307eeae865845e7a3d9632b1c3ff4e3e6a4c935c70d859f40c6515154d9` |
| `after.json` | `73cc1d601cc0c9ed8597fcb98dd09442d995c7591c18d07c85745914e359c577` |
| `finalize-0070.command.json` | `c7c17f62eee0eccaebf83c4652d1d561f084f9492f657e3c0f8b4b2b8956a948` |
| `finalize-0071.command.json` | `1f79d1beae4612786a5782c2e64b14333efe8203438af535f37a74d65f4212a1` |
| `finalize-0070.stdout.txt` | `1605dddff2cb3c80af5c534efcb52a611565971b6ff4230eb98047b2f0f3f6c8` |
| `finalize-0071.stdout.txt` | `9d69eaaf89965d2eb011e8b1f47c357bbb89be4e34043a1997af32b9c6865f03` |
| Each empty stderr | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

Disclosed repair helper:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/repair-6g70-71-notes-once.mjs`

Observed raw SHA-256 `71c47807c44437d257eef8b8f854e91a26683042183386f808cc7b8c3afc7b95`, 5743 bytes. This is a byte observation only, not proof of exact execution-time identity. The helper was not executed or modified by this reviewer.

## Limitations Remain

Only R1's missing notes record is resolved. All other findings, adjudications and UNKNOWN values in the consumed StageB are carried forward unchanged, including:

- Original final evidence-packaging helper failure with exit 1 and its preserved TypeError; no successful package or aligned comparison is inferred from the notes repair.
- Original official-crop difference values `23116` and `48620` remain INVALID unpadded-versus-padded comparisons, not source changes or valid PASS measurements.
- Correctly aligned official-crop pixel differences remain UNKNOWN.
- Exercise 182 remains OPEN after the observed `1)`; figure 83 remains unseen. No next-page text, image or answer is supplied.
- Exact full weight-emphasis spans, punctuation-width/codepoint limits, fine stroke/arrowhead distinctions, and historical execution-time identity remain UNKNOWN as previously recorded.
- Figure 81 inverse ownership, figure 82's two panels and distinct `C`/`O`, and retained outer `CD` points remain the prior observations, not newly reviewed claims.

No counter, finalize, repair/helper/package, source gate, assembly, tool test, substantive source comparison, image operation, Git/backend/database/service action, or publication was performed. No old freeze/review, durable artifact, source, crop, history, code or evidence file was edited.

## Budget And Stop

Affected comparison: **zero new image loads, zero reopens, zero crops**.

Cumulative reviewer ledger remains **7/8 batch, 7/24 context**, with one batch load remaining, unused. The original seven-load image ledger remains in the consumed StageB file.

Sole new output is this affected-only review. Stop here; resolving R1 does not authorize further work or a broader completion claim.
