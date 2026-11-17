# STEMROBIN-184 physical116/117: affected-text-only check

Status: COMPLETE affected-TEXT check. Authorized edits match the frozen findings.
This is not a new whole-source review, mathematical approval, pipeline acceptance, or hold release.
Date: 2026-11-17.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.

## Scope and method

Only the specified physical0116/0117 before copies, current durable page.md files, and affected disposition statements were checked against the consumed frozen sole StageB findings.

- Before copies were SHA-256 checked against the exact original author inputs recorded in StageB.
- `diff -u` compared each entire before/current text pair, establishing the exact edits and absence of additional textual differences in these two files.
- Current text and disposition were read as bounded text. No images, crops, original PNGs, reset, adjacent source, answer, choice, TOC, pipeline, math checker, Git or workflow action.
- Frozen StageB/report ledger and the historical author handoff/ledger were hash-checked only; none was edited.
- This report is the sole new output in this affected-only invocation.

## Exact input and preservation hashes

| Input | Absolute path | SHA-256 |
| --- | --- | --- |
| 0116 before | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-121-supported-edits/0116-before.md | 126ddb92401a8fc6c157e114cedbc7d2fe47f4e897893ef9b5b9e582da1955f5 |
| 0117 before | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-121-supported-edits/0117-before.md | 27ea375832fdf70f49245bc7c23da6c5fda9db0162cf5dfc4ab7ab8e433fade2 |
| 0116 current | /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0116/page.md | 86987779c2c6feb860dc5fe03d38c91ef4e2d8e7b0c59b53ee7988b0e6341016 |
| 0117 current | /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0117/page.md | 9d8bc1229a45e6b779b355e72ddb43e94e528062a0bb561d72d786a023dc1a59 |
| Additive disposition | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-121-supported-edits/disposition.md | 36c548d4fbeffe12f901b210e86e965546a198ca181a02e245ec36ff62436b06 |
| Frozen StageB findings | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/StageB.md | b34914d07dc06663307c903faccb67bd4b72fdd2699563e9d9bef46927d9dcad |
| Frozen StageB ledger | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/stageB-ledger.md | a56188750341ffb0ee37bc9b42cec22e05672598d3f9868c137ea62d0a493127 |
| Historical author handoff | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/author-handoff.md | d43da50cb9ea70308861deef3a8ba967845062d121be9bb8a0807c55cd0dcba7 |
| Historical author ledger | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/author-ledger.md | a0d761f59443cebc612111e32b534f4350655bad7721d72f9abdf4060e917e3f |

The before copies exactly match StageB's original0116/0117 author hashes. Historical author records still match their disclosed pre-repair hashes; their old current-observation labels are retained as historical statements, not assertions about the repaired bytes.

## Physical0116 exact differences

### 1. Shared exercise directive: F1 implemented

Before, original lines50-54:

```markdown
<!-- exhead -->
习题

<!-- p -->
计算由下列直线和曲线所围成的图形的面积：
```

Current lines51-53:

```markdown
<!-- exhead -->
习题
计算由下列直线和曲线所围成的图形的面积：
```

Exactly the intervening blank line and `<!-- p -->` marker were removed. Both original printed text rows remain verbatim, one physical row each, within ONE existing exhead. No second exhead or fabricated exercise was added.

All six exercise419-424 body texts, numbers, math spans, givens and row boundaries are byte-unchanged in the text diff. Under the existing contract established in frozen StageB, the complete two-row header is the inherited exercise-group text. This is a static affected-text conclusion, not evidence of running an assembler.

### 2. Unit101 heading: F2 implemented

Original line78:

```markdown
101.　牛顿-莱布尼兹公式
```

Current line77:

```markdown
101.　牛顿-莱布尼茨公式
```

Exactly 兹 -> 茨. Number101, h3 marker, spacing and the rest of the heading are unchanged.

### 3. Notes: current-qualified and additive

Original note line29's `Observed headings` surname was changed from 兹 to 茨. A JSON delimiter comma was added to that note because one additive note now follows it at current line30:

```text
Independent sole StageB confirms heading 茨, not the original author's 兹; the original author bytes and records are retained as historical inputs. The two printed exercise-header rows are now one exhead, inheriting the complete area directive for 419-424. Nested exponent 2/3 remains unresolved; no digit or mathematical correction is authorized.
```

