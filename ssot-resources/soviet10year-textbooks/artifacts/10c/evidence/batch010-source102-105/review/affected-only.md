# Additive Affected-Only Text Comparison

Ticket: STEMROBIN-184. Book:10c. Affected pages:0102 and0105 only.
Date:2026-11-17. Same continuing parent-delegated scoped invocation.
StageA, first StageB, and both existing image ledgers remain frozen.

## Scope And Authority

Only the five exact text inputs listed below were read in this comparison.
No0103/0104, original PNG, source101/106, layout, audit, template, author crop,
answer, choice, or other page was read. No directory listing was performed.

This is parent-delegated affected-only comparison, not an inference of new
direct-human authority from prior ledger wording. The original StageB ledger
phrase about authorization is historical wording for the parent-to-delegate
disclosure instruction. It does not escalate authority or authorize a new
workflow, source edit, image load, or finalize operation.

Only this additive file was written, within the owned review root.
No frozen review file or input text was edited.

## Exact Text/Hash Provenance

SHA-256 values were obtained from the five exact named text files. The two
before-repair snapshots match the author-page hashes recorded in the first
StageB, so the comparison bases are the same originally disclosed bytes.

| Input | Absolute path | SHA-256 |
| --- | --- | --- |
| Current0102 | /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0102/page.md | ddacb19eccef1041e696919481335e096a37374b2346b5f0e0aa589344b14154 |
| Current0105 | /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0105/page.md | da1af3ccc9a334f63c741a60369f194137eb150117ab038207337de988f14aa3 |
| Original-before-qualification0102 | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c102-105/page0102-original-before-qualification.md | db8f2a9aef64d85c921cd64d986afd1ce236d19d9f77cc542744d4a564578fdc |
| Original-before-repair0105 | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c102-105/page0105-original-before-repair.md | f3a1d0d0b991bbf76cd5d13a47f1b6e414d3f21b86c1b33126a0fdaaa090afa7 |
| Parent repair record | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c102-105/parent-repair.md | 7e66dc23fd21a4b9eb90a87cefa9a5d3bcc39837a18bbd8c383f2ffd6a205e92 |

Evidence methods: explicit-path text reads, two whole-file unified diffs,
SHA-256, and a read-only Node byte/JSON comparison of these same four page
texts. No asserts, gate, content-toolchain invocation, file writes, source
image operation, or finalize rerun was used by that comparison.
`diff` returned1 because it displayed the documented changes, not because
an acceptance gate failed.

Body means every byte AFTER the closing frontmatter delimiter `\n---\n`,
including leading/trailing blank lines, block headers, whitespace, math
markup, punctuation, and the final newline. No whitespace, math, Unicode,
line-break, or body normalization was applied.
Frontmatter was separately parsed with JSON.parse for field classification.

## Body Preservation

| Page | Before body bytes | Current body bytes | Exact affected-only result |
| --- | ---: | ---: | --- |
| 0102 | 1321 | 1321 | Entire body byte-identical. |
| 0105 | 1430 | 1429 | Entire current body equals original body with ONLY the single ASCII period after the definition label removed. |

0102 before/current body SHA-256, identical:
`f8357d614b7267cc6de7d306a33a51a418ef3f788612b7440ab893863793a051`

0105 before body SHA-256:
`a254497113d27f1aa7b921b5eaabb1578fbd4838988db73cf10dbd2608bf3e4a`

0105 current body SHA-256:
`a66da019d03a9b856a8eebd449fbbe23762be9f1f1fa1da4f6e5330c23f95a10`

### Sole Body Change:0105#1

Exact original row:

```text
定义. 如果对于给定区间上所有 $x$ 的值，
```

Exact current row:

```text
定义 如果对于给定区间上所有 $x$ 的值，
```

Only U+002E `.` was deleted. The existing separating space remains.
No colon, new punctuation, row break, math edit, or owner change was added.
This implements the first StageB F1 recommendation and agrees with the
frozen StageA definition-label observation without reopening the original.

All0102 body blocks#1-#13 remain exact.
All0105 body blocks#2-#8 remain exact, and every other byte of#1 remains
exact as well. This preserves formulas, source instruction heads, stars,
Cyrillic subparts, givens, interval signs, mixed number, footers, all three
genuine example1 `↵` wraps, and block order/ownership.
No artificial wrap was added to exercise375.
No other body content was reinterpreted or regenerated.

## Scoped Note Changes

### 0102 Frontmatter notes[0]

Exact before:

```text
忠实源草稿；只目读原始整页一次，未收口、装订或校验。第六章补充题外层承接前页，至本页末仍未闭合；371—373承接前页“验证”栏目，未重复补写栏目标题。所有本页个题均完整。
```

