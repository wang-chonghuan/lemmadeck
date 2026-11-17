# Affected TEXT classification review

STEMROBIN-184 / SessionB / 2026-11-17.
Outcome: AFFECTED_TEXT_CLASSIFICATION_SUPPORTED_ONLY. STOP.
Owner: /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c221-boundary-affected-review

## Scope

This is the independent review of the affected boundary classification, not another source transcription or full source review. No image bytes were read, displayed or created. Parent consumption remains the inherited 24/24; no reset. No source, shared tool, other worker output or retained evidence was edited.

The supplied retention reference cf647d and sync reference 230f0a are inherited parent identifiers, not Git identities verified here. The actual local retained manifest and metadata-sync receipt were read and hash-bound. No IntentFold capability, freshness/setup, Git, backend, DB, browser, test, finalizer, counter, assembly or modernization was invoked.

## Exact Delta

Baseline: /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-125-first-boundary-failure-and221-retry/221-retry
Current: /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0221

- Current page.md SHA-256 exactly matches the authorized 4c9c26a42e4469655f1fccc3b051b856275b09a3adf6bed9734279dcdfbc1046.
- Only p0221#6 changes kind from exhead to h3, and exactly one note is appended. MD frontmatter and page.json metadata agree.
- Inverse removal of that note and inverse replacement of the one kind token reproduce the retained retry MD and JSON bytes exactly. All body text, printed row boundaries, equations, references, labels, flags, source/render/profile identity and other metadata are untouched. The necessary comma introducing the appended note is part of that note-only serialization change.
- Current audit.json is byte-identical to the retained retry audit: SHA-256 581cc10f6aca02c22fca5e8603f89c160230cfe89c07abf01ee7eb782de83330. Its existing 23/23, empty normalizations and empty exclusions were read, not recomputed or rerun.
- All three first-isolated-assembly p0221 input files are byte-identical to the retained retry files. The retention manifest's 26 files / 48204 bytes / zero exclusions match their actual retained byte hashes, including the untouched earlier failure snapshots. The historical 25/23 failure is not replaced by this review.
- The actual sync receipt is /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c221-boundary-sync/receipt.json, SHA-256 ba03ffea093ea6723528c3456a278637ab067dbd63360fe5e5ea4140b158c5e5. It records exit 0, p0221#6 exhead -> h3, unchanged body lines/audit, and zero finalizers/counts.

## Object Classification

The official local lesson contract at /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/SKILL.md defines unnumbered kind: exercises supplements as independent cards; h3 starts a card, while exhead groups exercises within the current card.

The actual TOC at /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/toc/10c/zh.json uniquely declares ana10-c9-s2-n125 / 历史知识 / printed page 214 and the separate ana10-c9-ex / kind exercises / 第九章补充题 / printed page 215.

| Affected source object | Supported ownership |
| --- | --- |
| p0221#1-5 | ana10-c9-s2-n125 history; #1 joins p0220#6. History ends at 工作的重要部分． in #5. |
| p0221#6 | Standalone ana10-c9-ex heading 第九章补充题. h3 is the supported card boundary, not an exercise group within history. |
| p0221#7 | Unchanged p, the common introduction 求方程组的解集合： belonging to the supplement, not to history. No p -> ex change is required. |
| p0221#8-9 | Unchanged distinct exercises 906 and 907 belonging to ana10-c9-ex, not history. Equations and samerow remain unchanged. |

The retained Stage B report/comparison and the retained author's p0221 inventory already observe the history ending before the separate supplement heading. They are used solely as the existing source-boundary evidence, not reopened images or a recreated source PASS. Their exact paths/hashes are in hash-recovery-receipt.json.

The retained first isolated 125 lesson has six prose objects and two exercises: its sixth prose object cites p0221#7; its exercises cite p0221#8 and #9. That is the observed ownership defect. Under the supported boundary, history's five existing prose objects remain history, while the common introduction and both exercises move into the separate supplement card. This is a classification conclusion, not a claim that a corrected assembly has run.

## Actual Execution Evidence

assertion-receipt.json preserves the actual node assertion invocation's exit 1. All thirteen semantic/delta assertions completed before an extra receipt-input hash read failed because path.join incorrectly prefixed an absolute external skill path. The recorded stack reached stdin line 120, after those assertions; no success stdout or overall exit-0 receipt is fabricated.

hash-recovery-receipt.json preserves the subsequent actual exit-0 hash-only operation using path.resolve. It did not repeat any semantic assertion or previous PASS. All 39 text read inputs were byte-identical before/after that operation, and the retained manifest's file hashes still matched. Final preservation and output hashes are recorded separately. Broader workspace contents were not scanned, so this report does not claim a global no-concurrent-change result.

## Stop

No additional repair is supported or made. Supplement remains NOT COMPLETE and is not released. Corrected isolated 125 assembly is NOT RUN here and belongs to the parent after consumption of this report. No old PASS rerun, original-image check or additional source review follows. This bounded TEXT review is finished.
