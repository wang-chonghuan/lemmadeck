# B83 Independent SOURCE Review

STEMROBIN-180/180-3, 2026-11-18. Workspace `/Users/yong/.codex/worktrees/0f12/lemmadeck`; instructed branch `codex/STEMROBIN-180-textbooks` (no Git access, so not independently verified).

**Physical 465: REVISE. Physical 466: REVISE.** All 60 printed rows and 29 objects covered. The only confirmed candidate source defects are **10 + 12 solid sentence dots changed to `。`**. Required faithful/profile representation is ASCII `.`; no concrete mismatch is waived. Candidates remain untouched.

## Independence And Usage

Sequence: original 465 pixels -> freeze complete expected-0465.md -> compare 465 MD/JSON/audit -> original 466 pixels -> freeze complete expected-0466.md -> compare 466 MD/JSON/audit. Author report read only after both freezes; author expectations were hash-bound, not used as transcription references. Frozen expected files are retained unchanged in `tmp/b83-source-review/`.

**Actual image loads: 2 total, 2 in this context; one original per page. Reopens/crops/neighbors: 0.** No descendants, chat operations, Git, canonical writes, DB, publishers, tests/build, finalize/vectorize reruns, paid calls, or tool changes. Only the owned review directory and this durable report were written. The preliminary missing-review-path `ls` exit 1 is not a pipeline/content failure.

## Complete Coverage And Exact Defects

All indices are 1-based. R = independent printed row; B = `page.json` block; l = line inside that block; L = physical `page.md` line. MD and JSON contain identical defects. Each replacement below is `。` -> `.` at the named token; do not add punctuation to 167's final line. Paths are:

`P465 = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source/artifacts/7p/pages/0465/`
`P466 = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source/artifacts/7p/pages/0466/`

| Page / R | B / role | MD L | Source comparison; exact required correction |
|---|---|---|---|
| 465 / 01-02 | 1 / ex 158 cont | 39-40 | 40%, 10 kg, supplied incoming connection and question correct. L39/l1 `变热。` -> `变热.` |
| 465 / 03-04 | 2 / ex 159 | 43-44 | Italic a,b,c,d; 2 kg wood, 1.5 kg lignite, 1 ton anthracite, 500 g gasoline correct. L44/l2 `热量。` -> `热量.` |
| 465 / 05-06 | 3 / ex 160 | 47-48 | 10000 kcal, a,b,c fuels, colon/question correct. L47/l1 `热量。` -> `热量.` |
| 465 / 07-09 | 4 / ex 161 | 51-53 | 24000 kcal, 30%, wording/question correct. L52/l2 `热量。` -> `热量.` AND `加热。` -> `加热.` |
| 465 / 10-11 | 5 / ex 162 | 56-57 | PASS: 1 kg kerosene, 55 degrees C, question |
| 465 / 12-15 | 6 / ex 163 | 60-63 | 2 litres, 12 -> 100 degrees C, 50 g, all questions correct. L60/l1 after 100-C formula `。` -> `.`; L61/l2 `煤油。` -> `煤油.` |
| 465 / 16 | 7 / exhead | 66 | PASS: 物质聚集态的变化, bold italic, group role |
| 465 / 17-19 | 8 / ex 164 | 69-71 | a,b,c; 500 g/0-C snow, 200 g/80-C naphthalene, 10 kg/232-C tin, 36 kcal/kg; 熔化/熔解 correct. L71/l3 `千克。` -> `千克.` |
| 465 / 20-21 | 9 / ex 165 | 74-75 | PASS: 2 kg snow, 0 -> 40 degrees C, question |
| 465 / 22-24 | 10 / ex 166 | 78-80 | a,b, semicolon; 2 kg/12-C tin, 50 g/-10-C ice, 0.055, slash and centered unit dot correct. L80/l3 after C formula `。` -> `.` |
| 465 / 25-27 | 11 / ex 167 | 83-85 | 1.5 tons/24-C, 60%, 7000 kcal/kg; complete object, no final punctuation correct. L83/l1 `废铁。` -> `废铁.` |
| 465 / 28 | 12 / ex 168 | 88 | PASS: complete rain/temperature question |
| 465 / 29 | 13 / ex 169 | 91 | PASS: complete question, including 更受不住热 |
| 465 / 30 | 14 / ex 170 | 94 | PASS: 噼啪 and complete question; blind-expectation slip disclosed below |
| 465 / 31 | 15 / foot | 97 | PASS: 454 and two decorative dots, footer role |
| 466 / 01-03 | 1 / ex 171 | 40-42 | PASS: a,b,c; 200 g/100-C water, 10 g/78-C alcohol, 2 g/35-C ether; question |
| 466 / 04-06 | 2 / ex 172 | 45-47 | a,b,c; 0.5 kg/20-C water, 100 g/18-C alcohol, 5 g/5-C ether, 0.56 and unit dot correct. L47/l3 after C formula `。` -> `.` |
| 466 / 07-08 | 3 / ex 173 | 50-51 | 200 g/0-C ice, literal 融化 and 使化成的水 correct. L50/l1 after 0-C formula `。` -> `.` |
| 466 / 09-10 | 4 / ex 174 | 54-55 | 100 -> 0-C, 1 kg and question correct. L54/l1 `凝结。` -> `凝结.`; L55/l2 after 0-C formula `。` -> `.` AND `千克。` -> `千克.` |
| 466 / 11 | 5 / exhead | 58 | PASS: 热机, bold group heading |
| 466 / 12-13 | 6 / ex 175 | 61-62 | PASS: both 汽缸, （机壳）, complete question |
| 466 / 14-15 | 7 / ex 176 | 65-66 | PASS: 四缸 / 汽缸, entire explanatory parentheses and two questions |
| 466 / 16-18 | 8 / ex 177 | 69-71 | ТЭ-3, 1 hour, 8000000 kJ, 800 kg, 4 times 10^7 J/kg, printed slash at row end correct. L69/l1 `功。` -> `功.`; L71/l3 `千克。` -> `千克.` AND `效率。` -> `效率.` |
| 466 / 19 | 9 / h1 | 74 | PASS: 电, larger centered subject division; h1 hierarchy is appropriate, not a stable owner claim |
| 466 / 20 | 10 / exhead | 77 | PASS: 原子结构, bold italic group heading |
| 466 / 21-22 | 11 / ex 178 | 80-81 | PASS: 有机玻璃棒 / 毛皮 / 带电纸筒, complete question |
| 466 / 23-26 | 12 / ex 179 | 84-87 | Entire two-case question correct. L86/l3 `滑过。` -> `滑过.`; L87/l4 `问题。` -> `问题.` |
| 466 / 27-28 | 13 / ex 180 | 90-91 | Lithium, round parentheses, 图256 reference, nuclear charge/neutrality wording correct; complete ex, not open. L90/l1 `)。` -> `).`; L91/l2 `中性的。` -> `中性的.` |
| 466 / 29 | 14 / foot | 94 | PASS: 455 and two decorative dots, footer role |

