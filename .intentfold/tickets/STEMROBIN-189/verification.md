# STEMROBIN-189 Verification

Verified on 2026-11-21 in the ticket's recorded repair worktree.
Delivery is branch-only, `finish: review`; no merge, deployment or production resume.

## Pause and Preservation

- Automation `automation` is `PAUSED`; its saved prompt requires a new direct human resume instruction.
- `182-6`, `180-6`, `181-6`, `184-6`, `187-6` and `188-6` each completed their pause turn and confirmed owned production/review/browser tasks stopped.
- One final cursor-aware snapshot confirmed all six idle with unchanged completion cursors. A narrowly scoped process check found no remaining production processes in those actual roots.
- The existing supervisor binding records monitoring disabled and all six production chats paused. Original checkpoints, completed artifacts, dirty bytes, failure/cost records, trees, locks and backups remain retained; unrelated chats were not stopped.

## Repairs

- Lesson, image and choice skills now require one substantive handoff intake, not exhaustive scalar/package/checker-source rereading. Missing or conflicting facts alone require expansion.
- `production.py read-receipt` normalizes supported execution-field and stream wrappers without rerunning the producer. It rejects real failure/interruption, missing or conflicting facts, missing streams and declared hash/size drift. It is not content approval.
- Assembly atomically replaces changed output bytes only. Unchanged lesson/figure files retain their inode, mtime and permissions; attached evidence, answers and retained draft directories are not deleted. The current book index remains the active-set authority.
- Multi-lesson edition commands share one invocation-local authoritative page read and source reconstruction. A fresh invocation rereads source; changed errata and wrong source bindings still fail.
- Unchanged figures with valid current source-fidelity review may reuse their bound evidence without reopening/rerendering/reviewing the whole batch. Byte equality alone does not approve a figure. New or changed content still requires substantive source, mathematics, option and affected display review, including required desktop/mobile coverage.
- Source/spend boundaries and original failure history remain intact. An internal retry count is not a new approval gate for an authorized local repair.

## Passing Tests

| Check | Result |
| --- | --- |
| New `tools/test_throughput.py` | 12 passed; final full run 0.882 s |
| Existing assembly tests | 25 passed; final affected rerun 1.969 s |
| Existing edition tests | 35 passed |
| Existing production tests | 16 passed |
| Image review evidence tests | 2 passed |
| App Vitest | 18 files, 131 tests passed |
| Content database helper tests | 4 passed, no shared DB write |
| `python3 ssot-resources/audit.py` | Passed |
| `python3 ssot-resources/soviet10year-textbooks/validate.py` | Passed: 16 PDFs, 17 catalog volumes, 510 lessons, 869 figure render records |
| `npm run build` in `app/` | Passed; existing large-chunk warnings only |
| Skill Creator `quick_validate` on three changed skills | All passed |
| `git diff --check` | Passed |

The new regression suite uses real temporary source pages, assembly,
prepare/finalize commands and saved subprocess streams. It verifies no-op
preservation, affected-only output changes, directory ownership, one source
reconstruction per multi-lesson invocation, fresh-source rejection, image review
binding reuse/drift rejection and receipt normalization.

The receipt reader was also checked against retained real `187-6` receipts,
without rerunning production: the archived recovery receipt with exit status 1
was rejected, and the saved `bind-n24` receipt with exit status 0 was accepted.
Its stdout SHA-256 was
`638df460c6199882f3d3633962a3ad49a1feefb3800c015b4e1c164b7a6cf6aa`;
the empty stderr SHA-256 was
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## Retained Initial Failures

- The initial new regression fixture pointed to the wrong template directory. The fixture was corrected to the existing `work/adapt/<book>/<edition>/...` contract.
- The added finalization fixture omitted required `changes: ["math-correction"]` metadata. The validator correctly rejected it; the fixture metadata was corrected, not the validator.
- Skill validation initially encountered two Python runtimes without PyYAML. The existing Azure CLI Python runtime supplied PyYAML 6.0.3; no dependency was installed.
- The IntentFold setup freshness update initially encountered the user's existing dirty global `n-linear/SKILL.md`. Only that file was temporarily stashed, the official update completed, and the original bytes and index were restored and compared. Backup stashes were retained; no global skill changes were committed.

No throughput multiplier is claimed. The verified gains are avoided unchanged
writes, one source reconstruction per invocation and eliminated redundant
handoff/review instructions; production wall-time has not been benchmarked
because production remains paused.
