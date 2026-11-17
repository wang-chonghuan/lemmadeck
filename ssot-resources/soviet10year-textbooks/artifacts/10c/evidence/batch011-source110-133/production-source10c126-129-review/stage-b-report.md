# SOURCE-FIRST 126-129 Stage B Comparison

Status: COMPLETE TEXT COMPARISON; THREE FIDELITY DISCREPANCIES REQUIRE RECONCILIATION.
Not source approval, finalization, assembly, seed production, or publishing.
Ticket: STEMROBIN-184. Date: 2026-11-17.
Workdir: /Users/yong/.codex/worktrees/a07e/lemmadeck

## Findings

The exact disclosed author bytes match all six human-supplied SHA-256 values. The frozen Stage A and its ledger match their previously returned hashes and were not modified. Findings below compare those fixed textual inputs, rather than freshly adjudicating source pixels.

### B01: Missing Character In Example 2 Explanation

Priority: P2. Author file:
/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0129/page.md:56
Author block: p0129#6, printed row 8. Frozen observation: 129-R10.

- Frozen Stage A: `其中 $\gamma$ 是固定的系数，负号表示引力指向坐标原点．所求的`
- Author bytes: `其中$\gamma$是固定的系数，负号表示力指向坐标原点．所求的`
- Difference: the author text omits `引` before `力指向`.
- This is a source-prose discrepancy, not a force-formula discrepancy or a request to repair the mathematics. The supplied solution must remain part of the whole worked example.
- Disposition: reconcile against source-grounded evidence before claiming exact transcription agreement. No source edit made; no new pixel adjudication or glyph-resolution evidence for this position was authorized or loaded in Stage B.

### B02: Period Versus Comma In Approximation Introduction

Priority: P3. Author file:
/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0126/page.md:45
Author block: p0126#2, printed row 2. Frozen observation: 126-R09.

- Frozen Stage A: `算积分．但最好利用下面的和式：`
- Author bytes: `算积分，但最好利用下面的和式：`
- Difference: `．` versus `，` after `积分`.
- Disposition: unresolved punctuation discrepancy between the frozen review transcript and author bytes. Do not automatically change either artifact on this comparison alone. No new source view was performed to determine which transcription is correct.

### B03: Period Versus Comma Before 等等

Priority: P3. Author file:
/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0128/page.md:38
Author block: p0128#1, printed row 5 after the interval wrap. Frozen observation: 128-R05.

- Frozen Stage A: `$x_2]$ 上所作的功近似地等于 $f(x_1)(x_2-x_1)$．等等．力在第 $n$ 个小`
- Author bytes on the corresponding represented printed row: `x_2]$上所作的功近似地等于$f(x_1)(x_2-x_1)$，等等．力在第$n$个小`
- Difference: `．` versus `，` after the work-product expression and before `等等`.
- The actual interval wrap and its endpoint are retained. This finding concerns punctuation only, not the expression or the two-row encoding.
- Disposition: unresolved punctuation discrepancy between fixed transcripts; no automatic correction or new pixel verdict.

## Evidence And Authority

Frozen comparison baseline:

- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129-review/source-first.md
  SHA-256: 0dec26ac59657ce98ad1b9ee1c516d05378bcb0b633956193c5aa9f757d65862
- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129-review/ledger.md
  SHA-256: 5db77df8dae67e1ae9bd6facfe7d555a337b25bf258f0de13df6f8b1ac58bc33

Sole disclosed author comparison set:

- /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0126/page.md
- /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0127/page.md
- /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0128/page.md
- /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0129/page.md
- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/author-handoff.md
- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/author-ledger.md

Exact input hashes, read scope, and chronology are recorded in stage-b-ledger.md in this directory. No other author pages, templates, source artifacts, answer/choice materials, or generated outputs were inspected.

## Attributed Incoming Resolver Text

The human explicitly disclosed independent resolver evidence and authorized its report/ledger as text-only context. It is not this reviewer's original pixel observation, and the human did not directly transcribe the glyphs.

- Report: /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source123-125-unresolved-glyphs/report.md
  SHA-256: c07f9d01e72b1b7f19f3d329a3c8ba7c867cbc150e93dc2d0ec5fbaf2a19baf0
- Ledger: /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source123-125-unresolved-glyphs/ledger.md
  SHA-256: cd06413bc4ee0ae0c7c0b066794e58bb6e639edc90d339c666f5d8d5ab417e69

Only Q2's page-125 conclusion is used: report lines 69-90 attribute a terminal period after S_n(a,b), a complete argument-list right parenthesis, and the complete equation label (2), including its right parenthesis. The resolver explicitly limits this to the local definition display. Its page-123 Q1 text was incidentally present in the authorized report read but is irrelevant to this four-page comparison and is not applied.

No resolver image, crop, metadata JSON, script, or original was opened or independently rehashed here. Resolver image chronology is an attributed report, not an addition to this reviewer's image budget.

The bounded contextual update does not erase the frozen Stage A's predecessor UNKNOWN, retroactively approve physical 0124/0125, or establish formal lesson IDs/TOC ancestry. The author's physical-0124 start assertion remains inherited author context, not independently validated by this review.

Crucially, a closed definition display on 0125 is not a closed global 104 discussion. Frozen 126-R01 begins the remaining a>=b cases; its first paragraph ends locally at 126-R07. The next supplied approximation exposition and exercises also precede the actual 105* heading observed at 127-R01. The parent identifies this as the 104-to-105 boundary. Local display closure alone is no reason to terminate that discussion at 0125 or reject the author's logical continuation on 0126. This Stage B does not inspect or approve the predecessor's actual open/cont bytes.

