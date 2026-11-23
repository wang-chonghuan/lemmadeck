# PhaseB comparison ledger

Ticket: SAME STEMROBIN-184 /184-6, allocation9c/10c, finish=review.
Authorization: first narrow TEXT-only comparison against the released author supplement and exact bound exercise files.
Actual cwd: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck
Only new writable evidence root: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-held-source-context-review/phaseB
ABSENT before first write, confirmed by PhaseB shell execution 1.

## Input SHA256 bindings

Released author supplement:
Path: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-held-source-context-author/after-path-recovery/author-proposal-supplement.txt
Expected = observed: 873dbb8e730cc1218d33278882a2ac7a7d92db2a1520e4f0f7afe17b22ea6682
Matched in PhaseB shell 1 and revalidated before sole supplement read in shell 2.

Finalized edition exercises:
Path: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-modern-representation-repair/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex/exercises.json
Expected = observed: 485c156b1896f531f54fa39fe15f805eb49af309c0d442f2bb7b7274c5861d8d
Matched in shell 1 and revalidated before scoped projection/assertions in shells 2 and 3.

Assembled source exercises:
Path: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-modern-representation-repair/artifacts/10c/lessons/ana10-c6-ex/exercises.json
New observed opaque TEXT hash: 05ebdbcc2f6830271040fdec2d097638d410b2aa807a14f38aa08cebf5d19c26
No predeclared hash. Bound in shell 1, revalidated before scoped projection/assertions in shells 2 and 3.

No source image was opened or hashed. Parent-reported PhaseA retention manifest 497ee858ba9af95b5b7a9d3eebc676fb564bbef0cc7e4f9e5e1f22d8636a7b0e, execution b59d8870 exit 0, 5 files/29095 bytes, was accepted as the reported prior intake/retention fact without repeat intake.

## Actual sequence

PhaseB shell 1 / lifetime shell 11:
- node opaque TEXT hashes for the three inputs; predeclared hashes matched.
- Verified exact actual cwd and new phaseB target absent.
- Exit 0; untruncated.

PhaseB shell 2 / lifetime shell 12:
- Revalidated all three bound TEXT hashes.
- Read only the released author proposal supplement.
- JSON.parse of the two exercise files; emitted only targets 338/371/372/373/374 and number,text,group,group_id,pages,source_text.
- Checked five unique target records in each file; no other exercise output.
- Exit 0; untruncated.

PhaseB shell 3 / lifetime shell 13:
- Revalidated edition/source bound hashes and repeated only the scoped JSON projection for assertions.
- Checked isolated decimal `2.3` exactly once in edition338.text, edition338.source_text and source338.text.
- Checked command labels/IDs for 371-373 (`验证等式：`, g9) and 374 boundary-only (`证明恒等式：`, g10).
- Checked source/edition number/reference consistency for the five targets and distinct IDs at the 373/374 boundary.
- No full formula equality/correctness, derivative, answer or physical-codepoint claim.
- Exit 0; untruncated.

Manual apply_patch 1 / lifetime patch 5:
- Adds only phaseB/comparison-report.md and phaseB/ledger.md in one call.
- No edit to an earlier freeze, report, ledger, author evidence/failure, or canonical file.

PhaseB shell 4 / lifetime shell 14, reserved required final seal:
- Assert exact cwd; mode 0444, fsync/close both new output files and fsync their directory.
- Return observed SHA256 of both outputs and final accounting.
- At this immutable ledger's writing, that command has not run. Its native tool output and final response establish the actual exit/result, hashes and final totals. Stop immediately without retry if nonzero.

## Decisions and authority limits

- 338: MATCH_QUALIFIED_DECIMAL_TRANSCRIPTION.
- 371-373: MATCH_PRINTED_COMMAND_AFFILIATION.
- 374: MATCH_BOUNDARY_COMPARATOR_ONLY, no correctness review.
- Basis: independently sealed PhaseA source observations and synthesis established before author proposal release; author supplement is agreement material only, not approval.
- Raster physical codepoints: UNKNOWN, not a hold preventing faithful readable semantic transcription.
- Settled only the bound 338 decimal-transcription source-context hold and 371-373 printed-command affiliation/representation hold.
- All unrelated source/math/answer/display/count/full-lesson/publish holds remain outside this review.
- First author failures and all PhaseA evidence unchanged, neither opened nor rehashed in PhaseB.
- Sole reviewer unchanged; no new chat/agent/peer or supervisor message.

## Caps, failures and preservation

At writing: 3 additional shell calls completed, 1 manual patch call writes this report/ledger; final seal reserved as additional shell 4.
After successful final seal:
- Additional shell TEXT: 4/5.
- Additional manual apply_patch: 1/2.
- Additional conservative non-image aggregate: 5/7.
- Lifetime shell TEXT: 14/15.
- Lifetime manual apply_patch: 5/6.
- Lifetime conservative non-image aggregate: 19/21.
- Additional model-image payload/views: 0.
- Lifetime model-image payload/views: 3, conservative image units: 9, permanently spent; no allowance reset.
- Parent image/header/pixel lifetime allowance: 24/24 permanently spent, unchanged.
- Additional native/image/header/decodes/crops/resize/OCR/threshold/encoding/paid calls: 0.
- PhaseB execution failures/cap breaches: 0 so far; lifetime reviewer failures/cap breaches: 0 so far.
- PhaseB tool-output truncations: 0; lifetime: 1 governance-text truncation in PhaseA.
- Source-image/review-evidence truncations: 0.
- Governance/PhaseA/image re-reads, backend/Git/DB/environment/publication/canonical writes/messages: 0.
- All other dirty-checkout edits preserved; only new phaseB comparison evidence written.

Outputs requiring final immutable seal:
/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-held-source-context-review/phaseB/comparison-report.md
/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-held-source-context-review/phaseB/ledger.md
Their output hashes are supplied by the actual final seal execution, not self-referential file content.

Comparison completed; await parent retention and actual closure. Lifecycle remains OPEN; no human approval, whole-lesson correctness approval or closure claimed.
