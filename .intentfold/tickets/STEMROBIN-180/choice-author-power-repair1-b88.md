# B88 power choice repair1 candidate

Ticket `STEMROBIN-180`, same invocation `180-3`, `2026-11-19`.
This is the first content repair, addressing only the human-supplied blind
finding F1. FIRST review remains **REVISE**. The repaired package is a candidate
only: no semantic review, semantic approval, or reviewer outcome is claimed.

Every shell and recorded child cwd:
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.

## Finding and Smallest Repair

F1: original source 3 asks for the power unit, but the FIRST package supplied
watt labels rather than testing identification or its defining meaning.
Its mapping to the minute-formula item was not adequate assessment evidence.
The user's report is the sufficient finding; no reviewer blind artifact,
reviewer SOURCE freeze, independent reviewer true set, or review file was read.

Add exactly one native multiple item, `power-09`, for source 3. It tests the
watt's defining physical work-per-time meaning and magnitude, distinguishing
that quantity from total work and reciprocal work rate. Every option names
watt, so a watt label copied from another item does not distinguish responses.
The new item asks for physical descriptions, not selection of an algebraic
formula, and supplies no minute/hour conversion or earlier numerical answer.
Its interval illustration uses seconds only. Applying the shared power concept
is intended; no semantic leakage gate is claimed passed.

The source unit name is already supplied elsewhere. Accordingly, the new intent
and coverage explicitly do not claim independent unprompted recall of the word
watt or independent written production of its definition. They claim assessment
of its defining meaning and scale, rather than coverage by labels alone.
The unchanged original independently derived source 3 solution is reused.
No re-SOURCE, inspect, or prepare was performed.

Source 3 now maps only to `power-09`. The old `power-02` still has exactly its
original view and key, but its internal source selector is now only `["2"]`.
Two internal intent fields clarify that the supplied unit definition is used
for source 2's calculation and is not source 3 assessment.

## Candidate Paths and Counts

Repository-relative author root:
`.intentfold/tickets/STEMROBIN-180/tmp/b88-power-choice/`.

- Repaired working candidate: `draft.json`.
- Repaired blind projection: `view-only.json`.
- Unchanged seed: `seed.json`.
- Unchanged original independent source reasoning: `source-solutions.md`.
- Unchanged original AUTHOR report: `author-report.md`.
- Exact original snapshots and hashes: `FIRST/`.
- Mechanical preservation/scope guard: `repair1-guard.mjs`.
- This durable repair handoff:
  `.intentfold/tickets/STEMROBIN-180/choice-author-power-repair1-b88.md`.

FIRST: 8 questions, 33 options, 6 single, 2 multiple.
Repair1 candidate: **9 questions, 38 options, 6 single, 3 multiple**.
Source exercises remain 9; coverage rows remain 9.
Source images opened in repair `0`; new figures `0`.
The original twelve written tasks remain intact, including the three original
learner investigations. Their existing deferrals and production losses are
unchanged; no replacement measurements, real models, or specifications are made.
Gravity, averaging, horsepower, conveyor-input limitations, and every other
existing item remain unchanged.

## Exact Changed Content Paths

JSON pointer paths in the working `draft.json`:

```text
/questions/1/source_numbers
/questions/1/intent/source_solution
/questions/1/intent/unit_reason
/questions/8
/coverage/2/question_ids
/coverage/2/omitted_tasks
/coverage/2/reason
```

The sole working `view-only.json` change is append-only JSON pointer `/8`.
All original entries `/0` through `/7` are deepEqual to FIRST.

No other draft content changed. A mechanical deepEqual guard confirmed:

- All eight original views, including all 33 original options, are unchanged.
- Seven original question objects are entirely unchanged.
- For `power-02`, the original view, key, and all other intent fields are
  unchanged; only the three paths listed above are permitted changes.
- All eight coverage rows other than source 3 are entirely unchanged.
- Original question order is unchanged; `power-09` is appended only.
- Schema, seed digest, and new-figure registry are unchanged.
- Current view-only array exactly equals all current question `view` subtrees.
- Seed bytes, independent source-solutions bytes, and original AUTHOR-report
  bytes are unchanged.

Exact new own-scratch evidence paths under the author root:

```text
FIRST/draft.json
FIRST/view-only.json
FIRST/author-report.md
FIRST/source-solutions.md
FIRST/hashes.json
repair1-guard.mjs
```

The four FIRST artifacts were copied byte-for-byte before repair edits using
exclusive file creation. `FIRST/hashes.json` records their literal hashes and
canonical JSON hashes where applicable. None of these snapshots was altered
after preservation. No external reviewer SOURCE freeze was opened or modified;
the guard verifies only this author's original independent source-solutions
file and its own FIRST byte copy, not reviewer-private evidence.

The existing authorized recorder additionally created these exact new paths
under `.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/`:

