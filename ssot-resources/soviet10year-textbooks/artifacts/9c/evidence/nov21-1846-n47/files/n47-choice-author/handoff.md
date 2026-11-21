# Cold n47 author handoff

Status: AUTHOR DRAFT ONLY. First structural validation passed with exit 0.
Exact output: `mechanical checks passed; semantic review still required`.
No semantic review, self-review or approval has been performed.

## Artifacts

- `seed.json`: the first official prepared seed, never edited.
- `draft.json`: the sole authored draft, written by reasoning with apply_patch.
- `draft.snapshot.json`: byte-identical retained author snapshot.
- `independent-solutions.md`: full independent solutions, frozen and hashed
  before draft/options construction began.
- `selection.md`: selects 378-381 and only THEOREM block 0.
- `response-units.md`: four coherent native single units, not fourteen slots.
- `ledger.json`: bounded read, execution and image ledger.
- `manifest.json`: complete non-self artifact inventory, byte/canonical hashes,
  counts, source trace, ordering evidence, coverage and unresolved status.
- `inspect.*`, `prepare.*`, `validate-first.*`: original command capture files;
  `.argv.nul` is the exact argument vector with a terminal NUL after each
  argument, not a shell-quoted approximation.

The manifest cannot include its own final byte hash; that hash is supplied in
the final text handoff. It inventories every other file in the owned directory.

## Coverage and capacity

378: f'(y), f'(0), f'(1), one complete triple.
379: g'(y), g'(x), g'(0), g'(1), one complete quadruple.
380: h'(t), h'(0), h'(1), one complete triple.
381: v'(x), v'(y), v'(0), v'(1), one complete conditional quadruple.

Total: 4 selected source exercises; 14 requested mathematical outputs;
4 single questions; 16 options; no figures. No mathematical output is deferred.
Choice recognition does not demonstrate unaided production of the derivations,
expression writing, simplification or evaluations. Domain restrictions are
supplied and therefore their unaided discovery is also not assessed. These
losses are explicit in every draft intent and coverage entry.

## Concrete unresolved matters

1. A separate cold semantic review remains required for task fidelity,
   redundancy, leakage, equivalence and complete mathematical truth sets.
   Structural success is not evidence of those gates.
2. The source gives arbitrary parameters without nonzero assumptions. The
   independent solution and common visible convention handle zero denominators,
   including the nowhere-defined c=d=0 case; there is no unresolved domain
   assumption. The reviewer must assess this explicit conditional adaptation.
3. No images were referenced, read, created or reviewed. No image work is
   outstanding.

## Boundary

All writes stay in the initially absent exclusive author directory. Source
files were neither directly opened by the author nor modified; official
whitelist commands read and hash their allowed inputs. No previous choices,
answer keys, judging fields, source pages/history, source168 math answers,
parent/ticket outputs, skill tests, earlier versions, package/environment,
credentials, DB, application, publishing, external services, chats/worktrees,
backend/bootstrap/freshness/Grill or supervisor/peer messages were used.

Files are finalized to 0444 and this directory tree to 0555. These permission
bits deter accidental changes; no claim of operating-system immutable flags is
made. The author stops after the textual handoff. A cold reviewer must start
with the seed, not this derivation or the author's key.