These are the only metadata differences. The additive note distinguishes the original author state, implemented text repairs and unresolved source digit. Existing historical notes were not rewritten to imply prior certainty.

### 4. Explicitly unchanged unresolved content

Original line48/current line49 remains exactly:

```markdown
来．例如，函数$y=2^{x^3}$就是这种情况．
```

The original tentative x^3 is unchanged. Existing notes25-26 still describe 3-versus-2 uncertainty and do not claim a verified digit. `errata` remains empty. This affected check supplies no new glyph evidence or mathematical correction and does not resolve frozen StageB U1.

### 5. Affected block-reference shift

The original directive's standalone p block is removed; its actual text row is absorbed into the existing exhead. The following mapping is a manual text-header comparison, not a counter run:

| Historical author block | Current block |
| --- | --- |
| p0116#1 p cont | p0116#1 p cont, unchanged |
| p0116#2 p | p0116#2 p, unchanged including unresolved digit |
| p0116#3 exhead | p0116#3 exhead, now contains both header rows |
| p0116#4 p shared directive | no standalone block; text row now in p0116#3 |
| p0116#5 ex419 | p0116#4 ex419 |
| p0116#6 ex420 | p0116#5 ex420 |
| p0116#7 ex421 | p0116#6 ex421 |
| p0116#8 ex422 | p0116#7 ex422 |
| p0116#9 ex423 | p0116#8 ex423 |
| p0116#10 ex424 | p0116#9 ex424 |
| p0116#11 h2 | p0116#10 h2 |
| p0116#12 h3 | p0116#11 h3, corrected surname |
| p0116#13 p open | p0116#12 p open |
| p0116#14 foot | p0116#13 foot |

Historical block references in frozen StageB and immutable author records continue to refer to their recorded original hashes. They are not silently relabeled as references to current bytes. The unresolved-digit note's p0116#2 remains valid without a shift.

No other0116 before/current text differences were present.

## Physical0117 exact difference

Frozen F3 implemented at line61, current block p0117#6.

Before:

```markdown
做被积函数，而变量$x$叫做积分变量．端点为$a$和$b$的闭区
```

Current:

```markdown
做被积函数．而变量$x$叫做积分变量．端点为$a$和$b$的闭区
```

Exactly one comma `，` after 被积函数 changed to full stop `．`. No other0117 text or metadata difference was present. Its line boundary after 闭区, block identities, formulas, terms, F'=f comma, open marker, footnote and footer are unchanged.

This confirms the requested textual repair against the frozen finding; it is not a new source-image review.

## Disposition consistency and qualification

Affected disposition lines11-15 accurately state:

- Two original exercise-header rows merged into the existing exhead.
- All six419-424 bodies unchanged.
- Heading兹 -> 茨.
- Nested exponent3/2 unresolved, with no mathematical correction.
- Blocks following the removed directive p shift down by one.
- Physical117 restores only the full stop after 被积函数.

Disposition lines3-6 and23-24 qualify author/frozen records as historical evidence rather than claims about repaired bytes. The exact two before copies and the two historical author records above support that statement within this check's scope.

Disposition's claims about111,119 and other110-121 pages, other copied sets/records, external erratum bindings and other review batches were NOT rechecked or endorsed here. Reading the shared disposition is not an expansion of the affected-source review scope.

Disposition expressly retains unresolved-digit modern-delivery holds and does not claim modern lesson approval. This affected-only check likewise does not release any hold, authorize processing, verify math, or assert a completed whole lesson/next-page closure.

## Result

COMPLETE affected-TEXT check for the exact current0116/0117 hashes above.
F1/F2/F3's authorized text changes are implemented with no extra before/current text changes in those two files; additive metadata/disposition and historical preservation are appropriately qualified within scope.
U1 remains UNRESOLVED with original tentative x^3 unchanged.

No images loaded; permanent reviewer usage remains8/8 with no reset. No new whole review, mathematical approval, hold release, pipeline, tests, Git or workflow action. No input files changed by this check.

The SHA-256 of this report is returned externally rather than embedded recursively.
