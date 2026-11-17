# STEMROBIN-184 Affected-Only Text Access Ledger

Status: COMPLETE_AFFECTED_TEXT_COMPARISON; WAIT. Date: 2026-11-17.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
This is an additive affected123/125 check under parent-agent relay of the
original human's continuing task authority, not a new direct-human glyph
disclosure or a whole Stage A/B rerun.

## New Output Ownership

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/affected-text-review.md`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/affected-text-ledger.md`

`stat` checked only these two exact paths; neither existed before creation.
Only these new files are written with `apply_patch`. No directory discovery,
source edit or historical artifact rewrite.

## Permitted Input Digests

| ID | Absolute path | SHA-256 | Access |
| --- | --- | --- | --- |
| BEFORE123 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-129-before-supported-edits/0123.md` | `4162453e897dc5c11047309a7bfeb7a8b019602d7717be705ba00bbf713158ed` | SHA-256 plus complete pair diff |
| CURRENT123 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0123/page.md` | `719e8ea1f19259d828152752a41ca0cf14e441211181b1499b96d927f7d96c02` | SHA-256, complete pair diff, full nl text lines1-69 |
| BEFORE125 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-129-before-supported-edits/0125.md` | `a66a6e765a42bb3cd58a76506dd61650cc43281376a9e78edd51c18c8ef2e59e` | SHA-256 plus complete pair diff |
| CURRENT125 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0125/page.md` | `4c0c45dc1b69db8778bb63d585dfe4532a01c34667cd3f39fab39557d934c7be` | SHA-256, complete pair diff, full nl text lines1-65 |
| DISPOSITION_ENTRY | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-129-supported-edits/disposition.md` | `12d570521cfed5b5eedb90469665f5b443ed111aa4e0d284f4f83ac4da5f4fc3` | Entry SHA-256, full nl text lines1-55 |
| DISPOSITION_CURRENT | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-129-supported-edits/disposition.md` | `e202bfe6ccc224bfd9ba6f711a70425402843fa32dc60164a29efd081f041970` | Digest change detected before new read, full nl text lines1-65 |

Copied originals match the123/125 author snapshots already frozen and
consumed in Stage B. Entry digests were recorded before text/diff reads;
their final read-only digests must still match before output freeze.
The disposition has two observed versions at the same path; ENTRY is retained
as historical access evidence, while CURRENT is the reviewed updated snapshot.

## Immutable Prior Evidence Checks

Only SHA-256 byte-identity checks, not text re-review, were made on:

| Absolute path | Unchanged SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/source-first.md` | `515581d40dfcd139c892f865c3e748328cc05a7bb54226c0125b4f24ade5c89b` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/ledger.md` | `7b08172dfb3ffdae682cd1e527621dab249606a8fed30909eb2f591d4ed89677` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/StageB.md` | `b56af776b13f6964e768d81bff25ecab4ae8579ab26b2532c58240b2d00a5dc8` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/stageB-ledger.md` | `8686f409813c77aeb2b73b87b00ddff3153aa88e49de52c9bc49bbca28337948` |

Already consumed resolver report/ledger digests are reused from frozen
evidence and the supplied DISPOSITION text, not reread or rehashed here.
Their crop/metadata files are not accessed.

## Text Access Events

1. Recorded entry hashes of the two copied originals, two current durable
   pages and DISPOSITION. Recorded unchanged prior Stage A/B hashes.
2. Checked that both owned new output paths were absent.
3. Read both complete `diff -u` outputs. Exit code1 means the expected text
   differences were present, not a tool/verification failure.
4. Fully read current123/current125 and DISPOSITION with `nl -ba`.
   No input text output was truncated. No other current/copied page opened.
5. Compared only affected changes to the previously frozen/attributed glyph
   evidence, whole-span intent, preserved rows/ordinals and supplied
   provenance clarification. No whole original123/125 source review repeated.
6. Wrote and read back only the two new owned output artifacts, then
   rechecked input/prior digests. Only DISPOSITION changed concurrently from
   ENTRY to CURRENT; four copied/current page and four frozen-artifact
   digests were unchanged.
7. Read CURRENT's65 lines after recording its new digest. Its123/125 claims
   and provenance clarification remained consistent; additional unrelated129
   and126/128 disclosures were not investigated. No references were followed
   and no page comparison rerun. Added this version event to the two not-yet-
   frozen owned files, then performed final readback/digests/output freeze.

## Affected Scope / Result

- Physical123 has exactly one formula sign substitution, withdrawal of the
  sole false errata object and one replaced supersession note.
- Physical125 has exactly one formula punctuation substitution, one replaced
  and one added note, #5 `p -> p open`, and #6 `p open -> p cont open`.
- Remaining text bytes, all exercise text, complete supplied example,
  remaining formulas/wraps, figure/caption/footer and block ordinals unchanged
  in the complete affected pair diffs.
- Existing combined-marker convention is parent-agent supplied context.
  Exact markers/intended links checked as text only; no parser/schema/finalize
  verification or math acceptance asserted.
- Local definition period/right closures derive from already attributed
  native resolver evidence. Outbound126/heading105-on127 facts derive from
  parent-agent transported source observations, not this review's image read.
- 122 separator remains unresolved per both disposition versions and is not reviewed
  or edited. No current122/124 or physical126-129 content accessed.
- No additional affected discrepancy or recommended affected repair.

## Additive Provenance Correction

Frozen Stage B and its ledger used phrases describing a human explicitly
supplying/authorizing the evidence messages and bounded transports.
The corrected attribution is parent-agent transmission under the original
human's continuing task authority, not new direct human messages, direct
human glyph observations, or new direct human approvals for the glyph choices.

The affected review appends this correction without rewriting frozen A/B.
Its complete provenance table separately identifies task authority,
transmission/disclosure actor, independent Stage A/resolver observations,
parent-source boundary transports and parent integration.
Original UNKNOWN statements remain immutable historical availability records.

## Permanent Image / Action Budget

- Historical reviewer image batch remains permanently8/8; cumulative
  reviewer context8/24 from Stage A.
- This affected review adds zero images, image metadata reads, crops,
  screenshots, reopens or resets; no borrowed author/resolver reserve.
- Parent receives only text/path/hash evidence.
- No source edit, count repair/counter, finalize, assemble, vectorize,
  adaptation, math review, answers, choices, tests, Git, DB, publish,
  app, dependencies, schema, Charter, SkillHost, workflow or other-chat action.

## Final Freeze / Stop

Text readback and SHA-256 identity checks only; these are not source/content
tests. Four copied/current page snapshots and four prior immutable artifacts
must match their entry digests; the disposition is bound to its explicitly
observed CURRENT digest, not falsely reported as unchanged from ENTRY.
The new file digests are returned externally; no self-hash fields or edits
after hashing.

Only the two additive output files are created. WAIT after their final
text/path/hash-only handoff; do not continue review, resolve new glyphs,
alter source, finalize or start production actions.