## Row And Block Comparison

All observed text rows have corresponding author representations; no missing full row, extra substantive row, equation-term change, or lost formula-wrap marker was found beyond the three textual discrepancies above. These are manual comparison observations, not gate/counter outputs.

| Physical page | Frozen physical text rows | Author representation mapped to frozen rows | Result |
| --- | --- | --- | --- |
| 0126 | 19 | #1 R01-R07; #2 R08-R12; #5/#6 R13-L/R; #7 R14; #8 R15-R16; #9 R17-R18; #10 R19 | Complete row coverage; B02 punctuation differs |
| 0127 | 16 | #1 R01; #2 R02-R05; #3 R06-R11; #5 R12; #7 R13; #8 R14-R15; #9 R16 | Complete row coverage; no substantive text discrepancy found |
| 0128 | 24 | #1 R01-R15, including two represented wraps; #2 R16-R23; #3 R24 | Complete row coverage; B03 punctuation differs |
| 0129 | 18 | #1 R01; #4/#5 R02-L/R; #6 R03-R12; #7 R13; #8 R14-R15; #9 R16-R17; #10 R18 | Complete row coverage; B01 character differs |

Representation differences not treated as new mathematics or missing rows:

- Spaces, \quad versus \qquad, \frac{1}{2} versus \frac12, and unit encodings such as 5\mathrm{cm} preserve the compared content.
- Frozen >= notation is represented by the author's \geqslant; no new source-glyph adjudication is claimed.
- Author footer blocks preserve numerals 120-123; Stage A records their flanking printed dots. Plain-number foot blocks are not counted as a missing footer row.
- On 0128, author line 38 uses exactly one wrap marker within [x_1, / x_2], and line 41 uses exactly one between the two displayed work-sum rows. Neither break is duplicated by a literal newline at that location.
- Tall fractions/integral or limit subscripts remain within their original single printed rows.
- Lowercase s'_n in the exposition and uppercase S'_n in exercise 445 are both retained; no normalization or erratum introduced.
- Cyrillic а) in exercise 447 is retained. The source wording 单位点 in example 2 is retained.

## Whole Objects And Figures

| Object | Compared author grouping | Comparison disposition |
| --- | --- | --- |
| Integral-discussion tail | p0126#1 cont, then supplied p0126#2 exposition | Local supplied prose preserved; predecessor author linkage not newly adjudicated; excluded from unsolved seeds |
| Supplied work formula/proof | p0127#3 open -> p0127#8 cont open -> p0128#1 cont | Whole assumptions, formula, subdivision, approximation, limit, and conclusion retained; introductory p0127#2 retained; excluded from seeds |
| Worked example 1 | p0128#2 open -> p0129#1 cont | Entire question-shaped stem plus supplied solution and final calculation retained; all excluded from seeds |
| Worked example 2 | p0129#6 | Entire stem plus supplied solution retained; B01 requires textual reconciliation; all excluded from seeds |
| E444 | p0126#8, F58 and its caption | Complete unsolved exercise; no supplied answer added |
| E445 | p0126#9 | Complete unsolved exercise; no evaluation/comparison answer added |
| E446 | p0129#8 | Complete unsolved exercise, ending before E447 |
| E447 | p0129#9 ex 447 open | Visible а) locally complete, whole exercise right boundary UNKNOWN; not an eligible confirmed-whole seed |

The author's grouping of statement and proof as one open/cont teaching object is compatible with the frozen observations' finer statement/proof paragraph identities. It does not turn a completed displayed statement into an unsolved exercise.

Figure ownership and captions agree:

- F57 / p0126#3: supplied approximation exposition #2; caption #5.
- F58 / p0126#4: explicit owner-ex 444 and exercise #8; caption #6 samerow with #5.
- F59 / p0127#4 and F60 / #6: supplied formula/proof; captions #5/#7 on separate rows.
- F61 / p0129#2: whole worked example 1 across 0128/0129; caption #4.
- F62 / p0129#3: whole worked example 2 / #6, despite preceding that stem; caption #5 samerow with #4.

Author text inventories retain the frozen coarse structures, visible labels, region/point relationships, and ownership. Their small coarse-box offsets are not precision conflicts. No source crop extraction, geometry snapping, figure pixel fidelity, exact count calibration, rendering, or vectorization was tested or approved.

## Completion Boundary

- Three fidelity differences are reported, not silently repaired and not independently re-resolved from pixels.
- Whole confirmed unsolved candidates here remain 444, 445, 446 only. Whole 447 right boundary remains UNKNOWN. Unit 105's eventual right boundary is not established within these pages.
- Supplied discussion/exposition, formula/proof, and both complete worked-example stems/solutions/figures/captions remain excluded from unsolved seeds.
- The incoming resolver closes only page 125's local display; it does not close global 104 discussion.
- New image loads in Stage B: zero. Permanent carried budget remains 5/8 batch, 5/24 context; no crop/reopen/reset.
- Stage A and all six author files left untouched. Only stage-b-report.md and stage-b-ledger.md were created.
- STOP after textual report and external hashes. No source edits, finalize, assembly, vectorization, gates/tests, counter/noise exclusions, Git, DB, publisher, workflow update, or other-chat action.