Exact current:

```text
忠实源草稿；只目读原始整页一次，未收口、装订或校验。传入文字称属第六章补充题、371—373承接前页“验证”栏目；这些左侧归属和指令为传入证言，本批独立审查未重新证实，未向正文补写栏目标题。补充题右界在本页末仍开放，后由0104实际第七章标题确认在391后闭合；左侧起点仍限定。所有本页个题均完整。
```

This change correctly distinguishes inherited Chapter-Six/`验证` attribution
as supplied testimony, not newly independently proved source facts.
It preserves the page-local right-open statement at0102, followed by the
later observed right closure after391 from the actual0104 chapter heading.
The supplement's LEFT starting attribution remains qualified; no earlier
heading or source101 observation is invented.
0102 notes[1] and notes[2] are exact; notes array length remains3.
Its exercise375 one-row description is unchanged.

### 0105 Frontmatter notes[3]

Exact before:

```text
本页392的а)、б)完整，两行属同一个题，无个题open/cont。97单元及其“习题/证明”外层在批次右边界仍开放，未读取0106或猜测下一题。无插图、图题或samerow。
```

Exact current:

```text
本页392的а)、б)两小问可见完整、无悬空公式，两行属同一个未解题；未观察到后继题号或标题，整个392的右边界仍未证实，不凭页码或句点宣称全题闭合，也不虚造open/cont或第三小问。97单元及其“习题/证明”外层在批次右边界仍开放，未读取0106或猜测下一题。无插图、图题或samerow。
```

This change correctly retains complete visible subparts without claiming
global whole-object closure. It records the absent observed following
number/heading, does not invent `open`/`cont` or a third subpart, and keeps
unit97 and its exercise group open at the outgoing batch boundary.
0105 notes[0], notes[1], notes[2], and notes[4] are exact; array length
remains5. All whole solved-owner descriptions/exclusions remain unchanged.

These are the ONLY changed existing frontmatter field values:
0102 notes[0] and0105 notes[3]. Both implement the scoped qualifications.

## Independently Added Top-Level Metadata

The following top-level fields were absent from each before-repair snapshot
and are present in the current page text:

| Added field | Current0102 | Current0105 | Classification |
| --- | --- | --- | --- |
| printed_lines | 15 | 20 | Added frontmatter row metadata, not a body edit or a fresh visual count. |
| figures | [] | [] | Added empty frontmatter figure inventory, not a figure/body addition. |
| provenance | {"cap":"1","normalized":true} | {"cap":"1","normalized":true} | Added normalization/provenance metadata; its truth is not independently established by this text-only comparison. |

The corresponding raw JSON additions are:

```json
{
  "printed_lines": 15,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
```

0105 has the same additions with `printed_lines`20 instead of15.
The existing `errata: []` values remain unchanged; their new trailing comma
merely separates the added metadata fields.
All other existing top-level values are exact: schema, book, page,
printed_page, source, render, profile, and errata.
No additional removed or modified field was found.

These fields are classified separately from the three scoped repair edits.
No finalize was run or rerun by this reviewer. The parent-repair record
says first finalize had not yet run at that record's creation; that historical
statement is not a statement about execution after its creation.
Neither the added `normalized:true` nor that historical timing proves
present finalize/gate status here.

The prior raw10217-versus-actual15 issue is not reassessed by this review.
Its mechanical resolution cannot be inferred merely from `printed_lines:15`.
No layout/audit/counter evidence was authorized or opened, no source pixel
was changed, and no false wrap, mask, exclusion, or expectation override was
introduced into either compared body.

## Frozen Review And Permanent Images

Frozen source-first.md, image-ledger.md, StageB.md, and
image-ledger-stageB.md were neither reopened nor written during this
affected-only comparison. Their historical findings remain historical;
this additive record documents the now-compared repairs without rewriting
the first StageB or implying a new authority grant.

New original image loads:0.
Original reruns/reopens:0.
New crops created/viewed:0.
Grids or other images:0.
Permanent reviewer image usage remains4/8 task batch and4/24 context.
The four unused targeted crop slots are not reset or spent.
Parent remains24/24; return text paths/hashes only, no image payload.

No source/author edits, finalize, gate, binder, assembly, render, test, DB,
Git, publish, app, SkillHost, skill edit, workflow, or other downstream
operation was performed.

Affected-only comparison result: the expected sole definition-period body
deletion and two scoped note qualifications are present; all other body
bytes are exact. Added top-level metadata is separately documented, not
independently endorsed as finalize evidence.

This file's final SHA-256 is returned externally to avoid self-reference.
WAIT for parent full consumption and closure; no further comparison,
image operation, source repair, or downstream work is initiated.