All printed quantities, formula signs/exponents, units, letters, questions, colons, commas, semicolon, parentheses and line/block boundaries were compared against pixels, not merely counted. No source figure, caption, table, displayed equation or mathematical erratum is visible on either page.

## Policy, Uncertainty, And Dependencies

- **Latin markers: source PASS, not a source HOLD.** 159 has the complete italic parenthesized a,b,c,d sequence: distinctive c,d cannot be the Cyrillic а,б,в,г sequence. This establishes the local convention for 160/164/166/171/172 as well. Candidate codepoints are a U+0061, b U+0062, c U+0063, d U+0064. The generic Cyrillic policy is a documented source-policy conflict, not authority to invent different source letters; no policy/tool was modified.
- **Literal identifier:** Э provides script-discriminating evidence for Cyrillic ТЭ-3; the homographic Т alone would not. Retain 173 融化, all 汽缸, source 蒸汽/热到, and 167's absent final punctuation.
- **Reviewer slips, not candidate defects:** frozen 465 R30 says 啪啪; comparison with the initially loaded pixels identifies 噼啪, so candidate is correct. Frozen 466 labels 热机 bold italic; retained pixels support bold, and candidate `**热机**` is correct. Frozen 466 R27 uses fullwidth round parentheses as text encoding; candidate ASCII round parentheses preserve the visible form and do not establish a different Unicode family from pixels alone. Frozen files were not rewritten; no image reopened.
- **Epistemic boundary:** supplied approved incoming 464 tail was accepted as text, not re-reviewed. PDF identity/hash in metadata is declared provenance, not independently verified PDF content. No remaining local source-reading HOLD is asserted.
- **Nonlocal dependency, not local source approval:** final 466 stable lesson owner and figure 256 location/owner remain UNKNOWN. Figure 256 is a reference only; no figure object was fabricated, and ex 180 was not falsely marked open. No assembled-course, figure-availability, neighboring-page or publication approval is given.

## Mechanical Evidence

Existing FIRST finalize receipts: 465 = 15 blocks/31 source and MD rows; 466 = 14 blocks/29 rows. Both report zero figures/normalizations and successful line/whitelist/formula checks. Read-only structural inspection found MD frontmatter = JSON meta, MD block roles/labels/flags/body = JSON blocks, row totals = audit, actual PNG hashes = render hashes, actual profile hash = declared hash, all boxes/owners null, all error/unknown/warning arrays empty. Audit/MD/JSON are mutually consistent, including their shared punctuation defect.

**Mechanical execution failure: none observed. Mechanical blind spot:** `。` is whitelisted, so the retained success receipts do not enforce profile `sentence_period: "."` or prove pixel fidelity. `normalizations: []` supplies no documented justification for these changes. No successful stage was rerun.

## Hash Binding

All eight source/candidate hashes, author report and every hash it reports, read rule files, frozen expectations, and preliminary comparison are recorded in `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-source-review/input-sha256.txt`. All 15 author-reported file hashes matched actual files. Final review/report hashes are in sibling `report-sha256.txt`; hashes apply only to the reviewed bytes, not later revisions.

Approved incoming 464 tail SHA256 (exact supplied UTF-8 text, no newline): `3fe438995d8117f48b4eacd971e0ede6ba57aa60801ba958e53cbf3725b0df7a`.
Declared, not independently hashed/opened PDF SHA256: `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`.

This closes the requested one independent review only. Both current candidates require the explicit punctuation revisions above; no automatic additional review or recheck is scheduled.
