# N21 Option-Order Repair

STEMROBIN-184, 2026-11-23. Affected repair only: reorder seven
`questions[*].view.options` arrays; no reauthoring or mathematical changes.
All shell cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184` (ROOT).

## Precise Permutations

Orders below list existing option IDs from first to last.

| Question | Original order | Repaired order |
| --- | --- | --- |
| n21-linear-proof | a,b,c,d | b,a,d,c |
| n21-quadratic-proof | a,b,c,d | c,d,b,a |
| n21-paired-limits-proof | a,b,c,d | a,c,d,b |
| n21-arbitrary-constant-proof | a,b,c,d | d,b,a,c |
| n21-not-one-counterproof | a,b,c,d,e | d,c,e,a,b |
| n21-definition-equivalents | a,b,c,d,e | c,e,b,d,a |
| n21-tail-cutoff-dependence | a,b,c,d,e | e,b,d,c,a |

Counts: 7 reordered arrays, 31 existing option objects, 4 single and 3 multiple
questions. Across the four single questions, the originally first option now
occupies positions 2,4,1,3.

## Preservation and Current Files

Before editing, the draft was copied byte-for-byte exactly once with
`fs.copyFileSync(..., fs.constants.COPYFILE_EXCL)`, refusing overwrite.
A bulk mechanical Node helper reused each complete option-object substring
verbatim at its new position. Separators and all bytes outside those object
ranges were retained verbatim. No JSON-wide reserialization was performed.
The helper also refused overwrite if the working draft had changed since the
snapshot was taken.

Every option ID, text and figure_ids field is unchanged. Every other field,
including stems, intents, keys, coverage, seed binding and new_figures, is
byte-for-byte unchanged. The seed, frozen solution, earlier report and unrelated
edits/staging were not touched.

ROOT-relative paths:

- Original snapshot: `ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n21-source7982/choice-author/first-draft-positional-cue.json`
- Repaired draft: `.tmp/stemrobin-184-six/n21-nov23-source7982/choices/draft.json`
- Repair note: `ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n21-source7982/choice-author/option-order-repair.md`

Byte SHA-256 values from the mechanical helper:

```text
original snapshot:
d977bf49017c6031d555249914c588b94af873ccbff78dc9427e926eed043ec2
repaired draft:
7b6df88a43cf77421d435f6448e55ea4c7df7e11cc5bc09adeab7958e39a318f
```

The earlier author report's draft hashes and validation refer to the original
snapshot, not this reordered snapshot. No solving, checker, standalone
validation, browser/image work, new figures, reviewer truth/key/message reads,
Git/index operations, DB/env/app edits, or peer messaging occurred.
The parent's full-key comparison and planned `retain_choices` validation remain
pending for the changed snapshot.
