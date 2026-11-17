# Independent Trace-Only Confirmation

The old Stage 3 comparison was frozen first at manifest SHA-256
`a8b6b453641808e3b2104616f9cd7780ccf9803230470cc1bd087f343e5f61cf`.
Only then were the explicitly disclosed current-trace files and assembly
provenance examined. The parent's script was read, not executed.

The independent structured comparison found exactly:

- Seed: only `/trace/0/sha256` changes from
  `3f45753a2dc5398ed5ae9612770a535d831c3dd5d6b80b289963160bd78d6c35`
  to `5b63a28aa65fe2ce87bf8ddb4a3c9dcb3eef85b572d42812ce84172e25a4b20d`.
- Draft: only `/seed_sha256` changes from the old seed canonical hash
  to the new seed canonical hash.

Reversing the unique changed JSON scalar token in each new file recovers the
**exact complete old raw bytes**, not merely equivalent JSON.
`before-seed.json` and `before-draft.json` also equal the old originals exactly.

Final seed binding:

- Raw: `75407854ceca1d1058c0dac057f840707951dc09911e0ea8208839eb864d3c5b`
- Canonical: `ca8db4e6562985a58ec8e37905bbee7df6c305e89d6d60c0ffc74b8f0ffe29df`

Final draft binding:

- Raw: `ca93970e0d8d7517828dfd2c9584925b266f088fcebb2cebf9fe261de7427305`
- Canonical: `2e9a8b1d0d276528e6ed4918656641aff8880f07f9d43ad99d099fd8e10e8174`

The before/current book files have the expected 3f/5b hashes and the n19 entry
is exactly identical. Book inventory/audit/page/lesson extension was compared
only as provenance; no other lesson was used as mathematical input.
The three selected modern lesson/exercise/figure JSONs and both SVGs match their
original hashes. Source prose, definitions, question views, IDs, keys, rationales,
intents, coverage, losses and new-figure list are unchanged.

Therefore the frozen independent source/view solutions and the complete old
Stage 3 semantic comparison transfer to this new trace-bound snapshot. No
source solve, reseed, source edit, draft repair, new image read or validator ran.

The historical Phase 2 book mismatch and old Stage 3 hold remain immutable.
Only the current snapshot's trace freshness is prospectively confirmed.
Full comparisons, scalar byte offsets, hash records and input provenance are in
`trace-confirmation.json`, raw SHA-256
`367a2b2f147af0f3784ad4bf4491b06d8a636e52bda3fcd4cd55c81458618146`.
Its note that HTML was missing describes the state when this trace report was
frozen; the subsequent explicit-path disclosure is resolved separately in
`html-resolution.json`, without rewriting the trace record.