```text
b88-power-choice-repair1-guard.call.json
b88-power-choice-repair1-guard.stdout
b88-power-choice-repair1-guard.stderr
b88-power-choice-repair1-validate.call.json
b88-power-choice-repair1-validate.stdout
b88-power-choice-repair1-validate.stderr
```

Existing author artifacts, recorder labels, original reports, other authors'
edits, source content, and reviewer material were not overwritten.

## Exact Hashes

SHA-256 literal means file bytes. Canonical JSON follows the offline contract:
sorted keys, ASCII escapes, compact separators, UTF-8.
Markdown and JavaScript have no contract-defined canonical JSON hash.

### Repaired Candidate

| Artifact | Bytes | Literal SHA-256 | Canonical SHA-256 |
| --- | ---: | --- | --- |
| `draft.json` | 31909 | `16cf6ddb724815c558b1321a8bc7c16fd93f8eb8c6d77a6e894aecb19e157eba` | `5e5cd29cd7c1dd7b49b4774a0b5e447b91ce7e9f4153baf97476436d5d0855eb` |
| `view-only.json` | 5474 | `535db5d504b377017c30cfe8f54de91aa405994f1b67c286ebe613cfcb1190d0` | `014a77e4409122c1f51ecd8aca77722fe85141044816d7046d128796f75c206e` |
| Unchanged `seed.json` | 5420 | `c35fe3588a66feb15a54069d2d3a09df15a2029ace843ba5a31ad40083e2f506` | `d90e341cae7a9f167991e3087b33ab5bde48493b5c575668cdd59b2a5a15e8f8` |

### Preserved FIRST

| Artifact | Bytes | Literal SHA-256 | Canonical SHA-256 |
| --- | ---: | --- | --- |
| `FIRST/draft.json` | 27131 | `9795e2c3e502c12ec4ee5f82d94e0e07d293a3f0bd22216a881efc5fae159200` | `c24f91909fb2ce8e88d66da1e07560995b83fc3fb6a560cb49809d38032fcb9e` |
| `FIRST/view-only.json` | 4673 | `030bf191b0649b468d5f2af2b8760b82d1011c1f90cdd06b71723124c93d52c3` | `f4e15151ff3752dbf2cd6a773976e081b3960d28c315a5ec298d9824ba544e81` |
| `FIRST/author-report.md` and unchanged working original | 11911 | `a3e96bcdadb9c28ffa32df4d3b9a4592cec41a0b5394c5114455333dd2257948` | not applicable |
| `FIRST/source-solutions.md` and unchanged working independent source file | 8914 | `5d5ab9a773b79d1ec8e828ad58a6fed80ae31397ede4d094f498023ee69fa167` | not applicable |
| `FIRST/hashes.json` | 1294 | `d8fb87af6c038e75ad805ba5c6917868e117b32b1ffadea13907033c9c502b72` | `1d7062ba6894337c4cb8a21c04416c96bee835e4c8853f75c9df90d53b89aa0a` |
| `repair1-guard.mjs` | 5959 | `dd01235aacdfff92a31defc14f552dc390d910e914a664ed8b0f89c417ec7dd8` | not applicable |

## Recorded Verification

Exactly one preservation/scope guard and one structural validation in repair1.
Both recorded calls exited `0` with empty stderr. They do not review semantics.
No inspect or prepare call in repair; no answer lookup, paid service, web,
model service, DB, application, dependency, Git operation, or other-chat action.

Reproducible commands, cwd as specified above:

```bash
node .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/record-command.mjs b88-power-choice-repair1-guard node .intentfold/tickets/STEMROBIN-180/tmp/b88-power-choice/repair1-guard.mjs

node .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/record-command.mjs b88-power-choice-repair1-validate python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b88-power-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b88-power-choice/draft.json
```

Scope guard: `2026-11-19T03:32:13.123Z` to `03:32:13.165Z`.
Guard stdout: 2978 bytes, SHA-256
`af7d1b5c55ab69143951c6291eb4db7c30b1b0fcebe2357146bc43d790084524`.

Structural validation: `2026-11-19T03:32:24.893Z` to `03:32:24.930Z`.
It was run once, without `--review`, and returned:

```text
mechanical checks passed; semantic review still required
```

Validation stdout: 57 bytes, SHA-256
`1c46f6519fd9f330b0c6109ab08c85474ff02f961f0fb5eb11550590e646f90b`.
Both empty stderr hashes:
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## Stop

Return the repaired draft and blind view-only candidate for a fresh review of
this changed snapshot. FIRST remains REVISE; the mechanical pass does not
resolve F1 semantically or approve the candidate. Original AUTHOR report and
independent SOURCE reasoning remain frozen and unchanged. No further content
repair, semantic gate, publication, or integration follows this handoff.
